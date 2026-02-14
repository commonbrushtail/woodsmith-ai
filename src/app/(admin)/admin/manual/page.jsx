'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */
const MOCK_MANUALS = [
  {
    id: 1,
    order: 1,
    title: 'คู่มือแนะนำการติดตั้งวงกบท่อ PVC',
    publishDate: 'วันอังคาร ที่ 28 ตุลาคม พ.ศ. 2568 เวลา 14:08',
    status: 'unpublished',
  },
  {
    id: 2,
    order: 2,
    title: 'คู่มือแนะนำการติดตั้งวงกบท่อ PVC',
    publishDate: 'วันอังคาร ที่ 28 ตุลาคม พ.ศ. 2568 เวลา 14:08',
    status: 'published',
  },
  {
    id: 3,
    order: 3,
    title: 'คู่มือแนะนำการติดตั้งวงกบท่อ PVC',
    publishDate: 'วันอังคาร ที่ 28 ตุลาคม พ.ศ. 2568 เวลา 14:08',
    status: 'published',
  },
  {
    id: 4,
    order: 4,
    title: 'คู่มือแนะนำการติดตั้งวงกบท่อ PVC',
    publishDate: 'วันอังคาร ที่ 28 ตุลาคม พ.ศ. 2568 เวลา 14:08',
    status: 'published',
  },
  {
    id: 5,
    order: 5,
    title: 'คู่มือแนะนำการติดตั้งวงกบท่อ PVC',
    publishDate: 'วันอังคาร ที่ 28 ตุลาคม พ.ศ. 2568 เวลา 14:08',
    status: 'published',
  },
  {
    id: 6,
    order: 6,
    title: 'คู่มือแนะนำการติดตั้งวงกบท่อ PVC',
    publishDate: 'วันอังคาร ที่ 28 ตุลาคม พ.ศ. 2568 เวลา 14:08',
    status: 'published',
  },
  {
    id: 7,
    order: 7,
    title: 'คู่มือแนะนำการติดตั้งวงกบท่อ PVC',
    publishDate: 'วันอังคาร ที่ 28 ตุลาคม พ.ศ. 2568 เวลา 14:08',
    status: 'published',
  },
  {
    id: 8,
    order: 8,
    title: 'คู่มือแนะนำการติดตั้งวงกบท่อ PVC',
    publishDate: 'วันอังคาร ที่ 28 ตุลาคม พ.ศ. 2568 เวลา 14:08',
    status: 'draft',
  },
  {
    id: 9,
    order: 9,
    title: 'คู่มือแนะนำการติดตั้งวงกบท่อ PVC',
    publishDate: 'วันอังคาร ที่ 28 ตุลาคม พ.ศ. 2568 เวลา 14:08',
    status: 'unpublished',
  },
  {
    id: 10,
    order: 10,
    title: 'คู่มือแนะนำการติดตั้งวงกบท่อ PVC',
    publishDate: 'วันอังคาร ที่ 28 ตุลาคม พ.ศ. 2568 เวลา 14:08',
    status: 'published',
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
/*  Action menu component                                              */
/* ------------------------------------------------------------------ */
function ActionMenu({ manualId, onClose }) {
  const menuRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  return (
    <div
      ref={menuRef}
      className="absolute right-0 top-[36px] z-20 bg-white border border-[#e5e7eb] rounded-[8px] shadow-lg py-[4px] min-w-[140px]"
      role="menu"
      aria-label="Row actions"
    >
      <Link
        href={`/admin/manual/edit/${manualId}`}
        className="flex items-center gap-[8px] px-[12px] py-[8px] text-[13px] text-[#374151] hover:bg-[#f9fafb] no-underline transition-colors"
        role="menuitem"
        onClick={onClose}
      >
        <EditIcon />
        {'แก้ไข'}
      </Link>
      <button
        className="flex items-center gap-[8px] w-full px-[12px] py-[8px] text-[13px] text-[#ef4444] hover:bg-[#fef2f2] border-none bg-transparent cursor-pointer transition-colors"
        role="menuitem"
        onClick={onClose}
      >
        <TrashIcon />
        {'ลบ'}
      </button>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Page component                                                     */
/* ------------------------------------------------------------------ */
export default function ManualPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRows, setSelectedRows] = useState([])
  const [sortAsc, setSortAsc] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [openMenuId, setOpenMenuId] = useState(null)

  const totalEntries = 200
  const totalPages = 10

  const allSelected = selectedRows.length === MOCK_MANUALS.length && MOCK_MANUALS.length > 0
  const someSelected = selectedRows.length > 0 && !allSelected

  /* ---------- Selection handlers ---------- */

  function toggleSelectAll() {
    if (allSelected) {
      setSelectedRows([])
    } else {
      setSelectedRows(MOCK_MANUALS.map((m) => m.id))
    }
  }

  function toggleSelectRow(id) {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    )
  }

  /* ---------- Sort ---------- */

  const sortedManuals = [...MOCK_MANUALS].sort((a, b) =>
    sortAsc ? a.order - b.order : b.order - a.order
  )

  /* ---------- Badge renderer ---------- */

  function renderStatusBadge(status) {
    switch (status) {
      case 'published':
        return (
          <span className="inline-flex items-center rounded-full border border-[#22c55e] text-[#16a34a] bg-[#f0fdf4] px-[10px] py-[2px] text-[12px] font-medium leading-[20px] whitespace-nowrap">
            {'เผยแพร่'}
          </span>
        )
      case 'draft':
        return (
          <span className="inline-flex items-center rounded-full border border-[#ff7e1b] text-[#ff7e1b] bg-white px-[10px] py-[2px] text-[12px] font-medium leading-[20px] whitespace-nowrap">
            Draft
          </span>
        )
      case 'unpublished':
      default:
        return (
          <span className="inline-flex items-center rounded-full border border-[#d1d5db] text-[#6b7280] bg-[#f9fafb] px-[10px] py-[2px] text-[12px] font-medium leading-[20px] whitespace-nowrap">
            {'ไม่เผยแพร่'}
          </span>
        )
    }
  }

  /* ---------- Pagination renderer ---------- */

  function renderPageNumbers() {
    const pages = []

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

    pages.push(
      <span key="dots" className="flex items-center justify-center px-[4px] text-[13px] text-[#9ca3af] select-none">
        ...
      </span>
    )

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
            {'คู่มือการใช้สินค้า (Manual)'}
          </h1>
          <p className="text-[13px] text-[#6b7280] m-0">
            {totalEntries} entries found
          </p>
        </div>
        <div className="flex items-center gap-[12px]">
          <Link
            href="/admin/manual/create"
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
            aria-label="Search manuals"
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
          <table className="w-full border-collapse min-w-[960px]">
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
                {/* ORDER */}
                <th
                  className="w-[100px] px-[10px] py-[10px] text-left text-[12px] font-semibold text-[#6b7280] uppercase tracking-wider whitespace-nowrap cursor-pointer select-none"
                  onClick={() => setSortAsc((prev) => !prev)}
                  aria-sort={sortAsc ? 'ascending' : 'descending'}
                >
                  <div className="flex items-center gap-[4px]">
                    <span>ORDER / {'ลำดับ'}</span>
                    <SortArrowIcon ascending={sortAsc} />
                  </div>
                </th>
                {/* Manual name */}
                <th className="px-[10px] py-[10px] text-left text-[12px] font-semibold text-[#6b7280] uppercase tracking-wider whitespace-nowrap">
                  {'ชื่อคู่มือ'}
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
              {sortedManuals.map((manual) => (
                <tr
                  key={manual.id}
                  className="border-t border-[#f3f4f6] hover:bg-[#fafafa] transition-colors"
                >
                  {/* Checkbox */}
                  <td className="px-[12px] py-[10px]">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(manual.id)}
                      onChange={() => toggleSelectRow(manual.id)}
                      className="size-[16px] accent-[#ff7e1b] cursor-pointer rounded"
                      aria-label={`Select manual ${manual.order}`}
                    />
                  </td>
                  {/* Order */}
                  <td className="px-[10px] py-[10px] text-[13px] text-[#374151]">
                    {manual.order}
                  </td>
                  {/* Manual name */}
                  <td className="px-[10px] py-[10px] text-[13px] text-[#374151] max-w-[320px]">
                    <span className="line-clamp-2">{manual.title}</span>
                  </td>
                  {/* Publish date */}
                  <td className="px-[10px] py-[10px] text-[12px] text-[#6b7280] min-w-[220px]">
                    <div className="leading-[1.5]">{manual.publishDate}</div>
                  </td>
                  {/* Publish status */}
                  <td className="px-[10px] py-[10px]">
                    {renderStatusBadge(manual.status)}
                  </td>
                  {/* Action dots */}
                  <td className="px-[10px] py-[10px] text-center">
                    <div className="relative inline-block">
                      <button
                        onClick={() =>
                          setOpenMenuId(openMenuId === manual.id ? null : manual.id)
                        }
                        className="size-[32px] inline-flex items-center justify-center rounded-[6px] hover:bg-[#f3f4f6] transition-colors cursor-pointer bg-transparent border-none"
                        aria-label={`Actions for manual ${manual.order}`}
                        aria-haspopup="true"
                        aria-expanded={openMenuId === manual.id}
                      >
                        <DotsIcon />
                      </button>
                      {openMenuId === manual.id && (
                        <ActionMenu
                          manualId={manual.id}
                          onClose={() => setOpenMenuId(null)}
                        />
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
