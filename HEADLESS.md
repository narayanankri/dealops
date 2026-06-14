# Running headless — the autonomous, key-driven pipeline

**The end state:** the whole pipeline — author, critique, revise, gate, register — runs unattended on an Anthropic API key, with no human in a Claude Code conversation. Everything below is organized around keeping that possible, and being honest about what is and isn't there yet.

## Two kinds of step

| | What | Needs a key? | Today | Tomorrow |
|---|---|---|---|---|
| **Deterministic** | engine + Coherence Ledger (`src/engine/*`, `src/engine/validate.ts`) | No | Runs in the app *and* headless via `npm run gate` | unchanged |
| **Agentic** | authoring a draft; the Director critique | Yes | A human-in-the-loop Claude Code conversation (this chat) | Anthropic API, unattended |

The quality **guarantee** is the deterministic half, and it is the part that must never depend on a human. It doesn't.

## What already runs headless, today

```
npm run gate            # run the Coherence Ledger over every deal in Node — no browser, no chat
npm run gate -- tabby   # one deal
```

`scripts/gate.mjs` loads the real engine/validator/data through Vite's SSR loader (same `@/` alias, same code as the app — zero drift) and exits **non-zero if any deal is blocking**. This is the gate CI runs and the gate the autonomous loop calls. The browser dev-console assertion (`src/data/index.ts`) is now guarded to the browser only; Node uses this script.

## The seam: one interface, swap the provider

`src/pipeline/provider.ts` defines `LLMProvider` with `author()` and `critique()`. Two implementations:

- `conversationProvider` — today. Throws with a clear message: the agentic steps currently happen in this chat.
- `createAnthropicProvider({ apiKey, model })` — tomorrow. Real `fetch` against the Messages API (no SDK dep), with the authoring/critique prompts assembled from `AUTHORING.md` / `CRITIQUE.md` and a JSON-`Deal` output contract.

`src/pipeline/authorDeal.ts` is the orchestrator — the loop I run by hand, as one function:

```
draft = provider.author(brief, mandate, spec, schema)
repeat up to maxRounds:
    ledger      = analyze(draft).integrity.checks         // deterministic, no key
    director    = provider.critique(draft, rubric, ledger)// agentic
    if 0 ledger-blocking AND 0 director-blocking: ACCEPT
    draft = provider.author(..., priorDraft, ledgerFailures, critique)  // revise
```

It is written entirely against `LLMProvider` + the real engine. Swapping `conversationProvider` → `createAnthropicProvider(...)` makes the same loop run unattended. Nothing in the loop changes.

## Built — the headless path, ready for a key

The whole path is wired and type-checked; it only lacks an `ANTHROPIC_API_KEY` (verified end-to-end with a fake key — every module loads and drives to the live API boundary, failing only at auth). Run it with `ANTHROPIC_API_KEY=… npm run author -- "<company + situation>"`.

1. **Authoring is a research tool-loop.** ✅ `provider.author()` runs the Anthropic server-tool loop — `web_search` + `web_fetch` — continuing through `pause_turn` until the model returns the final Deal JSON. (Was "the biggest remaining piece.")
2. **Prompt caching.** ✅ See "Caching contract" below — the cost lever we identified, built in.
3. **Registration = deals-as-JSON.** ✅ `npm run author` writes the accepted deal to `src/data/generated/<id>.json`; `src/data/index.ts` globs that directory (`import.meta.glob('./generated/*.json')`) so the app and `npm run gate` pick it up with **no code edit and no `tsc`**.
4. **Cost / observability.** ✅ `provider.usage` accounts fresh-in / cache-read / cache-write / out per call; the runner prints tokens + an estimated `$` (`estimateCostUSD` in `runHeadless.ts`); the orchestrator caps rounds (`maxRounds`).

## Still needs a live key to *tune* (the honest caveat)

1. **JSON-contract reliability.** `createAnthropicProvider` is structurally real but untested against real output: whether the model reliably emits clean Deal-shaped JSON after a long research loop. `structuralGaps()` in the orchestrator already rejects malformed payloads and feeds them back for revision — but the prompt may need tuning.
2. **Streaming for large outputs.** `send()` is non-streaming (32k `max_tokens`), which risks an HTTP timeout on the biggest deals; switch to streaming before production volume.
3. **CI.** Wire `npm run gate` (and `tsc -b`) into CI so a blocking deal can never merge — the same gate, enforced on every change.

## Caching contract — keep the prefix stable

Prompt caching is the dominant cost lever (~3–6× on the author loop, which re-sends its transcript every turn). It is wired as: `cache_control` on the **frozen system block** (spec + schema + tool list) with a **1h TTL** so it stays warm across a whole batch run, plus a **rolling 5m breakpoint** on the latest transcript message within a deal's loop. To keep it *effective*, do not break these invariants:

1. **Never interpolate per-request data into the system prompt** — no timestamps, IDs, the brief, or the mandate. Those belong in `messages` (after the breakpoint), never in the cached prefix.
2. **Keep `RESEARCH_TOOLS` a module constant.** Tools render *before* system; reordering or rebuilding them per-call invalidates everything downstream.
3. **One model per run.** Caches are model-scoped — switching mid-run is a cold start.
4. **Serialize deterministically.** Any JSON in the cached prefix must stringify the same bytes each call.
5. **Verify, don't assume.** After the first call, `provider.usage.cacheReadInputTokens` must be `> 0`. If it stays `0` across calls, a silent invalidator crept in — find it before scaling.

## The rule that keeps this on track

When a Director catches a class of problem the deterministic ledger doesn't, **add the check to `validate.ts`** — don't rely on the agentic layer to catch it forever. Every such migration shrinks what the autonomous loop depends on the LLM to get right, and grows what the code guarantees. (The `rec-returns` check was added exactly this way.)
