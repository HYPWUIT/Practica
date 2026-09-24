type QuantityStepperProps = {
  value: number
  onChange: (value: number) => void
  min?: number
  max: number
  /** Distinguishes the controls when several sit on one page (the cart). */
  label?: string
}

const stepButton =
  'grid size-9 place-items-center text-lg text-muted transition-colors hover:bg-shell hover:text-ink disabled:cursor-not-allowed disabled:opacity-40'

function QuantityStepper({
  value,
  onChange,
  min = 1,
  max,
  label = 'Quantity',
}: QuantityStepperProps) {
  return (
    <div
      role="group"
      aria-label={label}
      className="inline-flex items-center rounded-full border border-line"
    >
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label={`Decrease ${label.toLowerCase()}`}
        className={`${stepButton} rounded-l-full`}
      >
        −
      </button>

      {/* Not an input: free-typing a quantity invites 0, -3 and "abc". */}
      <span aria-live="polite" className="w-9 text-center text-sm tabular-nums">
        {value}
      </span>

      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label={`Increase ${label.toLowerCase()}`}
        className={`${stepButton} rounded-r-full`}
      >
        +
      </button>
    </div>
  )
}

export default QuantityStepper
