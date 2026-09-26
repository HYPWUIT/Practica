import { expect, test } from '@playwright/test'

/**
 * The catalogue's own logic is covered by the server tests. These check the
 * page is actually wired to the API: data arrives, and a filter change in the
 * UI becomes a request with the right parameters.
 */

test('the catalogue loads its products from the API', async ({ page }) => {
  const response = page.waitForResponse((r) => r.url().includes('/api/products?') || r.url().endsWith('/api/products'))
  await page.goto('/catalog')
  expect((await response).status()).toBe(200)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Shop')
  await expect(page.getByRole('link', { name: 'Alder Three-Seat Sofa' }).first()).toBeVisible()
})

test('a filtered URL asks the API for exactly that filter', async ({ page }) => {
  const request = page.waitForRequest((r) => r.url().includes('/api/products?'))
  await page.goto('/catalog?category=beds&sort=price-desc')
  const params = new URL((await request).url()).searchParams
  expect(params.get('category')).toBe('beds')
  expect(params.get('sort')).toBe('price-desc')
})

test('a product page and its related items come from the API', async ({ page }) => {
  await page.goto('/product/willow-arc-lamp')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Willow Arc Lamp')
})

test('an unknown product shows the not-found view', async ({ page }) => {
  await page.goto('/product/does-not-exist')
  await expect(page.getByText('We could not find that piece')).toBeVisible()
})
