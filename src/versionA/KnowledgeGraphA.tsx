import { useEffect, useRef } from 'react'

// A live, force-directed knowledge graph for the Version A hero — drift, cursor
// force-field, hover highlight, drag, travelling pulses that chain across edges,
// and idle auto-attract bursts. Pure canvas. Always animates (decorative hero).
type RawNode = { id: string; label: string; isHub?: boolean }
const NODES: RawNode[] = [
  { id: 'intelligence', label: 'Intelligence', isHub: true },
  { id: 'mandate', label: 'Mandate', isHub: true },
  { id: 'deal', label: 'Deal', isHub: true },
  { id: 'capital', label: 'Capital', isHub: true },
  { id: 'gcc', label: 'GCC', isHub: true },
  { id: 'sectors', label: 'Sectors' }, { id: 'geography', label: 'Geography' },
  { id: 'stage', label: 'Stage' }, { id: 'ticket', label: 'Ticket' },
  { id: 'returns', label: 'Returns' }, { id: 'esg', label: 'ESG' },
  { id: 'redlines', label: 'Red Lines' }, { id: 'concentration', label: 'Concentration' },
  { id: 'comparables', label: 'Comparables' }, { id: 'valuation', label: 'Valuation' },
  { id: 'irr', label: 'IRR' }, { id: 'moic', label: 'MOIC' }, { id: 'memo', label: 'IC Memo' },
  { id: 'sensitivity', label: 'Sensitivity' }, { id: 'diligence', label: 'Diligence' },
  { id: 'seriesb', label: 'Series B' }, { id: 'seriesc', label: 'Series C' },
  { id: 'preipo', label: 'Pre-IPO' }, { id: 'growth', label: 'Growth' }, { id: 'buyout', label: 'Buyout' },
  { id: 'ksa', label: 'KSA' }, { id: 'uae', label: 'UAE' }, { id: 'bahrain', label: 'Bahrain' },
  { id: 'healthcare', label: 'Healthcare' }, { id: 'energy', label: 'Energy' },
  { id: 'fintech', label: 'Fintech' }, { id: 'consumer', label: 'Consumer' },
  { id: 'scoring', label: 'Scoring' }, { id: 'search', label: 'Web Search' },
  { id: 'audit', label: 'Audit Trail' }, { id: 'research', label: 'Research' },
]
const EDGES: [string, string][] = [
  ['mandate', 'sectors'], ['mandate', 'geography'], ['mandate', 'stage'], ['mandate', 'ticket'],
  ['mandate', 'returns'], ['mandate', 'esg'], ['mandate', 'redlines'], ['mandate', 'concentration'],
  ['deal', 'comparables'], ['deal', 'valuation'], ['deal', 'memo'], ['deal', 'sensitivity'], ['deal', 'diligence'],
  ['valuation', 'irr'], ['valuation', 'moic'], ['valuation', 'sensitivity'], ['comparables', 'valuation'], ['diligence', 'memo'],
  ['capital', 'seriesb'], ['capital', 'seriesc'], ['capital', 'preipo'], ['capital', 'growth'], ['capital', 'buyout'],
  ['gcc', 'ksa'], ['gcc', 'uae'], ['gcc', 'bahrain'], ['gcc', 'healthcare'], ['gcc', 'energy'], ['gcc', 'fintech'], ['gcc', 'consumer'],
  ['intelligence', 'scoring'], ['intelligence', 'search'], ['intelligence', 'audit'], ['intelligence', 'research'],
  ['scoring', 'mandate'], ['scoring', 'deal'], ['search', 'research'], ['research', 'deal'], ['research', 'gcc'],
  ['audit', 'memo'], ['audit', 'mandate'], ['sectors', 'healthcare'], ['sectors', 'energy'], ['sectors', 'fintech'], ['sectors', 'consumer'],
  ['geography', 'ksa'], ['geography', 'uae'], ['geography', 'bahrain'],
  ['stage', 'seriesb'], ['stage', 'seriesc'], ['stage', 'preipo'], ['stage', 'growth'], ['returns', 'irr'],
  ['intelligence', 'mandate'], ['intelligence', 'deal'],
]

interface Node extends RawNode { x: number; y: number; vx: number; vy: number }
interface Pulse { s: number; t: number; t0: number; gen: number }

export function KnowledgeGraphA() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const dpr = window.devicePixelRatio || 1

    const nodes: Node[] = NODES.map((n) => ({ ...n, x: 0, y: 0, vx: 0, vy: 0 }))
    const idMap: Record<string, number> = Object.fromEntries(nodes.map((n, i) => [n.id, i]))
    const edges = EDGES.map(([s, t]) => ({ s: idMap[s], t: idMap[t] })).filter((e) => e.s !== undefined && e.t !== undefined)
    const HUBS = nodes.map((n, i) => (n.isHub ? i : -1)).filter((i) => i >= 0)
    const mouse = { x: -1e4, y: -1e4, lastMove: 0 }
    let drag: number | null = null
    let hover: number | null = null
    const pulses: Pulse[] = []
    const N = nodes.length

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const cw = canvas.clientWidth, ch = canvas.clientHeight
    nodes.forEach((n, i) => {
      const a = (i / N) * Math.PI * 2
      const r = (n.isHub ? 100 : 280) + Math.random() * 80
      n.x = cw / 2 + Math.cos(a) * r
      n.y = ch / 2 + Math.sin(a) * r
    })
    window.addEventListener('resize', resize)

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left; mouse.y = e.clientY - rect.top; mouse.lastMove = performance.now()
      if (drag !== null) { nodes[drag].x = mouse.x; nodes[drag].y = mouse.y; nodes[drag].vx = 0; nodes[drag].vy = 0 }
    }
    const onLeave = () => { mouse.x = -1e4; mouse.y = -1e4 }
    const onDown = () => { if (hover !== null) drag = hover }
    const onUp = () => { drag = null }
    canvas.addEventListener('mousemove', onMove)
    canvas.addEventListener('mouseleave', onLeave)
    canvas.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)

    const MAX_PULSES = 60
    const spawn = (s: number, t: number, gen = 0) => { if (pulses.length < MAX_PULSES) pulses.push({ s, t, t0: performance.now(), gen }) }
    const spawnRandom = () => { if (!edges.length) return; const e = edges[(Math.random() * edges.length) | 0]; Math.random() < 0.5 ? spawn(e.s, e.t) : spawn(e.t, e.s) }
    const burst = (hub: number) => {
      const out = edges.filter((e) => e.s === hub || e.t === hub)
      const k = Math.min(out.length, 2 + ((Math.random() * 3) | 0))
      const used = new Set<number>()
      for (let i = 0; i < k; i++) { const idx = (Math.random() * out.length) | 0; if (used.has(idx)) continue; used.add(idx); const e = out[idx]; spawn(hub, e.s === hub ? e.t : e.s, 0) }
    }

    const step = (render: boolean) => {
      const W = canvas.clientWidth, H = canvas.clientHeight, cx = W / 2, cy = H / 2
      const tNow = performance.now()
      const idle = tNow - mouse.lastMove > 3000 && mouse.x < -1000
      const fx = new Array(N).fill(0), fy = new Array(N).fill(0)
      for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
        const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y, d2 = dx * dx + dy * dy + 0.01, d = Math.sqrt(d2)
        const f = ((nodes[i].isHub || nodes[j].isHub) ? 5500 : 2000) / d2
        fx[i] += (dx / d) * f; fy[i] += (dy / d) * f; fx[j] -= (dx / d) * f; fy[j] -= (dy / d) * f
      }
      for (const e of edges) {
        const a = nodes[e.s], b = nodes[e.t], dx = b.x - a.x, dy = b.y - a.y, d = Math.sqrt(dx * dx + dy * dy) + 0.01
        const f = 0.025 * (d - ((a.isHub || b.isHub) ? 130 : 90))
        fx[e.s] += (dx / d) * f; fy[e.s] += (dy / d) * f; fx[e.t] -= (dx / d) * f; fy[e.t] -= (dy / d) * f
      }
      for (let i = 0; i < N; i++) { fx[i] += (cx - nodes[i].x) * 0.0035; fy[i] += (cy - nodes[i].y) * 0.0035 }
      for (let i = 0; i < N; i++) { fx[i] += (Math.random() - 0.5) * 6; fy[i] += (Math.random() - 0.5) * 6 }
      if (mouse.x > -1000) {
        const R = 170
        for (let i = 0; i < N; i++) { const dx = nodes[i].x - mouse.x, dy = nodes[i].y - mouse.y, d = Math.sqrt(dx * dx + dy * dy) + 0.01; if (d < R) { const s = (1 - d / R) * 90; fx[i] += (dx / d) * s; fy[i] += (dy / d) * s } }
      }
      for (let i = 0; i < N; i++) {
        if (i === drag) continue
        nodes[i].vx = (nodes[i].vx + fx[i]) * 0.86; nodes[i].vy = (nodes[i].vy + fy[i]) * 0.86
        const sp = Math.hypot(nodes[i].vx, nodes[i].vy); if (sp > 60) { nodes[i].vx = (nodes[i].vx / sp) * 60; nodes[i].vy = (nodes[i].vy / sp) * 60 }
        nodes[i].x += nodes[i].vx * 0.08; nodes[i].y += nodes[i].vy * 0.08
        const M = 50
        if (nodes[i].x < M) { nodes[i].x = M; nodes[i].vx *= -0.4 }
        if (nodes[i].x > W - M) { nodes[i].x = W - M; nodes[i].vx *= -0.4 }
        if (nodes[i].y < M) { nodes[i].y = M; nodes[i].vy *= -0.4 }
        if (nodes[i].y > H - M) { nodes[i].y = H - M; nodes[i].vy *= -0.4 }
      }
      if (!render) return

      hover = null; let minD = 999
      for (let i = 0; i < N; i++) { const d = Math.hypot(mouse.x - nodes[i].x, mouse.y - nodes[i].y); const radius = nodes[i].isHub ? 28 : 22; if (d < radius && d < minD) { hover = i; minD = d } }
      canvas.style.cursor = hover !== null ? (drag !== null ? 'grabbing' : 'grab') : 'default'

      if (hover !== null) { if (tNow - lastPulse > 220) { const out = edges.filter((e) => e.s === hover || e.t === hover); if (out.length) { const e = out[(Math.random() * out.length) | 0]; spawn(hover, e.s === hover ? e.t : e.s) } lastPulse = tNow } }
      else if (tNow - lastPulse > 500) { spawnRandom(); lastPulse = tNow }
      if (idle && tNow - lastBurst > 3500) { burst(HUBS[(Math.random() * HUBS.length) | 0]); lastBurst = tNow }

      const cluster = new Set<number>()
      if (hover !== null) { cluster.add(hover); for (const e of edges) { if (e.s === hover) cluster.add(e.t); if (e.t === hover) cluster.add(e.s) } }

      ctx.fillStyle = '#050B17'; ctx.fillRect(0, 0, W, H)
      const vg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * 0.7)
      vg.addColorStop(0, 'rgba(8,22,44,0.6)'); vg.addColorStop(0.6, 'rgba(5,11,23,0)'); vg.addColorStop(1, 'rgba(0,0,0,0.7)')
      ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H)

      for (const e of edges) {
        const a = nodes[e.s], b = nodes[e.t], isHovEdge = hover !== null && (e.s === hover || e.t === hover), dimmed = hover !== null && !isHovEdge
        ctx.strokeStyle = isHovEdge ? 'rgba(0,220,255,0.6)' : dimmed ? 'rgba(0,145,218,0.05)' : 'rgba(0,145,218,0.18)'
        ctx.lineWidth = isHovEdge ? 1.6 : 0.7
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke()
      }

      const DUR = 1300
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i], t = (tNow - p.t0) / DUR
        if (t >= 1) {
          const chainP = 0.55 * Math.pow(0.62, p.gen)
          if (p.gen < 4 && Math.random() < chainP && pulses.length < MAX_PULSES) {
            const arrived = p.t, out = edges.filter((e) => e.s === arrived || e.t === arrived)
            if (out.length) { const e = out[(Math.random() * out.length) | 0]; const tgt = e.s === arrived ? e.t : e.s; if (tgt !== p.s) spawn(arrived, tgt, p.gen + 1) }
          }
          pulses.splice(i, 1); continue
        }
        const a = nodes[p.s], b = nodes[p.t], x = a.x + (b.x - a.x) * t, y = a.y + (b.y - a.y) * t, al = Math.sin(t * Math.PI)
        const g = ctx.createRadialGradient(x, y, 0, x, y, 14); g.addColorStop(0, `rgba(0,230,255,${0.95 * al})`); g.addColorStop(1, 'rgba(0,230,255,0)')
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 14, 0, Math.PI * 2); ctx.fill()
        ctx.fillStyle = `rgba(255,255,255,${al})`; ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2); ctx.fill()
      }

      for (let i = 0; i < N; i++) {
        const n = nodes[i], isHov = hover === i, dim = hover !== null && !cluster.has(i)
        const r = n.isHub ? (isHov ? 13 : 10) : (isHov ? 7 : 4.5), c = n.isHub ? '#FD349C' : '#0091DA'
        const glowR = r * 3.6, ga = dim ? 0.1 : n.isHub ? 0.6 : 0.42
        const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, glowR)
        g.addColorStop(0, c + Math.round(ga * 255).toString(16).padStart(2, '0')); g.addColorStop(1, c + '00')
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(n.x, n.y, glowR, 0, Math.PI * 2); ctx.fill()
        ctx.fillStyle = dim ? 'rgba(0,145,218,0.32)' : c; ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, Math.PI * 2); ctx.fill()
        if (n.isHub) { ctx.strokeStyle = dim ? 'rgba(253,52,156,0.18)' : 'rgba(253,52,156,0.6)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(n.x, n.y, r + 4, 0, Math.PI * 2); ctx.stroke() }
      }
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle'
      for (let i = 0; i < N; i++) {
        const n = nodes[i], isHov = hover === i, dim = hover !== null && !cluster.has(i), r = n.isHub ? 13 : 5.5
        if (n.isHub) { ctx.font = "700 14px 'Inter', system-ui, sans-serif"; ctx.fillStyle = dim ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.95)' }
        else { ctx.font = isHov ? "600 12px 'Inter', system-ui, sans-serif" : "11px 'Inter', system-ui, sans-serif"; ctx.fillStyle = dim ? 'rgba(255,255,255,0.18)' : isHov ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.55)' }
        ctx.fillText(n.label, n.x + r + 7, n.y)
      }
    }
    let lastPulse = performance.now(), lastBurst = performance.now()
    let raf = 0
    for (let k = 0; k < 90; k++) step(false) // pre-settle so the first paint looks good
    const loop = () => { step(true); raf = requestAnimationFrame(loop) }
    loop() // always animate — this is the decorative hero, motion is the point
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', onMove)
      canvas.removeEventListener('mouseleave', onLeave)
      canvas.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
    }
  }, [])
  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }} />
}
