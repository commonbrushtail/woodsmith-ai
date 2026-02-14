import { getPublishedProduct } from '../../../../lib/data/public'
import ProductDetailClient from './ProductDetailClient'

export default async function ProductDetailPage({ params }) {
  const { id } = await params
  const { data } = await getPublishedProduct(id)

  return <ProductDetailClient product={data} />
}
