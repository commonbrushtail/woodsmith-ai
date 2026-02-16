'use server'

import { revalidatePath } from 'next/cache'
import { createServiceClient } from '@/lib/supabase/admin'
import { uploadFile, deleteFile, getPublicUrl } from '@/lib/storage'

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
    region: formData.get('region') || null,
    hours: formData.get('hours') || null,
    line_url: formData.get('line_url') || null,
    published: formData.get('published') === 'true',
    sort_order: nextOrder,
  }

  // Handle image upload
  const imageFile = formData.get('image')
  if (imageFile && imageFile.size > 0) {
    const ext = imageFile.name.split('.').pop()
    const filePath = `branches/${Date.now()}.${ext}`
    const { path, error: uploadError } = await uploadFile('products', imageFile, filePath)
    if (uploadError) return { data: null, error: uploadError.message }
    branchData.image_url = getPublicUrl('products', path)
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
  if (formData.has('region')) updates.region = formData.get('region')
  if (formData.has('hours')) updates.hours = formData.get('hours')
  if (formData.has('line_url')) updates.line_url = formData.get('line_url')
  if (formData.has('published')) updates.published = formData.get('published') === 'true'

  // Handle image upload / remove
  const imageFile = formData.get('image')
  const removeImage = formData.get('remove_image') === 'true'

  if (removeImage || (imageFile && imageFile.size > 0)) {
    // Delete old image from storage
    const { data: current } = await supabase.from('branches').select('image_url').eq('id', id).single()
    if (current?.image_url) {
      const oldPath = current.image_url.split('/products/')[1]
      if (oldPath) await deleteFile('products', oldPath)
    }

    if (imageFile && imageFile.size > 0) {
      const ext = imageFile.name.split('.').pop()
      const filePath = `branches/${Date.now()}.${ext}`
      const { path, error: uploadError } = await uploadFile('products', imageFile, filePath)
      if (uploadError) return { data: null, error: uploadError.message }
      updates.image_url = getPublicUrl('products', path)
    } else {
      updates.image_url = null
    }
  }

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

  // Clean up image from storage
  const { data: branch } = await supabase.from('branches').select('image_url').eq('id', id).single()
  if (branch?.image_url) {
    const oldPath = branch.image_url.split('/products/')[1]
    if (oldPath) await deleteFile('products', oldPath)
  }

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
 * Set a branch as the head office (only one allowed at a time).
 */
export async function setBranchHq(id) {
  const supabase = createServiceClient()

  // Clear any existing HQ
  const { error: clearError } = await supabase
    .from('branches')
    .update({ is_hq: false })
    .eq('is_hq', true)

  if (clearError) {
    return { error: clearError.message }
  }

  // Set the target branch as HQ
  const { error } = await supabase
    .from('branches')
    .update({ is_hq: true })
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/branch')
  revalidatePath('/')
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
