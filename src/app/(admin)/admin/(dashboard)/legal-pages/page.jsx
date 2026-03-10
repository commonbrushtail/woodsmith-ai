'use client'

import { useState, useEffect, useTransition } from 'react'
import { getLegalPages, updateLegalPage } from '@/lib/actions/legal-pages'
import { useToast } from '@/lib/toast-context'
import RichTextEditor from '@/components/admin/RichTextEditor'

const TABS = [
  { slug: 'terms', label: 'ข้อกำหนดและเงื่อนไข' },
  { slug: 'privacy', label: 'นโยบายความเป็นส่วนตัว' },
  { slug: 'cookies', label: 'นโยบายคุกกี้' },
]

export default function LegalPagesAdmin() {
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('terms')
  const [contents, setContents] = useState({ terms: '', privacy: '', cookies: '' })

  useEffect(() => {
    getLegalPages().then(({ data, error }) => {
      if (data) {
        const map = {}
        data.forEach((p) => { map[p.slug] = p.content || '' })
        setContents((prev) => ({ ...prev, ...map }))
      }
      if (error) toast.error('เกิดข้อผิดพลาด: ' + error)
      setLoading(false)
    })
  }, [toast])

  const handleSave = () => {
    startTransition(async () => {
      const result = await updateLegalPage(activeTab, contents[activeTab])
      if (result.error) {
        toast.error('เกิดข้อผิดพลาด: ' + result.error)
      } else {
        toast.success('บันทึกสำเร็จ')
      }
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#9ca3af]">กำลังโหลด...</span>
      </div>
    )
  }

  return (
    <div className={`flex flex-col gap-0 h-full min-h-0 ${isPending ? 'opacity-60 pointer-events-none' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between py-[12px]">
        <div className="flex items-center gap-[12px]">
          <h1 className="font-['IBM_Plex_Sans_Thai'] font-bold text-[22px] text-[#1f2937] m-0">
            หน้ากฎหมาย (Legal Pages)
          </h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-[4px] border-b border-[#e8eaef] mt-[8px]">
        {TABS.map((tab) => (
          <button
            key={tab.slug}
            type="button"
            onClick={() => setActiveTab(tab.slug)}
            className={`px-[16px] py-[10px] font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium border-0 cursor-pointer transition-colors rounded-t-[8px] ${
              activeTab === tab.slug
                ? 'bg-white text-[#ff7e1b] border-b-2 border-b-[#ff7e1b]'
                : 'bg-transparent text-[#6b7280] hover:text-[#1f2937]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex gap-[24px] mt-[20px] flex-1 min-h-0 overflow-y-auto pb-[32px]">
        <div className="flex-1 flex flex-col gap-[24px] min-w-0">
          <section className="bg-white rounded-[12px] border border-[#e8eaef] p-[24px] flex flex-col gap-[8px]">
            <label className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
              {TABS.find((t) => t.slug === activeTab)?.label}
            </label>
            <RichTextEditor
              key={activeTab}
              content={contents[activeTab]}
              onChange={(val) => setContents((prev) => ({ ...prev, [activeTab]: val }))}
              minHeight={400}
            />
          </section>
        </div>

        {/* Sidebar */}
        <aside className="w-[260px] shrink-0 flex flex-col gap-[16px]">
          <div className="bg-white rounded-[12px] border border-[#e8eaef] p-[20px] flex flex-col gap-[16px]">
            <h3 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[12px] text-[#9ca3af] tracking-[0.8px] uppercase m-0">
              Entry
            </h3>
            <button
              type="button"
              onClick={handleSave}
              disabled={isPending}
              className="w-full flex items-center justify-center px-[16px] py-[8px] rounded-[8px] bg-[#ff7e1b] text-white font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] border-0 cursor-pointer hover:bg-[#e56f15] transition-colors disabled:opacity-50"
            >
              {isPending ? 'กำลังบันทึก...' : 'บันทึก'}
            </button>
          </div>

          <div className="bg-white rounded-[12px] border border-[#e8eaef] p-[20px] flex flex-col gap-[8px]">
            <h3 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[12px] text-[#9ca3af] tracking-[0.8px] uppercase m-0">
              Links
            </h3>
            <a href="/terms" target="_blank" className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#ff7e1b] underline">/terms</a>
            <a href="/privacy" target="_blank" className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#ff7e1b] underline">/privacy</a>
            <a href="/cookies" target="_blank" className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#ff7e1b] underline">/cookies</a>
          </div>
        </aside>
      </div>
    </div>
  )
}
