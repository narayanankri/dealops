// ───────────────────────────────────────────────────────────
// Version A — Valuation & Scenarios tab. Mirrors Version B's ValuationTab:
// headline DCF/Comps/Reconciled, range bar, interactive assumption steppers,
// scenario IRRs (BarsA), the full driver-based model when present, and the
// locked-model placeholder when not.
// ───────────────────────────────────────────────────────────
import { useState } from 'react'
import { T, FONT, alpha, scoreColor } from '../theme'
import { Card, Mono, SectionTitle, RangeBarA, BarsA, ValWalkA, Btn } from '../uiA'
import { mult, signedPct, usdm } from '@/lib/format'
import { useApp } from '@/lib/store'
import { exportModelXlsx } from '@/lib/exportModelXlsx'
import { projectModel } from '@/engine/model'
import type { Analysis, Deal, OperatingMetric, ProjectedModel, Returns, SensitivityGrid, ValuationAssumptions } from '@/types'

// ── shared formatting ──
const fmtAmt = (v: number) =>
  v < 0 ? `(${Math.abs(v).toLocaleString(undefined, { maximumFractionDigits: 1 })})` : v.toLocaleString(undefined, { maximumFractionDigits: 1 })
const fmtMetric = (v: number, fmt: OperatingMetric['fmt']) => (fmt === 'usdm' ? usdm(v) : fmt === 'pct' ? `${v}%` : fmt === 'x' ? `${v}x` : `${v}`)

function Stat({ label, value, color = T.text }: { label: string; value: React.ReactNode; color?: string }) {
  return (
    <div>
      <Mono>{label}</Mono>
      <div style={{ marginTop: 4, fontFamily: FONT.serif, fontSize: 22, fontWeight: 700, color, letterSpacing: -0.5 }}>{value}</div>
    </div>
  )
}

// ── PnL summary table (historical actuals) ──
function PnLTable({ financials }: { financials?: { years: (string | number)[]; revenue: number[]; ebitda: number[] } }) {
  if (!financials) return <div style={{ fontSize: 13, color: T.muted }}>No financials available.</div>
  const { years, revenue, ebitda } = financials
  const margin = revenue.map((r, i) => (r ? (ebitda[i] / r) * 100 : 0))
  const growth = revenue.map((r, i) => (i === 0 ? null : (r / revenue[i - 1] - 1) * 100))
  const td: React.CSSProperties = { padding: '8px 12px', textAlign: 'right', fontFamily: FONT.mono, fontSize: 12 }
  const Row = ({ label, cells, color = T.text }: { label: string; cells: (string | null)[]; color?: string }) => (
    <tr style={{ borderTop: `1px solid ${alpha(T.border, 0.6)}` }}>
      <td style={{ padding: '8px 12px 8px 0', fontSize: 13, color: T.mutedHi }}>{label}</td>
      {cells.map((c, i) => <td key={i} style={{ ...td, color }}>{c ?? '—'}</td>)}
    </tr>
  )
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <td style={{ paddingBottom: 8, fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: T.muted, fontFamily: FONT.mono }}>$m</td>
          {years.map((y) => <td key={String(y)} style={{ paddingBottom: 8, paddingLeft: 12, textAlign: 'right', fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: T.muted, fontFamily: FONT.mono }}>{y}</td>)}
        </tr>
      </thead>
      <tbody>
        <Row label="Revenue" cells={revenue.map((r) => Math.round(r).toLocaleString())} />
        <Row label="Growth %" cells={growth.map((g) => (g === null ? null : `${g >= 0 ? '+' : ''}${g.toFixed(0)}%`))} color={T.muted} />
        <Row label="EBITDA" cells={ebitda.map((e) => Math.round(e).toLocaleString())} />
        <Row label="EBITDA margin %" cells={margin.map((m) => `${m.toFixed(0)}%`)} color={T.muted} />
      </tbody>
    </table>
  )
}

// ── Stepper ──
function Stepper({ label, value, unit, step, min, max, onChange, rationale }: { label: string; value: number; unit: string; step: number; min: number; max: number; onChange: (v: number) => void; rationale: string }) {
  const clamp = (v: number) => Math.min(max, Math.max(min, Math.round(v * 100) / 100))
  const btn: React.CSSProperties = { display: 'grid', placeItems: 'center', height: 28, width: 28, borderRadius: 6, border: `1px solid ${T.border}`, background: T.card, color: T.mutedHi, cursor: 'pointer', fontSize: 14 }
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 13, color: T.mutedHi }}>{label}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <button onClick={() => onChange(clamp(value - step))} style={btn}>−</button>
          <span style={{ width: 64, textAlign: 'center', fontSize: 13, fontWeight: 700, color: T.text, fontFamily: FONT.mono }}>{value}{unit}</span>
          <button onClick={() => onChange(clamp(value + step))} style={btn}>+</button>
        </div>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(clamp(parseFloat(e.target.value)))} style={{ marginTop: 8, width: '100%', accentColor: T.cyan }} />
      <p style={{ marginTop: 4, fontSize: 11, color: T.muted }}>{rationale}</p>
    </div>
  )
}

// ── Returns vs hurdle (scenario IRR bars) ──
function ReturnsVsHurdle({ returns }: { returns: Returns }) {
  const data = returns.scenarios.map((s) => ({ label: s.name.charAt(0).toUpperCase() + s.name.slice(1), value: s.irrPct, color: s.clearsHurdle ? T.green : T.amber }))
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 4 }}>
        <Mono>hurdle {returns.hurdlePct}%</Mono>
      </div>
      <BarsA data={data} unit="%" height={160} />
      <p style={{ marginTop: 8, fontSize: 11, color: T.muted }}>{returns.basis}</p>
    </div>
  )
}

// ── Scenario outcome cards ──
function ScenarioCards({ returns: ret, narratives }: { returns: Returns; narratives?: { bear?: string; base?: string; bull?: string } }) {
  return (
    <Card padding="20px 24px">
      <SectionTitle kicker={`vs ${ret.hurdlePct}% hurdle`} title="Scenario outcomes" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {ret.scenarios.map((s) => {
          const note = narratives?.[s.name]
          const c = s.clearsHurdle ? T.green : T.red
          return (
            <div key={s.name} style={{ borderRadius: 8, border: `1px solid ${s.clearsHurdle ? alpha(T.green, 0.4) : T.border}`, background: T.cardHi, padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Mono color={T.mutedHi}>{s.name}</Mono>
                <Mono color={c}>{s.clearsHurdle ? 'clears' : 'below'}</Mono>
              </div>
              <div style={{ marginTop: 8, display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ fontFamily: FONT.serif, fontSize: 26, fontWeight: 700, color: c, letterSpacing: -0.5 }}>{s.irrPct}%</span>
                <span style={{ fontSize: 11, color: T.muted }}>IRR</span>
              </div>
              <div style={{ marginTop: 4, display: 'flex', gap: 12, fontSize: 11, color: T.muted, fontFamily: FONT.mono }}>
                <span>{mult(s.moic, 2)} MOIC</span>
                <span>exit {usdm(s.exitEquityUSDm)}</span>
              </div>
              {note && <p style={{ marginTop: 8, borderTop: `1px solid ${alpha(T.border, 0.5)}`, paddingTop: 8, fontSize: 11, lineHeight: 1.5, color: T.muted }}>{note}</p>}
            </div>
          )
        })}
      </div>
      <p style={{ marginTop: 12, fontSize: 11, color: T.muted }}>{ret.basis}</p>
    </Card>
  )
}

// ── Case columns ──
function CaseColumns({ positives, risks, limitations }: { positives: string[]; risks: string[]; limitations: string[] }) {
  const Col = ({ title, items, dot }: { title: string; items: string[]; dot: string }) => (
    <div>
      <Mono style={{ marginBottom: 8 }}>{title}</Mono>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map((x, i) => (
          <li key={i} style={{ display: 'flex', gap: 8, fontSize: 13, lineHeight: 1.55, color: T.mutedHi }}>
            <span style={{ marginTop: 6, height: 6, width: 6, flexShrink: 0, borderRadius: '50%', background: dot }} />
            {x}
          </li>
        ))}
      </ul>
    </div>
  )
  return (
    <Card padding="20px 24px">
      <SectionTitle kicker="what supports the value, what threatens it, what we cannot yet verify" title="Investment merits, risks & analytical limitations" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
        <Col title="Merits" items={positives} dot={T.green} />
        <Col title="Risks" items={risks} dot={T.red} />
        <Col title="Analytical limitations" items={limitations} dot={T.muted} />
      </div>
    </Card>
  )
}

// ── Operating metrics card ──
function OperatingMetricsCard({ pm }: { pm: ProjectedModel }) {
  const startY = pm.years.filter((y) => y.actual).at(-1)?.label ?? ''
  const endY = pm.years.at(-1)?.label ?? ''
  const th: React.CSSProperties = { padding: '6px 8px', fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: T.muted, fontFamily: FONT.mono, borderBottom: `1px solid ${T.border}` }
  return (
    <Card padding="20px 24px">
      <SectionTitle kicker={`${startY} → ${endY}`} title="Key operating metrics" />
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ ...th, textAlign: 'left' }}>Metric</th>
            <th style={{ ...th, textAlign: 'right' }}>{startY}</th>
            <th style={{ ...th, textAlign: 'right' }}>{endY}</th>
            <th style={{ ...th, textAlign: 'right' }}>Δ</th>
          </tr>
        </thead>
        <tbody>
          {pm.operating.map((m) => (
            <tr key={m.label} style={{ borderBottom: `1px solid ${alpha(T.border, 0.5)}` }}>
              <td style={{ padding: '6px 8px 6px 0', fontSize: 13, color: T.mutedHi }}>{m.label}</td>
              <td style={{ padding: '6px 8px', textAlign: 'right', fontFamily: FONT.mono, fontSize: 12, color: T.text }}>{fmtMetric(m.start, m.fmt)}</td>
              <td style={{ padding: '6px 8px', textAlign: 'right', fontFamily: FONT.mono, fontSize: 12, color: T.text }}>{fmtMetric(m.end, m.fmt)}</td>
              <td style={{ padding: '6px 8px', textAlign: 'right', fontFamily: FONT.mono, fontSize: 12, color: m.deltaPct == null ? T.muted : m.deltaPct >= 0 ? T.green : T.red }}>{m.deltaPct == null ? '—' : signedPct(m.deltaPct)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  )
}

// ── Statement table ──
type StmtRow = { label: string; vals: (number | null)[]; bold?: boolean; indent?: boolean; pct?: boolean; muted?: boolean; top?: boolean }
function StmtTable({ years, rows }: { years: ProjectedModel['years']; rows: StmtRow[] }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ borderBottom: `1px solid ${T.border}` }}>
            <th style={{ padding: '6px 12px 6px 0', textAlign: 'left', fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: T.muted, fontFamily: FONT.mono }}>USD m</th>
            {years.map((y, i) => (
              <th key={i} style={{ padding: '6px 0 6px 12px', textAlign: 'right', whiteSpace: 'nowrap', fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: T.muted, fontFamily: FONT.mono }}>
                {y.label}<span style={{ marginLeft: 4, color: alpha(T.muted, 0.6) }}>{y.actual ? 'A' : 'F'}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri} style={{ borderTop: r.top ? `1px solid ${alpha(T.border, 0.6)}` : 'none', fontWeight: r.bold ? 700 : 400 }}>
              <td style={{ padding: '4px 12px 4px 0', textAlign: 'left', paddingLeft: r.indent ? 12 : 0, color: r.bold ? T.text : r.muted ? T.muted : T.mutedHi }}>{r.label}</td>
              {r.vals.map((v, ci) => (
                <td key={ci} style={{ padding: '4px 0 4px 12px', textAlign: 'right', fontFamily: FONT.mono, fontSize: 12, whiteSpace: 'nowrap', color: r.muted ? T.muted : v != null && v < 0 && !r.pct ? T.red : T.text }}>
                  {v == null ? '—' : r.pct ? `${v}%` : fmtAmt(v)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── Operating assumptions ──
function OperatingAssumptionsCard({ deal, pm }: { deal: Deal; pm: ProjectedModel }) {
  const drv = deal.model!.drivers
  const v = deal.model!.valuation
  const nA = pm.years.filter((y) => y.actual).length
  const row = (label: string, arr: number[] | undefined, pct = true): StmtRow => ({
    label, pct, muted: true,
    vals: pm.years.map((y, i) => (y.actual || !arr ? null : (arr[i - nA] ?? null))),
  })
  const rows: StmtRow[] = [
    row('Revenue growth', drv.revenueGrowthPct),
    row('Gross margin', drv.grossMarginPct),
    row('Operating expenses (% rev)', drv.opexPctRev),
    row('D&A (% rev)', drv.dnaPctRev),
    row('Capex (% rev)', drv.capexPctRev),
    row('Receivables (% rev)', drv.receivablesPctRev),
    row('Payables (% rev)', drv.payablesPctRev),
    row('Tax rate', drv.taxRatePct),
    ...(drv.interestRatePct ? [row('Interest rate on debt', drv.interestRatePct)] : []),
  ]
  const ex: [string, string][] = [
    ['WACC', `${v.waccPct}%`],
    ['Terminal growth (g)', `${v.terminalGrowthPct}%`],
    ['Long-run tax', `${v.longRunTaxPct ?? v.waccPct}%`],
    ['Terminal method', v.terminalMethod === 'gordon' ? 'Gordon growth' : 'Exit multiple'],
    ...(v.exitEvEbitda ? ([['Exit EV/EBITDA', `${v.exitEvEbitda}x`]] as [string, string][]) : []),
    ['Mid-year convention', v.midYear ? 'Yes' : 'No'],
  ]
  return (
    <Card padding="20px 24px">
      <SectionTitle kicker="forecast drivers as % of revenue" title="Operating assumptions" />
      <StmtTable years={pm.years} rows={rows} />
      <div style={{ marginTop: 16, borderTop: `1px solid ${alpha(T.border, 0.5)}`, paddingTop: 12 }}>
        <Mono style={{ marginBottom: 8 }}>Valuation & exit assumptions</Mono>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px 32px' }}>
          {ex.map(([k, val]) => (
            <div key={k} style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8, borderBottom: `1px solid ${alpha(T.border, 0.4)}`, padding: '2px 0' }}>
              <span style={{ fontSize: 13, color: T.muted }}>{k}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: T.text, fontFamily: FONT.mono }}>{val}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

// ── Statements card (P&L / BS / CF) ──
function StatementsCard({ pm }: { pm: ProjectedModel }) {
  const [tab, setTab] = useState<'pnl' | 'bs' | 'cf'>('pnl')
  const P = pm.pnl, B = pm.bs, C = pm.cf
  const pnlRows: StmtRow[] = [
    { label: 'Revenue', vals: P.map((r) => r.revenue), bold: true },
    { label: 'Revenue growth', vals: P.map((r) => r.revenueGrowthPct), pct: true, muted: true },
    { label: 'Cost of sales', vals: P.map((r) => -r.cogs) },
    { label: 'Gross profit', vals: P.map((r) => r.grossProfit) },
    { label: 'Gross margin', vals: P.map((r) => r.grossMarginPct), pct: true, muted: true },
    { label: 'Other income', vals: P.map((r) => r.otherIncome) },
    { label: 'Operating expenses', vals: P.map((r) => -r.opex) },
    { label: 'EBITDA', vals: P.map((r) => r.ebitda), bold: true, top: true },
    { label: 'EBITDA margin', vals: P.map((r) => r.ebitdaMarginPct), pct: true, muted: true },
    { label: 'Depreciation & amortisation', vals: P.map((r) => -r.dna) },
    { label: 'EBIT', vals: P.map((r) => r.ebit), bold: true },
    { label: 'Finance income', vals: P.map((r) => r.financeIncome) },
    { label: 'Finance costs', vals: P.map((r) => -r.financeCosts) },
    { label: 'Profit before tax', vals: P.map((r) => r.pbt) },
    { label: 'Income tax', vals: P.map((r) => -r.tax) },
    { label: 'Net income', vals: P.map((r) => r.netIncome), bold: true, top: true },
    { label: 'Net margin', vals: P.map((r) => r.netMarginPct), pct: true, muted: true },
  ]
  const bsRows: StmtRow[] = [
    { label: 'Property, plant & equipment', vals: B.map((r) => r.ppe) },
    { label: 'Intangibles & goodwill', vals: B.map((r) => r.intangibles) },
    { label: 'Other non-current assets', vals: B.map((r) => r.otherNonCurrentAssets) },
    { label: 'Total non-current assets', vals: B.map((r) => r.totalNonCurrentAssets), bold: true },
    { label: 'Inventory', vals: B.map((r) => r.inventory) },
    { label: 'Receivables', vals: B.map((r) => r.receivables) },
    { label: 'Other current assets', vals: B.map((r) => r.otherCurrentAssets) },
    { label: 'Cash & equivalents', vals: B.map((r) => r.cash) },
    { label: 'Total current assets', vals: B.map((r) => r.totalCurrentAssets), bold: true },
    { label: 'Total assets', vals: B.map((r) => r.totalAssets), bold: true, top: true },
    { label: 'Share capital', vals: B.map((r) => r.shareCapital) },
    { label: 'Retained earnings', vals: B.map((r) => r.retainedEarnings) },
    { label: 'Reserves', vals: B.map((r) => r.reserves) },
    { label: 'Non-controlling interests', vals: B.map((r) => r.nci) },
    { label: 'Total equity', vals: B.map((r) => r.totalEquity), bold: true },
    { label: 'Long-term debt', vals: B.map((r) => r.longTermDebt) },
    { label: 'Short-term debt', vals: B.map((r) => r.shortTermDebt) },
    { label: 'Lease liabilities', vals: B.map((r) => r.leases) },
    { label: 'Other non-current liabilities', vals: B.map((r) => r.otherNonCurrentLiab) },
    { label: 'Payables', vals: B.map((r) => r.payables) },
    { label: 'Other current liabilities', vals: B.map((r) => r.otherCurrentLiab) },
    { label: 'Total liabilities', vals: B.map((r) => r.totalLiabilities), bold: true },
    { label: 'Total equity & liabilities', vals: B.map((r) => r.totalEquityAndLiabilities), bold: true, top: true },
    { label: 'Net debt', vals: B.map((r) => r.netDebt), muted: true, top: true },
    { label: 'Balance check (assets − E&L)', vals: B.map((r) => r.balanceGap), muted: true },
  ]
  const cfRows: StmtRow[] = [
    { label: 'Net income', vals: C.map((r) => r.netIncome) },
    { label: 'Add: depreciation & amortisation', vals: C.map((r) => r.dna) },
    { label: 'Change in receivables', vals: C.map((r) => r.changeReceivables) },
    { label: 'Change in inventory', vals: C.map((r) => r.changeInventory) },
    { label: 'Change in payables', vals: C.map((r) => r.changePayables) },
    { label: 'Cash from operations', vals: C.map((r) => r.cfo), bold: true, top: true },
    { label: 'Capital expenditure', vals: C.map((r) => r.capex) },
    { label: 'Cash from investing', vals: C.map((r) => r.cfi), bold: true },
    { label: 'Net change in debt', vals: C.map((r) => r.debtChange) },
    { label: 'Dividends', vals: C.map((r) => r.dividends) },
    { label: 'Cash from financing', vals: C.map((r) => r.cff), bold: true },
    { label: 'Net change in cash', vals: C.map((r) => r.netChangeInCash), bold: true, top: true },
    { label: 'Closing cash', vals: C.map((r) => r.closingCash), muted: true },
  ]
  const rows = tab === 'pnl' ? pnlRows : tab === 'bs' ? bsRows : cfRows
  const tabs: [typeof tab, string][] = [['pnl', 'Income statement'], ['bs', 'Balance sheet'], ['cf', 'Cash flow']]
  return (
    <Card padding="20px 24px">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <Mono>Financial statements</Mono>
        <div style={{ display: 'flex', gap: 4 }}>
          {tabs.map(([k, label]) => (
            <button key={k} onClick={() => setTab(k)} style={{ borderRadius: 6, padding: '4px 10px', fontSize: 11, fontWeight: 600, cursor: 'pointer', border: 'none', fontFamily: FONT.sans, background: tab === k ? alpha(T.cyan, 0.13) : 'transparent', color: tab === k ? T.cyan : T.muted }}>
              {label}
            </button>
          ))}
        </div>
      </div>
      <StmtTable years={pm.years} rows={rows} />
    </Card>
  )
}

// ── DCF build-up ──
function DcfCard({ pm }: { pm: ProjectedModel }) {
  const f = pm.dcf
  const cols = f.forecastLabels
  const dcfRows: { label: string; vals: string[]; bold?: boolean }[] = [
    { label: 'Unlevered free cash flow', vals: f.ufcf.map(fmtAmt), bold: true },
    { label: 'Discount period (yrs)', vals: f.period.map((p) => `${p}`) },
    { label: 'Discount factor', vals: f.discountFactor.map((d) => d.toFixed(2)) },
    { label: 'PV of UFCF', vals: f.pvUfcf.map(fmtAmt) },
  ]
  const bridge: [string, number, boolean?][] = [
    ['Sum of PV (explicit)', f.sumPvExplicit],
    ['PV of terminal value', f.pvTerminal],
    ['Enterprise value', f.enterpriseValue, true],
    ['Less: net debt', -f.netDebt],
    ['Less: leases', -f.leases],
    ['Less: non-controlling interests', -f.nci],
    ['Plus: associates', f.associates],
    ['Equity value', f.equityValue, true],
  ]
  return (
    <Card padding="20px 24px">
      <SectionTitle kicker={`${f.terminalPctOfEv}% of EV from terminal`} title="DCF — unlevered FCF → equity" />
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${T.border}` }}>
              <th style={{ padding: '6px 12px 6px 0', textAlign: 'left', fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: T.muted, fontFamily: FONT.mono }}>USD m</th>
              {cols.map((c, i) => <th key={i} style={{ padding: '6px 0 6px 12px', textAlign: 'right', whiteSpace: 'nowrap', fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: T.muted, fontFamily: FONT.mono }}>{c}<span style={{ marginLeft: 4, color: alpha(T.muted, 0.6) }}>F</span></th>)}
            </tr>
          </thead>
          <tbody>
            {dcfRows.map((r, ri) => (
              <tr key={ri} style={{ fontWeight: r.bold ? 700 : 400 }}>
                <td style={{ padding: '4px 12px 4px 0', textAlign: 'left', color: r.bold ? T.text : T.mutedHi }}>{r.label}</td>
                {r.vals.map((v, ci) => <td key={ci} style={{ padding: '4px 0 4px 12px', textAlign: 'right', fontFamily: FONT.mono, fontSize: 12, whiteSpace: 'nowrap', color: T.text }}>{v}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px 32px', borderTop: `1px solid ${alpha(T.border, 0.5)}`, paddingTop: 12 }}>
        {bridge.map(([k, val, bold]) => (
          <div key={k} style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8, borderBottom: `1px solid ${alpha(T.border, 0.4)}`, padding: '4px 0', fontWeight: bold ? 700 : 400 }}>
            <span style={{ fontSize: 13, color: bold ? T.text : T.muted }}>{k}</span>
            <span style={{ fontFamily: FONT.mono, fontSize: 12, color: k === 'Equity value' ? T.cyan : bold ? T.text : val < 0 ? T.red : T.mutedHi }}>{fmtAmt(val)}</span>
          </div>
        ))}
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8, padding: '4px 0' }}>
          <span style={{ fontSize: 13, color: T.muted }}>Implied EV / Revenue (LTM)</span>
          <span style={{ fontFamily: FONT.mono, fontSize: 12, color: T.mutedHi }}>{mult(f.impliedEvRevenue, 1)}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8, padding: '4px 0' }}>
          <span style={{ fontSize: 13, color: T.muted }}>Implied EV / EBITDA (LTM)</span>
          <span style={{ fontFamily: FONT.mono, fontSize: 12, color: T.mutedHi }}>{mult(f.impliedEvEbitda, 1)}</span>
        </div>
      </div>
    </Card>
  )
}

// ── Sensitivity grid ──
function SensitivityCard({ grid }: { grid: SensitivityGrid }) {
  const rowFmt = (v: number) => (grid.rowLabel === 'Entry valuation' ? usdm(v) : `${v}%`)
  const colFmt = (v: number) => (grid.colLabel === 'Exit EV/Rev' ? `${v}x` : `${v}%`)
  const cellFmt = (v: number) => (grid.unit === 'equity' ? usdm(v) : `${v}%`)
  return (
    <Card padding="20px 24px">
      <SectionTitle kicker={grid.unit === 'equity' ? 'equity value' : 'IRR'} title={`${grid.rowLabel} × ${grid.colLabel}`} />
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr>
              <th style={{ padding: '6px 8px', textAlign: 'left', whiteSpace: 'nowrap', fontSize: 9, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', color: T.muted, fontFamily: FONT.mono }}>{grid.rowLabel} ↓ / {grid.colLabel} →</th>
              {grid.cols.map((c, i) => <th key={i} style={{ padding: '6px 8px', textAlign: 'right', fontFamily: FONT.mono, fontSize: 11, color: i === grid.baseCol ? T.cyan : T.muted }}>{colFmt(c)}</th>)}
            </tr>
          </thead>
          <tbody>
            {grid.grid.map((rowVals, ri) => (
              <tr key={ri} style={{ borderTop: `1px solid ${alpha(T.border, 0.5)}` }}>
                <td style={{ padding: '6px 8px', textAlign: 'left', fontFamily: FONT.mono, fontSize: 11, color: ri === grid.baseRow ? T.cyan : T.muted }}>{rowFmt(grid.rows[ri])}</td>
                {rowVals.map((val, ci) => {
                  const base = ri === grid.baseRow && ci === grid.baseCol
                  return (
                    <td key={ci} style={{ padding: '6px 8px', textAlign: 'right', fontFamily: FONT.mono, fontSize: 11, borderRadius: base ? 4 : 0, background: base ? alpha(T.cyan, 0.13) : 'transparent', fontWeight: base ? 700 : 400, color: base ? T.cyan : grid.unit === 'irr' && val < 0 ? T.red : T.mutedHi }}>
                      {cellFmt(val)}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {grid.unit === 'irr' && <p style={{ marginTop: 8, fontSize: 11, color: T.muted }}>IRR on the fund's stake; exit on terminal-year revenue at the exit multiple, current net debt.</p>}
    </Card>
  )
}

// ── Locked model placeholder ──
function LockGlyph() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="4" y="11" width="16" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  )
}
const GhostBar = ({ w }: { w: string }) => <div style={{ height: 8, borderRadius: 4, background: alpha(T.muted, 0.25), width: w }} />
function GhostStatements() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {['78%', '60%', '70%', '48%', '66%'].map((w, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <GhostBar w="32%" />
          <div style={{ flex: 1 }} />
          <GhostBar w={w} />
        </div>
      ))}
    </div>
  )
}
function GhostDcf() {
  return (
    <div style={{ display: 'flex', height: 72, alignItems: 'flex-end', gap: 8 }}>
      {[38, 52, 64, 77, 90].map((h, i) => (
        <div key={i} style={{ flex: 1, borderRadius: '3px 3px 0 0', background: alpha(T.cyan, 0.35), height: `${h}%` }} />
      ))}
    </div>
  )
}
function GhostGrid() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
      {Array.from({ length: 16 }).map((_, i) => (
        <div key={i} style={{ height: 16, borderRadius: 3, background: alpha(T.purpleSoft, 0.18 + (i % 4) * 0.16) }} />
      ))}
    </div>
  )
}
function LockedModelPreview() {
  const items = [
    { title: '3-statement model', sub: 'P&L · balance sheet · cash flow', render: <GhostStatements /> },
    { title: 'DCF build-up', sub: 'FCFF → enterprise → equity value', render: <GhostDcf /> },
    { title: 'Sensitivity grids', sub: 'WACC × growth · entry × exit', render: <GhostGrid /> },
  ]
  return (
    <Card padding="20px 24px" style={{ borderStyle: 'dashed' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <SectionTitle kicker="driver-based model" title="Full financial model" />
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, borderRadius: 6, border: `1px solid ${T.border}`, background: T.cardHi, padding: '4px 10px', fontSize: 11, fontWeight: 600, color: T.muted }}>
          <LockGlyph /> Not provided for this deal
        </span>
      </div>
      <p style={{ marginTop: 4, marginBottom: 20, maxWidth: 640, fontSize: 13, lineHeight: 1.6, color: T.mutedHi }}>
        This deal was screened from summary figures. Add it with financials and this section becomes a complete driver-based model — projected statements that balance by construction, a full DCF build-up, and live WACC and entry/exit sensitivities.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {items.map((it) => (
          <div key={it.title} style={{ borderRadius: 12, border: `1px solid ${alpha(T.border, 0.7)}`, background: T.cardHi, padding: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{it.title}</div>
            <div style={{ marginTop: 2, fontSize: 11, color: T.muted }}>{it.sub}</div>
            <div style={{ marginTop: 16, opacity: 0.5, maskImage: 'linear-gradient(180deg,#000 55%,transparent)', WebkitMaskImage: 'linear-gradient(180deg,#000 55%,transparent)' }}>{it.render}</div>
          </div>
        ))}
      </div>
    </Card>
  )
}

export function ValuationA({ deal, a }: { deal: Deal; a: Analysis }) {
  const { updateAssumptions, resetDeal, mandate } = useApp()
  const av = a.assetValue
  const asm = deal.assumptions
  const set = (patch: Partial<ValuationAssumptions>) => updateAssumptions(deal.id, patch)
  const pm = projectModel(deal)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <span style={{ fontSize: 13, color: T.muted }}>Editable assumptions drive the live model — export it to a working Excel workbook.</span>
        <Btn variant="cyan" onClick={() => exportModelXlsx(deal, a, mandate)}>Export Excel model</Btn>
      </div>
      {a.integrity.warnings.length > 0 && (
        <Card accent={a.integrity.blocking ? T.red : T.amber} padding="16px 20px" style={{ background: alpha(a.integrity.blocking ? T.red : T.amber, 0.08) }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700, color: T.text }}>
            <span style={{ height: 8, width: 8, borderRadius: '50%', background: a.integrity.blocking ? T.red : T.amber }} />
            {a.integrity.blocking ? 'Output blocked — a coherence check is failing' : 'Coherence check — review before relying on this'}
          </div>
          <ul style={{ listStyle: 'none', margin: '8px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {a.integrity.warnings.map((w, i) => (
              <li key={i} style={{ display: 'flex', gap: 8, fontSize: 13, color: T.mutedHi }}><span style={{ color: T.muted }}>→</span>{w}</li>
            ))}
          </ul>
        </Card>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Card padding="20px 24px">
            <SectionTitle kicker="strategy-agnostic asset value" title="Headline valuation" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              <Stat label="DCF (intrinsic)" value={usdm(av.dcfEquityUSDm)} />
              <Stat label="Comps (market)" value={usdm(av.compsEquity.mid)} />
              <Stat label="Reconciled" value={usdm(av.reconciledUSDm)} color={T.cyan} />
            </div>
            <RangeBarA low={av.range.low} base={av.range.base} high={av.range.high} fmt={usdm} />
            <p style={{ marginTop: 8, fontSize: 13, lineHeight: 1.55, color: T.mutedHi }}>{deal.narrative.valuationVerdict}</p>
          </Card>

          {(() => {
            const rounds = (deal.roundHistory ?? []).filter((r) => r.postMoneyUSDm != null)
            if (rounds.length < 1) return null
            const walk = [...rounds].reverse().map((r) => ({ label: r.series, sub: /\d{4}/.exec(r.date)?.[0], value: r.postMoneyUSDm as number }))
            walk.push({ label: 'This round', sub: 'ask', value: deal.ask.askValuationUSDm, current: true } as (typeof walk)[number] & { current: boolean })
            return (
              <Card padding="20px 24px">
                <SectionTitle kicker="post-money by round · this round marked" title="Funding history" />
                <ValWalkA steps={walk} fmt={usdm} />
              </Card>
            )
          })()}

          {pm && <OperatingMetricsCard pm={pm} />}

          <Card padding="20px 24px">
            <SectionTitle kicker="firm-specific return" title="Return vs hurdle" />
            <ReturnsVsHurdle returns={a.returns} />
          </Card>

          <ScenarioCards returns={a.returns} narratives={deal.narrative.scenarioNarratives} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Card padding="20px 24px">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <Mono>Key assumptions</Mono>
              <button onClick={() => resetDeal(deal.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.muted, fontSize: 11, fontFamily: FONT.mono }}>Reset</button>
            </div>
            <p style={{ marginBottom: 16, fontSize: 11, color: T.muted }}>Edit and watch the value, returns and scores re-run live.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Stepper label="WACC" value={asm.waccPct} unit="%" step={0.5} min={5} max={30} onChange={(v) => set({ waccPct: v })} rationale="Discount rate — drives the intrinsic DCF value." />
              <Stepper label="Terminal growth" value={asm.terminalGrowthPct} unit="%" step={0.5} min={0} max={8} onChange={(v) => set({ terminalGrowthPct: v })} rationale="Perpetuity growth after the forecast." />
              <Stepper label="Exit EV / Revenue" value={asm.exitEVRevenue} unit="x" step={0.5} min={1} max={20} onChange={(v) => set({ exitEVRevenue: v })} rationale="Exit multiple — drives the firm's return." />
              <Stepper label="Hold period" value={asm.holdYears} unit="y" step={1} min={2} max={10} onChange={(v) => set({ holdYears: v })} rationale="Years to exit." />
            </div>
          </Card>

          <Card padding="20px 24px">
            <SectionTitle title="Live scores" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              <Stat label="Mandate" value={a.mandateFit.score} color={scoreColor(a.mandateFit.score)} />
              <Stat label="Merit" value={a.meritScore} color={scoreColor(a.meritScore)} />
              <Stat label="Composite" value={a.composite} color={scoreColor(a.composite)} />
            </div>
          </Card>
        </div>
      </div>

      <CaseColumns positives={deal.narrative.caseFor} risks={deal.narrative.caseAgainst} limitations={deal.narrative.limitations} />

      {pm ? (
        <>
          <OperatingAssumptionsCard deal={deal} pm={pm} />
          <StatementsCard pm={pm} />
          <DcfCard pm={pm} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
            <SensitivityCard grid={pm.waccG} />
            <SensitivityCard grid={pm.entryExit} />
          </div>
        </>
      ) : (
        <>
          <Card padding="20px 24px">
            <SectionTitle kicker="historical actuals + forecast" title="Operating & financial picture" />
            <PnLTable financials={deal.financials} />
          </Card>
          <LockedModelPreview />
        </>
      )}
    </div>
  )
}
