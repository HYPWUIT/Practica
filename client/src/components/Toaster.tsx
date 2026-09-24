import { Link } from 'react-router'
import { useToast } from '../hooks/useToast'

/**
 * Lives in the layout, once. `aria-live="polite"` means a screen reader
 * announces each toast without interrupting whatever it is already saying.
 */
function Toaster() {
  const { toasts, dismiss } = useToast()

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex flex-col items-center gap-2 p-4 sm:items-end"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-lg border border-line bg-canvas px-4 py-3 text-sm shadow-lg"
        >
          <span className="flex-1">{toast.message}</span>

          {toast.action && (
            <Link
              to={toast.action.to}
              onClick={() => dismiss(toast.id)}
              className="shrink-0 font-medium text-sage-700 hover:underline"
            >
              {toast.action.label}
            </Link>
          )}

          <button
            type="button"
            onClick={() => dismiss(toast.id)}
            aria-label="Dismiss notification"
            className="-mr-1 shrink-0 rounded-full p-1 text-muted hover:bg-shell hover:text-ink"
          >
            <svg viewBox="0 0 20 20" className="size-4" aria-hidden="true">
              <path
                d="M5 5l10 10M15 5L5 15"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </button>
        </div>
      ))}
    </div>
  )
}

export default Toaster
