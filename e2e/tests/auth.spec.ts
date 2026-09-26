import type { Page } from '@playwright/test'
import { expect, test } from '@playwright/test'

const password = 'Robin12345'

/** A fresh address per test, so tests can run in parallel and be re-run. */
const uniqueEmail = () =>
  `e2e-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`

async function signUp(page: Page, email: string) {
  await page.goto('/signup')
  await page.getByLabel('Name').fill('E2E Tester')
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Password', { exact: true }).fill(password)
  await page.getByLabel('Confirm password').fill(password)
  await page.getByRole('button', { name: 'Create account' }).click()
}

async function signIn(page: Page, email: string, withPassword: string) {
  if (!page.url().endsWith('/login')) await page.goto('/login')
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Password').fill(withPassword)
  await page.getByRole('button', { name: 'Sign in' }).click()
}

const formError = (page: Page) => page.locator('form [role="alert"]')

test('sign up, stay signed in across a reload, sign out', async ({ page }) => {
  const email = uniqueEmail()
  await signUp(page, email)
  await expect(page.getByRole('status')).toContainText(`Signed in as E2E Tester (${email})`)

  await page.goto('/login')
  await expect(page.getByText('Signed in as')).toBeVisible()

  await page.getByRole('button', { name: 'Sign out' }).click()
  await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible()
  await page.reload()
  await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible()
})

test('sign in shows the server error, then succeeds', async ({ page }) => {
  const email = uniqueEmail()
  await signUp(page, email)
  await page.getByRole('button', { name: 'Sign out' }).click()

  await signIn(page, email, 'Wrong12345')
  await expect(formError(page)).toHaveText('Invalid email or password')

  await signIn(page, email, password)
  await expect(page.getByText('Signed in as')).toBeVisible()
})

test('an email that is already registered is refused', async ({ page }) => {
  const email = uniqueEmail()
  await signUp(page, email)
  await page.getByRole('button', { name: 'Sign out' }).click()

  await signUp(page, email)
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
