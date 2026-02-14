'use client'

import { useState, useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { getAboutUs, updateAboutUs } from '@/lib/actions/about-us'

/* ------------------------------------------------------------------ */
/*  SVG icon helpers                                                   */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/*  Rich text toolbar                                                  */
/* ------------------------------------------------------------------ */

function RichTextToolbar() {
  return (
    <div className="flex items-center gap-[2px] bg-[#f9fafb] border-b border-[#e8eaef] px-[12px] py-[8px] flex-wrap">
      {/* Text style dropdown */}
      <div className="flex items-center gap-[4px] border border-[#e8eaef] rounded-[4px] px-[8px] py-[4px] mr-[8px] cursor-pointer bg-white">
        <span className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#494c4f]">Normal</span>
        <ChevronDownIcon />
      </div>

      {/* Bold */}
      <button type="button" className="size-[32px] flex items-center justify-center rounded-[4px] hover:bg-[#f3f4f6] border-0 bg-transparent cursor-pointer" aria-label="Bold">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#494c4f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
          <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
        </svg>
      </button>

      {/* Italic */}
      <button type="button" className="size-[32px] flex items-center justify-center rounded-[4px] hover:bg-[#f3f4f6] border-0 bg-transparent cursor-pointer" aria-label="Italic">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#494c4f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="4" x2="10" y2="4" />
          <line x1="14" y1="20" x2="5" y2="20" />
          <line x1="15" y1="4" x2="9" y2="20" />
        </svg>
      </button>

      {/* Underline */}
      <button type="button" className="size-[32px] flex items-center justify-center rounded-[4px] hover:bg-[#f3f4f6] border-0 bg-transparent cursor-pointer" aria-label="Underline">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#494c4f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3" />
          <line x1="4" y1="21" x2="20" y2="21" />
        </svg>
      </button>

      {/* Strikethrough */}
      <button type="button" className="size-[32px] flex items-center justify-center rounded-[4px] hover:bg-[#f3f4f6] border-0 bg-transparent cursor-pointer" aria-label="Strikethrough">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#494c4f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="4" y1="12" x2="20" y2="12" />
          <path d="M17.5 7.5C17.5 5.01 15.49 3 13 3H11C8.51 3 6.5 5.01 6.5 7.5S8.51 12 11 12h2c2.49 0 4.5 2.01 4.5 4.5S15.49 21 13 21h-2c-2.49 0-4.5-2.01-4.5-4.5" />
        </svg>
      </button>

      <div className="w-px h-[20px] bg-[#e8eaef] mx-[6px]" />

      {/* Align left */}
      <button type="button" className="size-[32px] flex items-center justify-center rounded-[4px] hover:bg-[#f3f4f6] border-0 bg-transparent cursor-pointer" aria-label="Align left">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#494c4f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="17" y1="10" x2="3" y2="10" />
          <line x1="21" y1="6" x2="3" y2="6" />
          <line x1="21" y1="14" x2="3" y2="14" />
          <line x1="17" y1="18" x2="3" y2="18" />
        </svg>
      </button>

      {/* Align center */}
      <button type="button" className="size-[32px] flex items-center justify-center rounded-[4px] hover:bg-[#f3f4f6] border-0 bg-transparent cursor-pointer" aria-label="Align center">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#494c4f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="10" x2="6" y2="10" />
          <line x1="21" y1="6" x2="3" y2="6" />
          <line x1="21" y1="14" x2="3" y2="14" />
          <line x1="18" y1="18" x2="6" y2="18" />
        </svg>
      </button>

      {/* Align right */}
      <button type="button" className="size-[32px] flex items-center justify-center rounded-[4px] hover:bg-[#f3f4f6] border-0 bg-transparent cursor-pointer" aria-label="Align right">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#494c4f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="21" y1="10" x2="7" y2="10" />
          <line x1="21" y1="6" x2="3" y2="6" />
          <line x1="21" y1="14" x2="3" y2="14" />
          <line x1="21" y1="18" x2="7" y2="18" />
        </svg>
      </button>

      <div className="w-px h-[20px] bg-[#e8eaef] mx-[6px]" />

      {/* Bullet list */}
      <button type="button" className="size-[32px] flex items-center justify-center rounded-[4px] hover:bg-[#f3f4f6] border-0 bg-transparent cursor-pointer" aria-label="Bullet list">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#494c4f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <circle cx="4" cy="6" r="1" fill="#494c4f" />
          <circle cx="4" cy="12" r="1" fill="#494c4f" />
          <circle cx="4" cy="18" r="1" fill="#494c4f" />
        </svg>
      </button>

      {/* Numbered list */}
      <button type="button" className="size-[32px] flex items-center justify-center rounded-[4px] hover:bg-[#f3f4f6] border-0 bg-transparent cursor-pointer" aria-label="Numbered list">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#494c4f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="10" y1="6" x2="21" y2="6" />
          <line x1="10" y1="12" x2="21" y2="12" />
          <line x1="10" y1="18" x2="21" y2="18" />
          <text x="2" y="8" fill="#494c4f" stroke="none" fontSize="8" fontWeight="bold">1</text>
          <text x="2" y="14" fill="#494c4f" stroke="none" fontSize="8" fontWeight="bold">2</text>
          <text x="2" y="20" fill="#494c4f" stroke="none" fontSize="8" fontWeight="bold">3</text>
        </svg>
      </button>

      <div className="w-px h-[20px] bg-[#e8eaef] mx-[6px]" />

      {/* Link */}
      <button type="button" className="size-[32px] flex items-center justify-center rounded-[4px] hover:bg-[#f3f4f6] border-0 bg-transparent cursor-pointer" aria-label="Insert link">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#494c4f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      </button>

      {/* Image */}
      <button type="button" className="size-[32px] flex items-center justify-center rounded-[4px] hover:bg-[#f3f4f6] border-0 bg-transparent cursor-pointer" aria-label="Insert image">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#494c4f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      </button>

      {/* Table */}
      <button type="button" className="size-[32px] flex items-center justify-center rounded-[4px] hover:bg-[#f3f4f6] border-0 bg-transparent cursor-pointer" aria-label="Insert table">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#494c4f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <line x1="3" y1="15" x2="21" y2="15" />
          <line x1="9" y1="3" x2="9" y2="21" />
          <line x1="15" y1="3" x2="15" y2="21" />
        </svg>
      </button>

      {/* Code block */}
      <button type="button" className="size-[32px] flex items-center justify-center rounded-[4px] hover:bg-[#f3f4f6] border-0 bg-transparent cursor-pointer" aria-label="Code block">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#494c4f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      </button>

      {/* Quote */}
      <button type="button" className="size-[32px] flex items-center justify-center rounded-[4px] hover:bg-[#f3f4f6] border-0 bg-transparent cursor-pointer" aria-label="Block quote">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#494c4f" stroke="none">
          <path d="M10 8c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h2l-2 3h2.5l2-3c.3-.5.5-1 .5-1.5V10c0-1.1-.9-2-2-2h-3zm-7 0c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h2l-2 3h2.5l2-3c.3-.5.5-1 .5-1.5V10c0-1.1-.9-2-2-2H3z" />
        </svg>
      </button>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main page component                                                */
/* ------------------------------------------------------------------ */

export default function AboutUsPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  /* ---- Form state ---- */
  const [activeTab, setActiveTab] = useState('published')
  const [companyName, setCompanyName] = useState('')
  const [companySlogan, setCompanySlogan] = useState('')
  const [companyDetail, setCompanyDetail] = useState('')
  const [loading, setLoading] = useState(true)

  /* ---- Load existing data ---- */
  useEffect(() => {
    getAboutUs().then(({ data }) => {
      if (data) {
        setCompanyName(data.companyName || '')
        setCompanySlogan(data.companySlogan || '')
        setCompanyDetail(data.companyDetail || '')
      }
      setLoading(false)
    })
  }, [])

  /* ---- Submit handler ---- */
  const handleSubmit = () => {
    startTransition(async () => {
      const formData = new FormData()
      formData.set('companyName', companyName)
      formData.set('companySlogan', companySlogan)
      formData.set('companyDetail', companyDetail)

      const result = await updateAboutUs(formData)
      if (result.error) {
        alert('เกิดข้อผิดพลาด: ' + result.error)
      } else {
        router.refresh()
        alert('บันทึกสำเร็จ')
      }
    })
  }

  /* ---- Derived values ---- */
  const wordCount = companyDetail.trim() ? companyDetail.trim().split(/\s+/).length : 0
  const charCount = companyDetail.length

  const tabs = [
    { key: 'draft', label: 'DRAFT' },
    { key: 'published', label: 'PUBLISHED' },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#9ca3af]">กำลังโหลด...</span>
      </div>
    )
  }

  return (
    <div className={`flex flex-col gap-0 h-full min-h-0 ${isPending ? 'opacity-60 pointer-events-none' : ''}`}>
      {/* ================================================================ */}
      {/*  Header                                                          */}
      {/* ================================================================ */}
      <div className="flex items-center justify-between py-[12px]">
        {/* Left: title + status badge */}
        <div className="flex items-center gap-[12px]">
          <h1 className="font-['IBM_Plex_Sans_Thai'] font-bold text-[22px] text-[#1f2937] m-0">
            {'\u0e40\u0e01\u0e35\u0e48\u0e22\u0e27\u0e01\u0e31\u0e1a\u0e40\u0e23\u0e32 (About Us)'}
          </h1>

          <span className="inline-flex items-center px-[10px] py-[2px] rounded-full border border-[#ff7e1b]/40 bg-[#ff7e1b]/5 font-['IBM_Plex_Sans_Thai'] text-[12px] font-medium text-[#ff7e1b] leading-[1.8]">
            {'\u0e40\u0e1c\u0e22\u0e41\u0e1e\u0e23\u0e48'}
          </span>
        </div>

        {/* Right: locale dropdown + 3-dot menu */}
        <div className="flex items-center gap-[8px]">
          <div className="flex items-center gap-[8px] border border-[#e5e7eb] rounded-[8px] px-[12px] py-[6px] cursor-pointer hover:bg-[#f9fafb]">
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

      {/* ================================================================ */}
      {/*  Tab navigation                                                  */}
      {/* ================================================================ */}
      <div className="flex gap-0 border-b border-[#e5e7eb]" role="tablist" aria-label="Content status tabs">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab.key)}
              className={`
                relative px-[20px] py-[10px] font-['IBM_Plex_Sans_Thai'] font-semibold text-[13px]
                tracking-[0.5px] cursor-pointer bg-transparent border-0 transition-colors
                ${isActive ? 'text-[#ff7e1b]' : 'text-[#9ca3af] hover:text-[#6b7280]'}
              `}
            >
              {tab.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#ff7e1b] rounded-t-full" />
              )}
            </button>
          )
        })}
      </div>

      {/* ================================================================ */}
      {/*  Content body                                                    */}
      {/* ================================================================ */}
      <div className="flex gap-[24px] mt-[20px] flex-1 min-h-0 overflow-y-auto pb-[32px]">
        {/* ---- Main form area ---- */}
        <div className="flex-1 flex flex-col gap-[24px] min-w-0">

          {/* ---------------------------------------------------------- */}
          {/*  1. Company name                                             */}
          {/* ---------------------------------------------------------- */}
          <section className="bg-white rounded-[12px] border border-[#e8eaef] p-[24px] flex flex-col gap-[8px]">
            <label htmlFor="companyName" className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
              {'\u0e0a\u0e37\u0e48\u0e2d\u0e1a\u0e23\u0e34\u0e29\u0e31\u0e17'} <span className="text-red-500">*</span>
            </label>
            <input
              id="companyName"
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder={'\u0e01\u0e23\u0e2d\u0e01\u0e0a\u0e37\u0e48\u0e2d\u0e1a\u0e23\u0e34\u0e29\u0e31\u0e17'}
              className="w-full font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border border-[#e8eaef] rounded-[8px] px-[14px] py-[10px] outline-none focus:border-[#ff7e1b] focus:ring-1 focus:ring-[#ff7e1b]/20 transition-all placeholder:text-[#bfbfbf] bg-white"
            />
          </section>

          {/* ---------------------------------------------------------- */}
          {/*  2. Company slogan / tagline                                  */}
          {/* ---------------------------------------------------------- */}
          <section className="bg-white rounded-[12px] border border-[#e8eaef] p-[24px] flex flex-col gap-[8px]">
            <label htmlFor="companySlogan" className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
              {'\u0e2a\u0e42\u0e25\u0e41\u0e01\u0e19\u0e1a\u0e23\u0e34\u0e29\u0e31\u0e17 / \u0e04\u0e33\u0e2d\u0e18\u0e34\u0e1a\u0e32\u0e22\u0e15\u0e31\u0e27\u0e15\u0e19\u0e41\u0e1a\u0e1a\u0e22\u0e48\u0e2d'} <span className="text-red-500">*</span>
            </label>
            <input
              id="companySlogan"
              type="text"
              value={companySlogan}
              onChange={(e) => setCompanySlogan(e.target.value)}
              placeholder={'\u0e01\u0e23\u0e2d\u0e01\u0e2a\u0e42\u0e25\u0e41\u0e01\u0e19\u0e2b\u0e23\u0e37\u0e2d\u0e04\u0e33\u0e2d\u0e18\u0e34\u0e1a\u0e32\u0e22\u0e2a\u0e31\u0e49\u0e19 \u0e46'}
              className="w-full font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border border-[#e8eaef] rounded-[8px] px-[14px] py-[10px] outline-none focus:border-[#ff7e1b] focus:ring-1 focus:ring-[#ff7e1b]/20 transition-all placeholder:text-[#bfbfbf] bg-white"
            />
          </section>

          {/* ---------------------------------------------------------- */}
          {/*  3. Company detail (rich text editor)                         */}
          {/* ---------------------------------------------------------- */}
          <section className="bg-white rounded-[12px] border border-[#e8eaef] p-[24px] flex flex-col gap-[8px]">
            <label htmlFor="companyDetail" className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
              {'\u0e23\u0e32\u0e22\u0e25\u0e30\u0e40\u0e2d\u0e35\u0e22\u0e14\u0e1a\u0e23\u0e34\u0e29\u0e31\u0e17'} <span className="text-red-500">*</span>
            </label>
            <div className="border border-[#e8eaef] rounded-[8px] overflow-hidden bg-white">
              <RichTextToolbar />
              <textarea
                id="companyDetail"
                value={companyDetail}
                onChange={(e) => setCompanyDetail(e.target.value)}
                placeholder={'\u0e1e\u0e34\u0e21\u0e1e\u0e4c\u0e23\u0e32\u0e22\u0e25\u0e30\u0e40\u0e2d\u0e35\u0e22\u0e14\u0e40\u0e01\u0e35\u0e48\u0e22\u0e27\u0e01\u0e31\u0e1a\u0e1a\u0e23\u0e34\u0e29\u0e31\u0e17...'}
                className="w-full min-h-[200px] px-[16px] py-[14px] font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#494c4f] leading-[1.8] border-0 outline-none resize-y bg-white placeholder:text-[#bfbfbf]"
              />
            </div>
            <div className="flex items-center gap-[16px] self-end">
              <span className="font-['IBM_Plex_Sans_Thai'] text-[12px] text-[#9ca3af]">
                {'\u0e04\u0e33: '}{wordCount}
              </span>
              <span className="font-['IBM_Plex_Sans_Thai'] text-[12px] text-[#9ca3af]">
                {'\u0e15\u0e31\u0e27\u0e2d\u0e31\u0e01\u0e29\u0e23: '}{charCount}
              </span>
            </div>
          </section>
        </div>

        {/* ============================================================ */}
        {/*  Right sidebar - ENTRY panel                                  */}
        {/* ============================================================ */}
        <aside className="w-[260px] shrink-0 flex flex-col gap-[16px]">
          <div className="bg-white rounded-[12px] border border-[#e8eaef] p-[20px] flex flex-col gap-[16px]">
            <h3 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[12px] text-[#9ca3af] tracking-[0.8px] uppercase m-0">
              Entry
            </h3>

            {/* Publish button + dots menu */}
            <div className="flex items-center gap-[8px]">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isPending}
                className="flex-1 flex items-center justify-center gap-[6px] px-[16px] py-[8px] rounded-[8px] bg-[#ff7e1b] text-white font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] border-0 cursor-pointer hover:bg-[#e56f15] transition-colors disabled:opacity-50"
              >
                {isPending ? 'กำลังบันทึก...' : 'บันทึก'}
              </button>
              <button
                type="button"
                className="size-[36px] flex items-center justify-center rounded-[8px] border border-[#e8eaef] bg-white cursor-pointer hover:bg-[#f9fafb]"
                aria-label="Publish options"
              >
                <DotsIcon size={16} color="#6b7280" />
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
