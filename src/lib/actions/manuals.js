'use server'

import { revalidatePath } from 'next/cache'
import { createServiceClient } from '@/lib/supabase/admin'
import { uploadFile, deleteFile, getPublicUrl } from '@/lib/storage'

/**
 * Fetch all manuals ordered by sort_order.
 */
export async function getManuals({ page = 1, perPage = 50, search = '', sortAsc = true } = {}) {
  const supabase = createServiceClient()
  const from = (page - 1) * perPage
  const to = from + perPage - 1

  let query = supabase
    .from('manuals')
    .select('*', { count: 'exact' })
    .order('sort_order', { ascending: sortAsc })
    .range(from, to)

  if (search) {
    query = query.ilike('title', `%${search}%`)
  }

  const { data, count, error } = await query

  if (error) {
    return { data: [], count: 0, error: error.message }
  }

  return { data: data || [], count: count || 0, error: null }
}

/**
 * Fetch a single manual by ID.
 */
export async function getManual(id) {
  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('manuals')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    return { data: null, error: error.message }
  }

  return { data, error: null }
}

/**
 * Create a new manual.
 */
export async function createManual(formData) {
  const supabase = createServiceClient()

  // Get next sort_order
  const { data: existing } = await supabase
    .from('manuals')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)

  const nextOrder = existing && existing.length > 0 ? existing[0].sort_order + 1 : 1

  const manualData = {
    title: formData.get('title') || '',
    file_url: '',
    cover_image_url: null,
    youtube_url: formData.get('youtube_url') || null,
    published: formData.get('published') === 'true',
    sort_order: nextOrder,
  }

  // Handle PDF file upload
  const file = formData.get('file')
  if (file && file.size > 0) {
    const ext = file.name.split('.').pop()
    const filePath = `manuals/${Date.now()}.${ext}`
    const { path, error: uploadError } = await uploadFile('manuals', file, filePath)
    if (uploadError) return { data: null, error: uploadError.message }
    manualData.file_url = getPublicUrl('manuals', path)
  }

  // Handle cover image upload
  const coverFile = formData.get('cover_image')
  if (coverFile && coverFile.size > 0) {
    const ext = coverFile.name.split('.').pop()
    const filePath = `manuals/covers/${Date.now()}.${ext}`
    const { path, error: uploadError } = await uploadFile('manuals', coverFile, filePath)
    if (uploadError) return { data: null, error: uploadError.message }
    manualData.cover_image_url = getPublicUrl('manuals', path)
  }

  const { data, error } = await supabase
    .from('manuals')
    .insert(manualData)
    .select()
    .single()

  if (error) {
    return { data: null, error: error.message }
  }

  revalidatePath('/admin/manual')
  return { data, error: null }
}

/**
 * Update a manual.
 */
export async function updateManual(id, formData) {
  const supabase = createServiceClient()

  const updates = {}

  if (formData.has('title')) {
    updates.title = formData.get('title')
  }
  if (formData.has('youtube_url')) {
    updates.youtube_url = formData.get('youtube_url')
  }
  if (formData.has('published')) {
    updates.published = formData.get('published') === 'true'
  }

  // Handle PDF file upload
  const file = formData.get('file')
  if (file && file.size > 0) {
    const ext = file.name.split('.').pop()
    const filePath = `manuals/${Date.now()}.${ext}`
    const { path, error: uploadError } = await uploadFile('manuals', file, filePath)
    if (uploadError) return { data: null, error: uploadError.message }
    updates.file_url = getPublicUrl('manuals', path)
  }

  // Handle cover image upload
  const coverFile = formData.get('cover_image')
  if (coverFile && coverFile.size > 0) {
    const ext = coverFile.name.split('.').pop()
    const filePath = `manuals/covers/${Date.now()}.${ext}`
    const { path, error: uploadError } = await uploadFile('manuals', coverFile, filePath)
    if (uploadError) return { data: null, error: uploadError.message }
    updates.cover_image_url = getPublicUrl('manuals', path)
  }

  const { data, error } = await supabase
    .from('manuals')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return { data: null, error: error.message }
  }

  revalidatePath('/admin/manual')
  return { data, error: null }
}

/**
 * Delete a manual.
 */
export async function deleteManual(id) {
  const supabase = createServiceClient()

  const { data: manual } = await supabase
    .from('manuals')
    .select('file_url, cover_image_url')
    .eq('id', id)
    .single()

  if (manual?.file_url) {
    const path = manual.file_url.split('/manuals/').pop()
    if (path) await deleteFile('manuals', path)
  }
  if (manual?.cover_image_url) {
    const path = manual.cover_image_url.split('/manuals/').pop()
    if (path) await deleteFile('manuals', path)
  }

  const { error } = await supabase
    .from('manuals')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/manual')
  return { error: null }
}

/**
 * Toggle manual published status.
 */
/**
 * Batch update sort_order for manuals.
 * @param {Array<{id: string, sort_order: number}>} updates
 */
export async function reorderManuals(updates) {
  const supabase = createServiceClient()

  for (const { id, sort_order } of updates) {
    const { error } = await supabase
      .from('manuals')
      .update({ sort_order })
      .eq('id', id)

    if (error) {
      return { error: error.message }
    }
  }

  revalidatePath('/admin/manual')
  return { error: null }
}

export async function toggleManualPublished(id, published) {
  const supabase = createServiceClient()

  const { error } = await supabase
    .from('manuals')
    .update({ published })
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/manual')
  return { error: null }
}
