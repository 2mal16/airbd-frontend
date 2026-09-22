import { useRef } from 'react'

import { ChartTooltip, useChartTooltip } from '@/components/charts/chart-tooltip'
import { BAR_RADIUS, MAX_BAR_THICKNESS, niceTicks } from '@/components/charts/primitives'
import { formatCount } from '@/lib/format'

export interface HistogramBin {
  key: string
  /** Axis tick under the column. */
  label: string
  /** Fuller description for the tooltip, e.g. "20 to 25 years". */
  title: string
  value: number
}

interface HistogramProps {
  bins: HistogramBin[]
  unit: string
  color?: string
  height?: number
  /** Force whole-number ticks — set when the measure is a count. */
  integerTicks?: boolean
}

/**
 * Columns over ordered bins.
 *
 * One hue: the bins are already ordered by the axis, so a ramp would add
 * nothing and cost the colour channel.
 */
export function Histogram({
  bins,
  unit,
  color = 'var(--chart-1)',
  height = 180,
  integerTicks = true,
}: HistogramProps) {
  const container = useRef<HTMLDivElement>(null)
  const { tooltip, show, hide } = useChartTooltip()

  if (bins.length === 0) return null

  const max = Math.max(...bins.map((b) => b.value), 1)
  const ticks = niceTicks(max, 4, integerTicks)
  const scaleMax = Math.max(...ticks, max)

  return (
    <div ref={container} className="relative">
      <ChartTooltip state={tooltip} />
      <div className="flex gap-2">
        {/* Ticks carry the values that are not directly labelled. */}
        <ul
          className="flex shrink-0 flex-col-reverse justify-between text-right text-[0.7rem] text-muted-foreground tabular-nums"
          style={{ height }}
          aria-hidden
        >
          {ticks.map((tick) => (
            <li key={tick} className="leading-none">
              {formatCount(tick)}
            </li>
          ))}
        </ul>

        <div className="min-w-0 flex-1">
          <div className="relative" style={{ height }}>
            {/* Hairline, solid, recessive. */}
            {ticks.map((tick) => (
              <div
                key={tick}
                aria-hidden
                className="absolute inset-x-0 border-t"
                style={{ bottom: `${(tick / scaleMax) * 100}%`, borderColor: 'var(--chart-grid)' }}
              />
            ))}

            <ul className="absolute inset-0 flex items-end justify-between gap-0.5">
              {bins.map((bin) => (
                <li
                  key={bin.key}
                  tabIndex={0}
                  className="focus-ring group flex h-full flex-1 items-end justify-center rounded-sm"
                  onPointerMove={(event) => {
                    const bounds = container.current?.getBoundingClientRect()
                    if (!bounds) return
                    show({
                      x: event.clientX - bounds.left,
                      y: event.clientY - bounds.top,
                      title: bin.title,
                      rows: [{ label: unit, value: formatCount(bin.value) }],
                    })
                  }}
                  onPointerLeave={hide}
                  onFocus={(event) => {
                    const bounds = container.current?.getBoundingClientRect()
                    const cell = event.currentTarget.getBoundingClientRect()
                    if (!bounds) return
                    show({
                      x: cell.left - bounds.left + cell.width / 2,
                      y: cell.top - bounds.top + cell.height,
                      title: bin.title,
                      rows: [{ label: unit, value: formatCount(bin.value) }],
                    })
                  }}
                  onBlur={hide}
                >
                  <div
                    aria-hidden
                    className="w-full transition-opacity group-hover:opacity-85 group-focus:opacity-85"
                    style={{
                      maxWidth: MAX_BAR_THICKNESS,
                      height: `${(bin.value / scaleMax) * 100}%`,
                      minHeight: bin.value > 0 ? 2 : 0,
                      background: color,
                      // Rounded cap, square at the baseline.
                      borderRadius: `${BAR_RADIUS}px ${BAR_RADIUS}px 0 0`,
                    }}
                  />
                </li>
              ))}
            </ul>
          </div>

          <ul className="mt-1.5 flex justify-between gap-0.5" aria-hidden>
            {bins.map((bin) => (
              <li
                key={bin.key}
                className="flex-1 text-center text-[0.7rem] text-muted-foreground tabular-nums"
              >
                {bin.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
