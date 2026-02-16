import { notFound } from 'next/navigation'
import { getBlogCategory } from '@/lib/actions/blog-categories'
import BlogCategoryEditClient from './BlogCategoryEditClient'

export default async function BlogCategoryEditPage({ params }) {
  const { id } = await params
  const { data: category, error } = await getBlogCategory(id)

  if (error || !category) {
    notFound()
  }

  return <BlogCategoryEditClient category={category} />
}
