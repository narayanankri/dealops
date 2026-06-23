// ───────────────────────────────────────────────────────────
// IC Memo → a clean, branded, vector PDF (jsPDF). Crisp text, light letterhead,
// proper pagination + footer. Composed from the deal narrative + engine analysis
// so it mirrors the on-screen memo's substance. Version-agnostic: both A and B call it.
// ───────────────────────────────────────────────────────────
import { jsPDF } from 'jspdf'
import type { Analysis, Deal, Mandate } from '@/types'
import { usdm } from '@/lib/format'

const NAVY = [11, 42, 74] as const // headings / accent
const INK = [26, 28, 33] as const // body
const MUTED = [110, 122, 138] as const // secondary
const LINE = [214, 220, 228] as const
const POS = [21, 122, 80] as const
const WARN = [161, 110, 20] as const
const NEG = [168, 45, 45] as const

const VERDICT = {
  proceed: { label: 'Proceed', c: POS },
  review: { label: 'Review', c: WARN },
  pass: { label: 'Pass', c: NEG },
} as const

const scoreColor = (s: number) => (s >= 70 ? POS : s >= 50 ? WARN : NEG)
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export function exportMemoPdf(deal: Deal, a: Analysis, mandate: Mandate): void {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const W = doc.internal.pageSize.getWidth()
  const H = doc.internal.pageSize.getHeight()
  const ML = 48 // margins
  const MR = W - 48
  const CW = MR - ML
  let y = 56

  const setFill = (c: readonly number[]) => doc.setFillColor(c[0], c[1], c[2])
  const setText = (c: readonly number[]) => doc.setTextColor(c[0], c[1], c[2])
  const setDraw = (c: readonly number[]) => doc.setDrawColor(c[0], c[1], c[2])

  const footer = () => {
    const n = doc.getNumberOfPages()
    for (let i = 1; i <= n; i++) {
      doc.setPage(i)
      doc.setFont('helvetica', 'normal').setFontSize(7.5)
      setText(MUTED)
      doc.text('AI Deal Operations · Investment Committee Memorandum · Strictly Confidential', ML, H - 26)
      doc.text(`${i} / ${n}`, MR, H - 26, { align: 'right' })
    }
  }
  const ensure = (space: number) => {
    if (y + space > H - 48) {
      doc.addPage()
      y = 56
    }
  }
  const kicker = (t: string, c: readonly number[] = NAVY) => {
    ensure(20)
    doc.setFont('helvetica', 'bold').setFontSize(8)
    setText(c)
    doc.text(t.toUpperCase(), ML, y, { charSpace: 1.2 })
    y += 13
  }
  const heading = (t: string) => {
    ensure(30)
    doc.setFont('helvetica', 'bold').setFontSize(13)
    setText(NAVY)
    doc.text(t, ML, y)
    y += 6
    setDraw(LINE)
    doc.setLineWidth(0.6)
    doc.line(ML, y, MR, y)
    y += 14
  }
  const para = (t: string | undefined, opts: { lead?: string; size?: number } = {}) => {
    if (!t) return
    const size = opts.size ?? 9.5
    doc.setFontSize(size)
    const lines: string[] = []
    if (opts.lead) {
      doc.setFont('helvetica', 'bold')
      const leadW = doc.getTextWidth(opts.lead + ' ')
      doc.setFont('helvetica', 'normal')
      const wrapped = doc.splitTextToSize(t, CW - leadW)
      // first line prefixed with the lead, rendered separately for bold
      ensure(size + 4)
      setText(NAVY)
      doc.setFont('helvetica', 'bold')
      doc.text(opts.lead, ML, y)
      setText(INK)
      doc.setFont('helvetica', 'normal')
      doc.text(wrapped[0] ?? '', ML + leadW, y)
      y += size + 3.5
      for (let i = 1; i < wrapped.length; i++) { ensure(size + 3.5); doc.text(wrapped[i], ML, y); y += size + 3.5 }
      y += 4
      return
    }
    setText(INK)
    doc.setFont('helvetica', 'normal')
    for (const ln of doc.splitTextToSize(t, CW) as string[]) { ensure(size + 3.5); doc.text(ln, ML, y); y += size + 3.5; lines.push(ln) }
    y += 4
  }
  const bullets = (items: string[] | undefined, dot: readonly number[] = NAVY) => {
    if (!items?.length) return
    doc.setFontSize(9.5).setFont('helvetica', 'normal')
    for (const it of items) {
      const wrapped = doc.splitTextToSize(it, CW - 14) as string[]
      ensure(wrapped.length * 13 + 2)
      setFill(dot)
      doc.circle(ML + 2.5, y - 3, 1.6, 'F')
      setText(INK)
      wrapped.forEach((ln, i) => { doc.text(ln, ML + 14, y); if (i < wrapped.length - 1) y += 13 })
      y += 14
    }
    y += 3
  }

  // ── Letterhead ──
  doc.setFont('helvetica', 'bold').setFontSize(7.5)
  setText(MUTED)
  doc.text('INVESTMENT COMMITTEE MEMORANDUM · STRICTLY CONFIDENTIAL', ML, y, { charSpace: 1 })
  const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  doc.text(today, MR, y, { align: 'right' })
  y += 18
  doc.setFont('helvetica', 'bold').setFontSize(21)
  setText(NAVY)
  doc.text(deal.name, ML, y)
  y += 16
  doc.setFont('helvetica', 'normal').setFontSize(10)
  setText(INK)
  for (const ln of doc.splitTextToSize(deal.oneLiner, CW) as string[]) { doc.text(ln, ML, y); y += 13 }
  doc.setFontSize(8.5)
  setText(MUTED)
  const meta = `${deal.sector} · ${deal.geography} · ${deal.stage}${deal.foundedYear ? ` · Founded ${deal.foundedYear}` : ''} · Proposed ticket ${usdm(deal.ticketUSDm)} (${deal.instrument})`
  doc.text(meta, ML, y)
  y += 10
  setDraw(NAVY)
  doc.setLineWidth(1.4)
  doc.line(ML, y, MR, y)
  y += 22

  // ── Verdict + scores band ──
  const v = VERDICT[a.verdict]
  doc.setFont('helvetica', 'bold').setFontSize(9)
  setText(MUTED)
  doc.text('RECOMMENDATION', ML, y, { charSpace: 1 })
  setFill(v.c)
  const badgeW = doc.getTextWidth(v.label) + 18
  doc.roundedRect(ML + 96, y - 9, badgeW, 14, 2, 2, 'F')
  doc.setTextColor(255, 255, 255).setFontSize(8.5)
  doc.text(v.label.toUpperCase(), ML + 96 + badgeW / 2, y + 0.5, { align: 'center', charSpace: 0.5 })
  y += 18
  // scores
  const scores: [string, number][] = [['Mandate fit', a.mandateFit.score], ['Standalone merit', a.meritScore], ['Composite', a.composite], ['Data trust', a.dataTrustScore]]
  const cellW = CW / 4
  scores.forEach(([label, val], i) => {
    const x = ML + i * cellW
    setDraw(LINE)
    doc.setLineWidth(0.5)
    doc.roundedRect(x, y, cellW - 8, 40, 3, 3, 'S')
    setText(MUTED)
    doc.setFont('helvetica', 'normal').setFontSize(7.5)
    doc.text(label.toUpperCase(), x + 10, y + 14, { charSpace: 0.4 })
    setText(scoreColor(val))
    doc.setFont('helvetica', 'bold').setFontSize(18)
    doc.text(String(Math.round(val)), x + 10, y + 33)
  })
  y += 56

  // ── Executive summary ──
  const ownership = (deal.ticketUSDm / deal.ask.askValuationUSDm) * 100
  kicker('Executive verdict')
  heading('Executive summary')
  const proposal = `${usdm(deal.ticketUSDm)} ${deal.instrument.toLowerCase()} for ~${ownership.toFixed(1)}% of ${deal.name} at a ${usdm(deal.ask.askValuationUSDm)} ${deal.ask.series ? deal.ask.series.toLowerCase() + ' ' : ''}mark${deal.totalRaisedUSDm ? `; the company has raised ${usdm(deal.totalRaisedUSDm)} to date` : ''}.`
  para(proposal, { lead: 'The proposal:' })
  para(deal.narrative.icThesis)
  if (deal.narrative.recommendationSummary) para(deal.narrative.recommendationSummary, { lead: 'Recommendation:' })

  if (a.reasons.length) { kicker('Key considerations', MUTED); bullets(a.reasons) }
  if (a.conditions.length) { kicker('Open items to resolve', MUTED); bullets(a.conditions, WARN) }

  // ── Company / market / model ──
  kicker('Thesis & company')
  heading('Company, market & business model')
  para(deal.narrative.profile)
  para(deal.narrative.marketRead, { lead: 'Market.' })
  para(deal.narrative.regulatory, { lead: 'Regulatory.' })
  para(deal.narrative.marketContext)

  if (deal.narrative.moat) {
    heading('Competitive landscape & moat')
    kicker('Moat pillars', MUTED)
    bullets(deal.narrative.moat.pillars, POS)
    para(deal.narrative.moat.trajectory, { lead: 'Trajectory.' })
  }

  // ── Case for / against ──
  heading('The case for & against')
  kicker('The case for', POS)
  bullets(deal.narrative.caseFor, POS)
  kicker('The case against', NEG)
  bullets(deal.narrative.caseAgainst, NEG)

  // ── Risk register ──
  if (deal.narrative.riskRegister?.length) {
    heading('Risk register')
    doc.setFontSize(9.5)
    for (const r of deal.narrative.riskRegister) {
      const wrapped = doc.splitTextToSize(r.risk, CW - 14) as string[]
      ensure(wrapped.length * 13 + 4)
      const sevC = r.severity === 'high' ? NEG : r.severity === 'medium' ? WARN : MUTED
      setFill(sevC)
      doc.circle(ML + 2.5, y - 3, 1.6, 'F')
      setText(INK)
      doc.setFont('helvetica', 'normal')
      wrapped.forEach((ln, i) => { doc.text(ln, ML + 14, y); if (i < wrapped.length - 1) y += 13 })
      setText(MUTED)
      doc.setFontSize(7.5)
      doc.text(`severity ${r.severity} · likelihood ${r.likelihood}`, ML + 14, y + 11)
      doc.setFontSize(9.5)
      y += 24
    }
    y += 2
  }

  // ── Valuation ──
  const av = a.assetValue
  kicker('Valuation & returns')
  heading('Valuation')
  const valLine = `DCF (intrinsic) ${usdm(av.dcfEquityUSDm)}   ·   Comps (market) ${usdm(av.compsEquity.mid)}   ·   Reconciled ${usdm(av.reconciledUSDm)}   ·   Range ${usdm(av.range.low)}–${usdm(av.range.high)}`
  doc.setFont('helvetica', 'bold').setFontSize(9.5)
  setText(NAVY)
  ensure(16)
  doc.text(valLine, ML, y)
  y += 16
  para(`The ask of ${usdm(deal.ask.askValuationUSDm)} sits ${av.askVsValuePct >= 0 ? '+' : ''}${av.askVsValuePct}% versus the reconciled value.`)
  para(deal.narrative.valuationVerdict)

  // ── Returns ──
  heading(`Returns vs ${a.returns.hurdlePct}% hurdle`)
  doc.setFontSize(9.5)
  for (const s of a.returns.scenarios) {
    ensure(15)
    setText(INK)
    doc.setFont('helvetica', 'bold')
    doc.text(s.name.charAt(0).toUpperCase() + s.name.slice(1), ML, y)
    doc.setFont('helvetica', 'normal')
    setText(s.clearsHurdle ? POS : MUTED)
    doc.text(`${s.irrPct}% IRR · ${s.moic}x MOIC · exit equity ${usdm(s.exitEquityUSDm)}${s.clearsHurdle ? '  ✓ clears hurdle' : ''}`, ML + 70, y)
    y += 14
  }
  y += 2
  para(a.returns.basis, { size: 8.5 })

  // ── Mandate fit ──
  kicker('Mandate fit')
  heading('Fit against the fund mandate')
  para(`Assessed against ${mandate.fundName}.`, { size: 8.5 })
  para(a.mandateFit.narrative)
  if (a.mandateFit.redLineBreaches.length) { kicker('Red-line breaches', NEG); bullets(a.mandateFit.redLineBreaches, NEG) }

  // ── Terms / use of funds ──
  if (deal.narrative.proposedTerms?.length || deal.narrative.useOfFunds) {
    heading('Proposed terms & use of funds')
    for (const t of deal.narrative.proposedTerms ?? []) para(t.value, { lead: t.label + ':' })
    para(deal.narrative.useOfFunds, { lead: 'Use of funds.' })
  }

  // ── Limitations ──
  if (deal.narrative.limitations?.length) {
    heading('Analytical limitations')
    bullets(deal.narrative.limitations, MUTED)
  }

  footer()
  doc.save(`${slug(deal.name)}-ic-memo.pdf`)
}
