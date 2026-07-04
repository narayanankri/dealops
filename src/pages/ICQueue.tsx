import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp, icRecommendationLabel, type IcSubmission } from '@/lib/store'
import { ActionsMenu, Card, Pill, ScoreChip, StatusPill, Stat } from '@/components/ui'
import { usdm } from '@/lib/format'
import { statusActions } from '@/lib/status'
import type { Analysis, Deal, DealStatus } from '@/types'

const recTone = (r: IcSubmission['recommendation']): 'pos' | 'warn' | 'neg' | 'neutral' => (r === 'proceed' ? 'pos' : r === 'proceed-conditions' ? 'warn' : r === 'pass' ? 'neg' : 'neutral')

export function ICQueue() {
  const { deals, analysisFor, activeFundId, activeFund, setStatus, icSubmissionFor } = useApp()
  const navigate = useNavigate()

  const queued = useMemo(
    () => deals.filter((d) => d.status === 'sent-to-ic' && d.fundId === activeFundId),
    [deals, activeFundId],
  )
  const capital = queued.reduce((s, d) => s + d.ticketUSDm, 0)

  return (
    <div className="mx-auto max-w-[1180px] px-8 py-7">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-ink">IC Queue</h1>
        <p className="mt-0.5 text-sm text-ink-3">{activeFund.mandate.fundName} — deals sent to the Investment Committee</p>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Card className="px-4 py-3.5">
          <Stat label="In committee" value={queued.length} tone={queued.length ? 'accent' : 'neutral'} />
        </Card>
        <Card className="px-4 py-3.5">
          <Stat label="Capital sent" value={usdm(capital)} />
        </Card>
      </div>

      {queued.length === 0 ? (
        <Card className="grid place-items-center py-20 text-sm text-ink-3">
          No deals in committee. Open a deal and use <span className="mx-1 font-medium text-ink-2">Send to IC</span> to add it here.
        </Card>
      ) : (
        <div className="space-y-3">
          {queued.map((d) => (
            <QueueCard
              key={d.id}
              deal={d}
              a={analysisFor(d)}
              sub={icSubmissionFor(d.id)}
              onOpen={() => navigate(`/deal/${d.id}`)}
              onAction={(to) => setStatus(d.id, to)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function QueueCard({ deal, a, sub, onOpen, onAction }: { deal: Deal; a: Analysis; sub?: IcSubmission; onOpen: () => void; onAction: (to: DealStatus) => void }) {
  return (
    <Card className="px-6 py-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <button onClick={onOpen} className="text-base font-semibold text-ink hover:text-accent-2">
              {deal.name}
            </button>
            <StatusPill status={deal.status} />
            {sub && <Pill tone={recTone(sub.recommendation)}>{icRecommendationLabel(sub.recommendation)}</Pill>}
          </div>
          <p className="mt-0.5 text-xs text-ink-3">
            {deal.sector} · {deal.geography} · {deal.stage} · Ticket {usdm(deal.ticketUSDm)}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <MiniScore label="Composite" v={a.composite} />
          <MiniScore label="Mandate" v={a.mandateFit.score} />
          <MiniScore label="Merit" v={a.meritScore} />
          <ActionsMenu actions={statusActions(deal.status).map((act) => ({ label: act.label, danger: act.danger, onClick: () => onAction(act.to) }))} />
        </div>
      </div>

      {sub?.notes && (
        <div className="mt-4 rounded-lg border-l-2 border-accent/60 bg-panel-2/60 px-4 py-3">
          <div className="mb-1 flex items-center justify-between">
            <div className="text-[11px] font-medium tracking-wide text-ink-3 uppercase">Analyst recommendation — {icRecommendationLabel(sub.recommendation)}</div>
            <div className="text-[10px] text-ink-3">{new Date(sub.at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
          </div>
          <p className="text-sm leading-relaxed text-ink-2">{sub.notes}</p>
        </div>
      )}

      {a.conditions.length > 0 && (
        <div className="mt-4 rounded-lg bg-panel-2/60 px-4 py-3">
          <div className="mb-1.5 text-[11px] font-medium tracking-wide text-ink-3 uppercase">Open items for committee</div>
          <ul className="space-y-1 text-sm text-ink-2">
            {a.conditions.map((c, i) => (
              <li key={i} className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-sm border border-warn" />
                {c}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 flex items-center justify-end border-t border-line-soft/60 pt-4">
        <button onClick={onOpen} className="text-xs font-medium text-accent-2 hover:text-accent">
          Open workspace →
        </button>
      </div>
    </Card>
  )
}

function MiniScore({ label, v }: { label: string; v: number }) {
  return (
    <div className="text-center">
      <div className="text-[10px] tracking-wide text-ink-3 uppercase">{label}</div>
      <div className="mt-0.5">
        <ScoreChip score={v} size="sm" />
      </div>
    </div>
  )
}
