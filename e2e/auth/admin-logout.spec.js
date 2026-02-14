import { test, expect } from '@playwright/test'

test.describe('Admin Logout', () => {
  test('logs out and redirects to login', async ({ page }) => {
    // Login
    await page.goto('/login')
    await page.locator('input[type="email"]').fill('admin@woodsmith.test')
    await page.locator('input[type="password"]').fill('test-admin-password-123')
    await page.getByRole('button', { name: /เข้าสู่ระบบ/ }).click()
    await expect(page).toHaveURL('/admin/dashboard', { timeout: 15000 })

    // Logout via sidebar button
    await page.locator('button[title="ออกจากระบบ"]').click()
    await expect(page).toHaveURL('/login', { timeout: 10000 })

    // Verify can't access admin
    await page.goto('/admin/dashboard')
    await expect(page).toHaveURL('/login', { timeout: 10000 })
  })
})
