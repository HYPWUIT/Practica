/**
 * Preloaded by `bun test` (see bunfig.toml), before any test file imports the
 * app — so `env.ts` sees the test database, never the development one.
 *
 * The test database is TEST_DATABASE_URL if set, otherwise DATABASE_URL with
 * the database name suffixed `_test`. It is migrated and seeded on every run,
 * and the tests delete users from it freely.
 */

function testDatabaseUrl(): string {
  if (process.env.TEST_DATABASE_URL) return process.env.TEST_DATABASE_URL

  const base = process.env.DATABASE_URL
  if (!base) throw new Error('Set DATABASE_URL (or TEST_DATABASE_URL) to run the tests')

  const url = new URL(base)
  url.pathname = `${url.pathname.replace(/_test$/, '')}_test`
  return url.toString()
}

const url = testDatabaseUrl()
if (!new URL(url).pathname.endsWith('_test')) {
  throw new Error(`Refusing to run tests against ${new URL(url).pathname.slice(1)}: the name must end in _test`)
}

process.env.DATABASE_URL = url
process.env.NODE_ENV = 'test'

function run(command: string[]) {
  const result = Bun.spawnSync(command, {
    cwd: `${import.meta.dir}/..`,
    env: process.env,
    stdout: 'pipe',
    stderr: 'pipe',
  })
  if (result.exitCode !== 0) {
    throw new Error(`${command.join(' ')} failed:\n${result.stdout}\n${result.stderr}`)
  }
}

// `migrate deploy` also creates the database if it does not exist yet.
run(['bun', '--bun', 'prisma', 'migrate', 'deploy'])
run(['bun', 'prisma/seed.ts'])
