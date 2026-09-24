import type { ReactNode } from 'react'

type BadgeTone = 'sage' | 'neutral' | 'warning'

const tones: Record<BadgeTone, string> = {
  sage: 'bg-sage-100 text-sage-800',
  neutral: 'bg-shell text-muted',
  warning: 'bg-amber-100 text-amber-900',
}

type BadgeProps = {
  children: ReactNode
  tone?: BadgeTone
  className?: string
}

function Badge({ children, tone = 'sage', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  )
}

export default Badge
