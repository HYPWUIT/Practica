import { useState } from 'react'
import { Link } from 'react-router'
import ProductArt from '../components/ProductArt'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import Modal from '../components/ui/Modal'
import QuantityStepper from '../components/ui/QuantityStepper'
import { buttonClasses } from '../components/ui/button-styles'
import { MAX_QTY } from '../context/cart-context'
import { categoryLabels, materialLabels } from '../data/taxonomy'
import { useCart } from '../hooks/useCart'
import { formatPrice } from '../lib/format'

function CartPage() {
  const { lines, count, subtotal, setQty, remove, clear } = useCart()
  const [confirmClear, setConfirmClear] = useState(false)

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20">
        <h1 className="mb-8 text-center text-4xl">Your cart</h1>
        <EmptyState
          title="Nothing in here yet"
          description="Once you add something, it will wait for you here."
          action={
            <Link to="/catalog" className={buttonClasses()}>
              Browse the shop
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl">Your cart</h1>
          <p className="mt-2 text-muted">
            {count} {count === 1 ? 'item' : 'items'}
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setConfirmClear(true)}>
          Clear cart
        </Button>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_20rem]">
        <ul className="space-y-4">
          {lines.map((line) => (
            <li
              key={line.product.id}
              className="flex gap-4 rounded-xl border border-line p-4"
            >
              <Link
                to={`/product/${line.product.slug}`}
                className="shrink-0"
                aria-hidden="true"
                tabIndex={-1}
              >
                <ProductArt
                  category={line.product.category}
                  color={line.product.color}
                  className="size-24 rounded-lg sm:size-28"
                />
              </Link>

              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs tracking-wide text-muted uppercase">
                      {categoryLabels[line.product.category]} ·{' '}
                      {materialLabels[line.product.material]}
                    </p>
                    <h2 className="truncate text-base">
                      <Link
                        to={`/product/${line.product.slug}`}
                        className="hover:text-sage-700"
                      >
                        {line.product.name}
                      </Link>
                    </h2>
                    <p className="mt-0.5 text-sm text-muted">
                      {formatPrice(line.product.price)} each
                    </p>
                  </div>

                  <p className="shrink-0 text-base tabular-nums">
                    {formatPrice(line.lineTotal)}
                  </p>
                </div>

                <div className="mt-auto flex items-center gap-3">
                  <QuantityStepper
                    value={line.qty}
                    onChange={(qty) => setQty(line.product.id, qty)}
                    max={MAX_QTY}
                    label={`Quantity for ${line.product.name}`}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(line.product.id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded-xl border border-line p-5 lg:sticky lg:top-24">
          <h2 className="text-lg">Summary</h2>

          <dl className="mt-4 space-y-2.5 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Delivery</dt>
              <dd className="text-sage-700">Free</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-3 text-base">
              <dt>Total</dt>
              <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
            </div>
          </dl>

          <Link
            to="/checkout"
            className={buttonClasses({ fullWidth: true, className: 'mt-6' })}
          >
            Checkout
          </Link>
          <Link
            to="/catalog"
            className="mt-3 block text-center text-sm text-muted hover:text-sage-700"
          >
            Keep shopping
          </Link>
        </aside>
      </div>

      <Modal
        open={confirmClear}
        onClose={() => setConfirmClear(false)}
        title="Empty your cart?"
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmClear(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                clear()
                setConfirmClear(false)
              }}
            >
              Empty cart
            </Button>
          </>
        }
      >
        <p>
          This removes all {count} {count === 1 ? 'item' : 'items'}. There is no
          undo.
        </p>
      </Modal>
    </div>
  )
}

export default CartPage
