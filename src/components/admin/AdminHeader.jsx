'use client'

import { usePathname } from 'next/navigation'

const pageTitles = {
  '/admin/dashboard': { title: 'จัดการเว็บไซต์/ Manage Website', subtitle: '' },
  '/admin/banner': { title: 'แบนเนอร์ (Banner)', subtitle: '' },
  '/admin/profile': { title: 'โปรไฟล์ (Profile)', subtitle: '' },
  '/admin/blog': { title: 'บทความ (Blog)', subtitle: '' },
  '/admin/video-highlight': { title: 'วิดีโอไฮไลต์ (Video Highlight)', subtitle: '' },
  '/admin/gallery': { title: 'แกลลอรี่ (Gallery)', subtitle: '' },
  '/admin/manual': { title: 'คู่มือการใช้สินค้า (Manual)', subtitle: '' },
  '/admin/about-us': { title: 'เกี่ยวกับเรา (About Us)', subtitle: '' },
  '/admin/branch': { title: 'ช่องทางสาขา (Branch)', subtitle: '' },
  '/admin/faq': { title: 'คำถามที่พบบ่อย (FAQs)', subtitle: '' },
  '/admin/products': { title: 'สินค้า (Product)', subtitle: '' },
  '/admin/quotations': { title: 'จัดการใบเสนอราคา/ Manage Quotation', subtitle: '' },
  '/admin/users': { title: 'จัดการผู้ใช้งาน/ Manage User', subtitle: '' },
  '/admin/account': { title: 'บัญชีของฉัน/ Account Profile', subtitle: '' },
}

export default function AdminHeader({ title, subtitle, children }) {
  const pathname = usePathname()
  const pageInfo = pageTitles[pathname] || {}
  const displayTitle = title || pageInfo.title || 'Dashboard'
  const displaySubtitle = subtitle || pageInfo.subtitle || ''

  return (
    <div className="flex items-center justify-between px-0 py-[12px]">
      <div className="flex flex-col gap-[4px]">
        <h1 className="font-['IBM_Plex_Sans_Thai'] font-bold text-[22px] text-[#1f2937] m-0">
          {displayTitle}
        </h1>
        {displaySubtitle && (
          <p className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#6b7280] m-0">
            {displaySubtitle}
          </p>
        )}
      </div>
      <div className="flex items-center gap-[12px]">
        {children}
        <div className="flex items-center gap-[8px] border border-[#e5e7eb] rounded-[8px] px-[12px] py-[6px]">
          <span className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#4b5563]">Thai (th)</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 4.5L6 7.5L9 4.5" />
          </svg>
        </div>
        <button className="size-[32px] flex items-center justify-center rounded-[8px] hover:bg-gray-100">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
      </div>
    </div>
  )
}
