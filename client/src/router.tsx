import { createBrowserRouter } from 'react-router'
import RootLayout from './layouts/RootLayout'
import AboutPage from './pages/AboutPage'
import BestSalesPage from './pages/BestSalesPage'
import CareerPage from './pages/CareerPage'
import CartPage from './pages/CartPage'
import CatalogPage from './pages/CatalogPage'
import CheckoutPage from './pages/CheckoutPage'
import ContactPage from './pages/ContactPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import NotFoundPage from './pages/NotFoundPage'
import ProductDetailPage from './pages/ProductDetailPage'
import SignupPage from './pages/SignupPage'

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
      { path: 'catalog', Component: CatalogPage },
      { path: 'product/:slug', Component: ProductDetailPage },
      { path: 'cart', Component: CartPage },
      { path: 'checkout', Component: CheckoutPage },
      { path: 'best-sales', Component: BestSalesPage },
      { path: 'about', Component: AboutPage },
      { path: 'career', Component: CareerPage },
      { path: 'contact', Component: ContactPage },
      { path: 'login', Component: LoginPage },
      { path: 'signup', Component: SignupPage },
      { path: '*', Component: NotFoundPage },
    ],
  },
])

export default router
