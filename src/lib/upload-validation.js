export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]

export const ALLOWED_PDF_TYPES = [
  'application/pdf',
]

export const MAX_IMAGE_SIZE = 10 * 1024 * 1024  // 10MB
export const MAX_PDF_SIZE = 10 * 1024 * 1024    // 10MB

/**
 * Compress an image file client-side using Canvas.
 * Resizes to fit within maxWidth/maxHeight and outputs as WebP.
 * GIFs are returned as-is (to preserve animation).
 * @returns {Promise<File>} compressed file
 */
export async function compressImage(file, { maxWidth = 1920, maxHeight = 1920, quality = 0.82 } = {}) {
  // Skip GIFs (animated) — return as-is
  if (file.type === 'image/gif') return file

  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      let { width, height } = img

      // Scale down if exceeds max dimensions
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height)
        width = Math.round(width * ratio)
        height = Math.round(height * ratio)
      }

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file) // fallback to original
            return
          }
          // Only use compressed version if it's actually smaller
          if (blob.size >= file.size) {
            resolve(file)
            return
          }
          const compressed = new File([blob], file.name.replace(/\.\w+$/, '.webp'), {
            type: 'image/webp',
            lastModified: Date.now(),
          })
          resolve(compressed)
        },
        'image/webp',
        quality,
      )
    }
    img.onerror = () => resolve(file) // fallback to original on error
    img.src = URL.createObjectURL(file)
  })
}

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
