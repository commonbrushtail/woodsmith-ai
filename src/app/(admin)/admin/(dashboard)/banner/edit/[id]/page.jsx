import { notFound } from 'next/navigation'
import { getBanner } from '@/lib/actions/banners'
import BannerEditClient from './BannerEditClient'

export default async function BannerEditPage({ params }) {
  const { id } = await params
  const { data: banner, error } = await getBanner(id)

  if (error || !banner) {
    notFound()
  }

  return <BannerEditClient banner={banner} />
}
