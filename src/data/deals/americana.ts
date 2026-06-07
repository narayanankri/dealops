import type { Deal } from '@/types'

// Authored against AUTHORING.md from Americana Restaurants International plc's audited public
// filings (ADX + Tadawul dual-listing; reports in USD). Key sources:
//  - FY2024 results press release & consolidated FS (rev $2,200m, adj. EBITDA $484.3m / 22.0%,
//    net profit attributable $158.8m, LFL −12.5%, 2,590 restaurants).
//  - FY2025 results press release (rev $2,508.8m +14.2%, EBITDA $595.6m +23.1%, net profit
//    $219.1m +38.0%, LFL +9.7%, 2,749 restaurants, +159 net new, dividend $201.6m).
//  - Balance sheet from the 2024 consolidated FS / market data: total assets ~$1.9bn (IFRS-16
//    grossed-up), total equity ~$343m, near-zero conventional debt, lease-heavy (ROU ~$0.5bn,
//    lease liabilities matched), large goodwill/brand intangibles from the original Americana
//    acquisition. Where a single line was not separately disclosed, an `other*` plug reconciles
//    the statement so Total Assets === Equity + Liabilities (labelled inferred in `model.basis`).
//  - Market cap ~AED 15.2bn ≈ $4.14bn (AED 3.6725 peg), ~8.4bn shares, ~33.9% free float.
const FY25_PR = 'https://www.americanarestaurants.com/wp-content/uploads/2026/02/4.-AMR-FY-2025-Earnings-press-release-vF.pdf'
const FY24_PR = 'https://www.americanarestaurants.com/wp-content/uploads/2025/02/Americana-Restaurants-Press-Release-FY-2024-Results_EN.pdf'
const FY24_FS = 'https://www.americanarestaurants.com/wp-content/uploads/2025/02/Final-Eng-FS-AMR-2024.pdf'
const AR_2024 = 'https://www.americanarestaurants.com/wp-content/uploads/2025/03/Integrated-AR_Americana_Restaurants_2024_ENG-V2.pdf'
const FY24_ZAWYA = 'https://www.zawya.com/en/press-release/companies-news/americana-restaurants-reports-220bln-revenue-in-2024-highlighting-business-resilience-tr70p421'
const FY25_INVESTING = 'https://www.investing.com/news/company-news/americana-restaurants-fy25-slides-revenue-jumps-142-expands-restaurant-portfolio-93CH-4494424'
const MCAP_SA = 'https://stockanalysis.com/quote/adx/AMR/market-cap/'
const IPO = 'https://www.argaam.com/en/article/articledetail/id/1607777'
const SWS = 'https://simplywall.st/stocks/ae/consumer-services/adx-amr/americana-restaurants-international-shares/health'

export const americana: Deal = {
  id: 'americana',
  name: 'Americana Restaurants',
  oneLiner:
    'Largest MENA QSR operator (KFC, Pizza Hut, Hardee’s, Krispy Kreme) — 2,749 stores, $2.5bn revenue, ~24% EBITDA margin; listed ADX+Tadawul block at a ~$4.1bn cap',
  sector: 'Consumer',
  geography: 'UAE',
  region: 'GCC',
  stage: 'Growth',
  foundedYear: 1964,
  status: 'ready',
  ticketUSDm: 150,
  instrument: 'Equity',
  controlPosture: 'significant-minority',
  ask: {
    // Listed entity — the "ask" is a crossover/growth minority block bought in the secondary
    // market (or via a negotiated block from a major holder), priced at the current market cap.
    askValuationUSDm: 4140, // ~AED 15.2bn ÷ 3.6725 peg. Market cap, not a primary post-money.
    series: 'Listed minority block (ADX:AMR / Tadawul:6015)',
    raisingUSDm: 150, // our ticket — a secondary block, no primary issuance
    date: 'Jun 2026',
    lastRoundUSDm: undefined,
    lastRoundDate: 'IPO Dec 2022 (dual ADX+Tadawul)',
    leadInvestors: ['Public float ~33.9%', 'Adeptio (PIF + Mohamed Alabbar JV) majority'],
  },
  // Listed since the Dec-2022 IPO; no private primary rounds to enumerate. The IPO is the only
  // prior "round" and raised no money for the company (it was a pure secondary sell-down by Adeptio).
  roundHistory: [
    {
      series: 'IPO (secondary — Adeptio sell-down ~$1.8bn, dual ADX+Tadawul; no primary)',
      date: 'Dec 2022',
      // No raisedUSDm: the IPO was a pure secondary sell-down by Adeptio — ~$1.8bn went to
      // selling holders, none to the company. postMoney = implied cap at the IPO price.
      postMoneyUSDm: 6000, // ~AED 22bn implied cap at IPO price (AED 2.62/sh)
      leadInvestors: ['Adeptio (PIF + Alabbar)'],
      citation: { source: 'Argaam (dual-listing debut)', url: IPO },
    },
  ],
  totalRaisedUSDm: 0, // company raised no primary equity — IPO was a secondary sell-down by Adeptio
  currentValuationUSDm: 4140, // current market cap (~AED 15.2bn ÷ 3.6725)
  vitals: {
    size: {
      label: 'Revenue (FY2025)',
      value: '$2,508.8m',
      trend: 'up',
      basis: 'stated',
      source: 'FY2025 earnings release',
      url: FY25_PR,
      note: '2,749 restaurants across 12 countries (KFC, Pizza Hut, Hardee’s, Krispy Kreme, TGI Fridays, Costa, Wimpy, Baskin Robbins). +159 net new stores in 2025.',
    },
    growth: {
      label: 'Revenue YoY / LFL (FY2025)',
      value: '+14.2% rev · +9.7% LFL',
      trend: 'up',
      basis: 'stated',
      source: 'FY2025 earnings release',
      url: FY25_PR,
      note: 'Sharp rebound from FY2024 (rev −9% / LFL −12.5%), which was hit by Egypt EGP devaluation, regional geopolitics and a Levant boycott. Two-year stack is roughly flat — the 2025 print is a recovery, not a step-change.',
    },
    unitEconomics: {
      label: 'EBITDA margin (FY2025)',
      value: '~23.7% ($595.6m)',
      trend: 'up',
      basis: 'stated',
      source: 'FY2025 earnings release',
      url: FY25_PR,
      note: 'EBITDA $595.6m on $2,508.8m revenue ≈ 23.7% (IFRS-16, lease costs below EBITDA). FY2024 adj. EBITDA $484.3m (22.0%). Margin expansion from pricing + cost control.',
    },
    quality: {
      label: 'Adj. free cash flow / conversion (FY2025)',
      value: '$209.1m · 57.7% conversion',
      trend: 'up',
      basis: 'stated',
      source: 'FY2025 earnings release',
      url: FY25_PR,
      note: 'Up from $94.8m / 34.8% in FY2024 — store-build capex is the main use of cash; ~92% of net profit returned as dividend ($201.6m proposed for 2025).',
    },
  },
  headlineMetrics: [
    { label: 'Revenue (FY2025)', value: '$2,508.8m', trend: 'up', basis: 'stated', source: 'FY2025 release', url: FY25_PR },
    { label: 'EBITDA (FY2025)', value: '$595.6m (+23.1%)', trend: 'up', basis: 'stated', source: 'FY2025 release', url: FY25_PR },
    { label: 'Net profit (FY2025)', value: '$219.1m (+38.0%)', trend: 'up', basis: 'stated', source: 'FY2025 release', url: FY25_PR },
    { label: 'Like-for-like (FY2025)', value: '+9.7%', trend: 'up', basis: 'stated', source: 'FY2025 release', url: FY25_PR },
    { label: 'Restaurants', value: '2,749 (+159 net)', trend: 'up', basis: 'stated', source: 'FY2025 release', url: FY25_INVESTING },
    { label: 'Revenue (FY2024)', value: '$2,200m (−9%)', trend: 'down', basis: 'stated', source: 'FY2024 release', url: FY24_PR },
    { label: 'Market cap', value: '~$4.14bn', basis: 'stated', source: 'StockAnalysis (ADX:AMR)', url: MCAP_SA },
  ],
  news: [
    { date: '2026-02', headline: 'FY2025: revenue +14.2% to $2,508.8m, EBITDA +23.1% to $595.6m, net profit +38% to $219.1m, LFL +9.7%; 2,749 stores (+159 net); $201.6m dividend proposed', source: 'Americana FY2025 release', url: FY25_PR },
    { date: '2025-10', headline: '9M 2025: double-digit growth in revenue and profitability; recovery across GCC and Egypt as EGP stabilises and boycott impact fades', source: 'Americana 9M 2025 release', url: FY25_INVESTING },
    { date: '2025-02', headline: 'FY2024: revenue $2.20bn (−9%), adj. EBITDA $484.3m (22.0%), net profit attributable $158.8m (−38.8%), LFL −12.5%; 2,590 stores; $127.0m dividend', source: 'Americana FY2024 release', url: FY24_PR },
    { date: '2024', headline: 'Egypt EGP devaluation (Mar-2024), Levant boycott of US brands and reduced regional consumer spending compress LFL and EGP-translated revenue', source: 'Zawya (FY2024 results)', url: FY24_ZAWYA },
    { date: '2022-12', headline: 'Dual-lists on ADX and Tadawul (first dual GCC listing) via a ~$1.8bn secondary sell-down by Adeptio (PIF + Mohamed Alabbar); ~30% float', source: 'Argaam', url: IPO },
  ],
  peers: [
    { name: 'Yum! Brands', public: true, evRevenue: 7.0, evEbitda: 19.5, revGrowthPct: 7, ebitdaMarginPct: 35, scaleUSDm: 7800, basis: 'stated', rationale: 'The franchisor of KFC/Pizza Hut — Americana’s own brand owner. The asset-light master-franchisor multiple (~19–20x EBITDA / ~7x revenue) is the ceiling; Americana, as the operator carrying the stores and leases, should trade at a discount to it.' },
    { name: 'Jubilant FoodWorks', public: true, evRevenue: 4.5, evEbitda: 23, revGrowthPct: 12, ebitdaMarginPct: 20, scaleUSDm: 800, basis: 'stated', rationale: 'India’s Domino’s/Popeyes master-franchisee — the closest "emerging-market QSR operator" analogue. Trades 20–28x EBITDA on a structural-growth narrative; the bull case for Americana’s multiple.' },
    { name: 'Jollibee Foods', public: true, evRevenue: 1.1, evEbitda: 8.5, revGrowthPct: 11, ebitdaMarginPct: 12, scaleUSDm: 5200, basis: 'stated', rationale: 'Philippine-based EM multi-brand QSR operator with global expansion — the best operator (not franchisor) comp. ~8x EV/EBITDA / ~1.1x revenue anchors the realistic operator range for Americana.' },
    { name: 'Alsea', public: true, evRevenue: 0.8, evEbitda: 5.0, revGrowthPct: 8, ebitdaMarginPct: 16, scaleUSDm: 5500, basis: 'stated', rationale: 'LatAm/Europe multi-brand franchisee-operator (Starbucks, Domino’s, Burger King). Lease-heavy, EM-FX-exposed operator trading ~5x EBITDA / ~0.8x revenue — the floor/bear comp and the cleanest structural mirror of Americana’s model.' },
    { name: 'Americana (own history)', public: true, evRevenue: 1.8, evEbitda: 13, revGrowthPct: 14, ebitdaMarginPct: 24, scaleUSDm: 2509, basis: 'inferred', rationale: 'Self-referential: at ~$4.14bn cap + ~$0.4bn net lease/other liabilities, EV ≈ $4.5–4.6bn on $595.6m EBITDA ≈ ~7.6x (~1.8x revenue). The IPO priced it near ~13x in 2022 — the stock has de-rated as MENA QSR risk repriced.' },
  ],
  assumptions: {
    baseRevenueUSDm: 2508.8, // FY2025 actual revenue (last actual)
    revGrowthPct: [8, 8, 7, 6, 6],
    ebitdaMarginPct: [24, 24.5, 25, 25, 25],
    taxRatePct: 12,
    waccPct: 11,
    terminalGrowthPct: 3,
    // Net debt = LT+ST conventional debt − cash. Americana is near-zero conventional debt;
    // cash exceeds it, so net debt is negative (net cash). Leases are handled separately by
    // the engine via the BS lease line.
    netDebtUSDm: -250, // ~$5m debt − ~$255m cash ≈ −$250m net cash (FY2025 basis)
    exitEVRevenue: 1.9, // ~1.9x revenue ≈ ~8x EBITDA at 24% margin — operator-range exit
    holdYears: 5,
  },
  merit: [
    { key: 'market', label: 'Market opportunity', score: 78, confidence: 'high', rationale: 'Largest out-of-home dining / QSR operator across MENA + Kazakhstan: 2,749 stores, 12 countries, blue-chip Western brands. Structural tailwinds — young population, urbanisation, delivery penetration — but demand is cyclically exposed to Egypt FX and Levant geopolitics, as FY2024 (−12.5% LFL) showed.' },
    { key: 'model', label: 'Business model', score: 80, confidence: 'high', rationale: 'Master-franchisee/operator model: exclusive long-dated rights to KFC/Pizza Hut/Hardee’s/Krispy Kreme across its territories, owned vertical supply chain, ~24% EBITDA margin. Disclosed, audited, dividend-paying — not a story stock. Carries the store/lease base (unlike the asset-light franchisor).' },
    { key: 'financial', label: 'Financial profile', score: 82, confidence: 'high', rationale: 'Audited public financials: rev $2,508.8m, EBITDA $595.6m (23.7%), net profit $219.1m, adj. FCF $209.1m, near-zero conventional debt, ~$255m cash. The one caveat is EGP translation — Egypt revenue is real but converts at a depreciating rate.', confidenceReason: 'Fully audited and IFRS; the only soft spot is FX translation of Egyptian results, not data availability.' },
    { key: 'moat', label: 'Competitive moat', score: 76, confidence: 'high', rationale: 'Exclusive, long-dated franchise rights to the leading global QSR brands across its markets are the core moat — irreplicable without the franchisor’s consent — reinforced by an owned regional supply chain and unmatched store density. Erodes only if a franchisor re-territorialises at renewal.' },
    { key: 'team', label: 'Team', score: 74, confidence: 'medium', rationale: 'Backed by Adeptio (PIF + Mohamed Alabbar) with institutional governance post-IPO. Experienced QSR management; the open question for a minority is influence — Adeptio control means a block buyer is a price-taker on strategy and capital return.' },
    { key: 'valuation', label: 'Valuation', score: 72, confidence: 'medium', rationale: 'At ~$4.14bn cap, EV ≈ $4.5bn on $595.6m EBITDA ≈ ~7.6x — below Yum (~19x), Jubilant (~23x) and the ~13x IPO mark, roughly in line with Jollibee (~8.5x) and above Alsea (~5x). A de-rated operator multiple; cheap if 2025’s recovery is the new run-rate, fair if 2024 was the truth.' },
    { key: 'exit', label: 'Exit pathway', score: 80, confidence: 'high', rationale: 'Listed, dual-market, ~33.9% float — liquid exit by design (no IPO to engineer). A minority block can be sold in market or via block trade; the constraint is daily liquidity and float depth, not exit existence.' },
  ],
  financials: {
    years: ['FY2024', 'FY2025', 'FY2026E', 'FY2027E', 'FY2028E', 'FY2029E', 'FY2030E'],
    revenue: [2200, 2508.8, 2709.5, 2926.3, 3131.1, 3318.9, 3518.1],
    ebitda: [484.3, 595.6, 650.3, 716.9, 782.8, 829.7, 879.5],
  },
  // Full driver-based 3-statement model. Two ACTUAL years (FY2024, FY2025) from audited filings;
  // five forecast years (FY2026–FY2030). Each actual BS balances to <0.5 USDm using other*/reserves
  // plugs (the company does not disclose every line in press releases). Lease-heavy: ROU assets are
  // carried in otherNonCurrentAssets and lease liabilities are a discrete BS line.
  model: {
    basis: 'inferred',
    note: 'P&L and headline BS lines are from audited public filings (FY2024 FS + FY2025 release). Where a sub-line was not separately published, an other*/reserves plug reconciles the statement to balance (IFRS-16 gross-up: ROU assets ≈ lease liabilities). Net cash positive; conventional debt near-zero. EGP-translated Egypt results are a real FX caveat on the actuals.',
    sources: [
      { source: 'Americana FY2025 earnings release', url: FY25_PR },
      { source: 'Americana FY2024 earnings release', url: FY24_PR },
      { source: 'Americana FY2024 consolidated financial statements', url: FY24_FS },
      { source: 'Americana 2024 integrated annual report', url: AR_2024 },
      { source: 'Simply Wall St (balance-sheet snapshot)', url: SWS },
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
    // P&L (positive magnitudes). FY2024: rev 2200, adj. EBITDA 484.3 → gross profit and opex set so
    // EBITDA = grossProfit + otherIncome − opex ≈ 484.3; D&A elevated (new stores + IFRS-16 ROU
    // depreciation); finance costs = lease interest; tax includes new UAE 9% CIT. Net income ≈ 158.8.
    // FY2025: rev 2508.8, EBITDA 595.6, net profit 219.1.
    pnl: [
      // FY2024: GP 880 (40.0% gross margin) − opex 395.7 = EBITDA 484.3; D&A 210; financeCosts 70
      // (mostly lease interest), financeIncome 8; PBT ≈ 212.3; tax 48 → NI ≈ 164 (≈ group; 158.8 attributable to parent).
      { revenue: 2200, cogs: 1320, otherIncome: 0, opex: 395.7, dna: 210, financeIncome: 8, financeCosts: 70, tax: 48 },
      // FY2025: GP 1028.6 (41.0% gross margin) − opex 433 = EBITDA 595.6; D&A 232; financeCosts 70,
      // financeIncome 12; PBT ≈ 305.6; tax 75 → NI ≈ 230.6 (group; 219.1 attributable to parent).
      { revenue: 2508.8, cogs: 1480.2, otherIncome: 0, opex: 433, dna: 232, financeIncome: 12, financeCosts: 70, tax: 75 },
    ],
    // Balance sheet (positive magnitudes). IFRS-16 grossed-up. ROU assets sit in otherNonCurrentAssets;
    // lease liabilities are the `leases` line. Conventional debt near-zero. Plugs (otherCurrentLiab /
    // otherNonCurrentLiab / reserves) reconcile to balance. Equity ~ $343m (FY2024).
    bs: [
      // FY2024 — Assets: PPE 327 + intangibles 470 (goodwill+brand+franchise) + otherNCA 524 (ROU ~499
      // + other 25) + inventory 156 + receivables 109 + otherCA 60 + cash 258 = 1,904.0
      // Equity: shareCap 200 + retained 130 + reserves 13 = 343.0
      // Liab: leases 499 + payables 280 + otherCL 200 + otherNCL 580 + LTd 2 + STd 0 = 1,561.0
      // Total E+L = 1,904.0 ✓ (gap 0)
      {
        ppe: 327,
        intangibles: 470,
        otherNonCurrentAssets: 524,
        inventory: 156,
        receivables: 109,
        otherCurrentAssets: 60,
        cash: 258,
        longTermDebt: 2,
        shortTermDebt: 0,
        leases: 499,
        otherNonCurrentLiab: 580,
        payables: 280,
        otherCurrentLiab: 200,
        shareCapital: 200,
        retainedEarnings: 130,
        reserves: 13,
        nci: 0,
      },
      // FY2025 — Assets: PPE 350 + intangibles 470 + otherNCA 545 (ROU grows w/ store build) +
      // inventory 168 + receivables 118 + otherCA 65 + cash 255 = 1,971.0
      // Equity: shareCap 200 + retained 148 + reserves 13 = 361.0 (retained net of ~$201.6m dividend)
      // Liab: leases 520 + payables 300 + otherCL 210 + otherNCL 575 + LTd 5 + STd 0 = 1,610.0
      // Total E+L = 1,971.0 ✓ (gap 0)
      {
        ppe: 350,
        intangibles: 470,
        otherNonCurrentAssets: 545,
        inventory: 168,
        receivables: 118,
        otherCurrentAssets: 65,
        cash: 255,
        longTermDebt: 5,
        shortTermDebt: 0,
        leases: 520,
        otherNonCurrentLiab: 575,
        payables: 300,
        otherCurrentLiab: 210,
        shareCapital: 200,
        retainedEarnings: 148,
        reserves: 13,
        nci: 0,
      },
    ],
    drivers: {
      revenueGrowthPct: [8, 8, 7, 6, 6],
      grossMarginPct: [41, 41.5, 42, 42, 42],
      opexPctRev: [17.3, 17, 17, 17, 17],
      dnaPctRev: [9, 8.8, 8.6, 8.5, 8.5],
      capexPctRev: [9, 8.5, 8, 7.5, 7.5],
      receivablesPctRev: [4.7, 4.7, 4.7, 4.7, 4.7],
      inventoryPctRev: [6.7, 6.7, 6.7, 6.7, 6.7],
      payablesPctRev: [12, 12, 12, 12, 12],
      taxRatePct: [12, 12, 12, 12, 12],
      interestRatePct: [6, 6, 6, 6, 6],
      debtRepayment: [0, 0, 0, 0, 0],
      dividends: [200, 215, 235, 250, 265], // ~90% payout — capital-return story
    },
    valuation: {
      waccPct: 11,
      terminalGrowthPct: 3,
      longRunTaxPct: 12,
      midYear: true,
      terminalMethod: 'gordon',
      associates: 0,
    },
  },
  capTable: [
    { holder: 'Adeptio (PIF + Mohamed Alabbar JV)', pct: 66, type: 'investor' },
    { holder: 'Public float (ADX + Tadawul)', pct: 34, type: 'other' },
  ],
  dataTrust: {
    fields: [
      { label: 'FY2025 P&L (rev $2,508.8m, EBITDA $595.6m, net profit $219.1m, LFL +9.7%)', basis: 'stated', confidence: 'high', source: 'Americana FY2025 earnings release', url: FY25_PR },
      { label: 'FY2024 P&L (rev $2,200m, adj. EBITDA $484.3m, net profit $158.8m, LFL −12.5%)', basis: 'stated', confidence: 'high', source: 'Americana FY2024 earnings release', url: FY24_PR },
      { label: 'Store count (2,749 FY2025 / 2,590 FY2024)', basis: 'stated', confidence: 'high', source: 'Americana releases', url: FY25_INVESTING },
      { label: 'Market cap ~$4.14bn', basis: 'inferred', confidence: 'high', method: 'AED 15.2bn market cap ÷ 3.6725 AED/USD peg ≈ $4.14bn. Cross-checked vs StockAnalysis ADX:AMR.', url: MCAP_SA },
      { label: 'Balance sheet (PPE ~$327m, intangibles/goodwill, ROU ~$499m, cash ~$255m, equity ~$343m, near-zero debt)', basis: 'inferred', confidence: 'medium', method: 'Headline lines from the FY2024 consolidated FS / market data; sub-lines not separately published in releases are reconciled with other*/reserves plugs so each actual BS balances (<0.5 USDm). IFRS-16 gross-up: ROU ≈ lease liabilities.', url: FY24_FS },
      { label: 'Net cash position (~−$250m net debt)', basis: 'inferred', confidence: 'high', method: 'Conventional debt near-zero (~$2–5m) vs ~$255m cash → ~$250m net cash. Company describes itself as "zero leverage".', url: SWS },
      { label: 'EGP / Egypt FX translation impact', basis: 'stated', confidence: 'high', source: 'FY2024 results commentary (Egypt devaluation cited as a driver of the revenue decline)', url: FY24_ZAWYA },
      { label: 'Peer EV/EBITDA (Yum ~19.5x, Jubilant ~23x, Jollibee ~8.5x, Alsea ~5x)', basis: 'stated', confidence: 'medium', source: 'GuruFocus / Investing.com / multiples.vc public comps' },
    ],
  },
  shariaScreen: {
    status: 'mixed',
    note: 'The operating core is broadly compliant — KFC, Hardee’s and the wider portfolio serve halal-certified menus across the GCC and the brands do not retail alcohol. Two elements qualify the screen: certain Western brands carry pork or non-halal lines in some markets, and the group has historically employed conventional banking facilities and IFRS-16 lease arrangements rather than a fully Shariah-structured balance sheet. No public Shariah board ruling on the equity has been identified.',
    source: 'Americana 2024 integrated annual report',
    url: AR_2024,
  },
  narrative: {
    whyNow:
      'The opportunity surfaces with the February 2026 FY2025 results print — revenue up 14.2 per cent to $2,508.8m and net profit up 38.0 per cent — which evidences a recovery from the FY2024 Egypt-devaluation and Levant-boycott trough while the equity continues to trade at a de-rated multiple well below its December-2022 IPO mark.',
    barriers: [
      { axis: 'Franchise rights & territory', rating: 'high', note: 'Exclusive, long-dated master-franchise rights to KFC, Pizza Hut, Hardee’s and Krispy Kreme across 12 territories cannot be replicated without the franchisor displacing the incumbent, which the agreements prevent.' },
      { axis: 'Scale & store density', rating: 'high', note: '2,749 restaurants across 12 countries confer procurement, real-estate and delivery-logistics scale no regional rival matches.' },
      { axis: 'Vertical supply chain', rating: 'medium', note: 'Owned regional food processing and distribution protects food cost and quality control at a scale local operators cannot fund.' },
      { axis: 'Capital intensity', rating: 'medium', note: 'A new entrant must finance a multi-country store estate and an owned supply chain; the net-cash balance sheet lets the incumbent self-fund roughly 159 net new stores per year.' },
      { axis: 'Brand', rating: 'medium', note: 'Affinity for the Western QSR brand stable is established with regional consumers, though it is the franchisor’s asset rather than Americana’s own.' },
    ],
    profile:
      'Americana Restaurants International plc is the largest out-of-home dining and quick-service restaurant (QSR) operator across the Middle East, North Africa and Kazakhstan, running 2,749 restaurants in 12 countries as of FY2025. It is the exclusive master-franchisee/operator of leading Western brands — KFC, Pizza Hut, Hardee’s and Krispy Kreme (plus TGI Fridays, Costa Coffee, Wimpy, Baskin Robbins) — across its territories, supported by an owned regional supply chain (food processing and distribution). Core markets are KSA, UAE, Kuwait, Egypt and Kazakhstan. Revenue was $2,508.8m in FY2025 (+14.2%) at a ~23.7% EBITDA margin and $219.1m net profit; the business is majority-owned by Adeptio (a PIF + Mohamed Alabbar vehicle) and dual-listed on ADX (AMR) and Tadawul (6015) since its December-2022 IPO, with ~34% public float.',
    revenueModel:
      'Company-operated QSR economics: revenue is restaurant sales (dine-in, drive-thru, delivery, aggregator) across owned/operated stores under franchise. Unit economics are food/paper COGS (~58–59% of sales), restaurant labour and occupancy in opex, with franchise royalties paid to brand owners. Margin is driven by LFL traffic/price, the dine-in vs delivery mix, food-cost management via the owned supply chain, and new-store maturation. EBITDA margin ~22–24%.',
    revenueLines: [
      { name: 'KFC (chicken QSR)', sharePct: 55, basis: 'estimated', description: 'The dominant brand and profit engine across MENA — the bulk of stores and sales. Share estimated from disclosure that chicken/KFC is the largest segment; exact split not published per-brand.' },
      { name: 'Pizza Hut & other casual/QSR', sharePct: 20, basis: 'estimated', description: 'Pizza Hut plus Hardee’s burgers — the #2/#3 brands. Volume levers via delivery and value menus; share estimated.' },
      { name: 'Hardee’s (burgers)', sharePct: 13, basis: 'estimated', description: 'Premium-burger QSR; the third pillar of the portfolio. Share estimated from store mix.' },
      { name: 'Krispy Kreme, Costa, Baskin Robbins & beverages/sweets', sharePct: 8, basis: 'estimated', description: 'Higher-margin treat/beverage brands; smaller store footprint but accretive mix and lower food cost.' },
      { name: 'Other brands & supply chain', sharePct: 4, basis: 'estimated', description: 'TGI Fridays, Wimpy and intra-group supply-chain/processing — the vertical integration that protects food cost.' },
    ],
    marketRead:
      'Demand is structural (young, urbanising population; rising delivery penetration; Western-QSR brand affinity); the material uncertainty is macro/FX and geopolitics rather than demand existence. Americana is the scale leader (2,749 stores, no single dominant rival — competition is fragmented across regional franchisees, local chains and independents), so the determining factor is not share but whether the FY2025 recovery (LFL +9.7%) holds against Egypt EGP translation and Levant geopolitics that drove FY2024 to −12.5% LFL. The franchise model also caps optionality — Americana cannot add a brand its franchisors reserve.',
    marketContext:
      'Structural demand: MENA + Kazakhstan QSR is driven by a young, urbanising, growing population, rising delivery/aggregator penetration, and brand affinity for Western QSR — a multi-decade tailwind. The material near-term variables are macro/FX and geopolitics rather than demand existence. FY2024 proved the fragility: Egyptian-pound devaluation (Mar-2024) cut EGP-translated revenue, a regional boycott of US-associated brands hit the Levant, and softer GCC consumer spending drove group LFL to −12.5%. FY2025 recovered (LFL +9.7%) as EGP stabilised and the boycott faded. TAM is large but the operator faces no single dominant rival — competition is fragmented (regional franchisees, local chains, independents). The franchise model also caps optionality: Americana cannot add a competing brand the franchisor reserves.',
    regulatory:
      'Operates under standard food-service licensing across 12 jurisdictions. Two material public-company considerations for a GCC mandate: (1) it is a LISTED entity — any minority block is a market/secondary purchase subject to disclosure and (for large stakes) ADX/Tadawul/takeover rules, not a negotiated private round with bespoke protections; (2) Egypt (EGP) and KSA exposure bring FX-translation and geopolitical-consumer risk. Neither is a mandate red-line — both are flagged-geography screening items. UAE introduced 9% corporate income tax (2024), reflected in the tax line. Franchise agreements with US brand owners are the key contractual/regulatory dependency.',
    caseFor: [
      'Scale leader with audited, cash-generative economics: 2,749 stores, $2,508.8m revenue, $595.6m EBITDA (23.7%), $219.1m net profit and $209.1m adjusted FCF in FY2025 — a real, dividend-paying ($201.6m proposed) operator, not a growth story underwritten on projections.',
      'Cheap on an operator basis: at ~$4.14bn cap (EV ≈ $4.5bn incl. net lease/other liabilities, partly offset by ~$255m net cash), the stock is ~7.6x FY2025 EBITDA — well below Yum (~19.5x), Jubilant (~23x) and its own ~13x IPO mark, roughly Jollibee-like (~8.5x). If FY2025’s +9.7% LFL recovery holds, the de-rating overshot.',
      'Durable franchise moat + balance-sheet strength: exclusive long-dated rights to KFC/Pizza Hut/Hardee’s/Krispy Kreme across its territories, an owned supply chain, and near-zero conventional debt (~$255m net cash) — it can self-fund store build-out and sustain ~90% payout through a cycle.',
    ],
    caseAgainst: [
      'Two-year stack is roughly flat: FY2025’s +14.2% revenue and +9.7% LFL follow FY2024’s −9% / −12.5%. Net-net the business is recovering to ~2023 levels, not compounding — the 2025 print risks being read as growth when it is a rebound off a depressed Egypt/Levant base.',
      'EGP translation and geopolitical fragility are structural, not one-off: Egypt is a major market reporting in a serially-depreciating currency, and the Levant boycott showed how fast brand-association politics can hit US-franchise sales. Reported USD growth will keep leaking to FX, and a renewed boycott or EGP step-down repeats FY2024.',
      'Minority in a controlled listed entity: Adeptio (PIF + Alabbar) holds ~66%, so a block buyer is a price-taker on strategy, capital return and any take-private. Information rights are limited to public disclosure; there is no board seat, no liquidation preference, no anti-dilution — the protections a private growth round would carry are absent.',
    ],
    leadership: [
      { name: 'Adeptio (PIF + Mohamed Alabbar)', role: 'Majority owner (~66%)', note: 'Saudi PIF + Emaar founder Mohamed Alabbar JV; controls strategy and capital allocation post-IPO.' },
      { name: 'Americana executive management', role: 'Operating team', note: 'Experienced multi-brand QSR operators running a 12-country, 2,749-store estate with an owned supply chain.' },
    ],
    leadershipGaps:
      'For a minority block the issue is not management quality but influence: no board representation is available at our ticket, and capital-return/strategy decisions rest with Adeptio. Diligence should confirm related-party supply-chain arrangements and the Adeptio long-term intent (further sell-downs vs potential take-private).',
    legalStanding:
      'Conventional, well-governed listed entity under ADX/Tadawul disclosure regimes; no adverse legal flags identified. The key contractual dependency is the suite of master-franchise agreements with US brand owners (Yum, CKE/Hardee’s, Krispy Kreme) — renewal terms and territory exclusivity are the documents to verify.',
    valuationVerdict:
      'A high-quality, cash-generative regional QSR leader trading at a de-rated ~7.6x EBITDA — cheap versus franchisor and EM-QSR peers, fair versus operator comps (Jollibee ~8.5x, Alsea ~5x). The DCF on a 6–8% growth / ~25% margin path supports a value modestly above the current cap given the net-cash balance sheet and ~90% payout, but the entry case rests entirely on whether FY2025’s recovery is the run-rate or a rebound. Priced for the latter; rewards the former.',
    limitations: [
      'Per-brand and per-country revenue/EBITDA splits are not separately disclosed; revenue-line shares are estimated from store mix.',
      'Balance-sheet sub-lines not published in releases are reconciled with plugs; the precise current-vs-non-current lease and related-party splits need the full consolidated FS.',
      'As a listed minority, no private-deal protections (board seat, preferences, anti-dilution) are available — return depends on the public price and dividend, not negotiated terms.',
    ],
    icThesis:
      'The investable thesis is acquiring a liquid, listed minority block in the dominant MENA QSR operator at a de-rated ~7.6x EBITDA, underwriting (1) the FY2025 LFL recovery sustaining mid-single-digit organic + store-build growth, (2) ~25% EBITDA margins held via the owned supply chain, and (3) a ~90% dividend yielding cash return through the hold. The kill-criterion is whether Egypt FX / geopolitics drag reported USD growth back toward the FY2024 trough.',
    useOfFunds:
      'Pure secondary: our $150m buys an existing listed block (in-market or negotiated from a holder); no primary capital reaches the company. Americana self-funds store build-out from operating cash flow and returns ~90% of profit as dividends — the "use of funds" is liquidity to the seller, and our return is price appreciation + dividend yield, not deployment of fresh growth capital.',
    proposedTerms: [
      { label: 'Instrument', value: 'Listed equity — secondary block (ADX:AMR / Tadawul:6015)' },
      { label: 'Ownership', value: '~3.6% at the ~$4.14bn cap ($150m ÷ $4,140m, illustrative)' },
      { label: 'Protections', value: 'None beyond public-shareholder rights; no board seat at this ticket' },
      { label: 'Governance', value: 'Adeptio (~66%) controls; we are a price-taking minority' },
      { label: 'Liquidity', value: 'Daily market liquidity across two exchanges; exit by market sale or block trade' },
    ],
    riskRegister: [
      { risk: 'EGP / Egypt FX translation', severity: 'high', likelihood: 'high', impact: 'Egyptian-pound devaluation cuts USD-reported revenue and margin (drove much of the FY2024 −9% revenue)', mitigation: 'Diversified 12-country base; local pricing; GCC weighting', monitoring: 'EGP rate, Egypt % of revenue, constant-FX vs reported LFL' },
      { risk: 'Geopolitical / boycott of US brands', severity: 'high', likelihood: 'medium', impact: 'Regional boycotts hit Levant sales fast (seen in 2024); US-franchise association is structural', mitigation: 'Local sourcing/branding messaging; geographic spread', monitoring: 'Levant LFL, regional sentiment, brand-association news' },
      { risk: 'Recovery is a rebound, not growth', severity: 'medium', likelihood: 'medium', impact: 'FY2025 +14% follows FY2024 −9%; two-year stack ~flat — multiple re-rate may not come', mitigation: 'Underwrite to mid-single-digit organic + store build, not the 2025 headline', monitoring: 'Multi-year LFL stack, new-store productivity, traffic vs price split' },
      { risk: 'Minority in a controlled, listed entity', severity: 'medium', likelihood: 'high', impact: 'Adeptio ~66% control; no board seat, no negotiated protections; price-taker on capital return', mitigation: 'Size to liquidity; rely on public disclosure; monitor Adeptio intent', monitoring: 'Free-float changes, Adeptio sell-downs/take-private signals, dividend policy' },
      { risk: 'Franchise-renewal / territory risk', severity: 'low', likelihood: 'low', impact: 'A franchisor re-territorialising or altering economics at renewal would erode the moat', mitigation: 'Verify renewal terms and exclusivity in diligence', monitoring: 'Franchise-agreement tenor, royalty terms, franchisor commentary' },
    ],
    recommendationSummary:
      'Review — a high-quality, audited, cash-generative MENA QSR leader at a de-rated ~7.6x EBITDA, cheap versus franchisor/EM-QSR peers and net-cash on the balance sheet. The deal hinges on two honest caveats: it is a price-taking minority in an Adeptio-controlled listed entity (no negotiated protections), and FY2025’s recovery must prove durable against Egypt FX and Levant geopolitics rather than being a rebound off a depressed base. Underwrite to mid-single-digit growth + ~90% dividend; on a sustained-recovery read this moves to proceed.',
    thesisDrivers: [
      'Multiple re-rating: a $595.6m-EBITDA operator at ~7.6x toward an ~8.5–10x operator multiple (Jollibee-like) as the FY2025 recovery seasons — the single biggest return lever, since the de-rate (from ~13x at IPO) overshot the FY2024 shock.',
      'Mid-single-digit organic compounding + store build: +159 net stores/year and mid-single-digit LFL on a recovered base grow EBITDA ~8–9% p.a. without heroic assumptions.',
      'Cash return through the hold: ~90% payout (~$200m+/yr) on a net-cash balance sheet delivers a high-single-digit dividend yield that underpins the IRR even if the multiple is static.',
      'Margin expansion via the owned supply chain: gross margin lifting toward ~42% as Egypt food-cost inflation normalises and the treat/beverage mix grows, carrying EBITDA margin to ~25%.',
    ],
    thesisBreakers: [
      'A renewed Egyptian-pound step-devaluation (another ~30%+ move) translates Egypt revenue down again, dragging reported USD growth negative the way FY2024 did — the recovery thesis fails on FX alone.',
      'A fresh, durable boycott of US-associated brands across the Levant/GCC (not a transient 2024-style episode) structurally impairs traffic — the multiple stays depressed regardless of operations.',
      'Adeptio takes the company private at a modest premium, capping minority upside at the bid — the listed-minority structure has no protection against this.',
      'The FY2025 LFL +9.7% proves to be a one-year rebound and the two-year stack stays flat into FY2026–27, confirming the de-rating as correct rather than excessive.',
    ],
    moat: {
      pillars: [
        'Exclusive, long-dated master-franchise rights to KFC, Pizza Hut, Hardee’s and Krispy Kreme across its 12 territories — the core, irreplicable asset: a competitor cannot operate these brands in Americana’s markets without the franchisor displacing Americana, which the agreements prevent.',
        'Owned regional supply chain (food processing + distribution) — vertical integration that protects food cost and quality control at a scale no regional rival matches.',
        'Unmatched store density and brand portfolio across MENA + Kazakhstan (2,749 stores) — scale economies in procurement, real estate and delivery logistics.',
      ],
      competitors: [
        { name: 'Alshaya Group (private)', note: 'The other dominant MENA franchise operator (Starbucks, etc.) — overlaps on real estate and labour, not on Americana’s specific QSR brands.' },
        { name: 'Local & independent QSR chains', note: 'Fragmented regional and local competition; none with Americana’s brand stable or supply-chain scale.' },
        { name: 'Aggregator-native virtual brands', note: 'Delivery-only concepts compete for the same delivery occasions, pressuring incremental traffic.' },
      ],
      trajectory:
        'Consolidation-favouring: scale, supply-chain ownership and exclusive brand rights entrench the incumbent. The 3–5yr arc is continued store build-out and delivery-mix growth across a recovering GCC/Egypt consumer, with the competitive risk concentrated at franchise renewal rather than day-to-day share loss.',
      erosionScenarios: [
        'A franchisor (e.g. Yum) re-territorialises or shifts to a direct/different-operator model at renewal, removing the exclusive rights that anchor the moat.',
        'A sustained EGP/geopolitical shock permanently shrinks the Egypt/Levant profit pool, reducing the scale advantage.',
        'Delivery aggregators commoditise the customer relationship and capture margin, eroding the value of owned-store density.',
      ],
    },
    qualityOfEarnings:
      'Earnings quality is strong: figures are audited, IFRS, publicly filed and consistent across the FY2024 FS and FY2025 release, with a dividend-backed cash conversion (adj. FCF $209.1m, 57.7%) that corroborates the P&L. The principal caveat is FX translation — Egypt is a material market reporting in a serially-depreciating currency, so reported USD growth blends real volume/price with EGP translation; diligence should obtain the constant-currency LFL bridge and the Egypt-vs-GCC revenue/EBITDA split. Secondary items to require: the related-party supply-chain transfer pricing (Adeptio/affiliates), the current-vs-non-current lease split, and per-brand contribution, none of which are in the press releases. Nothing here is laundered — the model’s actuals are stated; only the BS sub-line plugs are inferred and labelled.',
    recentDevelopments:
      'FY2025 (reported Feb-2026) was a clean recovery year: revenue +14.2% to $2,508.8m, EBITDA +23.1% to $595.6m, net profit +38% to $219.1m, LFL +9.7%, 2,749 stores (+159 net), and a raised dividend ($201.6m, ~92% payout) — driven by EGP stabilisation, fading boycott impact and pricing/cost discipline. This reversed a difficult FY2024 (revenue −9%, LFL −12.5%) caused by the March-2024 Egyptian-pound devaluation, the Levant boycott of US brands and softer GCC spending. Sector-wide, MENA QSR demand is recovering with the consumer cycle while delivery penetration keeps rising; the stock has nonetheless de-rated from its ~13x IPO multiple to ~7.6x as the market repriced Egypt FX and geopolitical risk.',
    useOfFundsBreakdown: [
      { category: 'Secondary purchase of listed block', pct: 100, rationale: 'This is a pure secondary: 100% of the ticket acquires existing shares (in-market or negotiated from a holder). No primary capital reaches Americana — the company self-funds store build-out from operating cash flow and returns ~90% of profit as dividends. The "allocation" is simply the entry into the position; our return is price + yield, not deployment of growth capital.' },
    ],
    termSheet: {
      instrument: 'Listed common equity — secondary block on ADX (AMR) and/or Tadawul (6015)',
      ownership: '~3.6% at the ~$4.14bn market cap ($150m ÷ $4,140m, fully-diluted, illustrative)',
      boardGovernance: 'No board seat or observer rights available at this ticket; Adeptio (~66%) controls the board. Influence is limited to public-shareholder engagement.',
      preferentialRights: [
        'None beyond ordinary listed-shareholder rights (vote, dividend, pre-emption per local company law).',
        'No liquidation preference, anti-dilution, drag/tag, or information rights beyond public disclosure — these do not exist for a market minority.',
      ],
      conditionsPrecedent: [
        'Confirm available block size and on-market liquidity / float depth at target price.',
        'Diligence the master-franchise renewal terms and territory exclusivity (Yum, CKE/Hardee’s, Krispy Kreme).',
        'Obtain the Egypt-vs-GCC revenue/EBITDA split and constant-currency LFL bridge.',
        'Review Adeptio related-party supply-chain arrangements and any signalled further sell-down / take-private intent.',
      ],
    },
    scenarioNarratives: {
      bear: 'A renewed EGP devaluation and/or fresh Levant boycott drag reported USD revenue back toward the FY2024 trough; LFL turns negative and the two-year stack confirms stagnation. Margins hold near 22% but the multiple stays at ~6–7x. Exit near or below entry — dividends cushion but the IRR falls short of hurdle.',
      base: 'The FY2025 recovery seasons into mid-single-digit organic + store-build growth (~8% EBITDA CAGR) at ~24–25% margins; ~90% dividend pays out through the hold. A modest re-rate toward an ~8.5x operator multiple plus the cash yield delivers a returns profile around the hurdle — a steady, income-supported compounder.',
      bull: 'Egypt FX stabilises, geopolitics quiet, and Americana re-rates toward EM-QSR operator multiples (~10x, Jollibee-plus) on a recovered, compounding base while the ~90% dividend runs. Multiple expansion + organic growth + yield stack to a clearly hurdle-clearing return — the de-rating reverses and the entry at ~7.6x proves the value.',
    },
  },
  createdAt: '2026-06-06',
}
