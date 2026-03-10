import { getPublishedHighlights, getSiteSettings } from '../../../lib/data/public'
import HighlightPageClient from './HighlightPageClient'

export default async function HighlightPage() {
  const [{ data }, settingsRes] = await Promise.all([
    getPublishedHighlights({ perPage: 200 }),
    getSiteSettings(),
  ])
  return <HighlightPageClient highlights={data} bannerUrl={settingsRes.data?.banner_highlight_url || ''} />
}
