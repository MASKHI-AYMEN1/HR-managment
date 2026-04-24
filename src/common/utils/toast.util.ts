import { ToastOptions } from '@/common/types/Toast'

export function showSuccessToast(
  showToast: (options: ToastOptions) => void,
  successMessage: string,
  duration: number
) {
  showToast({
    type: 'success',
    message: 'Success',
    data: {
      position: 'top-right',
      duration: duration,
      closeButton: true,
      description: successMessage,
    },
  })
}

export function showErrorToast(
  showToast: (options: ToastOptions) => void,
  errorMessage: string,
  duration: number
) {
  showToast({
    type: 'error',
    message: 'Error',
    data: {
      position: 'top-right',
      duration: duration,
      closeButton: true,
      description: errorMessage,
    },
  })
}
