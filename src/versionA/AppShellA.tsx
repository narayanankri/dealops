import { type ReactNode, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '@/lib/store'
import { T, FONT } from './theme'
import { Mono } from './uiA'
import { KGStrip } from './uiA'

const NAV = [
  { id: 'pipeline', label: 'Pipeline', icon: '▤', path: '/a' },
  { id: 'ic-queue', label: 'IC Queue', icon: '⊞', path: '/a/ic-queue' },
  { id: 'mandate', label: 'Mandate', icon: '◇', path: '/a/mandate' },
]

function SidebarA({ deals, onLogout }: { deals: { status: string }[]; onLogout: () => void }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const counts = useMemo(
    () => ({ pipeline: deals.filter((d) => d.status !== 'archived').length, 'ic-queue': deals.filter((d) => d.status === 'sent-to-ic').length, mandate: null as number | null }),
    [deals],
  )
  const activeId = pathname.startsWith('/a/ic-queue') ? 'ic-queue' : pathname.startsWith('/a/mandate') ? 'mandate' : 'pipeline'

  return (
    <div style={{ flexShrink: 0, width: 240, display: 'flex', flexDirection: 'column', background: T.bg, borderRight: `1px solid ${T.border}`, color: T.text }}>
      {/* Brand */}
      <div style={{ padding: '26px 22px 22px', borderBottom: `1px solid ${T.border}` }}>
        <Mono color={T.cyan} style={{ letterSpacing: 4, marginBottom: 10 }}>◆ Platform</Mono>
        <div style={{ fontFamily: FONT.serif, fontSize: 19, fontWeight: 700, lineHeight: 1.15, color: T.text, letterSpacing: -0.3 }}>
          AI Deal<br />Operations
        </div>
        <div style={{ fontSize: 10, color: T.muted, marginTop: 8, fontFamily: FONT.mono, letterSpacing: 0.5 }}>Version A · facelift</div>
      </div>
      {/* Nav */}
      <div style={{ flex: 1, padding: '12px 0' }}>
        {NAV.map((item) => {
          const active = activeId === item.id
          const count = counts[item.id as keyof typeof counts]
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '11px 22px',
                background: active ? T.card : 'transparent', borderStyle: 'solid', borderWidth: 0, borderLeftWidth: 3,
                borderLeftColor: active ? T.cyan : 'transparent', color: active ? T.text : T.muted,
                textAlign: 'left', transition: 'all 0.15s', fontSize: 13, fontWeight: 500, fontFamily: FONT.sans, cursor: 'pointer',
              }}
              onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = T.card; e.currentTarget.style.color = T.mutedHi } }}
              onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = T.muted } }}
            >
              <span style={{ width: 18, textAlign: 'center', color: active ? T.cyan : T.muted, fontSize: 14 }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {count !== null && (
                <span style={{ fontSize: 10, fontFamily: FONT.mono, padding: '2px 7px', borderRadius: 3, background: active ? T.cyan : T.border, color: active ? T.navyDeep : T.muted, fontWeight: 700 }}>{count}</span>
              )}
            </button>
          )
        })}
      </div>
      {/* Footer */}
      <div style={{ padding: '16px 22px', borderTop: `1px solid ${T.border}` }}>
        <Mono style={{ marginBottom: 8 }}>Platform Status</Mono>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: T.mutedHi }}>
          <span style={{ width: 6, height: 6, borderRadius: 3, background: T.green, boxShadow: `0 0 8px ${T.green}` }} />
          <span>Connected · Claude for<br />Financial Services</span>
        </div>
        <button
          onClick={onLogout}
          style={{ width: '100%', marginTop: 14, padding: '8px 12px', background: 'transparent', border: `1px solid ${T.border}`, borderRadius: 5, color: T.muted, fontSize: 11, cursor: 'pointer', transition: 'all 0.15s', fontFamily: FONT.mono, letterSpacing: 0.5, fontWeight: 500 }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = T.red; e.currentTarget.style.color = T.red }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.muted }}
        >
          ⏻ Sign Out
        </button>
      </div>
    </div>
  )
}

export function AppShellA({ children, onLogout }: { children: ReactNode; onLogout: () => void }) {
  const { deals } = useApp()
  return (
    <div style={{ display: 'flex', height: '100vh', background: T.bg, color: T.text, fontFamily: FONT.sans, overflow: 'hidden' }}>
      <SidebarA deals={deals} onLogout={onLogout} />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <KGStrip />
        <div style={{ flex: 1, overflowY: 'auto' }}>{children}</div>
      </div>
    </div>
  )
}
