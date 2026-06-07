// ───────────────────────────────────────────────────────────
// Deterministic engine — the single source of every number.
// Pure functions; no React, no I/O. Run by the app (live) and by
// the deal-authoring step (build time) so figures never diverge.
// ───────────────────────────────────────────────────────────
import type {
  Analysis,
  AssetValue,
  Deal,
  Integrity,
  Mandate,
  MandateFit,
  Returns,
  ReturnScenario,
  Verdict,
} from '@/types'
import { coherenceChecks } from './validate'

const clamp = (x: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, x))
const usdmShort = (v: number) => (v >= 1000 ? `$${(v / 1000).toFixed(v >= 10000 ? 0 : 1)}bn` : `$${Math.round(v)}m`)
const mean = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0)
const round = (x: number, d = 0) => {
  const f = Math.pow(10, d)
  return Math.round(x * f) / f
}
function percentile(sorted: number[], p: number): number {
  if (!sorted.length) return 0
  const idx = (sorted.length - 1) * p
  const lo = Math.floor(idx)
  const hi = Math.ceil(idx)
  if (lo === hi) return sorted[lo]
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo)
}

// ── Asset value: strategy-agnostic (DCF + comps reconciled) — PRD §7.5 V-1 ──
export function dcfEquity(d: Deal): number {
  const a = d.assumptions
  const n = a.revGrowthPct.length
  let rev = a.baseRevenueUSDm
  let pvFcf = 0
  let lastFcf = 0
  const tax = a.taxRatePct / 100
  const w = a.waccPct / 100
  for (let t = 0; t < n; t++) {
    rev = rev * (1 + a.revGrowthPct[t] / 100)
    const ebitda = rev * (a.ebitdaMarginPct[t] / 100)
    const fcf = ebitda * (1 - tax) // simplified unlevered FCF
    pvFcf += fcf / Math.pow(1 + w, t + 1)
    lastFcf = fcf
  }
  const g = a.terminalGrowthPct / 100
  const tv = w > g ? (lastFcf * (1 + g)) / (w - g) : 0
  const pvTv = tv / Math.pow(1 + w, n)
  const ev = pvFcf + pvTv
  return round(ev - a.netDebtUSDm)
}

// The comps bridge, exposed so the UI can show every step and recompute live from
// any peer subset: EV/Revenue percentile (P25 / median / P75) × base revenue = EV,
// then − net debt = equity. `percentile` and `round` are exported for the same reason.
export { percentile, round }
export type CompsBuild = {
  p25: number
  median: number
  p75: number
  rev: number
  netDebt: number
  low: number
  mid: number
  high: number
}
export function compsEquityFrom(mults: number[], rev: number, netDebt: number): CompsBuild {
  const sorted = [...mults].filter((x) => typeof x === 'number' && !Number.isNaN(x)).sort((a, b) => a - b)
  const p25 = percentile(sorted, 0.25)
  const med = percentile(sorted, 0.5)
  const p75 = percentile(sorted, 0.75)
  const ev = (m: number) => m * rev
  return {
    p25: round(p25, 2),
    median: round(med, 2),
    p75: round(p75, 2),
    rev,
    netDebt,
    low: round(ev(p25) - netDebt),
    mid: round(ev(med) - netDebt),
    high: round(ev(p75) - netDebt),
  }
}

export function compsEquity(d: Deal): { low: number; mid: number; high: number } {
  const mults = d.peers.map((p) => p.evRevenue).filter((x): x is number => typeof x === 'number')
  const b = compsEquityFrom(mults, d.assumptions.baseRevenueUSDm, d.assumptions.netDebtUSDm)
  return { low: b.low, mid: b.mid, high: b.high }
}

export function assetValue(d: Deal): AssetValue {
  const dcf = dcfEquity(d)
  const comps = compsEquity(d)
  const reconciled = round(0.5 * dcf + 0.5 * comps.mid)
  const low = round(Math.min(comps.low, dcf * 0.85))
  const high = round(Math.max(comps.high, dcf * 1.15))
  const impliedEVRevenue = round((reconciled + d.assumptions.netDebtUSDm) / d.assumptions.baseRevenueUSDm, 2)
  const askVsValuePct = round((d.ask.askValuationUSDm / reconciled - 1) * 100)
  return {
    dcfEquityUSDm: dcf,
    compsEquity: comps,
    reconciledUSDm: reconciled,
    range: { low, base: reconciled, high },
    impliedEVRevenue,
    askVsValuePct,
  }
}

// ── Return engine: firm-specific, switches on archetype — PRD §7.5 V-2 ──
function growthEquityReturn(d: Deal, m: Mandate): Returns {
  const a = d.assumptions
  const ownership = d.ticketUSDm / d.ask.askValuationUSDm
  const gAvg = mean(a.revGrowthPct) / 100
  const mk = (name: ReturnScenario['name'], gMul: number, exMul: number): ReturnScenario => {
    const exitRev = a.baseRevenueUSDm * Math.pow(1 + gAvg * gMul, a.holdYears)
    const exitEV = exitRev * (a.exitEVRevenue * exMul)
    const exitEquity = exitEV - a.netDebtUSDm
    const stake = ownership * exitEquity
    const moic = stake / d.ticketUSDm
    const irr = (Math.pow(Math.max(moic, 0.0001), 1 / a.holdYears) - 1) * 100
    return {
      name,
      irrPct: round(irr, 1),
      moic: round(moic, 2),
      exitEquityUSDm: round(exitEquity),
      clearsHurdle: irr >= m.returnHurdlePct,
    }
  }
  return {
    archetype: 'growth-equity',
    hurdlePct: m.returnHurdlePct,
    basis: `Unlevered ${round(ownership * 100, 1)}% minority stake; ${a.holdYears}y hold to exit at ${a.exitEVRevenue}x EV/Revenue`,
    scenarios: [mk('bear', 0.55, 0.8), mk('base', 1, 1), mk('bull', 1.35, 1.2)],
  }
}

function buyoutReturn(d: Deal, m: Mandate): Returns {
  const a = d.assumptions
  const av = assetValue(d)
  const entryEV = av.reconciledUSDm + a.netDebtUSDm
  const entryEbitda = a.baseRevenueUSDm * (a.ebitdaMarginPct[0] / 100)
  const debt0 = (a.entryLeverageX ?? 3) * entryEbitda
  const entryEquity = Math.max(entryEV - debt0, 1)
  const gAvg = mean(a.revGrowthPct) / 100
  const mk = (name: ReturnScenario['name'], gMul: number, exMul: number): ReturnScenario => {
    const exitRev = a.baseRevenueUSDm * Math.pow(1 + gAvg * gMul, a.holdYears)
    const exitEV = exitRev * (a.exitEVRevenue * exMul)
    const debtPaid = debt0 * 0.4 // simplified cumulative paydown over hold
    const exitEquity = exitEV - (debt0 - debtPaid)
    const moic = exitEquity / entryEquity
    const irr = (Math.pow(Math.max(moic, 0.0001), 1 / a.holdYears) - 1) * 100
    return {
      name,
      irrPct: round(irr, 1),
      moic: round(moic, 2),
      exitEquityUSDm: round(exitEquity),
      clearsHurdle: irr >= m.returnHurdlePct,
    }
  }
  return {
    archetype: 'buyout',
    hurdlePct: m.returnHurdlePct,
    basis: `Control buyout, ${a.entryLeverageX ?? 3}x entry leverage; ${a.holdYears}y hold`,
    scenarios: [mk('bear', 0.55, 0.8), mk('base', 1, 1), mk('bull', 1.35, 1.2)],
  }
}

export function returns(d: Deal, m: Mandate): Returns {
  switch (m.strategyArchetype) {
    case 'buyout':
      return buyoutReturn(d, m)
    case 'growth-equity':
      return growthEquityReturn(d, m)
    default:
      // venture / credit not yet modeled — flagged by integrity()
      return { ...growthEquityReturn(d, m), basis: `${m.strategyArchetype} return engine not yet modeled — shown on growth-equity basis` }
  }
}

// ── Mandate fit gate — PRD §7.2 ──
function matchSector(deal: Deal, m: Mandate) {
  const hit = m.targetSectors.find((s) => deal.sector.toLowerCase().includes(s.name.toLowerCase()) || s.name.toLowerCase().includes(deal.sector.toLowerCase()))
  if (hit?.priority) return { score: 100, status: 'pass' as const, takeaway: `Priority sector (${hit.name})` }
  if (hit) return { score: 85, status: 'pass' as const, takeaway: `In-mandate sector (${hit.name})` }
  return { score: 30, status: 'soft' as const, takeaway: `${deal.sector} is outside target sectors` }
}

export function mandateFit(d: Deal, m: Mandate, ret: Returns): MandateFit {
  const breaches: string[] = []
  const dims: MandateFit['dimensions'] = []

  const sec = matchSector(d, m)
  dims.push({ key: 'sector', label: 'Sector', ...sec })

  // geography
  const flagged = m.flaggedGeographies.some((g) => d.geography.toLowerCase().includes(g.toLowerCase()) || d.region.toLowerCase() === g.toLowerCase())
  if (m.excludedGeographies.some((g) => d.geography.toLowerCase().includes(g.toLowerCase()))) {
    breaches.push(`Geography ${d.geography} is on the excluded list (red line)`)
    dims.push({ key: 'geo', label: 'Geography', score: 0, status: 'breach', takeaway: `${d.geography} excluded` })
  } else if (m.coreGeographies.some((g) => d.geography.toLowerCase() === g.toLowerCase())) {
    dims.push({ key: 'geo', label: 'Geography', score: 100, status: 'pass', takeaway: `Core geography (${d.geography})` })
  } else if (flagged) {
    dims.push({ key: 'geo', label: 'Geography', score: 60, status: 'soft', takeaway: `${d.geography} — wider ${d.region}, flag for extra screening` })
  } else {
    dims.push({ key: 'geo', label: 'Geography', score: 40, status: 'soft', takeaway: `${d.geography} is outside the fund’s target geographies — confirm mandate scope` })
  }

  // ticket
  const [tmin, tmax] = m.ticketBandUSDm
  if (d.ticketUSDm >= tmin && d.ticketUSDm <= tmax) {
    dims.push({ key: 'ticket', label: 'Ticket', score: 100, status: 'pass', takeaway: `$${d.ticketUSDm}m within $${tmin}–${tmax}m band` })
  } else {
    dims.push({ key: 'ticket', label: 'Ticket', score: 45, status: 'soft', takeaway: `$${d.ticketUSDm}m outside $${tmin}–${tmax}m band` })
  }

  // stage
  if (m.stages.some((s) => d.stage.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(d.stage.toLowerCase()))) {
    dims.push({ key: 'stage', label: 'Stage', score: 100, status: 'pass', takeaway: `${d.stage} in permitted set` })
  } else {
    breaches.push(`Stage ${d.stage} is outside the permitted set (red line)`)
    dims.push({ key: 'stage', label: 'Stage', score: 0, status: 'breach', takeaway: `${d.stage} outside permitted stages` })
  }

  // instrument
  if (m.instruments.some((i) => d.instrument.toLowerCase().includes(i.toLowerCase()))) {
    dims.push({ key: 'instrument', label: 'Instrument', score: 100, status: 'pass', takeaway: `${d.instrument} permitted` })
  } else {
    breaches.push(`Instrument ${d.instrument} outside permitted set (red line)`)
    dims.push({ key: 'instrument', label: 'Instrument', score: 0, status: 'breach', takeaway: `${d.instrument} not permitted` })
  }

  // gambling red line
  if (/gambl|casino|betting/i.test(d.sector + ' ' + d.oneLiner)) {
    breaches.push('Gambling exposure (red line)')
  }

  // return profile (couples to the return engine)
  const base = ret.scenarios.find((s) => s.name === 'base')!
  if (base.clearsHurdle) {
    dims.push({ key: 'return', label: 'Return profile', score: 90, status: 'pass', takeaway: `Base IRR ${base.irrPct}% clears ${m.returnHurdlePct}% hurdle` })
  } else if (base.irrPct >= m.returnHurdlePct - 6) {
    dims.push({ key: 'return', label: 'Return profile', score: 60, status: 'soft', takeaway: `Base IRR ${base.irrPct}% near ${m.returnHurdlePct}% hurdle` })
  } else {
    dims.push({ key: 'return', label: 'Return profile', score: 35, status: 'soft', takeaway: `Base IRR ${base.irrPct}% below ${m.returnHurdlePct}% hurdle` })
  }

  // concentration (live vs fund size) — §7.2 MF-3
  const pctOfFund = (d.ticketUSDm / m.fundSizeUSDm) * 100
  const capUSDm = (m.concentrationCapPct / 100) * m.fundSizeUSDm
  const fits = pctOfFund <= m.concentrationCapPct + 1e-6
  const conc = {
    ticketUSDm: d.ticketUSDm,
    capUSDm: round(capUSDm),
    pctOfFund: round(pctOfFund, 1),
    capPct: m.concentrationCapPct,
    fits,
    takeaway: fits
      ? pctOfFund >= m.concentrationCapPct - 1
        ? `At the ${m.concentrationCapPct}% ceiling for a $${m.fundSizeUSDm}m fund — binding`
        : `${round(pctOfFund, 1)}% of fund, within ${m.concentrationCapPct}% cap`
      : `${round(pctOfFund, 1)}% exceeds ${m.concentrationCapPct}% cap — needs a larger fund or smaller ticket`,
  }
  dims.push({
    key: 'concentration',
    label: 'Concentration',
    score: fits ? (pctOfFund >= m.concentrationCapPct - 1 ? 70 : 100) : 30,
    status: fits ? (pctOfFund >= m.concentrationCapPct - 1 ? 'soft' : 'pass') : 'soft',
    takeaway: conc.takeaway,
  })

  const score = breaches.length ? 0 : round(mean(dims.map((x) => x.score)))
  const narrative = mandateNarrative(d, m, dims, conc, breaches, ret, score)
  return { score, narrative, dimensions: dims, redLineBreaches: breaches, concentration: conc }
}

// Synthesized, deterministic assessment of how the deal sits against the fund's mandate.
// Leads with the verdict + eligibility, names the binding graded constraints (returns, sizing),
// and closes with the "so what" — so the tab reads as judgement, not a list of scores.
function mandateNarrative(
  d: Deal,
  m: Mandate,
  dims: MandateFit['dimensions'],
  conc: MandateFit['concentration'],
  breaches: string[],
  ret: Returns,
  score: number,
): string {
  const base = ret.scenarios.find((s) => s.name === 'base')!
  const clearing = ret.scenarios.filter((s) => s.clearsHurdle).map((s) => s.name)
  if (breaches.length) {
    return `${d.name} is ineligible for ${m.fundName} — ${breaches.join('; ')}. That is a hard stop: standalone merit doesn't change it, and the rest of the screen is context, not a path to a yes.`
  }
  const dim = (k: string) => dims.find((x) => x.key === k)!
  const sectorDim = dim('sector')
  const geoDim = dim('geo')
  const priority = /priority/i.test(sectorDim.takeaway)
  const concClear = conc.fits && conc.pctOfFund < conc.capPct - 1
  const clean = score >= 78 && concClear && base.clearsHurdle
  const verdict = clean ? 'a clean strategic fit' : score >= 62 ? 'a qualified fit' : 'a marginal fit'
  const geoPhrase =
    geoDim.status === 'pass' ? `core ${d.geography}` : geoDim.status === 'soft' ? `${d.geography} (a flagged geography — extra screening)` : `${d.geography} (outside the target geographies)`
  const s1 = `${d.name} is ${verdict} for ${m.fundName}: a ${priority ? 'priority ' : ''}${d.sector} business in ${geoPhrase}, at a ${d.stage} / ${d.instrument.toLowerCase()} entry the mandate permits, with no red-lines.`

  const retPhrase = base.clearsHurdle
    ? `returns clear the ${m.returnHurdlePct}% hurdle in the base case (${base.irrPct}%)`
    : clearing.length
      ? `only the ${clearing.join('/')} case clears the ${m.returnHurdlePct}% hurdle (base ${base.irrPct}%)`
      : `no scenario clears the ${m.returnHurdlePct}% hurdle (base ${base.irrPct}%)`
  const concPhrase = !conc.fits
    ? `the ${usdmShort(conc.ticketUSDm)} ticket breaks the ${conc.capPct}% concentration cap at ${conc.pctOfFund}% of the fund`
    : conc.pctOfFund >= conc.capPct - 1
      ? `the ${usdmShort(conc.ticketUSDm)} ticket sits right at the ${conc.capPct}% concentration ceiling (${conc.pctOfFund}% of the fund), consuming the full single-name budget`
      : `sizing is comfortable at ${conc.pctOfFund}% of the fund against a ${conc.capPct}% cap`
  const s2 = `Where it ${clean ? 'holds up' : 'narrows'} is the graded dimensions: ${retPhrase}, and ${concPhrase}.`

  const softGates = ['sector', 'geo', 'stage', 'instrument'].map(dim).filter((x) => x.status === 'soft')
  const s3 = softGates.length
    ? `Before relying on the fit, confirm ${softGates.map((x) => x.label.toLowerCase()).join(' and ')}: ${softGates.map((x) => x.takeaway).join('; ')}.`
    : clean
      ? `Eligibility, returns and sizing all line up — this fits the book cleanly.`
      : `Eligibility is settled; the open questions live in returns and sizing, not the fund's rules.`
  return [s1, s2, s3].join(' ')
}

// ── Merit (authored dims aggregated) — PRD §7.3 ──
export function meritScore(d: Deal): { score: number; label: string } {
  const score = round(mean(d.merit.map((x) => x.score)))
  const label = score >= 80 ? 'Strong' : score >= 65 ? 'Solid' : score >= 50 ? 'Moderate' : 'Weak'
  return { score, label }
}

// ── Data-trust score — PRD §1.3 / §11.5 ──
export function dataTrustScore(d: Deal): number {
  const bW = { stated: 1, inferred: 0.6, estimated: 0.35 } as const
  const cW = { high: 1, medium: 0.75, low: 0.5 } as const
  const fields = d.dataTrust.fields
  if (!fields.length) return 50
  return round(mean(fields.map((f) => bW[f.basis] * cW[f.confidence] * 100)))
}

// ── Integrity self-check — PRD §7.5 V-5 ──
// Runs the full deterministic Coherence Ledger (engine/validate.ts) on every deal
// and folds it into the legacy { ok, blocking, warnings } shape plus the raw checks.
export function integrity(d: Deal, av: AssetValue, ret?: Returns): Integrity {
  const checks = coherenceChecks(d, av, ret)
  const blockingChecks = checks.filter((c) => c.severity === 'blocking')
  const warnChecks = checks.filter((c) => c.severity === 'warn')
  return {
    ok: blockingChecks.length === 0 && warnChecks.length === 0,
    blocking: blockingChecks.length > 0,
    warnings: [...blockingChecks, ...warnChecks].map((c) => `${c.label}: ${c.detail}`),
    checks,
  }
}

// ── Verdict synthesis — PRD §8 ──
function synthesize(
  m: Mandate,
  fit: MandateFit,
  merit: { score: number; label: string },
  ret: Returns,
  trust: number,
  av: AssetValue,
): { verdict: Verdict; reasons: string[]; conditions: string[] } {
  const reasons: string[] = []
  const conditions: string[] = []

  if (fit.redLineBreaches.length) {
    return { verdict: 'pass', reasons: fit.redLineBreaches.slice(0, 4), conditions: [] }
  }

  const base = ret.scenarios.find((s) => s.name === 'base')!
  const anyClears = ret.scenarios.some((s) => s.clearsHurdle)

  // reasons — the decision-critical facts, not restatements of the scores already on screen
  const gap = av.askVsValuePct
  reasons.push(gap > 8 ? `Entry +${gap}% above reconciled value (${usdmShort(av.reconciledUSDm)})` : gap < -8 ? `Entry ${gap}% below reconciled value (${usdmShort(av.reconciledUSDm)})` : `Entry in line with reconciled value (${usdmShort(av.reconciledUSDm)})`)
  const clearing = ret.scenarios.filter((s) => s.clearsHurdle).map((s) => s.name)
  reasons.push(
    clearing.length === 0
      ? `No scenario clears the ${m.returnHurdlePct}% hurdle (base ${base.irrPct}%)`
      : base.clearsHurdle
        ? `Base case clears the ${m.returnHurdlePct}% hurdle (${base.irrPct}%)`
        : `Only the ${clearing.join('/')} case clears the ${m.returnHurdlePct}% hurdle (base ${base.irrPct}%)`,
  )
  const bindingSoft = fit.dimensions.filter((x) => x.status === 'soft' && x.key !== 'return' && x.key !== 'concentration').sort((a, b) => a.score - b.score)[0]
  if (bindingSoft) reasons.push(bindingSoft.takeaway)

  // conditions — actionable items to resolve, distinct from the considerations above
  if (!fit.concentration.fits || fit.concentration.pctOfFund >= m.concentrationCapPct - 1) {
    conditions.push(`Confirm concentration treatment — ${fit.concentration.pctOfFund}% of the fund vs a ${m.concentrationCapPct}% cap`)
  }
  if (trust < 70) {
    conditions.push('Verify the inferred / estimated inputs against primary sources')
  }
  const covered = new Set(['return', 'concentration'])
  fit.dimensions
    .filter((x) => x.status === 'soft' && !covered.has(x.key))
    .forEach((s) => conditions.push(`Confirm ${s.label.toLowerCase()}: ${s.takeaway}`))

  // verdict
  if (!anyClears && merit.score < 55) {
    return { verdict: 'pass', reasons: [...reasons, 'No credible path to the hurdle and weak standalone merit'].slice(0, 4), conditions: [] }
  }
  const strongFit = fit.score >= 75
  const strongMerit = merit.score >= 70
  const noSoftFlags = fit.dimensions.every((d) => d.status !== 'soft')
  if (strongFit && strongMerit && base.clearsHurdle && trust >= 70 && noSoftFlags && fit.concentration.fits && fit.concentration.pctOfFund < m.concentrationCapPct - 1) {
    return { verdict: 'proceed', reasons: reasons.slice(0, 4), conditions: [] }
  }
  return { verdict: 'review', reasons: reasons.slice(0, 4), conditions: conditions.slice(0, 5) }
}

// ── Top-level analysis ──
export function analyze(d: Deal, m: Mandate): Analysis {
  const av = assetValue(d)
  const ret = returns(d, m)
  const fit = mandateFit(d, m, ret)
  const merit = meritScore(d)
  const trust = dataTrustScore(d)
  const integ = integrity(d, av, ret)
  const { verdict, reasons, conditions } = synthesize(m, fit, merit, ret, trust, av)

  const base = ret.scenarios.find((s) => s.name === 'base')!
  const returnScore = clamp((base.irrPct / m.returnHurdlePct) * 100)
  const composite = fit.redLineBreaches.length
    ? 0
    : round(0.35 * merit.score + 0.3 * fit.score + 0.35 * returnScore)

  return {
    mandateFit: fit,
    meritScore: merit.score,
    meritLabel: merit.label,
    assetValue: av,
    returns: ret,
    composite,
    dataTrustScore: trust,
    verdict,
    reasons,
    conditions,
    integrity: integ,
  }
}
