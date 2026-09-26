import { z } from 'zod'

/**
 * The catalogue's vocabulary as Zod enums, so the server can validate a query
 * string against exactly the values the client offers as filters. Types are
 * inferred from the schemas rather than declared beside them.
 */

export const categorySchema = z.enum([
  'sofas',
  'chairs',
  'tables',
  'beds',
  'storage',
  'lighting',
])

export const materialSchema = z.enum([
  'oak',
  'walnut',
  'ash',
  'rattan',
  'linen',
  'leather',
  'steel',
  'marble',
])

export const colorSchema = z.enum([
  'natural',
  'walnut',
  'charcoal',
  'sage',
  'cream',
  'ochre',
  'ink',
  'terracotta',
])

export const dimensionsSchema = z.object({
  /** Centimetres. */
  width: z.int().positive(),
  depth: z.int().positive(),
  height: z.int().positive(),
})

export const productSchema = z.object({
  id: z.string(),
  /** URL segment for /product/:slug — must stay unique. */
  slug: z.string(),
  name: z.string(),
  /** Minor units (cents). Integers avoid float drift on cart totals. */
  price: z.int().nonnegative(),
  category: categorySchema,
  material: materialSchema,
  color: colorSchema,
  bestseller: z.boolean(),
  description: z.string(),
  dimensions: dimensionsSchema,
  inStock: z.boolean(),
})

export type Category = z.infer<typeof categorySchema>
export type Material = z.infer<typeof materialSchema>
export type ColorName = z.infer<typeof colorSchema>
export type Dimensions = z.infer<typeof dimensionsSchema>
export type Product = z.infer<typeof productSchema>

/** A filter option plus how many products currently match it. */
export type FacetOption<T extends string> = {
  value: T
  label: string
  count: number
}
