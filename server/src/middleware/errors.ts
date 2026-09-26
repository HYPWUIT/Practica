import type { ErrorRequestHandler, RequestHandler } from 'express'
import { z } from 'zod'

/** Thrown from a handler to send a specific status with a message. */
export class HttpError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

function isClientError(err: unknown): err is { status: number; message: string } {
  if (typeof err !== 'object' || err === null) return false
  const { status } = err as { status?: unknown }
  return typeof status === 'number' && status >= 400 && status < 500
}

export const notFound: RequestHandler = (req) => {
  throw new HttpError(404, `No route for ${req.method} ${req.path}`)
}

/**
 * The one place a failed request becomes a response. Express 5 forwards
 * rejected promises here, so handlers can simply `await` and `throw`.
 *
 * Every error body has the same shape, `{ error, issues? }`, so the client
 * can read it without checking which kind of failure it was.
 */
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof z.ZodError) {
    res.status(400).json({
      error: 'Invalid request',
      issues: err.issues.map(({ path, message }) => ({
        path: path.join('.'),
        message,
      })),
    })
    return
  }

  // Ours, plus Express's own 4xx errors such as malformed JSON bodies.
  if (err instanceof HttpError || isClientError(err)) {
    res.status(err.status).json({ error: err.message })
    return
  }

  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
}
