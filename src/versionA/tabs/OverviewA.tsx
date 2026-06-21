// ───────────────────────────────────────────────────────────
// Version A — Overview tab. Same data/copy as Version B's OverviewTab,
// re-skinned with the navy/serif primitives.
// ───────────────────────────────────────────────────────────
import { T, FONT, alpha } from '../theme'
import { Card, Mono, SectionTitle } from '../uiA'
import { usdm, mult } from '@/lib/format'
import type { Analysis, BusinessVitals, Deal, RevenueLine, TrustField } from '@/types'

const trendGlyph = { up: '▲', down: '▼', flat: '—' } as const
const trendTone = { up: T.green, down: T.red, flat: T.muted } as const

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

function Cite({ source, url }: { source?: string; url?: string }) {
  if (!source && !url) return null
  if (url)
    return (
      <a href={url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} style={{ fontSize: 10, fontWeight: 600, color: alpha(T.cyan, 0.85), textDecoration: 'none', fontFamily: FONT.mono }}>
        {source ?? 'source'} ↗
      </a>
    )
  return <span style={{ fontSize: 10, color: T.muted, fontFamily: FONT.mono }}>{source}</span>
}

const BASIS_TONE: Record<string, string> = { stated: T.green, inferred: T.amber, estimated: T.red }
function TrustTag({ basis, confidence }: { basis: 'stated' | 'inferred' | 'estimated'; confidence?: string }) {
  const c = BASIS_TONE[basis]
  const label = basis.charAt(0).toUpperCase() + basis.slice(1)
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '1px 6px', fontSize: 9, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', fontFamily: FONT.mono, borderRadius: 3, background: alpha(c, 0.13), color: c, border: `1px solid ${alpha(c, 0.3)}` }}>
      {label}{confidence ? ` · ${confidence}` : ''}
    </span>
  )
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <Mono style={{ marginBottom: 5 }}>{title}</Mono>
      <p style={{ fontSize: 13, lineHeight: 1.55, color: T.mutedHi, margin: 0 }}>{children}</p>
    </div>
  )
}

function RevenueLines({ lines }: { lines: RevenueLine[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {lines.map((l) => (
        <div key={l.name}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{l.name}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {l.sharePct != null && <span style={{ fontSize: 11, color: T.muted, fontFamily: FONT.mono }}>~{l.sharePct}% of rev</span>}
              <TrustTag basis={l.basis} />
              <Cite source={l.source} url={l.url} />
            </span>
          </div>
          {l.sharePct != null && (
            <div style={{ marginTop: 6, height: 6, width: '100%', borderRadius: 3, background: T.border, overflow: 'hidden' }}>
              <div style={{ height: '100%', borderRadius: 3, background: T.cyan, width: `${Math.max(2, l.sharePct)}%` }} />
            </div>
          )}
          <p style={{ marginTop: 6, fontSize: 13, lineHeight: 1.55, color: T.muted }}>{l.description}</p>
        </div>
      ))}
    </div>
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
    <Card padding="18px 22px">
      <SectionTitle kicker="size · growth · unit economics · quality" title="Business vitals" />
      <div>
        {items.map(({ k, v }, idx) => {
          const nd = /not disclosed|n\/d/i.test(v.value)
          return (
            <div key={k} style={{ padding: '14px 0', borderTop: idx === 0 ? 'none' : `1px solid ${T.border}` }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                <div style={{ minWidth: 0 }}>
                  <Mono color={T.mutedHi}>{k}</Mono>
                  <div style={{ marginTop: 2, fontSize: 11, color: T.muted }}>{v.label}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', flexShrink: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                    <span style={{ fontFamily: FONT.serif, fontWeight: 700, color: nd ? T.muted : T.text, fontSize: nd ? 13 : 22, fontStyle: nd ? 'italic' : 'normal' }}>{v.value}</span>
                    {v.trend && !nd && <span style={{ fontSize: 13, color: trendTone[v.trend] }}>{trendGlyph[v.trend]}</span>}
                  </div>
                  {!nd && (
                    <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <TrustTag basis={v.basis} />
                      <Cite source={v.source} url={v.url} />
                    </div>
                  )}
                </div>
              </div>
              {v.note && <p style={{ marginTop: 8, fontSize: 11, lineHeight: 1.5, color: T.muted }}>{v.note}</p>}
            </div>
          )
        })}
      </div>
    </Card>
  )
}

const shariaMeta = {
  compliant: { label: 'Shariah-compliant', color: T.green },
  'non-compliant': { label: 'Non-compliant', color: T.red },
  mixed: { label: 'Mixed', color: T.amber },
  'n/a': { label: 'Not screened', color: T.muted },
} as const

function ShariaCard({ screen }: { screen: NonNullable<Deal['shariaScreen']> }) {
  const m = shariaMeta[screen.status]
  return (
    <Card padding="18px 22px">
      <SectionTitle kicker="GCC/MENA mandate screen" title="Shariah screen" />
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', marginBottom: 10, borderRadius: 20, fontSize: 12, fontWeight: 600, background: alpha(m.color, 0.13), color: m.color }}>
        <span style={{ height: 6, width: 6, borderRadius: '50%', background: m.color }} />
        {m.label}
      </div>
      <p style={{ fontSize: 13, lineHeight: 1.55, color: T.muted, margin: 0 }}>{screen.note}</p>
      {(screen.source || screen.url) && <div style={{ marginTop: 6 }}><Cite source={screen.source} url={screen.url} /></div>}
    </Card>
  )
}

function ValuationSnapshot({ deal }: { deal: Deal }) {
  const asm = deal.assumptions
  const last = deal.roundHistory?.[0]
  const currentVal = deal.currentValuationUSDm ?? deal.ask.askValuationUSDm
  const impliedEVRev = (currentVal + asm.netDebtUSDm) / asm.baseRevenueUSDm
  const Row = ({ label, value, sub }: { label: string; value: string; sub?: string }) => (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, padding: '8px 0', borderBottom: `1px solid ${alpha(T.border, 0.6)}` }}>
      <span style={{ fontSize: 13, color: T.muted }}>{label}</span>
      <span style={{ textAlign: 'right' }}>
        <span style={{ fontWeight: 600, color: T.text, fontFamily: FONT.mono, fontSize: 13 }}>{value}</span>
        {sub && <span style={{ display: 'block', fontSize: 11, color: T.muted }}>{sub}</span>}
      </span>
    </div>
  )
  const askAmt = deal.ask.raisingUSDm
  return (
    <Card padding="18px 22px">
      <SectionTitle title="Fundraising" />
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
          <Row label="Current valuation" value={usdm(deal.currentValuationUSDm)} sub={deal.currentValuationUSDm === deal.ask.askValuationUSDm ? 'latest mark = the ask' : 'latest mark'} />
        )}
        {deal.totalRaisedUSDm != null && <Row label="Total raised to date" value={usdm(deal.totalRaisedUSDm)} />}
        <Row label="Implied EV / Revenue" value={mult(impliedEVRev)} />
      </div>
    </Card>
  )
}

function DataTrustCard({ deal, a }: { deal: Deal; a: Analysis }) {
  const c = a.dataTrustScore >= 70 ? T.green : a.dataTrustScore >= 55 ? T.amber : T.red
  const methodLabel = (f: TrustField) => (f.basis === 'estimated' ? 'Estimated: ' : 'Inferred: ')
  return (
    <Card padding="18px 22px">
      <SectionTitle kicker="source · basis" title="Data trust" />
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 12 }}>
        <span style={{ fontFamily: FONT.serif, fontWeight: 700, fontSize: 34, color: c, letterSpacing: -0.5 }}>{a.dataTrustScore}</span>
        <span style={{ fontSize: 13, color: T.muted }}>/ 100</span>
      </div>
      <p style={{ marginBottom: 14, fontSize: 11, lineHeight: 1.5, color: T.muted }}>
        The share of this deal that is disclosed fact versus estimate. Each field carries its source, or — where estimated — its derivation.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {deal.dataTrust.fields.map((f) => (
          <div key={f.label} style={{ borderBottom: `1px solid ${alpha(T.border, 0.6)}`, paddingBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              <span style={{ fontSize: 13, color: T.mutedHi }}>{f.label}</span>
              <TrustTag basis={f.basis} confidence={f.confidence} />
            </div>
            {f.url ? (
              <Cite source={f.source ?? 'source'} url={f.url} />
            ) : f.method ? (
              <p style={{ marginTop: 2, fontSize: 11, lineHeight: 1.5, color: T.muted }}>
                <span style={{ fontWeight: 600, color: BASIS_TONE[f.basis] }}>{methodLabel(f)}</span>
                {f.method}
              </p>
            ) : f.source ? (
              <span style={{ fontSize: 10, color: T.muted }}>{f.source}</span>
            ) : null}
          </div>
        ))}
      </div>
    </Card>
  )
}

function BarriersCard({ barriers }: { barriers: NonNullable<Deal['narrative']['barriers']> }) {
  const lvl = { high: 3, medium: 2, low: 1 } as const
  return (
    <Card padding="18px 22px">
      <SectionTitle kicker="height of the wall protecting the position" title="Entry barriers & moat" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {barriers.map((b) => (
          <div key={b.axis} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, paddingTop: 2, flexShrink: 0 }} title={`${b.rating} barrier`}>
              {[0, 1, 2].map((i) => (
                <span key={i} style={{ width: 4, borderRadius: 2, background: i < lvl[b.rating] ? T.cyan : T.border, height: i === 0 ? 8 : i === 1 ? 12 : 16 }} />
              ))}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{b.axis}</span>
                <Mono>{b.rating}</Mono>
              </div>
              <p style={{ marginTop: 2, fontSize: 13, lineHeight: 1.55, color: T.muted }}>{b.note}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

export function OverviewA({ deal, a }: { deal: Deal; a: Analysis }) {
  const n = deal.narrative
  const news = [...deal.news].sort((x, y) => newsKey(y.date) - newsKey(x.date))
  const metrics = deal.headlineMetrics.filter((m) => !/founded|headquarter|^hq$/i.test(m.label))
  const own = (deal.ticketUSDm / deal.ask.askValuationUSDm) * 100
  const last = deal.roundHistory?.[0]
  const lastBit = last?.postMoneyUSDm != null ? ` · vs ${usdm(last.postMoneyUSDm)} ${last.series}` : deal.ask.lastRoundUSDm != null ? ` · vs ${usdm(deal.ask.lastRoundUSDm)} prior` : ''

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Why now banner */}
      <Card accent={T.cyan} padding="16px 22px">
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '4px 8px', fontSize: 13 }}>
          <Mono color={T.cyan}>The proposal</Mono>
          <span style={{ color: T.mutedHi }}>
            {usdm(deal.ticketUSDm)} {deal.instrument.toLowerCase()} for ~{own.toFixed(1)}% of {deal.name} at {usdm(deal.ask.askValuationUSDm)}
            {deal.ask.series ? ` ${deal.ask.series}` : ''}
            {lastBit}
          </span>
        </div>
        {n.whyNow && (
          <p style={{ marginTop: 8, fontSize: 13, lineHeight: 1.55, color: T.mutedHi }}>
            <span style={{ fontWeight: 600, color: T.text }}>Why now. </span>
            {n.whyNow}
          </p>
        )}
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Card padding="20px 24px">
            <SectionTitle title="Company" />
            <p style={{ fontSize: 15, lineHeight: 1.6, color: T.mutedHi, margin: 0 }}>{n.profile}</p>
            <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Block title="Market read">{n.marketRead}</Block>
              <Block title="Regulatory standing">{n.regulatory}</Block>
            </div>
          </Card>

          <Card padding="20px 24px">
            <SectionTitle title="Headline metrics" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px 24px' }}>
              {metrics.map((m) => (
                <div key={m.label}>
                  <Mono>{m.label}</Mono>
                  <div style={{ marginTop: 2, display: 'flex', alignItems: 'baseline', gap: 6 }}>
                    <span style={{ fontSize: 18, fontWeight: 700, color: T.text, fontFamily: FONT.serif, letterSpacing: -0.3 }}>{m.value}</span>
                    {m.trend && <span style={{ fontSize: 12, color: trendTone[m.trend] }}>{trendGlyph[m.trend]}</span>}
                  </div>
                  <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <TrustTag basis={m.basis} />
                    <Cite source={m.source} url={m.url} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {deal.vitals && <BusinessVitalsCard vitals={deal.vitals} />}

          <Card padding="20px 24px">
            <SectionTitle kicker="by line · share of revenue" title="Revenue model" />
            {n.revenueLines?.length ? <RevenueLines lines={n.revenueLines} /> : <p style={{ fontSize: 13, lineHeight: 1.55, color: T.mutedHi, margin: 0 }}>{n.revenueModel}</p>}
          </Card>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <Card padding="20px 24px">
              <SectionTitle title="The case for" />
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {n.caseFor.map((c, i) => (
                  <li key={i} style={{ display: 'flex', gap: 8, fontSize: 13, lineHeight: 1.55, color: T.mutedHi }}>
                    <span style={{ marginTop: 6, height: 6, width: 6, flexShrink: 0, borderRadius: '50%', background: T.green }} />
                    {c}
                  </li>
                ))}
              </ul>
            </Card>
            <Card padding="20px 24px">
              <SectionTitle title="The case against" />
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {n.caseAgainst.map((c, i) => (
                  <li key={i} style={{ display: 'flex', gap: 8, fontSize: 13, lineHeight: 1.55, color: T.mutedHi }}>
                    <span style={{ marginTop: 6, height: 6, width: 6, flexShrink: 0, borderRadius: '50%', background: T.red }} />
                    {c}
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {n.barriers?.length ? <BarriersCard barriers={n.barriers} /> : null}

          <Card padding="20px 24px">
            <SectionTitle title="Recent news & events" />
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {news.map((ev, i) => (
                <li key={i} style={{ display: 'flex', gap: 12, fontSize: 13 }}>
                  <span style={{ width: 64, flexShrink: 0, color: T.muted, fontFamily: FONT.mono, fontSize: 12 }}>{ev.date}</span>
                  <span style={{ color: T.mutedHi }}>{ev.headline}</span>
                  <span style={{ marginLeft: 'auto', flexShrink: 0 }}><Cite source={ev.source} url={ev.url} /></span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <ValuationSnapshot deal={deal} />
          {deal.shariaScreen && <ShariaCard screen={deal.shariaScreen} />}
          <DataTrustCard deal={deal} a={a} />
        </div>
      </div>
    </div>
  )
}
