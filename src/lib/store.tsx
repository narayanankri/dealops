import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Analysis, Deal, DealStatus, Fund, Mandate, ValuationAssumptions } from '@/types'
import { seedFunds } from '@/data/funds'
import { seedDeals } from '@/data'
import { analyze } from '@/engine'
import { STATUS_EVENT } from '@/lib/status'

export interface DealEvent {
  at: string
  what: string
}

interface AppState {
  // funds
  funds: Fund[]
  activeFundId: string
  activeFund: Fund
  setActiveFund: (id: string) => void
  cloneActiveFund: () => void
  // mandate (resolves to the active fund) — backward compatible
  mandate: Mandate
  setMandate: (m: Mandate) => void
  // deals
  deals: Deal[]
  getDeal: (id: string) => Deal | undefined
  analysisFor: (deal: Deal) => Analysis
  analyzeUnder: (deal: Deal, fund: Fund) => Analysis
  updateAssumptions: (dealId: string, patch: Partial<ValuationAssumptions>) => void
  resetDeal: (dealId: string) => void
  // workflow
  setStatus: (dealId: string, status: DealStatus) => void
  reRun: (dealId: string) => void
  eventsFor: (dealId: string) => DealEvent[]
}

const Ctx = createContext<AppState | null>(null)

// seed two deals into committee so the IC Queue is populated for the demo
const seedStatus: Record<string, DealStatus> = {
  tamara: 'sent-to-ic',
  'property-finder': 'sent-to-ic',
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [funds, setFunds] = useState<Fund[]>(seedFunds)
  const [activeFundId, setActiveFundId] = useState<string>(seedFunds[0].id)
  const [deals, setDeals] = useState<Deal[]>(() =>
    seedDeals.map((d) => (seedStatus[d.id] ? { ...d, status: seedStatus[d.id] } : d)),
  )
  const [events, setEvents] = useState<Record<string, DealEvent[]>>({})

  const activeFund = useMemo(() => funds.find((f) => f.id === activeFundId) ?? funds[0], [funds, activeFundId])

  const log = useCallback((dealId: string, what: string) => {
    setEvents((prev) => ({ ...prev, [dealId]: [{ at: new Date().toISOString(), what }, ...(prev[dealId] ?? [])] }))
  }, [])

  const setMandate = useCallback(
    (m: Mandate) => setFunds((prev) => prev.map((f) => (f.id === activeFundId ? { ...f, mandate: m } : f))),
    [activeFundId],
  )

  const cloneActiveFund = useCallback(() => {
    const id = `fund-${crypto.randomUUID().slice(0, 8)}`
    setFunds((prev) => {
      const src = prev.find((f) => f.id === activeFundId) ?? prev[0]
      return [...prev, { id, mandate: { ...src.mandate, fundName: `${src.mandate.fundName} (copy)` } }]
    })
    setActiveFundId(id)
  }, [activeFundId])

  const updateAssumptions = useCallback((dealId: string, patch: Partial<ValuationAssumptions>) => {
    setDeals((prev) => prev.map((d) => (d.id === dealId ? { ...d, assumptions: { ...d.assumptions, ...patch } } : d)))
  }, [])

  const resetDeal = useCallback(
    (dealId: string) => {
      const seed = seedDeals.find((d) => d.id === dealId)
      if (!seed) return
      setDeals((prev) => prev.map((d) => (d.id === dealId ? { ...d, assumptions: { ...seed.assumptions } } : d)))
      log(dealId, 'Assumptions reset to baseline')
    },
    [log],
  )

  const setStatus = useCallback(
    (dealId: string, status: DealStatus) => {
      setDeals((prev) => prev.map((d) => (d.id === dealId ? { ...d, status } : d)))
      log(dealId, STATUS_EVENT[status])
    },
    [log],
  )

  const reRun = useCallback((dealId: string) => log(dealId, 'Analysis re-run'), [log])

  const value = useMemo<AppState>(
    () => ({
      funds,
      activeFundId,
      activeFund,
      setActiveFund: setActiveFundId,
      cloneActiveFund,
      mandate: activeFund.mandate,
      setMandate,
      deals,
      getDeal: (id) => deals.find((d) => d.id === id),
      analysisFor: (deal) => analyze(deal, activeFund.mandate),
      analyzeUnder: (deal, fund) => analyze(deal, fund.mandate),
      updateAssumptions,
      resetDeal,
      setStatus,
      reRun,
      eventsFor: (id) => events[id] ?? [],
    }),
    [funds, activeFundId, activeFund, cloneActiveFund, setMandate, deals, events, updateAssumptions, resetDeal, setStatus, reRun],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useApp(): AppState {
  const v = useContext(Ctx)
  if (!v) throw new Error('useApp must be used within AppProvider')
  return v
}
