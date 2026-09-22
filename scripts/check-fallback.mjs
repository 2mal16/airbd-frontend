/**
 * Exercise the offline fallback.
 *
 * The snapshot path only runs when the API is down, which is exactly when
 * nobody is watching — so it gets checked here instead. The module is built
 * with Vite (same aliases, same TypeScript) and then driven from Node.
 *
 *     npm run check:fallback
 */
import { build } from 'vite'
import path from 'node:path'
import { rmSync, writeFileSync } from 'node:fs'

const root = process.cwd()
const entry = path.join(root, 'src/__fallback_check.ts')

writeFileSync(entry, `
import { fallbackFacets, fallbackList, fallbackDataset, fallbackReport } from '@/lib/fallback/query'
import { FALLBACK_DATASETS } from '@/lib/fallback/data'
export { fallbackFacets, fallbackList, fallbackDataset, fallbackReport, FALLBACK_DATASETS }
`)

await build({
  root,
  logLevel: 'error',
  build: {
    lib: { entry, formats: ['es'], fileName: 'fallback-check' },
    outDir: path.join(root, '.fallback-check'),
    emptyOutDir: true,
    minify: false,
  },
  resolve: { alias: { '@': path.join(root, 'src') } },
})

const m = await import(path.join(root, '.fallback-check/fallback-check.js'))

// The build artefacts have served their purpose; never leave them in the tree.
const cleanUp = () => {
  rmSync(entry, { force: true })
  rmSync(path.join(root, '.fallback-check'), { recursive: true, force: true })
}
process.on('exit', cleanUp)

const base = {
  search: '', sort: 'newest', page: 1, modality: [], license: [], electrode_system: [],
  bids_version: [], hed_version: [], source: [], powerline: [], validation: [],
  has_hed: false, has_doi: false, modality_match_all: false, subjects: '', channels: '',
}
const q = (patch) => ({ ...base, ...patch })
let failed = 0
const check = (label, actual, expected) => {
  const ok = JSON.stringify(actual) === JSON.stringify(expected)
  if (!ok) failed++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${ok ? '' : `\n        got ${JSON.stringify(actual)} want ${JSON.stringify(expected)}`}`)
}
const ids = (r) => r.datasets.map((d) => d.dataset_id).sort()

console.log(`snapshot holds ${m.FALLBACK_DATASETS.length} datasets\n`)

check('no filters returns everything', m.fallbackList(q({})).total_count, 4)
check('modality=meg (OR)', ids(m.fallbackList(q({ modality: ['meg'] }))), ['ds000117'])
check('modality=meg,eeg OR', m.fallbackList(q({ modality: ['meg', 'eeg'] })).total_count, 4)
check('modality=meg,eeg AND', ids(m.fallbackList(q({ modality: ['meg', 'eeg'], modality_match_all: true }))), ['ds000117'])
check('licence=public', ids(m.fallbackList(q({ license: ['public'] }))), ['ds000117', 'ds004148'])
check('validation=invalid', ids(m.fallbackList(q({ validation: ['invalid'] }))), ['ds004148'])
check('has_hed', ids(m.fallbackList(q({ has_hed: true }))), ['ds002718', 'ds003645'])
check('subjects=20..', ids(m.fallbackList(q({ subjects: '20..' }))), ['ds004148'])
check('subjects=16..19', ids(m.fallbackList(q({ subjects: '16..19' }))), ['ds000117', 'ds002718', 'ds003645'])
check('channels=100..', ids(m.fallbackList(q({ channels: '100..' }))), ['ds003645'])
check('search "resting"', ids(m.fallbackList(q({ search: 'resting' }))), ['ds004148'])
check('sort=participants first', m.fallbackList(q({ sort: 'participants' })).datasets[0].dataset_id, 'ds004148')
check('sort=size first', m.fallbackList(q({ sort: 'size' })).datasets[0].dataset_id, 'ds000117')
check('sort=validation last', m.fallbackList(q({ sort: 'validation' })).datasets.at(-1).dataset_id, 'ds004148')
check('nonsense range is ignored, not fatal', m.fallbackList(q({ subjects: 'abc' })).total_count, 4)

const f = m.fallbackFacets(q({}))
check('facet modality eeg', f.modality.find((x) => x.value === 'eeg').count, 4)
check('facet validation', f.validation.map((x) => `${x.value}:${x.count}`).sort(), ['invalid:1', 'valid:3'])
check('facet licence public', f.license.find((x) => x.value === 'public').count, 2)
check('facets narrow with filters', m.fallbackFacets(q({ modality: ['meg'] })).license.reduce((a, x) => a + x.count, 0), 1)

check('detail lookup', m.fallbackDataset('ds002718').participants, 19)
check('unknown id', m.fallbackDataset('nope'), undefined)
check('report lookup', m.fallbackReport('ds004148').summary.error_count, 2)

console.log(failed === 0 ? '\nAll fallback checks passed.' : `\n${failed} FAILED`)
process.exit(failed === 0 ? 0 : 1)
