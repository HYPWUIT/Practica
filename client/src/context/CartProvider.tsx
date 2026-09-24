import type { ReactNode } from 'react'
import { useMemo, useReducer } from 'react'
import { products } from '../data/products'
import type { CartContextValue, CartItem, CartLine } from './cart-context'
import { CartContext, MAX_QTY } from './cart-context'

type CartAction =
  | { type: 'add'; productId: string; qty: number }
  | { type: 'remove'; productId: string }
  | { type: 'setQty'; productId: string; qty: number }
  | { type: 'clear' }

const productIds = new Set(products.map((product) => product.id))

function clampQty(qty: number): number {
  return Math.min(Math.max(Math.round(qty), 0), MAX_QTY)
}

function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case 'add': {
      // Reject ids with no product: otherwise they sit in the cart forever,
      // counted by the badge but invisible on the cart page.
      if (!productIds.has(action.productId)) return state

      const existing = state.find((item) => item.productId === action.productId)
      if (!existing) {
        const qty = clampQty(action.qty)
        return qty > 0 ? [...state, { productId: action.productId, qty }] : state
      }
      // Adding an item already in the cart tops up its quantity.
      return state.map((item) =>
        item.productId === action.productId
          ? { ...item, qty: clampQty(item.qty + action.qty) }
          : item,
      )
    }

    case 'setQty': {
      const qty = clampQty(action.qty)
      // Dropping to zero is how the stepper removes a line.
      if (qty === 0) {
        return state.filter((item) => item.productId !== action.productId)
      }
      return state.map((item) =>
        item.productId === action.productId ? { ...item, qty } : item,
      )
    }

    case 'remove':
      return state.filter((item) => item.productId !== action.productId)

    case 'clear':
      return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, [])

  const value = useMemo<CartContextValue>(() => {
    const byId = new Map(products.map((product) => [product.id, product]))

    const lines = items.flatMap<CartLine>((item) => {
      const product = byId.get(item.productId)
      // Defensive: a cart id with no product would otherwise crash the page.
      if (!product) return []
      return [{ product, qty: item.qty, lineTotal: product.price * item.qty }]
    })

    return {
      items,
      lines,
      // Counted from `lines`, not `items`, so the badge can never disagree
      // with what the cart page actually shows.
      count: lines.reduce((total, line) => total + line.qty, 0),
      subtotal: lines.reduce((total, line) => total + line.lineTotal, 0),
      add: (productId, qty = 1) => dispatch({ type: 'add', productId, qty }),
      remove: (productId) => dispatch({ type: 'remove', productId }),
      setQty: (productId, qty) => dispatch({ type: 'setQty', productId, qty }),
      clear: () => dispatch({ type: 'clear' }),
      isInCart: (productId) =>
        items.some((item) => item.productId === productId),
    }
  }, [items])

  return <CartContext value={value}>{children}</CartContext>
}
