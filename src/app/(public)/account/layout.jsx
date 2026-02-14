'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const accountLinks = [
  { label: 'ข้อมูลของฉัน', path: '/account' },
  { label: 'ใบเสนอราคา', path: '/account/quotations' },
]

function UserIcon() {
  return (
    <svg className="size-[20px] shrink-0" viewBox="0 0 24 24" fill="none">
      <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function FileTextIcon() {
  return (
    <svg className="size-[20px] shrink-0" viewBox="0 0 24 24" fill="none">
      <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 2V8H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 13H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 17H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 9H9H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const icons = [UserIcon, FileTextIcon]

export default function AccountLayout({ children }) {
  const pathname = usePathname()

  return (
    <div className="w-full max-w-[1212px] mx-auto px-[20px] lg:px-[16px] py-[24px] lg:py-[40px]">
      <h1 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[24px] lg:text-[32px] text-black mb-[24px] lg:mb-[36px]">
        บัญชีของฉัน
      </h1>
      <div className="flex flex-col lg:flex-row gap-[24px] lg:gap-[36px]">
        {/* Sidebar */}
        <aside className="w-full lg:w-[220px] shrink-0">
          <nav className="flex lg:flex-col gap-[8px]">
            {accountLinks.map((link, i) => {
              const Icon = icons[i]
              const isActive = pathname === link.path
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`flex items-center gap-[10px] px-[16px] py-[10px] no-underline font-['IBM_Plex_Sans_Thai'] font-medium text-[15px] ${
                    isActive
                      ? 'bg-orange/10 text-orange border-l-[3px] border-orange'
                      : 'text-black hover:bg-[#f5f5f5]'
                  }`}
                >
                  <Icon />
                  {link.label}
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  )
}
