import { describe, it, expect, vi, beforeEach } from 'vitest'

// Middleware logic is tested by extracting the route-matching logic into
// a pure function that can be unit tested without Next.js middleware runtime.

import { getRouteAction } from '@/lib/auth/route-rules'

describe('getRouteAction', () => {
  it('allows public routes without auth', () => {
    const action = getRouteAction('/', null)
    expect(action).toBe('allow')
  })

  it('allows /products without auth', () => {
    const action = getRouteAction('/products', null)
    expect(action).toBe('allow')
  })

  it('allows /blog without auth', () => {
    const action = getRouteAction('/blog', null)
    expect(action).toBe('allow')
  })

  it('redirects /admin/dashboard to /login when unauthenticated', () => {
    const action = getRouteAction('/admin/dashboard', null)
    expect(action).toEqual({ redirect: '/login' })
  })

  it('redirects /admin/products to /login when unauthenticated', () => {
    const action = getRouteAction('/admin/products', null)
    expect(action).toEqual({ redirect: '/login' })
  })

  it('allows /admin/dashboard for admin user', () => {
    const user = { role: 'admin' }
    const action = getRouteAction('/admin/dashboard', user)
    expect(action).toBe('allow')
  })

  it('allows /admin/products for editor user', () => {
    const user = { role: 'editor' }
    const action = getRouteAction('/admin/products', user)
    expect(action).toBe('allow')
  })

  it('blocks /admin/dashboard for customer user', () => {
    const user = { role: 'customer' }
    const action = getRouteAction('/admin/dashboard', user)
    expect(action).toEqual({ redirect: '/' })
  })

  it('redirects /login to /admin/dashboard for authenticated admin', () => {
    const user = { role: 'admin' }
    const action = getRouteAction('/login', user)
    expect(action).toEqual({ redirect: '/admin/dashboard' })
  })

  it('allows /login for unauthenticated user', () => {
    const action = getRouteAction('/login', null)
    expect(action).toBe('allow')
  })

  it('protects /account/* for unauthenticated users', () => {
    const action = getRouteAction('/account/profile', null)
    expect(action).toEqual({ redirect: '/login' })
  })

  it('allows /account/* for any authenticated user', () => {
    const user = { role: 'customer' }
    const action = getRouteAction('/account/profile', user)
    expect(action).toBe('allow')
  })

  it('skips middleware for static assets', () => {
    const action = getRouteAction('/_next/static/chunk.js', null)
    expect(action).toBe('skip')
  })

  it('skips middleware for API routes', () => {
    const action = getRouteAction('/api/health', null)
    expect(action).toBe('skip')
  })
})
