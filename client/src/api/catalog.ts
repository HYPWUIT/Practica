import { jobs } from '../data/jobs'
import type { Job } from '../data/jobs'
import { getProductBySlug, products } from '../data/products'
import type { Criteria } from '../lib/filter'
import { filterProducts } from '../lib/filter'
import type { Product } from '../types/product'

/**
 * A stand-in for the API this shop does not have yet.
 *
 * Everything resolves from the static catalogue after a short delay, so the
 * app has genuine pending and error states to render. When a backend arrives,
 * these five function bodies become `fetch` calls and nothing above them
 * changes — that is the whole point of routing reads through here.
 */

/** Long enough to see a skeleton, short enough not to irritate. */
const LATENCY_MS = 450

function respond<T>(value: T, ms = LATENCY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

export function fetchCatalog(
  criteria: Criteria,
  options: { bestsellersOnly?: boolean } = {},
): Promise<Product[]> {
  return respond(filterProducts(products, criteria, options))
}

/** Resolves `null` for an unknown slug — a missing product is not an error. */
export function fetchProduct(slug: string): Promise<Product | null> {
  return respond(getProductBySlug(slug) ?? null)
}

export function fetchRelated(slug: string, limit = 3): Promise<Product[]> {
  const product = getProductBySlug(slug)
  if (!product) return respond([])

  return respond(
    products
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, limit),
  )
}

export function fetchBestsellers(limit = 3): Promise<Product[]> {
  return respond(products.filter((p) => p.bestseller).slice(0, limit))
}

export function fetchJobs(): Promise<Job[]> {
  return respond(jobs)
}

/** Query keys in one place, so a cache invalidation cannot miss one. */
export const queryKeys = {
  catalog: (criteria: Criteria, bestsellersOnly: boolean) =>
    ['catalog', { criteria, bestsellersOnly }] as const,
  product: (slug: string) => ['product', slug] as const,
  related: (slug: string) => ['product', slug, 'related'] as const,
  bestsellers: (limit: number) => ['bestsellers', limit] as const,
  jobs: () => ['jobs'] as const,
}
