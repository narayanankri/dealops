import type { Basis, Confidence, Verdict } from '@/types'

export function usdm(n: number): string {
  const abs = Math.abs(n)
  if (abs >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}tn`
  if (abs >= 1000) return `$${(n / 1000).toFixed(abs >= 10000 ? 1 : 2)}bn`
  return `$${Math.round(n).toLocaleString()}m`
}
export const pct = (n: number, d = 0) => `${n >= 0 ? '' : ''}${n.toFixed(d)}%`
export const signedPct = (n: number, d = 0) => `${n > 0 ? '+' : ''}${n.toFixed(d)}%`
export const mult = (n: number, d = 1) => `${n.toFixed(d)}x`

// Percentage that keeps ~2 significant figures for small values, so a tiny
// stake (e.g. $200m of a $1.75tn raise) never rounds to a misleading "0.0%".
// One decimal for values ≥ 0.1; trailing zeros trimmed.
export const pctSmart = (n: number): string => {
  const a = Math.abs(n)
  if (a === 0) return '0.0%'
  if (a >= 0.1) return `${n.toFixed(1)}%`
  const decimals = Math.min(4, Math.ceil(-Math.log10(a)) + 1)
  return `${parseFloat(n.toFixed(decimals))}%`
}

export const verdictLabel: Record<Verdict, string> = {
  proceed: 'Proceed',
  review: 'Review',
  pass: 'Pass',
}
export const verdictTone: Record<Verdict, 'pos' | 'warn' | 'neg'> = {
  proceed: 'pos',
  review: 'warn',
  pass: 'neg',
}

export function scoreTone(score: number): 'pos' | 'warn' | 'neg' {
  if (score >= 70) return 'pos'
  if (score >= 50) return 'warn'
  return 'neg'
}

export const basisLabel: Record<Basis, string> = {
  stated: 'Stated',
  inferred: 'Inferred',
  estimated: 'Estimated',
}
export const confidenceLabel: Record<Confidence, string> = {
  high: 'High',
  medium: 'Med',
  low: 'Low',
}
