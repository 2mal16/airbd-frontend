import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { DATATYPE_LABELS, formatCount, formatDuration } from '@/lib/format'
import type { SessionSummary } from '@/lib/types'

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="eyebrow">{label}</dt>
      <dd className="mt-0.5 truncate text-sm tabular-nums">{value}</dd>
    </div>
  )
}

function formatMetadataValue(value: unknown): string {
  if (value === null || value === undefined) return '—'
  if (typeof value === 'number' || typeof value === 'string' || typeof value === 'boolean') {
    return String(value)
  }
  return JSON.stringify(value)
}

/**
 * One card per session, with the datatypes it covers and its sidecar metadata.
 *
 * `bids-validator` reports only the set of session labels, so a dataset whose
 * ingest predates this detail shows nothing here rather than a fabricated row.
 */
export function SessionList({ sessions }: { sessions: SessionSummary[] }) {
  if (sessions.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        This dataset records no per-session detail. Either it is organised without a session level,
        which BIDS allows, or it was ingested before sessions were captured.
      </p>
    )
  }

  return (
    <ul className="space-y-4">
      {sessions.map((session) => (
        <li key={session.session_id}>
          <Card className="gap-0 p-0">
            <CardContent className="space-y-4 px-5 py-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-sm">ses-{session.session_id}</span>
                {session.datatypes.map((datatype) => (
                  <Badge key={datatype} variant="secondary" className="font-normal">
                    {DATATYPE_LABELS[datatype] ?? datatype}
                  </Badge>
                ))}
                {session.tasks.map((task) => (
                  <Badge key={task} variant="outline" className="font-normal">
                    {task}
                  </Badge>
                ))}
              </div>

              {session.description && (
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {session.description}
                </p>
              )}

              <dl className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4">
                {session.subject_count !== null && (
                  <Detail label="Subjects" value={formatCount(session.subject_count)} />
                )}
                {session.file_count !== null && (
                  <Detail label="Files" value={formatCount(session.file_count)} />
                )}
                {session.size_formatted && <Detail label="Size" value={session.size_formatted} />}
                {session.n_channels !== null && (
                  <Detail label="Channels" value={formatCount(session.n_channels)} />
                )}
                {session.sampling_frequency !== null && (
                  <Detail
                    label="Sampling"
                    value={`${formatCount(session.sampling_frequency)} Hz`}
                  />
                )}
                {session.recording_count !== null && (
                  <Detail label="Recordings" value={formatCount(session.recording_count)} />
                )}
                {session.total_recording_duration !== null && (
                  <Detail
                    label="Duration"
                    value={formatDuration(session.total_recording_duration)}
                  />
                )}
              </dl>

              {Object.keys(session.metadata).length > 0 && (
                <div>
                  <h4 className="eyebrow mb-2">Sidecar metadata</h4>
                  <dl className="grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
                    {Object.entries(session.metadata).map(([key, value]) => (
                      <div key={key} className="flex items-baseline justify-between gap-3 text-sm">
                        <dt className="truncate font-mono text-xs text-muted-foreground">{key}</dt>
                        <dd className="shrink-0 text-right">{formatMetadataValue(value)}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  )
}
