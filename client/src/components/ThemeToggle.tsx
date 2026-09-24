import { useTheme } from '../hooks/useTheme'

type ThemeToggleProps = {
  className?: string
}

function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { resolved, toggle } = useTheme()
  const goingDark = resolved === 'light'

  return (
    <button
      type="button"
      onClick={toggle}
      // Says what the button will do, not what the page currently is.
      aria-label={`Switch to ${goingDark ? 'night' : 'day'} mode`}
      title={`Switch to ${goingDark ? 'night' : 'day'} mode`}
      className={`rounded-full p-2 text-muted transition-colors hover:bg-shell hover:text-ink ${className}`}
    >
      <svg viewBox="0 0 20 20" className="size-5" aria-hidden="true">
        {goingDark ? (
          // Crescent moon
          <path
            d="M16.3 12.9A7 7 0 0 1 7.1 3.7a7 7 0 1 0 9.2 9.2z"
            fill="currentColor"
          />
        ) : (
          // Sun
          <>
            <circle cx="10" cy="10" r="3.6" fill="currentColor" />
            <path
              d="M10 1.6v2.2M10 16.2v2.2M18.4 10h-2.2M3.8 10H1.6M15.9 4.1l-1.6 1.6M5.7 14.3l-1.6 1.6M15.9 15.9l-1.6-1.6M5.7 5.7 4.1 4.1"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </>
        )}
      </svg>
    </button>
  )
}

export default ThemeToggle
