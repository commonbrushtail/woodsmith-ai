import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import imgFavicon from '../assets/6727cae5f32ea2c35a94792ae9603addc6300612.png'
import imgUnion from '../assets/4e24c29ef271a3dd1cdfea028b3abb8fceed5119.svg'
import imgMenu1 from '../assets/ef18b0c8e480616ebef0c37dee581ff94d0c7c97.svg'

const menuItems = [
  { label: 'หน้าแรก', path: '/' },
  { label: 'เกี่ยวกับเรา', path: '/about' },
  { label: 'สินค้าของเรา', path: '#' },
  { label: 'ค้นหาสาขา', path: '/branches' },
  { label: 'บทความ', path: '/blog' },
  { label: 'คู่มือ', path: '#' },
  { label: 'ไฮไลท์', path: '#' },
  { label: 'FAQ', path: '#' },
]

function MobileMenu({ isOpen, onClose }) {
  const { pathname } = useLocation()

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
            <Link key={item.label} to={item.path} onClick={onClose} className={`font-['IBM_Plex_Sans_Thai'] font-semibold text-[16px] no-underline ${pathname === item.path ? 'text-orange' : 'text-black'}`}>
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { pathname } = useLocation()

  return (
    <>
      <div className="bg-white w-full sticky top-0 z-50 border-b border-[#e5e7eb] lg:border-b-0">
        <div className="max-w-[1212px] mx-auto w-full flex items-center justify-between px-[16px] py-[12px] h-[60px] lg:h-auto">
          <div className="flex gap-[40px] items-center">
            <Link to="/">
              <img alt="WoodSmith" className="h-[48px] w-[38px] lg:h-[60px] lg:w-[47px] object-cover" src={imgFavicon} />
            </Link>
            {/* Desktop nav menu */}
            <div className="hidden lg:flex gap-[36px] items-start">
              {menuItems.map((item) => (
                <Link key={item.label} to={item.path} className="flex flex-col gap-px items-start no-underline">
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
            {/* Mobile: Login button (orange) */}
            <button className="lg:hidden bg-orange flex h-[36px] items-center justify-center px-[18px]">
              <p className="font-['Circular_Std'] font-medium text-[14px] text-white">Login</p>
            </button>
            <button className="block shrink-0 size-[20px]">
              <img alt="Search" className="block max-w-none size-full" src={imgUnion} />
            </button>
            {/* Desktop: Login button (outlined) */}
            <button className="hidden lg:flex border border-[#e5e7eb] h-[40px] items-center justify-center px-[24px]">
              <p className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[15px] text-black">
                เข้าสู่ระบบ
              </p>
            </button>
            {/* Mobile: Hamburger menu */}
            <button className="lg:hidden shrink-0 size-[20px]" onClick={() => setMobileMenuOpen(true)}>
              <img alt="Menu" className="block max-w-none size-full" src={imgMenu1} />
            </button>
          </div>
        </div>
      </div>
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  )
}
