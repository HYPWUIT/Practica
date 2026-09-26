import { z } from 'zod'

/**
 * Every setting the server reads, checked once at startup. A missing or
 * malformed variable stops the process here with a readable message, rather
 * than surfacing later as an `undefined` deep inside a request. Bun loads
 * `server/.env` on its own, so there is no dotenv import.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z
    .string()
    .regex(/^postgres(ql)?:\/\//, 'Must be a postgresql:// connection string'),
  /** Signs session cookies. Generate with `bunx auth secret`. */
  BETTER_AUTH_SECRET: z.string().min(32, 'Must be at least 32 characters'),
  /** Where this server is reached, e.g. http://localhost:3000. */
  BETTER_AUTH_URL: z.url(),
  /** The web app's origin; auth requests from anywhere else are refused. */
  CLIENT_ORIGIN: z.url().default('http://localhost:5173'),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('Invalid environment:\n' + z.prettifyError(parsed.error))
  process.exit(1)
}

export const env = parsed.data
