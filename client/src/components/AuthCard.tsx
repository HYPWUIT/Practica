import type { ReactNode } from 'react'
import { Link } from 'react-router'

type AuthCardProps = {
  title: string
  subtitle: string
  children: ReactNode
  footerPrompt: string
  footerLinkLabel: string
  footerLinkTo: string
}

function AuthCard({
  title,
  subtitle,
  children,
  footerPrompt,
  footerLinkLabel,
  footerLinkTo,
}: AuthCardProps) {
  return (
    <section className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-3xl">{title}</h1>
      <p className="mt-2 text-sm text-muted">{subtitle}</p>

      <div className="mt-8 rounded-xl border border-line p-6">{children}</div>

      <p className="mt-6 text-center text-sm text-muted">
        {footerPrompt}{' '}
        <Link to={footerLinkTo} className="text-sage-700 hover:underline">
          {footerLinkLabel}
        </Link>
      </p>
    </section>
  )
}

export default AuthCard
