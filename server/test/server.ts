import { afterAll, beforeAll } from 'bun:test'
import type { Server } from 'node:http'
import type { AddressInfo } from 'node:net'
import { createApp } from '../src/app'
import { env } from '../src/env'

/**
 * Starts the real app on a free port for the calling test file, and stops it
 * when that file is done. A function rather than module-level code: Bun runs
 * every test file in one process, so a module's own `afterAll` would fire at
 * the end of whichever file imported it first.
 *
 * Requests carry the client's Origin, as the browser would, since Better Auth
 * refuses others.
 */
export function startTestServer() {
  let server: Server
  let baseUrl = ''

  beforeAll(async () => {
    server = createApp().listen(0)
    await new Promise((resolve) => server.once('listening', resolve))
    baseUrl = `http://localhost:${(server.address() as AddressInfo).port}`
  })

  afterAll(() => {
    server.close()
  })

  return {
    url: (path: string) => `${baseUrl}${path}`,
    api(path: string, init: RequestInit = {}) {
      const headers = new Headers(init.headers)
      headers.set('origin', env.CLIENT_ORIGIN)
      if (init.body !== undefined) headers.set('content-type', 'application/json')
      return fetch(`${baseUrl}/api${path}`, { ...init, headers })
    },
  }
}
