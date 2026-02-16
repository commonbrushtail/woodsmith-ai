import { getBlogCategories } from '@/lib/actions/blog-categories'
import BlogCategoriesListClient from '@/components/admin/BlogCategoriesListClient'

export default async function BlogCategoriesPage() {
  const { data: categories } = await getBlogCategories()
  return <BlogCategoriesListClient categories={categories || []} />
}
