'use server'

import { revalidatePath } from 'next/cache'
import { createServiceClient } from '@/lib/supabase/admin'
import { uploadFile, deleteFile, getPublicUrl } from '@/lib/storage'

/**
 * Fetch gallery items ordered by sort_order, optionally filtered by section.
 */
export async function getGalleryItems({ section, page = 1, perPage = 200, sortAsc = true } = {}) {
  const supabase = createServiceClient()
  const from = (page - 1) * perPage
  const to = from + perPage - 1

  let query = supabase
    .from('gallery_items')
    .select('*', { count: 'exact' })
    .order('sort_order', { ascending: sortAsc })
    .range(from, to)

  if (section) {
    query = query.eq('section', section)
  }

  const { data, count, error } = await query

  if (error) {
    return { data: [], count: 0, error: error.message }
  }

  return { data: data || [], count: count || 0, error: null }
}

/**
 * Upload multiple gallery images at once.
 * FormData: section (string), images (File[])
 */
export async function createGalleryItems(formData) {
  const supabase = createServiceClient()
  const section = formData.get('section') || 'homepage'

  // Get next sort_order for this section
  const { data: existing } = await supabase
    .from('gallery_items')
    .select('sort_order')
    .eq('section', section)
    .order('sort_order', { ascending: false })
    .limit(1)

  let nextOrder = existing && existing.length > 0 ? existing[0].sort_order + 1 : 0
  const files = formData.getAll('images')
  const results = []

  for (const file of files) {
    if (!file || file.size === 0) continue
    const ext = file.name.split('.').pop()
    const filePath = `gallery/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const { path, error: uploadError } = await uploadFile('gallery', file, filePath)
    if (uploadError) {
      results.push({ error: uploadError.message, file: file.name })
      continue
    }
    const imageUrl = getPublicUrl('gallery', path)
    const { data, error } = await supabase
      .from('gallery_items')
      .insert({ image_url: imageUrl, published: true, sort_order: nextOrder++, section })
      .select()
      .single()
    if (error) {
      results.push({ error: error.message, file: file.name })
    } else {
      results.push({ data, error: null })
    }
  }

  revalidatePath('/admin/gallery')
  return { results, error: null }
}

/**
 * Delete a gallery item and its image from storage.
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
 * Batch update sort_order for gallery items.
 * @param {Array<{id: string, sort_order: number}>} updates
 */
export async function reorderGalleryItems(updates) {
  const supabase = createServiceClient()

  for (const { id, sort_order } of updates) {
    const { error } = await supabase
      .from('gallery_items')
      .update({ sort_order })
      .eq('id', id)

    if (error) {
      return { error: error.message }
    }
  }

  revalidatePath('/admin/gallery')
  return { error: null }
}
