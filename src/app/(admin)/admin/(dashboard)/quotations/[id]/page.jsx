import { notFound } from 'next/navigation'
import { getQuotation } from '@/lib/actions/quotations'
import QuotationDetailClient from './QuotationDetailClient'

export default async function QuotationDetailPage({ params }) {
  const { id } = await params
  const { data: quotation, error } = await getQuotation(id)

  if (error || !quotation) {
    notFound()
  }

  return <QuotationDetailClient quotation={quotation} />
}
