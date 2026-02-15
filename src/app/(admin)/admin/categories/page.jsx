import { getCategories } from '@/lib/actions/categories'
import CategoriesListClient from '@/components/admin/CategoriesListClient'

export default async function CategoriesPage() {
  const { data: allCategories } = await getCategories()

  // Only subcategories (have a parent_id)
  const subcategories = (allCategories || []).filter(c => c.parent_id)
  // Parent categories for display
  const parentCategories = (allCategories || []).filter(c => !c.parent_id)

  return (
    <CategoriesListClient
      categories={subcategories}
      parentCategories={parentCategories}
    />
  )
}
