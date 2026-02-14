'use client'

import { useState, useRef, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useToast } from '@/lib/toast-context'
import { updateBlogPost } from '@/lib/actions/blog'
import { validateFile, ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE } from '@/lib/upload-validation'

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

export default function BlogEditClient({ post }) {
  const { toast } = useToast()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const fileInputRef = useRef(null)

  const [activeTab, setActiveTab] = useState(post.published ? 'published' : 'draft')
  const [title, setTitle] = useState(post.title || '')
  const [content, setContent] = useState(post.content || '')
  const [recommended, setRecommended] = useState(post.recommended ? 'yes' : 'no')
  const [coverPreview, setCoverPreview] = useState(post.cover_image_url || null)
  const [coverFile, setCoverFile] = useState(null)

  const TITLE_MAX = 120
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0
  const charCount = content.length

  const tabs = [
    { key: 'draft', label: 'DRAFT' },
    { key: 'published', label: 'PUBLISHED' },
  ]

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const check = validateFile(file, { allowedTypes: ALLOWED_IMAGE_TYPES, maxSize: MAX_IMAGE_SIZE })
    if (!check.valid) { toast.error(check.error); e.target.value = ''; return }
    setCoverFile(file)
    setCoverPreview(URL.createObjectURL(file))
  }

  const handleSubmit = (publish) => {
    if (!title.trim()) { toast.error('กรุณากรอกชื่อบทความ'); return }

    startTransition(async () => {
      const formData = new FormData()
      formData.set('title', title)
      formData.set('content', content)
      formData.set('recommended', recommended === 'yes' ? 'true' : 'false')
      formData.set('published', publish ? 'true' : 'false')

      if (coverFile) {
        formData.set('cover_image', coverFile)
      }

      const result = await updateBlogPost(post.id, formData)
      if (result.error) {
        toast.error('เกิดข้อผิดพลาด: ' + result.error)
      } else {
        router.push('/admin/blog')
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
            href="/admin/blog"
            className="flex items-center gap-[6px] font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#6b7280] no-underline hover:text-[#494c4f] transition-colors"
          >
            <ChevronLeftIcon size={16} color="currentColor" />
            <span>กลับ</span>
          </Link>

          <h1 className="font-['IBM_Plex_Sans_Thai'] font-bold text-[22px] text-[#1f2937] m-0">
            บทความ (Blog)
          </h1>

          <span className={`inline-flex items-center px-[10px] py-[2px] rounded-full font-['IBM_Plex_Sans_Thai'] text-[12px] font-medium leading-[1.8] ${
            post.published
              ? 'bg-[#22c55e]/10 text-[#16a34a]'
              : 'bg-[#3b82f6]/10 text-[#3b82f6]'
          }`}>
            {post.published ? 'Published' : 'Draft'}
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
              Image / รูปภาพ
            </label>
            {coverPreview ? (
              <div className="flex flex-col gap-[8px]">
                <div className="relative w-full h-[200px] rounded-[8px] overflow-hidden bg-[#f3f4f6]">
                  <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="self-start flex items-center gap-[6px] text-orange font-['IBM_Plex_Sans_Thai'] font-medium text-[13px] bg-transparent border-0 cursor-pointer p-0 hover:underline"
                >
                  <PlusIcon size={14} color="#ff7e1b" />
                  <span>เปลี่ยนรูปภาพ</span>
                </button>
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
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
          </section>

          {/* Title */}
          <section className="bg-white rounded-[12px] border border-[#e8eaef] p-[24px] flex flex-col gap-[8px]">
            <label htmlFor="blogTitle" className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
              Title / ชื่อบทความ <span className="text-red-500">*</span>
            </label>
            <input
              id="blogTitle"
              type="text"
              value={title}
              onChange={(e) => { if (e.target.value.length <= TITLE_MAX) setTitle(e.target.value) }}
              maxLength={TITLE_MAX}
              placeholder="กรอกชื่อบทความ"
              className="w-full font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border border-[#e8eaef] rounded-[8px] px-[14px] py-[10px] outline-none focus:border-[#ff7e1b] focus:ring-1 focus:ring-[#ff7e1b]/20 transition-all placeholder:text-[#bfbfbf]"
            />
            <span className="font-['IBM_Plex_Sans_Thai'] text-[12px] text-[#9ca3af] self-end">
              {title.length}/{TITLE_MAX}
            </span>
          </section>

          {/* Content */}
          <section className="bg-white rounded-[12px] border border-[#e8eaef] p-[24px] flex flex-col gap-[8px]">
            <label htmlFor="blogContent" className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
              รายละเอียดบทความ
            </label>
            <textarea
              id="blogContent"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="พิมพ์เนื้อหาบทความ..."
              className="w-full min-h-[200px] px-[14px] py-[10px] font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#494c4f] leading-[1.8] border border-[#e8eaef] rounded-[8px] outline-none resize-y bg-white placeholder:text-[#bfbfbf] focus:border-[#ff7e1b] focus:ring-1 focus:ring-[#ff7e1b]/20 transition-all"
            />
            <div className="flex items-center gap-[16px] self-end">
              <span className="font-['IBM_Plex_Sans_Thai'] text-[12px] text-[#9ca3af]">คำ: {wordCount}</span>
              <span className="font-['IBM_Plex_Sans_Thai'] text-[12px] text-[#9ca3af]">ตัวอักษร: {charCount}</span>
            </div>
          </section>

          {/* Recommendation */}
          <section className="bg-white rounded-[12px] border border-[#e8eaef] p-[24px] flex flex-col gap-[8px]">
            <label className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
              กำหนดบทความแนะนำ
            </label>
            <select
              value={recommended}
              onChange={(e) => setRecommended(e.target.value)}
              className="w-full font-['IBM_Plex_Sans_Thai'] text-[14px] border border-[#e8eaef] rounded-[8px] px-[14px] py-[10px] outline-none appearance-none bg-white cursor-pointer focus:border-[#ff7e1b] focus:ring-1 focus:ring-[#ff7e1b]/20 transition-all text-[#1f2937]"
            >
              <option value="no">ไม่แนะนำ</option>
              <option value="yes">แนะนำ</option>
            </select>
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
