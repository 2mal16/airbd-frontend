import { X } from 'lucide-react'

import { FacetGroup } from '@/components/app/facet-group'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import type { DiscoveryState } from '@/hooks/use-dataset-query'
import { DATATYPE_LABELS, LICENSE_LABELS, VALIDATION_LABELS } from '@/lib/format'
import type { DatasetFacets } from '@/lib/types'

interface FilterSidebarProps {
  facets: DatasetFacets | undefined
  isLoading: boolean
  state: DiscoveryState
  activeCount: number
  onToggle: (facet: keyof DiscoveryState, value: string, single?: boolean) => void
  onUpdate: (patch: Partial<DiscoveryState>) => void
  onClear: () => void
}

export function FilterSidebar({
  facets,
  isLoading,
  state,
  activeCount,
  onToggle,
  onUpdate,
  onClear,
}: FilterSidebarProps) {
  if (isLoading || !facets) {
    return (
      <div className="space-y-6">
        {[0, 1, 2].map((i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-3 w-24" />
            {[0, 1, 2, 3].map((j) => (
              <Skeleton key={j} className="h-8 w-full" />
            ))}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium">Filters</h2>
        {activeCount > 0 && (
          <Button variant="ghost" size="sm" onClick={onClear} className="h-7 px-2 text-xs">
            <X className="size-3.5" />
            Clear {activeCount}
          </Button>
        )}
      </div>

      <FacetGroup
        title="Modality"
        values={facets.modality}
        selected={state.modality}
        labels={DATATYPE_LABELS}
        onToggle={(value) => onToggle('modality', value)}
      />

      {state.modality.length > 1 && (
        <Label className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-sm font-normal">
          <Checkbox
            checked={state.modality_match_all}
            onCheckedChange={(checked) => onUpdate({ modality_match_all: checked === true })}
          />
          Match all modalities
        </Label>
      )}

      <Separator />

      <FacetGroup
        title="Validation"
        values={facets.validation}
        selected={state.validation}
        labels={VALIDATION_LABELS}
        onToggle={(value) => onToggle('validation', value, true)}
      />

      <Separator />

      <FacetGroup
        title="Licence"
        values={facets.license}
        selected={state.license}
        labels={LICENSE_LABELS}
        onToggle={(value) => onToggle('license', value)}
      />

      <Separator />

      <FacetGroup
        title="Electrode system"
        values={facets['electrode-system']}
        selected={state.electrode_system}
        onToggle={(value) => onToggle('electrode_system', value, true)}
      />

      <Separator />

      <section className="space-y-3">
        <h3 className="eyebrow">Ranges</h3>
        <div className="grid gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="subjects" className="text-xs font-normal text-muted-foreground">
              Participants
            </Label>
            <Input
              id="subjects"
              placeholder="e.g. 20.. or 10..50"
              defaultValue={state.subjects}
              onBlur={(event) => onUpdate({ subjects: event.target.value.trim() })}
              onKeyDown={(event) => {
                if (event.key === 'Enter') onUpdate({ subjects: event.currentTarget.value.trim() })
              }}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="channels" className="text-xs font-normal text-muted-foreground">
              Channels
            </Label>
            <Input
              id="channels"
              placeholder="e.g. 64..128"
              defaultValue={state.channels}
              onBlur={(event) => onUpdate({ channels: event.target.value.trim() })}
              onKeyDown={(event) => {
                if (event.key === 'Enter') onUpdate({ channels: event.currentTarget.value.trim() })
              }}
            />
          </div>
        </div>
      </section>

      <Separator />

      <section className="space-y-3">
        <h3 className="eyebrow">Features</h3>
        <Label className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-sm font-normal hover:bg-accent/60">
          <Checkbox
            checked={state.has_hed}
            onCheckedChange={(checked) => onUpdate({ has_hed: checked === true })}
          />
          HED annotation
        </Label>
        <Label className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-sm font-normal hover:bg-accent/60">
          <Checkbox
            checked={state.has_doi}
            onCheckedChange={(checked) => onUpdate({ has_doi: checked === true })}
          />
          Has a DOI
        </Label>
      </section>

      {facets['bids-version'].length > 0 && (
        <>
          <Separator />
          <FacetGroup
            title="BIDS version"
            values={facets['bids-version']}
            selected={state.bids_version}
            onToggle={(value) => onToggle('bids_version', value, true)}
          />
        </>
      )}

      {facets['hed-version'].length > 0 && (
        <>
          <Separator />
          <FacetGroup
            title="HED version"
            values={facets['hed-version']}
            selected={state.hed_version}
            onToggle={(value) => onToggle('hed_version', value, true)}
          />
        </>
      )}
    </div>
  )
}
