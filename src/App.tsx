import { useEffect, useState } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
// Version B — the current "Instrument" build (unchanged).
import { AppShell } from '@/components/AppShell'
import { Pipeline } from '@/pages/Pipeline'
import { DealPage } from '@/pages/Deal'
import { ICQueue } from '@/pages/ICQueue'
import { MandatePage } from '@/pages/Mandate'
import { AddDeal } from '@/pages/AddDeal'
import { Landing } from '@/pages/Landing'
import { BootSequence } from '@/components/BootSequence'
// Neutral entry + Version A — the "KPMG editorial" facelift.
import { Chooser } from '@/pages/Chooser'
import { AppShellA } from '@/versionA/AppShellA'
import { LandingA } from '@/versionA/LandingA'
import { PipelineA } from '@/versionA/PipelineA'
import { DealA } from '@/versionA/DealA'
import { ICQueueA } from '@/versionA/ICQueueA'
import { MandateA } from '@/versionA/MandateA'
import { AddDealA } from '@/versionA/AddDealA'

const AUTH_KEY = 'dealops_authed'
const VER_KEY = 'dealops_version'
type Version = 'a' | 'b'

// Feature flag — the Editorial (Version A) skin and the version chooser.
// Off: the product ships as the Instrument only — no chooser on entry, no
// floating Selector/Editorial toggle, /a/* redirects to /. Flip to true to
// restore all of it; nothing in src/versionA or src/pages/Chooser.tsx is removed.
const VERSION_PICKER_ENABLED = false

export default function App() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const [authed, setAuthed] = useState(() => {
    try {
      return localStorage.getItem(AUTH_KEY) === '1'
    } catch {
      return false
    }
  })
  const [version, setVersion] = useState<Version | null>(() => {
    if (!VERSION_PICKER_ENABLED) return 'b' // Instrument only; a stale 'a' in storage is ignored
    try {
      const v = localStorage.getItem(VER_KEY)
      return v === 'a' || v === 'b' ? v : null
    } catch {
      return null
    }
  })
  // booting shows the sign-in boot sequence, right after a fresh sign-in (both skins).
  const [booting, setBooting] = useState(false)

  const persistVersion = (v: Version) => {
    try {
      localStorage.setItem(VER_KEY, v)
    } catch {
      /* ignore */
    }
    setVersion(v)
  }
  const choose = (v: Version) => {
    persistVersion(v)
    navigate(v === 'a' ? '/a' : '/')
  }
  const switchVersion = () => {
    const v: Version = version === 'a' ? 'b' : 'a'
    persistVersion(v)
    navigate(v === 'a' ? '/a' : '/')
  }
  const logout = () => {
    try {
      localStorage.removeItem(AUTH_KEY)
    } catch {
      /* ignore */
    }
    setAuthed(false)
  }
  const toChooser = () => {
    // Full restart: clear the chosen version AND sign out, so the flow begins
    // again at the chooser → login → app.
    try {
      localStorage.removeItem(VER_KEY)
      localStorage.removeItem(AUTH_KEY)
    } catch {
      /* ignore */
    }
    setVersion(null)
    setAuthed(false)
    navigate('/')
  }

  // Keep the URL consistent with the chosen version.
  useEffect(() => {
    if (version === 'a' && !pathname.startsWith('/a')) navigate('/a', { replace: true })
    if (version === 'b' && pathname.startsWith('/a')) navigate('/', { replace: true })
  }, [version, pathname, navigate])

  // On every route change, reset the scroll position so a newly opened page
  // (e.g. a deal opened from the pipeline) starts at the top.
  useEffect(() => {
    window.scrollTo(0, 0)
    document.querySelectorAll('[data-scroll-root]').forEach((el) => { (el as HTMLElement).scrollTop = 0 })
  }, [pathname])

  if (version === null) return <Chooser onPick={choose} />

  // Boot sequence right after sign-in (both skins)
  if (authed && booting) return <BootSequence onDone={() => setBooting(false)} />

  const toggle = authed && VERSION_PICKER_ENABLED ? <VersionToggle version={version} onClick={switchVersion} onChooser={toChooser} /> : null

  // ── Version A — facelift ──
  if (version === 'a') {
    if (!authed) {
      return (
        <LandingA
          onEnter={() => {
            try {
              localStorage.setItem(AUTH_KEY, '1')
            } catch {
              /* ignore */
            }
            setAuthed(true)
            setBooting(true)
          }}
        />
      )
    }
    return (
      <>
        <AppShellA onLogout={logout}>
          <Routes>
            <Route path="/a" element={<PipelineA />} />
            <Route path="/a/deal/:id" element={<DealA />} />
            <Route path="/a/add" element={<AddDealA />} />
            <Route path="/a/ic-queue" element={<ICQueueA />} />
            <Route path="/a/mandate" element={<MandateA />} />
            <Route path="*" element={<Navigate to="/a" replace />} />
          </Routes>
        </AppShellA>
        {toggle}
      </>
    )
  }

  // ── Version B — current build ──
  if (!authed) {
    return (
      <Landing
        onEnter={() => {
          try {
            localStorage.setItem(AUTH_KEY, '1')
          } catch {
            /* ignore */
          }
          setAuthed(true)
          setBooting(true)
        }}
      />
    )
  }
  return (
    <>
      <AppShell>
        <Routes>
          <Route path="/" element={<Pipeline />} />
          <Route path="/deal/:id" element={<DealPage />} />
          <Route path="/add" element={<AddDeal />} />
          <Route path="/ic-queue" element={<ICQueue />} />
          <Route path="/mandate" element={<MandatePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppShell>
      {toggle}
    </>
  )
}

function VersionToggle({ version, onClick, onChooser }: { version: Version; onClick: () => void; onChooser: () => void }) {
  const toA = version === 'b'
  const accent = toA ? '#19c2db' : '#00A3E0'
  const bg = toA ? '#12151f' : '#0F2040'
  const border = toA ? '#2a3550' : '#2A4480'
  const base = {
    fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 11, letterSpacing: 0.5, fontWeight: 700,
    cursor: 'pointer', color: accent, background: bg, border: `1px solid ${border}`, padding: '8px 13px',
    boxShadow: '0 6px 24px rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', gap: 7,
  } as const
  return (
    <div style={{ position: 'fixed', right: 16, bottom: 16, zIndex: 9000, display: 'flex', gap: 8 }}>
      <button onClick={onChooser} title="Back to the version selector" style={{ ...base, borderRadius: 999 }}>
        ⊞ Selector
      </button>
      <button onClick={onClick} title={toA ? 'Switch to the Editorial view' : 'Switch to the Instrument view'} style={{ ...base, borderRadius: 999 }}>
        <span style={{ width: 7, height: 7, borderRadius: 4, background: accent, boxShadow: `0 0 8px ${accent}` }} />
        {toA ? '→ Editorial' : '→ Instrument'}
      </button>
    </div>
  )
}
