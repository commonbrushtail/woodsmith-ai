'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */
const MOCK_BLOGS = [
  {
    id: 1,
    order: 1,
    title: 'เปิด 6 ไอเดียตกแต่งผนังด้วย ไม้บอร์ด MDF HMR ปิดผิวเมลามีน Melamine Board ให้สวยหรูดูดี',
    author: 'WoodSmith A',
    publishDate: 'วันอังคาร ที่ 28 ตุลาคม พ.ศ. 2568 เวลา 10:44',
    recommended: true,
    published: true,
  },
  {
    id: 2,
    order: 2,
    title: 'รวม 5 เคล็ดลับการเลือกประตูไม้ HDF สำหรับบ้านสไตล์โมเดิร์นให้เข้ากับทุกห้อง',
    author: 'WoodSmith A',
    publishDate: 'วันอังคาร ที่ 28 ตุลาคม พ.ศ. 2568 เวลา 10:44',
    recommended: true,
    published: true,
  },
  {
    id: 3,
    order: 3,
    title: 'ไม้อัด OSB คืออะไร? มีประโยชน์อย่างไร? เหมาะกับงานก่อสร้างแบบไหน?',
    author: 'WoodSmith A',
    publishDate: 'วันอังคาร ที่ 28 ตุลาคม พ.ศ. 2568 เวลา 10:44',
    recommended: false,
    published: true,
  },
  {
    id: 4,
    order: 4,
    title: 'แนะนำวิธีดูแลรักษาพื้นไม้ลามิเนต Laminate Flooring ให้สวยคงทนนาน',
    author: 'WoodSmith A',
    publishDate: 'วันอังคาร ที่ 28 ตุลาคม พ.ศ. 2568 เวลา 10:44',
    recommended: false,
    published: false,
  },
  {
    id: 5,
    order: 5,
    title: 'เปรียบเทียบประตู uPVC กับประตูไม้จริง ประตูแบบไหนเหมาะกับบ้านคุณมากที่สุด?',
    author: 'WoodSmith A',
    publishDate: 'วันอังคาร ที่ 28 ตุลาคม พ.ศ. 2568 เวลา 10:44',
    recommended: true,
    published: true,
  },
  {
    id: 6,
    order: 6,
    title: 'ทำไมวงกบ PVC ถึงเป็นที่นิยมในงานก่อสร้างบ้านยุคใหม่? มาดูข้อดีกัน',
    author: 'WoodSmith A',
    publishDate: 'วันอังคาร ที่ 28 ตุลาคม พ.ศ. 2568 เวลา 10:44',
    recommended: false,
    published: true,
  },
  {
    id: 7,
    order: 7,
    title: 'สร้างมุมทำงานในบ้านให้สวยด้วยไม้บอร์ด MDF ปิดผิวเมลามีน สไตล์มินิมอล',
    author: 'WoodSmith A',
    publishDate: 'วันอังคาร ที่ 28 ตุลาคม พ.ศ. 2568 เวลา 10:44',
    recommended: true,
    published: true,
  },
  {
    id: 8,
    order: 8,
    title: 'รู้จัก Melamine Door ประตูเมลามีนที่ตอบโจทย์ทั้งความสวยและทนทาน',
    author: 'WoodSmith A',
    publishDate: 'วันอังคาร ที่ 28 ตุลาคม พ.ศ. 2568 เวลา 10:44',
    recommended: false,
    published: false,
  },
  {
    id: 9,
    order: 9,
    title: '10 แบบตกแต่งห้องนอนด้วยไม้อัดเมลามีนให้ดูอบอุ่นน่านอนที่สุด',
    author: 'WoodSmith A',
    publishDate: 'วันอังคาร ที่ 28 ตุลาคม พ.ศ. 2568 เวลา 10:44',
    recommended: true,
    published: true,
  },
  {
    id: 10,
    order: 10,
    title: 'วิธีเลือกไม้พื้น HDF ที่เหมาะกับสภาพอากาศร้อนชื้นในประเทศไทย',
    author: 'WoodSmith A',
    publishDate: 'วันอังคาร ที่ 28 ตุลาคม พ.ศ. 2568 เวลา 10:44',
    recommended: false,
    published: true,
  },
]

/* ------------------------------------------------------------------ */
/*  Inline SVG icon helpers                                            */
/* ------------------------------------------------------------------ */
function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

function FilterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  )
}

function ChevronDownIcon({ className = '' }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

function SettingsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}

function DotsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="19" r="1" />
    </svg>
  )
}

function EditIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  )
}

function ChevronLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

function ChevronRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

function SortArrowIcon({ ascending }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      stroke="#6b7280"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`transition-transform ${ascending ? '' : 'rotate-180'}`}
    >
      <path d="M3 4.5L6 7.5L9 4.5" />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  Page component                                                     */
/* ------------------------------------------------------------------ */
export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRows, setSelectedRows] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [sortAsc, setSortAsc] = useState(true)
  const [openMenuId, setOpenMenuId] = useState(null)
  const menuRef = useRef(null)

  const totalEntries = 200
  const totalPages = 10

  /* Close action menu on outside click */
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null)
      }
    }
    if (openMenuId !== null) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [openMenuId])

  /* Selection helpers */
  const allSelected = selectedRows.length === MOCK_BLOGS.length && MOCK_BLOGS.length > 0
  const someSelected = selectedRows.length > 0 && !allSelected

  function toggleSelectAll() {
    if (allSelected) {
      setSelectedRows([])
    } else {
      setSelectedRows(MOCK_BLOGS.map((b) => b.id))
    }
  }

  function toggleSelectRow(id) {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    )
  }

  /* Sorting */
  const sortedBlogs = [...MOCK_BLOGS].sort((a, b) =>
    sortAsc ? a.order - b.order : b.order - a.order
  )

  /* ---------- Badge render helpers ---------- */

  function renderRecommendedBadge(isRecommended) {
    if (isRecommended) {
      return (
        <span className="inline-flex items-center gap-[4px] rounded-full border border-[#22c55e] text-[#16a34a] bg-[#f0fdf4] px-[10px] py-[2px] text-[12px] font-medium leading-[20px] whitespace-nowrap">
          YES
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-[4px] rounded-full border border-[#f97316] text-[#ea580c] bg-[#fff7ed] px-[10px] py-[2px] text-[12px] font-medium leading-[20px] whitespace-nowrap">
        NO
      </span>
    )
  }

  function renderPublishBadge(isPublished) {
    if (isPublished) {
      return (
        <span className="inline-flex items-center gap-[4px] rounded-full border border-[#22c55e] text-[#16a34a] bg-[#f0fdf4] px-[10px] py-[2px] text-[12px] font-medium leading-[20px] whitespace-nowrap">
          {'เผยแพร่'}
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-[4px] rounded-full border border-[#d1d5db] text-[#6b7280] bg-[#f9fafb] px-[10px] py-[2px] text-[12px] font-medium leading-[20px] whitespace-nowrap">
        {'ไม่แสดงแพร่'}
      </span>
    )
  }

  /* ---------- Pagination render ---------- */

  function renderPageNumbers() {
    const pages = []

    /* Previous arrow */
    pages.push(
      <button
        key="prev"
        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
        disabled={currentPage === 1}
        className="size-[32px] flex items-center justify-center rounded-[6px] border border-[#e5e7eb] bg-white text-[#6b7280] hover:bg-[#f9fafb] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
        aria-label="Previous page"
      >
        <ChevronLeftIcon />
      </button>
    )

    /* First three pages */
    for (let i = 1; i <= 3; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`size-[32px] flex items-center justify-center rounded-[6px] text-[13px] font-medium cursor-pointer transition-colors ${
            currentPage === i
              ? 'bg-[#ff7e1b] text-white border border-[#ff7e1b]'
              : 'border border-[#e5e7eb] bg-white text-[#374151] hover:bg-[#f9fafb]'
          }`}
          aria-label={`Page ${i}`}
          aria-current={currentPage === i ? 'page' : undefined}
        >
          {i}
        </button>
      )
    }

    /* Ellipsis */
    pages.push(
      <span key="dots" className="flex items-center justify-center px-[4px] text-[13px] text-[#9ca3af] select-none">
        ...
      </span>
    )

    /* Last three pages */
    for (let i = totalPages - 2; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`size-[32px] flex items-center justify-center rounded-[6px] text-[13px] font-medium cursor-pointer transition-colors ${
            currentPage === i
              ? 'bg-[#ff7e1b] text-white border border-[#ff7e1b]'
              : 'border border-[#e5e7eb] bg-white text-[#374151] hover:bg-[#f9fafb]'
          }`}
          aria-label={`Page ${i}`}
          aria-current={currentPage === i ? 'page' : undefined}
        >
          {i}
        </button>
      )
    }

    /* Next arrow */
    pages.push(
      <button
        key="next"
        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
        disabled={currentPage === totalPages}
        className="size-[32px] flex items-center justify-center rounded-[6px] border border-[#e5e7eb] bg-white text-[#6b7280] hover:bg-[#f9fafb] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
        aria-label="Next page"
      >
        <ChevronRightIcon />
      </button>
    )

    return pages
  }

  /* ================================================================ */
  /*  JSX                                                              */
  /* ================================================================ */
  return (
    <div className="font-['IBM_Plex_Sans_Thai'] flex flex-col gap-[20px]">
      {/* ---- Page header ---- */}
      <div className="flex items-center justify-between py-[12px]">
        <div className="flex flex-col gap-[2px]">
          <h1 className="text-[22px] font-bold text-[#1f2937] m-0 leading-[1.3]">
            {'บทความ (Blog)'}
          </h1>
          <p className="text-[13px] text-[#6b7280] m-0">
            {totalEntries} entries found
          </p>
        </div>
        <div className="flex items-center gap-[12px]">
          <Link
            href="/admin/blog/create"
            className="inline-flex items-center gap-[6px] bg-[#ff7e1b] hover:bg-[#e96d0f] text-white text-[14px] font-semibold rounded-[8px] px-[16px] py-[9px] no-underline transition-colors"
          >
            <PlusIcon />
            Create new entry
          </Link>
          {/* Language selector */}
          <div className="flex items-center gap-[8px] border border-[#e5e7eb] rounded-[8px] px-[12px] py-[6px] cursor-pointer hover:bg-[#f9fafb] transition-colors">
            <span className="text-[13px] text-[#4b5563]">Thai (th)</span>
            <ChevronDownIcon className="text-[#6b7280]" />
          </div>
          {/* Settings */}
          <button
            className="size-[32px] flex items-center justify-center rounded-[8px] hover:bg-gray-100 cursor-pointer bg-transparent border-none transition-colors"
            aria-label="Settings"
          >
            <SettingsIcon />
          </button>
        </div>
      </div>

      {/* ---- Search + Filter bar ---- */}
      <div className="flex items-center gap-[10px]">
        {/* Search input */}
        <div className="relative flex-1 max-w-[360px]">
          <div className="absolute left-[10px] top-1/2 -translate-y-1/2 pointer-events-none">
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder={'ค้นหา...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[38px] pl-[36px] pr-[12px] border border-[#e5e7eb] rounded-[8px] text-[13px] text-[#374151] placeholder-[#9ca3af] outline-none focus:border-[#ff7e1b] focus:ring-1 focus:ring-[#ff7e1b] transition-colors bg-white"
            aria-label="Search blogs"
          />
        </div>
        {/* Filter button */}
        <button className="inline-flex items-center gap-[6px] h-[38px] px-[14px] border border-[#e5e7eb] rounded-[8px] bg-white text-[13px] text-[#4b5563] hover:bg-[#f9fafb] transition-colors cursor-pointer">
          <FilterIcon />
          {'ตัวกรอง'}
        </button>
      </div>

      {/* ---- Table ---- */}
      <div className="border border-[#e5e7eb] rounded-[10px] overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[1280px]">
            <thead>
              <tr className="bg-[#f9fafb]">
                {/* Checkbox */}
                <th className="w-[44px] px-[12px] py-[10px] text-left">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = someSelected
                    }}
                    onChange={toggleSelectAll}
                    className="size-[16px] accent-[#ff7e1b] cursor-pointer rounded"
                    aria-label="Select all rows"
                  />
                </th>
                {/* Order */}
                <th
                  className="w-[80px] px-[10px] py-[10px] text-left text-[12px] font-semibold text-[#6b7280] uppercase tracking-wider whitespace-nowrap cursor-pointer select-none"
                  onClick={() => setSortAsc((prev) => !prev)}
                  aria-sort={sortAsc ? 'ascending' : 'descending'}
                >
                  <div className="flex items-center gap-[4px]">
                    <span>ORDER / {'ลำดับ'}</span>
                    <SortArrowIcon ascending={sortAsc} />
                  </div>
                </th>
                {/* Image */}
                <th className="w-[88px] px-[10px] py-[10px] text-left text-[12px] font-semibold text-[#6b7280] uppercase tracking-wider whitespace-nowrap">
                  IMAGE / {'รูปภาพ'}
                </th>
                {/* Blog title */}
                <th className="px-[10px] py-[10px] text-left text-[12px] font-semibold text-[#6b7280] uppercase tracking-wider whitespace-nowrap">
                  {'ชื่อบทความ'}
                </th>
                {/* Author */}
                <th className="px-[10px] py-[10px] text-left text-[12px] font-semibold text-[#6b7280] uppercase tracking-wider whitespace-nowrap">
                  {'ชื่อผู้สร้างบทความ'}
                </th>
                {/* Publish date range */}
                <th className="px-[10px] py-[10px] text-left text-[12px] font-semibold text-[#6b7280] uppercase tracking-wider">
                  <span className="block leading-[1.4]">
                    {'ช่วงวันเวลาเริ่มต้น-สิ้นสุด'}
                  </span>
                  <span className="block leading-[1.4]">
                    {'การเผยแพร่'}
                  </span>
                </th>
                {/* Recommended status */}
                <th className="px-[10px] py-[10px] text-left text-[12px] font-semibold text-[#6b7280] uppercase tracking-wider whitespace-nowrap">
                  {'สถานะบทความแนะนำ'}
                </th>
                {/* Publish status */}
                <th className="px-[10px] py-[10px] text-left text-[12px] font-semibold text-[#6b7280] uppercase tracking-wider whitespace-nowrap">
                  {'สถานะเผยแพร่'}
                </th>
                {/* Action */}
                <th className="w-[56px] px-[10px] py-[10px] text-center text-[12px] font-semibold text-[#6b7280] uppercase tracking-wider">
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedBlogs.map((blog) => (
                <tr
                  key={blog.id}
                  className="border-t border-[#f3f4f6] hover:bg-[#fafafa] transition-colors"
                >
                  {/* Checkbox */}
                  <td className="px-[12px] py-[10px]">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(blog.id)}
                      onChange={() => toggleSelectRow(blog.id)}
                      className="size-[16px] accent-[#ff7e1b] cursor-pointer rounded"
                      aria-label={`Select ${blog.title}`}
                    />
                  </td>
                  {/* Order */}
                  <td className="px-[10px] py-[10px] text-[13px] text-[#374151]">
                    {blog.order}
                  </td>
                  {/* Image placeholder */}
                  <td className="px-[10px] py-[10px]">
                    <div
                      className="w-[64px] h-[48px] rounded-[6px] bg-[#c4956b]"
                      role="img"
                      aria-label={`Thumbnail for ${blog.title}`}
                    />
                  </td>
                  {/* Blog title */}
                  <td className="px-[10px] py-[10px] text-[13px] text-[#374151] max-w-[260px]">
                    <span className="line-clamp-2">{blog.title}</span>
                  </td>
                  {/* Author */}
                  <td className="px-[10px] py-[10px] text-[13px] text-[#374151] whitespace-nowrap">
                    {blog.author}
                  </td>
                  {/* Publish date */}
                  <td className="px-[10px] py-[10px] text-[12px] text-[#6b7280] min-w-[220px]">
                    <div className="leading-[1.5]">{blog.publishDate}</div>
                  </td>
                  {/* Recommended status */}
                  <td className="px-[10px] py-[10px]">
                    {renderRecommendedBadge(blog.recommended)}
                  </td>
                  {/* Publish status */}
                  <td className="px-[10px] py-[10px]">
                    {renderPublishBadge(blog.published)}
                  </td>
                  {/* Action dots */}
                  <td className="px-[10px] py-[10px] text-center">
                    <div className="relative inline-block" ref={openMenuId === blog.id ? menuRef : null}>
                      <button
                        onClick={() =>
                          setOpenMenuId(openMenuId === blog.id ? null : blog.id)
                        }
                        className="size-[32px] inline-flex items-center justify-center rounded-[6px] hover:bg-[#f3f4f6] transition-colors cursor-pointer bg-transparent border-none"
                        aria-label={`Actions for ${blog.title}`}
                        aria-expanded={openMenuId === blog.id}
                        aria-haspopup="true"
                      >
                        <DotsIcon />
                      </button>
                      {openMenuId === blog.id && (
                        <div
                          className="absolute right-0 top-[36px] z-20 bg-white border border-[#e5e7eb] rounded-[8px] shadow-lg py-[4px] min-w-[140px]"
                          role="menu"
                        >
                          <Link
                            href={`/admin/blog/edit/${blog.id}`}
                            className="flex items-center gap-[8px] px-[12px] py-[8px] text-[13px] text-[#374151] hover:bg-[#f9fafb] no-underline transition-colors"
                            onClick={() => setOpenMenuId(null)}
                            role="menuitem"
                          >
                            <EditIcon />
                            {'แก้ไข'}
                          </Link>
                          <button
                            className="flex items-center gap-[8px] w-full px-[12px] py-[8px] text-[13px] text-[#ef4444] hover:bg-[#fef2f2] border-none bg-transparent cursor-pointer transition-colors"
                            onClick={() => setOpenMenuId(null)}
                            role="menuitem"
                          >
                            <TrashIcon />
                            {'ลบ'}
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ---- Pagination ---- */}
      <div className="flex items-center justify-between py-[8px]">
        {/* Rows per page */}
        <div className="flex items-center gap-[8px]">
          <div className="relative">
            <select
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
              className="appearance-none h-[34px] pl-[10px] pr-[28px] border border-[#e5e7eb] rounded-[6px] bg-white text-[13px] text-[#374151] cursor-pointer focus:outline-none focus:border-[#ff7e1b] transition-colors"
              aria-label="Rows per page"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <div className="pointer-events-none absolute right-[8px] top-1/2 -translate-y-1/2 text-[#6b7280]">
              <ChevronDownIcon />
            </div>
          </div>
          <span className="text-[13px] text-[#6b7280]">
            {'รายการต่อหน้า'}
          </span>
        </div>

        {/* Page numbers */}
        <nav className="flex items-center gap-[4px]" aria-label="Pagination navigation">
          {renderPageNumbers()}
        </nav>
      </div>
    </div>
  )
}
