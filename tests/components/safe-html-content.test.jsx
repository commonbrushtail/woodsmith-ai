import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import SafeHtmlContent from '@/components/SafeHtmlContent'

describe('SafeHtmlContent', () => {
  it('renders sanitized HTML content', () => {
    render(<SafeHtmlContent html="<p>Hello <strong>world</strong></p>" />)
    const container = screen.getByTestId('safe-html-content')
    expect(container.innerHTML).toContain('<p>Hello <strong>world</strong></p>')
  })

  it('strips script tags', () => {
    render(<SafeHtmlContent html='<p>Safe</p><script>alert("xss")</script>' />)
    const container = screen.getByTestId('safe-html-content')
    expect(container.innerHTML).not.toContain('script')
    expect(container.innerHTML).toContain('<p>Safe</p>')
  })

  it('strips event handler attributes', () => {
    render(<SafeHtmlContent html='<p onclick="alert(1)">Click</p>' />)
    const container = screen.getByTestId('safe-html-content')
    expect(container.innerHTML).not.toContain('onclick')
    expect(container.innerHTML).toContain('<p>Click</p>')
  })

  it('allows safe tags like headings, lists, links', () => {
    const html = '<h2>Title</h2><ul><li>Item</li></ul><a href="https://example.com">Link</a>'
    render(<SafeHtmlContent html={html} />)
    const container = screen.getByTestId('safe-html-content')
    expect(container.innerHTML).toContain('<h2>Title</h2>')
    expect(container.innerHTML).toContain('<ul><li>Item</li></ul>')
    expect(container.innerHTML).toContain('<a href="https://example.com">Link</a>')
  })

  it('renders empty string when html is null or undefined', () => {
    const { rerender } = render(<SafeHtmlContent html={null} />)
    const container = screen.getByTestId('safe-html-content')
    expect(container.innerHTML).toBe('')

    rerender(<SafeHtmlContent html={undefined} />)
    expect(container.innerHTML).toBe('')
  })

  it('applies custom className', () => {
    render(<SafeHtmlContent html="<p>Content</p>" className="prose text-sm" />)
    const container = screen.getByTestId('safe-html-content')
    expect(container.className).toContain('prose')
    expect(container.className).toContain('text-sm')
  })

  it('strips disallowed tags like iframe', () => {
    render(<SafeHtmlContent html='<p>OK</p><iframe src="evil.com"></iframe>' />)
    const container = screen.getByTestId('safe-html-content')
    expect(container.innerHTML).not.toContain('iframe')
    expect(container.innerHTML).toContain('<p>OK</p>')
  })

  it('strips javascript: URLs from links', () => {
    render(<SafeHtmlContent html='<a href="javascript:alert(1)">Bad</a>' />)
    const container = screen.getByTestId('safe-html-content')
    expect(container.innerHTML).not.toContain('javascript')
  })
})
