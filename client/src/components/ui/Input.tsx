import type { InputHTMLAttributes, Ref } from 'react'
import { useId } from 'react'
import {
  errorClasses,
  fieldClasses,
  hintClasses,
  labelClasses,
} from './field-styles'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  error?: string
  hint?: string
  /** React 19 passes refs as a plain prop, so `{...register()}` spreads in. */
  ref?: Ref<HTMLInputElement>
}

function Input({ label, error, hint, id, className, ...rest }: InputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const errorId = `${inputId}-error`
  const hintId = `${inputId}-hint`

  return (
    <div>
      <label htmlFor={inputId} className={labelClasses}>
        {label}
      </label>
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : hint ? hintId : undefined}
        className={fieldClasses(Boolean(error), className)}
        {...rest}
      />
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

export default Input
