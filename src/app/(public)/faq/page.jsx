import { getPublishedFaqs } from '../../../lib/data/public'
import FaqPageClient from './FaqPageClient'

export default async function FaqPage() {
  const { data } = await getPublishedFaqs()
  return <FaqPageClient faqGroups={data} />
}
