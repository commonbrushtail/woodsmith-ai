import { describe, it, expect } from 'vitest'
import { sanitizeInput, sanitizeObject } from '@/lib/sanitize'

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
