'use server'

import { revalidatePath } from 'next/cache'
import { createServiceClient } from '@/lib/supabase/admin'
import { uploadFile, deleteFile, getPublicUrl } from '@/lib/storage'

/**
 * Fetch all gallery items ordered by sort_order.
 */
export async function getGalleryItems({ page = 1, perPage = 50, search = '', sortAsc = true } = {}) {
  const supabase = createServiceClient()
  const from = (page - 1) * perPage
  const to = from + perPage - 1

  let query = supabase
    .from('gallery_items')
    .select('*', { count: 'exact' })
    .order('sort_order', { ascending: sortAsc })
    .range(from, to)

  if (search) {
    query = query.ilike('caption', `%${search}%`)
  }

  const { data, count, error } = await query

  if (error) {
    return { data: [], count: 0, error: error.message }
  }

  return { data: data || [], count: count || 0, error: null }
}

/**
 * Fetch a single gallery item by ID.
 */
export async function getGalleryItem(id) {
  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('gallery_items')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    return { data: null, error: error.message }
  }

  return { data, error: null }
}

/**
 * Create a new gallery item.
 */
export async function createGalleryItem(formData) {
  const supabase = createServiceClient()

  // Get next sort_order
  const { data: existing } = await supabase
    .from('gallery_items')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)

  const nextOrder = existing && existing.length > 0 ? existing[0].sort_order + 1 : 1

  const itemData = {
    caption: formData.get('caption') || '',
    image_url: '',
    published: formData.get('published') === 'true',
    sort_order: nextOrder,
  }

  // Handle image upload
  const file = formData.get('image')
  if (file && file.size > 0) {
    const ext = file.name.split('.').pop()
    const filePath = `gallery/${Date.now()}.${ext}`
    const { path, error: uploadError } = await uploadFile('gallery', file, filePath)
    if (uploadError) return { data: null, error: uploadError.message }
    itemData.image_url = getPublicUrl('gallery', path)
  }

  const { data, error } = await supabase
    .from('gallery_items')
    .insert(itemData)
    .select()
    .single()

  if (error) {
    return { data: null, error: error.message }
  }

  revalidatePath('/admin/gallery')
  return { data, error: null }
}

/**
 * Update a gallery item.
 */
export async function updateGalleryItem(id, formData) {
  const supabase = createServiceClient()

  const updates = {}

  if (formData.has('caption')) {
    updates.caption = formData.get('caption')
  }
  if (formData.has('published')) {
    updates.published = formData.get('published') === 'true'
  }

  // Handle image upload
  const file = formData.get('image')
  if (file && file.size > 0) {
    const ext = file.name.split('.').pop()
    const filePath = `gallery/${Date.now()}.${ext}`
    const { path, error: uploadError } = await uploadFile('gallery', file, filePath)
    if (uploadError) return { data: null, error: uploadError.message }
    updates.image_url = getPublicUrl('gallery', path)
  }

  const { data, error } = await supabase
    .from('gallery_items')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return { data: null, error: error.message }
  }

  revalidatePath('/admin/gallery')
  return { data, error: null }
}

/**
 * Delete a gallery item.
 */
export async function deleteGalleryItem(id) {
  const supabase = createServiceClient()

  const { data: item } = await supabase
    .from('gallery_items')
    .select('image_url')
    .eq('id', id)
    .single()

  if (item?.image_url) {
    const path = item.image_url.split('/gallery/').pop()
    if (path) await deleteFile('gallery', path)
  }

  const { error } = await supabase
    .from('gallery_items')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/gallery')
  return { error: null }
}

/**
 * Toggle gallery item published status.
 */
export async function toggleGalleryPublished(id, published) {
  const supabase = createServiceClient()

  const { error } = await supabase
    .from('gallery_items')
    .update({ published })
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/gallery')
  return { error: null }
}
