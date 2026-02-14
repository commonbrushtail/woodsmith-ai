import { getPublishedHighlights } from '../../../lib/data/public'
import HighlightPageClient from './HighlightPageClient'

export default async function HighlightPage() {
  const { data } = await getPublishedHighlights({ perPage: 200 })
  return <HighlightPageClient highlights={data} />
}
