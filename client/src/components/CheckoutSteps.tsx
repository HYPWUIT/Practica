import type { StepId } from './checkout-steps'
import { stepLabels, stepOrder } from './checkout-steps'

function CheckoutSteps({ current }: { current: StepId }) {
  const currentIndex = stepOrder.indexOf(current)

  return (
    <ol className="mb-10 flex items-center gap-3 text-sm">
      {stepOrder.map((step, index) => {
        const done = index < currentIndex
        const active = index === currentIndex

        return (
          <li key={step} className="flex items-center gap-3">
            <span
              className="flex items-center gap-2"
              aria-current={active ? 'step' : undefined}
            >
              <span
                className={`grid size-6 place-items-center rounded-full text-xs ${
                  done || active
                    ? 'bg-sage-600 text-canvas'
                    : 'bg-shell text-muted'
                }`}
              >
                {done ? '✓' : index + 1}
              </span>
              <span className={active ? 'text-ink' : 'text-muted'}>
                {stepLabels[step]}
              </span>
            </span>
            {index < stepOrder.length - 1 && (
              <span aria-hidden="true" className="h-px w-8 bg-line" />
            )}
          </li>
        )
      })}
    </ol>
  )
}

export default CheckoutSteps
