import { QueryClientConfig } from '@tanstack/react-query'

export const reactQuery: QueryClientConfig = {
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: 0,
      staleTime: 1 * 60 * 1000, // 1 min
    },
  },
}
