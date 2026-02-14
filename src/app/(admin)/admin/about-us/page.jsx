'use client'

import { useState, useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { getAboutUs, updateAboutUs } from '@/lib/actions/about-us'
import { useToast } from '@/lib/toast-context'
import RichTextEditor from '@/components/admin/RichTextEditor'

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
/*  Main page component                                                */
/* ------------------------------------------------------------------ */

export default function AboutUsPage() {
  const router = useRouter()
  const { toast } = useToast()
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
        toast.error('เกิดข้อผิดพลาด: ' + result.error)
      } else {
        router.refresh()
        toast.success('บันทึกสำเร็จ')
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
            <RichTextEditor
              content={companyDetail}
              onChange={setCompanyDetail}
              minHeight={200}
            />
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
