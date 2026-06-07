// ───────────────────────────────────────────────────────────
// Deterministic Coherence Ledger.
//
// This is CRITIQUE.md's ledger turned into code. It runs on EVERY deal —
// existing or authored tomorrow — inside analyze(), so the classes of bug we
// keep catching by hand (a round duplicated as the ask, a secondary booked as
// primary, an ownership % that can't be true, a multiple that contradicts the
// peers, vitals that disagree with the financials, unsourced "stated" facts)
// fail loudly and automatically instead of relying on a reviewer noticing.
//
// Pure functions; types only; no React, no I/O.
// Severity:
//   blocking — the deal is internally broken / unpresentable until fixed.
//   warn     — a coherence smell a human must confirm or explain.
//   pass     — the invariant was checked and holds (kept so the ledger is legible).
// ───────────────────────────────────────────────────────────
import type { AssetValue, CoherenceCheck, Deal, Returns } from '@/types'
import { projectModel } from './model'

// Sortable key from a human date string: 'Oct 2025' | 'Q4 2025' | 'FY2025' | '2023' → year*100+month.
function dateKey(s?: string): number | null {
  if (!s) return null
  const y = s.match(/(19|20)\d{2}/)
  if (!y) return null
  const year = parseInt(y[0], 10)
  const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
  const ml = s.toLowerCase()
  let month = 0
  for (let i = 0; i < 12; i++) if (ml.includes(months[i])) { month = i + 1; break }
  if (!month) {
    const q = ml.match(/q([1-4])/)
    if (q) month = parseInt(q[1], 10) * 3
  }
  if (!month) {
    const num = s.match(/-(\d{1,2})\b/) // 'YYYY-MM' / 'YYYY-MM-DD'
    if (num) { const mm = parseInt(num[1], 10); if (mm >= 1 && mm <= 12) month = mm }
  }
  return year * 100 + month
}

const isSecondary = (s?: string) => !!s && /secondary|tender|\bexit\b|liquidity/i.test(s)
const isNotClosed = (s?: string) => !!s && /in talks|not closed|indicative|rumou?red|hypothetical|illustrative|pending|future/i.test(s)
const nonEmpty = (s?: string) => !!s && s.trim().length > 0
const median = (xs: number[]) => {
  if (!xs.length) return 0
  const s = [...xs].sort((a, b) => a - b)
  const m = Math.floor(s.length / 2)
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2
}

export function coherenceChecks(d: Deal, av: AssetValue, ret?: Returns): CoherenceCheck[] {
  const out: CoherenceCheck[] = []
  const add = (id: string, label: string, severity: CoherenceCheck['severity'], detail: string) =>
    out.push({ id, label, severity, detail })
  const a = d.assumptions
  const rh = d.roundHistory ?? []
  const last = rh[0]

  // ── 1. DCF is well-posed ──
  if (a.waccPct <= a.terminalGrowthPct)
    add('dcf-wacc', 'DCF well-posed', 'blocking', `WACC ${a.waccPct}% ≤ terminal growth ${a.terminalGrowthPct}% — terminal value is unbounded.`)
  else
    add('dcf-wacc', 'DCF well-posed', 'pass', `WACC ${a.waccPct}% > terminal growth ${a.terminalGrowthPct}%.`)

  // ── 2. Forecast arrays aligned (DCF iterates over both) ──
  if (a.revGrowthPct.length !== a.ebitdaMarginPct.length)
    add('assumption-arrays', 'Forecast arrays aligned', 'blocking', `revGrowthPct has ${a.revGrowthPct.length} years but ebitdaMarginPct has ${a.ebitdaMarginPct.length}.`)
  else
    add('assumption-arrays', 'Forecast arrays aligned', 'pass', `${a.revGrowthPct.length} forecast years on both.`)

  // ── 3. Reconciled value is positive ──
  if (av.reconciledUSDm <= 0)
    add('value-positive', 'Value positive', 'blocking', `Reconciled equity value is ${av.reconciledUSDm} — check revenue, margins or net debt.`)
  else
    add('value-positive', 'Value positive', 'pass', `Reconciled equity value $${av.reconciledUSDm}m.`)

  // ── 4. Ownership is possible and matches the control posture ──
  const own = d.ask.askValuationUSDm > 0 ? (d.ticketUSDm / d.ask.askValuationUSDm) * 100 : Infinity
  if (!isFinite(own) || own > 100)
    add('ownership', 'Ownership possible', 'blocking', `Ticket $${d.ticketUSDm}m / ask $${d.ask.askValuationUSDm}m = ${isFinite(own) ? own.toFixed(0) : '∞'}% — cannot exceed 100%.`)
  else if (own > 50 && d.controlPosture !== 'control')
    add('ownership', 'Ownership vs posture', 'warn', `Ticket implies ${own.toFixed(0)}% (control) but posture is '${d.controlPosture}'.`)
  else if (own < 10 && d.controlPosture === 'control')
    add('ownership', 'Ownership vs posture', 'warn', `Ticket implies only ${own.toFixed(1)}% but posture is 'control'.`)
  else
    add('ownership', 'Ownership coherent', 'pass', `Ticket $${d.ticketUSDm}m / ask $${d.ask.askValuationUSDm}m = ${own.toFixed(1)}% (${d.controlPosture}).`)

  // ── 5. The current ask is not also duplicated as the "last round" ──
  // Exempt explicitly hypothetical/illustrative asks: those are deliberately pegged to a real
  // prior mark (e.g. a hypothetical secondary "at the mark" set by a real transaction), so sharing
  // a date/mark with history is intentional, not a double-count.
  if (last && !isNotClosed(d.ask.series)) {
    const sameSeries = nonEmpty(last.series) && nonEmpty(d.ask.series) && last.series.trim().toLowerCase() === d.ask.series!.trim().toLowerCase()
    const sameMark = last.postMoneyUSDm != null && Math.abs(last.postMoneyUSDm - d.ask.askValuationUSDm) <= d.ask.askValuationUSDm * 0.02
    const sameRaise = d.ask.raisingUSDm != null && last.raisedUSDm != null && Math.abs(last.raisedUSDm - d.ask.raisingUSDm) <= d.ask.raisingUSDm * 0.02
    const sameDate = dateKey(last.date) != null && dateKey(last.date) === dateKey(d.ask.date)
    if (sameSeries || (sameDate && (sameMark || sameRaise)))
      add('round-dup', 'Ask ≠ last round', 'blocking', `roundHistory[0] (${last.series}, ${last.date}) is the same event as the current ask — roundHistory holds PRIOR rounds only.`)
    else
      add('round-dup', 'Ask ≠ last round', 'pass', `Last round (${last.series}, ${last.date}) is distinct from the ask.`)
  }

  // ── 6. The "last round" is a closed, prior round (not future / not-closed) ──
  if (last) {
    const lk = dateKey(last.date)
    const ak = dateKey(d.ask.date)
    if (isNotClosed(last.series))
      add('last-closed', 'Last round closed', 'blocking', `roundHistory[0] is "${last.series}" — a not-closed/indicative round must not be shown as the last round.`)
    else if (lk != null && ak != null && lk > ak)
      add('last-closed', 'Last round timing', 'warn', `Last round (${last.date}) is dated after the current ask (${d.ask.date}).`)
    else
      add('last-closed', 'Last round closed', 'pass', `Last round (${last.date}) is a closed prior round.`)
  }

  // ── 7. Round history is most-recent-first ──
  if (rh.length >= 2) {
    const keys = rh.map((r) => dateKey(r.date))
    let descending = true
    for (let i = 1; i < keys.length; i++) if (keys[i - 1] != null && keys[i] != null && (keys[i]! > keys[i - 1]!)) descending = false
    add('round-order', 'Round order', descending ? 'pass' : 'warn', descending ? 'roundHistory is most-recent-first.' : 'roundHistory is not strictly most-recent-first — reorder.')
  }

  // ── 8. No single round exceeds total raised (a valuation/secondary mislabelled as a raise) ──
  // A secondary round (e.g. an IPO sell-down by an existing holder) raises proceeds for the
  // SELLER, not primary capital for the company — so it legitimately won't be in totalRaised.
  // Exclude secondary rounds from this comparison; check #9 governs the secondary ask itself.
  if (d.totalRaisedUSDm != null) {
    const raises = rh.filter((r) => !isSecondary(r.series)).map((r) => r.raisedUSDm).filter((x): x is number => typeof x === 'number')
    const maxRaise = raises.length ? Math.max(...raises) : 0
    if (maxRaise > d.totalRaisedUSDm * 1.001) {
      const culprit = rh.find((r) => r.raisedUSDm === maxRaise)
      add('total-raised', 'Total raised sane', 'warn', `A single round ($${maxRaise}m, ${culprit?.series}) exceeds total raised ($${d.totalRaisedUSDm}m) — is it a valuation/secondary, not a primary raise?`)
    } else {
      add('total-raised', 'Total raised sane', 'pass', `No single round exceeds total raised ($${d.totalRaisedUSDm}m).`)
    }
  }

  // ── 9. A pure secondary ask shouldn't claim a primary "raise" ──
  if (isSecondary(d.ask.series) && d.ask.raisingUSDm != null)
    add('secondary-ask', 'Secondary treatment', 'warn', `Ask is a secondary ("${d.ask.series}") but carries raising $${d.ask.raisingUSDm}m — a secondary has no primary proceeds; confirm this is a transaction size, not company capital.`)

  // ── 10. Implied multiple vs the peer set ──
  const peerMults = d.peers.map((p) => p.evRevenue).filter((x): x is number => typeof x === 'number')
  if (peerMults.length) {
    const pmax = Math.max(...peerMults)
    const pmed = median(peerMults)
    if (av.impliedEVRevenue > pmax * 1.5)
      add('multiple-peers', 'Multiple vs peers', 'warn', `Implied EV/Rev ${av.impliedEVRevenue}x exceeds the peer max ${pmax}x by >50% (median ${pmed}x) — ensure the premium is explained.`)
    else
      add('multiple-peers', 'Multiple vs peers', 'pass', `Implied EV/Rev ${av.impliedEVRevenue}x vs peer median ${pmed}x / max ${pmax}x.`)
  }

  // ── 11. Ask vs reconciled range ──
  if (av.reconciledUSDm > 0 && d.ask.askValuationUSDm > av.range.high * 2.5)
    add('ask-range', 'Ask vs range', 'warn', `Ask $${d.ask.askValuationUSDm}m is >2.5× the top of the peer-justified range ($${av.range.high}m).`)

  // ── 12. Base revenue ties to the financials ──
  if (d.financials?.revenue?.length) {
    const rev = d.financials.revenue
    const lo = Math.min(...rev), hi = Math.max(...rev)
    if (a.baseRevenueUSDm < lo * 0.8 || a.baseRevenueUSDm > hi * 1.2)
      add('base-rev', 'Base revenue ties out', 'warn', `assumptions.baseRevenue $${a.baseRevenueUSDm}m sits outside the financials range $${lo}m–$${hi}m.`)
    else
      add('base-rev', 'Base revenue ties out', 'pass', `Base revenue $${a.baseRevenueUSDm}m within financials range $${lo}m–$${hi}m.`)
  }

  // ── 13. Growth narrative matches the financials direction ──
  if (d.financials?.revenue && d.financials.revenue.length >= 2 && d.vitals?.growth?.trend) {
    const rev = d.financials.revenue
    const dir = rev[rev.length - 1] - rev[0]
    const trend = d.vitals.growth.trend
    if ((trend === 'up' && dir < 0) || (trend === 'down' && dir > 0))
      add('growth-dir', 'Growth direction', 'warn', `Vitals growth trend is '${trend}' but financials revenue goes ${dir >= 0 ? 'up' : 'down'} ($${rev[0]}m → $${rev[rev.length - 1]}m).`)
    else
      add('growth-dir', 'Growth direction', 'pass', `Vitals growth '${trend}' matches the financials direction.`)
  }

  // ── 14. Citation discipline: stated facts are sourced ──
  const statedNoSrc = d.dataTrust.fields.filter((f) => f.basis === 'stated' && !f.url && !f.source)
  if (statedNoSrc.length)
    add('cite-stated', 'Stated facts sourced', 'warn', `${statedNoSrc.length} 'stated' data-trust field(s) lack a source/link: ${statedNoSrc.map((f) => f.label).join(', ')}.`)
  else
    add('cite-stated', 'Stated facts sourced', 'pass', `All 'stated' data-trust fields carry a source.`)

  // ── 15. Citation discipline: estimates show their method ──
  const softNoMethod = d.dataTrust.fields.filter((f) => f.basis !== 'stated' && !nonEmpty(f.method))
  if (softNoMethod.length)
    add('cite-method', 'Estimates show method', 'warn', `${softNoMethod.length} inferred/estimated field(s) have no method: ${softNoMethod.map((f) => f.label).join(', ')}.`)
  else
    add('cite-method', 'Estimates show method', 'pass', `Every inferred/estimated field states its method.`)

  // ── 15b. A 'stated' revenue line must carry a citation ──
  const revLines = d.narrative.revenueLines ?? []
  const statedRev = revLines.filter((l) => l.basis === 'stated')
  const statedRevNoCite = statedRev.filter((l) => !l.url && !l.source)
  if (statedRevNoCite.length) add('cite-revlines', 'Revenue lines sourced', 'warn', `${statedRevNoCite.length} 'stated' revenue line(s) lack a citation: ${statedRevNoCite.map((l) => l.name).join(', ')}.`)
  else if (statedRev.length) add('cite-revlines', 'Revenue lines sourced', 'pass', `Every 'stated' revenue line carries a citation.`)

  // ── 15c. Use-of-funds allocation must sum to ~100% (when a breakdown is provided) ──
  const uof = d.narrative.useOfFundsBreakdown
  if (uof?.length) {
    const sum = uof.reduce((s, x) => s + x.pct, 0)
    if (Math.abs(sum - 100) > 1.5) add('uof-sum', 'Use of funds sums to 100', 'warn', `Use-of-funds allocation sums to ${sum}% — should total ~100%.`)
    else add('uof-sum', 'Use of funds sums to 100', 'pass', `Use-of-funds allocation totals ${Math.round(sum)}%.`)
  }

  // ── 16. Business vitals complete (size / growth / unit-econ / quality) ──
  if (!d.vitals)
    add('vitals', 'Vitals present', 'warn', `No business vitals — size / growth / unit-economics / quality are unanswered.`)
  else {
    const missing = (['size', 'growth', 'unitEconomics', 'quality'] as const).filter((k) => !nonEmpty(d.vitals![k]?.value))
    if (missing.length) add('vitals', 'Vitals complete', 'warn', `Vitals missing a value for: ${missing.join(', ')} ("Not disclosed" is a valid value — don't leave it blank).`)
    else add('vitals', 'Vitals complete', 'pass', `All four business vitals answered.`)
  }

  // ── 17. Narrative spine present ──
  const n = d.narrative
  const gaps: string[] = []
  if (!nonEmpty(n.profile)) gaps.push('profile')
  if (!nonEmpty(n.icThesis)) gaps.push('icThesis')
  if (!nonEmpty(n.valuationVerdict)) gaps.push('valuationVerdict')
  if ((n.caseFor?.length ?? 0) < 2) gaps.push('caseFor≥2')
  if ((n.caseAgainst?.length ?? 0) < 2) gaps.push('caseAgainst≥2')
  if ((n.riskRegister?.length ?? 0) < 1) gaps.push('riskRegister≥1')
  if (gaps.length) add('narrative', 'Narrative spine', 'warn', `Narrative thin / missing: ${gaps.join(', ')}.`)
  else add('narrative', 'Narrative spine', 'pass', `Profile, thesis, verdict, case for/against and risks all present.`)

  // ── 18. A usable comp set exists ──
  if (peerMults.length < 2)
    add('peers', 'Comparable set', 'warn', `Only ${peerMults.length} peer(s) with an EV/Revenue multiple — a triangulation needs at least 2.`)
  else
    add('peers', 'Comparable set', 'pass', `${peerMults.length} peers with EV/Revenue multiples.`)

  // ── 19. The authored recommendation must not contradict the computed returns ──
  // The single gap the tabby-v2 pipeline test exposed: prose can claim "proceed / clears the
  // hurdle" while the engine's own base-case IRR sits below it. Catch that contradiction in code.
  if (ret) {
    const base = ret.scenarios.find((s) => s.name === 'base')
    // Affirmative VERDICT only — keyed on the leading word of the recommendation (our convention:
    // "Proceed…" / "Review…" / "Decline…" / "Pass…"). This avoids matching hurdle *discussion*
    // ("no scenario clears the hurdle"), which is the opposite of a proceed call.
    const verdictWord = (d.narrative.recommendationSummary ?? '').trim().toLowerCase()
    const recommendsProceed = /^(proceed|recommend|invest\b|back\b|advance|pursue|approve|commit)/.test(verdictWord)
    if (base && recommendsProceed && base.irrPct < ret.hurdlePct)
      add('rec-returns', 'Recommendation vs returns', 'blocking', `The recommendation reads "proceed", but the computed base-case IRR is ${base.irrPct}% vs a ${ret.hurdlePct}% hurdle — you don't recommend proceed off a sub-hurdle base case. Fix the assumptions or change the recommendation.`)
    else if (base)
      add('rec-returns', 'Recommendation vs returns', 'pass', `Base IRR ${base.irrPct}% vs ${ret.hurdlePct}% hurdle is consistent with the "${verdictWord.split(/[\s—-]/)[0]}" recommendation.`)
  }

  // ── 20. Forecast year-1 margin shouldn't silently sit well below the last ACTUAL ──
  // Compare against the last ACTUAL year (labels ending in 'E' / 'est' are projections, not
  // actuals) and only flag a material gap (>5pts), so deliberate conservatism isn't nagged.
  if (d.financials?.years?.length && d.financials.revenue?.length && d.financials.ebitda?.length && a.ebitdaMarginPct.length) {
    const yrs = d.financials.years
    let li = -1
    for (let i = yrs.length - 1; i >= 0; i--) if (!/e$|est|proj|forecast/i.test(String(yrs[i]).trim())) { li = i; break }
    const rev = d.financials.revenue[li], eb = d.financials.ebitda[li]
    if (li >= 0 && rev > 0) {
      const lastMargin = (eb / rev) * 100
      const y1 = a.ebitdaMarginPct[0]
      if (lastMargin > 0 && y1 < lastMargin - 5)
        add('margin-start', 'Forecast margin vs actual', 'warn', `Forecast year-1 EBITDA margin ${y1}% is well below the last ACTUAL (${yrs[li]} ~${lastMargin.toFixed(0)}%) — sandbagged, or an inconsistency to explain.`)
      else
        add('margin-start', 'Forecast margin vs actual', 'pass', `Forecast year-1 margin ${y1}% is consistent with the last actual (${yrs[li]} ~${lastMargin.toFixed(0)}%).`)
    }
  }

  // ── 21. Full financial model (only when one is attached) ──
  if (d.model) {
    const pm = projectModel(d)
    if (!pm) {
      add('model-form', 'Model well-formed', 'blocking', 'A financial model is attached but malformed — needs ≥1 actual year, ≥1 forecast year, and driver arrays covering every forecast year.')
    } else {
      const worst = pm.bs.reduce((mx, b) => Math.max(mx, Math.abs(b.balanceGap)), 0)
      if (!pm.balances)
        add('model-bs', 'Balance sheet balances', 'blocking', `A projected balance sheet does not balance — worst gap ${worst.toFixed(1)} (assets vs equity + liabilities).`)
      else add('model-bs', 'Balance sheet balances', 'pass', `Every projected balance sheet balances (max gap ${worst.toFixed(2)}).`)

      const nAct = pm.years.filter((y) => y.actual).length
      const lastActualRev = pm.pnl[nAct - 1].revenue
      if (Math.abs(lastActualRev - d.assumptions.baseRevenueUSDm) > d.assumptions.baseRevenueUSDm * 0.1)
        add('model-base', 'Model ties to base', 'warn', `Model last-actual revenue ($${lastActualRev}m) differs >10% from assumptions.baseRevenue ($${d.assumptions.baseRevenueUSDm}m) — the two valuation inputs should agree.`)
      else add('model-base', 'Model ties to base', 'pass', `Model last-actual revenue ($${lastActualRev}m) ties to the valuation base.`)

      const mv = pm.dcf.equityValue
      const hv = av.reconciledUSDm
      if (hv > 0 && (mv > hv * 2 || mv < hv * 0.5))
        add('model-dcf', 'Model DCF vs headline', 'warn', `Model-DCF equity ($${mv}m) diverges >2× from the headline reconciled value ($${hv}m) — reconcile the two valuation paths.`)
      else add('model-dcf', 'Model DCF vs headline', 'pass', `Model-DCF equity ($${mv}m) is consistent with the headline reconciled value ($${hv}m).`)
    }
  }

  // ── 22. Register: prose must read formal, neutral and factual ──
  // An IC memo is not a blog post. Flag the casual constructions a reader trips on —
  // rhetorical "X is not the question", the intensifier "genuinely"/"exceptionally",
  // second person, contractions and colloquialisms — so the register stays consistent
  // across every authored deal, not just the ones a human happened to re-read.
  const proseFields = [
    n.profile, n.revenueModel, n.marketRead, n.regulatory, n.valuationVerdict, n.icThesis,
    n.useOfFunds, n.recommendationSummary, n.marketContext, n.qualityOfEarnings,
    n.recentDevelopments, n.leadershipGaps, n.legalStanding, n.whyNow, d.shariaScreen?.note,
    ...(n.barriers ?? []).map((b) => b.note),
    ...(n.caseFor ?? []), ...(n.caseAgainst ?? []), ...(n.limitations ?? []),
    ...(n.thesisDrivers ?? []), ...(n.thesisBreakers ?? []),
    // moat, merit rationales, risk register and leadership notes are reader-facing prose too
    ...(n.moat ? [...n.moat.pillars, n.moat.trajectory, ...n.moat.erosionScenarios, ...n.moat.competitors.map((c) => c.note)] : []),
    ...d.merit.map((m) => m.rationale),
    ...(n.riskRegister ?? []).flatMap((r) => [r.impact, r.mitigation, r.monitoring]),
    ...(n.leadership ?? []).map((l) => l.note),
    ...(n.revenueLines ?? []).map((l) => l.description),
    n.scenarioNarratives?.bear, n.scenarioNarratives?.base, n.scenarioNarratives?.bull,
  ].filter((x): x is string => typeof x === 'string')
  const casualTells: { re: RegExp; tell: string }[] = [
    { re: /\bgenuinely\b/i, tell: '"genuinely" (editorial intensifier)' },
    { re: /\bexceptionally\b/i, tell: '"exceptionally"' },
    { re: /\b(?:is|are|was|were)\s+(?:not|never)\s+the\s+(?:binding\s+)?question\b/i, tell: '"… is not the question" (rhetorical)' },
    { re: /\bthe question is not\b/i, tell: '"the question is not …" (rhetorical)' },
    { re: /\bnot the binding question\b/i, tell: '"not the binding question" (rhetorical)' },
    { re: /\bnever\b[^.]{0,40}\bproblem\b/i, tell: '"never … problem" (colloquial)' },
    { re: /\bland[- ]grab\b/i, tell: '"land grab" (colloquial)' },
    { re: /\bwhile you wait\b/i, tell: '"while you wait" (colloquial)' },
    { re: /\bbuild than buy\b/i, tell: '"build than buy" (colloquial)' },
    { re: /\b(?:you|your)\b/i, tell: 'second person ("you" / "your")' },
    { re: /\b\w+n['’]t\b/i, tell: 'a contraction' },
  ]
  const tellsFound = new Set<string>()
  for (const s of proseFields) for (const p of casualTells) if (p.re.test(s)) tellsFound.add(p.tell)
  if (tellsFound.size) add('register', 'Formal register', 'warn', `Narrative uses casual constructions — keep prose formal, neutral and factual. Found: ${[...tellsFound].join('; ')}.`)
  else add('register', 'Formal register', 'pass', `Narrative prose reads formal, neutral and factual.`)

  // ── 23. Entry barriers, when authored, must be complete (sector-adaptive, 3–5 axes) ──
  if (n.barriers?.length) {
    const bad = n.barriers.filter((b) => !nonEmpty(b.axis) || !nonEmpty(b.note) || !['high', 'medium', 'low'].includes(b.rating))
    if (n.barriers.length < 3) add('barriers', 'Entry barriers', 'warn', `Only ${n.barriers.length} barrier axis(es) — author 3–5 that actually bind for this business.`)
    else if (bad.length) add('barriers', 'Entry barriers', 'warn', `${bad.length} barrier(s) missing an axis label, a fact-anchored note, or a valid rating.`)
    else add('barriers', 'Entry barriers', 'pass', `${n.barriers.length} entry barriers rated and noted.`)
  }

  return out
}
