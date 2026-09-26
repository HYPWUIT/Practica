import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'

export const password = 'Robin12345'

/** A fresh address per test, so tests can run in parallel and be re-run. */
export const uniqueEmail = () =>
  `e2e-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`

/** Signs up and waits for the redirect to the account page. */
export async function signUp(page: Page, email: string, name = 'E2E Tester') {
  await fillSignUp(page, email, name)
  await expect(page).toHaveURL(/\/account$/)
}

/** Fills and submits the sign-up form, without assuming it succeeds. */
export async function fillSignUp(page: Page, email: string, name = 'E2E Tester') {
  await page.goto('/signup')
  await page.getByLabel('Name').fill(name)
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Password', { exact: true }).fill(password)
  await page.getByLabel('Confirm password').fill(password)
  await page.getByRole('button', { name: 'Create account' }).click()
}

/** Fills and submits the sign-in form on the current /login page. */
export async function fillSignIn(page: Page, email: string, withPassword: string) {
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Password').fill(withPassword)
  await page.getByRole('button', { name: 'Sign in' }).click()
}

export async function signOut(page: Page) {
  if (!page.url().endsWith('/account')) await page.goto('/account')
  await page.getByRole('button', { name: 'Sign out' }).click()
  await expect(page).toHaveURL(/\/login/)
}

export const formError = (page: Page) => page.locator('form [role="alert"]')
