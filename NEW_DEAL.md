# Adding a new deal — the pipeline

The whole system exists to execute **flawlessly, rigorously, and comprehensively on a deal added tomorrow.** This is the standard path from "here's a company" to a deal that's safe to present. It is keyless: authoring happens in-conversation (the model is the research agent); the deterministic engine and validator run in-app.

The core guarantees coherence in **two layers** — one that can't be argued with, one that's adversarial:

1. **Deterministic** — `src/engine/validate.ts` (the Coherence Ledger) runs on every deal inside `analyze()`. It is code, so it runs the same way every time, on every deal, forever. **A deal with any `blocking` check cannot be sent to IC** (the button is disabled) and is logged as an error at dev startup.
2. **Adversarial** — the Director (`CRITIQUE.md`) tears the draft down on the things code can't judge: whether an argument is sharp, whether a premium is *actually* explained, whether the "so what" lands.

Neither replaces the other. The validator catches the mechanical/coherence class (the Plaid-style bugs); the Director catches the judgement class.

## The steps

1. **Research & draft** to the bar in `AUTHORING.md`. Real companies, public sources, every figure labelled `stated` (with a link) / `inferred` / `estimated` (with a method). Populate the full `Deal` schema (`src/types/index.ts`): `vitals`, `revenueLines`, `roundHistory` (PRIOR rounds only — never the current ask), `assumptions`, `peers`, `merit`, `dataTrust`, `narrative`.

2. **Engine recompute** is automatic. Never hand-write a number the engine derives (DCF, comps, reconciled value, implied multiple, IRR/MOIC, ownership, scores). Flexing an `assumption` stays live and consistent.

3. **Run the Coherence Ledger.** Open the deal → **Research tab → Coherence ledger**, or watch the dev console at startup. **Every `blocking` must be cleared.** Treat each `warn` as a question to answer: either fix it, or make sure the narrative explains it (a high multiple vs peers is fine *if argued*).

4. **Director critique** (`CRITIQUE.md`), ideally as a real subagent. He runs his own coverage + ledger pass and returns a punch-list. Revise. Repeat 1–3× until no material gaps remain.

5. **Register & mark ready.** Add the file to `src/data/deals/`, import it in `src/data/index.ts`. Only set `status: 'ready'` once the ledger is **0 blocking** and the Director is satisfied. `Send to IC` is gated on 0 blocking by construction.

## The invariants the validator enforces (so you don't have to remember them)

Round/raise/valuation distinctness · no event counted twice (ask ≠ last round) · last round is closed & prior · most-recent-first ordering · no single round > total raised · secondary treatment (no primary proceeds, not "post-money") · implied multiple vs the peer set · ask vs reconciled range · base revenue ties to financials · growth narrative matches the financials direction · **recommendation vs returns (no "proceed" off a sub-hurdle base case)** · **forecast year-1 margin vs last actual** · stated facts are sourced · estimates show a method · vitals complete · narrative spine present · a usable comp set exists · DCF well-posed (WACC > terminal g) · positive value · ownership ≤ 100% and consistent with control posture.

> These last two were added after a pipeline test: a blind clean-room re-author of an existing deal ("Tabby v2") passed every structural check but recommended *proceed* while its own base-case IRR was ~half the hurdle. The deterministic ledger missed it (only the Director caught it), so the invariant was moved into code. The standing rule in action: **when a Director catches something the ledger doesn't, add the check.**

If you find a *new* class of incoherence by hand, the fix is not to patch the one deal — **add a check to `src/engine/validate.ts`** so it's caught on every deal from then on.
