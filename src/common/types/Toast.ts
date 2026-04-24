import type { ReactNode } from 'react'
import type { ExternalToast } from 'sonner'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export type ToastFunction = (
  message: ReactNode,
  data?: ExternalToast | undefined
) => string | number

export type ToastOptions = {
  type: ToastType
  message: ReactNode
  data?: ExternalToast | undefined
}
