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

/** Used whenever `VITE_API_BASE_URL` is unset, empty or blank. */
export const DEFAULT_API_BASE_URL = 'https://backend-19c991af.fastapicloud.dev'

/**
 * Note `||`, not `??`: a hosting provider can define the variable with an
 * empty value, and `??` would let that through. An empty base would make every
 * request relative, which a SPA rewrite answers with `index.html` — so the
 * failure would surface as "Unexpected token '<'" rather than as a
 * misconfiguration.
 */
export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL?.trim() || DEFAULT_API_BASE_URL
).replace(/\/$/, '')

/**
 * What went wrong, at the level a person can act on.
 *
 * `status` alone is not enough: a failed `fetch` has no status at all, and a
 * 200 carrying HTML is a configuration problem rather than an API response.
 */
export type ApiErrorKind =
  | 'offline' // the request never reached a server
  | 'misconfigured' // something answered, but it was not the API
  | 'not-found'
  | 'invalid-request'
  | 'server'
  | 'unknown'

export class ApiError extends Error {
  readonly status: number
  readonly detail: string
  readonly kind: ApiErrorKind
  /** One line naming the problem, for a banner heading. */
  readonly title: string
  /** What the reader can do about it. */
  readonly hint: string

  constructor(status: number, detail: string, kind: ApiErrorKind = 'unknown') {
    super(detail)
    this.name = 'ApiError'
    this.status = status
    this.detail = detail
    this.kind = kind
    const { title, hint } = describe(kind, status)
    this.title = title
    this.hint = hint
  }
}

function describe(kind: ApiErrorKind, status: number): { title: string; hint: string } {
  switch (kind) {
    case 'offline':
      return {
        title: `Cannot reach the API at ${API_BASE_URL}`,
        hint: 'The service may be starting up, or this browser may be offline. It is also what a blocked CORS request looks like from here.',
      }
    case 'misconfigured':
      return {
        title: 'That address is not the API',
        hint: `Something answered at ${API_BASE_URL} but did not return JSON. Check VITE_API_BASE_URL.`,
      }
    case 'not-found':
      return { title: 'Not found', hint: 'It may have been removed from the catalogue, or the id may be wrong.' }
    case 'invalid-request':
      return {
        title: 'The API rejected these filters',
        hint: 'Ranges are written as "a..b", "a..", "..b" or "a" — for example 20..50.',
      }
    case 'server':
      return {
        title: `The API failed with ${status}`,
        hint: 'This is a fault on the server side. Trying again shortly may work.',
      }
    default:
      return { title: 'Something went wrong', hint: 'The request did not complete.' }
  }
}

function kindForStatus(status: number): ApiErrorKind {
  if (status === 404) return 'not-found'
  if (status === 400 || status === 422) return 'invalid-request'
  if (status >= 500) return 'server'
  return 'unknown'
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
  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: { Accept: 'application/json', ...init?.headers },
      ...init,
    })
  } catch (cause) {
    // fetch only rejects when the request never got an HTTP response at all:
    // DNS failure, connection refused, offline, or a blocked CORS preflight.
    throw new ApiError(0, cause instanceof Error ? cause.message : String(cause), 'offline')
  }

  if (!response.ok) {
    throw new ApiError(response.status, await readError(response), kindForStatus(response.status))
  }

  // A 200 that is not JSON means we are not talking to the API at all — most
  // likely a relative URL that the host's SPA rewrite answered with the app's
  // own index.html. Say that, rather than letting JSON.parse complain.
  const contentType = response.headers.get('content-type') ?? ''
  if (!contentType.includes('json')) {
    throw new ApiError(
      response.status,
      `Expected JSON from ${API_BASE_URL}${path} but received "${contentType || 'no content type'}".`,
      'misconfigured',
    )
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
