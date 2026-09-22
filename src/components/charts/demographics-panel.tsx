import { Histogram } from '@/components/charts/histogram'
import { StackedBar, type StackSegment } from '@/components/charts/stacked-bar'
import { ChartCard } from '@/components/charts/chart-card'
import { NEUTRAL, SERIES } from '@/components/charts/primitives'
import { formatCount } from '@/lib/format'
import type { Demographics, Sex } from '@/lib/types'

const SEX_LABELS: Record<Sex, string> = {
  male: 'Male',
  female: 'Female',
  other: 'Other',
  unknown: 'Not reported',
}

/**
 * Colour by entity, in fixed order — so filtering a view never repaints the
 * survivors. `unknown` is the absence of data rather than a category, so it
 * takes the neutral, never a series hue.
 */
const SEX_COLORS: Record<Sex, string> = {
  male: SERIES[0],
  female: SERIES[1],
  other: SERIES[2],
  unknown: NEUTRAL,
}

const SEX_ORDER: Sex[] = ['female', 'male', 'other', 'unknown']

function coverage(described: number, total: number): string {
  if (total === 0) return 'No participants in this selection.'
  if (described === total) return `All ${formatCount(total)} participants are described.`
  if (described === 0) return `None of the ${formatCount(total)} participants report this.`
  const percent = Math.round((described / total) * 100)
  return `${formatCount(described)} of ${formatCount(total)} participants (${percent}%) report this; the rest are counted as not reported.`
}

export function SexChart({ demographics }: { demographics: Demographics }) {
  const counts = new Map(demographics.sex_counts.map((c) => [c.sex, c.count]))
  const missing = demographics.participants - demographics.with_sex

  const segments: StackSegment[] = SEX_ORDER.map((sex) => ({
    key: sex,
    label: SEX_LABELS[sex],
    value: sex === 'unknown' ? Math.max(counts.get('unknown') ?? 0, missing) : (counts.get(sex) ?? 0),
    color: SEX_COLORS[sex],
  })).filter((segment) => segment.value > 0)

  const total = segments.reduce((sum, segment) => sum + segment.value, 0)

  return (
    <ChartCard
      title="Sex"
      description="Phenotypical sex as reported in participants.tsv, normalised through the BIDS schema."
      footnote={coverage(demographics.with_sex, demographics.participants)}
      empty={total === 0}
      emptyMessage="No participant metadata in this selection."
      table={{
        columns: [
          { key: 'sex', label: 'Sex' },
          { key: 'count', label: 'Participants', numeric: true },
          { key: 'share', label: 'Share', numeric: true },
        ],
        rows: segments.map((segment) => ({
          sex: segment.label,
          count: formatCount(segment.value),
          share: `${Math.round((segment.value / total) * 100)}%`,
        })),
      }}
    >
      <StackedBar segments={segments} unit="participants" total={total} />
    </ChartCard>
  )
}

export function AgeChart({ demographics }: { demographics: Demographics }) {
  const bins = demographics.age_bins.map((bin) => ({
    key: `${bin.start}`,
    label: `${bin.start}`,
    title: `${bin.start} to ${bin.end} years`,
    value: bin.count,
  }))

  const stats =
    demographics.age_min === null
      ? null
      : `Range ${demographics.age_min}–${demographics.age_max} years · median ${demographics.age_median} · mean ${demographics.age_mean}.`

  return (
    <ChartCard
      title="Age"
      description="Participants per five-year band. Bands are aligned to fixed boundaries so datasets can be compared."
      footnote={[stats, coverage(demographics.with_age, demographics.participants)]
        .filter(Boolean)
        .join(' ')}
      empty={bins.length === 0}
      emptyMessage="No participant ages reported in this selection."
      table={{
        columns: [
          { key: 'band', label: 'Age band' },
          { key: 'count', label: 'Participants', numeric: true },
        ],
        rows: demographics.age_bins.map((bin) => ({
          band: `${bin.start}–${bin.end}`,
          count: formatCount(bin.count),
        })),
      }}
    >
      <Histogram bins={bins} unit="participants" />
    </ChartCard>
  )
}
