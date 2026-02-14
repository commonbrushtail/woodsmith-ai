'use server'

import { revalidatePath } from 'next/cache'
import { createServiceClient } from '@/lib/supabase/admin'

/**
 * List users from user_profiles joined with auth.users email.
 */
export async function getUsers({ page = 1, perPage = 50, search = '' } = {}) {
  const supabase = createServiceClient()
  const from = (page - 1) * perPage
  const to = from + perPage - 1

  let query = supabase
    .from('user_profiles')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (search) {
    query = query.or(`display_name.ilike.%${search}%,phone.ilike.%${search}%`)
  }

  const { data, error, count } = await query

  if (error) {
    return { data: [], count: 0, error: error.message }
  }

  // Fetch auth user emails for each profile
  const enriched = await Promise.all(
    (data || []).map(async (profile) => {
      const { data: authData } = await supabase.auth.admin.getUserById(profile.user_id)
      return {
        ...profile,
        email: authData?.user?.email || null,
      }
    })
  )

  return { data: enriched, count: count || 0, error: null }
}

/**
 * Get a single user profile by ID.
 */
export async function getUser(id) {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    return { data: null, error: error.message }
  }

  // Fetch email from auth
  const { data: authData } = await supabase.auth.admin.getUserById(data.user_id)

  return {
    data: { ...data, email: authData?.user?.email || null },
    error: null,
  }
}

/**
 * Invite a new user (create auth user + user_profile).
 */
export async function inviteUser(formData) {
  const supabase = createServiceClient()

  const email = formData.get('email')
  const displayName = formData.get('display_name') || ''
  const role = formData.get('role') || 'editor'
  const phone = formData.get('phone') || ''

  if (!email) {
    return { data: null, error: 'Email is required' }
  }

  // Create auth user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    email_confirm: true,
    user_metadata: { display_name: displayName },
  })

  if (authError) {
    return { data: null, error: authError.message }
  }

  // Create user_profile
  const { data, error } = await supabase
    .from('user_profiles')
    .insert({
      user_id: authData.user.id,
      display_name: displayName,
      phone,
      role,
      auth_provider: 'email',
    })
    .select()
    .single()

  if (error) {
    return { data: null, error: error.message }
  }

  revalidatePath('/admin/users')
  return { data, error: null }
}

/**
 * Update a user's role.
 */
export async function updateUserRole(id, role) {
  const supabase = createServiceClient()
  const { error } = await supabase
    .from('user_profiles')
    .update({ role })
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/users')
  return { error: null }
}

/**
 * Delete/deactivate a user. Deletes auth user which cascades to user_profiles.
 */
export async function deleteUser(id) {
  const supabase = createServiceClient()

  // Get the user_id from profile first
  const { data: profile, error: fetchError } = await supabase
    .from('user_profiles')
    .select('user_id')
    .eq('id', id)
    .single()

  if (fetchError) {
    return { error: fetchError.message }
  }

  // Delete auth user (cascades to user_profiles via ON DELETE CASCADE)
  const { error } = await supabase.auth.admin.deleteUser(profile.user_id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/users')
  return { error: null }
}
