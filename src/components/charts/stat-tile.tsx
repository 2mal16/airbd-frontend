import { cn } from '@/lib/utils'

interface StatTileProps {
  label: string
  value: string
  hint?: string
  /** The one number a view leads with. Exactly one per view. */
  hero?: boolean
  className?: string
}

/**
 * A single number.
 *
 * When the story is one value this is the right form — a one-bar bar chart is
 * not. Large values use proportional figures; `tabular-nums` is for columns
 * that must align, where it earns its looser digits.
 */
export function StatTile({ label, value, hint, hero = false, className }: StatTileProps) {
  return (
    <div className={cn('min-w-0', className)}>
      <p className="eyebrow">{label}</p>
      <p className={cn('mt-1 font-light tracking-tight', hero ? 'text-5xl' : 'text-3xl')}>{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}
