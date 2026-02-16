import { getGalleryItems } from '@/lib/actions/gallery'
import GalleryPageClient from '@/components/admin/GalleryPageClient'

export default async function GalleryPage() {
  const [homepageRes, aboutRes] = await Promise.all([
    getGalleryItems({ section: 'homepage', perPage: 1000 }),
    getGalleryItems({ section: 'about', perPage: 1000 }),
  ])

  return (
    <GalleryPageClient
      homepageItems={homepageRes.data}
      aboutItems={aboutRes.data}
    />
  )
}
