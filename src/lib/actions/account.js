'use server'

import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/admin'

/**
 * Get the current admin user's session info for account page.
 */
export async function getAccountInfo() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return { data: null, error: 'ไม่ได้เข้าสู่ระบบ' }
  }

  // Get profile from user_profiles
  const admin = createServiceClient()
  const { data: profile } = await admin
    .from('user_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  return {
    data: {
      id: user.id,
      email: user.email,
      displayName: profile?.display_name || user.user_metadata?.display_name || '',
      phone: profile?.phone || '',
      role: profile?.role || user.user_metadata?.role || '',
    },
    error: null,
  }
}

/**
 * Update admin password — derives user ID from session.
 */
export async function updatePassword(formData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'ไม่ได้เข้าสู่ระบบ' }

  const newPassword = formData.get('new_password')
  const confirmPassword = formData.get('confirm_password')

  if (!newPassword || newPassword.length < 8) {
    return { error: 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร' }
  }

  if (newPassword !== confirmPassword) {
    return { error: 'รหัสผ่านไม่ตรงกัน' }
  }

  const admin = createServiceClient()
  const { error } = await admin.auth.admin.updateUserById(user.id, {
    password: newPassword,
  })

  if (error) {
    return { error: error.message }
  }

  return { error: null }
}

/**
 * Update admin email — derives user ID from session.
 */
export async function updateEmail(formData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'ไม่ได้เข้าสู่ระบบ' }

  const newEmail = formData.get('email')

  if (!newEmail) {
    return { error: 'กรุณาระบุอีเมล' }
  }

  const admin = createServiceClient()
  const { error } = await admin.auth.admin.updateUserById(user.id, {
    email: newEmail,
    email_confirm: true,
  })

  if (error) {
    return { error: error.message }
  }

  return { error: null }
}
