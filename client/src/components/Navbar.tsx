import { Link, NavLink } from 'react-router'
import { useCart } from '../hooks/useCart'
import Logo from './Logo'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/catalog', label: 'Shop' },
  { to: '/best-sales', label: 'Best Sales' },
  { to: '/about', label: 'About' },
  { to: '/career', label: 'Career' },
  { to: '/contact', label: 'Contact' },
]

function Navbar() {
  const { count } = useCart()

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-canvas/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4">
        <Link to="/" className="text-sage-700">
          <Logo />
        </Link>

        {/* Mobile gets a scrollable strip for now; Phase 8 replaces it with a drawer. */}
        <ul className="flex flex-1 items-center gap-5 overflow-x-auto text-sm">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `whitespace-nowrap transition-colors hover:text-sage-600 ${
                    isActive ? 'text-sage-700' : 'text-muted'
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex shrink-0 items-center gap-4 text-sm">
          <Link to="/login" className="text-muted hover:text-sage-600">
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
        </div>
      </nav>
    </header>
  )
}

export default Navbar
