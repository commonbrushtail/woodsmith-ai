import { getPublishedFaqs, getSiteSettings } from '../../../lib/data/public'
import FaqPageClient from './FaqPageClient'

export default async function FaqPage() {
  const [{ data }, settingsRes] = await Promise.all([
    getPublishedFaqs(),
    getSiteSettings(),
  ])
  return <FaqPageClient faqGroups={data} bannerUrl={settingsRes.data?.banner_faq_url || ''} />
}
