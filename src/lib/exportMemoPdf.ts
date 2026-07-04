// ───────────────────────────────────────────────────────────
// IC Memo → a clean, branded, vector PDF (jsPDF). Structured like a real IC
// memorandum: a header band with a designed score strip, numbered chapters,
// callouts, proper valuation/returns/terms tables, a running header and footer.
// Composed from the deal narrative + engine analysis. Version-agnostic.
// ───────────────────────────────────────────────────────────
import { jsPDF } from 'jspdf'
import type { Analysis, Deal, Mandate } from '@/types'
import { usdm, pctSmart } from '@/lib/format'
import { icRecommendationLabel, type IcSubmission } from '@/lib/store'

const NAVY = [12, 38, 71] as const
const NAVY2 = [28, 78, 135] as const
const INK = [30, 34, 42] as const
const MUTED = [104, 118, 136] as const
const FAINT = [150, 162, 176] as const
const LINE = [223, 229, 237] as const
const POS = [21, 122, 80] as const
const WARN = [168, 116, 22] as const
const NEG = [176, 46, 46] as const

const VERDICT = { proceed: { label: 'Proceed', c: POS }, review: { label: 'Review', c: WARN }, pass: { label: 'Pass', c: NEG } } as const
const scoreColor = (s: number) => (s >= 70 ? POS : s >= 50 ? WARN : NEG)
const mix = (c: readonly number[], t: number): [number, number, number] => [Math.round(c[0] * t + 255 * (1 - t)), Math.round(c[1] * t + 255 * (1 - t)), Math.round(c[2] * t + 255 * (1 - t))]
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export function exportMemoPdf(deal: Deal, a: Analysis, mandate: Mandate, submission?: IcSubmission): void {
  buildMemoDoc(deal, a, mandate, submission).save(`${slug(deal.name)}-ic-memo.pdf`)
}

// Exported separately so the document can be rendered/inspected without a download.
export function buildMemoDoc(deal: Deal, a: Analysis, mandate: Mandate, submission?: IcSubmission): jsPDF {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const W = doc.internal.pageSize.getWidth()
  const H = doc.internal.pageSize.getHeight()
  const ML = 50
  const MR = W - 50
  const CW = MR - ML
  const TOP = 70 // content top on continuation pages (below the running header)
  const BOTTOM = H - 52
  let y = 54

  const fill = (c: readonly number[]) => doc.setFillColor(c[0], c[1], c[2])
  const text = (c: readonly number[]) => doc.setTextColor(c[0], c[1], c[2])
  const draw = (c: readonly number[]) => doc.setDrawColor(c[0], c[1], c[2])
  const font = (style: 'normal' | 'bold' = 'normal', size = 9.5) => doc.setFont('helvetica', style).setFontSize(size)

  // jsPDF's built-in Helvetica is WinAnsi — map the few Unicode glyphs our copy uses
  // to safe equivalents so they don't render as stray characters.
  const clean = (t: string): string =>
    t
      .replace(/[→⇒➔➤]/g, '->')
      .replace(/↳/g, '>')
      .replace(/≈/g, '~')
      .replace(/≤/g, '<=')
      .replace(/≥/g, '>=')
      .replace(/ /g, ' ')
      .replace(/ | /g, ' ')

  const ensure = (space: number) => {
    if (y + space > BOTTOM) { doc.addPage(); y = TOP }
  }
  const space = (h: number) => { y += h }

  // ── primitives ──
  const chapter = (num: string, title: string) => {
    space(24)
    ensure(46)
    const chipW = 22, chipH = 16
    fill(NAVY); doc.roundedRect(ML, y - chipH + 3, chipW, chipH, 2, 2, 'F')
    doc.setTextColor(255, 255, 255); font('bold', 9)
    doc.text(num, ML + chipW / 2, y - 1, { align: 'center' })
    text(NAVY); font('bold', 11)
    doc.text(title.toUpperCase(), ML + chipW + 9, y, { charSpace: 1.4 })
    y += 8
    draw(NAVY); doc.setLineWidth(1.2); doc.line(ML, y, MR, y)
    y += 20
  }
  const section = (title: string) => {
    space(13)
    ensure(26)
    fill(NAVY2); doc.rect(ML, y - 7, 2.5, 9, 'F')
    text(NAVY); font('bold', 11.5)
    doc.text(title, ML + 9, y)
    y += 16
  }
  const para = (t?: string, opts: { lead?: string; size?: number; color?: readonly number[]; gap?: number } = {}) => {
    if (!t) return
    const tt = clean(t)
    const lead = opts.lead ? clean(opts.lead) : undefined
    const size = opts.size ?? 9.5
    const lh = size * 1.5
    font('normal', size)
    if (lead) {
      const leadW = (font('bold', size), doc.getTextWidth(lead + ' '))
      font('normal', size)
      const wrapped = doc.splitTextToSize(tt, CW - leadW) as string[]
      ensure(lh)
      text(NAVY); font('bold', size); doc.text(lead, ML, y)
      text(opts.color ?? INK); font('normal', size); doc.text(wrapped[0] ?? '', ML + leadW, y)
      y += lh
      for (let i = 1; i < wrapped.length; i++) { ensure(lh); doc.text(wrapped[i], ML, y); y += lh }
    } else {
      text(opts.color ?? INK)
      for (const ln of doc.splitTextToSize(tt, CW) as string[]) { ensure(lh); doc.text(ln, ML, y); y += lh }
    }
    y += opts.gap ?? 8
  }
  const bullets = (items?: string[], dot: readonly number[] = NAVY2) => {
    if (!items?.length) return
    font('normal', 9.5)
    const lh = 9.5 * 1.45
    for (const raw of items) {
      const it = clean(raw)
      const wrapped = doc.splitTextToSize(it, CW - 16) as string[]
      ensure(wrapped.length * lh + 3)
      fill(dot); doc.circle(ML + 3, y - 3, 1.7, 'F')
      text(INK)
      wrapped.forEach((ln, i) => { doc.text(ln, ML + 16, y); if (i < wrapped.length - 1) y += lh })
      y += lh + 3
    }
    y += 8
  }
  // Tinted rounded callout with a left accent — pre-measures text height.
  const callout = (leadRaw: string, bodyRaw: string, accent: readonly number[] = NAVY2) => {
    const lead = clean(leadRaw), body = clean(bodyRaw)
    const padX = 14, padY = 11, size = 10, lh = size * 1.5
    font('bold', size); const leadW = doc.getTextWidth(lead + ' ')
    font('normal', size)
    const wrapped = doc.splitTextToSize(body, CW - padX * 2 - leadW) as string[]
    // continuation lines wrap at full inner width
    const cont = wrapped.length > 1 ? (doc.splitTextToSize(wrapped.slice(1).join(' '), CW - padX * 2) as string[]) : []
    const lines = 1 + cont.length
    const boxH = padY * 2 + lines * lh - (lh - size)
    ensure(boxH + 6)
    fill(mix(accent, 0.07)); draw(mix(accent, 0.25)); doc.setLineWidth(0.5)
    doc.roundedRect(ML, y, CW, boxH, 4, 4, 'FD')
    fill(accent); doc.rect(ML, y, 3, boxH, 'F')
    let ty = y + padY + size
    text(NAVY); font('bold', size); doc.text(lead, ML + padX, ty)
    text(INK); font('normal', size); doc.text(wrapped[0] ?? '', ML + padX + leadW, ty)
    for (const ln of cont) { ty += lh; doc.text(ln, ML + padX, ty) }
    y += boxH + 14
  }
  // Label/value table (proposed terms).
  const kvTable = (rows: [string, string][]) => {
    if (!rows.length) return
    const size = 9.5, lh = size * 1.45, labelW = 150
    for (const [k, v] of rows) {
      const wrapped = doc.splitTextToSize(clean(v), CW - labelW - 8) as string[]
      const rowH = Math.max(lh, wrapped.length * lh) + 5
      ensure(rowH)
      text(MUTED); font('bold', 8.5); doc.text(clean(k), ML, y + size - 1)
      text(INK); font('normal', size)
      wrapped.forEach((ln, i) => doc.text(ln, ML + labelW, y + size - 1 + i * lh))
      y += rowH
      draw(LINE); doc.setLineWidth(0.4); doc.line(ML, y - 3, MR, y - 3)
    }
    y += 8
  }

  const footerAndHeaders = () => {
    const n = doc.getNumberOfPages()
    for (let i = 1; i <= n; i++) {
      doc.setPage(i)
      // running header (continuation pages)
      if (i > 1) {
        text(MUTED); font('normal', 8)
        doc.text(`${deal.name} — Investment Committee Memorandum`, ML, 40)
        doc.text('Confidential', MR, 40, { align: 'right' })
        draw(LINE); doc.setLineWidth(0.5); doc.line(ML, 48, MR, 48)
      }
      // footer — page number only (the confidential marker lives in the letterhead / running header)
      draw(LINE); doc.setLineWidth(0.5); doc.line(ML, H - 40, MR, H - 40)
      text(FAINT); font('normal', 7.5)
      doc.text(deal.name, ML, H - 28)
      doc.text(`Page ${i} of ${n}`, MR, H - 28, { align: 'right' })
    }
  }

  // ── Header band ──────────────────────────────────────────
  font('bold', 7.5); text(MUTED)
  doc.text('INVESTMENT COMMITTEE MEMORANDUM · STRICTLY CONFIDENTIAL', ML, y, { charSpace: 1 })
  const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
  doc.text(today, MR, y, { align: 'right' })
  y += 22
  font('bold', 24); text(NAVY)
  doc.text(deal.name, ML, y)
  y += 17
  font('normal', 10.5); text(INK)
  for (const ln of doc.splitTextToSize(clean(deal.oneLiner), CW) as string[]) { doc.text(ln, ML, y); y += 14 }
  font('normal', 8.5); text(MUTED)
  doc.text(`${deal.sector}  ·  ${deal.geography}  ·  ${deal.stage}${deal.foundedYear ? `  ·  Founded ${deal.foundedYear}` : ''}  ·  Proposed ticket ${usdm(deal.ticketUSDm)} (${deal.instrument})`, ML, y)
  y += 12
  draw(NAVY); doc.setLineWidth(1.6); doc.line(ML, y, MR, y)
  y += 20

  // Recommendation + score band
  const v = VERDICT[a.verdict]
  const recLabel = 'RECOMMENDATION'
  font('bold', 9); text(MUTED)
  doc.text(recLabel, ML, y, { charSpace: 1 })
  const labelW = doc.getTextWidth(recLabel) + recLabel.length * 1 // approximate the charSpace
  font('bold', 8.5)
  const badgeW = doc.getTextWidth(v.label.toUpperCase()) + 24
  const badgeX = ML + labelW + 18 // measured offset so the pill never overlaps the heading
  fill(v.c); doc.roundedRect(badgeX, y - 10, badgeW, 16, 8, 8, 'F')
  doc.setTextColor(255, 255, 255); font('bold', 8.5)
  doc.text(v.label.toUpperCase(), badgeX + badgeW / 2, y + 0.7, { align: 'center', charSpace: 0.8 })
  y += 22
  const scores: [string, number][] = [['Mandate fit', a.mandateFit.score], ['Standalone merit', a.meritScore], ['Composite', a.composite], ['Data trust', a.dataTrustScore]]
  const gap = 10, cardW = (CW - gap * 3) / 4, cardH = 54
  scores.forEach(([label, val], i) => {
    const x = ML + i * (cardW + gap)
    const c = scoreColor(val)
    fill(mix(c, 0.08)); doc.roundedRect(x, y, cardW, cardH, 4, 4, 'F')
    text(MUTED); font('bold', 7); doc.text(label.toUpperCase(), x + 11, y + 15, { charSpace: 0.3 })
    text(c); font('bold', 23); doc.text(String(Math.round(val)), x + 11, y + 40)
    // mini bar
    const barY = y + cardH - 9, barW = cardW - 22
    fill(mix(c, 0.22)); doc.roundedRect(x + 11, barY, barW, 3, 1.5, 1.5, 'F')
    fill(c); doc.roundedRect(x + 11, barY, (barW * Math.max(0, Math.min(100, val))) / 100, 3, 1.5, 1.5, 'F')
  })
  y += cardH + 8

  // ── 01 · Executive verdict ──
  chapter('01', 'Executive verdict')
  const ownership = (deal.ticketUSDm / deal.ask.askValuationUSDm) * 100
  callout(
    'The proposal —',
    `${usdm(deal.ticketUSDm)} ${deal.instrument.toLowerCase()} for ~${pctSmart(ownership)} of ${deal.name} at a ${usdm(deal.ask.askValuationUSDm)} ${deal.ask.series ? deal.ask.series.toLowerCase() + ' ' : ''}mark${deal.totalRaisedUSDm ? `; the company has raised ${usdm(deal.totalRaisedUSDm)} to date` : ''}. ${deal.narrative.icThesis}`,
  )
  if (submission) {
    const recAccent = submission.recommendation === 'proceed' ? POS : submission.recommendation === 'proceed-conditions' ? WARN : submission.recommendation === 'pass' ? NEG : NAVY2
    callout(`Analyst recommendation — ${icRecommendationLabel(submission.recommendation)}.`, submission.notes || 'No additional notes were recorded with this submission.', recAccent)
  }
  if (deal.narrative.recommendationSummary) para(deal.narrative.recommendationSummary, { lead: 'Recommendation.' })
  if (a.reasons.length) { section('Key considerations'); bullets(a.reasons) }
  if (a.conditions.length) { section('Open items to resolve'); bullets(a.conditions, WARN) }

  // ── 02 · Thesis & company ──
  chapter('02', 'Thesis & company')
  section('Company, market & business model')
  para(deal.narrative.profile)
  para(deal.narrative.marketRead, { lead: 'Market.' })
  para(deal.narrative.regulatory, { lead: 'Regulatory.' })
  para(deal.narrative.marketContext)
  if (deal.narrative.moat) {
    section('Competitive landscape & moat')
    bullets(deal.narrative.moat.pillars, POS)
    para(deal.narrative.moat.trajectory, { lead: 'Trajectory.' })
  }
  section('The case for')
  bullets(deal.narrative.caseFor, POS)
  section('The case against')
  bullets(deal.narrative.caseAgainst, NEG)

  // ── 03 · Valuation & returns ──
  chapter('03', 'Valuation & returns')
  const av = a.assetValue
  section('Valuation')
  // metric strip
  const valCells: [string, string][] = [['DCF (intrinsic)', usdm(av.dcfEquityUSDm)], ['Comps (market)', usdm(av.compsEquity.mid)], ['Reconciled', usdm(av.reconciledUSDm)], ['Range', `${usdm(av.range.low)} – ${usdm(av.range.high)}`]]
  const vGap = 10, vW = (CW - vGap * 3) / 4, vH = 40
  ensure(vH + 6)
  valCells.forEach(([l, val], i) => {
    const x = ML + i * (vW + vGap)
    fill(mix(NAVY, 0.05)); doc.roundedRect(x, y, vW, vH, 4, 4, 'F')
    text(MUTED); font('bold', 7); doc.text(l.toUpperCase(), x + 10, y + 14, { charSpace: 0.2 })
    // auto-fit the value so long ranges (e.g. "$1.20bn – $1.60bn") never spill the cell
    const base = i === 2 ? 14 : 12.5
    const maxW = vW - 20
    font('bold', base)
    const tw = doc.getTextWidth(val)
    const size = tw > maxW ? Math.max(8, (base * maxW) / tw) : base
    text(i === 2 ? NAVY2 : INK); font('bold', size); doc.text(val, x + 10, y + 31)
  })
  y += vH + 12
  para(`The ask of ${usdm(deal.ask.askValuationUSDm)} sits ${av.askVsValuePct >= 0 ? '+' : ''}${av.askVsValuePct}% versus the reconciled value.`, { lead: 'Entry.' })
  para(deal.narrative.valuationVerdict)

  section(`Returns vs the ${a.returns.hurdlePct}% hurdle`)
  // scenario table
  const cols = [{ t: 'Scenario', w: 0.26, a: 'left' }, { t: 'IRR', w: 0.16, a: 'right' }, { t: 'MOIC', w: 0.16, a: 'right' }, { t: 'Exit equity', w: 0.24, a: 'right' }, { t: 'vs hurdle', w: 0.18, a: 'right' }] as const
  const colX = (idx: number) => ML + cols.slice(0, idx).reduce((s, c) => s + c.w * CW, 0)
  const rowH = 18
  ensure(rowH * (a.returns.scenarios.length + 1) + 6)
  // header
  fill(NAVY); doc.roundedRect(ML, y, CW, rowH, 2, 2, 'F')
  doc.setTextColor(255, 255, 255); font('bold', 8)
  cols.forEach((c, i) => doc.text(c.t.toUpperCase(), c.a === 'right' ? colX(i) + c.w * CW - 8 : colX(i) + 8, y + 12, { align: c.a, charSpace: 0.3 }))
  y += rowH
  a.returns.scenarios.forEach((s, r) => {
    if (r % 2 === 1) { fill([247, 249, 252]); doc.rect(ML, y, CW, rowH, 'F') }
    const cells = [s.name.charAt(0).toUpperCase() + s.name.slice(1), `${s.irrPct}%`, `${s.moic}x`, usdm(s.exitEquityUSDm), s.clearsHurdle ? 'Clears' : 'Below']
    font('normal', 9.5)
    cells.forEach((cell, i) => {
      text(i === 4 ? (s.clearsHurdle ? POS : NEG) : i === 0 ? NAVY : INK)
      font(i === 0 || i === 4 ? 'bold' : 'normal', 9.5)
      doc.text(cell, cols[i].a === 'right' ? colX(i) + cols[i].w * CW - 8 : colX(i) + 8, y + 12.5, { align: cols[i].a })
    })
    y += rowH
  })
  draw(LINE); doc.setLineWidth(0.5); doc.line(ML, y, MR, y)
  y += 10
  para(a.returns.basis, { size: 8.5, color: MUTED })

  // ── 04 · Mandate, risk & terms ──
  chapter('04', 'Mandate, risk & terms')
  section('Fit against the fund mandate')
  para(`Assessed against ${mandate.fundName}.`, { size: 8.5, color: MUTED, gap: 4 })
  para(a.mandateFit.narrative)
  if (a.mandateFit.redLineBreaches.length) { para('Red-line breaches:', { size: 9, color: NEG, gap: 2 }); bullets(a.mandateFit.redLineBreaches, NEG) }

  if (deal.narrative.riskRegister?.length) {
    section('Risk register')
    const risks = deal.narrative.riskRegister
    type RiskRow = (typeof risks)[number]
    const cap = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '—')
    const cols: { t: string; w: number; get?: (r: RiskRow) => string; chip?: boolean; bold?: boolean }[] = [
      { t: 'Risk', w: 0.22, get: (r) => clean(r.risk), bold: true },
      { t: 'Sev', w: 0.1, chip: true },
      { t: 'Likely', w: 0.1, get: (r) => cap(r.likelihood) },
      { t: 'Impact', w: 0.21, get: (r) => clean(r.impact ?? '—') },
      { t: 'Mitigation', w: 0.2, get: (r) => clean(r.mitigation ?? '—') },
      { t: 'Monitoring', w: 0.17, get: (r) => clean(r.monitoring ?? '—') },
    ]
    const colX = (i: number) => ML + cols.slice(0, i).reduce((s, c) => s + c.w * CW, 0)
    const pad = 5, fs = 8, lh = fs * 1.35
    const drawHeader = () => {
      fill(NAVY); doc.rect(ML, y, CW, 16, 'F')
      doc.setTextColor(255, 255, 255); font('bold', 7)
      cols.forEach((c, i) => doc.text(c.t.toUpperCase(), colX(i) + pad, y + 10.5, { charSpace: 0.3 }))
      y += 16
    }
    ensure(60) // keep the header with at least one row (no orphaned header at a page foot)
    drawHeader()
    risks.forEach((r) => {
      const wrapped = cols.map((c) => (c.chip ? [] : (doc.splitTextToSize(String(c.get!(r) || '—'), c.w * CW - pad * 2) as string[])))
      const lines = Math.max(1, ...wrapped.map((w) => w.length))
      const rowH = lines * lh + pad * 2
      if (y + rowH > BOTTOM) { doc.addPage(); y = TOP; drawHeader() } // repeat header on page break
      const zebra = Math.round((y - TOP) / 7) % 2 === 1
      if (zebra) { fill([247, 249, 252]); doc.rect(ML, y, CW, rowH, 'F') }
      const sevC = r.severity === 'high' ? NEG : r.severity === 'medium' ? WARN : MUTED
      cols.forEach((c, i) => {
        const cx = colX(i) + pad
        if (c.chip) {
          // colored severity text (no box) — clean in a table and never overlaps neighbouring cells
          font('bold', 7.5); text(sevC)
          doc.text(r.severity.toUpperCase(), cx, y + pad + fs - 1, { charSpace: 0.3 })
          return
        }
        font(c.bold ? 'bold' : 'normal', fs); text(c.bold ? INK : MUTED)
        wrapped[i].forEach((ln, li) => doc.text(ln, cx, y + pad + fs - 1 + li * lh))
      })
      y += rowH
      draw(LINE); doc.setLineWidth(0.4); doc.line(ML, y, MR, y)
    })
    y += 10
  }

  if (deal.narrative.proposedTerms?.length || deal.narrative.useOfFunds) {
    section('Proposed terms & use of funds')
    kvTable((deal.narrative.proposedTerms ?? []).map((t) => [t.label, t.value] as [string, string]))
    para(deal.narrative.useOfFunds, { lead: 'Use of funds.' })
  }

  if (deal.narrative.limitations?.length) {
    section('Analytical limitations')
    bullets(deal.narrative.limitations, FAINT)
  }

  footerAndHeaders()
  return doc
}
