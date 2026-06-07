import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useApp } from '@/lib/store'
import { ActionsMenu, Button, Card, ConfidenceRing, StatusPill } from '@/components/ui'
import { usdm } from '@/lib/format'
import { cn } from '@/lib/cn'
import { statusActions } from '@/lib/status'
import type { Analysis, Deal, DealStatus } from '@/types'
import { CompsTab, HistoryTab, MandateTab, MemoTab, MeritTab, OverviewTab, ResearchTab, ValuationTab } from '@/components/deal/tabs'

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

export function DealPage() {
  const { id } = useParams()
  const { getDeal, analysisFor } = useApp()
  const navigate = useNavigate()
  const [tab, setTab] = useState<TabKey>('overview')

  const deal = id ? getDeal(id) : undefined
  if (!deal) {
    return (
      <div className="p-10 text-ink-2">
        Deal not found.{' '}
        <button onClick={() => navigate('/')} className="text-accent-2 underline">
          Back to pipeline
        </button>
      </div>
    )
  }
  const a = analysisFor(deal)

  return (
    <div className="mx-auto max-w-[1180px] px-8 py-7 print:max-w-none print:p-0">
      <button onClick={() => navigate('/')} className="mb-4 text-xs text-ink-3 hover:text-ink-2 print:hidden">
        ← Pipeline
      </button>

      <div className="print:hidden">
        <DealHeader deal={deal} a={a} />
        <RecommendationStrip a={a} />
      </div>

      {/* Tab nav */}
      <div className="mt-6 mb-5 flex gap-1 overflow-x-auto border-b border-line/70 print:hidden">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              'relative whitespace-nowrap px-3.5 py-2.5 text-sm font-medium transition-colors',
              tab === t.key ? 'text-ink' : 'text-ink-3 hover:text-ink-2',
            )}
          >
            {t.label}
            {tab === t.key && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-accent" />}
          </button>
        ))}
      </div>

      <div key={tab} className="fade-up">
        {tab === 'overview' && <OverviewTab deal={deal} a={a} />}
        {tab === 'mandate' && <MandateTab deal={deal} a={a} />}
        {tab === 'merit' && <MeritTab deal={deal} a={a} />}
        {tab === 'comps' && <CompsTab deal={deal} a={a} />}
        {tab === 'valuation' && <ValuationTab deal={deal} a={a} />}
        {tab === 'memo' && <MemoTab deal={deal} a={a} />}
        {tab === 'research' && <ResearchTab deal={deal} a={a} />}
        {tab === 'history' && <HistoryTab deal={deal} a={a} />}
      </div>
    </div>
  )
}

function DealHeader({ deal, a }: { deal: Deal; a: Analysis }) {
  const { setStatus, reRun } = useApp()
  const navigate = useNavigate()
  const [rerunning, setRerunning] = useState(false)
  const handleRerun = () => {
    setRerunning(true)
    reRun(deal.id)
    window.setTimeout(() => setRerunning(false), 900)
  }
  const s = deal.status
  // contextual primary action; the rest of the transitions live in the ⋯ menu
  const primaryTarget: DealStatus | null = s === 'ready' ? 'sent-to-ic' : s === 'rejected' || s === 'archived' ? 'ready' : null
  const menu = statusActions(s)
    .filter((act) => act.to !== primaryTarget)
    .map((act) => ({ label: act.label, danger: act.danger, onClick: () => setStatus(deal.id, act.to) }))
  return (
    <Card className={cn('px-6 py-5', rerunning && 'scanning')}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold tracking-tight text-ink">{deal.name}</h1>
            <StatusPill status={s} />
          </div>
          <p className="mt-1 text-sm text-ink-3">
            {deal.oneLiner}
          </p>
          <p className="mt-1 text-xs text-ink-3">
            {deal.sector} · {deal.geography} · {deal.stage}
            {deal.foundedYear ? ` · Founded ${deal.foundedYear}` : ''} · Ticket <span className="font-medium text-ink-2 tnum">{usdm(deal.ticketUSDm)}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleRerun}>{rerunning ? 'Re-running…' : 'Re-run'}</Button>
          {s === 'ready' && (
            <div className="flex flex-col items-end gap-1">
              <Button
                variant="primary"
                disabled={a.integrity.blocking}
                title={a.integrity.blocking ? 'Resolve the blocking coherence issues first' : undefined}
                onClick={() => {
                  if (a.integrity.blocking) return
                  setStatus(deal.id, 'sent-to-ic')
                  navigate('/ic-queue')
                }}
              >
                Send to IC
              </Button>
              {a.integrity.blocking && (
                <span className="text-[10px] text-neg">Blocked — failing coherence checks</span>
              )}
            </div>
          )}
          {s === 'sent-to-ic' && (
            <Button variant="primary" onClick={() => navigate('/ic-queue')}>
              In IC Queue →
            </Button>
          )}
          {s === 'rejected' && <Button onClick={() => setStatus(deal.id, 'ready')}>Reopen</Button>}
          {s === 'archived' && <Button onClick={() => setStatus(deal.id, 'ready')}>Restore</Button>}
          <ActionsMenu actions={menu} />
        </div>
      </div>

      {/* Instrument cluster: every score as a gauge. */}
      <div className="mt-5 grid grid-cols-2 items-start gap-4 sm:grid-cols-4">
        <Metric label="Composite" score={a.composite} />
        <Metric label="Mandate fit" score={a.mandateFit.score} />
        <Metric label="Standalone merit" score={a.meritScore} />
        <Metric label="Data trust" score={a.dataTrustScore} />
      </div>
    </Card>
  )
}

function Metric({ label, score }: { label: string; score: number }) {
  return (
    <div>
      <div className="text-[11px] font-medium tracking-wide text-ink-3 uppercase">{label}</div>
      <div className="mt-2">
        <ConfidenceRing score={score} size={52} />
      </div>
    </div>
  )
}

function RecommendationStrip({ a }: { a: Analysis }) {
  return (
    <Card className="mt-4 px-6 py-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-start">
        <div className="md:w-1/2">
          <div className="mb-1.5 text-[11px] font-medium tracking-wide text-ink-3 uppercase">Key considerations</div>
          <ul className="space-y-1 text-sm text-ink-2">
            {a.reasons.map((r, i) => (
              <li key={i} className="flex gap-2">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                {r}
              </li>
            ))}
          </ul>
        </div>
        {a.conditions.length > 0 && (
          <div className="md:w-1/2 md:border-l md:border-line/60 md:pl-5">
            <div className="mb-1.5 text-[11px] font-medium tracking-wide text-ink-3 uppercase">Open items</div>
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
      </div>
    </Card>
  )
}
