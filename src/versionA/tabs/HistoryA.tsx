// ───────────────────────────────────────────────────────────
// Version A — History tab. Mirrors Version B's HistoryTab: a timeline of
// live store events plus the seeded analysis-run entries.
// ───────────────────────────────────────────────────────────
import { T, FONT } from '../theme'
import { Card, SectionTitle } from '../uiA'
import { useApp } from '@/lib/store'
import type { Analysis, Deal } from '@/types'

export function HistoryA({ deal, a }: { deal: Deal; a: Analysis }) {
  const { eventsFor } = useApp()
  const fmt = (iso: string) => {
    const d = new Date(iso)
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
  }
  const live = eventsFor(deal.id).map((e) => ({ when: fmt(e.at), what: e.what }))
  const seed = [
    { when: deal.createdAt, what: `Deal added and first analysed — composite ${a.composite}` },
    { when: deal.createdAt, what: `Research completed across ${deal.dataTrust.fields.length} sourced fields (data trust ${a.dataTrustScore})` },
    { when: deal.createdAt, what: `Mandate gate run vs ${a.mandateFit.dimensions.length} dimensions` },
  ]
  const events = [...live, ...seed]
  return (
    <Card padding="20px 24px">
      <SectionTitle title="Audit trail" />
      <ol style={{ listStyle: 'none', position: 'relative', margin: '0 0 0 8px', padding: 0, borderLeft: `1px solid ${T.border}` }}>
        {events.map((e, i) => (
          <li key={i} style={{ marginBottom: 16, marginLeft: 16, position: 'relative' }}>
            <span style={{ position: 'absolute', left: -22, top: 4, height: 12, width: 12, borderRadius: '50%', border: `2px solid ${T.bg}`, background: T.cyan }} />
            <div style={{ fontSize: 11, color: T.muted, fontFamily: FONT.mono }}>{e.when}</div>
            <div style={{ fontSize: 13, color: T.mutedHi }}>{e.what}</div>
          </li>
        ))}
      </ol>
    </Card>
  )
}
