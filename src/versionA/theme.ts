// ───────────────────────────────────────────────────────────
// Version A — "KPMG editorial" facelift theme.
//
// A FACELIFT ONLY: Version A reuses the same engine, store, data and copy as the
// rest of the app (via useApp/analyze). Nothing here is logic — it is the palette
// + type vocabulary that gives Version A its deep-navy, serif-display look, kept
// fully isolated from the Tailwind "Instrument" tokens used by Version B.
// ───────────────────────────────────────────────────────────
import type { DealStatus, Verdict } from '@/types'

// Deep-navy KPMG-style palette.
export const T = {
  navy: '#00338D', navyDeep: '#001A4D', navyMid: '#002766',
  blue: '#0091DA', cyan: '#00A3E0', cyanSoft: '#5BC2E7',
  purple: '#483698', purpleSoft: '#6B5CC4',
  pink: '#EB1F6A', green: '#00A651', amber: '#F59E0B', red: '#DC2626',
  magenta: '#FD349C', cobalt: '#1E49E2', lightBlue: '#ACEAFF', accentPurple: '#470A68',
  ink: '#0A1628', card: '#0F2040', cardHi: '#16294F',
  border: '#1E3460', borderHi: '#2A4480',
  text: '#FFFFFF', muted: '#8BA3C7', mutedHi: '#B8C8DC',
  bg: '#060E1A',
  bgGrad: 'linear-gradient(135deg, #060E1A 0%, #0A1628 50%, #0F2040 100%)',
  heroGrad: 'radial-gradient(ellipse at top, #001A4D 0%, #060E1A 60%)',
}

export const FONT = {
  serif: "'Fraunces', Georgia, serif",
  sans: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, monospace",
}

// ── Map OUR domain enums onto Version A's visual vocabulary ──
// Status (deal lifecycle).
export const STATUS_A: Record<DealStatus, { label: string; color: string }> = {
  new: { label: 'New', color: T.blue },
  ready: { label: 'Ready', color: T.cyan },
  'sent-to-ic': { label: 'Sent to IC', color: T.amber },
  rejected: { label: 'Rejected', color: T.muted },
  archived: { label: 'Archived', color: T.purpleSoft },
}

// Verdict (engine recommendation) — inform, don't recommend.
export const VERDICT_A: Record<Verdict, { label: string; icon: string; color: string }> = {
  proceed: { label: 'Proceed', icon: '✓', color: T.green },
  review: { label: 'Review', icon: '?', color: T.amber },
  pass: { label: 'Pass', icon: '—', color: T.muted },
}

// Score → traffic-light colour (shared by chips, bars, gauges).
export const scoreColor = (s: number): string => (s >= 75 ? T.green : s >= 60 ? T.amber : s >= 40 ? T.blue : T.red)

// hex + alpha helper, e.g. alpha(T.cyan, 0.13) → "#00A3E021"
export const alpha = (hex: string, a: number): string => {
  const v = Math.round(Math.max(0, Math.min(1, a)) * 255)
    .toString(16)
    .padStart(2, '0')
  return hex + v
}
