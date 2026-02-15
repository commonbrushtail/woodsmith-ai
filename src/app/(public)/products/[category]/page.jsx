import { getPublishedProducts, getProductCategories, getPublishedSubcategories } from '../../../../lib/data/public'
import ProductCategoryPageClient from './ProductCategoryPageClient'

export default async function ProductCategoryPage({ params }) {
  const { category } = await params
  const [productsRes, categoriesRes, subcategoriesRes] = await Promise.all([
    getPublishedProducts({ perPage: 200, type: category }),
    getProductCategories(),
    getPublishedSubcategories({ type: category, featured: true }),
  ])

  // Filter product-derived categories to match this type (for sidebar filter)
  const filteredCategories = (categoriesRes.data || []).filter(c => c.type === category)

  return (
    <ProductCategoryPageClient
      categorySlug={category}
      products={productsRes.data}
      categories={filteredCategories}
      subcategories={subcategoriesRes.data}
    />
  )
}
