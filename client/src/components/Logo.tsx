type LogoProps = {
  /** Hide the wordmark and render the leaf alone (mobile header, favicon-ish uses). */
  markOnly?: boolean
  className?: string
}

/**
 * Inline SVG rather than an image file so the mark inherits `currentColor`
 * and recolours with the theme.
 */
function Logo({ markOnly = false, className = '' }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        viewBox="0 0 24 24"
        className="size-7 shrink-0"
        role="img"
        aria-label="Sage & Oak"
      >
        <path
          d="M12 2.5C6.8 6.6 4.8 12 12 21.5C19.2 12 17.2 6.6 12 2.5Z"
          fill="currentColor"
          opacity="0.15"
        />
        <path
          d="M12 2.5C6.8 6.6 4.8 12 12 21.5C19.2 12 17.2 6.6 12 2.5Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <path
          d="M12 21.5V7M12 12.5L8.6 9.8M12 12.5L15.4 9.8M12 16.6L9.2 14.2M12 16.6L14.8 14.2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
      </svg>
      {!markOnly && (
        <span className="font-display text-xl tracking-tight">
          Sage <span className="text-sage-500">&amp;</span> Oak
        </span>
      )}
    </span>
  )
}

export default Logo
