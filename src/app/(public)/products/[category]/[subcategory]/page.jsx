import { getPublishedProducts } from '../../../../../lib/data/public'
import ProductSubcategoryPageClient from './ProductSubcategoryPageClient'

export default async function ProductSubcategoryPage({ params }) {
  const { category, subcategory } = await params
  const categoryName = decodeURIComponent(subcategory)

  const productsRes = await getPublishedProducts({
    perPage: 200,
    type: category,
    category: categoryName,
  })

  return (
    <ProductSubcategoryPageClient
      categorySlug={category}
      categoryName={categoryName}
      products={productsRes.data}
    />
  )
}
