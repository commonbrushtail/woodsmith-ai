'use server'

import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth/require-admin'
import { createServiceClient } from '@/lib/supabase/admin'
import { uploadFile, deleteFile, getPublicUrl } from '@/lib/storage'

/**
 * Fetch all FAQ groups with nested FAQs.
 */
export async function getFaqGroups() {
  const { user, error: authError } = await requireAdmin()
  if (authError) return { data: [], count: 0, error: authError }

  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('faq_groups')
    .select('*, faqs(*)')
    .order('sort_order', { ascending: true })
    .order('sort_order', { referencedTable: 'faqs', ascending: true })

  if (error) {
    return { data: [], error: error.message }
  }

  return { data: data || [], error: null }
}

/**
 * Create a new FAQ group.
 */
export async function createFaqGroup(formData) {
  const { user, error: authError } = await requireAdmin()
  if (authError) return { data: null, error: authError }

  const supabase = createServiceClient()

  const { data: existing } = await supabase
    .from('faq_groups')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)

  const nextOrder = existing && existing.length > 0 ? existing[0].sort_order + 1 : 0

  const groupData = {
    name: formData.get('name') || 'กลุ่มใหม่',
    published: true,
    sort_order: nextOrder,
  }

  // Handle image upload
  const image = formData.get('image')
  if (image && image.size > 0) {
    const ext = image.name.split('.').pop()
    const filePath = `faq-groups/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const { path, error: uploadError } = await uploadFile('products', image, filePath)
    if (uploadError) {
      return { data: null, error: uploadError.message }
    }
    groupData.image_url = getPublicUrl('products', path)
  }

  const { data, error } = await supabase
    .from('faq_groups')
    .insert(groupData)
    .select()
    .single()

  if (error) {
    return { data: null, error: error.message }
  }

  revalidatePath('/admin/faq')
  revalidatePath('/faq')
  return { data, error: null }
}

/**
 * Update a FAQ group (name and/or image).
 */
export async function updateFaqGroup(id, formData) {
  const { user, error: authError } = await requireAdmin()
  if (authError) return { data: null, error: authError }

  const supabase = createServiceClient()

  const updates = {}

  if (formData.has('name')) {
    updates.name = formData.get('name')
  }

  // Handle image upload
  const image = formData.get('image')
  if (image && image.size > 0) {
    // Delete old image if exists
    const { data: current } = await supabase
      .from('faq_groups')
      .select('image_url')
      .eq('id', id)
      .single()

    if (current?.image_url) {
      const oldPath = current.image_url.split('/products/').pop()
      if (oldPath) await deleteFile('products', oldPath)
    }

    const ext = image.name.split('.').pop()
    const filePath = `faq-groups/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const { path, error: uploadError } = await uploadFile('products', image, filePath)
    if (uploadError) {
      return { data: null, error: uploadError.message }
    }
    updates.image_url = getPublicUrl('products', path)
  }

  // Handle image removal
  if (formData.get('remove_image') === 'true') {
    const { data: current } = await supabase
      .from('faq_groups')
      .select('image_url')
      .eq('id', id)
      .single()

    if (current?.image_url) {
      const oldPath = current.image_url.split('/products/').pop()
      if (oldPath) await deleteFile('products', oldPath)
    }
    updates.image_url = null
  }

  if (Object.keys(updates).length === 0) {
    return { data: null, error: null }
  }

  const { data, error } = await supabase
    .from('faq_groups')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return { data: null, error: error.message }
  }

  revalidatePath('/admin/faq')
  revalidatePath('/faq')
  return { data, error: null }
}

/**
 * Delete a FAQ group and its storage image.
 * FAQs cascade-delete via FK.
 */
export async function deleteFaqGroup(id) {
  const { user, error: authError } = await requireAdmin()
  if (authError) return { error: authError }

  const supabase = createServiceClient()

  // Get image URL before deletion
  const { data: group } = await supabase
    .from('faq_groups')
    .select('image_url')
    .eq('id', id)
    .single()

  if (group?.image_url) {
    const path = group.image_url.split('/products/').pop()
    if (path) await deleteFile('products', path)
  }

  const { error } = await supabase
    .from('faq_groups')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/faq')
  revalidatePath('/faq')
  return { error: null }
}

/**
 * Batch update sort_order for FAQ groups.
 */
export async function reorderFaqGroups(updates) {
  const { user, error: authError } = await requireAdmin()
  if (authError) return { error: authError }

  const supabase = createServiceClient()

  for (const { id, sort_order } of updates) {
    const { error } = await supabase
      .from('faq_groups')
      .update({ sort_order })
      .eq('id', id)

    if (error) {
      return { error: error.message }
    }
  }

  revalidatePath('/admin/faq')
  revalidatePath('/faq')
  return { error: null }
}

/**
 * Toggle FAQ group published status.
 */
export async function toggleFaqGroupPublished(id, published) {
  const { user, error: authError } = await requireAdmin()
  if (authError) return { error: authError }

  const supabase = createServiceClient()

  const { error } = await supabase
    .from('faq_groups')
    .update({ published })
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/faq')
  revalidatePath('/faq')
  return { error: null }
}
