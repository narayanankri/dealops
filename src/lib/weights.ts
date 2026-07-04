// Reallocate sector % weights so they always sum to 100 when one slider is dragged.
// The last entry auto-calculates the remainder. Other entries keep their values while
// there's budget; only when the dragged slider exceeds the available budget do the
// others shrink proportionally — so a slider always moves to where you drag it
// (instead of hard-capping, which read as "my change isn't saving").
export function reallocateWeights(weights: number[], lastIdx: number, i: number, target: number): number[] {
  const n = weights.length
  if (i === lastIdx || n === 0) return weights.map((w) => Math.max(0, Math.round(w)))
  const v = Math.max(0, Math.min(100, Math.round(target)))
  const others = Array.from({ length: n }, (_, k) => k).filter((k) => k !== i && k !== lastIdx)
  const budget = 100 - v
  const otherSum = others.reduce((s, j) => s + weights[j], 0)
  const next = weights.slice()
  next[i] = v
  if (otherSum <= budget) {
    next[lastIdx] = budget - otherSum
  } else {
    let assigned = 0
    others.forEach((j, k) => {
      const share = otherSum > 0 ? weights[j] / otherSum : 1 / others.length
      next[j] = Math.max(0, k === others.length - 1 ? budget - assigned : Math.round(share * budget))
      assigned += next[j]
    })
    next[lastIdx] = 0
  }
  const rounded = next.map((w) => Math.max(0, Math.round(w)))
  const drift = 100 - rounded.reduce((s, x) => s + x, 0)
  rounded[lastIdx] = Math.max(0, rounded[lastIdx] + drift)
  return rounded
}
