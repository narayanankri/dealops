import type { Deal } from '@/types'

// Authored against AUTHORING.md, then revised after a Director critique pass (CRITIQUE.md).
// Real company. Models a "good business, but the data is old and the return doesn't clear" outcome.
// Key corrections from the review:
//   (1) Every CURRENT business vital — revenue, GMV, orders, margin, repeat rate — is genuinely
//       undisclosed. The last hard operating datum (50m stems delivered) is from 2022. Said plainly,
//       not papered over with a confident "~$120m revenue".
//   (2) The widely-scraped figures ("~$85 AOV", "~$9m 2024 sales", "$936m valuation", "$150m
//       revenue", "acquired by Talabat") are aggregator/canvas-site fabrications that do NOT verify
//       on any primary source — explicitly rejected, not used.
//   (3) Co-founder corrected to Mohammed Al Arifi (the prior "Taiba Al-Humaidhi" was wrong).
//   (4) The stale capital signal is surfaced as the lead negative: last round Feb-2023 (>3 yrs),
//       an IPO tapped to Goldman/HSBC for "as soon as 2024" that has not happened by mid-2026.
//   (5) The Series-C valuation was NOT disclosed ("approaching unicorn", up ~3.8x); the mark is
//       estimated with method, never stated as a hard number.
const WAMDA_C = 'https://www.wamda.com/2023/02/floward-raises-156-million-pre-ipo-series-c-round'
const WAMDA_B = 'https://www.wamda.com/2021/06/floward-raises-27-5-million-series-b'
const NATIONAL = 'https://www.thenationalnews.com/business/start-ups/2023/04/17/generation-start-up-how-floward-aims-to-transform-mena-flower-and-gifting-industry/'
const BBG_IPO = 'https://www.bloomberg.com/news/articles/2023-11-22/e-commerce-firm-floward-said-to-tap-goldman-hsbc-for-saudi-ipo'
const MKT = 'https://www.cognitivemarketresearch.com/regional-analysis/middle-east-and-africa-floral-gifting-market-report'

export const floward: Deal = {
  id: 'floward',
  name: 'Floward',
  oneLiner: 'GCC online flowers & gifting leader, pre-IPO — same-day delivery across MENA and the UK, but no fresh data since 2023',
  sector: 'Consumer',
  geography: 'Saudi Arabia',
  region: 'GCC',
  stage: 'Pre-IPO',
  foundedYear: 2017,
  status: 'ready',
  ticketUSDm: 90,
  instrument: 'Equity',
  controlPosture: 'significant-minority',
  ask: {
    askValuationUSDm: 700,
    series: 'Late primary (pre-IPO)',
    lastRoundUSDm: 156,
    lastRoundDate: 'Feb 2023 (pre-IPO Series C)',
    leadInvestors: ['Aljazira Capital', 'Rainwater Partners', 'STV'],
  },
  roundHistory: [
    { series: 'Series C (pre-IPO)', date: 'Feb 2023', raisedUSDm: 156, leadInvestors: ['Aljazira Capital', 'Rainwater Partners', 'STV'], citation: { source: 'Wamda', url: WAMDA_C } },
    { series: 'Series B', date: 'Jun 2021', raisedUSDm: 27.5, leadInvestors: ['STV', 'Impact46'], citation: { source: 'Wamda', url: WAMDA_B } },
    { series: 'Earlier rounds (Seed–Series A)', date: '2017–2020', raisedUSDm: 6.7, leadInvestors: ['Impact46'], citation: { source: 'Wamda', url: WAMDA_C } },
  ],
  totalRaisedUSDm: 190,
  currentValuationUSDm: 700,
  vitals: {
    size: {
      label: 'Revenue / GMV / annual orders',
      value: 'Not disclosed (last op. datum: 50m stems, 2022)',
      basis: 'estimated',
      source: 'The National',
      url: NATIONAL,
      note: 'No revenue, GMV or annual-order figure has ever been published. The only hard scale markers are stale and non-financial: 50m flower stems delivered in 2022, ~1m users and 21 fulfilment centres (Apr-2023). Aggregator "~$9m 2024 sales" / "~$150m revenue" figures do not verify on any primary source and are rejected.',
    },
    growth: {
      label: 'Revenue & order YoY',
      value: 'Not disclosed since 2021',
      basis: 'estimated',
      source: 'Wamda',
      url: WAMDA_B,
      note: 'The last growth datum is from the 2021 Series B: "10x growth in 2020" and "first-100-days-2021 revenue surpassed full-year 2020" — company-stated, COVID-era, and now 5 years old. Nothing on 2022–2025 trajectory is public; a stalled IPO is the only recent signal and it points sideways, not up.',
    },
    unitEconomics: {
      label: 'AOV · contribution / order',
      value: 'Not disclosed',
      basis: 'estimated',
      note: 'Fresh-flower commerce is structurally thin: high spoilage (stems perish in ~10 days) against owned same-day last-mile. Per-order contribution, basket margin and AOV are not public. The "~$85 AOV" figure circulating on canvas sites is unsourced and not used.',
    },
    quality: {
      label: 'Repeat rate / occasion frequency',
      value: 'Not disclosed',
      basis: 'estimated',
      note: 'Gifting is occasion-driven (a structurally low natural frequency vs grocery/food), so repeat rate is the swing variable — and it is unpublished. ~1m cumulative users (2023) says nothing about active or repeat behaviour.',
    },
  },
  headlineMetrics: [
    { label: 'Series C raised', value: '$156m (Feb 2023)', basis: 'stated', source: 'Wamda', url: WAMDA_C },
    { label: 'Total raised', value: '~$190m', basis: 'stated', source: 'Wamda', url: WAMDA_C },
    { label: 'Footprint', value: '36 cities / 9 countries + UK', basis: 'stated', source: 'Wamda', url: WAMDA_C },
    { label: 'Stems delivered (2022)', value: '50m', basis: 'stated', source: 'Wamda', url: WAMDA_C },
    { label: 'Brand partners', value: '400+', basis: 'stated', source: 'Wamda', url: WAMDA_C },
    { label: 'Current revenue / GMV', value: 'Not disclosed', basis: 'estimated' },
  ],
  news: [
    { date: 'Feb 2023', headline: '$156m pre-IPO Series C (Aljazira Capital, Rainwater Partners, STV); valuation not disclosed — CEO cites ~3.8x the prior round, "approaching unicorn"', source: 'Wamda', url: WAMDA_C },
    { date: 'Apr 2023', headline: 'CEO: aims to list "next year" (2024) on a regional exchange; 50m stems delivered 2022, ~1m users, 21 fulfilment centres', source: 'The National', url: NATIONAL },
    { date: 'Nov 2023', headline: 'Taps Goldman Sachs & HSBC for a Saudi IPO, potentially "as soon as 2024" — size/timing under discussion', source: 'Bloomberg', url: BBG_IPO },
    { date: '2024–2026', headline: 'No IPO completed and no fresh round disclosed — the listing has slipped >2 years past the stated 2024 target; capital signal is now >3 years stale', source: 'Inferred (absence of any primary disclosure)' },
  ],
  peers: [
    { name: '1-800-Flowers', public: true, evRevenue: 0.6, revGrowthPct: 2, ebitdaMarginPct: 7, scaleUSDm: 1900, basis: 'stated', rationale: 'Listed flowers/gifting; the most direct read-across — and a low-multiple, low-growth one' },
    { name: 'Deliveroo', public: true, evRevenue: 1.2, revGrowthPct: 10, ebitdaMarginPct: 3, scaleUSDm: 2300, basis: 'stated', rationale: 'Owned same-day last-mile logistics comp; thin-margin delivery economics' },
    { name: 'Jahez', public: true, evRevenue: 2.0, revGrowthPct: 30, ebitdaMarginPct: 12, scaleUSDm: 900, basis: 'stated', rationale: 'Listed Saudi delivery; best regional consumer comp for a Tadawul exit multiple' },
    { name: 'Talabat', public: true, evRevenue: 4.5, revGrowthPct: 20, ebitdaMarginPct: 25, scaleUSDm: 3000, basis: 'stated', rationale: 'MENA delivery scale leader; high-end anchor (a richer, more profitable platform than Floward)' },
  ],
  assumptions: {
    baseRevenueUSDm: 120,
    revGrowthPct: [25, 22, 18, 15, 12],
    ebitdaMarginPct: [5, 7, 9, 11, 13],
    taxRatePct: 15,
    waccPct: 14,
    terminalGrowthPct: 3,
    netDebtUSDm: 0,
    exitEVRevenue: 2.5,
    holdYears: 4,
  },
  merit: [
    { key: 'market', label: 'Market opportunity', score: 68, confidence: 'medium', rationale: 'Real GCC occasions/gifting demand — the broader Middle East floral-gifting market is ~$1.5bn (2025, third-party). Solid, premiumising, but an occasion-driven category with modest natural frequency, not an explosive one.' },
    { key: 'model', label: 'Business model', score: 64, confidence: 'medium', rationale: 'Vertically-integrated flowers/gifting with owned same-day last-mile and a perfumery (Mubkhar) bolt-on. Structurally thin: high-spoilage perishables (10-day shelf life) against fixed fulfilment cost. The GaaS/corporate-gifting pivot is the margin lever, but it is unproven and unquantified.' },
    { key: 'financial', label: 'Financial profile', score: 50, confidence: 'low', rationale: 'Reached real scale once (50m stems, 2022) and claimed strong COVID-era growth (2020–21) — but NO current revenue, GMV, margin or trajectory is disclosed, and the company has been profitable per management claims that cannot be verified.', confidenceReason: 'Every current operating figure is undisclosed; the newest hard datum is from 2022 and the newest growth datum from 2021.' },
    { key: 'moat', label: 'Competitive moat', score: 58, confidence: 'medium', rationale: 'Brand and a built same-day network across 36 cities give a real head-start in occasions, but flowers/gifting has low switching costs and easy local substitution; the moat is execution and brand, not lock-in.' },
    { key: 'team', label: 'Team', score: 74, confidence: 'medium', rationale: 'Founder-led by Abdulaziz Al Loughani (ex-investor/operator) and co-founder Mohammed Al Arifi; strong regional cap table (STV, Aljazira, Impact46).' },
    { key: 'valuation', label: 'Valuation', score: 48, confidence: 'low', rationale: 'No disclosed mark. The $700m ask is anchored to a ~3.8x-since-Series-B "approaching unicorn" claim from Feb-2023 — a >3-year-stale, never-confirmed number, on a thin-margin model.' },
    { key: 'exit', label: 'Exit pathway', score: 60, confidence: 'low', rationale: 'A Saudi IPO is the stated route (Goldman/HSBC engaged), but it has slipped >2 years past the "2024" target with no relisting signal; consumer-ecommerce listing multiples are modest regardless.' },
  ],
  financials: {
    years: ['FY22', 'FY23', 'FY24E', 'FY25E', 'FY26E'],
    revenue: [78, 98, 120, 150, 183],
    ebitda: [2, 5, 6, 11, 16],
  },
  capTable: [
    { holder: 'Founders & management', pct: 22, type: 'founder' },
    { holder: 'Aljazira Capital, Rainwater & STV', pct: 40, type: 'investor' },
    { holder: 'Impact46 & earlier', pct: 26, type: 'investor' },
    { holder: 'Employee option pool', pct: 12, type: 'esop' },
  ],
  dataTrust: {
    fields: [
      { label: 'Series C ($156m, Feb 2023, Aljazira/Rainwater/STV)', basis: 'stated', confidence: 'high', source: 'Wamda', url: WAMDA_C },
      { label: 'Series B ($27.5m, Jun 2021, STV/Impact46)', basis: 'stated', confidence: 'high', source: 'Wamda', url: WAMDA_B },
      { label: 'Total raised (~$190m)', basis: 'stated', confidence: 'high', source: 'Wamda', url: WAMDA_C },
      { label: 'Footprint, 50m stems (2022), 400+ partners, ~1m users', basis: 'stated', confidence: 'medium', source: 'Wamda / The National', url: NATIONAL, method: 'Company-reported via press; the operating markers are 2022–2023 vintage and not refreshed.' },
      { label: 'IPO intent (Goldman/HSBC, "as soon as 2024")', basis: 'stated', confidence: 'medium', source: 'Bloomberg', url: BBG_IPO, method: 'Reported Nov-2023; no completion since — the slippage itself is the signal.' },
      { label: 'Current valuation ($700m)', basis: 'estimated', confidence: 'low', method: 'No post-money disclosed for any round. Anchored to the Feb-2023 "~3.8x prior round / approaching unicorn" claim; the scraped "$936m" is an aggregator figure with no primary source and is not used.' },
      { label: 'Revenue, GMV, margins, AOV, repeat rate', basis: 'estimated', confidence: 'low', method: 'Never disclosed. The financials shown are an explicitly-illustrative ramp (anchored loosely to the 2022 scale + market size), NOT company figures. Canvas-site "$9m 2024 sales" / "$85 AOV" rejected as unverified.' },
      { label: 'Market size (~$1.5bn ME floral-gifting, 2025)', basis: 'stated', confidence: 'low', source: 'Cognitive Market Research', url: MKT, method: 'Third-party research estimate, not a primary regulator/filing figure; directional only.' },
    ],
  },
  shariaScreen: {
    status: 'compliant',
    note: 'First-party retail of flowers, gifts and fragrance with owned delivery involves no interest income or prohibited-activity exposure; the company has raised equity rather than conventional debt, leaving the funding layer free of riba.',
    source: 'Reasoning from the disclosed equity-only funding history (Wamda); no formal Shariah certification has been published.',
    url: WAMDA_C,
  },
  narrative: {
    whyNow:
      'The deal surfaces on the stalled pre-IPO process: a Saudi listing tapped to Goldman Sachs and HSBC in November 2023 for "as soon as 2024" has not completed by mid-2026, leaving the February 2023 $156m Series C as the last capital event more than three years old.',
    barriers: [
      { axis: 'Owned same-day fulfilment network', rating: 'medium', note: 'A built last-mile network of 21 fulfilment centres across 36 cities in nine countries plus the UK is costly and slow to replicate, though it is replicable by a well-funded entrant.' },
      { axis: 'Brand and occasion trust', rating: 'medium', note: 'Established regional brand leadership in gifting drives repeat occasions and 400+ brand partnerships, but switching costs for a one-off gifting purchase are inherently low.' },
      { axis: 'Cold-chain and sourcing', rating: 'medium', note: 'Managing fresh-flower sourcing and approximately ten-day spoilage across a same-day footprint requires cold-chain and procurement capability that a generalist retailer lacks.' },
      { axis: 'Supply concentration / category breadth', rating: 'low', note: 'Flowers and gifting face easy local substitution by florists and other e-commerce, so the category itself offers little structural protection.' },
    ],
    profile:
      'Floward is a Riyadh-headquartered online flowers and gifting company, founded in 2017 by Abdulaziz Al Loughani and Mohammed Al Arifi, running owned same-day fulfilment across 36 cities in nine MENA countries plus the UK. It vertically integrates sourcing, arrangement and last-mile delivery, layering gifts and a 2022-acquired perfumery brand (Mubkhar) on top of fresh flowers. It raised a $156m pre-IPO Series C in Feb 2023 (total ~$190m) and has signalled a Saudi IPO. Crucially, no current revenue, GMV, order count, margin or repeat-rate figure is public — the last hard operating datum (50m stems) is from 2022.',
    revenueModel: 'First-party online commerce: order value (flowers + gifts + perfumery) less cost of goods, spoilage and owned last-mile delivery cost, plus delivery/service fees and a nascent B2B corporate-gifting / subscription line. Line-level shares are modelled, not disclosed.',
    revenueLines: [
      { name: 'Fresh-flower basket margin', sharePct: 55, basis: 'estimated', description: 'Buy-sell spread on own-sourced, own-delivered flower arrangements — the core line and the margin problem (10-day spoilage + same-day last-mile). Share is a vertical-commerce estimate, not disclosed.' },
      { name: 'Gifts & add-ons', sharePct: 22, basis: 'estimated', description: 'Higher-margin non-perishables bundled with flowers (chocolates, cakes, branded gifts) — the basket-economics lever; margin and mix undisclosed.' },
      { name: 'Perfumery (Mubkhar)', sharePct: 10, basis: 'estimated', description: 'Fragrance brand acquired Nov-2022; a non-perishable, higher-margin vertical, but standalone contribution is not broken out.' },
      { name: 'Delivery & service fees', sharePct: 8, basis: 'estimated', description: 'Per-order same-day delivery/service charge; in fresh-flower last-mile this rarely covers true fulfilment cost.' },
      { name: 'B2B corporate gifting / subscription', sharePct: 5, basis: 'estimated', description: 'The "Gifting-as-a-Service" / recurring-revenue pivot management has flagged — nascent, unquantified, and the main upside-case lever.' },
    ],
    marketRead:
      'Demand is established and is not the principal uncertainty: the broader Middle East floral-gifting market is ~$1.5bn (2025, third-party) and premiumising, and Floward is the regional brand leader. The material questions are (1) whether each order makes money after spoilage and same-day last-mile, (2) whether the business is still growing — nothing on 2022–2025 trajectory is public — and (3) whether the corporate-gifting/GaaS pivot can lift a structurally thin category margin before an IPO. Occasion-driven gifting has modest natural frequency, so repeat rate (undisclosed) is the swing variable.',
    regulatory: 'Standard e-commerce/consumer regulation across its markets; no special regulatory exposure. A Tadawul listing would bring CMA disclosure requirements — which is itself why the absence of any public financial is notable for a company that has been "pre-IPO" since 2023.',
    caseFor: [
      'Established regional brand leadership with a built, owned same-day network across 36 cities — 50m stems delivered in 2022 and 400+ brand partners demonstrate real operating scale, not a deck.',
      'A real, premiumising category (~$1.5bn ME floral-gifting, 2025) plus an asset-light margin lever in B2B corporate gifting / GaaS and the higher-margin gifts/perfumery mix.',
      'Founder-led with a strong regional cap table (STV, Aljazira, Impact46) and a stated Saudi-IPO path with bulge-bracket advisers engaged.',
    ],
    caseAgainst: [
      'Stale capital and a slipped IPO: the last round was Feb-2023 (>3 years ago) and the Goldman/HSBC-advised listing targeted for "as soon as 2024" has not happened by mid-2026 — the clearest signal that something (growth, margin, or market window) is not where it needs to be.',
      'A black box on every current vital: no revenue, GMV, order count, contribution margin, AOV or repeat rate is disclosed — the newest hard datum is from 2022 — so size, growth and unit economics cannot be underwritten, only guessed.',
      'Structurally thin, low-lock-in category, and the price sits above every comp: high-spoilage fresh flowers plus owned same-day last-mile cap the margin and switching costs are minimal — yet the $700m anchor is ~5.8x EV/revenue on the illustrative ~$120m, richer than the entire peer set (Talabat ~4.5x at the top, down to ~0.6x) and well above the stale, never-confirmed 2023 "~3.8x" claim. No modelled scenario clears the 22% hurdle.',
    ],
    leadership: [
      { name: 'Abdulaziz Al Loughani', role: 'Co-founder & CEO', note: 'Kuwaiti operator/investor; long regional e-commerce track record' },
      { name: 'Mohammed Al Arifi', role: 'Co-founder' },
    ],
    leadershipGaps: 'Founder-led with strong backing; the binding gap is not the team but disclosure — for a company "pre-IPO" since 2023, the absence of any audited revenue, margin or growth figure is the diligence wall.',
    legalStanding: 'No adverse media or sanctions exposure; conventional consumer-commerce entity. The open item is corporate-readiness for a Tadawul listing (governance, audited accounts), which has not surfaced publicly.',
    valuationVerdict:
      'A sound operating business — but priced off a >3-year-stale, never-disclosed "approaching unicorn" mark, with every current vital undisclosed and an IPO that has slipped two years. Even granting the illustrative ~$120m revenue, $700m is ~5.8x EV/revenue — above every listed comp (Talabat ~4.5x at the top) on a thinner-margin model — and no scenario clears the 22% hurdle. A "good company, stale data, wrong price" case.',
    limitations: [
      'No current revenue, GMV, margin, AOV or repeat rate disclosed; the financials shown are explicitly illustrative, not company figures.',
      'No post-money valuation has ever been disclosed; the $700m mark is an estimate off a stale 2023 "~3.8x" claim.',
      'Newest hard operating datum is 50m stems (2022); newest growth datum is from 2021 — the picture is years out of date.',
      'Scraped third-party figures ($9m sales, $85 AOV, $936m valuation, a "Talabat acquisition") are unverified and excluded.',
    ],
    icThesis:
      'Only actionable after a data room. Brand and network quality are real, but with no current size/growth/unit-economics and a slipped IPO, this cannot be underwritten today — and at the stale $700m mark the return maths fail regardless. Require audited financials, the IPO timeline, and a materially lower entry before re-engaging.',
    useOfFunds: 'Geographic expansion, fulfilment capacity, the corporate-gifting/GaaS build-out, and pre-IPO readiness (per management); specific allocation not disclosed.',
    proposedTerms: [
      { label: 'Instrument', value: 'Pre-IPO equity (primary or secondary)' },
      { label: 'Ownership', value: '~13% at the $700m anchor (mark unconfirmed)' },
      { label: 'Protections', value: 'IPO ratchet, information rights, audited-accounts condition' },
      { label: 'Governance', value: 'Board observer' },
      { label: 'Conditions to close', value: 'Audited financials, current revenue/GMV/margin disclosure, IPO timeline, entry renegotiation' },
    ],
    riskRegister: [
      { risk: 'Undisclosed size & trajectory', severity: 'high', likelihood: 'high', impact: 'Cannot underwrite without current revenue, GMV, contribution margin and repeat rate', mitigation: 'Gate any term sheet on a full data room with 2022–2025 audited actuals', monitoring: 'Data-room access; monthly KPIs once engaged' },
      { risk: 'Stale capital / slipped IPO', severity: 'high', likelihood: 'high', impact: 'No round since Feb-2023 and IPO slipped >2 years — possible growth/margin/market-window problem', mitigation: 'Confirm IPO timeline and reason for delay; re-price to current reality', monitoring: 'IPO filing progress; any new primary' },
      { risk: 'Return at entry', severity: 'high', likelihood: 'high', impact: 'No scenario clears the 22% hurdle at the stale $700m mark on a thin-margin model', mitigation: 'Renegotiate entry; require evidence of a higher-multiple exit', monitoring: 'Re-run returns at a confirmed, current mark' },
      { risk: 'Margin structure', severity: 'medium', likelihood: 'medium', impact: 'Spoilage + same-day last-mile keep contribution thin', mitigation: 'Premium/gifts/perfumery mix shift; B2B GaaS', monitoring: 'Contribution margin per order' },
    ],
    recommendationSummary:
      'Review (leaning pass) — a real regional brand leader, but the data is years stale, every current vital is undisclosed, the IPO has slipped two years, and at the unconfirmed $700m mark returns do not clear the 22% hurdle. Re-engage only on audited current financials, a credible IPO timeline, and a renegotiated entry.',
  },
  createdAt: '2026-05-15',
}
