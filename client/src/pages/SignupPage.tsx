import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import AuthCard from '../components/AuthCard'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import SignedInPanel from '../components/SignedInPanel'
import { useAuth } from '../hooks/useAuth'
import { signupSchema } from '@sage-oak/shared'

function SignupPage() {
  const auth = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  })

  useEffect(() => {
    auth.clearError()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <AuthCard
      title={auth.user ? 'Your account' : 'Create account'}
      subtitle={
        auth.user
          ? 'You are signed in.'
          : 'Create an account with your email and a password.'
      }
      footer={
        auth.user
          ? undefined
          : { prompt: 'Already have one?', linkLabel: 'Sign in', linkTo: '/login' }
      }
    >
      {auth.isSessionPending ? (
        <p className="text-sm text-muted">Checking your session…</p>
      ) : auth.user ? (
        <SignedInPanel user={auth.user} />
      ) : (
        <form
          noValidate
          onSubmit={handleSubmit((values) => auth.signUp(values))}
          className="space-y-4"
        >
          <Input
            label="Name"
            autoComplete="name"
            error={errors.name?.message}
            {...register('name')}
          />
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
            autoComplete="new-password"
            hint="At least 8 characters, with upper and lower case and a number."
            error={errors.password?.message}
            {...register('password')}
          />
          <Input
            label="Confirm password"
            type="password"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
          {auth.error && (
            <p role="alert" className="text-sm text-red-700">
              {auth.error}
            </p>
          )}
          <Button type="submit" fullWidth loading={isSubmitting}>
            Create account
          </Button>
        </form>
      )}
    </AuthCard>
  )
}

export default SignupPage
