import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import AuthCard from '../components/AuthCard'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { useAuth } from '../hooks/useAuth'
import { loginSchema } from '../lib/schemas'

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

  // Auth state is app-wide, so clear anything left over from a previous visit.
  useEffect(() => {
    auth.reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <AuthCard
      title="Sign in"
      subtitle="Nothing here is real — the form validates, and that is where it ends."
      footerPrompt="No account?"
      footerLinkLabel="Create one"
      footerLinkTo="/signup"
    >
      {auth.status === 'success' ? (
        <div role="status" className="space-y-4 text-sm">
          <p className="text-sage-700">{auth.message}</p>
          <Button variant="secondary" onClick={auth.reset}>
            Sign in again
          </Button>
        </div>
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
          <Button type="submit" fullWidth loading={isSubmitting}>
            Sign in
          </Button>
        </form>
      )}
    </AuthCard>
  )
}

export default LoginPage
