import { getPublishedManuals } from '../../../lib/data/public'
import ManualPageClient from './ManualPageClient'

export default async function ManualPage() {
  const { data } = await getPublishedManuals({ perPage: 200 })
  return <ManualPageClient manuals={data} />
}
