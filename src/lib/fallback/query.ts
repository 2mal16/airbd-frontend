/**
 * Client-side filtering over the offline snapshot.
 *
 * A deliberately partial re-implementation of the server's query semantics:
 * enough that the filters on screen keep working while the API is down, over a
 * catalogue small enough that doing it in the browser is free. Anything the
 * server can do that this cannot — full-text ranking, filters the snapshot has
 * no column for — is simply not applied, which is safe because the result is
 * always labelled as a snapshot.
 */

import type { DiscoveryState } from '@/hooks/use-dataset-query'
import { PAGE_SIZE } from '@/hooks/use-dataset-query'
import {
  FALLBACK_DATASETS,
  FALLBACK_FACETS,
  FALLBACK_REPORTS,
} from '@/lib/fallback/data'
import type {
  DatasetDetail,
  DatasetFacets,
  DatasetListEnvelope,
  FacetValue,
  ValidationReport,
} from '@/lib/types'

function parseRange(token: string): { min: number | null; max: number | null } | null {
  const text = token.trim()
  if (!text) return null
  if (!text.includes('..')) {
    const value = Number(text)
    return Number.isNaN(value) ? null : { min: value, max: value }
  }
  const [low, high] = text.split('..')
  const min = low.trim() ? Number(low) : null
  const max = high.trim() ? Number(high) : null
  if ((min !== null && Number.isNaN(min)) || (max !== null && Number.isNaN(max))) return null
  return { min, max }
}

function inRange(value: number | null, range: { min: number | null; max: number | null }): boolean {
  if (value === null) return false
  if (range.min !== null && value < range.min) return false
  if (range.max !== null && value > range.max) return false
  return true
}

function overlaps(
  low: number | null,
  high: number | null,
  range: { min: number | null; max: number | null },
): boolean {
  const start = low ?? high
  const end = high ?? low
  if (start === null || end === null) return false
  if (range.min !== null && end < range.min) return false
  if (range.max !== null && start > range.max) return false
  return true
}

function searchable(dataset: DatasetDetail): string {
  return [
    dataset.dataset_id,
    dataset.name,
    dataset.description ?? '',
    dataset.authors.join(' '),
    dataset.tasks.join(' '),
    dataset.keywords.join(' '),
  ]
    .join(' ')
    .toLowerCase()
}

function matches(dataset: DatasetDetail, state: DiscoveryState): boolean {
  if (state.modality.length > 0) {
    const present = new Set<string>(dataset.modalities)
    const wanted = state.modality
    const ok = state.modality_match_all
      ? wanted.every((m) => present.has(m))
      : wanted.some((m) => present.has(m))
    if (!ok) return false
  }

  if (state.license.length > 0 && !state.license.includes(dataset.license_tier)) return false

  if (state.validation.length === 1) {
    const wantValid = state.validation[0] === 'valid'
    if (state.validation[0] === 'unvalidated') {
      if (dataset.validation !== null) return false
    } else if (dataset.validation === null || dataset.validation.is_valid !== wantValid) {
      return false
    }
  }

  if (state.electrode_system[0] && dataset.electrode_system !== state.electrode_system[0]) {
    return false
  }
  if (state.bids_version[0] && dataset.bids_version !== state.bids_version[0]) return false
  if (state.hed_version[0] && dataset.hed_version !== state.hed_version[0]) return false
  if (state.source[0] && dataset.source !== state.source[0]) return false
  if (state.powerline[0] && String(dataset.power_line_frequency ?? '') !== state.powerline[0]) {
    return false
  }

  if (state.has_hed && !dataset.has_hed) return false
  if (state.has_doi && !dataset.doi) return false

  if (state.subjects) {
    const range = parseRange(state.subjects)
    if (range && !inRange(dataset.participants, range)) return false
  }
  if (state.channels) {
    const range = parseRange(state.channels)
    if (
      range &&
      !overlaps(
        dataset.channel_count_min ?? dataset.n_channels,
        dataset.channel_count_max ?? dataset.n_channels,
        range,
      )
    ) {
      return false
    }
  }

  if (state.search) {
    const haystack = searchable(dataset)
    const terms = state.search.toLowerCase().split(/\W+/).filter(Boolean)
    if (!terms.every((term) => haystack.includes(term))) return false
  }

  return true
}

function sortDatasets(datasets: DatasetDetail[], sort: DiscoveryState['sort']): DatasetDetail[] {
  const byName = (a: DatasetDetail, b: DatasetDetail) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  const copy = [...datasets]

  switch (sort) {
    case 'oldest':
      return copy.sort((a, b) => a.created_at.localeCompare(b.created_at) || byName(a, b))
    case 'name':
      return copy.sort(byName)
    case 'participants':
      return copy.sort((a, b) => b.participants - a.participants || byName(a, b))
    case 'size':
      return copy.sort((a, b) => b.file_size - a.file_size || byName(a, b))
    case 'citations':
      return copy.sort((a, b) => b.num_citations - a.num_citations || byName(a, b))
    case 'validation':
      return copy.sort((a, b) => {
        const rank = (d: DatasetDetail) =>
          d.validation === null ? 2 : d.validation.is_valid ? 0 : 1
        return (
          rank(a) - rank(b) ||
          (a.validation?.error_count ?? 0) - (b.validation?.error_count ?? 0) ||
          byName(a, b)
        )
      })
    default:
      return copy.sort((a, b) => b.created_at.localeCompare(a.created_at) || byName(a, b))
  }
}

export function fallbackList(state: DiscoveryState): DatasetListEnvelope {
  const matching = sortDatasets(
    FALLBACK_DATASETS.filter((dataset) => matches(dataset, state)),
    state.sort,
  )
  const offset = (state.page - 1) * PAGE_SIZE
  return {
    datasets: matching.slice(offset, offset + PAGE_SIZE),
    count: Math.min(PAGE_SIZE, Math.max(0, matching.length - offset)),
    total_count: matching.length,
    limit: PAGE_SIZE,
    offset,
  }
}

function countBy(datasets: DatasetDetail[], pick: (d: DatasetDetail) => string[]): FacetValue[] {
  const counts = new Map<string, number>()
  for (const dataset of datasets) {
    for (const value of pick(dataset)) {
      if (!value) continue
      counts.set(value, (counts.get(value) ?? 0) + 1)
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([value, count]) => ({ value, count }))
}

export function fallbackFacets(state: DiscoveryState): DatasetFacets {
  const datasets = FALLBACK_DATASETS.filter((dataset) => matches(dataset, state))
  const tasks = countBy(datasets, (d) => d.tasks)

  return {
    modality: countBy(datasets, (d) => d.modalities),
    license: countBy(datasets, (d) => [d.license_tier]),
    'electrode-system': countBy(datasets, (d) => (d.electrode_system ? [d.electrode_system] : [])),
    powerline: countBy(datasets, (d) =>
      d.power_line_frequency ? [String(d.power_line_frequency)] : [],
    ),
    'bids-version': countBy(datasets, (d) => (d.bids_version ? [d.bids_version] : [])),
    'hed-version': countBy(datasets, (d) => (d.hed_version ? [d.hed_version] : [])),
    source: countBy(datasets, (d) => (d.source ? [d.source] : [])),
    validation: countBy(datasets, (d) => [
      d.validation === null ? 'unvalidated' : d.validation.is_valid ? 'valid' : 'invalid',
    ]),
    task: { values: tasks, distinct_total: tasks.length, truncated: false },
  }
}

export function fallbackDataset(datasetId: string): DatasetDetail | undefined {
  return FALLBACK_DATASETS.find((dataset) => dataset.dataset_id === datasetId)
}

export function fallbackReport(datasetId: string): ValidationReport | undefined {
  return FALLBACK_REPORTS[datasetId]
}

export { FALLBACK_FACETS }
