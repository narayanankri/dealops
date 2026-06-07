import type { Deal } from '@/types'

// Authored against AUTHORING.md, then revised after a Director critique pass (CRITIQUE.md).
// Key corrections from that review: (1) Tamara is now genuinely PROFITABLE — FY2025 net profit
// SAR 193.35m (~$51.6m) reversing a SAR 130m FY24 loss — the old "approaching profitability" was
// wrong; (2) the $1bn mark is a STALE Dec-2023 Series C valuation (~2.5 yrs old, no fresh equity
// round) and must be flagged, not presented as a live mark; (3) this is a balance-sheet lender —
// the $2.4bn debt facility, not net cash, defines the funding profile, and cost of risk is the
// gating number; (4) the live story is the debt-funded turn to profit on a stale equity mark.
const TC_C = 'https://www.fintechfutures.com/bnpl-payments/saudi-bnpl-fintech-tamara-lands-340m-series-c-funding-at-1bn-valuation'
const TAMARA_C = 'https://tamara.co/en-sa/blog-post/tamara-series-c'
const TAMARA_B = 'https://tamara.co/en-SA/tamara-series-b'
const MENA_A = 'https://www.menabytes.com/tamara-series-a/'
const TAMARA_FAC = 'https://tamara.co/en-sa/blog-post/tamara-secures-up-to-2-4-billion-dollar-facility'
const WAMDA_FAC = 'https://www.wamda.com/2025/09/tamara-secures-record-24-billion-facility-backed-goldman-sachs'
const ARGAAM_FY = 'https://www.argaam.com/en/financial-reports/company-report/18234/2025/1'
const FWD_9M = 'https://www.fwdstart.me/p/saudi-bnpl-tamara-turns-profitable-in-9m-2025-as-revenue-doubles-and-credit-costs-fall'
const TERMSHEET = 'https://termsheet.substack.com/p/tabby-vs-tamara-gmv-and-market-share'

export const tamara: Deal = {
  id: 'tamara',
  name: 'Tamara',
  oneLiner: 'Saudi Arabia’s first fintech unicorn — #2 GCC BNPL, now profitable on a $2.4bn debt engine',
  sector: 'FinTech',
  geography: 'Saudi Arabia',
  region: 'GCC',
  stage: 'Series C',
  foundedYear: 2020,
  status: 'ready',
  ticketUSDm: 120,
  instrument: 'Preferred',
  controlPosture: 'significant-minority',
  ask: {
    // Illustrative primary; sets the post-money to the only public mark (Dec-2023 Series C, $1bn) —
    // which is ~2.5 yrs stale. A fresh round would almost certainly re-rate given the turn to profit.
    askValuationUSDm: 1000,
    series: 'Series D (illustrative)',
    raisingUSDm: 150,
    date: 'Illustrative — no round announced',
    lastRoundUSDm: 340,
    lastRoundDate: 'Dec 2023 (Series C)',
    leadInvestors: ['SNB Capital', 'Sanabil Investments'],
  },
  roundHistory: [
    { series: 'Series C', date: 'Dec 2023', raisedUSDm: 340, postMoneyUSDm: 1000, leadInvestors: ['SNB Capital', 'Sanabil Investments', 'Shorooq Partners', 'Coatue', 'Checkout.com'], citation: { source: 'FintechFutures / Tamara', url: TC_C } },
    { series: 'Series B', date: 'Aug 2022', raisedUSDm: 100, leadInvestors: ['Sanabil Investments', 'Coatue', 'Checkout.com', 'Shorooq Partners'], citation: { source: 'Tamara', url: TAMARA_B } },
    { series: 'Series A', date: 'Apr 2021', raisedUSDm: 110, leadInvestors: ['Checkout.com'], citation: { source: 'MENAbytes', url: MENA_A } },
    { series: 'Seed', date: 'Jan 2021', raisedUSDm: 6, leadInvestors: ['Impact46'], citation: { source: 'MENAbytes', url: MENA_A } },
  ],
  totalRaisedUSDm: 500,
  currentValuationUSDm: 1000,
  vitals: {
    size: { label: 'Total revenue (FY2025)', value: '~$256m', trend: 'up', basis: 'inferred', source: 'Argaam', url: ARGAAM_FY, note: 'SAR ~961m total = net financing & investment income SAR 762.84m + other service revenue SAR 198.3m, at SAR/USD 3.75. Net financing income alone was SAR 762.84m (~$203m), +143.8% YoY. GMV not separately disclosed (combined Tabby+Tamara 2025 GMV ~$13.2bn per Termsheet).' },
    growth: { label: 'Revenue YoY (Q3-25) / net-income swing', value: '+114% rev; loss → profit', trend: 'up', basis: 'stated', source: 'fwdstart / Argaam', url: ARGAAM_FY, note: 'Q3-25 revenue SAR 333.2m vs 155.5m (+114%). FY25 net profit SAR 193.35m vs SAR 130.13m loss FY24 — a genuine turn to profit, not "approaching".' },
    unitEconomics: { label: 'Take-rate / credit losses', value: '~4.25% blended take-rate; ECL falling', trend: 'up', basis: 'inferred', source: 'Termsheet / fwdstart', url: FWD_9M, note: 'Take-rate ~4.25% is a Tabby+Tamara combined-model input (Termsheet), not Tamara-disclosed (merchant rates ~6–7% small, lower for large retailers). Expected credit losses fell to SAR 70.3m (9M-25) from SAR 176.4m (9M-24) — a 60% drop and the core driver of the turn. Late fees eliminated.' },
    quality: { label: 'Repeat rate / active %', value: 'Not disclosed', basis: 'estimated', note: '20m+ registered users (Sep-25) is cumulative; transacting/active % and repeat-purchase rate not published. ~1/3 of users reportedly start shopping in-app (Series C-era), an engagement proxy but not a current repeat rate.' },
  },
  headlineMetrics: [
    { label: 'Net profit (FY2025)', value: 'SAR 193m (~$51.6m)', trend: 'up', basis: 'stated', source: 'Argaam', url: ARGAAM_FY },
    { label: 'Net financing income (FY2025)', value: 'SAR 763m (~$203m, +144%)', trend: 'up', basis: 'stated', source: 'Argaam', url: ARGAAM_FY },
    { label: 'Q3-25 revenue', value: 'SAR 333m (+114% YoY)', trend: 'up', basis: 'stated', source: 'fwdstart', url: FWD_9M },
    { label: 'Registered users', value: '20m+', trend: 'up', basis: 'stated', source: 'Tamara', url: TAMARA_FAC },
    { label: 'Merchant partners', value: '87,000+', trend: 'up', basis: 'stated', source: 'Tamara', url: TAMARA_FAC },
    { label: 'Debt facility', value: '$2.4bn (Goldman/Citi/Apollo)', basis: 'stated', source: 'Wamda', url: WAMDA_FAC },
  ],
  news: [
    { date: 'Mar 2026', headline: 'FY2025 results: net profit SAR 193m (~$51.6m) vs SAR 130m loss in FY24; net financing income +144% to SAR 763m', source: 'Argaam', url: ARGAAM_FY },
    { date: 'Nov 2025', headline: '9M-25 turns profitable: net income SAR 92.4m vs SAR 164m loss; Q3 revenue +114%; credit losses down 60%', source: 'fwdstart', url: FWD_9M },
    { date: 'Sep 2025', headline: 'Secured up to $2.4bn Shariah-compliant asset-backed facility (Goldman, Citi, Apollo); refinances/upsizes prior $500m', source: 'Wamda', url: WAMDA_FAC },
    { date: 'Dec 2023', headline: '$340m Series C at $1bn post-money — first Saudi fintech unicorn (SNB Capital, Sanabil lead)', source: 'FintechFutures', url: TC_C },
  ],
  peers: [
    { name: 'Tabby', public: false, evRevenue: 11.8, revGrowthPct: 42, ebitdaMarginPct: 15, scaleUSDm: 378, basis: 'estimated', rationale: 'Direct Saudi BNPL leader (#1); larger, profitable KSA arm, marked at ~$4.5bn (Oct-25 secondary) — the head-to-head benchmark and the margin/scale gap Tamara must close' },
    { name: 'Affirm', public: true, evRevenue: 5.0, revGrowthPct: 38, ebitdaMarginPct: 4, scaleUSDm: 2600, basis: 'stated', rationale: 'Listed US BNPL pure-play; closest public read on growth-stage BNPL multiples' },
    { name: 'Nubank', public: true, evRevenue: 5.8, revGrowthPct: 40, ebitdaMarginPct: 22, scaleUSDm: 12000, basis: 'stated', rationale: 'EM digital-bank scale story; supports the profitable-fintech multi-product comp' },
    { name: 'Klarna', public: true, evRevenue: 4.0, revGrowthPct: 24, ebitdaMarginPct: 8, scaleUSDm: 2800, basis: 'stated', rationale: 'Global BNPL, recently listed; anchors the mid-range multiple' },
  ],
  assumptions: {
    baseRevenueUSDm: 256,
    revGrowthPct: [40, 33, 28, 23, 18],
    ebitdaMarginPct: [16, 19, 22, 24, 26],
    taxRatePct: 15,
    waccPct: 15,
    terminalGrowthPct: 4,
    netDebtUSDm: 50,
    exitEVRevenue: 6,
    holdYears: 5,
  },
  merit: [
    { key: 'market', label: 'Market opportunity', score: 86, confidence: 'high', rationale: 'Same structural GCC consumer-credit under-penetration and Vision 2030 digital-payments push as Tabby; Tabby+Tamara clear ~93% of regional BNPL (Termsheet). Demand is settled — the open question is monetisation depth and the margin gap to the leader.' },
    { key: 'model', label: 'Business model', score: 82, confidence: 'medium', rationale: 'FY25 revenue is ~82% merchant commission, ~16% customer processing fees, ~6% Murabaha financing profit (Q3-25 mix, fwdstart); late fees eliminated. The $2.4bn Goldman/Citi/Apollo facility funds receivables off balance-sheet — but it also means earnings now depend on funding cost and credit performance, not just take-rate.' },
    { key: 'financial', label: 'Financial profile', score: 80, confidence: 'high', rationale: 'Profitable: FY25 net profit SAR 193.35m (~$51.6m) reversing a SAR 130m FY24 loss; net financing income +144% to SAR 763m; expected credit losses down ~60% (SAR 176m → 70m, 9M). The turn is real and credit-led.', confidenceReason: 'FY25 P&L and credit losses are reported/audited via Argaam; GMV, blended take-rate and loss rate as a % of book are not separately disclosed.' },
    { key: 'moat', label: 'Competitive moat', score: 74, confidence: 'medium', rationale: 'KSA brand, 87,000-merchant network, SAMA licence, sovereign backing (Sanabil/SNB) and a $2.4bn funded balance sheet create scale and switching costs — but Tamara is the #2 to a larger, higher-margin Tabby, so the moat is positional, not dominant.' },
    { key: 'team', label: 'Team', score: 78, confidence: 'medium', rationale: 'Founder-CEO Abdulmajeed Alsukhan; deep sovereign/strategic cap table (Sanabil, SNB Capital, Coatue, Checkout.com). A named, independent CRO is the diligence gap for a now-leveraged lender.' },
    { key: 'valuation', label: 'Valuation', score: 58, confidence: 'low', rationale: 'The only public mark is the Dec-2023 Series C $1bn post — ~2.5 yrs stale, struck pre-profitability. At ~$256m FY25 revenue that is ~3.9x — cheap vs Tabby’s ~11.8x — but a fresh round would re-rate, so the $1bn is not a real entry price.' },
    { key: 'exit', label: 'Exit pathway', score: 80, confidence: 'medium', rationale: 'Follow Tabby toward a Saudi Exchange IPO (Tabby has banks engaged), or a strategic sale to a regional bank / payments group. Profitability materially strengthens IPO-readiness, but no Tamara-specific listing process is confirmed.' },
  ],
  financials: {
    years: ['FY23', 'FY24', 'FY25', 'FY26E', 'FY27E'],
    revenue: [70, 130, 256, 358, 476],
    ebitda: [-30, -25, 60, 80, 120],
  },
  dataTrust: {
    fields: [
      { label: 'FY2025 net profit & net financing income (SAR 193m / SAR 763m)', basis: 'stated', confidence: 'high', source: 'Argaam (FY2025 results)', url: ARGAAM_FY },
      { label: '9M-25 profit, Q3 revenue +114%, credit losses −60%', basis: 'stated', confidence: 'high', source: 'fwdstart', url: FWD_9M },
      { label: 'FY2025 total revenue (~$256m)', basis: 'inferred', confidence: 'medium', method: 'SAR 762.84m net financing income + SAR 198.3m other service revenue ≈ SAR 961m, at SAR/USD 3.75 ≈ $256m (Argaam).', source: 'Argaam', url: ARGAAM_FY },
      { label: '$2.4bn debt facility ($1.4bn initial + $1bn pending)', basis: 'stated', confidence: 'high', source: 'Wamda / Tamara', url: WAMDA_FAC },
      { label: 'Series C $340m at $1bn (Dec 2023)', basis: 'stated', confidence: 'high', source: 'FintechFutures / Tamara', url: TC_C },
      { label: 'Total equity raised (~$500m)', basis: 'stated', confidence: 'medium', source: 'Tamara (Series C announcement, since-inception)', url: TAMARA_C, method: 'Series A $110m was debt+equity blended (split undisclosed), so the equity total is approximate.' },
      { label: 'Users 20m+ / merchants 87,000+', basis: 'stated', confidence: 'medium', source: 'Tamara', url: TAMARA_FAC },
      { label: 'Current valuation', basis: 'estimated', confidence: 'low', method: 'No fresh equity round since Dec-2023; the $1bn is a ~2.5-yr-old, pre-profitability mark. A re-rated mark would likely be higher given the turn to profit but is not public.' },
      { label: 'Blended take-rate (~4.25%) / GMV', basis: 'inferred', confidence: 'low', source: 'Termsheet', url: TERMSHEET, method: 'Take-rate is a Tabby+Tamara combined-model input; per-company GMV and Tamara’s own take-rate are not disclosed.' },
      { label: 'Repeat rate / active-user %', basis: 'estimated', confidence: 'low', method: 'Not disclosed; 20m+ is cumulative registered users. Flagged for the data room.' },
    ],
  },
  capTable: [
    { holder: 'Founders & management', pct: 17, type: 'founder' },
    { holder: 'Sanabil & SNB Capital', pct: 28, type: 'investor' },
    { holder: 'Coatue, Checkout.com & earlier', pct: 43, type: 'investor' },
    { holder: 'Employee option pool', pct: 12, type: 'esop' },
  ],
  shariaScreen: {
    status: 'compliant',
    note: 'The core product is Shariah-compliant instalment credit with Murabaha financing profit and no late fees, and the September 2025 $2.4bn asset-backed facility was structured as Shariah-compliant, so both the revenue model and the funding layer read as compliant.',
    source: 'Wamda ($2.4bn Shariah-compliant facility)',
    url: WAMDA_FAC,
  },
  narrative: {
    whyNow:
      'The opportunity surfaces following Tamara’s turn to profitability in FY2025 (net profit SAR 193.35m, reversing a SAR 130m FY2024 loss) on the back of the September 2025 $2.4bn asset-backed facility, against a still-stale Dec-2023 $1bn equity mark that a fresh round would likely re-rate.',
    barriers: [
      { axis: 'Regulatory licence', rating: 'high', note: 'Operation as a SAMA-regulated consumer lender requires authorisation that takes years to secure, constraining new entrants in the core KSA market.' },
      { axis: 'Funding access', rating: 'high', note: 'The $2.4bn Shariah-compliant asset-backed facility from Goldman Sachs, Citi and Apollo, backed by Sanabil and SNB Capital, is access to scaled receivables funding that sub-scale competitors cannot readily replicate.' },
      { axis: 'Scale and merchant network', rating: 'medium', note: 'A network of 87,000+ merchants and 20m+ registered users, with approximately 93% of GCC BNPL shared with Tabby, provides distribution, though Tamara remains the smaller of the two leaders.' },
      { axis: 'Data and underwriting', rating: 'medium', note: 'A turn to profit led by a 60% fall in expected credit losses (SAR 176m to SAR 70m over nine months) indicates underwriting capability, though the durability of that loss level across a cycle is unproven.' },
      { axis: 'Capital intensity', rating: 'medium', note: 'Thin shareholders’ equity of SAR 555.6m against an up-to-$2.4bn facility means leverage, not equity, funds growth, raising the bar for entrants without comparable debt access.' },
    ],
    profile:
      'Tamara is a Riyadh-headquartered BNPL and shopping platform, founded in 2020, operating in Saudi Arabia, the UAE and Kuwait. It became Saudi Arabia’s first fintech unicorn with a $340m Series C at a $1bn post-money in Dec 2023, and now serves 20m+ registered users and 87,000+ merchants. It originates Shariah-compliant instalment credit ("pay in instalments"), settling merchants weekly for a commission, and layers customer processing fees and Murabaha financing profit. In Sep 2025 it secured an up-to-$2.4bn asset-backed facility (Goldman Sachs, Citi, Apollo) that refinanced and upsized a prior $500m line — and in FY2025 it turned profitable, posting SAR 193.35m (~$51.6m) net profit versus a SAR 130m loss in FY24.',
    revenueModel: 'Predominantly merchant take-rate on instalment volume (~82% of FY25 revenue), plus customer processing fees (~16%) and Murabaha financing profit (~6%); late fees have been eliminated. The $2.4bn debt facility funds receivables, so earnings now turn on funding cost and credit performance as much as on take-rate.',
    revenueLines: [
      { name: 'Merchant commission (pay in instalments)', sharePct: 82, basis: 'stated', source: 'fwdstart (Q3-25)', url: FWD_9M, description: 'Take-rate on merchant instalment volume — the core engine; SAR 262.2m, ~79% of Q3-25 revenue (fwdstart). Tamara does not publish its own blended rate; the ~4.25% often cited is a Tabby+Tamara combined-model input.' },
      { name: 'Customer processing fees', sharePct: 12, basis: 'stated', source: 'fwdstart (Q3-25)', url: FWD_9M, description: 'Per-transaction consumer processing fees; SAR 53.3m, ~16% of Q3-25 revenue. "Other service revenues" rose 329% to SAR 198.3m in FY25, driven by higher client transaction fees.' },
      { name: 'Murabaha financing profit', sharePct: 6, basis: 'stated', source: 'fwdstart (Q3-25)', url: FWD_9M, description: 'Shariah-compliant financing margin on longer-tenor instalment products; SAR 20.3m, ~6% of Q3-25 revenue (SAR 117.8m for FY25).' },
    ],
    marketRead:
      'The principal uncertainty is monetisation depth, not demand: GCC card/credit penetration is low and Vision 2030 is pushing digital payments, and Tabby + Tamara clear ~93% of regional BNPL. The material questions for Tamara are (1) the durable margin and scale gap to Tabby (Tamara FY25 revenue ~$256m vs Tabby KSA-arm $378m), (2) cost of risk on a now-$2.4bn-debt-funded book — credit losses just fell 60%, but that level’s durability is unproven, and (3) whether the $1bn equity mark re-rates before any entry.',
    regulatory:
      'SAMA-regulated; the Shariah-compliant asset-backed structure is well-suited to the core KSA market and underpins the $2.4bn facility. As a now-leveraged consumer lender, covenant headroom on the Goldman/Citi/Apollo facility and SAMA credit-provisioning rules are live diligence items rather than moat.',
    caseFor: [
      'It is now profitable, and the turn is credit-led, not accounting-led: FY25 net profit SAR 193.35m (~$51.6m) vs a SAR 130m FY24 loss, with expected credit losses down ~60% (SAR 176m → 70m, 9M) and late fees eliminated — durable revenue, not penalty income.',
      'Top line is compounding fast: Q3-25 revenue +114% YoY (SAR 333m), net financing income +144% to SAR 763m in FY25 — the #2 is growing into, not away from, the leader.',
      'Cheap on the only public mark: the $1bn Dec-2023 post is ~3.9x FY25 revenue versus Tabby’s ~11.8x — but it is ~2.5 yrs stale and pre-profit, so the real margin of safety depends on the re-rated entry, not this number.',
      'De-risked funding: the $2.4bn Goldman/Citi/Apollo facility refinances/upsizes a prior $500m line and funds receivables growth without burning equity.',
    ],
    caseAgainst: [
      'Sustained #2 to a larger, higher-margin leader: Tamara FY25 revenue ~$256m vs Tabby’s KSA arm alone at $378m, and Tabby is marked at ~$4.5bn (Oct-25 secondary) vs Tamara’s stale $1bn — the gap is scale, margin and mark.',
      'Thin equity against heavy debt: shareholders’ equity is only SAR 555.6m (~$148m, Dec-25) against an up-to-$2.4bn facility — leverage amplifies any deterioration in cost of risk, and the recent 60% drop in credit losses is one cycle, not a trend.',
      'The $1bn is not a real entry price: it is a ~2.5-yr-old, pre-profitability mark with no fresh round; a re-rate is likely and would erode the apparent discount to Tabby — entry must be negotiated to a current mark, not assumed at $1bn.',
      'Disclosure gaps for a lender: GMV, Tamara’s own blended take-rate, loss rate as a % of book and repeat/active-user rates are undisclosed — the gating credit-quality metrics are inferred, not stated.',
    ],
    leadership: [
      { name: 'Abdulmajeed Alsukhan', role: 'Co-founder & CEO', note: 'Led the company from 2020 seed to first Saudi fintech unicorn and to FY25 profitability' },
      { name: 'Turki Bin Zarah', role: 'Co-founder' },
      { name: 'Abdulmohsen Albabtain', role: 'Co-founder' },
    ],
    leadershipGaps: 'Deep sovereign/strategic cap table and board (Sanabil, SNB Capital, Coatue, Checkout.com). For a now-leveraged consumer lender, a named independent CRO and audited group-level loss-rate-by-cohort reporting are the diligence items.',
    legalStanding: 'No adverse media or sanctions exposure; SAMA-regulated with disclosed sovereign investors. The open items are covenant/leverage headroom on the $2.4bn facility and SAMA consumer-credit provisioning compliance.',
    valuationVerdict:
      'A profitable, fast-growing #2 — FY25 net profit ~$51.6m on ~$256m revenue — sitting on a stale $1bn Dec-2023 mark (~3.9x revenue). On fundamentals it is cheap versus Tabby (~11.8x), but the $1bn is ~2.5 yrs old and pre-profit: the material question is the entry price into the next round, not the headline discount. Earnings quality has improved while the appropriate mark remains undetermined.',
    limitations: [
      'No fresh equity round since Dec-2023; the $1bn mark is stale and pre-profitability — current valuation is estimated, not stated.',
      'GMV, Tamara’s own take-rate, and loss rate as a % of book are undisclosed; the ~4.25% take-rate is a combined-peer model input.',
      'FY25 USD revenue (~$256m) is an inferred SAR→USD conversion; only SAR-denominated line items are reported.',
      'Repeat-purchase and active-user rates are not disclosed.',
    ],
    icThesis:
      'Back the profitable, fast-growing #2 in GCC consumer finance into a Saudi IPO, riding the same structural tailwind as Tabby but at a clearer margin of safety on fundamentals — conditional on negotiating entry to a current (re-rated) mark rather than the stale $1bn, and on audited cost-of-risk and covenant-headroom data given the $2.4bn debt book.',
    useOfFunds: 'KSA deepening, product diversification (new credit and payment offerings per the CEO), platform monetisation, and receivables growth alongside the $2.4bn facility.',
    proposedTerms: [
      { label: 'Instrument', value: 'Preferred growth equity' },
      { label: 'Ownership', value: '~12% (the $120m ticket on a re-rated post-money; the round itself is ~$150m — and the mark, not the stale $1bn)' },
      { label: 'Protections', value: '1x non-participating preference, anti-dilution, board seat, information rights' },
      { label: 'Governance', value: 'One board seat' },
      { label: 'Conditions to close', value: 'Current (re-rated) valuation, audited cost of risk / loss-by-cohort, $2.4bn facility covenant headroom, take-rate disclosure' },
    ],
    riskRegister: [
      { risk: 'Stale / re-rating valuation', severity: 'high', likelihood: 'high', impact: 'The $1bn is a ~2.5-yr-old pre-profit mark; a fresh round would re-rate and erode the apparent discount to Tabby', mitigation: 'Negotiate entry to a current mark; lock terms before a priced round', monitoring: 'Round signalling, secondary prints' },
      { risk: 'Cost of risk on a leveraged book', severity: 'high', likelihood: 'medium', impact: 'Equity (~$148m) is thin vs an up-to-$2.4bn facility; a credit-loss reversal would hit profit hard', mitigation: 'Gate diligence on loss-by-cohort, DPD buckets, provisioning; confirm covenant headroom', monitoring: 'Monthly cohort loss reporting; leverage vs covenants' },
      { risk: 'Sustained #2 / margin gap', severity: 'medium', likelihood: 'medium', impact: 'Scale and margin gap to a larger, richer Tabby persists', mitigation: 'KSA depth, product diversification, platform monetisation', monitoring: 'Share, revenue and take-rate vs Tabby' },
      { risk: 'Disclosure opacity (GMV / take-rate / loss rate)', severity: 'medium', likelihood: 'high', impact: 'Key lender metrics inferred, not stated', mitigation: 'Contractual information rights at close', monitoring: 'Quarterly KPI pack' },
    ],
    recommendationSummary:
      'Proceed (conditionally) — a now-profitable, fast-growing #2 in GCC BNPL (FY25 net profit ~$51.6m on ~$256m revenue) that looks cheap versus Tabby, but only at a disciplined entry to a current re-rated mark, not the stale $1bn Dec-2023 valuation. Resolve cost-of-risk disclosure and $2.4bn-facility covenant headroom before IC.',
  },
  createdAt: '2026-05-18',
}
