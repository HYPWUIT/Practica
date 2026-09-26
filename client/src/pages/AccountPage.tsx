import { zodResolver } from '@hookform/resolvers/zod'
import { changePasswordSchema, profileSchema } from '@sage-oak/shared'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Navigate } from 'react-router'
import Skeleton from '../components/skeletons/Skeleton'
import Button from '../components/ui/Button'
import Checkbox from '../components/ui/Checkbox'
import Input from '../components/ui/Input'
import type { AuthUser } from '../context/auth-context'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'
import { loginPathFor } from '../lib/redirect'

const memberSince = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  year: 'numeric',
})

function Section({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <section className="rounded-xl border border-line p-6">
      <h2 className="text-xl">{title}</h2>
      <p className="mt-1 text-sm text-muted">{description}</p>
      <div className="mt-6">{children}</div>
    </section>
  )
}

function FormError({ message }: { message: string | null }) {
  if (!message) return null
  return (
    <p role="alert" className="text-sm text-red-700">
      {message}
    </p>
  )
}

function ProfileForm({ user }: { user: AuthUser }) {
  const auth = useAuth()
  const { notify } = useToast()
  const [error, setError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user.name },
  })

  const save = handleSubmit(async ({ name }) => {
    setError(null)
    const message = await auth.updateName(name)
    if (message) {
      setError(message)
      return
    }
    // The saved (trimmed) value becomes the new baseline for isDirty.
    reset({ name })
    notify('Your name was saved.')
  })

  return (
    <form noValidate onSubmit={save} className="space-y-4">
      <Input
        label="Name"
        autoComplete="name"
        error={errors.name?.message}
        {...register('name')}
      />
      <Input
        label="Email"
        type="email"
        value={user.email}
        readOnly
        disabled
        hint="Your email is your sign-in and cannot be changed here."
      />
      <FormError message={error} />
      <Button type="submit" loading={isSubmitting} disabled={!isDirty}>
        Save changes
      </Button>
    </form>
  )
}

function PasswordForm() {
  const auth = useAuth()
  const { notify } = useToast()
  const [error, setError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      revokeOtherSessions: true,
    },
  })

  const change = handleSubmit(
    async ({ currentPassword, newPassword, revokeOtherSessions }) => {
      setError(null)
      const message = await auth.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions,
      })
      if (message) {
        setError(message)
        return
      }
      reset()
      notify(
        revokeOtherSessions
          ? 'Password changed. Other devices have been signed out.'
          : 'Password changed.',
      )
    },
  )

  return (
    <form noValidate onSubmit={change} className="space-y-4">
      <Input
        label="Current password"
        type="password"
        autoComplete="current-password"
        error={errors.currentPassword?.message}
        {...register('currentPassword')}
      />
      <Input
        label="New password"
        type="password"
        autoComplete="new-password"
        hint="At least 8 characters, with upper and lower case and a number."
        error={errors.newPassword?.message}
        {...register('newPassword')}
      />
      <Input
        label="Confirm new password"
        type="password"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />
      <Checkbox
        label="Sign out of all other devices"
        {...register('revokeOtherSessions')}
      />
      <FormError message={error} />
      <Button type="submit" loading={isSubmitting}>
        Change password
      </Button>
    </form>
  )
}

function SignOutButton() {
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
    <Button variant="secondary" loading={signingOut} onClick={signOut}>
      Sign out
    </Button>
  )
}

function AccountPage() {
  const { user, isSessionPending } = useAuth()

  if (isSessionPending) {
    return (
      <div className="mx-auto max-w-2xl space-y-6 px-4 py-16" aria-busy="true">
        <Skeleton className="h-10 w-56" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
    )
  }

  // Signed out (or just signed out here): sign in, then come back.
  if (!user) return <Navigate to={loginPathFor('/account')} replace />

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-3xl">Your account</h1>
      <p className="mt-2 text-sm text-muted">
        Signed in as <span className="text-ink">{user.email}</span> · member
        since {memberSince.format(user.createdAt)}
      </p>

      <div className="mt-10 space-y-6">
        <Section title="Profile" description="How we address you.">
          <ProfileForm user={user} />
        </Section>

        <Section
          title="Password"
          description="You will need your current password to set a new one."
        >
          <PasswordForm />
        </Section>

        <Section
          title="Sign out"
          description="End your session on this device."
        >
          <SignOutButton />
        </Section>
      </div>
    </div>
  )
}

export default AccountPage
