import type { Dimensions } from '../types/product'

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

/** Prices are stored in cents; never render the raw number. */
export function formatPrice(cents: number): string {
  return priceFormatter.format(cents / 100)
}

export function formatDimensions({ width, depth, height }: Dimensions): string {
  return `${width} × ${depth} × ${height} cm`
}
