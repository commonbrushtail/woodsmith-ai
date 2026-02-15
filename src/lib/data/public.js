import { createClient } from '@/lib/supabase/server'

// -------------------------------------------------------------------
// Public data-fetching functions (server-side, RLS-filtered)
// RLS policies automatically filter to published = true for anon/auth.
// -------------------------------------------------------------------

/**
 * Fetch published products with optional category/search filter.
 */
export async function getPublishedProducts({ page = 1, perPage = 16, type = '', category = '', search = '' } = {}) {
  const supabase = await createClient()
  const from = (page - 1) * perPage
  const to = from + perPage - 1

  let query = supabase
    .from('products')
    .select('id, code, sku, name, slug, type, category, product_images(url, is_primary)', { count: 'exact' })
    .order('sort_order', { ascending: true })
    .range(from, to)

  if (type) {
    query = query.eq('type', type)
  }
  if (category) {
    query = query.eq('category', category)
  }
  if (search) {
    query = query.or(`name.ilike.%${search}%,code.ilike.%${search}%`)
  }

  const { data, count, error } = await query
  if (error) return { data: [], count: 0, error: error.message }
  return { data: data || [], count: count || 0, error: null }
}

/**
 * Fetch a single published product with images + options.
 */
export async function getPublishedProduct(id) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('products')
    .select('*, product_images(id, url, is_primary, sort_order), product_options(id, option_type, label, sort_order)')
    .eq('id', id)
    .single()

  if (error) return { data: null, error: error.message }

  // Fetch related products (same category, excluding current)
  const { data: related } = await supabase
    .from('products')
    .select('id, name, slug, type, category, product_images(url, is_primary)')
    .eq('category', data.category)
    .neq('id', id)
    .limit(4)

  return { data: { ...data, relatedProducts: related || [] }, error: null }
}

/**
 * Fetch a single published product by slug with images + options.
 */
export async function getPublishedProductBySlug(slug) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('products')
    .select('*, product_images(id, url, is_primary, sort_order), product_options(id, option_type, label, sort_order)')
    .eq('slug', slug)
    .single()

  if (error) return { data: null, error: error.message }

  // Fetch related products (same category, excluding current)
  const { data: related } = await supabase
    .from('products')
    .select('id, name, slug, type, category, product_images(url, is_primary)')
    .eq('category', data.category)
    .neq('id', data.id)
    .limit(4)

  return { data: { ...data, relatedProducts: related || [] }, error: null }
}

/**
 * Fetch published blog posts with optional category filter.
 */
export async function getPublishedBlogPosts({ page = 1, perPage = 20, category = '' } = {}) {
  const supabase = await createClient()
  const from = (page - 1) * perPage
  const to = from + perPage - 1

  let query = supabase
    .from('blog_posts')
    .select('id, title, slug, cover_image_url, category, publish_date', { count: 'exact' })
    .order('publish_date', { ascending: false, nullsFirst: false })
    .range(from, to)

  if (category) {
    query = query.eq('category', category)
  }

  const { data, count, error } = await query
  if (error) return { data: [], count: 0, error: error.message }
  return { data: data || [], count: count || 0, error: null }
}

/**
 * Fetch a single published blog post by ID or slug.
 */
export async function getPublishedBlogPost(idOrSlug) {
  const supabase = await createClient()

  // Try by ID first, then by slug
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug)
  const column = isUuid ? 'id' : 'slug'

  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq(column, idOrSlug)
    .single()

  if (error) return { data: null, error: error.message }

  // Fetch related posts (same category, excluding current)
  let related = []
  if (data.category) {
    const { data: relatedData } = await supabase
      .from('blog_posts')
      .select('id, title, slug, cover_image_url, category, publish_date')
      .eq('category', data.category)
      .neq('id', data.id)
      .order('publish_date', { ascending: false, nullsFirst: false })
      .limit(4)
    related = relatedData || []
  }

  return { data: { ...data, relatedPosts: related }, error: null }
}

/**
 * Fetch published branches with optional region filter.
 */
export async function getPublishedBranches({ region = '' } = {}) {
  const supabase = await createClient()

  let query = supabase
    .from('branches')
    .select('*')
    .order('sort_order', { ascending: true })

  if (region) {
    query = query.eq('region', region)
  }

  const { data, error } = await query
  if (error) return { data: [], error: error.message }
  return { data: data || [], error: null }
}

/**
 * Fetch published FAQs grouped by group_title.
 */
export async function getPublishedFaqs() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('faqs')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) return { data: [], error: error.message }

  // Group by group_title
  const grouped = {}
  for (const faq of (data || [])) {
    const group = faq.group_title || 'ทั่วไป'
    if (!grouped[group]) grouped[group] = []
    grouped[group].push(faq)
  }

  return { data: grouped, error: null }
}

/**
 * Fetch published video highlights.
 */
export async function getPublishedHighlights({ page = 1, perPage = 18 } = {}) {
  const supabase = await createClient()
  const from = (page - 1) * perPage
  const to = from + perPage - 1

  const { data, count, error } = await supabase
    .from('video_highlights')
    .select('*', { count: 'exact' })
    .order('sort_order', { ascending: true })
    .range(from, to)

  if (error) return { data: [], count: 0, error: error.message }
  return { data: data || [], count: count || 0, error: null }
}

/**
 * Fetch published manuals.
 */
export async function getPublishedManuals({ page = 1, perPage = 10 } = {}) {
  const supabase = await createClient()
  const from = (page - 1) * perPage
  const to = from + perPage - 1

  const { data, count, error } = await supabase
    .from('manuals')
    .select('*', { count: 'exact' })
    .order('sort_order', { ascending: true })
    .range(from, to)

  if (error) return { data: [], count: 0, error: error.message }
  return { data: data || [], count: count || 0, error: null }
}

/**
 * Fetch published gallery items.
 */
export async function getPublishedGalleryItems() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('gallery_items')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) return { data: [], error: error.message }
  return { data: data || [], error: null }
}

/**
 * Fetch active banners.
 */
export async function getActiveBanners() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('banners')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) return { data: [], error: error.message }
  return { data: data || [], error: null }
}

/**
 * Fetch about us content (singleton).
 */
export async function getAboutContent() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('about_us')
    .select('*')
    .limit(1)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return { data: null, error: null }
    return { data: null, error: error.message }
  }

  return { data, error: null }
}

/**
 * Fetch distinct product categories (for filter sidebar).
 */
export async function getProductCategories() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('products')
    .select('category, type')

  if (error) return { data: [], error: error.message }

  // Build unique category list with counts
  const categoryMap = {}
  for (const p of (data || [])) {
    if (!categoryMap[p.category]) {
      categoryMap[p.category] = { name: p.category, type: p.type, count: 0 }
    }
    categoryMap[p.category].count++
  }

  return { data: Object.values(categoryMap), error: null }
}

/**
 * Fetch published categories from product_categories table (with images).
 */
export async function getPublishedCategories({ type = '' } = {}) {
  const supabase = await createClient()

  let query = supabase
    .from('product_categories')
    .select('*')
    .is('parent_id', null)
    .order('sort_order', { ascending: true })

  if (type) {
    query = query.eq('type', type)
  }

  const { data, error } = await query
  if (error) return { data: [], error: error.message }
  return { data: data || [], error: null }
}

/**
 * Fetch published subcategories (child categories where parent_id IS NOT NULL).
 * When featured=true, only returns categories marked as is_featured.
 * RLS automatically filters to published = true.
 */
export async function getPublishedSubcategories({ type = '', featured = false } = {}) {
  const supabase = await createClient()

  let query = supabase
    .from('product_categories')
    .select('*')
    .not('parent_id', 'is', null)
    .order('sort_order', { ascending: true })

  if (type) {
    query = query.eq('type', type)
  }
  if (featured) {
    query = query.eq('is_featured', true)
  }

  const { data, error } = await query
  if (error) return { data: [], error: error.message }
  return { data: data || [], error: null }
}

/**
 * Fetch distinct branch regions (for tab filter).
 */
export async function getBranchRegions() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('branches')
    .select('region')

  if (error) return { data: [], error: error.message }

  const regions = [...new Set((data || []).map(b => b.region).filter(Boolean))]
  return { data: regions, error: null }
}
