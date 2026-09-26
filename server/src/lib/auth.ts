import { passwordSchema } from '@sage-oak/shared'
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { APIError, createAuthMiddleware } from 'better-auth/api'
import { env } from '../env'
import { prisma } from './prisma'

export const auth = betterAuth({
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  trustedOrigins: [env.CLIENT_ORIGIN],
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
  emailAndPassword: {
    enabled: true,
    // Better Auth's own bounds; the stricter rules are in the hook below.
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },
  hooks: {
    /**
     * Sign-ups must pass the same password rules as the signup form, so an
     * account cannot be created by calling the API directly with a password
     * the form would have refused.
     */
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path !== '/sign-up/email') return

      const result = passwordSchema.safeParse(ctx.body?.password)
      if (!result.success) {
        throw new APIError('BAD_REQUEST', {
          message: result.error.issues[0]?.message ?? 'Invalid password',
        })
      }
    }),
  },
})

export type Session = typeof auth.$Infer.Session
