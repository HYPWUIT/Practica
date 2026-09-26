import type { NextFunction, Request, Response } from 'express'
import { fromNodeHeaders } from 'better-auth/node'
import type { Session } from '../lib/auth'
import { auth } from '../lib/auth'
import { HttpError } from './errors'

/** What a handler behind `requireSession` can read from `res.locals`. */
export type SessionLocals = { session: Session }

/** 401s unless the request carries a valid session cookie. */
export async function requireSession(
  req: Request,
  res: Response<unknown, SessionLocals>,
  next: NextFunction,
) {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  })
  if (!session) throw new HttpError(401, 'Sign in required')

  res.locals.session = session
  next()
}
