// ───────────────────────────────────────────────────────────
// Version A — Deal Detail. KPMG-editorial facelift of the Version B deal page.
// Same engine/data/copy; re-skinned with the navy/serif primitives. Renders the
// header ring gauges, recommendation strip, tab nav, and the active tab body.
// ───────────────────────────────────────────────────────────
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useApp, IC_RECOMMENDATIONS, type IcRecommendation } from '@/lib/store'
import { usdm } from '@/lib/format'
import type { Analysis, Deal } from '@/types'
import { TopBarA } from './TopBarA'
import { T, FONT, alpha } from './theme'
import { Card, Mono, Serif, StatusPill, Btn, RingGaugeA } from './uiA'
import { OverviewA } from './tabs/OverviewA'
import { MandateFitA } from './tabs/MandateFitA'
import { MeritA } from './tabs/MeritA'
import { CompsA } from './tabs/CompsA'
import { ValuationA } from './tabs/ValuationA'
import { MemoA } from './tabs/MemoA'
import { ResearchA } from './tabs/ResearchA'
import { HistoryA } from './tabs/HistoryA'

const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'mandate', label: 'Mandate Fit' },
  { key: 'merit', label: 'Standalone Merit' },
  { key: 'comps', label: 'Comparables' },
  { key: 'valuation', label: 'Valuation & Scenarios' },
  { key: 'memo', label: 'IC Memo' },
  { key: 'research', label: 'Research' },
  { key: 'history', label: 'History' },
] as const
type TabKey = (typeof TABS)[number]['key']


function RecommendationStrip({ a }: { a: Analysis }) {
  return (
    <Card padding="18px 24px" style={{ marginTop: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: a.conditions.length > 0 ? '1fr 1fr' : '1fr', gap: 24 }}>
        <div>
          <Mono style={{ marginBottom: 8 }}>Key considerations</Mono>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {a.reasons.map((r, i) => (
              <li key={i} style={{ display: 'flex', gap: 8, fontSize: 13, lineHeight: 1.55, color: T.mutedHi }}>
                <span style={{ marginTop: 7, height: 4, width: 4, flexShrink: 0, borderRadius: '50%', background: T.cyan }} />
                {r}
              </li>
            ))}
          </ul>
        </div>
        {a.conditions.length > 0 && (
          <div style={{ borderLeft: `1px solid ${alpha(T.border, 0.6)}`, paddingLeft: 24 }}>
            <Mono style={{ marginBottom: 8 }}>Open items</Mono>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {a.conditions.map((c, i) => (
                <li key={i} style={{ display: 'flex', gap: 8, fontSize: 13, lineHeight: 1.55, color: T.mutedHi }}>
                  <span style={{ marginTop: 5, height: 7, width: 7, flexShrink: 0, borderRadius: 2, border: `1px solid ${T.amber}` }} />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Card>
  )
}

function DealHeader({ deal, a }: { deal: Deal; a: Analysis }) {
  return (
    <Card padding="22px 24px">
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Serif size={22}>{deal.name}</Serif>
            <StatusPill status={deal.status} />
          </div>
          <p style={{ marginTop: 6, fontSize: 13, color: T.mutedHi }}>{deal.oneLiner}</p>
          <p style={{ marginTop: 4, fontSize: 11, color: T.muted }}>
            {deal.sector} · {deal.geography} · {deal.stage}
            {deal.foundedYear ? ` · Founded ${deal.foundedYear}` : ''} · Ticket <span style={{ fontWeight: 600, color: T.mutedHi, fontFamily: FONT.mono }}>{usdm(deal.ticketUSDm)}</span>
          </p>
        </div>
      </div>

      <div style={{ marginTop: 22, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, justifyItems: 'center' }}>
        <RingGaugeA label="Composite" score={a.composite} />
        <RingGaugeA label="Mandate fit" score={a.mandateFit.score} />
        <RingGaugeA label="Standalone merit" score={a.meritScore} />
        <RingGaugeA label="Data trust" score={a.dataTrustScore} />
      </div>
    </Card>
  )
}

export function DealA() {
  const { id } = useParams()
  const { getDeal, analysisFor, reRun } = useApp()
  const navigate = useNavigate()
  const [tab, setTab] = useState<TabKey>('overview')
  const [icOpen, setIcOpen] = useState(false)

  const deal = id ? getDeal(id) : undefined
  if (!deal) {
    return (
      <>
        <TopBarA title="Deal not found" breadcrumb="Pipeline" />
        <div style={{ padding: 32, color: T.muted, fontSize: 13 }}>
          We couldn't find that deal.{' '}
          <span onClick={() => navigate('/a')} style={{ color: T.cyan, cursor: 'pointer', textDecoration: 'underline' }}>Back to pipeline</span>
        </div>
      </>
    )
  }

  const a = analysisFor(deal)

  const action = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <Btn variant="ghost" onClick={() => reRun(deal.id)}>Re-run</Btn>
      {deal.status === 'ready' && (
        <Btn
          variant="cyan"
          disabled={a.integrity.blocking}
          title={a.integrity.blocking ? 'Resolve the blocking coherence issues first' : undefined}
          onClick={() => {
            if (a.integrity.blocking) return
            setIcOpen(true)
          }}
        >
          Send to IC
        </Btn>
      )}
    </div>
  )

  return (
    <>
      <TopBarA title={deal.name} breadcrumb="Pipeline" subtitle={deal.oneLiner} action={action} />
      <div style={{ padding: '24px 32px', maxWidth: 1240, margin: '0 auto' }}>
        <button
          onClick={() => navigate('/a')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.muted, fontSize: 12, fontFamily: FONT.mono, padding: 0, marginBottom: 16 }}
          onMouseEnter={(e) => { e.currentTarget.style.color = T.mutedHi }}
          onMouseLeave={(e) => { e.currentTarget.style.color = T.muted }}
        >
          ← Pipeline
        </button>

        <DealHeader deal={deal} a={a} />
        <RecommendationStrip a={a} />

        {/* Tab nav */}
        <div style={{ marginTop: 24, marginBottom: 20, display: 'flex', gap: 4, overflowX: 'auto', borderBottom: `1px solid ${T.border}` }}>
          {TABS.map((t) => {
            const active = tab === t.key
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                style={{
                  position: 'relative', whiteSpace: 'nowrap', padding: '10px 14px', fontSize: 13, fontWeight: 500, cursor: 'pointer',
                  background: 'none', border: 'none', fontFamily: FONT.sans, color: active ? T.text : T.muted, transition: 'color 0.15s',
                }}
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = T.mutedHi }}
                onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = T.muted }}
              >
                {t.label}
                {active && <span style={{ position: 'absolute', left: 8, right: 8, bottom: -1, height: 2, borderRadius: 2, background: T.cyan }} />}
              </button>
            )
          })}
        </div>

        <div key={tab}>
          {tab === 'overview' && <OverviewA deal={deal} a={a} />}
          {tab === 'mandate' && <MandateFitA deal={deal} a={a} />}
          {tab === 'merit' && <MeritA deal={deal} a={a} />}
          {tab === 'comps' && <CompsA deal={deal} a={a} />}
          {tab === 'valuation' && <ValuationA deal={deal} a={a} />}
          {tab === 'memo' && <MemoA deal={deal} a={a} />}
          {tab === 'research' && <ResearchA deal={deal} a={a} />}
          {tab === 'history' && <HistoryA deal={deal} a={a} />}
        </div>
      </div>
      {icOpen && (
        <SendToIcModalA deal={deal} a={a} onClose={() => setIcOpen(false)} onDone={() => { setIcOpen(false); navigate('/a/ic-queue') }} />
      )}
    </>
  )
}

const verdictToRecA = (v: Analysis['verdict']): IcRecommendation => (v === 'proceed' ? 'proceed' : v === 'review' ? 'proceed-conditions' : 'pass')

function SendToIcModalA({ deal, a, onClose, onDone }: { deal: Deal; a: Analysis; onClose: () => void; onDone: () => void }) {
  const { sendToIc } = useApp()
  const [rec, setRec] = useState<IcRecommendation>(verdictToRecA(a.verdict))
  const [notes, setNotes] = useState('')
  const fieldStyle: React.CSSProperties = { width: '100%', marginTop: 6, padding: '10px 12px', background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, color: T.text, fontSize: 14, fontFamily: FONT.sans, outline: 'none', boxSizing: 'border-box' }
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(2,8,20,0.6)', padding: 16 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: 520, background: T.ink, border: `1px solid ${T.border}`, borderRadius: 14, padding: 26, boxShadow: '0 24px 70px rgba(0,0,0,0.5)' }}>
        <Mono color={T.cyan}>Send to Investment Committee</Mono>
        <div style={{ fontFamily: FONT.serif, fontSize: 22, fontWeight: 700, letterSpacing: -0.4, marginTop: 4, color: T.text }}>{deal.name}</div>
        <p style={{ marginTop: 4, fontSize: 13, color: T.muted }}>Record your recommendation and notes for the committee. They appear in the IC Queue.</p>

        <div style={{ marginTop: 18 }}>
          <Mono>Recommendation</Mono>
          <select value={rec} onChange={(e) => setRec(e.target.value as IcRecommendation)} style={fieldStyle}>
            {IC_RECOMMENDATIONS.map((r) => <option key={r.value} value={r.value} style={{ background: T.card }}>{r.label}</option>)}
          </select>
        </div>
        <div style={{ marginTop: 14 }}>
          <Mono>Notes to committee</Mono>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={5} placeholder="Your rationale, conditions to clear, and anything the committee should weigh…" style={{ ...fieldStyle, resize: 'none', lineHeight: 1.55 }} />
        </div>

        <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
          <Btn variant="cyan" onClick={() => { sendToIc(deal.id, rec, notes.trim()); onDone() }}>Send to IC →</Btn>
        </div>
      </div>
    </div>
  )
}
