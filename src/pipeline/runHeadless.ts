// ───────────────────────────────────────────────────────────
// The headless runner — the one function the autonomous pipeline calls.
//
// Given a brief, a mandate, the spec/rubric/schema text, and an API key, it
// builds the live Anthropic provider, runs the SAME orchestrator (authorDeal)
// the human-in-the-loop uses, and returns the result plus token usage and an
// estimated $ cost. Persisting the accepted Deal is the caller's job (the CLI
// in scripts/author-deal.mjs writes it to src/data/generated/<id>.json).
//
// Nothing here can run without ANTHROPIC_API_KEY — but it is complete and
// type-checked, so the day a key exists it runs end-to-end with no code change.
// ───────────────────────────────────────────────────────────
import type { Mandate } from '@/types'
import { authorDeal, type PipelineResult } from './authorDeal'
import { createAnthropicProvider, type Usage } from './provider'

// $ per 1M tokens — Claude API reference (cached 2026-05-26). Cache-read ≈ 0.1×, cache-write ≈ 1.25×.
const PRICES: Record<string, { in: number; out: number; cr: number }> = {
  'claude-fable-5': { in: 10, out: 50, cr: 1.0 },
  'claude-opus-4-8': { in: 5, out: 25, cr: 0.5 },
  'claude-opus-4-7': { in: 5, out: 25, cr: 0.5 },
  'claude-opus-4-6': { in: 5, out: 25, cr: 0.5 },
  'claude-sonnet-4-6': { in: 3, out: 15, cr: 0.3 },
  'claude-haiku-4-5': { in: 1, out: 5, cr: 0.1 },
}

export function estimateCostUSD(u: Usage, model: string): number {
  const p = PRICES[model] ?? { in: 5, out: 25, cr: 0.5 }
  return (u.inputTokens * p.in + u.cacheReadInputTokens * p.cr + u.cacheWriteInputTokens * p.in * 1.25 + u.outputTokens * p.out) / 1e6
}

export interface HeadlessInput {
  brief: string
  mandate: Mandate
  authoringSpec: string // AUTHORING.md
  schema: string // src/types/index.ts
  rubric: string // CRITIQUE.md
  apiKey: string
  model?: string // default claude-opus-4-8
  maxRounds?: number
  onRound?: (n: number, m: string) => void
}

export interface HeadlessResult {
  result: PipelineResult
  usage: Usage
  costUSD: number
  model: string
}

export async function runHeadless(inp: HeadlessInput): Promise<HeadlessResult> {
  const model = inp.model ?? 'claude-opus-4-8'
  const provider = createAnthropicProvider({ apiKey: inp.apiKey, model })
  const result = await authorDeal({
    brief: inp.brief,
    mandate: inp.mandate,
    authoringSpec: inp.authoringSpec,
    schema: inp.schema,
    rubric: inp.rubric,
    provider,
    maxRounds: inp.maxRounds,
    onRound: inp.onRound,
  })
  return { result, usage: provider.usage, costUSD: estimateCostUSD(provider.usage, model), model }
}
