/**
 * Whether the app is currently serving the offline snapshot.
 *
 * A module-level store rather than context: the data layer writes to it from
 * inside query functions, which are not React components, and every view needs
 * to read it. `useSyncExternalStore` keeps React in step without a provider
 * wrapping the tree.
 */

import { useSyncExternalStore } from 'react'

import type { ApiError } from '@/lib/api'

export interface OfflineStatus {
  /** True while the snapshot is being shown in place of live data. */
  offline: boolean
  /** Why the API could not be used. */
  reason: string | null
  title: string | null
  hint: string | null
  since: number | null
}

const ONLINE: OfflineStatus = { offline: false, reason: null, title: null, hint: null, since: null }

let status: OfflineStatus = ONLINE
const listeners = new Set<() => void>()

function emit() {
  for (const listener of listeners) listener()
}

export function markOffline(error: ApiError): void {
  if (status.offline) return
  status = {
    offline: true,
    reason: error.detail,
    title: error.title,
    hint: error.hint,
    since: Date.now(),
  }
  emit()
}

export function markOnline(): void {
  if (!status.offline) return
  status = ONLINE
  emit()
}

export function useOfflineStatus(): OfflineStatus {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    () => status,
    () => ONLINE,
  )
}
