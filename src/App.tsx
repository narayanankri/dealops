import { Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/AppShell'
import { Pipeline } from '@/pages/Pipeline'
import { DealPage } from '@/pages/Deal'
import { ICQueue } from '@/pages/ICQueue'
import { MandatePage } from '@/pages/Mandate'
import { AddDeal } from '@/pages/AddDeal'

export default function App() {
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
