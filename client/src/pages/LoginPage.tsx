import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import AuthCard from '../components/AuthCard'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import SignedInPanel from '../components/SignedInPanel'
import { useAuth } from '../hooks/useAuth'
import { loginSchema } from '@sage-oak/shared'

function LoginPage() {
  const auth = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  // Auth state is app-wide, so clear an error left over from a previous visit.
  useEffect(() => {
    auth.clearError()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <AuthCard
      title={auth.user ? 'Your account' : 'Sign in'}
      subtitle={
        auth.user
          ? 'You are signed in.'
          : 'Welcome back. Sign in with your email and password.'
      }
      footer={
        auth.user
          ? undefined
          : { prompt: 'No account?', linkLabel: 'Create one', linkTo: '/signup' }
      }
    >
      {auth.isSessionPending ? (
        <p className="text-sm text-muted">Checking your session…</p>
      ) : auth.user ? (
        <SignedInPanel user={auth.user} />
      ) : (
        <form
          noValidate
          onSubmit={handleSubmit((values) => auth.signIn(values))}
          className="space-y-4"
        >
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Password"
            type="password"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register('password')}
          />
          {auth.error && (
            <p role="alert" className="text-sm text-red-700">
              {auth.error}
            </p>
          )}
          <Button type="submit" fullWidth loading={isSubmitting}>
            Sign in
          </Button>
        </form>
      )}
    </AuthCard>
  )
}

export default LoginPage
