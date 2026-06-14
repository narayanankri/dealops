import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/AppShell'
import { Pipeline } from '@/pages/Pipeline'
import { DealPage } from '@/pages/Deal'
import { ICQueue } from '@/pages/ICQueue'
import { MandatePage } from '@/pages/Mandate'
import { AddDeal } from '@/pages/AddDeal'
import { Landing } from '@/pages/Landing'

const AUTH_KEY = 'dealops_authed'

export default function App() {
  const [authed, setAuthed] = useState(() => {
    try {
      return localStorage.getItem(AUTH_KEY) === '1'
    } catch {
      return false
    }
  })

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
        }}
      />
    )
  }

  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Pipeline />} />
        <Route path="/deal/:id" element={<DealPage />} />
        <Route path="/add" element={<AddDeal />} />
        <Route path="/ic-queue" element={<ICQueue />} />
        <Route path="/mandate" element={<MandatePage />} />
      </Routes>
    </AppShell>
  )
}
