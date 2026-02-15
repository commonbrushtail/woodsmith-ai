'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/admin'
import { uploadFile, deleteFile, getPublicUrl } from '@/lib/storage'
import { variationGroupSchema, variationGroupUpdateSchema, variationEntrySchema, variationEntryUpdateSchema } from '@/lib/validations/variations'
import { sanitizeInput } from '@/lib/sanitize'
import { logAudit } from '@/lib/audit'

/**
 * Fetch all variation groups with entry counts and linked product counts.
 */
export async function getVariationGroups() {
  const supabase = createServiceClient()

  // Fetch all groups with their entries
  const { data: groups, error: groupsError } = await supabase
    .from('variation_groups')
    .select('*, variation_entries(id, label, image_url, sort_order)')
    .order('name', { ascending: true })

  if (groupsError) return { data: [], error: groupsError.message }

  // Fetch product link counts
  const { data: links, error: linksError } = await supabase
    .from('product_variation_links')
    .select('group_id, product_id')

  if (linksError) return { data: [], error: linksError.message }

  // Count linked products per group
  const productCounts = {}
  if (links) {
    links.forEach(link => {
      if (!productCounts[link.group_id]) {
        productCounts[link.group_id] = new Set()
      }
      productCounts[link.group_id].add(link.product_id)
    })
  }

  // Enrich groups with counts
  const enrichedGroups = (groups || []).map(group => ({
    ...group,
    entry_count: group.variation_entries?.length || 0,
    product_count: productCounts[group.id]?.size || 0,
  }))

  return { data: enrichedGroups, error: null }
}

/**
 * Fetch a single variation group with all entries sorted by sort_order.
 */
export async function getVariationGroup(id) {
  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('variation_groups')
    .select('*, variation_entries(id, label, image_url, sort_order, created_at)')
    .eq('id', id)
    .order('sort_order', { referencedTable: 'variation_entries', ascending: true })
    .single()

  if (error) return { data: null, error: error.message }
  return { data, error: null }
}

/**
 * Create a new variation group.
 */
export async function createVariationGroup(formData) {
  const supabase = createServiceClient()

  const raw = {
    name: sanitizeInput(formData.get('name') || ''),
  }

  const parsed = variationGroupSchema.safeParse(raw)
  if (!parsed.success) {
    const fieldErrors = {}
    for (const issue of parsed.error.issues) {
      fieldErrors[issue.path[0]] = issue.message
    }
    return { data: null, fieldErrors, error: null }
  }

  const { data, error } = await supabase
    .from('variation_groups')
    .insert(parsed.data)
    .select()
    .single()

  if (error) return { data: null, error: error.message }

  // Audit log
  const authClient = await createClient()
  const { data: { user } } = await authClient.auth.getUser()
  logAudit({ userId: user?.id, action: 'variation_group.create', targetId: data.id })

  revalidatePath('/admin/variations')
  return { data, error: null }
}

/**
 * Update a variation group name.
 */
export async function updateVariationGroup(id, formData) {
  const supabase = createServiceClient()

  const raw = {}
  if (formData.has('name')) raw.name = sanitizeInput(formData.get('name'))

  const parsed = variationGroupUpdateSchema.safeParse(raw)
  if (!parsed.success) {
    const fieldErrors = {}
    for (const issue of parsed.error.issues) {
      fieldErrors[issue.path[0]] = issue.message
    }
    return { data: null, fieldErrors, error: null }
  }

  const { data, error } = await supabase
    .from('variation_groups')
    .update(parsed.data)
    .eq('id', id)
    .select()
    .single()

  if (error) return { data: null, error: error.message }

  // Audit log
  const authClient = await createClient()
  const { data: { user } } = await authClient.auth.getUser()
  logAudit({ userId: user?.id, action: 'variation_group.update', targetId: id })

  revalidatePath('/admin/variations')
  return { data, error: null }
}

/**
 * Delete a variation group with product-link safety check.
 * @param {string} id - Group ID
 * @param {{ force: boolean }} options - If force=true, delete even if products are linked
 */
export async function deleteVariationGroup(id, { force = false } = {}) {
  const supabase = createServiceClient()

  // Check for linked products
  const { data: links, error: linksError } = await supabase
    .from('product_variation_links')
    .select('product_id')
    .eq('group_id', id)

  if (linksError) return { error: linksError.message }

  const linkedProductIds = new Set(links?.map(link => link.product_id) || [])
  const linkedProductCount = linkedProductIds.size

  // If products are linked and not forcing, return warning
  if (linkedProductCount > 0 && !force) {
    return {
      error: null,
      warning: true,
      linkedProductCount,
      message: `กลุ่มตัวเลือกนี้เชื่อมโยงกับสินค้า ${linkedProductCount} รายการ`,
    }
  }

  // Get group with entries to delete swatch images
  const { data: group, error: fetchError } = await supabase
    .from('variation_groups')
    .select('*, variation_entries(image_url)')
    .eq('id', id)
    .single()

  if (fetchError) return { error: fetchError.message }

  // Delete swatch images from storage
  if (group?.variation_entries) {
    for (const entry of group.variation_entries) {
      if (entry.image_url) {
        const pathParts = entry.image_url.split('/products/')
        if (pathParts[1]) {
          await deleteFile('products', pathParts[1])
        }
      }
    }
  }

  // Delete group (CASCADE will remove entries and links)
  const { error: deleteError } = await supabase
    .from('variation_groups')
    .delete()
    .eq('id', id)

  if (deleteError) return { error: deleteError.message }

  // Audit log
  const authClient = await createClient()
  const { data: { user } } = await authClient.auth.getUser()
  logAudit({ userId: user?.id, action: 'variation_group.delete', targetId: id })

  revalidatePath('/admin/variations')
  return { error: null }
}

/**
 * Create a new variation entry.
 */
export async function createVariationEntry(formData) {
  const supabase = createServiceClient()

  const raw = {
    group_id: formData.get('group_id') || '',
    label: sanitizeInput(formData.get('label') || ''),
  }

  const parsed = variationEntrySchema.safeParse(raw)
  if (!parsed.success) {
    const fieldErrors = {}
    for (const issue of parsed.error.issues) {
      fieldErrors[issue.path[0]] = issue.message
    }
    return { data: null, fieldErrors, error: null }
  }

  // Auto-assign sort_order
  const { data: existing } = await supabase
    .from('variation_entries')
    .select('sort_order')
    .eq('group_id', parsed.data.group_id)
    .order('sort_order', { ascending: false })
    .limit(1)

  const nextOrder = existing && existing.length > 0 ? existing[0].sort_order + 1 : 0

  const entryData = {
    ...parsed.data,
    sort_order: nextOrder,
  }

  // Handle optional swatch image upload
  const file = formData.get('file')
  if (file && file.size > 0) {
    const ext = file.name.split('.').pop()
    const filePath = `variations/${parsed.data.group_id}/${Date.now()}.${ext}`
    const { path, error: uploadError } = await uploadFile('products', file, filePath)
    if (uploadError) return { data: null, error: uploadError.message }
    entryData.image_url = getPublicUrl('products', path)
  }

  const { data, error } = await supabase
    .from('variation_entries')
    .insert(entryData)
    .select()
    .single()

  if (error) return { data: null, error: error.message }

  // Audit log
  const authClient = await createClient()
  const { data: { user } } = await authClient.auth.getUser()
  logAudit({ userId: user?.id, action: 'variation_entry.create', targetId: data.id })

  revalidatePath('/admin/variations')
  return { data, error: null }
}

/**
 * Update a variation entry label and/or swatch image.
 */
export async function updateVariationEntry(id, formData) {
  const supabase = createServiceClient()

  const raw = {}
  if (formData.has('label')) raw.label = sanitizeInput(formData.get('label'))

  const parsed = variationEntryUpdateSchema.safeParse(raw)
  if (!parsed.success) {
    const fieldErrors = {}
    for (const issue of parsed.error.issues) {
      fieldErrors[issue.path[0]] = issue.message
    }
    return { data: null, fieldErrors, error: null }
  }

  const updates = { ...parsed.data }

  // Handle file upload (new swatch)
  const file = formData.get('file')
  if (file && file.size > 0) {
    // Delete old image if it exists
    const { data: current } = await supabase
      .from('variation_entries')
      .select('image_url, group_id')
      .eq('id', id)
      .single()

    if (current?.image_url) {
      const pathParts = current.image_url.split('/products/')
      if (pathParts[1]) await deleteFile('products', pathParts[1])
    }

    const ext = file.name.split('.').pop()
    const filePath = `variations/${current?.group_id}/${Date.now()}.${ext}`
    const { path, error: uploadError } = await uploadFile('products', file, filePath)
    if (uploadError) return { data: null, error: uploadError.message }
    updates.image_url = getPublicUrl('products', path)
  }

  // Handle image removal
  if (formData.get('remove_image') === 'true') {
    const { data: current } = await supabase
      .from('variation_entries')
      .select('image_url')
      .eq('id', id)
      .single()

    if (current?.image_url) {
      const pathParts = current.image_url.split('/products/')
      if (pathParts[1]) await deleteFile('products', pathParts[1])
    }
    updates.image_url = null
  }

  const { data, error } = await supabase
    .from('variation_entries')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return { data: null, error: error.message }

  // Audit log
  const authClient = await createClient()
  const { data: { user } } = await authClient.auth.getUser()
  logAudit({ userId: user?.id, action: 'variation_entry.update', targetId: id })

  revalidatePath('/admin/variations')
  return { data, error: null }
}

/**
 * Delete a single variation entry.
 */
export async function deleteVariationEntry(id) {
  const supabase = createServiceClient()

  // Fetch entry to get image_url and group_id
  const { data: entry, error: fetchError } = await supabase
    .from('variation_entries')
    .select('image_url, group_id')
    .eq('id', id)
    .single()

  if (fetchError) return { error: fetchError.message }

  // Delete swatch image from storage if exists
  if (entry?.image_url) {
    const pathParts = entry.image_url.split('/products/')
    if (pathParts[1]) await deleteFile('products', pathParts[1])
  }

  // Delete entry (CASCADE removes product_variation_links)
  const { error: deleteError } = await supabase
    .from('variation_entries')
    .delete()
    .eq('id', id)

  if (deleteError) return { error: deleteError.message }

  // Audit log
  const authClient = await createClient()
  const { data: { user } } = await authClient.auth.getUser()
  logAudit({ userId: user?.id, action: 'variation_entry.delete', targetId: id })

  revalidatePath('/admin/variations')
  return { error: null }
}

/**
 * Batch update sort_order for variation entries.
 * @param {Array<{id: string, sort_order: number}>} updates
 */
export async function reorderVariationEntries(updates) {
  const supabase = createServiceClient()

  for (const { id, sort_order } of updates) {
    const { error } = await supabase
      .from('variation_entries')
      .update({ sort_order })
      .eq('id', id)

    if (error) return { error: error.message }
  }

  revalidatePath('/admin/variations')
  return { error: null }
}

/**
 * Standalone swatch image upload.
 * @param {string} groupId - Group ID for path organization
 * @param {FormData} formData - FormData with 'file' field
 */
export async function uploadVariationSwatchImage(groupId, formData) {
  const file = formData.get('file')
  if (!file) return { url: null, error: 'No file provided' }

  const ext = file.name.split('.').pop()
  const filePath = `variations/${groupId}/${Date.now()}.${ext}`

  const { path, error: uploadError } = await uploadFile('products', file, filePath)
  if (uploadError) return { url: null, error: uploadError.message }

  const url = getPublicUrl('products', path)
  return { url, error: null }
}
