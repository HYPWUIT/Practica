import { expect, test } from '@playwright/test'
import {
  fillSignIn,
  fillSignUp,
  formError,
  password,
  signOut,
  signUp,
  uniqueEmail,
} from './helpers'

test('sign up lands on the account page and survives a reload', async ({ page }) => {
  const email = uniqueEmail()
  await signUp(page, email)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Your account')
  await expect(page.getByText(`Signed in as ${email}`)).toBeVisible()

  await page.reload()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Your account')
})

test('signed in, /login and /signup forward to the account page', async ({ page }) => {
  await signUp(page, uniqueEmail())
  await page.goto('/login')
  await expect(page).toHaveURL(/\/account$/)
  await page.goto('/signup')
  await expect(page).toHaveURL(/\/account$/)
})

test('signed out, /account asks to sign in and comes back afterwards', async ({ page }) => {
  const email = uniqueEmail()
  await signUp(page, email)
  await signOut(page)

  await page.goto('/account')
  await expect(page).toHaveURL(/\/login\?next=%2Faccount$/)

  await fillSignIn(page, email, password)
  await expect(page).toHaveURL(/\/account$/)
})

test('?next= only accepts paths on this site', async ({ page }) => {
  const email = uniqueEmail()
  await signUp(page, email)
  await signOut(page)

  await page.goto('/login?next=//evil.example/steal')
  await fillSignIn(page, email, password)
  await expect(page).toHaveURL(/localhost:\d+\/account$/)

  await signOut(page)
  await page.goto('/login?next=/cart')
  await fillSignIn(page, email, password)
  await expect(page).toHaveURL(/\/cart$/)
})

test('sign in shows the server error, then succeeds', async ({ page }) => {
  const email = uniqueEmail()
  await signUp(page, email)
  await signOut(page)

  await fillSignIn(page, email, 'Wrong12345')
  await expect(formError(page)).toHaveText('Invalid email or password')

  await fillSignIn(page, email, password)
  await expect(page).toHaveURL(/\/account$/)
})

test('an email that is already registered is refused', async ({ page }) => {
  const email = uniqueEmail()
  await signUp(page, email)
  await signOut(page)

  await fillSignUp(page, email)
  await expect(formError(page)).toHaveText('User already exists. Use another email.')

  // Leaving and coming back clears the stale error.
  await page.goto('/login')
  await page.getByRole('link', { name: 'Create one' }).click()
  await expect(page.getByRole('button', { name: 'Create account' })).toBeVisible()
  await expect(formError(page)).toHaveCount(0)
})

test('the form blocks a weak password before it reaches the server', async ({ page }) => {
  let signUpRequests = 0
  page.on('request', (request) => {
    if (request.url().includes('/api/auth/sign-up')) signUpRequests++
  })

  await page.goto('/signup')
  await page.getByLabel('Name').fill('E2E Tester')
  await page.getByLabel('Email').fill(uniqueEmail())
  await page.getByLabel('Password', { exact: true }).fill('alllowercase1')
  await page.getByLabel('Confirm password').fill('alllowercase1')
  await page.getByRole('button', { name: 'Create account' }).click()

  await expect(page.getByText('Include at least one uppercase letter')).toBeVisible()
  expect(signUpRequests).toBe(0)
})

test('navbar and footer point to the account once signed in', async ({ page }) => {
  await signUp(page, uniqueEmail())
  const header = page.getByRole('banner')
  const footer = page.getByRole('contentinfo')

  await expect(header.getByRole('link', { name: 'Account' })).toHaveAttribute('href', '/account')
  await expect(header.getByRole('link', { name: 'Sign in' })).toHaveCount(0)
  await expect(footer.getByRole('link', { name: 'Your account' })).toHaveAttribute('href', '/account')
  await expect(footer.getByRole('link', { name: 'Create account' })).toHaveCount(0)

  await signOut(page)
  await expect(page.getByText('No account?')).toBeVisible()
  await expect(header.getByRole('link', { name: 'Sign in' })).toBeVisible()
  await expect(footer.getByRole('link', { name: 'Create account' })).toBeVisible()
})

test('the footer no longer calls the shop a frontend project', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('contentinfo')).not.toContainText('frontend')
})
