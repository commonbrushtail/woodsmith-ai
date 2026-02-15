'use client'

import { useState, useTransition, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createVariationGroup, createVariationEntry } from '@/lib/actions/variations'
import { useToast } from '@/lib/toast-context'
import { useFormErrors } from '@/lib/hooks/use-form-errors'
import { validateFile } from '@/lib/upload-validation'

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

export default function VariationCreateClient() {
  const { toast } = useToast()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const formErrors = useFormErrors()

  const [groupName, setGroupName] = useState('')
  const [entries, setEntries] = useState([
    { id: genId(), label: '', imageFile: null, imageUrl: null, previewUrl: null }
  ])

  const addEntry = () => {
    setEntries([...entries, { id: genId(), label: '', imageFile: null, imageUrl: null, previewUrl: null }])
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

  const removeEntry = (id) => {
    setEntries(entries.filter(e => e.id !== id))
  }

  const handleSubmit = async () => {
    // Validate group name
    if (!groupName.trim()) {
      formErrors.setFieldErrors({ name: 'กรุณากรอกชื่อกลุ่มตัวเลือก' })
      toast.error('กรุณากรอกชื่อกลุ่มตัวเลือก')
      return
    }

    startTransition(async () => {
      // Step 1: Create group
      const groupFormData = new FormData()
      groupFormData.append('name', groupName)

      const groupResult = await createVariationGroup(groupFormData)

      if (groupResult.fieldErrors) {
        formErrors.setFieldErrors(groupResult.fieldErrors)
        toast.error('กรุณาตรวจสอบข้อมูล')
        return
      }

      if (groupResult.error) {
        toast.error('เกิดข้อผิดพลาด: ' + groupResult.error)
        return
      }

      const groupId = groupResult.data.id

      // Step 2: Create entries
      const validEntries = entries.filter(e => e.label.trim())

      for (const entry of validEntries) {
        const entryFormData = new FormData()
        entryFormData.append('group_id', groupId)
        entryFormData.append('label', entry.label)

        if (entry.imageFile) {
          entryFormData.append('file', entry.imageFile)
        }

        const entryResult = await createVariationEntry(entryFormData)

        if (entryResult.error) {
          toast.error('เกิดข้อผิดพลาดในการสร้างตัวเลือก: ' + entryResult.error)
          // Continue with other entries (partial success is OK)
        }
      }

      toast.success('สร้างกลุ่มตัวเลือกสำเร็จ')
      router.push('/admin/variations')
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
          กลุ่มตัวเลือกใหม่
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

          {/* Entries section */}
          <section className="bg-white rounded-[12px] border border-[#e8eaef] p-[24px] flex flex-col gap-[16px]">
            <label className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
              ตัวเลือก
            </label>

            {/* Entry list */}
            <div className="flex flex-col gap-[12px]">
              {entries.map((entry) => (
                <div key={entry.id} className="flex items-start gap-[12px]">
                  <EntryImageUpload
                    entry={entry}
                    onImageChange={(file, preview) => updateEntryImage(entry.id, file, preview)}
                    onImageRemove={() => removeEntryImage(entry.id)}
                  />
                  <input
                    type="text"
                    value={entry.label}
                    onChange={(e) => updateEntryLabel(entry.id, e.target.value)}
                    placeholder="กรอกชื่อตัวเลือก"
                    className="flex-1 font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border border-[#e8eaef] rounded-[8px] px-[14px] py-[10px] outline-none transition-all placeholder:text-[#bfbfbf] focus:border-orange focus:ring-1 focus:ring-orange/20"
                  />
                  <button
                    type="button"
                    onClick={() => removeEntry(entry.id)}
                    className="shrink-0 flex items-center justify-center border-0 bg-transparent cursor-pointer p-[4px] hover:bg-[#f3f4f6] rounded-[4px] transition-colors"
                    aria-label="Delete entry"
                  >
                    <TrashIcon />
                  </button>
                </div>
              ))}
            </div>

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
              onClick={handleSubmit}
              disabled={isPending}
              className="w-full px-[16px] py-[10px] rounded-[8px] bg-orange text-white font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] border-0 cursor-pointer hover:bg-[#e56f15] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              บันทึก
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
