export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]

export const ALLOWED_PDF_TYPES = [
  'application/pdf',
]

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024  // 5MB
export const MAX_PDF_SIZE = 10 * 1024 * 1024    // 10MB

/**
 * Validate a file against allowed types and max size.
 * Returns { valid: true } or { valid: false, error: string }
 */
export function validateFile(file, options = {}) {
  const {
    allowedTypes = ALLOWED_IMAGE_TYPES,
    maxSize = MAX_IMAGE_SIZE,
  } = options

  if (!file) {
    return { valid: false, error: 'กรุณาเลือกไฟล์' }
  }

  if (!allowedTypes.includes(file.type)) {
    const typeNames = allowedTypes.map((t) => t.split('/')[1]).join(', ')
    return { valid: false, error: `ประเภทไฟล์ไม่ถูกต้อง รองรับเฉพาะ: ${typeNames}` }
  }

  if (file.size > maxSize) {
    return { valid: false, error: `ขนาดไฟล์เกินกำหนด (สูงสุด ${formatFileSize(maxSize)})` }
  }

  return { valid: true }
}

/**
 * Format bytes into human-readable size string.
 */
export function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
