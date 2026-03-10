import { getPublishedBlogPosts, getSiteSettings } from '../../../lib/data/public'
import { getBlogCategories } from '@/lib/actions/blog-categories'
import BlogPageClient from './BlogPageClient'

export default async function BlogPage() {
  const [{ data }, { data: categories }, settingsRes] = await Promise.all([
    getPublishedBlogPosts({ perPage: 200 }),
    getBlogCategories(),
    getSiteSettings(),
  ])
  return <BlogPageClient posts={data} categories={categories || []} bannerUrl={settingsRes.data?.banner_blog_url || ''} />
}
