import { z } from 'zod'
import { categorySchema, colorSchema, materialSchema } from './product'

export const sortKeySchema = z.enum(['featured', 'price-asc', 'price-desc', 'name'])

export type SortKey = z.infer<typeof sortKeySchema>

/** `a,b,c` → `['a', 'b', 'c']`, each checked against the vocabulary. */
function commaList<T extends z.ZodType<string, string>>(item: T) {
  return z
    .string()
    .optional()
    .transform((raw) =>
      raw
        ? raw
            .split(',')
            .map((value) => value.trim())
            .filter(Boolean)
        : [],
    )
    .pipe(z.array(item))
}

/**
 * `GET /api/products` query string. Uses the same parameter names and comma
 * lists as the catalogue page's URL, so the client can forward its search
 * params unchanged. Unlike the page, which quietly drops bad values from a
 * hand-edited URL, the API rejects them with a 400.
 */
export const catalogQuerySchema = z
  .object({
    q: z.string().trim().default(''),
    category: commaList(categorySchema),
    material: commaList(materialSchema),
    color: commaList(colorSchema),
    /** Cents. */
    min: z.coerce.number().int().nonnegative().optional(),
    max: z.coerce.number().int().nonnegative().optional(),
    sort: sortKeySchema.default('featured'),
    bestseller: z.stringbool().default(false),
  })
  .refine(
    ({ min, max }) => min === undefined || max === undefined || min <= max,
    { message: 'min must not be greater than max', path: ['min'] },
  )

export type CatalogQuery = z.infer<typeof catalogQuerySchema>

/** `?limit=` on the related-products and bestseller endpoints. */
export const limitQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(24).default(3),
})
