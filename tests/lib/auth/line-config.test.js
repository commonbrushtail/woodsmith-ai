import { describe, it, expect, vi, beforeEach } from 'vitest'

// Set env vars before import
vi.stubEnv('LINE_CHANNEL_ID', 'test-channel-id')
vi.stubEnv('LINE_CHANNEL_SECRET', 'test-channel-secret')
vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://woodsmith.co.th')

describe('getLineLoginUrl', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('generates URL with correct base domain', async () => {
    const { getLineLoginUrl } = await import('@/lib/auth/line-config')
    const url = getLineLoginUrl('test-state')
    expect(url).toContain('access.line.me/oauth2')
  })

  it('includes response_type=code', async () => {
    const { getLineLoginUrl } = await import('@/lib/auth/line-config')
    const url = getLineLoginUrl('test-state')
    expect(url).toContain('response_type=code')
  })

  it('includes state parameter', async () => {
    const { getLineLoginUrl } = await import('@/lib/auth/line-config')
    const url = getLineLoginUrl('my-state-123')
    expect(url).toContain('state=my-state-123')
  })

  it('includes client_id from env', async () => {
    const { getLineLoginUrl } = await import('@/lib/auth/line-config')
    const url = getLineLoginUrl('test-state')
    expect(url).toContain('client_id=test-channel-id')
  })

  it('includes redirect_uri', async () => {
    const { getLineLoginUrl } = await import('@/lib/auth/line-config')
    const url = getLineLoginUrl('test-state')
    expect(url).toContain('redirect_uri=')
    expect(url).toContain(encodeURIComponent('https://woodsmith.co.th/auth/callback'))
  })

  it('requests openid and profile scopes', async () => {
    const { getLineLoginUrl } = await import('@/lib/auth/line-config')
    const url = getLineLoginUrl('test-state')
    expect(url).toContain('scope=')
    expect(url).toMatch(/openid/)
    expect(url).toMatch(/profile/)
  })
})

describe('validateLineCallback', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('rejects missing code', async () => {
    const { validateLineCallback } = await import('@/lib/auth/line-config')
    expect(() => validateLineCallback({ state: 'x' })).toThrow()
  })

  it('rejects missing state', async () => {
    const { validateLineCallback } = await import('@/lib/auth/line-config')
    expect(() => validateLineCallback({ code: 'x' })).toThrow()
  })

  it('rejects empty code', async () => {
    const { validateLineCallback } = await import('@/lib/auth/line-config')
    expect(() => validateLineCallback({ code: '', state: 'x' })).toThrow()
  })

  it('rejects empty state', async () => {
    const { validateLineCallback } = await import('@/lib/auth/line-config')
    expect(() => validateLineCallback({ code: 'x', state: '' })).toThrow()
  })

  it('accepts valid callback params', async () => {
    const { validateLineCallback } = await import('@/lib/auth/line-config')
    const result = validateLineCallback({ code: 'abc', state: 'xyz' })
    expect(result).toEqual({ code: 'abc', state: 'xyz' })
  })
})

describe('LINE_CONFIG', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('exports LINE_CONFIG with expected properties', async () => {
    const { LINE_CONFIG } = await import('@/lib/auth/line-config')
    expect(LINE_CONFIG.authorizationUrl).toContain('access.line.me')
    expect(LINE_CONFIG.tokenUrl).toContain('api.line.me')
    expect(LINE_CONFIG.profileUrl).toContain('api.line.me')
  })
})
