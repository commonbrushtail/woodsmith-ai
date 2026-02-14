'use server'

import { revalidatePath } from 'next/cache'
import { createServiceClient } from '@/lib/supabase/admin'

/**
 * Fetch all branches ordered by sort_order.
 */
export async function getBranches({ page = 1, perPage = 50, search = '', sortAsc = true } = {}) {
  const supabase = createServiceClient()
  const from = (page - 1) * perPage
  const to = from + perPage - 1

  let query = supabase
    .from('branches')
    .select('*', { count: 'exact' })
    .order('sort_order', { ascending: sortAsc })
    .range(from, to)

  if (search) {
    query = query.ilike('name', `%${search}%`)
  }

  const { data, count, error } = await query

  if (error) {
    return { data: [], count: 0, error: error.message }
  }

  return { data: data || [], count: count || 0, error: null }
}

/**
 * Fetch a single branch by ID.
 */
export async function getBranch(id) {
  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('branches')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    return { data: null, error: error.message }
  }

  return { data, error: null }
}

/**
 * Create a new branch.
 */
export async function createBranch(formData) {
  const supabase = createServiceClient()

  const { data: existing } = await supabase
    .from('branches')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)

  const nextOrder = existing && existing.length > 0 ? existing[0].sort_order + 1 : 1

  const branchData = {
    name: formData.get('name') || '',
    address: formData.get('address') || '',
    phone: formData.get('phone') || '',
    map_url: formData.get('map_url') || '',
    published: formData.get('published') === 'true',
    sort_order: nextOrder,
  }

  const { data, error } = await supabase
    .from('branches')
    .insert(branchData)
    .select()
    .single()

  if (error) {
    return { data: null, error: error.message }
  }

  revalidatePath('/admin/branch')
  return { data, error: null }
}

/**
 * Update a branch.
 */
export async function updateBranch(id, formData) {
  const supabase = createServiceClient()

  const updates = {}

  if (formData.has('name')) updates.name = formData.get('name')
  if (formData.has('address')) updates.address = formData.get('address')
  if (formData.has('phone')) updates.phone = formData.get('phone')
  if (formData.has('map_url')) updates.map_url = formData.get('map_url')
  if (formData.has('published')) updates.published = formData.get('published') === 'true'

  const { data, error } = await supabase
    .from('branches')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return { data: null, error: error.message }
  }

  revalidatePath('/admin/branch')
  return { data, error: null }
}

/**
 * Delete a branch.
 */
export async function deleteBranch(id) {
  const supabase = createServiceClient()

  const { error } = await supabase
    .from('branches')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/branch')
  return { error: null }
}

/**
 * Toggle branch published status.
 */
export async function toggleBranchPublished(id, published) {
  const supabase = createServiceClient()

  const { error } = await supabase
    .from('branches')
    .update({ published })
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/branch')
  return { error: null }
}
