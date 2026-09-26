import { describe, expect, test } from 'bun:test'
import type { Job, Product } from '@sage-oak/shared'
import { jobs, products } from '@sage-oak/shared/data'
// The client's own filtering, which the pages used before the API existed.
// It is the specification here: the API must return exactly what it did.
import type { Criteria } from '../../client/src/lib/filter'
import {
  criteriaToParams,
  defaultCriteria,
  filterProducts,
} from '../../client/src/lib/filter'
import { startTestServer } from './server'

const { api } = startTestServer()

const slugs = (list: { slug: string }[]) => list.map((p) => p.slug)

async function getJson<T>(path: string): Promise<T> {
  const response = await api(path)
  expect(response.status).toBe(200)
  return response.json() as Promise<T>
}

describe('GET /api/products matches the client-side filter', () => {
  const cases: [string, Partial<Criteria>, boolean?][] = [
    ['no filters', {}],
    ['price ascending', { sort: 'price-asc' }],
    ['price descending', { sort: 'price-desc' }],
    ['name', { sort: 'name' }],
    ['one category', { categories: ['sofas'] }],
    ['two categories, sorted', { categories: ['sofas', 'beds'], sort: 'price-asc' }],
    ['materials', { materials: ['oak', 'walnut'] }],
    ['colour', { colors: ['sage'] }],
    ['colour that is also a material', { colors: ['walnut'] }],
    ['price range', { min: 50000, max: 150000 }],
    ['minimum price only', { min: 100000 }],
    ['search', { q: 'oak' }],
    ['multi-word, mixed-case search', { q: 'OAK table' }],
    ['search matching category and material', { q: 'linen sofa' }],
    ['search with no results', { q: 'zzz-nothing' }],
    ['search plus filter', { q: 'sage', categories: ['chairs', 'lighting'] }],
    ['bestsellers', {}, true],
    ['bestsellers by price', { sort: 'price-desc' }, true],
    ['bestsellers with search', { q: 'oak' }, true],
  ]

  test.each(cases)('%s', async (_name, patch, bestsellersOnly = false) => {
    const criteria = { ...defaultCriteria, ...patch }
    const params = criteriaToParams(criteria)
    if (bestsellersOnly) params.set('bestseller', 'true')

    const actual = await getJson<Product[]>(`/products?${params}`)
    expect(slugs(actual)).toEqual(
      slugs(filterProducts(products, criteria, { bestsellersOnly })),
    )
  })
})

describe('product endpoints', () => {
  test('GET /api/products/:slug returns the full product', async () => {
    const expected = products.find((p) => p.slug === 'alder-three-seat-sofa')
    expect(await getJson<Product>('/products/alder-three-seat-sofa')).toEqual(expected!)
  })

  test('an unknown slug is a 404', async () => {
    const response = await api('/products/no-such-thing')
    expect(response.status).toBe(404)
    expect(await response.json()).toEqual({ error: 'Product not found' })
    expect((await api('/products/no-such-thing/related')).status).toBe(404)
  })

  test('related: same category, excluding the product itself', async () => {
    const lamp = products.find((p) => p.slug === 'willow-arc-lamp')!
    const expected = products
      .filter((p) => p.category === lamp.category && p.id !== lamp.id)
      .slice(0, 3)
    expect(slugs(await getJson<Product[]>('/products/willow-arc-lamp/related'))).toEqual(
      slugs(expected),
    )
  })

  test('bestsellers honours the limit', async () => {
    const expected = products.filter((p) => p.bestseller)
    expect(slugs(await getJson<Product[]>('/products/bestsellers'))).toEqual(
      slugs(expected.slice(0, 3)),
    )
    expect(slugs(await getJson<Product[]>('/products/bestsellers?limit=5'))).toEqual(
      slugs(expected.slice(0, 5)),
    )
  })
})

test('GET /api/jobs returns every job in listing order', async () => {
  expect(await getJson<Job[]>('/jobs')).toEqual(jobs)
})

describe('invalid requests', () => {
  test.each([
    ['/products?category=spaceships', 'category.0'],
    ['/products?min=9000&max=10', 'min'],
    ['/products?sort=random', 'sort'],
    ['/products?bestseller=maybe', 'bestseller'],
    ['/products?min=abc', 'min'],
    ['/products/bestsellers?limit=0', 'limit'],
  ])('%s → 400 naming %s', async (path, field) => {
    const response = await api(path)
    expect(response.status).toBe(400)
    const body = (await response.json()) as { issues: { path: string }[] }
    expect(body.issues.map((issue) => issue.path)).toContain(field)
  })

  test('malformed JSON → 400', async () => {
    const response = await api('/me', { method: 'POST', body: '{bad' })
    expect(response.status).toBe(400)
  })

  test('unknown route → 404 JSON', async () => {
    const response = await api('/nope')
    expect(response.status).toBe(404)
    expect(await response.json()).toEqual({ error: 'No route for GET /api/nope' })
  })
})
