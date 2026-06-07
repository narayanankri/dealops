import { useMemo, useState } from 'react'
import { useApp } from '@/lib/store'
import { seedFunds } from '@/data/funds'
import { analyze } from '@/engine'
import { Button, Card, SectionTitle, Stat } from '@/components/ui'
import { usdm } from '@/lib/format'
import { cn } from '@/lib/cn'
import type { Mandate, StrategyArchetype } from '@/types'

export function MandatePage() {
  const { mandate, setMandate, deals, funds, activeFundId, setActiveFund, cloneActiveFund } = useApp()
  const set = (patch: Partial<Mandate>) => setMandate({ ...mandate, ...patch })

  const fundDeals = useMemo(() => deals.filter((d) => d.fundId === activeFundId), [deals, activeFundId])
  const seed = seedFunds.find((f) => f.id === activeFundId)?.mandate

  // live impact on this fund's pipeline vs its baseline mandate
  const impact = useMemo(() => {
    const base = seed ?? mandate
    let redLine = 0
    let overConc = 0
    let sum = 0
    const changed: { name: string; from: number; to: number }[] = []
    for (const d of fundDeals) {
      const before = analyze(d, base)
      const now = analyze(d, mandate)
      sum += now.composite
      if (now.mandateFit.redLineBreaches.length) redLine++
      if (!now.mandateFit.concentration.fits) overConc++
      if (Math.abs(now.composite - before.composite) >= 5) changed.push({ name: d.name, from: before.composite, to: now.composite })
    }
    changed.sort((a, b) => Math.abs(b.to - b.from) - Math.abs(a.to - a.from))
    return {
      avgComposite: fundDeals.length ? Math.round(sum / fundDeals.length) : 0,
      redLine,
      overConc,
      changed,
      maxTicket: (mandate.concentrationCapPct / 100) * mandate.fundSizeUSDm,
    }
  }, [fundDeals, mandate, seed])

  const dirty = !!seed && JSON.stringify(mandate) !== JSON.stringify(seed)

  return (
    <div className="mx-auto max-w-[1180px] px-8 py-7">
      <div className="mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-semibold text-ink">Mandate configuration</h1>
            <p className="mt-0.5 text-sm text-ink-3">Set the rules — every deal re-scores live. Each fund has its own mandate.</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={cloneActiveFund}>+ Clone fund</Button>
            {dirty && <Button onClick={() => seed && setMandate(seed)}>Reset</Button>}
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {funds.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFund(f.id)}
              className={cn(
                'rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors',
                f.id === activeFundId ? 'border-accent/50 bg-accent-bg text-accent-2' : 'border-line bg-panel-2 text-ink-2 hover:text-ink',
              )}
            >
              {f.mandate.fundName}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Editor */}
        <div className="lg:col-span-2 space-y-5">
          <Card className="px-6 py-5">
            <SectionTitle>Fund & strategy</SectionTitle>
            <div className="space-y-5">
              <TextField label="Fund name" value={mandate.fundName} onChange={(v) => set({ fundName: v })} />
              <Slider label="Fund size" value={mandate.fundSizeUSDm} unit="m" min={200} max={5000} step={100} fmt={usdm} onChange={(v) => set({ fundSizeUSDm: v })} hint="Drives the concentration cap below." />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Select
                  label="Strategy archetype"
                  value={mandate.strategyArchetype}
                  options={['growth-equity', 'buyout', 'venture', 'credit']}
                  onChange={(v) => set({ strategyArchetype: v as StrategyArchetype, leverage: v === 'buyout' })}
                  hint="Drives how returns are modelled."
                />
                <Select
                  label="Control posture"
                  value={mandate.controlPosture}
                  options={['minority', 'significant-minority', 'control']}
                  onChange={(v) => set({ controlPosture: v as Mandate['controlPosture'] })}
                />
              </div>
              <Toggle label="Apply acquisition leverage" value={mandate.leverage} onChange={(v) => set({ leverage: v })} hint="Buyout strategies model debt; growth/venture are unlevered." />
              <div className="grid grid-cols-2 gap-4">
                <Slider label="Hold — min" value={mandate.holdYears[0]} unit="y" min={1} max={8} step={1} onChange={(v) => set({ holdYears: [v, mandate.holdYears[1]] })} />
                <Slider label="Hold — max" value={mandate.holdYears[1]} unit="y" min={2} max={12} step={1} onChange={(v) => set({ holdYears: [mandate.holdYears[0], v] })} />
              </div>
            </div>
          </Card>

          <Card className="px-6 py-5">
            <SectionTitle>Return & ticket</SectionTitle>
            <div className="space-y-5">
              <Slider label="Return hurdle (gross IRR)" value={mandate.returnHurdlePct} unit="%" min={5} max={40} step={1} onChange={(v) => set({ returnHurdlePct: v })} hint="Every deal’s IRR is judged against this." />
              <Slider label="Public-markets reference" value={mandate.publicReferencePct} unit="%" min={5} max={30} step={1} onChange={(v) => set({ publicReferencePct: v })} />
              <div className="grid grid-cols-2 gap-4">
                <Slider label="Ticket — min" value={mandate.ticketBandUSDm[0]} unit="m" min={5} max={100} step={5} fmt={usdm} onChange={(v) => set({ ticketBandUSDm: [v, mandate.ticketBandUSDm[1]] })} />
                <Slider label="Ticket — max" value={mandate.ticketBandUSDm[1]} unit="m" min={50} max={500} step={10} fmt={usdm} onChange={(v) => set({ ticketBandUSDm: [mandate.ticketBandUSDm[0], v] })} />
              </div>
              <Slider label="Concentration cap (% of fund / deal)" value={mandate.concentrationCapPct} unit="%" min={2} max={25} step={1} onChange={(v) => set({ concentrationCapPct: v })} hint={`Max single ticket: ${usdm(impact.maxTicket)}`} />
            </div>
          </Card>

          <Card className="px-6 py-5">
            <SectionTitle hint="priority sectors carry a ★">Target sectors</SectionTitle>
            <SectorEditor
              sectors={mandate.targetSectors}
              onChange={(targetSectors) => set({ targetSectors })}
            />
          </Card>

          <Card className="px-6 py-5">
            <SectionTitle>Geographies</SectionTitle>
            <div className="space-y-4">
              <ChipGroup label="Core" tone="pos" items={mandate.coreGeographies} onChange={(coreGeographies) => set({ coreGeographies })} />
              <ChipGroup label="Flagged (extra screening)" tone="warn" items={mandate.flaggedGeographies} onChange={(flaggedGeographies) => set({ flaggedGeographies })} />
              <ChipGroup label="Excluded (red line)" tone="neg" items={mandate.excludedGeographies} onChange={(excludedGeographies) => set({ excludedGeographies })} />
            </div>
          </Card>

          <Card className="px-6 py-5">
            <SectionTitle>Stages, instruments & red lines</SectionTitle>
            <div className="space-y-4">
              <ChipGroup label="Permitted stages" items={mandate.stages} onChange={(stages) => set({ stages })} />
              <ChipGroup label="Permitted instruments" items={mandate.instruments} onChange={(instruments) => set({ instruments })} />
              <ChipGroup label="Red lines (hard stops)" tone="neg" items={mandate.redLines} onChange={(redLines) => set({ redLines })} />
            </div>
          </Card>
        </div>

        {/* Live impact */}
        <div className="space-y-5">
          <div className="sticky top-5 space-y-5">
            <Card className="px-6 py-5">
              <SectionTitle hint="live">Impact on pipeline</SectionTitle>
              <div className="grid grid-cols-3 gap-3">
                <Stat label="Avg composite" value={impact.avgComposite} tone={impact.avgComposite >= 70 ? 'pos' : impact.avgComposite >= 50 ? 'warn' : 'neg'} />
                <Stat label="Red-line breach" value={impact.redLine} tone={impact.redLine ? 'neg' : 'neutral'} />
                <Stat label="Over cap" value={impact.overConc} tone={impact.overConc ? 'warn' : 'neutral'} />
              </div>
              <div className="mt-4 border-t border-line-soft/60 pt-4">
                <Stat label="Max single ticket" value={usdm(impact.maxTicket)} sub={`${mandate.concentrationCapPct}% of ${usdm(mandate.fundSizeUSDm)}`} />
              </div>
            </Card>

            <Card className="px-6 py-5">
              <SectionTitle>Composite shift vs default</SectionTitle>
              {impact.changed.length === 0 ? (
                <p className="text-sm text-ink-3">No material score change from this fund’s baseline mandate.</p>
              ) : (
                <ul className="space-y-2.5">
                  {impact.changed.map((c) => (
                    <li key={c.name} className="flex items-center justify-between gap-3 text-sm">
                      <span className="min-w-0 truncate text-ink-2">{c.name}</span>
                      <span className="flex shrink-0 items-center gap-1.5 tnum">
                        <span className="text-ink-3">{c.from}</span>
                        <span className="text-ink-3">→</span>
                        <span className={c.to >= c.from ? 'font-medium text-pos' : 'font-medium text-neg'}>{c.to}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── form controls ──
function TextField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm text-ink-2">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-line bg-panel-2 px-3 py-2 text-sm text-ink outline-none focus:border-accent"
      />
    </div>
  )
}

function Slider({
  label,
  value,
  unit,
  min,
  max,
  step,
  onChange,
  hint,
  fmt,
}: {
  label: string
  value: number
  unit: string
  min: number
  max: number
  step: number
  onChange: (v: number) => void
  hint?: string
  fmt?: (v: number) => string
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-sm text-ink-2">{label}</span>
        <span className="text-sm font-semibold text-ink tnum">{fmt ? fmt(value) : `${value}${unit}`}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))} className="mt-2 w-full accent-accent" />
      {hint && <p className="mt-1 text-[11px] text-ink-3">{hint}</p>}
    </div>
  )
}

function Select({ label, value, options, onChange, hint }: { label: string; value: string; options: string[]; onChange: (v: string) => void; hint?: string }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm text-ink-2">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-line bg-panel-2 px-3 py-2 text-sm text-ink capitalize outline-none focus:border-accent"
      >
        {options.map((o) => (
          <option key={o} value={o} className="bg-panel-2">
            {o.replace('-', ' ')}
          </option>
        ))}
      </select>
      {hint && <p className="mt-1 text-[11px] text-ink-3">{hint}</p>}
    </div>
  )
}

function Toggle({ label, value, onChange, hint }: { label: string; value: boolean; onChange: (v: boolean) => void; hint?: string }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="text-sm text-ink-2">{label}</div>
        {hint && <p className="text-[11px] text-ink-3">{hint}</p>}
      </div>
      <button
        onClick={() => onChange(!value)}
        className={cn('relative h-6 w-10 shrink-0 rounded-full transition-colors', value ? 'bg-accent' : 'bg-panel-3')}
      >
        <span className={cn('absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all', value ? 'left-[18px]' : 'left-0.5')} />
      </button>
    </div>
  )
}

const groupTone = { pos: 'bg-pos-bg text-pos', warn: 'bg-warn-bg text-warn', neg: 'bg-neg-bg text-neg', neutral: 'bg-panel-3 text-ink-2' } as const

function ChipGroup({
  label,
  items,
  onChange,
  tone = 'neutral',
}: {
  label: string
  items: string[]
  onChange: (items: string[]) => void
  tone?: keyof typeof groupTone
}) {
  const [v, setV] = useState('')
  const add = () => {
    const t = v.trim()
    if (t && !items.includes(t)) onChange([...items, t])
    setV('')
  }
  return (
    <div>
      <div className="mb-1.5 text-[11px] font-medium tracking-wide text-ink-3 uppercase">{label}</div>
      <div className="flex flex-wrap items-center gap-1.5">
        {items.map((it) => (
          <span key={it} className={cn('inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium', groupTone[tone])}>
            {it}
            <button onClick={() => onChange(items.filter((x) => x !== it))} className="opacity-60 hover:opacity-100">
              ×
            </button>
          </span>
        ))}
        <input
          value={v}
          onChange={(e) => setV(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
          placeholder="+ add"
          className="w-20 rounded-md border border-line bg-panel-2 px-2 py-1 text-xs text-ink outline-none focus:border-accent focus:w-32"
        />
      </div>
    </div>
  )
}

function SectorEditor({ sectors, onChange }: { sectors: Mandate['targetSectors']; onChange: (s: Mandate['targetSectors']) => void }) {
  const [v, setV] = useState('')
  const add = () => {
    const t = v.trim()
    if (t && !sectors.some((s) => s.name === t)) onChange([...sectors, { name: t }])
    setV('')
  }
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {sectors.map((s) => (
        <span key={s.name} className={cn('inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium', s.priority ? 'bg-accent-bg text-accent-2' : 'bg-panel-3 text-ink-2')}>
          <button onClick={() => onChange(sectors.map((x) => (x.name === s.name ? { ...x, priority: !x.priority } : x)))} title="Toggle priority">
            {s.priority ? '★' : '☆'}
          </button>
          {s.name}
          <button onClick={() => onChange(sectors.filter((x) => x.name !== s.name))} className="opacity-60 hover:opacity-100">
            ×
          </button>
        </span>
      ))}
      <input
        value={v}
        onChange={(e) => setV(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && add()}
        placeholder="+ add"
        className="w-20 rounded-md border border-line bg-panel-2 px-2 py-1 text-xs text-ink outline-none focus:border-accent focus:w-32"
      />
    </div>
  )
}