import { describe, it, expect } from 'vitest'
import { sanitizeInput, sanitizeObject, stripHtmlTags } from '@/lib/sanitize'

describe('sanitizeInput', () => {
  it('trims whitespace', () => {
    expect(sanitizeInput('  hello  ')).toBe('hello')
  })

  it('strips null bytes', () => {
    expect(sanitizeInput('hel\x00lo')).toBe('hello')
  })

  it('returns empty string for non-string input', () => {
    expect(sanitizeInput(null)).toBe('')
    expect(sanitizeInput(undefined)).toBe('')
    expect(sanitizeInput(123)).toBe('')
  })

  it('preserves Thai characters', () => {
    expect(sanitizeInput('สวัสดี')).toBe('สวัสดี')
  })

  it('preserves normal text with spaces', () => {
    expect(sanitizeInput('hello world')).toBe('hello world')
  })

  it('strips control characters except newlines and tabs', () => {
    expect(sanitizeInput('hello\x01world')).toBe('helloworld')
    expect(sanitizeInput('hello\nworld')).toBe('hello\nworld')
    expect(sanitizeInput('hello\tworld')).toBe('hello\tworld')
  })

  it('handles empty string', () => {
    expect(sanitizeInput('')).toBe('')
  })
})

describe('sanitizeObject', () => {
  it('sanitizes all string values in an object', () => {
    const input = { name: '  Test  ', count: 5, desc: 'hello\x00' }
    const result = sanitizeObject(input)
    expect(result).toEqual({ name: 'Test', count: 5, desc: 'hello' })
  })

  it('preserves non-string values', () => {
    const input = { num: 42, bool: true, arr: [1, 2], obj: { a: 1 } }
    const result = sanitizeObject(input)
    expect(result).toEqual(input)
  })

  it('handles null values in object', () => {
    const input = { name: 'hello', empty: null }
    const result = sanitizeObject(input)
    expect(result).toEqual({ name: 'hello', empty: null })
  })

  it('returns empty object for empty input', () => {
    expect(sanitizeObject({})).toEqual({})
  })

  it('handles nested strings at top level only', () => {
    const input = { name: '  nested  ', sub: { deep: '  keep  ' } }
    const result = sanitizeObject(input)
    expect(result.name).toBe('nested')
    // Nested objects are not recursively sanitized
    expect(result.sub.deep).toBe('  keep  ')
  })
})

describe('stripHtmlTags', () => {
  it('strips simple HTML tags from text', () => {
    expect(stripHtmlTags('<p>Hello World</p>')).toBe('Hello World')
    expect(stripHtmlTags('<b>Bold</b> text')).toBe('Bold text')
  })

  it('strips nested HTML tags', () => {
    expect(stripHtmlTags('<p><b>Nested</b> tags</p>')).toBe('Nested tags')
    expect(stripHtmlTags('<div><span><em>Deep</em></span></div>')).toBe('Deep')
  })

  it('strips self-closing tags', () => {
    expect(stripHtmlTags('Line 1<br/>Line 2')).toBe('Line 1Line 2')
    expect(stripHtmlTags('Image here: <img src="test.jpg" />')).toBe('Image here: ')
  })

  it('handles HTML entities correctly', () => {
    expect(stripHtmlTags('&lt;p&gt;Text&lt;/p&gt;')).toBe('<p>Text</p>')
    expect(stripHtmlTags('A &amp; B')).toBe('A & B')
    expect(stripHtmlTags('&quot;Quoted&quot;')).toBe('"Quoted"')
  })

  it('preserves whitespace between block elements', () => {
    expect(stripHtmlTags('<p>Para 1</p><p>Para 2</p>')).toBe('Para 1Para 2')
    expect(stripHtmlTags('<h1>Title</h1><p>Content</p>')).toBe('TitleContent')
  })

  it('handles empty input', () => {
    expect(stripHtmlTags('')).toBe('')
    expect(stripHtmlTags(null)).toBe('')
    expect(stripHtmlTags(undefined)).toBe('')
  })

  it('handles plain text (no tags)', () => {
    expect(stripHtmlTags('Plain text')).toBe('Plain text')
    expect(stripHtmlTags('Thai text: สวัสดี')).toBe('Thai text: สวัสดี')
  })

  it('strips TipTap default paragraph wrapper', () => {
    expect(stripHtmlTags('<p>Company Name</p>')).toBe('Company Name')
    expect(stripHtmlTags('<p><strong>Bold Company</strong></p>')).toBe('Bold Company')
  })
})
