import { useQueryClient } from '@tanstack/react-query'
import { CloudOff, RefreshCw } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { SNAPSHOT_TAKEN_AT } from '@/lib/catalog'
import { formatDate } from '@/lib/format'
import { useOfflineStatus } from '@/lib/offline-status'

/**
 * Shown whenever the app has fallen back to the bundled snapshot.
 *
 * Deliberately loud and always present, not a toast: everything below it is
 * stale, and that must not be something a reader can miss or dismiss.
 */
export function OfflineBanner() {
  const status = useOfflineStatus()
  const queryClient = useQueryClient()

  if (!status.offline) return null

  return (
    <div
      role="status"
      className="border-b border-amber-500/40 bg-amber-50 text-amber-950 dark:bg-amber-950/40 dark:text-amber-100"
    >
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:gap-4 sm:px-6">
        <CloudOff className="size-4 shrink-0" />
        <div className="min-w-0 flex-1 text-sm">
          <p className="font-medium">
            Showing a saved snapshot — this is not live data.
          </p>
          <p className="mt-0.5 opacity-80">
            {status.title}. Captured {formatDate(SNAPSHOT_TAKEN_AT)}; anything added or revalidated
            since is missing, and filters run over the snapshot only.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="shrink-0 border-amber-500/40 bg-transparent hover:bg-amber-500/10"
          onClick={() => queryClient.invalidateQueries()}
        >
          <RefreshCw className="size-3.5" />
          Retry
        </Button>
      </div>
    </div>
  )
}
