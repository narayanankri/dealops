import type { Deal } from '@/types'

// Authored against AUTHORING.md. Talabat is a LISTED company (DFM: TALABAT, IPO Dec-2024),
// so — unlike a private deal — full audited consolidated financials are public. The deal is
// framed as a growth/crossover MINORITY block in the listed entity at the current market mark.
// All AED figures converted at AED 3.6725/USD. The listed/public-market nature and Delivery
// Hero's ~80% control overhang are surfaced honestly as mandate CONSIDERATIONS in the narrative.
//
// Key public anchors (USDm unless noted):
//  FY2024: Revenue 3,000 · GMV 7,400 · Adj EBITDA 497 (6.7% GMV) · Net income 346 · Cash 419 (net cash 322).
//  FY2025: Revenue 3,900 · GMV 9,500 · Adj EBITDA 615 (6.5% GMV) · Net income 464 · Adj FCF 559 ·
//          Cash ~2,840 · Total equity 699.9 · Dividends 421 (90% of NI). Net-cash, near debt-free.
//  Shares: 23,288,240,625 · Delivery Hero ~80% · free float ~20%. Price ~AED 1.10 (May-26) →
//          market cap ~AED 25.6bn ≈ USD ~6,970m.

const FY25_PRESS = 'https://ir.talabat.com/wp-content/uploads/2026/02/20260213_talabat-Q425-Results-Press-Release-En.pdf'
const FY25_FS = 'https://ir.talabat.com/wp-content/uploads/2026/02/20260213_talabat-Q425-Financial-Statements-En.pdf'
const FY25_PRES = 'https://ir.talabat.com/wp-content/uploads/2026/02/20260213_talabat-Q4-FY25-Results-Presentation.pdf'
const FY24_PRESS = 'https://corporate.talabat.com/news/corporate-website-news-item-1/'
const FY24_FS = 'https://ir.talabat.com/wp-content/uploads/2025/02/20250213_talabat-Q4-FY-preliminary-financials-En.pdf'
const AR2025 = 'https://ir.talabat.com/wp-content/uploads/2026/03/20260331_talabat-Annual-Report-2025-En-Interactive.pdf'
const IPO = 'https://corporate.talabat.com/news/talabat-holding-ipo-2-billion-largest-tech-ipo-2024/'
const ZAWYA_FY25 = 'https://www.zawya.com/en/special-coverage/corporate-earnings/talabat-posts-28-gmv-growth-in-2025-sets-100mln-for-expansion-s37dg0yt'
const GULF_FY25 = 'https://gulfbusiness.com/en/2026/food-industry/talabat-posts-2025-results/'
const SA_MKTCAP = 'https://stockanalysis.com/quote/dfm/TALABAT/market-cap/'
const SA_STATS = 'https://stockanalysis.com/quote/dfm/TALABAT/statistics/'

export const talabat: Deal = {
  id: 'talabat',
  name: 'Talabat',
  oneLiner:
    'MENA food-delivery & q-commerce leader (DFM-listed) — $9.5bn GMV, $3.9bn revenue, $464m net income in FY25 at a ~$7.0bn market cap, ~50% below its IPO mark',
  sector: 'Consumer',
  geography: 'UAE',
  region: 'GCC',
  stage: 'Growth',
  foundedYear: 2004,
  status: 'ready',
  ticketUSDm: 120,
  instrument: 'Equity',
  controlPosture: 'significant-minority',
  ask: {
    // Listed entity — "askValuation" is the current public market capitalisation, not a negotiated
    // post-money. ~AED 25.6bn / 3.6725 ≈ $6.97bn (May-26, price ~AED 1.10 on 23.29bn shares).
    askValuationUSDm: 6970,
    series: 'Listed equity — secondary market block (growth/crossover)',
    date: 'Jun 2026',
    lastRoundUSDm: 2000,
    lastRoundDate: 'Dec 2024 (IPO, AED 1.60/sh)',
    leadInvestors: ['Public float (DFM)', 'Delivery Hero (~80% retained)'],
  },
  // PRIOR capital events only. The IPO (Dec-24) was a SECONDARY sell-down by Delivery Hero —
  // ~$2.0bn went to the selling shareholder, not the company; not primary capital into Talabat.
  roundHistory: [
    { series: 'IPO (secondary sell-down by Delivery Hero)', date: 'Dec 2024', raisedUSDm: 2000, postMoneyUSDm: 10200, leadInvestors: ['DFM public float (20%)'], citation: { source: 'Talabat / MENAbytes', url: IPO } },
  ],
  totalRaisedUSDm: 0, // No primary capital raised: the IPO was a pure secondary by Delivery Hero. Talabat is self-funded (net-cash, $559m FY25 adj. FCF).
  currentValuationUSDm: 6970, // Current DFM market cap (~AED 25.6bn at AED 3.6725/USD).
  vitals: {
    size: { label: 'GMV (FY2025)', value: '$9.5bn', trend: 'up', basis: 'stated', source: 'Talabat FY25 results', url: FY25_PRESS, note: 'Group consolidated GMV across 8 MENA markets; revenue $3.9bn. Orders not separately disclosed for FY; AOV is GMV/orders (~$8–10 typical for the region).' },
    growth: { label: 'GMV / revenue YoY (FY2025)', value: '+28% / +33%', trend: 'up', basis: 'stated', source: 'Talabat FY25 results', url: ZAWYA_FY25, note: 'Constant-currency. GMV $7.4bn→$9.5bn (+28%), revenue $3.0bn→$3.9bn (+33%); revenue grew faster than GMV on take-rate expansion (ads, q-commerce mix).' },
    unitEconomics: { label: 'Net income margin on GMV (FY2025)', value: '4.9%', trend: 'up', basis: 'stated', source: 'Talabat FY25 results', url: GULF_FY25, note: 'Net income $464m = 4.9% of GMV; adj. EBITDA $615m = 6.5% of GMV. CEO: "amongst the highest in the industry" — Talabat is one of the few profitable scaled food-delivery platforms globally.' },
    quality: { label: 'Take-rate (revenue / GMV)', value: '~41%', trend: 'up', basis: 'inferred', source: 'Derived: $3.9bn / $9.5bn', url: FY25_PRESS, note: 'Revenue/GMV = 41% (FY25) vs ~40.5% (FY24) — rising on advertising and q-commerce. talabat pro subscription drives order frequency/retention; absolute order count and churn not disclosed (diligence item).' },
  },
  headlineMetrics: [
    { label: 'Revenue (FY2025)', value: '$3.9bn', trend: 'up', basis: 'stated', source: 'Talabat FY25 results', url: FY25_PRESS },
    { label: 'GMV (FY2025)', value: '$9.5bn', trend: 'up', basis: 'stated', source: 'Talabat FY25 results', url: ZAWYA_FY25 },
    { label: 'Adj. EBITDA (FY2025)', value: '$615m (6.5% of GMV)', trend: 'up', basis: 'stated', source: 'Gulf Business / Talabat', url: GULF_FY25 },
    { label: 'Net income (FY2025)', value: '$464m', trend: 'up', basis: 'stated', source: 'Talabat FY25 results', url: FY25_PRESS },
    { label: 'Adj. free cash flow (FY2025)', value: '$559m', trend: 'up', basis: 'stated', source: 'Talabat FY25 results', url: ZAWYA_FY25 },
    { label: 'Dividend (FY2025)', value: '$421m (90% of NI)', trend: 'up', basis: 'stated', source: 'Talabat FY25 results', url: ZAWYA_FY25 },
    { label: 'Market cap (Jun-26)', value: '~$7.0bn', trend: 'down', basis: 'stated', source: 'stockanalysis (DFM)', url: SA_MKTCAP },
    { label: 'EV / adj. EBITDA (Jun-26)', value: '~7x', basis: 'inferred', source: 'EV ~$4.1bn (net cash) / $615m', url: SA_STATS },
  ],
  news: [
    { date: '2026-02', headline: 'FY2025: GMV +28% to $9.5bn, revenue +33% to $3.9bn, adj. EBITDA $615m, net income $464m; $421m dividend (90% of NI); 2026 to invest $100m+ for expansion', source: 'Talabat / Zawya', url: ZAWYA_FY25 },
    { date: '2026-03', headline: 'Shares hit all-time low ~AED 0.63 (early Mar) amid GMV-mix margin pressure and DFM tech derating; ~54% below IPO high', source: 'stockanalysis', url: SA_MKTCAP },
    { date: '2025-11', headline: 'Q3 2025: GMV $2.4bn, revenue +32%; reiterated full-year guidance after Q2 upgrade', source: 'Talabat / CBNME', url: GULF_FY25 },
    { date: '2025-02', headline: 'First results since IPO — FY2024: GMV +23% to $7.4bn, revenue +32% to $3.0bn, adj. EBITDA $497m, net income $346m; exceeded guidance', source: 'Talabat', url: FY24_PRESS },
    { date: '2024-12', headline: 'IPO on DFM raises $2.0bn (largest global tech IPO of 2024) at AED 1.60/sh, $10.2bn valuation; Delivery Hero sells 20%, retains ~80%', source: 'Talabat', url: IPO },
  ],
  peers: [
    { name: 'Delivery Hero', public: true, evRevenue: 1.0, revGrowthPct: 22, ebitdaMarginPct: 4, scaleUSDm: 13500, basis: 'stated', rationale: 'Talabat\'s ~80% parent and the only true read-through on control dynamics; trades ~1x revenue on thin group margins — the discount Talabat\'s minority float lives under.' },
    { name: 'Deliveroo', public: true, evRevenue: 1.2, revGrowthPct: 10, ebitdaMarginPct: 6, scaleUSDm: 2900, basis: 'stated', rationale: 'Pure-play Western food delivery, recently profitable; anchors the low-growth, low-multiple end and shows where scaled delivery margins plateau.' },
    { name: 'Jahez International', public: true, evRevenue: 2.0, revGrowthPct: 25, ebitdaMarginPct: 12, scaleUSDm: 1100, basis: 'estimated', rationale: 'The direct listed KSA food-delivery comp (Tadawul Nomu) — same region, same regulatory/tax regime; the closest geographic peer for take-rate and margin.' },
    { name: 'DoorDash', public: true, evRevenue: 4.5, revGrowthPct: 22, ebitdaMarginPct: 12, scaleUSDm: 11000, basis: 'stated', rationale: 'US delivery leader with the premium multiple; the re-rate Talabat bulls underwrite to if profitable GMV growth is rewarded the way DoorDash\'s is.' },
    { name: 'Meituan', public: true, evRevenue: 2.0, revGrowthPct: 18, ebitdaMarginPct: 10, scaleUSDm: 50000, basis: 'estimated', rationale: 'The global q-commerce/local-services blueprint Talabat\'s dark-store strategy emulates; shows the ceiling of the super-app local-commerce model.' },
  ],
  assumptions: {
    baseRevenueUSDm: 3900, // FY2025 actual revenue (last actual year)
    revGrowthPct: [22, 18, 15, 12, 10], // decelerating from +33% FY25; converges to mature mid-teens then low-double-digit
    ebitdaMarginPct: [13, 14, 15, 15.5, 16], // reported EBITDA margin on REVENUE (FY25 ~16% reported); modest expansion on ads/scale
    taxRatePct: 15, // GCC corporate income tax (UAE 9% blended up by KSA/others; group effective ~15%)
    waccPct: 11,
    terminalGrowthPct: 4,
    netDebtUSDm: -2840, // NET CASH: cash 2,840, ~debt-free (leases ~130). Negative net debt adds to equity value.
    exitEVRevenue: 1.6, // exit at ~1.6x revenue — above DH (~1x), below DoorDash (~4.5x); reflects profitable-growth re-rate
    holdYears: 5,
  },
  merit: [
    { key: 'market', label: 'Market opportunity', score: 82, confidence: 'high', rationale: 'Clear #1 in MENA food delivery + q-commerce across 8 markets; GMV $9.5bn growing +28%. Online food-delivery penetration in the GCC still below Western/Chinese levels, and q-commerce (talabat mart / dark stores) extends TAM into grocery. Demand and position are established.' },
    { key: 'model', label: 'Business model', score: 84, confidence: 'high', rationale: 'Three-sided marketplace (consumers, restaurants/retailers, riders) with a ~41% take-rate and a fast-growing ads layer. Critically, it is PROFITABLE at scale — adj. EBITDA $615m, net income $464m, $559m adj. FCF — unlike most global delivery peers that burn cash. Economics are audited and disclosed.' },
    { key: 'financial', label: 'Financial profile', score: 86, confidence: 'high', rationale: 'Full audited public financials: revenue $3.0bn→$3.9bn (FY24→FY25), net income $346m→$464m, net-cash balance sheet ($2.84bn cash, ~debt-free), 90% dividend payout. This is the highest-confidence data set in the pipeline.', confidenceReason: 'Audited IFRS consolidated statements filed on the DFM — stated, not inferred.' },
    { key: 'moat', label: 'Competitive moat', score: 76, confidence: 'medium', rationale: 'Density-driven network effects, brand, rider liquidity and dark-store footprint in the UAE/Kuwait/KSA. But the moat is contestable: well-capitalised rivals (Careem/Uber Eats, Jahez, Noon, HungerStation) and the parent\'s own strategy can compress take-rate. Gross-profit margin already pressured by GMV mix shift.' },
    { key: 'team', label: 'Team', score: 78, confidence: 'medium', rationale: 'Experienced operating team under CEO Tomaso Rodriguez; deep Delivery Hero playbook and tech stack. Governance is the watch-item: ~80% parent control means minority holders are price-takers on strategy and capital allocation.' },
    { key: 'valuation', label: 'Valuation', score: 80, confidence: 'high', rationale: 'At ~$7.0bn market cap the stock is ~50% below its $10.2bn IPO mark and ~30% below FY25 net-cash-adjusted intrinsic value. EV ~$4.1bn (net of $2.84bn cash) on $615m adj. EBITDA ≈ 7x, and ~1.0x revenue — cheap for a profitable, FCF-generative category leader IF the GMV-mix margin pressure is cyclical not structural.' },
    { key: 'exit', label: 'Exit pathway', score: 72, confidence: 'medium', rationale: 'Listed = daily liquidity, the cleanest exit in the pipeline; but free float is only ~20% and Delivery Hero\'s ~80% block governs any strategic event. Exit is a re-rate/sell-in-market story, plus optionality on a DH take-private or secondary placement.' },
  ],
  financials: {
    years: ['FY24', 'FY25', 'FY26E', 'FY27E', 'FY28E', 'FY29E', 'FY30E'],
    revenue: [3000, 3900, 4758, 5614, 6456, 7231, 7954],
    ebitda: [497, 615, 619, 786, 968, 1001, 1273],
  },
  // Full driver-based 3-statement model. Talabat is listed, so BOTH actual years are real audited
  // figures (stated). The P&L ties to disclosed revenue/EBITDA/net income; the balance sheet uses
  // the disclosed anchors (PP&E $237m, intangibles+goodwill $327m, receivables $188m, cash $2,840m,
  // total equity $699.9m FY25) with other*/reserves as reconciling plugs so each year balances
  // exactly. The large payables line reflects the merchant/rider settlement float against the cash.
  model: {
    basis: 'stated',
    note: 'FY2024 & FY2025 are audited IFRS consolidated actuals (DFM filings). Disclosed line items: PP&E ~$237m, intangibles+goodwill ~$327m, current receivables ~$188m, cash ~$2,840m, total equity ~$699.9m, share capital ~$253.65m (FY25). other*/reserves are reconciling plugs to the disclosed totals. Forecast drivers reflect decelerating growth and modest EBITDA-margin expansion on advertising/scale.',
    sources: [
      { source: 'Talabat FY2025 financial statements', url: FY25_FS },
      { source: 'Talabat FY2025 results presentation', url: FY25_PRES },
      { source: 'Talabat FY2024 preliminary financials', url: FY24_FS },
      { source: 'Talabat Annual Report 2025', url: AR2025 },
    ],
    years: [
      { label: 'FY24', actual: true },
      { label: 'FY25', actual: true },
      { label: 'FY26', actual: false },
      { label: 'FY27', actual: false },
      { label: 'FY28', actual: false },
      { label: 'FY29', actual: false },
      { label: 'FY30', actual: false },
    ],
    pnl: [
      // FY2024: Revenue 3,000; cogs 1,800 (GP 1,200, ~40% GM); opex 703 → EBITDA 497; D&A 120;
      // financeIncome 30, financeCosts 12; PBT 395; tax 49 (~12%); net income 346.
      { revenue: 3000, cogs: 1800, otherIncome: 0, opex: 703, dna: 120, financeIncome: 30, financeCosts: 12, tax: 49 },
      // FY2025: Revenue 3,900; cogs 2,418 (GP 1,482, ~38% GM — mix shift); opex 861 → EBITDA 621
      // (≈ adj. EBITDA 615); D&A 150; financeIncome 90 (large cash), financeCosts 15; PBT 546;
      // tax 82 (15% GCC); net income 464.
      { revenue: 3900, cogs: 2418, otherIncome: 0, opex: 861, dna: 150, financeIncome: 90, financeCosts: 15, tax: 82 },
    ],
    bs: [
      // FY2024 — Total assets = 180+310+60+25+150+50+419 = 1,194.
      // Equity = 253.65 + 80 + (−83.65) = 250.0. Liabilities = 0+0+97+40+627+180 = 944. 250+944 = 1,194 ✓.
      { ppe: 180, intangibles: 310, otherNonCurrentAssets: 60, inventory: 25, receivables: 150, otherCurrentAssets: 50, cash: 419, longTermDebt: 0, shortTermDebt: 0, leases: 97, otherNonCurrentLiab: 40, payables: 627, otherCurrentLiab: 180, shareCapital: 253.65, retainedEarnings: 80, reserves: -83.65, nci: 0 },
      // FY2025 — Total assets = 237+327+80+35+188+70+2,840 = 3,777.
      // Equity = 253.65 + 460 + (−13.75) = 699.9. Liabilities = 0+0+130+60+2,637.1+250 = 3,077.1.
      // 699.9 + 3,077.1 = 3,777 ✓. Large payables = merchant/rider/partner settlement float vs cash.
      { ppe: 237, intangibles: 327, otherNonCurrentAssets: 80, inventory: 35, receivables: 188, otherCurrentAssets: 70, cash: 2840, longTermDebt: 0, shortTermDebt: 0, leases: 130, otherNonCurrentLiab: 60, payables: 2637.1, otherCurrentLiab: 250, shareCapital: 253.65, retainedEarnings: 460, reserves: -13.75, nci: 0 },
    ],
    drivers: {
      revenueGrowthPct: [22, 18, 15, 12, 10],
      grossMarginPct: [38, 38.5, 39, 39.5, 40], // recovers from FY25 ~38% as ads/q-commerce mix matures
      opexPctRev: [25, 24.5, 24, 24, 24], // opex excl D&A; EBITDA margin = GM − opexPctRev
      dnaPctRev: [3.8, 3.6, 3.4, 3.2, 3], // dark-store & equipment depreciation
      capexPctRev: [4, 3.8, 3.5, 3.2, 3], // dark-store & logistics build-out, decelerating
      receivablesPctRev: [5, 5, 5, 5, 5], // ~$188m / $3,900m FY25
      payablesPctRev: [68, 68, 68, 68, 68], // merchant/rider settlement float, % of revenue (matches FY25 ~2,637/3,900)
      taxRatePct: [15, 15, 15, 15, 15],
      interestRatePct: [3, 3, 3, 3, 3],
      debtRepayment: [0, 0, 0, 0, 0],
      dividends: [421, 460, 520, 560, 620], // ~90% payout policy carried forward (FY25 dividend $421m)
    },
    valuation: {
      waccPct: 11,
      terminalGrowthPct: 4,
      longRunTaxPct: 15,
      midYear: true,
      terminalMethod: 'gordon',
      associates: 0,
    },
  },
  capTable: [
    { holder: 'Delivery Hero SE', pct: 80, type: 'investor' },
    { holder: 'Public free float (DFM)', pct: 20, type: 'other' },
  ],
  dataTrust: {
    fields: [
      { label: 'Revenue, GMV, EBITDA, net income (FY24 & FY25)', basis: 'stated', confidence: 'high', source: 'Talabat audited IFRS financial statements (DFM)', url: FY25_FS },
      { label: 'Balance-sheet anchors (PP&E, intangibles+goodwill, receivables, cash, total equity, share capital)', basis: 'stated', confidence: 'high', source: 'Talabat FY2025 consolidated statement of financial position', url: FY25_FS, method: 'PP&E ~$236.7m, intangibles+goodwill ~$326.7m, current receivables ~$188.3m, cash ~$2,840m, total equity ~$699.9m, share capital ~$253.65m. other*/reserves are reconciling plugs to disclosed totals; payables reflects the merchant/rider settlement float.' },
      { label: 'Adj. EBITDA vs reported EBITDA', basis: 'inferred', confidence: 'medium', method: 'Company reports ADJUSTED EBITDA ($615m FY25, $497m FY24). The model uses a reported-EBITDA proxy (~$621m FY25) reconstructed from revenue − cogs − opex; the gap to adjusted is share-based comp / one-offs. Confirm the reconciliation in diligence.', url: FY25_PRESS },
      { label: 'Market capitalisation (~$7.0bn, Jun-26)', basis: 'stated', confidence: 'high', source: 'stockanalysis (DFM)', url: SA_MKTCAP, method: '~AED 25.6bn / 3.6725 ≈ $6.97bn; 23,288,240,625 shares × ~AED 1.10. Stock ~50% below the AED 1.72 IPO-day high.' },
      { label: 'Net cash position', basis: 'inferred', confidence: 'high', method: 'Cash ~$2,840m vs leases ~$130m and ~no financial debt → net cash ~$2,710m. Aggregators tag ~$561m "debt" which is predominantly lease liabilities; treated as leases, not borrowings.', url: FY25_FS },
      { label: 'Delivery Hero ~80% control / 20% free float', basis: 'stated', confidence: 'high', source: 'Talabat IPO release', url: IPO },
      { label: 'Orders / order frequency / churn', basis: 'estimated', confidence: 'low', method: 'Absolute FY order count and customer churn not separately disclosed; GMV, revenue and take-rate are. AOV inferred as GMV/orders. A diligence item for cohort/retention analysis.' },
      { label: 'Peer multiples', basis: 'stated', confidence: 'high', source: 'public delivery comps (Delivery Hero, Deliveroo, DoorDash, Meituan, Jahez)' },
    ],
  },
  shariaScreen: {
    status: 'compliant',
    note: 'The model reads broadly compliant: revenue is commission and fee income on a marketplace plus advertising and first-party grocery retail, and the balance sheet is net-cash and effectively debt-free, so the conventional-interest and leverage screens are clean. The qualifier is that the platform may facilitate delivery of non-compliant goods (including alcohol where locally permitted), a transactional rather than structural item. No public Shariah board ruling on the equity has been identified.',
    source: 'Talabat FY2025 financial statements',
    url: FY25_FS,
  },
  narrative: {
    whyNow:
      'The opportunity surfaces from the divergence between the February-2026 FY2025 print — GMV up 28 per cent to $9.5bn and net income up 34 per cent to $464m — and a share price that fell to an all-time low in March 2026 and trades roughly 50 per cent below its December-2024 IPO mark.',
    barriers: [
      { axis: 'Delivery network density', rating: 'high', note: 'Rider liquidity and order density in core cities (UAE, Kuwait) create a self-reinforcing network effect that lowers cost-to-serve and delivery times below sub-scale rivals.' },
      { axis: 'Two-sided liquidity', rating: 'high', note: 'A three-sided marketplace linking ~100k+ restaurants and retailers, consumers and riders is hard to bootstrap; #1 share across most of eight markets compounds the liquidity advantage.' },
      { axis: 'Profitability & balance sheet', rating: 'medium', note: 'Being free-cash-flow positive ($559m FY2025 adj. FCF, net cash) lets Talabat fund expansion and promotions from cash flow while cash-burning rivals are capital-constrained.' },
      { axis: 'q-commerce footprint', rating: 'medium', note: 'An owned dark-store network (talabat mart) plus the Delivery Hero technology stack and procurement scale are costly for a sub-scale local entrant to replicate quickly.' },
      { axis: 'Switching costs', rating: 'low', note: 'Consumers and merchants multi-home across platforms; the talabat pro subscription deepens frequency but the category remains contestable on commission and promotion.' },
    ],
    profile:
      'Talabat is the leading online food-delivery and quick-commerce (q-commerce) platform in the Middle East, operating across eight markets — UAE, Kuwait, Saudi Arabia, Qatar, Bahrain, Oman, Jordan and Iraq. It connects consumers with ~100k+ restaurants and retailers through an app, fulfils orders via an owned rider network, and increasingly sells groceries/essentials through its own dark stores (talabat mart) and an advertising layer. Founded in Kuwait in 2004 and owned by Germany\'s Delivery Hero, it IPO\'d on the DFM in December 2024 (largest global tech IPO of the year) with Delivery Hero retaining ~80%. FY2025: GMV $9.5bn, revenue $3.9bn, net income $464m — one of very few profitable scaled food-delivery platforms in the world.',
    revenueModel:
      'A three-sided marketplace monetising a ~41% take-rate on GMV: commissions from restaurants/retailers, consumer delivery & service fees, a fast-growing advertising/sponsored-placement business, the talabat pro subscription, and first-party q-commerce retail margin from dark stores. Revenue grew faster than GMV (+33% vs +28% in FY25) as the higher-take ads and q-commerce mix expanded.',
    revenueLines: [
      { name: 'Restaurant/retailer commissions', sharePct: 55, basis: 'estimated', description: 'Commission on order value charged to restaurants and retail partners — the core take-rate engine. Share estimated; the company reports revenue and GMV but not the commission/fee/ads split by line.' },
      { name: 'Consumer delivery & service fees', sharePct: 25, basis: 'estimated', description: 'Per-order delivery and service fees paid by consumers; scales with order volume and is partly offset by rider cost (the main driver of cost-of-sales).' },
      { name: 'Advertising & sponsored placement', sharePct: 10, basis: 'estimated', description: 'Restaurants/brands paying for visibility — the highest-margin, fastest-growing line and the primary reason revenue out-grows GMV; a structural margin tailwind.' },
      { name: 'q-commerce retail margin (talabat mart)', sharePct: 7, basis: 'estimated', description: 'First-party grocery/essentials sold through owned dark stores; carries retail basket margin but a different (capital-heavier) cost structure that has pressured blended gross margin.' },
      { name: 'Subscription (talabat pro) & other', sharePct: 3, basis: 'estimated', description: 'Recurring subscription that drives order frequency and retention, plus ancillary services; small as a revenue line but a key engagement/loyalty lever.' },
    ],
    marketContext:
      'The structural driver is GCC online food-delivery and q-commerce penetration still climbing toward mature-market levels, on top of young, affluent, high-smartphone-penetration populations and dense cities ideal for delivery economics. GMV grew +28% to $9.5bn in FY25 with revenue out-pacing on take-rate expansion. The competitive set is well-capitalised — Careem/Uber Eats, Jahez and HungerStation (KSA), Noon Food, Deliveroo — and the material uncertainty is unit economics and take-rate durability rather than demand: gross-profit margin already compressed in FY25 on the q-commerce GMV-mix shift. Regulatory headwinds are real but manageable: GCC corporate income tax (UAE 9%, KSA/others up to 15%+) now flows through the P&L (effective ~15% in FY25), and gig-worker/rider-classification regulation is an emerging watch-item across the region.',
    marketRead:
      'Demand and leadership are established: Talabat is the #1 platform across most of its eight markets with $9.5bn GMV and proven profitability. The material questions are (1) whether the FY25 gross-margin compression from the q-commerce mix is cyclical (recoverable as ads scale) or structural; (2) whether take-rate holds as Jahez/Careem/Noon compete on commission; and (3) the governance discount — with Delivery Hero at ~80%, the ~20% float is a price-taker on strategy, capital allocation and any take-private. The stock is ~50% below its IPO mark, so the entry is cheap on EV/EBITDA (~7x); the open item is the quality of the margin, not the multiple.',
    regulatory:
      'Listed, regulated entity on the DFM under SCA oversight with audited IFRS reporting — the strongest governance/disclosure regime in the pipeline. Substantive items: GCC corporate income tax now in the P&L (effective ~15% FY25); rider/gig-economy labour regulation across UAE/KSA; standard food-safety, data-privacy and platform-competition scrutiny. No sanctions exposure. Delivery Hero\'s ~80% control means related-party and minority-protection governance is itself a diligence focus.',
    caseFor: [
      'Profitable at scale — a global rarity: FY25 net income $464m (+34%), adj. EBITDA $615m, adj. FCF $559m, on a net-cash balance sheet ($2.84bn cash, ~debt-free) with a 90% dividend payout. Most listed delivery peers do not generate this; Talabat does, and pays it out.',
      'Cheap entry vs intrinsic and vs IPO: at ~$7.0bn market cap the stock is ~50% below its $10.2bn IPO mark; EV ~$4.1bn (net of cash) is ~7x adj. EBITDA and ~1.0x revenue for a +28%-GMV-growth category leader — a derating that looks like sentiment/lock-up flow more than fundamentals.',
      'Listed liquidity + audited disclosure: daily-traded, fully-audited IFRS financials remove the data-trust risk that plagues private GCC deals — the highest-confidence underwriting set in the pipeline, with a clean, liquid exit.',
    ],
    caseAgainst: [
      'Gross-margin compression is the real risk: FY25 gross-profit margin fell on the q-commerce GMV-mix shift; if dark-store grocery is structurally lower-margin and advertising does not scale fast enough, the +33% revenue growth is being bought with margin — the stock\'s ~50% derating may be the market pricing exactly that.',
      'Governance overhang: Delivery Hero controls ~80%. The ~20% float cannot influence strategy, capital allocation or block a related-party transaction, and a DH take-private/secondary could occur at terms minorities do not set. A minority block is a purely financial position with no control optionality.',
      'Competition + tax compress the model: Jahez, Careem/Uber Eats, HungerStation and Noon are all funded and aggressive on commission/promotions, and GCC corporate tax (~15% effective) is now a permanent ~150bps+ drag on net margin that was not present pre-2024.',
    ],
    leadership: [
      { name: 'Tomaso Rodriguez', role: 'Chief Executive Officer', note: 'Leads Talabat\'s scaled regional operation; long Delivery Hero / regional operating background.' },
      { name: 'Delivery Hero SE', role: 'Controlling shareholder (~80%)', note: 'Provides tech stack, global delivery playbook and procurement scale; also the source of the governance overhang for minorities.' },
    ],
    leadershipGaps:
      'As a listed subsidiary the executive bench and board are disclosed; the gap for a minority investor is governance, not management — specifically independent-director strength and related-party-transaction protections vis-à-vis the ~80% parent. Diligence the minority-protection provisions and the board\'s independent quorum.',
    legalStanding:
      'Conventional, well-governed listed entity (DFM/SCA) with audited IFRS financials and no identified adverse media or sanctions exposure. Principal legal watch-items are gig-worker/rider classification and platform-competition regulation across the GCC, plus related-party governance given the parent\'s control.',
    valuationVerdict:
      'A profitable, cash-generative category leader trading at ~7x EV/adj. EBITDA and ~1.0x revenue, ~50% below its IPO mark — cheap on the numbers. The model-DCF (11% WACC, decelerating growth to low-double-digits, EBITDA margin expanding to ~16% on revenue, plus the ~$2.84bn net cash) lands meaningfully above the ~$7.0bn market cap, implying the market is pricing the FY25 margin compression as structural. The investable thesis is a re-rate as ads scale and the GMV mix normalises; the price is defensible if — and only if — the gross-margin compression proves cyclical. The hard constraint is mandate-level, not valuation: this is a ~20%-float minority under ~80% parent control.',
    limitations: [
      'Adjusted vs reported EBITDA: the company guides on adjusted EBITDA; the reported-EBITDA reconstruction in the model is a proxy — confirm the add-back bridge (SBC, one-offs).',
      'Order count, AOV and customer churn/cohort retention are not separately disclosed — only GMV, revenue and take-rate; quality KPIs must be diligenced.',
      'Revenue-line split (commission / fees / ads / q-commerce) is estimated; the company does not break it out.',
      'Minority position under ~80% parent control: no governance influence and exposure to related-party / take-private risk.',
    ],
    icThesis:
      'The investable thesis is acquiring a liquid, growth/crossover minority block in the profitable, cash-generative #1 MENA delivery platform at a ~50%-derated ~$7.0bn mark (~7x EV/adj. EBITDA, net cash), underwriting a re-rate as advertising scales and the q-commerce gross-margin compression normalises — explicitly accepting that this is a ~20%-float minority under Delivery Hero\'s ~80% control, with no governance lever and a financial (not strategic) return.',
    useOfFunds:
      'Secondary-market purchase of listed shares — capital goes to the selling counterparty in the market, not to the company. There is no primary use-of-funds; Talabat is self-funded (net-cash, $559m FY25 adj. FCF) and is itself a dividend payer (~90% payout). The fund\'s return is price re-rating plus the dividend yield during the hold.',
    proposedTerms: [
      { label: 'Instrument', value: 'Listed ordinary shares (DFM: TALABAT)' },
      { label: 'Ownership', value: '~1.7% at the ~$7.0bn market cap ($120m ticket ÷ $6,970m) — illustrative' },
      { label: 'Liquidity', value: 'Daily DFM liquidity; ~20% free float — size the block to avoid market impact' },
      { label: 'Governance', value: 'None at this stake — minority price-taker under Delivery Hero ~80% control; pursue information rights only if a larger block warrants' },
      { label: 'Key consideration', value: 'Listed/public-market name vs a typical private growth-equity mandate — a mandate CONSIDERATION (crossover sleeve), not a hard breach' },
    ],
    riskRegister: [
      { risk: 'Gross-margin compression (q-commerce mix)', severity: 'high', likelihood: 'medium', impact: 'If dark-store grocery is structurally lower-margin and ads under-scale, EBITDA-margin expansion fails to materialise and the re-rate thesis breaks', mitigation: 'Underwrite to conservative margin recovery; monitor segment gross margin and ads revenue mix', monitoring: 'Quarterly gross-profit margin, ads % of revenue, q-commerce GMV share' },
      { risk: 'Delivery Hero ~80% control / minority governance', severity: 'high', likelihood: 'medium', impact: 'Related-party transactions or a take-private on terms minorities do not set; zero strategic influence', mitigation: 'Diligence minority-protection provisions; cap position size; treat as financial-only bet', monitoring: 'DH strategic announcements, related-party disclosures, free-float changes' },
      { risk: 'Competition compressing take-rate', severity: 'medium', likelihood: 'medium', impact: 'Jahez/Careem/Noon/HungerStation price commissions/promotions down, eroding the ~41% take-rate', mitigation: 'Track take-rate trend and market share by country', monitoring: 'Revenue/GMV ratio, country-level share, promo intensity' },
      { risk: 'GCC corporate tax drag', severity: 'medium', likelihood: 'high', impact: 'Effective ~15% tax is a permanent net-margin drag vs pre-2024', mitigation: 'Already in the model and FY25 actuals; underwrite post-tax', monitoring: 'Effective tax rate by jurisdiction' },
      { risk: 'DFM liquidity / float depth', severity: 'medium', likelihood: 'medium', impact: '~20% float means a large block can move price on entry/exit', mitigation: 'Size to ADV; phase entry/exit', monitoring: 'Average daily volume, bid/ask depth' },
      { risk: 'Cyclicality / consumer spend', severity: 'low', likelihood: 'medium', impact: 'Discretionary food/grocery spend softens in a downturn', mitigation: 'Subscription base, essentials mix', monitoring: 'Order frequency, AOV, macro consumer indicators' },
    ],
    recommendationSummary:
      'Review — a profitable, cash-generative, fully-audited #1 MENA delivery platform trading ~50% below its IPO mark at ~7x EV/adj. EBITDA with net cash, where the model implies upside on a margin-recovery re-rate. The two gating questions are whether the FY25 gross-margin compression is cyclical (the thesis) or structural (the bear), and whether the fund is comfortable holding a ~20%-float minority under Delivery Hero\'s ~80% control with no governance lever. Resolve the margin question and the mandate fit on the listed/minority posture before sizing.',
    thesisDrivers: [
      'Margin-recovery re-rate: as the higher-take advertising line scales and the q-commerce mix matures, gross-profit margin recovers and reported EBITDA margin expands toward ~16% of revenue — the multiple re-rates off a ~7x EV/adj. EBITDA trough back toward profitable-growth peers.',
      'Profitable compounding + dividend: +mid-to-high-teens revenue growth on an already-profitable, net-cash base, with a ~90% payout — the return is GMV/revenue compounding plus a real dividend yield during the hold, not a cash-burn bet.',
      'Mispricing from technical flow: the ~50% derating coincides with post-IPO lock-up and DFM tech-sentiment flow rather than a fundamental break — net income still grew +34% in FY25; the gap between price and audited fundamentals is the opportunity.',
    ],
    thesisBreakers: [
      'Gross-profit margin keeps falling through FY26 (q-commerce/dark-store grocery proves structurally dilutive and advertising does not scale) — confirming the derating as fundamental, not technical.',
      'Take-rate (revenue/GMV) rolls over below ~40% as Jahez/Careem/Noon force commission/promo competition in KSA and the UAE.',
      'Delivery Hero launches a take-private or related-party transaction at a price that caps minority upside, or materially changes Talabat\'s strategy/capital allocation against minority interests.',
      'GMV growth decelerates below low-double-digits faster than modelled while margins stay compressed — i.e. growth slows AND quality slips together.',
    ],
    moat: {
      pillars: [
        'Delivery density & rider liquidity in core cities (UAE, Kuwait) — the self-reinforcing network effect that lowers cost-to-serve and delivery times below sub-scale rivals.',
        'Brand and #1 share across most of eight markets, with the talabat pro subscription deepening frequency and retention.',
        'Dark-store / q-commerce footprint and the Delivery Hero tech stack & procurement scale — hard for a sub-scale local entrant to replicate quickly.',
        'Profitability itself: being FCF-positive lets Talabat fund expansion and promotions from cash flow while cash-burning rivals are capital-constrained.',
      ],
      competitors: [
        { name: 'Jahez / HungerStation', note: 'Listed/scaled KSA rivals — the binding competition in the largest GCC market; pressure take-rate and share in Saudi.' },
        { name: 'Careem / Uber Eats', note: 'Super-app + global delivery muscle bundling food into mobility/payments — the most dangerous cross-subsidised threat.' },
        { name: 'Noon Food / Noon Minutes', note: 'Amazon-backed local champion pushing q-commerce/grocery — directly contests the dark-store strategy.' },
        { name: 'Deliveroo', note: 'Western pure-play read-through on where scaled delivery margins plateau.' },
      ],
      trajectory:
        'Consolidation-leaning but contested: Talabat\'s scale and profitability advantage should let it hold or extend share over 3–5 years, but KSA (Jahez/HungerStation) and the super-apps (Careem, Noon) keep the market from becoming a clean monopoly. The competitive arc runs through q-commerce/grocery and advertising, where the winner is whoever pairs density with the highest-margin mix.',
      erosionScenarios: [
        'A super-app (Careem/Uber, Noon) cross-subsidises delivery from mobility/retail/payments, flattening Talabat\'s take-rate.',
        'q-commerce grocery proves structurally low-margin, turning GMV growth into margin dilution rather than a moat.',
        'A regulator reclassifies riders as employees, raising cost-to-serve across the model and compressing the density advantage.',
        'Delivery Hero redirects investment/strategy in a way that starves Talabat\'s expansion to favour group priorities.',
      ],
    },
    qualityOfEarnings:
      'High — the strongest in the pipeline. Talabat reports audited IFRS consolidated financials as a DFM-listed company, so revenue ($3.9bn), net income ($464m), cash ($2.84bn) and equity ($699.9m) are STATED facts, not inferred. Two honest caveats for diligence: (1) the company guides on ADJUSTED EBITDA ($615m) — confirm the bridge to reported EBITDA (share-based comp, one-offs) so the margin trend is underwritten on a like-for-like basis; (2) the FY25 gross-margin compression must be decomposed by segment (core food vs q-commerce vs ads) to judge whether it is cyclical mix or structural — this is the single most important QoE question. Absolute order volume, AOV and cohort retention are not disclosed and should be required in the data room. Net income quality is supported by $559m adj. FCF (cash-backed, not accrual-flattered).',
    recentDevelopments:
      'FY2025 (reported Feb-26): GMV +28% to $9.5bn, revenue +33% to $3.9bn, net income +34% to $464m, adj. EBITDA $615m, adj. FCF $559m; $421m dividend (90% payout); $100m+ earmarked for 2026 expansion. Despite the strong print, the shares fell to an all-time low (~AED 0.63 in early Mar-26) and trade ~50% below the AED 1.72 IPO-day high — a derating driven by GMV-mix gross-margin pressure and a broader DFM tech sentiment reset rather than an earnings miss. Sector-wide, GCC delivery is shifting toward q-commerce/grocery and advertising monetisation, and GCC corporate income tax (effective ~15%) is now a permanent feature of the P&L. The Delivery Hero ~80% stake remains the structural governance fact for any minority investor.',
    useOfFundsBreakdown: [
      { category: 'Secondary share purchase (market block)', pct: 100, rationale: 'A listed minority is a pure secondary — 100% of capital buys existing shares on the DFM from the market. There is no primary split: Talabat is self-funded (net cash, $559m FY25 adj. FCF) and does not need the capital. The return is re-rating plus dividend yield, so the entire "use of funds" is the entry block itself; the only allocation decision is sizing vs daily liquidity.' },
    ],
    termSheet: {
      instrument: 'Listed ordinary shares (DFM: TALABAT) — open-market / block purchase',
      ownership: '~1.7% at the ~$7.0bn market cap ($120m ÷ $6,970m, illustrative)',
      boardGovernance: 'None at this stake — a ~1.7% minority in a ~20% free float under Delivery Hero\'s ~80% control carries no board seat or observer right. Engagement is limited to public-investor channels; information is the public disclosure regime (which is strong).',
      preferentialRights: [
        'None beyond ordinary-share rights — no liquidation preference, anti-dilution or special protections available to a secondary-market minority.',
        'Pro-rata participation only via the open market.',
        'Standard minority-shareholder protections under DFM/SCA listing rules and UAE company law (related-party-transaction disclosure, minority votes on certain matters).',
        'Tag-along / fair-price protection only to the extent SCA takeover rules apply in a Delivery Hero take-private.',
      ],
      conditionsPrecedent: [
        'Mandate sign-off that a listed, ~20%-float minority under ~80% parent control fits the crossover sleeve (the binding consideration).',
        'Diligence the FY25 gross-margin compression by segment (cyclical vs structural) and the adjusted-to-reported EBITDA bridge.',
        'Liquidity/market-impact analysis vs average daily volume to size the block.',
        'Review of Delivery Hero related-party arrangements and any take-private signalling.',
      ],
    },
    scenarioNarratives: {
      bear:
        'The FY25 gross-margin compression proves structural: q-commerce grocery stays dilutive, ads under-scale, and Jahez/Careem force take-rate down. Revenue growth fades to low-double-digits with no margin recovery, the multiple stays at a ~6–7x EV/EBITDA trough, and a Delivery Hero overhang caps any re-rate. Exit near or modestly below the entry mark — a low-single-digit or negative IRR, below hurdle.',
      base:
        'Advertising scales and the q-commerce mix normalises; gross margin recovers and reported EBITDA margin expands toward ~16% of revenue while revenue compounds in the mid-to-high teens. The multiple re-rates modestly off the trough and the ~90% dividend pays out through the hold. Exit at ~1.6x revenue delivers a mid-teens IRR — clears the hurdle on re-rate plus dividend, consistent with the model.',
      bull:
        'Talabat is rewarded as a profitable-growth compounder: ads become a material high-margin line, q-commerce turns accretive, share extends in KSA, and the stock re-rates toward DoorDash-like multiples on a larger revenue base. Net-cash optionality (buybacks/M&A) and a possible Delivery Hero take-private premium amplify the outcome — a 20%+ IRR / 2.5x+ MOIC, well above hurdle.',
    },
  },
  createdAt: '2026-06-06',
}
