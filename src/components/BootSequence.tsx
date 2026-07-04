// ───────────────────────────────────────────────────────────
// The sign-in boot sequence — an AI deal-intelligence engine coming online.
// A neural mesh fires signals inward and converges them on a central core wrapped
// in counter-rotating instrument rings (echoing the model loader); data tokens are
// ingested, a HUD bezel ticks, and an analysis log streams as the engine calibrates.
// Runs for `durationMs`, then calls onDone. Theme-agnostic; used by both skins.
// ───────────────────────────────────────────────────────────
import { useEffect, useRef, useState } from 'react'

const CYAN = '#19c2db', VIOLET = '#8b7bf0', GOLD = '#f5b94d', GREEN = '#3fd08a', WHITE = '#eaf6fb'
const NODE_COLORS = [CYAN, VIOLET, GOLD, GREEN, CYAN, VIOLET]

// Neural field — concentric rings of nodes around a central core (180,180).
const C = 180
const INNER = Array.from({ length: 6 }, (_, k) => { const a = -Math.PI / 2 + (k * Math.PI) / 3; return { x: C + 68 * Math.cos(a), y: C + 68 * Math.sin(a) } })
const OUTER = Array.from({ length: 9 }, (_, k) => { const a = -Math.PI / 2 + (k * 2 * Math.PI) / 9 + 0.2; return { x: C + 130 * Math.cos(a), y: C + 130 * Math.sin(a) } })
const SPOKES = INNER.map((n) => ({ from: n, to: { x: C, y: C } }))
const OUTER_EDGES = OUTER.map((n, k) => ({ from: n, to: INNER[k % INNER.length] }))
const RING_EDGES = INNER.map((n, k) => ({ a: n, b: INNER[(k + 1) % INNER.length] }))
const TICKS = Array.from({ length: 60 }, (_, k) => (k * 2 * Math.PI) / 60)
const TOKENS = ['$', '7', '%', '4', '9', '∑']
const SCRAMBLE = '0123456789<>/$%#*+=ΔΣλΩ'.split('')
const TITLE = 'Bringing the intelligence online'
const GR = 50 // radius of the circular load gauge around the core
const GCIRC = 2 * Math.PI * GR
// holographic readouts that orbit the core and count up as the engine calibrates
const CHIPS = [{ k: 'DEALS', t: 15, s: '' }, { k: 'CHECKS', t: 312, s: '' }, { k: 'MODELS', t: 9, s: '' }, { k: 'BASE IRR', t: 24, s: '%' }]

const LINES = [
  'Establishing secure session',
  'Ingesting 15 screened deals',
  'Loading the deterministic reasoning engine',
  'Synthesizing mandate gates & red-lines',
  'Cross-referencing comparables & market data',
  'Running the coherence ledger',
  'Calibrating live valuation models',
  'Intelligence online',
]

const KEYS = `
@keyframes bs-pop { 0%{ opacity:0; transform:scale(0) } 55%{ opacity:1; transform:scale(1.45) } 100%{ opacity:1; transform:scale(1) } }
@keyframes bs-draw { to { stroke-dashoffset: 0 } }
@keyframes bs-spin { to { transform: rotate(360deg) } }
@keyframes bs-core { 0%,100%{ r:13; opacity:.92 } 50%{ r:16; opacity:1 } }
@keyframes bs-halo { 0%,100%{ opacity:.35; transform:scale(1) } 50%{ opacity:.6; transform:scale(1.12) } }
@keyframes bs-nodepulse { 0%,100%{ opacity:.6 } 50%{ opacity:1 } }
@keyframes bs-shimmer { to { background-position: 240% 0 } }
@keyframes bs-fade { from{ opacity:0; transform:translateY(5px) } to{ opacity:1; transform:none } }
@keyframes bs-titleglow { 0%,100%{ filter:drop-shadow(0 0 5px ${CYAN}44) } 50%{ filter:drop-shadow(0 0 16px ${CYAN}99) } }
@keyframes bs-blink { 0%,49%{ opacity:1 } 50%,100%{ opacity:0 } }
@keyframes bs-flash { 0%{ opacity:0 } 18%{ opacity:.55 } 100%{ opacity:0 } }
@keyframes bs-breathe { 0%,100%{ opacity:.5 } 50%{ opacity:.9 } }
@keyframes bs-shock { 0%{ r:24; opacity:.85; stroke-width:3 } 100%{ r:178; opacity:0; stroke-width:0.4 } }
@keyframes bs-ping { 0%{ r:16; opacity:.5 } 100%{ r:150; opacity:0 } }
@keyframes bs-twinkle { 0%,86%,100%{ transform:scale(1) } 93%{ transform:scale(2.1) } }
@keyframes bs-punch { 0%{ transform:scale(1) } 28%{ transform:scale(1.08) } 100%{ transform:scale(1) } }
@keyframes bs-chipin { from{ opacity:0; transform:translate(-50%,-50%) scale(0.6) } to{ opacity:1; transform:translate(-50%,-50%) scale(1) } }
@keyframes bs-cornerin { from{ opacity:0 } to{ opacity:1 } }
`

// Counter-rotating instrument ring (a partial dashed arc) around the centre.
function InstrumentRing({ r, color, dur, reverse, dash }: { r: number; color: string; dur: number; reverse?: boolean; dash: string }) {
  return (
    <circle cx={C} cy={C} r={r} fill="none" stroke={color} strokeWidth={1.4} strokeLinecap="round" strokeDasharray={dash} opacity={0.85}
      style={{ transformBox: 'view-box', transformOrigin: `${C}px ${C}px`, animation: `bs-spin ${dur}s linear infinite${reverse ? ' reverse' : ''}` }} />
  )
}

export function BootSequence({ onDone, durationMs = 5500 }: { onDone: () => void; durationMs?: number }) {
  const [pct, setPct] = useState(0)
  const [boom, setBoom] = useState(false)
  const done = useRef(false)
  useEffect(() => {
    const start = performance.now()
    let raf = 0
    const tick = (t: number) => {
      const p = Math.min(100, ((t - start) / durationMs) * 100)
      setPct(p)
      if (p >= 96) setBoom(true)
      if (p >= 100) { if (!done.current) { done.current = true; onDone() } return }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [durationMs, onDone])
  const shown = Math.min(LINES.length, Math.floor((pct / 100) * LINES.length) + 1)
  // decode-in title: characters scramble, then resolve left-to-right over the first ~16%
  const reveal = Math.floor(Math.min(1, pct / 16) * TITLE.length)
  const decoded = TITLE.split('').map((ch, i) => (ch === ' ' || i < reveal ? ch : SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)])).join('')
  // circular gauge tip (comet) position
  const gAng = ((-90 + (pct / 100) * 360) * Math.PI) / 180
  const gx = C + GR * Math.cos(gAng), gy = C + GR * Math.sin(gAng)

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 12000, overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22, background: 'radial-gradient(ellipse at 50% 34%, #0b1330 0%, #04060d 74%)', fontFamily: "'Space Grotesk', 'Inter', system-ui, sans-serif", color: '#e9ecf4' }}>
      <style>{KEYS}</style>

      {/* ambient rotating glow + subtle HUD dot-grid */}
      <div style={{ position: 'absolute', width: 1000, height: 1000, borderRadius: '50%', background: `conic-gradient(from 0deg, ${CYAN}1c, ${VIOLET}1c, ${GOLD}10, ${CYAN}1c)`, filter: 'blur(90px)', animation: 'bs-spin 22s linear infinite', opacity: 0.75 }} />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '34px 34px', maskImage: 'radial-gradient(circle at 50% 42%, black, transparent 68%)', WebkitMaskImage: 'radial-gradient(circle at 50% 42%, black, transparent 68%)', animation: 'bs-breathe 5s ease-in-out infinite', pointerEvents: 'none' }} />

      {/* title */}
      <div style={{ position: 'relative', textAlign: 'center' }}>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: 5, textTransform: 'uppercase', color: CYAN, marginBottom: 9, opacity: 0.85 }}>◆ AI Deal Operations · Neural Engine</div>
        <div style={{ fontSize: 31, fontWeight: 700, letterSpacing: -0.5, background: `linear-gradient(90deg, ${CYAN}, ${VIOLET})`, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', animation: 'bs-titleglow 2.6s ease-in-out infinite', fontFamily: reveal < TITLE.length ? "'IBM Plex Mono', monospace" : undefined }}>
          {decoded}
        </div>
      </div>

      {/* neural core emblem */}
      <div style={{ position: 'relative', width: 360, maxWidth: '76vw', display: 'grid', placeItems: 'center', animation: boom ? 'bs-punch 0.7s ease-out' : undefined }}>
        {/* orbiting holographic readouts */}
        <div style={{ position: 'absolute', inset: 0, animation: 'bs-spin 30s linear infinite', pointerEvents: 'none' }}>
          {CHIPS.map((c, i) => {
            const val = Math.round((Math.min(100, pct) / 100) * c.t)
            return (
              <div key={c.k} style={{ position: 'absolute', left: '50%', top: '50%', transform: `rotate(${i * 90 + 45}deg) translateY(-176px)` }}>
                <div style={{ animation: 'bs-spin 30s linear infinite reverse' }}>
                  <div style={{ transform: `rotate(${-(i * 90 + 45)}deg)` }}>
                    <div style={{ position: 'absolute', left: 0, top: 0, transform: 'translate(-50%,-50%)', animation: `bs-chipin 0.5s ease ${0.6 + i * 0.18}s both`, padding: '5px 9px', borderRadius: 7, whiteSpace: 'nowrap', background: 'rgba(12,18,34,0.78)', border: `1px solid ${CYAN}44`, boxShadow: `0 0 14px ${CYAN}22`, fontFamily: "'IBM Plex Mono', monospace", textAlign: 'center' }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#eaf6fb', lineHeight: 1 }}>{val}{c.s}</div>
                      <div style={{ fontSize: 7.5, letterSpacing: 1.2, color: `${CYAN}cc`, marginTop: 2 }}>{c.k}</div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        {/* rotating scan sweep behind the mesh */}
        <div style={{ position: 'absolute', width: '88%', aspectRatio: '1', borderRadius: '50%', background: `conic-gradient(from 0deg, transparent 0deg, transparent 318deg, ${CYAN}22 345deg, ${CYAN}55 359deg, transparent 360deg)`, maskImage: 'radial-gradient(circle, transparent 14%, #000 26%, #000 72%, transparent 78%)', WebkitMaskImage: 'radial-gradient(circle, transparent 14%, #000 26%, #000 72%, transparent 78%)', animation: 'bs-spin 4.2s linear infinite', opacity: 0.7, pointerEvents: 'none' }} />
        <svg viewBox="0 0 360 360" style={{ position: 'relative', width: '100%', height: 'auto' }}>
        {/* faint guide circles */}
        {[150, 110, 68].map((r) => <circle key={r} cx={C} cy={C} r={r} fill="none" stroke={CYAN} strokeWidth={0.5} opacity={0.1} />)}

        {/* continuous sonar pings from the core */}
        {[0, 1, 2].map((i) => <circle key={`pg${i}`} cx={C} cy={C} r={16} fill="none" stroke={CYAN} strokeWidth={1} opacity={0.4} style={{ animation: `bs-ping 3s ease-out ${i}s infinite` }} />)}

        {/* HUD tick bezel */}
        <g style={{ transformBox: 'view-box', transformOrigin: `${C}px ${C}px`, animation: 'bs-spin 40s linear infinite' }}>
          {TICKS.map((a, k) => {
            const r1 = 162, r2 = k % 5 === 0 ? 150 : 156
            return <line key={k} x1={C + r1 * Math.cos(a)} y1={C + r1 * Math.sin(a)} x2={C + r2 * Math.cos(a)} y2={C + r2 * Math.sin(a)} stroke={CYAN} strokeWidth={k % 5 === 0 ? 1 : 0.5} opacity={k % 5 === 0 ? 0.4 : 0.18} />
          })}
        </g>

        {/* outer counter-rotating dashed rings */}
        <circle cx={C} cy={C} r={138} fill="none" stroke={VIOLET} strokeWidth={1} strokeDasharray="1 7" opacity={0.4} style={{ transformBox: 'view-box', transformOrigin: `${C}px ${C}px`, animation: 'bs-spin 26s linear infinite reverse' }} />
        <circle cx={C} cy={C} r={120} fill="none" stroke={CYAN} strokeWidth={1} strokeDasharray="2 10" opacity={0.3} style={{ transformBox: 'view-box', transformOrigin: `${C}px ${C}px`, animation: 'bs-spin 18s linear infinite' }} />

        {/* mesh edges (faint) */}
        {[...SPOKES, ...OUTER_EDGES].map((e, i) => (
          <line key={`e${i}`} x1={e.from.x} y1={e.from.y} x2={e.to.x} y2={e.to.y} stroke={CYAN} strokeWidth={0.7} opacity={0.16} pathLength={1} strokeDasharray={1} strokeDashoffset={1} style={{ animation: `bs-draw 0.6s ease ${0.3 + i * 0.05}s forwards` }} />
        ))}
        {RING_EDGES.map((e, i) => (
          <line key={`r${i}`} x1={e.a.x} y1={e.a.y} x2={e.b.x} y2={e.b.y} stroke={VIOLET} strokeWidth={0.6} opacity={0.13} pathLength={1} strokeDasharray={1} strokeDashoffset={1} style={{ animation: `bs-draw 0.6s ease ${0.8 + i * 0.05}s forwards` }} />
        ))}

        {/* signal pulses firing inward and converging on the core */}
        {OUTER_EDGES.map((e, i) => (
          <circle key={`so${i}`} r={2.3} fill={CYAN} opacity={0.95} style={{ filter: `drop-shadow(0 0 4px ${CYAN})` }}>
            <animateMotion dur="1.5s" begin={`${1 + i * 0.16}s`} repeatCount="indefinite" path={`M ${e.from.x} ${e.from.y} L ${e.to.x} ${e.to.y}`} />
          </circle>
        ))}
        {SPOKES.map((e, i) => (
          <circle key={`sp${i}`} r={2.6} fill={WHITE} opacity={0.95} style={{ filter: `drop-shadow(0 0 5px ${CYAN})` }}>
            <animateMotion dur="1.1s" begin={`${1.5 + i * 0.18}s`} repeatCount="indefinite" path={`M ${e.from.x} ${e.from.y} L ${e.to.x} ${e.to.y}`} />
          </circle>
        ))}

        {/* ingested data tokens streaming toward the core */}
        {TOKENS.map((g, i) => (
          <text key={`t${i}`} fill={[CYAN, VIOLET, GOLD][i % 3]} fontSize={11} fontFamily="'IBM Plex Mono', monospace" textAnchor="middle" opacity={0}>
            {g}
            <animateMotion dur="2.4s" begin={`${0.6 + i * 0.42}s`} repeatCount="indefinite" path={`M ${OUTER[i].x} ${OUTER[i].y} L ${C} ${C}`} />
            <animate attributeName="opacity" values="0;0.85;0.85;0" keyTimes="0;0.15;0.7;1" dur="2.4s" begin={`${0.6 + i * 0.42}s`} repeatCount="indefinite" />
          </text>
        ))}

        {/* nodes */}
        {OUTER.map((n, i) => (
          <g key={`on${i}`} style={{ transformBox: 'fill-box', transformOrigin: 'center', animation: `bs-pop 0.55s cubic-bezier(0.22,1.4,0.36,1) ${0.3 + i * 0.07}s both` }}>
            <circle cx={n.x} cy={n.y} r={3.6} fill={NODE_COLORS[i % NODE_COLORS.length]} style={{ transformBox: 'fill-box', transformOrigin: 'center', filter: `drop-shadow(0 0 5px ${NODE_COLORS[i % NODE_COLORS.length]})`, animation: `bs-nodepulse ${1.6 + (i % 4) * 0.2}s ease-in-out ${i * 0.1}s infinite, bs-twinkle ${3.5 + (i % 5) * 0.6}s ease-in-out ${0.5 + i * 0.5}s infinite` }} />
          </g>
        ))}
        {INNER.map((n, i) => (
          <g key={`in${i}`} style={{ transformBox: 'fill-box', transformOrigin: 'center', animation: `bs-pop 0.55s cubic-bezier(0.22,1.4,0.36,1) ${0.6 + i * 0.08}s both` }}>
            <circle cx={n.x} cy={n.y} r={4.6} fill={NODE_COLORS[i % NODE_COLORS.length]} style={{ transformBox: 'fill-box', transformOrigin: 'center', filter: `drop-shadow(0 0 6px ${NODE_COLORS[i % NODE_COLORS.length]})`, animation: `bs-nodepulse ${1.4 + (i % 3) * 0.2}s ease-in-out ${i * 0.12}s infinite, bs-twinkle ${4 + (i % 4) * 0.7}s ease-in-out ${1 + i * 0.6}s infinite` }} />
          </g>
        ))}

        {/* circular load gauge that fills around the core, with a glowing comet tip */}
        <circle cx={C} cy={C} r={GR} fill="none" stroke={CYAN} strokeWidth={2} opacity={0.12} />
        <circle cx={C} cy={C} r={GR} fill="none" stroke={CYAN} strokeWidth={2.6} strokeLinecap="round" strokeDasharray={GCIRC} strokeDashoffset={GCIRC * (1 - pct / 100)} transform={`rotate(-90 ${C} ${C})`} style={{ filter: `drop-shadow(0 0 6px ${CYAN})` }} />
        <circle cx={gx} cy={gy} r={3.6} fill={WHITE} style={{ filter: `drop-shadow(0 0 8px ${CYAN})` }} />

        {/* core: halo + counter-rotating instrument rings + glowing centre */}
        <circle cx={C} cy={C} r={30} fill={CYAN} opacity={0.18} style={{ transformBox: 'view-box', transformOrigin: `${C}px ${C}px`, filter: 'blur(6px)', animation: 'bs-halo 2.2s ease-in-out infinite' }} />
        <InstrumentRing r={34} color={CYAN} dur={3.2} dash="56 220" />
        <InstrumentRing r={25} color={VIOLET} dur={2.3} reverse dash="38 160" />
        <circle cx={C} cy={C} r={14} fill={CYAN} style={{ animation: 'bs-core 1.8s ease-in-out infinite', filter: `drop-shadow(0 0 12px ${CYAN})` }} />
        <circle cx={C} cy={C} r={6} fill={WHITE} opacity={0.95} />

        {/* completion shockwave — staggered rings */}
        {boom && [0, 0.12, 0.24].map((d, i) => (
          <circle key={`sk${i}`} cx={C} cy={C} r={24} fill="none" stroke={i === 1 ? VIOLET : CYAN} style={{ animation: `bs-shock 0.8s ease-out ${d}s forwards` }} />
        ))}
        </svg>
      </div>

      {/* analysis log */}
      <div style={{ position: 'relative', width: 400, maxWidth: '86vw', display: 'flex', flexDirection: 'column', gap: 5, fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, minHeight: 150 }}>
        {LINES.slice(0, shown).map((l, i) => {
          const last = i === LINES.length - 1
          const active = i === shown - 1 && !last
          return (
            <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 9, animation: 'bs-fade 0.35s ease both' }}>
              <span style={{ color: last ? CYAN : active ? GOLD : GREEN, width: 12 }}>{last ? '→' : active ? '▸' : '✓'}</span>
              <span style={{ color: last ? '#fff' : active ? '#eef3fb' : 'rgba(214,222,236,0.82)', fontWeight: last ? 700 : 400 }}>{l}</span>
              {active && <span style={{ color: GOLD, animation: 'bs-blink 0.9s steps(1) infinite' }}>_</span>}
            </div>
          )
        })}
      </div>

      {/* progress */}
      <div style={{ position: 'relative', width: 400, maxWidth: '86vw' }}>
        <div style={{ height: 7, width: '100%', borderRadius: 4, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, borderRadius: 4, background: `linear-gradient(90deg, ${CYAN}, ${VIOLET}, ${GOLD}, ${CYAN})`, backgroundSize: '240% 100%', animation: 'bs-shimmer 1.5s linear infinite', boxShadow: `0 0 16px ${CYAN}aa` }} />
        </div>
        <div style={{ marginTop: 9, display: 'flex', justifyContent: 'space-between', fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, letterSpacing: 1.5, color: 'rgba(180,192,214,0.62)' }}>
          <span>{pct >= 100 ? 'INTELLIGENCE ONLINE' : 'CALIBRATING'}</span><span style={{ color: CYAN, fontWeight: 700 }}>{Math.round(pct)}%</span>
        </div>
      </div>

      {pct > 95 && <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 46%, ${CYAN}4d, transparent 58%)`, animation: 'bs-flash 0.6s ease-out forwards', pointerEvents: 'none' }} />}
    </div>
  )
}
