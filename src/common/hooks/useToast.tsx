import { toastHandlers } from '@/common/constants/toastHandlers'
import type { ToastOptions } from '@/common/types/Toast'

const useToast = () => {
  function showToast({ type, message, data }: ToastOptions) {
    const toastFunction = toastHandlers[type]

    return toastFunction(message, data)
  }

  return {
    showToast,
  }
}

export default useToast
