import type { Response } from 'express'
import { Router } from 'express'
import type { SessionLocals } from '../middleware/session'
import { requireSession } from '../middleware/session'

export const meRouter = Router()

/** The signed-in user. */
meRouter.get(
  '/',
  requireSession,
  (_req, res: Response<unknown, SessionLocals>) => {
    res.json(res.locals.session.user)
  },
)
