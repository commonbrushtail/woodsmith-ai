import { getPublishedProductBySlug } from '@/lib/data/public'
import { createClient } from '@/lib/supabase/server'
import ProductDetailClient from '../../../../product/[id]/ProductDetailClient'

export default async function ProductPage({ params }) {
  const { product: productSlug } = await params
  const slug = decodeURIComponent(productSlug)
  const { data } = await getPublishedProductBySlug(slug)

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return <ProductDetailClient product={data} isLoggedIn={!!user} />
}
