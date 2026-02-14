import { test, expect } from '@playwright/test'

test.describe('Customer SMS OTP Login', () => {
  test('shows phone input in login modal', async ({ page }) => {
    await page.goto('/')
    // Open login modal via navbar button
    const loginBtn = page.getByRole('button', { name: /เข้าสู่ระบบ/ }).first()
    if (await loginBtn.isVisible()) {
      await loginBtn.click()
      await expect(page.locator('input[type="tel"]')).toBeVisible()
    }
  })

  test('sends OTP and shows verification input', async ({ page }) => {
    await page.goto('/')
    const loginBtn = page.getByRole('button', { name: /เข้าสู่ระบบ/ }).first()
    if (await loginBtn.isVisible()) {
      await loginBtn.click()
      await page.locator('input[type="tel"]').fill('0812345678')
      // Click the send OTP button
      const sendBtn = page.locator('button').filter({ hasText: /เข้าสู่ระบบ/ }).last()
      await sendBtn.click()
      // Should show OTP input fields
      await expect(page.locator('input[inputmode="numeric"]').first()).toBeVisible({ timeout: 5000 })
    }
  })
})
