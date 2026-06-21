import React from 'react'
import { T, FONT } from './theme'
import { Mono } from './uiA'

export function TopBarA({ title, subtitle, breadcrumb, action }: { title: string; subtitle?: string; breadcrumb?: string; action?: React.ReactNode }) {
  return (
    <div style={{ position: 'relative', background: T.navyDeep, padding: '20px 32px', borderBottom: `1px solid ${T.border}`, flexShrink: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <Mono color={T.cyan}>AI Deal Operations{breadcrumb ? ` · ${breadcrumb}` : ''}</Mono>
          <h1 style={{ fontFamily: FONT.serif, fontSize: 26, fontWeight: 700, color: T.text, margin: '4px 0 0', letterSpacing: -0.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</h1>
          {subtitle && <div style={{ fontSize: 12, color: T.mutedHi, marginTop: 4 }}>{subtitle}</div>}
        </div>
        {action && <div style={{ flexShrink: 0 }}>{action}</div>}
      </div>
    </div>
  )
}
