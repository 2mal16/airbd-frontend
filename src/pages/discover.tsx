import { useQuery } from '@tanstack/react-query'
import { AlertCircle, Search, SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'

import { DatasetCard } from '@/components/app/dataset-card'
import { FilterSidebar } from '@/components/app/filter-sidebar'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { PAGE_SIZE, toApiQuery, useDiscoveryState } from '@/hooks/use-dataset-query'
import { api } from '@/lib/api'
import { formatCount } from '@/lib/format'
import type { SortOrder } from '@/lib/types'

const SORT_LABELS: Record<SortOrder, string> = {
  newest: 'Newest',
  oldest: 'Oldest',
  name: 'Name (A–Z)',
  participants: 'Most participants',
  size: 'Largest size',
  citations: 'Most citations',
  validation: 'Validation status',
}

export function DiscoverPage() {
  const { state, update, toggle, clear, activeCount } = useDiscoveryState()
  const [searchDraft, setSearchDraft] = useState(state.search)
  const [lastSearch, setLastSearch] = useState(state.search)

  // Keep the box in step when the URL changes from elsewhere (back button,
  // cleared filters) without fighting the user while they type. Adjusting
  // during render rather than in an effect avoids a second render pass.
  if (state.search !== lastSearch) {
    setLastSearch(state.search)
    setSearchDraft(state.search)
  }

  const apiQuery = toApiQuery(state)

  const datasets = useQuery({
    queryKey: ['datasets', apiQuery],
    queryFn: () => api.listDatasets(apiQuery),
    placeholderData: (previous) => previous,
  })

  // The sidebar counts reflect the current selection, minus pagination.
  const facets = useQuery({
    queryKey: ['facets'],
    queryFn: () => api.facets(),
  })

  const total = datasets.data?.total_count ?? 0
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const sidebar = (
    <FilterSidebar
      facets={facets.data}
      isLoading={facets.isLoading}
      state={state}
      activeCount={activeCount}
      onToggle={toggle}
      onUpdate={update}
      onClear={clear}
    />
  )

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6">
      <section className="border-b py-10 sm:py-14">
        <p className="eyebrow">Discover</p>
        <h1 className="mt-3 max-w-3xl text-4xl leading-[1.15] sm:text-5xl">
          Every dataset here has been through{' '}
          <span className="text-wyss-green-darker dark:text-wyss-green">bids-validator</span>.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
          Search and filter BIDS datasets by modality, licence, acquisition parameters and
          validation status. Counts come from the validator, not from hand-maintained metadata.
        </p>

        <form
          className="mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row"
          onSubmit={(event) => {
            event.preventDefault()
            update({ search: searchDraft.trim() })
          }}
        >
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchDraft}
              onChange={(event) => setSearchDraft(event.target.value)}
              placeholder="Search titles, descriptions, authors, tasks…"
              aria-label="Search datasets"
              className="h-11 pl-9"
            />
          </div>
          <Button type="submit" size="lg" className="h-11">
            Search
          </Button>
        </form>
      </section>

      <div className="flex gap-10 py-8">
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24 max-h-[calc(100svh-8rem)] overflow-y-auto pr-2 pb-8">
            {sidebar}
          </div>
        </aside>

        <div className="min-w-0 flex-1 space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm text-muted-foreground" aria-live="polite">
              {datasets.isLoading ? (
                'Loading…'
              ) : (
                <>
                  <span className="font-medium text-foreground">{formatCount(total)}</span>{' '}
                  {total === 1 ? 'dataset' : 'datasets'}
                  {activeCount > 0 && ' matching your filters'}
                </>
              )}
            </p>

            <div className="ml-auto flex items-center gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="lg:hidden">
                    <SlidersHorizontal className="size-4" />
                    Filters
                    {activeCount > 0 && ` (${activeCount})`}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[320px] overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="px-4 pb-8">{sidebar}</div>
                </SheetContent>
              </Sheet>

              <Select
                value={state.sort}
                onValueChange={(value) => update({ sort: value as SortOrder })}
              >
                <SelectTrigger size="sm" className="w-[190px]" aria-label="Sort order">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(SORT_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {datasets.isError && (
            <Alert variant="destructive">
              <AlertCircle />
              <AlertTitle>Could not reach the API</AlertTitle>
              <AlertDescription>{(datasets.error as Error).message}</AlertDescription>
            </Alert>
          )}

          {datasets.isLoading && (
            <div className="space-y-4">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-60 w-full rounded-xl" />
              ))}
            </div>
          )}

          {datasets.data && datasets.data.datasets.length === 0 && (
            <div className="rounded-xl border border-dashed py-16 text-center">
              <p className="text-sm text-muted-foreground">No datasets match these filters.</p>
              {activeCount > 0 && (
                <Button variant="link" onClick={clear} className="mt-1">
                  Clear all filters
                </Button>
              )}
            </div>
          )}

          <div className="space-y-4">
            {datasets.data?.datasets.map((dataset) => (
              <DatasetCard key={dataset.dataset_id} dataset={dataset} />
            ))}
          </div>

          {pageCount > 1 && (
            <nav className="flex items-center justify-between border-t pt-6" aria-label="Pagination">
              <Button
                variant="outline"
                disabled={state.page <= 1}
                onClick={() => update({ page: state.page - 1 })}
              >
                Previous
              </Button>
              <p className="text-sm text-muted-foreground">
                Page {state.page} of {pageCount}
              </p>
              <Button
                variant="outline"
                disabled={state.page >= pageCount}
                onClick={() => update({ page: state.page + 1 })}
              >
                Next
              </Button>
            </nav>
          )}
        </div>
      </div>
    </div>
  )
}
