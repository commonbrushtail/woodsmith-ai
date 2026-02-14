import { test, expect } from '@playwright/test'

test.describe('Admin Login', () => {
  test('shows login form', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByRole('heading', { name: /ยินดีต้อนรับ/ })).toBeVisible()
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
  })

  test('shows error on invalid credentials', async ({ page }) => {
    await page.goto('/login')
    await page.locator('input[type="email"]').fill('wrong@example.com')
    await page.locator('input[type="password"]').fill('wrongpassword')
    await page.getByRole('button', { name: /เข้าสู่ระบบ/ }).click()
    // Should show error message, not redirect
    await expect(page.locator('[role="alert"]')).toBeVisible({ timeout: 10000 })
    await expect(page).toHaveURL('/login')
  })

  test('redirects to dashboard on valid login', async ({ page }) => {
    await page.goto('/login')
    await page.locator('input[type="email"]').fill('admin@woodsmith.test')
    await page.locator('input[type="password"]').fill('test-admin-password-123')
    await page.getByRole('button', { name: /เข้าสู่ระบบ/ }).click()
    await expect(page).toHaveURL('/admin/dashboard', { timeout: 15000 })
  })

  test('redirects /admin/* to /login when not authenticated', async ({ page }) => {
    await page.goto('/admin/products')
    await expect(page).toHaveURL('/login', { timeout: 10000 })
  })
})
