import { describe, expect, test } from 'bun:test'
import { catalogQuerySchema, limitQuerySchema } from './catalog'

describe('catalogQuerySchema', () => {
  test('an empty query gets the defaults', () => {
    expect(catalogQuerySchema.parse({})).toEqual({
      q: '',
      category: [],
      material: [],
      color: [],
      sort: 'featured',
      bestseller: false,
    })
  })

  test('splits comma lists, trimming and dropping empty entries', () => {
    const query = catalogQuerySchema.parse({
      category: 'sofas, beds,,',
      material: 'oak',
      color: 'sage,cream',
    })
    expect(query.category).toEqual(['sofas', 'beds'])
    expect(query.material).toEqual(['oak'])
    expect(query.color).toEqual(['sage', 'cream'])
  })

  test('rejects values outside the vocabulary', () => {
    expect(catalogQuerySchema.safeParse({ category: 'sofas,spaceships' }).success).toBe(false)
    expect(catalogQuerySchema.safeParse({ material: 'plastic' }).success).toBe(false)
    expect(catalogQuerySchema.safeParse({ sort: 'random' }).success).toBe(false)
  })

  test('rejects a repeated parameter — the API takes comma lists', () => {
    expect(catalogQuerySchema.safeParse({ category: ['sofas', 'beds'] }).success).toBe(false)
  })

  test('coerces price bounds and rejects non-numbers', () => {
    expect(catalogQuerySchema.parse({ min: '100', max: '5000' })).toMatchObject({
      min: 100,
      max: 5000,
    })
    expect(catalogQuerySchema.safeParse({ min: 'abc' }).success).toBe(false)
    expect(catalogQuerySchema.safeParse({ min: '-1' }).success).toBe(false)
  })

  test('rejects min above max, and reports it on `min`', () => {
    const result = catalogQuerySchema.safeParse({ min: '9000', max: '10' })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.path).toEqual(['min'])
  })

  test('reads bestseller as a boolean string', () => {
    expect(catalogQuerySchema.parse({ bestseller: 'true' }).bestseller).toBe(true)
    expect(catalogQuerySchema.parse({ bestseller: 'false' }).bestseller).toBe(false)
    expect(catalogQuerySchema.safeParse({ bestseller: 'maybe' }).success).toBe(false)
  })

  test('trims the search term', () => {
    expect(catalogQuerySchema.parse({ q: '  oak table ' }).q).toBe('oak table')
  })
})

describe('limitQuerySchema', () => {
  test('defaults to 3 and accepts 1–24', () => {
    expect(limitQuerySchema.parse({}).limit).toBe(3)
    expect(limitQuerySchema.parse({ limit: '24' }).limit).toBe(24)
    expect(limitQuerySchema.safeParse({ limit: '0' }).success).toBe(false)
    expect(limitQuerySchema.safeParse({ limit: '25' }).success).toBe(false)
  })
})
