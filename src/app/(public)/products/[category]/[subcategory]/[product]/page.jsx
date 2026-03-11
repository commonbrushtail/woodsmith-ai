import { getPublishedProductBySlug } from '@/lib/data/public'
import { createClient } from '@/lib/supabase/server'
import ProductDetailClient from '../../../../product/[id]/ProductDetailClient'

export async function generateMetadata({ params }) {
  const { product: productSlug } = await params
  const slug = decodeURIComponent(productSlug)
  const { data } = await getPublishedProductBySlug(slug)

  if (!data) {
    return { title: 'สินค้า — WoodSmith' }
  }

  const primaryImage = data.product_images
    ?.sort((a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0))?.[0]
  const imageUrl = primaryImage?.url

  const title = `${data.name} — WoodSmith`
  const description = data.short_description || data.category || 'สินค้า WoodSmith'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      ...(imageUrl && {
        images: [{ url: imageUrl, width: 800, height: 800, alt: data.name }],
      }),
      type: 'website',
      siteName: 'WoodSmith :: วู้ดสมิตร',
      locale: 'th_TH',
    },
    twitter: {
      card: imageUrl ? 'summary_large_image' : 'summary',
      title,
      description,
      ...(imageUrl && { images: [imageUrl] }),
    },
  }
}

export default async function ProductPage({ params }) {
  const { product: productSlug } = await params
  const slug = decodeURIComponent(productSlug)
  const { data } = await getPublishedProductBySlug(slug)

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return <ProductDetailClient product={data} isLoggedIn={!!user} />
}
