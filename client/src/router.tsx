import type { ComponentType } from 'react'
import { createBrowserRouter } from 'react-router'
import RootLayout from './layouts/RootLayout'
import HomePage from './pages/HomePage'

/**
 * Every route but the landing page is code-split, which keeps the first load
 * to the shell plus Home rather than the whole shop.
 *
 * `lazy` expects a module exposing `Component`; our pages use a default
 * export, hence the small adapter on each line.
 */
const page =
  (load: () => Promise<{ default: ComponentType }>) => async () => ({
    Component: (await load()).default,
  })

/**
 * Checkout is deliberately not guarded: auth is validation-only for now, so
 * there is no logged-in state to guard it with. See project-scope.md.
 */
const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      { index: true, Component: HomePage },
      { path: 'catalog', lazy: page(() => import('./pages/CatalogPage')) },
      {
        path: 'product/:slug',
        lazy: page(() => import('./pages/ProductDetailPage')),
      },
      { path: 'cart', lazy: page(() => import('./pages/CartPage')) },
      { path: 'checkout', lazy: page(() => import('./pages/CheckoutPage')) },
      { path: 'best-sales', lazy: page(() => import('./pages/BestSalesPage')) },
      { path: 'about', lazy: page(() => import('./pages/AboutPage')) },
      { path: 'career', lazy: page(() => import('./pages/CareerPage')) },
      { path: 'contact', lazy: page(() => import('./pages/ContactPage')) },
      { path: 'login', lazy: page(() => import('./pages/LoginPage')) },
      { path: 'signup', lazy: page(() => import('./pages/SignupPage')) },
      { path: '*', lazy: page(() => import('./pages/NotFoundPage')) },
    ],
  },
])

export default router
