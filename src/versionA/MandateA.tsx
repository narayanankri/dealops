import { useMemo, useState } from 'react'
import { useApp } from '@/lib/store'
import { seedFunds } from '@/data/funds'
import { analyze } from '@/engine'
import { usdm } from '@/lib/format'
import type { Mandate, StrategyArchetype } from '@/types'
import { TopBarA } from './TopBarA'
import { T, FONT, alpha, scoreColor } from './theme'
import { Card, Mono, SectionTitle, Btn } from './uiA'

// ───────────────────────────────────────────────────────────
// Version A — Mandate configuration (KPMG-editorial facelift).
// Same data + behaviour as src/pages/Mandate.tsx: edit the active fund's
// mandate (all fields), wire through setMandate; fund switcher + clone + reset;
// live impact on this fund's pipeline. Re-skinned with the navy/serif language.
// ───────────────────────────────────────────────────────────

export function MandateA() {
  const { mandate, setMandate, deals, funds, activeFundId, setActiveFund, cloneActiveFund } = useApp()
  const set = (patch: Partial<Mandate>) => setMandate({ ...mandate, ...patch })

  const fundDeals = useMemo(() => deals.filter((d) => d.fundId === activeFundId), [deals, activeFundId])
  const seed = seedFunds.find((f) => f.id === activeFundId)?.mandate

  // Live impact on this fund's pipeline vs its baseline mandate.
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
    <>
      <TopBarA
        title="Mandate"
        breadcrumb={mandate.fundName}
        subtitle="Set the rules — every deal re-scores live. Each fund has its own mandate."
        action={
          <div style={{ display: 'flex', gap: 8 }}>
            <Btn variant="ghost" onClick={cloneActiveFund}>+ Clone fund</Btn>
            {dirty && <Btn variant="ghostCyan" onClick={() => seed && setMandate(seed)}>Reset</Btn>}
          </div>
        }
      />

      <div style={{ padding: '24px 32px', maxWidth: 1240, margin: '0 auto' }}>
        {/* Fund switcher */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 22 }}>
          {funds.map((f) => {
            const active = f.id === activeFundId
            return (
              <button
                key={f.id}
                onClick={() => setActiveFund(f.id)}
                style={{
                  display: 'inline-flex', alignItems: 'center', padding: '7px 14px', borderRadius: 6, fontSize: 13, fontWeight: 600,
                  fontFamily: FONT.sans, cursor: 'pointer', transition: 'all 0.15s',
                  background: active ? alpha(T.cyan, 0.13) : T.cardHi,
                  color: active ? T.cyan : T.mutedHi,
                  border: `1px solid ${active ? alpha(T.cyan, 0.4) : T.border}`,
                }}
              >
                {f.mandate.fundName}
              </button>
            )
          })}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: 18, alignItems: 'start' }}>
          {/* ── Editor ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <Card padding="20px 22px">
              <SectionTitle kicker="Configuration" title="Fund & strategy" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <TextField label="Fund name" value={mandate.fundName} onChange={(v) => set({ fundName: v })} />
                <Slider label="Fund size" value={mandate.fundSizeUSDm} unit="m" min={200} max={5000} step={100} fmt={usdm} onChange={(v) => set({ fundSizeUSDm: v })} hint="Drives the concentration cap below." />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
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
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <Slider label="Hold — min" value={mandate.holdYears[0]} unit="y" min={1} max={8} step={1} onChange={(v) => set({ holdYears: [v, mandate.holdYears[1]] })} />
                  <Slider label="Hold — max" value={mandate.holdYears[1]} unit="y" min={2} max={12} step={1} onChange={(v) => set({ holdYears: [mandate.holdYears[0], v] })} />
                </div>
              </div>
            </Card>

            <Card padding="20px 22px">
              <SectionTitle kicker="Economics" title="Return & ticket" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <Slider label="Return hurdle (gross IRR)" value={mandate.returnHurdlePct} unit="%" min={5} max={40} step={1} onChange={(v) => set({ returnHurdlePct: v })} hint="Every deal's IRR is judged against this." />
                <Slider label="Public-markets reference" value={mandate.publicReferencePct} unit="%" min={5} max={30} step={1} onChange={(v) => set({ publicReferencePct: v })} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <Slider label="Ticket — min" value={mandate.ticketBandUSDm[0]} unit="m" min={5} max={100} step={5} fmt={usdm} onChange={(v) => set({ ticketBandUSDm: [v, mandate.ticketBandUSDm[1]] })} />
                  <Slider label="Ticket — max" value={mandate.ticketBandUSDm[1]} unit="m" min={50} max={500} step={10} fmt={usdm} onChange={(v) => set({ ticketBandUSDm: [mandate.ticketBandUSDm[0], v] })} />
                </div>
                <Slider label="Concentration cap (% of fund / deal)" value={mandate.concentrationCapPct} unit="%" min={2} max={25} step={1} onChange={(v) => set({ concentrationCapPct: v })} hint={`Max single ticket: ${usdm(impact.maxTicket)}`} />
              </div>
            </Card>

            <Card padding="20px 22px">
              <SectionTitle kicker="Priority sectors carry a ★" title="Target sectors" />
              <SectorEditor sectors={mandate.targetSectors} onChange={(targetSectors) => set({ targetSectors })} />
            </Card>

            <Card padding="20px 22px">
              <SectionTitle kicker="Coverage" title="Geographies" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <ChipGroup label="Core" tone={T.green} items={mandate.coreGeographies} onChange={(coreGeographies) => set({ coreGeographies })} />
                <ChipGroup label="Flagged (extra screening)" tone={T.amber} items={mandate.flaggedGeographies} onChange={(flaggedGeographies) => set({ flaggedGeographies })} />
                <ChipGroup label="Excluded (red line)" tone={T.red} items={mandate.excludedGeographies} onChange={(excludedGeographies) => set({ excludedGeographies })} />
              </div>
            </Card>

            <Card padding="20px 22px" accent={T.red}>
              <SectionTitle kicker="Eligibility" title="Stages, instruments & red lines" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <ChipGroup label="Permitted stages" tone={T.cyan} items={mandate.stages} onChange={(stages) => set({ stages })} />
                <ChipGroup label="Permitted instruments" tone={T.cyan} items={mandate.instruments} onChange={(instruments) => set({ instruments })} />
                <ChipGroup label="Red lines (hard stops)" tone={T.red} items={mandate.redLines} onChange={(redLines) => set({ redLines })} />
              </div>
            </Card>
          </div>

          {/* ── Live impact ── */}
          <div style={{ position: 'sticky', top: 20, display: 'flex', flexDirection: 'column', gap: 18 }}>
            <Card padding="20px 22px" accent={T.cyan}>
              <SectionTitle kicker="Live" title="Impact on pipeline" />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                <Stat label="Avg composite" value={`${impact.avgComposite}`} color={scoreColor(impact.avgComposite)} />
                <Stat label="Red-line breach" value={`${impact.redLine}`} color={impact.redLine ? T.red : T.text} />
                <Stat label="Over cap" value={`${impact.overConc}`} color={impact.overConc ? T.amber : T.text} />
              </div>
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${T.border}` }}>
                <Mono>Max single ticket</Mono>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 6 }}>
                  <span style={{ fontFamily: FONT.serif, fontSize: 24, fontWeight: 700, color: T.cyan, letterSpacing: -0.5 }}>{usdm(impact.maxTicket)}</span>
                  <span style={{ fontSize: 11, color: T.muted, fontStyle: 'italic' }}>{mandate.concentrationCapPct}% of {usdm(mandate.fundSizeUSDm)}</span>
                </div>
              </div>
            </Card>

            <Card padding="20px 22px">
              <SectionTitle kicker="Re-score" title="Composite shift vs default" />
              {impact.changed.length === 0 ? (
                <p style={{ fontSize: 13, color: T.muted, margin: 0, lineHeight: 1.5 }}>No material score change from this fund's baseline mandate.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {impact.changed.map((c) => (
                    <div key={c.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                      <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 13, color: T.mutedHi }}>{c.name}</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0, fontFamily: FONT.mono, fontSize: 12 }}>
                        <span style={{ color: T.muted }}>{c.from}</span>
                        <span style={{ color: T.muted }}>→</span>
                        <span style={{ fontWeight: 700, color: c.to >= c.from ? T.green : T.red }}>{c.to}</span>
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}

// ── Sidebar stat tile ──
function Stat({ label, value, color = T.text }: { label: string; value: string; color?: string }) {
  return (
    <div style={{ background: T.cardHi, borderRadius: 8, padding: '12px 14px', border: `1px solid ${T.border}` }}>
      <Mono style={{ fontSize: 9 }}>{label}</Mono>
      <div style={{ fontFamily: FONT.serif, fontSize: 22, fontWeight: 700, color, marginTop: 4, letterSpacing: -0.5 }}>{value}</div>
    </div>
  )
}

// ── Form controls (Version A skin) ──
function TextField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <Mono style={{ marginBottom: 8 }}>{label}</Mono>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: '100%', boxSizing: 'border-box', background: T.cardHi, color: T.text, border: `1px solid ${T.border}`, borderRadius: 6, padding: '9px 12px', fontSize: 13, fontFamily: FONT.sans, outline: 'none' }}
        onFocus={(e) => { e.currentTarget.style.borderColor = T.cyan }}
        onBlur={(e) => { e.currentTarget.style.borderColor = T.border }}
      />
    </div>
  )
}

function Slider({
  label, value, unit, min, max, step, onChange, hint, fmt,
}: {
  label: string; value: number; unit: string; min: number; max: number; step: number; onChange: (v: number) => void; hint?: string; fmt?: (v: number) => string
}) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
        <span style={{ fontSize: 13, color: T.mutedHi }}>{label}</span>
        <span style={{ fontFamily: FONT.mono, fontSize: 13, fontWeight: 700, color: T.cyan }}>{fmt ? fmt(value) : `${value}${unit}`}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{ width: '100%', marginTop: 10, accentColor: T.cyan, cursor: 'pointer' }}
      />
      {hint && <div style={{ marginTop: 4, fontSize: 11, color: T.muted, fontStyle: 'italic' }}>{hint}</div>}
    </div>
  )
}

function Select({ label, value, options, onChange, hint }: { label: string; value: string; options: string[]; onChange: (v: string) => void; hint?: string }) {
  return (
    <div>
      <Mono style={{ marginBottom: 8 }}>{label}</Mono>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: '100%', boxSizing: 'border-box', background: T.cardHi, color: T.text, border: `1px solid ${T.border}`, borderRadius: 6, padding: '9px 12px', fontSize: 13, fontFamily: FONT.sans, textTransform: 'capitalize', outline: 'none', cursor: 'pointer' }}
      >
        {options.map((o) => (
          <option key={o} value={o} style={{ background: T.card, textTransform: 'capitalize' }}>
            {o.replace('-', ' ')}
          </option>
        ))}
      </select>
      {hint && <div style={{ marginTop: 4, fontSize: 11, color: T.muted, fontStyle: 'italic' }}>{hint}</div>}
    </div>
  )
}

function Toggle({ label, value, onChange, hint }: { label: string; value: boolean; onChange: (v: boolean) => void; hint?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
      <div>
        <div style={{ fontSize: 13, color: T.mutedHi }}>{label}</div>
        {hint && <div style={{ marginTop: 2, fontSize: 11, color: T.muted, fontStyle: 'italic' }}>{hint}</div>}
      </div>
      <button
        onClick={() => onChange(!value)}
        style={{
          position: 'relative', width: 42, height: 24, flexShrink: 0, borderRadius: 12, border: 'none', cursor: 'pointer',
          background: value ? T.cyan : T.border, transition: 'background 0.15s',
        }}
        aria-pressed={value}
      >
        <span style={{ position: 'absolute', top: 2, left: value ? 20 : 2, width: 20, height: 20, borderRadius: '50%', background: '#FFFFFF', transition: 'left 0.15s' }} />
      </button>
    </div>
  )
}

function ChipGroup({
  label, items, onChange, tone = T.cyan,
}: {
  label: string; items: string[]; onChange: (items: string[]) => void; tone?: string
}) {
  const [v, setV] = useState('')
  const add = () => {
    const t = v.trim()
    if (t && !items.includes(t)) onChange([...items, t])
    setV('')
  }
  return (
    <div>
      <Mono color={tone} style={{ marginBottom: 8, fontSize: 9 }}>{label}</Mono>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6 }}>
        {items.map((it) => (
          <span key={it} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 9px', borderRadius: 4, fontSize: 12, fontWeight: 500, fontFamily: FONT.sans, background: alpha(tone, 0.13), color: tone, border: `1px solid ${alpha(tone, 0.33)}` }}>
            {it}
            <button onClick={() => onChange(items.filter((x) => x !== it))} style={{ background: 'transparent', border: 'none', color: tone, fontSize: 12, lineHeight: 1, cursor: 'pointer', opacity: 0.7, padding: 0 }}>×</button>
          </span>
        ))}
        <input
          value={v}
          onChange={(e) => setV(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') add() }}
          placeholder="+ add"
          style={{ width: 84, background: T.cardHi, color: T.text, border: `1px solid ${T.border}`, borderRadius: 4, padding: '4px 8px', fontSize: 12, fontFamily: FONT.sans, outline: 'none' }}
          onFocus={(e) => { e.currentTarget.style.borderColor = T.cyan }}
          onBlur={(e) => { e.currentTarget.style.borderColor = T.border }}
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
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6 }}>
      {sectors.map((s) => {
        const tone = s.priority ? T.cyan : T.mutedHi
        return (
          <span key={s.name} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 9px', borderRadius: 4, fontSize: 12, fontWeight: 500, fontFamily: FONT.sans, background: s.priority ? alpha(T.cyan, 0.13) : T.cardHi, color: tone, border: `1px solid ${s.priority ? alpha(T.cyan, 0.33) : T.border}` }}>
            <button
              onClick={() => onChange(sectors.map((x) => (x.name === s.name ? { ...x, priority: !x.priority } : x)))}
              title="Toggle priority"
              style={{ background: 'transparent', border: 'none', color: s.priority ? T.cyan : T.muted, fontSize: 12, lineHeight: 1, cursor: 'pointer', padding: 0 }}
            >
              {s.priority ? '★' : '☆'}
            </button>
            {s.name}
            <button onClick={() => onChange(sectors.filter((x) => x.name !== s.name))} style={{ background: 'transparent', border: 'none', color: tone, fontSize: 12, lineHeight: 1, cursor: 'pointer', opacity: 0.7, padding: 0 }}>×</button>
          </span>
        )
      })}
      <input
        value={v}
        onChange={(e) => setV(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') add() }}
        placeholder="+ add"
        style={{ width: 84, background: T.cardHi, color: T.text, border: `1px solid ${T.border}`, borderRadius: 4, padding: '4px 8px', fontSize: 12, fontFamily: FONT.sans, outline: 'none' }}
        onFocus={(e) => { e.currentTarget.style.borderColor = T.cyan }}
        onBlur={(e) => { e.currentTarget.style.borderColor = T.border }}
      />
    </div>
  )
}
