'use server'

import { createClient } from '@/lib/supabase/server'

/**
 * Search products and blog posts by query term.
 */
export async function searchAll(query) {
  if (!query || query.trim().length < 2) {
    return { products: [], posts: [] }
  }

  const supabase = await createClient()
  const term = query.trim()

  const [productsResult, postsResult] = await Promise.all([
    supabase
      .from('products')
      .select('id, name, slug, type, code, category, product_images(url, is_primary)')
      .or(`name.ilike.%${term}%,code.ilike.%${term}%,sku.ilike.%${term}%`)
      .limit(6),
    supabase
      .from('blog_posts')
      .select('id, title, slug, cover_image_url, category')
      .ilike('title', `%${term}%`)
      .limit(4),
  ])

  return {
    products: productsResult.data || [],
    posts: postsResult.data || [],
  }
}

/**
 * Fetch recommended products for the search overlay (published, recommended flag).
 */
export async function getRecommendedProducts() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('products')
    .select('id, name, slug, type, code, category, product_images(url, is_primary)')
    .eq('recommended', true)
    .order('sort_order', { ascending: true })
    .limit(6)

  return data || []
}

/**
 * Fetch popular search categories/terms from products.
 */
export async function getPopularCategories() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('products')
    .select('category')

  if (!data) return []

  // Count categories and return top 5
  const counts = {}
  for (const p of data) {
    if (p.category) {
      counts[p.category] = (counts[p.category] || 0) + 1
    }
  }

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name]) => name)
}
