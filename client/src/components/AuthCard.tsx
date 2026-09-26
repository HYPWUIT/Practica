import type { ReactNode } from 'react'
import { Link } from 'react-router'

type AuthCardProps = {
  title: string
  subtitle: string
  children: ReactNode
  /** The "No account? Create one" line. Omit it to hide the line. */
  footer?: {
    prompt: string
    linkLabel: string
    linkTo: string
  }
}

function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: AuthCardProps) {
  return (
    <section className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-3xl">{title}</h1>
      <p className="mt-2 text-sm text-muted">{subtitle}</p>

      <div className="mt-8 rounded-xl border border-line p-6">{children}</div>

      {footer && (
        <p className="mt-6 text-center text-sm text-muted">
          {footer.prompt}{' '}
          <Link to={footer.linkTo} className="text-sage-700 hover:underline">
            {footer.linkLabel}
          </Link>
        </p>
      )}
    </section>
  )
}

export default AuthCard
