import { notFound } from 'next/navigation'
import { getProduct } from '@/lib/actions/products'
import { getCategories } from '@/lib/actions/categories'
import ProductEditClient from './ProductEditClient'

export default async function ProductEditPage({ params }) {
  const { id } = await params

  const [{ data: product, error }, { data: categories }] = await Promise.all([
    getProduct(id),
    getCategories(),
  ])

  if (error || !product) {
    notFound()
  }

  return <ProductEditClient product={product} categories={categories || []} />
}
