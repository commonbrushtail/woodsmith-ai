import { getPublishedProductBySlug } from '@/lib/data/public'
import ProductDetailClient from '../../../../product/[id]/ProductDetailClient'

export default async function ProductPage({ params }) {
  const { product: productSlug } = await params
  const slug = decodeURIComponent(productSlug)
  const { data } = await getPublishedProductBySlug(slug)

  return <ProductDetailClient product={data} />
}
