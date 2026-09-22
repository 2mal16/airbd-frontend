import { AlertTriangle, CheckCircle2, CircleDashed, Users } from 'lucide-react'
import { Link } from 'react-router'

import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import {
  DATATYPE_LABELS,
  LICENSE_LABELS,
  formatAgeRange,
  formatBytes,
  formatChannels,
  formatCount,
  formatDate,
} from '@/lib/format'
import type { DatasetSummary } from '@/lib/types'
import { cn } from '@/lib/utils'

function ValidationBadge({ dataset }: { dataset: DatasetSummary }) {
  if (!dataset.validation) {
    return (
      <Badge variant="outline" className="gap-1.5 text-muted-foreground">
        <CircleDashed className="size-3.5" />
        Not validated
      </Badge>
    )
  }

  const { is_valid, error_count, warning_count } = dataset.validation

  if (is_valid) {
    return (
      <Badge
        variant="outline"
        className="gap-1.5 border-wyss-green-dark/30 bg-wyss-green-lighter text-wyss-green-darker dark:bg-transparent dark:text-wyss-green"
      >
        <CheckCircle2 className="size-3.5" />
        BIDS valid
        {warning_count > 0 && <span className="opacity-70">· {warning_count} warnings</span>}
      </Badge>
    )
  }

  return (
    <Badge variant="outline" className="gap-1.5 border-destructive/40 text-destructive">
      <AlertTriangle className="size-3.5" />
      {formatCount(error_count)} {error_count === 1 ? 'error' : 'errors'}
    </Badge>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="eyebrow">{label}</dt>
      <dd className="mt-0.5 truncate text-sm tabular-nums">{value}</dd>
    </div>
  )
}

export function DatasetCard({ dataset }: { dataset: DatasetSummary }) {
  const channels = formatChannels(
    dataset.n_channels,
    dataset.channel_count_min,
    dataset.channel_count_max,
  )
  const ages = formatAgeRange(dataset.age_min, dataset.age_max)

  return (
    <Card className="group gap-0 overflow-hidden p-0 transition-colors hover:border-wyss-green-dark/40">
      <div className="flex flex-col gap-4 p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs text-muted-foreground">{dataset.dataset_id}</span>
          {dataset.modalities.map((modality) => (
            <Badge key={modality} variant="secondary" className="font-normal">
              {DATATYPE_LABELS[modality] ?? modality}
            </Badge>
          ))}
          <div className="ml-auto flex items-center gap-2">
            {dataset.has_hed && (
              <Badge variant="outline" className="font-normal">
                HED
              </Badge>
            )}
            <ValidationBadge dataset={dataset} />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl leading-snug">
            <Link
              to={`/datasets/${encodeURIComponent(dataset.dataset_id)}`}
              className={cn(
                'focus-ring rounded-sm decoration-wyss-green-dark decoration-2 underline-offset-4',
                'group-hover:underline',
              )}
            >
              {dataset.name}
            </Link>
          </h2>
          {dataset.description && (
            <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
              {dataset.description}
            </p>
          )}
        </div>

        {dataset.authors.length > 0 && (
          <p className="truncate text-sm text-muted-foreground">
            {dataset.authors.slice(0, 4).join(', ')}
            {dataset.authors.length > 4 && ` +${dataset.authors.length - 4} more`}
          </p>
        )}

        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4 lg:grid-cols-6">
          <Stat label="Participants" value={formatCount(dataset.participants)} />
          <Stat label="Sessions" value={formatCount(dataset.sessions_count)} />
          {channels && <Stat label="Channels" value={channels} />}
          {dataset.sampling_frequency && (
            <Stat label="Sampling" value={`${formatCount(dataset.sampling_frequency)} Hz`} />
          )}
          <Stat label="Size" value={formatBytes(dataset.file_size)} />
          {ages && <Stat label="Age" value={ages} />}
        </dl>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t bg-muted/40 px-5 py-3 text-xs text-muted-foreground sm:px-6">
        {dataset.latest_version && <span>{dataset.latest_version}</span>}
        <span>Updated {formatDate(dataset.updated_at)}</span>
        {dataset.bids_version && <span>BIDS {dataset.bids_version}</span>}
        <span>{LICENSE_LABELS[dataset.license_tier] ?? dataset.license_tier}</span>
        {dataset.tasks.length > 0 && (
          <span className="truncate">
            <Users className="mr-1 inline size-3" />
            {dataset.tasks.slice(0, 3).join(', ')}
          </span>
        )}
      </div>
    </Card>
  )
}
