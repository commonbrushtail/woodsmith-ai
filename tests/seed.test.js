import { describe, it, expect } from 'vitest'

describe('seed data', () => {
  it('products table has seed data after running seed', async () => {
    const { createServiceClient } = await import('@/lib/supabase/admin')
    const supabase = createServiceClient()
    const { data, error } = await supabase.from('products').select('id')
    expect(error).toBeNull()
    expect(data.length).toBeGreaterThan(0)
  })

  it('banners table has seed data', async () => {
    const { createServiceClient } = await import('@/lib/supabase/admin')
    const supabase = createServiceClient()
    const { data, error } = await supabase.from('banners').select('id')
    expect(error).toBeNull()
    expect(data.length).toBeGreaterThan(0)
  })

  it('blog_posts table has seed data', async () => {
    const { createServiceClient } = await import('@/lib/supabase/admin')
    const supabase = createServiceClient()
    const { data, error } = await supabase.from('blog_posts').select('id')
    expect(error).toBeNull()
    expect(data.length).toBeGreaterThan(0)
  })
})
