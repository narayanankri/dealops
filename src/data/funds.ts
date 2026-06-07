import type { Fund, Mandate } from '@/types'
import { defaultMandate } from './mandate'

// A second, deliberately-different vehicle so the same deal underwrites differently across funds:
// control buyout, levered, larger, higher hurdle, control-equity only, later stages, buyout sectors.
const buyoutMandate: Mandate = {
  fundName: 'GCC Buyout Fund II',
  fundSizeUSDm: 3000,
  strategyArchetype: 'buyout',
  controlPosture: 'control',
  leverage: true,
  holdYears: [4, 6],
  targetSectors: [
    { name: 'Industrials', priority: true },
    { name: 'Consumer', priority: true },
    { name: 'Healthcare', priority: false },
    { name: 'Digital Infrastructure', priority: false },
    { name: 'Technology', priority: false },
    { name: 'Financial Services', priority: false },
  ],
  coreGeographies: ['Saudi Arabia', 'UAE', 'Kuwait', 'Bahrain'],
  flaggedGeographies: ['Qatar', 'Oman', 'Egypt', 'Jordan', 'MENA'],
  excludedGeographies: ['Iran', 'Syria', 'North Korea'],
  stages: ['Growth', 'Pre-IPO', 'Buyout', 'Series D', 'Series E'],
  instruments: ['Equity', 'Control equity'],
  ticketBandUSDm: [50, 400],
  concentrationCapPct: 12,
  returnHurdlePct: 25,
  publicReferencePct: 18,
  redLines: ['Gambling', 'Sanctioned / FATF grey-list exposure', 'Instrument or stage outside the permitted set'],
}

export const seedFunds: Fund[] = [
  { id: 'growth-fund-1', mandate: defaultMandate },
  { id: 'buyout-fund-2', mandate: buyoutMandate },
]

// Which fund's pipeline each seed deal sits in (its "home" fund).
export const fundAssignment: Record<string, string> = {
  khazna: 'buyout-fund-2',
  floward: 'buyout-fund-2',
  // everything else defaults to growth-fund-1
}
