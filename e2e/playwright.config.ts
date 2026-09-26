import { defineConfig, devices } from '@playwright/test'

/**
 * End-to-end tests against a real API and client, started here on their own
 * ports (3100 / 5174) so they never collide with — or write to the data of —
 * a dev session running on 3000 / 5173.
 *
 * The API uses the test database: TEST_DATABASE_URL, or DATABASE_URL (from the
 * environment or server/.env) with `_test` appended to its name. It is
 * migrated and seeded before the API starts.
 */

try {
  // Does not override variables that are already set, e.g. in CI.
  process.loadEnvFile('../server/.env')
} catch {
  // No server/.env: everything must come from the environment.
}

function testDatabaseUrl(): string {
  if (process.env.TEST_DATABASE_URL) return process.env.TEST_DATABASE_URL
  const base = process.env.DATABASE_URL
  if (!base) throw new Error('Set DATABASE_URL or TEST_DATABASE_URL to run the e2e tests')
  const url = new URL(base)
  url.pathname = `${url.pathname.replace(/_test$/, '')}_test`
  return url.toString()
}

const API_PORT = 3100
const CLIENT_PORT = 5174
const clientUrl = `http://localhost:${CLIENT_PORT}`
const apiUrl = `http://localhost:${API_PORT}`

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: clientUrl,
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: [
    {
      name: 'API',
      cwd: '../server',
      command:
        'bun --bun prisma migrate deploy && bun prisma/seed.ts && bun src/index.ts',
      url: `${apiUrl}/api/health`,
      env: {
        ...(process.env as Record<string, string>),
        DATABASE_URL: testDatabaseUrl(),
        PORT: String(API_PORT),
        BETTER_AUTH_URL: apiUrl,
        CLIENT_ORIGIN: clientUrl,
      },
      // Never reuse: a server already on this port may be on the wrong database.
      reuseExistingServer: false,
      timeout: 60_000,
    },
    {
      name: 'Client',
      cwd: '../client',
      command: `bun run dev --port ${CLIENT_PORT} --strictPort`,
      url: clientUrl,
      env: { ...(process.env as Record<string, string>), API_URL: apiUrl },
      reuseExistingServer: false,
      timeout: 60_000,
    },
  ],
})
