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
import { Boot } from '@/components/Boot'
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
    try {
      const v = localStorage.getItem(VER_KEY)
      return v === 'a' || v === 'b' ? v : null
    } catch {
      return null
    }
  })
  // booting is the Version B calibration splash — only right after a fresh sign-in.
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

  // Keep the URL consistent with the chosen version.
  useEffect(() => {
    if (version === 'a' && !pathname.startsWith('/a')) navigate('/a', { replace: true })
    if (version === 'b' && pathname.startsWith('/a')) navigate('/', { replace: true })
  }, [version, pathname, navigate])

  if (version === null) return <Chooser onPick={choose} />

  const toggle = authed ? <VersionToggle version={version} onClick={switchVersion} /> : null

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
  if (booting) return <Boot onDone={() => setBooting(false)} />
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

function VersionToggle({ version, onClick }: { version: Version; onClick: () => void }) {
  const toA = version === 'b'
  return (
    <button
      onClick={onClick}
      title={toA ? 'Switch to Version A (KPMG facelift)' : 'Switch to Version B (Instrument)'}
      style={{
        position: 'fixed', right: 16, bottom: 16, zIndex: 9000, padding: '8px 14px',
        background: toA ? '#12151f' : '#0F2040', border: `1px solid ${toA ? '#2a3550' : '#2A4480'}`,
        borderRadius: 999, color: toA ? '#19c2db' : '#00A3E0', fontSize: 11,
        fontFamily: "'JetBrains Mono', ui-monospace, monospace", letterSpacing: 0.5, fontWeight: 700,
        cursor: 'pointer', boxShadow: '0 6px 24px rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', gap: 7,
      }}
    >
      <span style={{ width: 7, height: 7, borderRadius: 4, background: toA ? '#19c2db' : '#00A3E0', boxShadow: `0 0 8px ${toA ? '#19c2db' : '#00A3E0'}` }} />
      {toA ? 'B → A' : 'A → B'}
    </button>
  )
}
