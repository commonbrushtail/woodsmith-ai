import { getPublishedManuals, getSiteSettings } from '../../../lib/data/public'
import ManualPageClient from './ManualPageClient'

export default async function ManualPage() {
  const [{ data }, settingsRes] = await Promise.all([
    getPublishedManuals({ perPage: 200 }),
    getSiteSettings(),
  ])
  return <ManualPageClient manuals={data} bannerUrl={settingsRes.data?.banner_manual_url || ''} />
}
