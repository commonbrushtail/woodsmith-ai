import { getPublishedBlogPost } from '../../../../lib/data/public'
import { incrementBlogViewCount } from '../../../../lib/actions/blog'
import BlogPostPageClient from './BlogPostPageClient'

export default async function BlogPostPage({ params }) {
  const { id } = await params
  const { data } = await getPublishedBlogPost(id)

  if (data?.id) {
    incrementBlogViewCount(data.id)
  }

  return (
    <BlogPostPageClient
      post={data}
      relatedPosts={data?.relatedPosts || []}
    />
  )
}
