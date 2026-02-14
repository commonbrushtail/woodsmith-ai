'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import imgFavicon from '../assets/6727cae5f32ea2c35a94792ae9603addc6300612.png'
import imgUnion from '../assets/4e24c29ef271a3dd1cdfea028b3abb8fceed5119.svg'
import imgMenu1 from '../assets/ef18b0c8e480616ebef0c37dee581ff94d0c7c97.svg'
import SearchOverlay from './SearchOverlay'
import LoginModal from './LoginModal'

const menuItems = [
  { label: 'หน้าแรก', path: '/' },
  { label: 'เกี่ยวกับเรา', path: '/about' },
  { label: 'สินค้าของเรา', path: '/products' },
  { label: 'ค้นหาสาขา', path: '/branches' },
  { label: 'บทความ', path: '/blog' },
  { label: 'คู่มือ', path: '/manual' },
  { label: 'ไฮไลท์', path: '/highlight' },
  { label: 'FAQ', path: '/faq' },
]

function MobileMenu({ isOpen, onClose, user, onLogout }) {
  const pathname = usePathname()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[60] lg:hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute right-0 top-0 bottom-0 w-[280px] bg-white shadow-xl flex flex-col">
        <div className="flex items-center justify-between p-[16px] border-b border-[#e5e7eb]">
          <p className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[18px] text-black">เมนู</p>
          <button onClick={onClose} className="size-[24px] flex items-center justify-center text-black text-[20px]">✕</button>
        </div>
        <div className="flex flex-col p-[16px] gap-[20px]">
          {menuItems.map((item) => (
            <Link key={item.label} href={item.path} onClick={onClose} className={`font-['IBM_Plex_Sans_Thai'] font-semibold text-[16px] no-underline ${pathname === item.path ? 'text-orange' : 'text-black'}`}>
              {item.label}
            </Link>
          ))}
          {user && (
            <>
              <div className="h-px bg-[#e5e7eb]" />
              <Link href="/account" onClick={onClose} className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[16px] text-black no-underline">
                บัญชีของฉัน
              </Link>
              <Link href="/account/quotations" onClick={onClose} className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[16px] text-black no-underline">
                ใบเสนอราคา
              </Link>
              <button onClick={() => { onLogout(); onClose() }} className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[16px] text-left text-[#dc2626] bg-transparent border-none p-0 cursor-pointer">
                ออกจากระบบ
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function UserDropdown({ user, onLogout, onClose }) {
  const displayName = user.user_metadata?.display_name || user.phone || user.email || 'ผู้ใช้'

  return (
    <div className="absolute right-0 top-full mt-[8px] bg-white border border-[#e5e7eb] shadow-lg min-w-[200px] z-50">
      <div className="px-[16px] py-[12px] border-b border-[#e5e7eb]">
        <p className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[14px] text-black truncate">
          {displayName}
        </p>
      </div>
      <div className="flex flex-col">
        <Link href="/account" onClick={onClose} className="px-[16px] py-[10px] font-['IBM_Plex_Sans_Thai'] text-[14px] text-black no-underline hover:bg-[#f5f5f5]">
          บัญชีของฉัน
        </Link>
        <Link href="/account/quotations" onClick={onClose} className="px-[16px] py-[10px] font-['IBM_Plex_Sans_Thai'] text-[14px] text-black no-underline hover:bg-[#f5f5f5]">
          ใบเสนอราคา
        </Link>
        <button onClick={onLogout} className="px-[16px] py-[10px] font-['IBM_Plex_Sans_Thai'] text-[14px] text-left text-[#dc2626] bg-transparent border-none cursor-pointer hover:bg-[#f5f5f5]">
          ออกจากระบบ
        </button>
      </div>
    </div>
  )
}

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    let subscription
    async function initAuth() {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()

      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)

      const { data: { subscription: sub } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null)
        if (_event === 'SIGNED_IN') {
          setLoginOpen(false)
        }
      })
      subscription = sub
    }
    initAuth()
    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!dropdownOpen) return
    const handleClick = () => setDropdownOpen(false)
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [dropdownOpen])

  const handleLogout = async () => {
    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    setDropdownOpen(false)
    router.refresh()
  }

  const userInitial = user
    ? (user.user_metadata?.display_name?.[0] || user.phone?.[0] || 'U').toUpperCase()
    : null

  return (
    <>
      <div className="bg-white w-full sticky top-0 z-50 border-b border-[#e5e7eb] lg:border-b-0">
        <div className="max-w-[1212px] mx-auto w-full flex items-center justify-between px-[16px] py-[12px] h-[60px] lg:h-auto">
          <div className="flex gap-[40px] items-center">
            <Link href="/">
              <img alt="WoodSmith" className="h-[48px] w-[38px] lg:h-[60px] lg:w-[47px] object-cover" src={imgFavicon} />
            </Link>
            {/* Desktop nav menu */}
            <div className="hidden lg:flex gap-[36px] items-start">
              {menuItems.map((item) => (
                <Link key={item.label} href={item.path} className="flex flex-col gap-px items-start no-underline">
                  <p className={`font-['IBM_Plex_Sans_Thai'] font-semibold text-[16px] ${pathname === item.path ? 'text-orange' : 'text-black'}`}>
                    {item.label}
                  </p>
                  {pathname === item.path && <div className="bg-orange h-[2px] w-full" />}
                </Link>
              ))}
            </div>
          </div>
          {/* Right side actions */}
          <div className="flex gap-[24px] items-center">
            {/* Mobile: Login/User button */}
            {user ? (
              <Link href="/account" className="lg:hidden bg-orange flex size-[36px] items-center justify-center no-underline">
                <span className="font-['Circular_Std'] font-medium text-[14px] text-white">{userInitial}</span>
              </Link>
            ) : (
              <button className="lg:hidden bg-orange flex h-[36px] items-center justify-center px-[18px]" onClick={() => setLoginOpen(true)}>
                <p className="font-['Circular_Std'] font-medium text-[14px] text-white">Login</p>
              </button>
            )}
            <button className="block shrink-0 size-[20px]" onClick={() => setSearchOpen(true)}>
              <img alt="Search" className="block max-w-none size-full" src={imgUnion} />
            </button>
            {/* Desktop: Login/User button */}
            {user ? (
              <div className="hidden lg:block relative" onClick={(e) => e.stopPropagation()}>
                <button
                  className="flex items-center gap-[8px] border border-[#e5e7eb] h-[40px] px-[16px] cursor-pointer bg-transparent"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <div className="size-[28px] rounded-full bg-orange flex items-center justify-center">
                    <span className="font-['Circular_Std'] font-medium text-[13px] text-white">{userInitial}</span>
                  </div>
                  <span className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[14px] text-black max-w-[100px] truncate">
                    {user.user_metadata?.display_name || 'บัญชี'}
                  </span>
                  <svg className={`size-[16px] transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none">
                    <path d="M6 9L12 15L18 9" stroke="#35383b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {dropdownOpen && (
                  <UserDropdown user={user} onLogout={handleLogout} onClose={() => setDropdownOpen(false)} />
                )}
              </div>
            ) : (
              <button className="hidden lg:flex border border-[#e5e7eb] h-[40px] items-center justify-center px-[24px]" onClick={() => setLoginOpen(true)}>
                <p className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[15px] text-black">
                  เข้าสู่ระบบ
                </p>
              </button>
            )}
            {/* Mobile: Hamburger menu */}
            <button className="lg:hidden shrink-0 size-[20px]" onClick={() => setMobileMenuOpen(true)}>
              <img alt="Menu" className="block max-w-none size-full" src={imgMenu1} />
            </button>
          </div>
        </div>
      </div>
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} user={user} onLogout={handleLogout} />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  )
}
