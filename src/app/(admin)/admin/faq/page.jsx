import { getFaqs } from '@/lib/actions/faqs'
import FaqListClient from '@/components/admin/FaqListClient'

export default async function FaqPage() {
  const { data: faqs, count } = await getFaqs({ page: 1, perPage: 1000 })

  return <FaqListClient faqs={faqs} totalCount={count} />
}
