import { defineConfig } from 'prisma/config'

// No dotenv import: the package scripts pass `--env-file=.env` to Bun.
// (Bun's automatic .env loading does not reach the `prisma` binary, so run
// the CLI through `bun run db:*` rather than bare `bunx prisma`.)
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'bun prisma/seed.ts',
  },
  datasource: {
    // Not `env()`, which throws when the variable is unset: `prisma generate`
    // runs on postinstall, before a fresh clone has a .env, and never needs
    // the URL. Commands that do need it fail with a clear message instead.
    url: process.env.DATABASE_URL ?? '',
  },
})
