// ───────────────────────────────────────────────────────────
// Headless deal author — the unattended, API-key-driven entrypoint.
//
//   ANTHROPIC_API_KEY=sk-ant-... npm run author -- "SpaceX exploring an IPO"
//
// Runs the SAME orchestrator + engine + Coherence Ledger as the app (loaded via
// Vite SSR, zero drift), researches and drafts the deal with the live API,
// critiques and revises up to 3 rounds, and — if it clears the gate — writes the
// accepted Deal to src/data/generated/<id>.json, which the app and `npm run gate`
// pick up automatically (no code edit). Prints token usage and an estimated cost.
//
// The whole path is built; it only needs a key. Exit: 0 accepted · 1 not accepted · 2 setup error.
// ───────────────────────────────────────────────────────────
import { createServer } from 'vite'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'node:fs/promises'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const apiKey = process.env.ANTHROPIC_API_KEY
const brief = process.argv.slice(2).join(' ').trim()

if (!apiKey) {
  console.error('Set ANTHROPIC_API_KEY to run the headless author. The pipeline is built — it only needs a key.')
  process.exit(2)
}
if (!brief) {
  console.error('Usage: npm run author -- "<company + strategic situation>"')
  process.exit(2)
}

const server = await createServer({
  root,
  configFile: path.join(root, 'vite.config.ts'),
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
})

try {
  const [{ runHeadless }, { defaultMandate }] = await Promise.all([
    server.ssrLoadModule('/src/pipeline/runHeadless.ts'),
    server.ssrLoadModule('/src/data/mandate.ts'),
  ])
  const [authoringSpec, rubric, schema] = await Promise.all([
    fs.readFile(path.join(root, 'AUTHORING.md'), 'utf8'),
    fs.readFile(path.join(root, 'CRITIQUE.md'), 'utf8'),
    fs.readFile(path.join(root, 'src/types/index.ts'), 'utf8'),
  ])

  const model = 'claude-opus-4-8'
  console.log(`Authoring "${brief}" against the live API (${model})…\n`)

  const { result, usage, costUSD } = await runHeadless({
    brief,
    mandate: defaultMandate,
    authoringSpec,
    rubric,
    schema,
    apiKey,
    model,
    onRound: (_n, m) => console.log('  ' + m),
  })

  const deal = result.deal
  if (result.accepted && deal?.id) {
    const dir = path.join(root, 'src/data/generated')
    await fs.mkdir(dir, { recursive: true })
    const file = path.join(dir, `${deal.id}.json`)
    await fs.writeFile(file, JSON.stringify(deal, null, 2) + '\n')
    console.log(`\n✓ accepted in ${result.rounds} round(s) — wrote ${path.relative(root, file)}`)
    console.log('  run `npm run gate` to confirm; it is picked up automatically (no code edit).')
  } else {
    console.log(`\n✗ not accepted after ${result.rounds} round(s): ${result.ledgerBlocking.length} ledger-blocking, ${result.critique?.blocking.length ?? 0} director-blocking`)
    for (const c of result.ledgerBlocking) console.log(`    ✗ ${c.label}: ${c.detail}`)
  }

  console.log(`\ntokens: ${usage.inputTokens.toLocaleString()} fresh-in · ${usage.cacheReadInputTokens.toLocaleString()} cache-read · ${usage.cacheWriteInputTokens.toLocaleString()} cache-write · ${usage.outputTokens.toLocaleString()} out · ${usage.calls} calls`)
  console.log(`est. cost: $${costUSD.toFixed(2)} (${model})`)

  await server.close()
  process.exit(result.accepted ? 0 : 1)
} catch (err) {
  console.error('[author] error:', err)
  await server.close()
  process.exit(2)
}
