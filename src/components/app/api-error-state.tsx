import { AlertCircle, CloudOff, PlugZap, RefreshCw, SearchX, ServerCrash } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { ApiError, API_BASE_URL } from '@/lib/api'

const ICONS = {
  offline: CloudOff,
  misconfigured: PlugZap,
  'not-found': SearchX,
  'invalid-request': AlertCircle,
  server: ServerCrash,
  unknown: AlertCircle,
} as const

/**
 * Renders an error the way a person can act on it: what failed, why, and the
 * exact response underneath rather than only a parser's complaint about it.
 */
export function ApiErrorState({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  const apiError =
    error instanceof ApiError
      ? error
      : new ApiError(0, error instanceof Error ? error.message : String(error))

  const Icon = ICONS[apiError.kind]

  return (
    <Alert variant={apiError.kind === 'offline' ? 'default' : 'destructive'}>
      <Icon />
      <AlertTitle>{apiError.title}</AlertTitle>
      <AlertDescription>
        <p>{apiError.hint}</p>
        <div className="mt-2 w-full space-y-1 text-xs">
          <p className="font-mono break-all opacity-80">
            {apiError.status > 0 && `HTTP ${apiError.status} · `}
            {apiError.detail}
          </p>
          <p className="font-mono break-all opacity-60">API: {API_BASE_URL}</p>
        </div>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry} className="mt-3">
            <RefreshCw className="size-3.5" />
            Try again
          </Button>
        )}
      </AlertDescription>
    </Alert>
  )
}
