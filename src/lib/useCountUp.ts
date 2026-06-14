import { useEffect, useRef, useState } from 'react'

// Animate a number from its previous value up to `target` (ease-out) — the "live tally"
// flourish used across the workspace so figures feel computed in real time, not printed.
// Honours prefers-reduced-motion (jumps straight to the target).
export function useCountUp(target: number, dur = 900): number {
  const [v, setV] = useState(target)
  const from = useRef(0)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      from.current = target
      setV(target)
      return
    }
    const start = performance.now()
    const a = from.current
    let raf = 0
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / dur)
      const e = 1 - Math.pow(1 - p, 3)
      setV(a + (target - a) * e)
      if (p < 1) raf = requestAnimationFrame(step)
      else from.current = target
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target, dur])
  return v
}
