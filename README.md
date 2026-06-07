<div align="center">

# AI Deal Operations

**A deal-screening workspace for GCC/MENA private capital — where every number is computed, sourced, and checked for coherence before it reaches an investment committee.**

[**▶ Live demo**](https://dealops-one.vercel.app) · [Authoring spec](AUTHORING.md) · [Critique rubric](CRITIQUE.md) · [New-deal pipeline](NEW_DEAL.md)

![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-38BDF8?logo=tailwindcss&logoColor=white)
![Coherence gate](https://img.shields.io/badge/coherence_gate-0_blocking-35C98A)

</div>

---

## What this is

A growth-equity fund sees more deals than it can underwrite. **AI Deal Operations** turns a raw opportunity — a private round, a tender, an IPO filing — into a committee-ready screen across eight analytical surfaces: **Overview · Mandate Fit · Standalone Merit · Comparables · Valuation & Scenarios · IC Memo · Research · History**.

It is built on two ideas that most "AI for finance" demos skip:

1. **The numbers are computed, not narrated.** A deterministic engine takes structured deal data and a fund mandate and produces the valuation, the returns, the scores, and a three-statement model — live, in the browser, recomputing as you edit assumptions.
2. **Nothing ships incoherent.** A *Coherence Ledger* runs ~20 invariants over every deal on every load — does the balance sheet balance, does the recommendation match the math, is every "stated" fact sourced — and **blocks** the ones that would embarrass an analyst in front of a partner.

The result is a screen you can argue with, not just read.

---

## The core idea: build the engine, not the screens

The hard rule of this codebase: **we are not authoring individual deal pages — we are building the repeatable flow that produces them.** A change is never made to one deal by hand. It is made to the *system*, and then propagated to all deals:

```
schema (types)  →  spec (AUTHORING.md)  →  coherence check (validate.ts)  →  render  →  author across ALL deals  →  gate
```

That discipline is why a new field like "entry barriers" or "Shariah screen" arrives as a typed schema, a written standard, an automated check, a rendered component, *and* populated content across the entire book in one pass — instead of a one-off card on one deal.

---

## Two pillars

### 1 · The deterministic engine (`src/engine`)

Pure functions, no I/O, no model calls — the analysis is reproducible and runs client-side.

- **`analyze(deal, mandate)`** — the top-level pass: mandate fit (hard eligibility gates + graded fit + concentration + red-lines), standalone merit, a reconciled asset value (DCF **and** comps), archetype-specific returns vs the fund hurdle, and the data-trust score.
- **`projectModel(deal)`** — a full **three-statement model** for deals that arrive with financials: actual years from filings, five forecast years built from drivers, **balance sheet balanced by construction**, an unlevered-FCF **DCF build-up**, and WACC×g and entry×exit **sensitivity grids**.
- **`coherenceChecks(deal, av, returns)`** — the **Coherence Ledger** (next section).

### 2 · The agentic authoring pipeline

Deals are not hand-written prose — they are authored to a standard by an agent loop:

```
AUTHORING.md (the analyst's standard)
        │  draft
        ▼
   structured Deal  ──►  Coherence Ledger gate  ──►  CRITIQUE.md (the IC-chair's teardown)
        ▲                                                      │
        └──────────────────────  revise  ◄─────────────────────┘
```

[`AUTHORING.md`](AUTHORING.md) is the system prompt for the analyst — sourcing rules, the *stated / inferred / estimated* basis system, sector-aware business vitals, IC-memo depth, and a formal-register standard. [`CRITIQUE.md`](CRITIQUE.md) is the adversarial IC-chair that tears the draft apart against the same ledger. New deals follow [`NEW_DEAL.md`](NEW_DEAL.md).

---

## The Coherence Ledger

The single most common failure of a deal memo is being *fine field-by-field but incoherent across fields*. The ledger does the arithmetic so a human doesn't have to — ~20 invariants, each **blocking** (unpresentable until fixed) or **warn** (a question to resolve):

| Check | What it enforces |
|---|---|
| `model-bs` *(blocking)* | The projected balance sheet **balances** — assets = equity + liabilities |
| `rec-returns` *(blocking)* | The verdict matches the math — no "proceed" off a sub-hurdle base case |
| `total-raised` / `secondary-ask` | Raise ≠ valuation ≠ cumulative-raised; a secondary books no primary money |
| `multiple-peers` / `ask-range` | The implied multiple is sane versus the comp set |
| `uof-sum` | Use-of-funds allocation sums to ~100% |
| `cite-stated` / `cite-method` | Every *stated* fact carries a source; every *estimate* shows its method |
| `register` | Prose stays formal, neutral, factual — no rhetorical or casual tells |
| `barriers` / `vitals` | Entry barriers and business vitals are present and fact-anchored |

```bash
npm run gate        # headless — loads every deal through the engine, exits non-zero on any blocking failure
```

---

## The deal book

Fifteen real companies, each labelled by data basis (`stated` / `inferred` / `estimated`) with working citations. Two intake paths are exercised end-to-end:

**Private placements** (graceful degradation — model where data exists, honest "not disclosed" where it doesn't):
Tabby · Tamara · Tarabut · Lean Technologies · Property Finder · Khazna · MNT-Halan · Floward · Nana

**Listed / with-financials** (full three-statement model from public filings):
Talabat · Lulu Retail · Americana · **SpaceX** *(authored straight from the SPCX Form S-1)*

**Out-of-mandate, surfaced honestly** (US deals a GCC/MENA fund would flag, not hide):
Ramp · Plaid

Each deal underwrites *differently* across the two fund mandates (a growth vehicle vs. a control-buyout vehicle), because mandate fit is computed, not assumed.

---

## Design — "The Instrument"

A dark, calibrated, data-dense surface. Space Grotesk for display, IBM Plex Mono for tabular numerals, Inter for body; a single electric-cyan accent reserved for the interactive and the gauge; colour used only for meaning (verdict and risk), never decoration. A tick-dial confidence gauge and a faint hairline measurement grid carry the motif. The IC Memo prints to a clean, light, paginated PDF via a print stylesheet that re-maps the design tokens.

---

## Quickstart

```bash
git clone https://github.com/narayanankri/dealops.git
cd dealops
npm install
npm run dev        # http://localhost:5173
```

| Script | Does |
|---|---|
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Type-check (`tsc -b`) + production build |
| `npm run gate` | Run the Coherence Ledger over every deal (CI-friendly) |
| `npm run lint` | ESLint |
| `npm run preview` | Serve the production build |

---

## Project structure

```
src/
├── engine/
│   ├── index.ts        analyze() · assetValue() · returns · mandate fit · scores
│   ├── model.ts        projectModel() — 3-statement model, DCF build-up, sensitivities
│   └── validate.ts     coherenceChecks() — the Coherence Ledger
├── data/
│   ├── deals/          one file per deal (the structured Deal objects)
│   ├── funds.ts        the two fund mandates
│   └── mandate.ts      the default growth-equity mandate
├── components/deal/    the eight analytical tabs + visual primitives
├── pages/              Pipeline · Deal · IC Queue · Mandate · Add Deal
└── types/index.ts      the Deal / FinancialModel / Mandate schema — the contract

AUTHORING.md       the analyst's standard (agent system prompt)
CRITIQUE.md        the IC-chair's adversarial rubric
NEW_DEAL.md        how a new deal moves through the pipeline
scripts/gate.mjs   headless coherence gate
```

---

## Tech

Vite 8 · React · TypeScript (strict) · Tailwind v4 · React Router · Recharts. Deployed on Vercel.

---

## Disclaimer

This is an **illustrative product demo**, not investment advice. Company data is drawn from public sources and explicitly labelled by basis (*stated / inferred / estimated*); private-company financials are inferred or estimated where not disclosed, with the method shown. Nothing here is a recommendation to buy, sell, or hold any security — the verdicts are designed to **inform**, not to advise.
