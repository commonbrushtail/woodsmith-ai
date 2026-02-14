import { getBlogPosts } from '@/lib/actions/blog'
import BlogListClient from '@/components/admin/BlogListClient'

export default async function BlogPage() {
  const { data: blogs, count } = await getBlogPosts({ page: 1, perPage: 50 })

  return <BlogListClient blogs={blogs} totalCount={count} />
}
