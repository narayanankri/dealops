import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/cn'
import type { Basis, Confidence, DealStatus, Verdict } from '@/types'
import { basisLabel, confidenceLabel, scoreTone, verdictLabel, verdictTone } from '@/lib/format'
import { STATUS_LABEL, STATUS_TONE } from '@/lib/status'
import { useCountUp } from '@/lib/useCountUp'

// A figure that counts up to its value — the "computed live" flourish.
export function Counter({ value, dur = 900, format }: { value: number; dur?: number; format?: (n: number) => string }) {
  const v = useCountUp(value, dur)
  return <>{format ? format(v) : Math.round(v).toLocaleString()}</>
}

type Tone = 'pos' | 'warn' | 'neg' | 'neutral' | 'accent'

const toneText: Record<Tone, string> = {
  pos: 'text-pos',
  warn: 'text-warn',
  neg: 'text-neg',
  neutral: 'text-ink-2',
  accent: 'text-accent',
}
const toneChip: Record<Tone, string> = {
  pos: 'bg-pos-bg text-pos',
  warn: 'bg-warn-bg text-warn',
  neg: 'bg-neg-bg text-neg',
  neutral: 'bg-panel-3 text-ink-2',
  accent: 'bg-accent-bg text-accent-2',
}
const toneDot: Record<Tone, string> = {
  pos: 'bg-pos',
  warn: 'bg-warn',
  neg: 'bg-neg',
  neutral: 'bg-ink-3',
  accent: 'bg-accent',
}

// ── Card / Panel ──
export function Card({ className, children, accent }: { className?: string; children: ReactNode; accent?: 'accent' | 'indigo' | 'warn' | 'neg' | 'pos' }) {
  const c = accent ? `var(--color-${accent})` : undefined
  return (
    <div
      className={cn(
        'rounded-xl border border-line/70 bg-panel shadow-[0_1px_0_0_rgba(255,255,255,0.02),0_8px_24px_-12px_rgba(0,0,0,0.6)]',
        accent && 'relative overflow-hidden',
        className,
      )}
      style={c ? { borderLeftColor: c, borderLeftWidth: 2 } : undefined}
    >
      {accent && (
        <div
          className="pointer-events-none absolute top-0 right-0 h-24 w-24"
          style={{ background: `radial-gradient(circle at top right, color-mix(in srgb, ${c} 16%, transparent), transparent 70%)` }}
        />
      )}
      {accent ? <div className="relative">{children}</div> : children}
    </div>
  )
}

export function SectionTitle({ children, hint, kicker }: { children: ReactNode; hint?: string; kicker?: string }) {
  return (
    <div className="mb-3">
      {kicker && <div className="mb-1 font-mono text-[10px] tracking-[0.14em] text-accent-2 uppercase">{kicker}</div>}
      <div className="flex items-baseline justify-between">
        <h3 className="text-[13px] font-semibold tracking-wide text-ink-2 uppercase">{children}</h3>
        {hint && <span className="text-xs text-ink-3">{hint}</span>}
      </div>
    </div>
  )
}

// ── Verdict badge ──
export function VerdictBadge({ verdict, size = 'md' }: { verdict: Verdict; size?: 'sm' | 'md' | 'lg' }) {
  const tone = verdictTone[verdict] as Tone
  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2 font-semibold',
  }
  return (
    <span className={cn('inline-flex items-center rounded-full font-medium', toneChip[tone], sizes[size])}>
      <span className={cn('h-1.5 w-1.5 rounded-full', toneDot[tone])} />
      {verdictLabel[verdict]}
    </span>
  )
}

// ── Score chip (0-100) ──
export function ScoreChip({ score, label, size = 'md' }: { score: number; label?: string; size?: 'sm' | 'md' | 'lg' }) {
  const tone = scoreTone(score) as Tone
  const sizes = { sm: 'text-xs', md: 'text-sm', lg: 'text-base' }
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 font-semibold tnum', toneChip[tone], sizes[size])}>
      {score}
      {label && <span className="text-[10px] font-medium opacity-70">{label}</span>}
    </span>
  )
}

// ── Trust signal: basis + confidence (§11.5) ──
export function TrustTag({ basis, confidence }: { basis: Basis; confidence?: Confidence }) {
  const tone: Tone = basis === 'stated' ? 'pos' : basis === 'inferred' ? 'warn' : 'neg'
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-ink-3">
      <span className={cn('h-1.5 w-1.5 rounded-full', toneDot[tone])} />
      {basisLabel[basis]}
      {confidence && <span className="text-ink-3/70">· {confidenceLabel[confidence]}</span>}
    </span>
  )
}

// ── Big number (figures that matter) ──
export function Stat({
  label,
  value,
  tone = 'neutral',
  sub,
}: {
  label: string
  value: ReactNode
  tone?: Tone
  sub?: ReactNode
}) {
  return (
    <div>
      <div className="text-[11px] font-medium tracking-wide text-ink-3 uppercase">{label}</div>
      <div className={cn('mt-1 text-2xl font-semibold tnum', toneText[tone])}>{value}</div>
      {sub && <div className="mt-0.5 text-xs text-ink-3">{sub}</div>}
    </div>
  )
}

// ── Pill ──
export function Pill({ children, tone = 'neutral' }: { children: ReactNode; tone?: Tone }) {
  return <span className={cn('inline-flex items-center whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-medium', toneChip[tone])}>{children}</span>
}

// ── Confidence ring — the signature element ──
// A calm, static tick-gauge of a 0–100 score. Tone-coded, no
// animation; the one recognizable visual identity, grounded in a real number.
const toneVar: Record<Tone, string> = {
  pos: 'var(--color-pos)',
  warn: 'var(--color-warn)',
  neg: 'var(--color-neg)',
  neutral: 'var(--color-ink-3)',
  accent: 'var(--color-accent)',
}
export function ConfidenceRing({ score, size = 60, ticks = 36 }: { score: number; size?: number; ticks?: number }) {
  const val = useCountUp(score, 1100)
  const tone = scoreTone(score) as Tone
  const pct = Math.max(0, Math.min(100, val)) / 100
  const filled = Math.round(pct * ticks)
  const cx = size / 2
  const cy = size / 2
  const rOut = size / 2 - 1
  const tickLen = Math.max(4, size * 0.11)
  const marks = Array.from({ length: ticks }, (_, i) => {
    const ang = (-90 + i * (360 / ticks)) * (Math.PI / 180)
    return {
      x1: cx + rOut * Math.cos(ang),
      y1: cy + rOut * Math.sin(ang),
      x2: cx + (rOut - tickLen) * Math.cos(ang),
      y2: cy + (rOut - tickLen) * Math.sin(ang),
      on: i < filled,
    }
  })
  return (
    <div className="relative inline-grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        {marks.map((m, i) => (
          <line
            key={i}
            x1={m.x1}
            y1={m.y1}
            x2={m.x2}
            y2={m.y2}
            stroke={m.on ? toneVar[tone] : 'var(--color-line)'}
            strokeWidth={1.5}
            strokeLinecap="round"
            style={{ transition: 'stroke 0.4s ease' }}
          />
        ))}
      </svg>
      <span className={cn('absolute font-semibold tnum', toneText[tone], size >= 56 ? 'text-base' : 'text-xs')}>{Math.round(val)}</span>
    </div>
  )
}

// ── Deal status pill ──
export function StatusPill({ status }: { status: DealStatus }) {
  return <Pill tone={STATUS_TONE[status]}>{STATUS_LABEL[status]}</Pill>
}

// ── Row / header actions ⋯ menu ──
export function ActionsMenu({ actions }: { actions: { label: string; onClick: () => void; danger?: boolean }[] }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [open])
  if (!actions.length) return null
  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={(e) => {
          e.stopPropagation()
          setOpen((o) => !o)
        }}
        className="grid h-7 w-7 place-items-center rounded-md text-base text-ink-3 hover:bg-panel-2 hover:text-ink"
        aria-label="Actions"
      >
        ⋯
      </button>
      {open && (
        <div className="absolute right-0 z-30 mt-1 w-44 overflow-hidden rounded-lg border border-line bg-panel-2 py-1 shadow-[0_8px_30px_-6px_rgba(0,0,0,0.7)]">
          {actions.map((a, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation()
                setOpen(false)
                a.onClick()
              }}
              className={cn('block w-full px-3 py-1.5 text-left text-sm hover:bg-panel-3', a.danger ? 'text-neg' : 'text-ink-2')}
            >
              {a.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Horizontal score bar ──
export function ScoreBar({ score }: { score: number }) {
  const tone = scoreTone(score) as Tone
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-panel-3">
      <div className={cn('h-full rounded-full', toneDot[tone])} style={{ width: `${Math.max(2, score)}%` }} />
    </div>
  )
}

export function Button({
  children,
  onClick,
  variant = 'ghost',
  className,
  disabled,
  title,
}: {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'ghost' | 'danger'
  className?: string
  disabled?: boolean
  title?: string
}) {
  const v = {
    primary: 'bg-accent font-semibold text-canvas hover:bg-accent-2',
    ghost: 'border border-line text-ink-2 hover:bg-panel-2 hover:text-ink',
    danger: 'border border-neg/40 text-neg hover:bg-neg-bg',
  }[variant]
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
        v,
        disabled && 'cursor-not-allowed opacity-40 hover:bg-accent',
        className,
      )}
    >
      {children}
    </button>
  )
}
