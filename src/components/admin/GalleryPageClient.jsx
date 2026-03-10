'use client'

import { useState, useRef, useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/lib/toast-context'
import { createGalleryItems, deleteGalleryItem, reorderGalleryItems } from '@/lib/actions/gallery'
import { buildSortOrderUpdates } from '@/lib/reorder'
import { validateFile, compressImage } from '@/lib/upload-validation'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function GripIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="5" r="1" />
      <circle cx="15" cy="5" r="1" />
      <circle cx="9" cy="12" r="1" />
      <circle cx="15" cy="12" r="1" />
      <circle cx="9" cy="19" r="1" />
      <circle cx="15" cy="19" r="1" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function UploadIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  )
}

function SortableImageTile({ id, imageUrl, onDelete, disabled }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 'auto',
  }

  return (
    <div ref={setNodeRef} style={style} className="relative aspect-square rounded-[8px] overflow-hidden group bg-[#f3f4f6] border border-[#e5e7eb]">
      <img src={imageUrl} alt="" className="w-full h-full object-cover" draggable={false} />
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="absolute top-[6px] left-[6px] size-[28px] flex items-center justify-center rounded-[6px] bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab border-0"
      >
        <GripIcon />
      </button>
      {/* Delete button */}
      <button
        onClick={() => onDelete(id)}
        disabled={disabled}
        className="absolute top-[6px] right-[6px] size-[28px] flex items-center justify-center rounded-[6px] bg-red-500/80 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border-0 disabled:opacity-50"
      >
        <XIcon />
      </button>
    </div>
  )
}

function SpinnerIcon() {
  return (
    <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff7e1b" strokeWidth="2.5" strokeLinecap="round">
      <path d="M12 2a10 10 0 0 1 10 10" />
    </svg>
  )
}

function GalleryGridSection({ title, section, items: initialItems }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [items, setItems] = useState(initialItems)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadCount, setUploadCount] = useState(0)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef(null)

  // Sync items when server re-fetches after router.refresh()
  useEffect(() => {
    setItems(initialItems)
  }, [initialItems])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleFilesSelected = async (files) => {
    const validFiles = []
    for (const file of files) {
      const result = validateFile(file)
      if (!result.valid) {
        toast.error(`${file.name}: ${result.error}`)
      } else {
        validFiles.push(file)
      }
    }
    if (validFiles.length === 0) return

    const compressedFiles = await Promise.all(validFiles.map((f) => compressImage(f)))

    setIsUploading(true)
    setUploadCount(compressedFiles.length)
    try {
      const formData = new FormData()
      formData.set('section', section)
      for (const file of compressedFiles) {
        formData.append('images', file)
      }
      const result = await createGalleryItems(formData)
      if (result.error) {
        toast.error('เกิดข้อผิดพลาด: ' + result.error)
      } else {
        const errors = result.results.filter(r => r.error)
        const successes = result.results.filter(r => r.data)
        if (errors.length > 0) {
          toast.error(`อัปโหลดไม่สำเร็จ ${errors.length} ไฟล์`)
        }
        // Optimistically add uploaded items to local state
        if (successes.length > 0) {
          setItems(prev => [...prev, ...successes.map(r => r.data)])
        }
        router.refresh()
      }
    } catch {
      toast.error('เกิดข้อผิดพลาดในการอัปโหลด')
    } finally {
      setIsUploading(false)
      setUploadCount(0)
    }
  }

  const handleDelete = (id) => {
    if (!confirm('ต้องการลบรูปภาพนี้หรือไม่?')) return
    startTransition(async () => {
      const result = await deleteGalleryItem(id)
      if (result.error) {
        toast.error('เกิดข้อผิดพลาด: ' + result.error)
      } else {
        setItems(prev => prev.filter(item => item.id !== id))
        router.refresh()
      }
    })
  }

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = items.findIndex(i => i.id === active.id)
    const newIndex = items.findIndex(i => i.id === over.id)
    const newItems = arrayMove(items, oldIndex, newIndex)
    setItems(newItems)

    startTransition(async () => {
      const updates = buildSortOrderUpdates(newItems)
      const result = await reorderGalleryItems(updates)
      if (result.error) {
        toast.error('เกิดข้อผิดพลาดในการเรียงลำดับ')
        setItems(items)
      }
    })
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) handleFilesSelected(files)
  }

  const handleDragOverEvent = (e) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  return (
    <div className={`bg-white rounded-[12px] border border-[#e5e7eb] p-[24px] flex flex-col gap-[16px] ${isPending || isUploading ? 'opacity-60 pointer-events-none' : ''}`}>
      <div className="flex items-center justify-between">
        <h2 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[18px] text-[#1f2937] m-0">
          {title}
        </h2>
        <span className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#9ca3af]">
          {items.length} รูปภาพ
        </span>
      </div>

      {/* Upload drop zone */}
      <div
        onDrop={isUploading ? undefined : handleDrop}
        onDragOver={isUploading ? undefined : handleDragOverEvent}
        onDragLeave={isUploading ? undefined : handleDragLeave}
        onClick={isUploading ? undefined : () => fileInputRef.current?.click()}
        className={`flex flex-col items-center justify-center gap-[8px] rounded-[8px] border-2 border-dashed py-[24px] transition-colors ${
          isUploading
            ? 'border-orange bg-[#fff7ed] cursor-wait'
            : isDragOver
              ? 'border-orange bg-[#fff7ed] cursor-pointer'
              : 'border-[#e5e7eb] hover:border-[#d1d5db] bg-[#fafafa] cursor-pointer'
        }`}
      >
        {isUploading ? (
          <>
            <SpinnerIcon />
            <p className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-orange font-medium m-0">
              กำลังอัปโหลด {uploadCount} รูปภาพ...
            </p>
          </>
        ) : (
          <>
            <UploadIcon />
            <p className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#6b7280] m-0">
              ลากไฟล์มาวาง หรือ คลิกเพื่อเลือกรูปภาพ
            </p>
            <p className="font-['IBM_Plex_Sans_Thai'] text-[12px] text-[#9ca3af] m-0">
              รองรับ JPEG, PNG, WebP, GIF (สูงสุด 5MB ต่อไฟล์)
            </p>
          </>
        )}
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

      {/* Image grid */}
      {items.length > 0 ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items.map(i => i.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-3 lg:grid-cols-5 gap-[12px]">
              {items.map(item => (
                <SortableImageTile
                  key={item.id}
                  id={item.id}
                  imageUrl={item.image_url}
                  onDelete={handleDelete}
                  disabled={isPending}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <p className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#9ca3af] text-center py-[20px] m-0">
          ยังไม่มีรูปภาพ
        </p>
      )}
    </div>
  )
}

export default function GalleryPageClient({ homepageItems, aboutItems }) {
  return (
    <div className="flex flex-col gap-[24px]">
      <div className="py-[12px]">
        <h1 className="font-['IBM_Plex_Sans_Thai'] font-bold text-[22px] text-[#1f2937] m-0">
          แกลเลอรี่ (Gallery)
        </h1>
        <p className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#6b7280] mt-[4px] m-0">
          จัดการรูปภาพแกลเลอรี่สำหรับหน้าแรกและหน้าเกี่ยวกับเรา
        </p>
      </div>

      <GalleryGridSection
        title="แกลเลอรี่หน้าแรก (Homepage)"
        section="homepage"
        items={homepageItems}
      />

      <GalleryGridSection
        title="แกลเลอรี่เกี่ยวกับเรา (About)"
        section="about"
        items={aboutItems}
      />
    </div>
  )
}
