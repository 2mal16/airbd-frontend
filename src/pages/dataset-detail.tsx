import { useQuery } from '@tanstack/react-query'
import { AlertCircle, AlertTriangle, ArrowLeft, CheckCircle2, ExternalLink } from 'lucide-react'
import { Link, useParams } from 'react-router'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { api } from '@/lib/api'
import {
  DATATYPE_LABELS,
  LICENSE_LABELS,
  formatAgeRange,
  formatBytes,
  formatChannels,
  formatCount,
  formatDate,
  formatDuration,
} from '@/lib/format'
import type { DatasetDetail, Issue } from '@/lib/types'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <dt className="eyebrow">{label}</dt>
      <dd className="text-sm break-words">{children}</dd>
    </div>
  )
}

function doiUrl(doi: string): string {
  const bare = doi.replace(/^doi:/i, '')
  return bare.startsWith('http') ? bare : `https://doi.org/${bare}`
}

function IssueRow({ issue }: { issue: Issue }) {
  const isError = issue.severity === 'error'
  return (
    <li className="flex gap-3 border-b py-3 last:border-0">
      {isError ? (
        <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
      ) : (
        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
      )}
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-sm">{issue.code}</span>
          {issue.subCode && (
            <Badge variant="secondary" className="font-mono text-[0.7rem] font-normal">
              {issue.subCode}
            </Badge>
          )}
        </div>
        {issue.issueMessage && (
          <p className="text-sm leading-relaxed text-muted-foreground">{issue.issueMessage}</p>
        )}
        {issue.location && (
          <p className="font-mono text-xs break-all text-muted-foreground">{issue.location}</p>
        )}
        {issue.rule && <p className="font-mono text-[0.7rem] text-muted-foreground/70">{issue.rule}</p>}
      </div>
    </li>
  )
}

function ValidationPanel({ datasetId }: { datasetId: string }) {
  const report = useQuery({
    queryKey: ['validation', datasetId],
    queryFn: () => api.validationReport(datasetId),
    retry: false,
  })

  if (report.isLoading) return <Skeleton className="h-40 w-full rounded-xl" />

  if (report.isError) {
    return (
      <p className="py-8 text-sm text-muted-foreground">
        No validation report is stored for this dataset.
      </p>
    )
  }

  const { summary, issues } = report.data!
  const errors = issues.filter((issue) => issue.severity === 'error')
  const warnings = issues.filter((issue) => issue.severity === 'warning')

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        {summary.is_valid ? (
          <Badge className="gap-1.5">
            <CheckCircle2 className="size-3.5" />
            BIDS valid
          </Badge>
        ) : (
          <Badge variant="destructive" className="gap-1.5">
            <AlertCircle className="size-3.5" />
            {formatCount(summary.error_count)} errors
          </Badge>
        )}
        <span className="text-sm text-muted-foreground">
          {formatCount(summary.warning_count)} warnings
        </span>
        {summary.schema_version && (
          <span className="text-sm text-muted-foreground">
            Schema {summary.schema_version}
          </span>
        )}
      </div>

      {issues.length === 0 ? (
        <p className="text-sm text-muted-foreground">The validator reported nothing at all.</p>
      ) : (
        <div className="space-y-6">
          {errors.length > 0 && (
            <section>
              <h3 className="eyebrow mb-2">Errors</h3>
              <ul>
                {errors.map((issue, index) => (
                  <IssueRow key={`${issue.code}-${index}`} issue={issue} />
                ))}
              </ul>
            </section>
          )}
          {warnings.length > 0 && (
            <section>
              <h3 className="eyebrow mb-2">Warnings</h3>
              <ul>
                {warnings.map((issue, index) => (
                  <IssueRow key={`${issue.code}-${index}`} issue={issue} />
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </div>
  )
}

function Overview({ dataset }: { dataset: DatasetDetail }) {
  const channels = formatChannels(
    dataset.n_channels,
    dataset.channel_count_min,
    dataset.channel_count_max,
  )
  const ages = formatAgeRange(dataset.age_min, dataset.age_max)

  return (
    <div className="grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
      <Field label="Participants">{formatCount(dataset.participants)}</Field>
      <Field label="Sessions">{formatCount(dataset.sessions_count)}</Field>
      <Field label="Files">{formatCount(dataset.total_files)}</Field>
      <Field label="Size">{formatBytes(dataset.file_size)}</Field>
      <Field label="BIDS version">{dataset.bids_version ?? '—'}</Field>
      <Field label="Licence">
        {dataset.license ?? LICENSE_LABELS[dataset.license_tier] ?? 'Unknown'}
      </Field>
      {ages && <Field label="Age range">{ages}</Field>}
      {channels && <Field label="Channels">{channels}</Field>}
      {dataset.sampling_frequency && (
        <Field label="Sampling frequency">{formatCount(dataset.sampling_frequency)} Hz</Field>
      )}
      {dataset.power_line_frequency && (
        <Field label="Power line">{formatCount(dataset.power_line_frequency)} Hz</Field>
      )}
      {dataset.eeg_reference && <Field label="EEG reference">{dataset.eeg_reference}</Field>}
      {dataset.placement_scheme && <Field label="Placement scheme">{dataset.placement_scheme}</Field>}
      {dataset.electrode_system && <Field label="Electrode system">{dataset.electrode_system}</Field>}
      {dataset.recording_count !== null && (
        <Field label="Recordings">{formatCount(dataset.recording_count)}</Field>
      )}
      {dataset.total_recording_duration !== null && (
        <Field label="Total duration">{formatDuration(dataset.total_recording_duration)}</Field>
      )}
      {dataset.hed_version && <Field label="HED version">{dataset.hed_version}</Field>}
      <Field label="Created">{formatDate(dataset.created_at)}</Field>
      <Field label="Updated">{formatDate(dataset.updated_at)}</Field>
      {dataset.tasks.length > 0 && (
        <Field label="Tasks">
          <div className="flex flex-wrap gap-1.5">
            {dataset.tasks.map((task) => (
              <Badge key={task} variant="secondary" className="font-normal">
                {task}
              </Badge>
            ))}
          </div>
        </Field>
      )}
      {dataset.keywords.length > 0 && (
        <Field label="Keywords">
          <div className="flex flex-wrap gap-1.5">
            {dataset.keywords.map((keyword) => (
              <Badge key={keyword} variant="outline" className="font-normal">
                {keyword}
              </Badge>
            ))}
          </div>
        </Field>
      )}
      {dataset.funding.length > 0 && (
        <Field label="Funding">{dataset.funding.join('; ')}</Field>
      )}
      {dataset.ethics_approvals.length > 0 && (
        <Field label="Ethics approvals">{dataset.ethics_approvals.join('; ')}</Field>
      )}
      {dataset.how_to_acknowledge && (
        <Field label="How to acknowledge">{dataset.how_to_acknowledge}</Field>
      )}
    </div>
  )
}

export function DatasetDetailPage() {
  const { datasetId = '' } = useParams()

  const dataset = useQuery({
    queryKey: ['dataset', datasetId],
    queryFn: () => api.dataset(datasetId),
    retry: false,
  })

  if (dataset.isLoading) {
    return (
      <div className="mx-auto w-full max-w-[1100px] space-y-6 px-4 py-12 sm:px-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-12 w-full max-w-2xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    )
  }

  if (dataset.isError || !dataset.data) {
    return (
      <div className="mx-auto w-full max-w-[1100px] px-4 py-12 sm:px-6">
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>Dataset not found</AlertTitle>
          <AlertDescription>
            {(dataset.error as Error | null)?.message ?? `No dataset with id ${datasetId}.`}
          </AlertDescription>
        </Alert>
        <Button asChild variant="link" className="mt-4 px-0">
          <Link to="/">
            <ArrowLeft className="size-4" />
            Back to discovery
          </Link>
        </Button>
      </div>
    )
  }

  const data = dataset.data

  return (
    <div className="mx-auto w-full max-w-[1100px] px-4 py-10 sm:px-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2 mb-6">
        <Link to="/">
          <ArrowLeft className="size-4" />
          All datasets
        </Link>
      </Button>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-sm text-muted-foreground">{data.dataset_id}</span>
          {data.latest_version && (
            <Badge variant="outline" className="font-normal">
              {data.latest_version}
            </Badge>
          )}
          {data.modalities.map((modality) => (
            <Badge key={modality} variant="secondary" className="font-normal">
              {DATATYPE_LABELS[modality] ?? modality}
            </Badge>
          ))}
          {data.has_hed && (
            <Badge variant="outline" className="font-normal">
              HED
            </Badge>
          )}
        </div>

        <h1 className="max-w-3xl text-3xl leading-tight sm:text-4xl">{data.name}</h1>

        {data.description && (
          <p className="max-w-3xl text-base leading-relaxed text-muted-foreground">
            {data.description}
          </p>
        )}

        {data.authors.length > 0 && (
          <p className="max-w-3xl text-sm text-muted-foreground">{data.authors.join(', ')}</p>
        )}

        <div className="flex flex-wrap gap-3 pt-2">
          {data.doi && (
            <Button asChild variant="outline" size="sm">
              <a href={doiUrl(data.doi)} target="_blank" rel="noreferrer">
                DOI
                <ExternalLink className="size-3.5" />
              </a>
            </Button>
          )}
          {data.references_and_links.map((link) =>
            link.startsWith('http') ? (
              <Button asChild key={link} variant="outline" size="sm">
                <a href={link} target="_blank" rel="noreferrer">
                  Reference
                  <ExternalLink className="size-3.5" />
                </a>
              </Button>
            ) : null,
          )}
        </div>
      </div>

      <Separator className="my-8" />

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="validation">
            Validation
            {data.validation && !data.validation.is_valid && (
              <Badge variant="destructive" className="ml-1.5 h-5 px-1.5 text-[0.7rem]">
                {data.validation.error_count}
              </Badge>
            )}
          </TabsTrigger>
          {data.readme && <TabsTrigger value="readme">README</TabsTrigger>}
          <TabsTrigger value="participants">Participants</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="pt-6">
          <Overview dataset={data} />
        </TabsContent>

        <TabsContent value="validation" className="pt-6">
          <ValidationPanel datasetId={data.dataset_id} />
        </TabsContent>

        {data.readme && (
          <TabsContent value="readme" className="pt-6">
            <Card>
              <CardContent>
                <pre className="font-sans text-sm leading-relaxed whitespace-pre-wrap">
                  {data.readme}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        <TabsContent value="participants" className="pt-6">
          <div className="space-y-6">
            <Field label={`Subjects (${formatCount(data.subjects.length)})`}>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {data.subjects.map((subject) => (
                  <Badge key={subject} variant="outline" className="font-mono font-normal">
                    {subject}
                  </Badge>
                ))}
              </div>
            </Field>
            {data.sessions.length > 0 && (
              <Field label={`Sessions (${formatCount(data.sessions.length)})`}>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {data.sessions.map((session) => (
                    <Badge key={session} variant="outline" className="font-mono font-normal">
                      {session}
                    </Badge>
                  ))}
                </div>
              </Field>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
