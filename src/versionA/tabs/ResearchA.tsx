// ───────────────────────────────────────────────────────────
// Version A — Research tab. Mirrors Version B's ResearchTab: the coherence
// ledger, per-field sourcing, and legal/sanctions deep-dive + recent events.
// ───────────────────────────────────────────────────────────
import { useState } from 'react'
import { T, FONT, alpha } from '../theme'
import { Card, SectionTitle } from '../uiA'
import type { Analysis, Deal } from '@/types'

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

function CoherencePanel({ checks }: { checks: Analysis['integrity']['checks'] }) {
  const [open, setOpen] = useState(false)
  const blocking = checks.filter((c) => c.severity === 'blocking')
  const warn = checks.filter((c) => c.severity === 'warn')
  const pass = checks.filter((c) => c.severity === 'pass')
  const tone = blocking.length ? T.red : warn.length ? T.amber : T.green
  const Row = ({ c }: { c: Analysis['integrity']['checks'][number] }) => (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, borderBottom: `1px solid ${alpha(T.border, 0.5)}`, padding: '8px 0' }}>
      <span style={{ marginTop: 6, height: 6, width: 6, flexShrink: 0, borderRadius: '50%', background: c.severity === 'blocking' ? T.red : c.severity === 'warn' ? T.amber : T.green }} />
      <div>
        <span style={{ fontSize: 13, color: T.text }}>{c.label}</span>
        {c.detail && <span style={{ marginLeft: 8, fontSize: 13, color: T.muted }}>{c.detail}</span>}
      </div>
    </div>
  )
  return (
    <Card padding="20px 24px" accent={blocking.length ? T.red : warn.length ? T.amber : undefined}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <SectionTitle kicker="deterministic checks" title="Coherence ledger" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11 }}>
          <span style={{ height: 8, width: 8, borderRadius: '50%', background: tone }} />
          <span style={{ color: T.mutedHi }}>{blocking.length ? `${blocking.length} blocking` : warn.length ? `${warn.length} to confirm` : 'all clear'}</span>
          <span style={{ color: T.muted }}>· {pass.length}/{checks.length} pass</span>
        </div>
      </div>
      <p style={{ marginBottom: 12, fontSize: 11, lineHeight: 1.5, color: T.muted }}>
        Deterministic checks run on every deal by the engine — round/raise/valuation distinctness, ownership math, multiple vs peers, financials↔vitals agreement, citation discipline, and completeness. The same invariants the Director reviews, enforced in code.
      </p>
      {(blocking.length > 0 || warn.length > 0) && (
        <div style={{ marginBottom: 12 }}>{[...blocking, ...warn].map((c) => <Row key={c.id} c={c} />)}</div>
      )}
      {pass.length > 0 && (
        <div>
          <button onClick={() => setOpen((v) => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.muted, fontSize: 11, fontFamily: FONT.mono, padding: 0 }}>
            {open ? 'Hide passing checks ▾' : `Show ${pass.length} passing checks ▸`}
          </button>
          {open && <div style={{ marginTop: 4 }}>{pass.map((c) => <Row key={c.id} c={c} />)}</div>}
        </div>
      )}
    </Card>
  )
}

export function ResearchA({ deal, a }: { deal: Deal; a: Analysis }) {
  const methodLabel = (basis: string) => (basis === 'estimated' ? 'Estimated: ' : 'Inferred: ')
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <CoherencePanel checks={a.integrity.checks} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'start' }}>
        <Card padding="20px 24px">
          <SectionTitle kicker="source per figure" title="Sourcing & evidence" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {deal.dataTrust.fields.map((f) => (
              <div key={f.label} style={{ borderBottom: `1px solid ${alpha(T.border, 0.5)}`, paddingBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                  <span style={{ fontSize: 13, color: T.mutedHi }}>{f.label}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Cite source={f.source} url={f.url} />
                    <TrustTag basis={f.basis} confidence={f.confidence} />
                  </div>
                </div>
                {f.method && (
                  <p style={{ marginTop: 2, fontSize: 11, lineHeight: 1.5, color: T.muted }}>
                    <span style={{ fontWeight: 600, color: BASIS_TONE[f.basis] }}>{methodLabel(f.basis)}</span>
                    {f.method}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Card>
        <Card padding="20px 24px">
          <SectionTitle title="Legal / sanctions deep-dive" />
          <p style={{ fontSize: 13, lineHeight: 1.55, color: T.mutedHi, margin: 0 }}>{deal.narrative.legalStanding}</p>
          <div style={{ marginTop: 16 }}>
            <SectionTitle title="Recent events" />
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {deal.news.map((ev, i) => (
                <li key={i} style={{ display: 'flex', gap: 12, fontSize: 13 }}>
                  <span style={{ width: 56, flexShrink: 0, color: T.muted, fontFamily: FONT.mono, fontSize: 12 }}>{ev.date}</span>
                  <span style={{ color: T.mutedHi }}>{ev.headline}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>
    </div>
  )
}
