import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '@/lib/store'
import { usdm } from '@/lib/format'
import { STATUS_FILTER_ORDER, STATUS_LABEL, isActive } from '@/lib/status'
import type { Analysis, Deal, DealStatus } from '@/types'
import { TopBarA } from './TopBarA'
import { T, FONT, STATUS_A, alpha, scoreColor } from './theme'
import { Card, KPI, Mono, ScoreBadge, StatusPill, Btn } from './uiA'

type SortKey = 'composite' | 'mandate' | 'merit' | 'ticket' | 'name'

// Conceptual screening flags (parity with Version B), derived from engine output.
const RISK_RE = /\b(losses?|deficit|shortfall|writedown|impair\w*|probe|investigat\w*|lawsuit|sued|fines?|penalt\w+|regulat\w+|ceiling|breach\w*|layoffs?|fraud\w*|defaults?|downgrad\w+|delays?|recall\w*|resign\w*|short[- ]seller|disputes?|banned|halt\w*|scrutiny|warning|diluti\w+)\b/i
const RECENT_YEAR = new Date().getFullYear() - 1
const FLAGS: { key: string; label: string; test: (d: Deal, a: Analysis) => boolean }[] = [
  { key: 'lowTrust', label: 'Low data trust', test: (_d, a) => a.dataTrustScore < 60 },
  { key: 'meritVsFit', label: 'High merit · low fit', test: (_d, a) => a.meritScore >= 70 && a.mandateFit.score < 75 },
  { key: 'valuation', label: 'Valuation concern', test: (_d, a) => a.assetValue.askVsValuePct > 75 },
  { key: 'newsRisk', label: 'Recent news risk', test: (d) => d.news.some((n) => (Number(/20\d\d/.exec(n.date)?.[0]) || 0) >= RECENT_YEAR && RISK_RE.test(n.headline)) },
  { key: 'sharia', label: 'Shariah concern', test: (d) => d.shariaScreen?.status === 'non-compliant' || d.shariaScreen?.status === 'mixed' },
]

export function PipelineA() {
  const { deals, analysisFor, activeFundId, activeFund } = useApp()
  const navigate = useNavigate()
  const [statuses, setStatuses] = useState<Set<DealStatus>>(new Set())
  const [sectors, setSectors] = useState<Set<string>>(new Set())
  const [flags, setFlags] = useState<Set<string>>(new Set())
  const [sort, setSort] = useState<SortKey>('composite')

  const fundDeals = useMemo(() => deals.filter((d) => d.fundId === activeFundId), [deals, activeFundId])
  const A = useMemo(() => new Map(fundDeals.map((d) => [d.id, analysisFor(d)])), [fundDeals, analysisFor])

  const passes = (d: Deal) => {
    if (statuses.size === 0 ? d.status === 'archived' : !statuses.has(d.status)) return false
    if (sectors.size && !sectors.has(d.sector)) return false
    if (flags.size) {
      const a = A.get(d.id)!
      if (!FLAGS.some((f) => flags.has(f.key) && f.test(d, a))) return false
    }
    return true
  }

  const shown = useMemo(() => {
    const list = fundDeals.filter(passes)
    const val = (d: Deal): number | string => {
      const a = A.get(d.id)!
      switch (sort) {
        case 'name': return d.name.toLowerCase()
        case 'ticket': return d.ticketUSDm
        case 'mandate': return a.mandateFit.score
        case 'merit': return a.meritScore
        case 'composite': return a.composite
      }
    }
    return [...list].sort((x, y) => { const a = val(x), b = val(y); return a < b ? 1 : a > b ? -1 : 0 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fundDeals, statuses, sectors, flags, sort, A])

  const statusCount = (s: DealStatus) => fundDeals.filter((d) => d.status === s).length
  const sectorOpts = useMemo(() => {
    const m = new Map<string, number>()
    for (const d of fundDeals) if (d.status !== 'archived') m.set(d.sector, (m.get(d.sector) ?? 0) + 1)
    return [...m.entries()].sort((a, b) => b[1] - a[1])
  }, [fundDeals])
  const flagCount = (key: string) => fundDeals.filter((d) => d.status !== 'archived' && FLAGS.find((f) => f.key === key)!.test(d, A.get(d.id)!)).length

  const capital = shown.filter((d) => isActive(d.status)).reduce((s, d) => s + d.ticketUSDm, 0)
  const avgComposite = shown.length ? Math.round(shown.reduce((s, d) => s + A.get(d.id)!.composite, 0) / shown.length) : 0

  const toggle = <X,>(set: Set<X>, v: X, fn: (s: Set<X>) => void) => { const n = new Set(set); n.has(v) ? n.delete(v) : n.add(v); fn(n) }

  const buckets = [
    { range: '0–39', color: T.red, n: 0 }, { range: '40–59', color: T.blue, n: 0 },
    { range: '60–74', color: T.amber, n: 0 }, { range: '75–100', color: T.green, n: 0 },
  ]
  for (const d of fundDeals) { if (d.status === 'archived') continue; const s = A.get(d.id)!.composite; buckets[s < 40 ? 0 : s < 60 ? 1 : s < 75 ? 2 : 3].n++ }
  const bucketMax = Math.max(1, ...buckets.map((b) => b.n))

  return (
    <>
      <TopBarA
        title="Deal Pipeline"
        breadcrumb={activeFund.mandate.fundName}
        subtitle={`${fundDeals.filter((d) => d.status !== 'archived').length} active deals · ${usdm(capital)} in pipeline · ranked by composite`}
        action={<Btn variant="cyan" size="lg" onClick={() => navigate('/a/add')}>+ Add Deal</Btn>}
      />
      <div style={{ padding: '24px 32px', maxWidth: 1240, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14, marginBottom: 22 }}>
          {STATUS_FILTER_ORDER.map((s) => (
            <KPI key={s} label={STATUS_LABEL[s]} value={statusCount(s)} accent={STATUS_A[s].color} selected={statuses.has(s)} onClick={() => toggle(statuses, s, setStatuses)} />
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 14, marginBottom: 22 }}>
          <Card>
            <Mono style={{ marginBottom: 12 }}>Composite distribution</Mono>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, height: 120 }}>
              {buckets.map((b) => (
                <div key={b.range} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', gap: 6, height: '100%' }}>
                  <span style={{ fontFamily: FONT.mono, fontSize: 13, fontWeight: 700, color: b.color }}>{b.n}</span>
                  <div style={{ width: '70%', height: `${(b.n / bucketMax) * 80}px`, minHeight: 2, background: `linear-gradient(180deg, ${b.color}, ${alpha(b.color, 0.4)})`, borderRadius: '4px 4px 0 0' }} />
                  <span style={{ fontSize: 10, color: T.muted, fontFamily: FONT.mono }}>{b.range}</span>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <Mono style={{ marginBottom: 12 }}>Pipeline snapshot</Mono>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <Snap label="Deals shown" value={`${shown.length}`} />
              <Snap label="Capital" value={usdm(capital)} color={T.cyan} />
              <Snap label="Avg composite" value={`${avgComposite}`} color={scoreColor(avgComposite)} />
              <Snap label="Sent to IC" value={`${statusCount('sent-to-ic')}`} color={T.amber} />
            </div>
          </Card>
        </div>

        <Card style={{ marginBottom: 16 }}>
          <ChipRow label="Sector">
            {sectorOpts.map(([v, n]) => <Chip key={v} active={sectors.has(v)} onClick={() => toggle(sectors, v, setSectors)} label={v} count={n} />)}
          </ChipRow>
          <div style={{ height: 1, background: T.border, margin: '12px 0' }} />
          <ChipRow label="Flags">
            {FLAGS.map((f) => <Chip key={f.key} active={flags.has(f.key)} onClick={() => toggle(flags, f.key, setFlags)} label={f.label} count={flagCount(f.key)} tone={T.amber} />)}
          </ChipRow>
        </Card>

        <Card padding="0">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: `1px solid ${T.border}` }}>
            <Mono>{shown.length} of {fundDeals.filter((d) => d.status !== 'archived').length} deals</Mono>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Mono>Sort</Mono>
              <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} style={{ background: T.card, color: T.text, border: `1px solid ${T.border}`, borderRadius: 5, padding: '5px 10px', fontSize: 12, fontFamily: FONT.mono }}>
                <option value="composite">Composite</option>
                <option value="mandate">Mandate fit</option>
                <option value="merit">Standalone merit</option>
                <option value="ticket">Ticket</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: T.cardHi }}>
                {['Deal', 'Sector · Geo', 'Ticket', 'Mandate', 'Merit', 'Composite', 'Status', 'View'].map((h, i) => (
                  <th key={h} style={{ padding: '11px 16px', textAlign: i === 2 ? 'right' : i >= 3 && i <= 5 ? 'center' : 'left', fontSize: 9, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: T.muted, fontFamily: FONT.mono, borderBottom: `1px solid ${T.border}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {shown.map((d) => {
                const a = A.get(d.id)!
                return (
                  <tr key={d.id} onClick={() => navigate(`/a/deal/${d.id}`)} style={{ cursor: 'pointer', borderTop: `1px solid ${T.border}`, transition: 'background 0.12s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = T.cardHi }} onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}>
                    <td style={{ padding: '13px 16px', maxWidth: 360 }}>
                      <div style={{ fontWeight: 600, color: T.text, fontSize: 13 }}>{d.name}</div>
                      <div style={{ fontSize: 11, color: T.muted, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}>{d.oneLiner}</div>
                    </td>
                    <td style={{ padding: '13px 16px', fontSize: 12, color: T.mutedHi }}>
                      <div>{d.sector}</div>
                      <div style={{ fontSize: 11, color: T.muted }}>{d.geography} · {d.stage}</div>
                    </td>
                    <td style={{ padding: '13px 16px', textAlign: 'right', fontFamily: FONT.mono, fontSize: 12, color: T.text }}>{usdm(d.ticketUSDm)}</td>
                    <td style={{ padding: '13px 16px', textAlign: 'center' }}><ScoreBadge score={a.mandateFit.score} size="sm" /></td>
                    <td style={{ padding: '13px 16px', textAlign: 'center' }}><ScoreBadge score={a.meritScore} size="sm" /></td>
                    <td style={{ padding: '13px 16px', textAlign: 'center' }}><ScoreBadge score={a.composite} /></td>
                    <td style={{ padding: '13px 16px' }}><StatusPill status={d.status} /></td>
                    <td style={{ padding: '13px 16px', textAlign: 'center' }}><span style={{ color: T.cyan, fontSize: 16 }}>→</span></td>
                  </tr>
                )
              })}
              {shown.length === 0 && (
                <tr><td colSpan={8} style={{ padding: 56, textAlign: 'center', color: T.muted }}>No deals match these filters.</td></tr>
              )}
            </tbody>
          </table>
        </Card>
      </div>
    </>
  )
}

function Snap({ label, value, color = T.text }: { label: string; value: string; color?: string }) {
  return (
    <div style={{ background: T.cardHi, borderRadius: 8, padding: '12px 14px', border: `1px solid ${T.border}` }}>
      <Mono>{label}</Mono>
      <div style={{ fontFamily: FONT.serif, fontSize: 24, fontWeight: 700, color, marginTop: 4, letterSpacing: -0.5 }}>{value}</div>
    </div>
  )
}
function ChipRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
      <span style={{ width: 56, flexShrink: 0, paddingTop: 5, fontSize: 10, color: T.muted, fontFamily: FONT.mono, letterSpacing: 1, textTransform: 'uppercase' }}>{label}</span>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>{children}</div>
    </div>
  )
}
function Chip({ label, count, active, onClick, tone = T.cyan }: { label: string; count: number; active: boolean; onClick: () => void; tone?: string }) {
  return (
    <button onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 10px', borderRadius: 6, fontSize: 12, fontWeight: 500, fontFamily: FONT.sans, cursor: 'pointer',
      background: active ? alpha(tone, 0.13) : T.cardHi, color: active ? tone : T.mutedHi, border: `1px solid ${active ? alpha(tone, 0.4) : T.border}`,
    }}>
      {label}
      <span style={{ fontFamily: FONT.mono, fontSize: 11, color: active ? tone : T.muted }}>{count}</span>
    </button>
  )
}
