import type { ReactNode } from 'react'

type EmptyStateProps = {
  title: string
  description?: string
  /** Usually a Button or a Link wearing `buttonClasses()`. */
  action?: ReactNode
  className?: string
}

function EmptyState({
  title,
  description,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`rounded-xl border border-dashed border-line bg-shell px-6 py-14 text-center ${className}`}
    >
      <h2 className="text-xl">{title}</h2>
      {description && (
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}

export default EmptyState
