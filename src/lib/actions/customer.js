'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/admin'
import { quotationCreateSchema } from '@/lib/validations/quotations'
import { sanitizeObject } from '@/lib/sanitize'

/**
 * Create a customer profile row after registration.
 */
export async function createCustomerProfile(userId, { displayName, phone, email }) {
  const sanitized = sanitizeObject({ displayName, phone, email })
  const supabase = createServiceClient()
  const profileData = {
    user_id: userId,
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
    .insert(profileData)

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
  const displayName = formData.get?.('display_name') ?? formData.display_name
  const phone = formData.get?.('phone') ?? formData.phone
  const avatarUrl = formData.get?.('avatar_url') ?? formData.avatar_url

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
}) {
  // Sanitize text inputs before validation
  const sanitized = sanitizeObject({
    requesterName,
    requesterPhone,
    requesterEmail: requesterEmail || '',
    message,
  })

  // Validate input
  const validation = quotationCreateSchema.safeParse({
    product_id: productId || null,
    requester_name: sanitized.requesterName,
    requester_phone: sanitized.requesterPhone,
    requester_email: sanitized.requesterEmail,
    message: sanitized.message,
    quantity: quantity || null,
  })
  if (!validation.success) {
    const fieldErrors = Object.fromEntries(
      Object.entries(validation.error.flatten().fieldErrors).map(([k, v]) => [k, v[0]])
    )
    return { data: null, error: 'ข้อมูลไม่ถูกต้อง', fieldErrors }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Generate quotation number: QT-YYYYMMDD-XXXX
  const now = new Date()
  const datePart = now.toISOString().slice(0, 10).replace(/-/g, '')
  const randomPart = Math.floor(1000 + Math.random() * 9000)
  const quotationNumber = `QT-${datePart}-${randomPart}`

  const { data, error } = await supabase
    .from('quotations')
    .insert({
      quotation_number: quotationNumber,
      customer_id: user?.id || null,
      product_id: productId,
      requester_name: requesterName,
      requester_phone: requesterPhone,
      requester_email: requesterEmail || null,
      message: message || null,
      quantity: quantity || null,
      status: 'pending',
    })
    .select()
    .single()

  if (error) {
    return { data: null, error: error.message }
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
  const displayName = `${sanitized.firstName} ${sanitized.lastName}`.trim()

  const updateData = {
    first_name: sanitized.firstName,
    last_name: sanitized.lastName,
    display_name: displayName,
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
    display_name: displayName,
    first_name: sanitized.firstName,
    last_name: sanitized.lastName,
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
    .select('*, product:products(code, name)')
    .order('created_at', { ascending: false })

  if (error) {
    return { data: [], error: error.message }
  }

  return { data: data || [], error: null }
}
