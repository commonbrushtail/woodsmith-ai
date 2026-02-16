'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/admin'
import { blogCategorySchema, blogCategoryUpdateSchema } from '@/lib/validations/blog-categories'
import { sanitizeInput } from '@/lib/sanitize'
import { logAudit } from '@/lib/audit'

/**
 * Fetch all blog categories sorted by sort_order.
 */
export async function getBlogCategories() {
  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('blog_categories')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) return { data: [], error: error.message }
  return { data: data || [], error: null }
}

/**
 * Fetch a single blog category by ID.
 */
export async function getBlogCategory(id) {
  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('blog_categories')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return { data: null, error: error.message }
  return { data, error: null }
}

/**
 * Create a new blog category.
 */
export async function createBlogCategory(formData) {
  const supabase = createServiceClient()

  const raw = { name: sanitizeInput(formData.get('name') || '') }

  const parsed = blogCategorySchema.safeParse(raw)
  if (!parsed.success) {
    const fieldErrors = Object.fromEntries(
      Object.entries(parsed.error.flatten().fieldErrors).map(([k, v]) => [k, v[0]])
    )
    return { data: null, error: 'ข้อมูลไม่ถูกต้อง', fieldErrors }
  }

  // Generate slug from name
  const slug = parsed.data.name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()

  // Check duplicate slug
  const { data: existing } = await supabase
    .from('blog_categories')
    .select('id')
    .eq('slug', slug)
    .maybeSingle()

  if (existing) {
    return { data: null, error: 'หมวดหมู่นี้มีอยู่แล้ว' }
  }

  // Auto sort_order
  const { data: last } = await supabase
    .from('blog_categories')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)

  const nextOrder = last && last.length > 0 ? last[0].sort_order + 1 : 0

  const { data, error } = await supabase
    .from('blog_categories')
    .insert({ name: parsed.data.name, slug, sort_order: nextOrder })
    .select()
    .single()

  if (error) return { data: null, error: error.message }

  const authClient = await createClient()
  const { data: { user } } = await authClient.auth.getUser()
  logAudit({ userId: user?.id, action: 'blog_category.create', targetId: data.id })

  revalidatePath('/admin/blog-categories')
  revalidatePath('/admin/blog')
  revalidatePath('/blog')
  return { data, error: null }
}

/**
 * Update a blog category.
 */
export async function updateBlogCategory(id, formData) {
  const supabase = createServiceClient()

  const raw = {}
  if (formData.has('name')) raw.name = sanitizeInput(formData.get('name'))

  const parsed = blogCategoryUpdateSchema.safeParse(raw)
  if (!parsed.success) {
    const fieldErrors = Object.fromEntries(
      Object.entries(parsed.error.flatten().fieldErrors).map(([k, v]) => [k, v[0]])
    )
    return { data: null, error: 'ข้อมูลไม่ถูกต้อง', fieldErrors }
  }

  const updates = { ...parsed.data }

  // Regenerate slug if name changed
  if (parsed.data.name) {
    const newSlug = parsed.data.name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

    const { data: existing } = await supabase
      .from('blog_categories')
      .select('id')
      .eq('slug', newSlug)
      .neq('id', id)
      .maybeSingle()

    if (existing) {
      return { data: null, error: 'หมวดหมู่นี้มีอยู่แล้ว' }
    }

    // Get old slug to update blog_posts
    const { data: oldCat } = await supabase
      .from('blog_categories')
      .select('slug')
      .eq('id', id)
      .single()

    updates.slug = newSlug

    // Update blog posts that use the old slug
    if (oldCat && oldCat.slug !== newSlug) {
      await supabase
        .from('blog_posts')
        .update({ category: newSlug })
        .eq('category', oldCat.slug)
    }
  }

  const { data, error } = await supabase
    .from('blog_categories')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return { data: null, error: error.message }

  const authClient = await createClient()
  const { data: { user } } = await authClient.auth.getUser()
  logAudit({ userId: user?.id, action: 'blog_category.update', targetId: id })

  revalidatePath('/admin/blog-categories')
  revalidatePath('/admin/blog')
  revalidatePath('/blog')
  return { data, error: null }
}

/**
 * Delete a blog category. Shows warning if posts use it.
 */
export async function deleteBlogCategory(id, { force = false } = {}) {
  const supabase = createServiceClient()

  const { data: category, error: fetchError } = await supabase
    .from('blog_categories')
    .select('slug')
    .eq('id', id)
    .single()

  if (fetchError) return { error: fetchError.message }

  // Check blog posts using this category
  const { count } = await supabase
    .from('blog_posts')
    .select('id', { count: 'exact', head: true })
    .eq('category', category.slug)

  const postCount = count || 0

  if (postCount > 0 && !force) {
    return { error: null, warning: true, postCount, message: `หมวดหมู่นี้มีบทความ ${postCount} รายการ` }
  }

  // Nullify category on affected posts
  if (force && postCount > 0) {
    await supabase
      .from('blog_posts')
      .update({ category: null })
      .eq('category', category.slug)
  }

  const { error: deleteError } = await supabase
    .from('blog_categories')
    .delete()
    .eq('id', id)

  if (deleteError) return { error: deleteError.message }

  const authClient = await createClient()
  const { data: { user } } = await authClient.auth.getUser()
  logAudit({ userId: user?.id, action: 'blog_category.delete', targetId: id })

  revalidatePath('/admin/blog-categories')
  revalidatePath('/admin/blog')
  revalidatePath('/blog')
  return { error: null }
}
