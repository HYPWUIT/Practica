import { createContext } from 'react'

/**
 * Context object and types only — no components, so the provider file stays
 * fast-refresh clean.
 */

export type Credentials = {
  email: string
  password: string
}

export type Registration = Credentials & {
  name: string
}

export type AuthUser = {
  name: string
  email: string
}

export type AuthContextValue = {
  /** The signed-in user, or `null` when there is no session. */
  user: AuthUser | null
  /** True until the first session check has come back. */
  isSessionPending: boolean
  /** The server's message from the last failed sign-in or sign-up. */
  error: string | null
  /** Resolve `true` on success; on failure `error` is set instead. */
  signIn: (credentials: Credentials) => Promise<boolean>
  signUp: (registration: Registration) => Promise<boolean>
  signOut: () => Promise<void>
  clearError: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
