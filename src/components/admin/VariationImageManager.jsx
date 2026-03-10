'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/lib/toast-context'
import { validateFile, compressImage } from '@/lib/upload-validation'
import { uploadProductImage, deleteProductImage } from '@/lib/actions/products'

function SpinnerIcon() {
  return (
    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff7e1b" strokeWidth="2.5" strokeLinecap="round">
      <path d="M12 2a10 10 0 0 1 10 10" />
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

function ImagePlaceholder() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#bfbfbf" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="m21 15-5-5L5 21" />
    </svg>
  )
}

/**
 * Manages per-variation product images.
 * Shows each linked variation entry with its current image and upload/replace/delete controls.
 */
export default function VariationImageManager({ productId, variationLinks = [], existingImages = [] }) {
  const { toast } = useToast()
  const router = useRouter()
  const [uploading, setUploading] = useState({})
  const fileInputRefs = useRef({})

  // Group variation links by group — all groups can have per-product images
  const groupedLinks = {}
  for (const link of variationLinks) {
    const groupName = link.variation_groups?.display_name || link.variation_groups?.name || link.group_id
    if (!groupedLinks[groupName]) {
      groupedLinks[groupName] = { entries: [] }
    }
    groupedLinks[groupName].entries.push({
      entryId: link.entry_id,
      label: link.variation_entries?.label || link.entry_id,
      swatchUrl: link.variation_entries?.image_url || null,
    })
  }

  // Build map: variation_entry_id -> product_image
  const imageByEntry = {}
  for (const img of existingImages) {
    if (img.variation_entry_id) {
      imageByEntry[img.variation_entry_id] = img
    }
  }

  const handleUpload = async (entryId, file) => {
    const validation = validateFile(file)
    if (!validation.valid) {
      toast.error(validation.error)
      return
    }

    setUploading(prev => ({ ...prev, [entryId]: true }))
    try {
      const compressed = await compressImage(file)
      const formData = new FormData()
      formData.set('file', compressed)
      formData.set('variation_entry_id', entryId)
      const result = await uploadProductImage(productId, formData)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('อัปโหลดรูปภาพสำเร็จ')
        router.refresh()
      }
    } catch {
      toast.error('เกิดข้อผิดพลาดในการอัปโหลด')
    } finally {
      setUploading(prev => ({ ...prev, [entryId]: false }))
    }
  }

  const handleDelete = async (entryId) => {
    const img = imageByEntry[entryId]
    if (!img) return
    if (!confirm('ต้องการลบรูปภาพตัวเลือกนี้หรือไม่?')) return

    const result = await deleteProductImage(img.id)
    if (result.error) {
      toast.error('เกิดข้อผิดพลาด: ' + result.error)
    } else {
      router.refresh()
    }
  }

  const visibleGroups = Object.entries(groupedLinks)
  if (visibleGroups.length === 0) return null

  return (
    <section className="bg-white rounded-[12px] border border-[#e8eaef] p-[24px] flex flex-col gap-[16px]">
      <label className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
        รูปภาพตามตัวเลือก (Variation Images)
      </label>
      <p className="font-['IBM_Plex_Sans_Thai'] text-[12px] text-[#6b7280] m-0">
        อัปโหลดรูปภาพเฉพาะสำหรับแต่ละตัวเลือก — จะแสดงเมื่อลูกค้าเลือกตัวเลือกนั้นในหน้าสินค้า
      </p>

      {visibleGroups.map(([groupName, group]) => (
        <div key={groupName} className="flex flex-col gap-[8px]">
          <p className="font-['IBM_Plex_Sans_Thai'] text-[13px] font-medium text-[#494c4f] m-0">
            {groupName}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-[12px]">
            {group.entries.map(entry => {
              const currentImage = imageByEntry[entry.entryId]
              const isUploading = uploading[entry.entryId]

              return (
                <div key={entry.entryId} className="flex flex-col gap-[6px]">
                  {/* Image area */}
                  <div className="relative w-full aspect-square rounded-[8px] overflow-hidden bg-[#f3f4f6] border border-[#e8eaef] group">
                    {isUploading ? (
                      <div className="flex items-center justify-center size-full">
                        <SpinnerIcon />
                      </div>
                    ) : currentImage ? (
                      <>
                        <img
                          src={currentImage.url}
                          alt=""
                          className="w-full h-full object-cover"
                          draggable={false}
                        />
                        {/* Delete button */}
                        <button
                          type="button"
                          onClick={() => handleDelete(entry.entryId)}
                          className="absolute top-[4px] right-[4px] size-[20px] bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center border-0 cursor-pointer z-10 transition-colors opacity-0 group-hover:opacity-100"
                          aria-label="Remove image"
                        >
                          <XIcon />
                        </button>
                        {/* Replace button */}
                        <button
                          type="button"
                          onClick={() => fileInputRefs.current[entry.entryId]?.click()}
                          className="absolute bottom-[4px] left-[4px] right-[4px] bg-black/50 hover:bg-black/70 text-white font-['IBM_Plex_Sans_Thai'] text-[10px] py-[3px] rounded-[4px] border-0 cursor-pointer opacity-0 group-hover:opacity-100 transition-colors text-center"
                        >
                          เปลี่ยนรูป
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => fileInputRefs.current[entry.entryId]?.click()}
                        className="flex flex-col items-center justify-center gap-[4px] size-full cursor-pointer bg-transparent border-0 hover:bg-[#f0f0f0] transition-colors"
                      >
                        <ImagePlaceholder />
                        <span className="font-['IBM_Plex_Sans_Thai'] text-[10px] text-[#9ca3af]">
                          อัปโหลด
                        </span>
                      </button>
                    )}

                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      ref={el => { fileInputRefs.current[entry.entryId] = el }}
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleUpload(entry.entryId, file)
                        e.target.value = ''
                      }}
                    />
                  </div>

                  {/* Label */}
                  <div className="flex items-center gap-[4px]">
                    {entry.swatchUrl && (
                      <img
                        src={entry.swatchUrl}
                        alt=""
                        className="w-[16px] h-[16px] rounded-full object-cover shrink-0"
                      />
                    )}
                    <span className="font-['IBM_Plex_Sans_Thai'] text-[12px] text-[#1f2937] truncate">
                      {entry.label}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </section>
  )
}
