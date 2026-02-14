import { getBanners } from '@/lib/actions/banners'
import BannersListClient from '@/components/admin/BannersListClient'

export default async function BannerPage() {
  const { data: banners } = await getBanners()

  return <BannersListClient banners={banners} />
}
