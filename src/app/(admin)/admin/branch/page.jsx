import { getBranches } from '@/lib/actions/branches'
import BranchListClient from '@/components/admin/BranchListClient'

export default async function BranchPage() {
  const { data: branches, count } = await getBranches({ page: 1, perPage: 1000 })

  return <BranchListClient branches={branches} totalCount={count} />
}
