import type { ToastFunction, ToastType } from '@/common/types/Toast'
import { toast } from 'sonner'

export const toastHandlers: Record<ToastType, ToastFunction> = {
  success: toast.success,
  error: toast.error,
  warning: toast.warning,
  info: toast.info,
}
