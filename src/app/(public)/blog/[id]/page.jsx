import { getPublishedBlogPost } from '../../../../lib/data/public'
import { incrementBlogViewCount } from '../../../../lib/actions/blog'
import { getBlogCategories } from '@/lib/actions/blog-categories'
import BlogPostPageClient from './BlogPostPageClient'

export default async function BlogPostPage({ params }) {
  const { id } = await params
  const [{ data }, { data: categories }] = await Promise.all([
    getPublishedBlogPost(id),
    getBlogCategories(),
  ])

  if (data?.id) {
    incrementBlogViewCount(data.id)
  }

  return (
    <BlogPostPageClient
      post={data}
      relatedPosts={data?.relatedPosts || []}
      categories={categories || []}
    />
  )
}
