import express from 'express'
import { errorHandler, notFound } from './middleware/errors'

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

  app.use(notFound)
  app.use(errorHandler)

  return app
}
