import { ExternalLink } from 'lucide-react'
import { NavLink, Outlet } from 'react-router'

import { BrandLockup } from '@/components/app/brand'
import { OfflineBanner } from '@/components/app/offline-banner'
import { ThemeToggle } from '@/components/app/theme-toggle'
import { API_BASE_URL } from '@/lib/api'
import { cn } from '@/lib/utils'

const NAV = [
  { to: '/', label: 'Discover', end: true },
  { to: '/stats', label: 'Statistics', end: false },
  { to: '/validate', label: 'Path check', end: false },
  { to: '/about', label: 'About', end: false },
]

export function Layout() {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur-sm">
        <div className="mx-auto flex h-16 w-full max-w-[1400px] items-center gap-6 px-4 sm:px-6">
          <BrandLockup />
          <nav className="ml-auto hidden items-center gap-1 sm:flex">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    'rounded-md px-3 py-2 text-sm transition-colors',
                    isActive
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:text-foreground',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="ml-auto sm:ml-0">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <OfflineBanner />

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t">
        <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-2 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            Dataset records are derived from{' '}
            <span className="font-mono text-xs">bids-validator</span> output.
          </p>
          <a
            href={`${API_BASE_URL}/docs`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-foreground focus-ring rounded-sm"
          >
            API documentation
            <ExternalLink className="size-3.5" />
          </a>
        </div>
      </footer>
    </div>
  )
}
