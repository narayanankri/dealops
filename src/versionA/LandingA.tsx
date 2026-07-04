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
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: 'minmax(0,1.05fr) minmax(420px,0.95fr)', background: T.ink, color: T.text, fontFamily: FONT.sans }}>
      {/* LEFT — hero (top) + sign-in (bottom) */}
      <div style={{ position: 'relative', padding: '52px 56px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 32, minWidth: 0 }}>
        {/* Hero — top */}
        <div>
          <Mono color={T.cyan} style={{ letterSpacing: 5 }}>◆ AI Deal Operations</Mono>
          <h1 style={{ fontFamily: FONT.serif, fontSize: 52, fontWeight: 700, lineHeight: 1.03, letterSpacing: -1.6, color: T.text, margin: '18px 0 18px' }}>
            Deal screening,<br />
            <span style={{ color: T.cyan }}>calibrated.</span>
          </h1>
          <p style={{ fontSize: 15.5, lineHeight: 1.6, color: T.mutedHi, maxWidth: 520, margin: 0 }}>
            A research-grade workspace for GCC &amp; MENA private capital — every deal screened against the mandate, valued on a coherent model, and checked by a deterministic ledger before it reaches committee.
          </p>
          <div style={{ display: 'flex', gap: 40, marginTop: 30 }}>
            {[
              { v: 15, s: 'deals screened', suffix: '' },
              { v: 23, s: 'coherence checks', suffix: '' },
              { v: 1.6, s: 'fund capital', suffix: 'bn', prefix: '$', dec: 1 },
            ].map((m) => (
              <div key={m.s}>
                <div style={{ fontFamily: FONT.serif, fontSize: 32, fontWeight: 700, color: T.text, letterSpacing: -1 }}>
                  <CountUp value={m.v} prefix={m.prefix ?? ''} suffix={m.suffix ?? ''} decimals={m.dec ?? 0} />
                </div>
                <Mono style={{ marginTop: 4 }}>{m.s}</Mono>
              </div>
            ))}
          </div>
        </div>

        {/* Sign-in — bottom */}
        <div style={{ maxWidth: 460, width: '100%' }}>
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: '24px 28px 26px' }}>
            <Mono color={T.cyan} style={{ marginBottom: 8 }}>Secure sign-in</Mono>
            <div style={{ fontFamily: FONT.serif, fontSize: 24, fontWeight: 700, letterSpacing: -0.5, marginBottom: 18 }}>Enter the workspace</div>
            <form onSubmit={(e) => { e.preventDefault(); onEnter() }}>
              <Field label="Username" value={username} onChange={setUsername} type="text" placeholder="username" />
              <Field label="Password" value={password} onChange={setPassword} type="password" placeholder="••••••••" />
              <Btn variant="glow" size="lg" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} onClick={onEnter}>
                Enter the workspace →
              </Btn>
            </form>
          </div>
          <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 5, fontSize: 11, color: T.muted, fontFamily: FONT.mono }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 6, height: 6, borderRadius: 3, background: T.green, boxShadow: `0 0 8px ${T.green}` }} className="pulsing" />
              <span style={{ color: T.mutedHi }}>{dateStr} · {timeStr}</span>
            </div>
            <div>Connected · Claude for Financial Services</div>
          </div>
        </div>
      </div>

      {/* RIGHT — graphic + animation (no text overlap) */}
      <div style={{ position: 'relative', overflow: 'hidden', background: T.heroGrad, borderLeft: `1px solid ${T.border}` }}>
        <KnowledgeGraphA />
        <div style={{ position: 'absolute', top: 20, right: 22, pointerEvents: 'none', display: 'flex', alignItems: 'center', gap: 6, fontFamily: FONT.mono, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: T.cyan }}>
          <span style={{ width: 6, height: 6, borderRadius: 3, background: T.cyan, boxShadow: `0 0 8px ${T.cyan}` }} className="pulsing" /> Live
        </div>
        <div style={{ position: 'absolute', bottom: 18, right: 22, pointerEvents: 'none', fontFamily: FONT.mono, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: T.muted }}>
          Hover · drag to explore
        </div>
        <div style={{ position: 'absolute', top: 20, left: 22, pointerEvents: 'none', fontFamily: FONT.mono, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: T.muted }}>
          ◆ Knowledge graph
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
