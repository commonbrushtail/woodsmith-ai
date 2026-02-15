import { notFound } from 'next/navigation'
import { getProduct } from '@/lib/actions/products'
import { getCategories } from '@/lib/actions/categories'
import { getVariationGroups } from '@/lib/actions/variations'
import ProductEditClient from './ProductEditClient'

export default async function ProductEditPage({ params }) {
  const { id } = await params

  const [{ data: product, error }, { data: categories }, { data: variationGroups }] = await Promise.all([
    getProduct(id),
    getCategories(),
    getVariationGroups(),
  ])

  if (error || !product) {
    notFound()
  }

  return <ProductEditClient product={product} categories={categories || []} variationGroups={variationGroups || []} />
}
