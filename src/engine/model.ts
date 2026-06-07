// ───────────────────────────────────────────────────────────
// Full 3-statement model engine.
//
// Pure & deterministic. Takes a deal's FinancialModel (historical ACTUALS + forward
// DRIVERS) and PROJECTS the forecast P&L, balance sheet and cash flow, then values them
// (DCF build-up → EV→equity bridge, implied multiples) and runs two sensitivity grids.
//
// The balance sheet balances BY CONSTRUCTION: cash is the cash-flow plug, retained
// earnings roll with net income, and every other line is driver-rolled — so
// ΔAssets ≡ ΔLiabilities + ΔEquity each period (proof in the change-in-cash build below),
// provided the authored ACTUAL balance sheet balances (checked in engine/validate.ts).
//
// Returns null when no model is present or it's structurally malformed — the UI degrades.
// ───────────────────────────────────────────────────────────
import type {
  BSRow,
  CFRow,
  DcfBuild,
  Deal,
  OperatingMetric,
  PnLRow,
  ProjectedModel,
  SensitivityGrid,
} from '@/types'

const r1 = (x: number) => Math.round(x * 10) / 10
const r2 = (x: number) => Math.round(x * 100) / 100
const pctChange = (a: number, b: number): number | null => (a === 0 ? null : r1(((b - a) / Math.abs(a)) * 100))

export function projectModel(deal: Deal): ProjectedModel | null {
  const m = deal.model
  if (!m) return null
  const nActual = m.years.filter((y) => y.actual).length
  const nForecast = m.years.length - nActual
  if (nActual < 1 || nForecast < 1) return null
  // drivers must cover every forecast year
  const d = m.drivers
  if (d.revenueGrowthPct.length !== nForecast || d.grossMarginPct.length !== nForecast || d.opexPctRev.length !== nForecast) return null
  if (m.pnl.length !== nActual || m.bs.length !== nActual) return null

  const at = <T,>(arr: T[] | undefined, i: number, fallback: T): T => (arr && arr[i] != null ? arr[i] : fallback)

  // Statement arrays — declared before the projection loop so buildBS() (a hoisted function
  // declaration) can populate them as each year's P&L is computed.
  const bsRows: BSRow[] = []
  const cfRows: CFRow[] = []

  // ── P&L (all years) ──
  const pnl: PnLRow[] = []
  for (let i = 0; i < m.years.length; i++) {
    const prevRev = i > 0 ? pnl[i - 1].revenue : 0
    let revenue: number, cogs: number, otherIncome: number, opex: number, dna: number, financeIncome: number, financeCosts: number, tax: number
    if (m.years[i].actual) {
      const p = m.pnl[i]
      revenue = p.revenue
      cogs = p.cogs
      otherIncome = p.otherIncome ?? 0
      opex = p.opex
      dna = p.dna
      financeIncome = p.financeIncome ?? 0
      financeCosts = p.financeCosts ?? 0
      tax = p.tax
    } else {
      const f = i - nActual
      revenue = prevRev * (1 + d.revenueGrowthPct[f] / 100)
      const gross = revenue * (d.grossMarginPct[f] / 100)
      cogs = revenue - gross
      otherIncome = revenue * (at(d.otherIncomePctRev, f, 0) / 100)
      opex = revenue * (d.opexPctRev[f] / 100)
      dna = revenue * (at(d.dnaPctRev, f, 0) / 100)
      // finance items off OPENING balances (prior year) — no circularity with the cash plug
      const prevDebt = i > 0 ? bsRows[i - 1].longTermDebt + bsRows[i - 1].shortTermDebt : 0
      financeCosts = d.interestRatePct ? prevDebt * (at(d.interestRatePct, f, 0) / 100) : pnl[i - 1].financeCosts
      financeIncome = pnl[i - 1].financeIncome
      const ebitForTax = revenue * (d.grossMarginPct[f] / 100) + otherIncome - opex - dna
      const pbt = ebitForTax + financeIncome - financeCosts
      tax = Math.max(pbt, 0) * (d.taxRatePct[f] / 100)
    }
    const grossProfit = revenue - cogs
    const ebitda = grossProfit + otherIncome - opex
    const ebit = ebitda - dna
    const pbt = ebit + financeIncome - financeCosts
    const netIncome = pbt - tax
    pnl.push({
      revenue: r1(revenue),
      revenueGrowthPct: prevRev ? r1(((revenue - prevRev) / prevRev) * 100) : 0,
      cogs: r1(cogs),
      grossProfit: r1(grossProfit),
      grossMarginPct: revenue ? r1((grossProfit / revenue) * 100) : 0,
      otherIncome: r1(otherIncome),
      opex: r1(opex),
      ebitda: r1(ebitda),
      ebitdaMarginPct: revenue ? r1((ebitda / revenue) * 100) : 0,
      dna: r1(dna),
      ebit: r1(ebit),
      financeIncome: r1(financeIncome),
      financeCosts: r1(financeCosts),
      pbt: r1(pbt),
      tax: r1(tax),
      netIncome: r1(netIncome),
      netMarginPct: revenue ? r1((netIncome / revenue) * 100) : 0,
    })
    // BS depends on this year's P&L; built in the same pass below via bsRows
    buildBS(i)
  }

  // ── Balance sheet + cash flow (built per-year inside the loop above via closure) ──
  // (declared here so P&L's finance-cost line can read prior debt)
  // eslint-disable-next-line no-inner-declarations
  function buildBS(i: number) {
    const y = m!.years[i]
    const prev = i > 0 ? bsRows[i - 1] : null
    let row: BSRow
    let cf: CFRow
    if (y.actual) {
      const b = m!.bs[i]
      const longTermDebt = b.longTermDebt
      const shortTermDebt = b.shortTermDebt ?? 0
      const totalNonCurrentAssets = b.ppe + (b.intangibles ?? 0) + (b.otherNonCurrentAssets ?? 0)
      const totalCurrentAssets = (b.inventory ?? 0) + b.receivables + (b.otherCurrentAssets ?? 0) + b.cash
      const totalAssets = totalNonCurrentAssets + totalCurrentAssets
      const totalEquity = b.shareCapital + b.retainedEarnings + (b.reserves ?? 0) + (b.nci ?? 0)
      const totalLiabilities = longTermDebt + shortTermDebt + (b.leases ?? 0) + (b.otherNonCurrentLiab ?? 0) + b.payables + (b.otherCurrentLiab ?? 0)
      row = mkBS(b.ppe, b.intangibles ?? 0, b.otherNonCurrentAssets ?? 0, totalNonCurrentAssets, b.inventory ?? 0, b.receivables, b.otherCurrentAssets ?? 0, b.cash, totalCurrentAssets, totalAssets, b.shareCapital, b.retainedEarnings, b.reserves ?? 0, b.nci ?? 0, totalEquity, longTermDebt, shortTermDebt, b.leases ?? 0, b.otherNonCurrentLiab ?? 0, b.payables, b.otherCurrentLiab ?? 0, totalLiabilities)
      // CF for an actual year only if a prior actual exists
      if (prev) {
        cf = mkCF(pnl[i].netIncome, pnl[i].dna, row.receivables - prev.receivables, row.inventory - prev.inventory, row.payables - prev.payables, b.ppe - prev.ppe + pnl[i].dna, (longTermDebt + shortTermDebt) - (prev.longTermDebt + prev.shortTermDebt), 0, row.cash)
      } else {
        cf = zeroCF(row.cash)
      }
    } else {
      const f = i - nActual
      const P = pnl[i]
      const p = prev!
      const capex = P.revenue * (at(d.capexPctRev, f, 0) / 100)
      const ppe = p.ppe + capex - P.dna
      const intangibles = p.intangibles
      const otherNonCurrentAssets = p.otherNonCurrentAssets
      const receivables = P.revenue * (d.receivablesPctRev[f] / 100)
      const inventory = P.revenue * (at(d.inventoryPctRev, f, 0) / 100)
      const otherCurrentAssets = p.otherCurrentAssets
      const payables = P.revenue * (d.payablesPctRev[f] / 100)
      const otherCurrentLiab = p.otherCurrentLiab
      const repay = at(d.debtRepayment, f, 0)
      const grossPrev = p.longTermDebt + p.shortTermDebt
      const grossNew = Math.max(0, grossPrev - repay)
      const shortTermDebt = Math.min(p.shortTermDebt, grossNew)
      const longTermDebt = grossNew - shortTermDebt
      const leases = p.leases
      const otherNonCurrentLiab = p.otherNonCurrentLiab
      const shareCapital = p.shareCapital
      const reserves = p.reserves
      const nci = p.nci
      const dividends = at(d.dividends, f, 0)
      const retainedEarnings = p.retainedEarnings + P.netIncome - dividends
      // cash flow → cash plug
      const dRec = receivables - p.receivables
      const dInv = inventory - p.inventory
      const dPay = payables - p.payables
      const cfo = P.netIncome + P.dna - dRec - dInv + dPay
      const cfi = -capex
      const debtChange = grossNew - grossPrev
      const cff = debtChange - dividends
      const netChange = cfo + cfi + cff
      const cash = p.cash + netChange
      const totalNonCurrentAssets = ppe + intangibles + otherNonCurrentAssets
      const totalCurrentAssets = inventory + receivables + otherCurrentAssets + cash
      const totalAssets = totalNonCurrentAssets + totalCurrentAssets
      const totalEquity = shareCapital + retainedEarnings + reserves + nci
      const totalLiabilities = longTermDebt + shortTermDebt + leases + otherNonCurrentLiab + payables + otherCurrentLiab
      row = mkBS(ppe, intangibles, otherNonCurrentAssets, totalNonCurrentAssets, inventory, receivables, otherCurrentAssets, cash, totalCurrentAssets, totalAssets, shareCapital, retainedEarnings, reserves, nci, totalEquity, longTermDebt, shortTermDebt, leases, otherNonCurrentLiab, payables, otherCurrentLiab, totalLiabilities)
      cf = mkCF(P.netIncome, P.dna, dRec, dInv, dPay, capex, debtChange, dividends, cash)
    }
    bsRows[i] = row
    cfRows[i] = cf
  }

  // ── DCF (forecast years) ──
  const v = m.valuation
  const wacc = v.waccPct / 100
  const g = v.terminalGrowthPct / 100
  const effTax = (v.longRunTaxPct ?? d.taxRatePct[nForecast - 1]) / 100
  const dcf = buildDcf(wacc, g)

  function buildDcf(waccX: number, gX: number): DcfBuild {
    const labels: string[] = []
    const ufcf: number[] = []
    const period: number[] = []
    const df: number[] = []
    const pv: number[] = []
    for (let f = 0; f < nForecast; f++) {
      const i = nActual + f
      const P = pnl[i]
      const B = bsRows[i]
      const prevB = bsRows[i - 1]
      const capex = P.revenue * (at(d.capexPctRev, f, 0) / 100)
      const dWc = (B.receivables - prevB.receivables) + (B.inventory - prevB.inventory) - (B.payables - prevB.payables)
      const nopat = P.ebit * (1 - effTax)
      const fcf = nopat + P.dna - capex - dWc
      const per = v.midYear ? f + 0.5 : f + 1
      const factor = 1 / Math.pow(1 + waccX, per)
      labels.push(m!.years[i].label)
      ufcf.push(r1(fcf))
      period.push(per)
      df.push(r2(factor))
      pv.push(r1(fcf * factor))
    }
    const sumPvExplicit = r1(pv.reduce((a, b) => a + b, 0))
    const lastI = nActual + nForecast - 1
    const lastEbitda = pnl[lastI].ebitda
    const lastFcf = ufcf[ufcf.length - 1]
    const lastPer = period[period.length - 1]
    let tv = 0
    if (v.terminalMethod === 'exit-multiple' && v.exitEvEbitda) tv = v.exitEvEbitda * lastEbitda
    else if (waccX > gX) tv = (lastFcf * (1 + gX)) / (waccX - gX)
    const pvTerminal = r1(tv / Math.pow(1 + waccX, lastPer))
    const ev = r1(sumPvExplicit + pvTerminal)
    const lastActual = bsRows[nActual - 1]
    const netDebt = r1(lastActual.longTermDebt + lastActual.shortTermDebt - lastActual.cash)
    const leases = lastActual.leases
    const nci = lastActual.nci
    const associates = v.associates ?? 0
    const equityValue = r1(ev - netDebt - leases - nci + associates)
    const revLTM = pnl[nActual - 1].revenue
    const ebitdaLTM = pnl[nActual - 1].ebitda
    return {
      forecastLabels: labels,
      ufcf,
      period,
      discountFactor: df,
      pvUfcf: pv,
      sumPvExplicit,
      pvTerminal,
      enterpriseValue: ev,
      terminalPctOfEv: ev ? r1((pvTerminal / ev) * 100) : 0,
      netDebt,
      leases,
      nci,
      associates,
      equityValue,
      impliedEvRevenue: revLTM ? r2(ev / revLTM) : 0,
      impliedEvEbitda: ebitdaLTM ? r1(ev / ebitdaLTM) : 0,
    }
  }

  // ── Sensitivity 1: WACC × terminal g → equity value ──
  const waccAxis = [-2, -1, 0, 1, 2].map((x) => r1(v.waccPct + x))
  const gAxis = [-1, -0.5, 0, 0.5, 1].map((x) => r1(v.terminalGrowthPct + x))
  const waccG: SensitivityGrid = {
    rowLabel: 'WACC',
    colLabel: 'Terminal g',
    rows: waccAxis,
    cols: gAxis,
    grid: waccAxis.map((w) => gAxis.map((gg) => buildDcf(w / 100, gg / 100).equityValue)),
    baseRow: 2,
    baseCol: 2,
    unit: 'equity',
  }

  // ── Sensitivity 2: entry valuation × exit EV/Revenue → IRR (decision-relevant) ──
  const hold = nForecast
  const termRev = pnl[nActual + nForecast - 1].revenue
  const exitNetDebt = dcf.netDebt
  const baseEntry = deal.ask.askValuationUSDm
  const baseExitMult = deal.assumptions.exitEVRevenue
  const entryAxis = [0.7, 0.85, 1, 1.15, 1.3].map((x) => r1(baseEntry * x))
  const exitAxis = [-2, -1, 0, 1, 2].map((x) => r2(Math.max(0.5, baseExitMult + x)))
  const irr = (entry: number, exitMult: number): number => {
    const exitEquity = exitMult * termRev - exitNetDebt
    const moic = exitEquity / entry
    if (moic <= 0) return r1((Math.pow(0.0001, 1 / hold) - 1) * 100)
    return r1((Math.pow(moic, 1 / hold) - 1) * 100)
  }
  const entryExit: SensitivityGrid = {
    rowLabel: 'Entry valuation',
    colLabel: 'Exit EV/Rev',
    rows: entryAxis,
    cols: exitAxis,
    grid: entryAxis.map((e) => exitAxis.map((x) => irr(e, x))),
    baseRow: 2,
    baseCol: 2,
    unit: 'irr',
  }

  // ── Operating metrics: last actual → last forecast ──
  const a0 = nActual - 1
  const aN = m.years.length - 1
  const operating: OperatingMetric[] = [
    { label: 'Revenue', start: pnl[a0].revenue, end: pnl[aN].revenue, deltaPct: pctChange(pnl[a0].revenue, pnl[aN].revenue), fmt: 'usdm' },
    { label: 'EBITDA', start: pnl[a0].ebitda, end: pnl[aN].ebitda, deltaPct: pctChange(pnl[a0].ebitda, pnl[aN].ebitda), fmt: 'usdm' },
    { label: 'EBITDA margin', start: pnl[a0].ebitdaMarginPct, end: pnl[aN].ebitdaMarginPct, deltaPct: null, fmt: 'pct' },
    { label: 'Net income', start: pnl[a0].netIncome, end: pnl[aN].netIncome, deltaPct: pctChange(pnl[a0].netIncome, pnl[aN].netIncome), fmt: 'usdm' },
    { label: 'Net debt', start: bsRows[a0].netDebt, end: bsRows[aN].netDebt, deltaPct: null, fmt: 'usdm' },
    { label: 'Net debt / EBITDA', start: pnl[a0].ebitda ? r1(bsRows[a0].netDebt / pnl[a0].ebitda) : 0, end: pnl[aN].ebitda ? r1(bsRows[aN].netDebt / pnl[aN].ebitda) : 0, deltaPct: null, fmt: 'x' },
  ]

  const balances = bsRows.every((b) => Math.abs(b.balanceGap) < 0.5)

  return { years: m.years, pnl, bs: bsRows, cf: cfRows, dcf, waccG, entryExit, operating, balances }
}

// ── small builders ──
function mkBS(
  ppe: number, intangibles: number, otherNonCurrentAssets: number, totalNonCurrentAssets: number,
  inventory: number, receivables: number, otherCurrentAssets: number, cash: number, totalCurrentAssets: number,
  totalAssets: number, shareCapital: number, retainedEarnings: number, reserves: number, nci: number, totalEquity: number,
  longTermDebt: number, shortTermDebt: number, leases: number, otherNonCurrentLiab: number, payables: number, otherCurrentLiab: number, totalLiabilities: number,
): BSRow {
  const totalEquityAndLiabilities = totalEquity + totalLiabilities
  return {
    ppe: r1(ppe), intangibles: r1(intangibles), otherNonCurrentAssets: r1(otherNonCurrentAssets), totalNonCurrentAssets: r1(totalNonCurrentAssets),
    inventory: r1(inventory), receivables: r1(receivables), otherCurrentAssets: r1(otherCurrentAssets), cash: r1(cash), totalCurrentAssets: r1(totalCurrentAssets),
    totalAssets: r1(totalAssets), shareCapital: r1(shareCapital), retainedEarnings: r1(retainedEarnings), reserves: r1(reserves), nci: r1(nci), totalEquity: r1(totalEquity),
    longTermDebt: r1(longTermDebt), shortTermDebt: r1(shortTermDebt), leases: r1(leases), otherNonCurrentLiab: r1(otherNonCurrentLiab), payables: r1(payables), otherCurrentLiab: r1(otherCurrentLiab),
    totalLiabilities: r1(totalLiabilities), totalEquityAndLiabilities: r1(totalEquityAndLiabilities),
    netDebt: r1(longTermDebt + shortTermDebt - cash), balanceGap: r1(totalAssets - totalEquityAndLiabilities),
  }
}
function mkCF(netIncome: number, dna: number, dRec: number, dInv: number, dPay: number, capex: number, debtChange: number, dividends: number, closingCash: number): CFRow {
  const cfo = netIncome + dna - dRec - dInv + dPay
  const cfi = -capex
  const cff = debtChange - dividends
  return {
    netIncome: r1(netIncome), dna: r1(dna), changeReceivables: r1(-dRec), changeInventory: r1(-dInv), changePayables: r1(dPay),
    cfo: r1(cfo), capex: r1(-capex), cfi: r1(cfi), debtChange: r1(debtChange), dividends: r1(-dividends), cff: r1(cff),
    netChangeInCash: r1(cfo + cfi + cff), closingCash: r1(closingCash),
  }
}
function zeroCF(closingCash: number): CFRow {
  return { netIncome: 0, dna: 0, changeReceivables: 0, changeInventory: 0, changePayables: 0, cfo: 0, capex: 0, cfi: 0, debtChange: 0, dividends: 0, cff: 0, netChangeInCash: 0, closingCash: r1(closingCash) }
}
