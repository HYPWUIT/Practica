import type { ReactNode } from 'react'
import { useEffect, useRef } from 'react'

type ModalProps = {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  footer?: ReactNode
}

/**
 * Built on native <dialog>, which brings focus trapping, Escape-to-close and
 * inertness of the page behind it without any of that being reimplemented.
 */
function Modal({ open, onClose, title, children, footer }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="modal-title"
      // Fires for Escape too, so this is the single close path.
      onClose={onClose}
      onClick={(event) => {
        // The dialog element itself is the backdrop; its children are not.
        if (event.target === dialogRef.current) onClose()
      }}
      className="m-auto w-[min(32rem,calc(100vw-2rem))] rounded-xl border border-line bg-canvas p-0 text-ink backdrop:bg-scrim/60"
    >
      <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
        <h2 id="modal-title" className="text-lg">
          {title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="-m-1 rounded-full p-1 text-muted hover:bg-shell hover:text-ink"
        >
          <svg viewBox="0 0 20 20" className="size-5" aria-hidden="true">
            <path
              d="M5 5l10 10M15 5L5 15"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </button>
      </div>

      <div className="px-5 py-4 text-sm">{children}</div>

      {footer && (
        <div className="flex justify-end gap-2 border-t border-line px-5 py-4">
          {footer}
        </div>
      )}
    </dialog>
  )
}

export default Modal
