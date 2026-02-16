import { getCategories } from '@/lib/actions/categories'
import ProductTypesListClient from '@/components/admin/ProductTypesListClient'

export default async function ProductTypesPage() {
  const { data: categories } = await getCategories()

  // Only top-level categories (parent_id = null)
  const productTypes = (categories || []).filter(c => !c.parent_id)
  // Count subcategories per parent
  const childCounts = {}
  for (const c of (categories || [])) {
    if (c.parent_id) {
      childCounts[c.parent_id] = (childCounts[c.parent_id] || 0) + 1
    }
  }

  return (
    <ProductTypesListClient
      productTypes={productTypes}
      childCounts={childCounts}
    />
  )
}
