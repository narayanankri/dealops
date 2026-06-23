// ───────────────────────────────────────────────────────────
// Valuation tab → a fully-functional .xlsx model (SheetJS). Every output is a LIVE
// Excel formula off an editable Assumptions block — edit a driver, WACC, margin or
// peer multiple and the DCF, comps, reconciled value and returns all recompute.
// Mirrors the engine exactly (dcfEquity / compsEquity / growth-equity returns), and
// follows the model-builder house style (% -of-revenue method, EV→equity bridge).
// Cached values are written alongside each formula so the file opens correct anywhere.
// ───────────────────────────────────────────────────────────
import * as XLSX from 'xlsx'
import type { Analysis, Deal, Mandate } from '@/types'
import { projectModel } from '@/engine/model'

type Cell = string | number | { f: string; v: number } | null
const f = (formula: string, v: number): Cell => ({ f: formula, v: Math.round(v * 10) / 10 })
const r1 = (x: number) => Math.round(x * 10) / 10

function sheet(rows: Cell[][], widths: number[]): XLSX.WorkSheet {
  const ws: XLSX.WorkSheet = {}
  let maxC = 0
  rows.forEach((row, r) => {
    row.forEach((cell, c) => {
      if (cell === '' || cell == null) return
      const addr = XLSX.utils.encode_cell({ r, c })
      if (typeof cell === 'object') ws[addr] = { t: 'n', f: cell.f, v: cell.v }
      else if (typeof cell === 'number') ws[addr] = { t: 'n', v: cell }
      else ws[addr] = { t: 's', v: cell }
      if (c > maxC) maxC = c
    })
  })
  ws['!ref'] = XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: Math.max(0, rows.length - 1), c: Math.max(maxC, widths.length - 1) } })
  ws['!cols'] = widths.map((wch) => ({ wch }))
  return ws
}

function percentile(sorted: number[], p: number): number {
  if (!sorted.length) return 0
  const idx = (sorted.length - 1) * p
  const lo = Math.floor(idx), hi = Math.ceil(idx)
  return lo === hi ? sorted[lo] : sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo)
}
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export function exportModelXlsx(deal: Deal, a: Analysis, mandate: Mandate): void {
  XLSX.writeFile(buildModelWorkbook(deal, a, mandate), `${slug(deal.name)}-valuation-model.xlsx`)
}

// Exported separately so the workbook can be inspected/tested without triggering a download.
export function buildModelWorkbook(deal: Deal, a: Analysis, mandate: Mandate): XLSX.WorkBook {
  const asm = deal.assumptions
  const n = asm.revGrowthPct.length
  const wb = XLSX.utils.book_new()

  // ── DCF sheet (mirrors dcfEquity) ──────────────────────────
  const tax = asm.taxRatePct / 100, w = asm.waccPct / 100, g = asm.terminalGrowthPct / 100
  const revs: number[] = [], eb: number[] = [], fcf: number[] = [], df: number[] = [], pv: number[] = []
  let rev = asm.baseRevenueUSDm
  for (let i = 0; i < n; i++) {
    rev = rev * (1 + asm.revGrowthPct[i] / 100)
    const e = rev * (asm.ebitdaMarginPct[i] / 100)
    const fc = e * (1 - tax)
    const d = 1 / Math.pow(1 + w, i + 1)
    revs.push(rev); eb.push(e); fcf.push(fc); df.push(d); pv.push(fc * d)
  }
  const sumPV = pv.reduce((s, x) => s + x, 0)
  const tv = w > g ? (fcf[n - 1] * (1 + g)) / (w - g) : 0
  const pvTerm = tv / Math.pow(1 + w, n)
  const ev = sumPV + pvTerm
  const equity = ev - asm.netDebtUSDm

  const dcfRows: Cell[][] = []
  dcfRows.push([`DCF MODEL — ${deal.name}`])
  dcfRows.push([])
  dcfRows.push(['ASSUMPTIONS (edit these)'])
  dcfRows.push(['Base revenue ($m)', asm.baseRevenueUSDm]) // B4
  dcfRows.push(['Net debt ($m)', asm.netDebtUSDm]) // B5
  dcfRows.push(['Tax rate (%)', asm.taxRatePct]) // B6
  dcfRows.push(['WACC (%)', asm.waccPct]) // B7
  dcfRows.push(['Terminal growth (%)', asm.terminalGrowthPct]) // B8
  dcfRows.push([])
  dcfRows.push(['Year', 'Rev growth %', 'EBITDA margin %', 'Revenue $m', 'EBITDA $m', 'FCFF $m', 'Period', 'Discount factor', 'PV $m']) // row 10
  const labels = projectModel(deal)?.dcf.forecastLabels
  for (let i = 0; i < n; i++) {
    const R = 11 + i // excel row
    const prevRevRef = i === 0 ? '$B$4' : `D${R - 1}`
    dcfRows.push([
      labels?.[i] ?? `Year ${i + 1}`,
      asm.revGrowthPct[i],
      asm.ebitdaMarginPct[i],
      f(`${prevRevRef}*(1+B${R}/100)`, revs[i]),
      f(`D${R}*C${R}/100`, eb[i]),
      f(`E${R}*(1-$B$6/100)`, fcf[i]),
      i + 1,
      f(`1/(1+$B$7/100)^G${R}`, df[i]),
      f(`F${R}*H${R}`, pv[i]),
    ])
  }
  const lastF = 10 + n // excel row of last forecast
  const sumPVrow = 12 + n, tvRow = 13 + n, pvTermRow = 14 + n, evRow = 15 + n, eqRow = 17 + n
  dcfRows.push([])
  dcfRows.push(['Sum of PV (explicit)', f(`SUM(I11:I${lastF})`, sumPV)])
  dcfRows.push(['Terminal value (Gordon)', f(`F${lastF}*(1+$B$8/100)/(($B$7-$B$8)/100)`, tv)])
  dcfRows.push(['PV of terminal value', f(`B${tvRow}/(1+$B$7/100)^G${lastF}`, pvTerm)])
  dcfRows.push(['Enterprise value', f(`B${sumPVrow}+B${pvTermRow}`, ev)])
  dcfRows.push(['Less: net debt', f(`-$B$5`, -asm.netDebtUSDm)])
  dcfRows.push(['Equity value', f(`B${evRow}-$B$5`, equity)])
  dcfRows.push(['Implied EV / Revenue', f(`B${evRow}/$B$4`, asm.baseRevenueUSDm ? ev / asm.baseRevenueUSDm : 0)])
  XLSX.utils.book_append_sheet(wb, sheet(dcfRows, [26, 13, 15, 12, 12, 12, 8, 14, 12]), 'DCF')

  // ── Comps sheet (mirrors compsEquity) ──────────────────────
  const peers = deal.peers.filter((p) => typeof p.evRevenue === 'number')
  const mults = peers.map((p) => p.evRevenue as number).sort((x, z) => x - z)
  const p25 = percentile(mults, 0.25), med = percentile(mults, 0.5), p75 = percentile(mults, 0.75)
  const compRows: Cell[][] = []
  compRows.push([`COMPARABLES — ${deal.name}`])
  compRows.push([])
  compRows.push(['Peer', 'EV / Revenue (x)']) // row 3
  peers.forEach((p) => compRows.push([p.name, p.evRevenue as number]))
  const firstPeer = 4, lastPeer = 3 + peers.length
  const p25Row = 5 + peers.length, medRow = 6 + peers.length, p75Row = 7 + peers.length
  const brRow = 8 + peers.length, ndRow2 = 9 + peers.length, midRow = 11 + peers.length
  compRows.push([])
  compRows.push(['EV/Rev — P25', f(`PERCENTILE(B${firstPeer}:B${lastPeer},0.25)`, p25)])
  compRows.push(['EV/Rev — median', f(`PERCENTILE(B${firstPeer}:B${lastPeer},0.5)`, med)])
  compRows.push(['EV/Rev — P75', f(`PERCENTILE(B${firstPeer}:B${lastPeer},0.75)`, p75)])
  compRows.push(['Base revenue ($m)', f(`DCF!$B$4`, asm.baseRevenueUSDm)])
  compRows.push(['Net debt ($m)', f(`DCF!$B$5`, asm.netDebtUSDm)])
  compRows.push(['Equity — low (P25 × rev − net debt)', f(`B${p25Row}*B${brRow}-B${ndRow2}`, p25 * asm.baseRevenueUSDm - asm.netDebtUSDm)])
  compRows.push(['Equity — mid (median)', f(`B${medRow}*B${brRow}-B${ndRow2}`, med * asm.baseRevenueUSDm - asm.netDebtUSDm)])
  compRows.push(['Equity — high (P75)', f(`B${p75Row}*B${brRow}-B${ndRow2}`, p75 * asm.baseRevenueUSDm - asm.netDebtUSDm)])
  XLSX.utils.book_append_sheet(wb, sheet(compRows, [38, 16]), 'Comps')

  // ── Returns sheet (growth-equity: bear 0.55/0.8, base 1/1, bull 1.35/1.2) ──
  const ownership = deal.ticketUSDm / deal.ask.askValuationUSDm
  const gAvg = asm.revGrowthPct.reduce((s, x) => s + x, 0) / n / 100
  const scen: [string, number, number][] = [['Bear', 0.55, 0.8], ['Base', 1, 1], ['Bull', 1.35, 1.2]]
  const retRows: Cell[][] = []
  retRows.push([`RETURNS — ${deal.name}`])
  retRows.push([])
  retRows.push(['Ticket ($m)', deal.ticketUSDm]) // B3
  retRows.push(['Entry valuation / ask ($m)', deal.ask.askValuationUSDm]) // B4
  retRows.push(['Base revenue ($m)', f(`DCF!$B$4`, asm.baseRevenueUSDm)]) // B5
  retRows.push(['Net debt ($m)', f(`DCF!$B$5`, asm.netDebtUSDm)]) // B6
  retRows.push(['Exit EV / Revenue (x)', asm.exitEVRevenue]) // B7
  retRows.push(['Hold (years)', asm.holdYears]) // B8
  retRows.push(['Avg revenue growth (%)', f(`AVERAGE(DCF!B11:B${lastF})`, r1(gAvg * 100))]) // B9
  retRows.push(['Ownership (%)', f(`B3/B4*100`, r1(ownership * 100))]) // B10
  retRows.push([])
  retRows.push(['Scenario', 'g ×', 'exit ×', 'Exit revenue', 'Exit EV', 'Exit equity', 'Stake', 'MOIC', 'IRR %']) // row 12
  scen.forEach(([name, gMul, exMul], i) => {
    const R = 13 + i
    const exitRev = asm.baseRevenueUSDm * Math.pow(1 + gAvg * gMul, asm.holdYears)
    const exitEV = exitRev * (asm.exitEVRevenue * exMul)
    const exitEq = exitEV - asm.netDebtUSDm
    const stake = ownership * exitEq
    const moic = stake / deal.ticketUSDm
    const irr = (Math.pow(Math.max(moic, 0.0001), 1 / asm.holdYears) - 1) * 100
    retRows.push([
      name, gMul, exMul,
      f(`$B$5*(1+$B$9/100*B${R})^$B$8`, exitRev),
      f(`D${R}*($B$7*C${R})`, exitEV),
      f(`E${R}-$B$6`, exitEq),
      f(`$B$10/100*F${R}`, stake),
      f(`G${R}/$B$3`, r1(moic)),
      f(`(H${R}^(1/$B$8)-1)*100`, r1(irr)),
    ])
  })
  const baseIrrCell = `Returns!I14` // base = 2nd scenario row
  XLSX.utils.book_append_sheet(wb, sheet(retRows, [24, 8, 8, 14, 14, 14, 12, 10, 10]), 'Returns')

  // ── Summary (links the three models; the headline the IC sees) ──
  const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  const recon = 0.5 * equity + 0.5 * (med * asm.baseRevenueUSDm - asm.netDebtUSDm)
  const sumRows: Cell[][] = []
  sumRows.push([`${deal.name} — Valuation summary`])
  sumRows.push(['Fund', mandate.fundName])
  sumRows.push(['Prepared', today])
  sumRows.push([])
  sumRows.push(['DCF equity ($m)', f(`DCF!B${eqRow}`, equity)]) // B5
  sumRows.push(['Comps — mid ($m)', f(`Comps!B${midRow}`, med * asm.baseRevenueUSDm - asm.netDebtUSDm)]) // B6
  sumRows.push(['Reconciled value ($m)', f(`0.5*B5+0.5*B6`, recon)]) // B7
  sumRows.push(['Entry / ask ($m)', deal.ask.askValuationUSDm]) // B8
  sumRows.push(['Ask vs reconciled (%)', f(`(B8/B7-1)*100`, recon ? r1((deal.ask.askValuationUSDm / recon - 1) * 100) : 0)]) // B9
  sumRows.push(['Base-case IRR (%)', f(baseIrrCell, a.returns.scenarios.find((s) => s.name === 'base')?.irrPct ?? 0)]) // B10
  sumRows.push(['Return hurdle (%)', mandate.returnHurdlePct]) // B11
  sumRows.push([])
  sumRows.push(['Live model — edit the Assumptions block on the DCF sheet, the peer multiples on Comps,'])
  sumRows.push(['or the inputs on Returns, and every figure here recomputes.'])
  const summaryWs = sheet(sumRows, [28, 16])
  XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary')

  // ── Statements (reference values) — only when a full 3-statement model exists ──
  const pm = projectModel(deal)
  if (pm) {
    const yrs = pm.years.map((y) => y.label)
    const st: Cell[][] = []
    st.push([`PROJECTED STATEMENTS (reference values) — ${deal.name}`])
    st.push(['Engine-computed; the live valuation drivers are on the DCF / Comps / Returns sheets.'])
    st.push([])
    st.push(['Income statement ($m)', ...yrs])
    st.push(['Revenue', ...pm.pnl.map((p) => p.revenue)])
    st.push(['Growth %', ...pm.pnl.map((p) => p.revenueGrowthPct)])
    st.push(['Gross profit', ...pm.pnl.map((p) => p.grossProfit)])
    st.push(['EBITDA', ...pm.pnl.map((p) => p.ebitda)])
    st.push(['EBITDA margin %', ...pm.pnl.map((p) => p.ebitdaMarginPct)])
    st.push(['EBIT', ...pm.pnl.map((p) => p.ebit)])
    st.push(['Net income', ...pm.pnl.map((p) => p.netIncome)])
    st.push([])
    st.push(['Balance sheet ($m)', ...yrs])
    st.push(['Total assets', ...pm.bs.map((b) => b.totalAssets)])
    st.push(['Cash', ...pm.bs.map((b) => b.cash)])
    st.push(['Net debt', ...pm.bs.map((b) => b.netDebt)])
    st.push(['Total equity', ...pm.bs.map((b) => b.totalEquity)])
    st.push(['Balance check (≈0)', ...pm.bs.map((b) => b.balanceGap)])
    st.push([])
    st.push(['Cash flow ($m)', ...yrs])
    st.push(['CFO', ...pm.cf.map((c) => c.cfo)])
    st.push(['CFI', ...pm.cf.map((c) => c.cfi)])
    st.push(['CFF', ...pm.cf.map((c) => c.cff)])
    st.push(['Closing cash', ...pm.cf.map((c) => c.closingCash)])
    XLSX.utils.book_append_sheet(wb, sheet(st, [26, ...yrs.map(() => 11)]), 'Statements')
  }

  // Reorder so Summary is first
  wb.SheetNames = ['Summary', 'DCF', 'Comps', 'Returns', ...(pm ? ['Statements'] : [])]
  // Force a full recalc when the workbook opens, so the live formulas evaluate immediately.
  // (CalcPr is supported by the writer but absent from the bundled types — set via Object.assign.)
  wb.Workbook = Object.assign({}, wb.Workbook, { CalcPr: { fullCalcOnLoad: true } })

  return wb
}
