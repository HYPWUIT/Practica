import { createAuthClient } from 'better-auth/react'

/**
 * No `baseURL`: the app and the API share an origin (Vite proxies `/api` in
 * development), so the client's default of `/api/auth` on the current origin
 * is right, and the session cookie is first-party.
 */
export const authClient = createAuthClient()
