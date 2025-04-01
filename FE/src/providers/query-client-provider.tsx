'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export interface QueryClientProviderProps {
  children: React.ReactNode
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false
    }
  }
})

export default function ReactQueryClientProvider({ children }: QueryClientProviderProps) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
