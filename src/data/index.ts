import type { Deal } from '@/types'
import { tabby } from './deals/tabby'
import { tamara } from './deals/tamara'
import { lean } from './deals/lean'
import { floward } from './deals/floward'
import { nana } from './deals/nana'
import { propertyFinder } from './deals/property-finder'
import { talabat } from './deals/talabat'
import { luluRetail } from './deals/lulu-retail'
import { americana } from './deals/americana'
import { khazna } from './deals/khazna'
import { mntHalan } from './deals/mnt-halan'
import { tarabut } from './deals/tarabut'
import { ramp } from './deals/ramp'
import { plaid } from './deals/plaid'
import { spacex } from './deals/spacex'
import { memoDepth } from './deals/memo-depth'
import { fundAssignment } from './funds'

// Generated deals — authored headlessly (scripts/author-deal.mjs writes them as JSON) and picked up
// automatically here with NO code edit. The glob resolves to {} when the directory is empty, so this
// is inert until the autonomous pipeline produces its first deal.
const generatedModules = import.meta.glob('./generated/*.json', { eager: true }) as Record<string, { default: Deal }>
const generatedDeals: Deal[] = Object.values(generatedModules).map((m) => m.default)

// Real companies, sourced from public funding announcements.
// Financials/margins/current valuations are inferred or estimated and labelled per deal.
const allDeals: Deal[] = [tabby, tamara, lean, floward, nana, propertyFinder, talabat, luluRetail, americana, khazna, mntHalan, tarabut, ramp, plaid, spacex, ...generatedDeals]

export const seedDeals: Deal[] = allDeals.map((d) => {
  const fundId = fundAssignment[d.id] ?? 'growth-fund-1'
  const depth = memoDepth[d.id]
  return depth ? { ...d, fundId, narrative: { ...d.narrative, ...depth } } : { ...d, fundId }
})

// Dev guard: run the deterministic Coherence Ledger over every seeded deal at startup.
// Browser dev console only — the headless path is `npm run gate` (scripts/gate.mjs),
// which runs the same ledger in Node for CI and the autonomous authoring pipeline.
if (import.meta.env.DEV && typeof window !== 'undefined') {
  Promise.all([import('@/engine'), import('@/engine/validate'), import('./mandate')]).then(([{ assetValue, returns }, { coherenceChecks }, { defaultMandate }]) => {
    let bad = 0
    for (const d of seedDeals) {
      const checks = coherenceChecks(d, assetValue(d), returns(d, defaultMandate))
      const blocking = checks.filter((c) => c.severity === 'blocking')
      const warn = checks.filter((c) => c.severity === 'warn')
      if (blocking.length) { bad++; console.error(`[coherence] ${d.id}: ${blocking.length} BLOCKING —`, blocking.map((c) => `${c.label}: ${c.detail}`)) }
      else if (warn.length) console.warn(`[coherence] ${d.id}: ${warn.length} warning(s) —`, warn.map((c) => c.label))
    }
    console.info(`[coherence] checked ${seedDeals.length} deals — ${bad} with blocking issues`)
  })
}
