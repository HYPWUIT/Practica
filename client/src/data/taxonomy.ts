import type { Category, ColorName, Material } from '../types/product'

/**
 * Display names and swatch values for the catalogue's vocabulary.
 * Kept apart from `filters.ts` so labels stay stable while the derived
 * counts change with the product list.
 */

/** Drives menu order on the home tiles and the filter sidebar. */
export const categoryOrder: Category[] = [
  'sofas',
  'chairs',
  'tables',
  'beds',
  'storage',
  'lighting',
]

export const categoryLabels: Record<Category, string> = {
  sofas: 'Sofas',
  chairs: 'Chairs',
  tables: 'Tables',
  beds: 'Beds',
  storage: 'Storage',
  lighting: 'Lighting',
}

export const materialLabels: Record<Material, string> = {
  oak: 'Oak',
  walnut: 'Walnut',
  ash: 'Ash',
  rattan: 'Rattan',
  linen: 'Linen',
  leather: 'Leather',
  steel: 'Steel',
  marble: 'Marble',
}

export const colorLabels: Record<ColorName, string> = {
  natural: 'Natural',
  walnut: 'Walnut',
  charcoal: 'Charcoal',
  sage: 'Sage',
  cream: 'Cream',
  ochre: 'Ochre',
  ink: 'Ink',
  terracotta: 'Terracotta',
}

/**
 * Swatch values, also used to tint the product silhouettes. These are product
 * colours rather than brand colours, so they live here and not in the
 * `@theme` block — nothing in the UI chrome should reach for them.
 */
export const colorSwatches: Record<ColorName, string> = {
  natural: '#d9c3a0',
  walnut: '#6b4a32',
  charcoal: '#4a4f4d',
  sage: '#6aa07b',
  cream: '#d5c7ac',
  ochre: '#c2913f',
  ink: '#2b2f2c',
  terracotta: '#b56a4e',
}

/** Swatches light enough to need a border to be visible on white. */
export const lightSwatches: ColorName[] = ['cream', 'natural']
