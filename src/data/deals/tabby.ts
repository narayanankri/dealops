import type { Deal } from '@/types'

// Authored against AUTHORING.md, then revised after a Director critique pass (CRITIQUE.md).
// Key corrections from that review: (1) group net revenue is NOT disclosed — the audited figures
// are the KSA subsidiary (Tabby Financing Co. CJSC); (2) the live mark is the Oct-2025 secondary at
// ~$4.5bn, not the Feb-2025 $3.3bn primary; (3) a lender's gating numbers — cost of risk and the
// SAMA debt-ceiling breach — are surfaced, not omitted.
const TC_E = 'https://techcrunch.com/2025/02/11/tabby-lands-160m-at-a-3-3b-valuation-as-it-expands-beyond-bnpl/'
const TC_C = 'https://techcrunch.com/2023/01/17/tabby-raises-58m-at-660m-valuation-as-paypal-ventures-makes-first-investment-in-the-gcc/'
const TC_B = 'https://techcrunch.com/2022/03/06/sequoia-capital-india-stv-back-dubai-based-bnpl-provider-tabby-in-54m-extension-round/'
const BBG_SEC = 'https://www.bloomberg.com/news/articles/2025-10-28/gulf-startup-tabby-nabs-4-5-billion-valuation-in-secondary-sale'
const FWD_KSA = 'https://www.fwdstart.me/p/tabby-saudi-arm-posts-55m-profit-on-378m-revenue-in-2025-results'
const TERMSHEET = 'https://termsheet.substack.com/p/tabby-vs-tamara-gmv-and-market-share'

export const tabby: Deal = {
  id: 'tabby',
  name: 'Tabby',
  oneLiner: 'MENA’s most valuable fintech — BNPL leader expanding into cards, wallet and money management',
  sector: 'FinTech',
  geography: 'Saudi Arabia',
  region: 'GCC',
  stage: 'Pre-IPO',
  foundedYear: 2019,
  status: 'ready',
  ticketUSDm: 160,
  instrument: 'Preferred',
  controlPosture: 'significant-minority',
  ask: {
    askValuationUSDm: 4500,
    series: 'Secondary',
    date: 'Oct 2025',
  },
  roundHistory: [
    { series: 'Series E (last primary)', date: 'Feb 2025', raisedUSDm: 160, postMoneyUSDm: 3300, leadInvestors: ['Blue Pool Capital', 'Hassana'], citation: { source: 'TechCrunch', url: TC_E } },
    { series: 'Series D', date: 'Oct 2023', raisedUSDm: 200, postMoneyUSDm: 1500, leadInvestors: ['Wellington Management', 'STV'], citation: { source: 'TechCrunch', url: TC_E } },
    { series: 'Series C', date: 'Jan 2023', raisedUSDm: 58, postMoneyUSDm: 660, leadInvestors: ['Sequoia Capital India', 'STV', 'PayPal Ventures'], citation: { source: 'TechCrunch', url: TC_C } },
    { series: 'Series B (ext)', date: 'Mar 2022', raisedUSDm: 54, leadInvestors: ['Sequoia Capital India', 'STV'], citation: { source: 'TechCrunch', url: TC_B } },
  ],
  totalRaisedUSDm: 602,
  currentValuationUSDm: 4500,
  vitals: {
    size: { label: 'KSA-arm revenue (audited FY25)', value: '$378m', trend: 'up', basis: 'stated', source: 'fwdstart', url: FWD_KSA, note: 'Audited Saudi subsidiary only (excl. UAE/Kuwait/holdco). Group net revenue not disclosed.' },
    growth: { label: 'KSA-arm revenue YoY', value: '+42%', trend: 'up', basis: 'stated', source: 'fwdstart', url: FWD_KSA, note: '$267m → $378m; net income +83% ($30m → $55m). Group GMV reportedly ~doubled since the Oct-23 round.' },
    unitEconomics: { label: 'Cost of risk (loss rate)', value: 'Not disclosed', basis: 'estimated', note: 'The gating number for a BNPL credit book — net charge-offs / provisioning not public. KSA-arm net margin ~15% is post-provision but not decomposed.' },
    quality: { label: 'Repeat rate / active users', value: 'Not disclosed', basis: 'estimated', note: '15m is cumulative registered users; transacting/active % and repeat-purchase rate are not published.' },
  },
  headlineMetrics: [
    { label: 'KSA-arm revenue (FY25, audited)', value: '$378m', trend: 'up', basis: 'stated', source: 'fwdstart', url: FWD_KSA },
    { label: 'KSA-arm net profit (FY25)', value: '$55m', trend: 'up', basis: 'stated', source: 'fwdstart', url: FWD_KSA },
    { label: 'Annualised GMV (Tabby)', value: '$10bn+', trend: 'up', basis: 'stated', source: 'TechCrunch', url: TC_E },
    { label: 'Registered users', value: '15m', basis: 'stated', source: 'TechCrunch', url: TC_E },
    { label: 'Merchant partners', value: '40,000+', basis: 'stated', source: 'TechCrunch', url: TC_E },
    { label: 'KSA-arm net debt', value: '$689m', trend: 'up', basis: 'stated', source: 'fwdstart', url: FWD_KSA },
  ],
  news: [
    { date: 'Oct 2025', headline: '$4.5bn secondary share sale (HSG, Boyu buying from existing holders; no primary proceeds)', source: 'Bloomberg', url: BBG_SEC },
    { date: 'FY2025', headline: 'KSA subsidiary posts audited $55m net profit on $378m revenue (from $30m / $267m in FY24); $689m net debt flagged vs SAMA ceiling', source: 'fwdstart', url: FWD_KSA },
    { date: 'Feb 2025', headline: '$160m Series E at $3.3bn — last primary round; banks engaged for a Saudi IPO', source: 'TechCrunch', url: TC_E },
  ],
  peers: [
    { name: 'Affirm', public: true, evRevenue: 5.0, revGrowthPct: 38, ebitdaMarginPct: 4, scaleUSDm: 2600, basis: 'stated', rationale: 'US BNPL pure-play; closest listed comparable on growth' },
    { name: 'Block (Afterpay)', public: true, evRevenue: 3.5, revGrowthPct: 18, ebitdaMarginPct: 16, scaleUSDm: 24000, basis: 'stated', rationale: 'BNPL inside a payments platform; anchors the low/profitable end' },
    { name: 'Nubank', public: true, evRevenue: 5.8, revGrowthPct: 40, ebitdaMarginPct: 22, scaleUSDm: 12000, basis: 'stated', rationale: 'EM digital-bank scale story; supports the multi-product thesis' },
    { name: 'Klarna', public: true, evRevenue: 4.0, revGrowthPct: 24, ebitdaMarginPct: 8, scaleUSDm: 2800, basis: 'stated', rationale: 'Global BNPL; recently listed, mid-range multiple' },
    { name: 'Tamara', public: false, evRevenue: 8.5, revGrowthPct: 55, ebitdaMarginPct: -4, scaleUSDm: 250, basis: 'estimated', rationale: 'Direct Saudi BNPL peer; #2 in the same market' },
  ],
  assumptions: {
    baseRevenueUSDm: 378,
    revGrowthPct: [38, 32, 27, 22, 18],
    ebitdaMarginPct: [14, 16, 18, 20, 22],
    taxRatePct: 15,
    waccPct: 15,
    terminalGrowthPct: 4,
    netDebtUSDm: 689,
    exitEVRevenue: 6,
    holdYears: 4,
  },
  merit: [
    { key: 'market', label: 'Market opportunity', score: 90, confidence: 'high', rationale: 'GCC consumer credit is structurally under-penetrated; Vision 2030 is pushing digital payments. Tabby + Tamara together clear ~93% of regional BNPL — so the open question is monetisation depth, not demand.' },
    { key: 'model', label: 'Business model', score: 82, confidence: 'medium', rationale: 'Merchant take-rate is the engine, extended into card interchange, subscription and a wallet (Tweeq). But Tabby’s own take-rate is undisclosed — the ~4.25% figure is a Tabby+Tamara combined-model input, not a company metric.' },
    { key: 'financial', label: 'Financial profile', score: 74, confidence: 'medium', rationale: 'The audited KSA subsidiary is profitable ($55m on $378m, FY25, +42% rev). But it carries $689m net debt and was flagged $139m over its SAMA leverage ceiling — and group financials are not disclosed.', confidenceReason: 'Only the KSA entity is audited/public; group revenue, GMV split and loss rates are undisclosed.' },
    { key: 'moat', label: 'Competitive moat', score: 82, confidence: 'high', rationale: 'Scale, a 40,000-merchant network, regional licences and the Tweeq wallet on-ramp create switching costs; the binding rivalry is Tamara and the banks on take-rate.' },
    { key: 'team', label: 'Team', score: 80, confidence: 'high', rationale: 'Founder-CEO Hosam Arab (ex-Namshi); deep institutional cap table (Blue Pool, Hassana, STV, PayPal Ventures).' },
    { key: 'valuation', label: 'Valuation', score: 42, confidence: 'medium', rationale: 'The live entry is the Oct-25 secondary at ~$4.5bn — ~13.7x EV / audited KSA-arm revenue (incl. ~$689m net debt; ~11.9x on equity alone) and richer than the $3.3bn primary; well above the listed-peer median.' },
    { key: 'exit', label: 'Exit pathway', score: 86, confidence: 'medium', rationale: 'Saudi Exchange IPO is the intended exit (banks engaged), but timing is "2026" and unconfirmed — the bull case leans on liquidity that is not underwritten.' },
  ],
  financials: {
    years: ['FY22', 'FY23', 'FY24', 'FY25', 'FY26E'],
    revenue: [120, 180, 267, 378, 510],
    ebitda: [-20, 8, 30, 55, 92],
  },
  capTable: [
    { holder: 'Founders & management', pct: 18, type: 'founder' },
    { holder: 'Blue Pool Capital & Hassana', pct: 22, type: 'investor' },
    { holder: 'STV, PayPal Ventures, Mubadala & earlier', pct: 48, type: 'investor' },
    { holder: 'Employee option pool', pct: 12, type: 'esop' },
  ],
  dataTrust: {
    fields: [
      { label: 'KSA subsidiary results ($378m rev / $55m profit, FY25)', basis: 'stated', confidence: 'high', source: 'fwdstart (EY-audited entity)', url: FWD_KSA },
      { label: 'Current mark ($4.5bn secondary, Oct-25)', basis: 'stated', confidence: 'high', source: 'Bloomberg', url: BBG_SEC },
      { label: 'Funding rounds (Series B–E)', basis: 'stated', confidence: 'high', source: 'TechCrunch', url: TC_E },
      { label: 'GMV / users / merchants', basis: 'stated', confidence: 'medium', source: 'TechCrunch', url: TC_E, method: 'Company-reported; the widely-cited ~$13.2bn GMV is Tabby+Tamara combined, not Tabby alone.' },
      { label: 'Group net revenue & GMV split', basis: 'estimated', confidence: 'low', method: 'Not disclosed; only the KSA subsidiary is audited. UAE/Kuwait/holdco contribution unknown.' },
      { label: 'Cost of risk / loss rate', basis: 'estimated', confidence: 'low', method: 'Not disclosed — the gating number for a BNPL credit book; flagged for the data room.' },
      { label: 'Tabby take-rate', basis: 'inferred', confidence: 'low', method: 'The ~4.25% figure is a Tabby+Tamara combined-model input (Termsheet), not Tabby’s disclosed rate.', source: 'Termsheet', url: TERMSHEET },
      { label: 'SAMA debt-ceiling breach (+$139m)', basis: 'stated', confidence: 'medium', source: 'fwdstart (auditor note)', url: FWD_KSA },
    ],
  },
  shariaScreen: {
    status: 'mixed',
    note: 'The consumer product is an interest-free "Pay in 4" instalment model that charges no consumer interest, which reads as Shariah-compliant at the customer layer; however the KSA entity funds receivables with $689m of net debt whose structure is not disclosed as Shariah-compliant, leaving the funding layer unverified.',
    source: 'fwdstart (auditor note on KSA net debt)',
    url: FWD_KSA,
  },
  narrative: {
    whyNow:
      'The opportunity surfaces following the October 2025 secondary sale that marked Tabby at approximately $4.5bn and the audited FY2025 KSA-subsidiary results showing $55m net profit on $378m revenue, as banks are engaged for a planned Saudi Exchange listing.',
    barriers: [
      { axis: 'Regulatory licence', rating: 'high', note: 'Operation as a consumer lender requires SAMA and UAE Central Bank authorisation plus the Tweeq stored-value licence, each a multi-year approval that constrains new entrants.' },
      { axis: 'Scale and merchant network', rating: 'high', note: 'A network of 40,000+ merchants including Amazon, Adidas, IKEA and Noon, combined with approximately 93% of GCC BNPL volume shared with Tamara, creates distribution that a new entrant cannot assemble quickly.' },
      { axis: 'Capital intensity', rating: 'medium', note: 'A balance-sheet credit book requires substantial funding capacity, evidenced by the $689m of net debt carried by the KSA entity, raising the cost of entry for sub-scale competitors.' },
      { axis: 'Data and underwriting', rating: 'medium', note: 'Repeat-transaction history across 15m registered users supports proprietary underwriting, though the cost of risk and loss curves are undisclosed and the advantage is therefore unquantified.' },
      { axis: 'Switching costs', rating: 'medium', note: 'Card, subscription (Tabby Plus) and wallet (Tweeq) layers raise consumer and merchant switching costs, but the BNPL transaction itself remains low-commitment.' },
    ],
    profile:
      'Tabby is a consumer-finance platform founded in Dubai in 2019 and redomiciled to Riyadh in 2023 ahead of a planned Saudi IPO, operating in Saudi Arabia, the UAE and Kuwait. It originates short-term instalment credit ("Pay in 4") at 40,000+ merchants — Amazon, Adidas, IKEA, Samsung, Noon — and is layering a card (offline Visa spend), a subscription (Tabby Plus), instalment "Shop", and a wallet acquired via Tweeq (2024). Its audited Saudi subsidiary did $378m revenue / $55m net profit in FY25; the consolidated group is not separately disclosed.',
    revenueModel: 'Predominantly merchant take-rate on instalment volume, extended into consumer fees, card interchange, subscription and wallet/float income. Tabby’s own blended take-rate is undisclosed.',
    revenueLines: [
      { name: 'Merchant commission (BNPL)', sharePct: 75, basis: 'estimated', description: 'Take-rate on merchant instalment volume — the core engine. Tabby does not publish its rate; the ~4.25% often cited is a Tabby+Tamara combined-model input, not a disclosed Tabby figure.' },
      { name: 'Consumer & processing fees', sharePct: 8, basis: 'estimated', description: 'Flat per-order fee (~SAR 1) plus late/processing fees on instalment plans.' },
      { name: 'Card interchange (Tabby Card)', sharePct: 7, basis: 'estimated', description: 'Interchange on offline Visa spend via the Tabby Card, extending BNPL economics in-store.' },
      { name: 'Wallet & float (Tweeq)', sharePct: 7, basis: 'estimated', description: 'Stored-value fees and float income on the KSA wallet acquired in 2024 — early-stage; a 2024 acquisition contributing this share is an assumption, not disclosed.' },
      { name: 'Subscription (Tabby Plus)', sharePct: 3, basis: 'estimated', description: 'Consumer subscription bundling rewards and benefits; nascent.' },
    ],
    marketRead:
      'The principal uncertainty is monetisation depth, not demand: GCC card/credit penetration is low and Vision 2030 is pushing digital payments. The material questions are (1) Tabby’s actual (undisclosed) take-rate and its trend, (2) cost of risk on the credit book, and (3) whether the wallet/card extension monetises before BNPL margin compresses. The audited KSA arm grew revenue +42% in FY25, which indicates the core engine is working.',
    regulatory:
      'Regulated under SAMA (KSA) and the UAE Central Bank; holds the Tweeq stored-value licence. Note the auditor flagged the KSA entity ~$139m over its SAMA net-debt ceiling — a live regulatory/leverage item, not just a moat.',
    caseFor: [
      'The audited core is profitable and growing fast: the KSA subsidiary did $378m revenue / $55m net profit in FY25, up from $267m / $30m — +42% revenue, +83% net income, EY-audited (not "reportedly").',
      'Category leadership with real switching costs: ~93% of GCC BNPL with Tamara, 40,000 merchants, regional licences, and a wallet on-ramp (Tweeq) widening monetisation beyond the BNPL take-rate.',
      'A visible exit: a Saudi Exchange IPO is the stated path with banks engaged — and a recent $4.5bn secondary shows live demand for the paper.',
    ],
    caseAgainst: [
      'Group economics are opaque: only the KSA subsidiary is audited; consolidated revenue, GMV split (UAE/Kuwait) and — critically for a lender — cost of risk and NPLs are undisclosed.',
      'Leverage flag: the KSA entity carries $689m net debt and was flagged ~$139m over its SAMA ceiling — a funding-cost and regulatory risk a balance-sheet lender cannot disregard.',
      'Priced for perfection: the live entry is a ~$4.5bn secondary (≈13.7x EV / audited KSA-arm revenue, incl. net debt), so reconciled value sits well below it — and a $160m secondary ticket buys ~3.6% with no balance-sheet diligence rights and sits near the 10% fund concentration cap.',
    ],
    leadership: [
      { name: 'Hosam Arab', role: 'Co-founder & CEO', note: 'Ex-Namshi; long regional e-commerce/fintech track record' },
      { name: 'Daniil Barkalov', role: 'Co-founder' },
    ],
    leadershipGaps: 'Deep institutional cap table and board; a named independent CRO and audited group-level loss-rate reporting are the diligence items for a credit business in breach of a leverage ceiling.',
    legalStanding: 'No adverse media or sanctions exposure; regulated entity with disclosed SAMA/UAECB licences. The open regulatory item is the flagged SAMA net-debt ceiling breach at the KSA entity.',
    valuationVerdict:
      'The core (KSA arm) is profitable and fast-growing, but the live entry is a secondary at ~$4.5bn (≈13.7x EV / audited KSA-arm revenue, incl. net debt), with group economics and cost of risk undisclosed and a leverage-ceiling breach outstanding. The asset quality is sound; the constraints are the price and the disclosure gaps.',
    limitations: [
      'Only the KSA subsidiary is audited; group revenue, GMV and loss rates are undisclosed.',
      'Tabby’s take-rate and revenue-line mix are inferred/estimated; the 4.25% is a combined-peer model input.',
      'The live mark is a secondary; a $160m secondary ticket carries no primary-diligence rights.',
    ],
    icThesis:
      'Own the profitable, scaled leader in GCC consumer finance into a Saudi IPO — but only at a disciplined entry below the $4.5bn secondary mark, with contractual access to group-level financials and cost-of-risk data and clarity on the SAMA leverage breach.',
    useOfFunds: 'Secondary (liquidity to existing holders) — no primary proceeds; any primary would fund wallet/card build-out and receivables capacity.',
    proposedTerms: [
      { label: 'Instrument', value: 'Secondary preferred (no primary on offer)' },
      { label: 'Ownership', value: '~3.6% at the $4.5bn mark' },
      { label: 'Protections', value: 'Information rights, IPO ratchet — limited in a secondary' },
      { label: 'Governance', value: 'Observer at best (secondary)' },
      { label: 'Conditions to close', value: 'Group financials, cost-of-risk data, SAMA-breach remediation status' },
    ],
    riskRegister: [
      { risk: 'Cost of risk (undisclosed)', severity: 'high', likelihood: 'high', impact: 'BNPL loss rates could undermine the apparent profitability', mitigation: 'Gate diligence on net charge-offs, DPD buckets, provisioning', monitoring: 'Monthly cohort loss reporting' },
      { risk: 'Leverage / SAMA breach', severity: 'high', likelihood: 'medium', impact: '$689m net debt, ~$139m over the SAMA ceiling — funding cost and regulatory risk', mitigation: 'Confirm remediation/waiver and securitisation maturity wall', monitoring: 'Leverage vs ceiling each quarter' },
      { risk: 'Entry price / secondary', severity: 'high', likelihood: 'high', impact: '~$4.5bn (≈13.7x EV/revenue) with no primary-diligence rights', mitigation: 'Discipline entry; negotiate information rights', monitoring: 'Re-run returns at agreed entry' },
      { risk: 'Concentration', severity: 'medium', likelihood: 'high', impact: 'Ticket near the 10% fund cap', mitigation: 'Co-invest sleeve; smaller primary', monitoring: 'Portfolio construction' },
    ],
    recommendationSummary:
      'Review — a profitable, fast-growing core at a full secondary mark, with group economics and cost of risk undisclosed and a leverage-ceiling breach outstanding. Resolve disclosure, the SAMA breach, and entry price.',
  },
  createdAt: '2026-05-22',
}
