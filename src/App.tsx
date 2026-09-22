import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Route, Routes } from 'react-router'

import { Layout } from '@/components/app/layout'
import { AboutPage } from '@/pages/about'
import { DatasetDetailPage } from '@/pages/dataset-detail'
import { DiscoverPage } from '@/pages/discover'
import { StatsPage } from '@/pages/stats'
import { ValidatePathsPage } from '@/pages/validate-paths'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // The catalogue changes when a validator sweep runs, not between clicks.
      staleTime: 60_000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<DiscoverPage />} />
            <Route path="datasets/:datasetId" element={<DatasetDetailPage />} />
            <Route path="stats" element={<StatsPage />} />
            <Route path="validate" element={<ValidatePathsPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="*" element={<DiscoverPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
