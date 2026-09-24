import { createContext } from 'react'
import type { Product } from '../types/product'

/**
 * Context object and types only — no components, so the provider file stays
 * fast-refresh clean.
 */

/** Per-line ceiling, so a stuck key press cannot order forty sofas. */
export const MAX_QTY = 10

export type CartItem = {
  productId: string
  qty: number
}

/** A cart item joined with its product, ready to render. */
export type CartLine = {
  product: Product
  qty: number
  /** Cents. */
  lineTotal: number
}

export type CartContextValue = {
  items: CartItem[]
  /** Items joined with product data; unknown ids are dropped. */
  lines: CartLine[]
  /** Total units, for the navbar badge. */
  count: number
  /** Cents. */
  subtotal: number
  add: (productId: string, qty?: number) => void
  remove: (productId: string) => void
  setQty: (productId: string, qty: number) => void
  clear: () => void
  isInCart: (productId: string) => boolean
}

export const CartContext = createContext<CartContextValue | null>(null)
