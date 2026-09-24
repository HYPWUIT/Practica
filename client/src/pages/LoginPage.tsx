import PagePlaceholder from '../components/PagePlaceholder'

function LoginPage() {
  return (
    <PagePlaceholder
      title="Sign in"
      phase="Phase 3"
      description="Email and password form with Zod validation. No session is created — auth is presentational until a backend exists."
    />
  )
}

export default LoginPage
