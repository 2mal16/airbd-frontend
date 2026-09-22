/**
 * Brand furniture.
 *
 * The mark is a typographic lockup in the Wyss Center's own palette and
 * typeface rather than a copy of their logo file: it carries the brand without
 * shipping an asset we do not own.
 */

import { Link } from 'react-router'

import { cn } from '@/lib/utils'

export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        'inline-flex size-8 items-center justify-center rounded-md',
        'bg-wyss-green text-[0.8rem] font-semibold tracking-tight text-[color:var(--primary-foreground)]',
        className,
      )}
    >
      W
    </span>
  )
}

export function BrandLockup() {
  return (
    <Link to="/" className="group flex items-center gap-3 rounded-md focus-ring">
      <BrandMark />
      <span className="flex flex-col leading-none">
        <span className="text-[0.95rem] font-medium tracking-[-0.01em]">Wyss Center</span>
        <span className="eyebrow mt-1">BIDS Dataset Explorer</span>
      </span>
    </Link>
  )
}
