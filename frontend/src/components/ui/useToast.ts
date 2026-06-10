import { useState } from 'react'

type Severity = 'success' | 'error' | 'info' | 'warning'

type ToastOptions = {
  duration?: number
}

type ToastState = {
  open: boolean
  message: string
  severity: Severity
  duration: number
}

export function useToast() {
  const [toast, setToast] = useState<ToastState>({
    open: false,
    message: '',
    severity: 'success',
    duration: 3000,
  })

  const showToast = (
    message: string,
    severity: Severity = 'success',
    options?: ToastOptions
  ) => {
    setToast({
      open: true,
      message,
      severity,
      duration: options?.duration ?? 3000,
    })
  }

  const hideToast = () => {
    setToast((t) => ({ ...t, open: false }))
  }

  return {
    toast,
    showToast,
    hideToast,
  }
}