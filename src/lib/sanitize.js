/**
 * Sanitize a string input: trim whitespace, strip null bytes and control chars.
 * Preserves newlines (\n) and tabs (\t).
 *
 * @param {*} input
 * @returns {string}
 */
export function sanitizeInput(input) {
  if (typeof input !== 'string') return ''

  return input
    // Strip null bytes
    .replace(/\0/g, '')
    // Strip control characters except \n (0x0A) and \t (0x09)
    .replace(/[\x01-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .trim()
}

/**
 * Sanitize all top-level string values in an object.
 * Non-string values are passed through unchanged.
 *
 * @param {Record<string, any>} obj
 * @returns {Record<string, any>}
 */
export function sanitizeObject(obj) {
  const result = {}
  for (const [key, value] of Object.entries(obj)) {
    result[key] = typeof value === 'string' ? sanitizeInput(value) : value
  }
  return result
}
