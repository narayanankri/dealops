import { useNavigate } from 'react-router-dom'
import { TopBarA } from './TopBarA'
import { T, FONT, alpha } from './theme'
import { Card, Mono, Serif, Btn, SectionTitle } from './uiA'

// ───────────────────────────────────────────────────────────
// Version A — Add Deal (KPMG-editorial facelift).
//
// FACELIFT ONLY. Same flow / behaviour / copy as src/pages/AddDeal.tsx:
// a static intake explainer. Two ways in are described — a free-text query
// and one-click intake from monitored sources — but live research/profiling
// is the AI step and is intentionally not enabled in this hosted demo (the
// deal set is curated). The deterministic analysis runs live in the browser.
// Re-skinned in the deep-navy / Fraunces / JetBrains-mono language.
// ───────────────────────────────────────────────────────────

export function AddDealA() {
  const navigate = useNavigate()

  return (
    <>
      <TopBarA
        title="Add Deal"
        breadcrumb="Intake"
        subtitle="Two ways in — a free-text query, or one-click intake from monitored sources (§6)."
        action={
          <Btn variant="ghost" size="md" onClick={() => navigate('/a')}>
            ← Pipeline
          </Btn>
        }
      />

      <div style={{ padding: '24px 32px', maxWidth: 980, margin: '0 auto' }}>
        {/* Query box — the AI step (disabled in this demo) */}
        <Card accent={T.cyan} style={{ marginBottom: 18 }}>
          <SectionTitle kicker="Start here" title="Start from a query" />
          <div style={{ display: 'flex', alignItems: 'stretch', gap: 12 }}>
            <div
              style={{
                flex: 1,
                cursor: 'not-allowed',
                userSelect: 'none',
                borderRadius: 6,
                border: `1px solid ${T.border}`,
                background: T.bg,
                padding: '12px 14px',
                fontSize: 13,
                color: T.muted,
                fontStyle: 'italic',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              e.g. “MENA BNPL leader expanding into wallets, Series E”
            </div>
            <span
              style={{
                cursor: 'not-allowed',
                userSelect: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                borderRadius: 6,
                border: `1px solid ${T.border}`,
                background: T.cardHi,
                padding: '0 16px',
                fontSize: 12,
                fontWeight: 600,
                fontFamily: FONT.sans,
                color: T.muted,
                whiteSpace: 'nowrap',
              }}
            >
              Research &amp; profile
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9, marginTop: 14 }}>
            <span
              style={{
                marginTop: 6,
                width: 6,
                height: 6,
                flexShrink: 0,
                borderRadius: '50%',
                background: T.amber,
                boxShadow: `0 0 8px ${alpha(T.amber, 0.6)}`,
              }}
            />
            <p style={{ margin: 0, fontSize: 12, lineHeight: 1.6, color: T.mutedHi, fontFamily: FONT.sans }}>
              Live research and profiling is the AI step. In this demo the deal set is{' '}
              <span style={{ fontWeight: 700, color: T.text }}>curated</span> — connect a model to enable
              live intake.
            </p>
          </div>
        </Card>

        {/* The two intake modes */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>
          <ModeCard
            kicker="Mode 01"
            title="By query"
            accent={T.cyan}
            body={
              <>
                Type a company name, a short description, or a thesis. The product researches it and builds
                a sourced profile — anything uncertain is marked <em>inferred</em> or <em>estimated</em>{' '}
                rather than presented as fact.
              </>
            }
          />
          <ModeCard
            kicker="Mode 02"
            title="From monitored sources"
            accent={T.purpleSoft}
            body={
              <>
                The product continuously screens connected sources and surfaces candidate deals — each
                with enough context to decide whether to pull it into the pipeline with one action.
              </>
            }
          />
        </div>

        {/* How this demo works */}
        <Card>
          <Mono color={T.muted} style={{ marginBottom: 10 }}>
            How this demo works
          </Mono>
          <p style={{ margin: 0, maxWidth: 720, fontSize: 13, lineHeight: 1.7, color: T.mutedHi, fontFamily: FONT.sans }}>
            The deterministic analysis — valuation, mandate fit, returns, scoring, and the verdict — runs
            entirely in your browser, live, on a curated set of real GCC/MENA companies. Adding a new
            company is the one step that needs a connected model to research and profile it; that path is
            not enabled in this hosted demo.
          </p>
        </Card>
      </div>
    </>
  )
}

// ── Intake-mode card: mono kicker + serif title + body ──
function ModeCard({
  kicker,
  title,
  body,
  accent,
}: {
  kicker: string
  title: string
  body: React.ReactNode
  accent: string
}) {
  return (
    <Card accent={accent} hoverable padding="20px 22px">
      <Mono color={accent} style={{ marginBottom: 8 }}>
        {kicker}
      </Mono>
      <Serif size={18} style={{ marginBottom: 10 }}>
        {title}
      </Serif>
      <p style={{ margin: 0, fontSize: 13, lineHeight: 1.7, color: T.mutedHi, fontFamily: FONT.sans }}>
        {body}
      </p>
    </Card>
  )
}
