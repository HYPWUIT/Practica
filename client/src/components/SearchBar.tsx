import { useEffect, useState } from 'react'

type SearchBarProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

/** Typing updates the URL after a pause, so every keystroke is not a navigation. */
const DEBOUNCE_MS = 250

function SearchBar({ value, onChange, placeholder = 'Search' }: SearchBarProps) {
  const [draft, setDraft] = useState(value)
  const [lastValue, setLastValue] = useState(value)

  // Accept outside changes — clearing filters, or arriving on a pasted URL.
  if (lastValue !== value) {
    setLastValue(value)
    setDraft(value)
  }

  useEffect(() => {
    if (draft === value) return
    const timer = setTimeout(() => onChange(draft), DEBOUNCE_MS)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft])

  return (
    <div className="relative">
      <svg
        viewBox="0 0 20 20"
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted"
        aria-hidden="true"
      >
        <circle
          cx="9"
          cy="9"
          r="6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M13.5 13.5L18 18"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>

      <input
        type="search"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder={placeholder}
        aria-label="Search products"
        className="w-full rounded-full border border-line bg-canvas py-2.5 pr-4 pl-9 text-sm placeholder:text-muted/70 hover:border-sage-300"
      />
    </div>
  )
}

export default SearchBar
