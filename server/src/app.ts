import express from 'express'
import { errorHandler, notFound } from './middleware/errors'
import { jobsRouter } from './routes/jobs'
import { productsRouter } from './routes/products'

/**
 * Builds the app without listening, so tests can mount it on a random port.
 */
export function createApp() {
  const app = express()

  app.disable('x-powered-by')
  app.use(express.json())

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' })
  })

  app.use('/api/products', productsRouter)
  app.use('/api/jobs', jobsRouter)

  app.use(notFound)
  app.use(errorHandler)

  return app
}
