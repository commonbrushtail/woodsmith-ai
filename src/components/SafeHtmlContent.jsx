import { sanitizeHtml } from '@/lib/sanitize-html'

/**
 * Renders sanitized HTML content safely using dangerouslySetInnerHTML.
 * Strips all disallowed tags, event handlers, and javascript: URLs.
 */
export default function SafeHtmlContent({ html, className = '' }) {
  const clean = sanitizeHtml(html)

  return (
    <div
      data-testid="safe-html-content"
      className={className}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  )
}
