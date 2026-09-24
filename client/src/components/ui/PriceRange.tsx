import { useState } from 'react'
import { formatPrice } from '../../lib/format'

type PriceRangeProps = {
  /** All in cents. */
  min: number
  max: number
  step: number
  value: { min: number; max: number }
  /** Fired when the user lets go, not on every pixel of a drag. */
  onCommit: (value: { min: number; max: number }) => void
}

/**
 * Two range inputs stacked on one track. The thumbs can never cross: each one
 * is clamped a step away from the other.
 */
function PriceRange({ min, max, step, value, onCommit }: PriceRangeProps) {
  const [draft, setDraft] = useState(value)
  const [lastValue, setLastValue] = useState(value)

  // Accept outside changes (clearing filters, a pasted URL) without fighting
  // the user mid-drag. Adjusted during render rather than in an effect, so
  // there is no throwaway pass painting the stale range first.
  if (lastValue.min !== value.min || lastValue.max !== value.max) {
    setLastValue(value)
    setDraft(value)
  }

  const span = max - min
  const leftPct = ((draft.min - min) / span) * 100
  const rightPct = ((max - draft.max) / span) * 100

  const commit = () => {
    if (draft.min !== value.min || draft.max !== value.max) onCommit(draft)
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between text-sm">
        <span className="text-ink">{formatPrice(draft.min)}</span>
        <span className="text-muted">to</span>
        <span className="text-ink">{formatPrice(draft.max)}</span>
      </div>

      <div
        className="relative h-4"
        onPointerUp={commit}
        onKeyUp={commit}
        onBlur={commit}
      >
        <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-line" />
        <div
          className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-sage-500"
          style={{ left: `${leftPct}%`, right: `${rightPct}%` }}
        />

        <input
          type="range"
          aria-label="Minimum price"
          min={min}
          max={max}
          step={step}
          value={draft.min}
          onChange={(event) =>
            setDraft((prev) => ({
              ...prev,
              min: Math.min(Number(event.target.value), prev.max - step),
            }))
          }
          className="range-input absolute inset-x-0 top-0 h-4 w-full"
        />
        <input
          type="range"
          aria-label="Maximum price"
          min={min}
          max={max}
          step={step}
          value={draft.max}
          onChange={(event) =>
            setDraft((prev) => ({
              ...prev,
              max: Math.max(Number(event.target.value), prev.min + step),
            }))
          }
          className="range-input absolute inset-x-0 top-0 h-4 w-full"
        />
      </div>
    </div>
  )
}

export default PriceRange
