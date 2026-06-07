import type { Deal } from '@/types'

// Authored against AUTHORING.md, then revised after a Director critique pass (CRITIQUE.md).
// Khazna is a G42 private subsidiary — there is NO public P&L. The honest spine of this deal:
//   (1) Size/growth in SECTOR terms (MW, sites) are well-sourced; revenue/EBITDA/utilisation are
//       genuinely "Not disclosed" and modelled only with explicit method labels (Nana-style honesty).
//   (2) The $5.5bn mark is a SECONDARY print — e& sold its 40% to G42/MGX/Silver Lake (Feb 2025);
//       the $2.62bn is DEBT (ADCB+FAB, ≤10yr), not equity. There is no open primary round. Our "ask"
//       is therefore a hypothetical minority secondary, and access at $5.5bn with no primary is itself
//       the central diligence problem.
//   (3) Cap-table split between G42 / MGX / Silver Lake was never disclosed — do not fake precision.
// Models an excellent infrastructure asset whose minority growth-equity returns fall short of a 22%
// hurdle at a $5.5bn entry — a strategy/price Review, not a quality problem.

// Sources actually opened:
const PR_FIN = 'https://khaznadatacenters.com/press-release/khazna-data-centers-unlocks-2-62bn-facility-in-one-of-regions-largest-ever-financing-deals/'
const MEAI_SALE = 'https://www.middleeastainews.com/p/khazna-data-centers-mgx-silverlake'
const MEED_SHARE = 'https://www.meed.com/khazna-confirms-mgx-and-silver-lake-as-shareholders'
const NAT_850 = 'https://www.thenationalnews.com/future/technology/2024/10/15/abu-dhabis-khazna-unveils-uaes-largest-data-centre-as-it-expects-850mw-capacity-by-2029/'
const NAT_STARGATE = 'https://www.thenationalnews.com/business/2025/10/16/g42-unit-khazna-targets-full-build-out-of-1gw-stargate-uae-project-in-three-years/'
const AGBI_KSA = 'https://www.agbi.com/ai/2025/12/uaes-khazna-enters-saudi-arabia-with-first-data-centre/'

export const khazna: Deal = {
  id: 'khazna',
  name: 'Khazna Data Centers',
  oneLiner: 'UAE’s dominant hyperscale data-centre operator (G42-backed), building the AI-grade power-and-space backbone for the region',
  sector: 'Digital Infrastructure',
  geography: 'UAE',
  region: 'GCC',
  stage: 'Growth',
  foundedYear: 2012,
  status: 'ready',
  ticketUSDm: 120,
  instrument: 'Equity',
  controlPosture: 'minority',
  ask: {
    askValuationUSDm: 5500,
    series: 'Hypothetical secondary minority (no open primary)',
    date: 'Mark set Feb 2025',
    // legacy fallback
    lastRoundUSDm: 5500,
    lastRoundDate: 'Feb 2025 (e& sold 40% to G42/MGX/Silver Lake — secondary)',
    leadInvestors: ['G42 (majority)', 'MGX', 'Silver Lake'],
  },
  roundHistory: [
    { series: 'Secondary (e& 40% exit)', date: 'Feb 2025', raisedUSDm: 2200, postMoneyUSDm: 5500, leadInvestors: ['G42', 'MGX', 'Silver Lake'], citation: { source: 'Middle East AI News', url: MEAI_SALE } },
    { series: 'Debt facility (ADCB + FAB, ≤10yr)', date: 'Sep 2025', raisedUSDm: 2620, leadInvestors: ['Abu Dhabi Commercial Bank', 'First Abu Dhabi Bank'], citation: { source: 'Khazna press release', url: PR_FIN } },
  ],
  // No disclosed PRIMARY equity raise: the $2.2bn Feb-2025 e& deal was a secondary (cash to selling
  // holders, not the company); the $2.62bn Sep-2025 is debt. "Total raised" is left undisclosed
  // rather than overstated by booking a secondary as primary capital.
  totalRaisedUSDm: undefined,
  currentValuationUSDm: 5500,
  vitals: {
    size: {
      label: 'Operational MW capacity (UAE)',
      value: '~360 MW operational; ~650 MW incl. under-construction (30 sites)',
      trend: 'up',
      basis: 'stated',
      source: 'The National / AGBI / Zawya',
      url: AGBI_KSA,
      note: '~360MW operational at the Feb-2025 transaction (24 sites); by Dec-2025 ~30 live facilities and "almost 650MW" counting under-construction (~250MW managed + ~400MW building). Revenue, the usual size KPI, is NOT disclosed — G42 private subsidiary.',
    },
    growth: {
      label: 'Capacity & contracted-backlog growth',
      value: '40 MW (2020) → ~360 MW operational (2025); 850 MW UAE target by 2029',
      trend: 'up',
      basis: 'stated',
      source: 'The National',
      url: NAT_850,
      note: '~9x operational MW in five years. Plus >1GW additional AI-ready capacity planned by 2030 across UAE/KSA/Italy. Contracted-backlog $ figure and pre-lease % are NOT disclosed; "presold >400MW" is company commentary, not an audited backlog.',
    },
    unitEconomics: {
      label: '$/MW build cost (proxy) — EBITDA margin Not disclosed',
      value: '$8–12m capex / MW',
      basis: 'stated',
      source: 'The National (CEO Hassan Al Naqbi)',
      url: NAT_850,
      note: 'Build cost per MW is the one disclosed unit-economics anchor. The actual revenue $/MW, lease rate and EBITDA margin are NOT disclosed; infra-DC EBITDA margins of ~45–55% are a peer benchmark, not a Khazna figure.',
    },
    quality: {
      label: 'Utilisation / contract tenor',
      value: 'Not disclosed',
      basis: 'estimated',
      note: 'No published utilisation rate, weighted-average lease term (WALT) or tenant-renewal data. Quality is inferred from anchor demand (e& as strategic tenant + G42/Stargate AI workloads), but the sticky-cash-flow KPIs are undisclosed and a core diligence item.',
    },
  },
  headlineMetrics: [
    { label: 'Operating capacity', value: '~360 MW (24 sites, Feb 2025)', trend: 'up', basis: 'stated', source: 'Middle East AI News', url: MEAI_SALE },
    { label: 'Capacity incl. construction', value: '~650 MW (30 sites, Dec 2025)', trend: 'up', basis: 'stated', source: 'AGBI / Zawya', url: AGBI_KSA },
    { label: 'UAE market share', value: '~73–74%', basis: 'stated', source: 'The National / Khazna PR', url: NAT_850 },
    { label: 'UAE capacity target', value: '850 MW by 2029', trend: 'up', basis: 'stated', source: 'The National', url: NAT_850 },
    { label: 'Debt facility (ADCB+FAB, ≤10yr)', value: '$2.62bn', basis: 'stated', source: 'Khazna PR', url: PR_FIN },
    { label: 'Revenue / EBITDA', value: 'Not disclosed', basis: 'estimated', source: 'G42 private subsidiary — no public P&L' },
  ],
  news: [
    { date: 'Dec 2025', headline: 'Enters Saudi Arabia: first DC in Dammam (up to 200MW); ~30 live facilities, “almost 650MW” cited', source: 'AGBI', url: AGBI_KSA },
    { date: 'Oct 2025', headline: 'Targets full 1GW build-out of Stargate UAE (with OpenAI, Oracle, Nvidia) within three years; first 200MW live 2026', source: 'The National', url: NAT_STARGATE },
    { date: 'Sep 2025', headline: 'Secured $2.62bn debt facility (ADCB, FAB; up to 10-yr tenor) — one of MENA’s largest digital-infra financings', source: 'Khazna press release', url: PR_FIN },
    { date: 'Mar 2025', headline: 'MGX and Silver Lake confirmed as minority shareholders; G42 remains majority', source: 'MEED', url: MEED_SHARE },
    { date: 'Feb 2025', headline: 'e& sells its 40% stake for $2.2bn (secondary) → implies ~$5.5bn valuation; $1.4bn gain to e&', source: 'Middle East AI News', url: MEAI_SALE },
    { date: 'Oct 2024', headline: 'Unveiled UAE’s largest AI-ready 100MW facility (Ajman), targeting 850MW UAE capacity by 2029', source: 'The National', url: NAT_850 },
  ],
  peers: [
    { name: 'Equinix', public: true, evRevenue: 9.5, revGrowthPct: 8, ebitdaMarginPct: 45, scaleUSDm: 8200, basis: 'stated', rationale: 'Global colocation leader; anchors the mature, lower-growth infra multiple' },
    { name: 'Digital Realty', public: true, evRevenue: 8.2, revGrowthPct: 6, ebitdaMarginPct: 52, scaleUSDm: 5500, basis: 'stated', rationale: 'Hyperscale REIT; the margin benchmark we borrow for the undisclosed Khazna EBITDA' },
    { name: 'Gulf Data Hub (private)', public: false, evRevenue: 13.0, revGrowthPct: 30, ebitdaMarginPct: 40, scaleUSDm: 180, basis: 'estimated', rationale: 'Direct GCC peer; growth-stage regional premium — multiples are indicative, not a dated comp' },
    { name: 'Vantage Data Centers (private)', public: false, evRevenue: 14.0, revGrowthPct: 35, ebitdaMarginPct: 42, scaleUSDm: 900, basis: 'estimated', rationale: 'Hyperscale build-out comp; closest on the capex-heavy, AI-driven growth profile' },
  ],
  assumptions: {
    baseRevenueUSDm: 400, // ESTIMATED — see dataTrust. ~360MW operational × ~$1.5–2.0m revenue/MW at partial fill. NOT a disclosed figure.
    revGrowthPct: [30, 25, 20, 18, 15],
    ebitdaMarginPct: [45, 47, 48, 50, 52],
    taxRatePct: 15,
    waccPct: 11,
    terminalGrowthPct: 3,
    netDebtUSDm: 2620, // the disclosed ADCB+FAB facility, drawn over time; uses the full headline figure as a conservative leverage anchor
    exitEVRevenue: 10,
    holdYears: 5,
  },
  merit: [
    { key: 'market', label: 'Market opportunity', score: 88, confidence: 'high', rationale: 'Sovereign AI/cloud demand + data-residency rules drive a durable UAE capacity shortage; MENA DC capacity is projected to roughly double in five years (Mordor, cited in Khazna PR). Demand is established.' },
    { key: 'model', label: 'Business model', score: 86, confidence: 'high', rationale: 'Long-dated contracted colocation (power + space) to hyperscalers/enterprises — classic infra cash-flow profile. The catch: it’s capex-first ($8–12m/MW) and the contracted-backlog/WALT that would confirm the annuity is undisclosed.' },
    { key: 'financial', label: 'Financial profile', score: 78, confidence: 'low', rationale: 'No public P&L: revenue, EBITDA and utilisation are all undisclosed (G42 subsidiary). High infra margins are assumed from peers, not observed; $2.62bn of debt makes leverage the real swing factor.', confidenceReason: 'Revenue inferred from MW capacity; EBITDA from peer benchmarks; neither is a company figure.' },
    { key: 'moat', label: 'Competitive moat', score: 90, confidence: 'high', rationale: '~73% UAE share, scarce land/power/permits, and the G42 ecosystem (e& anchor tenant + Stargate AI demand) — a wide infrastructure moat.' },
    { key: 'team', label: 'Team', score: 84, confidence: 'medium', rationale: 'CEO Hassan Al Naqbi and an experienced infra team; institutional backing (G42, Silver Lake, MGX). Execution risk sits in delivering >1GW across four+ countries on schedule.' },
    { key: 'valuation', label: 'Valuation', score: 52, confidence: 'medium', rationale: 'At a $5.5bn mark from a secondary print, a minority growth-equity stake leaves little room to a 22% hurdle; the asset is priced as the infrastructure it is.' },
    { key: 'exit', label: 'Exit pathway', score: 80, confidence: 'medium', rationale: 'Infra-fund sale or IPO; deep buyer pool for contracted AI-grade capacity. But a minority secondary stake with no governance has weak exit control.' },
  ],
  financials: {
    // ILLUSTRATIVE ONLY — Khazna publishes no P&L. Revenue is a capacity-derived estimate
    // (~$1.5–2.0m/MW on partially-filled operational MW); EBITDA applies a ~45–48% peer margin.
    // These are not company figures and must not be read as disclosed.
    years: ['FY23E', 'FY24E', 'FY25E', 'FY26E', 'FY27E'],
    revenue: [240, 310, 400, 520, 650],
    ebitda: [108, 145, 188, 250, 325],
  },
  capTable: [
    // Exact post-transaction split between G42 / MGX / Silver Lake was NEVER disclosed.
    // G42 = majority (≥60%); MGX + Silver Lake = combined minority from the e& 40% exit. Ranges, not precision.
    { holder: 'G42 (majority)', pct: 60, type: 'investor' },
    { holder: 'MGX + Silver Lake (minority, split n/d)', pct: 40, type: 'investor' },
  ],
  dataTrust: {
    fields: [
      { label: 'Implied valuation (~$5.5bn)', basis: 'inferred', confidence: 'high', source: 'Middle East AI News', url: MEAI_SALE, method: 'e& 40% sold for $2.2bn → $2.2bn / 0.40 = $5.5bn. A secondary print, not a primary post-money.' },
      { label: 'Capacity / sites', basis: 'stated', confidence: 'high', source: 'The National / AGBI / Zawya', url: AGBI_KSA, method: '~360MW operational (Feb-25) vs ~650MW incl. construction (Dec-25) — distinct measures, kept separate.' },
      { label: 'UAE market share (~73–74%)', basis: 'stated', confidence: 'medium', source: 'The National / Khazna PR', url: NAT_850, method: 'Company/press figure; no independent regulator breakdown — medium confidence.' },
      { label: 'Debt facility ($2.62bn, ≤10yr)', basis: 'stated', confidence: 'high', source: 'Khazna press release', url: PR_FIN },
      { label: 'Revenue', basis: 'estimated', confidence: 'low', method: 'Not disclosed (G42 subsidiary). Modelled ~$400m = ~360MW × ~$1.5–2.0m/MW at partial fill; a sizing aid only, falsifiable on the first real data-room number.' },
      { label: 'EBITDA margin', basis: 'estimated', confidence: 'low', method: 'Not disclosed. ~45–52% applied from Equinix/Digital Realty; Khazna’s own margin and capex-recovery curve are unknown.' },
      { label: 'Utilisation / contract tenor / backlog', basis: 'estimated', confidence: 'low', method: 'Not disclosed. "Presold >400MW" is company commentary, not an audited backlog or WALT.' },
      { label: 'Cap-table split (G42/MGX/Silver Lake)', basis: 'estimated', confidence: 'low', source: 'MEED', url: MEED_SHARE, method: 'Only "G42 majority, MGX+Silver Lake minority" disclosed; exact percentages not public.' },
    ],
  },
  shariaScreen: {
    status: 'mixed',
    note: 'The operating model — leasing power and space under colocation contracts — is asset-backed and tangible, consistent with Shariah principles; the September 2025 $2.62bn conventional bank facility is an interest-bearing funding layer that would require a sukuk or Islamic-tranche structure to be fully compliant.',
    source: 'Reasoning from the disclosed $2.62bn ADCB/FAB facility; no Islamic-finance tranche or Shariah certification has been published.',
    url: PR_FIN,
  },
  narrative: {
    whyNow:
      'The deal surfaces following the February 2025 secondary in which e& sold its 40% stake for $2.2bn, implying a ~$5.5bn mark, and the September 2025 $2.62bn bank facility funding the build-out toward 850MW in the UAE by 2029 and the 1GW Stargate UAE cluster.',
    barriers: [
      { axis: 'Land and power access', rating: 'high', note: 'Securing grid-scale power allocations and permitted sites for AI-grade capacity is scarce and slow in the UAE; this constraint underpins the approximately 73% market share and cannot be replicated quickly by a new entrant.' },
      { axis: 'Capital intensity', rating: 'high', note: 'Construction costs of $8–12m per MW and a $2.62bn debt facility set a capital threshold that excludes sub-scale operators from competing for hyperscale demand.' },
      { axis: 'Anchor demand and ecosystem', rating: 'high', note: 'The G42 relationship, e& as anchor tenant and the 1GW Stargate UAE workloads (OpenAI, Oracle, Nvidia) provide pre-committed demand a standalone operator could not originate.' },
      { axis: 'Permitting and critical-infrastructure status', rating: 'medium', note: 'Operation under UAE critical-infrastructure and data-residency rules raises regulatory and approval barriers that protect incumbents while remaining a compliance burden.' },
      { axis: 'Switching costs', rating: 'medium', note: 'Long-dated colocation contracts and the physical cost of migrating live workloads lock tenants in once capacity is committed.' },
    ],
    profile:
      'Khazna Data Centers is the UAE’s dominant hyperscale data-centre operator (~73% market share), majority-owned by Abu Dhabi’s G42. It runs ~30 live facilities and ~360MW of operational capacity (rising to ~650MW counting sites under construction by Dec 2025), grown from just 40MW in 2020. It sells power-and-space colocation to hyperscalers and enterprises, with e& as an anchor tenant. In Feb 2025 e& sold its 40% stake for $2.2bn (a secondary, implying ~$5.5bn) to G42/MGX/Silver Lake, and in Sep 2025 the company raised a $2.62bn bank facility (ADCB, FAB; ≤10-yr) for expansion. It is targeting 850MW in the UAE by 2029 and >1GW of additional AI-ready capacity by 2030 across the UAE, Saudi Arabia (first DC in Dammam, up to 200MW), Italy and elsewhere — anchored by the 1GW Stargate UAE AI cluster (OpenAI, Oracle, Nvidia). Crucially, as a G42 private subsidiary it publishes no P&L: revenue, EBITDA and utilisation are all undisclosed.',
    revenueModel: 'Long-term contracted colocation revenue (power + space) to hyperscalers and enterprises, with utilisation upside as new capacity fills. Khazna does not break out its revenue lines or rates; the split below is a sector model, not disclosed.',
    revenueLines: [
      { name: 'Hyperscale colocation (power + space)', sharePct: 70, basis: 'estimated', description: 'Long-dated leases to cloud/AI hyperscalers — the core annuity. Priced on committed MW; the actual $/MW lease rate and WALT are undisclosed. e& and G42/Stargate workloads anchor demand.' },
      { name: 'Enterprise & sovereign colocation', sharePct: 20, basis: 'estimated', description: 'Retail/wholesale colocation to UAE enterprises and government, supported by data-residency rules. Higher rate, shorter tenor than hyperscale.' },
      { name: 'Interconnection & managed services', sharePct: 10, basis: 'estimated', description: 'Cross-connects, power-density premiums and managed/AI-grade services — small but higher-margin, typical of the sector. Share is an estimate, not disclosed.' },
    ],
    marketRead:
      'The principal uncertainty is price and capital, not demand or share — sovereign AI/cloud demand and data-residency rules create a durable UAE capacity shortage, and MENA DC capacity is projected to roughly double in five years. Khazna is the clear leader (~73%) with a wide land/power/permit moat and the G42/Stargate anchor. The material questions are (1) price: what return a minority equity holder can earn at a $5.5bn entry, and (2) capital: this is a capex-first, debt-funded ($2.62bn) infrastructure build whose contracted-backlog, utilisation and EBITDA are all undisclosed, so the annuity the thesis rests on cannot yet be verified from outside.',
    regulatory:
      'Operates under UAE critical-infrastructure and data-residency rules — supportive, and part of the moat. The Stargate/G42 link to US technology (Nvidia GPUs, OpenAI/Oracle) sits within the UAE–US AI framework; export-control and tech-transfer sensitivity around G42 is a live geopolitical item to monitor, not a current breach.',
    caseFor: [
      'Dominant, contracted hyperscale infrastructure with a wide moat: ~73% UAE share, scarce land/power/permits, and the G42 ecosystem (e& anchor tenant + the 1GW Stargate AI cluster with OpenAI/Oracle/Nvidia).',
      'A real, fast capacity ramp: 40MW (2020) → ~360MW operational (2025), ~650MW incl. construction, targeting 850MW UAE by 2029 and >1GW more by 2030 — ~9x in five years, with a fresh $2.62bn facility funding it.',
      'Sophisticated, aligned ownership (G42 majority + Silver Lake + MGX) and an infrastructure-grade, long-dated cash-flow profile that a deep pool of infra funds and an IPO can exit into.',
    ],
    caseAgainst: [
      'Priced as infrastructure: at a $5.5bn mark a minority growth-equity stake cannot clear a 22% hurdle — the asset would suit an infra fund’s lower hurdle, so this is a strategy/price mismatch, not a quality problem.',
      'No verifiable economics: revenue, EBITDA, utilisation and contracted-backlog/WALT are all undisclosed (G42 subsidiary) — the colocation "annuity" the thesis depends on is asserted, not yet provable, and "presold >400MW" is commentary, not an audited backlog.',
      'Access and structure are the real blockers: there is no open primary round (the $2.2bn was a secondary, the $2.62bn is debt), so a minority would be buying a passive secondary stake at $5.5bn with no obvious path to governance, primary-diligence rights, or the data needed to underwrite — alongside e&/G42 tenant-concentration risk.',
    ],
    leadership: [
      { name: 'Hassan Al Naqbi', role: 'Chief Executive Officer', note: 'Leading the UAE 850MW build and the >1GW multi-country expansion' },
      { name: 'G42', role: 'Majority shareholder', note: 'Abu Dhabi AI group; provides anchor demand (Stargate) and strategic direction' },
      { name: 'Silver Lake & MGX', role: 'Minority shareholders', note: 'Joined via the Feb-2025 e& exit; Silver Lake is also a G42 investor' },
    ],
    leadershipGaps: 'Strong sponsor and operating team; the diligence gap is governance access for a new minority — board/observer rights and audited financial reporting are not evident for an outside growth investor entering at $5.5bn.',
    legalStanding: 'No adverse media or sanctions findings against Khazna; regulated critical-infrastructure entity. The watch item is geopolitical: G42’s US-tech links (Nvidia/OpenAI/Oracle via Stargate) sit inside the UAE–US AI framework and carry export-control sensitivity.',
    valuationVerdict:
      'A best-in-class infrastructure asset — but priced as one, off a secondary print. A 22%-hurdle growth-equity minority cannot reach the hurdle at $5.5bn, and there is no open primary to invest in; the same asset would clear an infrastructure fund’s lower hurdle. Compounding it, the economics that would justify any number — revenue, EBITDA, utilisation, backlog — are undisclosed. This is a strategy/price and access problem, not a quality problem.',
    limitations: [
      'No public P&L: revenue, EBITDA, utilisation and contracted-backlog are all undisclosed; the financials shown are explicitly illustrative, capacity-derived estimates.',
      'The $5.5bn is a secondary print and the $2.62bn is debt — there is no open primary round; the "ask" modelled here is a hypothetical minority secondary.',
      'Cap-table split between G42/MGX/Silver Lake is not public; returns are highly sensitive to entry price and to the (undisclosed) leverage and capex-recovery curve.',
    ],
    icThesis:
      'Only fits a lower-hurdle infrastructure strategy. For this growth-equity mandate the returns do not clear at $5.5bn, there is no primary to invest in, and the underwriting data is undisclosed — three independent reasons to hold.',
    useOfFunds: 'n/a for an equity investor today (no open primary). Company capex — funded by the $2.62bn facility — goes to UAE build-out (Ajman, Masdar, Stargate UAE) and international expansion (KSA Dammam, Italy).',
    proposedTerms: [
      { label: 'Instrument', value: 'Minority equity (secondary; no primary on offer)' },
      { label: 'Ownership', value: '~2.2% at the $5.5bn mark for a $120m ticket' },
      { label: 'Protections', value: 'Information rights, tag-along — limited as a minority secondary' },
      { label: 'Governance', value: 'Observer at best; no board control' },
      { label: 'Conditions to close', value: 'Audited revenue/EBITDA, utilisation & WALT, contracted-backlog evidence, capex/leverage schedule, tenant-concentration (e&/G42) breakdown' },
    ],
    riskRegister: [
      { risk: 'Return vs hurdle / entry price', severity: 'high', likelihood: 'high', impact: 'Infra-grade minority returns fall short of the 22% growth-equity hurdle at $5.5bn', mitigation: 'Reassess under an infrastructure mandate/hurdle, or negotiate a materially lower entry', monitoring: 'Return sensitivity to entry and leverage' },
      { risk: 'Undisclosed economics', severity: 'high', likelihood: 'high', impact: 'Cannot underwrite without revenue, EBITDA, utilisation and contracted-backlog', mitigation: 'Gate any bid on full data-room disclosure', monitoring: 'Data-room access' },
      { risk: 'No primary / access & governance', severity: 'high', likelihood: 'medium', impact: 'Only a passive secondary stake available; weak governance and exit control', mitigation: 'Require information/board rights as a closing condition', monitoring: 'Term-sheet negotiation' },
      { risk: 'Capital intensity & leverage', severity: 'medium', likelihood: 'medium', impact: '$8–12m/MW capex and $2.62bn debt drive the return and downside', mitigation: 'Confirm project-finance ring-fencing and covenant terms', monitoring: 'Capex vs plan; leverage vs covenants' },
      { risk: 'Tenant concentration (e& / G42 / Stargate)', severity: 'medium', likelihood: 'medium', impact: 'Reliance on a few related/anchor tenants for backlog', mitigation: 'Confirm tenant mix, lease tenor and arm’s-length pricing', monitoring: 'Contract mix and renewals' },
    ],
    recommendationSummary:
      'Review — a best-in-class infrastructure asset whose minority returns do not clear the 22% growth-equity hurdle at a $5.5bn secondary mark, with no open primary to invest in and no disclosed economics to underwrite. Reconsider only under an infrastructure mandate with a lower hurdle, with full data-room access, and at a materially different structure.',
  },
  createdAt: '2026-06-04',
}
