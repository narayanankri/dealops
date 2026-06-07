// ───────────────────────────────────────────────────────────
// The autonomous authoring loop.
//
// This is the pipeline that, today, I run by hand across a Claude Code
// conversation: research & draft → run the gate → Director critique → revise →
// repeat → register. Here it is as one deterministic function. The agentic steps
// (author, critique) go through an LLMProvider; the quality gate is the real
// engine. Supply conversationProvider today (it documents the manual reality) or
// createAnthropicProvider({apiKey,model}) tomorrow, and the SAME loop runs
// unattended on a key. Nothing else changes.
//
// Deals are handled as in-memory objects (not TS source), so the loop needs no
// compiler in the cycle — analyze() runs straight on the candidate. Registration
// (persisting an accepted Deal) is the only step that touches disk and is left to
// the caller/runner, so this stays pure and testable.
// ───────────────────────────────────────────────────────────
import type { Analysis, CoherenceCheck, Deal, Mandate } from '@/types'
import { analyze } from '@/engine'
import type { DirectorReport, LLMProvider } from './provider'

export interface AuthorDealOptions {
  brief: string
  mandate: Mandate
  authoringSpec: string // AUTHORING.md
  schema: string // src/types/index.ts
  rubric: string // CRITIQUE.md
  provider: LLMProvider
  maxRounds?: number // default 3
  onRound?: (n: number, note: string) => void
}

export interface PipelineResult {
  accepted: boolean // true ⇢ 0 blocking from BOTH the ledger and the Director
  deal: Deal
  analysis: Analysis
  rounds: number
  ledgerBlocking: CoherenceCheck[]
  ledgerWarnings: CoherenceCheck[]
  critique?: DirectorReport
  log: string[]
}

// Cheap runtime structural check so a malformed LLM payload fails as a blocking
// item (and gets fed back for revision) instead of throwing inside the engine.
function structuralGaps(d: Partial<Deal>): string[] {
  const g: string[] = []
  if (!d || typeof d !== 'object') return ['not an object']
  if (typeof d.ticketUSDm !== 'number') g.push('ticketUSDm')
  if (!d.ask || typeof d.ask.askValuationUSDm !== 'number') g.push('ask.askValuationUSDm')
  const a = d.assumptions
  if (!a || !Array.isArray(a.revGrowthPct) || !Array.isArray(a.ebitdaMarginPct)) g.push('assumptions.revGrowthPct/ebitdaMarginPct')
  if (!Array.isArray(d.peers)) g.push('peers[]')
  if (!d.dataTrust || !Array.isArray(d.dataTrust.fields)) g.push('dataTrust.fields[]')
  if (!d.narrative) g.push('narrative')
  return g
}

export async function authorDeal(opts: AuthorDealOptions): Promise<PipelineResult> {
  const { brief, mandate, authoringSpec, schema, rubric, provider } = opts
  const maxRounds = opts.maxRounds ?? 3
  const log: string[] = []
  const note = (n: number, m: string) => { log.push(m); opts.onRound?.(n, m) }

  let deal = await provider.author({ brief, mandate, authoringSpec, schema })
  note(0, `${provider.name} drafted ${deal?.id ?? '(no id)'}`)

  let analysis = analyze(deal, mandate)
  let critique: DirectorReport | undefined

  for (let round = 1; round <= maxRounds; round++) {
    // 1. Deterministic gate (structural + Coherence Ledger).
    const gaps = structuralGaps(deal)
    const checks = analysis.integrity.checks
    let ledgerBlocking = checks.filter((c) => c.severity === 'blocking')
    const ledgerWarnings = checks.filter((c) => c.severity === 'warn')
    if (gaps.length) ledgerBlocking = [...ledgerBlocking, { id: 'structural', label: 'Structural', severity: 'blocking', detail: `missing/invalid: ${gaps.join(', ')}` }]

    // 2. Adversarial gate (the Director) — only meaningful once it's structurally sound.
    critique = gaps.length ? undefined : await provider.critique(deal, rubric, checks)
    const dirBlocking = critique?.blocking ?? []

    const clean = ledgerBlocking.length === 0 && dirBlocking.length === 0
    note(round, `round ${round}: ${ledgerBlocking.length} ledger-blocking, ${ledgerWarnings.length} ledger-warn, ${dirBlocking.length} director-blocking`)
    if (clean) return { accepted: true, deal, analysis, rounds: round, ledgerBlocking, ledgerWarnings, critique, log }
    if (round === maxRounds) return { accepted: false, deal, analysis, rounds: round, ledgerBlocking, ledgerWarnings, critique, log }

    // 3. Revise: hand the failures back to the author.
    deal = await provider.author({ brief, mandate, authoringSpec, schema, priorDraft: deal, ledgerFailures: ledgerBlocking, critique })
    analysis = analyze(deal, mandate)
  }

  return { accepted: false, deal, analysis, rounds: maxRounds, ledgerBlocking: [], ledgerWarnings: [], critique, log }
}
