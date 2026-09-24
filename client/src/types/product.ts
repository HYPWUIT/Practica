/**
 * Union types rather than enums: tsconfig sets `erasableSyntaxOnly`, so enums
 * are not available, and unions give the same exhaustiveness checking.
 */
export type Category =
  | 'sofas'
  | 'chairs'
  | 'tables'
  | 'beds'
  | 'storage'
  | 'lighting'

export type Material =
  | 'oak'
  | 'walnut'
  | 'ash'
  | 'rattan'
  | 'linen'
  | 'leather'
  | 'steel'
  | 'marble'

export type ColorName =
  | 'natural'
  | 'walnut'
  | 'charcoal'
  | 'sage'
  | 'cream'
  | 'ochre'
  | 'ink'
  | 'terracotta'

export type Dimensions = {
  /** Centimetres. */
  width: number
  depth: number
  height: number
}

export type Product = {
  id: string
  /** URL segment for /product/:slug — must stay unique. */
  slug: string
  name: string
  /** Minor units (cents). Integers avoid float drift on cart totals. */
  price: number
  category: Category
  material: Material
  color: ColorName
  bestseller: boolean
  description: string
  dimensions: Dimensions
  inStock: boolean
}

/** A filter option plus how many products currently match it. */
export type FacetOption<T extends string> = {
  value: T
  label: string
  count: number
}
