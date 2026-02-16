'use client'

import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { createPortal } from 'react-dom'
import { getBlogCategories, createBlogCategory } from '@/lib/actions/blog-categories'
import { useToast } from '@/lib/toast-context'

function PlusIcon({ size = 14, color = '#ff7e1b' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

function SearchIcon({ size = 14, color = '#9ca3af' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

export default function CategorySelect({ value, onChange }) {
  const { toast } = useToast()
  const [categories, setCategories] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newName, setNewName] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const btnRef = useRef(null)
  const [dropPos, setDropPos] = useState(null)

  useEffect(() => {
    loadCategories()
  }, [])

  useLayoutEffect(() => {
    if (!isOpen || !btnRef.current) return
    const rect = btnRef.current.getBoundingClientRect()
    const dropHeight = 300
    const spaceBelow = window.innerHeight - rect.bottom
    const top = spaceBelow < dropHeight && rect.top > dropHeight
      ? rect.top - dropHeight - 4
      : rect.bottom + 4
    setDropPos({ top, left: rect.left, width: rect.width })
  }, [isOpen])

  const loadCategories = async () => {
    const { data } = await getBlogCategories()
    setCategories(data || [])
  }

  const handleCreate = async () => {
    if (!newName.trim()) return
    setIsCreating(true)
    const formData = new FormData()
    formData.set('name', newName)
    const result = await createBlogCategory(formData)
    setIsCreating(false)

    if (result.error) {
      toast.error(result.error)
    } else if (result.data) {
      toast.success('สร้างหมวดหมู่สำเร็จ')
      setNewName('')
      setShowCreateModal(false)
      await loadCategories()
      onChange(result.data.slug)
    }
  }

  const filtered = categories.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  const selectedCategory = categories.find(c => c.slug === value)

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full flex items-center justify-between border border-[#e8eaef] rounded-[8px]
          px-[14px] py-[10px] bg-white cursor-pointer transition-all text-left
          font-['IBM_Plex_Sans_Thai'] text-[14px]
          ${isOpen ? 'border-[#ff7e1b] ring-1 ring-[#ff7e1b]/20' : 'hover:border-[#d1d5db]'}
          ${selectedCategory ? 'text-[#1f2937]' : 'text-[#bfbfbf]'}
        `}
      >
        <span>{selectedCategory?.name || 'เลือกหมวดหมู่'}</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          <path d="M4 6L8 10L12 6" />
        </svg>
      </button>

      {isOpen && createPortal(
        <>
          <div className="fixed inset-0 z-[9998]" onClick={() => { setIsOpen(false); setSearch('') }} />
          <div
            className="fixed z-[9999] bg-white border border-[#e8eaef] rounded-[8px] shadow-lg overflow-hidden"
            style={dropPos ? { top: dropPos.top, left: dropPos.left, width: dropPos.width } : { top: -9999, left: -9999 }}
          >
            {/* Search */}
            <div className="p-[8px] border-b border-[#e8eaef]">
              <div className="flex items-center gap-[6px] border border-[#e8eaef] rounded-[6px] px-[10px] py-[6px] focus-within:border-orange">
                <SearchIcon />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="ค้นหาหมวดหมู่..."
                  className="flex-1 border-0 outline-none text-[13px] font-['IBM_Plex_Sans_Thai'] bg-transparent placeholder:text-[#bfbfbf]"
                  autoFocus
                />
              </div>
            </div>

            {/* Options */}
            <div className="max-h-[200px] overflow-y-auto">
              {filtered.length === 0 && (
                <p className="text-center text-[13px] text-[#9ca3af] py-[12px] font-['IBM_Plex_Sans_Thai']">
                  ไม่พบหมวดหมู่
                </p>
              )}
              {filtered.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => { onChange(cat.slug); setIsOpen(false); setSearch('') }}
                  className={`
                    w-full text-left px-[12px] py-[8px] border-0 cursor-pointer transition-colors
                    font-['IBM_Plex_Sans_Thai'] text-[13px]
                    ${value === cat.slug
                      ? 'bg-[#fff3e8] text-orange'
                      : 'bg-transparent text-[#374151] hover:bg-[#f3f4f6]'
                    }
                  `}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Create new */}
            <div className="border-t border-[#e8eaef] p-[8px]">
              <button
                type="button"
                onClick={() => { setShowCreateModal(true); setIsOpen(false); setSearch('') }}
                className="w-full flex items-center justify-center gap-[6px] px-[10px] py-[6px] text-orange text-[13px] font-medium font-['IBM_Plex_Sans_Thai'] hover:bg-orange/5 rounded-[6px] bg-transparent border-0 cursor-pointer"
              >
                <PlusIcon size={14} />
                <span>สร้างหมวดหมู่ใหม่</span>
              </button>
            </div>
          </div>
        </>,
        document.body
      )}

      {/* Create modal */}
      {showCreateModal && createPortal(
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-[12px] p-[24px] w-[400px] max-w-[90vw] shadow-xl">
            <h3 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[18px] text-[#1f2937] m-0 mb-[16px]">
              สร้างหมวดหมู่ใหม่
            </h3>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleCreate() }}
              placeholder="ชื่อหมวดหมู่"
              className="w-full px-[14px] py-[10px] border border-[#e8eaef] rounded-[8px] font-['IBM_Plex_Sans_Thai'] text-[14px] outline-none focus:border-orange mb-[16px]"
              autoFocus
            />
            <div className="flex gap-[8px] justify-end">
              <button
                type="button"
                onClick={() => { setShowCreateModal(false); setNewName('') }}
                className="px-[16px] py-[8px] border border-[#e8eaef] rounded-[8px] font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#4b5563] bg-white cursor-pointer hover:bg-[#f9fafb]"
                disabled={isCreating}
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleCreate}
                className="px-[16px] py-[8px] bg-orange text-white rounded-[8px] font-['IBM_Plex_Sans_Thai'] text-[14px] border-0 cursor-pointer hover:bg-[#e6711a] disabled:opacity-50"
                disabled={isCreating || !newName.trim()}
              >
                {isCreating ? 'กำลังสร้าง...' : 'สร้าง'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
