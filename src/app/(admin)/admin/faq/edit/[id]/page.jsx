import { notFound } from 'next/navigation'
import { getFaq } from '@/lib/actions/faqs'
import FaqEditClient from './FaqEditClient'

export default async function FaqEditPage({ params }) {
  const { id } = await params
  const { data: faq, error } = await getFaq(id)

  if (error || !faq) {
    notFound()
  }

  return <FaqEditClient faq={faq} />
}
