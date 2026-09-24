import type { Product } from '../types/product'
import ProductCard from './ProductCard'

type ProductGridProps = {
  products: Product[]
  className?: string
}

function ProductGrid({ products, className = '' }: ProductGridProps) {
  return (
    <ul
      className={`grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 ${className}`}
    >
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  )
}

export default ProductGrid
