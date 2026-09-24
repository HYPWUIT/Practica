import Button from './ui/Button'

type QueryErrorProps = {
  title?: string
  onRetry: () => void
  className?: string
}

/** Shown when a query fails. Retry re-runs the query rather than reloading. */
function QueryError({
  title = 'That did not load',
  onRetry,
  className = '',
}: QueryErrorProps) {
  return (
    <div
      role="alert"
      className={`rounded-xl border border-line bg-shell px-6 py-12 text-center ${className}`}
    >
      <h2 className="text-xl">{title}</h2>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
        Something went wrong on the way. Trying again usually settles it.
      </p>
      <Button variant="secondary" className="mt-6" onClick={onRetry}>
        Try again
      </Button>
    </div>
  )
}

export default QueryError
