import { describe, it, expect } from 'vitest'

describe('database tables exist', () => {
  // These tests verify the migration ran correctly.
  // They use the service role key to bypass RLS.

  it('can query user_profiles table', async () => {
    const { createServiceClient } = await import('@/lib/supabase/admin')
    const supabase = createServiceClient()
    const { error } = await supabase.from('user_profiles').select('id').limit(1)
    expect(error).toBeNull()
  })

  it('can query products table', async () => {
    const { createServiceClient } = await import('@/lib/supabase/admin')
    const supabase = createServiceClient()
    const { error } = await supabase.from('products').select('id').limit(1)
    expect(error).toBeNull()
  })

  it('can query banners table', async () => {
    const { createServiceClient } = await import('@/lib/supabase/admin')
    const supabase = createServiceClient()
    const { error } = await supabase.from('banners').select('id').limit(1)
    expect(error).toBeNull()
  })

  it('can query blog_posts table', async () => {
    const { createServiceClient } = await import('@/lib/supabase/admin')
    const supabase = createServiceClient()
    const { error } = await supabase.from('blog_posts').select('id').limit(1)
    expect(error).toBeNull()
  })

  it('can query quotations table', async () => {
    const { createServiceClient } = await import('@/lib/supabase/admin')
    const supabase = createServiceClient()
    const { error } = await supabase.from('quotations').select('id').limit(1)
    expect(error).toBeNull()
  })
})
