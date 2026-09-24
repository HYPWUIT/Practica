import { priceBounds } from '../data/filters'
import { categoryLabels, colorLabels, materialLabels } from '../data/taxonomy'
import type { Category, ColorName, Material, Product } from '../types/product'

/**
 * Pure catalogue logic — no React, no hooks. Everything here is a function of
 * its arguments, which is what makes the filtering testable on its own and the
 * URL the single source of truth in the page.
 */

export type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'name'

export const sortOptions: { value: SortKey; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'name', label: 'Name: A–Z' },
]

export type Criteria = {
  q: string
  categories: Category[]
  materials: Material[]
  colors: ColorName[]
  /** Cents. */
  min: number
  max: number
  sort: SortKey
}

export const defaultCriteria: Criteria = {
  q: '',
  categories: [],
  materials: [],
  colors: [],
  min: priceBounds.min,
  max: priceBounds.max,
  sort: 'featured',
}

// ─── URL ⇄ criteria ─────────────────────────────────────────────────────

const validCategories = new Set(Object.keys(categoryLabels))
const validMaterials = new Set(Object.keys(materialLabels))
const validColors = new Set(Object.keys(colorLabels))
const validSorts = new Set<string>(sortOptions.map((option) => option.value))

/** Splits a comma list and drops anything not in the vocabulary. */
function parseList<T extends string>(
  raw: string | null,
  allowed: Set<string>,
): T[] {
  if (!raw) return []
  return raw
    .split(',')
    .map((value) => value.trim())
    .filter((value) => allowed.has(value)) as T[]
}

function parseBound(raw: string | null, fallback: number): number {
  const value = Number(raw)
  return Number.isFinite(value) && raw !== null && raw !== ''
    ? Math.min(Math.max(value, priceBounds.min), priceBounds.max)
    : fallback
}

/**
 * A hand-edited or stale URL must never break the page, so every value is
 * validated back to a known one here.
 */
export function parseCriteria(params: URLSearchParams): Criteria {
  const min = parseBound(params.get('min'), priceBounds.min)
  const max = parseBound(params.get('max'), priceBounds.max)
  const sort = params.get('sort')

  return {
    q: params.get('q')?.trim() ?? '',
    categories: parseList<Category>(params.get('category'), validCategories),
    materials: parseList<Material>(params.get('material'), validMaterials),
    colors: parseList<ColorName>(params.get('color'), validColors),
    // Swap reversed bounds rather than returning nothing.
    min: Math.min(min, max),
    max: Math.max(min, max),
    sort: sort && validSorts.has(sort) ? (sort as SortKey) : 'featured',
  }
}

/** Defaults are omitted so a URL only ever carries what the user changed. */
export function criteriaToParams(criteria: Criteria): URLSearchParams {
  const params = new URLSearchParams()

  if (criteria.q) params.set('q', criteria.q)
  if (criteria.categories.length)
    params.set('category', criteria.categories.join(','))
  if (criteria.materials.length)
    params.set('material', criteria.materials.join(','))
  if (criteria.colors.length) params.set('color', criteria.colors.join(','))
  if (criteria.min !== priceBounds.min) params.set('min', String(criteria.min))
  if (criteria.max !== priceBounds.max) params.set('max', String(criteria.max))
  if (criteria.sort !== 'featured') params.set('sort', criteria.sort)

  return params
}

/** How many filters are narrowing the results, for the "clear" affordance. */
export function activeFilterCount(criteria: Criteria): number {
  return (
    criteria.categories.length +
    criteria.materials.length +
    criteria.colors.length +
    (criteria.min !== priceBounds.min || criteria.max !== priceBounds.max
      ? 1
      : 0)
  )
}

// ─── Filtering ──────────────────────────────────────────────────────────

/** Everything a search term is allowed to match. */
function searchableText(product: Product): string {
  return [
    product.name,
    product.description,
    categoryLabels[product.category],
    materialLabels[product.material],
    colorLabels[product.color],
  ]
    .join(' ')
    .toLowerCase()
}

function matchesQuery(product: Product, query: string): boolean {
  if (!query) return true
  const haystack = searchableText(product)
  // Every word must appear, so extra words narrow rather than widen.
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => haystack.includes(term))
}

const comparators: Record<SortKey, (a: Product, b: Product) => number> = {
  featured: (a, b) =>
    Number(b.bestseller) - Number(a.bestseller) || a.name.localeCompare(b.name),
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  name: (a, b) => a.name.localeCompare(b.name),
}

export function filterProducts(
  products: Product[],
  criteria: Criteria,
  options: { bestsellersOnly?: boolean } = {},
): Product[] {
  const matched = products.filter((product) => {
    if (options.bestsellersOnly && !product.bestseller) return false
    if (product.price < criteria.min || product.price > criteria.max)
      return false
    if (
      criteria.categories.length &&
      !criteria.categories.includes(product.category)
    )
      return false
    if (
      criteria.materials.length &&
      !criteria.materials.includes(product.material)
    )
      return false
    if (criteria.colors.length && !criteria.colors.includes(product.color))
      return false
    return matchesQuery(product, criteria.q)
  })

  // `filter` already returned a fresh array, so sorting in place here does
  // not touch the shared module-level catalogue.
  return matched.sort(comparators[criteria.sort])
}
