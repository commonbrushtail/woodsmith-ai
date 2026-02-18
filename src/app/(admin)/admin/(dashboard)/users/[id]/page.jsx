import { notFound } from 'next/navigation'
import { getUser, getUserQuotations } from '@/lib/actions/users'
import UserDetailClient from './UserDetailClient'

export default async function UserDetailPage({ params }) {
  const { id } = await params
  const [{ data: user, error }, { data: quotations }] = await Promise.all([
    getUser(id),
    getUserQuotations(id),
  ])

  if (error || !user) {
    notFound()
  }

  return <UserDetailClient user={user} quotations={quotations} />
}
