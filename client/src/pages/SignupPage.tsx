import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import AuthCard from '../components/AuthCard'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { useAuth } from '../hooks/useAuth'
import { signupSchema } from '../lib/schemas'

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
    auth.reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <AuthCard
      title="Create account"
      subtitle="No account is really created — this is the form and its rules, nothing more."
      footerPrompt="Already have one?"
      footerLinkLabel="Sign in"
      footerLinkTo="/login"
    >
      {auth.status === 'success' ? (
        <div role="status" className="space-y-4 text-sm">
          <p className="text-sage-700">{auth.message}</p>
          <Button variant="secondary" onClick={auth.reset}>
            Start over
          </Button>
        </div>
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
          <Button type="submit" fullWidth loading={isSubmitting}>
            Create account
          </Button>
        </form>
      )}
    </AuthCard>
  )
}

export default SignupPage
