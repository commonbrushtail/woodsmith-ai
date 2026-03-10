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
 * Send a registration verification email via Resend.
 * Stores token in pending_registrations table. No Supabase auth user created yet.
 * @param {string} email
 * @returns {Promise<{ error: string | null }>}
 */
export async function sendRegistrationEmail(email) {
  if (!email || !EMAIL_REGEX.test(email)) {
    return { error: 'กรุณาระบุอีเมลที่ถูกต้อง' }
  }

  const { createServiceClient } = await import('@/lib/supabase/admin')
  const admin = createServiceClient()

  // Check if email is already registered with complete profile
  const { data: { users } } = await admin.auth.admin.listUsers()
  const existingUser = users?.find((u) => u.email === email)
  if (existingUser?.user_metadata?.profile_complete) {
    return { error: 'อีเมลนี้มีบัญชีอยู่แล้ว กรุณาเข้าสู่ระบบ' }
  }

  // Generate token and store in DB
  const crypto = await import('crypto')
  const token = crypto.randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + 3600000).toISOString() // 1 hour

  // Remove any existing pending registration for this email
  await admin.from('pending_registrations').delete().eq('email', email)

  // Insert new pending registration
  const { error: insertError } = await admin.from('pending_registrations').insert({
    email,
    token,
    expires_at: expiresAt,
  })

  if (insertError) {
    return { error: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const link = `${siteUrl}/register/complete?token=${token}`

  // Send via Resend API
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'WoodSmith <onboarding@resend.dev>',
      to: [email],
      subject: 'ยืนยันอีเมลเพื่อสมัครสมาชิก WoodSmith',
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; text-align: center;">
          <img src="${siteUrl}/favicon.png" alt="WoodSmith" width="60" height="60" style="display: block; margin: 0 auto 16px;" />
          <h2 style="color: #ff7e1b; margin: 0 0 8px;">WoodSmith</h2>
          <p style="color: #666; margin: 0 0 24px;">ยืนยันอีเมลเพื่อสมัครสมาชิก</p>
          <p>กรุณาคลิกปุ่มด้านล่างเพื่อดำเนินการสมัครสมาชิก</p>
          <a href="${link}" style="display: inline-block; background: #ff7e1b; color: white; padding: 12px 32px; text-decoration: none; border-radius: 4px; margin: 16px 0; font-weight: 600;">สมัครสมาชิก</a>
          <p style="color: #999; font-size: 12px; margin-top: 24px;">ลิงก์นี้จะหมดอายุใน 1 ชั่วโมง</p>
        </div>
      `,
    }),
  })

  if (!res.ok) {
    // Clean up the pending registration if email fails
    await admin.from('pending_registrations').delete().eq('token', token)
    return { error: 'ไม่สามารถส่งอีเมลได้ กรุณาลองใหม่อีกครั้ง' }
  }

  return { error: null }
}

/**
 * Verify a registration token from the pending_registrations table.
 * @param {string} token
 * @returns {Promise<{ email: string | null, error: string | null }>}
 */
export async function verifyRegistrationToken(token) {
  if (!token) {
    return { email: null, error: 'ลิงก์ไม่ถูกต้อง' }
  }

  const { createServiceClient } = await import('@/lib/supabase/admin')
  const admin = createServiceClient()

  const { data, error } = await admin
    .from('pending_registrations')
    .select('email, expires_at')
    .eq('token', token)
    .single()

  if (error || !data) {
    return { email: null, error: 'ลิงก์ไม่ถูกต้องหรือถูกใช้ไปแล้ว' }
  }

  if (new Date() > new Date(data.expires_at)) {
    await admin.from('pending_registrations').delete().eq('token', token)
    return { email: null, error: 'ลิงก์หมดอายุแล้ว กรุณาสมัครใหม่อีกครั้ง' }
  }

  return { email: data.email, error: null }
}

/**
 * Complete registration: verify token, create Supabase user, delete pending record.
 * @param {{ token: string, password: string, firstName: string, lastName: string }} data
 * @returns {Promise<{ email: string | null, error: string | null }>}
 */
export async function completeRegistration({ token, password, firstName, lastName }) {
  if (!token) {
    return { email: null, error: 'ลิงก์ไม่ถูกต้อง' }
  }

  if (!password || password.length < 8) {
    return { email: null, error: 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร' }
  }

  if (!firstName?.trim() || !lastName?.trim()) {
    return { email: null, error: 'กรุณากรอกชื่อและนามสกุล' }
  }

  // Verify token from DB
  const { createServiceClient } = await import('@/lib/supabase/admin')
  const admin = createServiceClient()

  const { data: pending, error: lookupError } = await admin
    .from('pending_registrations')
    .select('email, expires_at')
    .eq('token', token)
    .single()

  if (lookupError || !pending) {
    return { email: null, error: 'ลิงก์ไม่ถูกต้องหรือถูกใช้ไปแล้ว' }
  }

  if (new Date() > new Date(pending.expires_at)) {
    await admin.from('pending_registrations').delete().eq('token', token)
    return { email: null, error: 'ลิงก์หมดอายุแล้ว กรุณาสมัครใหม่อีกครั้ง' }
  }

  const { email } = pending

  // Delete any existing incomplete user with this email
  const { data: { users } } = await admin.auth.admin.listUsers()
  const existingUser = users?.find((u) => u.email === email)
  if (existingUser?.user_metadata?.profile_complete) {
    return { email: null, error: 'อีเมลนี้มีบัญชีอยู่แล้ว กรุณาเข้าสู่ระบบ' }
  }
  if (existingUser) {
    await admin.auth.admin.deleteUser(existingUser.id)
  }

  // Create user in Supabase
  const { data: userData, error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      first_name: firstName,
      last_name: lastName,
      display_name: `${firstName} ${lastName}`,
      role: 'customer',
      profile_complete: true,
    },
  })

  if (createError) {
    return { email: null, error: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' }
  }

  // Create user_profiles row
  if (userData?.user) {
    await admin.from('user_profiles').upsert({
      user_id: userData.user.id,
      first_name: firstName,
      last_name: lastName,
      email,
      role: 'customer',
      profile_complete: true,
    }, { onConflict: 'user_id' })
  }

  // Delete the pending registration
  await admin.from('pending_registrations').delete().eq('token', token)

  return { email, error: null }
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
