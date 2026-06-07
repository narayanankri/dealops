// ───────────────────────────────────────────────────────────
// AI Deal Operations — core data model
// One Deal artifact binds the deterministic engine and the authored
// narrative. The engine recomputes all numbers from `assumptions`,
// so flexing an assumption stays live and consistent (PRD V-3/V-4).
// ───────────────────────────────────────────────────────────

export type Basis = 'stated' | 'inferred' | 'estimated'
export type Confidence = 'high' | 'medium' | 'low'
export type Verdict = 'proceed' | 'review' | 'pass'
// Deal lifecycle. The story ends at Sent to IC, Rejected, or Archived.
//   new → ready (AI-processed, all tabs available) → sent-to-ic | rejected | archived
export type DealStatus = 'new' | 'ready' | 'sent-to-ic' | 'rejected' | 'archived'
export type StrategyArchetype = 'growth-equity' | 'buyout' | 'venture' | 'credit'
export type ControlPosture = 'minority' | 'significant-minority' | 'control'

// ── Fund: a named, separately-configurable mandate (§9) ──
export interface Fund {
  id: string
  mandate: Mandate
}

// ── Mandate (§3 / §9) — fully configurable ──
export interface Mandate {
  fundName: string
  fundSizeUSDm: number
  strategyArchetype: StrategyArchetype
  controlPosture: ControlPosture
  leverage: boolean
  holdYears: [number, number]
  targetSectors: { name: string; priority?: boolean }[]
  coreGeographies: string[]
  flaggedGeographies: string[] // allowed, extra screening
  excludedGeographies: string[] // red line
  stages: string[]
  instruments: string[]
  ticketBandUSDm: [number, number]
  concentrationCapPct: number
  returnHurdlePct: number
  publicReferencePct: number
  redLines: string[]
}

// ── Deal artifact ──
export interface Peer {
  name: string
  public: boolean
  evRevenue?: number
  evEbitda?: number
  revGrowthPct?: number
  ebitdaMarginPct?: number
  scaleUSDm?: number // revenue scale, for sizing
  basis: Basis
  rationale: string
}

export interface MeritDimension {
  key: string
  label: string
  score: number // 0-100
  confidence: Confidence
  rationale: string
  confidenceReason?: string
}

export interface ValuationAssumptions {
  baseRevenueUSDm: number
  revGrowthPct: number[] // per forecast year
  ebitdaMarginPct: number[] // per forecast year
  taxRatePct: number
  waccPct: number
  terminalGrowthPct: number
  netDebtUSDm: number
  exitEVRevenue: number // exit multiple for the return model
  holdYears: number
  // buyout-only
  entryLeverageX?: number
  debtRatePct?: number
}

export interface RiskItem {
  risk: string
  severity: 'high' | 'medium' | 'low'
  likelihood: 'high' | 'medium' | 'low'
  impact: string
  mitigation: string
  monitoring: string
}

// A citation: where a fact comes from, with a working link where available.
export interface Citation {
  source: string // publisher / origin, e.g. 'TechCrunch', 'Company', 'Wamda', 'SAMA register'
  url?: string
}

// One line of the revenue model — concrete monetisation, not a sentence.
export interface RevenueLine {
  name: string // 'Merchant take-rate', 'Card interchange', 'Subscription'
  sharePct?: number // approximate % of revenue
  description: string // what it is + the unit economics behind it
  basis: Basis
  source?: string // required when basis = 'stated' — a citation
  url?: string // working link / document reference for the citation
}

// A round in the company's funding history.
export interface FundingRound {
  series: string // 'Series C', 'Seed', 'Pre-IPO'
  date: string // 'Dec 2023' | '2023'
  raisedUSDm?: number // amount raised in the round
  postMoneyUSDm?: number // post-money valuation
  leadInvestors?: string[]
  citation?: Citation
}

export interface DealNarrative {
  profile: string
  revenueModel: string // short summary; the breakdown lives in revenueLines
  revenueLines?: RevenueLine[]
  marketRead: string
  regulatory: string
  caseFor: string[]
  caseAgainst: string[]
  leadership: { name: string; role: string; note?: string }[]
  leadershipGaps: string
  legalStanding: string
  valuationVerdict: string
  limitations: string[]
  icThesis: string
  useOfFunds: string
  proposedTerms: { label: string; value: string }[]
  riskRegister: RiskItem[]
  recommendationSummary: string
  // ── IC-memo depth (optional, authored by the pipeline; rendered when present) ──
  whyNow?: string // the catalyst — one crisp sentence on why the deal surfaces now
  // Sector-adaptive entry barriers, each rated by strength (height of the wall protecting the
  // position) with a fact-anchored note. The axes are chosen per deal for relevance — a lender's
  // barriers differ from an infra operator's — so this is precise rather than cross-deal-uniform.
  barriers?: { axis: string; rating: 'high' | 'medium' | 'low'; note: string }[]
  scenarioNarratives?: { bear?: string; base?: string; bull?: string } // per-scenario paragraph
  thesisDrivers?: string[] // the enumerated return drivers behind the thesis
  thesisBreakers?: string[] // "what would have to be true for the thesis to break" — the pre-mortem
  marketContext?: string // structural demand, regulatory landscape, headwinds
  moat?: {
    pillars: string[] // differentiation pillars that are hard to replicate
    competitors: { name: string; note: string }[] // the named competitive set
    trajectory: string // the 3–5 year competitive trajectory
    erosionScenarios: string[] // the specific ways the moat could erode
  }
  qualityOfEarnings?: string // earnings-quality caution: provisioning, what to require in diligence
  recentDevelopments?: string // company- and sector-level recent events synthesised
  useOfFundsBreakdown?: { category: string; pct: number; rationale: string }[] // allocation + rationale
  termSheet?: {
    instrument: string
    ownership: string // e.g. "~3.6% at the $4.5bn mark (fully diluted, illustrative)"
    boardGovernance: string // board seat / observer / information rights
    preferentialRights: string[] // liquidation pref, anti-dilution, pro-rata, drag/tag, vesting…
    conditionsPrecedent: string[] // what must close before commitment
  }
}

export interface TrustField {
  label: string
  basis: Basis
  confidence: Confidence
  source?: string
  url?: string // working link for 'stated' facts
  method?: string // for 'inferred'/'estimated': how it was derived
}

// One business vital — the sector-appropriate KPI for size / growth / unit-econ / quality.
// value = 'Not disclosed' is a valid, deliberate answer (never leave the reader wondering).
export interface VitalMetric {
  label: string // the KPI for this sector, e.g. 'Active customers', 'MW capacity', 'ARR'
  value: string
  trend?: 'up' | 'down' | 'flat'
  basis: Basis
  source?: string
  url?: string
  note?: string
}
export interface BusinessVitals {
  size: VitalMetric
  growth: VitalMetric
  unitEconomics: VitalMetric
  quality: VitalMetric
}

export interface CapTableRow {
  holder: string
  pct: number
  type: 'founder' | 'investor' | 'esop' | 'other'
}

export interface Deal {
  id: string
  name: string
  oneLiner: string
  sector: string
  geography: string // e.g. 'UAE'
  region: string // 'GCC' | 'MENA'
  stage: string
  foundedYear?: number
  fundId?: string
  status: DealStatus
  ticketUSDm: number
  instrument: string
  controlPosture: ControlPosture
  ask: {
    askValuationUSDm: number // post-money valuation of the round being raised
    series?: string // the round being raised, e.g. 'Series E'
    raisingUSDm?: number // amount being raised in this round
    date?: string
    // legacy fallback
    lastRoundUSDm?: number
    lastRoundDate?: string
    leadInvestors?: string[]
  }
  roundHistory?: FundingRound[] // prior rounds, most-recent first
  totalRaisedUSDm?: number // cumulative equity raised to date
  currentValuationUSDm?: number // latest marked valuation
  vitals?: BusinessVitals // size / growth / unit-econ / quality, sector-aware
  headlineMetrics: { label: string; value: string; trend?: 'up' | 'down' | 'flat'; basis: Basis; source?: string; url?: string }[]
  news: { date: string; headline: string; source?: string; url?: string }[]
  peers: Peer[]
  assumptions: ValuationAssumptions
  merit: MeritDimension[]
  financials?: { years: (number | string)[]; revenue: number[]; ebitda: number[] }
  // Full driver-based 3-statement model — OPTIONAL. Present only when a deal is added with
  // financials. The engine projects forecast statements + a model-DCF from it (engine/model.ts).
  model?: FinancialModel
  capTable?: CapTableRow[]
  dataTrust: { fields: TrustField[] }
  // Light Shariah-compliance screen — mandate-relevant for a GCC/MENA fund. status + one-line
  // reasoning + a source where stated. 'mixed' = compliant core with non-compliant elements
  // (e.g. a conventional-interest funding layer); 'n/a' = not screened / not applicable.
  shariaScreen?: { status: 'compliant' | 'non-compliant' | 'mixed' | 'n/a'; note: string; source?: string; url?: string }
  narrative: DealNarrative
  createdAt: string
}

// ───────────────────────────────────────────────────────────
// Full financial model (optional). Author supplies historical ACTUALS (reported facts,
// sourced) + forward DRIVERS (assumptions); the engine PROJECTS forecast P&L / BS / CF and
// values them. Statements are engine-derived, so the balance sheet balances by construction.
// All magnitudes are POSITIVE (the engine applies signs). Currency is the deal's reporting ccy.
// ───────────────────────────────────────────────────────────
export interface ModelYear {
  label: string // 'FY24'
  actual: boolean // true = reported actual, false = forecast
}

// Reported P&L for an ACTUAL year (positive magnitudes).
export interface PnLActual {
  revenue: number
  cogs: number // cost of sales
  otherIncome?: number
  opex: number // operating expenses excluding D&A
  dna: number // depreciation & amortisation
  financeIncome?: number
  financeCosts?: number
  tax: number // income tax expense
}

// Reported balance sheet for an ACTUAL year (positive magnitudes).
export interface BSActual {
  ppe: number
  intangibles?: number
  otherNonCurrentAssets?: number
  inventory?: number
  receivables: number
  otherCurrentAssets?: number
  cash: number
  longTermDebt: number
  shortTermDebt?: number
  leases?: number
  otherNonCurrentLiab?: number
  payables: number
  otherCurrentLiab?: number
  shareCapital: number
  retainedEarnings: number // may be negative (accumulated deficit)
  reserves?: number
  nci?: number
}

// Forward drivers — one entry per FORECAST year (arrays aligned to the forecast years).
export interface ModelDrivers {
  revenueGrowthPct: number[]
  grossMarginPct: number[] // gross profit / revenue → cogs = (1 − gm) × rev
  otherIncomePctRev?: number[]
  opexPctRev: number[] // opex excl D&A, as % of revenue
  dnaPctRev: number[]
  capexPctRev: number[]
  receivablesPctRev: number[]
  inventoryPctRev?: number[]
  payablesPctRev: number[] // as % of revenue
  taxRatePct: number[]
  interestRatePct?: number[] // on average gross debt
  debtRepayment?: number[] // absolute reduction in gross debt per year (negative = draw)
  dividends?: number[]
}

export interface ModelValuation {
  waccPct: number
  terminalGrowthPct: number
  longRunTaxPct?: number
  midYear?: boolean // mid-year discounting convention
  terminalMethod: 'gordon' | 'exit-multiple'
  exitEvEbitda?: number // required when terminalMethod = 'exit-multiple'
  associates?: number // added in EV→equity bridge (net debt, leases, NCI come from the BS)
}

export interface FinancialModel {
  years: ModelYear[] // chronological: actuals first, then forecasts
  pnl: PnLActual[] // ACTUAL years only (length = number of actual years)
  bs: BSActual[] // ACTUAL years only
  drivers: ModelDrivers // length of each array = number of forecast years
  valuation: ModelValuation
  basis: Basis // overall basis of the historical statements (stated / inferred / estimated)
  note?: string
  sources?: Citation[]
}

// ── Engine output (computed, never stored) ──
export interface MandateDimensionResult {
  key: string
  label: string
  score: number
  takeaway: string
  status: 'pass' | 'soft' | 'breach'
}
export interface MandateFit {
  score: number
  narrative: string // synthesized assessment of how the deal sits against the fund's rules
  dimensions: MandateDimensionResult[]
  redLineBreaches: string[]
  concentration: {
    ticketUSDm: number
    capUSDm: number
    pctOfFund: number
    capPct: number
    fits: boolean
    takeaway: string
  }
}
export interface AssetValue {
  dcfEquityUSDm: number
  compsEquity: { low: number; mid: number; high: number }
  reconciledUSDm: number
  range: { low: number; base: number; high: number }
  impliedEVRevenue: number
  askVsValuePct: number // ask premium/discount to reconciled value
}
export interface ReturnScenario {
  name: 'bear' | 'base' | 'bull'
  irrPct: number
  moic: number
  exitEquityUSDm: number
  clearsHurdle: boolean
}
export interface Returns {
  archetype: StrategyArchetype
  hurdlePct: number
  scenarios: ReturnScenario[]
  basis: string
}
export type CheckSeverity = 'blocking' | 'warn' | 'pass'
// One line of the deterministic Coherence Ledger (engine/validate.ts). Mirrors the
// Director's CRITIQUE.md ledger, but computed in code so it runs on EVERY deal.
export interface CoherenceCheck {
  id: string
  label: string // short name of the invariant
  severity: CheckSeverity
  detail: string // the figures / arithmetic / what to fix
}
export interface Integrity {
  ok: boolean
  blocking: boolean
  warnings: string[] // messages for blocking + warn checks (legacy banner)
  checks: CoherenceCheck[] // the full ledger, every invariant, pass included
}
export interface Analysis {
  mandateFit: MandateFit
  meritScore: number
  meritLabel: string
  assetValue: AssetValue
  returns: Returns
  composite: number
  dataTrustScore: number
  verdict: Verdict
  reasons: string[]
  conditions: string[]
  integrity: Integrity
}

// ── Projected model output (computed by engine/model.ts; never stored) ──
export interface PnLRow {
  revenue: number
  revenueGrowthPct: number
  cogs: number
  grossProfit: number
  grossMarginPct: number
  otherIncome: number
  opex: number
  ebitda: number
  ebitdaMarginPct: number
  dna: number
  ebit: number
  financeIncome: number
  financeCosts: number
  pbt: number
  tax: number
  netIncome: number
  netMarginPct: number
}
export interface BSRow {
  ppe: number
  intangibles: number
  otherNonCurrentAssets: number
  totalNonCurrentAssets: number
  inventory: number
  receivables: number
  otherCurrentAssets: number
  cash: number
  totalCurrentAssets: number
  totalAssets: number
  shareCapital: number
  retainedEarnings: number
  reserves: number
  nci: number
  totalEquity: number
  longTermDebt: number
  shortTermDebt: number
  leases: number
  otherNonCurrentLiab: number
  payables: number
  otherCurrentLiab: number
  totalLiabilities: number
  totalEquityAndLiabilities: number
  netDebt: number
  balanceGap: number // totalAssets − (equity + liabilities); ~0 by construction
}
export interface CFRow {
  netIncome: number
  dna: number
  changeReceivables: number
  changeInventory: number
  changePayables: number
  cfo: number
  capex: number
  cfi: number
  debtChange: number
  dividends: number
  cff: number
  netChangeInCash: number
  closingCash: number
}
export interface DcfBuild {
  forecastLabels: string[]
  ufcf: number[]
  period: number[]
  discountFactor: number[]
  pvUfcf: number[]
  sumPvExplicit: number
  pvTerminal: number
  enterpriseValue: number
  terminalPctOfEv: number
  netDebt: number
  leases: number
  nci: number
  associates: number
  equityValue: number
  impliedEvRevenue: number
  impliedEvEbitda: number
}
export interface SensitivityGrid {
  rowLabel: string // e.g. 'WACC'
  colLabel: string // e.g. 'Terminal g'
  rows: number[] // axis values (e.g. WACC %)
  cols: number[] // axis values (e.g. g %)
  grid: number[][] // [row][col] → value
  baseRow: number // index of the base-case row
  baseCol: number // index of the base-case col
  unit: 'equity' | 'irr'
}
export interface OperatingMetric {
  label: string
  start: number
  end: number
  deltaPct: number | null // null when a % change isn't meaningful
  fmt: 'usdm' | 'pct' | 'x' | 'num'
}
export interface ProjectedModel {
  years: ModelYear[]
  pnl: PnLRow[]
  bs: BSRow[]
  cf: CFRow[]
  dcf: DcfBuild
  waccG: SensitivityGrid
  entryExit: SensitivityGrid
  operating: OperatingMetric[]
  balances: boolean // every BS year balances within tolerance
}
