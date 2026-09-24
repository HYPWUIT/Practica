import { useContext } from 'react'
import type { ToastContextValue } from '../context/toast-context'
import { ToastContext } from '../context/toast-context'

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used inside <ToastProvider>')
  }
  return context
}
