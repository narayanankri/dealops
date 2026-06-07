import type { Deal } from '@/types'

// Authored against AUTHORING.md, then revised after a Director critique pass (CRITIQUE.md).
// Corrections from that review: (1) size & growth of the LIVE business are genuinely undisclosed —
// state that, don't imply scale via cumulative downloads; (2) the smooth rising revenue ramp
// contradicted the distress thesis — replaced with an explicitly-illustrative flat-to-declining path;
// (3) "600k drivers" was a meaningless cumulative figure (public ~3,000 active); (4) the 18→13 city
// retrenchment and the missed 40%/$900m share target are surfaced as evidence FOR the decline.
const FWD = 'https://www.fwdstart.me/p/saudi-grocery-delivery-platform-nana-enters-financial-reorganisation-after-raising-over-200m-from-ki'
const WAMDA_C = 'https://www.wamda.com/2023/02/nana-raises-133-million-series-c-round-led-kingdom-holding'
const ARGAAM = 'https://www.argaam.com/en/article/articledetail/id/1892181'
const ZAWYA = 'https://www.zawya.com/en/business/retail-and-consumer/grocery-delivery-platform-nana-eyes-40-saudi-market-share-pe1lczir'
const SFT = 'https://saudifoodtech.sa/nana-from-market-pioneer-to-the-courtroom0/'

export const nana: Deal = {
  id: 'nana',
  name: 'Nana',
  oneLiner: 'Saudi online grocery & 15-minute dark-store delivery — now in court-supervised reorganisation',
  sector: 'Consumer',
  geography: 'Saudi Arabia',
  region: 'GCC',
  stage: 'Series C',
  foundedYear: 2016,
  status: 'ready',
  ticketUSDm: 15,
  instrument: 'Equity',
  controlPosture: 'significant-minority',
  ask: {
    // Distressed/illustrative: any bid would be at the IMPAIRED mark, not the ~$300m pre-distress
    // peak. ~$15m for ~30% at a ~$50m recap post-money — and we still decline (see verdict).
    askValuationUSDm: 50,
    series: 'Distressed recap (illustrative)',
    raisingUSDm: 15,
    date: 'Apr 2026',
  },
  roundHistory: [
    { series: 'Series C', date: 'Feb 2023', raisedUSDm: 133, leadInvestors: ['Kingdom Holding', 'Uni Ventures'], citation: { source: 'Wamda', url: WAMDA_C } },
    { series: 'Series B+', date: 'Feb 2022', raisedUSDm: 50, leadInvestors: ['FIM Partners', 'STV'], citation: { source: 'fwdstart', url: FWD } },
    { series: 'Series B', date: 'Mar 2020', raisedUSDm: 18, leadInvestors: ['STV', 'MEVP'], citation: { source: 'fwdstart', url: FWD } },
    { series: 'Series A', date: 'Feb 2019', raisedUSDm: 6.6, leadInvestors: ['MEVP', 'Impact46'], citation: { source: 'fwdstart', url: FWD } },
  ],
  totalRaisedUSDm: 208,
  // Impaired current equity (estimated). The ~$300m figure was the PRE-DISTRESS peak mark; post
  // court-reorganisation the equity is heavily impaired and subordinated to creditors — carried here
  // at a recovery-oriented ~$40m, implying ~0.7x EV/Revenue, consistent with the distress thesis.
  currentValuationUSDm: 40,
  vitals: {
    size: { label: 'Active customers / annual orders', value: 'Not disclosed', basis: 'estimated', note: 'Nana has never published MAU, annual orders or GMV. Only cumulative figures exist (~45m lifetime orders, 10m+ downloads) — vanity metrics that only ever rise and say nothing about current run-rate.' },
    growth: { label: 'Revenue / order trajectory', value: 'Not disclosed — likely declining', trend: 'down', basis: 'estimated', note: 'No revenue or customer-growth series is public. Three signals point to contraction, not growth: retrenchment from 18 cities (2023) to ~13, a missed public target of 40% / ~$900m share by 2025, and an Apr-2026 court reorganisation.' },
    unitEconomics: { label: 'Contribution margin / order', value: 'Not disclosed', basis: 'estimated', note: 'The thesis is "unit economics never worked", but per-order contribution and delivery cost are not public — they can only be modelled. Grocery basket gross margin is structurally thin (low-teens %).' },
    quality: { label: 'Order frequency / retention', value: 'Not disclosed', basis: 'estimated', note: 'No cohort retention or orders-per-customer published — the absence is itself a tell for a grocery model whose whole bull case is habituation.' },
  },
  headlineMetrics: [
    { label: 'Status', value: 'In reorganisation', trend: 'down', basis: 'stated', source: 'fwdstart', url: FWD },
    { label: 'Cities', value: '~13 (down from 18 in 2023)', trend: 'down', basis: 'stated', source: 'Zawya / fwdstart', url: ZAWYA },
    { label: 'Active drivers', value: '~3,000', basis: 'stated', source: 'Saudi FoodTech', url: SFT },
    { label: 'Cumulative orders (lifetime)', value: '~45m', basis: 'stated', source: 'fwdstart', url: FWD, },
    { label: 'Missed share target', value: '40% / ~$900m by 2025', basis: 'stated', source: 'Zawya', url: ZAWYA },
    { label: 'KSA online-grocery market', value: '~$1.2bn (2023)', trend: 'up', basis: 'stated', source: 'fwdstart', url: FWD },
  ],
  news: [
    { date: 'Apr 2026', headline: 'Enters court-supervised financial reorganisation (Riyadh Commercial Court); trustee appointed, 90-day creditor window', source: 'fwdstart', url: FWD },
    { date: 'Q4 2025', headline: 'Listed shareholder Jahez reportedly writes ~95% off its (~$2m) Nana stake — not named on a primary filing', source: 'Argaam', url: ARGAAM },
    { date: 'Sep 2024', headline: 'Meituan’s Keeta enters KSA with a ~SAR 1bn budget, launching 15-min grocery directly into Nana’s lane', source: 'Saudi FoodTech', url: SFT },
    { date: '2023', headline: 'Publicly targets 40% / ~$900m KSA grocery share by 2025 (from ~13%) — subsequently missed', source: 'Zawya', url: ZAWYA },
    { date: 'Feb 2023', headline: '$133m Series C led by Kingdom Holding & Uni Ventures', source: 'Wamda', url: WAMDA_C },
  ],
  peers: [
    { name: 'Jahez', public: true, evRevenue: 2.0, revGrowthPct: 30, ebitdaMarginPct: 12, scaleUSDm: 900, basis: 'estimated', rationale: 'Listed Saudi delivery; profitable — and a Nana shareholder marking it down (multiple as of 2025)' },
    { name: 'Talabat', public: true, evRevenue: 4.5, revGrowthPct: 20, ebitdaMarginPct: 25, scaleUSDm: 3000, basis: 'estimated', rationale: 'MENA delivery scale leader; profitable platform comp (2025)' },
    { name: 'Getir (private)', public: false, evRevenue: 1.0, revGrowthPct: -10, ebitdaMarginPct: -20, scaleUSDm: 500, basis: 'estimated', rationale: 'Global q-commerce; collapsed from ~$12bn to ~$2.5bn — cautionary comp' },
    { name: 'Gopuff (private)', public: false, evRevenue: 1.5, revGrowthPct: 5, ebitdaMarginPct: -15, scaleUSDm: 2000, basis: 'estimated', rationale: 'Dark-store q-commerce; distressed-multiple anchor' },
  ],
  assumptions: {
    baseRevenueUSDm: 140,
    revGrowthPct: [-5, -5, 0, 2, 3],
    ebitdaMarginPct: [-12, -8, -4, -1, 1],
    taxRatePct: 15,
    waccPct: 22,
    terminalGrowthPct: 2,
    netDebtUSDm: 60,
    exitEVRevenue: 0.7,
    holdYears: 4,
  },
  merit: [
    { key: 'market', label: 'Market opportunity', score: 58, confidence: 'medium', rationale: 'Saudi online grocery grew ~$100m (2017) → ~$1.2bn (2023) — demand is real. But category growth never saved Getir/Gorillas, and a well-funded entrant (Keeta) is now competing the economics down further.' },
    { key: 'model', label: 'Business model', score: 40, confidence: 'low', rationale: '15-minute dark-store grocery: thin basket margin (low-teens %) against high fixed dark-store + last-mile cost. A marketplace/retail-media pivot was added but never offset fulfilment cost — per-order economics are undisclosed.' },
    { key: 'financial', label: 'Financial profile', score: 24, confidence: 'low', rationale: 'In court-supervised reorganisation; equity impaired and subordinated to creditors. Size and trajectory of the live business are undisclosed — but the 18→13 city retrenchment and missed share target imply contraction, not growth.', confidenceReason: 'No P&L, GMV or active-customer figure ever disclosed; the reorganisation is the only hard financial fact.' },
    { key: 'moat', label: 'Competitive moat', score: 36, confidence: 'low', rationale: 'Little differentiation in a price war: Meituan’s Keeta entered KSA (Sep 2024, ~SAR 1bn) straight into the 15-min lane; peer Shgardi shut down entirely.' },
    { key: 'team', label: 'Team', score: 42, confidence: 'low', rationale: 'Founder-led; governance now runs through the court-appointed trustee and management bandwidth is consumed by the creditor process.' },
    { key: 'valuation', label: 'Valuation', score: 28, confidence: 'low', rationale: 'No clean mark; equity likely impaired toward zero (a listed holder’s ~$2m position reportedly written down ~95%). Any value sits in assets/recap, not equity.' },
    { key: 'exit', label: 'Exit pathway', score: 36, confidence: 'low', rationale: 'Narrow buyer pool for a distressed q-commerce asset; the plausible exit is an asset/recap sale, not a strategic premium.' },
  ],
  financials: {
    years: ['FY22', 'FY23', 'FY24E', 'FY25E', 'FY26E'],
    revenue: [180, 200, 180, 145, 120],
    ebitda: [-40, -30, -28, -18, -10],
  },
  capTable: [
    { holder: 'Founders & management', pct: 15, type: 'founder' },
    { holder: 'Kingdom Holding & Uni Ventures', pct: 42, type: 'investor' },
    { holder: 'STV, FIM, MEVP & earlier', pct: 33, type: 'investor' },
    { holder: 'Employee option pool', pct: 10, type: 'esop' },
  ],
  dataTrust: {
    fields: [
      { label: 'Funding rounds (amounts, dates, leads)', basis: 'stated', confidence: 'high', source: 'Wamda / fwdstart', url: WAMDA_C },
      { label: 'Total raised (~$208m)', basis: 'stated', confidence: 'high', source: 'fwdstart', url: FWD },
      { label: 'Reorganisation (court, trustee, 90-day claims)', basis: 'stated', confidence: 'high', source: 'fwdstart', url: FWD },
      { label: '18→13 city retrenchment; missed 40%/$900m target', basis: 'stated', confidence: 'medium', source: 'Zawya', url: ZAWYA },
      { label: 'Active customers / annual orders / GMV', basis: 'estimated', confidence: 'low', method: 'Never disclosed; only cumulative lifetime orders (~45m) and downloads (10m+) are public — neither indicates current scale.' },
      { label: 'Revenue path & line mix', basis: 'estimated', confidence: 'low', method: 'No P&L disclosed. The financials shown are an explicitly-illustrative flat-to-declining path consistent with the reorganisation — not company figures.' },
      { label: 'Jahez ~95% write-off', basis: 'estimated', confidence: 'low', source: 'Argaam', url: ARGAAM, method: 'Reported in trade press on a ~$2m stake; the matching Argaam Q4-25 disclosure shows SAR 12m investment losses without naming Nana — weak as a signal, not confirmed.' },
      { label: 'Peer multiples', basis: 'estimated', confidence: 'low', method: 'Indicative 2025 EV/Revenue marks for context; not a dated, sourced comp set — for a real bid these need a data room.' },
    ],
  },
  shariaScreen: {
    status: 'compliant',
    note: 'Online grocery retail with delivery and marketplace commission carries no interest income or prohibited-activity exposure, and the funding history is equity rather than conventional debt; the dominant fact is the reorganisation, not a compliance concern.',
    source: 'Reasoning from the disclosed equity funding history (fwdstart); no formal Shariah certification has been published.',
    url: FWD,
  },
  narrative: {
    whyNow:
      'The deal surfaces on the April 2026 court-supervised financial reorganisation at the Riyadh Commercial Court, with a trustee appointed and a 90-day creditor-claim window opened, following retrenchment from 18 cities to approximately 13 and a missed public 40% / ~$900m share target.',
    barriers: [
      { axis: 'Dark-store network density', rating: 'low', note: 'A 15-minute model requires dense dark-store coverage, but Nana retrenched from 18 to approximately 13 cities and the network proved capital-destructive rather than protective.' },
      { axis: 'Capital depth', rating: 'low', note: 'Approximately $208m raised was insufficient to outlast competition; Meituan’s Keeta entered KSA in September 2024 with a ~SAR 1bn budget, demonstrating that incumbent capital provides no durable wall.' },
      { axis: 'Unit economics / cost moat', rating: 'low', note: 'Thin low-teens grocery basket margin against high fixed dark-store and last-mile cost gives no cost advantage; the model entered reorganisation rather than reaching profitability.' },
      { axis: 'Customer switching costs', rating: 'low', note: 'Grocery-delivery customers multi-home across apps on price and speed, so habituation never translated into defensible lock-in.' },
    ],
    profile:
      'Nana is a Riyadh-based online grocery platform (founded 2016) running a 15-minute dark-store delivery model. It scaled to ~18 KSA cities by 2023 and raised ~$208m over four disclosed rounds (Series C: $133m, Kingdom Holding-led, 2023), acquiring Egyptian fintech Rasseed in 2024. It has since retrenched to ~13 cities and, in early 2026, entered court-supervised financial reorganisation under the Saudi Bankruptcy Law. Crucially, the size and trajectory of the live business — active customers, annual orders, GMV — were never disclosed.',
    revenueModel: 'Thin grocery basket margin plus delivery fees, layered with marketplace commission, retail-media and a nascent fintech line — but the unit economics never cleared the cost of 15-minute dark-store fulfilment. Per-line shares are modelled, not disclosed.',
    revenueLines: [
      { name: 'Grocery basket margin', sharePct: 55, basis: 'estimated', description: 'Buy-sell retail spread on own-fulfilled dark-store baskets — structurally thin (low-teens % gross). The core line and the margin problem; share is a q-commerce-model estimate.' },
      { name: 'Delivery & service fees', sharePct: 15, basis: 'estimated', description: 'Per-order delivery/service charge on 15-minute orders; rarely covers true last-mile cost.' },
      { name: 'Marketplace commission', sharePct: 15, basis: 'estimated', description: 'Take-rate charged to hypermarkets/retailers listing inventory to Nana’s base — the asset-lighter, higher-margin pivot.' },
      { name: 'Retail media & promotions', sharePct: 8, basis: 'estimated', description: 'Supplier-funded promotions and paid placement — small but high-margin where it exists.' },
      { name: 'Fintech (Rasseed)', sharePct: 7, basis: 'estimated', description: 'Wallet/financial features following the Oct-2024 Rasseed acquisition; nascent and unproven.' },
    ],
    marketRead:
      'Demand is established (KSA online grocery $100m→$1.2bn, 2017–2023), but this is a category where capital outran unit economics worldwide. The KSA-specific killer was competition: Meituan’s Keeta entered in Sep 2024 with a ~SAR 1bn budget and a 15-minute grocery product aimed directly at Nana, while peer Shgardi exited. Nana’s own public target of 40% / ~$900m share by 2025 was missed — it is in reorganisation instead.',
    regulatory:
      'Standard consumer/retail regulation; the dominant legal fact now is the reorganisation itself — a court-supervised process (Riyadh Commercial Court) with an appointed trustee and a 90-day creditor-claim window, which subordinates equity to creditors.',
    caseFor: [
      'A built network at peak: ~18 cities and ~45m lifetime orders show Nana reached real scale once — a brand/footprint a recap or asset buyer could inherit (though current active scale is undisclosed).',
      'Large, growing category: KSA online grocery 12×’d to ~$1.2bn (2017→2023) — the constraint is the operating model, not demand.',
      'Reorganisation, not liquidation: ~$208m of sunk capital and marquee sponsors (Kingdom Holding, STV) mean a court-supervised process may preserve asset/recap option value for new money senior to old equity.',
    ],
    caseAgainst: [
      'In court-supervised reorganisation (trustee appointed, 90-day creditor window) — equity is impaired and subordinated; this is the one fact that carries the decision.',
      'Evidence of contraction, not growth: retrenched from 18 to ~13 cities, missed its own 40%/$900m-by-2025 target, and never disclosed active customers, orders or GMV — a company raising $208m and filing in 2026 was flat-to-declining at the end.',
      'Structurally broken, competitively crushed: 15-min dark-store economics never worked, and Meituan/Keeta entered the lane with ~SAR 1bn while peer Shgardi shut down.',
    ],
    leadership: [
      { name: 'Abdulmajeed Alsukhan', role: 'Co-founder & CEO' },
      { name: 'Majed bin Munir Al-Nimr', role: 'Court-appointed trustee', note: 'Overseeing the reorganisation' },
    ],
    leadershipGaps: 'Management bandwidth is consumed by the creditor/restructuring process; governance runs through the court trustee, and turnaround capability is unproven.',
    legalStanding: 'Court-supervised reorganisation dominates: equity ranks behind creditors, the 90-day claims process is open, and any investment is a special-situations/recap play, not a growth-equity entry.',
    valuationVerdict:
      'Not a pricing question. The ~$300m often cited is the stale PRE-distress peak mark; post court-reorganisation the equity is heavily impaired and subordinated to creditors — we carry it at a recovery-oriented ~$40m (~0.7x EV/revenue on the illustrative ~$140m, below even distressed q-commerce comps). Any entry would be a small distressed recap at that impaired level, not the $300m growth mark — and with unit economics that never worked and a contracting base, this is a gate-level pass regardless of price.',
    limitations: [
      'No P&L, GMV or active-customer figure ever disclosed; the financials shown are explicitly illustrative.',
      'The ~95% write-off is a reported ~$2m stub, not confirmed on a primary filing.',
      'Distressed peer multiples are indicative and undated.',
    ],
    icThesis: 'Not applicable — decline at screening. Revisit only as a distressed/special-situations or asset-acquisition opportunity, which is outside this growth-equity mandate.',
    useOfFunds: 'n/a — capital would fund a restructuring/recap, not growth.',
    proposedTerms: [{ label: 'Status', value: 'Decline — distressed; equity impaired and subordinated to creditors' }],
    riskRegister: [
      { risk: 'Solvency / reorganisation', severity: 'high', likelihood: 'high', impact: 'Capital impairment; creditors rank ahead of equity', mitigation: 'None at this stage — avoid as a primary', monitoring: 'Court process / creditor recovery' },
      { risk: 'Undisclosed size & trajectory', severity: 'high', likelihood: 'high', impact: 'Cannot underwrite a recap without active customers, orders, GMV and per-order economics', mitigation: 'Require trustee/data-room disclosure before any bid', monitoring: 'Data-room access' },
      { risk: 'Competition', severity: 'high', likelihood: 'high', impact: 'Meituan/Keeta entry with ~SAR 1bn budget', mitigation: 'n/a at current scale', monitoring: 'Share vs Keeta' },
    ],
    recommendationSummary:
      'Decline — a court reorganisation, impaired equity, evidence of contraction (18→13 cities, missed target) and a well-capitalised new entrant. Outside this growth-equity mandate; revisit only as a special-situation.',
  },
  createdAt: '2026-05-27',
}
