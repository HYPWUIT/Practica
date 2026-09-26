import { catalogQuerySchema, limitQuerySchema } from '@sage-oak/shared'
import { Router } from 'express'
import { catalogOrderBy, catalogWhere, toProduct } from '../lib/catalog'
import { prisma } from '../lib/prisma'
import { HttpError } from '../middleware/errors'

export const productsRouter = Router()

/** `GET /api/products?q=&category=&material=&color=&min=&max=&sort=&bestseller=` */
productsRouter.get('/', async (req, res) => {
  const query = catalogQuerySchema.parse(req.query)
  const rows = await prisma.product.findMany({
    where: catalogWhere(query),
    orderBy: catalogOrderBy[query.sort],
  })
  res.json(rows.map(toProduct))
})

/** Declared before `/:slug`, which would otherwise match "bestsellers". */
productsRouter.get('/bestsellers', async (req, res) => {
  const { limit } = limitQuerySchema.parse(req.query)
  const rows = await prisma.product.findMany({
    where: { bestseller: true },
    orderBy: { id: 'asc' },
    take: limit,
  })
  res.json(rows.map(toProduct))
})

productsRouter.get('/:slug', async (req, res) => {
  const row = await prisma.product.findUnique({
    where: { slug: req.params.slug },
  })
  if (!row) throw new HttpError(404, 'Product not found')
  res.json(toProduct(row))
})

/** Same category, excluding the product itself. */
productsRouter.get('/:slug/related', async (req, res) => {
  const { limit } = limitQuerySchema.parse(req.query)
  const product = await prisma.product.findUnique({
    where: { slug: req.params.slug },
    select: { id: true, category: true },
  })
  if (!product) throw new HttpError(404, 'Product not found')

  const rows = await prisma.product.findMany({
    where: { category: product.category, id: { not: product.id } },
    orderBy: { id: 'asc' },
    take: limit,
  })
  res.json(rows.map(toProduct))
})
