import { getPublishedBlogPosts } from '../../../lib/data/public'
import { getBlogCategories } from '@/lib/actions/blog-categories'
import BlogPageClient from './BlogPageClient'

export default async function BlogPage() {
  const [{ data }, { data: categories }] = await Promise.all([
    getPublishedBlogPosts({ perPage: 200 }),
    getBlogCategories(),
  ])
  return <BlogPageClient posts={data} categories={categories || []} />
}
