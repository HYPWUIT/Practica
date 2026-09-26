import type { CatalogQuery, Job, Product, SortKey } from '@sage-oak/shared'
import {
  categorySchema,
  colorSchema,
  jobTypeSchema,
  materialSchema,
} from '@sage-oak/shared'
import type { Prisma } from '../generated/prisma/client'
import type {
  Job as JobRow,
  Product as ProductRow,
} from '../generated/prisma/client'

/**
 * Translates the catalogue query into Prisma. Mirrors `filterProducts` in the
 * client (client/src/lib/filter.ts) so switching the page over to the API
 * does not change which products it shows or in what order.
 */

/** Vocabulary values containing the term, for matching it against enum columns. */
function valuesMatching<T extends string>(values: readonly T[], term: string): T[] {
  return values.filter((value) => value.includes(term))
}

/**
 * Every word of the search must appear somewhere — name, description, or the
 * category/material/colour — so extra words narrow rather than widen.
 */
function searchWhere(q: string): Prisma.ProductWhereInput[] {
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((term) => ({
      OR: [
        { name: { contains: term, mode: 'insensitive' } },
        { description: { contains: term, mode: 'insensitive' } },
        { category: { in: valuesMatching(categorySchema.options, term) } },
        { material: { in: valuesMatching(materialSchema.options, term) } },
        { color: { in: valuesMatching(colorSchema.options, term) } },
      ],
    }))
}

export function catalogWhere(query: CatalogQuery): Prisma.ProductWhereInput {
  return {
    AND: [
      query.bestseller ? { bestseller: true } : {},
      query.category.length ? { category: { in: query.category } } : {},
      query.material.length ? { material: { in: query.material } } : {},
      query.color.length ? { color: { in: query.color } } : {},
      { price: { gte: query.min, lte: query.max } },
      ...searchWhere(query.q),
    ],
  }
}

/** `id` last in every order, so equal prices never come back shuffled. */
export const catalogOrderBy: Record<
  SortKey,
  Prisma.ProductOrderByWithRelationInput[]
> = {
  featured: [{ bestseller: 'desc' }, { name: 'asc' }, { id: 'asc' }],
  'price-asc': [{ price: 'asc' }, { id: 'asc' }],
  'price-desc': [{ price: 'desc' }, { id: 'asc' }],
  name: [{ name: 'asc' }, { id: 'asc' }],
}

// ─── Row → API shape ────────────────────────────────────────────────────

/**
 * Typed against the shared `Product`, so a Prisma enum that drifts from the
 * shared Zod enum is a compile error here rather than a runtime surprise.
 */
export function toProduct(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    price: row.price,
    category: row.category,
    material: row.material,
    color: row.color,
    bestseller: row.bestseller,
    description: row.description,
    dimensions: { width: row.width, depth: row.depth, height: row.height },
    inStock: row.inStock,
  }
}

export function toJob(row: JobRow): Job {
  return {
    id: row.id,
    title: row.title,
    team: row.team,
    location: row.location,
    // A free-text column in the database, so it is checked on the way out.
    type: jobTypeSchema.parse(row.type),
    summary: row.summary,
  }
}
