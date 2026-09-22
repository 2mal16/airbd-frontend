/**
 * The data layer the pages talk to.
 *
 * Each call tries the API first. When the API cannot be reached at all, it
 * serves the bundled snapshot instead and flags the app as offline so the
 * banner appears — the page stays usable rather than collapsing into an error.
 *
 * Only `offline` errors fall back. A 404, a rejected filter or a 500 is a real
 * answer from the API and is surfaced as one; quietly swapping in stale data
 * there would hide a genuine problem.
 */

import { ApiError, api } from '@/lib/api'
import {
  fallbackDataset,
  fallbackFacets,
  fallbackList,
  fallbackReport,
} from '@/lib/fallback/query'
import { SNAPSHOT_TAKEN_AT } from '@/lib/fallback/data'
import type { DiscoveryState } from '@/hooks/use-dataset-query'
import { toApiQuery } from '@/hooks/use-dataset-query'
import { markOffline, markOnline } from '@/lib/offline-status'
import type {
  DatasetDetail,
  DatasetFacets,
  DatasetListEnvelope,
  ValidationReport,
} from '@/lib/types'

export { SNAPSHOT_TAKEN_AT }

function isUnreachable(error: unknown): error is ApiError {
  return error instanceof ApiError && (error.kind === 'offline' || error.kind === 'misconfigured')
}

/** Run `live`; on an unreachable API, fall back to `snapshot` and flag it. */
async function withFallback<T>(live: () => Promise<T>, snapshot: () => T): Promise<T> {
  try {
    const result = await live()
    markOnline()
    return result
  } catch (error) {
    if (!isUnreachable(error)) throw error
    markOffline(error)
    return snapshot()
  }
}

export function listDatasets(state: DiscoveryState): Promise<DatasetListEnvelope> {
  return withFallback(
    () => api.listDatasets(toApiQuery(state)),
    () => fallbackList(state),
  )
}

export function getFacets(state: DiscoveryState): Promise<DatasetFacets> {
  return withFallback(
    () => api.facets(),
    () => fallbackFacets(state),
  )
}

export function getDataset(datasetId: string): Promise<DatasetDetail> {
  return withFallback(
    () => api.dataset(datasetId),
    () => {
      const dataset = fallbackDataset(datasetId)
      if (!dataset) {
        throw new ApiError(404, `${datasetId} is not in the offline snapshot`, 'not-found')
      }
      return dataset
    },
  )
}

export function getValidationReport(datasetId: string): Promise<ValidationReport> {
  return withFallback(
    () => api.validationReport(datasetId),
    () => {
      const report = fallbackReport(datasetId)
      if (!report) {
        throw new ApiError(404, `No snapshot report for ${datasetId}`, 'not-found')
      }
      return report
    },
  )
}
