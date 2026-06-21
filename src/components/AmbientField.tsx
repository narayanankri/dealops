import { useEffect, useRef } from 'react'

// A deliberately faint version of the landing's knowledge graph, drifting behind the whole
// workspace so the product reads as one living system. Low node count, very low alpha, no
// labels — atmosphere, not focus. Always animates (motion is intentional in this demo).
export function AmbientField() {
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
    const N = 58
    const nodes = Array.from({ length: N }, (_, i) => ({
      x: Math.random(),
      y: Math.random(),
      z: rng(0.3, 1),
      vx: rng(-1, 1) * 0.00006,
      vy: rng(-1, 1) * 0.00006,
      r: i < 14 ? rng(1.8, 3.2) : rng(0.7, 2),
      hue: i % 3 === 2 ? 'violet' : 'cyan',
      hub: i < 14,
    }))
    const stars = Array.from({ length: 90 }, () => ({ x: Math.random(), y: Math.random(), r: Math.random() * 0.9 + 0.2, a: Math.random() * 0.5 + 0.1 }))
    const TH = 0.2
    let raf = 0
    let rot = 0
    let t0 = performance.now()

    const frame = (t: number) => {
      const dt = reduce ? 0 : t - t0
      t0 = t
      rot += dt * 0.0000025
      ctx.clearRect(0, 0, w, h)
      for (const s of stars) {
        ctx.globalAlpha = s.a
        ctx.fillStyle = '#9fc0d0'
        ctx.beginPath()
        ctx.arc(s.x * w, s.y * h, s.r, 0, 7)
        ctx.fill()
      }
      ctx.globalAlpha = 1
      const pts = nodes.map((n) => {
        if (!reduce) {
          n.x += n.vx
          n.y += n.vy
          if (n.x < 0 || n.x > 1) n.vx *= -1
          if (n.y < 0 || n.y > 1) n.vy *= -1
        }
        const a = rot * (0.4 + n.z * 0.6)
        const dx = n.x - 0.5
        const dy = n.y - 0.5
        const rx = 0.5 + dx * Math.cos(a) - dy * Math.sin(a)
        const ry = 0.5 + dx * Math.sin(a) + dy * Math.cos(a)
        return { sx: rx * w, sy: ry * h, n }
      })
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = (pts[i].sx - pts[j].sx) / w
          const dy = (pts[i].sy - pts[j].sy) / h
          const d = Math.hypot(dx, dy)
          if (d < TH) {
            ctx.strokeStyle = `rgba(95,180,215,${(1 - d / TH) * 0.16 * Math.min(pts[i].n.z, pts[j].n.z)})`
            ctx.lineWidth = 0.6
            ctx.beginPath()
            ctx.moveTo(pts[i].sx, pts[i].sy)
            ctx.lineTo(pts[j].sx, pts[j].sy)
            ctx.stroke()
          }
        }
      }
      for (const { sx, sy, n } of pts) {
        const rgb = n.hue === 'violet' ? '152,132,238' : '120,205,232'
        if (n.hub) {
          const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, n.r * 8)
          g.addColorStop(0, `rgba(${rgb},${0.22 * n.z})`)
          g.addColorStop(1, `rgba(${rgb},0)`)
          ctx.fillStyle = g
          ctx.beginPath()
          ctx.arc(sx, sy, n.r * 8, 0, 7)
          ctx.fill()
        }
        ctx.fillStyle = `rgba(${rgb},${(n.hub ? 0.55 : 0.34) * n.z})`
        ctx.beginPath()
        ctx.arc(sx, sy, n.r, 0, 7)
        ctx.fill()
      }
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])
  return <canvas ref={ref} className="pointer-events-none fixed inset-0 z-0 h-full w-full" aria-hidden />
}
