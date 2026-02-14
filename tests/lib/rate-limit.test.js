import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createRateLimiter } from '@/lib/rate-limit'

describe('createRateLimiter', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('allows requests within limit', () => {
    const limiter = createRateLimiter({ windowMs: 60000, max: 3 })
    expect(limiter.check('user-1').allowed).toBe(true)
    expect(limiter.check('user-1').allowed).toBe(true)
    expect(limiter.check('user-1').allowed).toBe(true)
  })

  it('blocks requests exceeding limit', () => {
    const limiter = createRateLimiter({ windowMs: 60000, max: 2 })
    limiter.check('user-1')
    limiter.check('user-1')
    const result = limiter.check('user-1')
    expect(result.allowed).toBe(false)
    expect(result.retryAfterMs).toBeGreaterThan(0)
  })

  it('tracks limits per key independently', () => {
    const limiter = createRateLimiter({ windowMs: 60000, max: 1 })
    expect(limiter.check('user-1').allowed).toBe(true)
    expect(limiter.check('user-2').allowed).toBe(true)
    expect(limiter.check('user-1').allowed).toBe(false)
  })

  it('resets after window expires', () => {
    const limiter = createRateLimiter({ windowMs: 1000, max: 1 })
    limiter.check('user-1')
    expect(limiter.check('user-1').allowed).toBe(false)
    vi.advanceTimersByTime(1001)
    expect(limiter.check('user-1').allowed).toBe(true)
  })

  it('returns remaining count', () => {
    const limiter = createRateLimiter({ windowMs: 60000, max: 3 })
    const r1 = limiter.check('user-1')
    expect(r1.remaining).toBe(2)
    const r2 = limiter.check('user-1')
    expect(r2.remaining).toBe(1)
    const r3 = limiter.check('user-1')
    expect(r3.remaining).toBe(0)
  })

  it('retryAfterMs is 0 when allowed', () => {
    const limiter = createRateLimiter({ windowMs: 60000, max: 3 })
    const result = limiter.check('user-1')
    expect(result.retryAfterMs).toBe(0)
  })

  it('retryAfterMs decreases as time passes', () => {
    const limiter = createRateLimiter({ windowMs: 10000, max: 1 })
    limiter.check('user-1')
    const r1 = limiter.check('user-1')
    expect(r1.retryAfterMs).toBeLessThanOrEqual(10000)

    vi.advanceTimersByTime(5000)
    const r2 = limiter.check('user-1')
    expect(r2.retryAfterMs).toBeLessThanOrEqual(5000)
  })

  it('handles zero max gracefully — always blocks', () => {
    const limiter = createRateLimiter({ windowMs: 60000, max: 0 })
    expect(limiter.check('user-1').allowed).toBe(false)
  })

  it('cleans up expired entries via reset', () => {
    const limiter = createRateLimiter({ windowMs: 1000, max: 1 })
    limiter.check('user-1')
    limiter.check('user-2')
    vi.advanceTimersByTime(1001)
    limiter.reset()
    // After reset + window expiry, all should be allowed again
    expect(limiter.check('user-1').allowed).toBe(true)
    expect(limiter.check('user-2').allowed).toBe(true)
  })
})
