import { getPublishedBlogPost } from '../../../../lib/data/public'
import BlogPostPageClient from './BlogPostPageClient'

export default async function BlogPostPage({ params }) {
  const { id } = await params
  const { data } = await getPublishedBlogPost(id)

  return (
    <BlogPostPageClient
      post={data}
      relatedPosts={data?.relatedPosts || []}
    />
  )
}
