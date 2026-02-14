'use server'

import { createClient } from '@/lib/supabase/server'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Request a password reset email via Supabase.
 * @param {string} email
 * @returns {Promise<{ error: string | null }>}
 */
export async function requestPasswordReset(email) {
  if (!email || !EMAIL_REGEX.test(email)) {
    return { error: 'กรุณาระบุอีเมลที่ถูกต้อง' }
  }

  const supabase = await createClient()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/auth/reset-password`,
  })

  if (error) {
    return { error: error.message }
  }

  return { error: null }
}

/**
 * Update the current user's password (called after reset link is clicked).
 * @param {string} newPassword
 * @returns {Promise<{ error: string | null }>}
 */
export async function updatePassword(newPassword) {
  if (!newPassword || newPassword.length < 8) {
    return { error: 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร' }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ password: newPassword })

  if (error) {
    return { error: error.message }
  }

  return { error: null }
}
