import { getUsers } from '@/lib/actions/users'
import UserListClient from '@/components/admin/UserListClient'

export default async function UsersPage() {
  const { data: users, count } = await getUsers({ page: 1, perPage: 1000 })

  return <UserListClient users={users} totalCount={count} />
}
