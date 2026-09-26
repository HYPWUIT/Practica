import { toNodeHandler } from 'better-auth/node'
import express from 'express'
import { auth } from './lib/auth'
import { errorHandler, notFound } from './middleware/errors'
import { jobsRouter } from './routes/jobs'
import { meRouter } from './routes/me'
import { productsRouter } from './routes/products'

/**
 * Builds the app without listening, so tests can mount it on a random port.
 */
export function createApp() {
  const app = express()

  app.disable('x-powered-by')

  // Better Auth reads the raw request body itself, so it must be mounted
  // before express.json() — which would otherwise consume the stream first.
  app.all('/api/auth/*splat', toNodeHandler(auth))

  app.use(express.json())

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' })
  })

  app.use('/api/products', productsRouter)
  app.use('/api/jobs', jobsRouter)
  app.use('/api/me', meRouter)

  app.use(notFound)
  app.use(errorHandler)

  return app
}
