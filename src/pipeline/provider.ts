// ───────────────────────────────────────────────────────────
// The agentic seam.
//
// The pipeline has two kinds of step:
//   • DETERMINISTIC  — the engine + Coherence Ledger (engine/*, validate.ts).
//                      Pure code. Runs anywhere, today, with no key. This is the
//                      quality guarantee and it never changes.
//   • AGENTIC        — authoring a draft, and the Director's critique. These are
//                      LLM calls. TODAY they run through a human-in-the-loop Claude
//                      Code conversation (this chat). TOMORROW they run headless on
//                      an Anthropic API key, unattended.
//
// Both worlds implement this ONE interface. The orchestrator (authorDeal.ts) is
// written against `LLMProvider` and never changes when the provider is swapped —
// that is the whole point. Plugging in a key is a one-line provider swap.
// ───────────────────────────────────────────────────────────
import type { CoherenceCheck, Deal, Mandate } from '@/types'

export interface AuthorRequest {
  brief: string // company + strategic situation, in prose
  mandate: Mandate
  authoringSpec: string // the contents of AUTHORING.md
  schema: string // the Deal TypeScript interface (src/types/index.ts)
  // On a revision round, the previous draft and what was wrong with it:
  priorDraft?: Deal
  ledgerFailures?: CoherenceCheck[] // deterministic blocking/warn checks to fix
  critique?: DirectorReport // the Director's punch-list to address
}

export interface DirectorReport {
  blocking: string[] // issues that must be fixed before IC
  warnings: string[] // confirm-or-explain smells
  questions: string[] // the questions the Director would put to the analyst
  raw: string // the full punch-list text
}

export interface LLMProvider {
  readonly name: string
  /** Author (or, with priorDraft+feedback, revise) a complete Deal artifact. */
  author(req: AuthorRequest): Promise<Deal>
  /** Run the blunt Director critique (CRITIQUE.md) over a candidate deal. */
  critique(deal: Deal, rubric: string, ledger: CoherenceCheck[]): Promise<DirectorReport>
}

// ── Today's provider: the human-in-the-loop conversation. ──
// In this Claude Code session, *I* am the author and the Director — I research,
// write the Deal, run the gate, critique, and revise by hand. There is no
// programmatic call to make, so this provider exists to document that reality and
// to fail loudly if headless code tries to run the agentic steps without a real
// provider wired in.
export const conversationProvider: LLMProvider = {
  name: 'conversation (human-in-the-loop)',
  async author() {
    throw new Error(
      'conversationProvider.author: authoring currently happens in the Claude Code conversation. ' +
        'Wire createAnthropicProvider({ apiKey, model }) to run headless.',
    )
  },
  async critique() {
    throw new Error(
      'conversationProvider.critique: the Director runs in the Claude Code conversation. ' +
        'Wire createAnthropicProvider({ apiKey, model }) to run headless.',
    )
  },
}

// ── Tomorrow's provider: Anthropic API, unattended. ──
// Real shape (fetch against the Messages API — no SDK dependency). The day an
// ANTHROPIC_API_KEY exists, the headless runner constructs this and the same
// orchestrator runs end-to-end. The prompt assembly below is the integration
// surface to tune against a live key.
export interface AnthropicConfig {
  apiKey: string
  model: string
  maxTokens?: number
  baseUrl?: string
}

function extractJson<T>(text: string): T {
  // Models may wrap JSON in prose or fences; take the largest {...} block.
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  const body = fenced ? fenced[1] : text
  const start = body.indexOf('{')
  const end = body.lastIndexOf('}')
  if (start < 0 || end <= start) throw new Error('provider returned no JSON object')
  return JSON.parse(body.slice(start, end + 1)) as T
}

export function createAnthropicProvider(cfg: AnthropicConfig): LLMProvider {
  const url = (cfg.baseUrl ?? 'https://api.anthropic.com') + '/v1/messages'
  const call = async (system: string, content: string): Promise<string> => {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': cfg.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: cfg.model,
        max_tokens: cfg.maxTokens ?? 16000,
        system,
        messages: [{ role: 'user', content }],
      }),
    })
    if (!res.ok) throw new Error(`Anthropic API ${res.status}: ${await res.text()}`)
    const data = (await res.json()) as { content?: { text?: string }[] }
    return data.content?.map((c) => c.text ?? '').join('') ?? ''
  }

  return {
    name: `anthropic:${cfg.model}`,
    async author(req: AuthorRequest): Promise<Deal> {
      const system = [
        req.authoringSpec,
        '\n\n--- The Deal schema you must produce (TypeScript) ---\n',
        req.schema,
        '\n\n--- Output contract ---\n',
        'Return ONE JSON object matching the Deal interface exactly. No prose, no code fences. ',
        'roundHistory holds PRIOR rounds only (never the current ask). revGrowthPct and ebitdaMarginPct must be equal length. ',
        'Every "stated" dataTrust/headline field needs a real source URL; "inferred"/"estimated" need a method. ',
        'A "proceed" recommendation requires a base-case IRR that clears the hurdle.',
      ].join('')
      const parts = [`BRIEF:\n${req.brief}`, `MANDATE:\n${JSON.stringify(req.mandate)}`]
      if (req.priorDraft) parts.push(`YOUR PRIOR DRAFT:\n${JSON.stringify(req.priorDraft)}`)
      if (req.ledgerFailures?.length) parts.push(`DETERMINISTIC CHECKS TO FIX:\n${req.ledgerFailures.map((c) => `- [${c.severity}] ${c.label}: ${c.detail}`).join('\n')}`)
      if (req.critique) parts.push(`DIRECTOR PUNCH-LIST TO ADDRESS:\n${req.critique.raw}`)
      return extractJson<Deal>(await call(system, parts.join('\n\n')))
    },
    async critique(deal: Deal, rubric: string, ledger: CoherenceCheck[]): Promise<DirectorReport> {
      const system = `${rubric}\n\n--- Output contract ---\nReturn JSON: { "blocking": string[], "warnings": string[], "questions": string[], "raw": string }. "raw" is your full punch-list text.`
      const content = `DEAL UNDER REVIEW:\n${JSON.stringify(deal)}\n\nDETERMINISTIC LEDGER ALREADY RUN:\n${ledger.map((c) => `[${c.severity}] ${c.label}: ${c.detail}`).join('\n')}`
      const r = extractJson<Partial<DirectorReport>>(await call(system, content))
      return { blocking: r.blocking ?? [], warnings: r.warnings ?? [], questions: r.questions ?? [], raw: r.raw ?? '' }
    },
  }
}
