import { getGalleryItems } from '@/lib/actions/gallery'
import GalleryListClient from '@/components/admin/GalleryListClient'

export default async function GalleryPage() {
  const { data: galleries, count } = await getGalleryItems({ page: 1, perPage: 50 })

  return <GalleryListClient galleries={galleries} totalCount={count} />
}
