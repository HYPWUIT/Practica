import type { ReactNode } from 'react'
import { useEffect, useRef } from 'react'

type SheetProps = {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

/**
 * A side drawer on native <dialog>, so focus trapping, Escape-to-close and
 * inerting the page behind it come from the platform rather than from us.
 * Shared by the mobile nav and the catalogue filters.
 */
function Sheet({ open, onClose, title, children }: SheetProps) {
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
      aria-label={title}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose()
      }}
      className="m-0 ml-auto h-dvh max-h-none w-[min(20rem,85vw)] max-w-none bg-canvas p-0 text-ink backdrop:bg-scrim/60"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <h2 className="text-base">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={`Close ${title.toLowerCase()}`}
            className="-mr-1 rounded-full p-2 text-muted hover:bg-shell hover:text-ink"
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

        <div className="flex-1 overflow-y-auto overscroll-contain p-4">
          {children}
        </div>
      </div>
    </dialog>
  )
}

export default Sheet
