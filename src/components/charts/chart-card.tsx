import { Table2 } from 'lucide-react'
import { useId, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export interface TableColumn {
  key: string
  label: string
  numeric?: boolean
}

interface ChartCardProps {
  title: string
  /** One line saying what is plotted — for a single series this replaces a legend. */
  description?: string
  /** Coverage, caveats, or what the numbers are counted over. */
  footnote?: string
  children: React.ReactNode
  /** Rows behind the chart. Every value a tooltip shows must be reachable here. */
  table?: { columns: TableColumn[]; rows: Record<string, string | number>[] }
  className?: string
  empty?: boolean
  emptyMessage?: string
}

/**
 * The frame every chart sits in.
 *
 * Carries the table view, which is not optional: tooltips enhance, they never
 * gate, so every value on the chart stays reachable without a pointer.
 */
export function ChartCard({
  title,
  description,
  footnote,
  children,
  table,
  className,
  empty = false,
  emptyMessage = 'No data for this selection.',
}: ChartCardProps) {
  const [showTable, setShowTable] = useState(false)
  const tableId = useId()

  return (
    <Card className={cn('gap-0 overflow-hidden p-0', className)}>
      <div className="flex items-start gap-3 px-5 pt-5">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-medium">{title}</h3>
          {description && (
            <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{description}</p>
          )}
        </div>
        {table && !empty && (
          <Button
            variant="ghost"
            size="icon"
            className="size-7 shrink-0"
            aria-expanded={showTable}
            aria-controls={tableId}
            aria-label={showTable ? 'Show chart' : 'Show data table'}
            onClick={() => setShowTable((value) => !value)}
          >
            <Table2 className="size-3.5" />
          </Button>
        )}
      </div>

      <div className="px-5 pt-4 pb-5">
        {empty ? (
          <p className="py-8 text-center text-sm text-muted-foreground">{emptyMessage}</p>
        ) : showTable && table ? (
          <div id={tableId} className="max-h-72 overflow-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-card">
                <tr className="border-b">
                  {table.columns.map((column) => (
                    <th
                      key={column.key}
                      scope="col"
                      className={cn(
                        'py-1.5 pr-3 text-left text-xs font-medium text-muted-foreground',
                        column.numeric && 'text-right',
                      )}
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.rows.map((row, index) => (
                  <tr key={index} className="border-b last:border-0">
                    {table.columns.map((column) => (
                      <td
                        key={column.key}
                        className={cn(
                          'py-1.5 pr-3',
                          column.numeric && 'text-right tabular-nums',
                        )}
                      >
                        {row[column.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          children
        )}
        {footnote && !empty && (
          <p className="mt-3 text-xs text-muted-foreground">{footnote}</p>
        )}
      </div>
    </Card>
  )
}
