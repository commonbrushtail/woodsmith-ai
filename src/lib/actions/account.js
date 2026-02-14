'use server'

import { createServiceClient } from '@/lib/supabase/admin'

/**
 * Update user password via admin API.
 * In a real app, you'd verify current password first.
 */
export async function updatePassword(userId, formData) {
  const supabase = createServiceClient()

  const newPassword = formData.get('new_password')
  const confirmPassword = formData.get('confirm_password')

  if (!newPassword || newPassword.length < 8) {
    return { error: 'Password must be at least 8 characters' }
  }

  if (newPassword !== confirmPassword) {
    return { error: 'Passwords do not match' }
  }

  const { error } = await supabase.auth.admin.updateUserById(userId, {
    password: newPassword,
  })

  if (error) {
    return { error: error.message }
  }

  return { error: null }
}

/**
 * Update user email via admin API.
 */
export async function updateEmail(userId, formData) {
  const supabase = createServiceClient()

  const newEmail = formData.get('email')

  if (!newEmail) {
    return { error: 'Email is required' }
  }

  const { error } = await supabase.auth.admin.updateUserById(userId, {
    email: newEmail,
    email_confirm: true,
  })

  if (error) {
    return { error: error.message }
  }

  return { error: null }
}
