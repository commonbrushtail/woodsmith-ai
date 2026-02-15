'use server'

import { revalidatePath } from 'next/cache'
import { createServiceClient } from '@/lib/supabase/admin'
import { uploadFile, deleteFile, getPublicUrl } from '@/lib/storage'
import { categoryCreateSchema, categoryUpdateSchema } from '@/lib/validations/categories'
import { sanitizeInput } from '@/lib/sanitize'

/**
 * Fetch all categories ordered by sort_order.
 */
export async function getCategories() {
  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('product_categories')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) return { data: [], error: error.message }
  return { data: data || [], error: null }
}

/**
 * Fetch a single category by ID.
 */
export async function getCategory(id) {
  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('product_categories')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return { data: null, error: error.message }
  return { data, error: null }
}

/**
 * Fetch categories filtered by type (for product form dropdowns).
 */
export async function getCategoriesByType(type) {
  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('product_categories')
    .select('*')
    .eq('type', type)
    .order('sort_order', { ascending: true })

  if (error) return { data: [], error: error.message }
  return { data: data || [], error: null }
}

/**
 * Create a new category.
 */
export async function createCategory(formData) {
  const supabase = createServiceClient()

  const raw = {
    name: sanitizeInput(formData.get('name') || ''),
    slug: sanitizeInput(formData.get('slug') || ''),
    type: formData.get('type') || 'construction',
    parent_id: formData.get('parent_id') || null,
    published: formData.get('published') === 'true',
    is_featured: formData.get('is_featured') === 'true',
  }

  const parsed = categoryCreateSchema.safeParse(raw)
  if (!parsed.success) {
    const fieldErrors = {}
    for (const issue of parsed.error.issues) {
      fieldErrors[issue.path[0]] = issue.message
    }
    return { data: null, fieldErrors, error: null }
  }

  // Get next sort_order within same parent level
  let sortQuery = supabase
    .from('product_categories')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)

  if (parsed.data.parent_id) {
    sortQuery = sortQuery.eq('parent_id', parsed.data.parent_id)
  } else {
    sortQuery = sortQuery.is('parent_id', null)
  }

  const { data: existing } = await sortQuery
  const nextOrder = existing && existing.length > 0 ? existing[0].sort_order + 1 : 0

  const categoryData = {
    ...parsed.data,
    sort_order: nextOrder,
  }

  // Handle file upload
  const file = formData.get('file')
  if (file && file.size > 0) {
    const ext = file.name.split('.').pop()
    const filePath = `categories/${Date.now()}.${ext}`
    const { path, error: uploadError } = await uploadFile('categories', file, filePath)
    if (uploadError) return { data: null, error: uploadError.message }
    categoryData.image_url = getPublicUrl('categories', path)
  }

  const { data, error } = await supabase
    .from('product_categories')
    .insert(categoryData)
    .select()
    .single()

  if (error) return { data: null, error: error.message }

  revalidatePath('/admin/categories')
  return { data, error: null }
}

/**
 * Update a category.
 */
export async function updateCategory(id, formData) {
  const supabase = createServiceClient()

  const raw = {}
  if (formData.has('name')) raw.name = sanitizeInput(formData.get('name'))
  if (formData.has('slug')) raw.slug = sanitizeInput(formData.get('slug'))
  if (formData.has('type')) raw.type = formData.get('type')
  if (formData.has('parent_id')) raw.parent_id = formData.get('parent_id') || null
  if (formData.has('published')) raw.published = formData.get('published') === 'true'
  if (formData.has('is_featured')) raw.is_featured = formData.get('is_featured') === 'true'

  const parsed = categoryUpdateSchema.safeParse(raw)
  if (!parsed.success) {
    const fieldErrors = {}
    for (const issue of parsed.error.issues) {
      fieldErrors[issue.path[0]] = issue.message
    }
    return { data: null, fieldErrors, error: null }
  }

  const updates = { ...parsed.data }

  // Handle file upload
  const file = formData.get('file')
  if (file && file.size > 0) {
    // Delete old image if it exists
    const { data: current } = await supabase
      .from('product_categories')
      .select('image_url')
      .eq('id', id)
      .single()

    if (current?.image_url) {
      const oldPath = current.image_url.split('/categories/').pop()
      if (oldPath) await deleteFile('categories', oldPath)
    }

    const ext = file.name.split('.').pop()
    const filePath = `categories/${Date.now()}.${ext}`
    const { path, error: uploadError } = await uploadFile('categories', file, filePath)
    if (uploadError) return { data: null, error: uploadError.message }
    updates.image_url = getPublicUrl('categories', path)
  }

  // Handle image removal
  if (formData.get('remove_image') === 'true') {
    const { data: current } = await supabase
      .from('product_categories')
      .select('image_url')
      .eq('id', id)
      .single()

    if (current?.image_url) {
      const oldPath = current.image_url.split('/categories/').pop()
      if (oldPath) await deleteFile('categories', oldPath)
    }
    updates.image_url = null
  }

  const { data, error } = await supabase
    .from('product_categories')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return { data: null, error: error.message }

  revalidatePath('/admin/categories')
  return { data, error: null }
}

/**
 * Delete a category.
 */
export async function deleteCategory(id) {
  const supabase = createServiceClient()

  // Get image URL to delete from storage
  const { data: category } = await supabase
    .from('product_categories')
    .select('image_url')
    .eq('id', id)
    .single()

  if (category?.image_url) {
    const path = category.image_url.split('/categories/').pop()
    if (path) await deleteFile('categories', path)
  }

  const { error } = await supabase
    .from('product_categories')
    .delete()
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/categories')
  return { error: null }
}

/**
 * Batch update sort_order for categories.
 * @param {Array<{id: string, sort_order: number}>} updates
 */
export async function reorderCategories(updates) {
  const supabase = createServiceClient()

  for (const { id, sort_order } of updates) {
    const { error } = await supabase
      .from('product_categories')
      .update({ sort_order })
      .eq('id', id)

    if (error) return { error: error.message }
  }

  revalidatePath('/admin/categories')
  return { error: null }
}

/**
 * Toggle category featured status.
 */
export async function toggleCategoryFeatured(id, is_featured) {
  const supabase = createServiceClient()

  const { error } = await supabase
    .from('product_categories')
    .update({ is_featured })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/categories')
  return { error: null }
}

/**
 * Toggle category published status.
 */
export async function toggleCategoryPublished(id, published) {
  const supabase = createServiceClient()

  const { error } = await supabase
    .from('product_categories')
    .update({ published })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/categories')
  return { error: null }
}
