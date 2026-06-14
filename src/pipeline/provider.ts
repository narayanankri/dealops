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
  authorMaxTokens?: number // default 32000 — a full Deal JSON plus adaptive thinking
  critiqueMaxTokens?: number // default 8000
  baseUrl?: string
}

/** Token accounting accumulated across every call this provider makes — for cost/observability. */
export interface Usage {
  calls: number
  inputTokens: number // fresh (uncached) input, billed 1×
  outputTokens: number
  cacheReadInputTokens: number // billed ~0.1×
  cacheWriteInputTokens: number // billed ~1.25×
}

export interface AnthropicProvider extends LLMProvider {
  readonly usage: Usage
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

// Minimal Messages-API shapes — no SDK dependency (HEADLESS.md: raw fetch is the seam).
interface ApiUsage { input_tokens?: number; output_tokens?: number; cache_read_input_tokens?: number; cache_creation_input_tokens?: number }
interface ContentBlock { type: string; text?: string; cache_control?: { type: 'ephemeral'; ttl?: '5m' | '1h' }; [k: string]: unknown }
interface ApiResponse { content?: ContentBlock[]; stop_reason?: string; usage?: ApiUsage }
type Msg = { role: 'user' | 'assistant'; content: ContentBlock[] }

export function createAnthropicProvider(cfg: AnthropicConfig): AnthropicProvider {
  const url = (cfg.baseUrl ?? 'https://api.anthropic.com') + '/v1/messages'
  const usage: Usage = { calls: 0, inputTokens: 0, outputTokens: 0, cacheReadInputTokens: 0, cacheWriteInputTokens: 0 }

  // Server-side research tools — Anthropic runs these; results return inline. No client execution loop.
  const RESEARCH_TOOLS = [
    { type: 'web_search_20260209', name: 'web_search' },
    { type: 'web_fetch_20260209', name: 'web_fetch' },
  ]

  // One Messages-API call. `system` is a cache_control'd block so the frozen spec/schema (and the
  // tool list, which renders before system) are cached across turns AND across deals — the dominant
  // cost lever. The system block uses a 1h TTL (it is byte-identical on every deal in a batch); the
  // rolling transcript breakpoint stays at the 5m default. thinking/effort are the Opus 4.x defaults
  // (drop them for Haiku). See HEADLESS.md → "Caching contract" for the invariants that keep it warm.
  async function send(system: ContentBlock[], messages: Msg[], maxTokens: number, tools?: object[]): Promise<ApiResponse> {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': cfg.apiKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: cfg.model,
        max_tokens: maxTokens,
        system,
        messages,
        thinking: { type: 'adaptive' },
        output_config: { effort: 'high' },
        ...(tools ? { tools } : {}),
      }),
    })
    if (!res.ok) throw new Error(`Anthropic API ${res.status}: ${await res.text()}`)
    const data = (await res.json()) as ApiResponse
    const u = data.usage ?? {}
    usage.calls += 1
    usage.inputTokens += u.input_tokens ?? 0
    usage.outputTokens += u.output_tokens ?? 0
    usage.cacheReadInputTokens += u.cache_read_input_tokens ?? 0
    usage.cacheWriteInputTokens += u.cache_creation_input_tokens ?? 0
    return data
  }

  // 1h TTL: the system prompt (spec + schema + tool list) is identical across every deal, so it stays
  // warm for a full batch run — write once at ~2×, read at ~0.1× for an hour.
  const sys = (text: string): ContentBlock[] => [{ type: 'text', text, cache_control: { type: 'ephemeral', ttl: '1h' } }]
  const textOf = (blocks: ContentBlock[] = []): string => blocks.filter((b) => b.type === 'text').map((b) => b.text ?? '').join('')

  // Keep ONE rolling transcript breakpoint on the latest message (≤4 breakpoints total with system).
  function setTranscriptBreakpoint(messages: Msg[]): void {
    for (const m of messages) for (const b of m.content) delete b.cache_control
    const last = messages[messages.length - 1]
    if (last && last.content.length) last.content[last.content.length - 1].cache_control = { type: 'ephemeral' }
  }

  const MAX_TOOL_CONTINUATIONS = 12

  return {
    name: `anthropic:${cfg.model}`,
    usage,
    // Research-agent author: a server-tool loop (web search + fetch) that continues through
    // `pause_turn` until the model returns the final Deal JSON.
    async author(req: AuthorRequest): Promise<Deal> {
      const system = sys(
        [
          req.authoringSpec,
          '\n\n--- The Deal schema you must produce (TypeScript) ---\n',
          req.schema,
          '\n\n--- Output contract ---\n',
          'Research the company with the web_search and web_fetch tools, then return ONE JSON object matching the Deal interface exactly — no prose, no code fences. ',
          'roundHistory holds PRIOR rounds only (never the current ask). revGrowthPct and ebitdaMarginPct must be equal length. ',
          'Every "stated" dataTrust/headline field needs a real source URL; "inferred"/"estimated" needs a method. ',
          'A "proceed" recommendation requires a base-case IRR that clears the hurdle. Keep the register formal, neutral and factual.',
        ].join(''),
      )
      const parts = [`BRIEF:\n${req.brief}`, `MANDATE:\n${JSON.stringify(req.mandate)}`]
      if (req.priorDraft) parts.push(`YOUR PRIOR DRAFT (revise it):\n${JSON.stringify(req.priorDraft)}`)
      if (req.ledgerFailures?.length) parts.push(`DETERMINISTIC CHECKS TO FIX:\n${req.ledgerFailures.map((c) => `- [${c.severity}] ${c.label}: ${c.detail}`).join('\n')}`)
      if (req.critique) parts.push(`DIRECTOR PUNCH-LIST TO ADDRESS:\n${req.critique.raw}`)

      const messages: Msg[] = [{ role: 'user', content: [{ type: 'text', text: parts.join('\n\n') }] }]
      let finalText = ''
      for (let i = 0; i < MAX_TOOL_CONTINUATIONS; i++) {
        setTranscriptBreakpoint(messages)
        const data = await send(system, messages, cfg.authorMaxTokens ?? 32000, RESEARCH_TOOLS)
        const content = data.content ?? []
        messages.push({ role: 'assistant', content })
        finalText = textOf(content)
        if (data.stop_reason !== 'pause_turn') break // end_turn / max_tokens → research complete
      }
      return extractJson<Deal>(finalText)
    },
    async critique(deal: Deal, rubric: string, ledger: CoherenceCheck[]): Promise<DirectorReport> {
      const system = sys(`${rubric}\n\n--- Output contract ---\nReturn JSON: { "blocking": string[], "warnings": string[], "questions": string[], "raw": string }. "raw" is your full punch-list text.`)
      const content: ContentBlock[] = [{ type: 'text', text: `DEAL UNDER REVIEW:\n${JSON.stringify(deal)}\n\nDETERMINISTIC LEDGER ALREADY RUN:\n${ledger.map((c) => `[${c.severity}] ${c.label}: ${c.detail}`).join('\n')}` }]
      const data = await send(system, [{ role: 'user', content }], cfg.critiqueMaxTokens ?? 8000)
      const r = extractJson<Partial<DirectorReport>>(textOf(data.content))
      return { blocking: r.blocking ?? [], warnings: r.warnings ?? [], questions: r.questions ?? [], raw: r.raw ?? '' }
    },
  }
}
