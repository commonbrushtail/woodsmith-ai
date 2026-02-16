import { getPublishedBranches, getHqBranch } from '../../../lib/data/public'
import BranchesPageClient from './BranchesPageClient'

export default async function BranchesPage() {
  const [{ data }, { data: hqBranch }] = await Promise.all([
    getPublishedBranches(),
    getHqBranch(),
  ])
  return <BranchesPageClient branches={data} hqBranch={hqBranch} />
}
