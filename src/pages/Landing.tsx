import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/cn'

// ── The brand mark — the tick-dial gauge, partly lit (matches the app) ──
function GaugeMark({ size = 22 }: { size?: number }) {
  const ticks = 12
  const lit = 8
  const c = size / 2
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
      {Array.from({ length: ticks }, (_, i) => {
        const ang = ((-90 + i * (360 / ticks)) * Math.PI) / 180
        const r = c - 1.5
        const len = size * 0.16
        return (
          <line
            key={i}
            x1={c + r * Math.cos(ang)}
            y1={c + r * Math.sin(ang)}
            x2={c + (r - len) * Math.cos(ang)}
            y2={c + (r - len) * Math.sin(ang)}
            stroke={i < lit ? 'var(--color-accent)' : 'var(--color-line)'}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        )
      })}
      <circle cx={c} cy={c} r={size * 0.085} fill="var(--color-accent)" />
    </svg>
  )
}

// ── A large gauge that calibrates on mount: ticks light up sweeping to a value ──
function CalibratingGauge({ score = 88, size = 300, ticks = 44 }: { score?: number; size?: number; ticks?: number }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    let raf = 0
    const start = performance.now()
    const dur = 1400
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(eased * score))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [score])
  const c = size / 2
  const rOut = size / 2 - 6
  const tickLen = size * 0.1
  const filled = Math.round((val / 100) * ticks)
  return (
    <div className="relative inline-grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        {Array.from({ length: ticks }, (_, i) => {
          const ang = (-90 + i * (360 / ticks)) * (Math.PI / 180)
          const on = i < filled
          return (
            <line
              key={i}
              x1={c + rOut * Math.cos(ang)}
              y1={c + rOut * Math.sin(ang)}
              x2={c + (rOut - tickLen) * Math.cos(ang)}
              y2={c + (rOut - tickLen) * Math.sin(ang)}
              stroke={on ? 'var(--color-accent)' : 'var(--color-line)'}
              strokeWidth={2}
              strokeLinecap="round"
              style={{ transition: 'stroke 0.25s ease' }}
            />
          )
        })}
      </svg>
      <div className="absolute grid place-items-center text-center">
        <span className="font-display text-6xl font-semibold tnum text-ink">{val}</span>
        <span className="mt-1 font-mono text-[10px] tracking-[0.25em] text-ink-3 uppercase">Composite</span>
      </div>
    </div>
  )
}

// ── A number that counts up to its target on mount (the "live tally" flourish) ──
function CountUp({ to, decimals = 0, prefix = '', suffix = '', dur = 1800 }: { to: number; decimals?: number; prefix?: string; suffix?: string; dur?: number }) {
  const [v, setV] = useState(0)
  useEffect(() => {
    let raf = 0
    const start = performance.now()
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / dur)
      const e = 1 - Math.pow(1 - p, 3)
      setV(to * e)
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [to, dur])
  return (
    <span>
      {prefix}
      {v.toFixed(decimals)}
      {suffix}
    </span>
  )
}

function MetricChip({ label, children, className, delay = 0 }: { label: string; children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <div
      className={cn('lp-float absolute rounded-xl border border-line/60 bg-panel/55 px-4 py-2.5 backdrop-blur', className)}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="font-mono text-[9px] tracking-wide text-ink-3 uppercase">{label}</div>
      <div className="font-mono text-lg font-semibold tnum text-accent-2">{children}</div>
    </div>
  )
}

// ── The living "knowledge graph" — a cosmic web of deals ──
// Glowing labelled hubs (companies, sectors, metrics) drift through a starfield,
// wired to their neighbours by filaments, with signal pulses firing along the edges.
// Hand-rolled on canvas for 60fps; always animates (motion is intentional in this demo).
const GRAPH_LABELS = [
  'Tabby', 'Tamara', 'SpaceX', 'Starlink', 'Talabat', 'Property Finder', 'Khazna',
  'Ramp', 'Plaid', 'Lulu', 'Americana', 'Vision 2030', 'Open Banking', 'BNPL',
  'Data centres', 'IRR 24%', 'EV/Rev 5.2×', '0 blocking', 'Tarabut', 'Lean',
  'Nana', 'Floward', 'MNT-Halan', 'Sukuk', 'GCC', 'MENA', '$1.75tn', 'Re-rate 7×',
]

interface GNode {
  x: number
  y: number
  z: number
  vx: number
  vy: number
  r: number
  base: number
  phase: number
  label?: string
  hue: 'cyan' | 'violet'
  ox: number
  oy: number
}
interface Signal {
  a: number
  b: number
  t: number
  sp: number
}
interface Flare {
  i: number
  t: number
}

function KnowledgeGraph() {
  const ref = useRef<HTMLCanvasElement | null>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const reduce = false // always animate (motion is intentional in this demo)
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    let w = 0
    let h = 0
    const resize = () => {
      const r = canvas.getBoundingClientRect()
      w = r.width
      h = r.height
      canvas.width = Math.max(1, Math.floor(w * dpr))
      canvas.height = Math.max(1, Math.floor(h * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const rng = (a: number, b: number) => a + Math.random() * (b - a)
    const N = 124
    const nodes: GNode[] = []
    for (let i = 0; i < N; i++) {
      const hub = i < GRAPH_LABELS.length
      nodes.push({
        x: rng(0.04, 0.96),
        y: rng(0.06, 0.94),
        z: rng(0.25, 1),
        vx: rng(-1, 1) * 0.00007,
        vy: rng(-1, 1) * 0.00007,
        r: hub ? rng(2.6, 4.2) : rng(0.6, 1.9),
        base: hub ? rng(0.75, 1) : rng(0.18, 0.5),
        phase: rng(0, Math.PI * 2),
        label: hub ? GRAPH_LABELS[i] : undefined,
        hue: i % 3 === 2 ? 'violet' : 'cyan',
        ox: rng(-0.4, 1.4),
        oy: rng(-0.4, 1.4),
      })
    }
    const stars = Array.from({ length: 170 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 0.9 + 0.2,
      a: Math.random() * 0.5 + 0.08,
      tw: rng(0, Math.PI * 2),
    }))
    const nebulae = [
      { x: 0.3, y: 0.42, r: 0.46, c: '34,160,190' },
      { x: 0.72, y: 0.6, r: 0.52, c: '120,80,225' },
      { x: 0.58, y: 0.22, r: 0.36, c: '25,194,219' },
      { x: 0.85, y: 0.3, r: 0.32, c: '150,90,235' },
    ]
    const signals: Signal[] = []
    const flares: Flare[] = []
    const mouse = { x: 0.5, y: 0.5 }
    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect()
      mouse.x = (e.clientX - r.left) / r.width
      mouse.y = (e.clientY - r.top) / r.height
    }
    window.addEventListener('mousemove', onMove)

    const TH = 0.18
    let t0 = performance.now()
    let raf = 0
    let rot = 0
    const bootStart = performance.now()
    const BOOT = 2000

    const frame = (t: number) => {
      const dt = reduce ? 0 : t - t0
      t0 = t
      rot += dt * 0.000004
      const bootP = reduce ? 1 : Math.min(1, (t - bootStart) / BOOT)
      const eb = 1 - Math.pow(1 - bootP, 3)
      ctx.clearRect(0, 0, w, h)

      for (const neb of nebulae) {
        const nx = (neb.x + 0.02 * Math.sin(t * 0.00007 + neb.r)) * w
        const ny = (neb.y + 0.02 * Math.cos(t * 0.00006 + neb.r)) * h
        const rad = neb.r * Math.max(w, h)
        const g = ctx.createRadialGradient(nx, ny, 0, nx, ny, rad)
        g.addColorStop(0, `rgba(${neb.c},0.16)`)
        g.addColorStop(1, `rgba(${neb.c},0)`)
        ctx.fillStyle = g
        ctx.fillRect(0, 0, w, h)
      }

      for (const s of stars) {
        const tw = 0.6 + 0.4 * Math.sin(t * 0.001 + s.tw)
        ctx.globalAlpha = s.a * tw
        ctx.fillStyle = '#bcd6e0'
        ctx.beginPath()
        ctx.arc(s.x * w, s.y * h, s.r, 0, 7)
        ctx.fill()
      }
      ctx.globalAlpha = 1

      const cx = 0.5
      const cy = 0.5
      const px = mouse.x - 0.5
      const py = mouse.y - 0.5
      const pts = nodes.map((n) => {
        if (!reduce) {
          n.x += n.vx
          n.y += n.vy
          if (n.x < 0.02 || n.x > 0.98) n.vx *= -1
          if (n.y < 0.04 || n.y > 0.96) n.vy *= -1
        }
        const a = rot * (0.4 + n.z * 0.6)
        const dx = n.x - cx
        const dy = n.y - cy
        const rx = cx + dx * Math.cos(a) - dy * Math.sin(a)
        const ry = cy + dx * Math.sin(a) + dy * Math.cos(a)
        const tx = rx + px * 0.05 * n.z
        const ty = ry + py * 0.05 * n.z
        const sx = (n.ox + (tx - n.ox) * eb) * w
        const sy = (n.oy + (ty - n.oy) * eb) * h
        return { sx, sy, n }
      })

      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = (pts[i].sx - pts[j].sx) / w
          const dy = (pts[i].sy - pts[j].sy) / h
          const d = Math.hypot(dx, dy)
          if (d < TH) {
            const al = (1 - d / TH) * 0.34 * Math.min(pts[i].n.z, pts[j].n.z) * bootP
            ctx.strokeStyle = `rgba(90,200,225,${al})`
            ctx.lineWidth = 0.6
            ctx.beginPath()
            ctx.moveTo(pts[i].sx, pts[i].sy)
            ctx.lineTo(pts[j].sx, pts[j].sy)
            ctx.stroke()
          }
        }
      }

      if (!reduce && bootP >= 1 && signals.length < 30 && Math.random() < 0.17) {
        const i = Math.floor(Math.random() * pts.length)
        let best = -1
        let bd = TH
        for (let j = 0; j < pts.length; j++) {
          if (j === i) continue
          const dx = (pts[i].sx - pts[j].sx) / w
          const dy = (pts[i].sy - pts[j].sy) / h
          const d = Math.hypot(dx, dy)
          if (d < bd) {
            bd = d
            best = j
          }
        }
        if (best >= 0) signals.push({ a: i, b: best, t: 0, sp: rng(0.009, 0.022) })
      }
      for (let k = signals.length - 1; k >= 0; k--) {
        const s = signals[k]
        s.t += reduce ? 0 : s.sp
        const A = pts[s.a]
        const B = pts[s.b]
        if (s.t >= 1 || !A || !B) {
          signals.splice(k, 1)
          continue
        }
        for (let tr = 0; tr < 4; tr++) {
          const tt = s.t - tr * 0.045
          if (tt < 0) break
          const x = A.sx + (B.sx - A.sx) * tt
          const y = A.sy + (B.sy - A.sy) * tt
          const fade = 1 - tr / 4
          ctx.fillStyle = `rgba(140,238,255,${0.95 * fade})`
          ctx.beginPath()
          ctx.arc(x, y, 2.1 * fade, 0, 7)
          ctx.fill()
        }
      }

      ctx.font = '11px "IBM Plex Mono", ui-monospace, monospace'
      for (const { sx, sy, n } of pts) {
        const pulse = 0.7 + 0.3 * Math.sin(t * 0.0014 + n.phase)
        const isHub = !!n.label
        const r = n.r * (isHub ? pulse : 1)
        const glow = n.hue === 'violet' ? '150,110,245' : '60,210,235'
        if (isHub) {
          const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, r * 9)
          g.addColorStop(0, `rgba(${glow},${0.62 * n.base * bootP})`)
          g.addColorStop(1, `rgba(${glow},0)`)
          ctx.fillStyle = g
          ctx.beginPath()
          ctx.arc(sx, sy, r * 9, 0, 7)
          ctx.fill()
        }
        ctx.fillStyle = isHub
          ? n.hue === 'violet'
            ? `rgba(204,184,255,${n.base})`
            : `rgba(160,243,255,${n.base})`
          : `rgba(150,200,220,${n.base})`
        ctx.beginPath()
        ctx.arc(sx, sy, r, 0, 7)
        ctx.fill()
        if (isHub && n.label) {
          ctx.fillStyle = `rgba(208,238,248,${(0.45 + 0.4 * pulse) * bootP})`
          ctx.fillText(n.label, sx + r + 5, sy + 3)
        }
      }

      if (!reduce && bootP >= 1 && flares.length < 5 && Math.random() < 0.022) {
        flares.push({ i: Math.floor(Math.random() * GRAPH_LABELS.length), t: 0 })
      }
      for (let k = flares.length - 1; k >= 0; k--) {
        const f = flares[k]
        f.t += reduce ? 1 : 0.02
        const p = pts[f.i]
        if (f.t >= 1 || !p) {
          flares.splice(k, 1)
          continue
        }
        const fg = p.n.hue === 'violet' ? '185,150,255' : '120,235,255'
        ctx.strokeStyle = `rgba(${fg},${(1 - f.t) * 0.85})`
        ctx.lineWidth = 1.6 * (1 - f.t)
        ctx.beginPath()
        ctx.arc(p.sx, p.sy, 6 + f.t * 50, 0, 7)
        ctx.stroke()
      }

      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
    }
  }, [])
  return <canvas ref={ref} className="fixed inset-0 h-full w-full" aria-hidden />
}

// ── Shared: the dummy login card (any credentials enter the workspace) ──
function LoginCard({ onEnter, className }: { onEnter: () => void; className?: string }) {
  const [entering, setEntering] = useState(false)
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (entering) return
    setEntering(true)
    window.setTimeout(onEnter, 600)
  }
  return (
    <form
      onSubmit={submit}
      className={cn('w-full max-w-sm rounded-2xl border border-line bg-panel/70 p-6 backdrop-blur', entering && 'lp-scan', className)}
    >
      <div className="mb-5 flex items-center gap-2.5">
        <GaugeMark size={20} />
        <span className="font-display text-sm font-semibold text-ink">Sign in to the workspace</span>
      </div>
      <label className="mb-1 block font-mono text-[10px] tracking-wide text-ink-3 uppercase">Username</label>
      <input
        type="text"
        placeholder="username"
        className="mb-3 w-full rounded-lg border border-line bg-panel-2/70 px-3 py-2.5 text-sm text-ink placeholder:text-ink-3/60 outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/20"
      />
      <label className="mb-1 block font-mono text-[10px] tracking-wide text-ink-3 uppercase">Password</label>
      <input
        type="password"
        placeholder="••••••••••"
        className="mb-4 w-full rounded-lg border border-line bg-panel-2/70 px-3 py-2.5 text-sm text-ink placeholder:text-ink-3/60 outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/20"
      />
      <button
        type="submit"
        className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-canvas transition-colors hover:bg-accent-2 disabled:opacity-70"
        disabled={entering}
      >
        {entering ? 'Calibrating…' : 'Enter the workspace →'}
      </button>
    </form>
  )
}

function Eyebrow() {
  return <div className="font-mono text-[11px] tracking-[0.28em] text-accent-2/90 uppercase">AI Deal Operations</div>
}
function Subcopy() {
  return (
    <p className="max-w-md text-[15px] leading-relaxed text-ink-2">
      Every figure computed from the data, sourced to filings, and checked for coherence before it reaches the
      committee. A screening instrument for GCC/MENA private capital.
    </p>
  )
}
function TrustStrip() {
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] tnum text-ink-3">
      <span className="text-ink-2">15 deals</span>
      <span>·</span>
      <span className="text-pos">0 blocking checks</span>
      <span>·</span>
      <span>every figure sourced</span>
    </div>
  )
}

function Brand() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-panel-2">
        <GaugeMark size={20} />
      </span>
      <div className="leading-tight">
        <div className="font-display text-sm font-semibold tracking-tight text-ink">Deal Operations</div>
        <div className="font-mono text-[9px] tracking-[0.18em] text-ink-3 uppercase">Investment screening</div>
      </div>
    </div>
  )
}

const PILLARS = [
  { k: 'Computed', d: 'A deterministic engine builds the valuation, returns and a balanced three-statement model — live, not narrated.' },
  { k: 'Sourced', d: 'Every claim is stated, inferred or estimated — each with its citation or its method. No unlabelled numbers.' },
  { k: 'Coherent', d: 'A coherence ledger checks ~20 invariants on every deal and blocks anything that does not reconcile.' },
]

export function Landing({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      {/* the living knowledge graph fills the canvas behind everything */}
      <KnowledgeGraph />
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            'radial-gradient(120% 85% at 30% 35%, transparent 0%, rgba(10,11,14,0.35) 60%, rgba(10,11,14,0.78) 100%), linear-gradient(90deg, rgba(10,11,14,0.65) 0%, transparent 45%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-6 sm:px-10">
        {/* nav */}
        <nav className="flex items-center justify-between">
          <Brand />
          <div className="hidden items-center gap-2 font-mono text-[11px] text-ink-3 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-pos" />
            <span className="uppercase tracking-wide">Engine online · v1.0</span>
          </div>
        </nav>

        {/* hero */}
        <main className="lp-rise">
          <div className="relative py-12 lg:py-16">
            {/* foreground: headline + login */}
            <div className="relative z-10 grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="space-y-6">
                <Eyebrow />
                <h1 className="font-display text-5xl leading-[1.04] font-semibold tracking-tight text-ink sm:text-7xl">
                  Deal screening,
                  <br />
                  <span className="text-accent-2">calibrated.</span>
                </h1>
                <Subcopy />
                <TrustStrip />
                <p className="max-w-md font-mono text-[11px] leading-relaxed tracking-wide text-ink-3">
                  Every company, sector and metric — one connected intelligence, screened in real time.
                </p>
              </div>
              <div className="flex justify-center lg:justify-end">
                <LoginCard onEnter={onEnter} className="border-line/80 bg-panel/55 backdrop-blur-xl" />
              </div>
            </div>

            {/* instrument core — sits BELOW the foreground text, live tallies flanking it */}
            <div className="relative z-10 mt-10 hidden h-[300px] items-center justify-center lg:flex">
              <div className="pointer-events-none opacity-90">
                <CalibratingGauge score={88} size={340} ticks={56} />
              </div>
              <MetricChip label="Capital analysed" className="top-1/2 left-[3%] -translate-y-1/2" delay={0.3}>
                <CountUp to={2.4} decimals={1} prefix="$" suffix="tn" />
              </MetricChip>
              <MetricChip label="Median base IRR" className="bottom-0 left-1/2 -translate-x-1/2" delay={0.9}>
                <CountUp to={24.1} decimals={1} suffix="%" />
              </MetricChip>
              <MetricChip label="Blocking checks" className="top-1/2 right-[3%] -translate-y-1/2" delay={0.6}>
                <CountUp to={0} suffix=" / 312" />
              </MetricChip>
            </div>
          </div>
        </main>

        {/* below-fold: three pillars */}
        <section className="grid gap-4 border-t border-line/60 py-10 sm:grid-cols-3">
          {PILLARS.map((p) => (
            <div key={p.k}>
              <div className="mb-1.5 flex items-center gap-2">
                <span className="h-1 w-6 rounded-full bg-accent" />
                <span className="font-display text-sm font-semibold text-ink">{p.k}</span>
              </div>
              <p className="text-[13px] leading-relaxed text-ink-3">{p.d}</p>
            </div>
          ))}
        </section>

        {/* footer */}
        <footer className="flex flex-col items-center justify-between gap-2 border-t border-line/60 py-6 font-mono text-[10px] text-ink-3 sm:flex-row">
          <span className="uppercase tracking-wide">AI Deal Operations · GCC/MENA private capital</span>
          <span>Illustrative demo · not investment advice</span>
        </footer>
      </div>
    </div>
  )
}
