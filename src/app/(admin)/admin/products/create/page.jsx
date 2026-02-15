import { getCategories } from '@/lib/actions/categories'
import { getVariationGroups } from '@/lib/actions/variations'
import ProductCreateClient from './ProductCreateClient'

export default async function ProductCreatePage() {
  const [{ data: categories }, { data: variationGroups }] = await Promise.all([
    getCategories(),
    getVariationGroups(),
  ])

  return <ProductCreateClient categories={categories || []} variationGroups={variationGroups || []} />
}
