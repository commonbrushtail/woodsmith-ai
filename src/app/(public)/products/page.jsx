import { getPublishedProducts, getProductCategories, getPublishedProductTypes } from '../../../lib/data/public'
import ProductsPageClient from './ProductsPageClient'

export default async function ProductsPage() {
  const [productsRes, categoriesRes, typesRes] = await Promise.all([
    getPublishedProducts({ perPage: 200 }),
    getProductCategories(),
    getPublishedProductTypes(),
  ])

  return (
    <ProductsPageClient
      products={productsRes.data}
      categories={categoriesRes.data}
      productTypes={typesRes.data}
    />
  )
}
