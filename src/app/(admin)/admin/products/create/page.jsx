import { getCategories } from '@/lib/actions/categories'
import ProductCreateClient from './ProductCreateClient'

export default async function ProductCreatePage() {
  const { data: categories } = await getCategories()

  return <ProductCreateClient categories={categories || []} />
}
