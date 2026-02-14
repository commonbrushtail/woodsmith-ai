import { describe, it, expect } from 'vitest'
import { sanitizeHtml } from '@/lib/sanitize-html'

describe('sanitizeHtml', () => {
  it('allows safe HTML tags', () => {
    const html = '<p>Hello <strong>bold</strong> and <em>italic</em></p>'
    expect(sanitizeHtml(html)).toBe(html)
  })

  it('allows headings', () => {
    const html = '<h2>Title</h2><h3>Subtitle</h3>'
    expect(sanitizeHtml(html)).toBe(html)
  })

  it('allows lists', () => {
    const html = '<ul><li>Item 1</li><li>Item 2</li></ul>'
    expect(sanitizeHtml(html)).toBe(html)
  })

  it('allows ordered lists', () => {
    const html = '<ol><li>First</li><li>Second</li></ol>'
    expect(sanitizeHtml(html)).toBe(html)
  })

  it('allows links with href', () => {
    const html = '<a href="https://example.com">Link</a>'
    expect(sanitizeHtml(html)).toBe(html)
  })

  it('allows images with src', () => {
    const html = '<img src="https://example.com/img.jpg" alt="photo">'
    const result = sanitizeHtml(html)
    expect(result).toContain('src="https://example.com/img.jpg"')
    expect(result).toContain('alt="photo"')
  })

  it('allows blockquotes and br', () => {
    const html = '<blockquote>Quote</blockquote><br>'
    const result = sanitizeHtml(html)
    expect(result).toContain('<blockquote>')
    expect(result).toContain('<br')
  })

  it('strips script tags', () => {
    const html = '<p>Safe</p><script>alert("xss")</script>'
    const result = sanitizeHtml(html)
    expect(result).not.toContain('<script')
    expect(result).not.toContain('alert')
    expect(result).toContain('<p>Safe</p>')
  })

  it('strips style tags', () => {
    const html = '<p>Hello</p><style>body{display:none}</style>'
    const result = sanitizeHtml(html)
    expect(result).not.toContain('<style')
    expect(result).toContain('<p>Hello</p>')
  })

  it('strips event handlers', () => {
    const html = '<img src="x" onerror="alert(1)">'
    const result = sanitizeHtml(html)
    expect(result).not.toContain('onerror')
  })

  it('strips onclick handlers', () => {
    const html = '<p onclick="alert(1)">Click me</p>'
    const result = sanitizeHtml(html)
    expect(result).not.toContain('onclick')
    expect(result).toContain('Click me')
  })

  it('strips javascript: URLs in links', () => {
    const html = '<a href="javascript:alert(1)">Click</a>'
    const result = sanitizeHtml(html)
    expect(result).not.toContain('javascript:')
  })

  it('strips javascript: URLs in images', () => {
    const html = '<img src="javascript:alert(1)">'
    const result = sanitizeHtml(html)
    expect(result).not.toContain('javascript:')
  })

  it('returns empty string for null/undefined', () => {
    expect(sanitizeHtml(null)).toBe('')
    expect(sanitizeHtml(undefined)).toBe('')
    expect(sanitizeHtml('')).toBe('')
  })

  it('strips unknown tags', () => {
    const html = '<p>Safe</p><iframe src="evil.com"></iframe>'
    const result = sanitizeHtml(html)
    expect(result).not.toContain('<iframe')
    expect(result).toContain('<p>Safe</p>')
  })
})
