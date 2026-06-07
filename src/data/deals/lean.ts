import type { Deal } from '@/types'

// Authored against AUTHORING.md, then revised after a Director critique pass (CRITIQUE.md).
// Real company. Key honesty constraints (this is a deeply opaque deal):
//   (1) Valuation has NEVER been disclosed at any round — kept as a clearly-labelled estimate (~$350m) and flagged hard.
//   (2) Revenue / ARR / take-rate / gross margin / NRR are all undisclosed — set to "Not disclosed", not invented.
//   (3) The cited traction (>$2B A2A volume, ~1m accounts, >1bn transactions) is CUMULATIVE/lifetime, not run-rate —
//       it sizes activity, not the business. The smooth revenue ramp in `financials` is therefore explicitly illustrative.
//   (4) Two material 2025–26 events found in research and added: the SAMA Major Payment Institution open-banking licence
//       (first in KSA, 30 Mar 2026) and the UAE Open Finance in-principle approval (29 Jul 2025) — the real moat story.
//   (5) The Mar-2025 Takamol Ventures round is a Series B EXTENSION (amount undisclosed), confirmed by Takamol itself.
const MENABYTES_B = 'https://www.menabytes.com/lean-series-b/'
const SEQUOIA_A = 'https://www.wamda.com/2022/01/lean-raises-33-million-round-led'
const SAMA_LICENCE = 'https://www.wamda.com/2026/03/saudi-arabia-issues-open-banking-license-lean-technologies'
const UAE_OF = 'https://www.openbankingexpo.com/news/lean-technologies-gains-regulatory-approval-under-uaes-open-finance-framework/'
const TAKAMOL = 'https://entarabi.com/en/2025/03/takamol-ventures-invests-in-lean-technologies-during-series-b-funding-round/'

export const lean: Deal = {
  id: 'lean-technologies',
  name: 'Lean Technologies',
  oneLiner: 'Riyadh open-banking & A2A-payments infrastructure — the "Plaid of MENA", now SAMA-licensed',
  sector: 'FinTech',
  geography: 'Saudi Arabia',
  region: 'GCC',
  stage: 'Series B',
  foundedYear: 2019,
  status: 'ready',
  ticketUSDm: 40,
  instrument: 'Preferred',
  controlPosture: 'minority',
  ask: {
    askValuationUSDm: 350, // ESTIMATE ONLY — no round valuation ever disclosed; see dataTrust + caseAgainst.
    series: 'Series B (+ Mar-25 extension)',
    raisingUSDm: 40,
    date: '2024-Q4 / 2025-Q1',
    lastRoundUSDm: 67.5,
    lastRoundDate: 'Nov 2024 (Series B); extended Mar 2025',
    leadInvestors: ['General Catalyst', 'Bain Capital Ventures', 'Duquesne Family Office', 'Arbor Ventures'],
  },
  roundHistory: [
    { series: 'Series B (extension)', date: 'Mar 2025', leadInvestors: ['Takamol Ventures'], citation: { source: 'entARABI / Takamol', url: TAKAMOL } },
    { series: 'Series B', date: 'Nov 2024', raisedUSDm: 67.5, leadInvestors: ['General Catalyst', 'Bain Capital Ventures', 'Duquesne Family Office', 'Arbor Ventures'], citation: { source: 'MENAbytes', url: MENABYTES_B } },
    { series: 'Series A', date: 'Jan 2022', raisedUSDm: 33, leadInvestors: ['Sequoia Capital India', 'RAED Ventures', 'Shorooq', 'JIMCO'], citation: { source: 'Wamda', url: SEQUOIA_A } },
  ],
  totalRaisedUSDm: 100, // ">$100m" (company / MENAbytes); the Mar-25 extension amount is undisclosed, so this is a floor.
  currentValuationUSDm: 350, // ESTIMATE — never disclosed at any round. Flagged throughout.
  vitals: {
    size: {
      label: 'ARR / net revenue',
      value: 'Not disclosed',
      basis: 'estimated',
      note: 'Lean has never published ARR, revenue or customers. The public figures — >$2B cumulative A2A volume processed, ~1m bank accounts connected, >1bn transactions analysed — are LIFETIME activity metrics, not run-rate, and say nothing about monetisation. Internal model uses ~$25m est. net revenue (see financials, illustrative).',
    },
    growth: {
      label: 'ARR YoY / new-product growth',
      value: 'Not disclosed',
      trend: 'up',
      basis: 'estimated',
      note: 'No revenue series is public. The only hard growth signal is regulatory/product progression: SAMA sandbox → first SAMA Major Payment Institution open-banking licence (Mar 2026); UAE Open Finance IPA (Jul 2025); Pay-by-Bank live on UAE Open Finance rails. Direction looks up; the rate is unquantified.',
    },
    unitEconomics: {
      label: 'Gross margin / take-rate',
      value: 'Not disclosed',
      basis: 'estimated',
      note: 'Neither the API gross margin nor the take-rate on the >$2B A2A volume is published — so revenue-per-dollar-of-volume is unknown. Infra peers (Plaid/Adyen) run high gross margins at scale, but at Lean’s stage this is a thesis, not a fact. NOTE: Tamara’s reported "+32% approval-rate lift" via Lean is a CUSTOMER outcome, not Lean’s unit economics.',
    },
    quality: {
      label: 'NRR / logo retention',
      value: 'Not disclosed',
      basis: 'estimated',
      note: 'No NRR or logo-retention figure published. Soft positive: a marquee, sticky-looking roster (Tabby, Tamara, e&, Careem, DAMAC, Tawuniya, Salla, Abdul Latif Jameel Finance). But this is also concentration risk — heavy reliance on a few large BNPL/payments names is plausible and unquantified.',
    },
  },
  headlineMetrics: [
    { label: 'A2A volume processed (lifetime)', value: '$2bn+', trend: 'up', basis: 'stated', source: 'MENAbytes / Company', url: MENABYTES_B },
    { label: 'Bank accounts connected (lifetime)', value: '~1m', basis: 'stated', source: 'MENAbytes / Company', url: MENABYTES_B },
    { label: 'Transactions analysed (lifetime)', value: '1bn+', basis: 'stated', source: 'Wamda', url: SAMA_LICENCE },
    { label: 'Series B raised', value: '$67.5m', basis: 'stated', source: 'MENAbytes', url: MENABYTES_B },
    { label: 'Total funding', value: '$100m+', basis: 'stated', source: 'MENAbytes', url: MENABYTES_B },
    { label: 'Valuation', value: 'Not disclosed (~$350m est.)', basis: 'estimated' },
    { label: 'Net revenue / ARR', value: 'Not disclosed (~$25m est.)', trend: 'up', basis: 'estimated' },
  ],
  news: [
    { date: 'Mar 2026', headline: 'SAMA grants Lean the first Major Payment Institution licence for open-banking services in Saudi Arabia (exit from the regulatory sandbox to full deployment)', source: 'Wamda', url: SAMA_LICENCE },
    { date: 'Jul 2025', headline: 'Receives in-principle approval (IPA) from the Central Bank of the UAE under the new Open Finance framework; Pay-by-Bank goes live on UAE Open Finance rails', source: 'Open Banking Expo', url: UAE_OF },
    { date: 'Mar 2025', headline: 'Takamol Ventures invests as an extension of the Series B (amount undisclosed)', source: 'entARABI / Takamol', url: TAKAMOL },
    { date: 'Nov 2024', headline: '$67.5m Series B led by General Catalyst (first GC investment in KSA); total funding tops $100m', source: 'MENAbytes', url: MENABYTES_B },
    { date: 'Jan 2022', headline: '$33m Series A led by Sequoia Capital India — Sequoia’s first GCC investment', source: 'Wamda', url: SEQUOIA_A },
  ],
  peers: [
    { name: 'Plaid', public: false, evRevenue: 9.0, revGrowthPct: 25, ebitdaMarginPct: 5, scaleUSDm: 400, basis: 'estimated', rationale: 'US open-banking infra; the category template Lean is explicitly modelled on' },
    { name: 'Adyen', public: true, evRevenue: 11.0, revGrowthPct: 22, ebitdaMarginPct: 50, scaleUSDm: 2000, basis: 'stated', rationale: 'Listed payments infra; high-margin benchmark for where A2A economics can land at scale' },
    { name: 'Marqeta', public: true, evRevenue: 3.5, revGrowthPct: 18, ebitdaMarginPct: -5, scaleUSDm: 700, basis: 'stated', rationale: 'Card-issuing infra; lower-multiple, lower-margin anchor on the downside' },
    { name: 'Tarabut Gateway', public: false, evRevenue: 10.0, revGrowthPct: 40, ebitdaMarginPct: -15, scaleUSDm: 20, basis: 'estimated', rationale: 'Direct GCC open-banking peer (~$50m+ raised); the closest like-for-like, also pre-profit' },
  ],
  assumptions: {
    baseRevenueUSDm: 25,
    revGrowthPct: [60, 50, 42, 35, 28],
    ebitdaMarginPct: [-20, -8, 2, 12, 20],
    taxRatePct: 15,
    waccPct: 17,
    terminalGrowthPct: 4,
    netDebtUSDm: -40,
    exitEVRevenue: 8,
    holdYears: 5,
  },
  merit: [
    { key: 'market', label: 'Market opportunity', score: 82, confidence: 'medium', rationale: 'GCC open finance is early but regulator-mandated (SAMA framework, UAE Open Finance). Arab Monetary Fund projects the MENA open-finance market at ~$1.65bn (2022) → ~$11.74bn (2027) — a durable, policy-driven infrastructure tailwind.' },
    { key: 'model', label: 'Business model', score: 78, confidence: 'low', rationale: 'Picks-and-shovels: usage/subscription API revenue plus an A2A pay-by-bank take-rate. High incremental margin in theory — but the actual take-rate on the >$2B volume and the gross margin are undisclosed, so monetisation depth is unproven.', confidenceReason: 'No revenue, take-rate or margin figure is public — the model quality is inferred from peers, not Lean’s numbers.' },
    { key: 'financial', label: 'Financial profile', score: 48, confidence: 'low', rationale: 'Early-stage, pre-profit, small absolute revenue — and opaque: no revenue, ARR, burn or valuation has ever been disclosed. The traction figures are lifetime/cumulative, not run-rate.', confidenceReason: 'Every financial line (revenue, burn, valuation) is estimated, not sourced; only funding amounts are stated.' },
    { key: 'moat', label: 'Competitive moat', score: 76, confidence: 'medium', rationale: 'The moat got materially more real in 2025–26: first SAMA Major Payment Institution open-banking licence in KSA (Mar 2026) and a UAE Open Finance IPA (Jul 2025), on top of bank integrations and a marquee client roster. Regulatory first-mover status is the differentiator, not technology alone.' },
    { key: 'team', label: 'Team', score: 78, confidence: 'medium', rationale: 'Founder-CEO Hisham Al-Falih with co-founders Aditya Sarkar and Ashu Gupta; cap table draws first-time-in-region commitments from Sequoia India (Series A) and General Catalyst (Series B), plus Bain Capital Ventures.' },
    { key: 'valuation', label: 'Valuation', score: 50, confidence: 'low', rationale: 'Never disclosed at any round. Modelled on an estimated ~$350m; at ~$25m est. revenue that implies ~14x, in the infra-peer range — but entirely unanchored without a confirmed mark.' },
    { key: 'exit', label: 'Exit pathway', score: 70, confidence: 'low', rationale: 'Most likely a strategic acquisition by a global payments platform or a regional bank wanting the SAMA/UAE licences and rails; an IPO is conceivable but distant given undisclosed scale.' },
  ],
  financials: {
    // ILLUSTRATIVE ONLY. Lean has never disclosed revenue or EBITDA. This is a modelled ramp consistent with an
    // early infra business at the cited stage — NOT company figures. Treated as such in dataTrust and valuationVerdict.
    years: ['FY23', 'FY24', 'FY25E', 'FY26E', 'FY27E'],
    revenue: [10, 16, 25, 40, 60],
    ebitda: [-12, -8, -5, 1, 7],
  },
  capTable: [
    { holder: 'Founders & management', pct: 30, type: 'founder' },
    { holder: 'General Catalyst & Bain Capital Ventures', pct: 34, type: 'investor' },
    { holder: 'Arbor, Sequoia India & earlier', pct: 24, type: 'investor' },
    { holder: 'Employee option pool', pct: 12, type: 'esop' },
  ],
  dataTrust: {
    fields: [
      { label: 'Series B amount & leads ($67.5m, GC-led, Nov 2024)', basis: 'stated', confidence: 'high', source: 'MENAbytes / FinTech Magazine', url: MENABYTES_B },
      { label: 'Series A amount & lead ($33m, Sequoia India, Jan 2022)', basis: 'stated', confidence: 'high', source: 'Wamda', url: SEQUOIA_A },
      { label: 'Total funding ($100m+)', basis: 'stated', confidence: 'high', source: 'MENAbytes', url: MENABYTES_B },
      { label: 'SAMA Major Payment Institution open-banking licence (first in KSA, Mar 2026)', basis: 'stated', confidence: 'high', source: 'Wamda', url: SAMA_LICENCE },
      { label: 'UAE Open Finance IPA (Jul 2025)', basis: 'stated', confidence: 'high', source: 'Open Banking Expo', url: UAE_OF },
      { label: 'Series B extension (Takamol Ventures, Mar 2025)', basis: 'stated', confidence: 'medium', source: 'entARABI / Takamol', url: TAKAMOL, method: 'Round confirmed by Takamol itself; amount undisclosed.' },
      { label: 'Traction ($2B volume, ~1m accounts, 1bn txns)', basis: 'stated', confidence: 'medium', source: 'MENAbytes / Wamda', url: MENABYTES_B, method: 'Company-reported and CUMULATIVE/lifetime — not run-rate; sizes activity, not revenue.' },
      { label: 'Valuation', basis: 'estimated', confidence: 'low', method: 'Not disclosed at any round (A, B, or the Mar-25 extension). ~$350m is a placeholder for the model, cross-checked vs infra peers — must be confirmed in diligence.' },
      { label: 'Revenue / ARR / take-rate / margin / burn', basis: 'estimated', confidence: 'low', method: 'Not disclosed. The ~$25m revenue and the financials ramp are illustrative, not sourced.' },
      { label: 'Peer multiples', basis: 'estimated', confidence: 'low', method: 'Mixed public (Adyen, Marqeta) and private (Plaid, Tarabut) marks; indicative, not a dated comp set.' },
    ],
  },
  shariaScreen: {
    status: 'compliant',
    note: 'Revenue derives from open-banking infrastructure (data and verification APIs and a take-rate on account-to-account payment volume) and carries no interest-based lending or conventional-interest funding, so the model reads as Shariah-compliant; no formal Shariah board ruling has been published.',
    source: 'Inferred from the disclosed revenue model (no public Shariah board statement)',
  },
  narrative: {
    whyNow:
      'The position is surfaced for review by the March 2026 grant of the first SAMA Major Payment Institution open-banking licence in Saudi Arabia, which moved Lean from sandbox trials to full licensed deployment, alongside the July 2025 UAE Open Finance in-principle approval.',
    barriers: [
      { axis: 'Regulatory licence', rating: 'high', note: 'The first SAMA Major Payment Institution open-banking licence in KSA (March 2026) and a UAE Open Finance in-principle approval (July 2025) are dated, first-mover authorisations that a competitor must replicate to operate at parity.' },
      { axis: 'Bank integration lock-in', rating: 'high', note: 'Approximately 1m connected bank accounts and live integrations across marquee clients (Tabby, Tamara, e&, Careem, DAMAC, Tawuniya) create switching costs, though net revenue retention is undisclosed.' },
      { axis: 'Scale and network', rating: 'medium', note: 'Over $2bn in cumulative A2A volume and 1bn+ transactions analysed provide an activity base, but these are lifetime figures and run-rate scale is not disclosed.' },
      { axis: 'Data and analytics', rating: 'medium', note: 'Permissioned bank-data and transaction-enrichment capability built on 1bn+ analysed transactions supports the data-API wedge, though the resulting economics are not published.' },
      { axis: 'Capital intensity', rating: 'low', note: 'The infrastructure model is software-based rather than balance-sheet intensive, so capital is not itself a meaningful barrier to a funded rival such as Tarabut Gateway.' },
    ],
    profile:
      'Lean Technologies is a Riyadh-based fintech-infrastructure company, founded in 2019 by Hisham Al-Falih, Aditya Sarkar and Ashu Gupta, providing open-banking data APIs (account verification, financial data) and account-to-account "Pay by Bank" payment rails across Saudi Arabia and the UAE — positioned as the regional equivalent of Plaid. Businesses embed Lean to verify bank accounts, pull permissioned financial data, and move money bank-to-bank without cards. It has processed over $2bn in cumulative A2A volume, connected ~1m bank accounts and analysed 1bn+ transactions, with clients including e&, DAMAC, Careem, Tawuniya, Salla, Abdul Latif Jameel Finance, and BNPL leaders Tabby and Tamara. It raised a $33m Series A (Sequoia India, 2022) and a $67.5m Series B (General Catalyst, Nov 2024, extended by Takamol Ventures in Mar 2025), total funding $100m+. Crucially, no revenue, ARR or valuation has ever been disclosed.',
    revenueModel: 'Usage- and subscription-based API revenue (data/verification calls) plus a take-rate on A2A Pay-by-Bank volume — infrastructure economics with high incremental margin in theory. Both the take-rate and the gross margin are undisclosed, so the line-item shares below are estimates, not company figures.',
    revenueLines: [
      { name: 'Pay-by-Bank / A2A take-rate', sharePct: 45, basis: 'estimated', description: 'Fee on account-to-account payment volume (>$2B processed cumulatively). The likely primary growth engine post the SAMA payment-institution licence — but Lean does not publish its take-rate, so both the rate and this share are estimated.' },
      { name: 'Financial-data APIs (subscription/usage)', sharePct: 35, basis: 'estimated', description: 'Permissioned bank-data pulls for lending/insurance/marketplaces (e.g. Tamara, Tawuniya, ALJ Finance). Priced per-call and/or subscription; the original wedge product.' },
      { name: 'Verification APIs (account/identity)', sharePct: 15, basis: 'estimated', description: 'Account- and address-verification calls — the high-frequency, lower-price entry product that lands logos before deeper data/payments adoption.' },
      { name: 'Platform / integration & other', sharePct: 5, basis: 'estimated', description: 'Setup, premium support and bank-integration services; small and ancillary.' },
    ],
    marketRead:
      'Demand is regulator-created, not in question: SAMA’s open-banking framework and the UAE Open Finance regime mandate the rails Lean sells, and the Arab Monetary Fund projects MENA open finance growing ~$1.65bn (2022) → ~$11.74bn (2027). The binding questions are monetisation, not demand: (1) Lean’s actual (undisclosed) take-rate on A2A volume and its trend, (2) whether high-frequency verification/data logos convert into deep, sticky payments revenue (NRR), and (3) client concentration — how much of the $2B volume sits with a few BNPL/payments names. The competitive structure is a two-horse GCC race (Lean vs Tarabut Gateway), with banks and global infra (Plaid-style entrants) as the longer-term threat — but Lean’s first-mover SAMA licence is a real, dated edge.',
    regulatory:
      'The regulatory story is the thesis. Lean is ADGM-regulated in the UAE; it was the first Technical Service Provider approved into SAMA’s open-banking sandbox, received a UAE Open Finance in-principle approval (Jul 2025), and in Mar 2026 was granted the FIRST SAMA Major Payment Institution licence for open-banking services in Saudi Arabia — moving it from sandbox trials to full, licensed deployment. That licence is both a moat (first-mover, hard to replicate) and a gate (ongoing SAMA supervision).',
    caseFor: [
      'Regulatory first-mover, now licensed: the first SAMA Major Payment Institution open-banking licence in KSA (Mar 2026) plus a UAE Open Finance IPA (Jul 2025) — a dated, hard-to-replicate edge that turns the "regulator tailwind" cliché into a specific, verifiable advantage over the one real peer (Tarabut).',
      'Real, embedded distribution: >$2bn cumulative A2A volume, ~1m connected accounts and 1bn+ transactions analysed across marquee, integration-heavy clients (Tabby, Tamara, e&, Careem, DAMAC, Tawuniya) — switching costs that are plausible even if NRR is unquantified.',
      'Backers who underwrite the category: Sequoia India (first GCC cheque) and General Catalyst (first KSA cheque) plus Bain Capital Ventures — global infra investors validating the picks-and-shovels thesis, with Takamol extending the round in 2025.',
    ],
    caseAgainst: [
      'Financially opaque to the point of un-underwritable: no revenue, ARR, take-rate, gross margin, burn OR valuation has ever been disclosed — at any round. The traction figures ($2B, 1m, 1bn) are cumulative/lifetime, so we cannot tell run-rate, growth or whether the volume actually monetises.',
      'Entry price is a guess: ~$350m is our estimate, not a mark. A $40m ticket at an unconfirmed valuation is an unanchored return — and the Mar-25 extension amount is undisclosed too, so even total-raised is a floor.',
      'Monetisation and concentration risk: a picks-and-shovels infra play lives or dies on take-rate × volume × retention, none of which is public; and heavy reliance on a few BNPL/payments clients (Tabby, Tamara) is a plausible, unquantified concentration exposure.',
    ],
    leadership: [
      { name: 'Hisham Al-Falih', role: 'Co-founder & CEO' },
      { name: 'Aditya Sarkar', role: 'Co-founder' },
      { name: 'Ashu Gupta', role: 'Co-founder' },
    ],
    leadershipGaps: 'Strong, intact founding team with top-tier backing. The diligence bench questions are a CFO/commercial-finance hire able to stand behind audited revenue/ARR, and depth in regulated-payments compliance now that Lean holds a full SAMA payment-institution licence.',
    legalStanding: 'No adverse media. Regulated: ADGM (UAE), SAMA Major Payment Institution open-banking licence (KSA, Mar 2026), UAE Open Finance IPA (Jul 2025). Institutional cap table. The live obligation is ongoing SAMA/CBUAE supervision that comes with the licences.',
    valuationVerdict:
      'A materially strengthened infrastructure thesis — the SAMA licence is a real, dated moat — wrapped in extreme financial opacity. Modelled returns clear the hurdle, but every input that matters (revenue, take-rate, margin, NRR, and the valuation itself) is estimated or undisclosed. The illustrative financials must not be mistaken for disclosure. The franchise quality is plausible, but the price and the numbers cannot yet be stood behind.',
    limitations: [
      'Valuation never disclosed at any round — modelled on an estimate (~$350m).',
      'Revenue, ARR, take-rate, gross margin and burn are all undisclosed; the financials shown are explicitly illustrative.',
      'Traction figures are cumulative/lifetime, not run-rate; the Mar-25 extension amount is undisclosed (total raised is a floor).',
      'Client concentration and NRR are unquantified.',
    ],
    icThesis:
      'Own the licensed, first-mover GCC open-banking and A2A-payments rail ahead of regulator-driven adoption — contingent on confirming entry valuation, audited revenue/ARR and take-rate, NRR, and client concentration in diligence before committing.',
    useOfFunds: 'Product expansion (Pay-by-Bank scale-up post-licence), additional bank integrations, and KSA/UAE go-to-market; potential further MENA expansion (Cairo office already exists).',
    proposedTerms: [
      { label: 'Instrument', value: 'Series B preferred (extension pricing to confirm)' },
      { label: 'Ownership', value: '~11% (at the estimated ~$350m entry — to confirm)' },
      { label: 'Protections', value: '1x preference, pro-rata, full information rights (incl. audited financials)' },
      { label: 'Governance', value: 'Board observer' },
      { label: 'Conditions to close', value: 'Confirm valuation; audited revenue/ARR, take-rate, gross margin, burn; NRR & client concentration; SAMA-licence compliance' },
    ],
    riskRegister: [
      { risk: 'Undisclosed valuation', severity: 'high', likelihood: 'high', impact: 'Entry price unknown — return entirely unanchored', mitigation: 'Confirm round terms/post-money before any commitment', monitoring: 'Term-sheet diligence' },
      { risk: 'Financial opacity (revenue/take-rate/margin)', severity: 'high', likelihood: 'high', impact: 'Cannot verify the picks-and-shovels thesis monetises; traction is cumulative not run-rate', mitigation: 'Gate diligence on audited ARR, take-rate on A2A volume, gross margin, burn', monitoring: 'Monthly ARR & volume-to-revenue conversion' },
      { risk: 'Client concentration', severity: 'medium', likelihood: 'medium', impact: 'Heavy reliance on a few BNPL/payments names (Tabby, Tamara) could make revenue lumpy', mitigation: 'Require revenue-by-client and NRR breakdown', monitoring: 'Top-10 client concentration & retention' },
      { risk: 'Competition / market formation', severity: 'medium', likelihood: 'medium', impact: 'Tarabut, banks and global infra entrants; open-banking adoption slower than mandated', mitigation: 'Leverage SAMA-licence first-mover lead; regulator engagement', monitoring: 'Licence/share vs Tarabut; adoption metrics' },
    ],
    recommendationSummary:
      'Review — a category-leading, now-licensed GCC open-banking infrastructure bet whose modelled returns clear the hurdle and whose SAMA/UAE regulatory moat is real and dated. But the deal is financially opaque: no disclosed revenue, take-rate, margin or valuation, and traction quoted on a cumulative basis. Resolve entry price and the monetisation numbers in diligence before committing.',
  },
  createdAt: '2026-06-03',
}
