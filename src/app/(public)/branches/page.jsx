import { getPublishedBranches } from '../../../lib/data/public'
import BranchesPageClient from './BranchesPageClient'

export default async function BranchesPage() {
  const { data } = await getPublishedBranches()
  return <BranchesPageClient branches={data} />
}
