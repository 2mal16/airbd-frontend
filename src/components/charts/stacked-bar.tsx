import { useRef } from 'react'

import { ChartTooltip, useChartTooltip } from '@/components/charts/chart-tooltip'
import { BAR_RADIUS, SURFACE_GAP } from '@/components/charts/primitives'
import { formatCount } from '@/lib/format'

export interface StackSegment {
  key: string
  label: string
  value: number
  color: string
}

interface StackedBarProps {
  segments: StackSegment[]
  unit: string
  /** Total to take proportions against; defaults to the sum of the segments. */
  total?: number
  height?: number
}

/** Below this share, an inline label will not fit and moves to the tooltip. */
const INLINE_LABEL_MIN_SHARE = 0.14

/**
 * One part-to-whole bar with a legend.
 *
 * Segments are separated by a gap in the surface colour rather than a stroke:
 * a border would add ink that is not data. Labels only sit inside a segment
 * when they demonstrably fit; otherwise the legend and tooltip carry them, and
 * the table view keeps every value reachable regardless.
 */
export function StackedBar({ segments, unit, total, height = 28 }: StackedBarProps) {
  const container = useRef<HTMLDivElement>(null)
  const { tooltip, show, hide } = useChartTooltip()

  const sum = total ?? segments.reduce((acc, segment) => acc + segment.value, 0)
  const visible = segments.filter((segment) => segment.value > 0)

  if (sum <= 0 || visible.length === 0) return null

  return (
    <div ref={container} className="relative">
      <ChartTooltip state={tooltip} />

      <div className="flex w-full" style={{ height, gap: SURFACE_GAP }}>
        {visible.map((segment, index) => {
          const share = segment.value / sum
          const isFirst = index === 0
          const isLast = index === visible.length - 1
          return (
            <div
              key={segment.key}
              tabIndex={0}
              className="focus-ring relative flex min-w-0 items-center justify-center transition-opacity hover:opacity-85 focus:opacity-85"
              style={{
                flexGrow: share,
                flexBasis: 0,
                background: segment.color,
                borderRadius: [
                  isFirst ? BAR_RADIUS : 0,
                  isLast ? BAR_RADIUS : 0,
                  isLast ? BAR_RADIUS : 0,
                  isFirst ? BAR_RADIUS : 0,
                ]
                  .map((r) => `${r}px`)
                  .join(' '),
              }}
              onPointerMove={(event) => {
                const bounds = container.current?.getBoundingClientRect()
                if (!bounds) return
                show({
                  x: event.clientX - bounds.left,
                  y: event.clientY - bounds.top,
                  title: segment.label,
                  rows: [
                    { label: unit, value: formatCount(segment.value) },
                    { label: 'of total', value: `${Math.round(share * 100)}%` },
                  ],
                })
              }}
              onPointerLeave={hide}
              onFocus={(event) => {
                const bounds = container.current?.getBoundingClientRect()
                const cell = event.currentTarget.getBoundingClientRect()
                if (!bounds) return
                show({
                  x: cell.left - bounds.left + cell.width / 2,
                  y: cell.top - bounds.top,
                  title: segment.label,
                  rows: [
                    { label: unit, value: formatCount(segment.value) },
                    { label: 'of total', value: `${Math.round(share * 100)}%` },
                  ],
                })
              }}
              onBlur={hide}
            >
              {share >= INLINE_LABEL_MIN_SHARE && (
                // Inside a filled segment, ink is chosen against the fill.
                <span className="px-1 text-xs font-medium text-white mix-blend-luminosity">
                  {Math.round(share * 100)}%
                </span>
              )}
            </div>
          )
        })}
      </div>

      {/* A legend is always present for two or more series. */}
      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
        {segments.map((segment) => (
          <li key={segment.key} className="flex items-center gap-1.5 text-xs">
            <span
              aria-hidden
              className="size-2.5 shrink-0 rounded-[2px]"
              style={{ background: segment.color }}
            />
            <span className="text-muted-foreground">{segment.label}</span>
            <span className="tabular-nums">{formatCount(segment.value)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
