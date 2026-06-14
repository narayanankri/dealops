import { Card, ScoreChip, SectionTitle, Stat, TrustTag, Button, Pill } from '@/components/ui'
import { CapTable, PnLTable, RadarChart, RadarLegend, RangeBar, type RadarDatum } from '@/components/deal/viz'
import { mult, signedPct, usdm } from '@/lib/format'
import { cn } from '@/lib/cn'
import { useApp } from '@/lib/store'
import { projectModel } from '@/engine/model'
import { compsEquityFrom } from '@/engine'
import { useState } from 'react'
import type { Analysis, BusinessVitals, Deal, Mandate, OperatingMetric, ProjectedModel, RevenueLine, Returns, SensitivityGrid, ValuationAssumptions } from '@/types'

const trendGlyph = { up: '▲', down: '▼', flat: '—' } as const
const trendTone = { up: 'text-pos', down: 'text-neg', flat: 'text-ink-3' } as const

// Parse the varied human date strings ("Oct 2025", "Q4 2025", "FY2025", "Apr 2026", "2023")
// into a sortable year*100+month key so news can be ordered newest-first.
const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
function newsKey(d: string): number {
  const s = d.toLowerCase()
  const y4 = s.match(/(20\d{2})/)
  const fy = s.match(/fy\s?'?(\d{2,4})/)
  let year = 0
  if (y4) year = +y4[1]
  else if (fy) year = +fy[1] < 100 ? 2000 + +fy[1] : +fy[1]
  let month = 6
  const mi = MONTHS.findIndex((m) => s.includes(m))
  const q = s.match(/q([1-4])/)
  if (mi >= 0) month = mi + 1
  else if (q) month = +q[1] * 3
  else if (s.includes('fy')) month = 12
  return year * 100 + month
}

// short axis labels for the radar (full labels stay in the detail lists)
const shortLabel: Record<string, string> = {
  market: 'Market',
  model: 'Model',
  financial: 'Financial',
  moat: 'Moat',
  team: 'Team',
  valuation: 'Valuation',
  exit: 'Exit',
  sector: 'Sector',
  geo: 'Geography',
  ticket: 'Ticket',
  stage: 'Stage',
  instrument: 'Instrument',
  return: 'Return',
  concentration: 'Concen.',
}
const scoreToTone = (s: number): RadarDatum['tone'] => (s >= 70 ? 'pos' : s >= 50 ? 'warn' : 'neg')
const statusToTone = (s: 'pass' | 'soft' | 'breach'): RadarDatum['tone'] => (s === 'pass' ? 'pos' : s === 'soft' ? 'warn' : 'neg')

// ─────────────────────────── Overview (§7.1) ───────────────────────────
export function OverviewTab({ deal, a }: { deal: Deal; a: Analysis }) {
  const n = deal.narrative
  const news = [...deal.news].sort((x, y) => newsKey(y.date) - newsKey(x.date))
  const metrics = deal.headlineMetrics.filter((m) => !/founded|headquarter|^hq$/i.test(m.label))
  return (
    <div className="space-y-5">
      <WhyNowBanner deal={deal} />
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-5">
        <Card className="px-6 py-5">
          <SectionTitle>Company</SectionTitle>
          <p className="text-[15px] leading-relaxed text-ink-2">{n.profile}</p>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Block title="Market read">{n.marketRead}</Block>
            <Block title="Regulatory standing">{n.regulatory}</Block>
          </div>
        </Card>

        <Card className="px-6 py-5">
          <SectionTitle>Headline metrics</SectionTitle>
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
            {metrics.map((m) => (
              <div key={m.label}>
                <div className="text-[11px] tracking-wide text-ink-3 uppercase">{m.label}</div>
                <div className="mt-0.5 flex items-baseline gap-1.5">
                  <span className="text-lg font-semibold text-ink tnum">{m.value}</span>
                  {m.trend && <span className={cn('text-xs', trendTone[m.trend])}>{trendGlyph[m.trend]}</span>}
                </div>
                <div className="mt-0.5 flex items-center gap-2">
                  <TrustTag basis={m.basis} />
                  <Cite source={m.source} url={m.url} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {deal.vitals && <BusinessVitalsCard vitals={deal.vitals} />}

        <Card className="px-6 py-5">
          <SectionTitle hint="by line · share of revenue">Revenue model</SectionTitle>
          {n.revenueLines?.length ? <RevenueLines lines={n.revenueLines} /> : <p className="text-sm leading-relaxed text-ink-2">{n.revenueModel}</p>}
        </Card>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Card className="px-6 py-5">
            <SectionTitle>The case for</SectionTitle>
            <ul className="space-y-2.5 text-sm text-ink-2">
              {n.caseFor.map((c, i) => (
                <li key={i} className="flex gap-2 leading-relaxed">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-pos" />
                  {c}
                </li>
              ))}
            </ul>
          </Card>
          <Card className="px-6 py-5">
            <SectionTitle>The case against</SectionTitle>
            <ul className="space-y-2.5 text-sm text-ink-2">
              {n.caseAgainst.map((c, i) => (
                <li key={i} className="flex gap-2 leading-relaxed">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-neg" />
                  {c}
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {n.barriers?.length ? <BarriersCard barriers={n.barriers} /> : null}

        <Card className="px-6 py-5">
          <SectionTitle>Recent news & events</SectionTitle>
          <ul className="space-y-2.5">
            {news.map((ev, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="w-16 shrink-0 text-ink-3 tnum">{ev.date}</span>
                <span className="text-ink-2">{ev.headline}</span>
                <span className="ml-auto shrink-0">
                  <Cite source={ev.source} url={ev.url} />
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="space-y-5">
        <ValuationSnapshot deal={deal} />
        {deal.shariaScreen && <ShariaCard screen={deal.shariaScreen} />}
        <DataTrustCard deal={deal} a={a} />
      </div>
      </div>
    </div>
  )
}

// The proposal + catalyst, surfaced at the top of Overview — what the IC reader wants first.
function WhyNowBanner({ deal }: { deal: Deal }) {
  const own = (deal.ticketUSDm / deal.ask.askValuationUSDm) * 100
  const last = deal.roundHistory?.[0]
  const lastBit = last?.postMoneyUSDm != null ? ` · vs ${usdm(last.postMoneyUSDm)} ${last.series}` : deal.ask.lastRoundUSDm != null ? ` · vs ${usdm(deal.ask.lastRoundUSDm)} prior` : ''
  return (
    <Card className="border-accent/25 bg-accent-bg/15 px-6 py-4">
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm">
        <span className="text-[11px] font-semibold tracking-wide text-accent-2 uppercase">The proposal</span>
        <span className="text-ink-2">
          {usdm(deal.ticketUSDm)} {deal.instrument.toLowerCase()} for ~{own.toFixed(1)}% of {deal.name} at {usdm(deal.ask.askValuationUSDm)}
          {deal.ask.series ? ` ${deal.ask.series}` : ''}
          {lastBit}
        </span>
      </div>
      {deal.narrative.whyNow && (
        <p className="mt-2 text-sm leading-relaxed text-ink-2">
          <span className="font-medium text-ink">Why now. </span>
          {deal.narrative.whyNow}
        </p>
      )}
    </Card>
  )
}

// Sector-adaptive entry barriers — strength ticks (height of the wall, not good/bad) + a note.
function BarriersCard({ barriers }: { barriers: NonNullable<Deal['narrative']['barriers']> }) {
  const lvl = { high: 3, medium: 2, low: 1 } as const
  return (
    <Card className="px-6 py-5">
      <SectionTitle hint="height of the wall protecting the position">Entry barriers &amp; moat</SectionTitle>
      <div className="space-y-3.5">
        {barriers.map((b) => (
          <div key={b.axis} className="flex items-start gap-3">
            <div className="flex shrink-0 items-end gap-0.5 pt-0.5" title={`${b.rating} barrier`}>
              {[0, 1, 2].map((i) => (
                <span key={i} className={cn('w-1 rounded-sm', i < lvl[b.rating] ? 'bg-accent' : 'bg-panel-3', i === 0 ? 'h-2' : i === 1 ? 'h-3' : 'h-4')} />
              ))}
            </div>
            <div className="min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-medium text-ink">{b.axis}</span>
                <span className="text-[10px] tracking-wide text-ink-3 uppercase">{b.rating}</span>
              </div>
              <p className="mt-0.5 text-sm leading-relaxed text-ink-3">{b.note}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

const shariaMeta = {
  compliant: { label: 'Shariah-compliant', dot: 'bg-pos', text: 'text-pos', bg: 'bg-pos-bg/50' },
  'non-compliant': { label: 'Non-compliant', dot: 'bg-neg', text: 'text-neg', bg: 'bg-neg-bg/50' },
  mixed: { label: 'Mixed', dot: 'bg-warn', text: 'text-warn', bg: 'bg-warn-bg/50' },
  'n/a': { label: 'Not screened', dot: 'bg-ink-3', text: 'text-ink-3', bg: 'bg-panel-2' },
} as const

function ShariaCard({ screen }: { screen: NonNullable<Deal['shariaScreen']> }) {
  const m = shariaMeta[screen.status]
  return (
    <Card className="px-6 py-5">
      <SectionTitle hint="GCC/MENA mandate screen">Shariah screen</SectionTitle>
      <div className={cn('mb-2.5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium', m.bg, m.text)}>
        <span className={cn('h-1.5 w-1.5 rounded-full', m.dot)} />
        {m.label}
      </div>
      <p className="text-sm leading-relaxed text-ink-3">{screen.note}</p>
      {(screen.source || screen.url) && (
        <div className="mt-1.5">
          <Cite source={screen.source} url={screen.url} />
        </div>
      )}
    </Card>
  )
}

function BusinessVitalsCard({ vitals }: { vitals: BusinessVitals }) {
  const items: { k: string; v: BusinessVitals['size'] }[] = [
    { k: 'Size', v: vitals.size },
    { k: 'Growth', v: vitals.growth },
    { k: 'Unit economics', v: vitals.unitEconomics },
    { k: 'Quality', v: vitals.quality },
  ]
  return (
    <Card className="px-6 py-5">
      <SectionTitle hint="size · growth · unit economics · quality">Business vitals</SectionTitle>
      <div className="divide-y divide-line-soft/50">
        {items.map(({ k, v }) => {
          const nd = /not disclosed|n\/d/i.test(v.value)
          return (
            <div key={k} className="py-3.5 first:pt-1 last:pb-0">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-[11px] font-semibold tracking-wide text-ink-2 uppercase">{k}</div>
                  <div className="mt-0.5 text-[11px] text-ink-3">{v.label}</div>
                </div>
                <div className="flex shrink-0 flex-col items-end">
                  <div className="flex items-baseline gap-1.5">
                    <span className={cn('font-semibold tnum leading-none', nd ? 'text-sm text-ink-3 italic' : 'text-xl text-ink')}>{v.value}</span>
                    {v.trend && !nd && <span className={cn('text-sm', trendTone[v.trend])}>{trendGlyph[v.trend]}</span>}
                  </div>
                  {!nd && (
                    <div className="mt-1.5 flex items-center gap-2">
                      <TrustTag basis={v.basis} />
                      <Cite source={v.source} url={v.url} />
                    </div>
                  )}
                </div>
              </div>
              {v.note && <p className="mt-2 text-[11px] leading-relaxed text-ink-3">{v.note}</p>}
            </div>
          )
        })}
      </div>
    </Card>
  )
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1 text-[11px] font-medium tracking-wide text-ink-3 uppercase">{title}</div>
      <p className="text-sm leading-relaxed text-ink-2">{children}</p>
    </div>
  )
}

function Cite({ source, url }: { source?: string; url?: string }) {
  if (!source && !url) return null
  if (url)
    return (
      <a href={url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="text-[10px] font-medium text-accent-2/80 hover:text-accent-2 hover:underline">
        {source ?? 'source'} ↗
      </a>
    )
  return <span className="text-[10px] text-ink-3">{source}</span>
}

function RevenueLines({ lines }: { lines: RevenueLine[] }) {
  return (
    <div className="space-y-3.5">
      {lines.map((l) => (
        <div key={l.name}>
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-sm font-medium text-ink">{l.name}</span>
            <span className="flex items-center gap-2">
              {l.sharePct != null && <span className="text-xs text-ink-3 tnum">~{l.sharePct}% of rev</span>}
              <TrustTag basis={l.basis} />
              <Cite source={l.source} url={l.url} />
            </span>
          </div>
          {l.sharePct != null && (
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-panel-3">
              <div className="h-full rounded-full bg-accent" style={{ width: `${Math.max(2, l.sharePct)}%` }} />
            </div>
          )}
          <p className="mt-1.5 text-sm leading-relaxed text-ink-3">{l.description}</p>
        </div>
      ))}
    </div>
  )
}

function ValuationSnapshot({ deal }: { deal: Deal }) {
  const asm = deal.assumptions
  const last = deal.roundHistory?.[0]
  const currentVal = deal.currentValuationUSDm ?? deal.ask.askValuationUSDm
  const impliedEVRev = (currentVal + asm.netDebtUSDm) / asm.baseRevenueUSDm
  const Row = ({ label, value, sub }: { label: string; value: string; sub?: string }) => (
    <div className="flex items-baseline justify-between gap-3 border-b border-line-soft/40 py-2 last:border-0">
      <span className="text-sm text-ink-3">{label}</span>
      <span className="text-right">
        <span className="font-semibold text-ink tnum">{value}</span>
        {sub && <span className="block text-[11px] text-ink-3">{sub}</span>}
      </span>
    </div>
  )
  const askAmt = deal.ask.raisingUSDm
  return (
    <Card className="px-6 py-5">
      <SectionTitle>Fundraising</SectionTitle>
      <div>
        <Row
          label="Current ask"
          value={askAmt ? `${usdm(askAmt)} at ${usdm(deal.ask.askValuationUSDm)}` : usdm(deal.ask.askValuationUSDm)}
          sub={[deal.ask.series, askAmt ? 'post-money' : 'implied valuation'].filter(Boolean).join(' · ')}
        />
        {last ? (
          <Row
            label="Last round"
            value={
              last.raisedUSDm != null && last.postMoneyUSDm != null
                ? `${usdm(last.raisedUSDm)} at ${usdm(last.postMoneyUSDm)}`
                : last.postMoneyUSDm != null
                  ? usdm(last.postMoneyUSDm)
                  : last.raisedUSDm != null
                    ? usdm(last.raisedUSDm)
                    : 'n/d'
            }
            sub={[last.series, last.postMoneyUSDm != null ? 'post-money' : null, last.date].filter(Boolean).join(' · ')}
          />
        ) : (
          deal.ask.lastRoundUSDm != null && <Row label="Last round" value={usdm(deal.ask.lastRoundUSDm)} sub={deal.ask.lastRoundDate} />
        )}
        {deal.currentValuationUSDm != null && (
          <Row
            label="Current valuation"
            value={usdm(deal.currentValuationUSDm)}
            sub={deal.currentValuationUSDm === deal.ask.askValuationUSDm ? 'latest mark = the ask' : 'latest mark'}
          />
        )}
        {deal.totalRaisedUSDm != null && <Row label="Total raised to date" value={usdm(deal.totalRaisedUSDm)} />}
        <Row label="Implied EV / Revenue" value={mult(impliedEVRev)} />
      </div>
    </Card>
  )
}

const basisToneText = { stated: 'text-pos', inferred: 'text-warn', estimated: 'text-neg' } as const

function DataTrustCard({ deal, a }: { deal: Deal; a: Analysis }) {
  const tone = a.dataTrustScore >= 70 ? 'text-pos' : a.dataTrustScore >= 55 ? 'text-warn' : 'text-neg'
  return (
    <Card className="px-6 py-5">
      <SectionTitle hint="source · basis">Data trust</SectionTitle>
      <div className="mb-3 flex items-baseline gap-2">
        <span className={cn('text-3xl font-semibold tnum', tone)}>{a.dataTrustScore}</span>
        <span className="text-sm text-ink-3">/ 100</span>
      </div>
      <p className="mb-4 text-xs leading-relaxed text-ink-3">
        The share of this deal that is disclosed fact versus estimate. Each field carries its source, or — where estimated — its derivation.
      </p>
      <div className="space-y-2.5">
        {deal.dataTrust.fields.map((f) => (
          <div key={f.label} className="border-b border-line-soft/40 pb-2.5 last:border-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm text-ink-2">{f.label}</span>
              <TrustTag basis={f.basis} confidence={f.confidence} />
            </div>
            {f.url ? (
              <Cite source={f.source ?? 'source'} url={f.url} />
            ) : f.method ? (
              <p className="mt-0.5 text-[11px] leading-relaxed text-ink-3">
                <span className={cn('font-medium', basisToneText[f.basis])}>{f.basis === 'estimated' ? 'Estimated: ' : 'Inferred: '}</span>
                {f.method}
              </p>
            ) : f.source ? (
              <span className="text-[10px] text-ink-3">{f.source}</span>
            ) : null}
          </div>
        ))}
      </div>
    </Card>
  )
}

// ─────────────────────────── Mandate Fit (§7.2) ───────────────────────────
export function MandateTab({ deal, a }: { deal: Deal; a: Analysis }) {
  const { activeFund } = useApp()
  const m = activeFund.mandate
  const fit = a.mandateFit
  const conc = fit.concentration
  const dot = (s: string) => (s === 'pass' ? 'bg-pos' : s === 'soft' ? 'bg-warn' : 'bg-neg')
  const radar: RadarDatum[] = fit.dimensions.map((d) => ({ label: shortLabel[d.key] ?? d.label, value: d.score, tone: statusToTone(d.status) }))
  const hardKeys = ['sector', 'geo', 'stage', 'instrument']
  const gates = fit.dimensions.filter((d) => hardKeys.includes(d.key))
  const graded = fit.dimensions.filter((d) => !hardKeys.includes(d.key))
  const DimRow = ({ d }: { d: Analysis['mandateFit']['dimensions'][number] }) => (
    <div className="py-3 first:pt-0">
      <div className="flex items-center gap-2.5">
        <span className={cn('h-2 w-2 shrink-0 rounded-full', dot(d.status))} />
        <span className="text-[15px] font-medium text-ink">{d.label}</span>
        <ScoreChip score={d.score} size="sm" />
        {d.status === 'breach' && <Pill tone="neg">breach</Pill>}
        {d.status === 'soft' && <Pill tone="warn">confirm</Pill>}
      </div>
      <p className="mt-1 pl-[18px] text-sm leading-relaxed text-ink-2">{d.takeaway}</p>
    </div>
  )
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-5">
        {fit.redLineBreaches.length > 0 && (
          <Card className="border-neg/40 bg-neg-bg/30 px-6 py-5">
            <div className="text-sm font-semibold text-neg">Red-line breach — hard stop</div>
            <ul className="mt-2 space-y-1 text-sm text-ink-2">
              {fit.redLineBreaches.map((b, i) => (
                <li key={i}>• {b}</li>
              ))}
            </ul>
          </Card>
        )}

        {/* Assessment — synthesized narrative */}
        <Card className="px-6 py-5">
          <div className="mb-3 flex items-baseline gap-3">
            <span className="text-[11px] font-semibold tracking-wide text-ink-3 uppercase">Assessment</span>
            <span className="ml-auto flex items-baseline gap-1.5">
              <span className={cn('text-2xl font-semibold tnum', fit.score >= 70 ? 'text-pos' : fit.score >= 50 ? 'text-warn' : 'text-neg')}>{fit.score}</span>
              <span className="text-[11px] text-ink-3">/ 100 fit</span>
            </span>
          </div>
          <p className="text-[15px] leading-relaxed text-ink-2">{fit.narrative}</p>
        </Card>

        {/* Dimensions grouped: hard eligibility gates vs graded fit */}
        <Card className="px-6 py-5">
          <div className="mb-1 flex items-baseline justify-between">
            <span className="text-[11px] font-semibold tracking-wide text-ink-3 uppercase">Eligibility gates</span>
            <span className="text-[11px] text-ink-3">pass / breach</span>
          </div>
          <div className="divide-y divide-line-soft/50">{gates.map((d) => <DimRow key={d.key} d={d} />)}</div>
          <div className="mt-4 mb-1 flex items-baseline justify-between border-t border-line-soft/60 pt-4">
            <span className="text-[11px] font-semibold tracking-wide text-ink-3 uppercase">Graded fit</span>
            <span className="text-[11px] text-ink-3">scored 0–100</span>
          </div>
          <div className="divide-y divide-line-soft/50">{graded.map((d) => <DimRow key={d.key} d={d} />)}</div>
        </Card>
      </div>

      {/* right rail — radar + concentration + what it's judged against */}
      <div className="space-y-5">
        <Card className="px-5 py-4">
          <SectionTitle>Fit summary</SectionTitle>
          <RadarChart data={radar} />
          <RadarLegend
            items={[
              { color: 'pos', label: 'In mandate' },
              { color: 'warn', label: 'Soft' },
              { color: 'neg', label: 'Breach' },
            ]}
          />
        </Card>
        <Card className={cn('px-5 py-4', !conc.fits || conc.pctOfFund >= conc.capPct - 1 ? 'border-warn/40' : '')}>
          <SectionTitle hint="ticket vs fund size">Concentration</SectionTitle>
          <Stat
            label="Ticket as % of fund"
            value={`${conc.pctOfFund}%`}
            tone={conc.fits ? (conc.pctOfFund >= conc.capPct - 1 ? 'warn' : 'pos') : 'neg'}
            sub={`cap ${conc.capPct}% · max ticket ${usdm(conc.capUSDm)}`}
          />
          <p className="mt-3 text-sm leading-relaxed text-ink-2">{conc.takeaway}</p>
        </Card>
        <MandateSnapshot m={m} />
      </div>

      <div className="lg:col-span-3">
        <FitAcrossFunds deal={deal} />
      </div>
    </div>
  )
}

function MandateSnapshot({ m }: { m: Mandate }) {
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
  const priority = m.targetSectors.filter((s) => s.priority).map((s) => s.name)
  const rows: [string, string][] = [
    ['Strategy', `${cap(m.strategyArchetype.replace('-', ' '))} · ${m.controlPosture.replace('-', ' ')}`],
    ['Priority sectors', priority.join(', ') || '—'],
    ['Core geographies', m.coreGeographies.join(', ')],
    ['Stages', m.stages.join(', ')],
    ['Ticket band', `${usdm(m.ticketBandUSDm[0])}–${usdm(m.ticketBandUSDm[1])}`],
    ['Return hurdle', `${m.returnHurdlePct}% IRR`],
    ['Concentration cap', `${m.concentrationCapPct}% of fund`],
  ]
  return (
    <Card className="px-5 py-4">
      <SectionTitle hint="the fund's rules">Judged against</SectionTitle>
      <div className="space-y-2">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-baseline justify-between gap-3 border-b border-line-soft/30 py-1 last:border-0">
            <span className="shrink-0 text-xs text-ink-3">{k}</span>
            <span className="text-right text-xs font-medium text-ink-2">{v}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}

function FitAcrossFunds({ deal }: { deal: Deal }) {
  const { funds, activeFundId, analyzeUnder } = useApp()
  if (funds.length < 2) return null
  return (
    <Card className="px-6 py-5">
      <SectionTitle hint="same asset, underwritten by each mandate">Fit across funds</SectionTitle>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-line/70 text-left text-[11px] font-medium tracking-wide text-ink-3 uppercase">
            <th className="py-2 pr-3 font-medium">Fund</th>
            <th className="py-2 px-3 text-center font-medium">Composite</th>
            <th className="py-2 px-3 text-center font-medium">Mandate</th>
            <th className="py-2 px-3 text-right font-medium">Base IRR vs hurdle</th>
            <th className="py-2 px-3 text-right font-medium">Concentration</th>
          </tr>
        </thead>
        <tbody>
          {funds.map((f) => {
            const fa = analyzeUnder(deal, f)
            const base = fa.returns.scenarios.find((s) => s.name === 'base')!
            const conc = fa.mandateFit.concentration
            const active = f.id === activeFundId
            return (
              <tr key={f.id} className={cn('border-b border-line-soft/50 last:border-0', active && 'bg-accent-bg/25')}>
                <td className="py-3 pr-3">
                  <div className="flex items-center gap-1.5 font-medium text-ink">
                    {active && <span className="h-1.5 w-1.5 rounded-full bg-accent" />}
                    {f.mandate.fundName}
                  </div>
                  <div className="text-xs text-ink-3 capitalize">
                    {f.mandate.strategyArchetype.replace('-', ' ')} · {usdm(f.mandate.fundSizeUSDm)} · {f.mandate.returnHurdlePct}% hurdle
                  </div>
                </td>
                <td className="py-3 px-3 text-center">
                  <ScoreChip score={fa.composite} size="sm" />
                </td>
                <td className="py-3 px-3 text-center">
                  <ScoreChip score={fa.mandateFit.score} size="sm" />
                </td>
                <td className="py-3 px-3 text-right tnum">
                  <span className={base.clearsHurdle ? 'text-pos' : 'text-neg'}>{base.irrPct}%</span>
                  <span className="text-ink-3"> / {f.mandate.returnHurdlePct}%</span>
                </td>
                <td className="py-3 px-3 text-right tnum">
                  <span className={conc.fits ? 'text-ink-2' : 'text-warn'}>{conc.pctOfFund}%</span>
                  <span className="text-ink-3"> / {conc.capPct}%</span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <p className="mt-3 text-[11px] text-ink-3">
        The asset value is identical across funds — only the return model, the mandate gate, and the concentration test change with each fund’s strategy.
      </p>
    </Card>
  )
}

// ─────────────────────────── Standalone Merit (§7.3) ───────────────────────────
export function MeritTab({ deal, a }: { deal: Deal; a: Analysis }) {
  const n = deal.narrative
  const confTone = { high: 'pos', medium: 'warn', low: 'neg' } as const
  const radar: RadarDatum[] = deal.merit.map((m) => ({
    label: shortLabel[m.key] ?? m.label,
    value: m.score,
    tone: scoreToTone(m.score),
    dim: m.confidence === 'low',
  }))
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      {/* INFO FIRST — the dimension assessment leads, every reason visible */}
      <div className="lg:col-span-2 space-y-5">
        <Card className="px-6 py-5">
          <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-line-soft/60 pb-4">
            <Stat label="Standalone merit" value={a.meritScore} tone={a.meritScore >= 70 ? 'pos' : a.meritScore >= 50 ? 'warn' : 'neg'} sub={a.meritLabel} />
            <span className="ml-auto max-w-[280px] text-right text-xs text-ink-3">
              Strategy-agnostic — is this a good business <em>on its own</em>, independent of the fund.
            </span>
          </div>
          <div className="divide-y divide-line-soft/50">
            {deal.merit.map((m) => (
              <div key={m.key} className="py-3.5 first:pt-0">
                <div className="flex items-center gap-2.5">
                  <ScoreChip score={m.score} size="sm" />
                  <span className="text-[15px] font-medium text-ink">{m.label}</span>
                  <Pill tone={confTone[m.confidence]}>{m.confidence} confidence</Pill>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-2">{m.rationale}</p>
                {m.confidenceReason && (
                  <p className="mt-1.5 flex gap-1.5 text-xs leading-relaxed text-ink-3">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-warn" />
                    <span>
                      <span className="font-medium text-warn/90">Confidence held back: </span>
                      {m.confidenceReason}
                    </span>
                  </p>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Right rail — compact radar summary + leadership/ownership + legal */}
      <div className="space-y-5">
        <Card className="px-5 py-4">
          <SectionTitle>Merit summary</SectionTitle>
          <RadarChart data={radar} />
          <RadarLegend
            items={[
              { color: 'pos', label: 'Strong' },
              { color: 'warn', label: 'Moderate' },
              { color: 'neg', label: 'Weak' },
              { color: 'neg', label: 'Low conf.', dashed: true },
            ]}
          />
        </Card>

        <Card className="px-5 py-4">
          <SectionTitle>Leadership</SectionTitle>
          <ul className="space-y-2">
            {n.leadership.map((p, i) => (
              <li key={i} className="flex items-baseline justify-between gap-3">
                <span className="text-sm text-ink">{p.name}</span>
                <span className="shrink-0 text-xs text-ink-3">{p.role}</span>
              </li>
            ))}
          </ul>
          <p className="mt-2.5 border-t border-line-soft/60 pt-2.5 text-xs leading-relaxed text-ink-3">{n.leadershipGaps}</p>
        </Card>

        {deal.capTable && (
          <Card className="px-5 py-4">
            <SectionTitle>Ownership</SectionTitle>
            <CapTable rows={deal.capTable} />
          </Card>
        )}

        <Card className="px-5 py-4">
          <SectionTitle>Legal / sanctions</SectionTitle>
          <p className="text-sm leading-relaxed text-ink-2">{n.legalStanding}</p>
        </Card>
      </div>
    </div>
  )
}

// ─────────────────────────── Comparables (§7.4) ───────────────────────────
function AnchorPill({ label }: { label: string }) {
  return <span className="rounded bg-accent-bg px-1.5 py-0.5 text-[9px] font-semibold tracking-wide text-accent-2 uppercase">{label}</span>
}
function Step({ k, v, accent, strong }: { k: string; v: string; accent?: boolean; strong?: boolean }) {
  return (
    <span className="inline-flex flex-col leading-tight">
      <span className={cn('tnum font-semibold', accent ? 'text-accent-2' : 'text-ink', strong && 'text-base')}>{v}</span>
      <span className="text-[10px] text-ink-3">{k}</span>
    </span>
  )
}
function Op({ children }: { children: React.ReactNode }) {
  return <span className="px-1 text-ink-3">{children}</span>
}

export function CompsTab({ deal }: { deal: Deal; a: Analysis }) {
  const baseRev = deal.assumptions.baseRevenueUSDm
  const netDebt = deal.assumptions.netDebtUSDm
  const m0 = deal.assumptions.ebitdaMarginPct?.[0]
  const baseEbitda = m0 != null ? Math.round((baseRev * m0) / 100) : null

  // Peers carrying an EV/Revenue multiple form the comp set; the reader can include / exclude
  // any of them and watch the implied range recompute (mirrors the engine's compsEquity).
  const revPeers = deal.peers.filter((p) => p.evRevenue != null)
  const [excluded, setExcluded] = useState<Set<string>>(new Set())
  const included = revPeers.filter((p) => !excluded.has(p.name))
  const build = compsEquityFrom(included.map((p) => p.evRevenue as number), baseRev, netDebt)
  const enough = included.length >= 1

  const ask = deal.ask.askValuationUSDm
  const over = ask > build.mid
  const askVsMid = build.mid !== 0 ? Math.round((ask / build.mid - 1) * 100) : 0

  const nearest = (target: number): string | null =>
    included.reduce<{ name: string; d: number } | null>((best, p) => {
      const d = Math.abs((p.evRevenue as number) - target)
      return !best || d < best.d ? { name: p.name, d } : best
    }, null)?.name ?? null
  const aLow = nearest(build.p25), aMid = nearest(build.median), aHigh = nearest(build.p75)

  const toggle = (name: string) =>
    setExcluded((prev) => {
      const n = new Set(prev)
      if (n.has(name)) n.delete(name)
      else n.add(name)
      return n
    })

  const ebPeers = included.filter((p) => p.evEbitda != null)
  const ebBuild = baseEbitda && ebPeers.length >= 2 ? compsEquityFrom(ebPeers.map((p) => p.evEbitda as number), baseEbitda, netDebt) : null
  const evMid = Math.round(build.median * baseRev)
  const ndWord = netDebt >= 0 ? 'net debt' : 'net cash'

  return (
    <div className="space-y-5">
      {/* 1 — the range + ask */}
      <Card className="px-6 py-5">
        <SectionTitle hint="median peer multiple · ask marked against it">Valuation vs the market</SectionTitle>
        {enough ? (
          <>
            <RangeBar low={build.low} mid={build.mid} high={build.high} marker={{ value: ask, label: 'the ask' }} />
            <div className={cn('rounded-lg px-4 py-3', over ? 'bg-neg-bg/40' : 'bg-pos-bg/40')}>
              <span className={cn('text-base font-semibold tnum', over ? 'text-neg' : 'text-pos')}>{signedPct(askVsMid)}</span>{' '}
              <span className="text-sm text-ink-2">
                the ask ({usdm(ask)}) sits {over ? 'above' : 'below'} the median peer-implied equity value ({usdm(build.mid)})
                {over ? ' — a premium the current comp set does not support.' : ' — within the range the comp set supports.'}
              </span>
            </div>
          </>
        ) : (
          <p className="py-6 text-center text-sm text-ink-3">Select at least one peer below to build a comparables range.</p>
        )}
      </Card>

      {/* 2 — the arithmetic, made explicit */}
      {enough && (
        <Card className="px-6 py-5">
          <SectionTitle hint="every step — recomputed live as peers are included / excluded">How the comps value is built</SectionTitle>
          <div className="mb-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <span className="text-ink-3">EV/Revenue across {included.length} peer{included.length === 1 ? '' : 's'}:</span>
            <span className="text-ink-2">P25 <span className="font-semibold text-ink tnum">{mult(build.p25)}</span></span>
            <span className="text-ink-2">median <span className="font-semibold text-accent-2 tnum">{mult(build.median)}</span></span>
            <span className="text-ink-2">P75 <span className="font-semibold text-ink tnum">{mult(build.p75)}</span></span>
          </div>
          <div className="rounded-lg border border-line-soft/60 bg-panel-2/40 px-4 py-3.5">
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-2 text-sm">
              <Step k="median EV/Rev" v={mult(build.median)} accent />
              <Op>×</Op>
              <Step k="base revenue" v={usdm(baseRev)} />
              <Op>=</Op>
              <Step k="enterprise value" v={usdm(evMid)} />
              <Op>{netDebt >= 0 ? '−' : '+'}</Op>
              <Step k={ndWord} v={usdm(Math.abs(netDebt))} />
              <Op>=</Op>
              <Step k="equity value" v={usdm(build.mid)} accent strong />
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-1 border-t border-line-soft/50 pt-2.5 text-[13px] text-ink-2">
              <span>Range: <span className="tnum text-ink">{mult(build.p25)} → {usdm(build.low)}</span> <span className="text-ink-3">(low)</span></span>
              <span><span className="tnum text-ink">{mult(build.p75)} → {usdm(build.high)}</span> <span className="text-ink-3">(high)</span></span>
            </div>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-ink-3">
            The <span className="text-ink-2">median</span> peer multiple is the central estimate; the <span className="text-ink-2">P25–P75</span> band is the range. {netDebt >= 0 ? 'Net debt' : 'Net cash'} bridges enterprise value to equity. Base revenue is the latest-year base ({usdm(baseRev)}).
          </p>
          {ebBuild && (
            <p className="mt-2 text-xs leading-relaxed text-ink-3">
              EV/EBITDA cross-check: median <span className="tnum text-ink-2">{mult(ebBuild.median)}</span> × base EBITDA {usdm(baseEbitda!)} {netDebt >= 0 ? '−' : '+'} {ndWord} ⇒ <span className="tnum text-ink-2">{usdm(ebBuild.mid)}</span> equity ({ebPeers.length} peers with an EBITDA multiple).
            </p>
          )}
          <p className="mt-2 text-xs leading-relaxed text-ink-3">
            Method: a single company-wide EV/Revenue multiple applied to total revenue. A sum-of-the-parts build — segment-specific multiples for distinct business lines — is not applied to this deal.
          </p>
        </Card>
      )}

      {/* 3 — the interactive peer set */}
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between px-6 pt-5">
          <SectionTitle hint="toggle a peer to see the range recompute">Peer set</SectionTitle>
          <div className="flex items-center gap-3 text-xs text-ink-3">
            <span className="tnum">{included.length}/{revPeers.length} in set</span>
            {excluded.size > 0 && (
              <button onClick={() => setExcluded(new Set())} className="hover:text-accent-2">
                Reset
              </button>
            )}
          </div>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line/70 text-left text-[11px] font-medium tracking-wide text-ink-3 uppercase">
              <th className="px-6 py-2.5 font-medium">Peer</th>
              <th className="px-3 py-2.5 text-right font-medium">EV/Rev</th>
              <th className="px-3 py-2.5 text-right font-medium">EV/EBITDA</th>
              <th className="px-3 py-2.5 text-right font-medium">Growth</th>
              <th className="px-3 py-2.5 text-right font-medium">Margin</th>
              <th className="px-3 py-2.5 text-right font-medium">Implies</th>
              <th className="px-3 py-2.5 font-medium">Basis</th>
            </tr>
          </thead>
          <tbody>
            {deal.peers.map((p) => {
              const hasRev = p.evRevenue != null
              const off = hasRev && excluded.has(p.name)
              const implies = hasRev ? Math.round((p.evRevenue as number) * baseRev - netDebt) : null
              const anchor = off ? null : p.name === aMid ? 'median' : p.name === aLow ? 'P25' : p.name === aHigh ? 'P75' : null
              return (
                <tr key={p.name} className={cn('border-b border-line-soft/50 align-top last:border-0', off && 'opacity-40')}>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      {hasRev ? (
                        <button
                          onClick={() => toggle(p.name)}
                          role="checkbox"
                          aria-checked={!off}
                          title={off ? 'Add to comp set' : 'Remove from comp set'}
                          className={cn('grid h-4 w-4 shrink-0 place-items-center rounded border transition-colors', off ? 'border-line text-transparent' : 'border-accent bg-accent text-canvas')}
                        >
                          <span className="text-[10px] leading-none">✓</span>
                        </button>
                      ) : (
                        <span className="inline-block h-4 w-4 shrink-0" />
                      )}
                      <span className={cn('font-medium', off ? 'text-ink-3 line-through' : 'text-ink')}>{p.name}</span>
                      <Pill>{p.public ? 'Public' : 'Private'}</Pill>
                      {anchor && <AnchorPill label={anchor} />}
                    </div>
                    <div className="mt-0.5 max-w-md pl-6 text-xs text-ink-3">{p.rationale}</div>
                  </td>
                  <td className="px-3 py-3 text-right text-ink tnum">{p.evRevenue != null ? mult(p.evRevenue) : '—'}</td>
                  <td className="px-3 py-3 text-right text-ink-2 tnum">{p.evEbitda != null ? mult(p.evEbitda) : '—'}</td>
                  <td className="px-3 py-3 text-right text-ink-2 tnum">{p.revGrowthPct != null ? `${p.revGrowthPct}%` : '—'}</td>
                  <td className="px-3 py-3 text-right text-ink-2 tnum">{p.ebitdaMarginPct != null ? `${p.ebitdaMarginPct}%` : '—'}</td>
                  <td className="px-3 py-3 text-right tnum">{implies != null ? <span className={off ? 'text-ink-3' : 'text-ink-2'}>{usdm(implies)}</span> : <span className="text-ink-3">—</span>}</td>
                  <td className="px-3 py-3">
                    <TrustTag basis={p.basis} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <p className="px-6 py-3 text-xs leading-relaxed text-ink-3">
          <span className="font-medium text-ink-2">Implies</span> = that peer's EV/Revenue × base revenue ({usdm(baseRev)}) {netDebt >= 0 ? '−' : '+'} {ndWord} ({usdm(Math.abs(netDebt))}) — the equity value a single comp would imply. The range above uses the P25 / median / P75 of the included EV/Revenue multiples.
        </p>
      </Card>
    </div>
  )
}

// ─────────────────────────── Valuation & Scenarios (§7.5) ───────────────────────────
export function ValuationTab({ deal, a }: { deal: Deal; a: Analysis }) {
  const { updateAssumptions, resetDeal } = useApp()
  const av = a.assetValue
  const asm = deal.assumptions
  const set = (patch: Partial<ValuationAssumptions>) => updateAssumptions(deal.id, patch)
  const pm = projectModel(deal)

  return (
    <div className="space-y-5">
      {a.integrity.warnings.length > 0 && (
        <Card className={cn('px-5 py-4', a.integrity.blocking ? 'border-neg/40 bg-neg-bg/30' : 'border-warn/40 bg-warn-bg/30')}>
          <div className="flex items-center gap-2 text-sm font-semibold text-ink">
            <span className={cn('h-2 w-2 rounded-full', a.integrity.blocking ? 'bg-neg' : 'bg-warn')} />
            {a.integrity.blocking ? 'Output blocked — a coherence check is failing' : 'Coherence check — review before relying on this'}
          </div>
          <ul className="mt-2 space-y-1 text-sm text-ink-2">
            {a.integrity.warnings.map((w, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-ink-3">→</span>
                {w}
              </li>
            ))}
          </ul>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-5">
          <Card className="px-6 py-5">
            <SectionTitle hint="strategy-agnostic asset value">Headline valuation</SectionTitle>
            <div className="grid grid-cols-3 gap-4">
              <Stat label="DCF (intrinsic)" value={usdm(av.dcfEquityUSDm)} />
              <Stat label="Comps (market)" value={usdm(av.compsEquity.mid)} />
              <Stat label="Reconciled" value={usdm(av.reconciledUSDm)} tone="accent" />
            </div>
            <RangeBar low={av.range.low} mid={av.range.base} high={av.range.high} />
            <p className="text-sm leading-relaxed text-ink-2">{deal.narrative.valuationVerdict}</p>
          </Card>

          {pm && <OperatingMetricsCard pm={pm} />}

          <Card className="px-6 py-5">
            <SectionTitle hint="firm-specific return">Return vs hurdle</SectionTitle>
            <ReturnsVsHurdle returns={a.returns} />
          </Card>

          <ScenarioCards returns={a.returns} narratives={deal.narrative.scenarioNarratives} />
        </div>

        <div className="space-y-5">
          <Card className="px-6 py-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-[13px] font-semibold tracking-wide text-ink-2 uppercase">Key assumptions</h3>
              <button onClick={() => resetDeal(deal.id)} className="text-xs text-ink-3 hover:text-accent-2">
                Reset
              </button>
            </div>
            <p className="mb-4 text-xs text-ink-3">Edit and watch the value, returns and scores re-run live.</p>
            <div className="space-y-4">
              <Stepper label="WACC" value={asm.waccPct} unit="%" step={0.5} min={5} max={30} onChange={(v) => set({ waccPct: v })} rationale="Discount rate — drives the intrinsic DCF value." />
              <Stepper label="Terminal growth" value={asm.terminalGrowthPct} unit="%" step={0.5} min={0} max={8} onChange={(v) => set({ terminalGrowthPct: v })} rationale="Perpetuity growth after the forecast." />
              <Stepper label="Exit EV / Revenue" value={asm.exitEVRevenue} unit="x" step={0.5} min={1} max={20} onChange={(v) => set({ exitEVRevenue: v })} rationale="Exit multiple — drives the firm's return." />
              <Stepper label="Hold period" value={asm.holdYears} unit="y" step={1} min={2} max={10} onChange={(v) => set({ holdYears: v })} rationale="Years to exit." />
            </div>
          </Card>

          <Card className="px-6 py-5">
            <SectionTitle>Live scores</SectionTitle>
            <div className="grid grid-cols-3 gap-3">
              <Stat label="Mandate" value={a.mandateFit.score} tone={a.mandateFit.score >= 70 ? 'pos' : a.mandateFit.score >= 50 ? 'warn' : 'neg'} />
              <Stat label="Merit" value={a.meritScore} tone={a.meritScore >= 70 ? 'pos' : a.meritScore >= 50 ? 'warn' : 'neg'} />
              <Stat label="Composite" value={a.composite} tone={a.composite >= 70 ? 'pos' : a.composite >= 50 ? 'warn' : 'neg'} />
            </div>
          </Card>
        </div>
      </div>

      {/* Investment case — always available from the narrative */}
      <CaseColumns positives={deal.narrative.caseFor} risks={deal.narrative.caseAgainst} limitations={deal.narrative.limitations} />

      {/* Full driver-based model — only when financials were provided */}
      {pm ? (
        <>
          <OperatingAssumptionsCard deal={deal} pm={pm} />
          <StatementsCard pm={pm} />
          <DcfCard pm={pm} />
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <SensitivityCard grid={pm.waccG} />
            <SensitivityCard grid={pm.entryExit} />
          </div>
        </>
      ) : (
        <>
          <Card className="px-6 py-5">
            <SectionTitle hint="historical actuals + forecast">Operating & financial picture</SectionTitle>
            <PnLTable financials={deal.financials} />
          </Card>
          <LockedModelPreview />
        </>
      )}
    </div>
  )
}

// ── Prominent placeholder shown when a deal is screened WITHOUT a full financial model. ──
// Rather than a one-line caveat, it makes the product's depth visible: the shape of the
// sections that render the moment a deal is added with financials.
function LockGlyph() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="4" y="11" width="16" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  )
}
const GhostBar = ({ w }: { w: string }) => <div className="h-2 rounded-full bg-ink-3/25" style={{ width: w }} />
function GhostStatements() {
  return (
    <div className="space-y-2.5">
      {['78%', '60%', '70%', '48%', '66%'].map((w, i) => (
        <div key={i} className="flex items-center gap-3">
          <GhostBar w="32%" />
          <div className="flex-1" />
          <GhostBar w={w} />
        </div>
      ))}
    </div>
  )
}
function GhostDcf() {
  return (
    <div className="flex h-[72px] items-end gap-2">
      {[38, 52, 64, 77, 90].map((h, i) => (
        <div key={i} className="flex-1 rounded-t-sm bg-accent/35" style={{ height: `${h}%` }} />
      ))}
    </div>
  )
}
function GhostGrid() {
  return (
    <div className="grid grid-cols-4 gap-1.5">
      {Array.from({ length: 16 }).map((_, i) => (
        <div key={i} className="h-4 rounded-sm" style={{ background: `color-mix(in srgb, var(--color-indigo) ${18 + (i % 4) * 16}%, transparent)` }} />
      ))}
    </div>
  )
}
function LockedModelPreview() {
  const items = [
    { title: '3-statement model', sub: 'P&L · balance sheet · cash flow', render: <GhostStatements /> },
    { title: 'DCF build-up', sub: 'FCFF → enterprise → equity value', render: <GhostDcf /> },
    { title: 'Sensitivity grids', sub: 'WACC × growth · entry × exit', render: <GhostGrid /> },
  ]
  return (
    <Card className="relative overflow-hidden border-dashed px-6 py-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <SectionTitle hint="driver-based model">Full financial model</SectionTitle>
        <span className="inline-flex items-center gap-1.5 rounded-md border border-line bg-panel-2 px-2.5 py-1 text-[11px] font-medium text-ink-3">
          <LockGlyph /> Not provided for this deal
        </span>
      </div>
      <p className="mt-1 mb-5 max-w-2xl text-sm leading-relaxed text-ink-2">
        This deal was screened from summary figures. Add it with financials and this section becomes a complete driver-based model — projected statements that balance by construction, a full DCF build-up, and live WACC and entry/exit sensitivities.
      </p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {items.map((it) => (
          <div key={it.title} className="rounded-xl border border-line/70 bg-panel-2/40 p-4">
            <div className="text-[13px] font-semibold text-ink">{it.title}</div>
            <div className="mt-0.5 text-[11px] text-ink-3">{it.sub}</div>
            <div className="mt-4 opacity-50 [mask-image:linear-gradient(180deg,#000_55%,transparent)]">{it.render}</div>
          </div>
        ))}
      </div>
    </Card>
  )
}

// ── Operating metrics (last actual → exit year) ──
const fmtMetric = (v: number, fmt: OperatingMetric['fmt']) => (fmt === 'usdm' ? usdm(v) : fmt === 'pct' ? `${v}%` : fmt === 'x' ? `${v}x` : `${v}`)
function OperatingMetricsCard({ pm }: { pm: ProjectedModel }) {
  const startY = pm.years.filter((y) => y.actual).at(-1)?.label ?? ''
  const endY = pm.years.at(-1)?.label ?? ''
  return (
    <Card className="px-6 py-5">
      <SectionTitle hint={`${startY} → ${endY}`}>Key operating metrics</SectionTitle>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-line/70 text-left text-[10px] tracking-wide text-ink-3 uppercase">
            <th className="py-1.5 pr-3 font-medium">Metric</th>
            <th className="py-1.5 px-2 text-right font-medium">{startY}</th>
            <th className="py-1.5 px-2 text-right font-medium">{endY}</th>
            <th className="py-1.5 pl-2 text-right font-medium">Δ</th>
          </tr>
        </thead>
        <tbody>
          {pm.operating.map((m) => (
            <tr key={m.label} className="border-b border-line-soft/40">
              <td className="py-1.5 pr-3 text-ink-2">{m.label}</td>
              <td className="py-1.5 px-2 text-right tnum text-ink">{fmtMetric(m.start, m.fmt)}</td>
              <td className="py-1.5 px-2 text-right tnum text-ink">{fmtMetric(m.end, m.fmt)}</td>
              <td className={cn('py-1.5 pl-2 text-right tnum', m.deltaPct == null ? 'text-ink-3' : m.deltaPct >= 0 ? 'text-pos' : 'text-neg')}>{m.deltaPct == null ? '—' : signedPct(m.deltaPct)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  )
}

// ── Scenario equity-value outcomes ──
function ScenarioCards({ returns: ret, narratives }: { returns: Returns; narratives?: { bear?: string; base?: string; bull?: string } }) {
  return (
    <Card className="px-6 py-5">
      <SectionTitle hint={`vs ${ret.hurdlePct}% hurdle`}>Scenario outcomes</SectionTitle>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {ret.scenarios.map((s) => {
          const note = narratives?.[s.name]
          return (
            <div key={s.name} className={cn('rounded-lg border bg-panel-2/40 px-4 py-3.5', s.clearsHurdle ? 'border-pos/40' : 'border-line-soft/60')}>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold tracking-wide text-ink-2 uppercase capitalize">{s.name}</span>
                <Pill tone={s.clearsHurdle ? 'pos' : 'neg'}>{s.clearsHurdle ? 'clears' : 'below'}</Pill>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className={cn('text-2xl font-semibold tnum', s.clearsHurdle ? 'text-pos' : 'text-neg')}>{s.irrPct}%</span>
                <span className="text-xs text-ink-3">IRR</span>
              </div>
              <div className="mt-1 flex items-center gap-3 text-[11px] text-ink-3">
                <span>{mult(s.moic, 2)} MOIC</span>
                <span>exit {usdm(s.exitEquityUSDm)}</span>
              </div>
              {note && <p className="mt-2 border-t border-line-soft/50 pt-2 text-[11px] leading-relaxed text-ink-3">{note}</p>}
            </div>
          )
        })}
      </div>
      <p className="mt-3 text-xs text-ink-3">{ret.basis}</p>
    </Card>
  )
}

// ── Positives / Risks / Limitations ──
function CaseColumns({ positives, risks, limitations }: { positives: string[]; risks: string[]; limitations: string[] }) {
  const Col = ({ title, items, dot }: { title: string; items: string[]; dot: string }) => (
    <div>
      <div className="mb-2 text-[11px] font-semibold tracking-wide text-ink-3 uppercase">{title}</div>
      <ul className="space-y-2 text-sm leading-relaxed text-ink-2">
        {items.map((x, i) => (
          <li key={i} className="flex gap-2">
            <span className={cn('mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full', dot)} />
            {x}
          </li>
        ))}
      </ul>
    </div>
  )
  return (
    <Card className="px-6 py-5">
      <SectionTitle hint="what supports the value, what threatens it, what we cannot yet verify">Investment merits, risks &amp; analytical limitations</SectionTitle>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Col title="Merits" items={positives} dot="bg-pos" />
        <Col title="Risks" items={risks} dot="bg-neg" />
        <Col title="Analytical limitations" items={limitations} dot="bg-ink-3" />
      </div>
    </Card>
  )
}

// ── Statement number format: thousands-separated, negatives in parentheses ──
const fmtAmt = (v: number) =>
  v < 0 ? `(${Math.abs(v).toLocaleString(undefined, { maximumFractionDigits: 1 })})` : v.toLocaleString(undefined, { maximumFractionDigits: 1 })

type StmtRow = { label: string; vals: (number | null)[]; bold?: boolean; indent?: boolean; pct?: boolean; muted?: boolean; top?: boolean }
function StmtTable({ years, rows }: { years: ProjectedModel['years']; rows: StmtRow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[13px]">
        <thead>
          <tr className="border-b border-line/70 text-[10px] tracking-wide text-ink-3 uppercase">
            <th className="py-1.5 pr-3 text-left font-medium">USD m</th>
            {years.map((y, i) => (
              <th key={i} className="py-1.5 pl-3 text-right font-medium whitespace-nowrap">
                {y.label}
                <span className="ml-1 text-ink-3/60">{y.actual ? 'A' : 'F'}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri} className={cn(r.top && 'border-t border-line-soft/60', r.bold && 'font-semibold')}>
              <td className={cn('py-1 pr-3 text-left', r.indent && 'pl-3', r.bold ? 'text-ink' : r.muted ? 'text-ink-3' : 'text-ink-2')}>{r.label}</td>
              {r.vals.map((v, ci) => (
                <td key={ci} className={cn('py-1 pl-3 text-right tnum whitespace-nowrap', r.muted ? 'text-ink-3' : v != null && v < 0 && !r.pct ? 'text-neg' : 'text-ink')}>
                  {v == null ? '—' : r.pct ? `${v}%` : fmtAmt(v)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── Operating assumptions (drivers × years + valuation/exit block) ──
function OperatingAssumptionsCard({ deal, pm }: { deal: Deal; pm: ProjectedModel }) {
  const drv = deal.model!.drivers
  const v = deal.model!.valuation
  const nA = pm.years.filter((y) => y.actual).length
  const row = (label: string, arr: number[] | undefined, pct = true): StmtRow => ({
    label,
    pct,
    muted: true,
    vals: pm.years.map((y, i) => (y.actual || !arr ? null : (arr[i - nA] ?? null))),
  })
  const rows: StmtRow[] = [
    row('Revenue growth', drv.revenueGrowthPct),
    row('Gross margin', drv.grossMarginPct),
    row('Operating expenses (% rev)', drv.opexPctRev),
    row('D&A (% rev)', drv.dnaPctRev),
    row('Capex (% rev)', drv.capexPctRev),
    row('Receivables (% rev)', drv.receivablesPctRev),
    row('Payables (% rev)', drv.payablesPctRev),
    row('Tax rate', drv.taxRatePct),
    ...(drv.interestRatePct ? [row('Interest rate on debt', drv.interestRatePct)] : []),
  ]
  const ex: [string, string][] = [
    ['WACC', `${v.waccPct}%`],
    ['Terminal growth (g)', `${v.terminalGrowthPct}%`],
    ['Long-run tax', `${v.longRunTaxPct ?? v.waccPct}%`],
    ['Terminal method', v.terminalMethod === 'gordon' ? 'Gordon growth' : 'Exit multiple'],
    ...(v.exitEvEbitda ? ([['Exit EV/EBITDA', `${v.exitEvEbitda}x`]] as [string, string][]) : []),
    ['Mid-year convention', v.midYear ? 'Yes' : 'No'],
  ]
  return (
    <Card className="px-6 py-5">
      <SectionTitle hint="forecast drivers as % of revenue">Operating assumptions</SectionTitle>
      <StmtTable years={pm.years} rows={rows} />
      <div className="mt-4 border-t border-line-soft/50 pt-3">
        <div className="mb-2 text-[11px] font-medium tracking-wide text-ink-3 uppercase">Valuation & exit assumptions</div>
        <div className="grid grid-cols-2 gap-x-8 gap-y-1.5 text-sm sm:grid-cols-3">
          {ex.map(([k, val]) => (
            <div key={k} className="flex items-baseline justify-between gap-2 border-b border-line-soft/30 py-0.5">
              <span className="text-ink-3">{k}</span>
              <span className="font-medium text-ink tnum">{val}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

// ── Financial statements (P&L / BS / CF) ──
function StatementsCard({ pm }: { pm: ProjectedModel }) {
  const [tab, setTab] = useState<'pnl' | 'bs' | 'cf'>('pnl')
  const P = pm.pnl, B = pm.bs, C = pm.cf
  const pnlRows: StmtRow[] = [
    { label: 'Revenue', vals: P.map((r) => r.revenue), bold: true },
    { label: 'Revenue growth', vals: P.map((r) => r.revenueGrowthPct), pct: true, muted: true },
    { label: 'Cost of sales', vals: P.map((r) => -r.cogs) },
    { label: 'Gross profit', vals: P.map((r) => r.grossProfit) },
    { label: 'Gross margin', vals: P.map((r) => r.grossMarginPct), pct: true, muted: true },
    { label: 'Other income', vals: P.map((r) => r.otherIncome) },
    { label: 'Operating expenses', vals: P.map((r) => -r.opex) },
    { label: 'EBITDA', vals: P.map((r) => r.ebitda), bold: true, top: true },
    { label: 'EBITDA margin', vals: P.map((r) => r.ebitdaMarginPct), pct: true, muted: true },
    { label: 'Depreciation & amortisation', vals: P.map((r) => -r.dna) },
    { label: 'EBIT', vals: P.map((r) => r.ebit), bold: true },
    { label: 'Finance income', vals: P.map((r) => r.financeIncome) },
    { label: 'Finance costs', vals: P.map((r) => -r.financeCosts) },
    { label: 'Profit before tax', vals: P.map((r) => r.pbt) },
    { label: 'Income tax', vals: P.map((r) => -r.tax) },
    { label: 'Net income', vals: P.map((r) => r.netIncome), bold: true, top: true },
    { label: 'Net margin', vals: P.map((r) => r.netMarginPct), pct: true, muted: true },
  ]
  const bsRows: StmtRow[] = [
    { label: 'Property, plant & equipment', vals: B.map((r) => r.ppe) },
    { label: 'Intangibles & goodwill', vals: B.map((r) => r.intangibles) },
    { label: 'Other non-current assets', vals: B.map((r) => r.otherNonCurrentAssets) },
    { label: 'Total non-current assets', vals: B.map((r) => r.totalNonCurrentAssets), bold: true },
    { label: 'Inventory', vals: B.map((r) => r.inventory) },
    { label: 'Receivables', vals: B.map((r) => r.receivables) },
    { label: 'Other current assets', vals: B.map((r) => r.otherCurrentAssets) },
    { label: 'Cash & equivalents', vals: B.map((r) => r.cash) },
    { label: 'Total current assets', vals: B.map((r) => r.totalCurrentAssets), bold: true },
    { label: 'Total assets', vals: B.map((r) => r.totalAssets), bold: true, top: true },
    { label: 'Share capital', vals: B.map((r) => r.shareCapital) },
    { label: 'Retained earnings', vals: B.map((r) => r.retainedEarnings) },
    { label: 'Reserves', vals: B.map((r) => r.reserves) },
    { label: 'Non-controlling interests', vals: B.map((r) => r.nci) },
    { label: 'Total equity', vals: B.map((r) => r.totalEquity), bold: true },
    { label: 'Long-term debt', vals: B.map((r) => r.longTermDebt) },
    { label: 'Short-term debt', vals: B.map((r) => r.shortTermDebt) },
    { label: 'Lease liabilities', vals: B.map((r) => r.leases) },
    { label: 'Other non-current liabilities', vals: B.map((r) => r.otherNonCurrentLiab) },
    { label: 'Payables', vals: B.map((r) => r.payables) },
    { label: 'Other current liabilities', vals: B.map((r) => r.otherCurrentLiab) },
    { label: 'Total liabilities', vals: B.map((r) => r.totalLiabilities), bold: true },
    { label: 'Total equity & liabilities', vals: B.map((r) => r.totalEquityAndLiabilities), bold: true, top: true },
    { label: 'Net debt', vals: B.map((r) => r.netDebt), muted: true, top: true },
    { label: 'Balance check (assets − E&L)', vals: B.map((r) => r.balanceGap), muted: true },
  ]
  const cfRows: StmtRow[] = [
    { label: 'Net income', vals: C.map((r) => r.netIncome) },
    { label: 'Add: depreciation & amortisation', vals: C.map((r) => r.dna) },
    { label: 'Change in receivables', vals: C.map((r) => r.changeReceivables) },
    { label: 'Change in inventory', vals: C.map((r) => r.changeInventory) },
    { label: 'Change in payables', vals: C.map((r) => r.changePayables) },
    { label: 'Cash from operations', vals: C.map((r) => r.cfo), bold: true, top: true },
    { label: 'Capital expenditure', vals: C.map((r) => r.capex) },
    { label: 'Cash from investing', vals: C.map((r) => r.cfi), bold: true },
    { label: 'Net change in debt', vals: C.map((r) => r.debtChange) },
    { label: 'Dividends', vals: C.map((r) => r.dividends) },
    { label: 'Cash from financing', vals: C.map((r) => r.cff), bold: true },
    { label: 'Net change in cash', vals: C.map((r) => r.netChangeInCash), bold: true, top: true },
    { label: 'Closing cash', vals: C.map((r) => r.closingCash), muted: true },
  ]
  const rows = tab === 'pnl' ? pnlRows : tab === 'bs' ? bsRows : cfRows
  const tabs: [typeof tab, string][] = [['pnl', 'Income statement'], ['bs', 'Balance sheet'], ['cf', 'Cash flow']]
  return (
    <Card className="px-6 py-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-[13px] font-semibold tracking-wide text-ink-2 uppercase">Financial statements</h3>
        <div className="flex gap-1">
          {tabs.map(([k, label]) => (
            <button key={k} onClick={() => setTab(k)} className={cn('rounded-md px-2.5 py-1 text-xs font-medium transition-colors', tab === k ? 'bg-accent-bg text-accent-2' : 'text-ink-3 hover:text-ink-2')}>
              {label}
            </button>
          ))}
        </div>
      </div>
      <StmtTable years={pm.years} rows={rows} />
    </Card>
  )
}

// ── DCF build-up + EV→equity bridge ──
function DcfCard({ pm }: { pm: ProjectedModel }) {
  const f = pm.dcf
  const cols = f.forecastLabels
  const dcfRows: { label: string; vals: string[]; bold?: boolean }[] = [
    { label: 'Unlevered free cash flow', vals: f.ufcf.map(fmtAmt), bold: true },
    { label: 'Discount period (yrs)', vals: f.period.map((p) => `${p}`) },
    { label: 'Discount factor', vals: f.discountFactor.map((d) => d.toFixed(2)) },
    { label: 'PV of UFCF', vals: f.pvUfcf.map(fmtAmt) },
  ]
  const bridge: [string, number, boolean?][] = [
    ['Sum of PV (explicit)', f.sumPvExplicit],
    ['PV of terminal value', f.pvTerminal],
    ['Enterprise value', f.enterpriseValue, true],
    ['Less: net debt', -f.netDebt],
    ['Less: leases', -f.leases],
    ['Less: non-controlling interests', -f.nci],
    ['Plus: associates', f.associates],
    ['Equity value', f.equityValue, true],
  ]
  return (
    <Card className="px-6 py-5">
      <SectionTitle hint={`${f.terminalPctOfEv}% of EV from terminal`}>DCF — unlevered FCF → equity</SectionTitle>
      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-line/70 text-[10px] tracking-wide text-ink-3 uppercase">
              <th className="py-1.5 pr-3 text-left font-medium">USD m</th>
              {cols.map((c, i) => (
                <th key={i} className="py-1.5 pl-3 text-right font-medium whitespace-nowrap">{c}<span className="ml-1 text-ink-3/60">F</span></th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dcfRows.map((r, ri) => (
              <tr key={ri} className={cn(r.bold && 'font-semibold')}>
                <td className={cn('py-1 pr-3 text-left', r.bold ? 'text-ink' : 'text-ink-2')}>{r.label}</td>
                {r.vals.map((v, ci) => (
                  <td key={ci} className="py-1 pl-3 text-right tnum text-ink whitespace-nowrap">{v}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-x-8 gap-y-1 border-t border-line-soft/50 pt-3 text-sm sm:grid-cols-2">
        {bridge.map(([k, val, bold]) => (
          <div key={k} className={cn('flex items-baseline justify-between gap-2 border-b border-line-soft/30 py-1', bold && 'font-semibold')}>
            <span className={cn(bold ? 'text-ink' : 'text-ink-3')}>{k}</span>
            <span className={cn('tnum', k === 'Equity value' ? 'text-accent-2' : bold ? 'text-ink' : val < 0 ? 'text-neg' : 'text-ink-2')}>{fmtAmt(val)}</span>
          </div>
        ))}
        <div className="flex items-baseline justify-between gap-2 py-1">
          <span className="text-ink-3">Implied EV / Revenue (LTM)</span>
          <span className="tnum text-ink-2">{mult(f.impliedEvRevenue, 1)}</span>
        </div>
        <div className="flex items-baseline justify-between gap-2 py-1">
          <span className="text-ink-3">Implied EV / EBITDA (LTM)</span>
          <span className="tnum text-ink-2">{mult(f.impliedEvEbitda, 1)}</span>
        </div>
      </div>
    </Card>
  )
}

// ── Sensitivity grid (WACC×g equity, or entry×exit IRR) ──
function SensitivityCard({ grid }: { grid: SensitivityGrid }) {
  const rowFmt = (v: number) => (grid.rowLabel === 'Entry valuation' ? usdm(v) : `${v}%`)
  const colFmt = (v: number) => (grid.colLabel === 'Exit EV/Rev' ? `${v}x` : `${v}%`)
  const cellFmt = (v: number) => (grid.unit === 'equity' ? usdm(v) : `${v}%`)
  return (
    <Card className="px-6 py-5">
      <SectionTitle hint={grid.unit === 'equity' ? 'equity value' : 'IRR'}>
        {grid.rowLabel} × {grid.colLabel}
      </SectionTitle>
      <div className="overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="text-[10px] tracking-wide text-ink-3 uppercase">
              <th className="py-1.5 pr-2 text-left font-medium whitespace-nowrap">{grid.rowLabel} ↓ / {grid.colLabel} →</th>
              {grid.cols.map((c, i) => (
                <th key={i} className={cn('py-1.5 px-2 text-right font-medium tnum', i === grid.baseCol && 'text-accent-2')}>{colFmt(c)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {grid.grid.map((rowVals, ri) => (
              <tr key={ri} className="border-t border-line-soft/40">
                <td className={cn('py-1.5 pr-2 text-left tnum', ri === grid.baseRow ? 'text-accent-2' : 'text-ink-3')}>{rowFmt(grid.rows[ri])}</td>
                {rowVals.map((val, ci) => {
                  const base = ri === grid.baseRow && ci === grid.baseCol
                  return (
                    <td key={ci} className={cn('py-1.5 px-2 text-right tnum', base ? 'rounded bg-accent-bg font-semibold text-accent-2' : grid.unit === 'irr' && val < 0 ? 'text-neg' : 'text-ink-2')}>
                      {cellFmt(val)}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {grid.unit === 'irr' && <p className="mt-2 text-[11px] text-ink-3">IRR on the fund's stake; exit on terminal-year revenue at the exit multiple, current net debt.</p>}
    </Card>
  )
}

function Stepper({
  label,
  value,
  unit,
  step,
  min,
  max,
  onChange,
  rationale,
}: {
  label: string
  value: number
  unit: string
  step: number
  min: number
  max: number
  onChange: (v: number) => void
  rationale: string
}) {
  const clamp = (v: number) => Math.min(max, Math.max(min, Math.round(v * 100) / 100))
  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-ink-2">{label}</span>
        <div className="flex items-center gap-1">
          <button onClick={() => onChange(clamp(value - step))} className="grid h-7 w-7 place-items-center rounded-md border border-line text-ink-2 hover:bg-panel-2">
            −
          </button>
          <span className="w-16 text-center text-sm font-semibold text-ink tnum">
            {value}
            {unit}
          </span>
          <button onClick={() => onChange(clamp(value + step))} className="grid h-7 w-7 place-items-center rounded-md border border-line text-ink-2 hover:bg-panel-2">
            +
          </button>
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(clamp(parseFloat(e.target.value)))}
        className="mt-2 w-full accent-accent"
      />
      <p className="mt-1 text-[11px] text-ink-3">{rationale}</p>
    </div>
  )
}

export function ReturnsVsHurdle({ returns }: { returns: Returns }) {
  const max = Math.max(returns.hurdlePct * 1.5, ...returns.scenarios.map((s) => Math.max(s.irrPct, 0)))
  return (
    <div className="relative pt-5">
      <div className="absolute top-0 right-0 text-[11px] text-ink-3">hurdle {returns.hurdlePct}%</div>
      <div className="space-y-3">
        {returns.scenarios.map((s) => {
          const w = Math.max(2, (Math.max(s.irrPct, 0) / max) * 100)
          const hurdleLeft = (returns.hurdlePct / max) * 100
          return (
            <div key={s.name}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="capitalize text-ink-2">{s.name}</span>
                <span className="text-ink-3 tnum">
                  IRR <span className={cn('font-medium', s.clearsHurdle ? 'text-pos' : 'text-neg')}>{s.irrPct}%</span> · {mult(s.moic, 2)} MOIC
                </span>
              </div>
              <div className="relative h-2.5 w-full rounded-full bg-panel-3">
                <div className={cn('h-full rounded-full', s.clearsHurdle ? 'bg-pos' : 'bg-warn')} style={{ width: `${w}%` }} />
                <div className="absolute top-[-3px] bottom-[-3px] w-px bg-ink/70" style={{ left: `${hurdleLeft}%` }} />
              </div>
            </div>
          )
        })}
      </div>
      <div className="mt-4 text-xs text-ink-3">{returns.basis}</div>
    </div>
  )
}

// ─────────────────────────── IC Memo (§7.6) ───────────────────────────
const sevTone = { high: 'neg', medium: 'warn', low: 'pos' } as const

// Print the memo to PDF. The browser uses document.title as the default filename,
// so we swap in a clean "<Deal> — IC Memo" name for the duration of the print, then
// restore it. The @media print stylesheet (index.css) re-maps the dark design tokens
// to a light palette and hides the app chrome so only the memo renders.
function exportMemoPdf(dealName: string) {
  const prev = document.title
  const restore = () => {
    document.title = prev
    window.removeEventListener('afterprint', restore)
  }
  document.title = `${dealName} — IC Memo`
  window.addEventListener('afterprint', restore)
  window.print()
  // Fallback for browsers that don't fire afterprint reliably.
  window.setTimeout(restore, 1000)
}

export function MemoTab({ deal, a }: { deal: Deal; a: Analysis }) {
  const n = deal.narrative
  const av = a.assetValue
  const asm = deal.assumptions
  const ownership = (deal.ticketUSDm / deal.ask.askValuationUSDm) * 100
  const gAvg = Math.round(asm.revGrowthPct.reduce((s, x) => s + x, 0) / asm.revGrowthPct.length)
  const over = av.askVsValuePct > 0
  const softFields = deal.dataTrust.fields.filter((f) => f.basis !== 'stated')

  return (
    <Card className="memo-doc px-10 py-9 print:rounded-none print:border-0 print:bg-transparent print:px-0 print:py-0 print:shadow-none">
      {/* Letterhead */}
      <div className="mb-6 flex items-start justify-between gap-6 border-b border-line pb-5">
        <div className="min-w-0">
          <div className="text-[11px] tracking-widest text-ink-3 uppercase">Investment Committee Memorandum · Strictly Confidential</div>
          <h2 className="mt-1 text-2xl font-semibold text-ink">{deal.name}</h2>
          <p className="mt-0.5 text-sm text-ink-2">{deal.oneLiner}</p>
          <p className="mt-1 text-xs text-ink-3">
            {deal.sector} · {deal.geography} · {deal.stage}
            {deal.foundedYear ? ` · Founded ${deal.foundedYear}` : ''} · Proposed ticket {usdm(deal.ticketUSDm)} ({deal.instrument})
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2 print:hidden">
          <Button onClick={() => exportMemoPdf(deal.name)}>Export PDF</Button>
          <span className="whitespace-nowrap text-right text-[10px] text-ink-3">Prepared by AI Deal Operations</span>
        </div>
      </div>

      <MemoChapter label="Executive verdict" />
      <MemoSection title="Executive summary">
        <div className="mb-4 rounded-lg border border-line-soft/60 bg-panel-2/50 px-4 py-3 text-sm leading-relaxed text-ink-2">
          <span className="font-medium text-ink">The proposal: </span>
          {usdm(deal.ticketUSDm)} {deal.instrument.toLowerCase()} for ~{ownership.toFixed(1)}% of {deal.name} at a {usdm(deal.ask.askValuationUSDm)} {deal.ask.series ? `${deal.ask.series.toLowerCase()} ` : ''}mark
          {deal.totalRaisedUSDm ? `; the company has raised ${usdm(deal.totalRaisedUSDm)} to date` : ''}. {n.icThesis}
        </div>
        <div className="grid grid-cols-4 gap-3">
          {([['Mandate fit', a.mandateFit.score], ['Standalone merit', a.meritScore], ['Composite', a.composite], ['Data trust', a.dataTrustScore]] as [string, number][]).map(([l, v]) => (
            <div key={l} className="rounded-lg bg-panel-2 px-3 py-2.5 text-center">
              <div className="text-[10px] tracking-wide text-ink-3 uppercase">{l}</div>
              <div className={cn('mt-0.5 text-xl font-semibold tnum', v >= 70 ? 'text-pos' : v >= 50 ? 'text-warn' : 'text-neg')}>{v}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <div className="mb-1.5 text-[11px] font-medium tracking-wide text-ink-3 uppercase">Key considerations</div>
            <ul className="space-y-1.5 text-sm leading-relaxed text-ink-2">
              {a.reasons.map((r, i) => (
                <li key={i} className="flex gap-2"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />{r}</li>
              ))}
            </ul>
          </div>
          {a.conditions.length > 0 && (
            <div>
              <div className="mb-1.5 text-[11px] font-medium tracking-wide text-ink-3 uppercase">Open items to resolve</div>
              <ul className="space-y-1.5 text-sm leading-relaxed text-ink-2">
                {a.conditions.map((c, i) => (
                  <li key={i} className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-sm border border-warn" />{c}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </MemoSection>

      <MemoSection title="Basis of analysis">
        <p className="text-sm leading-relaxed text-ink-2">{basisOfAnalysis(deal, a)}</p>
      </MemoSection>

      <MemoChapter label="Thesis & company" />
      {deal.vitals && (
        <MemoSection title="Business profile">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {([['Size', deal.vitals.size], ['Growth', deal.vitals.growth], ['Unit economics', deal.vitals.unitEconomics], ['Quality', deal.vitals.quality]] as const).map(([k, v]) => {
              const nd = /not disclosed|n\/d/i.test(v.value)
              return (
                <div key={k} className="rounded-lg border border-line-soft/60 bg-panel-2/40 px-3 py-2.5">
                  <div className="text-[10px] font-semibold tracking-wide text-ink-2 uppercase">{k}</div>
                  <div className={cn('mt-1 font-semibold tnum', nd ? 'text-sm italic text-ink-3' : 'text-base text-ink')}>{v.value}</div>
                  <div className="mt-0.5 text-[10px] text-ink-3">{v.label}</div>
                </div>
              )
            })}
          </div>
        </MemoSection>
      )}

      {/* III. Company, market & model */}
      <MemoSection n="III" title="Company, market & business model">
        <p className="text-sm leading-relaxed text-ink-2">{n.profile}</p>
        <p className="mt-2.5 text-sm leading-relaxed text-ink-2"><span className="font-medium text-ink">Market. </span>{n.marketRead}</p>
        <p className="mt-2.5 text-sm leading-relaxed text-ink-2"><span className="font-medium text-ink">Regulatory. </span>{n.regulatory}</p>
        {n.revenueLines?.length ? (
          <div className="mt-4">
            <div className="mb-2 text-[11px] font-medium tracking-wide text-ink-3 uppercase">Revenue model</div>
            <RevenueLines lines={n.revenueLines} />
          </div>
        ) : null}
      </MemoSection>

      {n.marketContext && (
        <MemoSection title="Market context & opportunity">
          <p className="text-sm leading-relaxed text-ink-2">{n.marketContext}</p>
        </MemoSection>
      )}

      {n.moat && (
        <MemoSection title="Competitive landscape & moat">
          <div className="mb-3">
            <div className="mb-1.5 text-[11px] font-medium tracking-wide text-ink-3 uppercase">Moat pillars</div>
            <ul className="space-y-1.5 text-sm leading-relaxed text-ink-2">
              {n.moat.pillars.map((p, i) => <li key={i} className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-pos" />{p}</li>)}
            </ul>
          </div>
          {n.moat.competitors.length > 0 && (
            <div className="mb-3">
              <div className="mb-1.5 text-[11px] font-medium tracking-wide text-ink-3 uppercase">Competitive set</div>
              <div className="grid grid-cols-1 gap-x-8 gap-y-1.5 sm:grid-cols-2">
                {n.moat.competitors.map((c) => (
                  <div key={c.name} className="text-sm"><span className="font-medium text-ink">{c.name}. </span><span className="text-ink-3">{c.note}</span></div>
                ))}
              </div>
            </div>
          )}
          <p className="text-sm leading-relaxed text-ink-2"><span className="font-medium text-ink">Trajectory. </span>{n.moat.trajectory}</p>
          <div className="mt-2">
            <div className="mb-1.5 text-[11px] font-medium tracking-wide text-ink-3 uppercase">How the moat could erode</div>
            <ul className="space-y-1.5 text-sm leading-relaxed text-ink-2">
              {n.moat.erosionScenarios.map((e, i) => <li key={i} className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-neg" />{e}</li>)}
            </ul>
          </div>
        </MemoSection>
      )}

      {n.recentDevelopments && (
        <MemoSection title="Recent developments">
          <p className="text-sm leading-relaxed text-ink-2">{n.recentDevelopments}</p>
        </MemoSection>
      )}

      <MemoSection title="Investment case">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <div className="mb-1.5 text-[11px] font-medium tracking-wide text-pos uppercase">The case for</div>
            <ul className="space-y-2 text-sm leading-relaxed text-ink-2">
              {n.caseFor.map((c, i) => <li key={i} className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-pos" />{c}</li>)}
            </ul>
          </div>
          <div>
            <div className="mb-1.5 text-[11px] font-medium tracking-wide text-neg uppercase">The case against</div>
            <ul className="space-y-2 text-sm leading-relaxed text-ink-2">
              {n.caseAgainst.map((c, i) => <li key={i} className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-neg" />{c}</li>)}
            </ul>
          </div>
        </div>
      </MemoSection>

      {(n.thesisDrivers?.length || n.thesisBreakers?.length) && (
        <MemoSection title="Investment thesis">
          <p className="text-sm leading-relaxed text-ink-2">{n.icThesis}</p>
          {n.thesisDrivers?.length ? (
            <div className="mt-3">
              <div className="mb-1.5 text-[11px] font-medium tracking-wide text-ink-3 uppercase">Return drivers</div>
              <ul className="space-y-1.5 text-sm leading-relaxed text-ink-2">
                {n.thesisDrivers.map((x, i) => <li key={i} className="flex gap-2"><span className="mt-1 text-accent-2 tnum">{i + 1}.</span>{x}</li>)}
              </ul>
            </div>
          ) : null}
          {n.thesisBreakers?.length ? (
            <div className="mt-3">
              <div className="mb-1.5 text-[11px] font-medium tracking-wide text-ink-3 uppercase">What would have to be true for the thesis to break</div>
              <ul className="space-y-1.5 text-sm leading-relaxed text-ink-2">
                {n.thesisBreakers.map((x, i) => <li key={i} className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-sm border border-neg" />{x}</li>)}
              </ul>
            </div>
          ) : null}
        </MemoSection>
      )}

      <MemoChapter label="Financials & valuation" />
      <MemoSection title="Financial profile">
        <PnLTable financials={deal.financials} />
        {n.qualityOfEarnings && <p className="mt-3 text-sm leading-relaxed text-ink-2"><span className="font-medium text-ink">Quality of earnings. </span>{n.qualityOfEarnings}</p>}
      </MemoSection>

      {/* VI. Valuation */}
      <MemoSection n="VI" title="Valuation — what the asset is worth">
        <p className="mb-3 text-sm leading-relaxed text-ink-2">{n.valuationVerdict}</p>
        <div className="grid grid-cols-3 gap-3">
          <KV label="Intrinsic (DCF)" value={usdm(av.dcfEquityUSDm)} />
          <KV label="Market (comps, mid)" value={usdm(av.compsEquity.mid)} />
          <KV label="Reconciled" value={usdm(av.reconciledUSDm)} accent />
        </div>
        <RangeBar low={av.range.low} mid={av.range.base} high={av.range.high} marker={{ value: deal.ask.askValuationUSDm, label: 'the ask' }} />
        <div className={cn('rounded-lg px-4 py-2.5 text-sm', over ? 'bg-neg-bg/40' : 'bg-pos-bg/40')}>
          <span className={cn('font-semibold tnum', over ? 'text-neg' : 'text-pos')}>{signedPct(av.askVsValuePct)}</span>{' '}
          <span className="text-ink-2">the ask of {usdm(deal.ask.askValuationUSDm)} is {over ? 'above' : 'below'} the reconciled value ({mult(av.impliedEVRevenue)} implied EV/Revenue).</span>
        </div>
        <div className="mt-4">
          <div className="mb-2 text-[11px] font-medium tracking-wide text-ink-3 uppercase">Comparable companies</div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line/70 text-left text-[10px] tracking-wide text-ink-3 uppercase">
                <th className="py-1.5 pr-3 font-medium">Peer</th>
                <th className="py-1.5 px-2 text-right font-medium">EV/Rev</th>
                <th className="py-1.5 px-2 text-right font-medium">EV/EBITDA</th>
                <th className="py-1.5 px-2 text-right font-medium">Growth</th>
                <th className="py-1.5 px-2 text-right font-medium">Margin</th>
              </tr>
            </thead>
            <tbody>
              {deal.peers.map((p) => (
                <tr key={p.name} className="border-b border-line-soft/40">
                  <td className="py-1.5 pr-3 text-ink-2">{p.name} <span className="text-[10px] text-ink-3">{p.public ? 'Public' : 'Pvt'}</span></td>
                  <td className="py-1.5 px-2 text-right tnum text-ink">{p.evRevenue != null ? mult(p.evRevenue) : '—'}</td>
                  <td className="py-1.5 px-2 text-right tnum text-ink-2">{p.evEbitda != null ? mult(p.evEbitda) : '—'}</td>
                  <td className="py-1.5 px-2 text-right tnum text-ink-2">{p.revGrowthPct != null ? `${p.revGrowthPct}%` : '—'}</td>
                  <td className="py-1.5 px-2 text-right tnum text-ink-2">{p.ebitdaMarginPct != null ? `${p.ebitdaMarginPct}%` : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </MemoSection>

      {/* VII. Returns */}
      <MemoSection n="VII" title="Returns — what the firm would earn">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line/70 text-left text-[10px] tracking-wide text-ink-3 uppercase">
              <th className="py-1.5 pr-3 font-medium">Scenario</th>
              <th className="py-1.5 px-2 text-right font-medium">IRR</th>
              <th className="py-1.5 px-2 text-right font-medium">MOIC</th>
              <th className="py-1.5 px-2 text-right font-medium">Exit equity</th>
              <th className="py-1.5 px-2 text-right font-medium">vs {a.returns.hurdlePct}% hurdle</th>
            </tr>
          </thead>
          <tbody>
            {a.returns.scenarios.map((s) => (
              <tr key={s.name} className="border-b border-line-soft/40">
                <td className="py-1.5 pr-3 capitalize text-ink-2">{s.name}</td>
                <td className={cn('py-1.5 px-2 text-right font-medium tnum', s.clearsHurdle ? 'text-pos' : 'text-neg')}>{s.irrPct}%</td>
                <td className="py-1.5 px-2 text-right tnum text-ink-2">{mult(s.moic, 2)}</td>
                <td className="py-1.5 px-2 text-right tnum text-ink-2">{usdm(s.exitEquityUSDm)}</td>
                <td className={cn('py-1.5 px-2 text-right text-[11px]', s.clearsHurdle ? 'text-pos' : 'text-neg')}>{s.clearsHurdle ? 'clears' : 'below'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-2 text-xs text-ink-3">{a.returns.basis}</p>
        <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm sm:grid-cols-3">
          <KVline label="Rev. growth (avg)" value={`${gAvg}%`} />
          <KVline label="EBITDA margin" value={`${asm.ebitdaMarginPct[0]}% → ${asm.ebitdaMarginPct[asm.ebitdaMarginPct.length - 1]}%`} />
          <KVline label="WACC" value={`${asm.waccPct}%`} />
          <KVline label="Terminal growth" value={`${asm.terminalGrowthPct}%`} />
          <KVline label="Exit EV/Revenue" value={mult(asm.exitEVRevenue)} />
          <KVline label="Hold" value={`${asm.holdYears}y`} />
        </div>
        {n.scenarioNarratives && (
          <div className="mt-4 space-y-2">
            {(['bear', 'base', 'bull'] as const).map((k) => {
              const note = n.scenarioNarratives?.[k]
              const sc = a.returns.scenarios.find((s) => s.name === k)
              if (!note) return null
              return (
                <p key={k} className="text-[13px] leading-relaxed text-ink-3">
                  <span className={cn('font-semibold uppercase', sc?.clearsHurdle ? 'text-pos' : 'text-neg')}>{k}</span>
                  <span className="text-ink-3"> ({sc?.irrPct}% IRR · {mult(sc?.moic ?? 0, 2)}). </span>
                  {note}
                </p>
              )
            })}
          </div>
        )}
      </MemoSection>

      <MemoChapter label="Mandate, risks & structure" />
      <MemoSection title="Mandate fit & portfolio construction">
        {a.mandateFit.redLineBreaches.length > 0 && (
          <div className="mb-3 rounded-lg border border-neg/40 bg-neg-bg/30 px-4 py-2.5 text-sm text-neg">
            <span className="font-semibold">Red-line breach: </span>{a.mandateFit.redLineBreaches.join('; ')}
          </div>
        )}
        <div className="grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
          {a.mandateFit.dimensions.map((d) => (
            <div key={d.key} className="flex items-start gap-2 text-sm">
              <span className={cn('mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full', d.status === 'pass' ? 'bg-pos' : d.status === 'soft' ? 'bg-warn' : 'bg-neg')} />
              <span className="text-ink-2"><span className="font-medium text-ink">{d.label} ({d.score}). </span>{d.takeaway}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-sm text-ink-2">
          <span className="font-medium text-ink">Concentration. </span>
          {usdm(deal.ticketUSDm)} is {a.mandateFit.concentration.pctOfFund}% of the fund vs a {a.mandateFit.concentration.capPct}% cap — {a.mandateFit.concentration.takeaway}
        </p>
      </MemoSection>

      <MemoSection title="Risk register">
        <div className="mb-3 flex items-center gap-2 text-[11px]">
          <span className="tracking-wide text-ink-3 uppercase">Severity mix:</span>
          {(['high', 'medium', 'low'] as const).map((sev) => {
            const c = n.riskRegister.filter((r) => r.severity === sev).length
            return <Pill key={sev} tone={sevTone[sev]}>{c} {sev}</Pill>
          })}
        </div>
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-line/70 text-left text-[10px] tracking-wide text-ink-3 uppercase">
              <th className="py-1.5 pr-3 font-medium">Risk</th>
              <th className="py-1.5 px-2 font-medium">Sev</th>
              <th className="py-1.5 px-2 font-medium">Likely</th>
              <th className="py-1.5 pr-3 font-medium">Impact</th>
              <th className="py-1.5 pr-3 font-medium">Mitigation</th>
              <th className="py-1.5 pr-3 font-medium">Monitoring</th>
            </tr>
          </thead>
          <tbody>
            {n.riskRegister.map((r, i) => (
              <tr key={i} className="border-b border-line-soft/40 align-top">
                <td className="py-2 pr-3 font-medium text-ink">{r.risk}</td>
                <td className="py-2 px-2"><Pill tone={sevTone[r.severity]}>{r.severity}</Pill></td>
                <td className="py-2 px-2 capitalize text-ink-3">{r.likelihood}</td>
                <td className="py-2 pr-3 text-ink-3">{r.impact}</td>
                <td className="py-2 pr-3 text-ink-2">{r.mitigation}</td>
                <td className="py-2 pr-3 text-ink-3">{r.monitoring}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </MemoSection>

      {/* X. Leadership & ownership */}
      <MemoSection n="X" title="Leadership & ownership">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <div className="mb-1.5 text-[11px] font-medium tracking-wide text-ink-3 uppercase">Leadership</div>
            <ul className="space-y-1.5 text-sm">
              {n.leadership.map((p, i) => (
                <li key={i} className="flex items-baseline justify-between gap-3">
                  <span className="text-ink">{p.name}</span>
                  <span className="shrink-0 text-xs text-ink-3">{p.role}</span>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs leading-relaxed text-ink-3">{n.leadershipGaps}</p>
          </div>
          {deal.capTable && (
            <div>
              <div className="mb-1.5 text-[11px] font-medium tracking-wide text-ink-3 uppercase">Ownership</div>
              <CapTable rows={deal.capTable} />
            </div>
          )}
        </div>
      </MemoSection>

      <MemoSection title="Use of funds">
        {n.useOfFundsBreakdown?.length ? (
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-line/70 text-left text-[10px] tracking-wide text-ink-3 uppercase">
                <th className="py-1.5 pr-3 font-medium">Category</th>
                <th className="py-1.5 px-2 text-right font-medium">%</th>
                <th className="py-1.5 pr-3 font-medium">Rationale</th>
              </tr>
            </thead>
            <tbody>
              {n.useOfFundsBreakdown.map((u) => (
                <tr key={u.category} className="border-b border-line-soft/40 align-top">
                  <td className="py-2 pr-3 font-medium text-ink">{u.category}</td>
                  <td className="py-2 px-2 text-right tnum text-ink-2">{u.pct}%</td>
                  <td className="py-2 pr-3 text-ink-3">{u.rationale}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-sm leading-relaxed text-ink-2">{n.useOfFunds}</p>
        )}
      </MemoSection>

      <MemoSection title="Proposed terms">
        {n.termSheet ? (
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-1 gap-x-8 gap-y-1.5 sm:grid-cols-2">
              <KVline label="Instrument" value={n.termSheet.instrument} />
              <KVline label="Indicative ownership" value={n.termSheet.ownership} />
            </div>
            <p className="leading-relaxed text-ink-2"><span className="font-medium text-ink">Board & governance. </span>{n.termSheet.boardGovernance}</p>
            <div>
              <div className="mb-1 text-[11px] font-medium tracking-wide text-ink-3 uppercase">Preferential rights sought</div>
              <ul className="space-y-1 text-ink-2">{n.termSheet.preferentialRights.map((x, i) => <li key={i} className="flex gap-2"><span className="text-ink-3">·</span>{x}</li>)}</ul>
            </div>
            <div>
              <div className="mb-1 text-[11px] font-medium tracking-wide text-ink-3 uppercase">Conditions precedent</div>
              <ul className="space-y-1 text-ink-2">{n.termSheet.conditionsPrecedent.map((x, i) => <li key={i} className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-sm border border-warn" />{x}</li>)}</ul>
            </div>
            <p className="text-[11px] text-ink-3">Illustrative and for discussion — not agreed terms.</p>
          </div>
        ) : (
          <dl className="grid grid-cols-1 gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
            {n.proposedTerms.map((t) => (
              <div key={t.label} className="flex justify-between gap-3 border-b border-line-soft/40 py-1">
                <dt className="text-ink-3">{t.label}</dt>
                <dd className="text-right text-ink-2">{t.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </MemoSection>

      <MemoChapter label="Provenance" />
      <MemoSection title="Data provenance & confidence">
        <p className="mb-3 text-sm leading-relaxed text-ink-2">
          Data-trust score <span className={cn('font-semibold tnum', a.dataTrustScore >= 70 ? 'text-pos' : a.dataTrustScore >= 55 ? 'text-warn' : 'text-neg')}>{a.dataTrustScore}/100</span>. The figures the committee should weigh as soft — inferred or estimated rather than disclosed:
        </p>
        {softFields.length ? (
          <ul className="space-y-1.5 text-sm text-ink-2">
            {softFields.map((f) => (
              <li key={f.label} className="flex gap-2">
                <TrustTag basis={f.basis} confidence={f.confidence} />
                <span><span className="font-medium text-ink">{f.label}. </span>{f.method ?? f.source}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-ink-3">All material figures are sourced/stated.</p>
        )}
        {n.limitations.length > 0 && (
          <div className="mt-3">
            <div className="mb-1 text-[11px] font-medium tracking-wide text-ink-3 uppercase">Limitations</div>
            <ul className="space-y-1 text-sm text-ink-3">
              {n.limitations.map((l, i) => <li key={i}>→ {l}</li>)}
            </ul>
          </div>
        )}
      </MemoSection>

      <p className="mt-8 border-t border-line pt-4 text-[11px] leading-relaxed text-ink-3">
        Prepared by AI Deal Operations for review by a qualified professional. This is analyst work product to inform the committee’s decision — not investment advice or a recommendation. Every figure carries a source or a stated derivation; verify before relying.
      </p>
    </Card>
  )
}

function MemoSection({ title, children }: { n?: string; title: string; children: React.ReactNode }) {
  return (
    <section className="mb-7 break-inside-avoid">
      <h3 className="mb-2.5 border-b border-line-soft/50 pb-1.5 text-[13px] font-semibold tracking-wide text-accent-2 uppercase">{title}</h3>
      {children}
    </section>
  )
}

function MemoChapter({ label }: { label: string }) {
  return (
    <div className="mt-10 mb-5 flex items-center gap-3 first:mt-0 break-inside-avoid">
      <span className="text-[11px] font-semibold tracking-[0.22em] text-ink-3 uppercase">{label}</span>
      <span className="h-px flex-1 bg-line/50" />
    </div>
  )
}

// Derived "basis of analysis" — synthesised from the data-trust posture, no authoring required.
function basisOfAnalysis(deal: Deal, a: Analysis): string {
  const f = deal.dataTrust.fields
  const stated = f.filter((x) => x.basis === 'stated').length
  const soft = f.length - stated
  const breaches = a.integrity.checks.filter((c) => c.severity === 'blocking').length
  const lead = `This memo rests on a data-trust score of ${a.dataTrustScore}/100 — ${stated} of ${f.length} tracked fields are disclosed/sourced, ${soft} are inferred or estimated.`
  const mid = soft > 0 ? ` The soft figures (listed in Provenance below) should be treated as working assumptions pending diligence, not company-reported facts.` : ` Every tracked figure is sourced.`
  const tail = breaches ? ` Note: ${breaches} coherence check(s) are currently failing — the figures are not yet stand-behind-able.` : ` The deterministic coherence ledger passes with no blocking issues.`
  return lead + mid + tail
}

function KV({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-lg bg-panel-2/60 px-3 py-2.5">
      <div className="text-[10px] tracking-wide text-ink-3 uppercase">{label}</div>
      <div className={cn('mt-0.5 text-lg font-semibold tnum', accent ? 'text-accent-2' : 'text-ink')}>{value}</div>
    </div>
  )
}

function KVline({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-2 border-b border-line-soft/30 py-0.5">
      <span className="text-ink-3">{label}</span>
      <span className="font-medium text-ink tnum">{value}</span>
    </div>
  )
}

// ─────────────────────────── Research (§7.7) & History (§7.8) ───────────────────────────
export function ResearchTab({ deal, a }: { deal: Deal; a: Analysis }) {
  return (
    <div className="space-y-5">
      <CoherencePanel checks={a.integrity.checks} />
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <Card className="px-6 py-5">
        <SectionTitle hint="source per figure">Sourcing & evidence</SectionTitle>
        <div className="space-y-2.5">
          {deal.dataTrust.fields.map((f) => (
            <div key={f.label} className="border-b border-line-soft/40 pb-2.5">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-ink-2">{f.label}</span>
                <div className="flex items-center gap-2">
                  <Cite source={f.source} url={f.url} />
                  <TrustTag basis={f.basis} confidence={f.confidence} />
                </div>
              </div>
              {f.method && (
                <p className="mt-0.5 text-[11px] leading-relaxed text-ink-3">
                  <span className={cn('font-medium', basisToneText[f.basis])}>{f.basis === 'estimated' ? 'Estimated: ' : 'Inferred: '}</span>
                  {f.method}
                </p>
              )}
            </div>
          ))}
        </div>
      </Card>
      <Card className="px-6 py-5">
        <SectionTitle>Legal / sanctions deep-dive</SectionTitle>
        <p className="text-sm leading-relaxed text-ink-2">{deal.narrative.legalStanding}</p>
        <div className="mt-4">
          <SectionTitle>Recent events</SectionTitle>
          <ul className="space-y-2 text-sm">
            {deal.news.map((ev, i) => (
              <li key={i} className="flex gap-3">
                <span className="w-14 shrink-0 text-ink-3 tnum">{ev.date}</span>
                <span className="text-ink-2">{ev.headline}</span>
              </li>
            ))}
          </ul>
        </div>
      </Card>
      </div>
    </div>
  )
}

// ── Deterministic Coherence Ledger panel (engine/validate.ts output) ──
function CoherencePanel({ checks }: { checks: Analysis['integrity']['checks'] }) {
  const blocking = checks.filter((c) => c.severity === 'blocking')
  const warn = checks.filter((c) => c.severity === 'warn')
  const pass = checks.filter((c) => c.severity === 'pass')
  const tone = blocking.length ? 'neg' : warn.length ? 'warn' : 'pos'
  const dot = { neg: 'bg-neg', warn: 'bg-warn', pos: 'bg-pos' }[tone]
  const Row = ({ c }: { c: Analysis['integrity']['checks'][number] }) => (
    <div className="flex items-start gap-2.5 border-b border-line-soft/40 py-2 last:border-0">
      <span
        className={cn(
          'mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full',
          c.severity === 'blocking' ? 'bg-neg' : c.severity === 'warn' ? 'bg-warn' : 'bg-pos',
        )}
      />
      <div>
        <span className="text-sm text-ink">{c.label}</span>
        {c.detail && <span className="ml-2 text-[13px] text-ink-3">{c.detail}</span>}
      </div>
    </div>
  )
  return (
    <Card className={cn('px-6 py-5', blocking.length ? 'border-neg/40' : warn.length ? 'border-warn/30' : '')}>
      <div className="mb-3 flex items-center justify-between">
        <SectionTitle hint="deterministic checks">Coherence ledger</SectionTitle>
        <div className="flex items-center gap-2 text-[11px]">
          <span className={cn('h-2 w-2 rounded-full', dot)} />
          <span className="text-ink-2">
            {blocking.length ? `${blocking.length} blocking` : warn.length ? `${warn.length} to confirm` : 'all clear'}
          </span>
          <span className="text-ink-3">· {pass.length}/{checks.length} pass</span>
        </div>
      </div>
      <p className="mb-3 text-xs leading-relaxed text-ink-3">
        Deterministic checks run on every deal by the engine — round/raise/valuation distinctness, ownership math, multiple vs peers,
        financials↔vitals agreement, citation discipline, and completeness. The same invariants the Director reviews, enforced in code.
      </p>
      {(blocking.length > 0 || warn.length > 0) && (
        <div className="mb-3">
          {[...blocking, ...warn].map((c) => <Row key={c.id} c={c} />)}
        </div>
      )}
      {pass.length > 0 && (
        <details className="group">
          <summary className="cursor-pointer list-none text-xs text-ink-3 hover:text-ink-2">
            <span className="group-open:hidden">Show {pass.length} passing checks ▸</span>
            <span className="hidden group-open:inline">Hide passing checks ▾</span>
          </summary>
          <div className="mt-1">{pass.map((c) => <Row key={c.id} c={c} />)}</div>
        </details>
      )}
    </Card>
  )
}

export function HistoryTab({ deal, a }: { deal: Deal; a: Analysis }) {
  const { eventsFor } = useApp()
  const fmt = (iso: string) => {
    const d = new Date(iso)
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
  }
  const live = eventsFor(deal.id).map((e) => ({ when: fmt(e.at), what: e.what }))
  const seed = [
    { when: deal.createdAt, what: `Deal added and first analysed — composite ${a.composite}` },
    { when: deal.createdAt, what: `Research completed across ${deal.dataTrust.fields.length} sourced fields (data trust ${a.dataTrustScore})` },
    { when: deal.createdAt, what: `Mandate gate run vs ${a.mandateFit.dimensions.length} dimensions` },
  ]
  const events = [...live, ...seed]
  return (
    <Card className="px-6 py-5">
      <SectionTitle>Audit trail</SectionTitle>
      <ol className="relative ml-2 border-l border-line">
        {events.map((e, i) => (
          <li key={i} className="mb-4 ml-4">
            <span className="absolute -left-1.5 mt-1 h-3 w-3 rounded-full border-2 border-canvas bg-accent" />
            <div className="text-xs text-ink-3 tnum">{e.when}</div>
            <div className="text-sm text-ink-2">{e.what}</div>
          </li>
        ))}
      </ol>
    </Card>
  )
}
