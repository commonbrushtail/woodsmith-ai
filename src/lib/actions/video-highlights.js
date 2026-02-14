'use server'

import { revalidatePath } from 'next/cache'
import { createServiceClient } from '@/lib/supabase/admin'

/**
 * Fetch all video highlights ordered by sort_order.
 */
export async function getVideoHighlights({ page = 1, perPage = 50, search = '', sortAsc = true } = {}) {
  const supabase = createServiceClient()
  const from = (page - 1) * perPage
  const to = from + perPage - 1

  let query = supabase
    .from('video_highlights')
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
 * Fetch a single video highlight by ID.
 */
export async function getVideoHighlight(id) {
  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('video_highlights')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    return { data: null, error: error.message }
  }

  return { data, error: null }
}

/**
 * Create a new video highlight.
 */
export async function createVideoHighlight(formData) {
  const supabase = createServiceClient()

  // Get next sort_order
  const { data: existing } = await supabase
    .from('video_highlights')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)

  const nextOrder = existing && existing.length > 0 ? existing[0].sort_order + 1 : 1

  const highlightData = {
    title: formData.get('title'),
    youtube_url: formData.get('youtube_url') || '',
    thumbnail_url: formData.get('thumbnail_url') || null,
    duration: formData.get('duration') || null,
    channel_name: formData.get('channel_name') || null,
    published: formData.get('published') === 'true',
    sort_order: nextOrder,
  }

  const { data, error } = await supabase
    .from('video_highlights')
    .insert(highlightData)
    .select()
    .single()

  if (error) {
    return { data: null, error: error.message }
  }

  revalidatePath('/admin/video-highlight')
  return { data, error: null }
}

/**
 * Update a video highlight.
 */
export async function updateVideoHighlight(id, formData) {
  const supabase = createServiceClient()

  const updates = {}
  const fields = ['title', 'youtube_url', 'thumbnail_url', 'duration', 'channel_name']
  for (const field of fields) {
    const val = formData.get(field)
    if (val !== null && val !== undefined) updates[field] = val
  }

  if (formData.has('published')) {
    updates.published = formData.get('published') === 'true'
  }

  const { data, error } = await supabase
    .from('video_highlights')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return { data: null, error: error.message }
  }

  revalidatePath('/admin/video-highlight')
  return { data, error: null }
}

/**
 * Delete a video highlight.
 */
export async function deleteVideoHighlight(id) {
  const supabase = createServiceClient()

  const { error } = await supabase
    .from('video_highlights')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/video-highlight')
  return { error: null }
}

/**
 * Toggle video highlight published status.
 */
/**
 * Batch update sort_order for video highlights.
 * @param {Array<{id: string, sort_order: number}>} updates
 */
export async function reorderVideoHighlights(updates) {
  const supabase = createServiceClient()

  for (const { id, sort_order } of updates) {
    const { error } = await supabase
      .from('video_highlights')
      .update({ sort_order })
      .eq('id', id)

    if (error) {
      return { error: error.message }
    }
  }

  revalidatePath('/admin/video-highlight')
  return { error: null }
}

export async function toggleVideoHighlightPublished(id, published) {
  const supabase = createServiceClient()

  const { error } = await supabase
    .from('video_highlights')
    .update({ published })
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/video-highlight')
  return { error: null }
}
