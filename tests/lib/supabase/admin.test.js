import { describe, it, expect, vi } from 'vitest'
import { listAllAuthUsers } from '@/lib/supabase/admin'

/**
 * Build a fake admin client whose listUsers() paginates over `allUsers`
 * the same way Supabase GoTrue does: one page at a time, capped at perPage.
 */
function makeAdmin(allUsers) {
  const calls = []
  return {
    calls,
    admin: {
      auth: {
        admin: {
          listUsers: vi.fn(async ({ page, perPage }) => {
            calls.push({ page, perPage })
            const start = (page - 1) * perPage
            return { data: { users: allUsers.slice(start, start + perPage) }, error: null }
          }),
        },
      },
    },
  }
}

describe('listAllAuthUsers', () => {
  it('returns every user across multiple pages (not just the first page)', async () => {
    // 120 users with perPage 50 => 3 pages. A single listUsers() call would
    // only ever see the first 50, missing users 51-120.
    const allUsers = Array.from({ length: 120 }, (_, i) => ({ id: `u${i}`, email: `u${i}@x.com` }))
    const { admin, calls } = makeAdmin(allUsers)

    const result = await listAllAuthUsers(admin, 50)

    expect(result).toHaveLength(120)
    // A user beyond the first page must be present.
    expect(result.find((u) => u.id === 'u115')).toBeDefined()
    // Should have paged: 50 + 50 + 20 => 3 requests.
    expect(calls.map((c) => c.page)).toEqual([1, 2, 3])
  })

  it('stops after one request when results fit in a single page', async () => {
    const allUsers = Array.from({ length: 10 }, (_, i) => ({ id: `u${i}` }))
    const { admin, calls } = makeAdmin(allUsers)

    const result = await listAllAuthUsers(admin, 50)

    expect(result).toHaveLength(10)
    expect(calls).toHaveLength(1)
  })

  it('throws if a page returns an error', async () => {
    const admin = {
      auth: { admin: { listUsers: vi.fn(async () => ({ data: null, error: new Error('boom') })) } },
    }
    await expect(listAllAuthUsers(admin, 50)).rejects.toThrow('boom')
  })
})
