import { test, expect } from '@playwright/test'

test.describe('Customer LINE Login', () => {
  test('LINE login button exists in modal', async ({ page }) => {
    await page.goto('/')
    const loginBtn = page.getByRole('button', { name: /เข้าสู่ระบบ/ }).first()
    if (await loginBtn.isVisible()) {
      await loginBtn.click()
      await expect(page.getByRole('button', { name: /LINE/ })).toBeVisible()
    }
  })
})
