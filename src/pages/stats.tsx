import { useQuery } from '@tanstack/react-query'

import { ApiErrorState } from '@/components/app/api-error-state'
import { BarList } from '@/components/charts/bar-list'
import { ChartCard } from '@/components/charts/chart-card'
import { AgeChart, SexChart } from '@/components/charts/demographics-panel'
import { Histogram } from '@/components/charts/histogram'
import { StackedBar, type StackSegment } from '@/components/charts/stacked-bar'
import { StatTile } from '@/components/charts/stat-tile'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { useDiscoveryState } from '@/hooks/use-dataset-query'
import { getStats } from '@/lib/catalog'
import {
  DATATYPE_LABELS,
  LICENSE_LABELS,
  formatBytes,
  formatCount,
} from '@/lib/format'
import type { CatalogueStats, FacetValue } from '@/lib/types'

function toBars(values: FacetValue[], labels?: Record<string, string>) {
  return values.map((facet) => ({
    key: facet.value,
    label: labels?.[facet.value] ?? facet.value,
    value: facet.count,
  }))
}

function simpleTable(values: FacetValue[], header: string, labels?: Record<string, string>) {
  return {
    columns: [
      { key: 'label', label: header },
      { key: 'count', label: 'Count', numeric: true },
    ],
    rows: values.map((facet) => ({
      label: labels?.[facet.value] ?? facet.value,
      count: formatCount(facet.count),
    })),
  }
}

/** Valid / invalid is a state, so it wears the status tokens, never a series hue. */
function validationSegments(values: FacetValue[]): StackSegment[] {
  const labels: Record<string, string> = {
    valid: 'BIDS valid',
    invalid: 'Has errors',
    unvalidated: 'Not validated',
  }
  const colors: Record<string, string> = {
    valid: 'var(--chart-good)',
    invalid: 'var(--chart-critical)',
    unvalidated: 'var(--chart-neutral)',
  }
  return values.map((facet) => ({
    key: facet.value,
    label: labels[facet.value] ?? facet.value,
    value: facet.count,
    color: colors[facet.value] ?? 'var(--chart-neutral)',
  }))
}

function Dashboard({ stats }: { stats: CatalogueStats }) {
  // The API returns only the session counts that occur. A distribution has to
  // show the empty values too, or a missing bar reads as a missing category.
  const sessionMax = Math.max(0, ...stats.session_counts.map((f) => Number(f.value)))
  const sessionByValue = new Map(stats.session_counts.map((f) => [Number(f.value), f.count]))
  const sessionBins = Array.from({ length: sessionMax + 1 }, (_, sessions) => ({
    key: String(sessions),
    label: String(sessions),
    title: `${sessions} ${sessions === 1 ? 'session' : 'sessions'}`,
    value: sessionByValue.get(sessions) ?? 0,
  }))

  const longitudinal = stats.session_counts
    .filter((facet) => Number(facet.value) > 1)
    .reduce((sum, facet) => sum + facet.count, 0)

  return (
    <div className="space-y-8">
      <section className="grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4">
        <StatTile label="Participants" value={formatCount(stats.participant_count)} hero />
        <StatTile label="Datasets" value={formatCount(stats.dataset_count)} />
        <StatTile
          label="Sessions"
          value={formatCount(stats.session_count)}
          hint={longitudinal > 0 ? `${longitudinal} datasets are longitudinal` : undefined}
        />
        <StatTile
          label="Total size"
          value={formatBytes(stats.total_size)}
          hint={`${formatCount(stats.file_count)} files`}
        />
      </section>

      <Separator />

      <section className="space-y-4">
        <h2 className="text-lg">Who is in the data</h2>
        <div className="grid items-start gap-4 lg:grid-cols-2">
          <SexChart demographics={stats.demographics} />
          <AgeChart demographics={stats.demographics} />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg">What was recorded</h2>
        <div className="grid items-start gap-4 lg:grid-cols-2">
          <ChartCard
            title="Modalities"
            description="Datasets containing each BIDS datatype. A dataset with several datatypes counts once under each."
            table={simpleTable(stats.modality, 'Modality', DATATYPE_LABELS)}
            empty={stats.modality.length === 0}
          >
            <BarList data={toBars(stats.modality, DATATYPE_LABELS)} unit="datasets" />
          </ChartCard>

          <ChartCard
            title="Session coverage"
            description="Sessions containing each BIDS datatype — counted per session, not per dataset."
            table={simpleTable(stats.session_datatypes, 'Datatype', DATATYPE_LABELS)}
            empty={stats.session_datatypes.length === 0}
            emptyMessage="No datasets in this selection record per-session detail."
          >
            <BarList data={toBars(stats.session_datatypes, DATATYPE_LABELS)} unit="sessions" />
          </ChartCard>

          <ChartCard
            title="Sessions per dataset"
            description="How many datasets have each number of sessions."
            footnote="Zero sessions means the dataset is organised without a session level, which BIDS allows."
            table={simpleTable(stats.session_counts, 'Sessions')}
            empty={sessionBins.length === 0}
          >
            <Histogram bins={sessionBins} unit="datasets" height={150} />
          </ChartCard>

          <ChartCard
            title="Electrode systems"
            description="Montage family, derived from each dataset's EEGPlacementScheme."
            table={simpleTable(stats.electrode_system, 'System')}
            empty={stats.electrode_system.length === 0}
          >
            <BarList data={toBars(stats.electrode_system)} unit="datasets" />
          </ChartCard>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg">Standards and quality</h2>
        <div className="grid items-start gap-4 lg:grid-cols-2">
          <ChartCard
            title="Validation status"
            description="Whether bids-validator reported errors."
            table={simpleTable(stats.validation, 'Status')}
            empty={stats.validation.length === 0}
          >
            <StackedBar segments={validationSegments(stats.validation)} unit="datasets" />
          </ChartCard>

          <ChartCard
            title="BIDS version"
            description="Which version of the specification each dataset declares."
            table={simpleTable(stats.bids_version, 'Version')}
            empty={stats.bids_version.length === 0}
          >
            <BarList data={toBars(stats.bids_version)} unit="datasets" />
          </ChartCard>

          <ChartCard
            title="Most common errors"
            description="Validator error codes across the selection, counted per occurrence."
            table={simpleTable(stats.top_error_codes, 'Code')}
            empty={stats.top_error_codes.length === 0}
            emptyMessage="No errors in this selection."
          >
            <BarList
              data={toBars(stats.top_error_codes)}
              unit="occurrences"
              color="var(--chart-critical)"
              labelWidth="minmax(8rem,14rem)"
            />
          </ChartCard>

          <ChartCard
            title="Licences"
            description="Reuse terms, bucketed by the obligations they impose."
            table={simpleTable(stats.license, 'Licence', LICENSE_LABELS)}
            empty={stats.license.length === 0}
          >
            <BarList data={toBars(stats.license, LICENSE_LABELS)} unit="datasets" />
          </ChartCard>
        </div>
      </section>
    </div>
  )
}

export function StatsPage() {
  const { state } = useDiscoveryState()

  const stats = useQuery({
    queryKey: ['stats', state],
    queryFn: () => getStats(state),
  })

  return (
    <div className="mx-auto w-full max-w-[1100px] px-4 py-10 sm:px-6">
      <p className="eyebrow">Statistics</p>
      <h1 className="mt-3 text-3xl sm:text-4xl">The catalogue at a glance</h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
        Everything below is counted from bids-validator output. Demographics come from
        per-participant records, so the sex split and age histogram are exact counts rather than
        sums of per-dataset summaries — and each chart states how many participants actually
        reported the field.
      </p>

      <div className="mt-10">
        {stats.isLoading && (
          <div className="space-y-6">
            <Skeleton className="h-24 w-full rounded-xl" />
            <div className="grid items-start gap-4 lg:grid-cols-2">
              {[0, 1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-64 w-full rounded-xl" />
              ))}
            </div>
          </div>
        )}
        {stats.isError && <ApiErrorState error={stats.error} onRetry={() => stats.refetch()} />}
        {stats.data && <Dashboard stats={stats.data} />}
      </div>
    </div>
  )
}
