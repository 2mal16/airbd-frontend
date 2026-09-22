/**
 * Discovery filter state, held in the URL.
 *
 * Keeping it in the query string rather than component state means a filtered
 * view is a link: shareable, bookmarkable, and survives a reload.
 */

import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router'

import type { QueryValue } from '@/lib/api'
import type { SortOrder } from '@/lib/types'

export const PAGE_SIZE = 10

/** Facets the user can select several values of. */
export const MULTI_FACETS = ['modality', 'license'] as const
/** Facets the API accepts exactly one value for. */
export const SINGLE_FACETS = [
  'electrode_system',
  'bids_version',
  'hed_version',
  'source',
  'powerline',
] as const

export type MultiFacet = (typeof MULTI_FACETS)[number]
export type SingleFacet = (typeof SINGLE_FACETS)[number]

export interface DiscoveryState {
  search: string
  sort: SortOrder
  page: number
  modality: string[]
  license: string[]
  electrode_system: string[]
  bids_version: string[]
  hed_version: string[]
  source: string[]
  powerline: string[]
  validation: string[]
  has_hed: boolean
  has_doi: boolean
  modality_match_all: boolean
  subjects: string
  channels: string
}

const EMPTY: string[] = []

export function useDiscoveryState() {
  const [params, setParams] = useSearchParams()

  const state = useMemo<DiscoveryState>(
    () => ({
      search: params.get('q') ?? '',
      sort: (params.get('sort') as SortOrder | null) ?? 'newest',
      page: Math.max(1, Number(params.get('page') ?? '1') || 1),
      modality: params.getAll('modality'),
      license: params.getAll('license'),
      electrode_system: params.getAll('electrode_system'),
      bids_version: params.getAll('bids_version'),
      hed_version: params.getAll('hed_version'),
      source: params.getAll('source'),
      powerline: params.getAll('powerline'),
      validation: params.getAll('validation'),
      has_hed: params.get('has_hed') === '1',
      has_doi: params.get('has_doi') === '1',
      modality_match_all: params.get('all') === '1',
      subjects: params.get('subjects') ?? '',
      channels: params.get('channels') ?? '',
    }),
    [params],
  )

  /** Apply a patch, resetting to page 1 unless the patch sets a page itself. */
  const update = useCallback(
    (patch: Partial<DiscoveryState>) => {
      const next = new URLSearchParams(params)

      for (const [key, value] of Object.entries(patch)) {
        const param = PARAM_NAMES[key as keyof DiscoveryState] ?? key
        next.delete(param)
        if (Array.isArray(value)) {
          for (const item of value) next.append(param, item)
        } else if (typeof value === 'boolean') {
          if (value) next.set(param, '1')
        } else if (value !== '' && value !== undefined && value !== null) {
          next.set(param, String(value))
        }
      }

      if (!('page' in patch)) next.delete('page')
      setParams(next, { replace: true })
    },
    [params, setParams],
  )

  const toggle = useCallback(
    (facet: keyof DiscoveryState, value: string, single = false) => {
      const current = (state[facet] as string[] | undefined) ?? EMPTY
      const next = current.includes(value)
        ? current.filter((item) => item !== value)
        : single
          ? [value]
          : [...current, value]
      update({ [facet]: next } as Partial<DiscoveryState>)
    },
    [state, update],
  )

  const clear = useCallback(() => setParams(new URLSearchParams(), { replace: true }), [setParams])

  const activeCount =
    state.modality.length +
    state.license.length +
    state.electrode_system.length +
    state.bids_version.length +
    state.hed_version.length +
    state.source.length +
    state.powerline.length +
    state.validation.length +
    (state.has_hed ? 1 : 0) +
    (state.has_doi ? 1 : 0) +
    (state.subjects ? 1 : 0) +
    (state.channels ? 1 : 0)

  return { state, update, toggle, clear, activeCount }
}

const PARAM_NAMES: Partial<Record<keyof DiscoveryState, string>> = {
  search: 'q',
  modality_match_all: 'all',
}

/**
 * Translate the UI state into API query parameters.
 *
 * `validation` is a UI-only facet: the API exposes it as the boolean
 * `is_valid`, so selecting both buckets means "no filter".
 */
export function toApiQuery(state: DiscoveryState): Record<string, QueryValue> {
  const validation =
    state.validation.length === 1
      ? state.validation[0] === 'valid'
        ? true
        : state.validation[0] === 'invalid'
          ? false
          : undefined
      : undefined

  return {
    search: state.search || undefined,
    sort: state.sort,
    limit: PAGE_SIZE,
    offset: (state.page - 1) * PAGE_SIZE,
    modality: state.modality.length ? state.modality : undefined,
    modality_match_all: state.modality_match_all || undefined,
    license: state.license.length ? state.license : undefined,
    electrode_system: state.electrode_system[0],
    bids_version: state.bids_version[0],
    hed_version: state.hed_version[0],
    source: state.source[0],
    powerline: state.powerline[0],
    is_valid: validation,
    has_hed: state.has_hed || undefined,
    has_doi: state.has_doi || undefined,
    subjects: state.subjects || undefined,
    channels: state.channels || undefined,
  }
}

/**
 * The subset of filters `GET /datasets/stats` accepts.
 *
 * Narrower than the listing on purpose: paging and sort mean nothing to an
 * aggregate, and sending them would only invite the two to drift apart.
 */
export function toStatsQuery(state: DiscoveryState): Record<string, QueryValue> {
  const { limit: _limit, offset: _offset, sort: _sort, ...rest } = toApiQuery(state)
  return rest
}
