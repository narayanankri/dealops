// ───────────────────────────────────────────────────────────
// Version A — Comparables tab. Mirrors Version B's CompsTab: an interactive
// peer set whose included EV/Revenue multiples drive a live equity range.
// ───────────────────────────────────────────────────────────
import { useState } from 'react'
import { T, FONT, alpha } from '../theme'
import { Card, Mono, SectionTitle, RangeBarA } from '../uiA'
import { mult, signedPct, usdm } from '@/lib/format'
import { compsEquityFrom } from '@/engine'
import type { Analysis, Deal } from '@/types'

const BASIS_TONE: Record<string, string> = { stated: T.green, inferred: T.amber, estimated: T.red }
function TrustTag({ basis }: { basis: 'stated' | 'inferred' | 'estimated' }) {
  const c = BASIS_TONE[basis]
  const label = basis.charAt(0).toUpperCase() + basis.slice(1)
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '1px 6px', fontSize: 9, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', fontFamily: FONT.mono, borderRadius: 3, background: alpha(c, 0.13), color: c, border: `1px solid ${alpha(c, 0.3)}` }}>
      {label}
    </span>
  )
}

function Step({ k, v, accent, strong }: { k: string; v: string; accent?: boolean; strong?: boolean }) {
  return (
    <span style={{ display: 'inline-flex', flexDirection: 'column', lineHeight: 1.15 }}>
      <span style={{ fontFamily: FONT.mono, fontWeight: 700, color: accent ? T.cyan : T.text, fontSize: strong ? 15 : 13 }}>{v}</span>
      <span style={{ fontSize: 10, color: T.muted }}>{k}</span>
    </span>
  )
}
const Op = ({ children }: { children: React.ReactNode }) => <span style={{ padding: '0 4px', color: T.muted }}>{children}</span>

export function CompsA({ deal }: { deal: Deal; a: Analysis }) {
  const baseRev = deal.assumptions.baseRevenueUSDm
  const netDebt = deal.assumptions.netDebtUSDm
  const m0 = deal.assumptions.ebitdaMarginPct?.[0]
  const baseEbitda = m0 != null ? Math.round((baseRev * m0) / 100) : null

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
      const nx = new Set(prev)
      if (nx.has(name)) nx.delete(name)
      else nx.add(name)
      return nx
    })

  const ebPeers = included.filter((p) => p.evEbitda != null)
  const ebBuild = baseEbitda && ebPeers.length >= 2 ? compsEquityFrom(ebPeers.map((p) => p.evEbitda as number), baseEbitda, netDebt) : null
  const evMid = Math.round(build.median * baseRev)
  const ndWord = netDebt >= 0 ? 'net debt' : 'net cash'

  const th: React.CSSProperties = { padding: '10px 12px', fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: T.muted, fontFamily: FONT.mono, borderBottom: `1px solid ${T.border}` }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* 1 — the range + ask */}
      <Card padding="20px 24px">
        <SectionTitle kicker="median peer multiple · ask marked against it" title="Valuation vs the market" />
        {enough ? (
          <>
            <RangeBarA low={build.low} base={build.mid} high={build.high} fmt={usdm} />
            <div style={{ marginTop: 8, padding: '12px 16px', borderRadius: 8, background: over ? alpha(T.red, 0.1) : alpha(T.green, 0.1) }}>
              <span style={{ fontSize: 16, fontWeight: 700, fontFamily: FONT.mono, color: over ? T.red : T.green }}>{signedPct(askVsMid)}</span>{' '}
              <span style={{ fontSize: 13, color: T.mutedHi }}>
                the ask ({usdm(ask)}) sits {over ? 'above' : 'below'} the median peer-implied equity value ({usdm(build.mid)})
                {over ? ' — a premium the current comp set does not support.' : ' — within the range the comp set supports.'}
              </span>
            </div>
          </>
        ) : (
          <p style={{ padding: '24px 0', textAlign: 'center', fontSize: 13, color: T.muted }}>Select at least one peer below to build a comparables range.</p>
        )}
      </Card>

      {/* 2 — the arithmetic */}
      {enough && (
        <Card padding="20px 24px">
          <SectionTitle kicker="every step — recomputed live as peers are included / excluded" title="How the comps value is built" />
          <div style={{ marginBottom: 16, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px 24px', fontSize: 13 }}>
            <span style={{ color: T.muted }}>EV/Revenue across {included.length} peer{included.length === 1 ? '' : 's'}:</span>
            <span style={{ color: T.mutedHi }}>P25 <span style={{ fontWeight: 700, color: T.text, fontFamily: FONT.mono }}>{mult(build.p25)}</span></span>
            <span style={{ color: T.mutedHi }}>median <span style={{ fontWeight: 700, color: T.cyan, fontFamily: FONT.mono }}>{mult(build.median)}</span></span>
            <span style={{ color: T.mutedHi }}>P75 <span style={{ fontWeight: 700, color: T.text, fontFamily: FONT.mono }}>{mult(build.p75)}</span></span>
          </div>
          <div style={{ borderRadius: 8, border: `1px solid ${T.border}`, background: T.cardHi, padding: '14px 16px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px 2px', fontSize: 13 }}>
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
            <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4px 24px', borderTop: `1px solid ${alpha(T.border, 0.6)}`, paddingTop: 10, fontSize: 13, color: T.mutedHi }}>
              <span>Range: <span style={{ fontFamily: FONT.mono, color: T.text }}>{mult(build.p25)} → {usdm(build.low)}</span> <span style={{ color: T.muted }}>(low)</span></span>
              <span><span style={{ fontFamily: FONT.mono, color: T.text }}>{mult(build.p75)} → {usdm(build.high)}</span> <span style={{ color: T.muted }}>(high)</span></span>
            </div>
          </div>
          <p style={{ marginTop: 12, fontSize: 11, lineHeight: 1.5, color: T.muted }}>
            The <span style={{ color: T.mutedHi }}>median</span> peer multiple is the central estimate; the <span style={{ color: T.mutedHi }}>P25–P75</span> band is the range. {netDebt >= 0 ? 'Net debt' : 'Net cash'} bridges enterprise value to equity. Base revenue is the latest-year base ({usdm(baseRev)}).
          </p>
          {ebBuild && (
            <p style={{ marginTop: 8, fontSize: 11, lineHeight: 1.5, color: T.muted }}>
              EV/EBITDA cross-check: median <span style={{ fontFamily: FONT.mono, color: T.mutedHi }}>{mult(ebBuild.median)}</span> × base EBITDA {usdm(baseEbitda!)} {netDebt >= 0 ? '−' : '+'} {ndWord} ⇒ <span style={{ fontFamily: FONT.mono, color: T.mutedHi }}>{usdm(ebBuild.mid)}</span> equity ({ebPeers.length} peers with an EBITDA multiple).
            </p>
          )}
          <p style={{ marginTop: 8, fontSize: 11, lineHeight: 1.5, color: T.muted }}>
            Method: a single company-wide EV/Revenue multiple applied to total revenue. A sum-of-the-parts build — segment-specific multiples for distinct business lines — is not applied to this deal.
          </p>
        </Card>
      )}

      {/* 3 — the interactive peer set */}
      <Card padding="0">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px 0' }}>
          <SectionTitle kicker="toggle a peer to see the range recompute" title="Peer set" />
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 11, color: T.muted, fontFamily: FONT.mono }}>
            <span>{included.length}/{revPeers.length} in set</span>
            {excluded.size > 0 && (
              <button onClick={() => setExcluded(new Set())} style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.cyan, fontFamily: FONT.mono, fontSize: 11 }}>Reset</button>
            )}
          </div>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ ...th, textAlign: 'left' }}>Peer</th>
              <th style={{ ...th, textAlign: 'right' }}>EV/Rev</th>
              <th style={{ ...th, textAlign: 'right' }}>EV/EBITDA</th>
              <th style={{ ...th, textAlign: 'right' }}>Growth</th>
              <th style={{ ...th, textAlign: 'right' }}>Margin</th>
              <th style={{ ...th, textAlign: 'right' }}>Implies</th>
              <th style={{ ...th, textAlign: 'left' }}>Basis</th>
            </tr>
          </thead>
          <tbody>
            {deal.peers.map((p) => {
              const hasRev = p.evRevenue != null
              const off = hasRev && excluded.has(p.name)
              const implies = hasRev ? Math.round((p.evRevenue as number) * baseRev - netDebt) : null
              const anchor = off ? null : p.name === aMid ? 'median' : p.name === aLow ? 'P25' : p.name === aHigh ? 'P75' : null
              return (
                <tr key={p.name} style={{ borderTop: `1px solid ${alpha(T.border, 0.6)}`, verticalAlign: 'top', opacity: off ? 0.4 : 1 }}>
                  <td style={{ padding: '12px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {hasRev ? (
                        <button
                          onClick={() => toggle(p.name)}
                          role="checkbox"
                          aria-checked={!off}
                          title={off ? 'Add to comp set' : 'Remove from comp set'}
                          style={{ display: 'grid', placeItems: 'center', height: 16, width: 16, flexShrink: 0, borderRadius: 4, cursor: 'pointer', border: `1px solid ${off ? T.border : T.cyan}`, background: off ? 'transparent' : T.cyan, color: off ? 'transparent' : T.navyDeep, fontSize: 10, lineHeight: 1, padding: 0 }}
                        >
                          ✓
                        </button>
                      ) : (
                        <span style={{ display: 'inline-block', height: 16, width: 16, flexShrink: 0 }} />
                      )}
                      <span style={{ fontWeight: 600, color: off ? T.muted : T.text, textDecoration: off ? 'line-through' : 'none', fontSize: 13 }}>{p.name}</span>
                      <Mono>{p.public ? 'Public' : 'Private'}</Mono>
                      {anchor && (
                        <span style={{ borderRadius: 3, background: alpha(T.cyan, 0.13), padding: '1px 6px', fontSize: 9, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', color: T.cyan, fontFamily: FONT.mono }}>{anchor}</span>
                      )}
                    </div>
                    <div style={{ marginTop: 2, maxWidth: 420, paddingLeft: 24, fontSize: 11, color: T.muted }}>{p.rationale}</div>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', color: T.text, fontFamily: FONT.mono, fontSize: 12 }}>{p.evRevenue != null ? mult(p.evRevenue) : '—'}</td>
                  <td style={{ padding: '12px', textAlign: 'right', color: T.mutedHi, fontFamily: FONT.mono, fontSize: 12 }}>{p.evEbitda != null ? mult(p.evEbitda) : '—'}</td>
                  <td style={{ padding: '12px', textAlign: 'right', color: T.mutedHi, fontFamily: FONT.mono, fontSize: 12 }}>{p.revGrowthPct != null ? `${p.revGrowthPct}%` : '—'}</td>
                  <td style={{ padding: '12px', textAlign: 'right', color: T.mutedHi, fontFamily: FONT.mono, fontSize: 12 }}>{p.ebitdaMarginPct != null ? `${p.ebitdaMarginPct}%` : '—'}</td>
                  <td style={{ padding: '12px', textAlign: 'right', fontFamily: FONT.mono, fontSize: 12 }}>{implies != null ? <span style={{ color: off ? T.muted : T.mutedHi }}>{usdm(implies)}</span> : <span style={{ color: T.muted }}>—</span>}</td>
                  <td style={{ padding: '12px' }}><TrustTag basis={p.basis} /></td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <p style={{ padding: '12px 24px', fontSize: 11, lineHeight: 1.5, color: T.muted }}>
          <span style={{ fontWeight: 600, color: T.mutedHi }}>Implies</span> = that peer's EV/Revenue × base revenue ({usdm(baseRev)}) {netDebt >= 0 ? '−' : '+'} {ndWord} ({usdm(Math.abs(netDebt))}) — the equity value a single comp would imply. The range above uses the P25 / median / P75 of the included EV/Revenue multiples.
        </p>
      </Card>
    </div>
  )
}
