'use server'

import { createServiceClient } from '@/lib/supabase/admin'
import { createClient as createServerClient } from '@/lib/supabase/server'

/**
 * Generate a cryptographically random 6-digit OTP.
 */
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

/**
 * Generate a 6-character alphanumeric reference code (uppercase).
 * Displayed in the OTP screen UI and included in the SMS.
 */
function generateRefCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase()
}

/**
 * Send an OTP to the given Thai phone number via SMSKUB.
 * Stores the OTP in phone_otp_codes with a 3-minute expiry.
 *
 * @param {string} phone - 10-digit Thai mobile number (0XXXXXXXXX)
 * @returns {{ error: string } | undefined}
 */
export async function sendPhoneOtp(phone) {
  if (!phone || phone.length !== 10 || !phone.startsWith('0')) {
    return { error: 'เบอร์โทรศัพท์ไม่ถูกต้อง กรุณากรอกเบอร์ 10 หลัก' }
  }

  const otp = generateOtp()
  const refCode = generateRefCode()
  const expiresAt = new Date(Date.now() + 3 * 60 * 1000).toISOString()

  // Upsert OTP into DB (replaces any previous OTP for this phone)
  const admin = createServiceClient()
  const { error: dbError } = await admin.from('phone_otp_codes').upsert(
    { phone, otp, ref_code: refCode, expires_at: expiresAt, used: false, created_at: new Date().toISOString() },
    { onConflict: 'phone' }
  )
  if (dbError) {
    console.error('Failed to store OTP:', dbError.message)
    return { error: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' }
  }

  // Send OTP via SMSKUB
  const message = `รหัส OTP WoodSmith: ${otp}\nรหัสอ้างอิง: ${refCode}\n(หมดอายุใน 3 นาที)`
  try {
    const res = await fetch(`${process.env.SMSKUB_BASE_URL}/api/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', key: process.env.SMSKUB_TOKEN },
      body: JSON.stringify({
        to: [phone],
        from: process.env.SMSKUB_SENDER,
        message,
      }),
    })
    if (!res.ok) {
      const body = await res.text()
      console.error('SMSKUB error:', res.status, body)
      const json = (() => { try { return JSON.parse(body) } catch { return {} } })()
      if (json.error === 'balance is not enough') {
        return { error: 'ระบบ SMS ไม่พร้อมใช้งานชั่วคราว กรุณาติดต่อเจ้าหน้าที่' }
      }
      return { error: 'ไม่สามารถส่ง OTP ได้ กรุณาตรวจสอบเบอร์โทรและลองใหม่' }
    }
  } catch (err) {
    console.error('SMSKUB fetch failed:', err)
    return { error: 'ไม่สามารถส่ง OTP ได้ กรุณาตรวจสอบเบอร์โทรและลองใหม่' }
  }

  // Return ref code so the OTP screen can display it
  return { refCode }
}

/**
 * Verify the OTP for the given phone number, then find or create a Supabase Auth
 * user and establish a session via magic link.
 *
 * @param {string} phone - 10-digit Thai mobile number (0XXXXXXXXX)
 * @param {string} otp - 6-digit OTP entered by the user
 * @returns {{ profileComplete: boolean } | { error: string }}
 */
export async function verifyPhoneOtp(phone, otp) {
  const admin = createServiceClient()

  // 1. Look up the stored OTP
  const { data: record, error: fetchError } = await admin
    .from('phone_otp_codes')
    .select('otp, expires_at, used')
    .eq('phone', phone)
    .single()

  if (fetchError || !record) {
    return { error: 'รหัส OTP ไม่ถูกต้องหรือหมดอายุ' }
  }
  if (record.used) {
    return { error: 'รหัส OTP นี้ถูกใช้แล้ว' }
  }
  if (new Date(record.expires_at) < new Date()) {
    return { error: 'รหัส OTP หมดอายุแล้ว กรุณาขอรหัสใหม่' }
  }
  if (record.otp !== otp) {
    return { error: 'รหัส OTP ไม่ถูกต้อง' }
  }

  // OTP is valid — do NOT mark as used yet (mark only after session is established)

  // 2. Find or create Supabase Auth user by phone
  const { data: profileRow } = await admin
    .from('user_profiles')
    .select('user_id, profile_complete')
    .eq('phone', phone)
    .single()

  let authEmail
  let profileComplete

  if (profileRow) {
    // Returning user — get their auth email
    const { data: authData, error: getUserError } = await admin.auth.admin.getUserById(profileRow.user_id)
    if (getUserError || !authData?.user) {
      console.error('[verifyPhoneOtp] getUserById failed:', getUserError)
      return { error: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' }
    }
    authEmail = authData.user.email
    profileComplete = profileRow.profile_complete === true
  } else {
    // New user — create Supabase Auth account
    const placeholderEmail = `phone_${phone}@phone.placeholder`
    const { data: createData, error: createError } = await admin.auth.admin.createUser({
      email: placeholderEmail,
      email_confirm: true,
      app_metadata: { provider: 'phone', phone },
      user_metadata: { phone, role: 'customer' },
    })
    if (createError || !createData?.user) {
      console.error('[verifyPhoneOtp] createUser failed:', createError)
      return { error: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' }
    }
    authEmail = placeholderEmail
    profileComplete = false

    // Create initial user_profiles row (profile not yet complete)
    const { error: profileInsertError } = await admin.from('user_profiles').insert({
      user_id: createData.user.id,
      phone,
      role: 'customer',
      auth_provider: 'sms',
      profile_complete: false,
    })
    if (profileInsertError) {
      console.error('[verifyPhoneOtp] user_profiles insert failed:', profileInsertError.message)
    }
  }

  // 3. Generate magic link token to establish session
  const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
    type: 'magiclink',
    email: authEmail,
  })
  if (linkError || !linkData?.properties?.hashed_token) {
    console.error('[verifyPhoneOtp] generateLink failed:', linkError)
    return { error: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' }
  }

  // 4. Verify magic link to set session cookies (server-side, cookie-aware client)
  const supabase = await createServerClient()
  const { error: verifyError } = await supabase.auth.verifyOtp({
    token_hash: linkData.properties.hashed_token,
    type: 'magiclink',
  })
  if (verifyError) {
    console.error('[verifyPhoneOtp] verifyOtp failed:', verifyError)
    return { error: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' }
  }

  // 5. Mark OTP as used only AFTER session is successfully established
  await admin.from('phone_otp_codes').update({ used: true }).eq('phone', phone)

  return { profileComplete }
}
