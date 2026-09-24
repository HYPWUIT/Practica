import { useState } from 'react'
import { Link, useParams } from 'react-router'
import ProductArt from '../components/ProductArt'
import ProductGrid from '../components/ProductGrid'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import PriceTag from '../components/ui/PriceTag'
import QuantityStepper from '../components/ui/QuantityStepper'
import { buttonClasses } from '../components/ui/button-styles'
import { MAX_QTY } from '../context/cart-context'
import { getProductBySlug, products } from '../data/products'
import {
  categoryLabels,
  colorLabels,
  materialLabels,
} from '../data/taxonomy'
import { useCart } from '../hooks/useCart'
import { useToast } from '../hooks/useToast'
import { formatDimensions } from '../lib/format'
import type { Product } from '../types/product'

/** Same category, never itself, capped so the strip stays one row. */
function relatedTo(product: Product): Product[] {
  return products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3)
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-line py-2.5">
      <dt className="text-muted">{label}</dt>
      <dd className="text-right text-ink">{value}</dd>
    </div>
  )
}

function ProductDetailPage() {
  const { slug } = useParams()
  const product = slug ? getProductBySlug(slug) : undefined

  const { add } = useCart()
  const { notify } = useToast()
  const [qty, setQty] = useState(1)

  // Clicking through the related strip reuses this component rather than
  // remounting it, so the previous product's quantity would linger.
  const [lastSlug, setLastSlug] = useState(slug)
  if (lastSlug !== slug) {
    setLastSlug(slug)
    setQty(1)
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20">
        <EmptyState
          title="We could not find that piece"
          description="It may have been renamed, or the link may be wrong."
          action={
            <Link to="/catalog" className={buttonClasses()}>
              Browse the shop
            </Link>
          }
        />
      </div>
    )
  }

  const related = relatedTo(product)

  const handleAdd = () => {
    add(product.id, qty)
    notify(
      `${product.name}${qty > 1 ? ` × ${qty}` : ''} added to your cart.`,
      { label: 'View cart', to: '/cart' },
    )
    setQty(1)
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <nav aria-label="Breadcrumb" className="mb-8 text-sm text-muted">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link to="/" className="hover:text-sage-700">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link to="/catalog" className="hover:text-sage-700">
              Shop
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link
              to={`/catalog?category=${product.category}`}
              className="hover:text-sage-700"
            >
              {categoryLabels[product.category]}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-ink">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <ProductArt
          category={product.category}
          color={product.color}
          className="aspect-[4/3] rounded-xl"
        />

        <div>
          <div className="flex flex-wrap gap-2">
            {product.bestseller && <Badge>Bestseller</Badge>}
            <Badge tone={product.inStock ? 'neutral' : 'warning'}>
              {product.inStock ? 'In stock' : 'Out of stock'}
            </Badge>
          </div>

          <h1 className="mt-4 text-4xl">{product.name}</h1>
          <PriceTag price={product.price} size="lg" className="mt-3" />

          <p className="mt-5 max-w-prose text-muted">{product.description}</p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <QuantityStepper value={qty} onChange={setQty} max={MAX_QTY} />
            <Button
              size="lg"
              onClick={handleAdd}
              disabled={!product.inStock}
              className="flex-1 sm:flex-none"
            >
              {product.inStock ? 'Add to cart' : 'Out of stock'}
            </Button>
          </div>
          {product.inStock && (
            <p className="mt-2 text-xs text-muted">
              Limit {MAX_QTY} per order.
            </p>
          )}

          <dl className="mt-10 text-sm">
            <Spec label="Category" value={categoryLabels[product.category]} />
            <Spec label="Material" value={materialLabels[product.material]} />
            <Spec label="Colour" value={colorLabels[product.color]} />
            <Spec
              label="Dimensions (W × D × H)"
              value={formatDimensions(product.dimensions)}
            />
          </dl>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-6 text-2xl">
            More {categoryLabels[product.category].toLowerCase()}
          </h2>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  )
}

export default ProductDetailPage
