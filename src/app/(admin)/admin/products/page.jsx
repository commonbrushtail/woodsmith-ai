import { getProducts } from '@/lib/actions/products'
import ProductsListClient from '@/components/admin/ProductsListClient'

export default async function ProductsPage() {
  const { data: products, count } = await getProducts({ page: 1, perPage: 10 })

  return <ProductsListClient products={products} totalCount={count} />
}
