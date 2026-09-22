import { useQuery } from '@tanstack/react-query'
import { ExternalLink } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { API_BASE_URL, api } from '@/lib/api'
import { formatCount } from '@/lib/format'

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b py-3 last:border-0">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="font-mono text-sm">{value}</dd>
    </div>
  )
}

export function AboutPage() {
  const info = useQuery({ queryKey: ['info'], queryFn: api.info })

  return (
    <div className="mx-auto w-full max-w-[820px] px-4 py-10 sm:px-6">
      <p className="eyebrow">About</p>
      <h1 className="mt-3 text-3xl sm:text-4xl">How this catalogue is built</h1>

      <div className="mt-8 space-y-5 text-base leading-relaxed text-muted-foreground">
        <p>
          Every record in this catalogue is derived from{' '}
          <span className="font-mono text-sm text-foreground">bids-validator</span> output.
          Participant counts, sessions, tasks, datatypes, file counts and sizes all come from the
          validator&rsquo;s own summary; credit metadata comes from each dataset&rsquo;s{' '}
          <span className="font-mono text-sm text-foreground">dataset_description.json</span>.
          Nothing here is typed in by hand.
        </p>
        <p>
          The vocabulary used for filtering — datatypes, entities, suffixes — is generated on the
          server from the machine-readable BIDS schema, the same artifact the validator reads. That
          is why the modality facet lists BIDS datatypes rather than a bespoke list.
        </p>
        <p>
          The discovery layout follows{' '}
          <a
            href="https://nemar.org/discover"
            target="_blank"
            rel="noreferrer"
            className="focus-ring rounded-sm text-foreground underline decoration-wyss-green-dark decoration-2 underline-offset-4"
          >
            NEMAR
          </a>
          , with one addition: because this backend keeps the validation report, you can filter and
          sort on BIDS validity directly.
        </p>
      </div>

      <Card className="mt-10">
        <CardContent>
          <dl>
            <Row label="API" value={API_BASE_URL} />
            <Row label="Service version" value={info.data?.version ?? '…'} />
            <Row label="BIDS version" value={info.data?.bids_version ?? '…'} />
            <Row label="BIDS schema" value={info.data?.bids_schema_version ?? '…'} />
            <Row
              label="Datasets catalogued"
              value={info.data ? formatCount(info.data.datasets) : '…'}
            />
          </dl>
        </CardContent>
      </Card>

      <a
        href={`${API_BASE_URL}/docs`}
        target="_blank"
        rel="noreferrer"
        className="focus-ring mt-6 inline-flex items-center gap-1.5 rounded-sm text-sm text-muted-foreground hover:text-foreground"
      >
        Browse the API documentation
        <ExternalLink className="size-3.5" />
      </a>
    </div>
  )
}
