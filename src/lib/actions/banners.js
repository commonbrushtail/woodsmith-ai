'use server'

import { revalidatePath } from 'next/cache'
import { createServiceClient } from '@/lib/supabase/admin'
import { uploadFile, deleteFile, getPublicUrl } from '@/lib/storage'

/**
 * Fetch all banners ordered by sort_order.
 */
export async function getBanners() {
  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('banners')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) {
    return { data: [], error: error.message }
  }

  return { data: data || [], error: null }
}

/**
 * Fetch a single banner by ID.
 */
export async function getBanner(id) {
  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('banners')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    return { data: null, error: error.message }
  }

  return { data, error: null }
}

/**
 * Create a new banner.
 */
export async function createBanner(formData) {
  const supabase = createServiceClient()

  // Get next sort_order
  const { data: existing } = await supabase
    .from('banners')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)

  const nextOrder = existing && existing.length > 0 ? existing[0].sort_order + 1 : 1

  const bannerData = {
    image_url: formData.get('image_url') || '',
    link_url: formData.get('link_url') || null,
    status: formData.get('status') || 'inactive',
    sort_order: nextOrder,
  }

  // Handle file upload if provided
  const file = formData.get('file')
  if (file && file.size > 0) {
    const ext = file.name.split('.').pop()
    const filePath = `banners/${Date.now()}.${ext}`
    const { path, error: uploadError } = await uploadFile('banners', file, filePath)
    if (uploadError) return { data: null, error: uploadError.message }
    bannerData.image_url = getPublicUrl('banners', path)
  }

  const { data, error } = await supabase
    .from('banners')
    .insert(bannerData)
    .select()
    .single()

  if (error) {
    return { data: null, error: error.message }
  }

  revalidatePath('/admin/banner')
  return { data, error: null }
}

/**
 * Update a banner.
 */
export async function updateBanner(id, formData) {
  const supabase = createServiceClient()

  const updates = {}

  if (formData.has('link_url')) updates.link_url = formData.get('link_url') || null
  if (formData.has('status')) updates.status = formData.get('status')
  if (formData.has('sort_order')) updates.sort_order = Number(formData.get('sort_order'))

  // Handle file upload if provided
  const file = formData.get('file')
  if (file && file.size > 0) {
    const ext = file.name.split('.').pop()
    const filePath = `banners/${Date.now()}.${ext}`
    const { path, error: uploadError } = await uploadFile('banners', file, filePath)
    if (uploadError) return { data: null, error: uploadError.message }
    updates.image_url = getPublicUrl('banners', path)
  }

  const { data, error } = await supabase
    .from('banners')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return { data: null, error: error.message }
  }

  revalidatePath('/admin/banner')
  return { data, error: null }
}

/**
 * Delete a banner.
 */
export async function deleteBanner(id) {
  const supabase = createServiceClient()

  // Get image URL to delete from storage
  const { data: banner } = await supabase
    .from('banners')
    .select('image_url')
    .eq('id', id)
    .single()

  if (banner?.image_url) {
    const path = banner.image_url.split('/banners/').pop()
    if (path) await deleteFile('banners', path)
  }

  const { error } = await supabase
    .from('banners')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/banner')
  return { error: null }
}

/**
 * Toggle banner status (active/inactive).
 */
export async function toggleBannerStatus(id, status) {
  const supabase = createServiceClient()

  const { error } = await supabase
    .from('banners')
    .update({ status })
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/banner')
  return { error: null }
}
