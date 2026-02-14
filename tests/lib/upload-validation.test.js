import { describe, it, expect } from 'vitest'
import {
  validateFile,
  ALLOWED_IMAGE_TYPES,
  ALLOWED_PDF_TYPES,
  MAX_IMAGE_SIZE,
  MAX_PDF_SIZE,
  formatFileSize,
} from '@/lib/upload-validation'

describe('validateFile', () => {
  it('accepts a valid image file', () => {
    const file = new File(['x'], 'photo.jpg', { type: 'image/jpeg' })
    const result = validateFile(file, { allowedTypes: ALLOWED_IMAGE_TYPES, maxSize: MAX_IMAGE_SIZE })
    expect(result.valid).toBe(true)
    expect(result.error).toBeUndefined()
  })

  it('accepts a valid PDF file', () => {
    const file = new File(['x'], 'doc.pdf', { type: 'application/pdf' })
    const result = validateFile(file, { allowedTypes: ALLOWED_PDF_TYPES, maxSize: MAX_PDF_SIZE })
    expect(result.valid).toBe(true)
    expect(result.error).toBeUndefined()
  })

  it('rejects file with invalid type', () => {
    const file = new File(['x'], 'script.exe', { type: 'application/x-msdownload' })
    const result = validateFile(file, { allowedTypes: ALLOWED_IMAGE_TYPES, maxSize: MAX_IMAGE_SIZE })
    expect(result.valid).toBe(false)
    expect(result.error).toMatch(/ประเภทไฟล์/)
  })

  it('rejects file exceeding max size', () => {
    // Create a file that reports a large size
    const bigContent = new Uint8Array(6 * 1024 * 1024) // 6MB
    const file = new File([bigContent], 'huge.jpg', { type: 'image/jpeg' })
    const result = validateFile(file, { allowedTypes: ALLOWED_IMAGE_TYPES, maxSize: MAX_IMAGE_SIZE })
    expect(result.valid).toBe(false)
    expect(result.error).toMatch(/ขนาดไฟล์/)
  })

  it('rejects null/undefined file', () => {
    const result = validateFile(null, { allowedTypes: ALLOWED_IMAGE_TYPES, maxSize: MAX_IMAGE_SIZE })
    expect(result.valid).toBe(false)
    expect(result.error).toBeTruthy()
  })

  it('uses default image options when no options provided', () => {
    const file = new File(['x'], 'photo.png', { type: 'image/png' })
    const result = validateFile(file)
    expect(result.valid).toBe(true)
  })
})

describe('constants', () => {
  it('ALLOWED_IMAGE_TYPES contains common image types', () => {
    expect(ALLOWED_IMAGE_TYPES).toContain('image/jpeg')
    expect(ALLOWED_IMAGE_TYPES).toContain('image/png')
    expect(ALLOWED_IMAGE_TYPES).toContain('image/webp')
  })

  it('ALLOWED_PDF_TYPES contains application/pdf', () => {
    expect(ALLOWED_PDF_TYPES).toContain('application/pdf')
  })

  it('MAX_IMAGE_SIZE is 5MB', () => {
    expect(MAX_IMAGE_SIZE).toBe(5 * 1024 * 1024)
  })

  it('MAX_PDF_SIZE is 10MB', () => {
    expect(MAX_PDF_SIZE).toBe(10 * 1024 * 1024)
  })
})

describe('formatFileSize', () => {
  it('formats bytes', () => {
    expect(formatFileSize(500)).toBe('500 B')
  })

  it('formats kilobytes', () => {
    expect(formatFileSize(1536)).toBe('1.5 KB')
  })

  it('formats megabytes', () => {
    expect(formatFileSize(5 * 1024 * 1024)).toBe('5.0 MB')
  })
})
