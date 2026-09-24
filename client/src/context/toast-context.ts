import { createContext } from 'react'

export type Toast = {
  id: number
  message: string
  /** Optional follow-up, e.g. "View cart". */
  action?: { label: string; to: string }
}

export type ToastContextValue = {
  toasts: Toast[]
  /** Returns the new toast's id, so a caller can dismiss it early. */
  notify: (message: string, action?: Toast['action']) => number
  dismiss: (id: number) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)

/** How long a toast sticks around before dismissing itself. */
export const TOAST_DURATION_MS = 4000
