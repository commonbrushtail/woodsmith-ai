import { notFound } from 'next/navigation'
import { getProduct } from '@/lib/actions/products'
import ProductEditClient from './ProductEditClient'

export default async function ProductEditPage({ params }) {
  const { id } = await params

  const { data: product, error } = await getProduct(id)

  if (error || !product) {
    notFound()
  }

  return <ProductEditClient product={product} />
}
