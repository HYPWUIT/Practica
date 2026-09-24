import type { Ref, SelectHTMLAttributes } from 'react'
import { useId } from 'react'
import {
  errorClasses,
  fieldClasses,
  hintClasses,
  labelClasses,
} from './field-styles'

type SelectOption = {
  value: string
  label: string
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string
  options: SelectOption[]
  /** Shown as a disabled first entry, so the field can start genuinely empty. */
  placeholder?: string
  error?: string
  hint?: string
  ref?: Ref<HTMLSelectElement>
}

function Select({
  label,
  options,
  placeholder,
  error,
  hint,
  id,
  className,
  defaultValue,
  ...rest
}: SelectProps) {
  const generatedId = useId()
  const selectId = id ?? generatedId
  const errorId = `${selectId}-error`
  const hintId = `${selectId}-hint`

  return (
    <div>
      <label htmlFor={selectId} className={labelClasses}>
        {label}
      </label>
      <select
        id={selectId}
        defaultValue={defaultValue ?? (placeholder ? '' : undefined)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : hint ? hintId : undefined}
        className={fieldClasses(Boolean(error), className)}
        {...rest}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? (
        <p id={errorId} role="alert" className={errorClasses}>
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className={hintClasses}>
          {hint}
        </p>
      ) : null}
    </div>
  )
}

export default Select
