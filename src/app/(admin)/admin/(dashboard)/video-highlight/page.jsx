import { getVideoHighlights } from '@/lib/actions/video-highlights'
import VideoHighlightsListClient from '@/components/admin/VideoHighlightsListClient'

export default async function VideoHighlightPage() {
  const { data: highlights, count } = await getVideoHighlights({ page: 1, perPage: 1000 })

  return <VideoHighlightsListClient highlights={highlights} totalCount={count} />
}
