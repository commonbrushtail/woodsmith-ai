import { notFound } from 'next/navigation'
import { getVariationGroup } from '@/lib/actions/variations'
import VariationEditClient from './VariationEditClient'

export default async function VariationEditPage({ params }) {
  const { id } = await params
  const { data: group, error } = await getVariationGroup(id)

  if (error || !group) {
    notFound()
  }

  return <VariationEditClient group={group} />
}
