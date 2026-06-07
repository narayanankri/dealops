import type { Deal } from '@/types'

// Authored against AUTHORING.md from REAL public filings. Lulu Retail Holdings plc (ADX: LULU)
// IPO'd on the Abu Dhabi Securities Exchange in Nov-2024 (raised $1.72bn at a ~$5.74bn / AED 21.07bn
// listing cap). The stock has since de-rated ~50%: current market cap ~AED 10.12bn ≈ $2,756m
// (AED 3.6725/USD). This deal is FRAMED as a growth/crossover minority block in the LISTED entity —
// the public nature is surfaced honestly as a mandate CONSIDERATION (liquidity + price discovery), not
// a breach. Reporting currency is USD (the company reports in USD). Figures converted where AED-native.
//
// Key disclosed facts (FY2024 / FY2025 full-year + H1-2025 releases, audited public filings):
//  FY2024: revenue $7,600m (+4.7%), EBITDA $786.3m (10.32% margin), net profit (continuing) $216.3m
//          (+12.6%, 2.8% margin), private label 29.6% of retail revenue, e-comm $325.6m (+70%), 250 stores.
//  FY2025: revenue $7,930m (+4.1%), LFL +2.3%, EBITDA $782.2m (9.9% margin), net profit $204.5m, 267 stores,
//          7 fils/share total dividend (~$197m); 2026 guidance 4–5% rev growth, flat EBITDA margin, +10% NP.
//  Balance sheet (~FY2024 aggregates, third-party/filing): total assets ~$5.4bn, equity ~$1.0bn,
//          total debt $863.9m, cash $356.6m, net-debt/EBITDA ~3.3x (IFRS-16, lease-inclusive).
// The full BS line build is INFERRED from these disclosed aggregates + retail-typical proportions and
// balances by construction (reserves / other* lines reconcile). Lease lines are populated (lease-heavy grocer).
const FY24_RELEASE = 'https://www.luluretail.com/media/i0fjd3ob/lulu-retail-fy-2024-earnings-release-en-100225.pdf'
const FY24_ZAWYA = 'https://www.zawya.com/en/press-release/companies-news/lulu-retail-reports-preliminary-fy-2024-results-qsd0ppxq'
const FY24_AB = 'https://www.arabianbusiness.com/markets/equities/results/lulu-retail-revenue-for-2024-grows-4-7-to-7-6bn'
const FY25_FY = 'https://www.zawya.com/en/business/retail-and-consumer/lulu-retail-reports-record-79bln-revenue-for-fy-2025-g03vohhu'
const FY25_NP = 'https://en.aletihad.ae/news/business/4644808/lulu-retail-reports--204-5-million-net-profit-for-2025'
const H1_25 = 'https://www.luluretail.com/media/news/h1-financial-results-of-lulu-retail/'
const IPO = 'https://www.thenationalnews.com/business/markets/2024/11/06/lulu-ipo-retailer-raises-172bn-in-uaes-largest-listing-this-year/'
const IPO_PRICE = 'https://www.luluretail.com/media/fjkmnlmt/lulu-retail-confirms-final-price-for-its-shares.pdf'
const MKTCAP = 'https://stockanalysis.com/quote/adx/LULU/market-cap/'
const SWS_HEALTH = 'https://simplywall.st/stocks/ae/consumer-retailing/adx-lulu/lulu-retail-holdings-shares/health'
const KEYFIG = 'https://www.luluretail.com/investors/results-reports/key-figures/'
const ALMARAI = 'https://multiples.vc/public-comps/almarai-valuation-multiples'

export const luluRetail: Deal = {
  id: 'lulu-retail',
  name: 'Lulu Retail',
  oneLiner:
    'GCC hypermarket leader (267 stores, $7.9bn rev) — listed on ADX, down ~50% from IPO; a thin-margin grocer at a low-double-digit EV/EBITDA',
  sector: 'Consumer',
  geography: 'UAE',
  region: 'GCC',
  stage: 'Growth',
  foundedYear: 2000,
  status: 'ready',
  ticketUSDm: 120,
  instrument: 'Equity',
  controlPosture: 'significant-minority',
  ask: {
    // Listed entity — "askValuationUSDm" is the CURRENT MARKET CAP, not a primary round.
    // ~AED 10.12bn ÷ 3.6725 = ~$2,756m (de-rated ~50% from the ~$5.74bn Nov-24 IPO cap).
    askValuationUSDm: 2756,
    series: 'Listed block (secondary, ADX: LULU)',
    // No raisingUSDm — a secondary block buys existing shares; there is no primary raise.
    // The $120m transaction size lives in ticketUSDm.
    date: 'Jun 2026',
    lastRoundUSDm: 1720,
    lastRoundDate: 'Nov 2024 (IPO at ~$5.74bn cap)',
    leadInvestors: ['ADX public float', 'GCC institutions'],
  },
  // Prior "rounds" = the IPO (primary + selling-shareholder secondary). No private rounds disclosed.
  roundHistory: [
    {
      series: 'IPO (ADX listing)',
      date: 'Nov 2024',
      raisedUSDm: 1720,
      postMoneyUSDm: 5740,
      leadInvestors: ['Abu Dhabi Securities Exchange', 'Yusuff Ali M.A. (selling shareholder)'],
      citation: { source: 'The National', url: IPO },
    },
  ],
  totalRaisedUSDm: 1720, // IPO proceeds (largely a selling-shareholder secondary; company is mature/self-funded)
  currentValuationUSDm: 2756, // current ADX market cap, ~AED 10.12bn ÷ 3.6725
  vitals: {
    size: {
      label: 'Revenue (FY2025)',
      value: '$7.93bn',
      trend: 'up',
      basis: 'stated',
      source: 'Lulu Retail FY2025 results (Zawya)',
      url: FY25_FY,
      note: '267 stores across UAE, KSA, Oman, Qatar, Kuwait, Egypt, India. FY2024 was $7.60bn / 250 stores.',
    },
    growth: {
      label: 'Revenue growth & LFL (FY2025)',
      value: '+4.1% / LFL +2.3%',
      trend: 'flat',
      basis: 'stated',
      source: 'Lulu Retail FY2025 results',
      url: FY25_FY,
      note: 'Mature grocer: +4.7% FY2024, +4.1% FY2025; like-for-like +2.3% in FY2025. 2026 guidance 4–5% revenue growth. E-commerce +38.6% in FY2025 (off a ~4.5% base).',
    },
    unitEconomics: {
      label: 'EBITDA margin (FY2025)',
      value: '9.9%',
      trend: 'down',
      basis: 'stated',
      source: 'Lulu Retail FY2025 results',
      url: FY25_FY,
      note: 'IFRS-16 (pre-lease) EBITDA $782.2m / 9.9% (FY2024 10.32%). Net margin a thin ~2.6% — classic grocer economics. Private label 29.6% of retail revenue supports gross margin.',
    },
    quality: {
      label: 'Net-debt / EBITDA (lease-incl.)',
      value: '~3.3x',
      trend: 'flat',
      basis: 'stated',
      source: 'Simply Wall St (LTM)',
      url: SWS_HEALTH,
      note: 'Lease-inclusive leverage ~3.3x; lease-EXCLUDING net debt ~$0.5bn (total debt $863.9m − cash $356.6m). Short-term assets ($2.2bn) modestly below short-term liabilities ($2.4bn) — typical negative-WC grocer funding.',
    },
  },
  headlineMetrics: [
    { label: 'Revenue (FY2025)', value: '$7.93bn', trend: 'up', basis: 'stated', source: 'Zawya', url: FY25_FY },
    { label: 'EBITDA (FY2025)', value: '$782.2m (9.9%)', trend: 'down', basis: 'stated', source: 'Zawya', url: FY25_FY },
    { label: 'Net profit (FY2025)', value: '$204.5m', trend: 'down', basis: 'stated', source: 'Aletihad', url: FY25_NP },
    { label: 'Revenue (FY2024)', value: '$7.60bn (+4.7%)', trend: 'up', basis: 'stated', source: 'Arabian Business', url: FY24_AB },
    { label: 'Net profit (FY2024)', value: '$216.3m (+12.6%)', trend: 'up', basis: 'stated', source: 'Zawya', url: FY24_ZAWYA },
    { label: 'Stores (FY2025)', value: '267', trend: 'up', basis: 'stated', source: 'Zawya', url: FY25_FY },
    { label: 'Market cap (Jun-26)', value: '~$2.76bn', trend: 'down', basis: 'stated', source: 'stockanalysis.com', url: MKTCAP },
    { label: 'Net-debt/EBITDA (lease-incl.)', value: '~3.3x', basis: 'stated', source: 'Simply Wall St', url: SWS_HEALTH },
  ],
  news: [
    { date: '2026-02', headline: 'FY2025: record revenue $7.93bn (+4.1%), LFL +2.3%, EBITDA $782.2m (9.9%), net profit $204.5m, 267 stores; total dividend 7 fils/share; 2026 guidance 4–5% rev growth, +10% net profit', source: 'Zawya', url: FY25_FY },
    { date: '2025-08', headline: 'H1-2025 revenue $4.1bn (+5.9%), net income +9.1% YoY; interim dividend $98.4m (3.5 fils/share)', source: 'Lulu Retail', url: H1_25 },
    { date: '2025-02', headline: 'FY2024: revenue $7.60bn (+4.7%), EBITDA $786.3m (10.32%), net profit $216.3m (+12.6%); 250th store opened; private label 29.6% of retail revenue, e-comm +70%', source: 'Zawya', url: FY24_ZAWYA },
    { date: '2024-11', headline: 'IPO on ADX raises $1.72bn at $0.56/share — UAE’s largest listing of 2024; implied market cap ~$5.74bn (AED 21.07bn)', source: 'The National', url: IPO },
  ],
  peers: [
    { name: 'Almarai (Tadawul: 2280)', public: true, evRevenue: 2.6, evEbitda: 10.0, revGrowthPct: 7, ebitdaMarginPct: 25, scaleUSDm: 5800, basis: 'stated', rationale: 'Largest listed GCC food/consumer staples name (~$5.8bn rev, ~25% EBITDA margin). Why it matters: anchors the regional staples multiple at ~10x EV/EBITDA — a vertically-integrated PRODUCER, so its ~2.6x EV/sales reflects margins Lulu (a pure grocer) does not earn; the high-margin end of the set.' },
    { name: 'Spinneys 1961 (DFM: SPINNEYS)', public: true, evRevenue: 1.1, evEbitda: 11.0, revGrowthPct: 13, ebitdaMarginPct: 20, scaleUSDm: 980, basis: 'stated', rationale: 'The direct UAE listed grocer comp — premium positioning, ~20% adj. EBITDA margin, +13% FY2025 revenue. Trades ~15.5x 2026 P/E; the faster-growing, higher-margin (smaller-format) end of the grocer set (~1.1x EV/sales on its richer margin).' },
    { name: 'BinDawood Holding (Tadawul: 4161)', public: true, evRevenue: 0.7, evEbitda: 9.0, revGrowthPct: 5, ebitdaMarginPct: 11, scaleUSDm: 1450, basis: 'estimated', rationale: 'Saudi hypermarket/supermarket operator (Danube/BinDawood) — the closest format-and-margin twin to Lulu. ~22x P/E but on thin grocer margins; ~9x EV/EBITDA / ~0.7x EV/sales estimated.' },
    { name: 'Carrefour / Majid Al Futtaim Retail (proxy)', public: false, evRevenue: 0.45, evEbitda: 7.0, revGrowthPct: 4, ebitdaMarginPct: 7, scaleUSDm: 9000, basis: 'estimated', rationale: 'The largest GCC grocery rival (390+ stores, rebranding to HyperMax). Private; multiple estimated at ~0.45x EV/sales on thin hypermarket margins. Why it matters: the scale competitor that sets price/promotion intensity in Lulu’s core markets — the closest EV/sales analogue.' },
    { name: 'Lenta (MOEX: LENT)', public: true, evRevenue: 0.25, evEbitda: 4.5, revGrowthPct: 25, ebitdaMarginPct: 8, scaleUSDm: 9500, basis: 'estimated', rationale: 'Russian hypermarket operator — an EM grocer at the cheap end (~4–5x EV/EBITDA / ~0.25x EV/sales) on similar thin margins. Why it matters: the bear-case multiple anchor for a low-growth EM hypermarket.' },
  ],
  assumptions: {
    baseRevenueUSDm: 7930, // === last actual revenue (FY2025)
    revGrowthPct: [4.5, 4.5, 4.0, 4.0, 3.5],
    ebitdaMarginPct: [10.0, 10.0, 10.1, 10.1, 10.2],
    taxRatePct: 12,
    waccPct: 9.5,
    terminalGrowthPct: 2.0,
    netDebtUSDm: 620, // last-actual lease-EXCLUDING net debt (FY2025: LTD 560 + STD 380 − cash 320)
    exitEVRevenue: 0.5,
    holdYears: 5,
  },
  merit: [
    { key: 'market', label: 'Market opportunity', score: 72, confidence: 'high', rationale: 'GCC grocery is a large, defensive, growing staple market (population + tourism + UAE/KSA consumption), but it is mature and competitive. Lulu is the #1 or #2 hypermarket operator across UAE/Oman/Qatar with 267 stores. Demand is durable; the question is share and margin in a promotional market, not whether the category grows.' },
    { key: 'model', label: 'Business model', score: 70, confidence: 'high', rationale: 'Scale grocery retail: ~20.5% gross margin, negative working capital (payables fund inventory), private label 29.6% of retail revenue lifting mix. Proven, cash-generative, but structurally thin — 9.9% EBITDA / ~2.6% net margin. Store-rollout-plus-LFL growth, not operating leverage.' },
    { key: 'financial', label: 'Financial profile', score: 78, confidence: 'high', rationale: 'Audited public filings: $7.93bn revenue, $782.2m EBITDA, $204.5m net profit (FY2025). High earnings quality (listed, Big-4 audited, quarterly cadence). Leverage ~3.3x lease-inclusive but only ~$0.5bn ex-lease — manageable for a cash grocer.', confidenceReason: 'All headline figures are stated and audited; only the BS line-item SPLIT is inferred from aggregates.' },
    { key: 'moat', label: 'Competitive moat', score: 58, confidence: 'medium', rationale: 'Scale, brand, supplier terms, owned/anchored real-estate locations and private-label depth create a real but modest moat. Grocery is low-switching-cost and promotion-driven; Carrefour/MAF, Spinneys, Union Coop, Nesto and Danube all compete on price and footprint. The moat is distribution density, not pricing power.' },
    { key: 'team', label: 'Team', score: 74, confidence: 'medium', rationale: 'Founder Yusuff Ali M.A. remains the anchor shareholder; experienced professional management took the company public in 2024. Listed-company governance and disclosure. A founder-controlled listed entity — alignment is high but minority influence is limited.' },
    { key: 'valuation', label: 'Valuation', score: 66, confidence: 'high', rationale: 'At ~$2.76bn market cap the stock is down ~50% from its ~$5.74bn IPO cap. EV ≈ market cap + ~$0.5bn ex-lease net debt ≈ ~$3.3bn = ~4.2x EV/EBITDA (ex-lease) / ~0.42x EV/sales — cheap vs Almarai ~10x and Spinneys ~11x, though thin margins and ~4% growth justify a discount. Liquid, mark-to-market entry.' },
    { key: 'exit', label: 'Exit pathway', score: 80, confidence: 'high', rationale: 'Listed on ADX — daily liquidity, no IPO-timing risk. Exit by selling into the market, a block trade, or a strategic/MAF consolidation. The public listing is the single biggest de-risking factor on exit relative to a private GCC deal.' },
  ],
  financials: {
    years: ['FY2024', 'FY2025', 'FY2026E', 'FY2027E', 'FY2028E', 'FY2029E', 'FY2030E'],
    revenue: [7600, 7930, 8287, 8660, 9006, 9367, 9695],
    ebitda: [786, 782, 829, 866, 910, 946, 989],
  },
  // Full driver-based 3-statement model. 2 ACTUAL years (FY2024, FY2025) from audited public filings,
  // 5 forecast years (FY2026–FY2030). Actual P&L ties to disclosed revenue/EBITDA/net-profit; the BS
  // line build is inferred from disclosed aggregates (total assets ~$5.4bn, equity ~$1.0bn, debt $863.9m,
  // cash $356.6m, lease-incl. leverage ~3.3x) and balances by construction (reserves/other* reconcile).
  // Lease lines populated — lease-heavy hypermarket operator. Forecast drivers mirror `assumptions`.
  model: {
    basis: 'stated',
    note: 'P&L top line (revenue, EBITDA, net profit) is stated from audited FY2024/FY2025 public filings. The balance-sheet line-item split is inferred from disclosed aggregates and retail-typical ratios; it balances by construction. Lease lines populated (lease-heavy grocer). Forecast drivers mirror the headline assumptions.',
    sources: [
      { source: 'Lulu Retail FY2024 earnings release', url: FY24_RELEASE },
      { source: 'Lulu Retail FY2025 results (Zawya)', url: FY25_FY },
      { source: 'Lulu Retail key figures', url: KEYFIG },
      { source: 'Simply Wall St (balance sheet aggregates)', url: SWS_HEALTH },
    ],
    years: [
      { label: 'FY2024', actual: true },
      { label: 'FY2025', actual: true },
      { label: 'FY2026', actual: false },
      { label: 'FY2027', actual: false },
      { label: 'FY2028', actual: false },
      { label: 'FY2029', actual: false },
      { label: 'FY2030', actual: false },
    ],
    pnl: [
      // FY2024: rev 7600, GM ~20.5% → COGS 6042; EBITDA 786.3 → opex 801.7 (otherIncome 30);
      //         D&A 430 → EBIT 356.3; fin cost 110, fin inc 15 → PBT 261.3; tax 45 → NP 216.3 ✓
      { revenue: 7600, cogs: 6042, otherIncome: 30, opex: 801.7, dna: 430, financeIncome: 15, financeCosts: 110, tax: 45 },
      // FY2025: rev 7930, GM ~20.7% → COGS 6288; EBITDA 782.2 → opex 889.8 (otherIncome 30);
      //         D&A 450 → EBIT 332.2; fin cost 115, fin inc 15 → PBT 232.2; tax 27.7 → NP 204.5 ✓
      { revenue: 7930, cogs: 6288, otherIncome: 30, opex: 889.8, dna: 450, financeIncome: 15, financeCosts: 115, tax: 27.7 },
    ],
    bs: [
      // FY2024 — Total assets 5,500 = Equity 1,000 + Liabilities 4,500 (gap 0).
      { ppe: 1200, intangibles: 600, otherNonCurrentAssets: 1820, inventory: 1050, receivables: 320, otherCurrentAssets: 153.4, cash: 356.6, longTermDebt: 520, shortTermDebt: 343.9, leases: 1950, otherNonCurrentLiab: 150, payables: 1450, otherCurrentLiab: 86.1, shareCapital: 1033, retainedEarnings: 250, reserves: -283, nci: 0 },
      // FY2025 — Total assets 5,700 = Equity 1,010 + Liabilities 4,690 (gap 0).
      { ppe: 1280, intangibles: 600, otherNonCurrentAssets: 1900, inventory: 1100, receivables: 340, otherCurrentAssets: 160, cash: 320, longTermDebt: 560, shortTermDebt: 380, leases: 2050, otherNonCurrentLiab: 160, payables: 1440, otherCurrentLiab: 100, shareCapital: 1033, retainedEarnings: 260, reserves: -283, nci: 0 },
    ],
    drivers: {
      revenueGrowthPct: [4.5, 4.5, 4.0, 4.0, 3.5],
      grossMarginPct: [20.7, 20.8, 20.9, 21.0, 21.1],
      otherIncomePctRev: [0.38, 0.38, 0.38, 0.38, 0.38],
      opexPctRev: [11.1, 11.2, 11.2, 11.3, 11.3],
      dnaPctRev: [5.5, 5.4, 5.3, 5.2, 5.1],
      capexPctRev: [3.9, 3.8, 3.7, 3.6, 3.6],
      receivablesPctRev: [4.2, 4.2, 4.2, 4.2, 4.2],
      inventoryPctRev: [13.5, 13.5, 13.4, 13.4, 13.3],
      payablesPctRev: [18.5, 18.5, 18.5, 18.5, 18.5],
      taxRatePct: [12, 12, 12, 12, 12],
      interestRatePct: [9, 9, 9, 9, 9],
      debtRepayment: [40, 40, 50, 50, 50],
      dividends: [200, 205, 215, 225, 235],
    },
    valuation: {
      waccPct: 9.5,
      terminalGrowthPct: 2.0,
      longRunTaxPct: 12,
      midYear: true,
      terminalMethod: 'gordon',
      associates: 0,
    },
  },
  capTable: [
    { holder: 'Yusuff Ali M.A. & family (founder)', pct: 60, type: 'founder' },
    { holder: 'ADX public float (institutions & retail)', pct: 39, type: 'investor' },
    { holder: 'Management & employees', pct: 1, type: 'esop' },
  ],
  dataTrust: {
    fields: [
      { label: 'Revenue & net profit (FY2024 $7.60bn/$216.3m; FY2025 $7.93bn/$204.5m)', basis: 'stated', confidence: 'high', source: 'Lulu Retail audited FY releases (Zawya/Aletihad)', url: FY25_FY },
      { label: 'EBITDA (FY2024 $786.3m / 10.32%; FY2025 $782.2m / 9.9%)', basis: 'stated', confidence: 'high', source: 'Lulu Retail FY releases', url: FY24_ZAWYA },
      { label: 'Stores 250 (FY2024) → 267 (FY2025); private label 29.6%; LFL +2.3%', basis: 'stated', confidence: 'high', source: 'Lulu Retail FY releases', url: FY25_FY },
      { label: 'IPO Nov-2024: $1.72bn raised, ~$5.74bn / AED 21.07bn listing cap, $0.56/share', basis: 'stated', confidence: 'high', source: 'The National / company final-price notice', url: IPO_PRICE },
      { label: 'Current market cap ~$2.76bn (AED 10.12bn ÷ 3.6725)', basis: 'stated', confidence: 'high', source: 'stockanalysis.com (ADX:LULU)', url: MKTCAP, method: 'AED 10.12bn market cap ÷ 3.6725 ≈ $2,756m; down ~50% from the ~$5.74bn IPO cap.' },
      { label: 'Balance-sheet aggregates (assets ~$5.4bn, equity ~$1.0bn, debt $863.9m, cash $356.6m, ~3.3x lease-incl.)', basis: 'stated', confidence: 'medium', source: 'Simply Wall St (LTM)', url: SWS_HEALTH },
      { label: 'BS line-item split (PP&E, ROU, inventory, leases, payables, reserves)', basis: 'inferred', confidence: 'medium', method: 'Disclosed aggregates allocated using retail-typical proportions; reserves/other* lines reconcile so each actual year balances exactly. Detailed audited line items to be confirmed from the annual report in diligence.' },
      { label: 'Peer multiples (Almarai ~10x, Spinneys ~11x, BinDawood ~9x EV/EBITDA)', basis: 'stated', confidence: 'medium', source: 'multiples.vc / company reports', url: ALMARAI },
    ],
  },
  shariaScreen: {
    status: 'mixed',
    note: 'Grocery operations are broadly compliant — staple food and general-merchandise retail across the GCC, with halal-certified meat and no dedicated alcohol or pork retail in most stores. Two elements qualify the screen: a minority of non-halal goods may feature in certain markets, and the balance sheet carries conventional borrowings ($863.9m total debt) and IFRS-16 lease liabilities rather than an exclusively Shariah-structured funding stack. No public Shariah board ruling on the equity has been identified.',
    source: 'Simply Wall St (balance-sheet health)',
    url: SWS_HEALTH,
  },
  narrative: {
    whyNow:
      'The opportunity surfaces from the post-IPO de-rating — the equity has fallen roughly 50 per cent from its November-2024 listing capitalisation of about $5.74bn to about $2.76bn — set against the February-2026 FY2025 print of record $7.93bn revenue and a maintained dividend, framing a defensive cash grocer at a trough multiple.',
    barriers: [
      { axis: 'Store footprint & real estate', rating: 'high', note: '267 stores across seven countries on anchored hypermarket sites are slow and costly to replicate, the principal physical barrier in grocery retail.' },
      { axis: 'Scale buying & supplier terms', rating: 'high', note: '$7.93bn of purchasing power underpins negative working capital (supplier payables fund inventory) and gross-margin defence that sub-scale entrants cannot match.' },
      { axis: 'Private label', rating: 'medium', note: 'Private label reached 29.6 per cent of retail revenue, a structural gross-margin lever that rivals must build over years.' },
      { axis: 'Capital intensity', rating: 'medium', note: 'A pan-GCC store rollout of 18–20 sites per year requires sustained capital and developer relationships that deter new scaled entrants.' },
      { axis: 'Switching costs', rating: 'low', note: 'Grocery is a low-switching-cost, promotion-driven category; loyalty rests on price and convenience rather than lock-in, so the moat is distribution density rather than pricing power.' },
    ],
    profile:
      'Lulu Retail Holdings plc is the largest pan-GCC hypermarket and supermarket operator, founded by Yusuff Ali M.A. and listed on the Abu Dhabi Securities Exchange (ADX: LULU) in November 2024 — the UAE’s largest IPO of that year ($1.72bn raised at a ~$5.74bn cap). It runs 267 stores (end-FY2025) across the UAE, Saudi Arabia, Oman, Qatar, Kuwait, Egypt and India, generating $7.93bn revenue and $782.2m EBITDA (9.9% margin) in FY2025. The model is classic scale grocery: ~20.5% gross margin, negative working capital (supplier payables fund inventory), a growing 29.6%-of-retail private-label mix, and a small but fast-growing (+38.6%) e-commerce channel. It is a defensive, cash-generative staples business — thin net margins (~2.6%), low-double-digit revenue growth (+4.1% FY2025, LFL +2.3%).',
    revenueModel:
      'Retail sales of food and non-food through hypermarkets, supermarkets and express formats, plus a small e-commerce channel — earned on basket margin (gross margin ~20.5%) lifted by private-label penetration (29.6% of retail revenue). Growth is store rollout (18–20 new stores/yr) plus low-single-digit like-for-like. Negative working capital means suppliers finance the inventory.',
    revenueLines: [
      { name: 'Food retail (grocery, fresh, FMCG)', sharePct: 62, basis: 'estimated', description: 'Core hypermarket/supermarket food sales — high volume, low margin, defensive. Fresh and private-label depth are the margin levers. Share estimated from format mix (line split not separately disclosed).' },
      { name: 'Non-food retail (general merchandise, electronics, apparel, home)', sharePct: 33, basis: 'estimated', description: 'Higher-ticket, higher-margin general-merchandise categories sold through the hypermarket footprint; more discretionary/cyclical than food.' },
      { name: 'Private label (across food & non-food)', sharePct: 0, basis: 'stated', source: 'Lulu Retail FY2024 release', url: FY24_ZAWYA, description: 'Not a separate line but a mix lever: private label reached 29.6% of total RETAIL revenue in FY2024 (+110bps YoY), structurally lifting gross margin. Embedded in the food/non-food lines above.' },
      { name: 'E-commerce', sharePct: 5, basis: 'stated', source: 'Lulu Retail FY releases', url: FY25_FY, description: 'Online grocery/general-merchandise, ~4.5–5% of retail sales; grew +70% (FY2024) then +38.6% (FY2025). The growth optionality on an otherwise mature base.' },
    ],
    marketRead:
      'GCC grocery is large, defensive and structurally growing (population, tourism, rising UAE/KSA consumption), but mature and intensely competitive. Lulu is the #1/#2 hypermarket operator by footprint, facing Carrefour/Majid Al Futtaim (390+ stores, rebranding to HyperMax), Spinneys (premium), Union Coop, Nesto and Danube/BinDawood. The material uncertainty is not demand but whether Lulu can defend share and a thin ~10% EBITDA margin in a promotional, low-switching-cost category while continuing a profitable store rollout, and whether the post-IPO de-rating (down ~50%) has over-corrected a durable cash generator or correctly priced a low-growth grocer.',
    regulatory:
      'Conventional retail regulation across GCC jurisdictions (food safety, licensing, foreign-ownership rules navigated via the listed structure). UAE 9% federal corporate tax applies from 2023/2024; KSA/other-market tax mix lifts the blended rate (modelled ~12%). No sanctions or adverse-licensing exposure. As a listed ADX entity it carries full FSRA/SCA disclosure obligations — a governance positive.',
    caseFor: [
      'Cheap, liquid, mark-to-market entry: at ~$2.76bn the stock is down ~50% from its ~$5.74bn Nov-24 IPO cap. EV ≈ ~$3.3bn (incl. ~$0.5bn ex-lease net debt) ≈ ~4.2x EV/EBITDA and ~0.42x EV/sales — a steep discount to Almarai (~10x) and Spinneys (~11x), even allowing for thinner margins.',
      'Scale, defensive, cash-generative leader: 267 stores, $7.93bn revenue, $782.2m EBITDA, $204.5m net profit (FY2025), audited and listed. Negative working capital and ~20.5% gross margin (private label 29.6% of retail) make it a resilient staples compounder, not a turnaround.',
      'Clean exit and yield: an ADX listing gives daily liquidity (no IPO-timing risk), a ~7-fils dividend, and a credible strategic-consolidation bid (MAF/regional roll-up) — the public listing is the single biggest exit de-risker versus a private GCC block.',
    ],
    caseAgainst: [
      'Structurally thin, low-growth economics: 9.9% EBITDA / ~2.6% net margin and +4.1% revenue (LFL +2.3%) cap the upside — this is a grocer, not a compounder. EBITDA actually FELL slightly in FY2025 ($786m→$782m) as KSA/Qatar lease reclassification and opex pressured the margin (10.32%→9.9%).',
      'Listed minority with a 60% founder block: Yusuff Ali controls the company; a crossover minority has no governance leverage, limited information rights beyond public disclosure, and exits only at the prevailing market price — and the market has already re-rated the stock down ~50%, a signal not to dismiss.',
      'Promotional, low-moat category: Carrefour/MAF (HyperMax rebrand), Spinneys, Union Coop, Nesto and Danube all compete on price and footprint in the same GCC markets. Margin defence — not demand — is the risk, and a price war or a soft UAE/KSA consumption cycle would compress an already-thin margin.',
    ],
    leadership: [
      { name: 'Yusuff Ali M.A.', role: 'Founder & Chairman / anchor shareholder', note: 'Built the Lulu Group into the largest GCC retailer; retains majority control (~60%) post-IPO. High alignment, but minority investors have limited influence.' },
      { name: 'Saifee Rupawala', role: 'Chief Executive Officer', note: 'Long-tenured group executive; led the company through its 2024 ADX listing and quarterly public reporting.' },
    ],
    leadershipGaps:
      'Founder-controlled listed entity with professional management and Big-4 audited reporting — governance is adequate but minority protections are thin. Diligence items: independent-director composition, related-party transactions with the wider Lulu Group (real estate, sourcing), and capital-allocation discipline on the store rollout.',
    legalStanding:
      'Listed, audited, regulated ADX entity with full public disclosure; no adverse media, sanctions or licensing issues identified. Related-party exposure to the privately-held wider Lulu Group (property, supply) is the main item to scope.',
    valuationVerdict:
      'A cheap, liquid, cash-generative GCC staples leader that the market has de-rated ~50% since IPO. At ~4.2x EV/EBITDA / ~0.42x EV/sales it is well below regional peers (Almarai ~10x, Spinneys ~11x), and the model-DCF (WACC 9.5%, g 2.0%) supports an equity value comfortably above the current ~$2.76bn cap; the thin ~10% EBITDA margin, +4% growth and a 60% founder block mean the discount is partly earned. The investable thesis is acquiring a defensible cash grocer at a trough multiple with a liquid exit, rather than compounding a high-growth franchise.',
    limitations: [
      'Balance-sheet line items are inferred from disclosed aggregates; the audited annual-report splits (ROU vs PP&E, lease liability maturities, segment assets) must be confirmed in diligence.',
      'No standalone disclosure of the KSA/Egypt/India loss-making or margin-dilutive segments; geographic margin mix is not public.',
      'As a listed minority, returns depend on market re-rating and dividends — there is no control premium or forced-liquidity lever.',
    ],
    icThesis:
      'Acquire a liquid crossover minority block in the listed #1/#2 GCC hypermarket operator at a ~50%-de-rated, trough ~4x EV/EBITDA, underwriting a re-rating toward regional staples peers (~7–9x) as the market re-prices a defensive, cash-generative, dividend-paying grocer — with a clean ADX exit and a strategic-consolidation backstop, accepting thin margins, +4% growth and a 60% founder block as the price of the discount.',
    useOfFunds:
      'This is a secondary purchase of listed shares — capital goes to the selling shareholder / market, not the company. There is no primary use of funds; the company self-funds its 18–20 stores/yr rollout from operating cash flow and pays a ~7-fils dividend. The "allocation" below frames how the FUND sizes and stages the block, not a company capital plan.',
    proposedTerms: [
      { label: 'Instrument', value: 'Listed ordinary shares (ADX: LULU), secondary' },
      { label: 'Ownership', value: '~4.4% at the ~$2.76bn market cap (ticket $120m ÷ $2,756m)' },
      { label: 'Protections', value: 'Public-disclosure information rights; minority — no board seat absent a negotiated block' },
      { label: 'Liquidity', value: 'Daily ADX liquidity; block trade for size' },
      { label: 'Conditions to close', value: 'Confirmatory review of audited annual report (BS splits, related-party transactions, segment margins)' },
    ],
    riskRegister: [
      { risk: 'Margin compression', severity: 'high', likelihood: 'medium', impact: 'EBITDA margin already slipped 10.32%→9.9% in FY2025; a price war or cost inflation could push it below 9.5%, hitting the thin net line hard', mitigation: 'Private-label mix (29.6%), scale buying, format optimisation', monitoring: 'Quarterly gross & EBITDA margin, private-label %, promotional intensity' },
      { risk: 'Listed-minority / founder control', severity: 'medium', likelihood: 'high', impact: '60% founder block; no governance leverage, exit at market price', mitigation: 'Size the block for liquidity; rely on public disclosure; negotiate info rights for size', monitoring: 'Free-float, related-party disclosures, dividend policy' },
      { risk: 'Continued share-price de-rating', severity: 'high', likelihood: 'medium', impact: 'Already −50% since IPO; further de-rating directly marks the position down', mitigation: 'Trough-multiple entry, dividend yield cushion, fundamental floor on cash flow', monitoring: 'EV/EBITDA vs peers, earnings vs guidance, fund flows' },
      { risk: 'Competitive intensity (Carrefour/MAF, Spinneys, Union Coop)', severity: 'medium', likelihood: 'high', impact: 'Low-switching-cost category; share/margin pressure from well-capitalised rivals', mitigation: 'Footprint density, private label, loyalty', monitoring: 'LFL vs peers, store-opening cadence, market-share data' },
      { risk: 'GCC consumption cycle', severity: 'medium', likelihood: 'medium', impact: 'Non-food (33% of mix) is discretionary; soft UAE/KSA consumption hits the higher-margin basket', mitigation: 'Defensive food core, geographic spread', monitoring: 'LFL by category, footfall, consumer-confidence data' },
    ],
    recommendationSummary:
      'Review → lean proceed for a value/crossover sleeve. Lulu is a defensible, cash-generative, dividend-paying GCC grocery leader trading at a ~50%-de-rated trough multiple (~4x EV/EBITDA) with a liquid ADX exit — a genuine value entry. The offsets are real: thin ~10% EBITDA margins that slipped in FY2025, +4% growth, a 60% founder block and minority status. Size it as a liquid value position underwritten to a re-rating toward regional peers, not as a high-conviction compounder.',
    scenarioNarratives: {
      bear: 'A GCC price war and soft consumption push EBITDA margin below 9.5% and revenue growth toward flat; the market keeps the stock at an EM-grocer multiple (~4–4.5x, Lenta-like). The position is roughly flat-to-down on price, with the dividend providing a modest cushion — a sub-hurdle outcome.',
      base: 'Lulu holds ~10% EBITDA margin and grows revenue ~4% on the store rollout and private-label mix; the market re-rates partway toward regional staples peers (~6–7x EV/EBITDA) as the post-IPO overhang clears. Combined with ~3% dividend yield this clears the hurdle on a 5-year hold.',
      bull: 'Margin recovers toward 10.5%+ on private-label and e-commerce scale, growth holds at the top of guidance, and a strategic consolidation (MAF/regional roll-up) or full re-rating to peer multiples (~9x) drives a step-change — a strong IRR well above hurdle, consistent with the model-DCF upside.',
    },
    thesisDrivers: [
      'Multiple re-rating: entry at ~4.2x EV/EBITDA vs regional staples at ~10–11x (Almarai, Spinneys). Even a partial close to ~7x on a flat-to-modestly-growing EBITDA base is the primary return engine.',
      'Defensive cash compounding: $782m EBITDA, negative working capital and a self-funded 18–20 stores/yr rollout generate steady free cash flow and a ~7-fils dividend — the dividend yield is earned during the holding period ahead of any re-rating.',
      'Private-label & e-commerce mix shift: private label (29.6% of retail) and e-commerce (+38.6%) structurally lift gross margin and growth on an otherwise mature base, supporting margin defence and a modest growth premium.',
    ],
    thesisBreakers: [
      'EBITDA margin breaks below ~9% on a sustained basis (price war or cost inflation) — the thin net line turns the cheap multiple into a value trap.',
      'The market refuses to re-rate: the stock stays at an EM-grocer ~4–4.5x multiple for the whole hold, so the return collapses to dividend yield alone.',
      'Founder/related-party governance deteriorates (value-leaking related-party deals with the private Lulu Group), eroding minority confidence and the float.',
      'A structural share loss to Carrefour/HyperMax or Nesto in the core UAE/KSA markets caps both growth and the re-rating case.',
    ],
    marketContext:
      'GCC grocery retail is a large, defensive staple market underpinned by population growth, tourism and rising UAE/KSA consumption; the UAE and KSA modern-grocery segments are growing mid-single-digits. It is mature and competitive: Carrefour/Majid Al Futtaim (390+ stores, rebranding to HyperMax), Spinneys (premium, listed DFM), Union Coop, Nesto and Danube/BinDawood all compete on price and footprint. Regulation is conventional (food safety, licensing, foreign-ownership via the listed structure); the UAE 9% corporate tax (2023/24) and a KSA/other-market mix lift the blended rate. The key headwind is margin: a thin, promotional category where scale and private label — not pricing power — defend the ~10% EBITDA margin.',
    moat: {
      pillars: [
        'Footprint density & locations: 267 stores across 7 countries with anchored hypermarket sites — hard and slow to replicate.',
        'Scale buying & supplier terms: $7.9bn of purchasing power supports negative working capital and gross-margin defence.',
        'Private-label depth: 29.6% of retail revenue (+110bps YoY), a structural margin lever rivals must build over years.',
        'Brand & loyalty in the South-Asian-expat and value segments across the GCC.',
      ],
      competitors: [
        { name: 'Carrefour / Majid Al Futtaim (HyperMax)', note: 'The largest GCC grocery rival by scale; rebranding and re-investing — sets promotional intensity.' },
        { name: 'Spinneys 1961 (DFM)', note: 'Premium, faster-growing (+13%), higher-margin (~20%) listed comp — competes at the top end.' },
        { name: 'Union Coop / Nesto / Danube (BinDawood)', note: 'Value and Saudi-format competitors on the same price-led shopper.' },
      ],
      trajectory:
        'GCC modern grocery is consolidating around a few scale operators as coops and independents cede share; Lulu and Carrefour/MAF are the two scale anchors. Over 3–5 years expect continued footprint expansion, private-label and e-commerce mix shift, and possible M&A — a slow-consolidation, margin-defence arc rather than high-growth share capture.',
      erosionScenarios: [
        'A Carrefour/HyperMax price-and-footprint offensive compresses Lulu’s thin margin in core UAE/KSA markets.',
        'A discount/hard-discount entrant (or aggressive e-commerce/quick-commerce player) reshapes the value segment.',
        'A soft GCC consumption cycle pressures the discretionary non-food mix (33% of revenue) where margins are highest.',
      ],
    },
    qualityOfEarnings:
      'Earnings quality is HIGH: Lulu is a listed ADX company reporting audited, IFRS, quarterly financials since its Nov-2024 IPO. Revenue, EBITDA and net profit are stated and reconcilable across FY2024/FY2025 releases. The principal caveats are (1) the EBITDA definition is pre-lease (IFRS-16), so headline 9.9% margin and ~3.3x lease-inclusive leverage must be read together — ex-lease net debt is only ~$0.5bn; (2) the FY2025 EBITDA dip ($786m→$782m) partly reflects a KSA/Qatar lease reclassification (lease cost moved from D&A/interest into opex), so cross-year EBITDA comparability needs adjustment; (3) related-party transactions with the wider private Lulu Group (real estate, sourcing) require scoping. Diligence: pull the audited annual report for segment margins, lease-maturity profile, related-party notes and the ROU/PP&E split underlying the inferred balance sheet.',
    recentDevelopments:
      'FY2025 (reported Feb-2026): record revenue $7.93bn (+4.1%), LFL +2.3%, EBITDA $782.2m (9.9%), net profit $204.5m, 267 stores, e-commerce +38.6%; total dividend 7 fils/share; 2026 guidance of 4–5% revenue growth, flat EBITDA margin and +10% net profit. H1-2025 had shown +5.9% revenue and +9.1% net income, so growth moderated in H2. The shares have de-rated ~50% from the ~$5.74bn IPO cap to ~$2.76bn as the market re-priced a low-growth grocer. Sector-wide, Majid Al Futtaim is retiring the Carrefour brand in favour of HyperMax — a competitive reshuffle in Lulu’s core markets worth monitoring.',
    useOfFundsBreakdown: [
      { category: 'Open-market / block purchase of LULU shares', pct: 80, rationale: 'The bulk of the ticket buys listed shares at the trough multiple — the position itself; secondary, to the seller/market, not the company.' },
      { category: 'Reserve for averaging-in / volatility', pct: 12, rationale: 'A liquid, recently de-rated stock — hold dry powder to add on further weakness and improve the entry blended multiple.' },
      { category: 'Diligence & monitoring', pct: 5, rationale: 'Confirmatory review of audited annual-report BS splits, related-party transactions and segment margins; ongoing quarterly monitoring.' },
      { category: 'Transaction & advisory costs', pct: 3, rationale: 'Brokerage, block-trade execution and legal for an ADX-listed acquisition.' },
    ],
    termSheet: {
      instrument: 'Listed ordinary shares (ADX: LULU), secondary purchase',
      ownership: '~4.4% at the ~$2,756m market cap ($120m ticket ÷ $2,756m, illustrative)',
      boardGovernance: 'Minority public shareholder — no board seat absent a negotiated significant block; information limited to public ADX disclosure plus any negotiated investor-relations access.',
      preferentialRights: [
        'None beyond standard listed-shareholder rights (no liquidation preference, anti-dilution or pro-rata as a secondary buyer).',
        'Dividend participation pari passu with the float (~7 fils/share FY2025).',
        'Daily market liquidity / block-trade exit; tag-along only via market.',
      ],
      conditionsPrecedent: [
        'Confirmatory review of the audited annual report — ROU/PP&E split, lease-maturity profile, segment margins.',
        'Related-party transaction review (real estate / sourcing with the private Lulu Group).',
        'Internal liquidity / position-sizing sign-off given ADX float and average daily volume.',
      ],
    },
  },
  createdAt: '2026-06-06',
}
