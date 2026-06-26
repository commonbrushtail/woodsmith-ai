/**
 * Whether a redirect target is a safe, internal, same-origin path.
 *
 * Rejects absolute URLs and protocol-relative / backslash tricks
 * ("//evil.com", "/\\evil.com") to prevent open redirects from the
 * preview enable/disable routes.
 *
 * @param {unknown} p
 * @returns {boolean}
 */
export function isInternalPath(p) {
  if (typeof p !== 'string' || !p.startsWith('/')) return false
  if (p.startsWith('//') || p.startsWith('/\\')) return false
  return true
}
