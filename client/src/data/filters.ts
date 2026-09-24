import type {
  Category,
  ColorName,
  FacetOption,
  Material,
  Product,
} from '../types/product'
import { products } from './products'
import {
  categoryLabels,
  categoryOrder,
  colorLabels,
  materialLabels,
} from './taxonomy'

/**
 * Filter options are derived from the catalogue rather than hand-listed, so
 * adding a product never means remembering to edit a second file.
 */

function countBy<T extends string>(
  items: Product[],
  pick: (product: Product) => T,
): Map<T, number> {
  const counts = new Map<T, number>()
  for (const item of items) {
    const key = pick(item)
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }
  return counts
}

function toOptions<T extends string>(
  counts: Map<T, number>,
  labels: Record<T, string>,
  order?: T[],
): FacetOption<T>[] {
  const keys = order
    ? order.filter((key) => counts.has(key))
    : [...counts.keys()].sort((a, b) => labels[a].localeCompare(labels[b]))

  return keys.map((value) => ({
    value,
    label: labels[value],
    count: counts.get(value) ?? 0,
  }))
}

export const categoryOptions: FacetOption<Category>[] = toOptions(
  countBy(products, (p) => p.category),
  categoryLabels,
  categoryOrder,
)

export const materialOptions: FacetOption<Material>[] = toOptions(
  countBy(products, (p) => p.material),
  materialLabels,
)

export const colorOptions: FacetOption<ColorName>[] = toOptions(
  countBy(products, (p) => p.color),
  colorLabels,
)

/** Bounds for the price slider, in cents, widened to clean round values. */
export const priceBounds = (() => {
  const prices = products.map((p) => p.price)
  const step = 10000 // $100
  return {
    min: Math.floor(Math.min(...prices) / step) * step,
    max: Math.ceil(Math.max(...prices) / step) * step,
    step,
  }
})()
