import { type FC, type ReactNode, useRef } from 'react'
import { reactQuery } from '@/common/configuration/reactQuery'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

type ReactQueryProviderProps = {
  children: ReactNode
}

const ReactQueryProvider: FC<ReactQueryProviderProps> = ({ children }) => {
  const queryClient = useRef<QueryClient>(new QueryClient(reactQuery))

  return (
    <QueryClientProvider client={queryClient.current}>
      {children}
    </QueryClientProvider>
  )
}

export default ReactQueryProvider
