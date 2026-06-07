import type { Deal } from '@/types'

// Authored against AUTHORING.md, then revised after a Director critique pass (CRITIQUE.md).
// Key corrections from that review: (1) the $117m is UAE CORE revenue only — group/consolidated
// revenue is NOT disclosed, so size/growth are labelled UAE-arm, not group; (2) the Jan-2026
// Mubadala raise is $170m (Mubadala $75m + a 2nd UAE SWF $75m + BECO $20m), NOT a 2023 round;
// (3) total EQUITY raised is ~$700m — the prior "$1.18bn" conflated $340m of Ares+Francisco DEBT;
// (4) no formal valuation is disclosed for the 2025/26 rounds — the last public mark is ~$1bn
// (May-2024 Francisco buyback, AGBI); a single secondary source floated ">$2bn" for Sep-2025,
// treated as estimated/unconfirmed, never asserted.
const MUBADALA = 'https://www.mubadala.com/en/news/property-finder-announces-170m-investment-led-by-mubadala-with-uae-sovereign-fund-and-beco-capital'
const ARES = 'https://www.propertyfinder.com/news/property-finder-receives-250-million-financing-from-ares-management-to-accelerate-growth-and-innovation/'
const PERMIRA = 'https://www.generalatlantic.com/media-article/property-finder-announces-525-million-strategic-investment-led-by-permira-reinforcing-the-companys-position-as-a-leading-classified-property-platform-in-the-mena-region-blackstone-provides/'
const NATIONAL_525 = 'https://www.thenationalnews.com/business/property/2025/09/09/dubais-property-finder-raises-525m-from-permira-and-blackstone/'
const FRANCISCO = 'https://www.bloomberg.com/news/articles/2024-05-14/dubai-s-property-finder-raises-90-million-debt-from-francisco-partners'
const AGBI_IPO = 'https://www.agbi.com/real-estate/2024/12/property-finder-likely-to-go-public-says-ceo/'
const GA_2018 = 'https://www.propertyfinder.com/news/dubai-based-real-estate-classifieds-website-property-finder-raises-120-million-at-a-valuation-close-to-500-million/'

export const propertyFinder: Deal = {
  id: 'property-finder',
  name: 'Property Finder',
  oneLiner: 'MENA’s leading property portal — Dubai proptech with disclosed, ~57%-CAGR UAE revenue and 60%+ EBITDA margins',
  sector: 'Technology',
  geography: 'UAE',
  region: 'GCC',
  stage: 'Growth',
  foundedYear: 2007,
  status: 'ready',
  ticketUSDm: 120,
  instrument: 'Equity',
  controlPosture: 'significant-minority',
  ask: {
    // Jan-2026 primary round; no post-money valuation was disclosed. The figure below is an
    // ESTIMATE anchored to the last formal ~$1bn mark (May-24) stepped up by primary inflows —
    // see dataTrust 'Current valuation'. It is not a disclosed number.
    askValuationUSDm: 1700,
    series: 'Growth (Mubadala-led)',
    raisingUSDm: 170,
    date: 'Jan 2026',
    lastRoundUSDm: 525,
    lastRoundDate: 'Sep 2025 (Permira/Blackstone)',
    leadInvestors: ['Mubadala', 'UAE sovereign wealth fund', 'BECO Capital'],
  },
  // Prior rounds only — the Jan-2026 Mubadala-led round is the current ask, not history.
  roundHistory: [
    { series: 'Strategic (Permira/Blackstone; partial GA secondary)', date: 'Sep 2025', raisedUSDm: 525, leadInvestors: ['Permira ($350m)', 'Blackstone Growth'], citation: { source: 'General Atlantic / The National', url: PERMIRA } },
    { series: 'Series B', date: 'Nov 2018', raisedUSDm: 120, postMoneyUSDm: 500, leadInvestors: ['General Atlantic', 'Vostok New Ventures'], citation: { source: 'Company', url: GA_2018 } },
    { series: 'Growth', date: '2016', raisedUSDm: 20, postMoneyUSDm: 200, leadInvestors: ['Vostok New Ventures'], citation: { source: 'AGBI', url: AGBI_IPO } },
  ],
  totalRaisedUSDm: 700, // ~$700m aggregate EQUITY (Mubadala release). Excludes $340m debt (Ares $250m + Francisco $90m).
  currentValuationUSDm: 1700, // ESTIMATED — see dataTrust. Last formal mark ~$1bn (May-24); not disclosed for 2025/26.
  vitals: {
    size: { label: 'UAE core revenue (2024)', value: '$117m', trend: 'up', basis: 'stated', source: 'propertyfinder.com (Ares release)', url: ARES, note: 'UAE core only. Group/consolidated revenue (incl. KSA, wider MENAT) is NOT disclosed — the gap is a diligence item.' },
    growth: { label: 'UAE revenue CAGR 2021–24', value: '~57%', trend: 'up', basis: 'inferred', source: 'propertyfinder.com (Ares release)', url: ARES, note: 'Derived: $30m (2021) → $117m (2024) = ~57% CAGR. 1H25 was $73m. Group revenue CAGR 2020–24 stated at "40%+".' },
    unitEconomics: { label: 'UAE EBITDA margin (1H 2025)', value: '>60%', trend: 'up', basis: 'stated', source: 'propertyfinder.com (Ares release)', url: ARES, note: 'Company-stated UAE EBITDA margin >60% in 1H25 — portal-grade economics. Group margin not disclosed; per-agent ARPU not disclosed (no agent count published).' },
    quality: { label: 'Agent churn / retention', value: 'Not disclosed', basis: 'estimated', note: 'The sector-gating quality KPI (agent retention) is not published. Engagement proxies: ~5.5m monthly active users (Dec-24, AGBI) and ~65% of UAE online real-estate ad spend; UAE listings +27% in 2025.' },
  },
  headlineMetrics: [
    { label: 'UAE core revenue (2024)', value: '$117m', trend: 'up', basis: 'stated', source: 'propertyfinder.com', url: ARES },
    { label: 'UAE revenue (1H 2025)', value: '$73m', trend: 'up', basis: 'stated', source: 'propertyfinder.com', url: ARES },
    { label: 'UAE revenue CAGR 21–24', value: '~57%', trend: 'up', basis: 'inferred', source: '$30m→$117m', url: ARES },
    { label: 'UAE EBITDA margin (1H25)', value: '>60%', trend: 'up', basis: 'stated', source: 'propertyfinder.com', url: ARES },
    { label: 'Monthly active users', value: '~5.5m', basis: 'stated', source: 'AGBI (Dec-24)', url: AGBI_IPO },
    { label: 'Total equity raised', value: '~$700m', basis: 'stated', source: 'Mubadala', url: MUBADALA },
  ],
  news: [
    { date: '2026-01', headline: '$170m primary round led by Mubadala ($75m) with a 2nd UAE SWF ($75m) and BECO Capital ($20m); for product, AI and regional expansion', source: 'Mubadala', url: MUBADALA },
    { date: '2025-10', headline: '$250m debt facility from Ares Credit funds; UAE revenue disclosed: $30m (2021) → $117m (2024), $73m 1H25, UAE EBITDA margin >60%', source: 'propertyfinder.com', url: ARES },
    { date: '2025-09', headline: '$525m strategic investment led by Permira ($350m) with Blackstone Growth; General Atlantic sells part of its 2018 stake, stays significant minority', source: 'General Atlantic / The National', url: NATIONAL_525 },
    { date: '2024-12', headline: 'CEO Lahyani: IPO "likely at some point" but "not actively working on it"; ~5.5m MAU disclosed', source: 'AGBI', url: AGBI_IPO },
    { date: '2024-05', headline: '$90m debt from Francisco Partners to buy back BECO Capital in full (25x return) — implied ~$1bn valuation; BECO re-entered in Jan-26', source: 'Bloomberg', url: FRANCISCO },
  ],
  peers: [
    { name: 'Rightmove', public: true, evRevenue: 11.0, revGrowthPct: 8, ebitdaMarginPct: 70, scaleUSDm: 470, basis: 'stated', rationale: 'UK property portal; mature, ~70% margin — the high-margin/low-growth end and the closest economics analogue for PF’s 60%+ UAE margin.' },
    { name: 'REA Group', public: true, evRevenue: 13.0, revGrowthPct: 18, ebitdaMarginPct: 60, scaleUSDm: 1100, basis: 'stated', rationale: 'Australian portal; the best growth-AND-margin comp and the multiple PF’s bulls underwrite to.' },
    { name: 'Zillow', public: true, evRevenue: 5.5, revGrowthPct: 13, ebitdaMarginPct: 20, scaleUSDm: 2200, basis: 'stated', rationale: 'US portal; lower-margin, broader (mortgages/iBuying) model — anchors the cheap end.' },
    { name: 'CoStar', public: true, evRevenue: 9.0, revGrowthPct: 12, ebitdaMarginPct: 28, scaleUSDm: 2700, basis: 'stated', rationale: 'Real-estate data/marketplace; mid-range multiple on a data-moat story.' },
    { name: 'Emerging Markets Property Group (Bayut/dubizzle)', public: false, evRevenue: 8.0, revGrowthPct: 30, ebitdaMarginPct: 45, scaleUSDm: 150, basis: 'estimated', rationale: 'The direct UAE rival (Bayut/dubizzle). Why it matters: it is the one peer that competes for the same agent wallet — multiple and scale are estimated as both are private.' },
  ],
  assumptions: {
    baseRevenueUSDm: 117,
    revGrowthPct: [40, 34, 29, 24, 19],
    ebitdaMarginPct: [48, 50, 52, 53, 55],
    taxRatePct: 15,
    waccPct: 13,
    terminalGrowthPct: 4,
    netDebtUSDm: 50,
    exitEVRevenue: 10,
    holdYears: 5,
  },
  merit: [
    { key: 'market', label: 'Market opportunity', score: 84, confidence: 'high', rationale: 'Category leader (~65% of UAE online real-estate ad spend) in a market that hit record transaction volume in 2024 (+36% to ~181k deals, AED 522.5bn). Demand and position are established; KSA/MENAT monetisation depth is the open variable.' },
    { key: 'model', label: 'Business model', score: 88, confidence: 'high', rationale: 'Agent subscription/listing marketplace with proven pricing power — UAE EBITDA margin >60% in 1H25 and ~57% UAE revenue CAGR 2021–24. The economics are disclosed and portal-grade, not asserted.' },
    { key: 'financial', label: 'Financial profile', score: 80, confidence: 'medium', rationale: 'Rare disclosed numbers for a private GCC company: UAE $117m (2024), $73m 1H25, >60% margin. But these are UAE-ONLY; consolidated group revenue, the KSA contribution and agent count are undisclosed.', confidenceReason: 'UAE core is disclosed; group revenue, KSA split and per-agent ARPU are not.' },
    { key: 'moat', label: 'Competitive moat', score: 84, confidence: 'high', rationale: 'Two-sided network effects, the data asset (Market Watch) and ~65% UAE ad-share create switching costs. The binding rivalry is Bayut/dubizzle (EMPG) on the same agent wallet, not demand.' },
    { key: 'team', label: 'Team', score: 80, confidence: 'medium', rationale: 'Founder-CEO Michael Lahyani (2007 founder) still leads; deep institutional cap table (Permira, Blackstone, Mubadala, General Atlantic) and PE governance.' },
    { key: 'valuation', label: 'Valuation', score: 64, confidence: 'low', rationale: 'No post-money disclosed for the 2025/26 rounds. Last formal mark ~$1bn (May-24). A single secondary source floated ">$2bn" for Sep-25 (unconfirmed). At an estimated ~$1.7bn the implied EV/UAE-revenue is ~14x — rich vs listed portals unless group revenue is materially above UAE.' },
    { key: 'exit', label: 'Exit pathway', score: 78, confidence: 'medium', rationale: 'IPO is plausible (CEO: "likely at some point") but explicitly "not actively working on it"; deep PE/strategic buyer pool (Permira/Blackstone/GA all classifieds investors). Exit is credible but not underwritten on timing.' },
  ],
  financials: {
    // UAE CORE revenue (the only disclosed series). 2021/2024/1H25 stated; FY22–23 and FY25–26E estimated.
    years: ['FY21', 'FY22', 'FY23', 'FY24', 'FY25E', 'FY26E'],
    revenue: [30, 55, 80, 117, 155, 205],
    ebitda: [9, 18, 32, 55, 78, 108],
  },
  // Full driver-based 3-statement model. Demonstrates the engine's statement projection on an
  // asset-light, high-margin classifieds portal — where an unlevered-FCF DCF is the right tool
  // (unlike a balance-sheet lender). Top-line revenue/EBITDA tie to the disclosed UAE figures
  // (FY23 $80m/$32m, FY24 $117m/$55m); the full balance-sheet construction is INFERRED/illustrative
  // (no group BS is public) and balances by construction. Forecast drivers mirror `assumptions`.
  model: {
    basis: 'inferred',
    note: 'UAE-core P&L top line (revenue, EBITDA) is disclosed; the balance-sheet build is inferred (no public group statements) and labelled accordingly. Forecast drivers mirror the headline assumptions.',
    sources: [{ source: 'propertyfinder.com (Ares release)', url: ARES }],
    years: [
      { label: 'FY23', actual: true },
      { label: 'FY24', actual: true },
      { label: 'FY25', actual: false },
      { label: 'FY26', actual: false },
      { label: 'FY27', actual: false },
      { label: 'FY28', actual: false },
      { label: 'FY29', actual: false },
    ],
    pnl: [
      { revenue: 80, cogs: 12, otherIncome: 0, opex: 36, dna: 4, financeIncome: 1, financeCosts: 4, tax: 4 },
      { revenue: 117, cogs: 18, otherIncome: 0, opex: 44, dna: 5, financeIncome: 1, financeCosts: 4, tax: 7 },
    ],
    bs: [
      { ppe: 12, intangibles: 140, otherNonCurrentAssets: 14, inventory: 0, receivables: 17, otherCurrentAssets: 12, cash: 55, longTermDebt: 95, shortTermDebt: 25, leases: 7, otherNonCurrentLiab: 10, payables: 16, otherCurrentLiab: 14, shareCapital: 300, retainedEarnings: -229, reserves: 12, nci: 0 },
      { ppe: 14, intangibles: 150, otherNonCurrentAssets: 16, inventory: 0, receivables: 24, otherCurrentAssets: 16, cash: 80, longTermDebt: 100, shortTermDebt: 30, leases: 8, otherNonCurrentLiab: 12, payables: 22, otherCurrentLiab: 18, shareCapital: 300, retainedEarnings: -202, reserves: 12, nci: 0 },
    ],
    drivers: {
      revenueGrowthPct: [40, 34, 29, 24, 19],
      grossMarginPct: [85, 85, 86, 86, 87],
      opexPctRev: [37, 35, 34, 32.5, 32],
      dnaPctRev: [4, 3.5, 3, 3, 2.5],
      capexPctRev: [4, 3.5, 3, 3, 2.5],
      receivablesPctRev: [20, 20, 20, 20, 20],
      payablesPctRev: [18, 18, 18, 18, 18],
      taxRatePct: [15, 15, 15, 15, 15],
      interestRatePct: [4, 4, 4, 4, 4],
      debtRepayment: [10, 15, 20, 20, 25],
      dividends: [0, 0, 0, 0, 0],
    },
    valuation: {
      waccPct: 13,
      terminalGrowthPct: 4,
      longRunTaxPct: 15,
      midYear: true,
      terminalMethod: 'gordon',
      associates: 0,
    },
  },
  capTable: [
    { holder: 'Founder (Michael Lahyani) & management', pct: 14, type: 'founder' },
    { holder: 'Permira & Blackstone', pct: 38, type: 'investor' },
    { holder: 'General Atlantic, Mubadala, UAE SWF & earlier', pct: 38, type: 'investor' },
    { holder: 'Employee option pool', pct: 10, type: 'esop' },
  ],
  dataTrust: {
    fields: [
      { label: 'UAE revenue ($117m 2024, $73m 1H25) & EBITDA margin >60%', basis: 'stated', confidence: 'high', source: 'propertyfinder.com (Ares release)', url: ARES },
      { label: 'UAE revenue CAGR ~57% (2021–24)', basis: 'inferred', confidence: 'high', method: 'Derived from stated $30m (2021) → $117m (2024): (117/30)^(1/3)−1 ≈ 57%. Group CAGR stated separately as "40%+".', url: ARES },
      { label: 'Funding rounds (Jan-26 $170m, Sep-25 $525m, 2018 $120m)', basis: 'stated', confidence: 'high', source: 'Mubadala / General Atlantic / Company', url: MUBADALA },
      { label: 'Total equity raised ~$700m', basis: 'stated', confidence: 'high', source: 'Mubadala release', url: MUBADALA, method: 'Aggregate equity per the release; excludes $340m debt (Ares $250m + Francisco $90m).' },
      { label: 'Current valuation (~$1.7bn estimate)', basis: 'estimated', confidence: 'low', method: 'No post-money disclosed for Sep-25 or Jan-26. Last formal mark ~$1bn (May-24 Francisco buyback, AGBI); stepped up by ~$700m primary inflow since. A single secondary source floated ">$2bn" for Sep-25 — unconfirmed, not relied on.', url: AGBI_IPO },
      { label: 'Group / consolidated revenue & KSA split', basis: 'estimated', confidence: 'low', method: 'Not disclosed. Only UAE-core is published; KSA and wider-MENAT contribution unknown.' },
      { label: 'Agent count / per-agent ARPU / agent churn', basis: 'estimated', confidence: 'low', method: 'Not disclosed. ARPU and the quality KPI (agent retention) cannot be computed; ~5.5m MAU and ~65% UAE ad-share are the only public proxies.' },
      { label: 'Peer multiples', basis: 'stated', confidence: 'high', source: 'public portal comps (Rightmove, REA, Zillow, CoStar)' },
    ],
  },
  shariaScreen: {
    status: 'compliant',
    note: 'Asset-light digital classifieds marketplace earning subscription, listing and advertising fees, with no interest-based lending or prohibited-activity exposure; the funding layer is equity plus conventional bank/credit debt, which sits outside the operating model rather than within it.',
    source: 'Reasoning from the disclosed revenue model (Ares release); no formal Shariah board or certification has been published.',
    url: ARES,
  },
  narrative: {
    whyNow:
      'The deal surfaces on the January 2026 $170m primary round led by Mubadala, alongside a second UAE sovereign fund and the re-entry of BECO Capital, raised for product, artificial-intelligence and KSA/MENAT expansion within twelve months of the September 2025 Permira and Blackstone investment.',
    barriers: [
      { axis: 'Marketplace liquidity / network effects', rating: 'high', note: 'Two-sided agent-and-buyer liquidity with approximately 5.5m monthly active users (December 2024) and roughly 65% of UAE online real-estate advertising spend; a new entrant must assemble both sides simultaneously to compete for the same agent wallet.' },
      { axis: 'Data asset', rating: 'medium', note: 'The Market Watch listings-and-pricing dataset, accumulated since 2007, underpins lead and analytics products that a new portal cannot replicate without comparable historical depth.' },
      { axis: 'Brand and category leadership', rating: 'medium', note: 'Entrenched leadership in the UAE drives organic search and direct-traffic share, lowering customer-acquisition cost relative to a challenger that must buy demand.' },
      { axis: 'Capital and sponsor depth', rating: 'medium', note: 'Approximately $700m of equity raised, with Permira, Blackstone, Mubadala and a second UAE sovereign fund on the cap table, funds product and KSA expansion at a scale a sub-scale rival would struggle to match.' },
    ],
    profile:
      'Property Finder is a Dubai-headquartered property portal founded by Michael Lahyani in 2007, operating the leading real-estate classifieds marketplace in the UAE and across Saudi Arabia and the wider MENAT region. Agents and brokerages pay subscriptions and per-listing/credit fees to advertise to ~5.5m monthly users; the company also sells advertising, data (Market Watch) and value-added agent tools. Its UAE core did $117m revenue in 2024 (up from $30m in 2021, ~57% CAGR) at a >60% EBITDA margin in 1H25. Consolidated group revenue is not separately disclosed.',
    revenueModel: 'Agent/broker subscriptions and per-listing credit packages — the core engine — plus developer advertising, premium listing placement, and data/lead products. UAE core is high-margin (>60% EBITDA, 1H25); the group blend is undisclosed.',
    revenueLines: [
      { name: 'Agent & brokerage subscriptions', sharePct: 60, basis: 'estimated', description: 'Recurring tiered subscriptions for agents/brokerages to list and access the platform — the portal’s annuity base. PF does not publish the line split or agent count; share is estimated from the portal model.' },
      { name: 'Listing credits / pay-per-listing', sharePct: 18, basis: 'estimated', description: 'Per-listing credit packs and featured/premium placement upsell on top of subscriptions; the main volume lever in a rising-listings market (UAE listings +27% in 2025).' },
      { name: 'Developer advertising & new-homes', sharePct: 12, basis: 'estimated', description: 'Display/branded advertising and new-development showcases sold to property developers — cyclical with the off-plan market.' },
      { name: 'Data, leads & SaaS tools', sharePct: 7, basis: 'estimated', description: 'Market Watch data, lead-gen and CRM-style agent tools — the stickiest, highest-margin layer; nascent as a standalone line.' },
      { name: 'KSA / wider MENAT', sharePct: 3, basis: 'estimated', description: 'Saudi and other-market revenue, the stated expansion priority for the 2025/26 capital. Contribution is undisclosed and assumed small relative to the UAE core.' },
    ],
    marketRead:
      'The principal uncertainty is geography mix, KSA traction and price, not demand: the UAE recorded record transaction volume in 2024 (~181k deals, +36%; AED 522.5bn) and PF holds ~65% of UAE online real-estate ad spend. The material questions are (1) what the GROUP economics look like versus the disclosed UAE core, (2) whether KSA monetises against Bayut/dubizzle (EMPG) before the UAE property cycle turns, and (3) the entry price, since no recent valuation is disclosed. The moat is established; the unknowns are geography mix, KSA traction and price.',
    regulatory: 'Standard digital-marketplace / classifieds regulation in the UAE and KSA; no special licensing or sanctions exposure identified. Conventional, well-governed entity under institutional PE ownership.',
    caseFor: [
      'Disclosed, portal-grade economics: UAE core revenue $117m (2024) up from $30m (2021) — ~57% CAGR — at a >60% EBITDA margin in 1H25 ($73m). These are stated, not inferred — rare for a private GCC company.',
      'Entrenched category leadership: ~65% of UAE online real-estate ad spend and ~5.5m MAU give two-sided network effects and pricing power; the only true rival is Bayut/dubizzle (EMPG) on the same agent wallet.',
      'Sovereign and top-tier PE validation in <12 months: $525m (Permira/Blackstone, Sep-25) then $170m (Mubadala + a 2nd UAE SWF + BECO, Jan-26) — and BECO chose to re-enter after exiting at 25x in 2024, a real insider signal.',
    ],
    caseAgainst: [
      'The headline numbers are UAE-ONLY: the $117m / >60% margin are the UAE core, not the group. Consolidated revenue, the KSA contribution and any KSA losses are undisclosed — a "MENA leader" deal underwritten on one market’s P&L.',
      'No disclosed entry price: the last formal mark is ~$1bn (May-24); the 2025/26 rounds carry no public post-money. At an estimated ~$1.7bn that is ~14x UAE revenue — and the only ">$2bn" figure is a single unconfirmed secondary source. The deal cannot be marked honestly without group revenue.',
      'Cycle and ARPU opacity: revenue tracks the Dubai property cycle (off-plan/developer ad spend is pro-cyclical), and with no agent count or churn published, ARPU durability and agent retention — the portal’s real quality KPIs — are unverifiable.',
    ],
    leadership: [
      { name: 'Michael Lahyani', role: 'Founder & CEO', note: 'Founded Property Finder in 2007; still leads. Long-tenured founder through multiple PE rounds.' },
      { name: 'Permira / Blackstone / Mubadala', role: 'Lead investors', note: 'Institutional PE/sovereign governance; classifieds pedigree (Adevinta).' },
    ],
    leadershipGaps: 'Founder-led with institutional board; a named CFO and group-level (not UAE-only) audited reporting are the diligence items, plus a dedicated KSA P&L owner given the expansion mandate.',
    legalStanding: 'No adverse media or sanctions exposure identified; conventional classifieds business under PE/sovereign ownership with standard UAE/KSA digital-marketplace regulation.',
    valuationVerdict:
      'A high-quality, disclosed-economics portal — but priced on numbers the seller has not fully shown. UAE core is substantiated (~57% CAGR, >60% margin); the group P&L, KSA mix and the actual round valuation are not disclosed. At an estimated ~$1.7bn (~14x UAE revenue) the quality justifies a premium, but the price can only be defended once group revenue and the round post-money are in the data room.',
    limitations: [
      'Group/consolidated revenue and KSA split are not disclosed; all hard financials are UAE-core only.',
      'No post-money disclosed for the Sep-25 or Jan-26 rounds; current valuation is estimated (anchored to the ~$1bn May-24 mark).',
      'Agent count, per-agent ARPU and agent churn/retention are not published; revenue-line split is estimated.',
    ],
    icThesis:
      'Own the entrenched, profitable category leader in GCC property classifieds at a disciplined entry, compounding the UAE core (~57% historical, >60% margin) while KSA scales — but only after seeing group revenue, the KSA P&L and the actual round post-money, and only at a price defensible on group (not UAE-only) economics.',
    useOfFunds: 'Per the Jan-26 release: product development, AI tools and regional (KSA/MENAT) expansion. The 2024 Francisco facility funded a BECO share buyback (liquidity), not growth — so distinguish primary growth capital from prior secondary/buyback uses.',
    proposedTerms: [
      { label: 'Instrument', value: 'Growth equity (primary)' },
      { label: 'Ownership', value: '~7% at the estimated ~$1.7bn mark (subject to disclosed post-money)' },
      { label: 'Protections', value: 'Information rights, pro-rata, board seat' },
      { label: 'Governance', value: 'One board seat alongside Permira/Blackstone/Mubadala' },
      { label: 'Conditions to close', value: 'Group (consolidated) audited financials, KSA P&L, the actual round post-money, agent count/churn data' },
    ],
    riskRegister: [
      { risk: 'UAE-only disclosure', severity: 'high', likelihood: 'high', impact: 'Deal underwritten on UAE core ($117m); group economics and KSA losses unknown', mitigation: 'Gate close on consolidated audited financials and a KSA P&L', monitoring: 'Quarterly group vs UAE revenue split' },
      { risk: 'Undisclosed entry price', severity: 'high', likelihood: 'high', impact: 'No public post-money; ~14x UAE revenue if ~$1.7bn — cannot mark honestly', mitigation: 'Obtain the round post-money; price to group economics', monitoring: 'Re-run returns at the confirmed entry' },
      { risk: 'Dubai property-cycle sensitivity', severity: 'medium', likelihood: 'medium', impact: 'Developer/off-plan ad spend and listing volume are pro-cyclical', mitigation: 'Subscription annuity base, data products, KSA diversification', monitoring: 'Listings volume, developer ad mix, DLD transaction data' },
      { risk: 'Bayut/dubizzle competition', severity: 'medium', likelihood: 'medium', impact: 'EMPG competes for the same agent wallet, pressuring ARPU', mitigation: 'Product/data differentiation, agent lock-in', monitoring: 'Agent churn, ad-share trend' },
      { risk: 'ARPU/retention opacity', severity: 'medium', likelihood: 'high', impact: 'No agent count or churn published; quality KPI unverifiable', mitigation: 'Diligence agent cohort retention and ARPU', monitoring: 'Agent count, churn, net revenue retention' },
    ],
    recommendationSummary:
      'Review — a profitable, category-leading portal with disclosed UAE economics (~57% CAGR, >60% margin) and substantial sovereign/PE validation, but underwritten on UAE-only numbers with no disclosed round valuation. Resolve group financials, the KSA P&L and the actual post-money before pricing; on group economics this can move to proceed.',
    scenarioNarratives: {
      bear: 'UAE share plateaus as Bayut/dubizzle competes harder on agent wallet; KSA monetisation slips. Growth fades to the high teens, margins hold but do not expand. Exit at a de-rated ~7x revenue — below the entry mark.',
      base: 'PF compounds UAE ~25% and converts the KSA build into disclosed revenue; margins scale past 50%. IPO or PE secondary around an REA-like multiple inside the hold.',
      bull: 'Group revenue proves materially above UAE-only, KSA becomes a second core market, and the data moat lifts ARPU. A premium listed-portal re-rate (REA ~13x) on a much larger base.',
    },
  },
  createdAt: '2026-05-10',
}
