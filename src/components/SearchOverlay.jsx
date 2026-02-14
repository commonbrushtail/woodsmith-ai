'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

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

const RECENT_SEARCHES_KEY = 'woodsmith_recent_searches'

function getStoredRecentSearches() {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) || '[]')
  } catch {
    return []
  }
}

function setStoredRecentSearches(terms) {
  try {
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(terms.slice(0, 10)))
  } catch { /* ignore */ }
}

function getProductImage(product) {
  const primary = product.product_images?.find(img => img.is_primary)
  return primary?.url || product.product_images?.[0]?.url || null
}

export default function SearchOverlay({ isOpen, onClose }) {
  const [query, setQuery] = useState('')
  const [recentSearches, setRecentSearches] = useState([])
  const [recommended, setRecommended] = useState([])
  const [popularTerms, setPopularTerms] = useState([])
  const [searchResults, setSearchResults] = useState(null)
  const [searching, setSearching] = useState(false)
  const inputRef = useRef(null)
  const debounceRef = useRef(null)

  // Load recent searches from localStorage + recommended/popular from DB
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setTimeout(() => inputRef.current?.focus(), 100)
      setRecentSearches(getStoredRecentSearches())
      setQuery('')
      setSearchResults(null)

      async function loadData() {
        try {
          const { getRecommendedProducts, getPopularCategories } = await import('@/lib/actions/search')
          const [rec, pop] = await Promise.all([
            getRecommendedProducts(),
            getPopularCategories(),
          ])
          setRecommended(rec)
          setPopularTerms(pop)
        } catch { /* ignore */ }
      }
      loadData()
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

  // Debounced search
  const doSearch = useCallback(async (term) => {
    if (!term || term.trim().length < 2) {
      setSearchResults(null)
      setSearching(false)
      return
    }
    setSearching(true)
    try {
      const { searchAll } = await import('@/lib/actions/search')
      const results = await searchAll(term)
      setSearchResults(results)
    } catch {
      setSearchResults(null)
    }
    setSearching(false)
  }, [])

  const handleQueryChange = (value) => {
    setQuery(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => doSearch(value), 300)
  }

  const handleSearch = (term) => {
    setQuery(term)
    doSearch(term)
    const updated = [term, ...recentSearches.filter(t => t !== term)].slice(0, 10)
    setRecentSearches(updated)
    setStoredRecentSearches(updated)
  }

  const removeRecent = (term) => {
    const updated = recentSearches.filter((t) => t !== term)
    setRecentSearches(updated)
    setStoredRecentSearches(updated)
  }

  if (!isOpen) return null

  const hasResults = searchResults && (searchResults.products.length > 0 || searchResults.posts.length > 0)
  const showDefault = !query || query.trim().length < 2

  return (
    <div className="fixed inset-0 z-[80]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/25 backdrop-blur-[4px]" onClick={onClose} />

      {/* Search Panel */}
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
                onChange={(e) => handleQueryChange(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && query.trim() && handleSearch(query.trim())}
                placeholder="กำลังมองหาสินค้าอะไร? ค้นหาเลย..."
                className="font-['IBM_Plex_Sans_Thai'] font-medium text-[16px] text-black placeholder:text-grey border-none outline-none bg-transparent w-full px-[4px]"
              />
            </div>
          </div>
        </div>

        {/* Desktop: Search input + Close */}
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
                onChange={(e) => handleQueryChange(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && query.trim() && handleSearch(query.trim())}
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

        {/* Content */}
        <div className="max-w-[1212px] mx-auto w-full flex flex-col gap-[20px]">
          <div className="w-full h-px bg-[#e5e7eb]" />

          {showDefault ? (
            <>
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="flex flex-col gap-[16px] items-start px-[16px] w-full">
                  <p className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[20px] text-[#18191f] leading-[1.2]">
                    การค้นหาล่าสุด
                  </p>
                  <div className="flex flex-col gap-[24px] lg:gap-[16px] w-full">
                    {recentSearches.map((term) => (
                      <div key={term} className="flex h-[16px] items-center justify-between w-full">
                        <button
                          onClick={() => handleSearch(term)}
                          className="flex gap-[8px] items-center cursor-pointer bg-transparent border-none p-0"
                        >
                          <HistoryIcon />
                          <span className="font-['IBM_Plex_Sans_Thai'] text-[16px] text-[#131315]">{term}</span>
                        </button>
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

              {recentSearches.length > 0 && <div className="w-full h-px bg-[#e5e7eb]" />}

              {/* Recommended Products */}
              {recommended.length > 0 && (
                <div className="flex flex-col gap-[16px] items-start px-[16px] w-full">
                  <p className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[20px] text-[#18191f] leading-[1.2]">
                    สินค้าแนะนำ
                  </p>
                  <div className="flex flex-col lg:flex-row lg:flex-wrap gap-[16px] w-full">
                    {recommended.slice(0, 3).map((item) => (
                      <a key={item.id} href={`/product/${item.id}`} className="flex gap-[10px] items-start w-full lg:w-[335px] cursor-pointer no-underline">
                        <div className="shrink-0 size-[64px] bg-[#e8e3da] overflow-hidden">
                          {getProductImage(item) && (
                            <img src={getProductImage(item)} alt="" className="size-full object-cover" />
                          )}
                        </div>
                        <div className="flex flex-col flex-1">
                          <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[13px] text-black tracking-[0.13px]">
                            {item.category}
                          </span>
                          <span className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[15px] text-[#18191f] leading-[1.4] line-clamp-2">
                            {item.name}
                          </span>
                        </div>
                      </a>
                    ))}
                  </div>
                  {recommended.length > 3 && (
                    <div className="flex flex-col lg:flex-row lg:flex-wrap gap-[16px] w-full">
                      {recommended.slice(3, 6).map((item) => (
                        <a key={item.id} href={`/product/${item.id}`} className="flex gap-[10px] items-start w-full lg:w-[335px] cursor-pointer no-underline">
                          <div className="shrink-0 size-[64px] bg-[#d9d9d9] overflow-hidden">
                            {getProductImage(item) && (
                              <img src={getProductImage(item)} alt="" className="size-full object-cover" />
                            )}
                          </div>
                          <div className="flex flex-col flex-1">
                            <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[13px] text-black tracking-[0.13px]">
                              {item.category}
                            </span>
                            <span className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[15px] text-[#18191f] leading-[1.4] line-clamp-2">
                              {item.name}
                            </span>
                          </div>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="w-full h-px bg-[#e5e7eb]" />

              {/* Popular Search Terms */}
              {popularTerms.length > 0 && (
                <div className="flex flex-col gap-[16px] items-start px-[16px] w-full">
                  <p className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[20px] text-[#18191f] leading-[1.2]">
                    คำค้นหายอดนิยม
                  </p>
                  <div className="flex flex-wrap gap-[12px] lg:gap-[16px]">
                    {popularTerms.map((term) => (
                      <button
                        key={term}
                        onClick={() => handleSearch(term)}
                        className="flex gap-[4px] h-[40px] items-center justify-center px-[16px] py-[2px] border border-[#e7e7e7] cursor-pointer bg-transparent backdrop-blur-[25px]"
                      >
                        <FireIcon />
                        <span className="font-['IBM_Plex_Sans_Thai'] text-[16px] text-[#131315]">{term}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              {searching ? (
                <div className="flex items-center justify-center py-[40px]">
                  <p className="font-['IBM_Plex_Sans_Thai'] text-[16px] text-grey">กำลังค้นหา...</p>
                </div>
              ) : hasResults ? (
                <>
                  {searchResults.products.length > 0 && (
                    <div className="flex flex-col gap-[16px] items-start px-[16px] w-full">
                      <p className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[20px] text-[#18191f] leading-[1.2]">
                        สินค้า ({searchResults.products.length})
                      </p>
                      <div className="flex flex-col lg:flex-row lg:flex-wrap gap-[16px] w-full">
                        {searchResults.products.map((item) => (
                          <a key={item.id} href={`/product/${item.id}`} className="flex gap-[10px] items-start w-full lg:w-[335px] cursor-pointer no-underline">
                            <div className="shrink-0 size-[64px] bg-[#e8e3da] overflow-hidden">
                              {getProductImage(item) && (
                                <img src={getProductImage(item)} alt="" className="size-full object-cover" />
                              )}
                            </div>
                            <div className="flex flex-col flex-1">
                              <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[13px] text-black tracking-[0.13px]">
                                {item.category}
                              </span>
                              <span className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[15px] text-[#18191f] leading-[1.4] line-clamp-2">
                                {item.name}
                              </span>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {searchResults.posts.length > 0 && (
                    <>
                      <div className="w-full h-px bg-[#e5e7eb]" />
                      <div className="flex flex-col gap-[16px] items-start px-[16px] w-full">
                        <p className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[20px] text-[#18191f] leading-[1.2]">
                          บทความ ({searchResults.posts.length})
                        </p>
                        <div className="flex flex-col lg:flex-row lg:flex-wrap gap-[16px] w-full">
                          {searchResults.posts.map((post) => (
                            <a key={post.id} href={`/blog/${post.slug || post.id}`} className="flex gap-[10px] items-start w-full lg:w-[335px] cursor-pointer no-underline">
                              <div className="shrink-0 size-[64px] bg-[#e8e3da] overflow-hidden">
                                {post.cover_image_url && (
                                  <img src={post.cover_image_url} alt="" className="size-full object-cover" />
                                )}
                              </div>
                              <div className="flex flex-col flex-1">
                                <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[13px] text-orange tracking-[0.13px]">
                                  {post.category || 'บทความ'}
                                </span>
                                <span className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[15px] text-[#18191f] leading-[1.4] line-clamp-2">
                                  {post.title}
                                </span>
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-center py-[40px]">
                  <p className="font-['IBM_Plex_Sans_Thai'] text-[16px] text-grey">
                    ไม่พบผลลัพธ์สำหรับ &quot;{query}&quot;
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
