'use client'

import { useState, useRef, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useToast } from '@/lib/toast-context'
import { updateManual } from '@/lib/actions/manuals'
import { validateFile, ALLOWED_IMAGE_TYPES, ALLOWED_PDF_TYPES, MAX_IMAGE_SIZE, MAX_PDF_SIZE } from '@/lib/upload-validation'

function ChevronLeftIcon({ size = 16, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 12L6 8L10 4" />
    </svg>
  )
}

function ChevronDownIcon({ size = 12, color = '#6b7280' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 4.5L6 7.5L9 4.5" />
    </svg>
  )
}

function PlusIcon({ size = 18, color = '#ff7e1b' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

function DotsIcon({ size = 18, color = '#6b7280' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="19" r="1" />
    </svg>
  )
}

function FileIcon({ size = 20, color = '#ff7e1b' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  )
}

function TrashIcon({ size = 14, color = '#ef4444' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  )
}

export default function ManualEditClient({ manual }) {
  const { toast } = useToast()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const coverInputRef = useRef(null)
  const pdfInputRef = useRef(null)

  const [activeTab, setActiveTab] = useState(manual.published ? 'published' : 'draft')
  const [title, setTitle] = useState(manual.title || '')
  const [coverPreview, setCoverPreview] = useState(manual.cover_image_url || null)
  const [coverFile, setCoverFile] = useState(null)
  const [pdfFile, setPdfFile] = useState(manual.file_url ? { name: manual.file_url.split('/').pop(), url: manual.file_url } : null)
  const [pdfNewFile, setPdfNewFile] = useState(null)

  const tabs = [
    { key: 'draft', label: 'DRAFT' },
    { key: 'published', label: 'PUBLISHED' },
  ]

  const TITLE_MAX = 120

  const handleCoverSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const check = validateFile(file, { allowedTypes: ALLOWED_IMAGE_TYPES, maxSize: MAX_IMAGE_SIZE })
    if (!check.valid) { toast.error(check.error); e.target.value = ''; return }
    setCoverFile(file)
    setCoverPreview(URL.createObjectURL(file))
  }

  const handlePdfSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const check = validateFile(file, { allowedTypes: ALLOWED_PDF_TYPES, maxSize: MAX_PDF_SIZE })
    if (!check.valid) { toast.error(check.error); e.target.value = ''; return }
    setPdfNewFile(file)
    setPdfFile({ name: file.name, size: (file.size / 1024).toFixed(1) })
  }

  const handleSubmit = (publish) => {
    startTransition(async () => {
      const formData = new FormData()
      formData.set('title', title)
      formData.set('published', publish ? 'true' : 'false')
      if (pdfNewFile) {
        formData.set('file', pdfNewFile)
      }
      if (coverFile) {
        formData.set('cover_image', coverFile)
      }

      const result = await updateManual(manual.id, formData)
      if (result.error) {
        toast.error('เกิดข้อผิดพลาด: ' + result.error)
      } else {
        router.push('/admin/manual')
        router.refresh()
      }
    })
  }

  return (
    <div className={`flex flex-col gap-0 h-full min-h-0 ${isPending ? 'opacity-60 pointer-events-none' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between py-[12px]">
        <div className="flex items-center gap-[12px]">
          <Link
            href="/admin/manual"
            className="flex items-center gap-[6px] font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#6b7280] no-underline hover:text-[#494c4f] transition-colors"
          >
            <ChevronLeftIcon size={16} color="currentColor" />
            <span>กลับ</span>
          </Link>

          <h1 className="font-['IBM_Plex_Sans_Thai'] font-bold text-[22px] text-[#1f2937] m-0">
            คู่มือการใช้สินค้า (Manual)
          </h1>

          <span className={`inline-flex items-center px-[10px] py-[2px] rounded-full font-['IBM_Plex_Sans_Thai'] text-[12px] font-medium leading-[1.8] ${
            manual.published
              ? 'bg-[#22c55e]/10 text-[#16a34a]'
              : 'bg-[#3b82f6]/10 text-[#3b82f6]'
          }`}>
            {manual.published ? 'Published' : 'Draft'}
          </span>
        </div>

        <div className="flex items-center gap-[8px]">
          <div className="flex items-center gap-[8px] border border-[#e5e7eb] rounded-[8px] px-[12px] py-[6px] cursor-pointer hover:bg-[#f9fafb] bg-white transition-colors">
            <span className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#4b5563]">Thai (th)</span>
            <ChevronDownIcon />
          </div>
          <button
            type="button"
            className="size-[32px] flex items-center justify-center rounded-[8px] hover:bg-gray-100 cursor-pointer bg-transparent border-0"
            aria-label="More options"
          >
            <DotsIcon size={18} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-[#e5e7eb]" role="tablist">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab.key)}
              className={`relative px-[20px] py-[10px] font-['IBM_Plex_Sans_Thai'] font-semibold text-[13px] tracking-[0.5px] cursor-pointer bg-transparent border-0 transition-colors ${
                isActive ? 'text-[#ff7e1b]' : 'text-[#9ca3af] hover:text-[#6b7280]'
              }`}
            >
              {tab.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#ff7e1b] rounded-t-full" />
              )}
            </button>
          )
        })}
      </div>

      {/* Content body */}
      <div className="flex gap-[24px] mt-[20px] flex-1 min-h-0 overflow-y-auto pb-[32px]">
        <div className="flex-1 flex flex-col gap-[24px] min-w-0">
          {/* Cover Image */}
          <section className="bg-white rounded-[12px] border border-[#e8eaef] p-[24px] flex flex-col gap-[16px]">
            <label className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
              Image / รูปภาพปก
            </label>
            {coverPreview ? (
              <div className="flex flex-col gap-[8px]">
                <div className="relative w-full h-[200px] rounded-[8px] overflow-hidden bg-[#f3f4f6]">
                  <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
                </div>
                <button
                  type="button"
                  onClick={() => coverInputRef.current?.click()}
                  className="self-start flex items-center gap-[6px] text-orange font-['IBM_Plex_Sans_Thai'] font-medium text-[13px] bg-transparent border-0 cursor-pointer p-0 hover:underline"
                >
                  <PlusIcon size={14} color="#ff7e1b" />
                  <span>เปลี่ยนรูปปก</span>
                </button>
              </div>
            ) : (
              <div
                onClick={() => coverInputRef.current?.click()}
                className="border-2 border-dashed border-[#e5e7eb] rounded-[8px] bg-[#fafafa] flex flex-col items-center justify-center gap-[8px] py-[32px] px-[16px] cursor-pointer hover:border-orange/50 transition-colors"
              >
                <div className="size-[40px] rounded-full bg-orange/10 flex items-center justify-center">
                  <PlusIcon size={20} color="#ff7e1b" />
                </div>
                <p className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#9ca3af] text-center leading-[1.5] m-0">
                  Click to add a cover image
                </p>
              </div>
            )}
            <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverSelect} />
          </section>

          {/* Title */}
          <section className="bg-white rounded-[12px] border border-[#e8eaef] p-[24px] flex flex-col gap-[8px]">
            <label htmlFor="manualTitle" className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
              Title / ชื่อคู่มือ
            </label>
            <input
              id="manualTitle"
              type="text"
              value={title}
              onChange={(e) => {
                if (e.target.value.length <= TITLE_MAX) setTitle(e.target.value)
              }}
              maxLength={TITLE_MAX}
              placeholder="กรอกชื่อคู่มือ"
              className="w-full font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border border-[#e8eaef] rounded-[8px] px-[14px] py-[10px] outline-none focus:border-[#ff7e1b] focus:ring-1 focus:ring-[#ff7e1b]/20 transition-all placeholder:text-[#bfbfbf]"
            />
            <span className="font-['IBM_Plex_Sans_Thai'] text-[12px] text-[#9ca3af] self-end">
              {title.length}/{TITLE_MAX}
            </span>
          </section>

          {/* PDF File */}
          <section className="bg-white rounded-[12px] border border-[#e8eaef] p-[24px] flex flex-col gap-[16px]">
            <label className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
              แนบไฟล์คู่มือ PDF
            </label>

            {pdfFile ? (
              <div className="flex items-center gap-[12px] border border-[#e8eaef] rounded-[8px] px-[16px] py-[12px] bg-[#fafafa]">
                <div className="size-[36px] rounded-[6px] bg-[#ff7e1b]/10 flex items-center justify-center shrink-0">
                  <FileIcon size={18} color="#ff7e1b" />
                </div>
                <div className="flex flex-col gap-[2px] flex-1 min-w-0">
                  <span className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#1f2937] font-medium truncate">
                    {pdfFile.name}
                  </span>
                  {pdfFile.size && (
                    <span className="font-['IBM_Plex_Sans_Thai'] text-[11px] text-[#9ca3af]">
                      {pdfFile.size} KB
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => pdfInputRef.current?.click()}
                  className="font-['IBM_Plex_Sans_Thai'] text-[12px] text-orange bg-transparent border-0 cursor-pointer hover:underline"
                >
                  เปลี่ยนไฟล์
                </button>
              </div>
            ) : (
              <div
                onClick={() => pdfInputRef.current?.click()}
                className="border-2 border-dashed border-[#e5e7eb] rounded-[8px] bg-[#fafafa] flex flex-col items-center justify-center gap-[8px] py-[32px] px-[16px] cursor-pointer hover:border-orange/50 transition-colors"
              >
                <div className="size-[40px] rounded-full bg-orange/10 flex items-center justify-center">
                  <PlusIcon size={20} color="#ff7e1b" />
                </div>
                <p className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#9ca3af] text-center leading-[1.5] m-0">
                  Click to upload a PDF file
                </p>
              </div>
            )}
            <input ref={pdfInputRef} type="file" accept=".pdf,application/pdf" className="hidden" onChange={handlePdfSelect} />
          </section>
        </div>

        {/* Right sidebar */}
        <aside className="w-[260px] shrink-0 flex flex-col gap-[16px]">
          <div className="bg-white rounded-[12px] border border-[#e8eaef] p-[20px] flex flex-col gap-[16px]">
            <h3 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[12px] text-[#9ca3af] tracking-[0.8px] uppercase m-0">
              Entry
            </h3>

            <div className="flex items-center gap-[8px]">
              <button
                type="button"
                onClick={() => handleSubmit(true)}
                disabled={isPending}
                className="flex-1 flex items-center justify-center gap-[6px] px-[16px] py-[8px] rounded-[8px] bg-[#ff7e1b] text-white font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] border-0 cursor-pointer hover:bg-[#e56f15] transition-colors disabled:opacity-50"
              >
                {isPending ? 'กำลังบันทึก...' : 'เผยแพร่'}
              </button>
            </div>

            <button
              type="button"
              onClick={() => handleSubmit(false)}
              disabled={isPending}
              className="w-full flex items-center justify-center px-[16px] py-[8px] rounded-[8px] bg-white text-[#374151] font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] border border-[#e8eaef] cursor-pointer hover:bg-[#f9fafb] transition-colors disabled:opacity-50"
            >
              บันทึก
            </button>
          </div>
        </aside>
      </div>
    </div>
  )
}
