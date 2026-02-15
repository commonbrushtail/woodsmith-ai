import { getManuals } from '@/lib/actions/manuals'
import ManualsListClient from '@/components/admin/ManualsListClient'

export default async function ManualPage() {
  const { data: manuals, count } = await getManuals({ page: 1, perPage: 1000 })

  return <ManualsListClient manuals={manuals} totalCount={count} />
}
