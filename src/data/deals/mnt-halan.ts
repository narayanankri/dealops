import type { Deal } from '@/types'

// Real company. Egypt's first fintech unicorn — a balance-sheet EM lender, not an asset-light fintech.
// HQ Egypt → a FLAGGED MENA geography under the mandate → soft screening flag → Review.
//
// Authored against AUTHORING.md, then revised after a Director critique pass (CRITIQUE.md). Key
// corrections from that review: (1) full sector-aware `vitals` added — this is a LENDER, so the
// gating numbers are loan book, book-wide cost of risk and NPL, not user counts; (2) the "<2% NPL"
// figure is AI-onboarded cohorts only, NOT the whole book — book-wide NPL/cost-of-risk is NOT
// disclosed and is surfaced as a diligence gate; (3) the $1bn valuation is a Jan-2023 mark merely
// "reaffirmed" in 2024 — treated as soft/stale, with no priced primary since; (4) revenue is a
// company GUIDE ($500–600m, 2024 combined), never an audited actual; (5) EGP devaluation (~-40%
// in Mar-2024, EGP free-float) is quantified against the 59%-Egypt income mix.
const MH_RELEASE_24 = 'https://mnt-halan.com/2024/08/08/mnt-halan-raises-circa-us-160-million-from-international-investors/'
const TC_24 = 'https://techcrunch.com/2024/07/26/egypts-mnt-halan-banks-157-5m-gobbles-up-a-fintech-in-turkey-to-expand/'
const TC_23 = 'https://techcrunch.com/2023/01/31/egyptian-financial-services-provider-mnt-halan-gets-1b-valuation-after-securing-400m/'
const AGBI_PROFILE = 'https://www.agbi.com/banking-finance/2025/06/how-mnt-halan-became-one-of-egypts-biggest-lenders/'
const AGBI_AI = 'https://www.agbi.com/analysis/ai/2026/01/fintech-ai-credit-assessors-watch-how-you-shop/'
const BILLIONAIRES_25 = 'https://www.billionaires.africa/2025/12/26/mounir-nakhla-mnt-halan-financing-target-2026/'
const DABA_BOND = 'https://dabafinance.com/en/news/mnt-halan-egypt-bond-securitisation-october-2025'
const BW_TAM = 'https://www.businesswire.com/news/home/20240726752409/en/MNT-Halan-Expands-Into-Turkey-With-the-100-Acquisition-of-Market-leading-Finance-Company-Tam-Finans'

export const mntHalan: Deal = {
  id: 'mnt-halan',
  name: 'MNT-Halan',
  oneLiner: 'Egypt’s first fintech unicorn — a balance-sheet lender (consumer, SME, BNPL) wrapped in a wallet/commerce super-app, now spanning Egypt, Turkey, Pakistan and the UAE',
  sector: 'FinTech',
  geography: 'Egypt',
  region: 'MENA',
  stage: 'Growth',
  foundedYear: 2018,
  status: 'ready',
  ticketUSDm: 100,
  instrument: 'Preferred',
  controlPosture: 'significant-minority',
  ask: {
    askValuationUSDm: 1000,
    series: 'Growth (primary, indicative)',
    raisingUSDm: 100,
    date: 'Indicative (no priced primary since Jul 2024)',
    // legacy fallback — the last priced equity event of record
    lastRoundUSDm: 1000,
    lastRoundDate: 'Jan 2023 ($1bn mark; $400m round) — "reaffirmed" Jul 2024 but no new priced primary',
    leadInvestors: ['IFC', 'Development Partners International', 'Apis Partners', 'Lunate', 'Chimera'],
  },
  roundHistory: [
    { series: 'Growth (equity)', date: 'Jul 2024', raisedUSDm: 157.5, leadInvestors: ['IFC ($40m)', 'DPI', 'Lorax Capital', 'Apis Partners', 'Lunate', 'GB Corp'], citation: { source: 'MNT-Halan (release)', url: MH_RELEASE_24 } },
    { series: 'Strategic (Chimera)', date: '2023', raisedUSDm: 200, leadInvestors: ['Chimera Abu Dhabi (~20% stake)'], citation: { source: 'AGBI', url: AGBI_PROFILE } },
    { series: 'Series / unicorn round', date: 'Jan 2023', raisedUSDm: 400, postMoneyUSDm: 1000, leadInvestors: ['Chimera', 'DPI', 'Lunate', 'Apis'], citation: { source: 'TechCrunch', url: TC_23 } },
    { series: 'Pre-unicorn', date: 'Sep 2021', raisedUSDm: 120, leadInvestors: ['Apis Partners', 'DPI', 'Lunate'], citation: { source: 'MNT-Halan (release)', url: MH_RELEASE_24 } },
  ],
  totalRaisedUSDm: 668, // Tracxn cumulative (equity + securitised debt); equity portion alone ~$630m. Treat as approximate — no single audited disclosure.
  currentValuationUSDm: 1000, // Jan-2023 mark, "reaffirmed" 2024; 3+ years stale and never re-priced. See dataTrust.
  vitals: {
    size: {
      label: 'Gross loan / financing book',
      value: '~$1.3bn',
      trend: 'up',
      basis: 'stated',
      source: 'AGBI',
      url: AGBI_PROFILE,
      note: '~$700m+ Egypt + ~$300m Turkey (Tam Finans) + Pakistan/UAE. Financing-portfolio target $3.5bn (2025) → $4.5–5bn (2026). >$11–15bn disbursed cumulatively (depending on source/date).',
    },
    growth: {
      label: 'Revenue & book YoY',
      value: 'Rev ~+25%/yr (2021–24); book → +~40% targeted (2026)',
      trend: 'up',
      basis: 'inferred',
      source: 'AGBI',
      url: AGBI_PROFILE,
      note: 'Revenue is a company GUIDE ($500–600m combined, 2024) off ~$300m (2022) — not an audited actual. AGBI cites ~25%/yr growth 2021–24. Book target $3.5bn→$4.5–5bn implies ~40% YoY. USD figures are pre/post a ~40% EGP devaluation, so $-growth understates EGP-growth.',
    },
    unitEconomics: {
      label: 'Net interest margin / cost of risk',
      value: 'Not disclosed',
      basis: 'estimated',
      note: 'The gating numbers for a balance-sheet EM lender. NIM, blended yield and book-wide cost of risk are NOT public. The widely-quoted "<2% NPL" is AI-onboarded cohorts only (selection bias), not the whole book. High-yield Egyptian microfinance can run 30%+ gross yields against meaningful provisioning — undecomposed here.',
    },
    quality: {
      label: 'NPL / repeat borrowing',
      value: 'NPL <2% (AI cohort only); repeat borrowing +40%',
      trend: 'up',
      basis: 'stated',
      source: 'AGBI',
      url: AGBI_AI,
      note: '<2% NPL is explicitly for clients onboarded via AI assessment (vs Credit Agricole Egypt 2.4%, QNB Egypt 4.9%) — not the consolidated book, which is undisclosed. +150k users/month; repeat borrowing +40%.',
    },
  },
  headlineMetrics: [
    { label: 'Gross loan / financing book', value: '~$1.3bn', trend: 'up', basis: 'stated', source: 'AGBI', url: AGBI_PROFILE },
    { label: 'Revenue (2024, company guide)', value: '$500–600m', trend: 'up', basis: 'stated', source: 'TechCrunch (company guidance)', url: TC_24 },
    { label: 'Disbursed (cumulative)', value: '$11bn–15bn+', trend: 'up', basis: 'stated', source: 'Dabafinance / Tracxn', url: DABA_BOND },
    { label: 'Customers', value: '7m+ (company) / 8m+ (later)', trend: 'up', basis: 'stated', source: 'MNT-Halan / Dabafinance', url: DABA_BOND },
    { label: 'NPL (AI-onboarded cohort)', value: '<2%', basis: 'stated', source: 'AGBI', url: AGBI_AI },
    { label: 'Income split', value: '~59% Egypt · ~40% Turkey', basis: 'stated', source: 'AGBI', url: AGBI_PROFILE },
  ],
  news: [
    { date: '2025-12', headline: 'Targets $4.5–5bn financing book by end-2026 (from ~$3.5bn 2025); IPO floated within 12–18 months', source: 'Billionaires.Africa', url: BILLIONAIRES_25 },
    { date: '2025-10', headline: 'Seventh securitised bond: EGP3.4bn ($71.4m) under an EGP8bn 3-yr programme (CIB, CI Capital); EGP15bn ($315m) of debt issued in 2025', source: 'Dabafinance', url: DABA_BOND },
    { date: '2025-09', headline: 'Launched Egypt’s first fully-digital secured loan by a non-bank financial institution', source: 'Billionaires.Africa', url: 'https://www.billionaires.africa/2025/09/29/mounir-nakhla-mnt-halan-egypt-digital-loan/' },
    { date: '2024-07', headline: '$157.5m equity round (IFC $40m, DPI, Apis, Lunate, GB Corp); acquired Tam Finans (Turkey, ~$300m book) for 100%', source: 'MNT-Halan / BusinessWire', url: BW_TAM },
    { date: '2023-01', headline: 'Egypt’s first fintech unicorn at $1bn on a $400m round ($260m equity + $140m securitised)', source: 'TechCrunch', url: TC_23 },
  ],
  peers: [
    { name: 'Nubank', public: true, evRevenue: 5.8, revGrowthPct: 40, ebitdaMarginPct: 22, scaleUSDm: 12000, basis: 'stated', rationale: 'EM digital-bank scale comp; far larger and listed — anchors the high-quality end' },
    { name: 'Kaspi.kz', public: true, evRevenue: 6.5, revGrowthPct: 25, ebitdaMarginPct: 50, scaleUSDm: 5000, basis: 'stated', rationale: 'EM super-app + lending; the profitability bar MNT-Halan is implicitly benchmarked against' },
    { name: 'Bank of Georgia / TBC', public: true, evRevenue: 3.0, revGrowthPct: 18, ebitdaMarginPct: 45, scaleUSDm: 1200, basis: 'estimated', rationale: 'Frontier-EM digital lender on a bank multiple — the realistic low anchor for a balance-sheet lender in a volatile FX market' },
    { name: 'Fawry', public: true, evRevenue: 4.5, revGrowthPct: 25, ebitdaMarginPct: 30, scaleUSDm: 250, basis: 'estimated', rationale: 'Listed Egyptian fintech — the direct EGP/country-risk read, and a live EGX comparable for the mooted IPO' },
  ],
  assumptions: {
    baseRevenueUSDm: 550,
    revGrowthPct: [35, 30, 26, 22, 18],
    ebitdaMarginPct: [12, 15, 18, 21, 24],
    taxRatePct: 20,
    waccPct: 20,
    terminalGrowthPct: 4,
    netDebtUSDm: 100,
    exitEVRevenue: 4,
    holdYears: 5,
  },
  merit: [
    { key: 'market', label: 'Market opportunity', score: 84, confidence: 'high', rationale: 'Egypt is structurally under-banked (low formal-credit penetration) and Tam Finans gives a #1 SME-factoring position in Turkey (~40% share). Demand is established; the binding constraints are capital cost, FX and credit losses.' },
    { key: 'model', label: 'Business model', score: 78, confidence: 'medium', rationale: 'A balance-sheet lender (consumer/microfinance, SME, BNPL, factoring) funded increasingly by securitisation, wrapped in a wallet/commerce/investments super-app. Diversified, but the economics live or die on cost of funds and cost of risk — neither disclosed.', confidenceReason: 'NIM, blended yield and book-wide cost of risk are not public; revenue is a guide, not audited.' },
    { key: 'financial', label: 'Financial profile', score: 70, confidence: 'medium', rationale: 'Real scale (~$1.3bn book, $500–600m guided revenue) and a BBB+(local) securitisation programme — but revenue is a 2024 combined guide, no audited net income is public, and USD figures sit across a ~40% EGP devaluation.', confidenceReason: 'Revenue is a range/guide; margins, loss rates and net income are not disclosed; FX distorts USD comparability.' },
    { key: 'moat', label: 'Competitive moat', score: 74, confidence: 'medium', rationale: 'Egypt: scale, NBFI licences, agent distribution and an AI underwriting stack create real switching costs. Turkey/Pakistan/UAE are earlier-stage and less entrenched.' },
    { key: 'team', label: 'Team', score: 78, confidence: 'medium', rationale: 'Founder-CEO Mounir Nakhla has built and scaled the franchise; deep DFI cap table (IFC, DPI, Apis, Lunate) and Chimera. Multi-country execution bandwidth is the watch item.' },
    { key: 'valuation', label: 'Valuation', score: 58, confidence: 'low', rationale: 'The $1bn mark is a Jan-2023 figure "reaffirmed" in 2024 with no new priced primary — 3+ years stale. On a $500–600m revenue guide that is ~1.7–2.0x revenue, optically cheap, but the denominator is unaudited and the numerator is a stale, FX-exposed mark.', confidenceReason: 'No priced primary since 2024; valuation never re-marked; EV/Rev rests on a guided, unaudited revenue.' },
    { key: 'exit', label: 'Exit pathway', score: 64, confidence: 'low', rationale: 'A regional/EGX IPO is floated "within 12–18 months" (and decacorn aspirations in 5–7 yrs) — but EM listing windows, EGP FX and the absence of audited financials make timing and clearing price highly uncertain.' },
  ],
  financials: {
    years: ['FY22', 'FY23', 'FY24', 'FY25E', 'FY26E'],
    revenue: [300, 420, 550, 700, 900], // FY22 ~$300m stated; FY24 ~$500–600m guide (mid); FY25–26E estimated off ~25–30% growth and the book-target trajectory.
    ebitda: [30, 55, 70, 100, 150], // Estimated — no audited EBITDA/net income disclosed; margins assumed ~10–17% rising. Diligence item.
  },
  capTable: [
    { holder: 'Founder & management', pct: 20, type: 'founder' },
    { holder: 'IFC, DPI, Apis & Lunate', pct: 45, type: 'investor' },
    { holder: 'Chimera & earlier investors', pct: 23, type: 'investor' },
    { holder: 'Employee option pool', pct: 12, type: 'esop' },
  ],
  dataTrust: {
    fields: [
      { label: 'Loan/financing book (~$1.3bn) & geography split', basis: 'stated', confidence: 'high', source: 'AGBI profile (Jun 2025)', url: AGBI_PROFILE },
      { label: 'Funding rounds (2021, 2023, Chimera, 2024)', basis: 'stated', confidence: 'high', source: 'MNT-Halan release / TechCrunch / AGBI', url: TC_23 },
      { label: 'Revenue ($500–600m, 2024)', basis: 'stated', confidence: 'medium', source: 'Company guidance via TechCrunch', url: TC_24, method: 'A 2024 combined (incl. Tam Finans) GUIDE, not an audited actual; FY25–26 figures are estimated off ~25–30% growth.' },
      { label: 'Valuation ($1bn)', basis: 'inferred', confidence: 'low', method: 'Jan-2023 post-money on the $400m round; "reaffirmed" Jul-2024 but no new priced primary disclosed. 3+ years stale and never re-marked — treat as a floor reference, not a live mark.', source: 'TechCrunch', url: TC_23 },
      { label: 'NIM / cost of funds / book-wide cost of risk', basis: 'estimated', confidence: 'low', method: 'Not disclosed. The gating economics for a balance-sheet lender; blended yield and provisioning undecomposed. Diligence gate.' },
      { label: 'NPL (<2%)', basis: 'stated', confidence: 'medium', source: 'AGBI', url: AGBI_AI, method: 'Explicitly AI-onboarded cohorts only (selection bias) — NOT the consolidated book NPL, which is undisclosed.' },
      { label: 'Net income / profitability', basis: 'estimated', confidence: 'low', method: 'No audited net income or EBITDA public; financials.ebitda is an estimate, flagged for the data room.' },
      { label: 'EGP FX / country risk', basis: 'estimated', confidence: 'low', method: 'EGP free-floated and devalued ~40% in Mar-2024; ~59% of income is Egypt-sourced, so USD revenue/book and returns are directly EGP-exposed.' },
    ],
  },
  shariaScreen: {
    status: 'non-compliant',
    note: 'MNT-Halan is a conventional balance-sheet lender whose core income is net interest on consumer, microfinance, SME and factoring books funded by interest-bearing securitisation, so the model is interest-based and reads non-compliant absent a ring-fenced Islamic-finance arm; no public Shariah board or sukuk structure is disclosed.',
    source: 'AGBI profile (Jun 2025)',
    url: AGBI_PROFILE,
  },
  narrative: {
    whyNow:
      'The deal surfaces because MNT-Halan issued its seventh securitised bond in October 2025 (EGP3.4bn under an EGP8bn programme, with EGP15bn of debt placed across 2025) and management floated a regional or EGX listing within 12 to 18 months while targeting a $4.5–5bn financing book by end-2026.',
    barriers: [
      { axis: 'NBFI licensing (multi-jurisdiction)', rating: 'high', note: 'FRA-regulated microfinance, consumer-finance and factoring licences in Egypt plus the Turkish NBFI permissions acquired with Tam Finans are scarce and slow to obtain, gating new lenders out of each market.' },
      { axis: 'Securitisation / funding access', rating: 'high', note: 'An established BBB+(local) securitisation programme that placed approximately $315m in 2025 funds book growth without diluting equity — a debt-market relationship few EM lenders can replicate, and central to the $4.5–5bn target.' },
      { axis: 'Agent distribution and scale', rating: 'medium', note: 'A ~$1.3bn book, 7–8m customers and a #1 SME-factoring position in Turkey (approximately 40% share) give a distribution and origination footprint that is costly for a new entrant to assemble.' },
      { axis: 'AI underwriting / data', rating: 'medium', note: 'A proprietary AI credit-assessment stack trained on repeat-borrower behaviour supports the low AI-cohort NPL, though the advantage rests on undisclosed book-wide loss performance.' },
      { axis: 'Capital intensity / cost of risk', rating: 'low', note: 'As a balance-sheet lender the position is exposed rather than protected: returns depend on cost of funds and book-wide cost of risk, both undisclosed, with no asset-light insulation against a credit or FX shock.' },
    ],
    profile:
      'MNT-Halan is an Egypt-headquartered fintech super-app (founded 2018) that is, at its core, a balance-sheet lender. It originates consumer and microfinance loans, SME/working-capital finance, BNPL and — via the 2024 acquisition of Tam Finans (Turkey’s leading non-bank SME factor, ~$300m book, ~40% factoring share) — trade finance, all wrapped in an e-wallet, prepaid cards, e-commerce and investments. It became Egypt’s first fintech unicorn at $1bn in Jan 2023, serves 7–8m customers, runs a ~$1.3bn gross financing book (~$700m+ Egypt + ~$300m Turkey + Pakistan/UAE) and has disbursed >$11–15bn cumulatively. Funding is increasingly securitisation-led (EGP15bn / ~$315m issued in 2025 under a BBB+(local) programme). Income is ~59% Egypt / ~40% Turkey.',
    revenueModel:
      'Predominantly net interest / financing income on an on-balance-sheet loan book (consumer, microfinance, SME, BNPL, factoring), plus wallet/payments and commerce take-rate and nascent investment fees. As a balance-sheet lender the binding economics are net interest margin, cost of funds (now securitisation) and cost of risk — none of which are disclosed.',
    revenueLines: [
      { name: 'Net interest / financing income (Egypt lending)', sharePct: 55, basis: 'estimated', description: 'NII on the ~$700m+ Egyptian consumer/microfinance/SME book — the core engine. Blended yield and NIM are undisclosed; Egyptian microfinance commonly runs high gross yields against meaningful provisioning.' },
      { name: 'Factoring / SME finance (Tam Finans, Turkey)', sharePct: 30, basis: 'estimated', description: 'Discount/financing income on Turkish SME factoring (~$300m book, ~40% market share). Drives the ~40% Turkey income share; subject to TRY rates and FX.' },
      { name: 'BNPL & consumer instalment', sharePct: 6, basis: 'estimated', description: 'Merchant/consumer fees on instalment volume across the super-app and merchant network.' },
      { name: 'Wallet, cards & payments take-rate', sharePct: 6, basis: 'estimated', description: 'Interchange, transfer and float income on the e-wallet and prepaid cards; the distribution/data layer that feeds underwriting.' },
      { name: 'Commerce & investments', sharePct: 3, basis: 'estimated', description: 'E-commerce take-rate and nascent investment/real-estate-fund fees (EGP250m initial, EGP2bn target fund).' },
    ],
    marketRead:
      'The binding constraints are credit risk, funding and FX, not demand — Egypt is structurally under-banked and Turkey’s SME-factoring need is large and proven. The material questions are (1) book-wide cost of risk and NIM (both undisclosed) on a high-yield EM consumer book; (2) cost and durability of securitisation funding as the book scales toward $4.5–5bn; and (3) EGP/TRY FX, which moves reported USD revenue and equity directly given ~59%/40% Egypt/Turkey income. The "<2% NPL" headline is AI-cohort only and must not be read as the book’s loss rate.',
    regulatory:
      'Operates as a licensed NBFI in Egypt (FRA-regulated microfinance/consumer-finance/factoring) and via Tam Finans in Turkey, plus Pakistan and the UAE (entered Dec 2024). Multi-jurisdiction licensing, Egyptian AML and the EGP FX/repatriation regime are material diligence areas; the securitisation programme carries a local BBB+ rating.',
    caseFor: [
      'Substantial, defensible scale: ~$1.3bn financing book, >$11–15bn disbursed, 7–8m customers, and a #1 SME-factoring position in Turkey (~40% share) — this is an operating lender, not a deck.',
      'Optically cheap on revenue: ~$1bn mark on a $500–600m revenue guide is ~1.7–2.0x revenue, well below listed EM-fintech peers (Nubank/Kaspi at 6–7x) — but the mark is stale and the revenue unaudited (see against).',
      'Funding machine is working: an established, BBB+(local) securitisation programme (EGP15bn / ~$315m in 2025) is scaling the book without diluting equity — rare for an EM lender and central to the $4.5–5bn target.',
    ],
    caseAgainst: [
      'The gating lender numbers are undisclosed: book-wide cost of risk, NIM, cost of funds and net income are all "not disclosed" — and the widely-quoted "<2% NPL" is AI-onboarded cohorts only, not the consolidated book. A lender’s returns cannot be underwritten without these.',
      'Stale, unverified mark on unaudited revenue: the $1bn is a Jan-2023 figure "reaffirmed" in 2024 with no new priced primary, and the $500–600m revenue is a guide — so the "cheap" multiple rests on two soft numbers, not one.',
      'EGP/TRY FX is a structural drag, not a footnote: the pound free-floated and devalued ~40% in Mar-2024, and ~59% of income is Egyptian — USD revenue, book value and any USD return are directly exposed, on top of Egypt being a flagged geography outside the core GCC.',
    ],
    leadership: [
      { name: 'Mounir Nakhla', role: 'Founder & CEO', note: 'Built and scaled the franchise from microfinance (Mashroey/Tasaheel) into the super-app' },
      { name: 'IFC / DPI / Apis / Lunate', role: 'Investors', note: 'Development-finance and EM-fintech specialists; IFC put $40m into the 2024 round' },
      { name: 'Chimera (Abu Dhabi)', role: 'Strategic investor', note: '~20% stake for ~$200m (2023) — GCC anchor on the cap table' },
    ],
    leadershipGaps: 'Proven founder, but for a balance-sheet lender the diligence items are a named, independent CRO and audited group-level reporting of cost of risk, NIM and net income across four countries — none currently public.',
    legalStanding: 'No sanctions exposure identified. FRA (Egypt) and Turkish NBFI licences disclosed; multi-jurisdiction AML and the Egyptian FX/repatriation regime require focused screening. The securitisation programme carries a local-scale BBB+ rating.',
    valuationVerdict:
      'A materially scaled, securitisation-funded EM lender at an optically low ~1.7–2.0x revenue — but both inputs are soft: the $1bn mark is a 3-year-old, never-re-priced figure and the $500–600m revenue is an unaudited guide, all sitting on a book whose cost of risk and NIM are undisclosed and whose value is ~59% EGP-exposed. Cheap-looking, but the discount is doing a lot of work to cover real disclosure and FX risk.',
    limitations: [
      'Revenue is a 2024 combined guide ($500–600m), not an audited actual; FY25–26 figures are estimated.',
      'Book-wide cost of risk, NIM, cost of funds and net income are not disclosed; the "<2% NPL" is AI-cohort only.',
      'The $1bn valuation is a Jan-2023 mark "reaffirmed" in 2024 with no new priced primary — stale and unverified.',
      'EGP/TRY FX (~40% EGP devaluation Mar-2024) is not fully quantifiable from public data but materially distorts USD figures.',
    ],
    icThesis:
      'Back a scaled, securitisation-funded EM lender at a disciplined entry to the stale $1bn mark — but only after (a) auditing book-wide cost of risk, NIM and net income, (b) resolving the Egypt geography flag (outside core GCC), and (c) structuring/hedging against EGP/TRY FX. The optical cheapness is conditional, not free.',
    useOfFunds: 'Grow the financing book toward $4.5–5bn (2026), fund cross-border expansion (Turkey/Pakistan/UAE) and product breadth; primary equity would also de-risk the securitisation-heavy funding stack.',
    proposedTerms: [
      { label: 'Instrument', value: 'Preferred (primary, indicative — no priced round currently open)' },
      { label: 'Ownership', value: '~10% at the (stale) $1bn mark — to be re-based on a current valuation' },
      { label: 'Protections', value: '1x preference, FX/structuring protections, information rights, anti-dilution' },
      { label: 'Governance', value: 'Board seat' },
      { label: 'Conditions to close', value: 'Geography sign-off; audited cost-of-risk/NIM/net-income; current valuation; EGP/TRY FX hedging plan' },
    ],
    riskRegister: [
      { risk: 'Cost of risk / NIM (undisclosed)', severity: 'high', likelihood: 'high', impact: 'A high-yield EM lender’s returns are unknowable without book-wide loss rates and margin; "<2% NPL" is cohort-only', mitigation: 'Gate diligence on consolidated cost of risk, NPL by vintage, NIM and cost of funds', monitoring: 'Monthly cohort loss & NIM reporting' },
      { risk: 'EGP / TRY FX', severity: 'high', likelihood: 'high', impact: '~40% EGP devaluation (Mar-2024); ~59% Egypt income erodes USD revenue, book value and returns', mitigation: 'Structuring/hedging; hard-currency revenue mix; entry discount', monitoring: 'FX exposure & repatriation' },
      { risk: 'Stale / unverified valuation', severity: 'high', likelihood: 'high', impact: '$1bn is a Jan-2023 mark, never re-priced, on an unaudited revenue guide', mitigation: 'Require a current priced reference; re-base ownership; condition on audited revenue', monitoring: 'Re-run returns at agreed entry' },
      { risk: 'Funding / securitisation dependence', severity: 'medium', likelihood: 'medium', impact: 'Book growth to $4.5–5bn leans on debt markets; cost/availability sensitive to EGP rates', mitigation: 'Confirm maturity wall, rating durability, equity-to-debt mix', monitoring: 'Leverage & funding cost each quarter' },
      { risk: 'Geography (Egypt, flagged)', severity: 'medium', likelihood: 'high', impact: 'Outside core GCC — needs extra screening/sign-off; Turkey/Pakistan add tail', mitigation: 'IC geography approval; enhanced screening', monitoring: 'Mandate review' },
    ],
    recommendationSummary:
      'Review — a materially scaled, securitisation-funded EM lender at an optically low multiple, but resting on a stale $1bn mark, an unaudited revenue guide, undisclosed book-wide cost of risk/NIM, and heavy EGP/TRY FX exposure, all in a flagged geography outside the core GCC. Proceed only on audited lender economics, a current valuation, geography sign-off and an FX plan.',
  },
  createdAt: '2026-06-04',
}
