import { useState } from 'react'
import { T, FONT } from './theme'
import { Mono, Btn, NetworkBackground, CountUp } from './uiA'

// Version A gate — a KPMG-style split landing. The login is decorative (the demo
// has no real auth): any "Enter" calls onEnter, matching Version B's gate behaviour.
export function LandingA({ onEnter }: { onEnter: () => void }) {
  const [step, setStep] = useState<1 | 2>(1)
  const [email, setEmail] = useState('analyst@kpmg.com')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: 'minmax(0,1.15fr) minmax(360px,0.85fr)', background: T.bg, color: T.text, fontFamily: FONT.sans }}>
      {/* Hero */}
      <div style={{ position: 'relative', overflow: 'hidden', background: T.heroGrad, padding: '56px 56px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <NetworkBackground density={60} opacity={0.5} />
        <div style={{ position: 'relative' }}>
          <Mono color={T.cyan} style={{ letterSpacing: 5 }}>◆ AI Deal Operations · Version A</Mono>
        </div>
        <div style={{ position: 'relative', maxWidth: 620 }}>
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
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: T.muted, fontFamily: FONT.mono }}>
          <span style={{ width: 6, height: 6, borderRadius: 3, background: T.green, boxShadow: `0 0 8px ${T.green}` }} />
          Connected · Claude for Financial Services
        </div>
      </div>

      {/* Sign-in card */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40, borderLeft: `1px solid ${T.border}`, background: T.ink }}>
        <div style={{ width: '100%', maxWidth: 340 }}>
          <Mono color={T.cyan} style={{ marginBottom: 10 }}>{step === 1 ? 'Secure sign-in' : 'Verification'}</Mono>
          <div style={{ fontFamily: FONT.serif, fontSize: 28, fontWeight: 700, letterSpacing: -0.5, marginBottom: 24 }}>
            {step === 1 ? 'Enter the workspace' : 'Check your authenticator'}
          </div>

          {step === 1 ? (
            <>
              <Field label="Work email" value={email} onChange={setEmail} type="email" />
              <Field label="Password" value={password} onChange={setPassword} type="password" placeholder="••••••••" />
              <Btn variant="glow" size="lg" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} onClick={() => setStep(2)}>
                Continue →
              </Btn>
            </>
          ) : (
            <>
              <Field label="6-digit code" value={code} onChange={setCode} placeholder="••••••" mono />
              <Btn variant="glow" size="lg" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} onClick={onEnter}>
                Enter →
              </Btn>
              <button onClick={() => setStep(1)} style={{ marginTop: 14, background: 'none', border: 'none', color: T.muted, fontSize: 12, cursor: 'pointer', fontFamily: FONT.sans }}>← Back</button>
            </>
          )}

          <div style={{ marginTop: 22, paddingTop: 18, borderTop: `1px solid ${T.border}`, fontSize: 11, color: T.muted, lineHeight: 1.6 }}>
            Demo workspace — credentials are not checked. <button onClick={onEnter} style={{ background: 'none', border: 'none', color: T.cyan, cursor: 'pointer', fontSize: 11, fontFamily: FONT.sans, padding: 0 }}>Skip sign-in →</button>
          </div>
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
