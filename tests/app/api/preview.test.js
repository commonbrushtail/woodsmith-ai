import { describe, it, expect, vi, beforeEach } from 'vitest'

let adminUser = null
const enable = vi.fn()
const disable = vi.fn()
const redirect = vi.fn()

vi.mock('next/headers', () => ({
  draftMode: vi.fn(async () => ({ enable, disable })),
}))
vi.mock('next/navigation', () => ({
  redirect: (...args) => redirect(...args),
}))
vi.mock('@/lib/auth/require-admin', () => ({
  requireAdmin: vi.fn(async () => ({ user: adminUser, error: adminUser ? null : 'no' })),
}))

beforeEach(() => {
  vi.clearAllMocks()
  adminUser = null
})

function req(url) {
  return new Request(url)
}

describe('GET /api/preview (enable)', () => {
  it('returns 403 for a non-admin and does NOT enable draft mode', async () => {
    adminUser = null
    const { GET } = await import('@/app/api/preview/route')

    const res = await GET(req('http://localhost/api/preview?path=/blog/1'))

    expect(res.status).toBe(403)
    expect(enable).not.toHaveBeenCalled()
    expect(redirect).not.toHaveBeenCalled()
  })

  it('enables draft mode and redirects to the path for an admin', async () => {
    adminUser = { id: 'a1', user_metadata: { role: 'admin' } }
    const { GET } = await import('@/app/api/preview/route')

    await GET(req('http://localhost/api/preview?path=/blog/my-post'))

    expect(enable).toHaveBeenCalledTimes(1)
    expect(redirect).toHaveBeenCalledWith('/blog/my-post')
  })

  it('rejects an external/protocol-relative path with 400 (no open redirect)', async () => {
    adminUser = { id: 'a1', user_metadata: { role: 'admin' } }
    const { GET } = await import('@/app/api/preview/route')

    const res = await GET(req('http://localhost/api/preview?path=//evil.com'))

    expect(res.status).toBe(400)
    expect(enable).not.toHaveBeenCalled()
  })

  it('defaults to "/" when no path is provided', async () => {
    adminUser = { id: 'a1', user_metadata: { role: 'admin' } }
    const { GET } = await import('@/app/api/preview/route')

    await GET(req('http://localhost/api/preview'))

    expect(enable).toHaveBeenCalledTimes(1)
    expect(redirect).toHaveBeenCalledWith('/')
  })
})

describe('GET /api/preview/disable', () => {
  it('disables draft mode and redirects back to an internal path', async () => {
    const { GET } = await import('@/app/api/preview/disable/route')

    await GET(req('http://localhost/api/preview/disable?path=/blog/x'))

    expect(disable).toHaveBeenCalledTimes(1)
    expect(redirect).toHaveBeenCalledWith('/blog/x')
  })

  it('falls back to "/" for an external path', async () => {
    const { GET } = await import('@/app/api/preview/disable/route')

    await GET(req('http://localhost/api/preview/disable?path=https://evil.com'))

    expect(disable).toHaveBeenCalledTimes(1)
    expect(redirect).toHaveBeenCalledWith('/')
  })
})
