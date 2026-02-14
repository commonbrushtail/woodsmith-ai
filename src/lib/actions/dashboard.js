'use server'

import { createServiceClient } from '@/lib/supabase/admin'

/**
 * Fetch dashboard statistics.
 */
export async function getDashboardStats() {
  const supabase = createServiceClient()

  const [products, banners, blogPosts, quotations] = await Promise.all([
    supabase.from('products').select('id', { count: 'exact', head: true }),
    supabase.from('banners').select('id', { count: 'exact', head: true }),
    supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
    supabase.from('quotations').select('id, status', { count: 'exact' }),
  ])

  const pendingQuotations = (quotations.data || []).filter((q) => q.status === 'pending').length

  return {
    totalProducts: products.count || 0,
    totalBanners: banners.count || 0,
    totalBlogPosts: blogPosts.count || 0,
    totalQuotations: quotations.count || 0,
    pendingQuotations,
  }
}
