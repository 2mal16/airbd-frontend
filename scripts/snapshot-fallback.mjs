/**
 * Regenerate `src/lib/fallback/data.ts` from a running API.
 *
 * The snapshot is what the app shows when the API cannot be reached. It is
 * generated, never hand-edited, so it cannot quietly drift into fiction.
 *
 *   node scripts/snapshot-fallback.mjs [apiBaseUrl]
 */

import { writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const API = (process.argv[2] ?? 'https://backend-19c991af.fastapicloud.dev').replace(/\/$/, '')
const TARGET = resolve(dirname(fileURLToPath(import.meta.url)), '../src/lib/fallback/data.ts')
const LIMIT = 24

async function getJson(path) {
  const response = await fetch(`${API}${path}`)
  if (!response.ok) throw new Error(`${path} -> ${response.status}`)
  return response.json()
}

const list = await getJson(`/datasets?limit=${LIMIT}&sort=newest`)
const facets = await getJson('/datasets/facets')
const info = await getJson('/')

const datasets = []
const reports = {}
for (const summary of list.datasets) {
  const { dataset } = await getJson(`/datasets/${encodeURIComponent(summary.dataset_id)}`)
  datasets.push(dataset)
  try {
    reports[summary.dataset_id] = await getJson(
      `/datasets/${encodeURIComponent(summary.dataset_id)}/validation`,
    )
  } catch {
    // Datasets that were never validated have no report; that is fine.
  }
}

const banner = `/**
 * Offline snapshot of the catalogue.
 *
 * GENERATED FILE — do not edit. Regenerate with:
 *
 *     node scripts/snapshot-fallback.mjs [apiBaseUrl]
 *
 * The app serves this only when the API is unreachable, and always behind a
 * visible warning, so nobody mistakes it for live data.
 *
 * Captured ${new Date().toISOString()} from ${API}
 * (${info.name} ${info.version}, BIDS ${info.bids_version}).
 */

import type { DatasetDetail, DatasetFacets, ValidationReport } from '@/lib/types'

export const SNAPSHOT_TAKEN_AT = ${JSON.stringify(new Date().toISOString())}
export const SNAPSHOT_SOURCE = ${JSON.stringify(API)}

export const FALLBACK_DATASETS: DatasetDetail[] = ${JSON.stringify(datasets, null, 2)}

export const FALLBACK_REPORTS: Record<string, ValidationReport> = ${JSON.stringify(reports, null, 2)}

export const FALLBACK_FACETS: DatasetFacets = ${JSON.stringify(facets, null, 2)}
`

writeFileSync(TARGET, banner)
console.log(`Wrote ${TARGET}: ${datasets.length} datasets, ${Object.keys(reports).length} reports`)
