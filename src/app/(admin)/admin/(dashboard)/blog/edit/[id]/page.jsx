import { notFound } from 'next/navigation'
import { getBlogPost } from '@/lib/actions/blog'
import BlogEditClient from './BlogEditClient'

export default async function BlogEditPage({ params }) {
  const { id } = await params
  const { data: post, error } = await getBlogPost(id)

  if (error || !post) {
    notFound()
  }

  return <BlogEditClient post={post} />
}
