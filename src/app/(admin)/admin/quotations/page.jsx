import { getQuotations } from '@/lib/actions/quotations'
import QuotationListClient from '@/components/admin/QuotationListClient'

export default async function QuotationsPage() {
  const { data: quotations, count } = await getQuotations({ page: 1, perPage: 50 })

  return <QuotationListClient quotations={quotations} totalCount={count} />
}
