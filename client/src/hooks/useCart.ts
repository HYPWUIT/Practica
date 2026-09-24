import { useContext } from 'react'
import type { CartContextValue } from '../context/cart-context'
import { CartContext } from '../context/cart-context'

export function useCart(): CartContextValue {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used inside <CartProvider>')
  }
  return context
}
