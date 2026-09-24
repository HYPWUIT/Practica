import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router'
import { queryClient } from './api/queryClient'
import { AuthProvider } from './context/AuthProvider'
import { CartProvider } from './context/CartProvider'
import { ToastProvider } from './context/ToastProvider'
import router from './router'

/** Providers sit outside the router so state survives navigation. */
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <CartProvider>
            <RouterProvider router={router} />
          </CartProvider>
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
