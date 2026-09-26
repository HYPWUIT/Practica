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

/** Runs an auth call; resolves `null` on success, else a message to show. */
async function run(
  call: () => Promise<Result>,
  fallback: string,
): Promise<string | null> {
  try {
    const { error } = await call()
    if (!error) return null
    // A 5xx (including the dev proxy's 502 when the API is down) has no
    // message worth showing; a 4xx carries the server's own wording.
    return error.status >= 500 ? UNAVAILABLE : error.message || fallback
  } catch {
    return UNAVAILABLE
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, isPending } = authClient.useSession()
  const [error, setError] = useState<string | null>(null)

  const value = useMemo<AuthContextValue>(() => {
    /** For sign-in and sign-up: the outcome as `true`, or in `error`. */
    async function attempt(call: () => Promise<Result>, fallback: string) {
      setError(null)
      const message = await run(call, fallback)
      setError(message)
      return message === null
    }

    return {
      user: session
        ? {
            name: session.user.name,
            email: session.user.email,
            createdAt: new Date(session.user.createdAt),
          }
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
      updateName: (name) =>
        run(() => authClient.updateUser({ name }), 'Could not save your name'),
      changePassword: (change) =>
        run(
          () => authClient.changePassword(change),
          'Could not change your password',
        ),
    }
  }, [session, isPending, error])

  return <AuthContext value={value}>{children}</AuthContext>
}
