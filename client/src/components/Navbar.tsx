import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { useCart } from '../hooks/useCart'
import Logo from './Logo'
import Sheet from './ui/Sheet'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/catalog', label: 'Shop' },
  { to: '/best-sales', label: 'Best Sales' },
  { to: '/about', label: 'About' },
  { to: '/career', label: 'Career' },
  { to: '/contact', label: 'Contact' },
]

const linkClasses = ({ isActive }: { isActive: boolean }) =>
  `whitespace-nowrap transition-colors hover:text-sage-600 ${
    isActive ? 'text-sage-700' : 'text-muted'
  }`

function Navbar() {
  const { count } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  // Close the drawer whenever the route changes, including on back/forward.
  const [lastPath, setLastPath] = useState(location.pathname)
  if (lastPath !== location.pathname) {
    setLastPath(location.pathname)
    if (menuOpen) setMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-canvas/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4">
        <Link to="/" className="text-sage-700">
          <Logo />
        </Link>

        <ul className="hidden flex-1 items-center gap-5 text-sm lg:flex">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink to={link.to} end={link.end} className={linkClasses}>
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex shrink-0 items-center gap-2 text-sm sm:gap-4 lg:ml-0">
          <Link
            to="/login"
            className="hidden text-muted hover:text-sage-600 sm:inline"
          >
            Sign in
          </Link>

          <Link
            to="/cart"
            className="flex items-center gap-2 rounded-full bg-sage-600 px-4 py-2 text-canvas transition-colors hover:bg-sage-700"
            aria-label={`Cart, ${count} ${count === 1 ? 'item' : 'items'}`}
          >
            Cart
            {count > 0 && (
              <span className="min-w-5 rounded-full bg-canvas/25 px-1.5 text-center text-xs leading-5">
                {count}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            className="-mr-2 rounded-full p-2 text-muted hover:bg-shell hover:text-ink lg:hidden"
          >
            <svg viewBox="0 0 20 20" className="size-5" aria-hidden="true">
              <path
                d="M3 6h14M3 10h14M3 14h14"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </button>
        </div>
      </nav>

      <Sheet open={menuOpen} onClose={() => setMenuOpen(false)} title="Menu">
        <ul className="space-y-1 text-base">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `block rounded-lg px-3 py-2.5 transition-colors hover:bg-shell ${
                    isActive ? 'bg-shell text-sage-700' : 'text-ink'
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
          <li className="border-t border-line pt-1">
            <NavLink
              to="/login"
              className="block rounded-lg px-3 py-2.5 text-ink transition-colors hover:bg-shell"
            >
              Sign in
            </NavLink>
          </li>
        </ul>
      </Sheet>
    </header>
  )
}

export default Navbar
