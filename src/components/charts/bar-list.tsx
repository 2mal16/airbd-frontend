import { useRef } from 'react'

import { ChartTooltip, useChartTooltip } from '@/components/charts/chart-tooltip'
import { BAR_RADIUS, MAX_BAR_THICKNESS } from '@/components/charts/primitives'
import { formatCount } from '@/lib/format'

export interface BarDatum {
  key: string
  label: string
  value: number
}

interface BarListProps {
  data: BarDatum[]
  /** What one unit is, for the tooltip: "datasets", "sessions", … */
  unit: string
  /** Override the single-series colour; magnitude charts should not need to. */
  color?: string
  formatValue?: (value: number) => string
  /** Widen the label column when categories are long, e.g. validator codes. */
  labelWidth?: string
}

/** Row height leaves air above and below the capped bar. */
const ROW_HEIGHT = 30

/**
 * Horizontal bars for magnitude across named categories.
 *
 * One hue for every bar. The bar length already encodes the value, so shading
 * by value would spend the colour channel restating it — and on categories
 * with no natural order it would imply an order that is not there.
 *
 * Built from CSS boxes rather than SVG so the bar can be rounded at the data
 * end and square at the baseline without a scale transform distorting the
 * corner radius.
 */
export function BarList({
  data,
  unit,
  color = 'var(--chart-1)',
  formatValue,
  labelWidth = 'minmax(5rem,8rem)',
}: BarListProps) {
  const container = useRef<HTMLDivElement>(null)
  const { tooltip, show, hide } = useChartTooltip()

  if (data.length === 0) return null

  const max = Math.max(...data.map((d) => d.value), 1)
  const barHeight = Math.min(MAX_BAR_THICKNESS, ROW_HEIGHT - 8)
  const format = formatValue ?? formatCount

  const readout = (datum: BarDatum) => ({
    title: datum.label,
    rows: [{ label: unit, value: format(datum.value) }],
  })

  return (
    <div ref={container} className="relative">
      <ChartTooltip state={tooltip} />
      <ul>
        {data.map((datum) => (
          <li
            key={datum.key}
            tabIndex={0}
            className="focus-ring group grid items-center gap-3 rounded-sm"
            style={{ height: ROW_HEIGHT, gridTemplateColumns: `${labelWidth} 1fr auto` }}
            onPointerMove={(event) => {
              const bounds = container.current?.getBoundingClientRect()
              if (!bounds) return
              show({ x: event.clientX - bounds.left, y: event.clientY - bounds.top, ...readout(datum) })
            }}
            onPointerLeave={hide}
            onFocus={(event) => {
              const bounds = container.current?.getBoundingClientRect()
              const row = event.currentTarget.getBoundingClientRect()
              if (!bounds) return
              show({
                x: row.left - bounds.left + row.width / 2,
                y: row.top - bounds.top,
                ...readout(datum),
              })
            }}
            onBlur={hide}
          >
            {/* Category names stay in text ink; the coloured bar carries identity. */}
            <span className="truncate text-sm text-muted-foreground" title={datum.label}>
              {datum.label}
            </span>
            <div className="relative w-full" style={{ height: barHeight }}>
              <div
                className="absolute inset-0 rounded-sm bg-muted/40"
                style={{ borderRadius: BAR_RADIUS }}
                aria-hidden
              />
              <div
                className="absolute inset-y-0 left-0 transition-opacity group-hover:opacity-85 group-focus:opacity-85"
                style={{
                  width: `${Math.max((datum.value / max) * 100, datum.value > 0 ? 1.5 : 0)}%`,
                  background: color,
                  // Square at the baseline, rounded at the data end.
                  borderRadius: `0 ${BAR_RADIUS}px ${BAR_RADIUS}px 0`,
                }}
                aria-hidden
              />
            </div>
            <span className="w-12 text-right text-sm tabular-nums">{format(datum.value)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
