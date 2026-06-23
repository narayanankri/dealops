// ───────────────────────────────────────────────────────────
// Deep verification that the HEADLESS pipeline does the exact same thing as the
// Claude-Code-driven (manual) method — WITHOUT a live key.
//
//   node scripts/test-headless.mjs
//
// Loads the real modules via Vite SSR (same code/alias as the app), then:
//   1. JSON round-trip parity   — a JSON-authored deal analyses identically to TS
//   2. Orchestrator             — accept / revise / reject / warnings-don't-block
//   3. Robustness               — a malformed draft is fed back, never crashes
//   4. Provider (mocked fetch)  — request shape, JSON parse, pause_turn loop, usage
//   5. runHeadless (mocked)     — full path end-to-end returns result+usage+cost
//   6. Cost accounting          — estimateCostUSD matches by hand
//   7. JSON registration        — a generated/*.json deal is picked up by the gate
//   8. CLI guards               — no key / no brief exit 2
// Exit 0 = all pass, 1 = a check failed, 2 = harness error.
// ───────────────────────────────────────────────────────────
import { createServer } from 'vite'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'
import path from 'node:path'
import fs from 'node:fs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
let pass = 0, fail = 0
const ok = (name, cond, detail = '') => { if (cond) { pass++; console.log(`  ✓ ${name}`) } else { fail++; console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`) } }
const section = (s) => console.log(`\n${s}`)

const server = await createServer({ root, configFile: path.join(root, 'vite.config.ts'), server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' })

const realFetch = globalThis.fetch

try {
  const [{ seedDeals }, eng, { defaultMandate }, { authorDeal }, providerMod, headlessMod, { tabby }, { ramp }] = await Promise.all([
    server.ssrLoadModule('/src/data/index.ts'),
    server.ssrLoadModule('/src/engine/index.ts'),
    server.ssrLoadModule('/src/data/mandate.ts'),
    server.ssrLoadModule('/src/pipeline/authorDeal.ts'),
    server.ssrLoadModule('/src/pipeline/provider.ts'),
    server.ssrLoadModule('/src/pipeline/runHeadless.ts'),
    server.ssrLoadModule('/src/data/deals/tabby.ts'),
    server.ssrLoadModule('/src/data/deals/ramp.ts'),
  ])
  const { analyze } = eng
  const { createAnthropicProvider, estimateCostUSD } = { ...providerMod, ...headlessMod }
  const M = defaultMandate
  const clone = (o) => JSON.parse(JSON.stringify(o))
  const READMES = { authoringSpec: 'AUTHORING', schema: 'SCHEMA', rubric: 'CRITIQUE' }

  // ── 1. JSON round-trip parity ──────────────────────────────
  section('1. JSON round-trip parity (TS deal vs JSON-serialized deal)')
  let parityFails = 0
  for (const d of seedDeals) {
    const a = JSON.stringify(analyze(d, M))
    const b = JSON.stringify(analyze(clone(d), M))
    if (a !== b) { parityFails++; console.log(`     ✗ ${d.id} diverges after JSON round-trip`) }
  }
  ok(`all ${seedDeals.length} deals analyse identically after JSON round-trip`, parityFails === 0, `${parityFails} diverged`)

  // ── 2 & 3. Orchestrator with a mock provider ───────────────
  section('2. Orchestrator — accept / revise / reject (mock provider)')
  const mkProvider = (authorFn, critiqueFn) => {
    const calls = { author: [], critique: [] }
    return {
      provider: {
        name: 'mock',
        async author(req) { calls.author.push(req); return authorFn(calls.author.length, req) },
        async critique(deal, rubric, ledger) { calls.critique.push({ deal, ledger }); return critiqueFn ? critiqueFn(calls.critique.length) : { blocking: [], warnings: [], questions: [], raw: '' } },
      },
      calls,
    }
  }
  const noBlock = () => ({ blocking: [], warnings: [], questions: [], raw: '' })

  // 2a clean → accept round 1
  {
    const { provider } = mkProvider(() => clone(tabby), noBlock)
    const r = await authorDeal({ brief: 'x', mandate: M, ...READMES, provider })
    ok('clean draft accepted in round 1', r.accepted && r.rounds === 1, `accepted=${r.accepted} rounds=${r.rounds}`)
  }

  // 2b warnings present but no blocking → still accepted, warnings surfaced
  {
    const warnDeal = seedDeals.find((d) => analyze(d, M).integrity.checks.some((c) => c.severity === 'warn')) ?? clone(ramp)
    const { provider } = mkProvider(() => clone(warnDeal), noBlock)
    const r = await authorDeal({ brief: 'x', mandate: M, ...READMES, provider })
    ok('warnings do NOT block acceptance', r.accepted === true, `accepted=${r.accepted}`)
    ok('ledger warnings are surfaced', r.ledgerWarnings.length > 0, `${r.ledgerWarnings.length} warnings`)
  }

  // 2c persistent director-blocking → reject after maxRounds
  {
    const { provider, calls } = mkProvider(() => clone(tabby), () => ({ blocking: ['fabricated issue'], warnings: [], questions: [], raw: 'x' }))
    const r = await authorDeal({ brief: 'x', mandate: M, ...READMES, provider, maxRounds: 3 })
    ok('persistent director-blocking → not accepted', r.accepted === false, `accepted=${r.accepted}`)
    ok('ran exactly maxRounds (3)', r.rounds === 3, `rounds=${r.rounds}`)
    ok('re-authored between rounds (revise loop ran)', calls.author.length === 3, `author calls=${calls.author.length}`)
    ok('revise calls carried the director critique back', !!calls.author[1]?.critique, 'no critique fed back')
  }

  // 3. malformed first draft (missing peers) → fed back as blocking, NOT thrown; then fixed → accept
  section('3. Robustness — malformed draft is fed back, never crashes the run')
  {
    const broken = clone(tabby); delete broken.peers
    const { provider, calls } = mkProvider((n) => (n === 1 ? broken : clone(tabby)), noBlock)
    let threw = false, r
    try { r = await authorDeal({ brief: 'x', mandate: M, ...READMES, provider, maxRounds: 3 }) } catch (e) { threw = true; r = { err: String(e?.message || e) } }
    ok('malformed draft did not throw', !threw, r.err)
    ok('recovered and accepted after revise', !threw && r.accepted === true, threw ? '' : `accepted=${r.accepted} rounds=${r.rounds}`)
    ok('blocking failures were fed back to the author', !threw && !!calls.author[1]?.ledgerFailures?.length, 'no ledgerFailures fed back')
  }

  // ── 4. Provider against a mocked fetch ─────────────────────
  section('4. Provider (createAnthropicProvider) against a mocked Messages API')
  {
    const reqs = []
    const reply = (data) => ({ ok: true, status: 200, async json() { return data }, async text() { return '' } })
    const dealJson = JSON.stringify(clone(tabby))
    const usage = { input_tokens: 1000, output_tokens: 400, cache_read_input_tokens: 200, cache_creation_input_tokens: 50 }
    let authorCallN = 0
    globalThis.fetch = async (url, opts) => {
      const body = JSON.parse(opts.body)
      reqs.push({ url, body, headers: opts.headers })
      const isCritique = JSON.stringify(body.messages).includes('DEAL UNDER REVIEW')
      if (isCritique) return reply({ content: [{ type: 'text', text: JSON.stringify({ blocking: [], warnings: ['w'], questions: ['q'], raw: 'ok' }) }], stop_reason: 'end_turn', usage })
      authorCallN++
      // first author call → pause_turn (tool loop), second → final deal
      if (authorCallN === 1) return reply({ content: [{ type: 'text', text: 'searching…' }], stop_reason: 'pause_turn', usage })
      return reply({ content: [{ type: 'text', text: '```json\n' + dealJson + '\n```' }], stop_reason: 'end_turn', usage })
    }
    const p = createAnthropicProvider({ apiKey: 'sk-fake', model: 'claude-opus-4-8' })
    const deal = await p.author({ brief: 'b', mandate: M, authoringSpec: 'A', schema: 'S' })
    ok('author() parses the Deal from a fenced JSON reply', deal?.id === tabby.id, `id=${deal?.id}`)
    ok('author() ran the pause_turn continuation loop', authorCallN === 2, `author http calls=${authorCallN}`)
    const aReq = reqs[0].body
    ok('request carries the model', aReq.model === 'claude-opus-4-8')
    ok('system block is cache_control 1h (caching contract)', aReq.system?.[0]?.cache_control?.ttl === '1h', JSON.stringify(aReq.system?.[0]?.cache_control))
    ok('research tools (web_search + web_fetch) are attached', Array.isArray(aReq.tools) && aReq.tools.length === 2, JSON.stringify(aReq.tools?.map?.((t) => t.name)))
    ok('uses the basic, dependency-free tool versions (no code-exec needed)', aReq.tools?.[0]?.type === 'web_search_20250305' && aReq.tools?.[1]?.type === 'web_fetch_20250910', JSON.stringify(aReq.tools?.map?.((t) => t.type)))
    ok('no anthropic-beta header is sent (none required)', !Object.keys(reqs[0].headers ?? {}).some((h) => h.toLowerCase() === 'anthropic-beta'), 'unexpected beta header')
    ok('adaptive thinking + high effort set', aReq.thinking?.type === 'adaptive' && aReq.output_config?.effort === 'high')
    ok('usage accumulates across calls', p.usage.outputTokens === 400 * 2 && p.usage.cacheReadInputTokens === 200 * 2, JSON.stringify(p.usage))

    const rep = await p.critique(clone(tabby), 'RUBRIC', [])
    ok('critique() parses a punch-list', Array.isArray(rep.blocking) && rep.warnings[0] === 'w', JSON.stringify(rep))
  }

  // ── 5. runHeadless end-to-end (mocked fetch) ───────────────
  section('5. runHeadless — full path end-to-end (mocked Messages API)')
  {
    const usage = { input_tokens: 500, output_tokens: 300, cache_read_input_tokens: 100, cache_creation_input_tokens: 20 }
    const reply = (data) => ({ ok: true, status: 200, async json() { return data }, async text() { return '' } })
    globalThis.fetch = async (_url, opts) => {
      const body = JSON.parse(opts.body)
      const isCritique = JSON.stringify(body.messages).includes('DEAL UNDER REVIEW')
      if (isCritique) return reply({ content: [{ type: 'text', text: JSON.stringify({ blocking: [], warnings: [], questions: [], raw: 'clean' }) }], stop_reason: 'end_turn', usage })
      return reply({ content: [{ type: 'text', text: JSON.stringify(clone(tabby)) }], stop_reason: 'end_turn', usage })
    }
    const res = await headlessMod.runHeadless({ brief: 'Tabby', mandate: M, authoringSpec: 'A', schema: 'S', rubric: 'R', apiKey: 'sk-fake', model: 'claude-opus-4-8' })
    ok('runHeadless accepts a clean deal end-to-end', res.result.accepted === true, `accepted=${res.result.accepted}`)
    ok('runHeadless reports a positive cost', res.costUSD > 0, `cost=${res.costUSD}`)
    ok('runHeadless reports usage (≥2 calls: author + critique)', res.usage.calls >= 2, `calls=${res.usage.calls}`)
  }
  globalThis.fetch = realFetch

  // ── 6. Cost accounting ─────────────────────────────────────
  section('6. estimateCostUSD matches hand-computed cost')
  {
    const u = { calls: 1, inputTokens: 1_000_000, outputTokens: 1_000_000, cacheReadInputTokens: 1_000_000, cacheWriteInputTokens: 1_000_000 }
    // opus 4.8: in 5, out 25, cr 0.5, write 1.25× in = 6.25 → 5 + 25 + 0.5 + 6.25 = 36.75
    const c = estimateCostUSD(u, 'claude-opus-4-8')
    ok('opus 4.8 cost = $36.75 for 1M of each', Math.abs(c - 36.75) < 1e-9, `got ${c}`)
  }

  // ── 7. Generated JSON deal is registered by the gate ───────
  section('7. Generated JSON deal is picked up by the gate (registration path)')
  {
    const dir = path.join(root, 'src/data/generated')
    const file = path.join(dir, '__test_generated.json')
    fs.mkdirSync(dir, { recursive: true })
    const gen = clone(tabby); gen.id = 'test-generated'; gen.name = 'Test Generated Co'
    fs.writeFileSync(file, JSON.stringify(gen, null, 2))
    try {
      const out = execFileSync('node', ['scripts/gate.mjs'], { cwd: root, encoding: 'utf8' })
      ok('generated deal appears in the gate output', out.includes('test-generated'), 'not listed')
      const line = out.split('\n').find((l) => l.includes('test-generated')) ?? ''
      ok('generated deal passes the gate (no blocking)', !line.includes('BLOCKING'), line.trim())
    } finally {
      fs.unlinkSync(file)
    }
  }

  // ── 8. CLI guards ──────────────────────────────────────────
  section('8. CLI guards (scripts/author-deal.mjs)')
  const runCli = (args, env) => {
    try { execFileSync('node', ['scripts/author-deal.mjs', ...args], { cwd: root, encoding: 'utf8', env: { ...process.env, ...env } }); return 0 }
    catch (e) { return e.status ?? -1 }
  }
  ok('exits 2 with no API key', runCli(['some brief'], { ANTHROPIC_API_KEY: '' }) === 2)
  ok('exits 2 with key but no brief', runCli([], { ANTHROPIC_API_KEY: 'sk-fake' }) === 2)

  console.log(`\n${pass + fail} checks · ${pass} passed · ${fail} failed`)
  await server.close()
  process.exit(fail ? 1 : 0)
} catch (err) {
  globalThis.fetch = realFetch
  console.error('[test-headless] harness error:', err)
  await server.close()
  process.exit(2)
}
