import { describe, it, expect, vi } from 'vitest'

// Mock next/headers since it requires Next.js request context
vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({
    getAll: () => [],
    set: vi.fn(),
  })),
}))

describe('createServerClient', () => {
  it('exports a createClient function', async () => {
    const mod = await import('@/lib/supabase/server')
    expect(mod.createClient).toBeDefined()
    expect(typeof mod.createClient).toBe('function')
  })

  it('returns a Supabase client with auth methods', async () => {
    const { createClient } = await import('@/lib/supabase/server')
    const client = await createClient()
    expect(client.auth).toBeDefined()
    expect(client.from).toBeDefined()
  })
})
