// ───────────────────────────────────────────────────────────
// Version A — Research tab. A structured diligence workplan (critical path,
// workstreams, open questions, red flags) derived from the deal record by the
// engine, over the coherence ledger, per-field sourcing and recent events.
// ───────────────────────────────────────────────────────────
import { useState } from 'react'
import { T, FONT, alpha } from '../theme'
import { Card, SectionTitle, Mono } from '../uiA'
import { useApp } from '@/lib/store'
import { researchPlan, type ResearchWorkstream, type ResearchOpenQuestion, type ResearchRedFlag } from '@/engine/research'
import type { Analysis, Deal } from '@/types'

const BASIS_TONE: Record<string, string> = { stated: T.green, inferred: T.amber, estimated: T.red }
const PRI: Record<string, string> = { high: T.red, medium: T.amber, low: T.cyan }
const SEV: Record<string, string> = { high: T.red, medium: T.amber, low: T.muted }
const CAT: Record<string, string> = { financial: T.green, legal: T.red, commercial: T.cyan, management: T.amber, market: T.purpleSoft }

function Chip({ label, color }: { label: string; color: string }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', flexShrink: 0, padding: '2px 6px', fontSize: 9, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', fontFamily: FONT.mono, borderRadius: 3, background: alpha(color, 0.13), color, border: `1px solid ${alpha(color, 0.38)}` }}>{label}</span>
  )
}
function TrustTag({ basis, confidence }: { basis: 'stated' | 'inferred' | 'estimated'; confidence?: string }) {
  return <Chip label={`${basis}${confidence ? ` · ${confidence}` : ''}`} color={BASIS_TONE[basis]} />
}
function Cite({ source, url }: { source?: string; url?: string }) {
  if (!source && !url) return null
  if (url) return <a href={url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} style={{ fontSize: 10, fontWeight: 600, color: alpha(T.cyan, 0.85), textDecoration: 'none', fontFamily: FONT.mono }}>{source ?? 'source'} ↗</a>
  return <span style={{ fontSize: 10, color: T.muted, fontFamily: FONT.mono }}>{source}</span>
}

function WorkstreamA({ ws }: { ws: ResearchWorkstream }) {
  const c = PRI[ws.priority]
  return (
    <Card padding="18px 22px" accent={c}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: FONT.serif, fontSize: 17, fontWeight: 700, color: T.text }}>{ws.name}</div>
          <p style={{ margin: '6px 0 0', fontSize: 12.5, lineHeight: 1.6, color: T.mutedHi }}>{ws.objective}</p>
        </div>
        <Chip label={`${ws.priority} priority`} color={c} />
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 20px', marginTop: 8, fontSize: 11, color: T.muted }}>
        <span><span style={{ color: T.mutedHi }}>Owner:</span> {ws.owner}</span>
        {ws.addresses.length > 0 && <span><span style={{ color: T.mutedHi }}>Addresses:</span> {ws.addresses.join(', ')}</span>}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
        {ws.tasks.map((t, i) => (
          <div key={i} style={{ padding: '10px 12px', background: T.cardHi, borderLeft: `2px solid ${T.cyan}`, borderRadius: 4 }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: T.text }}>
              <span style={{ color: T.cyan, fontFamily: FONT.mono, marginRight: 6 }}>{String(i + 1).padStart(2, '0')}</span>
              {t.task}
            </div>
            {t.rationale && <div style={{ marginTop: 4, fontSize: 11, lineHeight: 1.5, color: T.muted }}><span style={{ color: T.mutedHi, fontWeight: 600 }}>Why: </span>{t.rationale}</div>}
            {t.deliverable && <div style={{ marginTop: 2, fontSize: 11, lineHeight: 1.5, color: T.muted }}><span style={{ color: T.mutedHi, fontWeight: 600 }}>Deliverable: </span>{t.deliverable}</div>}
          </div>
        ))}
      </div>
    </Card>
  )
}

function OpenQA({ qs }: { qs: ResearchOpenQuestion[] }) {
  return (
    <Card padding="20px 24px">
      <SectionTitle title={`Open questions (${qs.length})`} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {qs.map((q, i) => {
          const c = CAT[q.category] ?? T.muted
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '8px 10px', borderLeft: `2px solid ${q.blocker ? T.red : c}`, background: q.blocker ? alpha(T.red, 0.06) : T.cardHi, borderRadius: 4 }}>
              <Chip label={q.category} color={c} />
              {q.blocker && <Chip label="blocker" color={T.red} />}
              <span style={{ fontSize: 12.5, lineHeight: 1.5, color: T.mutedHi }}>{q.question}</span>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

function RedFlagsA({ flags }: { flags: ResearchRedFlag[] }) {
  return (
    <Card padding="20px 24px" accent={T.red}>
      <SectionTitle title={`Red flags (${flags.length})`} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {flags.map((fl, i) => {
          const c = SEV[fl.severity]
          return (
            <div key={i} style={{ padding: '10px 12px', borderLeft: `3px solid ${c}`, background: alpha(c, 0.07), borderRadius: 4 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{fl.flag}</span>
                <Chip label={`sev ${fl.severity}${fl.likelihood ? ` · lik ${fl.likelihood}` : ''}`} color={c} />
              </div>
              {fl.verify && <div style={{ marginTop: 4, fontSize: 11, lineHeight: 1.5, color: T.muted }}><span style={{ color: T.mutedHi, fontWeight: 600 }}>To verify: </span>{fl.verify}</div>}
              {fl.impact && <div style={{ marginTop: 2, fontSize: 11, lineHeight: 1.5, color: T.muted }}><span style={{ color: T.mutedHi, fontWeight: 600 }}>Impact: </span>{fl.impact}</div>}
            </div>
          )
        })}
      </div>
    </Card>
  )
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
      {(blocking.length > 0 || warn.length > 0) && <div style={{ marginBottom: 12 }}>{[...blocking, ...warn].map((c) => <Row key={c.id} c={c} />)}</div>}
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
  const { mandate } = useApp()
  const plan = researchPlan(deal, a, mandate)
  const methodLabel = (basis: string) => (basis === 'estimated' ? 'Estimated: ' : 'Inferred: ')
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Plan header */}
      <Card padding="20px 24px">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
          <SectionTitle kicker="diligence workplan · source-cited" title={`Research plan — ${deal.name}`} />
          <div style={{ flexShrink: 0, display: 'flex', gap: 6 }}>
            <Chip label={`${plan.confidence} confidence`} color={T.cyan} />
            <Chip label={`${plan.sources.length} sources`} color={T.muted} />
          </div>
        </div>
        <p style={{ margin: '4px 0 0', fontSize: 13, lineHeight: 1.7, color: T.mutedHi }}>{plan.summary}</p>
        <p style={{ margin: '8px 0 0', fontSize: 11, fontStyle: 'italic', color: T.muted }}>Target: {deal.sector} · {deal.geography} · {deal.stage} · derived deterministically from the screened deal record</p>
      </Card>

      {plan.criticalPath.length > 0 && (
        <Card padding="20px 24px" accent={T.amber}>
          <Mono color={T.amber} style={{ marginBottom: 10 }}>Critical path · gating items</Mono>
          <ol style={{ margin: 0, paddingLeft: 20, color: T.mutedHi, fontSize: 13, lineHeight: 1.8 }}>
            {plan.criticalPath.map((it, i) => <li key={i} style={{ marginBottom: 4 }}>{it}</li>)}
          </ol>
        </Card>
      )}

      {plan.workstreams.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Mono color={T.cyan}>Workstreams ({plan.workstreams.length})</Mono>
          {plan.workstreams.map((ws) => <WorkstreamA key={ws.key} ws={ws} />)}
        </div>
      )}

      {plan.openQuestions.length > 0 && <OpenQA qs={plan.openQuestions} />}
      {plan.redFlags.length > 0 && <RedFlagsA flags={plan.redFlags} />}

      {/* Evidence & sources */}
      <Mono color={T.cyan}>Evidence &amp; sources</Mono>
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

      {plan.sources.length > 0 && (
        <Card padding="20px 24px">
          <SectionTitle title={`Sources (${plan.sources.length})`} />
          <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {plan.sources.map((s, i) => (
              <li key={i} style={{ display: 'flex', gap: 8, fontSize: 12.5 }}>
                <span style={{ flexShrink: 0, color: T.muted, fontFamily: FONT.mono }}>[{i + 1}]</span>
                {s.url ? <a href={s.url} target="_blank" rel="noreferrer" style={{ color: alpha(T.cyan, 0.9), textDecoration: 'none' }}>{s.title}</a> : <span style={{ color: T.mutedHi }}>{s.title}</span>}
              </li>
            ))}
          </ol>
        </Card>
      )}
    </div>
  )
}
