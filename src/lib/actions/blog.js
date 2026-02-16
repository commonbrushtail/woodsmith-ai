'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/admin'
import { uploadFile, deleteFile, getPublicUrl } from '@/lib/storage'
import { blogCreateSchema, blogUpdateSchema } from '@/lib/validations/blog'
import { sanitizeObject } from '@/lib/sanitize'
import { requireAdmin } from '@/lib/auth/require-admin'

/**
 * Fetch paginated blog posts with optional search.
 */
export async function getBlogPosts({ page = 1, perPage = 10, search = '', sortAsc = true } = {}) {
  const { user, error: authError } = await requireAdmin()
  if (authError) return { data: [], count: 0, error: authError }

  const supabase = createServiceClient()
  const from = (page - 1) * perPage
  const to = from + perPage - 1

  let query = supabase
    .from('blog_posts')
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
 * Fetch a single blog post by ID.
 */
export async function getBlogPost(id) {
  const { user, error: authError } = await requireAdmin()
  if (authError) return { data: null, error: authError }

  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    return { data: null, error: error.message }
  }

  return { data, error: null }
}

/**
 * Create a new blog post.
 */
export async function createBlogPost(formData) {
  const { user, error: authError } = await requireAdmin()
  if (authError) return { data: null, error: authError }

  const supabase = createServiceClient()

  // Sanitize text inputs before validation
  const blogData = sanitizeObject({
    title: formData.get('title'),
    content: formData.get('content') || '',
    category: formData.get('category') || null,
    recommended: formData.get('recommended') === 'true',
    published: formData.get('published') === 'true',
    publish_date: formData.get('publish_date') || null,
  })

  const title = blogData.title

  // Validate required fields
  const validation = blogCreateSchema.safeParse(blogData)
  if (!validation.success) {
    const fieldErrors = Object.fromEntries(
      Object.entries(validation.error.flatten().fieldErrors).map(([k, v]) => [k, v[0]])
    )
    return { data: null, error: 'ข้อมูลไม่ถูกต้อง', fieldErrors }
  }

  // Auto-generate slug from title
  const slug = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim() + '-' + Date.now()

  const postData = {
    title,
    slug,
    content: formData.get('content') || '',
    category: formData.get('category') || null,
    cover_image_url: formData.get('cover_image_url') || null,
    author_id: user?.id || null,
    recommended: formData.get('recommended') === 'true',
    published: formData.get('published') === 'true',
    publish_date: formData.get('publish_date') || null,
  }

  // Handle cover image upload
  const file = formData.get('cover_image')
  if (file && file.size > 0) {
    const ext = file.name.split('.').pop()
    const filePath = `blog/${Date.now()}.${ext}`
    const { path, error: uploadError } = await uploadFile('blog', file, filePath)
    if (uploadError) return { data: null, error: uploadError.message }
    postData.cover_image_url = getPublicUrl('blog', path)
  }

  const { data, error } = await supabase
    .from('blog_posts')
    .insert(postData)
    .select()
    .single()

  if (error) {
    return { data: null, error: error.message }
  }

  revalidatePath('/admin/blog')
  revalidatePath('/blog')
  return { data, error: null }
}

/**
 * Update a blog post.
 */
export async function updateBlogPost(id, formData) {
  const { user, error: authError } = await requireAdmin()
  if (authError) return { data: null, error: authError }

  const supabase = createServiceClient()

  const updates = {}
  const fields = ['title', 'content', 'category']
  for (const field of fields) {
    const val = formData.get(field)
    if (val !== null) updates[field] = val
  }

  if (formData.has('recommended')) {
    updates.recommended = formData.get('recommended') === 'true'
  }
  if (formData.has('published')) {
    updates.published = formData.get('published') === 'true'
  }
  if (formData.has('publish_date')) {
    updates.publish_date = formData.get('publish_date') || null
  }

  // Validate update fields
  const validation = blogUpdateSchema.safeParse(updates)
  if (!validation.success) {
    const fieldErrors = Object.fromEntries(
      Object.entries(validation.error.flatten().fieldErrors).map(([k, v]) => [k, v[0]])
    )
    return { data: null, error: 'ข้อมูลไม่ถูกต้อง', fieldErrors }
  }

  // Handle cover image upload
  const file = formData.get('cover_image')
  if (file && file.size > 0) {
    const ext = file.name.split('.').pop()
    const filePath = `blog/${Date.now()}.${ext}`
    const { path, error: uploadError } = await uploadFile('blog', file, filePath)
    if (uploadError) return { data: null, error: uploadError.message }
    updates.cover_image_url = getPublicUrl('blog', path)
  }

  const { data, error } = await supabase
    .from('blog_posts')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return { data: null, error: error.message }
  }

  revalidatePath('/admin/blog')
  revalidatePath('/blog')
  return { data, error: null }
}

/**
 * Delete a blog post.
 */
export async function deleteBlogPost(id) {
  const { user, error: authError } = await requireAdmin()
  if (authError) return { error: authError }

  const supabase = createServiceClient()

  const { data: post } = await supabase
    .from('blog_posts')
    .select('cover_image_url')
    .eq('id', id)
    .single()

  if (post?.cover_image_url) {
    const path = post.cover_image_url.split('/blog/').pop()
    if (path) await deleteFile('blog', path)
  }

  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/blog')
  revalidatePath('/blog')
  return { error: null }
}

/**
 * Toggle blog post recommended status.
 */
export async function toggleBlogRecommended(id, recommended) {
  const { user, error: authError } = await requireAdmin()
  if (authError) return { error: authError }

  const supabase = createServiceClient()

  const { error } = await supabase
    .from('blog_posts')
    .update({ recommended })
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/blog')
  revalidatePath('/blog')
  return { error: null }
}

/**
 * Toggle blog post published status.
 */
export async function toggleBlogPublished(id, published) {
  const { user, error: authError } = await requireAdmin()
  if (authError) return { error: authError }

  const supabase = createServiceClient()

  const { error } = await supabase
    .from('blog_posts')
    .update({ published })
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/blog')
  revalidatePath('/blog')
  return { error: null }
}

/**
 * Increment blog post view count (atomic via Postgres function).
 */
export async function incrementBlogViewCount(id) {
  const supabase = createServiceClient()
  await supabase.rpc('increment_blog_view', { post_id: id })
}

/**
 * Upload an image from the rich text editor.
 * Accepts FormData with a 'file' field.
 * Returns { url: string } on success or { error: string } on failure.
 */
export async function uploadEditorImage(formData) {
  const { user, error: authError } = await requireAdmin()
  if (authError) return { url: null, error: authError }

  const file = formData.get('file')
  if (!file || file.size === 0) {
    return { url: null, error: 'ไม่พบไฟล์' }
  }

  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  if (!allowed.includes(file.type)) {
    return { url: null, error: 'รองรับเฉพาะไฟล์ JPEG, PNG, WebP, GIF' }
  }

  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    return { url: null, error: 'ขนาดไฟล์เกิน 5MB' }
  }

  const ext = file.name.split('.').pop()
  const filePath = `editor/${Date.now()}.${ext}`
  const { path, error: uploadError } = await uploadFile('blog', file, filePath)
  if (uploadError) {
    return { url: null, error: uploadError.message }
  }

  return { url: getPublicUrl('blog', path), error: null }
}
