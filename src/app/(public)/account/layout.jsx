'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import imgDefaultAvatar from '@/assets/avatar-default.png'

function UserMenuIcon({ color = 'currentColor' }) {
  return (
    <svg className="size-[20px] shrink-0" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" />
      <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" />
    </svg>
  )
}

function FileTextIcon() {
  return (
    <svg className="size-[20px] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" />
      <path d="M14 2V8H20" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
      <path d="M10 9H9H8" />
    </svg>
  )
}

function ChevronRightIcon() {
  return (
    <svg className="size-[12px] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18L15 12L9 6" />
    </svg>
  )
}

function HomeIcon() {
  return (
    <svg className="size-[12px] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" />
      <path d="M9 22V12H15V22" />
    </svg>
  )
}

const accountLinks = [
  { label: 'โปรไฟล์', path: '/account', icon: 'user' },
  { label: 'ใบเสนอราคาของฉัน', path: '/account/quotations', icon: 'file' },
]

export default function AccountLayout({ children }) {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const { createClient } = await import('@/lib/supabase/client')
        const supabase = createClient()
        const { data: { user: authUser } } = await supabase.auth.getUser()
        setUser(authUser)
        if (authUser) {
          const { getCustomerProfile } = await import('@/lib/actions/customer')
          const { data } = await getCustomerProfile()
          setProfile(data)
        }
      } catch (err) {
        console.error('Error loading user:', err)
      }
    }
    load()
  }, [])

  const handleLogout = async () => {
    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  const displayName = profile?.first_name
    ? `${profile.first_name} ${profile.last_name || ''}`.trim()
    : user?.user_metadata?.first_name
      ? `${user.user_metadata.first_name} ${user.user_metadata.last_name || ''}`.trim()
      : user?.email || ''

  const displayEmail = profile?.email || user?.user_metadata?.email || user?.email || ''

  return (
    <>
      {/* Breadcrumb — white bar */}
      <div className="bg-white w-full">
        <nav className="flex items-center gap-[8px] w-full max-w-[1212px] mx-auto px-[20px] lg:px-[16px] py-[8px]">
          <Link href="/" className="flex items-center gap-[4px] no-underline text-black">
            <HomeIcon />
            <span className="font-['IBM_Plex_Sans_Thai'] text-[12px] tracking-[0.06px]">หน้าแรก</span>
          </Link>
          <ChevronRightIcon />
          <span className="font-['IBM_Plex_Sans_Thai'] text-[12px] text-black tracking-[0.06px]">บัญชี Woodsmith</span>
          <ChevronRightIcon />
          <span className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[12px] text-black tracking-[0.06px]">
            {pathname === '/account' ? 'โปรไฟล์' : 'ใบเสนอราคาของฉัน'}
          </span>
        </nav>
      </div>

      {/* Gray background area */}
      <div className="bg-[#f5f4f4] w-full min-h-[60vh]">
        <div className="w-full max-w-[1212px] mx-auto px-[20px] lg:px-[16px] py-[24px] lg:py-[40px]">
          <div className="flex flex-col lg:flex-row gap-[20px]">
            {/* Sidebar card */}
            <aside className="w-full lg:w-[264px] shrink-0 bg-white flex flex-col justify-between" style={{ minHeight: '536px' }}>
              <div className="flex flex-col gap-[20px]">
                {/* User info */}
                <div className="flex flex-col items-center gap-[8px] pt-[16px] px-[16px]">
                  <div className="size-[56px] rounded-full bg-[#e8e3da] overflow-hidden flex items-center justify-center">
                    <img alt="" className="size-full object-cover" src={user?.user_metadata?.avatar_url || imgDefaultAvatar} />
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <span className="font-['IBM_Plex_Sans_Thai'] font-bold text-[14px] text-[#18191f] leading-[24px]">
                      {displayName || '-'}
                    </span>
                    <span className="font-['IBM_Plex_Sans_Thai'] text-[12px] text-[#18191f]">
                      {displayEmail}
                    </span>
                  </div>
                  {user && (
                    <span className="inline-flex items-center px-[5.5px] py-[1px] rounded-[6px] bg-[#ccfbf1] text-[#115e59] text-[10px] font-medium">
                      Verified
                    </span>
                  )}
                </div>

                {/* Menu */}
                <nav className="flex flex-col">
                  {accountLinks.map((link) => {
                    const isActive = pathname === link.path
                    return (
                      <Link
                        key={link.path}
                        href={link.path}
                        className={`flex items-center gap-[10px] p-[16px] no-underline font-['IBM_Plex_Sans_Thai'] text-[15px] leading-[24px] ${
                          isActive
                            ? 'bg-orange/20 text-orange font-semibold'
                            : 'text-black font-medium hover:bg-[#f5f5f5]'
                        }`}
                      >
                        {link.icon === 'user' ? <UserMenuIcon color={isActive ? '#ff7e1b' : 'currentColor'} /> : <FileTextIcon />}
                        {link.label}
                      </Link>
                    )
                  })}
                </nav>
              </div>

              {/* Logout */}
              <div className="border-t border-[#e5e7eb] px-[16px] py-[8px]">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-[6px] w-full py-[8px] bg-transparent border-none cursor-pointer font-['IBM_Plex_Sans_Thai'] font-semibold text-[15px] text-[#18191f] leading-[24px]"
                >
                  ออกจากระบบ
                </button>
              </div>
            </aside>

            {/* Main content card */}
            <main className="flex-1 min-w-0 bg-white">
              {children}
            </main>
          </div>
        </div>
      </div>
    </>
  )
}
