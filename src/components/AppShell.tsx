import type { ReactNode } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { cn } from '@/lib/cn'
import { useApp } from '@/lib/store'
import { usdm } from '@/lib/format'
import { AmbientField } from '@/components/AmbientField'

const nav = [
  { to: '/', label: 'Pipeline', end: true },
  { to: '/ic-queue', label: 'IC Queue' },
  { to: '/mandate', label: 'Mandate' },
]

// The brand mark — a miniature of the confidence gauge: a tick dial, partly lit.
function GaugeMark() {
  const ticks = 12
  const lit = 8
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden>
      {Array.from({ length: ticks }, (_, i) => {
        const ang = ((-90 + i * (360 / ticks)) * Math.PI) / 180
        const r = 8.5
        const len = 3
        return (
          <line
            key={i}
            x1={10 + r * Math.cos(ang)}
            y1={10 + r * Math.sin(ang)}
            x2={10 + (r - len) * Math.cos(ang)}
            y2={10 + (r - len) * Math.sin(ang)}
            stroke={i < lit ? 'var(--color-accent)' : 'var(--color-line)'}
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        )
      })}
      <circle cx="10" cy="10" r="1.7" fill="var(--color-accent)" />
    </svg>
  )
}

export function AppShell({ children }: { children: ReactNode }) {
  const { funds, activeFundId, setActiveFund, deals } = useApp()
  const navigate = useNavigate()
  const icCount = deals.filter((d) => d.fundId === activeFundId && d.status === 'sent-to-ic').length

  return (
    <div className="relative flex h-full">
      <AmbientField />
      <aside className="relative z-10 flex w-60 shrink-0 flex-col border-r border-line/70 bg-panel/60 px-4 py-5">
        <button onClick={() => navigate('/')} className="mb-8 flex items-center gap-2.5 px-1 text-left">
          <span className="grid h-8 w-8 place-items-center rounded-lg border border-line bg-panel-2">
            <GaugeMark />
          </span>
          <div className="leading-tight">
            <div className="font-display text-sm font-semibold tracking-tight text-ink">Deal Operations</div>
            <div className="font-mono text-[9px] tracking-[0.18em] text-ink-3 uppercase">Investment screening</div>
          </div>
        </button>

        <nav className="flex flex-col gap-1">
          {nav.map((n) => {
            const badge = n.to === '/ic-queue' ? icCount : 0
            return (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end}
                className={({ isActive }) =>
                  cn(
                    'flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive ? 'bg-accent-bg text-accent-2' : 'text-ink-2 hover:bg-panel-2 hover:text-ink',
                  )
                }
              >
                {n.label}
                {badge > 0 && (
                  <span className="grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1.5 text-[11px] font-semibold text-canvas tnum">
                    {badge}
                  </span>
                )}
              </NavLink>
            )
          })}
        </nav>

        {/* Fund switcher */}
        <div className="mt-auto">
          <div className="mb-1.5 px-1 text-[11px] font-medium tracking-wide text-ink-3 uppercase">Funds</div>
          <div className="space-y-1.5">
            {funds.map((f) => {
              const active = f.id === activeFundId
              return (
                <button
                  key={f.id}
                  onClick={() => {
                    setActiveFund(f.id)
                    navigate('/')
                  }}
                  className={cn(
                    'w-full rounded-lg border px-3 py-2 text-left transition-colors',
                    active ? 'border-accent/50 bg-accent-bg' : 'border-line/60 bg-panel-2 hover:border-line',
                  )}
                >
                  <div className="flex items-center gap-1.5">
                    {active && <span className="h-1.5 w-1.5 rounded-full bg-accent" />}
                    <span className={cn('truncate text-sm font-medium', active ? 'text-accent-2' : 'text-ink')}>{f.mandate.fundName}</span>
                  </div>
                  <div className="mt-0.5 flex items-center justify-between text-[11px] text-ink-3">
                    <span className="capitalize">{f.mandate.strategyArchetype.replace('-', ' ')}</span>
                    <span className="tnum">
                      {usdm(f.mandate.fundSizeUSDm)} · {f.mandate.returnHurdlePct}%
                    </span>
                  </div>
                </button>
              )
            })}
          </div>

          <div className="mt-3 flex items-start gap-2 px-1 text-[11px] leading-snug text-ink-3">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-pos pulsing" />
            <span>Connected · Claude for Financial Services</span>
          </div>

          <button
            onClick={() => {
              try {
                localStorage.removeItem('dealops_authed')
              } catch {
                /* ignore */
              }
              window.location.reload()
            }}
            className="mt-2 w-full rounded-lg px-3 py-2 text-left text-xs text-ink-3 transition-colors hover:bg-panel-2 hover:text-ink-2"
          >
            ← Sign out
          </button>
        </div>
      </aside>

      <main className="relative z-10 min-w-0 flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}
