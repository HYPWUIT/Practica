import type { InputHTMLAttributes, ReactNode } from 'react'
import { useId } from 'react'

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label: ReactNode
  /** Shown greyed after the label — the facet's result count. */
  count?: number
}

function Checkbox({ label, count, id, className = '', ...rest }: CheckboxProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <input
        id={inputId}
        type="checkbox"
        className="size-4 shrink-0 accent-sage-600"
        {...rest}
      />
      <label
        htmlFor={inputId}
        className="flex-1 cursor-pointer text-sm text-ink select-none"
      >
        {label}
        {count !== undefined && (
          <span className="ml-1.5 text-xs text-muted">({count})</span>
        )}
      </label>
    </div>
  )
}

export default Checkbox
