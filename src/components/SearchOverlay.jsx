'use client'

import { useState, useRef, useEffect } from 'react'

function SearchIcon() {
  return (
    <svg className="size-[22px] lg:size-[22px] shrink-0 relative bottom-[1px]" viewBox="0 0 20 20" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M16.9304 15.7991C18.3463 14.1265 19.2 11.963 19.2 9.6C19.2 4.29807 14.9019 0 9.6 0C4.29807 0 0 4.29807 0 9.6C0 14.9019 4.29807 19.2 9.6 19.2C11.963 19.2 14.1265 18.3463 15.7991 16.9304L18.6343 19.7657C18.9467 20.0781 19.4533 20.0781 19.7657 19.7657C20.0781 19.4533 20.0781 18.9467 19.7657 18.6343L16.9304 15.7991ZM17.6 9.6C17.6 14.0183 14.0183 17.6 9.6 17.6C5.18172 17.6 1.6 14.0183 1.6 9.6C1.6 5.18172 5.18172 1.6 9.6 1.6C14.0183 1.6 17.6 5.18172 17.6 9.6Z" fill="#ff7e1b" />
    </svg>
  )
}

function CloseIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M12 4L4 12M4 4L12 12" stroke="#35383b" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function HistoryIcon() {
  return (
    <svg className="size-[16px] shrink-0" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke="#131315" strokeWidth="1" />
      <path d="M8 4.5V8L10.5 10.5" stroke="#131315" strokeWidth="1" strokeLinecap="round" />
    </svg>
  )
}

function FireIcon() {
  return (
    <svg className="size-[16px] shrink-0" viewBox="0 0 16 16" fill="none">
      <path d="M8 1C8 1 3 6 3 9.5C3 12.5 5.24 14.5 8 14.5C10.76 14.5 13 12.5 13 9.5C13 6 8 1 8 1Z" fill="#FF6B35" />
      <path d="M8 7C8 7 6 9 6 10.5C6 11.6 6.9 12.5 8 12.5C9.1 12.5 10 11.6 10 10.5C10 9 8 7 8 7Z" fill="#FFD54F" />
    </svg>
  )
}

const MOCK_RECENT_SEARCHES = ['ไม้อัด', 'ไม้พื้น']

const MOCK_RECOMMENDED = [
  { category: 'ไม้พื้น', name: 'VV10603 ไม้พื้นไส้ HDF ปิดวีเนียร์' },
  { category: 'ไม้พื้น', name: 'VV10603 ไม้พื้นไส้ HDF ปิดวีเนียร์' },
  { category: 'ไม้พื้น', name: 'VV10603 ไม้พื้นไส้ HDF ปิดวีเนียร์' },
  { category: 'บานประตู', name: '10670 Oak MAG1 MELAMINE DOOR กันน้ำอัลตร้า' },
  { category: 'บานประตู', name: '10670 Oak MAG1 MELAMINE DOOR กันน้ำอัลตร้า' },
  { category: 'บานประตู', name: '10670 Oak MAG1 MELAMINE DOOR กันน้ำอัลตร้า' },
]

const MOCK_POPULAR_TERMS = ['ไม้อัด OSB', 'ไม้บอร์ดปิดผิว', 'ประตูเมลามีน']

export default function SearchOverlay({ isOpen, onClose }) {
  const [query, setQuery] = useState('')
  const [recentSearches, setRecentSearches] = useState(MOCK_RECENT_SEARCHES)
  const inputRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setTimeout(() => inputRef.current?.focus(), 100)
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  const removeRecent = (term) => {
    setRecentSearches((prev) => prev.filter((t) => t !== term))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[80]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/25 backdrop-blur-[4px]" onClick={onClose} />

      {/* Search Panel - overlays on top of navbar, constrained to 1212px */}
      <div className="absolute top-0 left-0 right-0 max-w-[1212px] mx-auto bg-white flex flex-col gap-[20px] py-[20px] shadow-[0px_6px_16px_0px_rgba(0,33,70,0.12)] max-h-[90vh] overflow-y-auto">
        {/* Mobile: Close + Search Input */}
        <div className="lg:hidden flex flex-col gap-[12px] items-end px-[16px] w-full">
          <button onClick={onClose} className="flex gap-[12px] items-center cursor-pointer bg-transparent border-none p-0">
            <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[16px] text-black">ปิด</span>
            <CloseIcon />
          </button>
          <div className="w-full border border-[#e5e7eb] rounded-full h-[52px] flex gap-px items-center px-[12px]">
            <div className="flex flex-1 gap-[2px] items-center">
              <SearchIcon />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="กำลังมองหาสินค้าอะไร? ค้นหาเลย..."
                className="font-['IBM_Plex_Sans_Thai'] font-medium text-[16px] text-black placeholder:text-grey border-none outline-none bg-transparent w-full px-[4px]"
              />
            </div>
          </div>
        </div>

        {/* Desktop: Search input + Close — constrained to 1212px */}
        <div className="hidden lg:flex items-center justify-between max-w-[1212px] mx-auto w-full px-[16px]">
          <div className="border border-[#e5e7eb] rounded-full h-[52px] flex gap-px items-center px-[12px] flex-1 max-w-[748px]">
            <div className="flex gap-[2px] items-center w-full">
              <div className='relative left-[2px]'>
          <SearchIcon />
              </div>
              
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="กำลังมองหาสินค้าอะไร? ค้นหาเลย..."
                className="pl-3 font-['IBM_Plex_Sans_Thai'] font-medium text-[20px] text-black placeholder:text-grey border-none outline-none bg-transparent w-full px-[4px]"
              />
            </div>
          </div>
          <button onClick={onClose} className="flex gap-[12px] items-center cursor-pointer bg-transparent border-none p-0">
            <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[16px] text-black">ปิด</span>
            <CloseIcon />
          </button>
        </div>

        {/* All content sections constrained to 1212px */}
        <div className="max-w-[1212px] mx-auto w-full flex flex-col gap-[20px]">
          {/* Divider */}
          <div className="w-full h-px bg-[#e5e7eb]" />

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="flex flex-col gap-[16px] items-start px-[16px] w-full">
              <p className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[20px] text-[#18191f] leading-[1.2]">
                การค้นหาล่าสุด
              </p>
              <div className="flex flex-col gap-[24px] lg:gap-[16px] w-full">
                {recentSearches.map((term) => (
                  <div key={term} className="flex h-[16px] items-center justify-between w-full">
                    <div className="flex gap-[8px] items-center">
                      <HistoryIcon />
                      <span className="font-['IBM_Plex_Sans_Thai'] text-[16px] text-[#131315]">{term}</span>
                    </div>
                    <button
                      onClick={() => removeRecent(term)}
                      className="cursor-pointer bg-transparent border-none p-0"
                    >
                      <CloseIcon size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Divider */}
          <div className="w-full h-px bg-[#e5e7eb]" />

          {/* Recommended Products */}
          <div className="flex flex-col gap-[16px] items-start px-[16px] w-full">
            <p className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[20px] text-[#18191f] leading-[1.2]">
              สินค้าแนะนำ
            </p>
            <div className="flex flex-col lg:flex-row lg:flex-wrap gap-[16px] w-full">
              {MOCK_RECOMMENDED.slice(0, 3).map((item, i) => (
                <div key={i} className="flex gap-[10px] items-start w-full lg:w-[335px] cursor-pointer">
                  <div className="shrink-0 size-[64px] bg-[#e8e3da]" />
                  <div className="flex flex-col flex-1">
                    <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[13px] text-black tracking-[0.13px]">
                      {item.category}
                    </span>
                    <span className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[15px] text-[#18191f] leading-[1.4] line-clamp-2">
                      {item.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col lg:flex-row lg:flex-wrap gap-[16px] w-full">
              {MOCK_RECOMMENDED.slice(3, 6).map((item, i) => (
                <div key={i} className="flex gap-[10px] items-start w-full lg:w-[335px] cursor-pointer">
                  <div className="shrink-0 size-[64px] bg-[#d9d9d9]" />
                  <div className="flex flex-col flex-1">
                    <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[13px] text-black tracking-[0.13px]">
                      {item.category}
                    </span>
                    <span className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[15px] text-[#18191f] leading-[1.4] line-clamp-2">
                      {item.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-[#e5e7eb]" />

          {/* Popular Search Terms */}
          <div className="flex flex-col gap-[16px] items-start px-[16px] w-full">
            <p className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[20px] text-[#18191f] leading-[1.2]">
              คำค้นหายอดนิยม
            </p>
            <div className="flex flex-wrap gap-[12px] lg:gap-[16px]">
              {MOCK_POPULAR_TERMS.map((term) => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="flex gap-[4px] h-[40px] items-center justify-center px-[16px] py-[2px] border border-[#e7e7e7] cursor-pointer bg-transparent backdrop-blur-[25px]"
                >
                  <FireIcon />
                  <span className="font-['IBM_Plex_Sans_Thai'] text-[16px] text-[#131315]">{term}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
