import type { Deal } from '@/types'

// Authored against AUTHORING.md, then revised after a Director critique pass (CRITIQUE.md).
// Key corrections from that review:
//  (1) BOTH live marks are secondaries/tenders, not priced primaries — the Apr-2025 "$575m at $6.1bn"
//      was substantially RSU-tax / employee liquidity (CEO's own words), and the Feb-2026 $8bn is an
//      employee tender with no primary proceeds. The current mark is soft, and still ~40% below the
//      2021 $13.4bn peak after ARR more than doubled — i.e. multiple compression, not a "reasonable reset".
//  (2) ARR ($546m), the ~40% growth, the ~80% gross margin and the ~80/20 legacy/new-product split are
//      Sacra ANALYST ESTIMATES — Plaid does not formally disclose them → marked inferred, not stated.
//  (3) The growth story is concentrated: ~80% of ARR is decelerating legacy data-aggregation; the +~90%
//      growth lives in the ~20% new SaaS suite. NRR is not disclosed. CFPB 1033 is a two-way regulatory
//      risk, not just a tailwind. US HQ is outside the GCC/MENA mandate → soft geography flag retained.
const CB_8B = 'https://news.crunchbase.com/fintech/plaid-completes-tender-offer-8b-valuation/'
const TC_8B = 'https://techcrunch.com/2026/02/26/plaid-valued-at-8b-in-employee-share-sale/'
const SACRA = 'https://sacra.com/research/plaid-at-546m-arr-growing-40-yoy/'
const FINOVATE = 'https://www.finovate.com/plaids-575-million-round-signals-strength-despite-valuation-drop-and-delayed-ipo/'

export const plaid: Deal = {
  id: 'plaid',
  name: 'Plaid',
  oneLiner: 'US open-banking and financial-data infrastructure — the rails behind ~7,000 fintech and AI apps',
  sector: 'FinTech',
  geography: 'United States',
  region: 'USA',
  stage: 'Growth',
  foundedYear: 2013,
  status: 'ready',
  ticketUSDm: 100,
  instrument: 'Preferred',
  controlPosture: 'minority',
  ask: {
    askValuationUSDm: 8000,
    series: 'Secondary (employee tender)',
    date: 'Feb 2026',
    leadInvestors: ['Existing backers (NEA, Ribbit, a16z, Silver Lake, BlackRock, Fidelity)'],
    // legacy fallback
    lastRoundUSDm: 6100,
    lastRoundDate: 'Apr 2025 (secondary; substantially RSU-tax / employee liquidity)',
  },
  // Prior rounds only — the Feb-2026 $8bn tender is the current ask, not history.
  roundHistory: [
    { series: 'Secondary / venture round', date: 'Apr 2025', raisedUSDm: 575, postMoneyUSDm: 6100, leadInvestors: ['Franklin Templeton', 'BlackRock', 'Fidelity', 'NEA', 'Ribbit Capital'], citation: { source: 'Finovate', url: FINOVATE } },
    { series: 'Series D', date: 'Apr 2021', raisedUSDm: 425, postMoneyUSDm: 13400, leadInvestors: ['Altimeter Capital', 'Silver Lake', 'Ribbit Capital'], citation: { source: 'Finovate', url: FINOVATE } },
  ],
  totalRaisedUSDm: 1300,
  currentValuationUSDm: 8000,
  vitals: {
    size: {
      label: 'ARR (2025, Sacra est.)',
      value: '~$546m',
      trend: 'up',
      basis: 'inferred',
      source: 'Sacra',
      url: SACRA,
      note: 'Plaid does not formally disclose revenue; $546m is a Sacra analyst estimate. ~12,000 institutions connected, ~7,000 apps, ~1 in 2 banked Americans reached.',
    },
    growth: {
      label: 'ARR YoY (Sacra est.)',
      value: '~+40%',
      trend: 'up',
      basis: 'inferred',
      source: 'Sacra',
      url: SACRA,
      note: 'From ~$390m (2024). But mix matters: ~80% of ARR is legacy data-aggregation (decelerating; 2023 group growth was only ~12%); the ~+90%/yr engine is the ~20% new SaaS suite. Re-acceleration to 40% is the new products, not the core.',
    },
    unitEconomics: {
      label: 'Gross margin / EBITDA (Sacra est.)',
      value: '~80% GM, adj-EBITDA positive',
      trend: 'up',
      basis: 'inferred',
      source: 'Sacra',
      url: SACRA,
      note: 'Software-grade ~80% gross margin; flipped from a ~$50m operating loss (2024) to full-year adj-EBITDA profitability (2025). Forward EBITDA margins below are estimated.',
    },
    quality: {
      label: 'Net revenue retention',
      value: 'Not disclosed',
      basis: 'estimated',
      note: 'NRR / logo retention not published — the gating quality KPI for infra-SaaS. Proxy signals: enterprise logos (Carvana, Rocket Mortgage, H&R Block) and multi-product attach in the new suite suggest healthy expansion, but the number itself is a diligence item.',
    },
  },
  headlineMetrics: [
    { label: 'Current mark (Feb-2026 tender)', value: '$8.0bn (secondary)', trend: 'up', basis: 'stated', source: 'Crunchbase News', url: CB_8B },
    { label: 'ARR (2025, Sacra est.)', value: '~$546m', trend: 'up', basis: 'inferred', source: 'Sacra', url: SACRA },
    { label: 'ARR growth (Sacra est.)', value: '~+40% YoY', trend: 'up', basis: 'inferred', source: 'Sacra', url: SACRA },
    { label: 'Gross margin (Sacra est.)', value: '~80%; adj-EBITDA positive', trend: 'up', basis: 'inferred', source: 'Sacra', url: SACRA },
    { label: 'New SaaS products (Sacra est.)', value: '~20% of ARR, ~+90%/yr', trend: 'up', basis: 'inferred', source: 'Sacra', url: SACRA },
    { label: 'AI firms in new customers', value: '~20%', trend: 'up', basis: 'stated', source: 'Crunchbase News', url: CB_8B },
    { label: 'Valuation arc', value: '$13.4bn (2021) → $6.1bn (2025) → $8.0bn (2026)', trend: 'down', basis: 'stated', source: 'Crunchbase News', url: CB_8B },
  ],
  news: [
    { date: 'Feb 2026', headline: '$8.0bn employee tender completed — secondary liquidity (no primary proceeds), up 31% from $6.1bn; existing backers + institutions buying. Still ~40% below the 2021 peak.', source: 'Crunchbase News', url: CB_8B },
    { date: 'Feb 2026', headline: '~20% of newest customers are AI firms — a shift from the consumer-fintech-app base; cited as setting the stage for an eventual IPO', source: 'TechCrunch', url: TC_8B },
    { date: 'Apr 2025', headline: '$575m at $6.1bn — Franklin Templeton-led; CEO frames it as funding RSU-tax obligations and employee liquidity, not growth capital ("not a Series E")', source: 'Finovate', url: FINOVATE },
  ],
  peers: [
    { name: 'Adyen', public: true, evRevenue: 11.0, revGrowthPct: 22, ebitdaMarginPct: 50, scaleUSDm: 2000, basis: 'stated', rationale: 'Premium payments infra; high-margin benchmark for what durable infra earns' },
    { name: 'Fiserv', public: true, evRevenue: 4.5, revGrowthPct: 7, ebitdaMarginPct: 40, scaleUSDm: 20000, basis: 'stated', rationale: 'Mature payments/data infra; low-multiple anchor — where aggregation rails mature to' },
    { name: 'Marqeta', public: true, evRevenue: 3.5, revGrowthPct: 18, ebitdaMarginPct: -5, scaleUSDm: 700, basis: 'stated', rationale: 'Card-issuing infra; lower multiple, illustrates infra de-rating' },
    { name: 'MX / Finicity (private)', public: false, evRevenue: 6.0, revGrowthPct: 20, ebitdaMarginPct: 0, scaleUSDm: 150, basis: 'estimated', rationale: 'Direct US data-aggregation rivals — the competitive set on the legacy ~80% of ARR' },
    { name: 'Lean Technologies', public: false, evRevenue: 12.0, revGrowthPct: 50, ebitdaMarginPct: -10, scaleUSDm: 25, basis: 'estimated', rationale: 'GCC open-banking analogue (earlier-stage) — the in-mandate thesis Plaid benchmarks' },
  ],
  assumptions: {
    baseRevenueUSDm: 546,
    revGrowthPct: [40, 34, 28, 23, 18],
    ebitdaMarginPct: [8, 12, 16, 20, 24],
    taxRatePct: 21,
    waccPct: 14,
    terminalGrowthPct: 4,
    netDebtUSDm: -100,
    exitEVRevenue: 9,
    holdYears: 5,
  },
  merit: [
    { key: 'market', label: 'Market opportunity', score: 86, confidence: 'high', rationale: 'The dominant open-banking rail in the largest fintech market (~1 in 2 banked Americans, ~12,000 institutions, ~7,000 apps). The new wedge — AI firms as ~20% of new customers — extends TAM into fraud, identity and underwriting.' },
    { key: 'model', label: 'Business model', score: 84, confidence: 'high', rationale: 'High-margin (~80% GM, Sacra est.) recurring infra. But the model has two speeds: ~80% legacy data-aggregation (slow) and a ~20% new-SaaS suite compounding ~90%/yr — the thesis rides the latter outgrowing the former.' },
    { key: 'financial', label: 'Financial profile', score: 76, confidence: 'medium', rationale: '~$546m ARR up ~40% with adj-EBITDA now positive — a high-quality base. But every one of those figures is a Sacra estimate, not disclosed; Plaid publishes no audited financials to outside minority holders.', confidenceReason: 'ARR, growth, margin and the 80/20 split are analyst estimates (Sacra); no company-disclosed financials.' },
    { key: 'moat', label: 'Competitive moat', score: 84, confidence: 'high', rationale: 'Deep bank integrations and developer ubiquity create real switching costs; CFPB 1033 data-access rules are both a barrier to entry and a live risk to the permissioning model.' },
    { key: 'team', label: 'Team', score: 82, confidence: 'medium', rationale: 'Founder-led (Zach Perret) with a long operating history, a CFO (Seun Sodipo) driving the profitability turn, and a top-tier institutional cap table.' },
    { key: 'valuation', label: 'Valuation', score: 48, confidence: 'medium', rationale: 'The live entry is an $8bn SECONDARY tender mark (≈14.7x Sacra-est. ARR) — soft, not a priced primary. It is up 31% off $6.1bn but still ~40% below the 2021 $13.4bn peak after ARR more than doubled: multiple compression, not a comfortable reset.' },
    { key: 'exit', label: 'Exit pathway', score: 80, confidence: 'medium', rationale: 'An explicit IPO candidate once markets allow (the AI-customer mix is cited as IPO-stage-setting); deep strategic and secondary demand as a category-defining rail.' },
  ],
  financials: {
    years: ['FY23', 'FY24', 'FY25', 'FY26E', 'FY27E'],
    revenue: [310, 390, 546, 732, 951],
    ebitda: [-30, -50, 44, 117, 190],
  },
  capTable: [
    { holder: 'Founders & management', pct: 16, type: 'founder' },
    { holder: 'NEA & Ribbit Capital', pct: 30, type: 'investor' },
    { holder: 'Franklin Templeton, BlackRock & Fidelity', pct: 34, type: 'investor' },
    { holder: 'Employee option pool', pct: 20, type: 'esop' },
  ],
  dataTrust: {
    fields: [
      { label: 'Current mark ($8.0bn, Feb-2026 tender)', basis: 'stated', confidence: 'high', source: 'Crunchbase News / TechCrunch', url: CB_8B },
      { label: 'Apr-2025 round ($575m at $6.1bn)', basis: 'stated', confidence: 'high', source: 'Finovate', url: FINOVATE, method: 'Raise and post-money kept distinct; CEO framed it as RSU-tax/employee liquidity, not growth capital.' },
      { label: '2021 peak ($13.4bn Series D, $425m raise)', basis: 'stated', confidence: 'high', source: 'Finovate', url: FINOVATE },
      { label: 'ARR & ~40% growth', basis: 'inferred', confidence: 'medium', source: 'Sacra', url: SACRA, method: 'Sacra analyst estimate; Plaid does not formally disclose revenue.' },
      { label: '~80% gross margin / adj-EBITDA profitability', basis: 'inferred', confidence: 'medium', source: 'Sacra', url: SACRA, method: 'Sacra estimate from the 2024 ~$50m op-loss → 2025 profitability turn.' },
      { label: '~80/20 legacy-aggregation vs new-SaaS split', basis: 'inferred', confidence: 'medium', source: 'Sacra', url: SACRA, method: 'Sacra estimate; new products crossed ~20% of ARR in 2024, growing ~90%/yr.' },
      { label: 'AI firms ~20% of new customers', basis: 'stated', confidence: 'medium', source: 'Crunchbase News', url: CB_8B },
      { label: 'Net revenue retention', basis: 'estimated', confidence: 'low', method: 'Not disclosed — flagged for the data room as the gating quality KPI.' },
      { label: 'Revenue-line mix (% by product)', basis: 'estimated', confidence: 'low', method: 'Not disclosed at line level; shares below are estimated from the Sacra 80/20 frame.' },
      { label: 'Geography fit', basis: 'stated', confidence: 'high', source: 'US HQ — outside GCC/MENA mandate', url: SACRA },
      { label: 'Cap table %', basis: 'estimated', confidence: 'low', method: 'Illustrative; precise post-tender ownership splits not disclosed.' },
    ],
  },
  shariaScreen: {
    status: 'n/a',
    note: 'Plaid is United States-headquartered and sits outside the fund’s GCC/MENA mandate, so a formal Shariah screen is not in scope; the business is data-connectivity and software infrastructure with no interest-bearing lending or balance-sheet, which would present no obvious structural impediment were it assessed.',
    source: 'Crunchbase News (Feb 2026)',
    url: CB_8B,
  },
  narrative: {
    whyNow:
      'The deal surfaces because Plaid completed an $8.0bn employee tender in February 2026, up 31% from the April 2025 $6.1bn mark, with approximately 20% of new customers now AI firms — a step cited as setting the stage for an eventual public listing.',
    barriers: [
      { axis: 'Bank-data network effects', rating: 'high', note: 'Connectivity to approximately 12,000 institutions reaching roughly one in two banked Americans is the asset both developers and banks depend on; the breadth compounds with each integration and is slow to rebuild.' },
      { axis: 'Developer ubiquity / switching costs', rating: 'high', note: 'Approximately 7,000 apps are wired to the single API, so migration off Plaid means re-engineering live account-connectivity flows — a cost that anchors incumbency.' },
      { axis: 'Regulatory access regime (CFPB 1033)', rating: 'medium', note: 'Section 1033 mandated open banking is a structural barrier favouring established aggregators, but the contested final rule could reshape permissioning, liability and pricing in either direction.' },
      { axis: 'Multi-product data graph', rating: 'medium', note: 'The new SaaS suite (anti-fraud, identity, underwriting) reuses the same bank-data graph, a cross-sell advantage a point competitor without the connectivity base cannot match.' },
      { axis: 'Direct aggregation competition', rating: 'low', note: 'Named rivals MX and Finicity (the latter owned by Mastercard) contest the legacy aggregation layer that is approximately 80% of ARR, limiting pricing power on the core product.' },
    ],
    profile:
      'Plaid is a San Francisco-headquartered open-banking and financial-data infrastructure company, founded in 2013, that connects ~7,000 fintech apps to ~12,000 financial institutions and reaches roughly 1 in 2 banked Americans. Its original product is data aggregation (account/transaction connectivity via a single API); it has layered a new SaaS suite — payments, anti-fraud (Plaid Protect), credit underwriting (Plaid Check), identity/KYC (Plaid Identity) and onboarding (Plaid Layer). Sacra estimates ~$546m ARR in 2025 (up ~40%) at ~80% gross margin, with the company crossing full-year adjusted-EBITDA profitability. Note: Plaid does not formally disclose financials — the ARR, growth and margin figures here are Sacra analyst estimates.',
    revenueModel: 'Usage- and subscription-based data-access plus a faster-growing new-SaaS suite (payments, anti-fraud, identity, underwriting). Sacra estimates ~80% of ARR is still legacy data-aggregation and ~20% is the new suite growing ~90%/yr; Plaid does not disclose a line-level split.',
    revenueLines: [
      { name: 'Data aggregation (legacy core)', sharePct: 80, basis: 'inferred', description: 'Per-connection / per-call and subscription fees for account-and-transaction connectivity — the original rail. ~80% of ARR (Sacra est.) but the slow-growing part; 2023 group growth was only ~12%.' },
      { name: 'Payments (new SaaS)', sharePct: 7, basis: 'estimated', description: 'Pay-by-bank / account-funding facilitation. Reportedly grew ~250% YoY in 2025 (Sacra/CFO) off a small base; share is an estimate from the 20% new-suite frame.' },
      { name: 'Anti-fraud (Plaid Protect / Signal)', sharePct: 6, basis: 'estimated', description: 'Fraud and return-risk scoring. Reportedly ~+400% YoY in 2025 (Sacra) off a small base; the fastest-growing line, share estimated.' },
      { name: 'Identity / KYC (Plaid Identity / Layer)', sharePct: 4, basis: 'estimated', description: 'Onboarding, KYC and instant identity verification — leverages the same bank-data graph; share estimated.' },
      { name: 'Credit underwriting (Plaid Check)', sharePct: 3, basis: 'estimated', description: 'Cashflow-based underwriting / income & asset verification for lenders; nascent, share estimated.' },
    ],
    marketRead:
      'The principal uncertainty is not demand: Plaid is the category-defining US open-banking rail and AI firms are now ~20% of new customers. The material questions are: (1) whether the ~20% new-SaaS suite outgrows the decelerating ~80% legacy aggregation fast enough to justify the multiple; (2) how CFPB 1033 data-access rulemaking lands — mandated open banking is a tailwind, but a permissioning/liability shift is a model risk; and (3) for this fund, geography — Plaid is US-headquartered, outside the GCC/MENA mandate.',
    regulatory:
      'US data-access regulation (CFPB Section 1033) is two-sided: it mandates consumer-permissioned open banking (a structural tailwind and entry barrier) but the final rule has been contested and could reshape permissioning, liability and pricing for aggregators. Plaid also operates under the broader US financial-data / privacy regime. Not a sanctioned/adverse-media entity.',
    caseFor: [
      'Category-defining rail with real switching costs: ~7,000 apps on ~12,000 institutions, ~1 in 2 banked Americans, and AI firms now ~20% of new customers — a fresh demand vector beyond consumer fintech.',
      'A genuine quality turn: Sacra-est. ~$546m ARR up ~40% at ~80% gross margin, flipping from a ~$50m 2024 operating loss to full-year adj-EBITDA profitability in 2025 — the new SaaS suite (~+90%/yr) is doing the work.',
      'Live secondary demand at $8bn (up 31% off $6.1bn) with a credible IPO path — strategic and institutional appetite for the paper is real, even if the mark is a tender, not a priced primary.',
    ],
    caseAgainst: [
      'The price is a SOFT secondary mark: $8bn (≈14.7x Sacra-est. ARR) is an employee-tender clearing level, not a priced primary — and it is still ~40% below the 2021 $13.4bn peak even after ARR more than doubled. That is multiple compression, not a "reasonable reset" to underwrite off.',
      'The growth is concentrated and the base is decelerating: ~80% of ARR is legacy data-aggregation (2023 group growth ~12%); the headline ~40% leans on the ~20% new suite. If new-product growth normalises, blended growth falls back toward the legacy rate.',
      'No disclosure and no fit: ARR, margin and the 80/20 split are all Sacra ESTIMATES (Plaid discloses no audited financials to minority holders), NRR is not disclosed, CFPB 1033 is a live model risk — and Plaid is US-headquartered, outside the GCC/MENA mandate. A minority secondary at $8bn also leaves the return tight vs the 22% hurdle.',
    ],
    leadership: [
      { name: 'Zach Perret', role: 'Co-founder & CEO', note: 'Long-tenured founder; led the pivot from aggregation to a multi-product SaaS suite' },
      { name: 'William Hockey', role: 'Co-founder', note: 'Co-founded Plaid; later stepped back from day-to-day' },
      { name: 'Seun Sodipo', role: 'CFO', note: 'Credited with driving the 2025 adj-EBITDA profitability turn' },
    ],
    leadershipGaps: 'Deep founder-led team and institutional governance; the diligence ask is company-disclosed (not analyst-estimated) financials and an audited NRR/loss-adjacent KPI set for a minority holder.',
    legalStanding: 'No adverse media or sanctions exposure; well-governed US entity under CFPB / US financial-data regulation. The open regulatory item is the contested CFPB 1033 data-access rulemaking.',
    valuationVerdict:
      'A high-quality, now-profitable category leader — but the live entry is an $8bn SECONDARY tender (≈14.7x Sacra-est. ARR), a soft mark still ~40% below the 2021 peak after ARR doubled. Quality is real; the price is a tender-clearing level, the financials are analyst-estimated not disclosed, ~80% of ARR is decelerating legacy, and the geography is outside the mandate.',
    limitations: [
      'ARR, growth, ~80% gross margin and the 80/20 legacy/new split are Sacra ESTIMATES — Plaid discloses no audited financials.',
      'The live mark is a SECONDARY tender ($8bn), not a priced primary; the Apr-2025 $6.1bn round was substantially RSU-tax/employee liquidity.',
      'NRR and line-level revenue mix are not disclosed; revenue-line shares are estimated.',
      'US geography is outside the GCC/MENA mandate; return is tight for a minority at $8bn.',
    ],
    icThesis:
      'Not a primary fit (geography): Plaid is the best-in-class US open-banking rail and a sharp benchmark for the GCC open-banking thesis (cf. Lean) — but the live $8bn entry is a soft secondary mark on analyst-estimated financials, ~40% below the 2021 peak with ~80% of ARR decelerating. Interesting only as a thesis benchmark or a co-invest with an explicit mandate-geography exception and contractual access to company-disclosed financials.',
    useOfFunds: 'Secondary / employee tender — no primary proceeds. Any future primary would fund the new-SaaS suite (payments, anti-fraud, identity, underwriting) and pre-IPO scaling.',
    proposedTerms: [
      { label: 'Instrument', value: 'Secondary (employee tender) — no primary on offer' },
      { label: 'Status', value: 'Review — geography outside mandate; quality not in question, price/disclosure are' },
      { label: 'Protections', value: 'Information rights limited in a secondary; push for company-disclosed financials as a condition' },
      { label: 'Conditions to close', value: 'Disclosed (not estimated) ARR/margin, NRR, line-level mix; mandate-geography exception' },
    ],
    riskRegister: [
      { risk: 'Soft entry mark (secondary)', severity: 'high', likelihood: 'high', impact: '$8bn is a tender-clearing level (≈14.7x est. ARR), not a priced primary; downside if the next mark resets', mitigation: 'Discipline entry; treat $8bn as a ceiling not a floor', monitoring: 'Re-run returns at agreed entry vs hurdle' },
      { risk: 'No disclosed financials', severity: 'high', likelihood: 'high', impact: 'ARR/margin/split are Sacra estimates; a minority holder underwrites on third-party numbers', mitigation: 'Condition close on company-disclosed audited financials and NRR', monitoring: 'Quarterly company reporting if granted' },
      { risk: 'Geography / mandate', severity: 'high', likelihood: 'high', impact: 'US HQ outside GCC/MENA mandate', mitigation: 'Explicit mandate-scope exception required', monitoring: 'Mandate review' },
      { risk: 'Growth concentration', severity: 'medium', likelihood: 'medium', impact: '~80% of ARR is decelerating legacy; blended growth falls if the new suite normalises', mitigation: 'Diligence new-product cohort durability', monitoring: 'New-suite share of ARR each period' },
      { risk: 'CFPB 1033 data-access regulation', severity: 'medium', likelihood: 'medium', impact: 'Permissioning/liability/pricing changes to the aggregation model', mitigation: 'Diversified product mix beyond aggregation', monitoring: 'Rulemaking tracking' },
    ],
    recommendationSummary:
      'Review — a category-defining, now-profitable US open-banking leader, but the live entry is a SOFT $8bn secondary tender (≈14.7x Sacra-ESTIMATED ARR), still ~40% below the 2021 peak after ARR doubled, with ~80% of ARR in decelerating legacy aggregation, no company-disclosed financials, and a US HQ outside the GCC/MENA mandate. Treat as a thesis benchmark or a co-invest with an explicit geography exception and disclosure conditions.',
  },
  createdAt: '2026-06-04',
}
