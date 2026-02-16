import { getProducts } from '@/lib/actions/products'
import ProductsListClient from '@/components/admin/ProductsListClient'

export default async function ProductsPage({ searchParams }) {
  const params = await searchParams
  const page = params?.page ? parseInt(params.page, 10) : 1
  const perPage = params?.perPage ? parseInt(params.perPage, 10) : 10

  const { data: products, count } = await getProducts({ page, perPage })

  return (
    <ProductsListClient
      products={products}
      totalCount={count}
      currentPage={page}
      rowsPerPage={perPage}
    />
  )
}
