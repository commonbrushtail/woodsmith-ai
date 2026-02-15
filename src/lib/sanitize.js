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

/**
 * Strip all HTML tags from a string, returning only text content.
 * Handles nested tags, self-closing tags, and HTML entities.
 * Uses browser DOMParser in client environment for robust parsing.
 *
 * @param {*} html - HTML string to strip
 * @returns {string} Plain text without HTML tags
 */
export function stripHtmlTags(html) {
  if (!html) return ''
  if (typeof html !== 'string') return ''

  // Use browser DOMParser for robust HTML parsing (client-side)
  if (typeof window !== 'undefined' && window.DOMParser) {
    try {
      const parser = new DOMParser()
      const doc = parser.parseFromString(html, 'text/html')
      return doc.body.textContent || ''
    } catch (err) {
      // Fallback to regex if DOMParser fails
      console.warn('DOMParser failed, using regex fallback:', err)
    }
  }

  // Server-side or fallback: use regex (handles most cases)
  // This regex removes all tags: <tag>, </tag>, <tag/>
  return html.replace(/<[^>]*>/g, '').trim()
}
