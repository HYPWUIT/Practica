import { nameSchema, passwordSchema } from '@sage-oak/shared'
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { APIError, createAuthMiddleware } from 'better-auth/api'
import { env } from '../env'
import type { z } from 'zod'
import { prisma } from './prisma'

/** Body field → shared schema, per Better Auth endpoint. `true` = optional. */
const bodyChecks: Record<string, [string, z.ZodType, boolean?][]> = {
  '/sign-up/email': [
    ['name', nameSchema],
    ['password', passwordSchema],
  ],
  '/change-password': [['newPassword', passwordSchema]],
  // Only the fields being changed are sent.
  '/update-user': [['name', nameSchema, true]],
}

export const auth = betterAuth({
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  trustedOrigins: [env.CLIENT_ORIGIN],
  advanced: {
    // Better Auth skips the origin check whenever NODE_ENV is "test". Pinned
    // on, so the tests exercise the real behaviour and a server started with
    // the wrong NODE_ENV does not quietly accept any origin.
    disableOriginCheck: false,
  },
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
  emailAndPassword: {
    enabled: true,
    // Better Auth's own bounds; the stricter rules are in the hook below.
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },
  hooks: {
    /**
     * Requests that set a name or a password must pass the same rules as the
     * forms, so calling the API directly cannot create an account or set a
     * password the site would have refused.
     */
    before: createAuthMiddleware(async (ctx) => {
      const checks = bodyChecks[ctx.path]
      if (!checks) return

      for (const [field, schema, optional] of checks) {
        const value = ctx.body?.[field]
        if (optional && value === undefined) continue

        const result = schema.safeParse(value)
        if (!result.success) {
          throw new APIError('BAD_REQUEST', {
            message: result.error.issues[0]?.message ?? `Invalid ${field}`,
          })
        }
      }
    }),
  },
})

export type Session = typeof auth.$Infer.Session
