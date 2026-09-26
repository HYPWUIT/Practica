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
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('Invalid environment:\n' + z.prettifyError(parsed.error))
  process.exit(1)
}

export const env = parsed.data
