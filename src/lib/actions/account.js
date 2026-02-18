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
 * Send password reset email to the current admin user.
 */
export async function sendPasswordResetEmail() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'ไม่ได้เข้าสู่ระบบ' }

  if (!user.email) return { error: 'ไม่พบอีเมลของบัญชีนี้' }

  const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/reset-password`,
  })

  if (error) {
    return { error: error.message }
  }

  return { error: null }
}

