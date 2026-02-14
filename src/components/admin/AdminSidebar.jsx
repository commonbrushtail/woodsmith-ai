'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const iconSidebar = [
  { icon: 'book-open', section: 'content', paths: ['/admin/banner', '/admin/profile', '/admin/blog', '/admin/video-highlight', '/admin/gallery', '/admin/manual', '/admin/about-us', '/admin/branch', '/admin/faq', '/admin/products'] },
  { icon: 'file-text', section: 'quotation', paths: ['/admin/quotations'] },
  { icon: 'users', section: 'users', paths: ['/admin/users', '/admin/account'] },
]

const contentMenuItems = [
  { label: 'แบนเนอร์ (Banner)', path: '/admin/banner' },
  { label: 'โปรไฟล์ (Profile)', path: '/admin/profile' },
  { label: 'บทความ (Blog)', path: '/admin/blog' },
  { label: 'วิดีโอไฮไลต์ (Video Highlight)', path: '/admin/video-highlight' },
  { label: 'แกลลอรี่ (Gallery)', path: '/admin/gallery' },
  { label: 'คู่มือการใช้สินค้า (Manual)', path: '/admin/manual' },
  { label: 'เกี่ยวกับเรา (About Us)', path: '/admin/about-us' },
  { label: 'ช่องทางสาขา (Branch)', path: '/admin/branch' },
  { label: 'คำถามที่พบบ่อย (FAQs)', path: '/admin/faq' },
  { label: 'สินค้า (Product)', path: '/admin/products' },
]

const quotationMenuItems = [
  { label: 'จัดการใบเสนอราคา (Quotation)', path: '/admin/quotations' },
]

const usersMenuItems = [
  { label: 'จัดการผู้ใช้งาน (Users)', path: '/admin/users' },
  { label: 'บัญชีของฉัน (Account)', path: '/admin/account' },
]

const sectionTitles = {
  content: 'จัดการเนื้อหา',
  quotation: 'จัดการใบเสนอราคา',
  users: 'จัดการผู้ใช้งาน',
}

const sectionMenus = {
  content: contentMenuItems,
  quotation: quotationMenuItems,
  users: usersMenuItems,
}

function BookOpenIcon({ active }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? '#ff7e1b' : '#6b7280'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  )
}

function FileTextIcon({ active }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? '#ff7e1b' : '#6b7280'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  )
}

function UsersIcon({ active }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? '#ff7e1b' : '#6b7280'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

const iconComponents = {
  'book-open': BookOpenIcon,
  'file-text': FileTextIcon,
  'users': UsersIcon,
}

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const activeSection = iconSidebar.find(s => s.paths.some(p => pathname.startsWith(p)))?.section || 'content'
  const menuItems = sectionMenus[activeSection] || contentMenuItems

  return (
    <div className="flex h-full shrink-0">
      {/* Icon sidebar - 78px */}
      <div className="bg-white w-[78px] flex flex-col items-center justify-between py-[16px] border-r border-[#e5e7eb]">
        <div className="flex flex-col items-center gap-[20px]">
          <Link href="/admin/dashboard">
            <img alt="WoodSmith" className="h-[48px] w-[38px] object-cover" src="/favicon.png" />
          </Link>
          <div className="w-full h-px bg-[#e5e7eb]" />
          <div className="flex flex-col gap-[10px]">
            {iconSidebar.map((item) => {
              const IconComp = iconComponents[item.icon]
              const isActive = item.section === activeSection
              return (
                <Link
                  key={item.section}
                  href={item.paths[0]}
                  className={`flex items-center justify-center p-[10px] rounded-[8px] ${isActive ? 'bg-orange/10' : 'hover:bg-gray-100'}`}
                >
                  <IconComp active={isActive} />
                </Link>
              )
            })}
          </div>
        </div>
        <div className="flex flex-col items-center gap-[16px]">
          <div className="w-full h-px bg-[#e5e7eb]" />
          <button
            onClick={async () => {
              const supabase = createClient()
              await supabase.auth.signOut()
              router.push('/login')
              router.refresh()
            }}
            className="bg-transparent border-none cursor-pointer p-[8px] rounded-[8px] hover:bg-gray-100"
            title="ออกจากระบบ"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16,17 21,12 16,7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
          <div className="size-[40px] rounded-full bg-orange flex items-center justify-center text-white font-semibold text-[16px]">
            A
          </div>
        </div>
      </div>

      {/* Submenu panel - 241px */}
      <div className="bg-[#f5f4f4] w-[241px] border-r border-[#e5e7eb] flex flex-col gap-[20px] py-[20px]">
        <div className="flex flex-col gap-[12px] pl-[16px]">
          <p className="font-['IBM_Plex_Sans_Thai'] font-bold text-[18px] text-[#1f2937] tracking-[0.09px]">
            {sectionTitles[activeSection]}
          </p>
          <div className="h-[3px] w-[33px] bg-orange rounded-full" />
        </div>
        <div className="flex flex-col gap-[4px] px-[8px]">
          {menuItems.map((item) => {
            const isActive = pathname === item.path || pathname.startsWith(item.path + '/')
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`block px-[12px] py-[8px] rounded-[8px] font-['IBM_Plex_Sans_Thai'] text-[14px] no-underline transition-colors ${
                  isActive
                    ? 'text-orange border-b-2 border-orange font-medium'
                    : 'text-[#4b5563] hover:bg-white hover:text-[#1f2937]'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
