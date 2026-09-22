import { useCallback, useState } from 'react'

import { cn } from '@/lib/utils'

export interface TooltipRow {
  /** Short stroke of the series colour; omitted for single-series charts. */
  color?: string
  label: string
  value: string
}

export interface TooltipState {
  x: number
  y: number
  title: string
  rows: TooltipRow[]
}

/**
 * Hover and focus readout.
 *
 * Values lead and labels follow: here the reader already has the category and
 * wants the number, which inverts the legend's hierarchy.
 *
 * Labels arrive from the API, so they are set as text nodes by React rather
 * than interpolated into markup.
 */
export function ChartTooltip({ state }: { state: TooltipState | null }) {
  if (!state) return null
  return (
    <div
      role="tooltip"
      className={cn(
        'pointer-events-none absolute z-20 min-w-[9rem] -translate-x-1/2 -translate-y-full',
        'rounded-md border bg-popover px-2.5 py-2 text-popover-foreground shadow-md',
      )}
      style={{ left: state.x, top: state.y - 8 }}
    >
      <p className="mb-1 text-xs text-muted-foreground">{state.title}</p>
      <ul className="space-y-0.5">
        {state.rows.map((row) => (
          <li key={row.label} className="flex items-baseline gap-2 text-sm">
            {row.color && (
              <span
                aria-hidden
                className="h-0.5 w-3 shrink-0 self-center rounded-full"
                style={{ background: row.color }}
              />
            )}
            <span className="font-medium tabular-nums">{row.value}</span>
            <span className="truncate text-xs text-muted-foreground">{row.label}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Wires pointer and keyboard events to a single tooltip for a chart. */
export function useChartTooltip() {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)

  const show = useCallback((state: TooltipState) => setTooltip(state), [])
  const hide = useCallback(() => setTooltip(null), [])

  return { tooltip, show, hide }
}
