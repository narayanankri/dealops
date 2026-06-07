// ───────────────────────────────────────────────────────────
// Headless quality gate. Runs the SAME deterministic Coherence Ledger as the
// app — but in Node, with no browser and no human in the loop. This is the
// gate the autonomous, API-key-driven authoring pipeline will call, and the
// gate CI runs on every change. Exit code 0 = clean, 1 = a deal is blocking,
// 2 = the gate itself errored.
//
//   npm run gate            # all seeded deals
//   npm run gate -- tabby   # one deal by id
//
// Uses Vite's SSR module loader so the engine/validator/data run exactly as
// they do in the app (same `@/` alias, same code) — no separate build, no
// drift between what the app enforces and what the pipeline enforces.
// ───────────────────────────────────────────────────────────
import { createServer } from 'vite'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const only = process.argv[2]

const server = await createServer({
  root,
  configFile: path.join(root, 'vite.config.ts'),
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
})

try {
  const [{ seedDeals }, { analyze }, { defaultMandate }] = await Promise.all([
    server.ssrLoadModule('/src/data/index.ts'),
    server.ssrLoadModule('/src/engine/index.ts'),
    server.ssrLoadModule('/src/data/mandate.ts'),
  ])

  const deals = only ? seedDeals.filter((d) => d.id === only) : seedDeals
  if (only && !deals.length) {
    console.error(`No deal with id "${only}". Known: ${seedDeals.map((d) => d.id).join(', ')}`)
    await server.close()
    process.exit(2)
  }

  let blockingTotal = 0
  let warnTotal = 0
  for (const d of deals) {
    const { integrity } = analyze(d, defaultMandate)
    const checks = integrity.checks
    const blocking = checks.filter((c) => c.severity === 'blocking')
    const warn = checks.filter((c) => c.severity === 'warn')
    const pass = checks.filter((c) => c.severity === 'pass')
    const mark = blocking.length ? '✗' : warn.length ? '!' : '✓'
    console.log(`${mark} ${d.id.padEnd(18)} ${pass.length}/${checks.length} pass` + (blocking.length ? `  · ${blocking.length} BLOCKING` : warn.length ? `  · ${warn.length} warn` : ''))
    for (const c of blocking) console.log(`    ✗ ${c.label}: ${c.detail}`)
    for (const c of warn) console.log(`    ! ${c.label}: ${c.detail}`)
    blockingTotal += blocking.length
    warnTotal += warn.length
  }

  console.log(`\n${deals.length} deal(s) · ${blockingTotal} blocking · ${warnTotal} warning(s)`)
  await server.close()
  process.exit(blockingTotal ? 1 : 0)
} catch (err) {
  console.error('[gate] error:', err)
  await server.close()
  process.exit(2)
}
