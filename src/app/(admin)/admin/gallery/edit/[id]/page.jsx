import { notFound } from 'next/navigation'
import { getGalleryItem } from '@/lib/actions/gallery'
import GalleryEditClient from './GalleryEditClient'

export default async function GalleryEditPage({ params }) {
  const { id } = await params
  const { data: item, error } = await getGalleryItem(id)

  if (error || !item) {
    notFound()
  }

  return <GalleryEditClient item={item} />
}
