'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/lib/toast-context'
import { validateFile, compressImage } from '@/lib/upload-validation'
import { uploadProductImage, deleteProductImage } from '@/lib/actions/products'

function PlusIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="16" fill="#ff7e1b" fillOpacity="0.15" />
      <line x1="16" y1="10" x2="16" y2="22" stroke="#ff7e1b" strokeWidth="2" strokeLinecap="round" />
      <line x1="10" y1="16" x2="22" y2="16" stroke="#ff7e1b" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round">
      <path d="M2 2L8 8M8 2L2 8" />
    </svg>
  )
}

function SpinnerIcon() {
  return (
    <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff7e1b" strokeWidth="2.5" strokeLinecap="round">
      <path d="M12 2a10 10 0 0 1 10 10" />
    </svg>
  )
}

export default function ProductImageUploader({
  pendingFiles = [],
  onPendingFilesChange,
  productId = null,
  existingImages = [],
  onExistingImagesChange,
  maxImages = 20,
}) {
  const { toast } = useToast()
  const router = useRouter()
  const fileInputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const isEditMode = productId !== null
  const currentCount = isEditMode ? existingImages.length : pendingFiles.length
  const canAdd = currentCount < maxImages

  const handleFilesSelected = async (files) => {
    const remaining = maxImages - currentCount
    if (remaining <= 0) {
      toast.error(`สูงสุด ${maxImages} รูปภาพ`)
      return
    }

    const validFiles = []
    for (const file of files.slice(0, remaining)) {
      const result = validateFile(file)
      if (!result.valid) {
        toast.error(`${file.name}: ${result.error}`)
      } else {
        validFiles.push(file)
      }
    }
    if (validFiles.length === 0) return

    // Compress images before upload/preview
    const compressed = await Promise.all(validFiles.map(f => compressImage(f)))

    if (isEditMode) {
      setIsUploading(true)
      try {
        for (const file of compressed) {
          const formData = new FormData()
          formData.set('file', file)
          const result = await uploadProductImage(productId, formData)
          if (result.error) {
            toast.error(`${file.name}: ${result.error}`)
          } else {
            onExistingImagesChange?.(prev => [...prev, { id: result.id || Date.now(), url: result.url, is_primary: prev.length === 0, sort_order: prev.length }])
          }
        }
        router.refresh()
      } catch {
        toast.error('เกิดข้อผิดพลาดในการอัปโหลด')
      } finally {
        setIsUploading(false)
      }
    } else {
      const newFiles = compressed.map((file) => ({
        id: Date.now() + Math.random(),
        file,
        previewUrl: URL.createObjectURL(file),
        name: file.name,
      }))
      onPendingFilesChange?.([...pendingFiles, ...newFiles])
    }
  }

  const handleRemove = async (item) => {
    if (isEditMode) {
      if (!confirm('ต้องการลบรูปภาพนี้หรือไม่?')) return
      const result = await deleteProductImage(item.id)
      if (result.error) {
        toast.error('เกิดข้อผิดพลาด: ' + result.error)
      } else {
        onExistingImagesChange?.(prev => prev.filter(img => img.id !== item.id))
        router.refresh()
      }
    } else {
      if (item.previewUrl) URL.revokeObjectURL(item.previewUrl)
      onPendingFilesChange?.(pendingFiles.filter(f => f.id !== item.id))
    }
  }

  const images = isEditMode
    ? existingImages.map(img => ({ id: img.id, src: img.url, isPrimary: img.is_primary }))
    : pendingFiles.map((f, i) => ({ id: f.id, src: f.previewUrl, isPrimary: i === 0 }))

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) handleFilesSelected(files)
  }

  return (
    <section className="bg-white rounded-[12px] border border-[#e8eaef] p-[24px] flex flex-col gap-[16px]">
      <label className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
        Image / รูปภาพ <span className="text-red-500">*</span>
      </label>

      {images.length > 0 && (
        <div className="flex items-start gap-[12px] flex-wrap">
          {images.map((img) => (
            <div key={img.id} className="relative w-[120px] h-[90px] rounded-[8px] overflow-hidden bg-[#f3f4f6] group">
              <img src={img.src} alt="" className="w-full h-full object-cover" draggable={false} />
              {img.isPrimary && (
                <span className="absolute bottom-[4px] left-[4px] bg-orange text-white text-[10px] font-['IBM_Plex_Sans_Thai'] font-medium px-[6px] py-[1px] rounded-full">
                  รูปหลัก
                </span>
              )}
              <button
                type="button"
                onClick={() => handleRemove(isEditMode ? existingImages.find(ei => ei.id === img.id) : pendingFiles.find(pf => pf.id === img.id))}
                className="absolute top-[4px] right-[4px] size-[20px] bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center border-0 cursor-pointer z-10 transition-colors opacity-0 group-hover:opacity-100"
                aria-label="Remove image"
              >
                <XIcon />
              </button>
            </div>
          ))}
        </div>
      )}

      {canAdd && !isUploading && (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-[8px] bg-[#fafafa] flex flex-col items-center justify-center gap-[8px]
            py-[32px] px-[16px] cursor-pointer transition-colors
            ${isDragging ? 'border-orange bg-[#fff8f3]' : 'border-[#e5e7eb] hover:border-orange/50'}
          `}
          role="button"
          tabIndex={0}
          aria-label="Upload image area"
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInputRef.current?.click() } }}
        >
          <PlusIcon />
          <p className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#9ca3af] text-center leading-[1.5] m-0">
            Click to add an asset or drag and drop one in this area
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            className="hidden"
            onChange={(e) => {
              const files = Array.from(e.target.files)
              if (files.length > 0) handleFilesSelected(files)
              e.target.value = ''
            }}
          />
        </div>
      )}

      {isUploading && (
        <div className="flex items-center justify-center gap-[8px] py-[24px]">
          <SpinnerIcon />
          <span className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-orange font-medium">
            กำลังอัปโหลด...
          </span>
        </div>
      )}
    </section>
  )
}
