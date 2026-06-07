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

## Honest gap list — what's still needed before it's truly autonomous

1. **Authoring needs tools, not a single completion.** Real authoring requires *web research*. Today the author (me) has web search/fetch; a headless author must run the Anthropic **tool-use loop** (web search + fetch) inside `provider.author()`. The current `author()` is a single Messages call — it is the right *seam* but not yet a research agent. **This is the biggest remaining piece.**
2. **A live key + prompt/JSON hardening.** `createAnthropicProvider` is structurally real but untested against a key: the JSON-`Deal` contract, retries, and `model` choice need tuning on real output. `structuralGaps()` in the orchestrator already rejects malformed payloads and feeds them back for revision.
3. **Registration = persistence, ideally deals-as-data.** Accepted deals are still added as TS modules imported in `src/data/index.ts` — a code edit that needs `tsc`. For a hands-off loop, move to **deals-as-JSON loaded dynamically** (glob a directory), so authoring writes a file and the gate validates it with no compile step. The engine already consumes a plain `Deal` object regardless of source, so this is a loader change, not an engine change.
4. **CI.** Wire `npm run gate` (and `tsc -b`) into CI so a blocking deal can never merge — the same gate, enforced on every change.
5. **Cost/observability.** The loop should cap rounds (it does: `maxRounds`), log token spend, and persist the transcript per deal for audit.

## The rule that keeps this on track

When a Director catches a class of problem the deterministic ledger doesn't, **add the check to `validate.ts`** — don't rely on the agentic layer to catch it forever. Every such migration shrinks what the autonomous loop depends on the LLM to get right, and grows what the code guarantees. (The `rec-returns` check was added exactly this way.)
