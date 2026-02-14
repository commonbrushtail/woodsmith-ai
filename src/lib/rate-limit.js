/**
 * In-memory sliding window rate limiter.
 * Suitable for single-process Next.js deployments.
 *
 * @param {{ windowMs: number, max: number }} options
 * @returns {{ check: (key: string) => { allowed: boolean, remaining: number, retryAfterMs: number }, reset: () => void }}
 */
export function createRateLimiter({ windowMs, max }) {
  /** @type {Map<string, { count: number, windowStart: number }>} */
  const store = new Map()

  function check(key) {
    const now = Date.now()
    const entry = store.get(key)

    // No previous record or window has expired
    if (!entry || now - entry.windowStart >= windowMs) {
      if (max <= 0) {
        store.set(key, { count: 0, windowStart: now })
        return { allowed: false, remaining: 0, retryAfterMs: windowMs }
      }
      store.set(key, { count: 1, windowStart: now })
      return { allowed: true, remaining: max - 1, retryAfterMs: 0 }
    }

    // Within current window
    if (entry.count < max) {
      entry.count++
      return { allowed: true, remaining: max - entry.count, retryAfterMs: 0 }
    }

    // Rate limited
    const retryAfterMs = windowMs - (now - entry.windowStart)
    return { allowed: false, remaining: 0, retryAfterMs: Math.max(0, retryAfterMs) }
  }

  function reset() {
    const now = Date.now()
    for (const [key, entry] of store) {
      if (now - entry.windowStart >= windowMs) {
        store.delete(key)
      }
    }
  }

  return { check, reset }
}

// Pre-configured limiters for common use cases
export const loginLimiter = createRateLimiter({ windowMs: 60 * 1000, max: 5 })
export const passwordResetLimiter = createRateLimiter({ windowMs: 15 * 60 * 1000, max: 3 })
