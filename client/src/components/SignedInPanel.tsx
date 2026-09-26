import { useState } from 'react'
import { Link } from 'react-router'
import type { AuthUser } from '../context/auth-context'
import { useAuth } from '../hooks/useAuth'
import Button from './ui/Button'
import { buttonClasses } from './ui/button-styles'

/** What the sign-in and sign-up pages show once there is a session. */
function SignedInPanel({ user }: { user: AuthUser }) {
  const auth = useAuth()
  const [signingOut, setSigningOut] = useState(false)

  async function signOut() {
    setSigningOut(true)
    try {
      await auth.signOut()
    } finally {
      setSigningOut(false)
    }
  }

  return (
    <div role="status" className="space-y-4 text-sm">
      <p>
        Signed in as <span className="font-medium text-ink">{user.name}</span>{' '}
        <span className="text-muted">({user.email})</span>.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link to="/catalog" className={buttonClasses()}>
          Browse the shop
        </Link>
        <Button variant="secondary" loading={signingOut} onClick={signOut}>
          Sign out
        </Button>
      </div>
    </div>
  )
}

export default SignedInPanel
