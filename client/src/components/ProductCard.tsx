import { Link } from 'react-router'
import { useCart } from '../hooks/useCart'
import { categoryLabels, materialLabels } from '../data/taxonomy'
import type { Product } from '../types/product'
import ProductArt from './ProductArt'
import Badge from './ui/Badge'
import Button from './ui/Button'
import PriceTag from './ui/PriceTag'

function ProductCard({ product }: { product: Product }) {
  const { add, isInCart } = useCart()
  const inCart = isInCart(product.id)

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-line transition-colors hover:border-sage-300">
      <Link
        to={`/product/${product.slug}`}
        className="relative block"
        // The heading link already names the product; keep this out of the
        // tab order rather than announcing the same destination twice.
        tabIndex={-1}
        aria-hidden="true"
      >
        <ProductArt
          category={product.category}
          color={product.color}
          className="aspect-[4/3]"
        />
        {(product.bestseller || !product.inStock) && (
          <div className="absolute top-3 left-3 flex gap-2">
            {product.bestseller && <Badge>Bestseller</Badge>}
            {!product.inStock && <Badge tone="neutral">Out of stock</Badge>}
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs tracking-wide text-muted uppercase">
          {categoryLabels[product.category]} ·{' '}
          {materialLabels[product.material]}
        </p>

        <h3 className="text-base leading-snug">
          <Link
            to={`/product/${product.slug}`}
            className="after:absolute after:inset-0 hover:text-sage-700"
          >
            {product.name}
          </Link>
        </h3>

        <PriceTag price={product.price} className="mt-auto" />

        <Button
          size="sm"
          variant={inCart ? 'secondary' : 'primary'}
          disabled={!product.inStock}
          onClick={() => add(product.id)}
          // Sits above the card-wide link overlay so the click lands here.
          className="relative z-10 mt-1"
        >
          {!product.inStock ? 'Out of stock' : inCart ? 'Add another' : 'Add to cart'}
        </Button>
      </div>
    </article>
  )
}

export default ProductCard
