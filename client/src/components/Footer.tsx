import { Link } from 'react-router'
import Logo from './Logo'

const columns = [
  {
    heading: 'Shop',
    links: [
      { to: '/catalog', label: 'All furniture' },
      { to: '/best-sales', label: 'Best sales' },
      { to: '/cart', label: 'Your cart' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { to: '/about', label: 'About us' },
      { to: '/career', label: 'Careers' },
      { to: '/contact', label: 'Contact' },
    ],
  },
  {
    heading: 'Account',
    links: [
      { to: '/login', label: 'Sign in' },
      { to: '/signup', label: 'Create account' },
    ],
  },
]

function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-shell">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo className="text-sage-700" />
          <p className="mt-3 max-w-xs text-sm text-muted">
            Furniture made to be lived with — sturdy, honest, and built to
            outlast a trend.
          </p>
        </div>

        {columns.map((column) => (
          <div key={column.heading}>
            <h3 className="font-sans text-xs font-semibold tracking-widest text-ink uppercase">
              {column.heading}
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              {column.links.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-muted hover:text-sage-600">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-line">
        <p className="mx-auto max-w-6xl px-4 py-6 text-xs text-muted">
          © {new Date().getFullYear()} Sage &amp; Oak. A frontend practice
          project — no orders are really placed.
        </p>
      </div>
    </footer>
  )
}

export default Footer
