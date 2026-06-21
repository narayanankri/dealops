// ───────────────────────────────────────────────────────────
// Version A primitives — the KPMG-editorial design system.
// Inline-styled (via the T palette) so Version A is fully isolated from the
// Tailwind tokens Version B uses. Presentation only; all data comes from useApp.
// ───────────────────────────────────────────────────────────
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { T, FONT, STATUS_A, VERDICT_A, scoreColor, alpha } from './theme'
import type { DealStatus, Verdict } from '@/types'

type CSS = React.CSSProperties

// ── Tiny uppercase mono label (the signature "kicker") ──
export function Mono({ children, color = T.muted, style }: { children: React.ReactNode; color?: string; style?: CSS }) {
  return (
    <div style={{ fontSize: 10, color, letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 600, fontFamily: FONT.mono, ...style }}>
      {children}
    </div>
  )
}

// ── Serif display title ──
export function Serif({ children, size = 26, style }: { children: React.ReactNode; size?: number; style?: CSS }) {
  return (
    <div style={{ fontFamily: FONT.serif, fontWeight: 700, color: T.text, letterSpacing: -0.5, lineHeight: 1.1, fontSize: size, ...style }}>
      {children}
    </div>
  )
}

// ── Card ──
export function Card({
  children,
  accent,
  padding = '18px 20px',
  style,
  onClick,
  hoverable,
}: {
  children: React.ReactNode
  accent?: string
  padding?: string
  style?: CSS
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
  hoverable?: boolean
}) {
  const base: CSS = {
    background: accent ? `linear-gradient(135deg, ${T.card} 0%, ${T.cardHi} 100%)` : T.card,
    borderStyle: 'solid', borderWidth: 1, borderColor: T.border, borderRadius: 8, padding, position: 'relative',
    overflow: 'hidden', transition: 'all 0.15s', cursor: onClick ? 'pointer' : 'default', ...style,
  }
  if (accent) {
    base.borderLeftWidth = 3
    base.borderLeftColor = accent
  }
  return (
    <div
      style={base}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (hoverable || onClick) e.currentTarget.style.borderColor = T.borderHi
        if ((hoverable || onClick) && accent) e.currentTarget.style.borderLeftColor = accent
      }}
      onMouseLeave={(e) => {
        if (hoverable || onClick) e.currentTarget.style.borderColor = T.border
        if ((hoverable || onClick) && accent) e.currentTarget.style.borderLeftColor = accent
      }}
    >
      {accent && (
        <div style={{ position: 'absolute', top: 0, right: 0, width: 80, height: 80, background: `radial-gradient(circle at top right, ${alpha(accent, 0.13)} 0%, transparent 70%)`, pointerEvents: 'none' }} />
      )}
      {children}
    </div>
  )
}

// ── KPI tile (serif number) ──
export function KPI({
  label, value, unit, sublabel, accent = T.blue, large, onClick, selected,
}: {
  label: string; value: React.ReactNode; unit?: string; sublabel?: string; accent?: string; large?: boolean; onClick?: () => void; selected?: boolean
}) {
  return (
    <Card
      accent={accent}
      padding={large ? '20px 22px' : '16px 18px'}
      onClick={onClick}
      style={selected ? { boxShadow: `inset 0 0 0 2px ${accent}`, background: `linear-gradient(135deg, ${alpha(accent, 0.1)} 0%, ${T.cardHi} 100%)` } : undefined}
    >
      <Mono>{label}</Mono>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 8, marginBottom: 4 }}>
        <span style={{ fontSize: large ? 32 : 26, fontWeight: 700, color: T.text, fontFamily: FONT.serif, letterSpacing: -0.5 }}>{value}</span>
        {unit && <span style={{ fontSize: 12, color: T.mutedHi, fontWeight: 500 }}>{unit}</span>}
      </div>
      {sublabel && <div style={{ fontSize: 11, color: T.muted, fontStyle: 'italic' }}>{sublabel}</div>}
    </Card>
  )
}

// ── Score chip ──
export function ScoreBadge({ score, size = 'md' }: { score: number | null | undefined; size?: 'sm' | 'md' | 'lg' }) {
  if (score === null || score === undefined) return <span style={{ color: T.muted, fontSize: 13 }}>—</span>
  const color = scoreColor(score)
  const px = size === 'lg' ? '5px 12px' : size === 'sm' ? '2px 8px' : '3px 10px'
  const fs = size === 'lg' ? 14 : size === 'sm' ? 11 : 12
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', padding: px, fontSize: fs, fontWeight: 700, fontFamily: FONT.mono, borderRadius: 4, background: alpha(color, 0.13), color, border: `1px solid ${alpha(color, 0.33)}` }}>
      {Math.round(score)}
    </span>
  )
}

// ── Status pill (our DealStatus) ──
export function StatusPill({ status }: { status: DealStatus }) {
  const s = STATUS_A[status]
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 9px', fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', fontFamily: FONT.mono, borderRadius: 4, background: alpha(s.color, 0.13), color: s.color, border: `1px solid ${alpha(s.color, 0.33)}` }}>
      {s.label}
    </span>
  )
}

// ── Verdict badge (our engine verdict) ──
export function VerdictBadge({ verdict }: { verdict: Verdict }) {
  const r = VERDICT_A[verdict]
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 9px', fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', fontFamily: FONT.mono, borderRadius: 4, background: alpha(r.color, 0.13), color: r.color, border: `1px solid ${alpha(r.color, 0.33)}` }}>
      <span>{r.icon}</span>
      {r.label}
    </span>
  )
}

// ── Labelled progress bar ──
export function ScoreBar({ label, value, max = 100, color }: { label: string; value: number; max?: number; color?: string }) {
  const c = color ?? scoreColor((value / max) * 100)
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
        <span style={{ fontSize: 11, color: T.muted }}>{label}</span>
        <span style={{ fontSize: 11, fontFamily: FONT.mono, fontWeight: 700, color: c }}>{Math.round(value)}</span>
      </div>
      <div style={{ width: '100%', height: 4, background: T.border, borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ width: `${Math.max(0, Math.min(100, (value / max) * 100))}%`, height: '100%', background: c, borderRadius: 2, transition: 'width 0.5s' }} />
      </div>
    </div>
  )
}

// ── Button ──
type BtnVariant = 'primary' | 'cyan' | 'accent' | 'success' | 'danger' | 'ghost' | 'ghostCyan' | 'glow'
export function Btn({
  children, onClick, variant = 'primary', size = 'md', disabled = false, style, title,
}: {
  children: React.ReactNode; onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void; variant?: BtnVariant; size?: 'sm' | 'md' | 'lg'; disabled?: boolean; style?: CSS; title?: string
}) {
  const sizes = { sm: { padding: '6px 12px', fontSize: 11 }, md: { padding: '9px 16px', fontSize: 12 }, lg: { padding: '11px 20px', fontSize: 13 } }
  const variants: Record<BtnVariant, CSS> = {
    primary: { background: T.navy, color: '#FFFFFF', border: `1px solid ${T.navy}` },
    cyan: { background: T.cyan, color: T.navyDeep, border: `1px solid ${T.cyan}`, fontWeight: 700 },
    accent: { background: T.amber, color: '#0A1628', border: `1px solid ${T.amber}`, fontWeight: 700 },
    success: { background: T.green, color: '#FFFFFF', border: `1px solid ${T.green}` },
    danger: { background: 'transparent', color: T.red, border: `1px solid ${alpha(T.red, 0.33)}` },
    ghost: { background: 'transparent', color: T.mutedHi, border: `1px solid ${T.border}` },
    ghostCyan: { background: 'transparent', color: T.cyan, border: `1px solid ${alpha(T.cyan, 0.33)}` },
    glow: { background: `linear-gradient(135deg, ${T.cyan} 0%, ${T.blue} 100%)`, color: '#FFFFFF', border: 'none', fontWeight: 700, boxShadow: `0 0 24px ${alpha(T.cyan, 0.33)}` },
  }
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{ ...sizes[size], ...variants[variant], borderRadius: 5, fontWeight: 600, fontFamily: FONT.sans, opacity: disabled ? 0.4 : 1, cursor: disabled ? 'not-allowed' : 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, transition: 'all 0.15s', ...style }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.transform = 'translateY(-1px)' }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)' }}
    >
      {children}
    </button>
  )
}

// ── Animated count-up (serif numbers) ──
export function CountUp({ value, duration = 1200, prefix = '', suffix = '', decimals = 0 }: { value: number; duration?: number; prefix?: string; suffix?: string; decimals?: number }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const to = Number.isFinite(value) ? value : 0
    if (reduce) { setN(to); return }
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration)
      setN(to * (1 - Math.pow(1 - p, 3)))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value, duration])
  return <span>{prefix}{n.toFixed(decimals)}{suffix}</span>
}

// ── Section heading: mono kicker + serif title ──
export function SectionTitle({ kicker, title, right }: { kicker?: string; title: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12, marginBottom: 14 }}>
      <div>
        {kicker && <Mono color={T.cyan} style={{ marginBottom: 6 }}>{kicker}</Mono>}
        <Serif size={18}>{title}</Serif>
      </div>
      {right}
    </div>
  )
}

// ── Radar / spider (navy, SVG, forms-in on mount) ──
export type RadarDatumA = { label: string; value: number }
export function RadarA({ data, max = 100, size = 280, color = T.cyan }: { data: RadarDatumA[]; max?: number; size?: number; color?: string }) {
  const n = data.length
  const cx = size / 2
  const cy = size / 2
  const R = size * 0.34
  const labelR = R + 20
  const ang = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / n
  const pt = (i: number, r: number): [number, number] => [cx + r * Math.cos(ang(i)), cy + r * Math.sin(ang(i))]
  const poly = (r: number) => data.map((_, i) => pt(i, r).join(',')).join(' ')
  const valueR = (d: RadarDatumA) => (R * Math.max(0, Math.min(d.value, max))) / max
  const valuePoly = data.map((d, i) => pt(i, valueR(d)).join(',')).join(' ')
  const rings = [0.25, 0.5, 0.75, 1]
  return (
    <svg viewBox={`0 0 ${size} ${size + 24}`} width="100%" style={{ overflow: 'visible' }}>
      {rings.map((lvl, i) => (
        <polygon key={i} points={poly(R * lvl)} fill="none" stroke={T.border} strokeWidth={1} opacity={0.7} />
      ))}
      {data.map((_, i) => {
        const [x, y] = pt(i, R)
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke={T.border} strokeWidth={1} opacity={0.7} />
      })}
      <g style={{ transformBox: 'view-box', transformOrigin: `${cx}px ${cy}px`, animation: 'radar-form 0.7s cubic-bezier(0.22,1,0.36,1) both' }}>
        <polygon points={valuePoly} fill={alpha(color, 0.18)} stroke={color} strokeWidth={2} strokeLinejoin="round" />
        {data.map((d, i) => {
          const [x, y] = pt(i, valueR(d))
          return <circle key={i} cx={x} cy={y} r={3.5} fill={color} stroke={T.card} strokeWidth={1.5} />
        })}
      </g>
      {data.map((d, i) => {
        const [lx, ly] = pt(i, labelR)
        const cos = Math.cos(ang(i))
        const sin = Math.sin(ang(i))
        const anchor = cos > 0.3 ? 'start' : cos < -0.3 ? 'end' : 'middle'
        const dy = sin > 0.5 ? 10 : sin < -0.5 ? -3 : 4
        return (
          <text key={i} x={lx} y={ly + dy} textAnchor={anchor} fontSize={10} fontFamily={FONT.sans} fill={T.mutedHi}>
            {d.label}
            <tspan dx={5} fontFamily={FONT.mono} fill={T.muted}>{Math.round(d.value)}</tspan>
          </text>
        )
      })}
    </svg>
  )
}

// ── Low/base/high range bar ──
export function RangeBarA({ low, base, high, fmt }: { low: number; base: number; high: number; fmt: (n: number) => string }) {
  const span = Math.max(1, high - low)
  const pct = (v: number) => `${((v - low) / span) * 100}%`
  return (
    <div style={{ margin: '14px 0 6px' }}>
      <div style={{ position: 'relative', height: 8, background: T.border, borderRadius: 4 }}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, background: `linear-gradient(90deg, ${alpha(T.blue, 0.25)}, ${alpha(T.cyan, 0.45)})`, borderRadius: 4 }} />
        <div style={{ position: 'absolute', left: pct(base), top: -3, width: 3, height: 14, background: T.cyan, borderRadius: 2, transform: 'translateX(-50%)', boxShadow: `0 0 8px ${T.cyan}` }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 7, fontFamily: FONT.mono, fontSize: 11, color: T.muted }}>
        <span>{fmt(low)}</span>
        <span style={{ color: T.cyan, fontWeight: 700 }}>{fmt(base)}</span>
        <span>{fmt(high)}</span>
      </div>
    </div>
  )
}

// ── Simple vertical bar set (e.g. scenario IRRs) ──
export function BarsA({ data, height = 180, unit = '' }: { data: { label: string; value: number; color?: string }[]; height?: number; unit?: string }) {
  const maxV = Math.max(1, ...data.map((d) => d.value))
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, height, padding: '8px 4px' }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end' }}>
          <span style={{ fontFamily: FONT.mono, fontSize: 12, fontWeight: 700, color: d.color ?? T.cyan }}>{d.value}{unit}</span>
          <div style={{ width: '100%', maxWidth: 56, height: `${(d.value / maxV) * (height - 56)}px`, background: `linear-gradient(180deg, ${d.color ?? T.cyan}, ${alpha(d.color ?? T.cyan, 0.4)})`, borderRadius: '4px 4px 0 0', transition: 'height 0.5s' }} />
          <span style={{ fontSize: 11, color: T.muted }}>{d.label}</span>
        </div>
      ))}
    </div>
  )
}

// ── Animated knowledge-graph strip (header motif) ──
export function KGStrip({ height = 38 }: { height?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const dpr = window.devicePixelRatio || 1
    const POS = [
      { x: 0.06, y: 0.5, hub: true }, { x: 0.27, y: 0.42, hub: true }, { x: 0.5, y: 0.55, hub: true },
      { x: 0.73, y: 0.45, hub: true }, { x: 0.94, y: 0.5, hub: true },
      { x: 0.13, y: 0.25 }, { x: 0.18, y: 0.78 }, { x: 0.36, y: 0.78 }, { x: 0.42, y: 0.25 },
      { x: 0.57, y: 0.22 }, { x: 0.63, y: 0.8 }, { x: 0.81, y: 0.22 }, { x: 0.86, y: 0.78 },
    ]
    const EDGES = [[0, 1], [0, 5], [0, 6], [1, 2], [1, 7], [1, 8], [2, 3], [2, 9], [2, 10], [3, 4], [3, 11], [3, 12], [4, 12], [5, 8], [6, 7], [9, 10], [11, 12], [0, 8], [4, 11]]
    let nodes: { hub: boolean; bx: number; by: number; x: number; y: number; ph: number }[] = []
    const pulses: { s: number; t: number; t0: number }[] = []
    const layout = () => {
      const W = canvas.parentElement?.clientWidth || 800
      const H = canvas.parentElement?.clientHeight || height
      canvas.width = W * dpr; canvas.height = H * dpr
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      nodes = POS.map((p) => ({ hub: !!p.hub, bx: p.x * W, by: p.y * H, x: p.x * W, y: p.y * H, ph: Math.random() * Math.PI * 2 }))
    }
    layout()
    window.addEventListener('resize', layout)
    let raf = 0
    let last = 0
    const tick = () => {
      const now = performance.now()
      const W = canvas.clientWidth, H = canvas.clientHeight
      nodes.forEach((n) => { n.x = n.bx + Math.sin(now * 0.0008 + n.ph) * 3; n.y = n.by + Math.cos(now * 0.001 + n.ph) * 2.5 })
      if (now - last > 550) { const e = EDGES[Math.floor(Math.random() * EDGES.length)]; const d = Math.random() < 0.5 ? [e[0], e[1]] : [e[1], e[0]]; pulses.push({ s: d[0], t: d[1], t0: now }); last = now }
      ctx.fillStyle = T.bg; ctx.fillRect(0, 0, W, H)
      ctx.strokeStyle = 'rgba(0,145,218,0.18)'; ctx.lineWidth = 0.6
      EDGES.forEach(([s, t]) => { const a = nodes[s], b = nodes[t]; if (!a || !b) return; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke() })
      const DUR = 1100
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i]; const t = (now - p.t0) / DUR
        if (t >= 1) { pulses.splice(i, 1); continue }
        const a = nodes[p.s], b = nodes[p.t]; if (!a || !b) continue
        const x = a.x + (b.x - a.x) * t, y = a.y + (b.y - a.y) * t, al = Math.sin(t * Math.PI)
        const g = ctx.createRadialGradient(x, y, 0, x, y, 8); g.addColorStop(0, `rgba(0,230,255,${0.95 * al})`); g.addColorStop(1, 'rgba(0,230,255,0)')
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 8, 0, Math.PI * 2); ctx.fill()
        ctx.fillStyle = `rgba(255,255,255,${al})`; ctx.beginPath(); ctx.arc(x, y, 1.4, 0, Math.PI * 2); ctx.fill()
      }
      nodes.forEach((n) => {
        const r = n.hub ? 3.5 : 2, c = n.hub ? '#FD349C' : '#0091DA'
        const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 3); g.addColorStop(0, c + (n.hub ? '88' : '66')); g.addColorStop(1, c + '00')
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(n.x, n.y, r * 3, 0, Math.PI * 2); ctx.fill()
        ctx.fillStyle = c; ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, Math.PI * 2); ctx.fill()
      })
      raf = requestAnimationFrame(tick)
    }
    tick()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', layout) }
  }, [height])
  return (
    <div style={{ height, position: 'relative', flexShrink: 0, overflow: 'hidden', background: T.bg, borderBottom: '1px solid rgba(0,145,218,0.18)' }}>
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, display: 'block' }} />
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 80, background: `linear-gradient(to right, ${T.bg}, transparent)`, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 80, background: `linear-gradient(to left, ${T.bg}, transparent)`, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', right: 18, top: '50%', transform: 'translateY(-50%)', fontFamily: FONT.mono, fontSize: 9, color: 'rgba(0,163,224,0.55)', letterSpacing: 4, fontWeight: 600, pointerEvents: 'none' }}>AI</div>
    </div>
  )
}

// ── Static node-network backdrop (landing / hero) ──
const seeded = (s: number) => { const x = Math.sin(s) * 10000; return x - Math.floor(x) }
export function NetworkBackground({ density = 46, opacity = 0.4 }: { density?: number; opacity?: number }) {
  const nodes = useMemo(() => Array.from({ length: density }, (_, i) => { const s = i + 1; return { x: seeded(s * 17) * 100, y: seeded(s * 31) * 100, r: 1 + seeded(s * 43) * 2 } }), [density])
  const lines = useMemo(() => {
    const arr: { a: number; b: number; d: number }[] = []
    for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y, d = Math.sqrt(dx * dx + dy * dy)
      if (d < 18 && seeded((i + 1) * 1009 + (j + 1) * 917) > 0.55) arr.push({ a: i, b: j, d })
    }
    return arr
  }, [nodes])
  return (
    <div style={{ position: 'absolute', inset: 0, opacity, pointerEvents: 'none' }}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <radialGradient id="va-nodegrad"><stop offset="0%" stopColor={T.cyan} stopOpacity="0.9" /><stop offset="100%" stopColor={T.cyan} stopOpacity="0" /></radialGradient>
        </defs>
        {lines.map((l, i) => (
          <line key={i} x1={nodes[l.a].x} y1={nodes[l.a].y} x2={nodes[l.b].x} y2={nodes[l.b].y} stroke={T.cyan} strokeWidth="0.08" opacity={Math.max(0.05, 0.4 - l.d * 0.02)} />
        ))}
        {nodes.map((n, i) => (
          <g key={i}>
            <circle cx={n.x} cy={n.y} r={n.r * 0.4} fill={T.cyan} />
            <circle cx={n.x} cy={n.y} r={n.r * 1.2} fill="url(#va-nodegrad)" />
          </g>
        ))}
      </svg>
    </div>
  )
}
