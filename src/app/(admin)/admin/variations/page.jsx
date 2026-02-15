import { getVariationGroups } from '@/lib/actions/variations'
import VariationsListClient from '@/components/admin/VariationsListClient'

export default async function VariationsPage() {
  const { data: groups } = await getVariationGroups()
  return <VariationsListClient groups={groups || []} />
}
