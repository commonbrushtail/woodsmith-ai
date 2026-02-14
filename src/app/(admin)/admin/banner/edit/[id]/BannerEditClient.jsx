'use client'

import { useState, useTransition, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useToast } from '@/lib/toast-context'
import { updateBanner } from '@/lib/actions/banners'
import { validateFile, ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE } from '@/lib/upload-validation'

function PlusIcon({ size = 18, color = '#ff7e1b' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

function TrashIcon({ size = 18, color = '#6b7280' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  )
}

function ArrowLeftIcon({ size = 20, color = '#6b7280' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
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

function DotsIcon({ size = 18, color = '#6b7280' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="19" r="1" />
    </svg>
  )
}

export default function BannerEditClient({ banner }) {
  const { toast } = useToast()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [linkUrl, setLinkUrl] = useState(banner.link_url || '')
  const [imagePreview, setImagePreview] = useState(banner.image_url || null)
  const [selectedFile, setSelectedFile] = useState(null)
  const fileInputRef = useRef(null)

  const [activeTab, setActiveTab] = useState(
    banner.status === 'active' ? 'published' : 'draft'
  )

  const tabs = [
    { key: 'draft', label: 'DRAFT' },
    { key: 'published', label: 'PUBLISHED' },
  ]

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const check = validateFile(file, { allowedTypes: ALLOWED_IMAGE_TYPES, maxSize: MAX_IMAGE_SIZE })
    if (!check.valid) { toast.error(check.error); e.target.value = ''; return }
    setSelectedFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleRemoveImage = () => {
    setSelectedFile(null)
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSave = (publish) => {
    startTransition(async () => {
      const formData = new FormData()
      formData.set('link_url', linkUrl)
      formData.set('status', publish ? 'active' : 'inactive')
      if (selectedFile) {
        formData.set('file', selectedFile)
      }
      const result = await updateBanner(banner.id, formData)
      if (result.error) {
        toast.error('เกิดข้อผิดพลาด: ' + result.error)
      } else {
        router.push('/admin/banner')
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
            href="/admin/banner"
            className="size-[32px] flex items-center justify-center rounded-[8px] hover:bg-gray-100 cursor-pointer no-underline"
          >
            <ArrowLeftIcon size={20} color="#6b7280" />
          </Link>

          <h1 className="font-['IBM_Plex_Sans_Thai'] font-bold text-[22px] text-[#1f2937] m-0">
            {'แบนเนอร์'} (Banner)
          </h1>

          <span className={`inline-flex items-center px-[10px] py-[2px] rounded-full border font-['IBM_Plex_Sans_Thai'] text-[12px] font-medium leading-[1.8] ${
            banner.status === 'active'
              ? 'border-orange/40 bg-orange/5 text-orange'
              : 'border-[#d1d5db] bg-gray-50 text-[#6b7280]'
          }`}>
            {banner.status === 'active' ? 'เผยแพร่' : 'ฉบับร่าง'}
          </span>
        </div>

        <div className="flex items-center gap-[8px]">
          <div className="flex items-center gap-[8px] border border-[#e5e7eb] rounded-[8px] px-[12px] py-[6px] cursor-pointer hover:bg-[#f9fafb]">
            <span className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#4b5563]">Thai (th)</span>
            <ChevronDownIcon />
          </div>
          <button
            type="button"
            className="size-[32px] flex items-center justify-center rounded-[8px] hover:bg-gray-100 cursor-pointer bg-transparent border-none"
            aria-label="More options"
          >
            <DotsIcon size={18} />
          </button>
        </div>
      </div>

      {/* Tab navigation */}
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
                isActive ? 'text-orange' : 'text-[#9ca3af] hover:text-[#6b7280]'
              }`}
            >
              {tab.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-orange rounded-t-full" />
              )}
            </button>
          )
        })}
      </div>

      {/* Content body */}
      <div className="flex gap-[24px] mt-[20px] flex-1 min-h-0 overflow-y-auto pb-[32px]">
        {/* Main content area */}
        <div className="flex-1 flex flex-col gap-[32px] min-w-0">
          {/* Banner : Image section */}
          <section className="bg-white rounded-[12px] border border-[#e5e7eb] p-[24px] flex flex-col gap-[20px]">
            <h2 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[16px] text-[#1f2937] m-0">
              Banner : Image
            </h2>

            <div className="flex flex-col gap-[8px]">
              <label className="font-['IBM_Plex_Sans_Thai'] font-medium text-[13px] text-[#374151]">
                Image / {'รูปภาพ'}
              </label>

              {imagePreview ? (
                <div className="flex flex-col gap-[8px]">
                  <div className="relative w-full h-[180px] rounded-[8px] overflow-hidden bg-[#8b7355]">
                    <img src={imagePreview} alt="Banner preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex items-center gap-[4px]">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="size-[32px] flex items-center justify-center rounded-[4px] hover:bg-[#f0f0f0] cursor-pointer bg-transparent border-none"
                      aria-label="Replace image"
                    >
                      <PlusIcon size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="size-[32px] flex items-center justify-center rounded-[4px] hover:bg-[#f0f0f0] cursor-pointer bg-transparent border-none"
                      aria-label="Remove image"
                    >
                      <TrashIcon size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#e5e7eb] rounded-[8px] bg-[#fafafa] flex flex-col items-center justify-center gap-[8px] py-[32px] px-[16px] cursor-pointer hover:border-orange/50 transition-colors"
                >
                  <div className="size-[40px] rounded-full bg-orange/10 flex items-center justify-center">
                    <PlusIcon size={20} color="#ff7e1b" />
                  </div>
                  <p className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#9ca3af] text-center leading-[1.5] m-0">
                    Click to add an asset or drag and drop one in this area
                  </p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>

            {/* Link URL field */}
            <div className="flex flex-col gap-[8px]">
              <label className="font-['IBM_Plex_Sans_Thai'] font-medium text-[13px] text-[#374151]">
                Link URL
              </label>
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-[12px] py-[8px] border border-[#e5e7eb] rounded-[8px] font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#374151] outline-none focus:border-orange transition-colors placeholder:text-[#9ca3af]"
              />
            </div>
          </section>
        </div>

        {/* Right sidebar (ENTRY panel) */}
        <aside className="w-[260px] shrink-0 flex flex-col gap-[16px]">
          <div className="bg-white rounded-[12px] border border-[#e5e7eb] p-[20px] flex flex-col gap-[16px]">
            <h3 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[12px] text-[#9ca3af] tracking-[0.8px] uppercase m-0">
              Entry
            </h3>

            {/* Publish button */}
            <div className="flex items-center gap-[8px]">
              <button
                type="button"
                onClick={() => handleSave(true)}
                disabled={isPending}
                className="flex-1 flex items-center justify-center gap-[6px] px-[16px] py-[8px] rounded-[8px] bg-orange text-white font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] border-0 cursor-pointer hover:bg-orange/90 transition-colors disabled:opacity-50"
              >
                {isPending ? 'กำลังบันทึก...' : 'เผยแพร่'}
              </button>
            </div>

            {/* Save as draft button */}
            <button
              type="button"
              onClick={() => handleSave(false)}
              disabled={isPending}
              className="w-full flex items-center justify-center px-[16px] py-[8px] rounded-[8px] bg-white text-[#374151] font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] border border-[#e5e7eb] cursor-pointer hover:bg-[#f9fafb] transition-colors disabled:opacity-50"
            >
              {'บันทึก'}
            </button>
          </div>
        </aside>
      </div>
    </div>
  )
}
