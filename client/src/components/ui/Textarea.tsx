import type { Ref, TextareaHTMLAttributes } from 'react'
import { useId } from 'react'
import {
  errorClasses,
  fieldClasses,
  hintClasses,
  labelClasses,
} from './field-styles'

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string
  error?: string
  hint?: string
  ref?: Ref<HTMLTextAreaElement>
}

function Textarea({
  label,
  error,
  hint,
  id,
  className,
  rows = 5,
  ...rest
}: TextareaProps) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  const errorId = `${fieldId}-error`
  const hintId = `${fieldId}-hint`

  return (
    <div>
      <label htmlFor={fieldId} className={labelClasses}>
        {label}
      </label>
      <textarea
        id={fieldId}
        rows={rows}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : hint ? hintId : undefined}
        className={fieldClasses(Boolean(error), `resize-y ${className ?? ''}`)}
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

export default Textarea
