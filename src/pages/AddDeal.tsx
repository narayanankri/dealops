import { useNavigate } from 'react-router-dom'
import { Card, SectionTitle } from '@/components/ui'

export function AddDeal() {
  const navigate = useNavigate()
  return (
    <div className="mx-auto max-w-[900px] px-8 py-7">
      <button onClick={() => navigate('/')} className="mb-4 text-xs text-ink-3 hover:text-ink-2">
        ← Pipeline
      </button>

      <h1 className="text-xl font-semibold text-ink">Add a deal</h1>
      <p className="mt-0.5 text-sm text-ink-3">Two ways in — a free-text query, or one-click intake from monitored sources (§6).</p>

      {/* Query box */}
      <Card className="mt-6 px-6 py-5">
        <SectionTitle>Start from a query</SectionTitle>
        <div className="flex items-center gap-3">
          <div className="flex-1 cursor-not-allowed rounded-lg border border-line bg-panel-2 px-3 py-2.5 text-sm text-ink-3 select-none">
            e.g. “MENA BNPL leader expanding into wallets, Series E”
          </div>
          <span className="cursor-not-allowed rounded-lg bg-panel-3 px-3.5 py-2.5 text-sm font-medium text-ink-3 select-none">
            Research &amp; profile
          </span>
        </div>
        <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-ink-3">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-warn" />
          Live research and profiling is the AI step. In this demo the deal set is <span className="font-medium text-ink-2">curated</span> — connect a model to enable live intake.
        </p>
      </Card>

      {/* The two intake modes */}
      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        <Card className="px-6 py-5">
          <SectionTitle>By query</SectionTitle>
          <p className="text-sm leading-relaxed text-ink-2">
            Type a company name, a short description, or a thesis. The product researches it and builds a sourced profile — anything uncertain is marked <em>inferred</em> or <em>estimated</em> rather than presented as fact.
          </p>
        </Card>
        <Card className="px-6 py-5">
          <SectionTitle>From monitored sources</SectionTitle>
          <p className="text-sm leading-relaxed text-ink-2">
            The product continuously screens connected sources and surfaces candidate deals — each with enough context to decide whether to pull it into the pipeline with one action.
          </p>
        </Card>
      </div>

      <Card className="mt-5 border-line-soft/60 bg-panel/40 px-6 py-5">
        <div className="text-[13px] font-semibold tracking-wide text-ink-2 uppercase">How this demo works</div>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-3">
          The deterministic analysis — valuation, mandate fit, returns, scoring, and the verdict — runs entirely in your browser, live, on a curated set of real GCC/MENA companies. Adding a new company is the one step that needs a connected model to research and profile it; that path is not enabled in this hosted demo.
        </p>
      </Card>
    </div>
  )
}
