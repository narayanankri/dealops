import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '@/lib/store'
import { Card, ScoreChip, StatusPill, ActionsMenu, Button, Counter, SectionTitle } from '@/components/ui'
import { Funnel, Donut } from '@/components/deal/viz'
import { usdm } from '@/lib/format'
import { cn } from '@/lib/cn'
import { STATUS_FILTER_ORDER, STATUS_LABEL, STATUS_TONE, isActive, statusActions } from '@/lib/status'
import type { Analysis, Deal, DealStatus } from '@/types'

type SortKey = 'name' | 'ticket' | 'mandate' | 'merit' | 'composite' | 'status'
type FacetKey = 'sector' | 'geo' | 'stage'
type FlagKey = 'lowTrust' | 'meritVsFit' | 'valuation' | 'newsRisk' | 'sharia'

const statusCardTone: Record<string, string> = {
  pos: 'text-pos',
  warn: 'text-warn',
  neg: 'text-neg',
  neutral: 'text-ink',
  accent: 'text-accent-2',
}

// ── Screening flags — conceptual lenses derived from engine output, not metadata. ──
// Each is a yes/no read over (deal, analysis); selecting several shows the UNION (deals
// flagged for ANY selected lens), so a reviewer can surface everything worth a second look.
const RISK_RE =
  /\b(losses?|deficit|shortfall|writedown|impair\w*|probe|investigat\w*|lawsuit|sued|fines?|penalt\w+|regulat\w+|ceiling|breach\w*|layoffs?|fraud\w*|defaults?|downgrad\w+|delays?|recall\w*|resign\w*|short[- ]seller|disputes?|banned|halt\w*|scrutiny|warning|diluti\w+)\b/i
const RECENT_NEWS_YEAR = new Date().getFullYear() - 1 // "recent" = last year or this year
function hasRecentNewsRisk(d: Deal): boolean {
  return d.news.some((n) => {
    const m = /20\d\d/.exec(n.date)
    return (m ? +m[0] : 0) >= RECENT_NEWS_YEAR && RISK_RE.test(n.headline)
  })
}

const FLAGS: { key: FlagKey; label: string; hint: string; test: (d: Deal, a: Analysis) => boolean }[] = [
  { key: 'lowTrust', label: 'Low data trust', hint: 'Data-trust score below 60 — inputs lean on inferred / estimated figures', test: (_d, a) => a.dataTrustScore < 60 },
  { key: 'meritVsFit', label: 'High merit · low fit', hint: 'A strong business that sits outside the mandate — merit ≥ 70 but mandate fit < 75', test: (_d, a) => a.meritScore >= 70 && a.mandateFit.score < 75 },
  { key: 'valuation', label: 'Valuation concern', hint: 'Ask is more than 75% above the reconciled DCF + comps value', test: (_d, a) => a.assetValue.askVsValuePct > 75 },
  { key: 'newsRisk', label: 'Recent news risk', hint: `A ${RECENT_NEWS_YEAR}+ headline mentions a potential risk — worth a read`, test: (d) => hasRecentNewsRisk(d) },
  { key: 'sharia', label: 'Shariah concern', hint: 'Shariah screen is non-compliant or mixed', test: (d) => d.shariaScreen?.status === 'non-compliant' || d.shariaScreen?.status === 'mixed' },
]

export function Pipeline() {
  const { deals, analysisFor, activeFundId, activeFund, setStatus } = useApp()
  const navigate = useNavigate()

  const [statuses, setStatuses] = useState<Set<DealStatus>>(new Set())
  const [facets, setFacets] = useState<Record<FacetKey, Set<string>>>({ sector: new Set(), geo: new Set(), stage: new Set() })
  const [flags, setFlags] = useState<Set<FlagKey>>(new Set())
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<{ key: SortKey; dir: 'asc' | 'desc' }>({ key: 'composite', dir: 'desc' })

  const fundDeals = useMemo(() => deals.filter((d) => d.fundId === activeFundId), [deals, activeFundId])
  const analysis = useMemo(() => new Map(fundDeals.map((d) => [d.id, analysisFor(d)])), [fundDeals, analysisFor])

  const matchSearch = (d: Deal) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return [d.name, d.sector, d.geography, d.stage, d.oneLiner].some((f) => f.toLowerCase().includes(q))
  }

  // passes all filters except (optionally) one group — used for faceted live counts
  const passesExcept = (d: Deal, except?: FacetKey | 'status' | 'flags') => {
    if (except !== 'status') {
      if (statuses.size === 0) {
        if (d.status === 'archived') return false
      } else if (!statuses.has(d.status)) return false
    }
    if (except !== 'sector' && facets.sector.size && !facets.sector.has(d.sector)) return false
    if (except !== 'geo' && facets.geo.size && !facets.geo.has(d.geography)) return false
    if (except !== 'stage' && facets.stage.size && !facets.stage.has(d.stage)) return false
    if (!matchSearch(d)) return false
    if (except !== 'flags' && flags.size) {
      const a = analysis.get(d.id)
      if (!a || !FLAGS.some((f) => flags.has(f.key) && f.test(d, a))) return false
    }
    return true
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
  }, [fundDeals, statuses, facets, flags, search, sort, analysis])

  // facet option lists with faceted counts
  const facetGroup = (key: FacetKey, field: (d: Deal) => string) => {
    const counts = new Map<string, number>()
    for (const d of fundDeals) if (passesExcept(d, key)) counts.set(field(d), (counts.get(field(d)) ?? 0) + 1)
    return [...counts.entries()].sort((a, b) => b[1] - a[1])
  }
  const sectorOpts = facetGroup('sector', (d) => d.sector)
  const geoOpts = facetGroup('geo', (d) => d.geography)
  const stageOpts = facetGroup('stage', (d) => d.stage)

  // flag chips with faceted counts (count ignores the flags group itself)
  const flagOpts = FLAGS.map((f) => {
    const n = fundDeals.filter((d) => {
      if (!passesExcept(d, 'flags')) return false
      const a = analysis.get(d.id)
      return !!a && f.test(d, a)
    }).length
    return { ...f, n }
  })

  const statusCount = (s: DealStatus) => fundDeals.filter((d) => passesExcept(d, 'status') && d.status === s).length
  const capital = shown.filter((d) => isActive(d.status)).reduce((s, d) => s + d.ticketUSDm, 0)

  // ── Analytics-row data (overview charts) ──
  const toneToVar: Record<string, string> = { pos: 'pos', warn: 'warn', neg: 'neg', accent: 'accent', neutral: 'ink-3' }
  const statusFunnel = STATUS_FILTER_ORDER.filter((s) => s !== 'archived').map((s) => ({
    label: STATUS_LABEL[s],
    value: statusCount(s),
    color: `var(--color-${toneToVar[STATUS_TONE[s]] ?? 'ink-3'})`,
  }))
  const buckets = [
    { range: '0–39', n: 0, c: 'var(--color-neg)' },
    { range: '40–59', n: 0, c: 'var(--color-ink-3)' },
    { range: '60–74', n: 0, c: 'var(--color-warn)' },
    { range: '75–100', n: 0, c: 'var(--color-pos)' },
  ]
  // Charts share the funnel's basis: every active filter EXCEPT the status tiles
  // (so they react to facets / flags / search just like "deals by status" does).
  for (const d of fundDeals) {
    if (d.status === 'archived' || !passesExcept(d, 'status')) continue
    const s = analysis.get(d.id)!.composite
    buckets[s < 40 ? 0 : s < 60 ? 1 : s < 75 ? 2 : 3].n++
  }
  const bucketMax = Math.max(1, ...buckets.map((b) => b.n))
  const GEO_COLORS = ['var(--color-accent)', 'var(--color-indigo)', 'var(--color-pos)', 'var(--color-warn)', 'var(--color-accent-2)', 'var(--color-neg)']
  const geoMix = (() => {
    const m = new Map<string, number>()
    for (const d of fundDeals) {
      if (d.status === 'archived' || !passesExcept(d, 'status')) continue
      m.set(d.geography, (m.get(d.geography) ?? 0) + 1)
    }
    return [...m.entries()].sort((a, b) => b[1] - a[1]).map(([label, value], i) => ({ label, value, color: GEO_COLORS[i % GEO_COLORS.length] }))
  })()

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
  const toggleFlag = (k: FlagKey) =>
    setFlags((prev) => {
      const n = new Set(prev)
      n.has(k) ? n.delete(k) : n.add(k)
      return n
    })
  const anyFilter = statuses.size || facets.sector.size || facets.geo.size || facets.stage.size || flags.size || search.trim()
  const clearAll = () => {
    setStatuses(new Set())
    setFacets({ sector: new Set(), geo: new Set(), stage: new Set() })
    setFlags(new Set())
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
          const toneVar = `var(--color-${toneToVar[STATUS_TONE[s]] ?? 'ink-3'})`
          return (
            <button
              key={s}
              onClick={() => toggleStatus(s)}
              className={cn(
                'rounded-xl border bg-panel px-4 py-3.5 text-left transition-colors',
                selected ? 'border-accent/60 bg-accent-bg/40 ring-1 ring-accent/40' : 'border-line/70 hover:border-line',
              )}
              style={{ borderLeftColor: toneVar, borderLeftWidth: 2 }}
            >
              <div className="text-[11px] font-medium tracking-wide text-ink-3 uppercase">{STATUS_LABEL[s]}</div>
              <div className={cn('mt-1 text-3xl font-semibold tracking-tight tnum', count === 0 ? 'text-ink-3/60' : statusCardTone[STATUS_TONE[s]])}>
                <Counter value={count} dur={700} />
              </div>
            </button>
          )
        })}
        <Card className="px-4 py-3.5">
          <div className="text-[11px] font-medium tracking-wide text-ink-3 uppercase">Capital in pipeline</div>
          <div className="mt-1 text-3xl font-semibold tracking-tight text-ink tnum">
            <Counter value={capital} format={usdm} dur={1000} />
          </div>
          <div className="mt-0.5 text-[11px] text-ink-3">excl. rejected & archived</div>
        </Card>
      </div>

      {/* Analytics row */}
      <div className="mb-4 grid grid-cols-1 gap-3 lg:grid-cols-3">
        <Card className="px-5 py-4">
          <SectionTitle kicker="pipeline">Deals by status</SectionTitle>
          <Funnel data={statusFunnel} />
        </Card>
        <Card className="px-5 py-4">
          <SectionTitle kicker="composite score">Distribution</SectionTitle>
          <div className="flex h-[136px] items-end gap-3 pt-2">
            {buckets.map((b) => (
              <div key={b.range} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
                <span className="text-sm font-semibold tnum" style={{ color: b.c }}>{b.n}</span>
                <div className="w-2/3 rounded-t-sm transition-[height] duration-500" style={{ height: `${(b.n / bucketMax) * 88}px`, minHeight: 2, background: b.c }} />
                <span className="font-mono text-[10px] text-ink-3">{b.range}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card className="px-5 py-4">
          <SectionTitle kicker="by country">Geography mix</SectionTitle>
          <Donut data={geoMix} />
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
        <div className="mt-3 border-t border-line/60 pt-3">
          <FlagRow opts={flagOpts} active={flags} onToggle={toggleFlag} />
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
            {shown.map((deal, i) => (
              <Row key={deal.id} index={i} deal={deal} a={analysis.get(deal.id)!} onOpen={() => navigate(`/deal/${deal.id}`)} onAction={(to) => setStatus(deal.id, to)} />
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

function FlagRow({
  opts,
  active,
  onToggle,
}: {
  opts: { key: FlagKey; label: string; hint: string; n: number }[]
  active: Set<FlagKey>
  onToggle: (k: FlagKey) => void
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="w-20 shrink-0 pt-1 text-xs text-ink-3" title="Conceptual lenses from the analysis. Selecting several shows deals flagged for any of them.">
        Flags
      </span>
      <div className="flex flex-wrap gap-1.5">
        {opts.map((f) => {
          const on = active.has(f.key)
          const empty = f.n === 0 && !on
          return (
            <button
              key={f.key}
              onClick={() => onToggle(f.key)}
              title={f.hint}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium transition-colors',
                on
                  ? 'border-warn/60 bg-warn/10 text-warn'
                  : empty
                    ? 'border-line/60 bg-panel-2 text-ink-3/60'
                    : 'border-line bg-panel-2 text-ink-2 hover:border-warn/50 hover:text-ink',
              )}
            >
              <span className={cn('h-1.5 w-1.5 rounded-full', on ? 'bg-warn' : empty ? 'bg-ink-3/40' : 'bg-warn/60')} />
              {f.label}
              <span className={cn('tnum', on ? 'text-warn/80' : 'text-ink-3')}>{f.n}</span>
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

function Row({ deal, a, onOpen, onAction, index = 0 }: { deal: Deal; a: Analysis; onOpen: () => void; onAction: (to: DealStatus) => void; index?: number }) {
  return (
    <tr
      onClick={onOpen}
      className="app-fade group cursor-pointer border-b border-line-soft/60 transition-colors last:border-0 hover:bg-panel-2/60 [&>td]:align-top"
      style={{ animationDelay: `${Math.min(index * 35, 520)}ms` }}
    >
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
