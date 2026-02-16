import { getFaqGroups } from '@/lib/actions/faq-groups'
import FaqPageClient from '@/components/admin/FaqPageClient'

export default async function FaqPage() {
  const { data: groups } = await getFaqGroups()

  return <FaqPageClient groups={groups || []} />
}
