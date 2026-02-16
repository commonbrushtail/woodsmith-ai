import { notFound } from 'next/navigation'
import { getBranch } from '@/lib/actions/branches'
import BranchEditClient from './BranchEditClient'

export default async function BranchEditPage({ params }) {
  const { id } = await params
  const { data: branch, error } = await getBranch(id)

  if (error || !branch) {
    notFound()
  }

  return <BranchEditClient branch={branch} />
}
