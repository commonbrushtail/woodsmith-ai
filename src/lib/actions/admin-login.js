'use server'

import { createClient } from '@/lib/supabase/server'
import { loginLimiter } from '@/lib/rate-limit'
import { logAudit } from '@/lib/audit'
import { headers } from 'next/headers'

/**
 * Server-side admin login with rate limiting.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ error: string | null }>}
 */
export async function adminLogin(email, password) {
  // Get client IP for rate limiting
  const headerList = await headers()
  const ip = headerList.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'

  const rateCheck = loginLimiter.check(ip)
  if (!rateCheck.allowed) {
    const retrySeconds = Math.ceil(rateCheck.retryAfterMs / 1000)
    return { error: `เข้าสู่ระบบบ่อยเกินไป กรุณารอ ${retrySeconds} วินาที` }
  }

  if (!email || !password) {
    return { error: 'กรุณาระบุอีเมลและรหัสผ่าน' }
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    logAudit({ userId: 'anonymous', action: 'login.failed', ip, details: { email } })
    return { error: error.message }
  }

  logAudit({ userId: data.user?.id, action: 'login.success', ip, details: { email } })
  return { error: null }
}
