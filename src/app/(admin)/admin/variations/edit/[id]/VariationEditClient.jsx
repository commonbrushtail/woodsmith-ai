'use client'

import { useState, useTransition, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  updateVariationGroup,
  createVariationEntry,
  updateVariationEntry,
  deleteVariationEntry,
  deleteVariationGroup,
  reorderVariationEntries,
} from '@/lib/actions/variations'
import { useToast } from '@/lib/toast-context'
import { useFormErrors } from '@/lib/hooks/use-form-errors'
import { validateFile } from '@/lib/upload-validation'
import { buildSortOrderUpdates } from '@/lib/reorder'
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
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function ChevronLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 12L6 8L10 4" />
    </svg>
  )
}

function PlusIcon({ size = 12, color = '#ff7e1b' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  )
}

function ImageIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round">
      <path d="M1.5 1.5L6.5 6.5M6.5 1.5L1.5 6.5" />
    </svg>
  )
}

function GripIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="#9ca3af">
      <circle cx="3" cy="3" r="1" />
      <circle cx="9" cy="3" r="1" />
      <circle cx="3" cy="6" r="1" />
      <circle cx="9" cy="6" r="1" />
      <circle cx="3" cy="9" r="1" />
      <circle cx="9" cy="9" r="1" />
    </svg>
  )
}

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

const inputCls = (hasError) =>
  `w-full font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border rounded-[8px] px-[14px] py-[10px] outline-none transition-all placeholder:text-[#bfbfbf] ${hasError ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/20' : 'border-[#e8eaef] focus:border-orange focus:ring-1 focus:ring-orange/20'}`

function EntryImageUpload({ entry, onImageChange, onImageRemove }) {
  const fileRef = useRef(null)

  const handleFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    const result = validateFile(file)
    if (!result.valid) return
    const previewUrl = URL.createObjectURL(file)
    onImageChange(file, previewUrl)
  }

  const src = entry.previewUrl || entry.imageUrl
  if (src) {
    return (
      <div className="relative w-[48px] h-[48px] rounded-[6px] overflow-hidden bg-[#f3f4f6] shrink-0 group">
        <img src={src} alt="" className="w-full h-full object-cover" draggable={false} />
        <button
          type="button"
          onClick={() => {
            if (entry.previewUrl) URL.revokeObjectURL(entry.previewUrl)
            onImageRemove()
          }}
          className="absolute top-[2px] right-[2px] size-[16px] bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center border-0 cursor-pointer z-10 transition-colors opacity-0 group-hover:opacity-100"
          aria-label="Remove image"
        >
          <XIcon />
        </button>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => fileRef.current?.click()}
      className="w-[48px] h-[48px] rounded-[6px] border border-dashed border-[#d1d5db] bg-[#fafafa] hover:border-orange/50 flex items-center justify-center cursor-pointer shrink-0 transition-colors"
      aria-label="Upload swatch image"
    >
      <ImageIcon />
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFile}
      />
    </button>
  )
}

function SortableEntryRow({ entry, onLabelChange, onImageChange, onImageRemove, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: entry.id })
  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className="flex items-start gap-[12px]">
      <div {...attributes} {...listeners} className="shrink-0 cursor-grab active:cursor-grabbing mt-[10px] p-[4px] hover:bg-[#f3f4f6] rounded-[4px] transition-colors">
        <GripIcon />
      </div>
      <EntryImageUpload
        entry={entry}
        onImageChange={onImageChange}
        onImageRemove={onImageRemove}
      />
      <input
        type="text"
        value={entry.label}
        onChange={(e) => onLabelChange(e.target.value)}
        placeholder="กรอกชื่อตัวเลือก"
        className="flex-1 font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border border-[#e8eaef] rounded-[8px] px-[14px] py-[10px] outline-none transition-all placeholder:text-[#bfbfbf] focus:border-orange focus:ring-1 focus:ring-orange/20"
      />
      <button
        type="button"
        onClick={onDelete}
        className="shrink-0 flex items-center justify-center border-0 bg-transparent cursor-pointer p-[4px] hover:bg-[#f3f4f6] rounded-[4px] transition-colors"
        aria-label="Delete entry"
      >
        <TrashIcon />
      </button>
    </div>
  )
}

export default function VariationEditClient({ group }) {
  const { toast } = useToast()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const formErrors = useFormErrors()

  const originalGroupName = group.name
  const [groupName, setGroupName] = useState(group.name)
  const [entries, setEntries] = useState(() =>
    (group.variation_entries || []).map(e => ({
      id: e.id,
      label: e.label,
      imageUrl: e.image_url,
      imageFile: null,
      previewUrl: null,
      isExisting: true,
      originalLabel: e.label,
      originalImageUrl: e.image_url,
    }))
  )

  // Sensors for drag-and-drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const addEntry = () => {
    setEntries([...entries, {
      id: genId(),
      label: '',
      imageFile: null,
      imageUrl: null,
      previewUrl: null,
      isExisting: false,
    }])
  }

  const updateEntryLabel = (id, label) => {
    setEntries(entries.map(e => e.id === id ? { ...e, label } : e))
  }

  const updateEntryImage = (id, imageFile, previewUrl) => {
    setEntries(entries.map(e => e.id === id ? { ...e, imageFile, previewUrl } : e))
  }

  const removeEntryImage = (id) => {
    setEntries(entries.map(e => e.id === id ? { ...e, imageFile: null, imageUrl: null, previewUrl: null } : e))
  }

  const removeEntry = async (entry) => {
    if (entry.isExisting) {
      // For existing entries, delete immediately from database
      if (!confirm('ต้องการลบตัวเลือกนี้หรือไม่?')) return

      startTransition(async () => {
        const result = await deleteVariationEntry(entry.id)
        if (result.error) {
          toast.error('เกิดข้อผิดพลาด: ' + result.error)
        } else {
          setEntries(entries.filter(e => e.id !== entry.id))
          toast.success('ลบตัวเลือกสำเร็จ')
          router.refresh()
        }
      })
    } else {
      // For new entries, just remove from local state
      setEntries(entries.filter(e => e.id !== entry.id))
    }
  }

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = entries.findIndex((e) => e.id === active.id)
    const newIndex = entries.findIndex((e) => e.id === over.id)
    const reordered = arrayMove(entries, oldIndex, newIndex)

    setEntries(reordered)

    // Only reorder existing entries in database
    const existingEntries = reordered.filter(e => e.isExisting)
    const updates = buildSortOrderUpdates(existingEntries)

    startTransition(async () => {
      const result = await reorderVariationEntries(updates)
      if (result.error) {
        // Revert on error
        setEntries(entries)
        toast.error('เกิดข้อผิดพลาดในการเรียงลำดับ')
      }
    })
  }

  const handleSave = async () => {
    // Validate group name
    if (!groupName.trim()) {
      formErrors.setFieldErrors({ name: 'กรุณากรอกชื่อกลุ่มตัวเลือก' })
      toast.error('กรุณากรอกชื่อกลุ่มตัวเลือก')
      return
    }

    startTransition(async () => {
      // Step 1: Update group name if changed
      if (groupName !== originalGroupName) {
        const groupFormData = new FormData()
        groupFormData.append('name', groupName)

        const groupResult = await updateVariationGroup(group.id, groupFormData)

        if (groupResult.fieldErrors) {
          formErrors.setFieldErrors(groupResult.fieldErrors)
          toast.error('กรุณาตรวจสอบข้อมูล')
          return
        }

        if (groupResult.error) {
          toast.error('เกิดข้อผิดพลาด: ' + groupResult.error)
          return
        }
      }

      // Step 2: Update existing entries with changes
      for (const entry of entries.filter(e => e.isExisting)) {
        const labelChanged = entry.label !== entry.originalLabel
        const imageChanged = entry.imageFile !== null
        const imageRemoved = entry.originalImageUrl && !entry.imageUrl && !entry.imageFile

        if (labelChanged || imageChanged || imageRemoved) {
          const entryFormData = new FormData()

          if (labelChanged) {
            entryFormData.append('label', entry.label)
          }

          if (imageChanged) {
            entryFormData.append('file', entry.imageFile)
          }

          if (imageRemoved) {
            entryFormData.append('remove_image', 'true')
          }

          const entryResult = await updateVariationEntry(entry.id, entryFormData)

          if (entryResult.error) {
            toast.error('เกิดข้อผิดพลาดในการอัปเดตตัวเลือก: ' + entryResult.error)
            // Continue with other entries
          }
        }
      }

      // Step 3: Create new entries
      const newEntries = entries.filter(e => !e.isExisting && e.label.trim())

      for (const entry of newEntries) {
        const entryFormData = new FormData()
        entryFormData.append('group_id', group.id)
        entryFormData.append('label', entry.label)

        if (entry.imageFile) {
          entryFormData.append('file', entry.imageFile)
        }

        const entryResult = await createVariationEntry(entryFormData)

        if (entryResult.error) {
          toast.error('เกิดข้อผิดพลาดในการสร้างตัวเลือก: ' + entryResult.error)
          // Continue with other entries
        }
      }

      toast.success('บันทึกการเปลี่ยนแปลงสำเร็จ')
      router.push('/admin/variations')
    })
  }

  const handleDelete = async () => {
    startTransition(async () => {
      // First call without force flag
      const result = await deleteVariationGroup(group.id)

      if (result.error) {
        toast.error('เกิดข้อผิดพลาด: ' + result.error)
        return
      }

      // If warning, show confirmation dialog
      if (result.warning) {
        const confirmDelete = confirm(`${result.message} ต้องการลบหรือไม่?`)
        if (confirmDelete) {
          const forceResult = await deleteVariationGroup(group.id, { force: true })
          if (forceResult.error) {
            toast.error('เกิดข้อผิดพลาด: ' + forceResult.error)
          } else {
            toast.success('ลบกลุ่มตัวเลือกสำเร็จ')
            router.push('/admin/variations')
          }
        }
      } else {
        // Success without warning
        toast.success('ลบกลุ่มตัวเลือกสำเร็จ')
        router.push('/admin/variations')
      }
    })
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Header */}
      <div className="flex items-center gap-[16px] py-[12px] mb-[20px]">
        <Link
          href="/admin/variations"
          className="flex items-center gap-[6px] text-[#6b7280] hover:text-[#1f2937] font-['IBM_Plex_Sans_Thai'] text-[14px] no-underline transition-colors"
        >
          <ChevronLeftIcon />
          <span>กลับ</span>
        </Link>
        <h1 className="font-['IBM_Plex_Sans_Thai'] font-bold text-[22px] text-[#1f2937] m-0">
          แก้ไขกลุ่มตัวเลือก
        </h1>
      </div>

      {/* Content area */}
      <div className="flex gap-[24px] flex-1 min-h-0">
        {/* Main content (left) */}
        <div className={`flex-1 flex flex-col gap-[20px] overflow-y-auto ${isPending ? 'opacity-60 pointer-events-none' : ''}`}>
          {/* Group name section */}
          <section className="bg-white rounded-[12px] border border-[#e8eaef] p-[24px] flex flex-col gap-[8px]">
            <label className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
              ชื่อกลุ่มตัวเลือก <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => {
                setGroupName(e.target.value)
                formErrors.clearError('name')
              }}
              placeholder="กรอกชื่อกลุ่มตัวเลือก"
              className={inputCls(formErrors.getError('name'))}
            />
            {formErrors.getError('name') && (
              <p className="font-['IBM_Plex_Sans_Thai'] text-[12px] text-red-500 m-0">
                {formErrors.getError('name')}
              </p>
            )}
          </section>

          {/* Entries section with drag-and-drop */}
          <section className="bg-white rounded-[12px] border border-[#e8eaef] p-[24px] flex flex-col gap-[16px]">
            <label className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
              ตัวเลือก
            </label>

            {/* Entry list with drag-and-drop */}
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={entries.map(e => e.id)} strategy={verticalListSortingStrategy}>
                <div className="flex flex-col gap-[12px]">
                  {entries.map((entry) => (
                    <SortableEntryRow
                      key={entry.id}
                      entry={entry}
                      onLabelChange={(label) => updateEntryLabel(entry.id, label)}
                      onImageChange={(file, preview) => updateEntryImage(entry.id, file, preview)}
                      onImageRemove={() => removeEntryImage(entry.id)}
                      onDelete={() => removeEntry(entry)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            {/* Add entry button */}
            <button
              type="button"
              onClick={addEntry}
              className="flex items-center gap-[6px] border-0 bg-transparent cursor-pointer px-0 py-[4px] self-center transition-colors hover:opacity-80"
            >
              <PlusIcon size={12} color="#ff7e1b" />
              <span className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-orange font-medium">
                เพิ่มตัวเลือก
              </span>
            </button>
          </section>
        </div>

        {/* Sidebar (right) */}
        <div className="w-[260px] shrink-0">
          <div className="sticky top-0 bg-white rounded-[12px] border border-[#e8eaef] p-[20px] flex flex-col gap-[16px]">
            <h2 className="font-['IBM_Plex_Sans_Thai'] text-[11px] font-semibold text-[#9ca3af] uppercase tracking-wider m-0">
              Entry
            </h2>
            <button
              type="button"
              onClick={handleSave}
              disabled={isPending}
              className="w-full px-[16px] py-[10px] rounded-[8px] bg-orange text-white font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] border-0 cursor-pointer hover:bg-[#e56f15] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              บันทึก
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isPending}
              className="w-full px-[16px] py-[10px] rounded-[8px] bg-white text-[#ef4444] font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] border border-[#ef4444]/30 cursor-pointer hover:bg-[#fef2f2] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              ลบกลุ่มตัวเลือก
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
