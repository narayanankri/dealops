// ───────────────────────────────────────────────────────────
// Valuation tab → a detailed 10-sheet .xlsx valuation workbook (xlsx-js-style).
// Cover, 3 statements, DCF, sensitivity, peer comps, audit, output summary and
// scenarios — laid out to match the firm reference workbook cell-for-cell (sheet
// names, section headers, year columns, number formats, colour legend).
//
// Every computed line is a LIVE Excel formula written off the cells above it, with
// the engine's value cached alongside (`{f, v}`) so the file opens correct anywhere
// and recomputes on edit. Hardcoded driver inputs (base-year actuals, growth %,
// margins, WACC, g) are values, styled blue per the legend.
//
// Mirrors the engine exactly: projectModel() when a deal carries a full 3-statement
// model, otherwise a statement set synthesised from `deal.assumptions` so every deal
// produces the same workbook. DCF mirrors model.ts buildDcf / engine dcfEquity.
// ───────────────────────────────────────────────────────────
import * as XLSX from 'xlsx-js-style'
import type { Analysis, BSRow, CFRow, Deal, Mandate, ModelYear, PnLRow } from '@/types'
import { projectModel } from '@/engine/model'

type Cell = string | number | { f: string; v: number } | null
const f = (formula: string, v: number): Cell => ({ f: formula, v })
const colL = (c: number) => XLSX.utils.encode_col(c)

// ── number formats — must match the reference EXACTLY ──
const Z = {
  m: '#,##0;(#,##0);"–"',
  pct: '0.0%;(0.0%);"–"',
  mult: '0.0"x"',
  ratio: '#,##0.00;(#,##0.00);"–"',
}

// ── styling palette (xlsx-js-style) ──
const NV = '0C2647', WH = 'FFFFFF', MU = '6C7688', LN = 'DCE2EA', IBG = 'FFF6DC', IFT = '1C4E87'
const GREY = 'EEF1F5', GREEN = 'E3F4E3', RED = 'FBE3E3', SECT = 'F2F5F9'
const bAll = (rgb = LN) => ({ top: { style: 'thin', color: { rgb } }, bottom: { style: 'thin', color: { rgb } }, left: { style: 'thin', color: { rgb } }, right: { style: 'thin', color: { rgb } } })
const enc = (r: number, c: number) => XLSX.utils.encode_cell({ r, c })
type AnyWS = Record<string, { s?: unknown; [k: string]: unknown }>
const st = (ws: AnyWS, r: number, c: number, s: object) => { const a = enc(r, c); if (ws[a]) ws[a].s = { ...(ws[a].s as object), ...s } }
const titleRow = (ws: AnyWS) => { st(ws, 0, 0, { font: { bold: true, sz: 13, color: { rgb: NV } } }); st(ws, 1, 0, { font: { italic: true, sz: 9, color: { rgb: MU } } }) }
// Navy section-header band, e.g. "  COMPANY SNAPSHOT"
const sectionRow = (ws: AnyWS, r: number, c0: number, c1: number) => { for (let c = c0; c <= c1; c++) st(ws, r, c, { font: { bold: true, sz: 10, color: { rgb: NV } }, fill: { fgColor: { rgb: SECT } }, alignment: { horizontal: 'left', vertical: 'center' } }) }
// White-on-navy column header row
const headerRow = (ws: AnyWS, r: number, c0: number, c1: number) => { for (let c = c0; c <= c1; c++) st(ws, r, c, { font: { bold: true, sz: 10, color: { rgb: WH } }, fill: { fgColor: { rgb: NV } }, alignment: { horizontal: c === c0 ? 'left' : 'right', vertical: 'center' } }) }
const inputCell = (ws: AnyWS, r: number, c: number, numFmt: string) => st(ws, r, c, { font: { bold: true, color: { rgb: IFT } }, fill: { fgColor: { rgb: IBG } }, border: bAll(), numFmt, alignment: { horizontal: 'right' } })
const numCol = (ws: AnyWS, c: number, r0: number, r1: number, numFmt: string) => { for (let r = r0; r <= r1; r++) st(ws, r, c, { numFmt, alignment: { horizontal: 'right' } }) }
const totalRow = (ws: AnyWS, r: number, c0: number, c1: number, numFmt: string) => { st(ws, r, c0, { font: { bold: true, color: { rgb: NV } }, fill: { fgColor: { rgb: GREY } } }); for (let c = c0 + 1; c <= c1; c++) st(ws, r, c, { font: { bold: true, color: { rgb: NV } }, fill: { fgColor: { rgb: GREY } }, numFmt, alignment: { horizontal: 'right' } }) }
const auditRow = (ws: AnyWS, r: number, c0: number, c1: number, pass: boolean, numFmt: string) => { const fg = pass ? GREEN : RED; for (let c = c0; c <= c1; c++) st(ws, r, c, { font: { bold: c === c0, color: { rgb: NV } }, fill: { fgColor: { rgb: fg } }, ...(c > c0 ? { numFmt, alignment: { horizontal: 'right' } } : {}) }) }

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

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const median = (xs: number[]) => { const s = [...xs].sort((a, b) => a - b); const n = s.length; return n ? (n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2) : 0 }
const meanOf = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0)

// ───────────────────────────────────────────────────────────
// Unified statement set — from the deal's real model when present, else synthesised
// from `deal.assumptions` so every deal yields the same workbook shape.
// ───────────────────────────────────────────────────────────
interface Statements {
  years: ModelYear[]
  actualCount: number
  pnl: PnLRow[]
  bs: BSRow[]
  cf: CFRow[]
  synthetic: boolean
}

function buildStatements(deal: Deal): Statements {
  const pm = projectModel(deal)
  if (pm) return { years: pm.years, actualCount: pm.years.filter((y) => y.actual).length, pnl: pm.pnl, bs: pm.bs, cf: pm.cf, synthetic: false }
  return synthStatements(deal)
}

// Build a 2-actual + N-forecast statement set from the valuation assumptions.
// Deterministic and balance-by-construction (cash is the plug; RE rolls with NI).
function synthStatements(deal: Deal): Statements {
  const a = deal.assumptions
  const n = a.revGrowthPct.length
  const tax = a.taxRatePct / 100
  const r1 = (x: number) => Math.round(x * 10) / 10
  // Anchor the base year (last actual) to baseRevenueUSDm; one prior actual at base/(1+g0).
  const baseRev = a.baseRevenueUSDm
  const g0 = a.revGrowthPct[0] / 100
  const m0 = a.ebitdaMarginPct[0] / 100
  const priorRev = baseRev / (1 + (g0 || 0.2))
  const labels: ModelYear[] = []
  const startYr = 2024
  labels.push({ label: `${startYr}`, actual: true })
  labels.push({ label: `${startYr + 1}`, actual: true })
  for (let i = 0; i < n; i++) labels.push({ label: `${startYr + 2 + i}`, actual: false })

  const pnl: PnLRow[] = []
  const bs: BSRow[] = []
  const cf: CFRow[] = []
  // revenue path: prior actual, base actual, then forecast growth
  const revPath = [priorRev, baseRev]
  let rev = baseRev
  for (let i = 0; i < n; i++) { rev = rev * (1 + a.revGrowthPct[i] / 100); revPath.push(rev) }
  const marginPath = [m0, m0, ...a.ebitdaMarginPct.map((x) => x / 100)]

  const mkPnL = (r: number, prevR: number, margin: number): PnLRow => {
    const grossMargin = 0.5
    const grossProfit = r * grossMargin
    const cogs = r - grossProfit
    const ebitda = r * margin
    const dna = r * 0.025
    const ebit = ebitda - dna
    const pbt = ebit
    const taxAmt = Math.max(pbt, 0) * tax
    const netIncome = pbt - taxAmt
    return {
      revenue: r1(r), revenueGrowthPct: prevR ? r1(((r - prevR) / prevR) * 100) : 0, cogs: r1(cogs),
      grossProfit: r1(grossProfit), grossMarginPct: r1(grossMargin * 100), otherIncome: 0, opex: r1(grossProfit - ebitda),
      ebitda: r1(ebitda), ebitdaMarginPct: r1(margin * 100), dna: r1(dna), ebit: r1(ebit),
      financeIncome: 0, financeCosts: 0, pbt: r1(pbt), tax: r1(taxAmt), netIncome: r1(netIncome),
      netMarginPct: r ? r1((netIncome / r) * 100) : 0,
    }
  }
  for (let i = 0; i < revPath.length; i++) pnl.push(mkPnL(revPath[i], i > 0 ? revPath[i - 1] : 0, marginPath[i]))

  // Balance sheet: net debt anchored to assumptions at the base actual; cash plug forward.
  // We set debt = max(netDebt,0); cash = debt - netDebt (so netDebt = debt - cash holds).
  const debt = Math.max(a.netDebtUSDm, 0)
  const baseCash = debt - a.netDebtUSDm // = -netDebt when netDebt<0 (net cash) → positive cash
  let prevRE = 0
  let prevCash = baseCash
  for (let i = 0; i < pnl.length; i++) {
    const P = pnl[i]
    const ppe = P.revenue * 0.1
    const receivables = P.revenue * 0.4
    const payables = P.revenue * 0.2
    let cash: number, re: number
    if (i <= 1) {
      // actuals: anchor share capital so equity-side balances; RE rolls with NI from prior
      cash = baseCash + (i === 1 ? P.netIncome : 0)
      re = i === 0 ? -ppe : prevRE + (i === 1 ? P.netIncome : 0)
    } else {
      const prevP = pnl[i - 1]
      const dRec = receivables - prevP.revenue * 0.4
      const dPay = payables - prevP.revenue * 0.2
      const capex = P.dna // hold PPE flat
      const cfo = P.netIncome + P.dna - dRec + dPay
      cash = prevCash + cfo - capex
      re = prevRE + P.netIncome
    }
    const totalNonCurrentAssets = ppe
    const totalCurrentAssets = receivables + cash
    const totalAssets = totalNonCurrentAssets + totalCurrentAssets
    const totalLiabilities = debt + payables
    const totalEquity = totalAssets - totalLiabilities
    const shareCapital = totalEquity - re
    bs.push({
      ppe: r1(ppe), intangibles: 0, otherNonCurrentAssets: 0, totalNonCurrentAssets: r1(totalNonCurrentAssets),
      inventory: 0, receivables: r1(receivables), otherCurrentAssets: 0, cash: r1(cash), totalCurrentAssets: r1(totalCurrentAssets),
      totalAssets: r1(totalAssets), shareCapital: r1(shareCapital), retainedEarnings: r1(re), reserves: 0, nci: 0, totalEquity: r1(totalEquity),
      longTermDebt: r1(debt), shortTermDebt: 0, leases: 0, otherNonCurrentLiab: 0, payables: r1(payables), otherCurrentLiab: 0,
      totalLiabilities: r1(totalLiabilities), totalEquityAndLiabilities: r1(totalEquity + totalLiabilities),
      netDebt: r1(debt - cash), balanceGap: 0,
    })
    prevRE = re; prevCash = cash
    // cash flow (forecast rows meaningful; actuals zero-ish)
    if (i <= 1) cf.push({ netIncome: 0, dna: 0, changeReceivables: 0, changeInventory: 0, changePayables: 0, cfo: 0, capex: 0, cfi: 0, debtChange: 0, dividends: 0, cff: 0, netChangeInCash: 0, closingCash: r1(cash) })
    else {
      const prevP = pnl[i - 1]
      const dRec = receivables - prevP.revenue * 0.4
      const dPay = payables - prevP.revenue * 0.2
      const capex = P.dna
      const cfo = P.netIncome + P.dna - dRec + dPay
      cf.push({ netIncome: r1(P.netIncome), dna: r1(P.dna), changeReceivables: r1(-dRec), changeInventory: 0, changePayables: r1(dPay), cfo: r1(cfo), capex: r1(-capex), cfi: r1(-capex), debtChange: 0, dividends: 0, cff: 0, netChangeInCash: r1(cfo - capex), closingCash: r1(cash) })
    }
  }
  return { years: labels, actualCount: 2, pnl, bs, cf, synthetic: true }
}

// DCF figures, mirroring engine/model.ts buildDcf (mid-year=false default for synth).
interface DcfResult {
  fLabels: string[]; ebit: number[]; nopat: number[]; dna: number[]; capex: number[]; dWc: number[]; ufcf: number[]
  period: number[]; df: number[]; pv: number[]; sumPv: number; tv: number; pvTerminal: number; ev: number
  netDebt: number; leases: number; nci: number; associates: number; equity: number; termPctEv: number
  evRevLTM: number; evEbitdaLTM: number; evEbitdaNTM: number; wacc: number; g: number; tax: number; midYear: boolean
}

function buildDcf(deal: Deal, S: Statements, waccOverride?: number, gOverride?: number): DcfResult {
  const pm = !S.synthetic ? projectModel(deal) : null
  const v = deal.model?.valuation
  const wacc = (waccOverride ?? (v?.waccPct ?? deal.assumptions.waccPct)) / 100
  const g = (gOverride ?? (v?.terminalGrowthPct ?? deal.assumptions.terminalGrowthPct)) / 100
  const midYear = v?.midYear ?? false
  const tax = (v?.longRunTaxPct ?? deal.assumptions.taxRatePct) / 100
  const nA = S.actualCount
  const nF = S.years.length - nA
  const fLabels: string[] = [], ebit: number[] = [], nopat: number[] = [], dna: number[] = [], capex: number[] = [], dWc: number[] = [], ufcf: number[] = [], period: number[] = [], df: number[] = [], pv: number[] = []
  for (let fi = 0; fi < nF; fi++) {
    const i = nA + fi
    const P = S.pnl[i], B = S.bs[i], prevB = S.bs[i - 1]
    const cx = Math.max(0, B.ppe - prevB.ppe + P.dna)
    const wc = (B.receivables - prevB.receivables) + (B.inventory - prevB.inventory) - (B.payables - prevB.payables)
    const np = P.ebit * (1 - tax)
    const fc = np + P.dna - cx - wc
    const per = midYear ? fi + 0.5 : fi + 1
    const factor = 1 / Math.pow(1 + wacc, per)
    fLabels.push(S.years[i].label); ebit.push(P.ebit); nopat.push(np); dna.push(P.dna); capex.push(-cx); dWc.push(-wc); ufcf.push(fc); period.push(per); df.push(factor); pv.push(fc * factor)
  }
  const sumPv = pv.reduce((a, b) => a + b, 0)
  const lastFcf = ufcf[ufcf.length - 1]
  const lastPer = period[period.length - 1]
  const lastEbitda = S.pnl[S.years.length - 1].ebitda
  let tv = 0
  if (pm && deal.model?.valuation.terminalMethod === 'exit-multiple' && deal.model.valuation.exitEvEbitda) tv = deal.model.valuation.exitEvEbitda * lastEbitda
  else if (wacc > g) tv = (lastFcf * (1 + g)) / (wacc - g)
  const pvTerminal = tv / Math.pow(1 + wacc, lastPer)
  const ev = sumPv + pvTerminal
  const lastActual = S.bs[nA - 1]
  const netDebt = lastActual.longTermDebt + lastActual.shortTermDebt - lastActual.cash
  const leases = lastActual.leases
  const nci = lastActual.nci
  const associates = deal.model?.valuation.associates ?? 0
  const equity = ev - netDebt - leases - nci + associates
  const revLTM = S.pnl[nA - 1].revenue
  const ebitdaLTM = S.pnl[nA - 1].ebitda
  const ebitdaNTM = S.pnl[nA].ebitda
  return {
    fLabels, ebit, nopat, dna, capex, dWc, ufcf, period, df, pv, sumPv, tv, pvTerminal, ev,
    netDebt, leases, nci, associates, equity, termPctEv: ev ? pvTerminal / ev : 0,
    evRevLTM: revLTM ? ev / revLTM : 0, evEbitdaLTM: ebitdaLTM ? ev / ebitdaLTM : 0, evEbitdaNTM: ebitdaNTM ? ev / ebitdaNTM : 0,
    wacc, g, tax, midYear,
  }
}

export function exportModelXlsx(deal: Deal, a: Analysis, mandate: Mandate): void {
  XLSX.writeFile(buildModelWorkbook(deal, a, mandate), `${slug(deal.name)}-valuation-model.xlsx`)
}

// Exported separately so the workbook can be inspected/tested without triggering a download.
export function buildModelWorkbook(deal: Deal, a: Analysis, _mandate: Mandate): XLSX.WorkBook {
  const wb = XLSX.utils.book_new()
  const S = buildStatements(deal)
  const dcf = buildDcf(deal, S)
  const asm = deal.assumptions
  const nA = S.actualCount
  const yearLabels = S.years.map((y) => y.label)
  const valDate = new Date().toISOString().slice(0, 10)
  // Excel columns B..H for year columns (statements use 7 years typically; generalise to nY)
  const nY = S.years.length

  // ════════════════════════════════════════════════════════════
  // SHEET 1 — Cover & Assumptions
  // ════════════════════════════════════════════════════════════
  const exitYear = yearLabels[yearLabels.length - 1]
  const horizonStr = `${nA}H + ${nY - nA}F years (exit ${exitYear})`
  const cov: Cell[][] = []
  cov.push([`${deal.name.toUpperCase()} — DETAILED VALUATION MODEL`])
  cov.push([`${deal.name} — integrated valuation model  |  Figures in USD millions  |  Valuation date: ${valDate}`])
  cov.push([])
  cov.push(['  COMPANY SNAPSHOT'])
  cov.push(['Deal target', deal.name])
  cov.push(['Sector / industry', deal.sector])
  cov.push(['Geography', deal.geography])
  cov.push(['Stage', deal.stage])
  cov.push(['Ticket size', `USD ${deal.ticketUSDm.toFixed(1)}m`])
  cov.push(['Reporting currency', 'USD'])
  cov.push(['Forecast horizon', horizonStr])
  cov.push(['Model confidence', a.dataTrustScore >= 70 ? 'high' : a.dataTrustScore >= 50 ? 'medium' : 'low'])
  cov.push([])
  cov.push(['  METHODOLOGY SUMMARY'])
  cov.push([deal.narrative.valuationVerdict || 'DCF + EV/Revenue multiples triangulation. EV→equity bridge nets debt, leases and NCI; comps cross-check the DCF.'])
  cov.push([])
  cov.push(['  OPERATING ASSUMPTIONS (drivers — historicals + forecast)'])
  const drvHdr: Cell[] = ['Driver', ...yearLabels, 'Rationale']
  cov.push(drvHdr)
  const actLabel: Cell[] = [''].concat(S.years.map((y) => (y.actual ? 'Actual' : 'Forecast')) as string[]).concat([''])
  cov.push(actLabel)
  // driver rows: revenue growth, EBITDA margin (forecast years are inputs)
  const covGrowthRow = cov.length
  cov.push(['Revenue growth (YoY %)', ...S.pnl.map((p) => p.revenueGrowthPct / 100), 'Per-year growth driver'])
  const covMarginRow = cov.length
  cov.push(['EBITDA margin %', ...S.pnl.map((p) => p.ebitdaMarginPct / 100), 'Operating leverage path'])
  cov.push([])
  const valAsmHdr = cov.length
  cov.push(['  VALUATION ASSUMPTIONS (DCF)'])
  cov.push(['Driver', 'Value', 'Rationale'])
  const covWaccRow = cov.length
  cov.push(['WACC (%)', dcf.wacc, 'Discount rate'])
  cov.push(['Terminal growth (g, %)', dcf.g, 'Gordon perpetuity growth'])
  cov.push(['Tax rate (%)', dcf.tax, 'Long-run effective rate'])
  cov.push(['Net debt ($m)', dcf.netDebt, 'EV→equity bridge'])
  cov.push(['Exit EV/Revenue (x)', asm.exitEVRevenue, 'Return-model exit multiple'])
  cov.push(['Hold (years)', asm.holdYears, 'Assumed hold to exit'])
  cov.push([])
  const legendRow = cov.length
  cov.push(['  COLOR LEGEND & MODEL CONVENTIONS'])
  cov.push(['Blue text', 'Hardcoded inputs / assumptions (change these)'])
  cov.push(['Black text', 'Formulas & calculations'])
  cov.push(['Grey fill', 'Subtotal / total rows'])
  cov.push(['Green fill', 'Audit / check rows (must equal zero or PASS)'])
  cov.push(['Red fill', 'Failed checks — review before relying on output'])
  cov.push([])
  cov.push(['Generated', new Date().toLocaleString('en-US')])
  const covWs = sheet(cov, [34, 13, 13, 13, 13, 13, 13, 13, 40]) as unknown as AnyWS
  titleRow(covWs)
  sectionRow(covWs, 3, 0, 8); sectionRow(covWs, 13, 0, 8); sectionRow(covWs, 16, 0, 8)
  sectionRow(covWs, valAsmHdr, 0, 8); sectionRow(covWs, legendRow, 0, 8)
  headerRow(covWs, 17, 0, nY + 1); st(covWs, 18, 0, { font: { italic: true, sz: 9, color: { rgb: MU } } })
  for (let c = 1; c <= nY; c++) st(covWs, 18, c, { font: { bold: true, sz: 9, color: { rgb: MU } }, alignment: { horizontal: 'right' } })
  // driver inputs: forecast columns are blue inputs; actuals are plain
  for (let c = 1; c <= nY; c++) {
    const isF = !S.years[c - 1].actual
    if (isF) { inputCell(covWs, covGrowthRow, c, Z.pct); inputCell(covWs, covMarginRow, c, Z.pct) }
    else { st(covWs, covGrowthRow, c, { numFmt: Z.pct, alignment: { horizontal: 'right' } }); st(covWs, covMarginRow, c, { numFmt: Z.pct, alignment: { horizontal: 'right' } }) }
  }
  st(covWs, valAsmHdr + 1, 0, { font: { bold: true, sz: 9, color: { rgb: MU } } }); st(covWs, valAsmHdr + 1, 1, { font: { bold: true, sz: 9, color: { rgb: MU } } })
  inputCell(covWs, covWaccRow, 1, Z.pct); inputCell(covWs, covWaccRow + 1, 1, Z.pct); inputCell(covWs, covWaccRow + 2, 1, Z.pct)
  inputCell(covWs, covWaccRow + 3, 1, Z.m); inputCell(covWs, covWaccRow + 4, 1, Z.mult); inputCell(covWs, covWaccRow + 5, 1, Z.ratio)
  // legend swatches
  st(covWs, legendRow + 1, 0, { font: { bold: true, color: { rgb: IFT } } })
  st(covWs, legendRow + 3, 1, { fill: { fgColor: { rgb: GREY } } }); st(covWs, legendRow + 3, 0, { fill: { fgColor: { rgb: GREY } } })
  st(covWs, legendRow + 4, 1, { fill: { fgColor: { rgb: GREEN } } }); st(covWs, legendRow + 4, 0, { fill: { fgColor: { rgb: GREEN } } })
  st(covWs, legendRow + 5, 1, { fill: { fgColor: { rgb: RED } } }); st(covWs, legendRow + 5, 0, { fill: { fgColor: { rgb: RED } } })
  XLSX.utils.book_append_sheet(wb, covWs, '1. Cover & Assumptions')

  // ── helper: a year-columned statement header (cols B..) ──
  const yrHeader = (label: string): [Cell[], Cell[], Cell[]] => {
    const h1: Cell[] = [label]
    const h2: Cell[] = ['(figures in USD millions)', ...yearLabels]
    const h3: Cell[] = ['', ...S.years.map((y) => (y.actual ? 'Actual' : 'Forecast')) as string[]]
    return [h1, h2, h3]
  }
  // Excel address for a statement value cell: row R (1-based), year index yi (0-based → col B+yi)
  const yc = (yi: number) => colL(1 + yi)

  // ════════════════════════════════════════════════════════════
  // SHEET 2 — Income Statement
  // ════════════════════════════════════════════════════════════
  {
    const rows: Cell[][] = []
    const [h1, h2, h3] = yrHeader('CONSOLIDATED STATEMENT OF PROFIT OR LOSS')
    rows.push(h1); rows.push([]); rows.push(h2); rows.push(h3)
    const RREV = 5, RCOGS = 7, ROI = 10, ROPEX = 14, RDNA = 17
    rows.push(['Revenue', ...S.pnl.map((p) => p.revenue)]) // 5
    rows.push(['Revenue growth (YoY %)', ...S.pnl.map((p, i) => (i === 0 ? p.revenueGrowthPct / 100 : f(`${yc(i)}${RREV}/${yc(i - 1)}${RREV}-1`, p.revenueGrowthPct / 100)))]) // 6
    rows.push(['Cost of sales', ...S.pnl.map((p) => -p.cogs)]) // 7
    rows.push(['Gross profit', ...S.pnl.map((p, i) => f(`${yc(i)}${RREV}+${yc(i)}${RCOGS}`, p.grossProfit))]) // 8
    rows.push(['Gross margin %', ...S.pnl.map((p, i) => f(`${yc(i)}8/${yc(i)}${RREV}`, p.grossMarginPct / 100))]) // 9
    rows.push(['Other income', ...S.pnl.map((p) => p.otherIncome)]) // 10
    rows.push(['Operating expenses', ...S.pnl.map((p) => -p.opex)]) // 11 (combined opex)
    rows.push(['Staff & other operating', ...S.pnl.map(() => 0)]) // 12 placeholder kept 0
    rows.push(['Impairment / provisions', ...S.pnl.map(() => 0)]) // 13
    rows.push(['Total operating expenses', ...S.pnl.map((p, i) => f(`${yc(i)}11+${yc(i)}12+${yc(i)}13`, -p.opex))]) // 14
    rows.push(['EBITDA', ...S.pnl.map((p, i) => f(`${yc(i)}8+${yc(i)}${ROI}+${yc(i)}${ROPEX}`, p.ebitda))]) // 15
    rows.push(['EBITDA margin %', ...S.pnl.map((p, i) => f(`${yc(i)}15/${yc(i)}${RREV}`, p.ebitdaMarginPct / 100))]) // 16
    rows.push(['Depreciation & amortisation', ...S.pnl.map((p) => -p.dna)]) // 17
    rows.push(['EBIT / Operating profit', ...S.pnl.map((p, i) => f(`${yc(i)}15+${yc(i)}${RDNA}`, p.ebit))]) // 18
    rows.push(['EBIT margin %', ...S.pnl.map((p, i) => f(`${yc(i)}18/${yc(i)}${RREV}`, p.ebit / (p.revenue || 1)))]) // 19
    rows.push(['Finance income', ...S.pnl.map((p) => p.financeIncome)]) // 20
    rows.push(['Finance costs', ...S.pnl.map((p) => -p.financeCosts)]) // 21
    rows.push(['Net finance costs', ...S.pnl.map((p, i) => f(`${yc(i)}20+${yc(i)}21`, p.financeIncome - p.financeCosts))]) // 22
    rows.push(['Profit before tax', ...S.pnl.map((p, i) => f(`${yc(i)}18+${yc(i)}22`, p.pbt))]) // 23
    rows.push(['Income tax expense', ...S.pnl.map((p) => -p.tax)]) // 24
    rows.push(['Net profit for the year', ...S.pnl.map((p, i) => f(`${yc(i)}23+${yc(i)}24`, p.netIncome))]) // 25
    rows.push(['Net margin %', ...S.pnl.map((p, i) => f(`${yc(i)}25/${yc(i)}${RREV}`, p.netMarginPct / 100))]) // 26
    const km = rows.length
    rows.push(['  KEY METRICS SUMMARY']) // 27
    rows.push(['EBITDA', ...S.pnl.map((p, i) => f(`${yc(i)}15`, p.ebitda))]) // 28
    rows.push(['EBIT', ...S.pnl.map((p, i) => f(`${yc(i)}18`, p.ebit))]) // 29
    rows.push(['NOPAT', ...S.pnl.map((p, i) => f(`${yc(i)}18*(1-${dcf.tax})`, p.ebit * (1 - dcf.tax)))]) // 30
    const ws = sheet(rows, [30, ...yearLabels.map(() => 12)]) as unknown as AnyWS
    titleRow(ws); headerRow(ws, 2, 0, nY); st(ws, 3, 0, {})
    for (let c = 1; c <= nY; c++) st(ws, 3, c, { font: { bold: true, sz: 9, color: { rgb: MU } }, alignment: { horizontal: 'right' } })
    const pctRows = new Set([6, 9, 16, 19, 26])
    for (let R = 5; R <= 30; R++) { for (let c = 1; c <= nY; c++) numCol(ws, c, R - 1, R - 1, pctRows.has(R) ? Z.pct : Z.m) }
    totalRow(ws, 8 - 1, 0, nY, Z.m); totalRow(ws, 15 - 1, 0, nY, Z.m); totalRow(ws, 18 - 1, 0, nY, Z.m); totalRow(ws, 23 - 1, 0, nY, Z.m); totalRow(ws, 25 - 1, 0, nY, Z.m); totalRow(ws, 14 - 1, 0, nY, Z.m)
    sectionRow(ws, km, 0, nY)
    XLSX.utils.book_append_sheet(wb, ws, '2. Income Statement')
  }

  // ════════════════════════════════════════════════════════════
  // SHEET 3 — Balance Sheet
  // ════════════════════════════════════════════════════════════
  {
    const rows: Cell[][] = []
    const [h1, , h2] = yrHeader('CONSOLIDATED STATEMENT OF FINANCIAL POSITION')
    rows.push(h1); rows.push([]); rows.push(['(figures in USD millions)', ...yearLabels]); rows.push(h2)
    rows.push(['  ASSETS — Non-current']) // 5
    rows.push(['Property, plant & equipment', ...S.bs.map((b) => b.ppe)]) // 6
    rows.push(['Intangible assets & goodwill', ...S.bs.map((b) => b.intangibles)]) // 7
    rows.push(['Investments in associates / JVs', ...S.bs.map((b) => b.otherNonCurrentAssets)]) // 8 (proxy)
    rows.push(['Other non-current assets', ...S.bs.map(() => 0)]) // 9
    rows.push(['Total non-current assets', ...S.bs.map((b, i) => f(`SUM(${yc(i)}6:${yc(i)}9)`, b.totalNonCurrentAssets))]) // 10
    rows.push(['  ASSETS — Current']) // 11
    rows.push(['Inventory', ...S.bs.map((b) => b.inventory)]) // 12
    rows.push(['Trade & other receivables', ...S.bs.map((b) => b.receivables)]) // 13
    rows.push(['Other current assets', ...S.bs.map((b) => b.otherCurrentAssets)]) // 14
    rows.push(['Cash & equivalents', ...S.bs.map((b) => b.cash)]) // 15
    rows.push(['Total current assets', ...S.bs.map((b, i) => f(`SUM(${yc(i)}12:${yc(i)}15)`, b.totalCurrentAssets))]) // 16
    rows.push(['TOTAL ASSETS', ...S.bs.map((b, i) => f(`${yc(i)}10+${yc(i)}16`, b.totalAssets))]) // 17
    rows.push(['  EQUITY']) // 18
    rows.push(['Share capital', ...S.bs.map((b) => b.shareCapital)]) // 19
    rows.push(['Retained earnings', ...S.bs.map((b) => b.retainedEarnings)]) // 20
    rows.push(['Other reserves', ...S.bs.map((b) => b.reserves)]) // 21
    rows.push(['Non-controlling interests', ...S.bs.map((b) => b.nci)]) // 22
    rows.push(['Total equity', ...S.bs.map((b, i) => f(`SUM(${yc(i)}19:${yc(i)}22)`, b.totalEquity))]) // 23
    rows.push(['  LIABILITIES — Non-current']) // 24
    rows.push(['Long-term debt', ...S.bs.map((b) => b.longTermDebt)]) // 25
    rows.push(['Lease liabilities', ...S.bs.map((b) => b.leases)]) // 26
    rows.push(['Other non-current liabilities', ...S.bs.map((b) => b.otherNonCurrentLiab)]) // 27
    rows.push(['Total non-current liabilities', ...S.bs.map((b, i) => f(`SUM(${yc(i)}25:${yc(i)}27)`, b.longTermDebt + b.leases + b.otherNonCurrentLiab))]) // 28
    rows.push(['  LIABILITIES — Current']) // 29
    rows.push(['Trade & other payables', ...S.bs.map((b) => b.payables)]) // 30
    rows.push(['Short-term / current debt', ...S.bs.map((b) => b.shortTermDebt)]) // 31
    rows.push(['Other current liabilities', ...S.bs.map((b) => b.otherCurrentLiab)]) // 32
    rows.push(['Total current liabilities', ...S.bs.map((b, i) => f(`SUM(${yc(i)}30:${yc(i)}32)`, b.payables + b.shortTermDebt + b.otherCurrentLiab))]) // 33
    rows.push(['Total liabilities', ...S.bs.map((b, i) => f(`${yc(i)}28+${yc(i)}33`, b.totalLiabilities))]) // 34
    rows.push(['TOTAL EQUITY & LIABILITIES', ...S.bs.map((b, i) => f(`${yc(i)}23+${yc(i)}34`, b.totalEquityAndLiabilities))]) // 35
    rows.push(['  DEBT SUMMARY & BS INTEGRITY']) // 36
    rows.push(['Total debt (LT + ST + current portion)', ...S.bs.map((b, i) => f(`${yc(i)}25+${yc(i)}31`, b.longTermDebt + b.shortTermDebt))]) // 37
    rows.push(['Net debt (Total debt − Cash)', ...S.bs.map((b, i) => f(`${yc(i)}37-${yc(i)}15`, b.netDebt))]) // 38
    rows.push(['Audit: Total Assets − Total E&L (must = 0)', ...S.bs.map((b, i) => f(`${yc(i)}17-${yc(i)}35`, b.balanceGap))]) // 39
    const ws = sheet(rows, [40, ...yearLabels.map(() => 12)]) as unknown as AnyWS
    titleRow(ws); headerRow(ws, 3, 0, nY)
    for (let c = 1; c <= nY; c++) st(ws, 2, c, { font: { bold: true, sz: 9, color: { rgb: MU } }, alignment: { horizontal: 'right' } })
    const dataRows = [6, 7, 8, 9, 12, 13, 14, 15, 19, 20, 21, 22, 25, 26, 27, 30, 31, 32, 37, 38]
    for (const R of dataRows) for (let c = 1; c <= nY; c++) numCol(ws, c, R - 1, R - 1, Z.m)
    for (const R of [10, 16, 17, 23, 28, 33, 34, 35]) totalRow(ws, R - 1, 0, nY, Z.m)
    for (const R of [5, 11, 18, 24, 29, 36]) sectionRow(ws, R - 1, 0, nY)
    // audit row 39 — green if all balances within tolerance
    const auditPass = S.bs.every((b) => Math.abs(b.balanceGap) < 0.5)
    auditRow(ws, 38, 0, nY, auditPass, Z.m)
    XLSX.utils.book_append_sheet(wb, ws, '3. Balance Sheet')
  }

  // ════════════════════════════════════════════════════════════
  // SHEET 4 — Cash Flow
  // ════════════════════════════════════════════════════════════
  {
    const rows: Cell[][] = []
    const [h1, , h2] = yrHeader('CONSOLIDATED STATEMENT OF CASH FLOWS (Indirect method)')
    rows.push(h1); rows.push([]); rows.push(['(figures in USD millions)', ...yearLabels]); rows.push(h2)
    rows.push(['  CASH FLOWS FROM OPERATING ACTIVITIES']) // 5
    rows.push(['Net profit', ...S.cf.map((c) => c.netIncome)]) // 6
    rows.push(['Add: Depreciation & amortisation', ...S.cf.map((c) => c.dna)]) // 7
    rows.push(['Change in receivables', ...S.cf.map((c) => c.changeReceivables)]) // 8
    rows.push(['Change in inventory', ...S.cf.map((c) => c.changeInventory)]) // 9
    rows.push(['Change in payables', ...S.cf.map((c) => c.changePayables)]) // 10
    rows.push(['Net cash from operating activities', ...S.cf.map((c, i) => f(`SUM(${yc(i)}6:${yc(i)}10)`, c.cfo))]) // 11
    rows.push(['  CASH FLOWS FROM INVESTING ACTIVITIES']) // 12
    rows.push(['Capital expenditure', ...S.cf.map((c) => c.capex)]) // 13
    rows.push(['Net cash used in investing activities', ...S.cf.map((c, i) => f(`${yc(i)}13`, c.cfi))]) // 14
    rows.push(['  CASH FLOWS FROM FINANCING ACTIVITIES']) // 15
    rows.push(['Net change in debt', ...S.cf.map((c) => c.debtChange)]) // 16
    rows.push(['Dividends paid', ...S.cf.map((c) => c.dividends)]) // 17
    rows.push(['Net cash from / (used in) financing activities', ...S.cf.map((c, i) => f(`${yc(i)}16+${yc(i)}17`, c.cff))]) // 18
    rows.push(['  CASH FLOW SUMMARY']) // 19
    rows.push(['NET INCREASE / (DECREASE) IN CASH', ...S.cf.map((c, i) => f(`${yc(i)}11+${yc(i)}14+${yc(i)}18`, c.netChangeInCash))]) // 20
    rows.push(['Free cash flow to firm (FCFF)', ...S.cf.map((c, i) => f(`${yc(i)}11+${yc(i)}14`, c.cfo + c.cfi))]) // 21
    const ws = sheet(rows, [42, ...yearLabels.map(() => 12)]) as unknown as AnyWS
    titleRow(ws); headerRow(ws, 3, 0, nY)
    for (let c = 1; c <= nY; c++) st(ws, 2, c, { font: { bold: true, sz: 9, color: { rgb: MU } }, alignment: { horizontal: 'right' } })
    for (const R of [6, 7, 8, 9, 10, 13, 16, 17]) for (let c = 1; c <= nY; c++) numCol(ws, c, R - 1, R - 1, Z.m)
    for (const R of [11, 14, 18, 20, 21]) totalRow(ws, R - 1, 0, nY, Z.m)
    for (const R of [5, 12, 15, 19]) sectionRow(ws, R - 1, 0, nY)
    XLSX.utils.book_append_sheet(wb, ws, '4. Cash Flow')
  }

  // ════════════════════════════════════════════════════════════
  // SHEET 5 — DCF Valuation
  // ════════════════════════════════════════════════════════════
  let dcfEvCell = 'G27', dcfEqCell = 'G33'
  {
    const nF = dcf.fLabels.length
    const rows: Cell[][] = []
    rows.push(['DCF VALUATION'])
    rows.push([`Unlevered FCF approach  |  Enterprise → Equity bridge  |  Valuation date: ${valDate}`])
    rows.push([])
    rows.push(['(figures in USD millions)', ...dcf.fLabels, 'Terminal']) // 4
    rows.push(['  UNLEVERED FREE CASH FLOW BUILD-UP']) // 5
    const tcol = colL(1 + nF) // terminal column letter
    rows.push(['EBIT', ...dcf.ebit]) // 6
    rows.push(['NOPAT (EBIT × (1 − tax))', ...dcf.ebit.map((_e, i) => f(`${yc(i)}6*(1-${dcf.tax})`, dcf.nopat[i]))]) // 7
    rows.push(['Add: Depreciation & amortisation', ...dcf.dna]) // 8
    rows.push(['Less: Capex', ...dcf.capex]) // 9
    rows.push(['Less: Change in working capital', ...dcf.dWc]) // 10
    rows.push(['Unlevered free cash flow', ...dcf.ufcf.map((u, i) => f(`${yc(i)}7+${yc(i)}8+${yc(i)}9+${yc(i)}10`, u))]) // 11
    rows.push([]) // 12
    rows.push(['  DISCOUNTING TO PRESENT VALUE']) // 13
    rows.push(['Discount period (years)', ...dcf.period]) // 14
    rows.push(['Discount factor', ...dcf.df.map((d, i) => f(`1/(1+${dcf.wacc})^${yc(i)}14`, d))]) // 15
    rows.push(['PV of UFCF', ...dcf.pv.map((p, i) => f(`${yc(i)}11*${yc(i)}15`, p))]) // 16
    rows.push([]) // 17
    rows.push(['  TERMINAL VALUE']) // 18
    rows.push(['Method', deal.model?.valuation.terminalMethod === 'exit-multiple' ? 'Exit multiple' : 'Gordon growth']) // 19
    rows.push(['Formula', `UFCF(yN) × (1 + g) / (WACC − g), g=${(dcf.g * 100).toFixed(1)}%`]) // 20
    const tvRow: Cell[] = ['Terminal value']; for (let i = 0; i < nF; i++) tvRow.push(''); tvRow.push(f(`${colL(nF)}11*(1+${dcf.g})/(${dcf.wacc}-${dcf.g})`, dcf.tv)); rows.push(tvRow) // 21
    const pvtvRow: Cell[] = ['PV of terminal value']; for (let i = 0; i < nF; i++) pvtvRow.push(''); pvtvRow.push(f(`${tcol}21/(1+${dcf.wacc})^${colL(nF)}14`, dcf.pvTerminal)); rows.push(pvtvRow) // 22
    rows.push([]) // 23
    rows.push(['  ENTERPRISE → EQUITY VALUE BRIDGE']) // 24
    const term = (label: string, formula: string, v: number): Cell[] => { const a: Cell[] = [label]; for (let i = 0; i < nF; i++) a.push(''); a.push(f(formula, v)); return a }
    rows.push(term('Sum of PV of explicit forecast', `SUM(B16:${colL(nF)}16)`, dcf.sumPv)) // 25
    rows.push(term('PV of Terminal value', `${tcol}22`, dcf.pvTerminal)) // 26
    rows.push(term('Enterprise Value (EV)', `${tcol}25+${tcol}26`, dcf.ev)) // 27
    rows.push(term('% of EV from terminal value', `${tcol}26/${tcol}27`, dcf.termPctEv)) // 28
    rows.push(term('Less: Net debt', `${dcf.netDebt}`, dcf.netDebt)) // 29
    rows.push(term('Plus: Investments in associates / JVs', `${dcf.associates}`, dcf.associates)) // 30
    rows.push(term('Less: Lease liabilities', `${-dcf.leases}`, -dcf.leases)) // 31
    rows.push(term('Less: Non-controlling interests', `${-dcf.nci}`, -dcf.nci)) // 32
    rows.push(term('Equity Value', `${tcol}27-${tcol}29+${tcol}30+${tcol}31+${tcol}32`, dcf.equity)) // 33
    rows.push([]) // 34
    rows.push(['  IMPLIED VALUATION MULTIPLES']) // 35
    rows.push(term('EV / Revenue (LTM)', `${tcol}27/${S.pnl[nA - 1].revenue}`, dcf.evRevLTM)) // 36
    rows.push(term('EV / EBITDA (LTM)', `${tcol}27/${S.pnl[nA - 1].ebitda || 1}`, dcf.evEbitdaLTM)) // 37
    rows.push(term('EV / EBITDA (NTM)', `${tcol}27/${S.pnl[nA].ebitda || 1}`, dcf.evEbitdaNTM)) // 38
    rows.push([]) // 39
    rows.push(['  HEADLINE SUMMARY']) // 40
    rows.push(term('Sum of PV (explicit forecast)', `${tcol}25`, dcf.sumPv)) // 41
    rows.push(term('PV of terminal value', `${tcol}26`, dcf.pvTerminal)) // 42
    rows.push(term('Enterprise Value (EV)', `${tcol}27`, dcf.ev)) // 43
    rows.push(term('% of EV from terminal value', `${tcol}28`, dcf.termPctEv)) // 44
    rows.push(term('Less: Net debt', `-${tcol}29`, -dcf.netDebt)) // 45
    rows.push(term('Plus: Associates', `${tcol}30`, dcf.associates)) // 46
    rows.push(term('Less: Leases', `-${tcol}31`, dcf.leases)) // 47
    rows.push(term('Less: NCI', `-${tcol}32`, dcf.nci)) // 48
    rows.push(term('Equity Value', `${tcol}33`, dcf.equity)) // 49
    const widths = [38, ...dcf.fLabels.map(() => 12), 14]
    const ws = sheet(rows, widths) as unknown as AnyWS
    titleRow(ws); headerRow(ws, 3, 0, nF + 1)
    for (const R of [5, 13, 18, 24, 35, 40]) sectionRow(ws, R - 1, 0, nF + 1)
    for (const R of [6, 7, 8, 9, 10, 16]) for (let c = 1; c <= nF; c++) numCol(ws, c, R - 1, R - 1, Z.m)
    for (let c = 1; c <= nF; c++) { numCol(ws, c, 13, 13, Z.ratio); numCol(ws, c, 14, 14, Z.ratio) } // period, df
    totalRow(ws, 10, 0, nF, Z.m) // UFCF row 11
    const tc = 1 + nF
    numCol(ws, tc, 20, 20, Z.m); numCol(ws, tc, 21, 21, Z.m)
    for (const R of [25, 26, 27, 29, 30, 31, 32, 41, 42, 43, 45, 46, 47, 48]) numCol(ws, tc, R - 1, R - 1, Z.m)
    numCol(ws, tc, 27, 27, Z.pct); numCol(ws, tc, 43, 43, Z.pct)
    for (const R of [36, 37, 38]) numCol(ws, tc, R - 1, R - 1, Z.mult)
    totalRow(ws, 26, 0, tc, Z.m); st(ws, 26, tc, { numFmt: Z.m, font: { bold: true, color: { rgb: NV } }, fill: { fgColor: { rgb: GREY } }, alignment: { horizontal: 'right' } })
    totalRow(ws, 32, 0, tc, Z.m); st(ws, 32, tc, { numFmt: Z.m, font: { bold: true, color: { rgb: NV } }, fill: { fgColor: { rgb: GREY } }, alignment: { horizontal: 'right' } })
    totalRow(ws, 48, 0, tc, Z.m); st(ws, 48, tc, { numFmt: Z.m, font: { bold: true, color: { rgb: NV } }, fill: { fgColor: { rgb: GREY } }, alignment: { horizontal: 'right' } })
    dcfEvCell = `${tcol}27`; dcfEqCell = `${tcol}33`
    XLSX.utils.book_append_sheet(wb, ws, '5. DCF Valuation')
  }

  // ════════════════════════════════════════════════════════════
  // SHEET 6 — Sensitivity
  // ════════════════════════════════════════════════════════════
  {
    const baseWacc = dcf.wacc * 100, baseG = dcf.g * 100
    const waccAxis = [-2, -1, 0, 1, 2].map((x) => Math.round((baseWacc + x) * 10) / 10)
    const gAxis = [-1, -0.5, 0, 0.5, 1].map((x) => Math.round((baseG + x) * 10) / 10)
    const grid = waccAxis.map((w) => gAxis.map((g) => buildDcf(deal, S, w, g).equity))
    const rows: Cell[][] = []
    rows.push(['SENSITIVITY & SCENARIO ANALYSIS'])
    rows.push(['Equity value sensitivity to WACC and terminal growth rate'])
    rows.push([])
    rows.push(['  EQUITY VALUE GRID']) // 4
    rows.push(['WACC ↓  /  Terminal growth rate (g) →', ...gAxis.map((g) => g / 100)]) // 5
    waccAxis.forEach((w, ri) => rows.push([w / 100, ...grid[ri]])) // 6..10
    rows.push([]) // 11
    rows.push([`Base case: WACC ${baseWacc.toFixed(1)}%, g ${baseG.toFixed(1)}% → Equity ${dcf.equity.toFixed(0)}`]) // 12
    rows.push([]) // 13
    rows.push(['  SCENARIO TABLE — EQUITY VALUE OUTCOMES']) // 14
    rows.push(['Scenario', 'WACC', 'Terminal g', 'Revenue growth (avg)', 'EBITDA margin (exit)', 'Equity Value', 'Narrative']) // 15
    const gAvg = meanOf(asm.revGrowthPct) / 100
    const exitMargin = asm.ebitdaMarginPct[asm.ebitdaMarginPct.length - 1] / 100
    const nar = deal.narrative.scenarioNarratives
    const dEq = buildDcf(deal, S, baseWacc + 1, baseG - 0.5).equity
    const uEq = buildDcf(deal, S, baseWacc - 1, baseG + 0.5).equity
    rows.push(['Downside', (baseWacc + 1) / 100, (baseG - 0.5) / 100, gAvg * 0.55, exitMargin * 0.7, dEq, nar?.bear ?? (deal.narrative.caseAgainst[0] ?? 'Downside scenario')]) // 16
    rows.push(['Base', baseWacc / 100, baseG / 100, gAvg, exitMargin, dcf.equity, nar?.base ?? deal.narrative.icThesis]) // 17
    rows.push(['Upside', (baseWacc - 1) / 100, (baseG + 0.5) / 100, gAvg * 1.35, exitMargin * 1.3, uEq, nar?.bull ?? (deal.narrative.caseFor[0] ?? 'Upside scenario')]) // 18
    rows.push([]) // 19
    rows.push(['  COMMENTARY ON SCENARIOS']) // 20
    const compsMid = a.assetValue.compsEquity.mid
    rows.push([`• DCF equity USD ${dcf.equity.toFixed(0)}m vs Entry / current ask USD ${deal.ask.askValuationUSDm.toFixed(0)}m (${(deal.ask.askValuationUSDm ? Math.round((dcf.equity / deal.ask.askValuationUSDm - 1) * 100) : 0)}%).`]) // 21
    rows.push([`• DCF equity USD ${dcf.equity.toFixed(0)}m vs Comps-implied mid USD ${compsMid.toFixed(0)}m (${(compsMid ? Math.round((dcf.equity / compsMid - 1) * 100) : 0)}%).`]) // 22
    const ws = sheet(rows, [38, 13, 13, 20, 20, 16, 80]) as unknown as AnyWS
    titleRow(ws); sectionRow(ws, 3, 0, 6); sectionRow(ws, 13, 0, 6); sectionRow(ws, 19, 0, 6)
    for (let c = 1; c <= gAxis.length; c++) numCol(ws, c, 4, 4, Z.pct)
    for (let r = 5; r <= 9; r++) { numCol(ws, 0, r, r, Z.pct); for (let c = 1; c <= gAxis.length; c++) numCol(ws, c, r, r, Z.m) }
    // highlight base cell (row index 5+2=7, col 1+2=3)
    st(ws, 7, 3, { fill: { fgColor: { rgb: GREY } }, font: { bold: true, color: { rgb: NV } } })
    headerRow(ws, 14, 0, 6)
    for (let r = 15; r <= 17; r++) { numCol(ws, 1, r, r, Z.pct); numCol(ws, 2, r, r, Z.pct); numCol(ws, 3, r, r, Z.pct); numCol(ws, 4, r, r, Z.pct); numCol(ws, 5, r, r, Z.m); st(ws, r, 6, { alignment: { wrapText: true, vertical: 'top' } }) }
    XLSX.utils.book_append_sheet(wb, ws, '6. Sensitivity')
  }

  // ════════════════════════════════════════════════════════════
  // SHEET 7 — Peer Comps
  // ════════════════════════════════════════════════════════════
  {
    const peers = deal.peers
    const evRevs = peers.map((p) => p.evRevenue).filter((x): x is number => typeof x === 'number')
    const evEbitdas = peers.map((p) => p.evEbitda).filter((x): x is number => typeof x === 'number')
    const medRev = median(evRevs), meanRev = meanOf(evRevs)
    const medEbitda = evEbitdas.length ? median(evEbitdas) : 0
    const baseRev = S.pnl[nA - 1].revenue
    const baseEbitda = S.pnl[nA - 1].ebitda
    const rows: Cell[][] = []
    rows.push(['PEER TRADING MULTIPLES BENCHMARK'])
    rows.push(['Listed peers — multiples are benchmark only; refresh via market-data feed at run time'])
    rows.push([])
    rows.push(['Peer Company', 'Ticker', 'Country', 'EV / Revenue', 'EV / EBITDA (NTM)', 'Rev growth %', 'EBITDA margin %', 'Basis']) // 4
    const firstPeer = 5
    peers.forEach((p) => rows.push([p.name, p.public ? 'Listed' : 'Private', '—', p.evRevenue ?? '', p.evEbitda ?? '', (p.revGrowthPct ?? 0) / 100, (p.ebitdaMarginPct ?? 0) / 100, p.basis])) // 5..
    const lastPeer = 4 + peers.length
    rows.push([]) // blank
    const medRow = rows.length + 1
    rows.push(['MEDIAN', '', '', f(`MEDIAN(D${firstPeer}:D${lastPeer})`, medRev), evEbitdas.length ? f(`MEDIAN(E${firstPeer}:E${lastPeer})`, medEbitda) : '', '', '', '']) // median
    rows.push(['MEAN', '', '', f(`AVERAGE(D${firstPeer}:D${lastPeer})`, meanRev), evEbitdas.length ? f(`AVERAGE(E${firstPeer}:E${lastPeer})`, meanOf(evEbitdas)) : '', '', '', '']) // mean
    rows.push([]) // blank
    const implHdr = rows.length + 1
    rows.push(['  IMPLIED VALUATION FROM PEER MEDIANS']) // section
    rows.push(['Metric', 'Multiple', '', 'Applied to (base)', '', '', 'Implied EV', '']) // header
    const evRevImplRow = rows.length + 1
    rows.push(['EV/Revenue (peer median)', f(`D${medRow}`, medRev), '', baseRev, '', '', f(`B${evRevImplRow}*D${evRevImplRow}`, medRev * baseRev), '']) // implied rev
    const evEbImplRow = rows.length + 1
    rows.push(['EV/EBITDA (peer median)', evEbitdas.length ? f(`E${medRow}`, medEbitda) : 0, '', baseEbitda, '', '', f(`B${evEbImplRow}*D${evEbImplRow}`, medEbitda * baseEbitda), '']) // implied ebitda
    rows.push([]) // blank
    rows.push(['Implied EV from DCF (for comparison)', '', '', '', '', '', f(`'5. DCF Valuation'!${dcfEvCell}`, dcf.ev), '']) // dcf compare
    const ws = sheet(rows, [40, 12, 10, 16, 18, 14, 16, 14]) as unknown as AnyWS
    titleRow(ws); headerRow(ws, 3, 0, 7)
    for (let r = firstPeer - 1; r <= lastPeer - 1; r++) { inputCell(ws, r, 3, Z.mult); st(ws, r, 4, { numFmt: Z.mult, alignment: { horizontal: 'right' } }); numCol(ws, 5, r, r, Z.pct); numCol(ws, 6, r, r, Z.pct) }
    totalRow(ws, medRow - 1, 0, 7, Z.mult); totalRow(ws, medRow, 0, 7, Z.mult)
    numCol(ws, 3, medRow - 1, medRow, Z.mult); numCol(ws, 4, medRow - 1, medRow, Z.mult)
    sectionRow(ws, implHdr - 1, 0, 7); headerRow(ws, implHdr, 0, 7)
    for (const r of [evRevImplRow - 1, evEbImplRow - 1]) { numCol(ws, 1, r, r, Z.mult); numCol(ws, 3, r, r, Z.m); numCol(ws, 6, r, r, Z.m) }
    const dcfCmpRow = rows.length - 1
    numCol(ws, 6, dcfCmpRow, dcfCmpRow, Z.m); st(ws, dcfCmpRow, 0, { font: { bold: true, color: { rgb: NV } } })
    XLSX.utils.book_append_sheet(wb, ws, '7. Peer Comps')
  }

  // ════════════════════════════════════════════════════════════
  // SHEET 8 — Audit & Checks
  // ════════════════════════════════════════════════════════════
  {
    const rows: Cell[][] = []
    rows.push(['MODEL AUDIT & INTEGRITY CHECKS'])
    rows.push(['All checks must equal zero (or PASS) — failures highlighted in red'])
    rows.push([])
    rows.push(['Check', 'Value', 'Threshold', 'Status']) // 4
    const balPass = S.bs.every((b) => Math.abs(b.balanceGap) < 0.5)
    const maxGap = Math.max(...S.bs.map((b) => Math.abs(b.balanceGap)))
    const evBridge = Math.abs((dcf.sumPv + dcf.pvTerminal) - dcf.ev)
    const eqBridge = Math.abs((dcf.ev - dcf.netDebt - dcf.leases - dcf.nci + dcf.associates) - dcf.equity)
    const waccGtG = dcf.wacc > dcf.g
    const checks: [string, number | string, string, boolean][] = [
      ['Balance sheet balances (max |Assets − E&L|)', Number(maxGap.toFixed(3)), '< 0.5', balPass],
      ['DCF: EV = ΣPV + PV(TV)', Number(evBridge.toFixed(3)), '≈ 0', evBridge < 0.5],
      ['DCF: Equity = EV − net debt − leases − NCI + assoc.', Number(eqBridge.toFixed(3)), '≈ 0', eqBridge < 0.5],
      ['WACC > terminal g (Gordon validity)', waccGtG ? 1 : 0, '= 1 (PASS)', waccGtG],
      ['Terminal value share of EV', Number((dcf.termPctEv * 100).toFixed(1)), '< 90%', dcf.termPctEv < 0.9],
      ['Engine integrity (coherence ledger)', a.integrity.blocking ? 1 : 0, '0 = PASS', !a.integrity.blocking],
    ]
    const firstCheck = rows.length + 1
    checks.forEach(([label, val, thr, pass]) => rows.push([label, val, thr, pass ? 'PASS' : 'FAIL']))
    rows.push([])
    rows.push(['  COHERENCE LEDGER (engine)']) // section
    a.integrity.checks.slice(0, 12).forEach((c) => rows.push([c.label, c.severity === 'pass' ? 'PASS' : c.severity.toUpperCase(), c.detail, c.severity === 'pass' ? 'PASS' : (c.severity === 'blocking' ? 'FAIL' : 'WARN')]))
    const ws = sheet(rows, [48, 14, 16, 12]) as unknown as AnyWS
    titleRow(ws); headerRow(ws, 3, 0, 3)
    checks.forEach((c, i) => { const r = firstCheck - 1 + i; auditRow(ws, r, 0, 3, c[3], typeof c[1] === 'number' ? Z.ratio : 'General'); st(ws, r, 1, { numFmt: Z.ratio, alignment: { horizontal: 'right' } }) })
    const ledgerHdr = firstCheck - 1 + checks.length + 1
    sectionRow(ws, ledgerHdr, 0, 3)
    a.integrity.checks.slice(0, 12).forEach((c, i) => { const r = ledgerHdr + 1 + i; const pass = c.severity === 'pass'; auditRow(ws, r, 0, 3, pass, 'General'); st(ws, r, 2, { alignment: { wrapText: true, vertical: 'top' } }) })
    XLSX.utils.book_append_sheet(wb, ws, '8. Audit & Checks')
  }

  // ════════════════════════════════════════════════════════════
  // SHEET 9 — Output Summary
  // ════════════════════════════════════════════════════════════
  {
    const rows: Cell[][] = []
    rows.push(['VALUATION OUTPUT SUMMARY'])
    rows.push([`${deal.name} — headline numbers, key metrics movement, and investment considerations`])
    rows.push([])
    rows.push(['  HEADLINE VALUATION']) // 4
    rows.push(['Methodology', 'Enterprise Value', 'Equity Value', 'Equity Value (secondary)', 'Note']) // 5
    const compsMid = a.assetValue.compsEquity.mid
    const medRev = median(deal.peers.map((p) => p.evRevenue).filter((x): x is number => typeof x === 'number'))
    const compsEv = medRev * S.pnl[nA - 1].revenue
    rows.push(['Discounted Cash Flow', f(`'5. DCF Valuation'!${dcfEvCell}`, dcf.ev), f(`'5. DCF Valuation'!${dcfEqCell}`, dcf.equity), '', 'Base case']) // 6
    rows.push(['Comparable multiples (median)', f(`'7. Peer Comps'!G15`, compsEv), compsMid, '', 'Peer-implied']) // 7
    const dEq2 = buildDcf(deal, S, dcf.wacc * 100 + 1, dcf.g * 100 - 0.5).equity
    const uEq2 = buildDcf(deal, S, dcf.wacc * 100 - 1, dcf.g * 100 + 0.5).equity
    rows.push(['Sensitivity range — downside', '', dEq2, '', '']) // 8
    rows.push(['Sensitivity range — upside', '', uEq2, '', '']) // 9
    rows.push([]) // 10
    rows.push(['  KEY OPERATING METRICS — BASE YEAR vs EXIT YEAR']) // 11
    rows.push(['Metric', 'Base year', 'Exit year', 'Δ change', '']) // 12
    const aN = S.years.length - 1
    const pctD = (a0: number, b0: number) => (a0 ? (b0 - a0) / Math.abs(a0) : 0)
    const opMetrics: [string, number, number, number, string][] = [
      ['Revenue', S.pnl[nA - 1].revenue, S.pnl[aN].revenue, pctD(S.pnl[nA - 1].revenue, S.pnl[aN].revenue), Z.m],
      ['EBITDA', S.pnl[nA - 1].ebitda, S.pnl[aN].ebitda, pctD(S.pnl[nA - 1].ebitda, S.pnl[aN].ebitda), Z.m],
      ['EBITDA margin', S.pnl[nA - 1].ebitdaMarginPct / 100, S.pnl[aN].ebitdaMarginPct / 100, 0, Z.pct],
      ['Net profit', S.pnl[nA - 1].netIncome, S.pnl[aN].netIncome, pctD(S.pnl[nA - 1].netIncome, S.pnl[aN].netIncome), Z.m],
      ['Net debt', S.bs[nA - 1].netDebt, S.bs[aN].netDebt, 0, Z.m],
      ['Net debt / EBITDA', S.pnl[nA - 1].ebitda ? S.bs[nA - 1].netDebt / S.pnl[nA - 1].ebitda : 0, S.pnl[aN].ebitda ? S.bs[aN].netDebt / S.pnl[aN].ebitda : 0, 0, Z.ratio],
    ]
    const firstMetric = rows.length + 1
    opMetrics.forEach(([l, b0, e0, d, ,]) => rows.push([l, b0, e0, d, '']))
    rows.push([]) // blank
    const pushBullets = (header: string, items: string[]) => {
      rows.push([`  ${header}`])
      items.forEach((t) => rows.push([`• ${t}`]))
      rows.push([])
    }
    const posStart = rows.length + 1
    pushBullets('KEY POSITIVES', deal.narrative.caseFor.length ? deal.narrative.caseFor : (deal.narrative.thesisDrivers ?? ['Category position and growth trajectory']))
    const riskStart = rows.length + 1
    const riskBullets = deal.narrative.caseAgainst.length ? deal.narrative.caseAgainst : deal.narrative.riskRegister.map((r) => `${r.risk}: ${r.impact}`)
    pushBullets('RISKS & CONCERNS', riskBullets)
    const limStart = rows.length + 1
    pushBullets('MODEL LIMITATIONS', deal.narrative.limitations.length ? deal.narrative.limitations : ['Forecast driven by assumption block; refresh with audited statements when available.'])
    const ws = sheet(rows, [52, 16, 16, 14, 22]) as unknown as AnyWS
    titleRow(ws)
    sectionRow(ws, 3, 0, 4); headerRow(ws, 4, 0, 4)
    for (const r of [5, 6, 7, 8]) { numCol(ws, 1, r, r, Z.m); numCol(ws, 2, r, r, Z.m); numCol(ws, 3, r, r, Z.m) }
    sectionRow(ws, 10, 0, 4); headerRow(ws, 11, 0, 4)
    opMetrics.forEach((m, i) => { const r = firstMetric - 1 + i; numCol(ws, 1, r, r, m[4]); numCol(ws, 2, r, r, m[4]); numCol(ws, 3, r, r, Z.pct) })
    sectionRow(ws, posStart - 1, 0, 4); sectionRow(ws, riskStart - 1, 0, 4); sectionRow(ws, limStart - 1, 0, 4)
    XLSX.utils.book_append_sheet(wb, ws, '9. Output Summary')
  }

  // ════════════════════════════════════════════════════════════
  // SHEET 10 — Scenarios
  // ════════════════════════════════════════════════════════════
  {
    const rows: Cell[][] = []
    rows.push(['SCENARIO ANALYSIS — DETAIL'])
    rows.push([])
    const nar = deal.narrative.scenarioNarratives
    const block = (title: string, text: string) => { rows.push([title]); rows.push(['Narrative', text]); rows.push([]) }
    block('DOWNSIDE', nar?.bear ?? (deal.narrative.caseAgainst.join(' ') || 'Downside: slower growth and multiple compression erode value.'))
    block('BASE', nar?.base ?? (deal.narrative.icThesis || deal.narrative.recommendationSummary || 'Base case: plan delivered.'))
    block('UPSIDE', nar?.bull ?? (deal.narrative.caseFor.join(' ') || 'Upside: faster growth and premium exit multiple.'))
    const ws = sheet(rows, [14, 110]) as unknown as AnyWS
    titleRow(ws)
    sectionRow(ws, 2, 0, 1); sectionRow(ws, 5, 0, 1); sectionRow(ws, 8, 0, 1)
    for (const r of [3, 6, 9]) st(ws, r, 1, { alignment: { wrapText: true, vertical: 'top' } })
    XLSX.utils.book_append_sheet(wb, ws, 'Scenarios')
  }

  wb.SheetNames = [
    '1. Cover & Assumptions', '2. Income Statement', '3. Balance Sheet', '4. Cash Flow', '5. DCF Valuation',
    '6. Sensitivity', '7. Peer Comps', '8. Audit & Checks', '9. Output Summary', 'Scenarios',
  ]
  // Force a full recalc when the workbook opens, so the live formulas evaluate immediately.
  wb.Workbook = Object.assign({}, wb.Workbook, { CalcPr: { fullCalcOnLoad: true } })
  return wb
}
