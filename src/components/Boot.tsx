import { useEffect, useState } from 'react'
import { cn } from '@/lib/cn'
import { ConfidenceRing } from '@/components/ui'

const STEPS = ['Loading mandate', 'Screening the pipeline', 'Reconciling valuations', 'Running the coherence ledger']

// A ~1.6s "the engine is starting up" splash shown right after sign-in — the gauge calibrates,
// the checklist ticks through, then it fades into the workspace.
export function Boot({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)
  useEffect(() => {
    const timers: number[] = []
    STEPS.forEach((_, i) => timers.push(window.setTimeout(() => setStep(i + 1), 200 + i * 300)))
    timers.push(window.setTimeout(() => setDone(true), 1500))
    timers.push(window.setTimeout(onDone, 2000))
    return () => timers.forEach((t) => clearTimeout(t))
  }, [onDone])

  return (
    <div className={cn('fixed inset-0 z-[100] grid place-items-center bg-canvas', done && 'app-boot-out')}>
      <div className="flex w-full max-w-sm flex-col items-center px-8 text-center">
        <ConfidenceRing score={88} size={132} ticks={48} />
        <div className="mt-6 font-display text-lg font-semibold text-ink">Calibrating the engine</div>
        <div className="mt-1 font-mono text-[10px] tracking-[0.25em] text-ink-3 uppercase">AI Deal Operations</div>

        <div className="mt-7 w-full space-y-2 text-left">
          {STEPS.map((s, i) => {
            const active = step > i
            return (
              <div key={s} className="flex items-center gap-2.5 text-sm">
                <span
                  className={cn(
                    'grid h-4 w-4 shrink-0 place-items-center rounded-full text-[10px] transition-colors',
                    active ? 'bg-pos-bg text-pos' : 'bg-panel-2 text-transparent',
                  )}
                >
                  ✓
                </span>
                <span className={cn('transition-colors', active ? 'text-ink-2' : 'text-ink-3/50')}>{s}</span>
              </div>
            )
          })}
        </div>

        <div className="mt-6 h-0.5 w-full overflow-hidden rounded-full bg-panel-2">
          <div
            className="h-full rounded-full bg-accent transition-[width] duration-300 ease-out"
            style={{ width: `${Math.round((step / STEPS.length) * 100)}%` }}
          />
        </div>
      </div>
    </div>
  )
}
