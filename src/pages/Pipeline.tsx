import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '@/lib/store'
import { Card, ScoreChip, StatusPill, ActionsMenu, Button } from '@/components/ui'
import { usdm } from '@/lib/format'
import { cn } from '@/lib/cn'
import { STATUS_FILTER_ORDER, STATUS_LABEL, STATUS_TONE, isActive, statusActions } from '@/lib/status'
import type { Analysis, Deal, DealStatus } from '@/types'

type SortKey = 'name' | 'ticket' | 'mandate' | 'merit' | 'composite' | 'status'
type FacetKey = 'sector' | 'geo' | 'stage'

const statusCardTone: Record<string, string> = {
  pos: 'text-pos',
  warn: 'text-warn',
  neg: 'text-neg',
  neutral: 'text-ink',
  accent: 'text-accent-2',
}

export function Pipeline() {
  const { deals, analysisFor, activeFundId, activeFund, setStatus } = useApp()
  const navigate = useNavigate()

  const [statuses, setStatuses] = useState<Set<DealStatus>>(new Set())
  const [facets, setFacets] = useState<Record<FacetKey, Set<string>>>({ sector: new Set(), geo: new Set(), stage: new Set() })
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<{ key: SortKey; dir: 'asc' | 'desc' }>({ key: 'composite', dir: 'desc' })

  const fundDeals = useMemo(() => deals.filter((d) => d.fundId === activeFundId), [deals, activeFundId])
  const analysis = useMemo(() => new Map(fundDeals.map((d) => [d.id, analysisFor(d)])), [fundDeals, analysisFor])

  const matchSearch = (d: Deal) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return [d.name, d.sector, d.geography, d.stage, d.oneLiner].some((f) => f.toLowerCase().includes(q))
  }

  // passes all filters except (optionally) one facet — used for faceted live counts
  const passesExcept = (d: Deal, except?: FacetKey | 'status') => {
    if (except !== 'status') {
      if (statuses.size === 0) {
        if (d.status === 'archived') return false
      } else if (!statuses.has(d.status)) return false
    }
    if (except !== 'sector' && facets.sector.size && !facets.sector.has(d.sector)) return false
    if (except !== 'geo' && facets.geo.size && !facets.geo.has(d.geography)) return false
    if (except !== 'stage' && facets.stage.size && !facets.stage.has(d.stage)) return false
    return matchSearch(d)
  }

  const shown = useMemo(() => {
    const list = fundDeals.filter((d) => passesExcept(d))
    const val = (d: Deal): number | string => {
      const a = analysis.get(d.id)!
      switch (sort.key) {
        case 'name': return d.name.toLowerCase()
        case 'ticket': return d.ticketUSDm
        case 'mandate': return a.mandateFit.score
        case 'merit': return a.meritScore
        case 'composite': return a.composite
        case 'status': return d.status
      }
    }
    return [...list].sort((x, y) => {
      const a = val(x), b = val(y)
      const c = a < b ? -1 : a > b ? 1 : 0
      return sort.dir === 'asc' ? c : -c
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fundDeals, statuses, facets, search, sort, analysis])

  // facet option lists with faceted counts
  const facetGroup = (key: FacetKey, field: (d: Deal) => string) => {
    const counts = new Map<string, number>()
    for (const d of fundDeals) if (passesExcept(d, key)) counts.set(field(d), (counts.get(field(d)) ?? 0) + 1)
    return [...counts.entries()].sort((a, b) => b[1] - a[1])
  }
  const sectorOpts = facetGroup('sector', (d) => d.sector)
  const geoOpts = facetGroup('geo', (d) => d.geography)
  const stageOpts = facetGroup('stage', (d) => d.stage)

  const statusCount = (s: DealStatus) => fundDeals.filter((d) => passesExcept(d, 'status') && d.status === s).length
  const capital = shown.filter((d) => isActive(d.status)).reduce((s, d) => s + d.ticketUSDm, 0)

  const toggleStatus = (s: DealStatus) =>
    setStatuses((prev) => {
      const n = new Set(prev)
      n.has(s) ? n.delete(s) : n.add(s)
      return n
    })
  const toggleFacet = (key: FacetKey, v: string) =>
    setFacets((prev) => {
      const n = new Set(prev[key])
      n.has(v) ? n.delete(v) : n.add(v)
      return { ...prev, [key]: n }
    })
  const anyFilter = statuses.size || facets.sector.size || facets.geo.size || facets.stage.size || search.trim()
  const clearAll = () => {
    setStatuses(new Set())
    setFacets({ sector: new Set(), geo: new Set(), stage: new Set() })
    setSearch('')
  }

  return (
    <div className="mx-auto max-w-[1180px] px-8 py-7">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-ink">Pipeline</h1>
          <p className="mt-0.5 text-sm text-ink-3">{activeFund.mandate.fundName} · ranked by composite score</p>
        </div>
        <Button variant="primary" onClick={() => navigate('/add')}>
          + Add Deal
        </Button>
      </div>

      {/* Status cards (clickable filters) + capital */}
      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-6">
        {STATUS_FILTER_ORDER.map((s) => {
          const selected = statuses.has(s)
          const count = statusCount(s)
          return (
            <button
              key={s}
              onClick={() => toggleStatus(s)}
              className={cn(
                'rounded-xl border bg-panel px-4 py-3.5 text-left transition-colors',
                selected ? 'border-accent/60 bg-accent-bg/40' : 'border-line/70 hover:border-line',
              )}
            >
              <div className="text-[11px] font-medium tracking-wide text-ink-3 uppercase">{STATUS_LABEL[s]}</div>
              <div className={cn('mt-1 text-2xl font-semibold tnum', count === 0 ? 'text-ink-3/60' : statusCardTone[STATUS_TONE[s]])}>{count}</div>
            </button>
          )
        })}
        <Card className="px-4 py-3.5">
          <div className="text-[11px] font-medium tracking-wide text-ink-3 uppercase">Capital in pipeline</div>
          <div className="mt-1 text-2xl font-semibold text-ink tnum">{usdm(capital)}</div>
          <div className="mt-0.5 text-[11px] text-ink-3">excl. rejected & archived</div>
        </Card>
      </div>

      {/* Faceted filters */}
      <Card className="mb-4 px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="text-[11px] font-medium tracking-wide text-ink-3 uppercase">Filter</div>
          {anyFilter ? (
            <button onClick={clearAll} className="text-[11px] text-ink-3 hover:text-accent-2">
              Clear all
            </button>
          ) : null}
        </div>
        <div className="mt-3 space-y-3">
          <FacetRow label="Sector" opts={sectorOpts} active={facets.sector} onToggle={(v) => toggleFacet('sector', v)} />
          <FacetRow label="Geography" opts={geoOpts} active={facets.geo} onToggle={(v) => toggleFacet('geo', v)} />
          <FacetRow label="Stage" opts={stageOpts} active={facets.stage} onToggle={(v) => toggleFacet('stage', v)} />
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-visible">
        <div className="flex items-center justify-between border-b border-line/70 px-5 py-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search deals…"
            className="w-64 rounded-lg border border-line bg-panel-2 px-3 py-1.5 text-sm text-ink outline-none placeholder:text-ink-3 focus:border-accent"
          />
          <span className="text-xs text-ink-3 tnum">{shown.length} of {fundDeals.filter((d) => d.status !== 'archived').length}</span>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] font-medium tracking-wide text-ink-3 uppercase">
              <Th label="Deal" k="name" sort={sort} setSort={setSort} className="px-5" />
              <th className="px-3 py-3 font-medium">Sector · Geo</th>
              <Th label="Ticket" k="ticket" sort={sort} setSort={setSort} align="right" />
              <Th label="Mandate" k="mandate" sort={sort} setSort={setSort} align="center" />
              <Th label="Merit" k="merit" sort={sort} setSort={setSort} align="center" />
              <Th label="Composite" k="composite" sort={sort} setSort={setSort} align="center" />
              <Th label="Status" k="status" sort={sort} setSort={setSort} />
              <th className="px-3 py-3" />
            </tr>
          </thead>
          <tbody>
            {shown.map((deal) => (
              <Row key={deal.id} deal={deal} a={analysis.get(deal.id)!} onOpen={() => navigate(`/deal/${deal.id}`)} onAction={(to) => setStatus(deal.id, to)} />
            ))}
            {shown.length === 0 && (
              <tr>
                <td colSpan={8} className="px-5 py-16 text-center text-sm text-ink-3">
                  No deals match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  )
}

function FacetRow({ label, opts, active, onToggle }: { label: string; opts: [string, number][]; active: Set<string>; onToggle: (v: string) => void }) {
  return (
    <div className="flex items-start gap-3">
      <span className="w-20 shrink-0 pt-1 text-xs text-ink-3">{label}</span>
      <div className="flex flex-wrap gap-1.5">
        {opts.map(([v, n]) => {
          const on = active.has(v)
          return (
            <button
              key={v}
              onClick={() => onToggle(v)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium transition-colors',
                on ? 'border-accent/60 bg-accent-bg text-accent-2' : 'border-line bg-panel-2 text-ink-2 hover:text-ink',
              )}
            >
              {v}
              <span className={cn('tnum', on ? 'text-accent-2/70' : 'text-ink-3')}>{n}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function Th({ label, k, sort, setSort, align = 'left', className }: { label: string; k: SortKey; sort: { key: SortKey; dir: 'asc' | 'desc' }; setSort: (s: { key: SortKey; dir: 'asc' | 'desc' }) => void; align?: 'left' | 'right' | 'center'; className?: string }) {
  const active = sort.key === k
  return (
    <th className={cn('py-3 font-medium', className ?? 'px-3', align === 'right' && 'text-right', align === 'center' && 'text-center')}>
      <button
        onClick={() => setSort({ key: k, dir: active && sort.dir === 'desc' ? 'asc' : 'desc' })}
        className={cn('inline-flex items-center gap-1 hover:text-ink-2', active && 'text-ink')}
      >
        {label}
        <span className="text-[8px]">{active ? (sort.dir === 'desc' ? '▼' : '▲') : ''}</span>
      </button>
    </th>
  )
}

function Row({ deal, a, onOpen, onAction }: { deal: Deal; a: Analysis; onOpen: () => void; onAction: (to: DealStatus) => void }) {
  return (
    <tr onClick={onOpen} className="group cursor-pointer border-b border-line-soft/60 transition-colors last:border-0 hover:bg-panel-2/60 [&>td]:align-top">
      <td className="px-5 py-3.5 align-top">
        <div className="font-medium text-ink group-hover:text-accent-2">{deal.name}</div>
        <div className="mt-0.5 max-w-[460px] text-xs leading-relaxed text-ink-3 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] overflow-hidden">{deal.oneLiner}</div>
      </td>
      <td className="px-3 py-3.5 align-top text-ink-2">
        <div>{deal.sector}</div>
        <div className="whitespace-nowrap text-xs text-ink-3">
          {deal.geography} · {deal.stage}
        </div>
      </td>
      <td className="px-3 py-3.5 text-right font-medium text-ink tnum">{usdm(deal.ticketUSDm)}</td>
      <td className="px-3 py-3.5 text-center">
        <ScoreChip score={a.mandateFit.score} />
      </td>
      <td className="px-3 py-3.5 text-center">
        <ScoreChip score={a.meritScore} />
      </td>
      <td className="px-3 py-3.5 text-center">
        <ScoreChip score={a.composite} />
      </td>
      <td className="px-3 py-3.5">
        <StatusPill status={deal.status} />
      </td>
      <td className="px-3 py-3.5 text-right">
        <ActionsMenu actions={statusActions(deal.status).map((act) => ({ label: act.label, danger: act.danger, onClick: () => onAction(act.to) }))} />
      </td>
    </tr>
  )
}
