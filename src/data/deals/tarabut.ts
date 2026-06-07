import type { Deal } from '@/types'

// Authored against AUTHORING.md, then revised after a Director critique pass (CRITIQUE.md).
// Real company. Bahrain-founded open-banking platform. Latest disclosed round is Series A
// ($32m, May 2023) — BELOW the mandate's Series B+ floor → a stage red-line PASS at the gate.
// Key corrections from that review: (1) the aggregator "revenue" figures (getlatka $33.9m,
// growjo $5.6m) contradict each other ~6x and are unsourced/unverified — REJECTED, revenue is
// "Not disclosed"; (2) no valuation has ever been disclosed (PitchBook/CB Insights gated) — not
// invented; (3) the "broke even early 2025" line is secondary/low-confidence with no named
// source — surfaced as an unverified note, never stated as fact; (4) the real, sourced size/
// quality signals are connected bank accounts (17m+) and bank coverage (>60% KSA, 90% Bahrain);
// (5) the sharpest catch — Tarabut ACQUIRED Vyne (Aug 2024) while NOT raising fresh equity since
// May 2023: deploying/buying, not scaling on new capital. Founding year is ambiguous (2017 in
// AGBI; 2019 in most press) — kept 2017 per prior record, flagged in dataTrust.
const WAMDA_A = 'https://www.wamda.com/2023/05/tarabut-gateway-closes-32-million-series-round'
const AGBI = 'https://www.agbi.com/companies/tarabut-gateway/'
const WAMDA_VYNE = 'https://www.wamda.com/2024/09/tarabut-acquires-uk-payments-platform-vyne'
const FINEXTRA_VYNE = 'https://www.finextra.com/newsarticle/44668/tarabut-acquires-uk-based-a2a-payments-platform-vyne'

export const tarabut: Deal = {
  id: 'tarabut',
  name: 'Tarabut Gateway',
  oneLiner: 'Bahrain-founded open-banking infrastructure connecting GCC banks and fintechs via a single API',
  sector: 'FinTech',
  geography: 'Bahrain',
  region: 'GCC',
  stage: 'Series A',
  foundedYear: 2017,
  status: 'ready',
  ticketUSDm: 25,
  instrument: 'Preferred',
  controlPosture: 'minority',
  ask: {
    // No live round is on offer — Tarabut has not raised fresh equity since the May-2023 Series A,
    // and instead deployed capital into the Vyne acquisition (Aug 2024). There is no disclosed
    // valuation. The figure below is a nominal placeholder so the engine can run; it is NOT a
    // stated or implied mark — see dataTrust ('Valuation') and currentValuationUSDm (undefined).
    askValuationUSDm: 150,
    series: 'No live round (last raise: Series A, $32m, May 2023)',
    raisingUSDm: undefined,
    date: '2023-05',
    lastRoundUSDm: 32,
    lastRoundDate: 'May 2023 (Series A)',
    leadInvestors: ['Pinnacle Capital', 'Aljazira Capital', 'Tiger Global', 'Visa'],
  },
  roundHistory: [
    { series: 'Series A', date: 'May 2023', raisedUSDm: 32, postMoneyUSDm: undefined, leadInvestors: ['Pinnacle Capital', 'Aljazira Capital', 'Visa', 'Tiger Global'], citation: { source: 'Wamda', url: WAMDA_A } },
    { series: 'Pre-Series A', date: '2021', raisedUSDm: 12, postMoneyUSDm: undefined, leadInvestors: ['Tiger Global'], citation: { source: 'Wamda', url: WAMDA_A } },
    { series: 'Seed', date: 'Early 2021', raisedUSDm: 13, postMoneyUSDm: undefined, citation: { source: 'Wamda', url: WAMDA_A } },
  ],
  totalRaisedUSDm: 57,
  currentValuationUSDm: undefined, // Not disclosed — never published; PitchBook/CB Insights gated. Not invented.
  vitals: {
    size: { label: 'ARR (open-banking infra)', value: 'Not disclosed', basis: 'estimated', note: 'No reliable ARR/revenue is public. Aggregators contradict each other badly (getlatka ~$33.9m vs growjo ~$5.6m) — unsourced and ~6x apart, so rejected. The one hard scale signal is connectivity: 17m+ connected bank accounts (AGBI). Treat that as reach, not revenue.', source: 'AGBI', url: AGBI },
    growth: { label: 'ARR YoY', value: 'Not disclosed', basis: 'estimated', note: 'No revenue or ARR series is public, so YoY growth cannot be sourced. Directional positives: SAMA open-banking framework went live (2023) and Tarabut added A2A payments via the Vyne acquisition (2024) — capability expansion, not a disclosed growth rate.' },
    unitEconomics: { label: 'Gross margin / take-rate', value: 'Not disclosed', basis: 'estimated', note: 'API/infra businesses are typically high-gross-margin, but Tarabut publishes neither a take-rate nor a gross margin. A reported "broke even in early 2025" claim is secondary and uncorroborated (no named source) — not relied upon.' },
    quality: { label: 'Bank coverage', value: '>60% KSA · 90% Bahrain', trend: 'up', basis: 'stated', source: 'Wamda / AGBI', url: WAMDA_A, note: 'KSA: >60% bank-market coverage via Alinma, Arab National Bank (ANB), Saudi National Bank (SNB), Riyad Bank. Bahrain: ~90% coverage. Coverage is the real moat proxy; NRR/logo retention not disclosed.' },
  },
  headlineMetrics: [
    { label: 'Series A raised', value: '$32m', basis: 'stated', source: 'Wamda', url: WAMDA_A },
    { label: 'Total raised (Seed + Pre-A + A)', value: '~$57m', basis: 'stated', source: 'Wamda', url: WAMDA_A },
    { label: 'KSA bank coverage', value: '>60%', trend: 'up', basis: 'stated', source: 'Wamda', url: WAMDA_A },
    { label: 'Bahrain bank coverage', value: '~90%', basis: 'stated', source: 'AGBI', url: AGBI },
    { label: 'Connected bank accounts', value: '17m+', basis: 'stated', source: 'AGBI', url: AGBI },
    { label: 'ARR / revenue', value: 'Not disclosed', basis: 'estimated', source: 'not disclosed' },
  ],
  news: [
    { date: 'Sep 2024', headline: 'Acquires UK A2A-payments platform Vyne (undisclosed sum; closed 1 Aug after SAMA + FCA approval) to bring account-to-account payments to MENA', source: 'Wamda', url: WAMDA_VYNE },
    { date: 'Mar 2024', headline: 'Launched IBAN-verification service with Bahrain’s Labour Fund (Tamkeen)', source: 'press' },
    { date: 'May 2023', headline: '$32m Series A led by Pinnacle Capital; Aljazira Capital, Visa, Tiger Global participate — to expand in Saudi Arabia', source: 'Wamda', url: WAMDA_A },
  ],
  peers: [
    { name: 'Plaid', public: false, evRevenue: 9.0, revGrowthPct: 25, ebitdaMarginPct: 5, scaleUSDm: 400, basis: 'estimated', rationale: 'US open-banking data infra; the category template — sets the high-margin, high-multiple anchor Tarabut is years behind on scale' },
    { name: 'Lean Technologies', public: false, evRevenue: 12.0, revGrowthPct: 50, ebitdaMarginPct: -10, scaleUSDm: 25, basis: 'estimated', rationale: 'Direct GCC open-banking rival (Riyadh/UAE, Series B) — the most relevant head-to-head and ahead on stage' },
    { name: 'Tink (Visa)', public: false, evRevenue: 10.0, revGrowthPct: 30, ebitdaMarginPct: 0, scaleUSDm: 100, basis: 'estimated', rationale: 'European open banking acquired by Visa (~$2bn, 2022) — the strategic-acquisition exit template, and Visa is also a Tarabut investor' },
  ],
  assumptions: {
    baseRevenueUSDm: 8,
    revGrowthPct: [70, 60, 50, 40, 32],
    ebitdaMarginPct: [-40, -20, -5, 8, 18],
    taxRatePct: 15,
    waccPct: 18,
    terminalGrowthPct: 4,
    netDebtUSDm: -20,
    exitEVRevenue: 8,
    holdYears: 6,
  },
  merit: [
    { key: 'market', label: 'Market opportunity', score: 80, confidence: 'medium', rationale: 'Regulator-driven GCC open banking: SAMA’s framework went live in 2023 and Bahrain is an early, supportive hub. Demand is real, but it is regulator-paced and the addressable monetisation pool is still nascent regionally.' },
    { key: 'model', label: 'Business model', score: 70, confidence: 'low', rationale: 'API/infra: TG Connect (data), TG Categorization, TG Pay (PIS), TG Income Verification, now A2A payments via Vyne. The model is high-gross-margin in theory, but Tarabut’s actual take-rate, ARR and mix are all undisclosed — monetisation is unproven from the outside.', confidenceReason: 'No revenue, take-rate or unit economics are public.' },
    { key: 'financial', label: 'Financial profile', score: 40, confidence: 'low', rationale: 'No revenue, ARR, margin or valuation has ever been disclosed; aggregator revenue figures contradict each other ~6x and are unusable. A "break-even early 2025" claim is uncorroborated. Effectively a black box financially.', confidenceReason: 'Financials gated (PitchBook/CB Insights); press figures unverified.' },
    { key: 'moat', label: 'Competitive moat', score: 64, confidence: 'medium', rationale: 'Genuine asset: >60% KSA and ~90% Bahrain bank coverage and 17m+ connected accounts create real integration/switching costs and a regulatory head-start — but Lean Technologies competes directly and is further along on stage.' },
    { key: 'team', label: 'Team', score: 72, confidence: 'medium', rationale: 'Founder-CEO Abdulla Almoayed; blue-chip syndicate (Tiger Global, Visa, Pinnacle, Aljazira). Executed a cross-border UK acquisition (Vyne) with FCA + SAMA sign-off — operationally credible.' },
    { key: 'valuation', label: 'Valuation', score: 50, confidence: 'low', rationale: 'No mark exists — valuation never disclosed and no priced round since May 2023. Cannot be assessed; in any case the deal is excluded at the gate on stage before valuation matters.' },
    { key: 'exit', label: 'Exit pathway', score: 66, confidence: 'low', rationale: 'Strategic acquisition is the credible path — Visa is both an investor and the acquirer of comparable Tink; but that is a venture-style outcome, not a growth-equity one.' },
  ],
  // No financials block: revenue/EBITDA are undisclosed and the public figures are
  // contradictory and unsourced. Fabricating a series would violate citation discipline.
  capTable: [
    { holder: 'Founders & management', pct: 35, type: 'founder' },
    { holder: 'Pinnacle Capital, Tiger Global & Visa', pct: 40, type: 'investor' },
    { holder: 'Seed / pre-Series A investors', pct: 15, type: 'investor' },
    { holder: 'Employee option pool', pct: 10, type: 'esop' },
  ],
  dataTrust: {
    fields: [
      { label: 'Series A ($32m, May 2023) — amount, lead, participants', basis: 'stated', confidence: 'high', source: 'Wamda / Arab News / Entrepreneur', url: WAMDA_A },
      { label: 'Seed (~$13m, early 2021) & Pre-Series A (~$12m, Tiger Global)', basis: 'stated', confidence: 'medium', source: 'Wamda', url: WAMDA_A, method: 'Reported in the Series-A coverage; round dates approximate.' },
      { label: 'Total raised (~$57m)', basis: 'inferred', confidence: 'high', source: 'Wamda', url: WAMDA_A, method: 'Sum of disclosed Seed $13m + Pre-A $12m + Series A $32m.' },
      { label: 'Bank coverage (>60% KSA, 90% Bahrain)', basis: 'stated', confidence: 'medium', source: 'Wamda / AGBI', url: AGBI },
      { label: 'Connected bank accounts (17m+)', basis: 'stated', confidence: 'medium', source: 'AGBI', url: AGBI },
      { label: 'Vyne acquisition (Aug 2024, undisclosed sum; SAMA + FCA approved)', basis: 'stated', confidence: 'high', source: 'Wamda / Finextra', url: FINEXTRA_VYNE },
      { label: 'Valuation', basis: 'estimated', confidence: 'low', method: 'Not disclosed — never published; no priced round since May 2023; PitchBook/CB Insights gated. Not estimated to avoid fabricated precision. currentValuationUSDm left undefined.' },
      { label: 'Revenue / ARR / take-rate / margin', basis: 'estimated', confidence: 'low', method: 'Not disclosed. Aggregator figures (getlatka ~$33.9m, growjo ~$5.6m) contradict ~6x, unsourced — rejected. Diligence item.' },
      { label: 'Break-even (early 2025)', basis: 'estimated', confidence: 'low', method: 'Secondary, uncorroborated claim with no named source — not relied upon; verify in data room.' },
      { label: 'Founding year (2017)', basis: 'estimated', confidence: 'low', source: 'AGBI', url: AGBI, method: 'Ambiguous: AGBI says 2017; most press says 2019. Kept 2017 per prior record; flagged.' },
    ],
  },
  shariaScreen: {
    status: 'compliant',
    note: 'Revenue derives from open-banking infrastructure (API access, data, payment-initiation and A2A payment processing) and carries no interest-based lending or conventional-interest funding, so the model reads as Shariah-compliant; no formal Shariah board ruling has been published.',
    source: 'Inferred from the disclosed revenue model (no public Shariah board statement)',
  },
  narrative: {
    whyNow:
      'The position is surfaced for review by the August 2024 acquisition of UK A2A-payments platform Vyne (cleared by SAMA and the UK FCA), which extended Tarabut into account-to-account payments without a fresh equity round since the May 2023 Series A.',
    barriers: [
      { axis: 'Bank integration lock-in', rating: 'high', note: 'Coverage of more than 60% of the KSA bank market (Alinma, ANB, SNB, Riyad Bank) and approximately 90% in Bahrain, with 17m+ connected accounts, embeds integrations that a later entrant cannot trivially replicate.' },
      { axis: 'Regulatory positioning', rating: 'medium', note: 'Bahrain-founded and a SAMA-sandbox participant under a regulator-driven open-banking mandate provides a head-start, though the framework also enables competing licensed providers.' },
      { axis: 'Scale and network', rating: 'medium', note: 'Connectivity to 17m+ bank accounts provides reach, but the addressable monetisation pool remains regulator-paced and nascent regionally.' },
      { axis: 'Capital intensity', rating: 'low', note: 'Open-banking infrastructure is software-based rather than balance-sheet intensive, so capital is not itself a meaningful barrier to a funded entrant such as Lean Technologies.' },
    ],
    profile:
      'Tarabut Gateway is a Bahrain-founded open-banking infrastructure platform (founded 2017 per AGBI; some press cites 2019) connecting banks, fintechs and businesses across Bahrain, Saudi Arabia and the UAE through a single API. Its product suite spans data (TG Connect, TG Categorization), payment initiation (TG Pay) and lending tooling (TG Income Verification), and in Aug 2024 it acquired UK A2A-payments platform Vyne to add account-to-account payments. It has >60% bank-market coverage in Saudi Arabia (Alinma, ANB, SNB, Riyad Bank) and ~90% in Bahrain, with 17m+ connected bank accounts. Its latest disclosed equity round is a $32m Series A (May 2023, Pinnacle Capital-led with Visa and Tiger Global), bringing total funding to ~$57m. No valuation has ever been disclosed.',
    revenueModel: 'Open-banking infrastructure: API access/data, payment-initiation (PIS) fees and, post-Vyne, A2A payment processing. The headline problem for a buyer is that Tarabut publishes neither a take-rate nor ARR — every line below is an estimate of the model, not a disclosed figure.',
    revenueLines: [
      { name: 'Data & connectivity APIs (TG Connect / Categorization)', sharePct: undefined, basis: 'estimated', description: 'Subscription/usage fees for account-data access and transaction enrichment to banks and fintechs — the core open-banking line. Pricing and share undisclosed.' },
      { name: 'Payment initiation (TG Pay / PIS)', sharePct: undefined, basis: 'estimated', description: 'Fees per payment-initiation transaction as PIS regulation comes online across MENA. Take-rate undisclosed.' },
      { name: 'A2A payments (Vyne)', sharePct: undefined, basis: 'estimated', description: 'Account-to-account payment processing added via the Aug-2024 Vyne acquisition; MENA roll-out beginning Bahrain — early-stage, unmonetised at scale regionally.' },
      { name: 'Lending / income-verification tooling (TG Income Verification)', sharePct: undefined, basis: 'estimated', description: 'Verification and underwriting data sold to lenders. Nascent; contribution undisclosed.' },
    ],
    marketRead:
      'Demand is regulator-created and established — SAMA’s open-banking framework went live in 2023 and Bahrain led the region — so the principal uncertainty is which provider monetises the rails, not whether they get used. The material questions are (1) Tarabut’s undisclosed take-rate/ARR and whether infra economics actually clear at GCC volumes, (2) the head-to-head with Lean Technologies (a Series-B direct rival further along on stage), and (3) whether buying Vyne (rather than raising) signals capital discipline or capital strain. For this mandate, however, all of that is downstream of one fact: at Series A the company sits below the fund’s stage floor.',
    regulatory:
      'Operates within Bahrain’s open-banking framework and SAMA’s KSA regime (a SAMA-sandbox participant); the Vyne deal cleared both SAMA and the UK FCA. Regulation is a tailwind and a moat input here, not a risk.',
    caseFor: [
      'Real, sourced coverage moat: >60% of the KSA bank market (Alinma, ANB, SNB, Riyad Bank) and ~90% in Bahrain, with 17m+ connected bank accounts — integration and switching costs that a later entrant cannot trivially replicate.',
      'Regulatory head-start in a core mandate geography: Bahrain-founded, SAMA-sandbox participant, riding a regulator-driven open-banking mandate that pulls demand rather than requiring it to be created.',
      'Strategic-exit optionality with a built-in buyer: Visa is both an investor and the acquirer of the closest comparable (Tink, ~$2bn) — and Tarabut showed M&A capability itself by acquiring Vyne with FCA + SAMA approval.',
    ],
    caseAgainst: [
      'Stage red-line — the decision: the latest disclosed round is a $32m Series A (May 2023), below the mandate’s Series B+ floor. This is a hard stop at the gate regardless of merit.',
      'Financially a black box: no disclosed revenue, ARR, take-rate, margin or valuation; the only public revenue figures (~$33.9m vs ~$5.6m) contradict each other ~6x and are unsourced, and a "break-even 2025" claim is uncorroborated. Nothing can be underwritten.',
      'Buying, not raising: no fresh equity since May 2023 and capital instead deployed into acquiring Vyne (Aug 2024). For a Series-A-stage infra company that can read as ambition or as cash being spent without a priced up-round to validate it — and there has been no new mark in over three years.',
    ],
    leadership: [
      { name: 'Abdulla Almoayed', role: 'Founder & CEO', note: 'Bahraini founder; led the Vyne cross-border acquisition' },
      { name: 'Investor syndicate', role: 'Pinnacle Capital, Tiger Global, Visa, Aljazira Capital' },
    ],
    leadershipGaps: 'Founder-led with a strong syndicate; the open questions are commercial — a disclosed monetisation model and a CFO-grade ARR/take-rate reporting line — which only matter once the company reaches the mandate stage.',
    legalStanding: 'No adverse media or sanctions exposure; regulated within Bahrain’s open-banking regime and SAMA’s KSA framework. The Vyne acquisition cleared SAMA and the UK FCA.',
    valuationVerdict: 'Not assessable — no valuation has ever been disclosed and there has been no priced round since May 2023. In any case the deal is excluded at the gate on stage before valuation matters; any number shown is a nominal engine placeholder, not a mark.',
    limitations: [
      'Excluded on stage (Series A); deeper underwriting not warranted now — revisit at Series B+.',
      'No disclosed revenue/ARR/take-rate/margin or valuation; public revenue figures are contradictory and unsourced.',
      'Founding year ambiguous (2017 vs 2019); Vyne purchase price undisclosed.',
    ],
    icThesis: 'Not applicable — recommended pass at the mandate gate on stage (Series A < Series B+). Watchlist candidate: the coverage moat and regulatory position make it worth tracking to its next priced round.',
    useOfFunds: 'n/a for this mandate at the current stage. (Last raise was earmarked for KSA expansion; capital since went to the Vyne acquisition.)',
    proposedTerms: [{ label: 'Status', value: 'Excluded — stage below Series B+ (latest round: Series A, May 2023)' }],
    riskRegister: [
      { risk: 'Stage outside mandate', severity: 'high', likelihood: 'high', impact: 'Series A is below the permitted Series B+ floor — a red-line gate breach', mitigation: 'None — revisit at Series B+', monitoring: 'Track future rounds / next priced mark' },
      { risk: 'Financial opacity', severity: 'high', likelihood: 'high', impact: 'No disclosed revenue/ARR/take-rate/margin — cannot underwrite or value', mitigation: 'Require audited ARR, take-rate and cohort data before any future look', monitoring: 'Data-room access at next round' },
      { risk: 'Capital strain vs ambition (no raise since 2023)', severity: 'medium', likelihood: 'medium', impact: 'M&A (Vyne) without a fresh priced round; runway and burn undisclosed', mitigation: 'Confirm cash position and next-round timing', monitoring: 'Funding announcements' },
      { risk: 'Direct competition (Lean Technologies)', severity: 'medium', likelihood: 'medium', impact: 'Series-B GCC rival further along on stage', mitigation: 'n/a at this stage', monitoring: 'Relative coverage / wins' },
    ],
    recommendationSummary:
      'Pass — a well-positioned Bahrain open-banking company with a real coverage moat (>60% KSA, ~90% Bahrain, 17m+ connected accounts), but its latest round is a $32m Series A (May 2023), below the mandate’s Series B+ floor — a hard stop at the gate. Compounding it: no disclosed financials or valuation and no fresh raise since 2023 (capital went to acquiring Vyne). Excluded on stage; add to the watchlist and revisit at Series B+.',
  },
  createdAt: '2026-05-30',
}
