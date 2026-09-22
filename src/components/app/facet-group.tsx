import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import type { FacetValue } from '@/lib/types'
import { formatCount } from '@/lib/format'
import { cn } from '@/lib/utils'

interface FacetGroupProps {
  title: string
  values: FacetValue[]
  selected: string[]
  onToggle: (value: string) => void
  /** Values beyond this are hidden behind a "show all" toggle. */
  collapseAfter?: number
  labels?: Record<string, string>
  /** Facets the API only accepts one value for render as radio-like single select. */
  single?: boolean
}

export function FacetGroup({
  title,
  values,
  selected,
  onToggle,
  collapseAfter = 6,
  labels,
  single = false,
}: FacetGroupProps) {
  const [expanded, setExpanded] = useState(false)

  if (values.length === 0) return null

  const visible = expanded ? values : values.slice(0, collapseAfter)
  const hidden = values.length - visible.length

  return (
    <section className="space-y-3">
      <h3 className="eyebrow">{title}</h3>
      <ul className="space-y-1">
        {visible.map((facet) => {
          const id = `${title}-${facet.value}`
          const isSelected = selected.includes(facet.value)
          return (
            <li key={facet.value}>
              <Label
                htmlFor={id}
                className={cn(
                  'flex w-full cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5',
                  'text-sm font-normal transition-colors hover:bg-accent/60',
                  isSelected && 'bg-accent/80 text-accent-foreground',
                )}
              >
                <Checkbox
                  id={id}
                  checked={isSelected}
                  onCheckedChange={() => onToggle(facet.value)}
                  aria-label={labels?.[facet.value] ?? facet.value}
                />
                <span className="flex-1 truncate">{labels?.[facet.value] ?? facet.value}</span>
                <span className="tabular-nums text-xs text-muted-foreground">
                  {formatCount(facet.count)}
                </span>
              </Label>
            </li>
          )
        })}
      </ul>

      {hidden > 0 && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="focus-ring inline-flex items-center gap-1 rounded-sm px-2 text-xs text-muted-foreground hover:text-foreground"
        >
          <ChevronDown className="size-3.5" />
          Show {hidden} more
        </button>
      )}
      {single && selected.length > 1 && (
        <p className="px-2 text-xs text-muted-foreground">Only the first value is applied.</p>
      )}
    </section>
  )
}
