// ───────────────────────────────────────────────────────────
// Deterministic diligence-workplan generator.
//
// The research tab presents a structured due-diligence plan — workstreams, a
// critical path, open questions, red flags and sources — in the spirit of an
// agent-generated research plan, but DERIVED PURELY from the deal's own record:
// the authored risk register, soft (inferred/estimated) data-trust fields,
// thesis-breakers, the deterministic coherence ledger, mandate red-line breaches
// and the real source URLs already attached to the deal. Nothing is invented —
// every item traces back to a fact on file, so the plan is rigorous, not decorative.
// ───────────────────────────────────────────────────────────
import type { Analysis, Deal, Mandate } from '@/types'

export interface ResearchTask { task: string; rationale?: string; deliverable?: string }
export interface ResearchWorkstream {
  key: string
  name: string
  objective: string
  priority: 'high' | 'medium' | 'low'
  owner: string
  addresses: string[]
  tasks: ResearchTask[]
}
export interface ResearchOpenQuestion { question: string; category: string; blocker: boolean }
export interface ResearchRedFlag { flag: string; severity: 'high' | 'medium' | 'low'; likelihood?: string; verify?: string; impact?: string; monitoring?: string }
export interface ResearchSource { title: string; url?: string }
export interface ResearchPlan {
  summary: string
  confidence: 'high' | 'medium' | 'low'
  criticalPath: string[]
  workstreams: ResearchWorkstream[]
  openQuestions: ResearchOpenQuestion[]
  redFlags: ResearchRedFlag[]
  sources: ResearchSource[]
}

type LaneKey = 'commercial' | 'financial' | 'legal' | 'management' | 'valuation'
interface Lane { key: LaneKey; name: string; owner: string; addresses: string[]; objective: string; kw: RegExp }

const LANES: Lane[] = [
  { key: 'financial', name: 'Financial & quality of earnings', owner: 'Finance / QoE advisor', addresses: ['Standalone merit', 'Data trust'], objective: 'Establish earnings quality, normalise margins and confirm the cash, provisioning and leverage picture.', kw: /cost of risk|provision|charge-?off|loss|ebitda|margin|cash|working capital|revenue recognition|earnings|accounting|audit|net debt|leverage|\bdebt\b|funding|securitis/i },
  { key: 'legal', name: 'Legal, regulatory & sanctions', owner: 'Legal counsel', addresses: ['Mandate fit'], objective: 'Confirm licensing, regulatory standing, sanctions exposure and material contracts.', kw: /regulat|licen|sanction|sama|central bank|complian|legal|litigat|\baml\b|\bkyc\b|grey.?list|ceiling|tariff/i },
  { key: 'management', name: 'Management & governance', owner: 'Deal team', addresses: ['Standalone merit'], objective: 'Assess the leadership team, key-person risk and governance / board arrangements.', kw: /management|founder|leadership|governance|board|key.?person|\bceo\b|\bcfo\b|succession/i },
  { key: 'valuation', name: 'Valuation & deal structure', owner: 'Deal team', addresses: ['Asset value', 'Returns'], objective: 'Test the entry price against intrinsic and market value, and define structure, rights and concentration.', kw: /entry price|valuation|secondary|concentrat|dilut|cap table|ownership|stake|exit|multiple|\bask\b|premium|round/i },
  { key: 'commercial', name: 'Commercial & market', owner: 'Commercial DD lead', addresses: ['Standalone merit'], objective: 'Validate demand, competitive position and the unit economics underpinning the growth case.', kw: /market|demand|competit|customer|churn|retention|cohort|\btam\b|pricing|commercial|gmv|take rate|expansion|share/i },
]

const sev = { high: 3, medium: 2, low: 1 } as const

export function researchPlan(deal: Deal, a: Analysis, _mandate: Mandate): ResearchPlan {
  const n = deal.narrative
  const risks = n.riskRegister ?? []
  const checks = a.integrity.checks
  const blocking = checks.filter((c) => c.severity === 'blocking')
  const warnings = checks.filter((c) => c.severity === 'warn')
  const softFields = deal.dataTrust.fields.filter((field) => field.basis !== 'stated')

  // ── Assign each risk to its first-matching lane (text = risk + impact). ──
  const laneFor = (text: string): LaneKey => LANES.find((l) => l.kw.test(text))?.key ?? 'commercial'
  const byLane = new Map<LaneKey, typeof risks>()
  for (const r of risks) {
    const k = laneFor(`${r.risk} ${r.impact}`)
    byLane.set(k, [...(byLane.get(k) ?? []), r])
  }

  const workstreams: ResearchWorkstream[] = []
  for (const lane of LANES) {
    const laneRisks = byLane.get(lane.key) ?? []
    const tasks: ResearchTask[] = laneRisks.map((r) => ({
      task: r.mitigation || `Diligence: ${r.risk}`,
      rationale: r.impact,
      deliverable: r.monitoring,
    }))
    // The financial lane also owns quality-of-earnings + the soft financial data fields.
    if (lane.key === 'financial') {
      if (n.qualityOfEarnings) tasks.unshift({ task: 'Quality-of-earnings review', rationale: n.qualityOfEarnings, deliverable: 'Normalised earnings bridge' })
      for (const fld of softFields.filter((sf) => lane.kw.test(`${sf.label} ${sf.method ?? ''}`))) {
        tasks.push({ task: `Confirm ${fld.label} against a primary source`, rationale: `${fld.basis === 'estimated' ? 'Estimated' : 'Inferred'}: ${fld.method ?? 'not yet sourced to a filing'}`, deliverable: 'Primary-source confirmation' })
      }
    }
    if (lane.key === 'valuation') {
      const av = a.assetValue
      if (Math.abs(av.askVsValuePct) > 8) tasks.unshift({ task: 'Reconcile the entry price to intrinsic and market value', rationale: `Ask is ${av.askVsValuePct >= 0 ? '+' : ''}${av.askVsValuePct}% versus the reconciled value (${av.reconciledUSDm}).`, deliverable: 'Defensible entry range and IC price discipline' })
    }
    if (lane.key === 'legal' && n.legalStanding) tasks.push({ task: 'Independent legal & sanctions standing review', rationale: n.legalStanding, deliverable: 'Counsel sign-off memo' })
    if (lane.key === 'management' && n.leadershipGaps) tasks.push({ task: 'Management & key-person assessment', rationale: n.leadershipGaps, deliverable: 'Org / governance findings' })

    if (!tasks.length) continue
    const maxSev = Math.max(0, ...laneRisks.map((r) => sev[r.severity]))
    const laneBlocking = blocking.some((c) => lane.kw.test(`${c.label} ${c.detail}`))
    const priority: ResearchWorkstream['priority'] = laneBlocking || maxSev >= 3 ? 'high' : maxSev >= 2 ? 'medium' : 'low'
    workstreams.push({ key: lane.key, name: lane.name, objective: lane.objective, priority, owner: lane.owner, addresses: lane.addresses, tasks })
  }
  workstreams.sort((x, y) => sev[y.priority] - sev[x.priority])

  // ── Red flags: the risk register, severity-ranked. ──
  const redFlags: ResearchRedFlag[] = [...risks]
    .sort((x, y) => sev[y.severity] - sev[x.severity])
    .map((r) => ({ flag: r.risk, severity: r.severity, likelihood: r.likelihood, verify: r.mitigation, impact: r.impact, monitoring: r.monitoring }))

  // ── Open questions: thesis-breakers + blockers from coherence / red-lines. ──
  const openQuestions: ResearchOpenQuestion[] = []
  for (const c of blocking) openQuestions.push({ question: `Resolve the blocking coherence check — ${c.label}: ${c.detail}`, category: 'financial', blocker: true })
  for (const b of a.mandateFit.redLineBreaches) openQuestions.push({ question: `Mandate red line — ${b}`, category: 'legal', blocker: true })
  for (const tb of n.thesisBreakers ?? []) openQuestions.push({ question: tb, category: laneCategory(tb), blocker: false })
  if (!(n.thesisBreakers?.length)) {
    for (const fld of softFields.slice(0, 4)) openQuestions.push({ question: `Can ${fld.label.toLowerCase()} be confirmed from a primary source?`, category: laneCategory(`${fld.label} ${fld.method ?? ''}`), blocker: false })
  }
  for (const c of warnings.slice(0, 2)) openQuestions.push({ question: `Confirm or explain — ${c.label}: ${c.detail}`, category: 'financial', blocker: false })

  // ── Critical path: the gating items, ordered by how hard they gate. ──
  const criticalPath: string[] = []
  for (const c of blocking) criticalPath.push(`${c.label}: ${c.detail}`)
  for (const b of a.mandateFit.redLineBreaches) criticalPath.push(`Clear mandate red line — ${b}`)
  for (const r of risks.filter((x) => x.severity === 'high')) criticalPath.push(r.mitigation || r.risk)
  const seen = new Set<string>()
  const critical = criticalPath.filter((x) => (seen.has(x) ? false : (seen.add(x), true))).slice(0, 6)

  // ── Sources: every real URL/citation already on the deal record. ──
  const sources: ResearchSource[] = []
  const pushSrc = (title?: string, url?: string) => { if (!title && !url) return; if (!sources.some((s) => (url && s.url === url) || (!url && s.title === title))) sources.push({ title: title ?? url ?? 'Source', url }) }
  for (const ev of deal.news) pushSrc(`${ev.headline}${ev.source ? ` — ${ev.source}` : ''}`, ev.url)
  for (const hm of deal.headlineMetrics) if (hm.url) pushSrc(`${hm.label}${hm.source ? ` — ${hm.source}` : ''}`, hm.url)
  for (const fld of deal.dataTrust.fields) if (fld.url) pushSrc(`${fld.label}${fld.source ? ` — ${fld.source}` : ''}`, fld.url)

  const confidence: ResearchPlan['confidence'] = a.dataTrustScore >= 75 ? 'high' : a.dataTrustScore >= 60 ? 'medium' : 'low'
  const summary =
    `Diligence workplan for ${deal.name} — ${workstreams.length} workstream${workstreams.length === 1 ? '' : 's'}, ` +
    `${critical.length} critical-path item${critical.length === 1 ? '' : 's'}, ${redFlags.length} red flag${redFlags.length === 1 ? '' : 's'}, ` +
    `${openQuestions.length} open question${openQuestions.length === 1 ? '' : 's'}. ` +
    (softFields.length
      ? `${softFields.length} of ${deal.dataTrust.fields.length} headline inputs are inferred or estimated and require primary-source verification.`
      : `Headline inputs are sourced to filings; verification confirms rather than establishes the figures.`)

  return { summary, confidence, criticalPath: critical, workstreams, openQuestions, redFlags, sources }
}

// Infer a question's category from its text, for the categorised open-questions list.
function laneCategory(text: string): string {
  const k = LANES.find((l) => l.kw.test(text))?.key
  return k === 'legal' ? 'legal' : k === 'financial' ? 'financial' : k === 'management' ? 'management' : k === 'valuation' ? 'commercial' : 'commercial'
}
