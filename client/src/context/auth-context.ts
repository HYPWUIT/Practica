import { createContext } from 'react'

/**
 * Context object and types only — no components, so the provider file stays
 * fast-refresh clean.
 */

export type AuthStatus = 'idle' | 'submitting' | 'success' | 'error'

export type Credentials = {
  email: string
  password: string
}

export type Registration = Credentials & {
  name: string
}

/** Display-only identity from the last successful submit. Never a session. */
export type SubmittedIdentity = {
  name?: string
  email: string
}

export type AuthContextValue = {
  status: AuthStatus
  message: string | null
  submitted: SubmittedIdentity | null
  signIn: (credentials: Credentials) => Promise<void>
  signUp: (registration: Registration) => Promise<void>
  /** Returns the form to its initial state. */
  reset: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
