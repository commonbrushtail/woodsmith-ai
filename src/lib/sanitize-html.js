const ALLOWED_TAGS = new Set([
  'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'strong', 'em', 'b', 'i', 'u',
  'ul', 'ol', 'li',
  'a', 'img', 'br', 'hr',
  'blockquote', 'pre', 'code',
])

const ALLOWED_ATTRS = {
  a: new Set(['href', 'target', 'rel']),
  img: new Set(['src', 'alt', 'width', 'height']),
}

const DANGEROUS_URL_RE = /^\s*javascript\s*:/i

/**
 * Sanitize HTML by allowlisting safe tags and stripping dangerous content.
 * Works in both server and client environments (no DOM dependency).
 */
export function sanitizeHtml(html) {
  if (!html) return ''

  let result = ''
  let i = 0

  // Strip <script> and <style> blocks entirely (content + tags)
  html = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
  html = html.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')

  while (i < html.length) {
    if (html[i] === '<') {
      const tagEnd = html.indexOf('>', i)
      if (tagEnd === -1) break

      const fullTag = html.slice(i, tagEnd + 1)
      const isClosing = fullTag[1] === '/'
      const isSelfClosing = fullTag[tagEnd - i - 1] === '/'

      // Extract tag name
      const nameMatch = fullTag.match(/^<\/?([a-zA-Z][a-zA-Z0-9]*)/)
      if (!nameMatch) {
        // Not a valid tag, skip it
        i = tagEnd + 1
        continue
      }

      const tagName = nameMatch[1].toLowerCase()

      if (!ALLOWED_TAGS.has(tagName)) {
        // Strip disallowed tag (skip its content for void elements, keep for block)
        i = tagEnd + 1
        continue
      }

      if (isClosing) {
        result += `</${tagName}>`
      } else {
        // Parse and filter attributes
        const attrs = parseAttributes(fullTag, tagName)
        const attrStr = attrs.length > 0 ? ' ' + attrs.join(' ') : ''
        const closing = isSelfClosing || tagName === 'br' || tagName === 'hr' || tagName === 'img' ? '>' : '>'
        result += `<${tagName}${attrStr}${closing}`
      }

      i = tagEnd + 1
    } else {
      result += html[i]
      i++
    }
  }

  return result
}

function parseAttributes(tag, tagName) {
  const allowed = ALLOWED_ATTRS[tagName]
  if (!allowed) return []

  const attrs = []
  const attrRe = /([a-zA-Z][a-zA-Z0-9-]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|(\S+))/g
  let match

  while ((match = attrRe.exec(tag)) !== null) {
    const name = match[1].toLowerCase()
    const value = match[2] ?? match[3] ?? match[4] ?? ''

    // Skip event handlers
    if (name.startsWith('on')) continue

    // Skip disallowed attributes
    if (!allowed.has(name)) continue

    // Skip dangerous URLs
    if ((name === 'href' || name === 'src') && DANGEROUS_URL_RE.test(value)) continue

    attrs.push(`${name}="${value}"`)
  }

  return attrs
}
