import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'
import { authClient } from '../lib/auth-client'
import type { AuthContextValue } from './auth-context'
import { AuthContext } from './auth-context'

/**
 * Wraps the Better Auth client so pages depend on this small interface rather
 * than on the library. The session lives in an HTTP-only cookie set by the
 * server; `useSession` re-reads it after every sign-in, sign-up and sign-out.
 */

const UNAVAILABLE = 'The server is not responding. Try again in a moment.'

type Result = { error: { message?: string; status: number } | null }

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, isPending } = authClient.useSession()
  const [error, setError] = useState<string | null>(null)

  const value = useMemo<AuthContextValue>(() => {
    /** Runs an auth call and turns its outcome into `true` or an `error`. */
    async function attempt(call: () => Promise<Result>, fallback: string) {
      setError(null)
      try {
        const result = await call()
        if (result.error) {
          // A 5xx (including the dev proxy's 502 when the API is down) has no
          // message worth showing; a 4xx carries the server's own wording.
          setError(
            result.error.status >= 500
              ? UNAVAILABLE
              : result.error.message || fallback,
          )
          return false
        }
        return true
      } catch {
        setError(UNAVAILABLE)
        return false
      }
    }

    return {
      user: session
        ? { name: session.user.name, email: session.user.email }
        : null,
      isSessionPending: isPending,
      error,
      signIn: ({ email, password }) =>
        attempt(
          () => authClient.signIn.email({ email, password }),
          'Sign in failed',
        ),
      signUp: ({ name, email, password }) =>
        attempt(
          () => authClient.signUp.email({ name, email, password }),
          'Could not create the account',
        ),
      signOut: async () => {
        await authClient.signOut()
      },
      clearError: () => setError(null),
    }
  }, [session, isPending, error])

  return <AuthContext value={value}>{children}</AuthContext>
}
