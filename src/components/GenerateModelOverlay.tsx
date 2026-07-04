// ───────────────────────────────────────────────────────────
// A deliberately-showy full-screen overlay played while a financial model is
// "generated" — counter-rotating rings, an ambient conic glow, a spreadsheet
// grid that lights up, rising financial glyphs, a stepped build checklist and a
// shimmer progress bar. Runs for `durationMs` (~10s) then calls onDone (which
// triggers the actual workbook download). Theme-agnostic (works in both skins).
// ───────────────────────────────────────────────────────────
import { useEffect, useRef, useState } from 'react'

const STEPS = [
  'Loading deal assumptions',
  'Building the income statement',
  'Rolling forward the balance sheet',
  'Deriving the cash-flow statement',
  'Discounting unlevered free cash flow',
  'Solving the Gordon terminal value',
  'Running the WACC × growth sensitivity grid',
  'Benchmarking peer comparables',
  'Reconciling audit & integrity checks',
  'Formatting the workbook',
]
const SHEETS = ['Assumptions', 'Income', 'Balance', 'Cash flow', 'DCF', 'Sensitivity', 'Comps', 'Audit', 'Summary', 'Scenarios']
const CYAN = '#19c2db', VIOLET = '#8b7bf0', GOLD = '#f5b94d'
const GLYPHS = ['$', '%', '×', '7', '4', '∑', '9', '$', 'Δ', '2', '%', 'x', '8', '$']

const KEYS = `
@keyframes gmo-spin { to { transform: rotate(360deg) } }
@keyframes gmo-spinrev { to { transform: rotate(-360deg) } }
@keyframes gmo-glow { to { transform: rotate(360deg) } }
@keyframes gmo-pulse { 0%,100%{ opacity:.45 } 50%{ opacity:1 } }
@keyframes gmo-shimmer { to { background-position: 220% 0 } }
@keyframes gmo-fade { from{ opacity:0; transform:translateY(5px) } to{ opacity:1; transform:none } }
@keyframes gmo-rise { 0%{ transform:translateY(0); opacity:0 } 12%{ opacity:.7 } 100%{ transform:translateY(-160px); opacity:0 } }
@keyframes gmo-cell { 0%,100%{ opacity:.06 } 50%{ opacity:.5 } }
`

export function GenerateModelOverlay({ onDone, durationMs = 10000 }: { onDone: () => void; durationMs?: number }) {
  const [pct, setPct] = useState(0)
  const done = useRef(false)
  useEffect(() => {
    const start = performance.now()
    let raf = 0
    const tick = (t: number) => {
      const p = Math.min(100, ((t - start) / durationMs) * 100)
      setPct(p)
      if (p >= 100) { if (!done.current) { done.current = true; onDone() } return }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [durationMs, onDone])

  const step = Math.min(STEPS.length - 1, Math.floor((pct / 100) * STEPS.length))
  const ring = (size: number, color: string, dur: number, rev?: boolean): React.CSSProperties => ({
    position: 'absolute', top: '50%', left: '50%', width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2,
    borderRadius: '50%', border: `2px solid rgba(255,255,255,0.07)`, borderTopColor: color, borderRightColor: rev ? color : 'transparent',
    animation: `${rev ? 'gmo-spinrev' : 'gmo-spin'} ${dur}s linear infinite`, boxShadow: `0 0 22px ${color}55`,
  })

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 11000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(4,7,16,0.9)', backdropFilter: 'blur(7px)', WebkitBackdropFilter: 'blur(7px)', fontFamily: "'Space Grotesk', 'Inter', system-ui, sans-serif" }}>
      <style>{KEYS}</style>

      {/* ambient rotating conic glow */}
      <div style={{ position: 'absolute', width: 900, height: 900, borderRadius: '50%', background: `conic-gradient(from 0deg, ${CYAN}22, ${VIOLET}22, ${GOLD}14, ${CYAN}22)`, filter: 'blur(60px)', animation: 'gmo-glow 14s linear infinite', opacity: 0.6 }} />

      {/* faint spreadsheet grid */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)`, backgroundSize: '44px 30px', maskImage: 'radial-gradient(circle at 50% 45%, black, transparent 70%)', WebkitMaskImage: 'radial-gradient(circle at 50% 45%, black, transparent 70%)', animation: 'gmo-cell 4s ease-in-out infinite' }} />

      {/* rising glyph particles */}
      {GLYPHS.map((g, i) => (
        <span key={i} style={{ position: 'absolute', bottom: '32%', left: `${8 + (i * 6.3) % 84}%`, color: [CYAN, VIOLET, GOLD][i % 3], fontFamily: "'IBM Plex Mono', monospace", fontSize: 11 + (i % 3) * 4, opacity: 0, animation: `gmo-rise ${4 + (i % 4)}s ease-in ${(i % 7) * 0.6}s infinite` }}>{g}</span>
      ))}

      {/* card */}
      <div style={{ position: 'relative', width: 520, maxWidth: '92vw', padding: '40px 44px 34px', textAlign: 'center', borderRadius: 18, background: 'rgba(12,16,30,0.72)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 30px 90px rgba(0,0,0,0.6)' }}>
        {/* emblem */}
        <div style={{ position: 'relative', height: 150, marginBottom: 18 }}>
          <div style={ring(150, CYAN, 1.5)} />
          <div style={ring(112, VIOLET, 2.4, true)} />
          <div style={ring(78, GOLD, 3.4)} />
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: 30, fontWeight: 700, color: '#fff', letterSpacing: -1, lineHeight: 1 }}>{Math.round(pct)}<span style={{ fontSize: 15, color: CYAN }}>%</span></span>
          </div>
        </div>

        <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: -0.4, background: `linear-gradient(90deg, ${CYAN}, ${VIOLET})`, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
          Generating financial model
        </div>
        <div key={step} style={{ marginTop: 6, fontSize: 12.5, color: 'rgba(220,228,240,0.78)', fontFamily: "'IBM Plex Mono', monospace", animation: 'gmo-fade 0.4s ease both', minHeight: 18 }}>
          {STEPS[step]}…
        </div>

        {/* sheet chips lighting up */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 6, margin: '18px 0 16px' }}>
          {SHEETS.map((s, i) => {
            const reached = (i / SHEETS.length) * 100 <= pct
            return (
              <span key={s} style={{ fontSize: 9.5, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: 0.3, padding: '4px 8px', borderRadius: 5, transition: 'all .3s', border: `1px solid ${reached ? CYAN + '88' : 'rgba(255,255,255,0.08)'}`, background: reached ? CYAN + '1f' : 'transparent', color: reached ? '#dff6fb' : 'rgba(255,255,255,0.32)' }}>
                {reached ? '✓ ' : ''}{s}
              </span>
            )
          })}
        </div>

        {/* shimmer progress bar */}
        <div style={{ height: 7, width: '100%', borderRadius: 4, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, borderRadius: 4, background: `linear-gradient(90deg, ${CYAN}, ${VIOLET}, ${GOLD}, ${CYAN})`, backgroundSize: '220% 100%', animation: 'gmo-shimmer 1.6s linear infinite', boxShadow: `0 0 14px ${CYAN}88` }} />
        </div>
        <div style={{ marginTop: 12, fontSize: 9.5, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(180,190,205,0.5)', fontFamily: "'IBM Plex Mono', monospace" }}>
          Claude · live three-statement model
        </div>
      </div>
    </div>
  )
}
