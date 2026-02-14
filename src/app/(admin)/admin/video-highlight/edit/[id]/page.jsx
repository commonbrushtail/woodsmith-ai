import { notFound } from 'next/navigation'
import { getVideoHighlight } from '@/lib/actions/video-highlights'
import VideoHighlightEditClient from './VideoHighlightEditClient'

export default async function VideoHighlightEditPage({ params }) {
  const { id } = await params
  const { data: highlight, error } = await getVideoHighlight(id)

  if (error || !highlight) {
    notFound()
  }

  return <VideoHighlightEditClient highlight={highlight} />
}
