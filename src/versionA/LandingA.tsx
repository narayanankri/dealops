import { useEffect, useState } from 'react'
import { T, FONT } from './theme'
import { Mono, Btn, CountUp } from './uiA'
import { KnowledgeGraphA } from './KnowledgeGraphA'

// Version A gate — a KPMG-style split landing. The login is decorative (the demo
// has no real auth): any "Enter" calls onEnter, matching Version B's gate behaviour.
export function LandingA({ onEnter }: { onEnter: () => void }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  const dateStr = now.toLocaleDateString(undefined, { weekday: 'short', day: '2-digit', month: 'short' })
  const timeStr = now.toLocaleTimeString()

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: 'minmax(0,1.15fr) minmax(360px,0.85fr)', background: T.bg, color: T.text, fontFamily: FONT.sans }}>
      {/* Hero */}
      <div style={{ position: 'relative', overflow: 'hidden', background: T.heroGrad, padding: '56px 56px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <KnowledgeGraphA />
        {/* canvas affordance labels */}
        <div style={{ position: 'absolute', top: 20, right: 22, pointerEvents: 'none', display: 'flex', alignItems: 'center', gap: 6, fontFamily: FONT.mono, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: T.cyan }}>
          <span style={{ width: 6, height: 6, borderRadius: 3, background: T.cyan, boxShadow: `0 0 8px ${T.cyan}` }} className="pulsing" /> Live
        </div>
        <div style={{ position: 'absolute', bottom: 18, right: 22, pointerEvents: 'none', fontFamily: FONT.mono, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: T.muted }}>
          Hover · drag to explore
        </div>
        <div style={{ position: 'relative', pointerEvents: 'none' }}>
          <Mono color={T.cyan} style={{ letterSpacing: 5 }}>◆ AI Deal Operations · Version A</Mono>
        </div>
        <div style={{ position: 'relative', maxWidth: 620, pointerEvents: 'none' }}>
          <h1 style={{ fontFamily: FONT.serif, fontSize: 60, fontWeight: 700, lineHeight: 1.02, letterSpacing: -2, color: T.text, margin: '0 0 20px' }}>
            Deal screening,<br />
            <span style={{ color: T.cyan }}>calibrated.</span>
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: T.mutedHi, maxWidth: 520, margin: 0 }}>
            A research-grade workspace for GCC &amp; MENA private capital — every deal screened against the mandate, valued on a coherent model, and checked by a deterministic ledger before it reaches committee.
          </p>
          <div style={{ display: 'flex', gap: 40, marginTop: 38 }}>
            {[
              { v: 15, s: 'deals screened', suffix: '' },
              { v: 23, s: 'coherence checks', suffix: '' },
              { v: 1.6, s: 'fund capital', suffix: 'bn', prefix: '$', dec: 1 },
            ].map((m) => (
              <div key={m.s}>
                <div style={{ fontFamily: FONT.serif, fontSize: 34, fontWeight: 700, color: T.text, letterSpacing: -1 }}>
                  <CountUp value={m.v} prefix={m.prefix ?? ''} suffix={m.suffix ?? ''} decimals={m.dec ?? 0} />
                </div>
                <Mono style={{ marginTop: 4 }}>{m.s}</Mono>
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: 'relative', pointerEvents: 'none', display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11, color: T.muted, fontFamily: FONT.mono }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 6, height: 6, borderRadius: 3, background: T.green, boxShadow: `0 0 8px ${T.green}` }} className="pulsing" />
            <span style={{ color: T.mutedHi }}>{dateStr} · {timeStr}</span>
          </div>
          <div>Connected · Claude for Financial Services</div>
        </div>
      </div>

      {/* Sign-in card */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40, borderLeft: `1px solid ${T.border}`, background: T.ink }}>
        <div style={{ width: '100%', maxWidth: 340 }}>
          <Mono color={T.cyan} style={{ marginBottom: 10 }}>Secure sign-in</Mono>
          <div style={{ fontFamily: FONT.serif, fontSize: 28, fontWeight: 700, letterSpacing: -0.5, marginBottom: 24 }}>Enter the workspace</div>

          <form onSubmit={(e) => { e.preventDefault(); onEnter() }}>
            <Field label="Username" value={username} onChange={setUsername} type="text" placeholder="username" />
            <Field label="Password" value={password} onChange={setPassword} type="password" placeholder="••••••••" />
            <Btn variant="glow" size="lg" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} onClick={onEnter}>
              Enter the workspace →
            </Btn>
          </form>

          <p style={{ marginTop: 16, textAlign: 'center', fontFamily: FONT.mono, fontSize: 10, color: T.muted }}>Demo — any credentials work.</p>
        </div>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, type = 'text', placeholder, mono }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; mono?: boolean }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <Mono style={{ marginBottom: 7 }}>{label}</Mono>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: '100%', padding: '11px 13px', background: T.card, border: `1px solid ${T.border}`, borderRadius: 7, color: T.text, fontSize: 14, fontFamily: mono ? FONT.mono : FONT.sans, letterSpacing: mono ? 4 : 0, outline: 'none', boxSizing: 'border-box' }}
        onFocus={(e) => { e.currentTarget.style.borderColor = T.cyan }}
        onBlur={(e) => { e.currentTarget.style.borderColor = T.border }}
      />
    </div>
  )
}
