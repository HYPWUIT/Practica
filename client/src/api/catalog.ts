import type { Job, Product } from '@sage-oak/shared'
import type { Criteria } from '../lib/filter'
import { criteriaToParams } from '../lib/filter'

/**
 * Every catalogue read goes through here, so pages only ever see these five
 * functions and never a URL.
 *
 * Paths are relative: in development Vite proxies `/api` to the server (see
 * vite.config.ts), which keeps the app and the API on one origin.
 */

/** A non-2xx response. `status` lets callers treat e.g. a 404 as data. */
export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`/api${path}`)
  if (!response.ok) {
    // The server's error body is `{ error }`; fall back if it is not JSON.
    const body = (await response.json().catch(() => null)) as {
      error?: string
    } | null
    throw new ApiError(
      response.status,
      body?.error ?? `Request failed (${response.status})`,
    )
  }
  return response.json() as Promise<T>
}

export function fetchCatalog(
  criteria: Criteria,
  options: { bestsellersOnly?: boolean } = {},
): Promise<Product[]> {
  // The API takes the same parameters as the catalogue page's URL.
  const params = criteriaToParams(criteria)
  if (options.bestsellersOnly) params.set('bestseller', 'true')
  return getJson(`/products?${params}`)
}

/** Resolves `null` for an unknown slug — a missing product is not an error. */
export async function fetchProduct(slug: string): Promise<Product | null> {
  try {
    return await getJson(`/products/${encodeURIComponent(slug)}`)
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null
    throw error
  }
}

export function fetchRelated(slug: string, limit = 3): Promise<Product[]> {
  return getJson(
    `/products/${encodeURIComponent(slug)}/related?limit=${limit}`,
  )
}

export function fetchBestsellers(limit = 3): Promise<Product[]> {
  return getJson(`/products/bestsellers?limit=${limit}`)
}

export function fetchJobs(): Promise<Job[]> {
  return getJson('/jobs')
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
