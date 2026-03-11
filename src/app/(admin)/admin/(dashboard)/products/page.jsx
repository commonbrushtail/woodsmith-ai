import { getProducts } from '@/lib/actions/products'
import { createServiceClient } from '@/lib/supabase/admin'
import ProductsListClient from '@/components/admin/ProductsListClient'

export default async function ProductsPage({ searchParams }) {
  const params = await searchParams
  const page = params?.page ? parseInt(params.page, 10) : 1
  const perPage = params?.perPage ? parseInt(params.perPage, 10) : 10
  const search = params?.search || ''
  const type = params?.type || ''
  const category = params?.category || ''

  const { data: products, count } = await getProducts({ page, perPage, search, type, category })

  // Get distinct categories from products
  const supabase = createServiceClient()
  const { data: allProducts } = await supabase
    .from('products')
    .select('category, type')

  const categoryMap = {}
  for (const p of (allProducts || [])) {
    if (p.category && !categoryMap[p.category]) {
      categoryMap[p.category] = p.type
    }
  }
  const categories = Object.entries(categoryMap)
    .map(([name, type]) => ({ name, type }))
    .sort((a, b) => a.name.localeCompare(b.name, 'th'))

  return (
    <ProductsListClient
      products={products}
      totalCount={count}
      currentPage={page}
      rowsPerPage={perPage}
      initialSearch={search}
      initialType={type}
      initialCategory={category}
      categories={categories}
    />
  )
}
