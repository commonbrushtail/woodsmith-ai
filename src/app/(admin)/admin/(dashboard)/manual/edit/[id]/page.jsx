import { notFound } from 'next/navigation'
import { getManual } from '@/lib/actions/manuals'
import ManualEditClient from './ManualEditClient'

export default async function ManualEditPage({ params }) {
  const { id } = await params
  const { data: manual, error } = await getManual(id)

  if (error || !manual) {
    notFound()
  }

  return <ManualEditClient manual={manual} />
}
