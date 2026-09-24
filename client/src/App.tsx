import { RouterProvider } from 'react-router'
import { AuthProvider } from './context/AuthProvider'
import { CartProvider } from './context/CartProvider'
import { ToastProvider } from './context/ToastProvider'
import router from './router'

/** Providers sit outside the router so state survives navigation. */
function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <CartProvider>
          <RouterProvider router={router} />
        </CartProvider>
      </ToastProvider>
    </AuthProvider>
  )
}

export default App
