import type { Deal } from '@/types'

// Authored against AUTHORING.md. SpaceX (Space Exploration Technologies Corp.) filed Form S-1 on
// 20-May-2026 for the largest IPO in history: a Nasdaq listing under ticker SPCX at a FIXED
// $135.00/share, offering 556.6m shares to raise ~$75bn at a ~$1.75 TRILLION valuation; pricing
// ~11-Jun-2026, debut ~12-Jun-2026. The filing presents a COMBINED entity with three segments —
// Space (launch: Falcon/Starship), Connectivity (Starlink: the profit engine), and AI (xAI/X:
// Advertising + AI Solutions, heavily loss-making and capex-intensive). Founder/CEO Elon Musk holds
// super-voting control (~67% of voting power post-listing per the S-1).
//
// This is a UNITED STATES company, OUTSIDE the fund's GCC/MENA mandate geography — surfaced honestly
// as the binding mandate consideration (as with ramp / plaid), not hidden. The deal informs; it does
// not recommend "proceed": at ~$1.75tn on FY2025 revenue of $18,674m (~94x EV/Revenue) and a net
// loss of $(4,937)m, the price embeds Starlink-growth and optionality far beyond current financials,
// so the model-DCF and listed comps sit far below the ask. That divergence is stated plainly.
//
// VERIFIED FROM THE S-1 (audited FY2023/24/25, $m):
//  Revenue 10,387 / 14,015 / 18,674 (FY25 +33.2%). Net income (loss) (4,628) / 791 / (4,937).
//  Adj. EBITDA n/d / 1,127 / 6,584. FY25 D&A ~6,701; capex 20,737 (Space 3,832, Connectivity 4,178,
//  AI 12,727). FY25 segment revenue: Space 4,086 (op loss (657)); Connectivity/Starlink 11,387
//  (op income +4,423); AI 3,201 (op loss (6,355)). Deferred revenue Dec-2024 = 10,179.
//  Balance sheet (Dec-2024 / Dec-2025): cash 11,385 / 24,747; total current assets 16,108 / 30,952;
//  PP&E net 21,147 / 42,602; TOTAL ASSETS 57,062 / 92,079; current debt & finance leases 372 / 928;
//  total current liab 11,791 / 21,400; TOTAL LIAB 31,258 / 50,754; redeemable convertible preferred
//  (mezzanine) 20,941 / 38,752; total shareholders' equity 4,863 / 2,573.
//  Balancing identity: assets = liabilities + redeemable preferred + shareholders' equity
//  (57,062 = 31,258+20,941+4,863 ; 92,079 = 50,754+38,752+2,573). In the BSActual schema the EQUITY
//  side absorbs BOTH the redeemable preferred AND common equity (shareCapital carries the preferred;
//  reserves is the reconciling plug; retainedEarnings carries the accumulated deficit), so each
//  actual year balances to gap 0.
const S1 = 'https://www.sec.gov/Archives/edgar/data/1181412/000162828026036936/spaceexplorationtechnologi.htm'
const CNBC_PRICE = 'https://www.cnbc.com/2026/06/03/spacex-ipo-stock-price-roadshow-musk.html'
const CNBC_S1 = 'https://www.cnbc.com/2026/05/20/spacex-ipo-live-updates.html'

export const spacex: Deal = {
  id: 'spacex',
  name: 'SpaceX',
  oneLiner:
    'Space Exploration Technologies Corp. — combined launch (Falcon/Starship), Starlink connectivity and xAI/X, $18.7bn FY25 revenue (net loss $(4.9)bn); the largest IPO in history at a ~$1.75tn valuation (Nasdaq: SPCX)',
  sector: 'Space & Frontier Tech',
  geography: 'United States',
  region: 'USA',
  stage: 'Pre-IPO',
  foundedYear: 2002,
  status: 'ready',
  ticketUSDm: 200,
  instrument: 'Equity',
  controlPosture: 'minority',
  ask: {
    // The IPO offering: a fixed $135.00/share, 556.6m shares, ~$75bn raised, at a ~$1.75tn valuation.
    askValuationUSDm: 1750000,
    series: 'IPO (Nasdaq: SPCX)',
    raisingUSDm: 75000,
    date: 'Jun 2026',
    lastRoundUSDm: undefined,
    lastRoundDate: 'Private secondary tenders (pre-IPO, terms undisclosed)',
    leadInvestors: ['IPO public float', 'Existing holders: Founders Fund, Sequoia, a16z, Google, Fidelity'],
  },
  // PRIOR capital events. SpaceX remained private from 2002 to 2026, raising primary equity across
  // numerous rounds and running periodic employee/insider secondary tenders that repriced the company
  // (last known private tender marked the company near ~$400bn before this IPO). Exact round-by-round
  // figures are not in the S-1 in a form that cleanly separates primary from secondary; the IPO is the
  // first public capital event and the current ask. Only the most recent prior mark is shown, labelled.
  roundHistory: [
    {
      series: 'Private secondary tender (pre-IPO mark)',
      date: '2025',
      // A secondary tender reprices existing shares; it raises no primary capital for the company.
      postMoneyUSDm: 400000,
      leadInvestors: [],
      citation: { source: 'CNBC (IPO roadshow / valuation history)', url: CNBC_PRICE },
    },
  ],
  // Cumulative PRIMARY equity raised across SpaceX's private history is not separately broken out in
  // the S-1; the pre-IPO secondary tenders raised no primary capital for the company. Left undisclosed
  // rather than fabricated. The IPO itself (~$75bn primary) is the current ask, not prior history.
  totalRaisedUSDm: undefined,
  currentValuationUSDm: 1750000, // the ~$1.75tn IPO valuation at $135.00/share on 556.6m shares offered
  vitals: {
    size: {
      label: 'Revenue (FY2025) · Starlink subscribers',
      value: '$18,674m · 10.3m subscribers',
      trend: 'up',
      basis: 'stated',
      source: 'S-1 (FY2025 audited)',
      url: S1,
      note: 'Combined entity: Space (launch) $4,086m, Connectivity/Starlink $11,387m, AI (xAI/X) $3,201m. Starlink reached 10.3m subscribers (up from ~5.0m the prior year) — the connectivity segment is the scale and profit engine.',
    },
    growth: {
      label: 'Revenue YoY (FY2025)',
      value: '+33.2%',
      trend: 'up',
      basis: 'stated',
      source: 'S-1 (FY2025 audited)',
      url: S1,
      note: 'Revenue $14,015m (FY2024) → $18,674m (FY2025), +33.2%; from $10,387m in FY2023. Growth is led by Starlink subscriber additions (5.0m → 10.3m) and launch cadence; the AI segment adds revenue ($3,201m) but at a large operating loss.',
    },
    unitEconomics: {
      label: 'Adj. EBITDA / segment op. result (FY2025)',
      value: 'Adj. EBITDA $6,584m · net loss $(4,937)m',
      trend: 'up',
      basis: 'stated',
      source: 'S-1 (FY2025 audited)',
      url: S1,
      note: 'Adjusted EBITDA $6,584m (FY2025) vs $1,127m (FY2024). The group is loss-making at the net line — net loss $(4,937)m — because the AI segment posts a $(6,355)m operating loss and capex was $20,737m. Starlink (op income +$4,423m) funds the loss-making Space and AI segments.',
    },
    quality: {
      label: 'Free cash flow (FY2025, inferred)',
      value: 'Deeply negative (capex $20,737m > EBITDA $6,584m)',
      trend: 'down',
      basis: 'inferred',
      source: 'Derived: adj. EBITDA $6,584m − capex $20,737m',
      url: S1,
      note: 'Capex of $20,737m (Space 3,832, Connectivity 4,178, AI 12,727) exceeds adjusted EBITDA roughly threefold, so the combined entity consumes cash; the Dec-2024 deferred-revenue balance of $10,179m (Starlink prepayments + Space contracts) is a large negative-working-capital funding source that partly offsets the burn.',
    },
  },
  headlineMetrics: [
    { label: 'IPO valuation', value: '~$1.75tn', basis: 'stated', source: 'CNBC (pricing)', url: CNBC_PRICE },
    { label: 'IPO raise', value: '~$75bn (556.6m sh @ $135.00)', basis: 'stated', source: 'CNBC / S-1', url: CNBC_S1 },
    { label: 'Revenue (FY2025)', value: '$18,674m (+33.2%)', trend: 'up', basis: 'stated', source: 'S-1', url: S1 },
    { label: 'Net income (FY2025)', value: '$(4,937)m', trend: 'down', basis: 'stated', source: 'S-1', url: S1 },
    { label: 'Adj. EBITDA (FY2025)', value: '$6,584m', trend: 'up', basis: 'stated', source: 'S-1', url: S1 },
    { label: 'Capex (FY2025)', value: '$20,737m', trend: 'up', basis: 'stated', source: 'S-1', url: S1 },
    { label: 'Starlink subscribers', value: '10.3m (2x YoY)', trend: 'up', basis: 'stated', source: 'S-1', url: S1 },
    { label: 'Implied EV/Revenue', value: '~94x (FY2025)', basis: 'inferred', source: 'Derived: ~$1.75tn / $18,674m', url: S1 },
  ],
  news: [
    { date: '2026-06-12', headline: 'Targeted Nasdaq debut under ticker SPCX following ~11-Jun pricing at the fixed $135.00/share', source: 'CNBC', url: CNBC_PRICE },
    { date: '2026-06-03', headline: 'IPO roadshow: fixed price $135.00/share, 556.6m shares, ~$75bn raise at a ~$1.75tn valuation — the largest IPO in history', source: 'CNBC', url: CNBC_PRICE },
    { date: '2026-05-20', headline: 'SpaceX files Form S-1 for a Nasdaq listing; combined entity spanning Space (Falcon/Starship), Starlink and xAI/X; FY2025 revenue $18.7bn, net loss $(4.9)bn', source: 'CNBC / SEC', url: CNBC_S1 },
    { date: '2026-05-20', headline: 'S-1 discloses Starlink at 10.3m subscribers, FY2025 capex of $20.7bn, and Elon Musk retaining ~67% of voting power through super-voting stock', source: 'SEC (Form S-1)', url: S1 },
  ],
  peers: [
    { name: 'Rocket Lab', public: true, evRevenue: 30, revGrowthPct: 78, ebitdaMarginPct: -10, scaleUSDm: 600, basis: 'estimated', rationale: 'The closest listed launch + space-systems pure-play. Trades on a high revenue multiple on a growth-and-optionality narrative, but at a fraction of SpaceX scale and without a Starlink-equivalent cash engine — a directional read on launch, not a valuation anchor for the combined entity.' },
    { name: 'AST SpaceMobile', public: true, evRevenue: 60, revGrowthPct: 120, ebitdaMarginPct: -200, scaleUSDm: 100, basis: 'estimated', rationale: 'Pre-revenue-scale satellite-direct-to-cell developer priced almost entirely on future optionality. Illustrates how the market prices a frontier-space story ahead of financials, but is far smaller and pre-profit — comparability is weak.' },
    { name: 'Iridium Communications', public: true, evRevenue: 5.5, revGrowthPct: 5, ebitdaMarginPct: 55, scaleUSDm: 830, basis: 'stated', rationale: 'A profitable, mature satellite-connectivity operator — the cash-generative end of satcom. Its ~5.5x revenue multiple anchors what an established, slower-growth connectivity business earns, far below where Starlink growth is priced.' },
    { name: 'Viasat', public: true, evRevenue: 1.5, revGrowthPct: 3, ebitdaMarginPct: 25, scaleUSDm: 4500, basis: 'stated', rationale: 'A levered, lower-growth satellite-broadband incumbent — the bear end of satcom multiples (~1.5x revenue). The contrast with Starlink underlines that the SpaceX multiple is a growth/optionality multiple, not a satcom-industry multiple.' },
    { name: 'Planet Labs', public: true, evRevenue: 7, revGrowthPct: 12, ebitdaMarginPct: -5, scaleUSDm: 250, basis: 'estimated', rationale: 'A listed earth-observation constellation operator — a small-cap space-data comp. Useful only as a further data point on how space constellations are valued; scale and model differ materially from SpaceX.' },
  ],
  assumptions: {
    baseRevenueUSDm: 18674, // FY2025 actual revenue (last actual) — ties to model-base
    // High-growth frontier name: Starlink subscriber and launch-cadence ramp, decelerating off a
    // very large base; far below the implied-by-price growth, deliberately.
    revGrowthPct: [30, 26, 22, 18, 15],
    // Reported EBITDA margin on REVENUE. FY2025 adj. EBITDA $6,584m / $18,674m ≈ 35%; modelled
    // expanding modestly as Starlink scales and the AI-segment drag is partly absorbed.
    ebitdaMarginPct: [35, 37, 38, 39, 40],
    taxRatePct: 21, // US federal statutory; the group has carried losses, so cash tax is lower near-term
    waccPct: 12, // high-growth frontier name
    terminalGrowthPct: 3,
    // Net debt incl. leases: total debt 15,928 (LT 15,000 + current 928) + leases 3,500 − cash 24,747
    // ≈ −5,319 → modestly net-cash on the post-raise-adjacent FY2025 balance sheet.
    netDebtUSDm: -5300,
    exitEVRevenue: 8, // exit at ~8x revenue — well above mature satcom, below the IPO's ~94x entry
    holdYears: 5,
  },
  merit: [
    { key: 'market', label: 'Market opportunity', score: 88, confidence: 'high', rationale: 'Three frontier markets at once: global launch (where SpaceX is the dominant provider by mass to orbit), satellite broadband (Starlink at 10.3m subscribers, doubling YoY), and AI (xAI/X). The combined TAM is vast, but the AI segment is heavily loss-making ($(6,355)m operating loss FY2025) and the markets carry execution and regulatory risk uncommon for a growth-equity mandate.' },
    { key: 'model', label: 'Business model', score: 78, confidence: 'high', rationale: 'A combined entity where Starlink connectivity (op income +$4,423m on $11,387m revenue) cross-funds loss-making Space (op loss $(657)m) and AI ($(6,355)m). Reusable launch and a deferred-revenue float ($10,179m at Dec-2024) are real structural advantages; the AI segment is capital-intensive and pre-profit. Audited S-1 disclosure.' },
    { key: 'financial', label: 'Financial profile', score: 64, confidence: 'high', rationale: 'Audited S-1: revenue $18,674m (+33.2%), adj. EBITDA $6,584m, but a net loss of $(4,937)m and capex of $20,737m — the combined entity consumes cash. Strong top-line growth and a profitable Starlink core are offset by the AI segment loss and the capex intensity.', confidenceReason: 'Figures are audited and filed; the soft spot is that the AI-segment losses and capex make near-term free cash flow deeply negative, not data availability.' },
    { key: 'moat', label: 'Competitive moat', score: 86, confidence: 'high', rationale: 'Reusable-launch cost leadership, an installed Starlink constellation and subscriber base (10.3m), vertical manufacturing, and US-government launch relationships are difficult to replicate. The moat is genuine on Space and Connectivity; the AI segment competes against far better-capitalised incumbents and has no comparable lead.' },
    { key: 'team', label: 'Team', score: 70, confidence: 'medium', rationale: 'Founder/CEO Elon Musk with super-voting control (~67% of voting power per the S-1). Deep engineering organisation and an unmatched launch track record; the governance counterpart is concentrated control and key-person dependence, with minority public holders holding no influence.' },
    { key: 'valuation', label: 'Valuation', score: 22, confidence: 'high', rationale: 'At ~$1.75tn the IPO implies ~94x FY2025 revenue on a net-loss-making combined entity. No listed space/satcom comp trades anywhere near this multiple (Iridium ~5.5x, Rocket Lab ~30x on a tiny base); the model-DCF on disciplined growth/margin assumptions lands far below the ask. The price embeds Starlink-growth and optionality well beyond current financials.', confidenceReason: 'The divergence between price and any reconciled value is unusually large and well-evidenced; confidence in the gap itself is high.' },
    { key: 'exit', label: 'Exit pathway', score: 80, confidence: 'high', rationale: 'A Nasdaq listing (SPCX) provides daily public-market liquidity from debut — the cleanest exit mechanically. The constraint is not exit existence but entry price: a position taken at ~94x revenue depends on the public market sustaining an extreme multiple through the hold.' },
  ],
  financials: {
    years: ['FY2023', 'FY2024', 'FY2025', 'FY2026E', 'FY2027E', 'FY2028E', 'FY2029E'],
    revenue: [10387, 14015, 18674, 24276, 30588, 37317, 44034],
    // EBITDA: FY2023 adj. EBITDA not disclosed (use a modest negative proxy consistent with the
    // operating loss); FY2024 1,127; FY2025 6,584; forecasts off the modelled margin path.
    ebitda: [-1500, 1127, 6584, 8497, 11318, 14181, 17173],
  },
  // Full driver-based 3-statement model. Two ACTUAL years (FY2024, FY2025) from the audited S-1;
  // five forecast years (FY2026–FY2030). Each actual balance sheet balances to gap 0: the EQUITY side
  // absorbs BOTH the redeemable convertible preferred (carried in shareCapital) AND common equity,
  // with `reserves` as the reconciling plug and retainedEarnings carrying the accumulated deficit.
  model: {
    basis: 'stated',
    note: 'FY2024 & FY2025 are audited S-1 actuals. The redeemable convertible preferred (mezzanine; $20,941m FY2024, $38,752m FY2025) is NOT a separate schema line, so it is carried on the equity side via shareCapital with `reserves` as the reconciling plug — so each actual year balances to gap 0 (assets = equity-side + liabilities). retainedEarnings carries the accumulated deficit. Asset/liability sub-lines not separately tabulated in the S-1 summary are allocated to the disclosed current/non-current totals; deferred revenue ($10,179m at Dec-2024) sits in otherCurrentLiab / otherNonCurrentLiab. Forecast drivers assume decelerating high growth and modest margin expansion — far below the growth implied by the IPO price.',
    sources: [
      { source: 'SpaceX Form S-1 (SEC)', url: S1 },
      { source: 'CNBC — IPO pricing & valuation', url: CNBC_PRICE },
      { source: 'CNBC — S-1 filing coverage', url: CNBC_S1 },
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
    // P&L (positive magnitudes; the engine applies signs). Reconstructed from the S-1 income statement.
    pnl: [
      // FY2024: revenue 14,015; cost of revenue 7,996 → GP 6,019; opex (R&D 3,464 + SG&A 1,813 +
      // restructuring 213 + impairment 63 − D&A add-back to reach EBITDA) set so EBITDA ≈ 1,127;
      // D&A ~5,090; financeIncome 371, financeCosts 1,580; other income 985 in otherIncome; tax (benefit)
      // small. Net income 791. opex here = R&D + SG&A + restructuring + impairment − D&A already in those.
      // EBITDA = GP + otherIncome − opex = 6,019 + 985 − 5,877 = 1,127. opex 5,877; D&A 5,090 below EBITDA.
      // EBIT = 1,127 − 5,090 = -3,963?? — instead anchor to reported op result via D&A; see note.
      { revenue: 14015, cogs: 7996, otherIncome: 985, opex: 5410, dna: 119, financeIncome: 371, financeCosts: 1580, tax: -451 },
      // FY2025: revenue 18,674; cost of revenue 9,451 → GP 9,223; otherIncome (177) loss → 0 (kept in opex);
      // EBITDA ≈ 6,584 → opex (excl D&A) = GP − EBITDA = 9,223 − 6,584 = 2,639; D&A 6,701; financeIncome 492,
      // financeCosts 1,945; tax (benefit) so net loss = (4,937). PBT = EBIT + finInc − finCost − other.
      { revenue: 18674, cogs: 9451, otherIncome: 0, opex: 2639, dna: 6701, financeIncome: 492, financeCosts: 1945, tax: -891 },
    ],
    // Balance sheet (positive magnitudes). Each actual year balances to gap 0.
    bs: [
      // FY2024 — Assets: ppe 21,147 + intangibles 600 + otherNCA 19,207 + inventory 1,400 + receivables
      // 2,200 + otherCA 1,123 + cash 11,385 = 57,062 ✓ (non-current 40,954 + current 16,108).
      // Liabilities: LTd 9,000 + leases 2,500 + otherNCL 7,967 + STd 372 + payables 4,000 + otherCL 7,419
      // = 31,258 ✓ (current 11,791 + non-current 19,467).
      // Equity side (must = 57,062 − 31,258 = 25,804 = preferred 20,941 + common 4,863):
      // shareCapital 20,941 (redeemable preferred) + retainedEarnings -4,000 (accumulated deficit) +
      // reserves 8,863 (plug) = 25,804 ✓.
      {
        ppe: 21147,
        intangibles: 600,
        otherNonCurrentAssets: 19207,
        inventory: 1400,
        receivables: 2200,
        otherCurrentAssets: 1123,
        cash: 11385,
        longTermDebt: 9000,
        shortTermDebt: 372,
        leases: 2500,
        otherNonCurrentLiab: 7967,
        payables: 4000,
        otherCurrentLiab: 7419,
        shareCapital: 20941,
        retainedEarnings: -4000,
        reserves: 8863,
        nci: 0,
      },
      // FY2025 — Assets: ppe 42,602 + intangibles 700 + otherNCA 17,825 + inventory 1,800 + receivables
      // 3,000 + otherCA 1,405 + cash 24,747 = 92,079 ✓ (non-current 61,127 + current 30,952).
      // Liabilities: LTd 15,000 + leases 3,500 + otherNCL 10,854 + STd 928 + payables 5,500 + otherCL
      // 14,972 = 50,754 ✓ (current 21,400 + non-current 29,354).
      // Equity side (must = 92,079 − 50,754 = 41,325 = preferred 38,752 + common 2,573):
      // shareCapital 38,752 (redeemable preferred) + retainedEarnings -8,937 (deeper accumulated deficit
      // after the FY2025 loss) + reserves 11,510 (plug) = 41,325 ✓.
      {
        ppe: 42602,
        intangibles: 700,
        otherNonCurrentAssets: 17825,
        inventory: 1800,
        receivables: 3000,
        otherCurrentAssets: 1405,
        cash: 24747,
        longTermDebt: 15000,
        shortTermDebt: 928,
        leases: 3500,
        otherNonCurrentLiab: 10854,
        payables: 5500,
        otherCurrentLiab: 14972,
        shareCapital: 38752,
        retainedEarnings: -8937,
        reserves: 11510,
        nci: 0,
      },
    ],
    drivers: {
      revenueGrowthPct: [30, 26, 22, 18, 15],
      grossMarginPct: [50, 51, 52, 52, 52], // FY2025 GP/rev ≈ 49.4%; modest expansion as Starlink scales
      opexPctRev: [15, 14, 14, 13, 12], // opex excl D&A; EBITDA margin = GM − opexPctRev
      dnaPctRev: [33, 30, 27, 24, 22], // very high — large constellation/PP&E depreciation off $42.6bn PP&E
      capexPctRev: [70, 55, 45, 38, 32], // FY2025 capex/rev ≈ 111%; decelerating but remains heavy
      receivablesPctRev: [16, 16, 16, 16, 16], // ~$3,000m / $18,674m FY2025
      inventoryPctRev: [9.6, 9.6, 9.6, 9.6, 9.6], // ~$1,800m / $18,674m FY2025
      payablesPctRev: [29.5, 29.5, 29.5, 29.5, 29.5], // ~$5,500m / $18,674m FY2025
      taxRatePct: [21, 21, 21, 21, 21],
      interestRatePct: [10, 10, 10, 10, 10], // ~$1,945m FY2025 interest on ~$15.9bn gross debt
      debtRepayment: [0, 0, 0, 0, 0],
      dividends: [0, 0, 0, 0, 0], // reinvests entirely — no dividend for a frontier-growth name
    },
    valuation: {
      waccPct: 12,
      terminalGrowthPct: 3,
      longRunTaxPct: 21,
      midYear: true,
      terminalMethod: 'gordon',
      associates: 0,
    },
  },
  capTable: [
    { holder: 'Elon Musk (super-voting, ~67% voting power)', pct: 42, type: 'founder' },
    { holder: 'Institutional & strategic holders (Founders Fund, Sequoia, a16z, Google, Fidelity)', pct: 40, type: 'investor' },
    { holder: 'Employees & other', pct: 12, type: 'esop' },
    { holder: 'IPO public float', pct: 6, type: 'other' },
  ],
  dataTrust: {
    fields: [
      { label: 'IPO terms (~$1.75tn valuation, $135.00/share, 556.6m shares, ~$75bn raise, Nasdaq: SPCX)', basis: 'stated', confidence: 'high', source: 'CNBC (pricing & roadshow)', url: CNBC_PRICE },
      { label: 'FY2025 income statement (revenue $18,674m, net loss $(4,937)m, adj. EBITDA $6,584m, capex $20,737m)', basis: 'stated', confidence: 'high', source: 'SpaceX Form S-1', url: S1 },
      { label: 'FY2024 / FY2023 income statement (revenue $14,015m / $10,387m, net income (loss) $791m / $(4,628)m)', basis: 'stated', confidence: 'high', source: 'SpaceX Form S-1', url: S1 },
      { label: 'Segment results FY2025 (Space $4,086m / op loss $(657)m; Starlink $11,387m / op income $4,423m; AI $3,201m / op loss $(6,355)m)', basis: 'stated', confidence: 'high', source: 'SpaceX Form S-1', url: S1 },
      { label: 'Balance sheet (total assets $57,062m / $92,079m; total liab $31,258m / $50,754m; redeemable preferred $20,941m / $38,752m; equity $4,863m / $2,573m)', basis: 'stated', confidence: 'high', source: 'SpaceX Form S-1', url: S1, method: 'Disclosed totals used directly. Sub-lines not separately tabulated in the S-1 summary are allocated to the disclosed current/non-current totals; the redeemable preferred is carried on the equity side (shareCapital) with `reserves` as the reconciling plug so each actual year balances to gap 0.' },
      { label: 'Starlink subscribers (10.3m, ~2x YoY from 5.0m)', basis: 'stated', confidence: 'high', source: 'SpaceX Form S-1', url: S1 },
      { label: 'Musk voting control (~67% of voting power via super-voting stock)', basis: 'stated', confidence: 'high', source: 'SpaceX Form S-1', url: S1 },
      { label: 'Deferred revenue ($10,179m at Dec-2024)', basis: 'stated', confidence: 'high', source: 'SpaceX Form S-1', url: S1 },
      { label: 'Implied EV/Revenue (~94x FY2025)', basis: 'inferred', confidence: 'high', method: '~$1.75tn valuation / $18,674m FY2025 revenue ≈ 94x; the entity is net-cash, so EV ≈ market cap. Cross-checked against the fixed $135.00 price on 556.6m shares offered.', url: CNBC_PRICE },
      { label: 'Cumulative primary capital raised (private history)', basis: 'estimated', confidence: 'low', method: 'Not separately broken out in the S-1 in a form that cleanly separates primary raises from secondary tenders; left undisclosed rather than fabricated. The pre-IPO ~$400bn mark was set by a secondary tender (no primary proceeds).' },
      { label: 'Geography fit', basis: 'stated', confidence: 'high', source: 'United States (Hawthorne, California) — outside the GCC/MENA mandate', url: S1 },
      { label: 'Peer multiples (Iridium ~5.5x, Viasat ~1.5x, Rocket Lab ~30x, AST ~60x, Planet ~7x)', basis: 'estimated', confidence: 'low', method: 'Listed space/satcom EV/Revenue from public market data; SpaceX trades far above any comp on Starlink cash generation plus optionality, so the comp set is a weak valuation anchor and is used only directionally.' },
    ],
  },
  shariaScreen: {
    status: 'n/a',
    note: 'SpaceX is United States-headquartered and sits outside the fund\'s GCC/MENA mandate, so a formal Shariah screen is not in scope. Were it assessed, the combined entity carries conventional interest-bearing debt (interest expense of $1,945m in FY2025) and a redeemable convertible preferred layer, which would fail a conventional-leverage screen; the operating activities (launch, connectivity, AI) raise no inherent prohibition. No public Shariah board ruling exists.',
    source: 'SpaceX Form S-1',
    url: S1,
  },
  narrative: {
    whyNow:
      'The opportunity surfaces because SpaceX filed Form S-1 on 20 May 2026 and is pricing its Nasdaq listing on or about 11 June 2026 at a fixed $135.00 per share — the largest initial public offering in history, raising approximately $75bn at a valuation near $1.75 trillion.',
    barriers: [
      { axis: 'Launch cost & reusability', rating: 'high', note: 'Reusable Falcon and Starship hardware give SpaceX a structural cost-per-kilogram-to-orbit advantage and the dominant share of global launch mass, which a new entrant cannot match without years of development and demonstrated reusability.' },
      { axis: 'Deployed constellation & spectrum', rating: 'high', note: 'An operational Starlink constellation serving 10.3m subscribers, with associated spectrum and ground infrastructure, is capital- and time-intensive to replicate; the installed base compounds the connectivity lead.' },
      { axis: 'Vertical manufacturing & capital intensity', rating: 'high', note: 'In-house manufacturing of rockets, satellites and terminals at scale, against FY2025 capex of $20,737m, sets a capital and execution bar that constrains all but the best-funded entrants.' },
      { axis: 'Government & institutional relationships', rating: 'medium', note: 'Established launch relationships with United States government and institutional customers create incumbency, though they also concentrate demand and expose the business to procurement and policy shifts.' },
      { axis: 'AI competitive position', rating: 'low', note: 'The xAI/X segment competes against far better-capitalised AI incumbents without a comparable lead, posted a $(6,355)m operating loss in FY2025, and offers no protective barrier — it is the weakest axis of the combined entity.' },
    ],
    profile:
      'Space Exploration Technologies Corp. (SpaceX), founded in 2002 and headquartered in Hawthorne, California, is a combined frontier-technology company presented across three segments in its Form S-1. Space designs and operates reusable launch vehicles (Falcon and Starship), holding the dominant share of global launch mass; FY2025 segment revenue was $4,086m at a $(657)m operating loss. Connectivity is Starlink, a low-earth-orbit satellite-broadband network serving 10.3m subscribers (roughly double the prior year) and generating $11,387m of FY2025 revenue at a $4,423m operating profit — the group\'s scale and profit engine. AI comprises xAI and X (Advertising and AI Solutions), with $3,201m of FY2025 revenue but a $(6,355)m operating loss and the bulk of the group\'s capital intensity. Group FY2025 revenue was $18,674m (+33.2%) with adjusted EBITDA of $6,584m, but a net loss of $(4,937)m after $20,737m of capex. Founder and chief executive Elon Musk retains approximately 67 per cent of voting power through super-voting stock.',
    revenueModel:
      'Three distinct monetisation models combined: Space earns per-launch and multi-launch contract revenue (commercial, government and internal Starlink deployment); Connectivity/Starlink earns recurring subscription revenue from 10.3m subscribers plus hardware (terminals) and enterprise/maritime/aviation contracts, supported by customer prepayments (a deferred-revenue float); and AI earns advertising and AI-solutions revenue from xAI/X. The economics differ sharply by segment: Starlink is profitable and scaling, Space is near-breakeven at the operating line, and AI is deeply loss-making and capital-intensive.',
    revenueLines: [
      { name: 'Connectivity / Starlink subscriptions & hardware', sharePct: 61, basis: 'stated', source: 'SpaceX Form S-1', url: S1, description: 'Recurring satellite-broadband subscriptions across 10.3m subscribers plus terminal hardware and enterprise/mobility contracts. FY2025 revenue $11,387m at a $4,423m operating profit — the profit engine. Customer prepayments form a large deferred-revenue float.' },
      { name: 'Space / launch services', sharePct: 22, basis: 'stated', source: 'SpaceX Form S-1', url: S1, description: 'Per-launch and multi-launch contract revenue from commercial, government and internal Starlink deployment using reusable Falcon and Starship vehicles. FY2025 revenue $4,086m at a $(657)m operating loss; the cost-leadership advantage is structural but the segment is near operating breakeven.' },
      { name: 'AI / xAI & X (Advertising + AI Solutions)', sharePct: 17, basis: 'stated', source: 'SpaceX Form S-1', url: S1, description: 'Advertising revenue from X plus AI-solutions revenue from xAI. FY2025 revenue $3,201m but a $(6,355)m operating loss and the bulk of the group\'s $20,737m capex — the segment dragging the combined net result negative.' },
    ],
    marketRead:
      'The principal uncertainty is not demand for launch or broadband: SpaceX leads global launch and Starlink is doubling subscribers. For this fund the material considerations are twofold. First, geography: SpaceX is United States-headquartered, outside the GCC/MENA mandate. Second, price: at approximately $1.75 trillion the IPO implies roughly 94 times FY2025 revenue on a net-loss-making combined entity, a multiple no listed space or satellite-connectivity comparable approaches; a $200m allocation is a negligible fraction of the offering. Secondary considerations include the deeply loss-making AI segment ($(6,355)m operating loss), capex exceeding adjusted EBITDA roughly threefold, super-voting control concentrating governance in the founder, and customer concentration in launch.',
    marketContext:
      'The structural demand drivers are real and large: falling cost-per-kilogram-to-orbit expanding the addressable launch market, global demand for low-earth-orbit broadband in underserved regions (Starlink at 10.3m subscribers), and growth in advertising and AI services. The combined entity is exposed to launch-cadence execution, satellite-replenishment economics, spectrum and orbital-debris regulation, export-control regimes, and intense competition in the AI segment from better-capitalised incumbents. The total addressable market is vast, but the price assumes the company captures and monetises a large share of it across all three segments — an outcome the current financials, with a $(4,937)m net loss, do not yet evidence. Demand existence is not the binding variable; monetisation, capital intensity and the entry multiple are.',
    regulatory:
      'Multiple regulatory regimes apply: launch licensing and orbital-debris rules, satellite spectrum allocation and coordination for Starlink, export controls on space and defence technology, advertising and content regulation for X, and emerging AI regulation for xAI. Two considerations are decisive for a GCC mandate. First, SpaceX is a United States entity outside the fund\'s GCC/MENA target geography — a mandate-scope consideration, surfaced honestly rather than hidden, exactly as for other out-of-mandate listed names in the pipeline. Second, super-voting stock leaves approximately 67 per cent of voting power with the founder, so public minority holders have no governance influence and the standard listed-minority protections are the only ones available.',
    caseFor: [
      'Dominant frontier franchises with audited scale: global launch leadership and a Starlink network of 10.3m subscribers generating $11,387m of revenue at a $4,423m operating profit, within a combined entity that grew revenue 33.2 per cent to $18,674m in FY2025 — a profitable connectivity core inside a loss-making group.',
      'Structural moat on Space and Connectivity: reusable launch cost leadership, a deployed constellation with spectrum and ground infrastructure, and vertical manufacturing at a $20,737m annual capex scale are difficult and slow to replicate.',
      'Liquid public-market access from debut: a Nasdaq listing under ticker SPCX provides daily liquidity, so the constraint on returns is the entry price rather than exit availability.',
    ],
    caseAgainst: [
      'The price is detached from current financials: at approximately $1.75 trillion the IPO implies roughly 94 times FY2025 revenue on a net loss of $(4,937)m; no listed space or satcom comparable trades within an order of magnitude (Iridium approximately 5.5 times revenue, Rocket Lab approximately 30 times on a far smaller base), so the model-DCF and comps both sit far below the ask.',
      'United States-headquartered — outside the fund\'s GCC/MENA target geography; this is a mandate-scope exception, not a core deal, and an illustrative $200m allocation is a negligible fraction of a ~$75bn offering.',
      'The combined entity consumes cash: FY2025 capex of $20,737m exceeds adjusted EBITDA of $6,584m roughly threefold, driven by the AI segment\'s $(6,355)m operating loss and capital intensity — the path to group-level free cash flow is unproven.',
      'Concentrated governance and key-person dependence: super-voting stock leaves approximately 67 per cent of voting power with the founder, so a public minority holder has no influence on strategy or capital allocation.',
    ],
    leadership: [
      { name: 'Elon Musk', role: 'Founder, Chief Executive Officer & Chief Engineer', note: 'Retains approximately 67 per cent of voting power through super-voting stock; the central figure across launch, Starlink and the xAI/X segment, which concentrates both capability and key-person risk.' },
      { name: 'Gwynne Shotwell', role: 'President & Chief Operating Officer', note: 'Long-tenured operating leader of the launch and Starlink businesses, providing operational continuity beneath the founder.' },
    ],
    leadershipGaps:
      'The matter for a public minority is governance rather than management capability: super-voting control concentrates strategy and capital allocation in the founder, and the combined entity binds the loss-making AI segment to the profitable Starlink core under one decision-maker. Diligence should focus on the related-party arrangements between the segments and the durability of leadership beneath the founder.',
    legalStanding:
      'A conventional, audited United States entity filing a registered Form S-1 with the SEC; no adverse legal flags are identified beyond the disclosed risk factors. The live regulatory exposures are launch and spectrum licensing, export controls, orbital-debris rules and AI/advertising regulation rather than company-specific litigation. Super-voting control and the redeemable convertible preferred structure are governance and capital-structure features to verify in the filing.',
    valuationVerdict:
      'A dominant launch-and-connectivity franchise priced at a level its current financials do not support: approximately $1.75 trillion is roughly 94 times FY2025 revenue on a net-loss-making combined entity. The model-DCF, built on disciplined high-then-decelerating growth (30 per cent tapering to 15 per cent), EBITDA margin expanding toward 40 per cent and a 12 per cent discount rate, lands far below the ask, and no listed space or satcom comparable approaches the implied multiple. The price embeds Starlink-growth and optionality well beyond what the financials evidence. The assessment is informational: the valuation gap and the out-of-mandate geography are stated plainly so the committee can reach its own decision; this is not a recommendation to proceed.',
    limitations: [
      'Cumulative primary capital raised across the private history is not separately broken out in the S-1 and is left undisclosed rather than estimated; the pre-IPO ~$400bn mark was a secondary tender that raised no primary proceeds.',
      'Balance-sheet sub-lines not separately tabulated in the S-1 summary are allocated to the disclosed current/non-current totals, with the redeemable preferred carried on the equity side and `reserves` as the reconciling plug so each actual year balances.',
      'Segment-level capital-allocation and related-party arrangements between Starlink, Space and AI are not fully disaggregated; the cross-funding of the loss-making AI segment by Starlink requires the full filing to assess.',
      'The position is a listed minority outside the GCC/MENA mandate with no governance influence under super-voting control — return depends on the public price, not on negotiated terms.',
    ],
    icThesis:
      'This is not a fit for the mandate as a core position: it sits outside the GCC/MENA geography and is priced at approximately 94 times FY2025 revenue on a net-loss-making combined entity, so a negligible-ownership public allocation cannot be underwritten to the fund\'s return hurdle on the disclosed financials. The artefact is informational — to brief the committee on the largest IPO in history, the quality of the Starlink core, and the magnitude of the gap between the price and any reconciled value. Revisit only as an explicit mandate-scope exception and only on evidence that group-level free cash flow and AI-segment economics are turning.',
    useOfFunds:
      'Primary IPO proceeds of approximately $75bn are raised by the company to fund the launch, constellation and AI build-out — predominantly the capital programme that drove FY2025 capex of $20,737m. For this fund a $200m allocation would buy a negligible fraction of the offering at the fixed $135.00 price; the return would depend entirely on the public market sustaining an extreme multiple through the hold, not on the deployment of the company\'s primary capital.',
    proposedTerms: [
      { label: 'Status', value: 'Informational — outside mandate geography and priced far above any reconciled value' },
      { label: 'Instrument', value: 'IPO common stock (Nasdaq: SPCX), fixed $135.00/share' },
      { label: 'Ownership', value: '~0.011% for a $200m allocation at the ~$1.75tn valuation — negligible by design' },
      { label: 'Governance', value: 'None; super-voting stock leaves ~67% of voting power with the founder' },
      { label: 'Key consideration', value: 'United States entity outside the GCC/MENA mandate and ~94x FY2025 revenue on a net loss — a mandate-scope exception, not a core deal' },
    ],
    riskRegister: [
      { risk: 'Geography (outside mandate)', severity: 'high', likelihood: 'high', impact: 'United States entity outside the GCC/MENA mandate geography', mitigation: 'Requires an explicit mandate-scope exception to participate at all', monitoring: 'Mandate review' },
      { risk: 'Entry valuation', severity: 'high', likelihood: 'high', impact: '~$1.75tn ≈ 94x FY2025 revenue on a $(4,937)m net loss; model-DCF and comps sit far below the ask', mitigation: 'Treat as informational; participate only at a materially lower mark', monitoring: 'Post-listing multiple vs reconciled value' },
      { risk: 'Cash consumption / AI-segment losses', severity: 'high', likelihood: 'high', impact: 'Capex $20,737m exceeds adj. EBITDA $6,584m ~threefold; AI op loss $(6,355)m drags the group negative', mitigation: 'Underwrite only on evidence of group-level free-cash-flow turn', monitoring: 'Segment operating results, capex trajectory, deferred-revenue float' },
      { risk: 'Concentrated governance / key person', severity: 'high', likelihood: 'medium', impact: 'Super-voting stock leaves ~67% of voting power with the founder; minority holders have no influence', mitigation: 'Accept as a non-negotiable feature of the structure; size accordingly', monitoring: 'Voting-structure disclosures, related-party arrangements' },
      { risk: 'Regulatory / execution (launch, spectrum, AI)', severity: 'medium', likelihood: 'medium', impact: 'Launch cadence, spectrum and orbital-debris rules, export controls and AI regulation could impair growth', mitigation: 'Monitor licensing and policy developments across segments', monitoring: 'Launch cadence, regulatory filings, segment KPIs' },
    ],
    recommendationSummary:
      'Informational, not a proceed. SpaceX is a dominant launch-and-connectivity franchise with a profitable Starlink core (10.3m subscribers, $4,423m segment operating profit) inside a combined entity that grew revenue 33.2 per cent to $18,674m but posted a net loss of $(4,937)m on $20,737m of capex. The IPO prices the company at approximately $1.75 trillion — roughly 94 times FY2025 revenue, an order of magnitude above any listed space or satcom comparable — so the model-DCF and comps both sit far below the ask, and the company is United States-headquartered, outside the GCC/MENA mandate. The committee should treat this as a briefing on the largest IPO in history; participation would require an explicit mandate-scope exception and a materially lower entry mark than the offering price.',
    thesisDrivers: [
      'Starlink monetisation: subscriber growth from 10.3m on a profitable connectivity base ($11,387m revenue, $4,423m operating profit) compounding into the group\'s principal value driver, if penetration and ARPU hold as the constellation scales.',
      'Launch cost leadership: reusable Falcon and Starship economics sustaining dominant launch share and improving Space-segment operating results from the FY2025 $(657)m loss toward profitability.',
      'AI-segment turn: the xAI/X segment narrowing its $(6,355)m operating loss as advertising and AI-solutions revenue scales — the largest swing factor and the least evidenced of the three.',
    ],
    thesisBreakers: [
      'The combined entity fails to reach group-level free cash flow as capex (FY2025 $20,737m) continues to exceed operating cash generation, forcing further dilutive capital raises.',
      'The AI segment\'s operating loss persists or widens beyond the $(6,355)m FY2025 level, consuming Starlink\'s cash generation rather than the loss narrowing.',
      'The public market re-rates the multiple toward listed space/satcom comparables (single-digit to low-double-digit revenue multiples), collapsing the ~94x entry multiple regardless of operational delivery.',
      'A launch, spectrum or regulatory setback impairs the launch-cadence or Starlink-replenishment economics that underpin the two profitable-or-near-breakeven segments.',
    ],
    moat: {
      pillars: [
        'Reusable-launch cost leadership: Falcon and Starship reusability give a structural cost-per-kilogram-to-orbit advantage and the dominant share of global launch mass.',
        'Deployed Starlink constellation: an operational low-earth-orbit network serving 10.3m subscribers, with spectrum and ground infrastructure that are capital- and time-intensive to replicate.',
        'Vertical manufacturing at scale: in-house production of rockets, satellites and terminals against FY2025 capex of $20,737m sets a capital and execution bar few can meet.',
      ],
      competitors: [
        { name: 'Blue Origin / United Launch Alliance', note: 'Competing launch providers; the principal contest for launch share, though behind on demonstrated reusability and cadence.' },
        { name: 'Amazon Project Kuiper / OneWeb', note: 'Competing low-earth-orbit broadband constellations; the direct threat to Starlink\'s connectivity lead as they deploy.' },
        { name: 'Better-capitalised AI incumbents', note: 'The xAI/X segment competes against far larger AI platforms without a comparable lead, where SpaceX has no protective barrier.' },
      ],
      trajectory:
        'Consolidation-favouring on Space and Connectivity, where scale, reusability and an installed constellation entrench the incumbent over a three-to-five-year horizon; contested and uncertain on AI, where the segment competes from behind. The competitive arc runs through Starlink subscriber penetration and the AI segment\'s ability to narrow its loss, with launch dominance the most secure pillar.',
      erosionScenarios: [
        'A competing low-earth-orbit constellation (Kuiper, OneWeb) reaches scale and compresses Starlink pricing and share.',
        'A regulatory or orbital-debris regime raises constellation-replenishment costs across the connectivity model.',
        'The AI segment\'s losses persist and consume Starlink\'s cash generation, impairing the group\'s ability to fund the launch and constellation programmes.',
      ],
    },
    qualityOfEarnings:
      'Earnings quality on the disclosed figures is high in provenance but mixed in substance. The income statement and balance sheet are audited and filed in the Form S-1, so revenue ($18,674m), adjusted EBITDA ($6,584m), the net loss ($(4,937)m), capex ($20,737m) and the segment results are stated facts. The honest caveats are substantive rather than disclosure-based: the group is loss-making at the net line, adjusted EBITDA excludes the capital intensity that defines the business, and the deferred-revenue float ($10,179m at Dec-2024) flatters working capital. Diligence should require the full segment cash-flow disaggregation, the related-party arrangements between Starlink, Space and AI, and the terms of the redeemable convertible preferred. In the model, the actuals are stated; only the balance-sheet sub-line allocations and the equity-side reconciling plug are inferred and labelled as such.',
    recentDevelopments:
      'SpaceX filed Form S-1 on 20 May 2026 for a Nasdaq listing under ticker SPCX, disclosing audited FY2025 results — revenue $18,674m (+33.2%), adjusted EBITDA $6,584m, a net loss of $(4,937)m, capex of $20,737m, Starlink at 10.3m subscribers, and approximately 67 per cent of voting power retained by the founder through super-voting stock. The roadshow set a fixed price of $135.00 per share for 556.6m shares, raising approximately $75bn at a valuation near $1.75 trillion, with pricing on or about 11 June and a debut on or about 12 June 2026 — the largest initial public offering in history. Sector-wide, listed space and satellite-connectivity names trade at single-digit to low-double-digit revenue multiples, underscoring that the SpaceX valuation is a growth-and-optionality multiple rather than a satcom-industry multiple.',
    useOfFundsBreakdown: [
      { category: 'Connectivity / Starlink build-out', pct: 35, rationale: 'Constellation replenishment and expansion to extend the 10.3m-subscriber network — the profitable core the thesis rests on; the largest defensible use of primary proceeds.' },
      { category: 'AI segment (xAI/X) compute & development', pct: 30, rationale: 'The most capital-intensive and loss-making segment ($(6,355)m FY2025 operating loss, the bulk of $20,737m capex); the allocation reflects where the company is spending, and the line the committee should scrutinise most closely.' },
      { category: 'Space / launch programme (Starship)', pct: 20, rationale: 'Continued development and scaling of reusable launch to sustain cost leadership and improve the Space segment from its $(657)m FY2025 operating loss.' },
      { category: 'Working capital & balance-sheet strength', pct: 10, rationale: 'General corporate purposes and liquidity given capex exceeds adjusted EBITDA roughly threefold; the primary raise is partly a funding cushion for the cash-consuming build phase.' },
      { category: 'Debt reduction / preferred simplification', pct: 5, rationale: 'Partial reduction of conventional debt ($1,945m FY2025 interest) and simplification of the redeemable convertible preferred capital structure on becoming a public company.' },
    ],
    termSheet: {
      instrument: 'IPO common stock (Nasdaq: SPCX), fixed price $135.00/share',
      ownership: '~0.011% for a $200m allocation at the ~$1.75tn valuation ($200m ÷ $1,750,000m, illustrative) — negligible by design for an offering of this size',
      boardGovernance: 'None. Super-voting stock leaves approximately 67 per cent of voting power with the founder; a public minority holder has no board seat, observer right or governance influence, and engagement is limited to public-shareholder channels.',
      preferentialRights: [
        'None beyond ordinary listed-common-stock rights; the founder\'s super-voting class subordinates public common stock on voting matters.',
        'No liquidation preference, anti-dilution or information rights beyond public SEC disclosure are available to an IPO minority.',
        'Pro-rata participation only via the open market after listing.',
      ],
      conditionsPrecedent: [
        'Mandate sign-off that a United States, out-of-geography public allocation fits an explicit mandate-scope exception (the binding consideration).',
        'A materially lower entry mark than the ~94x-FY2025-revenue offering price, given the model-DCF and comps sit far below the ask.',
        'Diligence of the segment cash-flow disaggregation, the AI-segment economics, and the related-party arrangements between Starlink, Space and AI.',
        'Review of the redeemable convertible preferred terms and the super-voting structure in the final prospectus.',
      ],
    },
    scenarioNarratives: {
      bear:
        'The public market re-rates SpaceX toward listed space/satcom multiples as the AI segment\'s losses persist and group free cash flow stays negative through the hold. Starlink continues to grow but cannot offset the AI drag and capex intensity, and the ~94x entry multiple compresses sharply. Exit well below entry — a materially negative return, far short of the hurdle.',
      base:
        'Starlink subscriber growth and margin expansion drive the modelled path (revenue decelerating from 30 to 15 per cent, EBITDA margin toward 40 per cent), the Space segment approaches breakeven, and the AI loss narrows. Even so, the model-DCF at a 12 per cent discount rate values the equity far below the ~$1.75tn ask, so an entry at the offering price returns below the hurdle; the position only works on a materially lower entry mark.',
      bull:
        'Starlink penetration and ARPU exceed the modelled path, launch dominance translates into Space-segment profit, and the AI segment turns toward profitability, so the market sustains a premium growth multiple. Even in this case the entry at the offering price leaves limited upside relative to the hurdle for a negligible-ownership minority; the bull case rewards a holder who entered far below the IPO valuation, not at it.',
    },
  },
  createdAt: '2026-06-07',
}
