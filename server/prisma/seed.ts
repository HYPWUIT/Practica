import { jobSchema, productSchema } from '@sage-oak/shared'
import { jobs, products } from '@sage-oak/shared/data'
import { prisma } from '../src/lib/prisma'

/**
 * Loads the catalogue and job listings from @sage-oak/shared — the same data
 * the client's mock API serves — so the database starts out identical to what
 * the site already shows. Upserts make it safe to run again after editing
 * the data.
 */

async function seedProducts() {
  for (const raw of products) {
    const { dimensions, ...product } = productSchema.parse(raw)
    const data = { ...product, ...dimensions }
    await prisma.product.upsert({
      where: { id: product.id },
      create: data,
      update: data,
    })
  }
}

async function seedJobs() {
  for (const [sortOrder, raw] of jobs.entries()) {
    const job = jobSchema.parse(raw)
    const data = { ...job, sortOrder }
    await prisma.job.upsert({
      where: { id: job.id },
      create: data,
      update: data,
    })
  }
}

try {
  await seedProducts()
  await seedJobs()
  console.log(`Seeded ${products.length} products and ${jobs.length} jobs.`)
} finally {
  await prisma.$disconnect()
}
