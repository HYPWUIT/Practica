import { RouterProvider } from 'react-router'
import { AuthProvider } from './context/AuthProvider'
import { CartProvider } from './context/CartProvider'
import router from './router'

/** Providers sit outside the router so state survives navigation. */
function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </AuthProvider>
  )
}

export default App
