import { getPublishedProducts, getProductCategories } from '../../../lib/data/public'
import ProductsPageClient from './ProductsPageClient'

export default async function ProductsPage() {
  const [productsRes, categoriesRes] = await Promise.all([
    getPublishedProducts({ perPage: 200 }),
    getProductCategories(),
  ])

  return (
    <ProductsPageClient
      products={productsRes.data}
      categories={categoriesRes.data}
    />
  )
}
