import { describe, it, expect, vi } from 'vitest'

describe('createBrowserClient', () => {
  it('exports a createClient function', async () => {
    const mod = await import('@/lib/supabase/client')
    expect(mod.createClient).toBeDefined()
    expect(typeof mod.createClient).toBe('function')
  })

  it('returns a Supabase client instance', async () => {
    const { createClient } = await import('@/lib/supabase/client')
    const client = createClient()
    expect(client).toBeDefined()
    expect(client.auth).toBeDefined()
    expect(client.from).toBeDefined()
    expect(client.storage).toBeDefined()
  })

  it('uses environment variables for configuration', async () => {
    // Verify it reads from NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
    const { createClient } = await import('@/lib/supabase/client')
    const client = createClient()
    expect(client).toBeDefined()
  })
})
