'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/admin'
import { quotationCreateSchema } from '@/lib/validations/quotations'
import { sanitizeObject } from '@/lib/sanitize'
import { sendEmail } from '@/lib/email'
import { newQuotationNotification } from '@/lib/email-templates'

/**
 * Create a customer profile row after registration.
 * userId is derived from the authenticated session — not accepted as a parameter.
 */
export async function createCustomerProfile({ displayName, phone, email }) {
  const authSupabase = await createClient()
  const { data: { user } } = await authSupabase.auth.getUser()
  if (!user) {
    return { error: 'Not authenticated' }
  }

  const sanitized = sanitizeObject({ displayName, phone, email })
  const supabase = createServiceClient()
  const profileData = {
    user_id: user.id,
    display_name: sanitized.displayName,
    phone: sanitized.phone,
    role: 'customer',
    profile_complete: true,
  }
  if (sanitized.email) {
    profileData.email = sanitized.email
  }
  const { error } = await supabase
    .from('user_profiles')
    .upsert(profileData, { onConflict: 'user_id' })

  if (error) {
    return { error: error.message }
  }
  return { error: null }
}

/**
 * Get the current user's profile (uses server client, respects RLS).
 */
export async function getCustomerProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { data: null, error: 'Not authenticated' }
  }

  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (error) {
    return { data: null, error: error.message }
  }
  return { data, error: null }
}

/**
 * Update the current user's customer profile.
 */
export async function updateCustomerProfile(formData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Not authenticated' }
  }

  const updates = {}
  const firstName = formData.get?.('first_name') ?? formData.first_name
  const lastName = formData.get?.('last_name') ?? formData.last_name
  const displayName = formData.get?.('display_name') ?? formData.display_name
  const phone = formData.get?.('phone') ?? formData.phone
  const avatarUrl = formData.get?.('avatar_url') ?? formData.avatar_url

  if (firstName !== undefined) updates.first_name = firstName
  if (lastName !== undefined) updates.last_name = lastName
  if (displayName !== undefined) updates.display_name = displayName
  if (phone !== undefined) updates.phone = phone
  if (avatarUrl !== undefined) updates.avatar_url = avatarUrl

  const { error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/account')
  return { error: null }
}

/**
 * Submit a quotation request.
 * Generates a quotation number and inserts into quotations table.
 */
export async function submitQuotation({
  productId,
  requesterName,
  requesterPhone,
  requesterEmail,
  message,
  quantity,
  selectedVariations,
  captchaToken,
} = {}) {
  const authSupabase = await createClient()
  const { data: { user } } = await authSupabase.auth.getUser()

  const isGuest = !user
  const supabase = createServiceClient()

  // Guest submissions require CAPTCHA verification
  if (isGuest) {
    if (!requesterName || !requesterEmail) {
      return { data: null, error: 'กรุณากรอกชื่อและอีเมล' }
    }
    const secretKey = process.env.RECAPTCHA_SECRET_KEY
    if (secretKey) {
      if (!captchaToken) {
        return { data: null, error: 'กรุณายืนยันว่าคุณไม่ใช่หุ่นยนต์' }
      }
      const verifyRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${encodeURIComponent(secretKey)}&response=${encodeURIComponent(captchaToken)}`,
      })
      const verifyData = await verifyRes.json()
      if (!verifyData.success) {
        return { data: null, error: 'การยืนยันตัวตนล้มเหลว กรุณาลองใหม่' }
      }
    }
  }

  // Auto-fill from user profile if logged in
  let name = requesterName || ''
  let phone = requesterPhone || ''
  let email = requesterEmail || ''

  if (user && (!name || !phone)) {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('first_name, last_name, display_name, phone, email')
      .eq('user_id', user.id)
      .single()

    if (profile) {
      if (!name) {
        const fullName = [profile.first_name, profile.last_name].filter(Boolean).join(' ')
        name = fullName || profile.display_name || ''
      }
      if (!phone) phone = profile.phone || user.phone || ''
      if (!email) email = profile.email || ''
    }
  }

  // Sanitize text inputs before validation
  const sanitized = sanitizeObject({
    requesterName: name,
    requesterPhone: phone,
    requesterEmail: email,
    message,
  })

  // Validate input
  const parseInput = {
    product_id: productId || null,
    requester_name: sanitized.requesterName,
    requester_phone: sanitized.requesterPhone,
    requester_email: sanitized.requesterEmail,
    message: sanitized.message,
    quantity: quantity || null,
  }
  const validation = quotationCreateSchema.safeParse(parseInput)
  if (!validation.success) {
    return { data: null, error: 'ข้อมูลไม่ถูกต้อง' }
  }

  // Generate quotation number: QT-YYYYMMDD-XXXX
  const now = new Date()
  const datePart = now.toISOString().slice(0, 10).replace(/-/g, '')
  const randomPart = Math.floor(1000 + Math.random() * 9000)
  const quotationNumber = `QT-${datePart}-${randomPart}`

  const { data, error } = await supabase
    .from('quotations')
    .insert({
      quotation_number: quotationNumber,
      customer_id: user ? user.id : null,
      product_id: productId,
      requester_name: name,
      requester_phone: phone,
      requester_email: email || null,
      message: message || null,
      quantity: quantity || null,
      selected_variations: selectedVariations || null,
      status: 'pending',
    })
    .select()
    .single()

  if (error) {
    return { data: null, error: error.message }
  }

  // Fire-and-forget: notify admin about new quotation
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL
  if (adminEmail) {
    // Look up product name for the notification
    let productName = null
    if (productId) {
      const { data: product } = await supabase
        .from('products')
        .select('name')
        .eq('id', productId)
        .single()
      productName = product?.name
    }

    const { subject, html } = newQuotationNotification({
      quotationNumber,
      requesterName: name,
      requesterPhone: phone,
      productName,
      message,
    })
    sendEmail({ to: adminEmail, subject, html })
  }

  return { data, error: null }
}

/**
 * Complete LINE user profile with first name, last name, and email.
 * Called from /register/line after the LINE OAuth callback for new users.
 */
export async function completeLineProfile({ firstName, lastName, email }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Not authenticated' }
  }

  const sanitized = sanitizeObject({ firstName, lastName, email })

  const updateData = {
    first_name: sanitized.firstName,
    last_name: sanitized.lastName,
    display_name: sanitized.firstName, // navbar shows "FirstName L." computed from first/last
    profile_complete: true,
  }
  if (sanitized.email) {
    updateData.email = sanitized.email
  }

  const { error: profileError } = await supabase
    .from('user_profiles')
    .update(updateData)
    .eq('user_id', user.id)

  if (profileError) {
    return { error: profileError.message }
  }

  // Also sync to Supabase Auth user_metadata
  const metaUpdate = {
    display_name: sanitized.firstName,
    first_name: sanitized.firstName,
    last_name: sanitized.lastName,
    profile_complete: true,
  }
  if (sanitized.email) {
    metaUpdate.email = sanitized.email
  }

  const { error: metaError } = await supabase.auth.updateUser({
    data: metaUpdate,
  })

  if (metaError) {
    // Non-fatal: profile row already updated, log and continue
    console.error('Failed to update LINE user auth metadata:', metaError.message)
  }

  // Update the Supabase Auth email from the placeholder to the real email.
  // Use service client (admin) to skip email confirmation.
  if (sanitized.email) {
    const adminClient = createServiceClient()
    const { error: authEmailError } = await adminClient.auth.admin.updateUserById(user.id, {
      email: sanitized.email,
      email_confirm: true,
    })
    if (authEmailError) {
      // Non-fatal: profile and metadata already updated, log and continue
      console.error('Failed to update auth email for LINE user:', authEmailError.message)
    }
  }

  revalidatePath('/account')
  return { error: null }
}

/**
 * Complete SMS OTP user profile with first name, last name, and email.
 * Called from /register/phone after OTP login for new SMS users.
 */
export async function completePhoneProfile({ firstName, lastName, email }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Not authenticated' }
  }

  const sanitized = sanitizeObject({ firstName, lastName, email })

  const updateData = {
    first_name: sanitized.firstName,
    last_name: sanitized.lastName,
    display_name: sanitized.firstName,
    profile_complete: true,
  }
  if (sanitized.email) {
    updateData.email = sanitized.email
  }

  const { error: profileError } = await supabase
    .from('user_profiles')
    .update(updateData)
    .eq('user_id', user.id)

  if (profileError) {
    return { error: profileError.message }
  }

  // Sync to auth user_metadata
  const metaUpdate = {
    display_name: sanitized.firstName,
    first_name: sanitized.firstName,
    last_name: sanitized.lastName,
    profile_complete: true,
  }
  if (sanitized.email) {
    metaUpdate.email = sanitized.email
  }

  const { error: metaError } = await supabase.auth.updateUser({ data: metaUpdate })
  if (metaError) {
    console.error('Failed to update phone user auth metadata:', metaError.message)
  }

  // Update Supabase Auth email from placeholder to real email
  if (sanitized.email) {
    const adminClient = createServiceClient()
    const { error: authEmailError } = await adminClient.auth.admin.updateUserById(user.id, {
      email: sanitized.email,
      email_confirm: true,
    })
    if (authEmailError) {
      console.error('Failed to update auth email for phone user:', authEmailError.message)
    }
  }

  revalidatePath('/account')
  return { error: null }
}

/**
 * Get the current customer's quotations (RLS-filtered).
 */
export async function getMyQuotations() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { data: [], error: 'Not authenticated' }
  }

  const { data, error } = await supabase
    .from('quotations')
    .select('*, product:products(code, name, product_images(url, sort_order))')
    .order('created_at', { ascending: false })

  if (error) {
    return { data: [], error: error.message }
  }

  return { data: data || [], error: null }
}

/**
 * Delete the current customer's account.
 * Removes the user_profiles row, then deletes the auth user via service client.
 */
export async function deleteMyAccount() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Delete user profile row
  const { error: profileError } = await supabase
    .from('user_profiles')
    .delete()
    .eq('user_id', user.id)

  if (profileError) {
    return { error: profileError.message }
  }

  // Delete auth user via service role
  const admin = createServiceClient()
  const { error: authError } = await admin.auth.admin.deleteUser(user.id)

  if (authError) {
    return { error: authError.message }
  }

  return { error: null }
}
