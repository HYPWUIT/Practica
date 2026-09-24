import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'
import type {
  AuthContextValue,
  AuthStatus,
  SubmittedIdentity,
} from './auth-context'
import { AuthContext } from './auth-context'

/**
 * Deliberately thin.
 *
 * There is no backend and no session: `signIn` and `signUp` simulate a round
 * trip so the forms in Phase 3 have a submitting state and a result to render,
 * and nothing in the app is gated on the outcome. `submitted` is for greeting
 * the user on a success screen, not for authorisation — see project-scope.md.
 *
 * The shape is what a real auth client would expose, so wiring one in later
 * means replacing the bodies of these two functions.
 */

/** Enough delay that the pending state is actually visible. */
const SIMULATED_LATENCY_MS = 700

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('idle')
  const [message, setMessage] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState<SubmittedIdentity | null>(null)

  const value = useMemo<AuthContextValue>(() => {
    async function submit(identity: SubmittedIdentity, successMessage: string) {
      setStatus('submitting')
      setMessage(null)
      await delay(SIMULATED_LATENCY_MS)
      setSubmitted(identity)
      setMessage(successMessage)
      setStatus('success')
    }

    return {
      status,
      message,
      submitted,
      signIn: ({ email }) =>
        submit({ email }, 'Signed in — for show only, no session was created.'),
      signUp: ({ name, email }) =>
        submit({ name, email }, `Welcome, ${name}. No account was really made.`),
      reset: () => {
        setStatus('idle')
        setMessage(null)
        setSubmitted(null)
      },
    }
  }, [status, message, submitted])

  return <AuthContext value={value}>{children}</AuthContext>
}
