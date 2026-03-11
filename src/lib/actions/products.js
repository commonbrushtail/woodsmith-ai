'use server'

import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth/require-admin'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/admin'
import { uploadFile, deleteFile, getPublicUrl } from '@/lib/storage'
import { productCreateSchema, productUpdateSchema } from '@/lib/validations/products'
import { sanitizeObject } from '@/lib/sanitize'
import { logAudit } from '@/lib/audit'

/**
 * Fetch paginated products with optional search/filter.
 */
export async function getProducts({ page = 1, perPage = 10, search = '', sortAsc = true, type = '', category = '' } = {}) {
  const { user, error: authError } = await requireAdmin()
  if (authError) return { data: [], count: 0, error: authError }

  const supabase = createServiceClient()
  const from = (page - 1) * perPage
  const to = from + perPage - 1

  let query = supabase
    .from('products')
    .select('*, product_images(id, url, is_primary, sort_order)', { count: 'exact' })
    .order('sort_order', { ascending: sortAsc, nullsFirst: false })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (search) {
    query = query.or(`name.ilike.%${search}%,code.ilike.%${search}%,sku.ilike.%${search}%`)
  }
  if (type) {
    query = query.eq('type', type)
  }
  if (category) {
    query = query.eq('category', category)
  }

  const { data, count, error } = await query

  if (error) {
    return { data: [], count: 0, error: error.message }
  }

  return { data: data || [], count: count || 0, error: null }
}

/**
 * Fetch a single product by ID with all related data.
 */
export async function getProduct(id) {
  const { user, error: authError } = await requireAdmin()
  if (authError) return { data: null, error: authError }

  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('products')
    .select('*, product_images(id, url, is_primary, sort_order, variation_entry_id), product_options(id, option_type, label, image_url, sort_order), product_variation_links(id, group_id, entry_id, show_image, variation_groups(id, name, display_name), variation_entries(id, label, image_url, sort_order))')
    .eq('id', id)
    .single()

  if (error) {
    return { data: null, error: error.message }
  }

  return { data, error: null }
}

/**
 * Create a new product.
 */
export async function createProduct(formData) {
  const { user, error: authError } = await requireAdmin()
  if (authError) return { data: null, error: authError }

  const supabase = createServiceClient()

  const rawData = {
    name: formData.get('name'),
    slug: formData.get('slug'),
    code: formData.get('code'),
    sku: formData.get('sku'),
    type: formData.get('type') || 'construction',
    category: formData.get('category'),
    description: formData.get('description') || '',
    characteristics: formData.get('characteristics') || '',
    specifications: formData.get('specifications') ? { raw: formData.get('specifications') } : null,
    recommended: formData.get('recommended') === 'true',
    published: formData.get('published') === 'true',
    publish_start: formData.get('publish_start') || null,
    publish_end: formData.get('publish_end') || null,
    show_area_calculator: formData.get('show_area_calculator') === 'true',
    calculator_sizes: formData.get('calculator_sizes') ? JSON.parse(formData.get('calculator_sizes')) : [],
  }

  // Sanitize text inputs before validation
  const productData = sanitizeObject(rawData)

  // Validate required fields
  const validation = productCreateSchema.safeParse(productData)
  if (!validation.success) {
    const fieldErrors = Object.fromEntries(
      Object.entries(validation.error.flatten().fieldErrors).map(([k, v]) => [k, v[0]])
    )
    return { data: null, error: 'ข้อมูลไม่ถูกต้อง', fieldErrors }
  }

  const { data, error } = await supabase
    .from('products')
    .insert(productData)
    .select()
    .single()

  if (error) {
    return { data: null, error: error.message }
  }

  // Handle product options (colors, sizes)
  const optionsJson = formData.get('options')
  if (optionsJson) {
    try {
      const options = JSON.parse(optionsJson)
      if (options.length > 0) {
        const optionRows = options.map((opt, i) => ({
          product_id: data.id,
          option_type: opt.type,
          label: opt.label,
          image_url: opt.image_url || null,
          sort_order: i,
        }))
        await supabase.from('product_options').insert(optionRows)
      }
    } catch {
      // ignore JSON parse errors for options
    }
  }

  revalidatePath('/admin/products')
  return { data, error: null }
}

/**
 * Update an existing product.
 */
export async function updateProduct(id, formData) {
  const { user, error: authError } = await requireAdmin()
  if (authError) return { data: null, error: authError }

  const supabase = createServiceClient()

  const updates = {}
  const fields = ['name', 'slug', 'code', 'sku', 'type', 'category', 'description', 'characteristics']
  for (const field of fields) {
    const val = formData.get(field)
    if (val !== null) updates[field] = val
  }

  const specs = formData.get('specifications')
  if (specs !== null) updates.specifications = specs ? { raw: specs } : null

  if (formData.get('recommended') !== null) {
    updates.recommended = formData.get('recommended') === 'true'
  }
  if (formData.get('published') !== null) {
    updates.published = formData.get('published') === 'true'
  }
  if (formData.get('show_area_calculator') !== null) {
    updates.show_area_calculator = formData.get('show_area_calculator') === 'true'
  }
  if (formData.get('calculator_sizes') !== null) {
    updates.calculator_sizes = formData.get('calculator_sizes') ? JSON.parse(formData.get('calculator_sizes')) : []
  }
  if (formData.has('publish_start')) {
    updates.publish_start = formData.get('publish_start') || null
  }
  if (formData.has('publish_end')) {
    updates.publish_end = formData.get('publish_end') || null
  }

  // Sanitize text inputs before validation
  const sanitizedUpdates = sanitizeObject(updates)

  // Validate update fields
  const validation = productUpdateSchema.safeParse(sanitizedUpdates)
  if (!validation.success) {
    const fieldErrors = Object.fromEntries(
      Object.entries(validation.error.flatten().fieldErrors).map(([k, v]) => [k, v[0]])
    )
    return { data: null, error: 'ข้อมูลไม่ถูกต้อง', fieldErrors }
  }

  const { data, error } = await supabase
    .from('products')
    .update(sanitizedUpdates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return { data: null, error: error.message }
  }

  // Replace product options if provided
  const optionsJson = formData.get('options')
  if (optionsJson !== null) {
    await supabase.from('product_options').delete().eq('product_id', id)
    try {
      const options = JSON.parse(optionsJson)
      if (options.length > 0) {
        const optionRows = options.map((opt, i) => ({
          product_id: id,
          option_type: opt.type,
          label: opt.label,
          image_url: opt.image_url || null,
          sort_order: i,
        }))
        await supabase.from('product_options').insert(optionRows)
      }
    } catch {
      // ignore
    }
  }

  revalidatePath('/admin/products')
  revalidatePath(`/admin/products/edit/${id}`)
  return { data, error: null }
}

/**
 * Delete a product by ID.
 */
export async function deleteProduct(id) {
  const { user, error: authError } = await requireAdmin()
  if (authError) return { error: authError }

  const supabase = createServiceClient()

  // Delete associated images from storage first
  const { data: images } = await supabase
    .from('product_images')
    .select('url')
    .eq('product_id', id)

  if (images) {
    for (const img of images) {
      if (img.url) {
        const path = img.url.split('/products/').pop()
        if (path) await deleteFile('products', path)
      }
    }
  }

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  // User already obtained from requireAdmin()
  logAudit({ userId: user?.id, action: 'product.delete', targetId: id })

  revalidatePath('/admin/products')
  return { error: null }
}

/**
 * Toggle product recommended status.
 */
export async function toggleProductRecommended(id, recommended) {
  const { user, error: authError } = await requireAdmin()
  if (authError) return { error: authError }

  const supabase = createServiceClient()

  const { error } = await supabase
    .from('products')
    .update({ recommended })
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/products')
  return { error: null }
}

/**
 * Toggle product published status.
 */
export async function toggleProductPublished(id, published) {
  const { user, error: authError } = await requireAdmin()
  if (authError) return { error: authError }

  const supabase = createServiceClient()

  const { error } = await supabase
    .from('products')
    .update({ published })
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/products')
  return { error: null }
}

/**
 * Upload a product image and add it to product_images.
 */
export async function uploadProductImage(productId, formData) {
  const { user, error: authError } = await requireAdmin()
  if (authError) return { data: null, error: authError }

  const file = formData.get('file')
  if (!file) return { error: 'No file provided' }

  const variationEntryId = formData.get('variation_entry_id') || null

  const ext = file.name.split('.').pop()
  const folder = variationEntryId ? `${productId}/variations` : `${productId}`
  const filePath = `${folder}/${Date.now()}.${ext}`

  const { path, error: uploadError } = await uploadFile('products', file, filePath)
  if (uploadError) return { error: uploadError.message }

  const url = getPublicUrl('products', path)

  const supabase = createServiceClient()

  if (variationEntryId) {
    // For variation images: upsert (one image per product+entry)
    const { data: existingVar } = await supabase
      .from('product_images')
      .select('id, url')
      .eq('product_id', productId)
      .eq('variation_entry_id', variationEntryId)
      .limit(1)

    if (existingVar && existingVar.length > 0) {
      // Delete old file from storage
      const oldPath = existingVar[0].url.split('/products/').pop()
      if (oldPath) await deleteFile('products', oldPath)
      // Update existing record
      const { error: updateError } = await supabase
        .from('product_images')
        .update({ url })
        .eq('id', existingVar[0].id)
      if (updateError) return { error: updateError.message }
    } else {
      const { error: insertError } = await supabase
        .from('product_images')
        .insert({
          product_id: productId,
          url,
          is_primary: false,
          sort_order: 0,
          variation_entry_id: variationEntryId,
        })
      if (insertError) return { error: insertError.message }
    }
  } else {
    // Regular product image
    const { data: existing } = await supabase
      .from('product_images')
      .select('id')
      .eq('product_id', productId)
      .is('variation_entry_id', null)

    const isPrimary = !existing || existing.length === 0

    const { error: insertError } = await supabase
      .from('product_images')
      .insert({
        product_id: productId,
        url,
        is_primary: isPrimary,
        sort_order: existing ? existing.length : 0,
      })
    if (insertError) return { error: insertError.message }
  }

  revalidatePath('/admin/products')
  revalidatePath(`/admin/products/edit/${productId}`)
  return { url, error: null }
}

/**
 * Delete a product image.
 */
export async function deleteProductImage(imageId) {
  const { user, error: authError } = await requireAdmin()
  if (authError) return { error: authError }

  const supabase = createServiceClient()

  const { data: image } = await supabase
    .from('product_images')
    .select('url, product_id')
    .eq('id', imageId)
    .single()

  if (image?.url) {
    const path = image.url.split('/products/').pop()
    if (path) await deleteFile('products', path)
  }

  const { error } = await supabase
    .from('product_images')
    .delete()
    .eq('id', imageId)

  if (error) return { error: error.message }

  revalidatePath('/admin/products')
  return { error: null }
}

/**
 * Upload an option swatch/thumbnail image.
 * Returns the public URL for the uploaded image.
 */
export async function uploadOptionImage(productId, formData) {
  const { user, error: authError } = await requireAdmin()
  if (authError) return { data: null, error: authError }

  const file = formData.get('file')
  if (!file) return { url: null, error: 'No file provided' }

  const ext = file.name.split('.').pop()
  const filePath = `${productId}/options/${Date.now()}.${ext}`

  const { path, error: uploadError } = await uploadFile('products', file, filePath)
  if (uploadError) return { url: null, error: uploadError.message }

  const url = getPublicUrl('products', path)
  return { url, error: null }
}

/**
 * Sync product-variation links (bulk replace).
 * @param {string} productId - Product ID
 * @param {Array<{group_id: string, entry_id: string}>} links - Array of variation links
 */
export async function syncProductVariationLinks(productId, links) {
  const { user, error: authError } = await requireAdmin()
  if (authError) return { data: null, error: authError }

  const supabase = createServiceClient()

  // Delete all existing links for this product
  const { error: deleteError } = await supabase
    .from('product_variation_links')
    .delete()
    .eq('product_id', productId)

  if (deleteError) return { error: deleteError.message }

  // Insert new links if any
  if (links && links.length > 0) {
    const rows = links.map(link => ({
      product_id: productId,
      group_id: link.group_id,
      entry_id: link.entry_id,
      show_image: link.show_image !== false,
    }))

    const { error: insertError } = await supabase
      .from('product_variation_links')
      .insert(rows)

    if (insertError) return { error: insertError.message }
  }

  // User already obtained from requireAdmin()
  logAudit({ userId: user?.id, action: 'product.sync_variation_links', targetId: productId })

  revalidatePath('/admin/products')
  revalidatePath(`/admin/products/edit/${productId}`)
  return { error: null }
}
