import { getPublishedBlogPosts } from '../../../lib/data/public'
import BlogPageClient from './BlogPageClient'

export default async function BlogPage() {
  const { data } = await getPublishedBlogPosts({ perPage: 200 })
  return <BlogPageClient posts={data} />
}
