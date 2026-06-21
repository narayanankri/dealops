// ───────────────────────────────────────────────────────────
// Version A — Mandate Fit tab. Mirrors Version B's MandateTab content,
// re-skinned. Uses the RadarA spider for the fit summary.
// ───────────────────────────────────────────────────────────
import { T, FONT, alpha, scoreColor } from '../theme'
import { Card, Mono, SectionTitle, ScoreBadge, RadarA, type RadarDatumA } from '../uiA'
import { usdm } from '@/lib/format'
import { useApp } from '@/lib/store'
import type { Analysis, Deal, Mandate } from '@/types'

const shortLabel: Record<string, string> = {
  market: 'Market', model: 'Model', financial: 'Financial', moat: 'Moat', team: 'Team',
  valuation: 'Valuation', exit: 'Exit', sector: 'Sector', geo: 'Geography', ticket: 'Ticket',
  stage: 'Stage', instrument: 'Instrument', return: 'Return', concentration: 'Concen.',
}
const statusColor = (s: string) => (s === 'pass' ? T.green : s === 'soft' ? T.amber : T.red)

function DimRow({ d }: { d: Analysis['mandateFit']['dimensions'][number] }) {
  return (
    <div style={{ padding: '12px 0', borderTop: `1px solid ${alpha(T.border, 0.6)}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ height: 8, width: 8, flexShrink: 0, borderRadius: '50%', background: statusColor(d.status) }} />
        <span style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{d.label}</span>
        <ScoreBadge score={d.score} size="sm" />
        {d.status === 'breach' && <Mono color={T.red}>breach</Mono>}
        {d.status === 'soft' && <Mono color={T.amber}>confirm</Mono>}
      </div>
      <p style={{ marginTop: 4, paddingLeft: 18, fontSize: 13, lineHeight: 1.55, color: T.mutedHi }}>{d.takeaway}</p>
    </div>
  )
}

function MandateSnapshot({ m }: { m: Mandate }) {
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
  const priority = m.targetSectors.filter((s) => s.priority).map((s) => s.name)
  const rows: [string, string][] = [
    ['Strategy', `${cap(m.strategyArchetype.replace('-', ' '))} · ${m.controlPosture.replace('-', ' ')}`],
    ['Priority sectors', priority.join(', ') || '—'],
    ['Core geographies', m.coreGeographies.join(', ')],
    ['Stages', m.stages.join(', ')],
    ['Ticket band', `${usdm(m.ticketBandUSDm[0])}–${usdm(m.ticketBandUSDm[1])}`],
    ['Return hurdle', `${m.returnHurdlePct}% IRR`],
    ['Concentration cap', `${m.concentrationCapPct}% of fund`],
  ]
  return (
    <Card padding="16px 20px">
      <SectionTitle kicker="the fund's rules" title="Judged against" />
      <div>
        {rows.map(([k, v]) => (
          <div key={k} style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, padding: '4px 0', borderBottom: `1px solid ${alpha(T.border, 0.5)}` }}>
            <span style={{ flexShrink: 0, fontSize: 11, color: T.muted }}>{k}</span>
            <span style={{ textAlign: 'right', fontSize: 11, fontWeight: 600, color: T.mutedHi }}>{v}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}

function FitAcrossFunds({ deal }: { deal: Deal }) {
  const { funds, activeFundId, analyzeUnder } = useApp()
  if (funds.length < 2) return null
  const th: React.CSSProperties = { padding: '8px 12px', fontSize: 9, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: T.muted, fontFamily: FONT.mono, borderBottom: `1px solid ${T.border}` }
  return (
    <Card padding="20px 24px">
      <SectionTitle kicker="same asset, underwritten by each mandate" title="Fit across funds" />
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ ...th, textAlign: 'left' }}>Fund</th>
            <th style={{ ...th, textAlign: 'center' }}>Composite</th>
            <th style={{ ...th, textAlign: 'center' }}>Mandate</th>
            <th style={{ ...th, textAlign: 'right' }}>Base IRR vs hurdle</th>
            <th style={{ ...th, textAlign: 'right' }}>Concentration</th>
          </tr>
        </thead>
        <tbody>
          {funds.map((f) => {
            const fa = analyzeUnder(deal, f)
            const base = fa.returns.scenarios.find((s) => s.name === 'base')!
            const conc = fa.mandateFit.concentration
            const active = f.id === activeFundId
            return (
              <tr key={f.id} style={{ borderBottom: `1px solid ${alpha(T.border, 0.6)}`, background: active ? alpha(T.cyan, 0.07) : 'transparent' }}>
                <td style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, color: T.text, fontSize: 13 }}>
                    {active && <span style={{ height: 6, width: 6, borderRadius: '50%', background: T.cyan }} />}
                    {f.mandate.fundName}
                  </div>
                  <div style={{ fontSize: 11, color: T.muted, textTransform: 'capitalize' }}>
                    {f.mandate.strategyArchetype.replace('-', ' ')} · {usdm(f.mandate.fundSizeUSDm)} · {f.mandate.returnHurdlePct}% hurdle
                  </div>
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}><ScoreBadge score={fa.composite} size="sm" /></td>
                <td style={{ padding: '12px', textAlign: 'center' }}><ScoreBadge score={fa.mandateFit.score} size="sm" /></td>
                <td style={{ padding: '12px', textAlign: 'right', fontFamily: FONT.mono, fontSize: 12 }}>
                  <span style={{ color: base.clearsHurdle ? T.green : T.red }}>{base.irrPct}%</span>
                  <span style={{ color: T.muted }}> / {f.mandate.returnHurdlePct}%</span>
                </td>
                <td style={{ padding: '12px', textAlign: 'right', fontFamily: FONT.mono, fontSize: 12 }}>
                  <span style={{ color: conc.fits ? T.mutedHi : T.amber }}>{conc.pctOfFund}%</span>
                  <span style={{ color: T.muted }}> / {conc.capPct}%</span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <p style={{ marginTop: 12, fontSize: 11, color: T.muted }}>
        The asset value is identical across funds — only the return model, the mandate gate, and the concentration test change with each fund's strategy.
      </p>
    </Card>
  )
}

export function MandateFitA({ deal, a }: { deal: Deal; a: Analysis }) {
  const { activeFund } = useApp()
  const m = activeFund.mandate
  const fit = a.mandateFit
  const conc = fit.concentration
  const radar: RadarDatumA[] = fit.dimensions.map((d) => ({ label: shortLabel[d.key] ?? d.label, value: d.score }))
  const hardKeys = ['sector', 'geo', 'stage', 'instrument']
  const gates = fit.dimensions.filter((d) => hardKeys.includes(d.key))
  const graded = fit.dimensions.filter((d) => !hardKeys.includes(d.key))
  const fitColor = scoreColor(fit.score)
  const concWarn = !conc.fits || conc.pctOfFund >= conc.capPct - 1
  const concTone = conc.fits ? (conc.pctOfFund >= conc.capPct - 1 ? T.amber : T.green) : T.red

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, alignItems: 'start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {fit.redLineBreaches.length > 0 && (
          <Card accent={T.red} padding="18px 22px" style={{ background: alpha(T.red, 0.08) }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.red }}>Red-line breach — hard stop</div>
            <ul style={{ listStyle: 'none', margin: '8px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {fit.redLineBreaches.map((b, i) => <li key={i} style={{ fontSize: 13, color: T.mutedHi }}>• {b}</li>)}
            </ul>
          </Card>
        )}

        <Card padding="20px 24px">
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 12 }}>
            <Mono>Assessment</Mono>
            <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontFamily: FONT.serif, fontSize: 28, fontWeight: 700, color: fitColor, letterSpacing: -0.5 }}>{fit.score}</span>
              <Mono>/ 100 fit</Mono>
            </span>
          </div>
          <p style={{ fontSize: 15, lineHeight: 1.6, color: T.mutedHi, margin: 0 }}>{fit.narrative}</p>
        </Card>

        <Card padding="20px 24px">
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 4 }}>
            <Mono>Eligibility gates</Mono>
            <Mono>pass / breach</Mono>
          </div>
          <div>{gates.map((d) => <DimRow key={d.key} d={d} />)}</div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 16, marginBottom: 4, borderTop: `1px solid ${T.border}`, paddingTop: 16 }}>
            <Mono>Graded fit</Mono>
            <Mono>scored 0–100</Mono>
          </div>
          <div>{graded.map((d) => <DimRow key={d.key} d={d} />)}</div>
        </Card>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Card padding="16px 20px">
          <SectionTitle title="Fit summary" />
          <RadarA data={radar} color={T.cyan} />
        </Card>
        <Card padding="16px 20px" accent={concWarn ? T.amber : undefined}>
          <SectionTitle kicker="ticket vs fund size" title="Concentration" />
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontFamily: FONT.serif, fontSize: 28, fontWeight: 700, color: concTone, letterSpacing: -0.5 }}>{conc.pctOfFund}%</span>
            <span style={{ fontSize: 11, color: T.muted }}>ticket as % of fund</span>
          </div>
          <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>cap {conc.capPct}% · max ticket {usdm(conc.capUSDm)}</div>
          <p style={{ marginTop: 12, fontSize: 13, lineHeight: 1.55, color: T.mutedHi }}>{conc.takeaway}</p>
        </Card>
        <MandateSnapshot m={m} />
      </div>

      <div style={{ gridColumn: '1 / -1' }}>
        <FitAcrossFunds deal={deal} />
      </div>
    </div>
  )
}
