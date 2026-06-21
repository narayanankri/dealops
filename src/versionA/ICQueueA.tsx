import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '@/lib/store'
import { usdm } from '@/lib/format'
import { statusActions } from '@/lib/status'
import type { Analysis, Deal, DealStatus } from '@/types'
import { TopBarA } from './TopBarA'
import { T, FONT } from './theme'
import { Card, KPI, Mono, ScoreBadge, StatusPill, VerdictBadge, Btn } from './uiA'

export function ICQueueA() {
  const { deals, analysisFor, activeFundId, activeFund, setStatus } = useApp()
  const navigate = useNavigate()

  const queued = useMemo(
    () => deals.filter((d) => d.status === 'sent-to-ic' && d.fundId === activeFundId),
    [deals, activeFundId],
  )
  const capital = queued.reduce((s, d) => s + d.ticketUSDm, 0)

  return (
    <>
      <TopBarA
        title="IC Queue"
        breadcrumb={activeFund.mandate.fundName}
        subtitle={`${queued.length} ${queued.length === 1 ? 'deal' : 'deals'} sent to the Investment Committee · ${usdm(capital)} in committee`}
      />
      <div style={{ padding: '24px 32px', maxWidth: 1180, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14, marginBottom: 22, maxWidth: 560 }}>
          <KPI label="In committee" value={queued.length} accent={T.amber} />
          <KPI label="Capital sent" value={usdm(capital)} accent={T.cyan} />
        </div>

        {queued.length === 0 ? (
          <Card style={{ display: 'grid', placeItems: 'center', padding: '72px 24px', textAlign: 'center' }}>
            <Mono color={T.muted} style={{ marginBottom: 10 }}>Empty queue</Mono>
            <div style={{ fontSize: 13, color: T.mutedHi, lineHeight: 1.6, maxWidth: 420 }}>
              No deals in committee. Open a deal and use{' '}
              <span style={{ color: T.cyan, fontWeight: 600 }}>Send to IC</span> to add it here.
            </div>
          </Card>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {queued.map((d) => (
              <QueueCard
                key={d.id}
                deal={d}
                a={analysisFor(d)}
                onOpen={() => navigate(`/a/deal/${d.id}`)}
                onAction={(to) => setStatus(d.id, to)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  )
}

function QueueCard({
  deal,
  a,
  onOpen,
  onAction,
}: {
  deal: Deal
  a: Analysis
  onOpen: () => void
  onAction: (to: DealStatus) => void
}) {
  const actions = statusActions(deal.status)
  return (
    <Card accent={T.amber} padding="20px 24px" hoverable>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
        <div style={{ minWidth: 0, flex: '1 1 320px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <button
              onClick={onOpen}
              style={{
                background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left',
                fontFamily: FONT.serif, fontSize: 18, fontWeight: 700, color: T.text, letterSpacing: -0.3, transition: 'color 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = T.cyan)}
              onMouseLeave={(e) => (e.currentTarget.style.color = T.text)}
            >
              {deal.name}
            </button>
            <StatusPill status={deal.status} />
            <VerdictBadge verdict={a.verdict} />
          </div>
          <div style={{ marginTop: 6, fontSize: 11, color: T.muted, fontFamily: FONT.mono, letterSpacing: 0.3 }}>
            {deal.sector} · {deal.geography} · {deal.stage} · Ticket {usdm(deal.ticketUSDm)}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, flexShrink: 0 }}>
          <MiniScore label="Composite" v={a.composite} />
          <MiniScore label="Mandate" v={a.mandateFit.score} />
          <MiniScore label="Merit" v={a.meritScore} />
        </div>
      </div>

      {a.conditions.length > 0 && (
        <div style={{ marginTop: 16, background: T.cardHi, border: `1px solid ${T.border}`, borderRadius: 8, padding: '14px 16px' }}>
          <Mono color={T.amber} style={{ marginBottom: 8 }}>Open items for committee</Mono>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 7 }}>
            {a.conditions.map((c, i) => (
              <li key={i} style={{ display: 'flex', gap: 10, fontSize: 13, color: T.mutedHi, lineHeight: 1.5 }}>
                <span style={{ marginTop: 6, width: 6, height: 6, flexShrink: 0, borderRadius: 1, border: `1px solid ${T.amber}` }} />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {actions.map((act) => (
            <Btn
              key={act.to}
              variant={act.danger ? 'danger' : 'ghost'}
              size="sm"
              onClick={() => onAction(act.to)}
            >
              {act.label}
            </Btn>
          ))}
        </div>
        <Btn variant="ghostCyan" size="sm" onClick={onOpen}>
          Open workspace →
        </Btn>
      </div>
    </Card>
  )
}

function MiniScore({ label, v }: { label: string; v: number }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <Mono style={{ fontSize: 9 }}>{label}</Mono>
      <div style={{ marginTop: 6 }}>
        <ScoreBadge score={v} size="sm" />
      </div>
    </div>
  )
}
