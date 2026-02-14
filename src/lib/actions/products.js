'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/admin'
import { uploadFile, deleteFile, getPublicUrl } from '@/lib/storage'

/**
 * Fetch paginated products with optional search/filter.
 */
export async function getProducts({ page = 1, perPage = 10, search = '', sortAsc = true } = {}) {
  const supabase = createServiceClient()
  const from = (page - 1) * perPage
  const to = from + perPage - 1

  let query = supabase
    .from('products')
    .select('*, product_images(id, url, is_primary, sort_order)', { count: 'exact' })
    .order('sort_order', { ascending: sortAsc })
    .range(from, to)

  if (search) {
    query = query.or(`name.ilike.%${search}%,code.ilike.%${search}%,sku.ilike.%${search}%`)
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
  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('products')
    .select('*, product_images(id, url, is_primary, sort_order), product_options(id, option_type, label, sort_order)')
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
  const supabase = createServiceClient()

  const productData = {
    name: formData.get('name'),
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
  const supabase = createServiceClient()

  const updates = {}
  const fields = ['name', 'code', 'sku', 'type', 'category', 'description', 'characteristics']
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
  if (formData.has('publish_start')) {
    updates.publish_start = formData.get('publish_start') || null
  }
  if (formData.has('publish_end')) {
    updates.publish_end = formData.get('publish_end') || null
  }

  const { data, error } = await supabase
    .from('products')
    .update(updates)
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

  revalidatePath('/admin/products')
  return { error: null }
}

/**
 * Toggle product recommended status.
 */
export async function toggleProductRecommended(id, recommended) {
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
  const file = formData.get('file')
  if (!file) return { error: 'No file provided' }

  const ext = file.name.split('.').pop()
  const filePath = `${productId}/${Date.now()}.${ext}`

  const { path, error: uploadError } = await uploadFile('products', file, filePath)
  if (uploadError) return { error: uploadError.message }

  const url = getPublicUrl('products', path)

  const supabase = createServiceClient()
  const { data: existing } = await supabase
    .from('product_images')
    .select('id')
    .eq('product_id', productId)

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

  revalidatePath('/admin/products')
  return { url, error: null }
}

/**
 * Delete a product image.
 */
export async function deleteProductImage(imageId) {
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
