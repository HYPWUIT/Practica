import type { ReactNode } from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { Toast, ToastContextValue } from './toast-context'
import { ToastContext, TOAST_DURATION_MS } from './toast-context'

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const nextId = useRef(0)
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>())

  const dismiss = useCallback((id: number) => {
    const timer = timers.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timers.current.delete(id)
    }
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const notify = useCallback(
    (message: string, action?: Toast['action']) => {
      const id = nextId.current++
      setToasts((prev) => [...prev, { id, message, action }])
      timers.current.set(
        id,
        setTimeout(() => dismiss(id), TOAST_DURATION_MS),
      )
      return id
    },
    [dismiss],
  )

  // Pending timers would otherwise call setState after unmount.
  const timersRef = timers
  useEffect(
    () => () => {
      for (const timer of timersRef.current.values()) clearTimeout(timer)
      timersRef.current.clear()
    },
    [timersRef],
  )

  const value = useMemo<ToastContextValue>(
    () => ({ toasts, notify, dismiss }),
    [toasts, notify, dismiss],
  )

  return <ToastContext value={value}>{children}</ToastContext>
}
