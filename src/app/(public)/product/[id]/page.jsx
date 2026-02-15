import { redirect } from 'next/navigation'
import { getPublishedProduct } from '../../../../lib/data/public'
import { getProductUrl } from '@/lib/product-url'

export default async function ProductDetailPage({ params }) {
  const { id } = await params
  const { data } = await getPublishedProduct(id)

  if (data?.slug) {
    redirect(getProductUrl(data))
  }

  // Fallback: if product not found or no slug, show 404-like
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <p className="font-['IBM_Plex_Sans_Thai'] text-[16px] text-[#6b7280]">ไม่พบสินค้านี้</p>
    </div>
  )
}
