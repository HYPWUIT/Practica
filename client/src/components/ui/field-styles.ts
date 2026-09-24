/** Shared look for Input, Textarea and Select so they line up in a form. */
export function fieldClasses(hasError: boolean, className = ''): string {
  return [
    'w-full rounded-lg border bg-canvas px-3 py-2.5 text-sm text-ink transition-colors',
    'placeholder:text-muted/70 disabled:cursor-not-allowed disabled:bg-shell',
    hasError
      ? 'border-red-500 focus-visible:outline-red-500'
      : 'border-line hover:border-sage-300',
    className,
  ]
    .filter(Boolean)
    .join(' ')
}

export const labelClasses = 'mb-1.5 block text-sm font-medium text-ink'
export const hintClasses = 'mt-1.5 text-xs text-muted'
export const errorClasses = 'mt-1.5 text-xs text-red-700'
