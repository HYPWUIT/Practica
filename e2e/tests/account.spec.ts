import { expect, test } from '@playwright/test'
import {
  fillSignIn,
  formError,
  password,
  signOut,
  signUp,
  uniqueEmail,
} from './helpers'

const newPassword = 'Oakwood2026'

test('shows who is signed in', async ({ page }) => {
  const email = uniqueEmail()
  await signUp(page, email)

  await expect(page.getByLabel('Name')).toHaveValue('E2E Tester')
  await expect(page.getByLabel('Email')).toHaveValue(email)
  await expect(page.getByLabel('Email')).toBeDisabled()
  const month = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' })
  await expect(page.getByText(`member since ${month.format(new Date())}`)).toBeVisible()
})

test('changing the name saves it', async ({ page }) => {
  await signUp(page, uniqueEmail())
  const save = page.getByRole('button', { name: 'Save changes' })
  await expect(save).toBeDisabled()

  await page.getByLabel('Name').fill('  Renamed Tester  ')
  await save.click()
  await expect(page.getByText('Your name was saved.')).toBeVisible()
  await expect(save).toBeDisabled()

  await page.reload()
  await expect(page.getByLabel('Name')).toHaveValue('Renamed Tester')
})

test('a blank name is refused', async ({ page }) => {
  await signUp(page, uniqueEmail())
  await page.getByLabel('Name').fill(' ')
  await page.getByRole('button', { name: 'Save changes' }).click()
  await expect(page.getByText('Name is required')).toBeVisible()
})

test('changing the password: wrong current password, then success', async ({ page }) => {
  const email = uniqueEmail()
  await signUp(page, email)

  await page.getByLabel('Current password').fill('Wrong12345')
  await page.getByLabel('New password', { exact: true }).fill(newPassword)
  await page.getByLabel('Confirm new password').fill(newPassword)
  await page.getByRole('button', { name: 'Change password' }).click()
  await expect(formError(page)).toHaveText('Invalid password')

  await page.getByLabel('Current password').fill(password)
  await page.getByRole('button', { name: 'Change password' }).click()
  await expect(page.getByText('Password changed. Other devices have been signed out.')).toBeVisible()
  await expect(page.getByLabel('Current password')).toHaveValue('')

  // Still signed in here; the old password no longer works, the new one does.
  await page.reload()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Your account')
  await signOut(page)
  await fillSignIn(page, email, password)
  await expect(formError(page)).toHaveText('Invalid email or password')
  await fillSignIn(page, email, newPassword)
  await expect(page).toHaveURL(/\/account$/)
})

test('the form checks the new password before sending it', async ({ page }) => {
  await signUp(page, uniqueEmail())
  await page.getByLabel('Current password').fill(password)
  await page.getByLabel('New password', { exact: true }).fill('weakpassword')
  await page.getByLabel('Confirm new password').fill('different')
  await page.getByRole('button', { name: 'Change password' }).click()
  await expect(page.getByText('Include at least one uppercase letter')).toBeVisible()
  await expect(page.getByText('Passwords do not match')).toBeVisible()
})

test('"sign out of other devices" ends the other sessions', async ({ browser }) => {
  const email = uniqueEmail()
  const laptop = await browser.newPage()
  await signUp(laptop, email)

  const phone = await browser.newPage()
  await phone.goto('/login')
  await fillSignIn(phone, email, password)
  await expect(phone).toHaveURL(/\/account$/)

  await laptop.getByLabel('Current password').fill(password)
  await laptop.getByLabel('New password', { exact: true }).fill(newPassword)
  await laptop.getByLabel('Confirm new password').fill(newPassword)
  await expect(laptop.getByLabel('Sign out of all other devices')).toBeChecked()
  await laptop.getByRole('button', { name: 'Change password' }).click()
  await expect(laptop.getByText(/Password changed/)).toBeVisible()

  await phone.reload()
  await expect(phone).toHaveURL(/\/login\?next=%2Faccount$/)
  await laptop.reload()
  await expect(laptop.getByRole('heading', { level: 1 })).toHaveText('Your account')

  await laptop.close()
  await phone.close()
})

test('signing out from the account page', async ({ page }) => {
  await signUp(page, uniqueEmail())
  await signOut(page)
  await page.goto('/account')
  await expect(page).toHaveURL(/\/login\?next=%2Faccount$/)
})
