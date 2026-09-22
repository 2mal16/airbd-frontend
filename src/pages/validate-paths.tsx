import { useMutation, useQuery } from '@tanstack/react-query'
import { Check, X } from 'lucide-react'
import { useState } from 'react'

import { ApiErrorState } from '@/components/app/api-error-state'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'

const PLACEHOLDER = `/dataset_description.json
/sub-01/anat/sub-01_T1w.nii.gz
/sub-01/ses-02/eeg/sub-01_ses-02_task-rest_run-03_eeg.bdf
/sub-01/eeg/notes.txt`

export function ValidatePathsPage() {
  const [input, setInput] = useState(PLACEHOLDER)

  const version = useQuery({ queryKey: ['bids-version'], queryFn: api.bidsVersion })

  const check = useMutation({
    mutationFn: (paths: string[]) => api.validatePaths(paths),
  })

  const paths = input
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  return (
    <div className="mx-auto w-full max-w-[1100px] px-4 py-10 sm:px-6">
      <p className="eyebrow">BIDS tools</p>
      <h1 className="mt-3 text-3xl sm:text-4xl">Path check</h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
        Check dataset-relative paths against the BIDS naming rules before you run the full
        validator. This is a filename check only — it never needs the files themselves.
        {version.data && (
          <>
            {' '}
            Running against BIDS {version.data.bids_version} (schema {version.data.schema_version}).
          </>
        )}
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="space-y-3">
          <Label htmlFor="paths">One path per line</Label>
          <textarea
            id="paths"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            spellCheck={false}
            rows={12}
            className={cn(
              'focus-ring w-full resize-y rounded-lg border bg-transparent px-3 py-2.5',
              'font-mono text-sm leading-relaxed shadow-xs',
            )}
          />
          <Button
            onClick={() => check.mutate(paths)}
            disabled={paths.length === 0 || check.isPending}
          >
            {check.isPending ? 'Checking…' : `Check ${paths.length} paths`}
          </Button>
        </div>

        <div className="space-y-3">
          <Label>Result</Label>
          {check.isError && (
            <ApiErrorState error={check.error} onRetry={() => check.mutate(paths)} />
          )}
          {!check.data && !check.isError && (
            <p className="text-sm text-muted-foreground">
              Results appear here once you run the check.
            </p>
          )}
          {check.data && (
            <>
              <p className="text-sm text-muted-foreground">
                <span className="text-foreground">{check.data.valid_count}</span> valid,{' '}
                <span className="text-foreground">{check.data.invalid_count}</span> invalid
              </p>
              <ul className="space-y-2">
                {check.data.results.map((result) => (
                  <li key={result.path}>
                    <Card className="gap-0 p-0">
                      <CardContent className="flex gap-3 px-4 py-3">
                        {result.is_bids ? (
                          <Check className="mt-0.5 size-4 shrink-0 text-wyss-green-darker dark:text-wyss-green" />
                        ) : (
                          <X className="mt-0.5 size-4 shrink-0 text-destructive" />
                        )}
                        <div className="min-w-0 flex-1 space-y-1.5">
                          <p className="font-mono text-xs break-all">{result.path}</p>
                          {Object.keys(result.entities).length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {Object.entries(result.entities).map(([key, value]) => (
                                <Badge
                                  key={key}
                                  variant="secondary"
                                  className="font-mono text-[0.7rem] font-normal"
                                >
                                  {key}-{value}
                                </Badge>
                              ))}
                              {result.suffix && (
                                <Badge variant="outline" className="font-mono text-[0.7rem] font-normal">
                                  {result.suffix}
                                  {result.extension}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
