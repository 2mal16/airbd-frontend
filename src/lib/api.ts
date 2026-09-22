/**
 * Thin typed client for the BIDS Dataset Explorer API.
 *
 * The base URL comes from `VITE_API_BASE_URL` so the same build can point at a
 * local backend or the deployed one.
 */

import type {
  DatasetDetail,
  DatasetFacets,
  DatasetListEnvelope,
  DatasetSearchEnvelope,
  PathCheckResponse,
  ServiceInfo,
  TermDefinition,
  ValidationReport,
} from '@/lib/types'

export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ?? 'https://backend-19c991af.fastapicloud.dev'
).replace(/\/$/, '')

export class ApiError extends Error {
  readonly status: number
  readonly detail: string

  constructor(status: number, detail: string) {
    super(detail)
    this.name = 'ApiError'
    this.status = status
    this.detail = detail
  }
}

/**
 * A query value of `undefined`, `null` or `''` is omitted entirely.
 *
 * `false` is *not* omitted: some filters are genuinely tri-state (`is_valid`
 * means valid / invalid / no filter), so callers switch a filter off by
 * passing `undefined`, never `false`.
 */
export type QueryValue = string | number | boolean | undefined | null | readonly string[]

function toSearchParams(query: Record<string, QueryValue>): URLSearchParams {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === '') continue
    if (Array.isArray(value)) {
      // Repeated parameters, which is how FastAPI reads a list.
      for (const item of value) params.append(key, item)
    } else {
      params.append(key, String(value))
    }
  }
  return params
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { Accept: 'application/json', ...init?.headers },
    ...init,
  })

  if (!response.ok) {
    throw new ApiError(response.status, await readError(response))
  }
  return (await response.json()) as T
}

async function readError(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { detail?: unknown }
    if (typeof body.detail === 'string') return body.detail
    if (Array.isArray(body.detail)) {
      // FastAPI validation errors arrive as a list of {loc, msg}.
      return body.detail
        .map((item) => (item as { msg?: string }).msg ?? JSON.stringify(item))
        .join('; ')
    }
    return JSON.stringify(body)
  } catch {
    return response.statusText || `Request failed with ${response.status}`
  }
}

function get<T>(path: string, query: Record<string, QueryValue> = {}): Promise<T> {
  const params = toSearchParams(query).toString()
  return request<T>(params ? `${path}?${params}` : path)
}

export const api = {
  info: () => get<ServiceInfo>('/'),

  listDatasets: (query: Record<string, QueryValue>) =>
    get<DatasetListEnvelope>('/datasets', query),

  searchDatasets: (query: Record<string, QueryValue>) =>
    get<DatasetSearchEnvelope>('/datasets/search', query),

  facets: (query: Record<string, QueryValue> = {}) => get<DatasetFacets>('/datasets/facets', query),

  dataset: async (datasetId: string) => {
    const { dataset } = await get<{ dataset: DatasetDetail }>(
      `/datasets/${encodeURIComponent(datasetId)}`,
    )
    return dataset
  },

  validationReport: (datasetId: string) =>
    get<ValidationReport>(`/datasets/${encodeURIComponent(datasetId)}/validation`),

  bidsVersion: () => get<{ bids_version: string; schema_version: string }>('/bids/version'),

  datatypes: () => get<TermDefinition[]>('/bids/datatypes'),

  validatePaths: (paths: string[]) =>
    request<PathCheckResponse>('/bids/validate-paths', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paths }),
    }),
}
