import { Router } from 'express'
import { toJob } from '../lib/catalog'
import { prisma } from '../lib/prisma'

export const jobsRouter = Router()

jobsRouter.get('/', async (_req, res) => {
  const rows = await prisma.job.findMany({ orderBy: { sortOrder: 'asc' } })
  res.json(rows.map(toJob))
})
