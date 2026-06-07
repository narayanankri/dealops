import type { Deal } from '@/types'

// Authored against AUTHORING.md, then revised after a Director critique pass (CRITIQUE.md).
// Key facts pinned to primary sources: (1) the LIVE mark is the Nov-2025 Series E-3 at $32bn post;
// the $40bn+ is an IN-PROGRESS, un-closed $750m round (GIC/Iconiq, reported May-2026, terms could
// change) — flagged as in-progress, not the entry. (2) Ramp is a CHARGE card → it earns NO interest
// on cardholder balances; interchange is the engine. (3) US-headquartered → outside the fund's
// GCC/MENA mandate geography → soft flag → Review. (4) Revenue-line % splits are third-party analyst
// estimates — Ramp does not disclose the mix; the one company-anchored point is "30%+ of contribution
// profit from software/services beyond cards by YE2025" (Sacra, citing company).
const TC_40B = 'https://techcrunch.com/2026/05/07/ramp-in-talks-to-hit-40b-valuation-6-months-after-reaching-32b/'
const PR_32B = 'https://www.prnewswire.com/news-releases/ramp-reaches-32-billion-valuation-doubling-revenue-and-customers-in-past-year-302616510.html'
const PR_1B = 'https://www.prnewswire.com/news-releases/ramp-reaches-1-billion-in-annualized-revenue-302550637.html'
const PR_E2 = 'https://www.prnewswire.com/news-releases/ramp-raises-500-million-at-22-5-billion-valuation-to-accelerate-ai-and-build-the-future-of-finance-302516953.html'
const TC_700 = 'https://techcrunch.com/2025/03/03/ramp-has-more-than-doubled-its-annualized-revenue-to-700-million/'
const SACRA = 'https://sacra.com/c/ramp/'

export const ramp: Deal = {
  id: 'ramp',
  name: 'Ramp',
  oneLiner: 'US spend-management / "autonomous finance" platform — charge cards, bill pay, procurement, treasury',
  sector: 'FinTech',
  geography: 'United States',
  region: 'USA',
  stage: 'Series E-3',
  foundedYear: 2019,
  status: 'ready',
  ticketUSDm: 120,
  instrument: 'Preferred',
  controlPosture: 'minority',
  ask: {
    // The LIVE, closed mark is the Nov-2025 Series E-3 at $32bn post. The $40bn+ is an in-progress,
    // un-closed round (see roundHistory note) and is NOT used as the entry valuation.
    askValuationUSDm: 32000,
    series: 'Series E-3',
    raisingUSDm: 300,
    date: 'Nov 2025',
    lastRoundUSDm: 22500,
    lastRoundDate: 'Jul 2025 (Series E-2)',
    leadInvestors: ['Lightspeed Venture Partners'],
  },
  // Prior CLOSED rounds only, most-recent first. The current ask is the Nov-2025 Series E-3
  // ($32bn); the in-talks ~$40.75bn round is not closed and lives in news[] / dataTrust, not here.
  roundHistory: [
    { series: 'Series E-2', date: 'Jul 2025', raisedUSDm: 500, postMoneyUSDm: 22500, leadInvestors: ['Iconiq'], citation: { source: 'PR Newswire', url: PR_E2 } },
    { series: 'Series E', date: 'Jun 2025', raisedUSDm: 200, postMoneyUSDm: 16000, leadInvestors: ['Founders Fund'], citation: { source: 'TechCrunch', url: TC_40B } },
    { series: 'Secondary', date: 'Mar 2025', postMoneyUSDm: 13000, leadInvestors: [], citation: { source: 'TechCrunch', url: TC_700 } },
  ],
  totalRaisedUSDm: 2300,
  currentValuationUSDm: 32000,
  vitals: {
    size: {
      label: 'Annualised revenue · purchase volume',
      value: '$1bn+ rev · $100bn+ APV',
      trend: 'up',
      basis: 'stated',
      source: 'PR Newswire (Nov 2025)',
      url: PR_32B,
      note: '>$1bn annualised revenue and >$100bn annualised purchase volume as of Nov 1 2025. 2024 full-year revenue was $648m; TPV was $57bn in 2024 (Sacra).',
    },
    growth: {
      label: 'Revenue YoY · $100k+ ARR cohort growth',
      value: '~54% rev · +133% enterprise',
      trend: 'up',
      basis: 'stated',
      source: 'PR Newswire (Nov 2025)',
      url: PR_32B,
      note: 'Company frames revenue as "doubled" ($500m→$1bn+ in the 12m to Nov-2025); ~54% is the FY measure off the $648m 2024 base. $100k+ ARR customers +133% YoY to 2,200+; total customers doubled to 50,000+.',
    },
    unitEconomics: {
      label: 'FCF · contribution mix',
      value: 'FCF-positive · ~70% interchange (est.)',
      trend: 'up',
      basis: 'inferred',
      source: 'PR Newswire / Sacra',
      url: PR_32B,
      note: 'FCF-positive as of Nov 1 2025; underlying profitability +153% YoY. Gross margin not disclosed. Revenue is ~70% interchange (third-party analyst est.; Ramp does not disclose) — but the company states 30%+ of contribution profit comes from software/services beyond cards by YE2025.',
    },
    quality: {
      label: '$100k+ ARR cohort / retention',
      value: '2,200+ at $100k+ ARR; NRR not disclosed',
      trend: 'up',
      basis: 'stated',
      source: 'PR Newswire (Nov 2025)',
      url: PR_32B,
      note: '2,200+ customers at $100k+ ARR (+133% YoY); half of customers use 2+ products (Jun 2025, Sacra). Net revenue retention / logo retention / churn are NOT disclosed — the key stickiness KPI for the IC.',
    },
  },
  headlineMetrics: [
    { label: 'Annualised revenue', value: '$1bn+', trend: 'up', basis: 'stated', source: 'PR Newswire', url: PR_32B },
    { label: 'Revenue growth (FY, off $648m 2024)', value: '~54%', trend: 'up', basis: 'inferred', source: 'PR Newswire / Sacra', url: PR_32B },
    { label: 'Annualised purchase volume', value: '$100bn+', trend: 'up', basis: 'stated', source: 'PR Newswire', url: PR_32B },
    { label: 'Free cash flow', value: 'Positive (since Nov 1 2025)', basis: 'stated', source: 'PR Newswire', url: PR_32B },
    { label: 'Customers', value: '50,000+ (2x YoY)', trend: 'up', basis: 'stated', source: 'PR Newswire', url: PR_32B },
    { label: 'Customers at $100k+ ARR', value: '2,200+ (+133% YoY)', trend: 'up', basis: 'stated', source: 'PR Newswire', url: PR_32B },
    { label: 'Ramp Treasury AUM', value: '$1.5bn+', trend: 'up', basis: 'stated', source: 'Sacra / Company', url: SACRA },
    { label: 'Total equity raised', value: '$2.3bn', basis: 'stated', source: 'PR Newswire', url: PR_32B },
  ],
  news: [
    { date: 'May 2026', headline: 'In talks to raise $750m at >$40bn pre-money (GIC, Iconiq co-leading) — NOT closed, terms could change; targeting IPO-ready by end-2026', source: 'TechCrunch / WSJ', url: TC_40B },
    { date: 'Nov 2025', headline: 'Series E-3: $300m at $32bn post (Lightspeed-led, $90.00/share); >$1bn annualised revenue, FCF-positive, 50,000+ customers', source: 'PR Newswire / Bloomberg', url: PR_32B },
    { date: 'Aug 2025', headline: 'Crosses $1bn annualised revenue', source: 'PR Newswire', url: PR_1B },
    { date: 'Jul 2025', headline: 'Series E-2: $500m at $22.5bn (Iconiq-led)', source: 'PR Newswire', url: PR_E2 },
    { date: 'Jun 2025', headline: 'Series E: $200m at $16bn (Founders Fund-led)', source: 'TechCrunch', url: TC_40B },
    { date: 'Mar 2025', headline: 'Secondary share sale at $13bn; ~$700m annualised revenue disclosed', source: 'TechCrunch', url: TC_700 },
  ],
  peers: [
    { name: 'Bill.com', public: true, evRevenue: 5.0, revGrowthPct: 16, ebitdaMarginPct: 18, scaleUSDm: 1400, basis: 'stated', rationale: 'Listed SMB spend/AP automation; closest public comp on category and bill-pay overlap' },
    { name: 'Brex', public: false, evRevenue: 12.0, revGrowthPct: 30, ebitdaMarginPct: -5, scaleUSDm: 400, basis: 'estimated', rationale: 'Direct private spend-management peer; the head-to-head rival on corporate cards' },
    { name: 'Toast', public: true, evRevenue: 4.0, revGrowthPct: 25, ebitdaMarginPct: 8, scaleUSDm: 5000, basis: 'stated', rationale: 'Vertical fintech platform; interchange + SaaS read at scale' },
    { name: 'Adyen', public: true, evRevenue: 11.0, revGrowthPct: 22, ebitdaMarginPct: 50, scaleUSDm: 2000, basis: 'stated', rationale: 'High-quality payments infra; what a durable, profitable payments multiple looks like' },
  ],
  assumptions: {
    baseRevenueUSDm: 1000,
    revGrowthPct: [50, 42, 35, 28, 22],
    ebitdaMarginPct: [10, 15, 20, 24, 28],
    taxRatePct: 21,
    waccPct: 14,
    terminalGrowthPct: 4,
    netDebtUSDm: -200,
    exitEVRevenue: 12,
    holdYears: 5,
  },
  merit: [
    { key: 'market', label: 'Market opportunity', score: 90, confidence: 'high', rationale: 'Vast US corporate-spend and finance-automation TAM; Ramp is still only ~1-2% of the US card market (CEO, Mar-2025). AI "autonomous finance" extends the wallet from cards into bill pay, procurement and treasury.' },
    { key: 'model', label: 'Business model', score: 84, confidence: 'medium', rationale: 'Interchange engine (est. ~70% of revenue) plus growing SaaS/bill-pay/treasury, now FCF-positive at $1bn+ — a rare combination. But it is a charge card: Ramp earns NO interest on balances, so revenue rides on swipe volume and interchange rates. Mix is not disclosed.' },
    { key: 'financial', label: 'Financial profile', score: 86, confidence: 'high', rationale: '$1bn+ annualised revenue (~54% YoY off the $648m 2024 base), FCF-positive since Nov-2025, underlying profitability +153% YoY. Quality of growth is unusually strong for a venture-stage fintech.', confidenceReason: 'Headline revenue/FCF/customer counts are company-disclosed; gross margin, NRR and the revenue-line split are not.' },
    { key: 'moat', label: 'Competitive moat', score: 78, confidence: 'medium', rationale: 'Product velocity, multi-product attach (half of customers on 2+ products) and data network effects across the finance stack; faces well-funded rivals (Brex, Bill.com, incumbents) and direct interchange-regulation risk on ~70% of revenue.' },
    { key: 'team', label: 'Team', score: 86, confidence: 'high', rationale: 'Founder-CEO Eric Glyman and CTO Karim Atiyeh; top-decile shipping cadence and a blue-chip cap table (Founders Fund, Lightspeed, Iconiq, GIC, Thrive, Coatue, Khosla).' },
    { key: 'valuation', label: 'Valuation', score: 38, confidence: 'medium', rationale: 'At the $32bn closed mark that is ~32x annualised revenue; the in-talks round implies >$40bn (~40x+). A $120m minority is sub-0.4% ownership. The Mar-2025 secondary cleared at $13bn — the primary mark has tripled in 8 months and sits far above any reconciled value.' },
    { key: 'exit', label: 'Exit pathway', score: 84, confidence: 'medium', rationale: 'Clear IPO candidate — company has told investors it aims to be IPO-ready by end-2026 — with deep public-market and strategic demand. The question is entry price, not exit liquidity.' },
  ],
  financials: {
    years: ['FY23', 'FY24', 'FY25E', 'FY26E', 'FY27E'],
    revenue: [430, 648, 1000, 1500, 2130],
    ebitda: [-40, 40, 100, 225, 426],
  },
  capTable: [
    { holder: 'Founders & management', pct: 18, type: 'founder' },
    { holder: 'Founders Fund, Lightspeed & Iconiq', pct: 40, type: 'investor' },
    { holder: 'Khosla, General Catalyst & others', pct: 30, type: 'investor' },
    { holder: 'Employee option pool', pct: 12, type: 'esop' },
  ],
  dataTrust: {
    fields: [
      { label: 'Current mark ($32bn, Series E-3, Nov-2025)', basis: 'stated', confidence: 'high', source: 'PR Newswire / Bloomberg', url: PR_32B },
      { label: 'Next round ($750m at >$40bn)', basis: 'stated', confidence: 'medium', source: 'TechCrunch / WSJ', url: TC_40B, method: 'Reported May-2026 as IN TALKS (GIC/Iconiq); not closed — treated as in-progress, not the entry mark.' },
      { label: 'Funding rounds (secondary → E-3) & $2.3bn total raised', basis: 'stated', confidence: 'high', source: 'PR Newswire / TechCrunch', url: PR_32B },
      { label: 'Revenue $1bn+, ~54% YoY, FCF-positive, +153% profitability', basis: 'stated', confidence: 'high', source: 'PR Newswire', url: PR_32B, method: '~54% is inferred off the $648m 2024 base (Sacra); company headlines the $500m→$1bn "doubling".' },
      { label: 'Customers (50,000+) & $100k+ ARR cohort (2,200+, +133%)', basis: 'stated', confidence: 'high', source: 'PR Newswire', url: PR_32B },
      { label: 'Purchase volume ($100bn+) & 2024 TPV ($57bn)', basis: 'stated', confidence: 'high', source: 'PR Newswire / Sacra', url: PR_32B },
      { label: 'Treasury AUM ($1.5bn+)', basis: 'stated', confidence: 'medium', source: 'Sacra / Company', url: SACRA },
      { label: 'Revenue mix (~70% interchange / ~15% SaaS / bill pay / treasury)', basis: 'estimated', confidence: 'low', source: 'Sacra / analyst', url: SACRA, method: 'Ramp does NOT disclose the line split; %s are third-party analyst estimates. Only company-anchored point: 30%+ of contribution profit from software/services beyond cards by YE2025.' },
      { label: 'Gross margin / NRR / logo retention', basis: 'estimated', confidence: 'low', method: 'NOT disclosed. Gross margin inferred-positive from FCF status; net revenue retention and churn are diligence items.' },
      { label: 'Geography fit', basis: 'stated', confidence: 'high', source: 'US HQ (New York) — outside GCC/MENA mandate', url: PR_32B },
    ],
  },
  shariaScreen: {
    status: 'n/a',
    note: 'Ramp is United States-headquartered and sits outside the fund’s GCC/MENA mandate, so a formal Shariah screen is not in scope; were it assessed, the interchange-and-SaaS charge-card model carries no interest income on balances, though treasury float and partner-bank spread would require review.',
    source: 'PR Newswire (Nov 2025)',
    url: PR_32B,
  },
  narrative: {
    whyNow:
      'The deal surfaces because Ramp is reported in May 2026 to be in talks to raise approximately $750m at a valuation above $40bn, six months after the November 2025 Series E-3 closed at $32bn alongside a stated target of being IPO-ready by the end of 2026.',
    barriers: [
      { axis: 'Interchange economics / scale', rating: 'medium', note: 'Interchange (estimated approximately 70% of revenue) scales with more than $100bn in annualised purchase volume, but the underlying rates are network-set and exposed to interchange regulation, so the moat is volume and routing scale rather than a protected fee.' },
      { axis: 'Spend-data and underwriting network', rating: 'high', note: 'A proprietary corpus of transaction and spend data across 50,000+ customers feeds AI-led controls and credit decisions that a new entrant cannot replicate without comparable volume.' },
      { axis: 'Switching costs / multi-product attach', rating: 'high', note: 'Half of customers use two or more products and 2,200+ are at $100k+ ARR, embedding Ramp into bill pay, procurement and treasury workflows that are costly to migrate.' },
      { axis: 'Bank-partner and issuance access', rating: 'medium', note: 'Card issuance and deposits run through chartered partners such as First Internet Bank of Indiana rather than an owned charter; the arrangement is replicable but requires established partner relationships and compliance scaffolding.' },
      { axis: 'Product velocity and capital base', rating: 'medium', note: 'A $2.3bn equity base and a top-decile shipping cadence sustain a feature lead, but well-funded rivals such as Brex and Bill.com contest the same buyers.' },
    ],
    profile:
      'Ramp is a New York-headquartered fintech, founded in 2019, providing corporate charge cards, bill pay, procurement and treasury under an AI-led "autonomous finance" platform. As of Nov 1 2025 it served 50,000+ customers (2,200+ at $100k+ ARR), generated >$1bn in annualised revenue (up from $648m FY2024) across >$100bn in annualised purchase volume, and was free-cash-flow positive. It is a charge card — balances are paid in full each cycle, so Ramp earns no interest on cardholder balances; the economics ride on interchange plus a growing software/bill-pay/treasury stack. Valued at $32bn (Series E-3, Nov-2025); reportedly in talks at >$40bn (May-2026, not closed).',
    revenueModel: 'Predominantly card interchange (est. ~70%), plus Ramp Plus SaaS subscriptions, bill-pay transaction fees, FX and treasury spread from banking partners. As a charge card, Ramp earns no interest on balances. The line-item split is not disclosed; %s below are third-party estimates.',
    revenueLines: [
      { name: 'Card interchange', sharePct: 70, basis: 'estimated', description: 'Interchange on every swipe of the Ramp corporate charge card — the core engine, scaling with $100bn+ annualised purchase volume. Charge card means no interest income on balances; revenue is purely interchange. Ramp does not disclose the %; ~70% is a third-party analyst estimate.' },
      { name: 'Ramp Plus / software SaaS', sharePct: 15, basis: 'estimated', description: 'Subscription for advanced spend controls, procurement and AI workflows. Company states 30%+ of contribution profit comes from software/services beyond cards by YE2025 — the mix is shifting toward higher-margin SaaS.' },
      { name: 'Bill pay', sharePct: 8, basis: 'estimated', description: 'Transaction fees on AP / bill payments; Bill Pay volume more than tripled YoY as of Sep-2025 (Sacra). Higher-margin, recurring, and a wedge against Bill.com.' },
      { name: 'Treasury float / FX', sharePct: 7, basis: 'estimated', description: 'Spread shared by banking partners on $1.5bn+ Treasury AUM, plus FX on international money movement and travel affiliate fees. Note: the yield accrues via partner spread, not Ramp holding the float directly.' },
    ],
    marketRead:
      'The principal uncertainty is not demand: US corporate-spend automation is a large, under-digitised market and Ramp is still only ~1-2% of US card volume. For this fund the material questions are twofold: (1) price — at ~32x revenue closed, and >40x on the in-talks round, a sub-0.4% minority cannot clear the 22% hurdle; and (2) geography — Ramp is US-headquartered, outside the GCC/MENA mandate. Secondary considerations: ~70% interchange dependence exposes the top line to card-interchange regulation, and gross margin / NRR are undisclosed.',
    regulatory:
      'US financial-services and card-network regulation. The material sector risk is card-interchange regulation: with an estimated ~70% of revenue from interchange and a charge-card model that earns nothing on balances, any compression in interchange rates hits the engine directly. Ramp partners with chartered banks (e.g. First Internet Bank of Indiana) for deposits/issuance rather than holding a bank charter itself.',
    caseFor: [
      'Rare quality at scale: >$1bn annualised revenue (~54% YoY off the $648m 2024 base), FCF-positive since Nov-2025, and underlying profitability +153% YoY — growth and cash generation at once.',
      'Enterprise traction is the real signal: $100k+ ARR customers grew +133% YoY to 2,200+, and half of customers use 2+ products — attach and up-market motion are working, not merely SMB share capture.',
      'Visible exit and live demand: company targets IPO-ready by end-2026, and the primary mark has run $13bn→$32bn in 8 months with a >$40bn round in talks — the paper clears.',
    ],
    caseAgainst: [
      'Price has decoupled from any reconciled value: ~32x annualised revenue at the $32bn closed mark (>40x on the in-talks round), tripled off a $13bn secondary just 8 months earlier — a $120m minority is sub-0.4% and cannot clear the 22% hurdle.',
      'US-headquartered — squarely outside the fund\'s GCC/MENA target geography; this is a mandate-scope exception, not a core deal.',
      'Concentrated, regulated revenue: ~70% interchange (third-party est.; undisclosed) on a charge-card model that earns no float — directly exposed to interchange-rate regulation, with gross margin and NRR not disclosed.',
      'The headline round is not real yet: the >$40bn / $750m is in talks (GIC/Iconiq), not closed — the only firm mark is $32bn, and the implied step-up may not hold.',
    ],
    leadership: [
      { name: 'Eric Glyman', role: 'Co-founder & CEO', note: 'Ex-Paribus (sold to Capital One); has driven the AI "autonomous finance" repositioning' },
      { name: 'Karim Atiyeh', role: 'Co-founder & CTO', note: 'Ex-Paribus; long-time engineering partner to Glyman' },
    ],
    leadershipGaps: 'Proven, high-velocity founding team and a blue-chip board (Founders Fund, Lightspeed, Iconiq, GIC); no material leadership gap — team is a strength. The diligence gap is data, not people: undisclosed gross margin, NRR and revenue-line mix.',
    legalStanding: 'No adverse media or sanctions exposure; well-governed, institutionally-backed US entity operating via chartered bank partners. The live regulatory exposure is card-interchange policy, not company-specific litigation.',
    valuationVerdict:
      'An elite business, but the live entry is $32bn (~32x revenue), with a >$40bn round in talks that is not closed, and it sits outside the mandate geography. The constraint is not asset quality but the entry multiple, the sub-0.4% minority position, and the GCC/MENA scope. Reconciled value sits well below the closed mark.',
    limitations: [
      'Revenue-line split (~70% interchange etc.) is third-party estimated — Ramp does not disclose the mix; gross margin and NRR are undisclosed.',
      'The >$40bn / $750m round is in talks, not closed — only the $32bn Nov-2025 mark is firm.',
      'Return is structurally capped: a $120m minority at $32bn is sub-0.4% ownership, below the 22% hurdle.',
      'Geography sits outside the GCC/MENA mandate — requires an explicit scope exception.',
    ],
    icThesis:
      'Not a fit for this mandate as a primary: outside the GCC/MENA geography and priced so a sub-0.4% minority cannot clear the 22% hurdle. Revisit only via a discounted secondary or a strategic co-invest with an explicit mandate exception — and only after seeing gross margin, NRR and the interchange/SaaS revenue split.',
    useOfFunds: 'Per the in-talks round: AI product, enterprise go-to-market, and platform expansion (and an employee tender, as in the Nov-2025 round). No primary on offer to this fund today.',
    proposedTerms: [
      { label: 'Status', value: 'Review — geography and entry price outside mandate fit' },
      { label: 'Live mark', value: '$32bn (Series E-3, Nov-2025); >$40bn round in talks, not closed' },
      { label: 'Ownership', value: '~0.4% for a $120m ticket at $32bn' },
      { label: 'Conditions to revisit', value: 'Discounted secondary or co-invest; mandate-scope exception; gross margin / NRR / revenue-mix disclosure' },
    ],
    riskRegister: [
      { risk: 'Geography (outside mandate)', severity: 'high', likelihood: 'high', impact: 'US HQ outside GCC/MENA mandate', mitigation: 'Requires explicit mandate-scope exception', monitoring: 'Mandate review' },
      { risk: 'Entry valuation', severity: 'high', likelihood: 'high', impact: '~32x revenue ($32bn), >40x on in-talks round; sub-0.4% minority return below 22% hurdle', mitigation: 'Secondary at discount; co-invest only', monitoring: 'Return sensitivity at agreed entry' },
      { risk: 'Round not closed', severity: 'medium', likelihood: 'medium', impact: 'The >$40bn / $750m is in talks; the step-up from $32bn may not hold', mitigation: 'Underwrite to the firm $32bn mark only', monitoring: 'Track round close / terms' },
      { risk: 'Interchange regulation', severity: 'medium', likelihood: 'medium', impact: 'Margin/revenue pressure on ~70% interchange-dependent, charge-card economics', mitigation: 'SaaS / bill-pay mix shift (30%+ contribution profit beyond cards)', monitoring: 'Revenue mix; interchange policy' },
      { risk: 'Disclosure gaps', severity: 'medium', likelihood: 'high', impact: 'Gross margin, NRR and revenue-line split not disclosed', mitigation: 'Gate any participation on data-room access', monitoring: 'Cohort retention / margin reporting' },
    ],
    recommendationSummary:
      'Review — an elite US fintech ($1bn+ revenue, ~54% growth, FCF-positive), but US-headquartered (outside the GCC/MENA mandate) and priced at ~32x revenue ($32bn closed; >$40bn in talks, not closed) so a sub-0.4% minority cannot clear the 22% hurdle. Only actionable via a discounted secondary or strategic co-invest with an explicit mandate exception, and after disclosure of gross margin, NRR and the interchange/SaaS revenue mix.',
  },
  createdAt: '2026-06-04',
}
