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

  it('protects /account/* for unauthenticated users (redirects to homepage)', () => {
    const action = getRouteAction('/account/profile', null)
    expect(action).toEqual({ redirect: '/' })
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

  // --- Expanded tests: admin sub-routes ---
  it('protects /admin/users for unauthenticated users', () => {
    const action = getRouteAction('/admin/users', null)
    expect(action).toEqual({ redirect: '/login' })
  })

  it('protects /admin/blog/create for unauthenticated users', () => {
    const action = getRouteAction('/admin/blog/create', null)
    expect(action).toEqual({ redirect: '/login' })
  })

  it('protects /admin/quotations/some-id for unauthenticated users', () => {
    const action = getRouteAction('/admin/quotations/abc-123', null)
    expect(action).toEqual({ redirect: '/login' })
  })

  it('allows /admin/users for editor user', () => {
    const user = { role: 'editor' }
    const action = getRouteAction('/admin/users', user)
    expect(action).toBe('allow')
  })

  it('blocks /admin/blog for customer user', () => {
    const user = { role: 'customer' }
    const action = getRouteAction('/admin/blog', user)
    expect(action).toEqual({ redirect: '/' })
  })

  // --- Expanded tests: nested public routes ---
  it('allows /product/some-id without auth', () => {
    const action = getRouteAction('/product/some-id', null)
    expect(action).toBe('allow')
  })

  it('allows /blog/some-slug without auth', () => {
    const action = getRouteAction('/blog/some-slug', null)
    expect(action).toBe('allow')
  })

  it('allows /about without auth', () => {
    const action = getRouteAction('/about', null)
    expect(action).toBe('allow')
  })

  it('allows /faq without auth', () => {
    const action = getRouteAction('/faq', null)
    expect(action).toBe('allow')
  })

  it('allows /branches without auth', () => {
    const action = getRouteAction('/branches', null)
    expect(action).toBe('allow')
  })

  it('allows /highlight without auth', () => {
    const action = getRouteAction('/highlight', null)
    expect(action).toBe('allow')
  })

  it('allows /manual without auth', () => {
    const action = getRouteAction('/manual', null)
    expect(action).toBe('allow')
  })

  // --- Expanded tests: login page edge cases ---
  it('allows /login for authenticated customer (not admin)', () => {
    const user = { role: 'customer' }
    const action = getRouteAction('/login', user)
    expect(action).toBe('allow')
  })

  it('redirects /login for authenticated editor to dashboard', () => {
    const user = { role: 'editor' }
    const action = getRouteAction('/login', user)
    expect(action).toEqual({ redirect: '/admin/dashboard' })
  })

  // --- Expanded tests: account route edge cases ---
  it('protects /account root for unauthenticated users', () => {
    const action = getRouteAction('/account', null)
    expect(action).toEqual({ redirect: '/' })
  })

  it('allows /account root for admin user', () => {
    const user = { role: 'admin' }
    const action = getRouteAction('/account', user)
    expect(action).toBe('allow')
  })

  // --- Expanded tests: skip patterns ---
  it('skips middleware for favicon', () => {
    const action = getRouteAction('/favicon.ico', null)
    expect(action).toBe('skip')
  })

  it('skips middleware for static CSS files', () => {
    const action = getRouteAction('/styles.css', null)
    expect(action).toBe('skip')
  })

  it('skips middleware for static image files', () => {
    const action = getRouteAction('/images/logo.svg', null)
    expect(action).toBe('skip')
  })

  it('skips middleware for _next data', () => {
    const action = getRouteAction('/_next/data/build-id/index.json', null)
    expect(action).toBe('skip')
  })

  // --- Expanded tests: unknown routes ---
  it('allows unknown routes as fallback', () => {
    const action = getRouteAction('/some-unknown-page', null)
    expect(action).toBe('allow')
  })
})
