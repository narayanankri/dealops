import type { Mandate } from '@/types'

// §3 illustrative mandate — fully editable in the Mandate screen (§9).
export const defaultMandate: Mandate = {
  fundName: 'GCC Growth Equity Fund I',
  fundSizeUSDm: 1600,
  strategyArchetype: 'growth-equity',
  controlPosture: 'significant-minority',
  leverage: false,
  holdYears: [4, 6],
  targetSectors: [
    { name: 'FinTech', priority: true, weight: 22 },
    { name: 'Financial Services', priority: true, weight: 18 },
    { name: 'Technology', priority: false, weight: 14 },
    { name: 'Software', priority: false, weight: 12 },
    { name: 'Digital Infrastructure', priority: false, weight: 11 },
    { name: 'Healthcare', priority: false, weight: 9 },
    { name: 'Consumer', priority: false, weight: 8 },
    { name: 'Industrials', priority: false, weight: 6 },
  ],
  coreGeographies: ['Saudi Arabia', 'UAE', 'Kuwait', 'Bahrain'],
  flaggedGeographies: ['Qatar', 'Oman', 'Egypt', 'Jordan', 'MENA'],
  excludedGeographies: ['Iran', 'Syria', 'North Korea'],
  stages: ['Series B', 'Series C', 'Series D', 'Series E', 'Growth', 'Pre-IPO'],
  instruments: ['Equity', 'Preferred', 'Growth equity'],
  ticketBandUSDm: [15, 200],
  concentrationCapPct: 10,
  returnHurdlePct: 22,
  publicReferencePct: 18,
  redLines: [
    'Gambling',
    'Sanctioned / FATF grey-list exposure',
    'Instrument or stage outside the permitted set',
  ],
}
