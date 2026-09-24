import { formatPrice } from '../../lib/format'

type PriceTagProps = {
  /** Cents. */
  price: number
  /** Cents. Rendered struck through when higher than `price`. */
  compareAt?: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizes = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-2xl',
}

function PriceTag({ price, compareAt, size = 'md', className = '' }: PriceTagProps) {
  const discounted = compareAt !== undefined && compareAt > price

  return (
    <span className={`inline-flex items-baseline gap-2 ${sizes[size]} ${className}`}>
      <span className={discounted ? 'text-red-700' : 'text-ink'}>
        {formatPrice(price)}
      </span>
      {discounted && (
        <span className="text-sm text-muted line-through">
          {formatPrice(compareAt)}
        </span>
      )}
    </span>
  )
}

export default PriceTag
