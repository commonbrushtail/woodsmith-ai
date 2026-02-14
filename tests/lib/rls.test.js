import { describe, it, expect } from 'vitest'

describe('RLS: anonymous access', () => {
  // Uses the anon key (public client) — should only see published content.

  it('can read published products', async () => {
    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()
    const { data, error } = await supabase
      .from('products')
      .select('id, name')
      .eq('published', true)
      .limit(5)
    expect(error).toBeNull()
    // data may be empty if no seed data yet, but no permission error
  })

  it('cannot read unpublished products', async () => {
    // Insert an unpublished product via admin client, then try to read via anon
    const { createServiceClient } = await import('@/lib/supabase/admin')
    const admin = createServiceClient()

    const { data: inserted } = await admin.from('products').insert({
      name: 'RLS Test Unpublished',
      code: 'RLS-TEST',
      sku: 'RLS-SKU',
      type: 'construction',
      category: 'test',
      published: false,
    }).select('id').single()

    const { createClient } = await import('@/lib/supabase/client')
    const anon = createClient()
    const { data } = await anon
      .from('products')
      .select('id')
      .eq('id', inserted.id)
      .single()

    expect(data).toBeNull() // RLS blocks unpublished for anon

    // Cleanup
    await admin.from('products').delete().eq('id', inserted.id)
  })

  it('cannot insert into products as anonymous', async () => {
    const { createClient } = await import('@/lib/supabase/client')
    const anon = createClient()
    const { error } = await anon.from('products').insert({
      name: 'Should fail',
      code: 'FAIL',
      sku: 'FAIL',
      type: 'construction',
      category: 'test',
    })
    expect(error).not.toBeNull()
  })

  it('cannot delete from products as anonymous', async () => {
    // Insert a product via admin, try to delete via anon, verify it still exists
    const { createServiceClient } = await import('@/lib/supabase/admin')
    const admin = createServiceClient()
    const { data: inserted } = await admin.from('products').insert({
      name: 'RLS Delete Test',
      code: 'RLS-DEL',
      sku: 'RLS-DEL-SKU',
      type: 'construction',
      category: 'test',
      published: true,
    }).select('id').single()

    const { createClient } = await import('@/lib/supabase/client')
    const anon = createClient()
    // PostgREST won't error — it silently affects 0 rows when RLS blocks
    await anon.from('products').delete().eq('id', inserted.id)

    // Verify the product still exists (anon couldn't delete it)
    const { data: stillExists } = await admin
      .from('products')
      .select('id')
      .eq('id', inserted.id)
      .single()
    expect(stillExists).not.toBeNull()

    // Cleanup
    await admin.from('products').delete().eq('id', inserted.id)
  })
})

describe('RLS: admin access', () => {
  it('admin can read all products including unpublished', async () => {
    const { createServiceClient } = await import('@/lib/supabase/admin')
    const admin = createServiceClient()
    const { error } = await admin.from('products').select('id').limit(1)
    expect(error).toBeNull()
  })

  it('admin can insert products', async () => {
    const { createServiceClient } = await import('@/lib/supabase/admin')
    const admin = createServiceClient()
    const { data, error } = await admin.from('products').insert({
      name: 'RLS Admin Test',
      code: 'ADMIN-TEST',
      sku: 'ADMIN-SKU',
      type: 'construction',
      category: 'test',
      published: false,
    }).select('id').single()
    expect(error).toBeNull()
    expect(data.id).toBeDefined()

    // Cleanup
    await admin.from('products').delete().eq('id', data.id)
  })
})
