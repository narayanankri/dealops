// ───────────────────────────────────────────────────────────
// Version A — Standalone Merit tab. Mirrors Version B's MeritTab,
// re-skinned. Uses the RadarA spider for the merit summary.
// ───────────────────────────────────────────────────────────
import { T, FONT, alpha, scoreColor } from '../theme'
import { Card, Mono, SectionTitle, ScoreBadge, RadarA, type RadarDatumA } from '../uiA'
import type { Analysis, CapTableRow, Deal } from '@/types'

const shortLabel: Record<string, string> = {
  market: 'Market', model: 'Model', financial: 'Financial', moat: 'Moat', team: 'Team',
  valuation: 'Valuation', exit: 'Exit', sector: 'Sector', geo: 'Geography', ticket: 'Ticket',
  stage: 'Stage', instrument: 'Instrument', return: 'Return', concentration: 'Concen.',
}
const confColor = { high: T.green, medium: T.amber, low: T.red } as const

const capColor: Record<CapTableRow['type'], string> = {
  founder: T.cyan,
  investor: T.purpleSoft,
  esop: T.blue,
  other: T.border,
}
const capTypeLabel: Record<CapTableRow['type'], string> = {
  founder: 'Founders', investor: 'Investor', esop: 'ESOP', other: 'Other',
}

function CapTable({ rows }: { rows: CapTableRow[] }) {
  const total = rows.reduce((s, r) => s + r.pct, 0) || 100
  return (
    <div>
      <div style={{ marginBottom: 12, display: 'flex', height: 12, width: '100%', overflow: 'hidden', borderRadius: 6 }}>
        {rows.map((r, i) => (
          <div key={i} style={{ width: `${(r.pct / total) * 100}%`, background: capColor[r.type] }} title={`${r.holder} ${r.pct}%`} />
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {rows.map((r, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
            <span style={{ height: 10, width: 10, flexShrink: 0, borderRadius: 3, background: capColor[r.type] }} />
            <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: T.mutedHi }}>{r.holder}</span>
            <span style={{ marginLeft: 'auto', flexShrink: 0, fontSize: 9, letterSpacing: 1, textTransform: 'uppercase', color: T.muted, fontFamily: FONT.mono }}>{capTypeLabel[r.type]}</span>
            <span style={{ width: 36, flexShrink: 0, textAlign: 'right', fontWeight: 600, color: T.text, fontFamily: FONT.mono }}>{r.pct}%</span>
          </div>
        ))}
      </div>
      <p style={{ marginTop: 8, fontSize: 11, color: T.muted }}>Illustrative ownership — estimated from disclosed rounds.</p>
    </div>
  )
}

export function MeritA({ deal, a }: { deal: Deal; a: Analysis }) {
  const n = deal.narrative
  const radar: RadarDatumA[] = deal.merit.map((m) => ({ label: shortLabel[m.key] ?? m.label, value: m.score }))
  const meritColor = scoreColor(a.meritScore)

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, alignItems: 'start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Card padding="20px 24px">
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4px 12px', borderBottom: `1px solid ${T.border}`, paddingBottom: 16, marginBottom: 16 }}>
            <div>
              <Mono>Standalone merit</Mono>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
                <span style={{ fontFamily: FONT.serif, fontSize: 30, fontWeight: 700, color: meritColor, letterSpacing: -0.5 }}>{a.meritScore}</span>
                <span style={{ fontSize: 11, color: T.muted, fontStyle: 'italic' }}>{a.meritLabel}</span>
              </div>
            </div>
            <span style={{ marginLeft: 'auto', maxWidth: 280, textAlign: 'right', fontSize: 11, color: T.muted }}>
              Strategy-agnostic — is this a good business <em>on its own</em>, independent of the fund.
            </span>
          </div>
          <div>
            {deal.merit.map((m, idx) => (
              <div key={m.key} style={{ padding: '14px 0', borderTop: idx === 0 ? 'none' : `1px solid ${alpha(T.border, 0.6)}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <ScoreBadge score={m.score} size="sm" />
                  <span style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{m.label}</span>
                  <Mono color={confColor[m.confidence]}>{m.confidence} confidence</Mono>
                </div>
                <p style={{ marginTop: 6, fontSize: 13, lineHeight: 1.55, color: T.mutedHi }}>{m.rationale}</p>
                {m.confidenceReason && (
                  <p style={{ marginTop: 6, display: 'flex', gap: 6, fontSize: 11, lineHeight: 1.5, color: T.muted }}>
                    <span style={{ marginTop: 6, height: 4, width: 4, flexShrink: 0, borderRadius: '50%', background: T.amber }} />
                    <span>
                      <span style={{ fontWeight: 600, color: alpha(T.amber, 0.9) }}>Confidence held back: </span>
                      {m.confidenceReason}
                    </span>
                  </p>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Card padding="16px 20px">
          <SectionTitle title="Merit summary" />
          <RadarA data={radar} color={T.cyan} />
        </Card>

        <Card padding="16px 20px">
          <SectionTitle title="Leadership" />
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {n.leadership.map((p, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
                <span style={{ fontSize: 13, color: T.text }}>{p.name}</span>
                <span style={{ flexShrink: 0, fontSize: 11, color: T.muted }}>{p.role}</span>
              </li>
            ))}
          </ul>
          <p style={{ marginTop: 10, borderTop: `1px solid ${T.border}`, paddingTop: 10, fontSize: 11, lineHeight: 1.5, color: T.muted }}>{n.leadershipGaps}</p>
        </Card>

        {deal.capTable && (
          <Card padding="16px 20px">
            <SectionTitle title="Ownership" />
            <CapTable rows={deal.capTable} />
          </Card>
        )}

        <Card padding="16px 20px">
          <SectionTitle title="Legal / sanctions" />
          <p style={{ fontSize: 13, lineHeight: 1.55, color: T.mutedHi, margin: 0 }}>{n.legalStanding}</p>
        </Card>
      </div>
    </div>
  )
}
