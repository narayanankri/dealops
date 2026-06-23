// ───────────────────────────────────────────────────────────
// Version A — IC Memo tab. Mirrors Version B's MemoTab content (on-screen
// memo; PDF export omitted), re-skinned with the navy/serif primitives.
// ───────────────────────────────────────────────────────────
import { T, FONT, alpha } from '../theme'
import { Card, Mono, Serif, Btn } from '../uiA'
import { mult, signedPct, usdm } from '@/lib/format'
import { useApp } from '@/lib/store'
import { exportMemoPdf } from '@/lib/exportMemoPdf'
import type { Analysis, Deal } from '@/types'

const sevColor = { high: T.red, medium: T.amber, low: T.green } as const
const BASIS_TONE: Record<string, string> = { stated: T.green, inferred: T.amber, estimated: T.red }

function TrustTag({ basis, confidence }: { basis: 'stated' | 'inferred' | 'estimated'; confidence?: string }) {
  const c = BASIS_TONE[basis]
  const label = basis.charAt(0).toUpperCase() + basis.slice(1)
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '1px 6px', fontSize: 9, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', fontFamily: FONT.mono, borderRadius: 3, background: alpha(c, 0.13), color: c, border: `1px solid ${alpha(c, 0.3)}` }}>
      {label}{confidence ? ` · ${confidence}` : ''}
    </span>
  )
}
function Pill({ children, color = T.muted }: { children: React.ReactNode; color?: string }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 8px', fontSize: 10, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', fontFamily: FONT.mono, borderRadius: 4, background: alpha(color, 0.13), color, border: `1px solid ${alpha(color, 0.3)}` }}>
      {children}
    </span>
  )
}

function MemoChapter({ label }: { label: string }) {
  return (
    <div style={{ marginTop: 36, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 12 }}>
      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: T.muted, fontFamily: FONT.mono }}>{label}</span>
      <span style={{ height: 1, flex: 1, background: alpha(T.border, 0.5) }} />
    </div>
  )
}
function MemoSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 28 }}>
      <h3 style={{ margin: '0 0 12px', borderBottom: `1px solid ${alpha(T.border, 0.5)}`, paddingBottom: 6, fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: T.cyan, fontFamily: FONT.mono }}>{title}</h3>
      {children}
    </section>
  )
}
function KV({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div style={{ borderRadius: 8, background: T.cardHi, padding: '10px 12px' }}>
      <Mono>{label}</Mono>
      <div style={{ marginTop: 2, fontFamily: FONT.serif, fontSize: 18, fontWeight: 700, color: accent ? T.cyan : T.text, letterSpacing: -0.3 }}>{value}</div>
    </div>
  )
}
function KVline({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8, borderBottom: `1px solid ${alpha(T.border, 0.4)}`, padding: '2px 0' }}>
      <span style={{ fontSize: 13, color: T.muted }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 600, color: T.text, fontFamily: FONT.mono }}>{value}</span>
    </div>
  )
}
const para: React.CSSProperties = { fontSize: 13, lineHeight: 1.6, color: T.mutedHi, margin: 0 }
const kicker: React.CSSProperties = { fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: T.muted, fontFamily: FONT.mono, marginBottom: 6 }

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

export function MemoA({ deal, a }: { deal: Deal; a: Analysis }) {
  const { mandate } = useApp()
  const n = deal.narrative
  const av = a.assetValue
  const asm = deal.assumptions
  const ownership = (deal.ticketUSDm / deal.ask.askValuationUSDm) * 100
  const gAvg = Math.round(asm.revGrowthPct.reduce((s, x) => s + x, 0) / asm.revGrowthPct.length)
  const over = av.askVsValuePct > 0
  const softFields = deal.dataTrust.fields.filter((f) => f.basis !== 'stated')
  const scoreColorFor = (v: number) => (v >= 70 ? T.green : v >= 50 ? T.amber : T.red)
  const th: React.CSSProperties = { padding: '6px 8px', textAlign: 'left', fontSize: 9, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', color: T.muted, fontFamily: FONT.mono, borderBottom: `1px solid ${T.border}` }
  const tdNum: React.CSSProperties = { padding: '6px 8px', textAlign: 'right', fontFamily: FONT.mono, fontSize: 12 }

  return (
    <Card padding="36px 40px">
      {/* Letterhead */}
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24, borderBottom: `1px solid ${T.border}`, paddingBottom: 20 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: T.muted, fontFamily: FONT.mono }}>Investment Committee Memorandum · Strictly Confidential</div>
          <Serif size={28} style={{ marginTop: 6 }}>{deal.name}</Serif>
          <p style={{ marginTop: 4, fontSize: 13, color: T.mutedHi }}>{deal.oneLiner}</p>
          <p style={{ marginTop: 4, fontSize: 11, color: T.muted }}>
            {deal.sector} · {deal.geography} · {deal.stage}
            {deal.foundedYear ? ` · Founded ${deal.foundedYear}` : ''} · Proposed ticket {usdm(deal.ticketUSDm)} ({deal.instrument})
          </p>
        </div>
        <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
          <Btn variant="cyan" onClick={() => exportMemoPdf(deal, a, mandate)}>Export PDF</Btn>
          <span style={{ textAlign: 'right', fontSize: 10, color: T.muted, fontFamily: FONT.mono }}>Prepared by AI Deal Operations</span>
        </div>
      </div>

      <MemoChapter label="Executive verdict" />
      <MemoSection title="Executive summary">
        <div style={{ marginBottom: 16, borderRadius: 8, border: `1px solid ${alpha(T.border, 0.6)}`, background: T.cardHi, padding: '12px 16px', fontSize: 13, lineHeight: 1.6, color: T.mutedHi }}>
          <span style={{ fontWeight: 600, color: T.text }}>The proposal: </span>
          {usdm(deal.ticketUSDm)} {deal.instrument.toLowerCase()} for ~{ownership.toFixed(1)}% of {deal.name} at a {usdm(deal.ask.askValuationUSDm)} {deal.ask.series ? `${deal.ask.series.toLowerCase()} ` : ''}mark
          {deal.totalRaisedUSDm ? `; the company has raised ${usdm(deal.totalRaisedUSDm)} to date` : ''}. {n.icThesis}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {([['Mandate fit', a.mandateFit.score], ['Standalone merit', a.meritScore], ['Composite', a.composite], ['Data trust', a.dataTrustScore]] as [string, number][]).map(([l, v]) => (
            <div key={l} style={{ borderRadius: 8, background: T.cardHi, padding: '10px 12px', textAlign: 'center' }}>
              <Mono>{l}</Mono>
              <div style={{ marginTop: 2, fontFamily: FONT.serif, fontSize: 22, fontWeight: 700, color: scoreColorFor(v), letterSpacing: -0.3 }}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div>
            <div style={kicker}>Key considerations</div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {a.reasons.map((r, i) => <li key={i} style={{ display: 'flex', gap: 8, fontSize: 13, lineHeight: 1.55, color: T.mutedHi }}><span style={{ marginTop: 6, height: 4, width: 4, flexShrink: 0, borderRadius: '50%', background: T.cyan }} />{r}</li>)}
            </ul>
          </div>
          {a.conditions.length > 0 && (
            <div>
              <div style={kicker}>Open items to resolve</div>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {a.conditions.map((c, i) => <li key={i} style={{ display: 'flex', gap: 8, fontSize: 13, lineHeight: 1.55, color: T.mutedHi }}><span style={{ marginTop: 5, height: 7, width: 7, flexShrink: 0, borderRadius: 2, border: `1px solid ${T.amber}` }} />{c}</li>)}
              </ul>
            </div>
          )}
        </div>
      </MemoSection>

      <MemoSection title="Basis of analysis">
        <p style={para}>{basisOfAnalysis(deal, a)}</p>
      </MemoSection>

      <MemoChapter label="Thesis & company" />
      {deal.vitals && (
        <MemoSection title="Business profile">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {([['Size', deal.vitals.size], ['Growth', deal.vitals.growth], ['Unit economics', deal.vitals.unitEconomics], ['Quality', deal.vitals.quality]] as const).map(([k, v]) => {
              const nd = /not disclosed|n\/d/i.test(v.value)
              return (
                <div key={k} style={{ borderRadius: 8, border: `1px solid ${alpha(T.border, 0.6)}`, background: T.cardHi, padding: '10px 12px' }}>
                  <Mono color={T.mutedHi}>{k}</Mono>
                  <div style={{ marginTop: 4, fontFamily: FONT.serif, fontWeight: 700, color: nd ? T.muted : T.text, fontSize: nd ? 13 : 16, fontStyle: nd ? 'italic' : 'normal' }}>{v.value}</div>
                  <div style={{ marginTop: 2, fontSize: 10, color: T.muted }}>{v.label}</div>
                </div>
              )
            })}
          </div>
        </MemoSection>
      )}

      <MemoSection title="Company, market & business model">
        <p style={para}>{n.profile}</p>
        <p style={{ ...para, marginTop: 10 }}><span style={{ fontWeight: 600, color: T.text }}>Market. </span>{n.marketRead}</p>
        <p style={{ ...para, marginTop: 10 }}><span style={{ fontWeight: 600, color: T.text }}>Regulatory. </span>{n.regulatory}</p>
      </MemoSection>

      {n.marketContext && (
        <MemoSection title="Market context & opportunity">
          <p style={para}>{n.marketContext}</p>
        </MemoSection>
      )}

      {n.moat && (
        <MemoSection title="Competitive landscape & moat">
          <div style={{ marginBottom: 12 }}>
            <div style={kicker}>Moat pillars</div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {n.moat.pillars.map((p, i) => <li key={i} style={{ display: 'flex', gap: 8, fontSize: 13, lineHeight: 1.55, color: T.mutedHi }}><span style={{ marginTop: 6, height: 6, width: 6, flexShrink: 0, borderRadius: '50%', background: T.green }} />{p}</li>)}
            </ul>
          </div>
          {n.moat.competitors.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <div style={kicker}>Competitive set</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 32px' }}>
                {n.moat.competitors.map((c) => (
                  <div key={c.name} style={{ fontSize: 13 }}><span style={{ fontWeight: 600, color: T.text }}>{c.name}. </span><span style={{ color: T.muted }}>{c.note}</span></div>
                ))}
              </div>
            </div>
          )}
          <p style={para}><span style={{ fontWeight: 600, color: T.text }}>Trajectory. </span>{n.moat.trajectory}</p>
          <div style={{ marginTop: 8 }}>
            <div style={kicker}>How the moat could erode</div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {n.moat.erosionScenarios.map((e, i) => <li key={i} style={{ display: 'flex', gap: 8, fontSize: 13, lineHeight: 1.55, color: T.mutedHi }}><span style={{ marginTop: 6, height: 6, width: 6, flexShrink: 0, borderRadius: '50%', background: T.red }} />{e}</li>)}
            </ul>
          </div>
        </MemoSection>
      )}

      {n.recentDevelopments && (
        <MemoSection title="Recent developments">
          <p style={para}>{n.recentDevelopments}</p>
        </MemoSection>
      )}

      <MemoSection title="Investment case">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div>
            <div style={{ ...kicker, color: T.green }}>The case for</div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {n.caseFor.map((c, i) => <li key={i} style={{ display: 'flex', gap: 8, fontSize: 13, lineHeight: 1.55, color: T.mutedHi }}><span style={{ marginTop: 6, height: 6, width: 6, flexShrink: 0, borderRadius: '50%', background: T.green }} />{c}</li>)}
            </ul>
          </div>
          <div>
            <div style={{ ...kicker, color: T.red }}>The case against</div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {n.caseAgainst.map((c, i) => <li key={i} style={{ display: 'flex', gap: 8, fontSize: 13, lineHeight: 1.55, color: T.mutedHi }}><span style={{ marginTop: 6, height: 6, width: 6, flexShrink: 0, borderRadius: '50%', background: T.red }} />{c}</li>)}
            </ul>
          </div>
        </div>
      </MemoSection>

      {(n.thesisDrivers?.length || n.thesisBreakers?.length) && (
        <MemoSection title="Investment thesis">
          <p style={para}>{n.icThesis}</p>
          {n.thesisDrivers?.length ? (
            <div style={{ marginTop: 12 }}>
              <div style={kicker}>Return drivers</div>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {n.thesisDrivers.map((x, i) => <li key={i} style={{ display: 'flex', gap: 8, fontSize: 13, lineHeight: 1.55, color: T.mutedHi }}><span style={{ color: T.cyan, fontFamily: FONT.mono }}>{i + 1}.</span>{x}</li>)}
              </ul>
            </div>
          ) : null}
          {n.thesisBreakers?.length ? (
            <div style={{ marginTop: 12 }}>
              <div style={kicker}>What would have to be true for the thesis to break</div>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {n.thesisBreakers.map((x, i) => <li key={i} style={{ display: 'flex', gap: 8, fontSize: 13, lineHeight: 1.55, color: T.mutedHi }}><span style={{ marginTop: 5, height: 7, width: 7, flexShrink: 0, borderRadius: 2, border: `1px solid ${T.red}` }} />{x}</li>)}
              </ul>
            </div>
          ) : null}
        </MemoSection>
      )}

      <MemoChapter label="Financials & valuation" />
      <MemoSection title="Financial profile">
        <SummaryFinancials financials={deal.financials} />
        {n.qualityOfEarnings && <p style={{ ...para, marginTop: 12 }}><span style={{ fontWeight: 600, color: T.text }}>Quality of earnings. </span>{n.qualityOfEarnings}</p>}
      </MemoSection>

      <MemoSection title="Valuation — what the asset is worth">
        <p style={{ ...para, marginBottom: 12 }}>{n.valuationVerdict}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          <KV label="Intrinsic (DCF)" value={usdm(av.dcfEquityUSDm)} />
          <KV label="Market (comps, mid)" value={usdm(av.compsEquity.mid)} />
          <KV label="Reconciled" value={usdm(av.reconciledUSDm)} accent />
        </div>
        <div style={{ marginTop: 14, borderRadius: 8, padding: '10px 16px', background: over ? alpha(T.red, 0.1) : alpha(T.green, 0.1), fontSize: 13 }}>
          <span style={{ fontWeight: 700, fontFamily: FONT.mono, color: over ? T.red : T.green }}>{signedPct(av.askVsValuePct)}</span>{' '}
          <span style={{ color: T.mutedHi }}>the ask of {usdm(deal.ask.askValuationUSDm)} is {over ? 'above' : 'below'} the reconciled value ({mult(av.impliedEVRevenue)} implied EV/Revenue).</span>
        </div>
        <div style={{ marginTop: 16 }}>
          <div style={kicker}>Comparable companies</div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={th}>Peer</th>
                <th style={{ ...th, textAlign: 'right' }}>EV/Rev</th>
                <th style={{ ...th, textAlign: 'right' }}>EV/EBITDA</th>
                <th style={{ ...th, textAlign: 'right' }}>Growth</th>
                <th style={{ ...th, textAlign: 'right' }}>Margin</th>
              </tr>
            </thead>
            <tbody>
              {deal.peers.map((p) => (
                <tr key={p.name} style={{ borderBottom: `1px solid ${alpha(T.border, 0.5)}` }}>
                  <td style={{ padding: '6px 8px', fontSize: 13, color: T.mutedHi }}>{p.name} <span style={{ fontSize: 10, color: T.muted }}>{p.public ? 'Public' : 'Pvt'}</span></td>
                  <td style={{ ...tdNum, color: T.text }}>{p.evRevenue != null ? mult(p.evRevenue) : '—'}</td>
                  <td style={{ ...tdNum, color: T.mutedHi }}>{p.evEbitda != null ? mult(p.evEbitda) : '—'}</td>
                  <td style={{ ...tdNum, color: T.mutedHi }}>{p.revGrowthPct != null ? `${p.revGrowthPct}%` : '—'}</td>
                  <td style={{ ...tdNum, color: T.mutedHi }}>{p.ebitdaMarginPct != null ? `${p.ebitdaMarginPct}%` : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </MemoSection>

      <MemoSection title="Returns — what the firm would earn">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={th}>Scenario</th>
              <th style={{ ...th, textAlign: 'right' }}>IRR</th>
              <th style={{ ...th, textAlign: 'right' }}>MOIC</th>
              <th style={{ ...th, textAlign: 'right' }}>Exit equity</th>
              <th style={{ ...th, textAlign: 'right' }}>vs {a.returns.hurdlePct}% hurdle</th>
            </tr>
          </thead>
          <tbody>
            {a.returns.scenarios.map((s) => (
              <tr key={s.name} style={{ borderBottom: `1px solid ${alpha(T.border, 0.5)}` }}>
                <td style={{ padding: '6px 8px', fontSize: 13, color: T.mutedHi, textTransform: 'capitalize' }}>{s.name}</td>
                <td style={{ ...tdNum, fontWeight: 600, color: s.clearsHurdle ? T.green : T.red }}>{s.irrPct}%</td>
                <td style={{ ...tdNum, color: T.mutedHi }}>{mult(s.moic, 2)}</td>
                <td style={{ ...tdNum, color: T.mutedHi }}>{usdm(s.exitEquityUSDm)}</td>
                <td style={{ ...tdNum, fontSize: 11, color: s.clearsHurdle ? T.green : T.red }}>{s.clearsHurdle ? 'clears' : 'below'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ marginTop: 8, fontSize: 11, color: T.muted }}>{a.returns.basis}</p>
        <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px 24px' }}>
          <KVline label="Rev. growth (avg)" value={`${gAvg}%`} />
          <KVline label="EBITDA margin" value={`${asm.ebitdaMarginPct[0]}% → ${asm.ebitdaMarginPct[asm.ebitdaMarginPct.length - 1]}%`} />
          <KVline label="WACC" value={`${asm.waccPct}%`} />
          <KVline label="Terminal growth" value={`${asm.terminalGrowthPct}%`} />
          <KVline label="Exit EV/Revenue" value={mult(asm.exitEVRevenue)} />
          <KVline label="Hold" value={`${asm.holdYears}y`} />
        </div>
        {n.scenarioNarratives && (
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {(['bear', 'base', 'bull'] as const).map((k) => {
              const note = n.scenarioNarratives?.[k]
              const sc = a.returns.scenarios.find((s) => s.name === k)
              if (!note) return null
              return (
                <p key={k} style={{ fontSize: 13, lineHeight: 1.55, color: T.muted, margin: 0 }}>
                  <span style={{ fontWeight: 700, textTransform: 'uppercase', color: sc?.clearsHurdle ? T.green : T.red }}>{k}</span>
                  <span style={{ color: T.muted }}> ({sc?.irrPct}% IRR · {mult(sc?.moic ?? 0, 2)}). </span>
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
          <div style={{ marginBottom: 12, borderRadius: 8, border: `1px solid ${alpha(T.red, 0.4)}`, background: alpha(T.red, 0.08), padding: '10px 16px', fontSize: 13, color: T.red }}>
            <span style={{ fontWeight: 700 }}>Red-line breach: </span>{a.mandateFit.redLineBreaches.join('; ')}
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 32px' }}>
          {a.mandateFit.dimensions.map((d) => (
            <div key={d.key} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13 }}>
              <span style={{ marginTop: 6, height: 6, width: 6, flexShrink: 0, borderRadius: '50%', background: d.status === 'pass' ? T.green : d.status === 'soft' ? T.amber : T.red }} />
              <span style={{ color: T.mutedHi }}><span style={{ fontWeight: 600, color: T.text }}>{d.label} ({d.score}). </span>{d.takeaway}</span>
            </div>
          ))}
        </div>
        <p style={{ ...para, marginTop: 12 }}>
          <span style={{ fontWeight: 600, color: T.text }}>Concentration. </span>
          {usdm(deal.ticketUSDm)} is {a.mandateFit.concentration.pctOfFund}% of the fund vs a {a.mandateFit.concentration.capPct}% cap — {a.mandateFit.concentration.takeaway}
        </p>
      </MemoSection>

      <MemoSection title="Risk register">
        <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: T.muted, fontFamily: FONT.mono }}>Severity mix:</span>
          {(['high', 'medium', 'low'] as const).map((sev) => {
            const c = n.riskRegister.filter((r) => r.severity === sev).length
            return <Pill key={sev} color={sevColor[sev]}>{c} {sev}</Pill>
          })}
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr>
              <th style={th}>Risk</th>
              <th style={th}>Sev</th>
              <th style={th}>Likely</th>
              <th style={th}>Impact</th>
              <th style={th}>Mitigation</th>
              <th style={th}>Monitoring</th>
            </tr>
          </thead>
          <tbody>
            {n.riskRegister.map((r, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${alpha(T.border, 0.5)}`, verticalAlign: 'top' }}>
                <td style={{ padding: '8px', fontWeight: 600, color: T.text }}>{r.risk}</td>
                <td style={{ padding: '8px' }}><Pill color={sevColor[r.severity]}>{r.severity}</Pill></td>
                <td style={{ padding: '8px', textTransform: 'capitalize', color: T.muted }}>{r.likelihood}</td>
                <td style={{ padding: '8px', color: T.muted }}>{r.impact}</td>
                <td style={{ padding: '8px', color: T.mutedHi }}>{r.mitigation}</td>
                <td style={{ padding: '8px', color: T.muted }}>{r.monitoring}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </MemoSection>

      <MemoSection title="Leadership & ownership">
        <div>
          <div style={kicker}>Leadership</div>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {n.leadership.map((p, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, fontSize: 13 }}>
                <span style={{ color: T.text }}>{p.name}</span>
                <span style={{ flexShrink: 0, fontSize: 11, color: T.muted }}>{p.role}</span>
              </li>
            ))}
          </ul>
          <p style={{ marginTop: 8, fontSize: 11, lineHeight: 1.5, color: T.muted }}>{n.leadershipGaps}</p>
        </div>
      </MemoSection>

      <MemoSection title="Use of funds">
        {n.useOfFundsBreakdown?.length ? (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                <th style={th}>Category</th>
                <th style={{ ...th, textAlign: 'right' }}>%</th>
                <th style={th}>Rationale</th>
              </tr>
            </thead>
            <tbody>
              {n.useOfFundsBreakdown.map((u) => (
                <tr key={u.category} style={{ borderBottom: `1px solid ${alpha(T.border, 0.5)}`, verticalAlign: 'top' }}>
                  <td style={{ padding: '8px', fontWeight: 600, color: T.text }}>{u.category}</td>
                  <td style={{ ...tdNum, color: T.mutedHi }}>{u.pct}%</td>
                  <td style={{ padding: '8px', color: T.muted }}>{u.rationale}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={para}>{n.useOfFunds}</p>
        )}
      </MemoSection>

      <MemoSection title="Proposed terms">
        {n.termSheet ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 13 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 32px' }}>
              <KVline label="Instrument" value={n.termSheet.instrument} />
              <KVline label="Indicative ownership" value={n.termSheet.ownership} />
            </div>
            <p style={{ ...para }}><span style={{ fontWeight: 600, color: T.text }}>Board & governance. </span>{n.termSheet.boardGovernance}</p>
            <div>
              <div style={kicker}>Preferential rights sought</div>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>{n.termSheet.preferentialRights.map((x, i) => <li key={i} style={{ display: 'flex', gap: 8, color: T.mutedHi }}><span style={{ color: T.muted }}>·</span>{x}</li>)}</ul>
            </div>
            <div>
              <div style={kicker}>Conditions precedent</div>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>{n.termSheet.conditionsPrecedent.map((x, i) => <li key={i} style={{ display: 'flex', gap: 8, color: T.mutedHi }}><span style={{ marginTop: 5, height: 7, width: 7, flexShrink: 0, borderRadius: 2, border: `1px solid ${T.amber}` }} />{x}</li>)}</ul>
            </div>
            <p style={{ fontSize: 11, color: T.muted }}>Illustrative and for discussion — not agreed terms.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 32px', fontSize: 13 }}>
            {n.proposedTerms.map((t) => (
              <div key={t.label} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, borderBottom: `1px solid ${alpha(T.border, 0.5)}`, padding: '4px 0' }}>
                <span style={{ color: T.muted }}>{t.label}</span>
                <span style={{ textAlign: 'right', color: T.mutedHi }}>{t.value}</span>
              </div>
            ))}
          </div>
        )}
      </MemoSection>

      <MemoChapter label="Provenance" />
      <MemoSection title="Data provenance & confidence">
        <p style={{ ...para, marginBottom: 12 }}>
          Data-trust score <span style={{ fontWeight: 700, fontFamily: FONT.mono, color: scoreColorFor(a.dataTrustScore) }}>{a.dataTrustScore}/100</span>. The figures the committee should weigh as soft — inferred or estimated rather than disclosed:
        </p>
        {softFields.length ? (
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {softFields.map((f) => (
              <li key={f.label} style={{ display: 'flex', gap: 8, fontSize: 13, color: T.mutedHi }}>
                <TrustTag basis={f.basis} confidence={f.confidence} />
                <span><span style={{ fontWeight: 600, color: T.text }}>{f.label}. </span>{f.method ?? f.source}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ fontSize: 13, color: T.muted }}>All material figures are sourced/stated.</p>
        )}
        {n.limitations.length > 0 && (
          <div style={{ marginTop: 12 }}>
            <div style={kicker}>Limitations</div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {n.limitations.map((l, i) => <li key={i} style={{ fontSize: 13, color: T.muted }}>→ {l}</li>)}
            </ul>
          </div>
        )}
      </MemoSection>

      <p style={{ marginTop: 32, borderTop: `1px solid ${T.border}`, paddingTop: 16, fontSize: 11, lineHeight: 1.55, color: T.muted }}>
        Prepared by AI Deal Operations for review by a qualified professional. This is analyst work product to inform the committee's decision — not investment advice or a recommendation. Every figure carries a source or a stated derivation; verify before relying.
      </p>
    </Card>
  )
}

// Compact financials table for the memo (matches Version B's PnLTable feed).
function SummaryFinancials({ financials }: { financials?: { years: (string | number)[]; revenue: number[]; ebitda: number[] } }) {
  if (!financials) return <div style={{ fontSize: 13, color: T.muted }}>No financials available.</div>
  const { years, revenue, ebitda } = financials
  const margin = revenue.map((r, i) => (r ? (ebitda[i] / r) * 100 : 0))
  const growth = revenue.map((r, i) => (i === 0 ? null : (r / revenue[i - 1] - 1) * 100))
  const tdNum: React.CSSProperties = { padding: '6px 12px', textAlign: 'right', fontFamily: FONT.mono, fontSize: 12 }
  const Row = ({ label, cells, color = T.text }: { label: string; cells: (string | null)[]; color?: string }) => (
    <tr style={{ borderTop: `1px solid ${alpha(T.border, 0.5)}` }}>
      <td style={{ padding: '6px 12px 6px 0', fontSize: 13, color: T.mutedHi }}>{label}</td>
      {cells.map((c, i) => <td key={i} style={{ ...tdNum, color }}>{c ?? '—'}</td>)}
    </tr>
  )
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <td style={{ paddingBottom: 6, fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: T.muted, fontFamily: FONT.mono }}>$m</td>
          {years.map((y) => <td key={String(y)} style={{ paddingBottom: 6, paddingLeft: 12, textAlign: 'right', fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: T.muted, fontFamily: FONT.mono }}>{y}</td>)}
        </tr>
      </thead>
      <tbody>
        <Row label="Revenue" cells={revenue.map((r) => Math.round(r).toLocaleString())} />
        <Row label="Growth %" cells={growth.map((g) => (g === null ? null : `${g >= 0 ? '+' : ''}${g.toFixed(0)}%`))} color={T.muted} />
        <Row label="EBITDA" cells={ebitda.map((e) => Math.round(e).toLocaleString())} />
        <Row label="EBITDA margin %" cells={margin.map((m) => `${m.toFixed(0)}%`)} color={T.muted} />
      </tbody>
    </table>
  )
}
