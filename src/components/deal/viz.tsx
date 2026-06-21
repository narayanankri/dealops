import { cn } from '@/lib/cn'
import { usdm } from '@/lib/format'
import type { CapTableRow } from '@/types'

// ── Cap table / ownership structure ──
const capColor: Record<CapTableRow['type'], string> = {
  founder: 'var(--color-accent)',
  investor: '#5e6b8a',
  esop: '#3c4556',
  other: '#2a313d',
}
const capTypeLabel: Record<CapTableRow['type'], string> = {
  founder: 'Founders',
  investor: 'Investor',
  esop: 'ESOP',
  other: 'Other',
}

export function CapTable({ rows }: { rows: CapTableRow[] }) {
  const total = rows.reduce((s, r) => s + r.pct, 0) || 100
  return (
    <div>
      <div className="mb-3 flex h-3 w-full overflow-hidden rounded-full">
        {rows.map((r, i) => (
          <div key={i} style={{ width: `${(r.pct / total) * 100}%`, background: capColor[r.type] }} title={`${r.holder} ${r.pct}%`} />
        ))}
      </div>
      <div className="space-y-1.5">
        {rows.map((r, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: capColor[r.type] }} />
            <span className="min-w-0 truncate text-ink-2">{r.holder}</span>
            <span className="ml-auto shrink-0 text-[10px] tracking-wide text-ink-3 uppercase">{capTypeLabel[r.type]}</span>
            <span className="w-9 shrink-0 text-right font-medium text-ink tnum">{r.pct}%</span>
          </div>
        ))}
      </div>
      <p className="mt-2 text-[11px] text-ink-3">Illustrative ownership — estimated from disclosed rounds.</p>
    </div>
  )
}

// ── Radar / spiderweb (component breakdown) — §11.4 ──
type Tone = 'pos' | 'warn' | 'neg' | 'accent'
const toneVar: Record<Tone, string> = {
  pos: 'var(--color-pos)',
  warn: 'var(--color-warn)',
  neg: 'var(--color-neg)',
  accent: 'var(--color-accent)',
}
export type RadarDatum = { label: string; value: number; tone?: Tone; dim?: boolean }

export function RadarChart({ data, max = 100 }: { data: RadarDatum[]; max?: number }) {
  const n = data.length
  const cx = 220
  const cy = 168
  const R = 110
  const labelR = R + 26
  const ang = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / n
  const pt = (i: number, r: number): [number, number] => [cx + r * Math.cos(ang(i)), cy + r * Math.sin(ang(i))]
  const poly = (r: number) => data.map((_, i) => pt(i, r).join(',')).join(' ')
  const valueR = (d: RadarDatum) => (R * Math.max(0, Math.min(d.value, max))) / max
  const valuePoly = data.map((d, i) => pt(i, valueR(d)).join(',')).join(' ')
  const rings = [0.25, 0.5, 0.75, 1]

  return (
    <svg viewBox="0 0 440 336" className="w-full">
      {rings.map((lvl, i) => (
        <polygon key={i} points={poly(R * lvl)} fill="none" stroke="var(--color-line)" strokeWidth={1} opacity={0.55} />
      ))}
      {data.map((_, i) => {
        const [x, y] = pt(i, R)
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="var(--color-line)" strokeWidth={1} opacity={0.55} />
      })}

      {/* value shape grows from the chart hub on every mount (CSS .radar-form, reduced-motion aware) */}
      <g className="radar-form">
        <polygon points={valuePoly} fill="var(--color-accent)" fillOpacity={0.16} stroke="var(--color-accent)" strokeWidth={2} strokeLinejoin="round" />
        {data.map((d, i) => {
          const [x, y] = pt(i, valueR(d))
          const c = toneVar[d.tone ?? 'accent']
          return (
            <g key={i}>
              {d.dim && <circle cx={x} cy={y} r={7.5} fill="none" stroke={c} strokeOpacity={0.45} strokeDasharray="2.5 2.5" />}
              <circle cx={x} cy={y} r={4} fill={c} stroke="var(--color-panel)" strokeWidth={1.5} />
            </g>
          )
        })}
      </g>

      {data.map((d, i) => {
        const [lx, ly] = pt(i, labelR)
        const cos = Math.cos(ang(i))
        const sin = Math.sin(ang(i))
        const anchor = cos > 0.3 ? 'start' : cos < -0.3 ? 'end' : 'middle'
        const dy = sin > 0.5 ? 11 : sin < -0.5 ? -5 : 4
        return (
          <text key={i} x={lx} y={ly + dy} textAnchor={anchor} fontSize={11} className="fill-ink-2">
            {d.label}
            <tspan dx={5} fontSize={10.5} className="fill-ink-3" style={{ fontVariantNumeric: 'tabular-nums' }}>
              {Math.round(d.value)}
            </tspan>
          </text>
        )
      })}
    </svg>
  )
}

export function RadarLegend({ items }: { items: { color: Tone; label: string; dashed?: boolean }[] }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
      {items.map((it) => (
        <span key={it.label} className="flex items-center gap-1.5 text-[11px] text-ink-3">
          {it.dashed ? (
            <span className="h-2.5 w-2.5 rounded-full border border-dashed" style={{ borderColor: toneVar[it.color] }} />
          ) : (
            <span className="h-2 w-2 rounded-full" style={{ background: toneVar[it.color] }} />
          )}
          {it.label}
        </span>
      ))}
    </div>
  )
}

// ── Value range with optional marker (e.g. the ask) — §7.4 / §7.5 ──
export function RangeBar({
  low,
  mid,
  high,
  marker,
}: {
  low: number
  mid: number
  high: number
  marker?: { value: number; label: string }
}) {
  const vals = [low, high, mid, ...(marker ? [marker.value] : [])]
  const lo = Math.min(...vals)
  const hi = Math.max(...vals)
  const span = hi - lo || 1
  const pad = span * 0.08
  const min = lo - pad
  const max = hi + pad
  const pos = (v: number) => ((v - min) / (max - min)) * 100
  return (
    <div className="pt-6 pb-7">
      <div className="relative h-2.5 rounded-full bg-panel-3">
        {/* low–high band */}
        <div
          className="absolute top-0 h-full rounded-full bg-accent/35"
          style={{ left: `${pos(low)}%`, width: `${pos(high) - pos(low)}%` }}
        />
        {/* mid tick */}
        <Tick at={pos(mid)} className="bg-accent" label={usdm(mid)} sub="mid" above />
        {/* low / high labels */}
        <Tick at={pos(low)} className="bg-ink-3" label={usdm(low)} sub="low" />
        <Tick at={pos(high)} className="bg-ink-3" label={usdm(high)} sub="high" />
        {/* marker */}
        {marker && <Tick at={pos(marker.value)} className="bg-neg" label={usdm(marker.value)} sub={marker.label} above markerTall />}
      </div>
    </div>
  )
}

function Tick({
  at,
  className,
  label,
  sub,
  above,
  markerTall,
}: {
  at: number
  className: string
  label: string
  sub: string
  above?: boolean
  markerTall?: boolean
}) {
  return (
    <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ left: `${at}%` }}>
      <div className={cn('mx-auto w-0.5 rounded', className, markerTall ? 'h-5' : 'h-3.5')} />
      <div className={cn('absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-center', above ? 'bottom-4' : 'top-4')}>
        <div className="text-[11px] font-medium text-ink tnum">{label}</div>
        <div className="text-[10px] text-ink-3">{sub}</div>
      </div>
    </div>
  )
}

// ── Horizontal component breakdown (merit / mandate) ──
export function ComponentBars({ items }: { items: { label: string; score: number; note?: string }[] }) {
  return (
    <div className="space-y-2.5">
      {items.map((it) => {
        const tone = it.score >= 70 ? 'bg-pos' : it.score >= 50 ? 'bg-warn' : 'bg-neg'
        return (
          <div key={it.label} className="flex items-center gap-3">
            <span className="w-36 shrink-0 truncate text-sm text-ink-2">{it.label}</span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-panel-3">
              <div className={cn('h-full rounded-full', tone)} style={{ width: `${Math.max(2, it.score)}%` }} />
            </div>
            <span className="w-7 text-right text-sm text-ink tnum">{it.score}</span>
          </div>
        )
      })}
    </div>
  )
}

// ── P&L table (historical + forecast) — §7.5 ──
export function PnLTable({ financials }: { financials?: { years: (string | number)[]; revenue: number[]; ebitda: number[] } }) {
  if (!financials) return <div className="text-sm text-ink-3">No financials available.</div>
  const { years, revenue, ebitda } = financials
  const margin = revenue.map((r, i) => (r ? (ebitda[i] / r) * 100 : 0))
  const growth = revenue.map((r, i) => (i === 0 ? null : ((r / revenue[i - 1]) - 1) * 100))
  const Row = ({ label, cells, tone }: { label: string; cells: (string | null)[]; tone?: string }) => (
    <tr className="border-t border-line-soft/50">
      <td className="py-2 pr-4 text-sm text-ink-2">{label}</td>
      {cells.map((c, i) => (
        <td key={i} className={cn('py-2 px-3 text-right text-sm tnum', tone ?? 'text-ink')}>
          {c ?? '—'}
        </td>
      ))}
    </tr>
  )
  return (
    <table className="w-full">
      <thead>
        <tr>
          <td className="pb-2 text-[11px] font-medium tracking-wide text-ink-3 uppercase">$m</td>
          {years.map((y) => (
            <td key={String(y)} className="pb-2 px-3 text-right text-[11px] font-medium tracking-wide text-ink-3 uppercase">
              {y}
            </td>
          ))}
        </tr>
      </thead>
      <tbody>
        <Row label="Revenue" cells={revenue.map((r) => Math.round(r).toLocaleString())} />
        <Row label="Growth %" cells={growth.map((g) => (g === null ? null : `${g >= 0 ? '+' : ''}${g.toFixed(0)}%`))} tone="text-ink-3" />
        <Row label="EBITDA" cells={ebitda.map((e) => Math.round(e).toLocaleString())} />
        <Row label="EBITDA margin %" cells={margin.map((m) => `${m.toFixed(0)}%`)} tone="text-ink-3" />
      </tbody>
    </table>
  )
}
