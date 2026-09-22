/**
 * Shared chart geometry and tokens.
 *
 * The specs here are fixed across every chart in the app: thin marks, a 4px
 * rounded data-end with a square baseline, a 2px surface gap between touching
 * marks, and hairline gridlines. They live in one module so a chart cannot
 * quietly drift from them.
 */

/** Bars never fill their band — the leftover is deliberate air. */
export const MAX_BAR_THICKNESS = 24
/** Radius on the data-end only; the baseline end stays square. */
export const BAR_RADIUS = 4
/** Surface-coloured gap that separates touching marks. */
export const SURFACE_GAP = 2
/** Pointer targets must be comfortably larger than the mark itself. */
export const MIN_HIT_TARGET = 24

/** Categorical slots, in fixed order. Never cycled, never assigned by rank. */
export const SERIES = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)'] as const

/** Absence of data, not a category — so it is grey, never a series hue. */
export const NEUTRAL = 'var(--chart-neutral)'

/**
 * A horizontal bar: square at x=0, rounded at the value end.
 *
 * Returns a path rather than a `<rect rx>` because `rx` rounds all four
 * corners, which detaches the bar from its baseline.
 */
export function horizontalBarPath(width: number, height: number, radius = BAR_RADIUS): string {
  const r = Math.max(0, Math.min(radius, width, height / 2))
  if (width <= 0) return ''
  return [
    `M0 0`,
    `H${width - r}`,
    `A${r} ${r} 0 0 1 ${width} ${r}`,
    `V${height - r}`,
    `A${r} ${r} 0 0 1 ${width - r} ${height}`,
    `H0`,
    'Z',
  ].join(' ')
}

/** A column: square at the baseline, rounded at the top. */
export function columnPath(width: number, height: number, radius = BAR_RADIUS): string {
  const r = Math.max(0, Math.min(radius, width / 2, height))
  if (height <= 0) return ''
  return [
    `M0 ${height}`,
    `V${r}`,
    `A${r} ${r} 0 0 1 ${r} 0`,
    `H${width - r}`,
    `A${r} ${r} 0 0 1 ${width} ${r}`,
    `V${height}`,
    'Z',
  ].join(' ')
}

/** Band thickness for `count` marks in `extent` px, capped and gapped. */
export function bandThickness(extent: number, count: number): number {
  if (count <= 0) return 0
  const band = extent / count
  return Math.max(4, Math.min(MAX_BAR_THICKNESS, band - SURFACE_GAP * 2))
}

/**
 * Axis ticks at clean round numbers, always including zero.
 *
 * `integer` forces a whole-number step. Counts of things have no half: an axis
 * reading 0 / 0.5 / 1 under a bar chart of datasets invites a value that
 * cannot exist.
 */
export function niceTicks(max: number, count = 4, integer = false): number[] {
  if (max <= 0) return [0]
  const rawStep = max / count
  const magnitude = 10 ** Math.floor(Math.log10(rawStep))
  let step =
    [1, 2, 2.5, 5, 10].map((m) => m * magnitude).find((s) => s >= rawStep) ?? magnitude * 10
  if (integer) step = Math.max(1, Math.ceil(step))

  const ticks: number[] = []
  for (let value = 0; value <= max + step / 2; value += step) {
    ticks.push(Math.round(value * 100) / 100)
  }
  return ticks
}
