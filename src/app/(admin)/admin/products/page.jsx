'use client'

import { useState } from 'react'
import Link from 'next/link'

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */
const MOCK_PRODUCTS = [
  {
    id: 1,
    code: '1210009880040',
    name: '\u0e1b\u0e23\u0e30\u0e15\u0e39\u0e1a\u0e32\u0e19\u0e40\u0e1b\u0e34\u0e14 (HDF \u0e1b\u0e34\u0e14\u0e1c\u0e34\u0e27\u0e40\u0e21\u0e25\u0e32\u0e21\u0e35\u0e19) Wood Smith',
    type: '\u0e1c\u0e25\u0e34\u0e15\u0e20\u0e31\u0e13\u0e11\u0e4c\u0e2a\u0e33\u0e40\u0e23\u0e47\u0e08',
    category: '\u0e1a\u0e32\u0e19\u0e1b\u0e23\u0e30\u0e15\u0e39',
    publishStart: '\u0e27\u0e31\u0e19\u0e2d\u0e31\u0e07\u0e04\u0e32\u0e23 \u0e17\u0e35\u0e48 28 \u0e15\u0e38\u0e25\u0e32\u0e04\u0e21 \u0e1e.\u0e28. 2568 \u0e40\u0e27\u0e25\u0e32 10:44',
    publishEnd: '\u0e27\u0e31\u0e19\u0e2d\u0e31\u0e07\u0e04\u0e32\u0e23 \u0e17\u0e35\u0e48 28 \u0e15\u0e38\u0e25\u0e32\u0e04\u0e21 \u0e1e.\u0e28. 2569 \u0e40\u0e27\u0e25\u0e32 10:44',
    recommended: true,
    published: true,
  },
  {
    id: 2,
    code: '1210009880041',
    name: '\u0e1b\u0e23\u0e30\u0e15\u0e39\u0e41\u0e1e\u0e25\u0e19\u0e01\u0e4c \u0e17\u0e31\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e14\u0e49\u0e27\u0e22\u0e1c\u0e49\u0e32 MELAMINE DOOR',
    type: '\u0e1c\u0e25\u0e34\u0e15\u0e20\u0e31\u0e13\u0e11\u0e4c\u0e2a\u0e33\u0e40\u0e23\u0e47\u0e08',
    category: '\u0e1a\u0e32\u0e19\u0e1b\u0e23\u0e30\u0e15\u0e39',
    publishStart: '\u0e27\u0e31\u0e19\u0e2d\u0e31\u0e07\u0e04\u0e32\u0e23 \u0e17\u0e35\u0e48 28 \u0e15\u0e38\u0e25\u0e32\u0e04\u0e21 \u0e1e.\u0e28. 2568 \u0e40\u0e27\u0e25\u0e32 10:44',
    publishEnd: '\u0e27\u0e31\u0e19\u0e2d\u0e31\u0e07\u0e04\u0e32\u0e23 \u0e17\u0e35\u0e48 28 \u0e15\u0e38\u0e25\u0e32\u0e04\u0e21 \u0e1e.\u0e28. 2569 \u0e40\u0e27\u0e25\u0e32 10:44',
    recommended: true,
    published: true,
  },
  {
    id: 3,
    code: '1210009880042',
    name: 'MELAMINE DOOR \u0e1e\u0e23\u0e49\u0e2d\u0e21\u0e27\u0e07\u0e01\u0e1a',
    type: '\u0e1c\u0e25\u0e34\u0e15\u0e20\u0e31\u0e13\u0e11\u0e4c\u0e2a\u0e33\u0e40\u0e23\u0e47\u0e08',
    category: '\u0e1a\u0e32\u0e19\u0e1b\u0e23\u0e30\u0e15\u0e39',
    publishStart: '\u0e27\u0e31\u0e19\u0e2d\u0e31\u0e07\u0e04\u0e32\u0e23 \u0e17\u0e35\u0e48 28 \u0e15\u0e38\u0e25\u0e32\u0e04\u0e21 \u0e1e.\u0e28. 2568 \u0e40\u0e27\u0e25\u0e32 10:44',
    publishEnd: '\u0e27\u0e31\u0e19\u0e2d\u0e31\u0e07\u0e04\u0e32\u0e23 \u0e17\u0e35\u0e48 28 \u0e15\u0e38\u0e25\u0e32\u0e04\u0e21 \u0e1e.\u0e28. 2569 \u0e40\u0e27\u0e25\u0e32 10:44',
    recommended: false,
    published: true,
  },
  {
    id: 4,
    code: '1210009880043',
    name: '\u0e1b\u0e23\u0e30\u0e15\u0e39\u0e25\u0e39\u0e01\u0e1f\u0e31\u0e01 HMR+ HDF HMR Moulded Door',
    type: '\u0e1c\u0e25\u0e34\u0e15\u0e20\u0e31\u0e13\u0e11\u0e4c\u0e2a\u0e33\u0e40\u0e23\u0e47\u0e08',
    category: '\u0e1a\u0e32\u0e19\u0e1b\u0e23\u0e30\u0e15\u0e39',
    publishStart: '\u0e27\u0e31\u0e19\u0e2d\u0e31\u0e07\u0e04\u0e32\u0e23 \u0e17\u0e35\u0e48 28 \u0e15\u0e38\u0e25\u0e32\u0e04\u0e21 \u0e1e.\u0e28. 2568 \u0e40\u0e27\u0e25\u0e32 10:44',
    publishEnd: '\u0e27\u0e31\u0e19\u0e2d\u0e31\u0e07\u0e04\u0e32\u0e23 \u0e17\u0e35\u0e48 28 \u0e15\u0e38\u0e25\u0e32\u0e04\u0e21 \u0e1e.\u0e28. 2569 \u0e40\u0e27\u0e25\u0e32 10:44',
    recommended: false,
    published: false,
  },
  {
    id: 5,
    code: '1210009880044',
    name: '\u0e44\u0e21\u0e49\u0e2d\u0e31\u0e14 OSB : Oriented Strand Board',
    type: '\u0e27\u0e31\u0e2a\u0e14\u0e38\u0e01\u0e48\u0e2d\u0e2a\u0e23\u0e49\u0e32\u0e07',
    category: '\u0e44\u0e21\u0e49\u0e2d\u0e31\u0e14 OSB',
    publishStart: '\u0e27\u0e31\u0e19\u0e2d\u0e31\u0e07\u0e04\u0e32\u0e23 \u0e17\u0e35\u0e48 28 \u0e15\u0e38\u0e25\u0e32\u0e04\u0e21 \u0e1e.\u0e28. 2568 \u0e40\u0e27\u0e25\u0e32 10:44',
    publishEnd: '\u0e27\u0e31\u0e19\u0e2d\u0e31\u0e07\u0e04\u0e32\u0e23 \u0e17\u0e35\u0e48 28 \u0e15\u0e38\u0e25\u0e32\u0e04\u0e21 \u0e1e.\u0e28. 2569 \u0e40\u0e27\u0e25\u0e32 10:44',
    recommended: true,
    published: true,
  },
  {
    id: 6,
    code: '1210009880045',
    name: '\u0e44\u0e21\u0e49\u0e1e\u0e37\u0e49\u0e19\u0e44\u0e21\u0e49 HDF \u0e1b\u0e34\u0e14\u0e1c\u0e34\u0e27\u0e40\u0e21\u0e25\u0e32\u0e21\u0e35\u0e19\u0e4c',
    type: '\u0e1c\u0e25\u0e34\u0e15\u0e20\u0e31\u0e13\u0e11\u0e4c\u0e2a\u0e33\u0e40\u0e23\u0e47\u0e08',
    category: '\u0e44\u0e21\u0e49\u0e1e\u0e37\u0e49\u0e19',
    publishStart: '\u0e27\u0e31\u0e19\u0e2d\u0e31\u0e07\u0e04\u0e32\u0e23 \u0e17\u0e35\u0e48 28 \u0e15\u0e38\u0e25\u0e32\u0e04\u0e21 \u0e1e.\u0e28. 2568 \u0e40\u0e27\u0e25\u0e32 10:44',
    publishEnd: '\u0e27\u0e31\u0e19\u0e2d\u0e31\u0e07\u0e04\u0e32\u0e23 \u0e17\u0e35\u0e48 28 \u0e15\u0e38\u0e25\u0e32\u0e04\u0e21 \u0e1e.\u0e28. 2569 \u0e40\u0e27\u0e25\u0e32 10:44',
    recommended: false,
    published: true,
  },
  {
    id: 7,
    code: '1210009880046',
    name: '\u0e1b\u0e23\u0e30\u0e15\u0e39\u0e1a\u0e32\u0e19\u0e40\u0e25\u0e37\u0e48\u0e2d\u0e19 uPVC Door',
    type: '\u0e1c\u0e25\u0e34\u0e15\u0e20\u0e31\u0e13\u0e11\u0e4c\u0e2a\u0e33\u0e40\u0e23\u0e47\u0e08',
    category: '\u0e1a\u0e32\u0e19\u0e1b\u0e23\u0e30\u0e15\u0e39',
    publishStart: '\u0e27\u0e31\u0e19\u0e2d\u0e31\u0e07\u0e04\u0e32\u0e23 \u0e17\u0e35\u0e48 28 \u0e15\u0e38\u0e25\u0e32\u0e04\u0e21 \u0e1e.\u0e28. 2568 \u0e40\u0e27\u0e25\u0e32 10:44',
    publishEnd: '\u0e27\u0e31\u0e19\u0e2d\u0e31\u0e07\u0e04\u0e32\u0e23 \u0e17\u0e35\u0e48 28 \u0e15\u0e38\u0e25\u0e32\u0e04\u0e21 \u0e1e.\u0e28. 2569 \u0e40\u0e27\u0e25\u0e32 10:44',
    recommended: true,
    published: false,
  },
  {
    id: 8,
    code: '1210009880047',
    name: '\u0e27\u0e07\u0e01\u0e1a\u0e1b\u0e23\u0e30\u0e15\u0e39 PVC Door Frame',
    type: '\u0e1c\u0e25\u0e34\u0e15\u0e20\u0e31\u0e13\u0e11\u0e4c\u0e2a\u0e33\u0e40\u0e23\u0e47\u0e08',
    category: '\u0e1a\u0e32\u0e19\u0e1b\u0e23\u0e30\u0e15\u0e39',
    publishStart: '\u0e27\u0e31\u0e19\u0e2d\u0e31\u0e07\u0e04\u0e32\u0e23 \u0e17\u0e35\u0e48 28 \u0e15\u0e38\u0e25\u0e32\u0e04\u0e21 \u0e1e.\u0e28. 2568 \u0e40\u0e27\u0e25\u0e32 10:44',
    publishEnd: '\u0e27\u0e31\u0e19\u0e2d\u0e31\u0e07\u0e04\u0e32\u0e23 \u0e17\u0e35\u0e48 28 \u0e15\u0e38\u0e25\u0e32\u0e04\u0e21 \u0e1e.\u0e28. 2569 \u0e40\u0e27\u0e25\u0e32 10:44',
    recommended: false,
    published: true,
  },
  {
    id: 9,
    code: '1210009880048',
    name: '\u0e44\u0e21\u0e49\u0e2d\u0e31\u0e14\u0e1b\u0e34\u0e14\u0e1c\u0e34\u0e27 Laminate Plywood',
    type: '\u0e27\u0e31\u0e2a\u0e14\u0e38\u0e01\u0e48\u0e2d\u0e2a\u0e23\u0e49\u0e32\u0e07',
    category: '\u0e44\u0e21\u0e49\u0e2d\u0e31\u0e14 OSB',
    publishStart: '\u0e27\u0e31\u0e19\u0e2d\u0e31\u0e07\u0e04\u0e32\u0e23 \u0e17\u0e35\u0e48 28 \u0e15\u0e38\u0e25\u0e32\u0e04\u0e21 \u0e1e.\u0e28. 2568 \u0e40\u0e27\u0e25\u0e32 10:44',
    publishEnd: '\u0e27\u0e31\u0e19\u0e2d\u0e31\u0e07\u0e04\u0e32\u0e23 \u0e17\u0e35\u0e48 28 \u0e15\u0e38\u0e25\u0e32\u0e04\u0e21 \u0e1e.\u0e28. 2569 \u0e40\u0e27\u0e25\u0e32 10:44',
    recommended: true,
    published: true,
  },
  {
    id: 10,
    code: '1210009880049',
    name: '\u0e1b\u0e23\u0e30\u0e15\u0e39\u0e44\u0e21\u0e49\u0e2d\u0e31\u0e14 HDF Flush Door',
    type: '\u0e1c\u0e25\u0e34\u0e15\u0e20\u0e31\u0e13\u0e11\u0e4c\u0e2a\u0e33\u0e40\u0e23\u0e47\u0e08',
    category: '\u0e1a\u0e32\u0e19\u0e1b\u0e23\u0e30\u0e15\u0e39',
    publishStart: '\u0e27\u0e31\u0e19\u0e2d\u0e31\u0e07\u0e04\u0e32\u0e23 \u0e17\u0e35\u0e48 28 \u0e15\u0e38\u0e25\u0e32\u0e04\u0e21 \u0e1e.\u0e28. 2568 \u0e40\u0e27\u0e25\u0e32 10:44',
    publishEnd: '\u0e27\u0e31\u0e19\u0e2d\u0e31\u0e07\u0e04\u0e32\u0e23 \u0e17\u0e35\u0e48 28 \u0e15\u0e38\u0e25\u0e32\u0e04\u0e21 \u0e1e.\u0e28. 2569 \u0e40\u0e27\u0e25\u0e32 10:44',
    recommended: false,
    published: false,
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

/* ------------------------------------------------------------------ */
/*  Page component                                                     */
/* ------------------------------------------------------------------ */
export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRows, setSelectedRows] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const totalEntries = 2000
  const totalPages = 10

  const allSelected = selectedRows.length === MOCK_PRODUCTS.length
  const someSelected = selectedRows.length > 0 && !allSelected

  function toggleSelectAll() {
    if (allSelected) {
      setSelectedRows([])
    } else {
      setSelectedRows(MOCK_PRODUCTS.map((p) => p.id))
    }
  }

  function toggleSelectRow(id) {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    )
  }

  /* ---------- Render helpers ---------- */

  function renderRecommendedBadge(isRecommended) {
    if (isRecommended) {
      return (
        <span className="inline-flex items-center gap-[4px] rounded-full border border-[#22c55e] text-[#16a34a] bg-[#f0fdf4] px-[10px] py-[2px] text-[12px] font-medium leading-[20px] whitespace-nowrap">
          YES
          <ChevronDownIcon className="text-[#16a34a]" />
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-[4px] rounded-full border border-[#f97316] text-[#ea580c] bg-[#fff7ed] px-[10px] py-[2px] text-[12px] font-medium leading-[20px] whitespace-nowrap">
        NO
        <ChevronDownIcon className="text-[#ea580c]" />
      </span>
    )
  }

  function renderPublishBadge(isPublished) {
    if (isPublished) {
      return (
        <span className="inline-flex items-center gap-[4px] rounded-full border border-[#22c55e] text-[#16a34a] bg-[#f0fdf4] px-[10px] py-[2px] text-[12px] font-medium leading-[20px] whitespace-nowrap">
          {'\u0e40\u0e1c\u0e22\u0e41\u0e1e\u0e23\u0e48'}
          <ChevronDownIcon className="text-[#16a34a]" />
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-[4px] rounded-full border border-[#d1d5db] text-[#6b7280] bg-[#f9fafb] px-[10px] py-[2px] text-[12px] font-medium leading-[20px] whitespace-nowrap">
        {'\u0e44\u0e21\u0e48\u0e41\u0e2a\u0e14\u0e07'}
        <ChevronDownIcon className="text-[#6b7280]" />
      </span>
    )
  }

  function renderPageNumbers() {
    const pages = []

    /* Previous arrow */
    pages.push(
      <button
        key="prev"
        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
        disabled={currentPage === 1}
        className="size-[32px] flex items-center justify-center rounded-[6px] border border-[#e5e7eb] bg-white text-[#6b7280] hover:bg-[#f9fafb] disabled:opacity-40 disabled:cursor-not-allowed"
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
          className={`size-[32px] flex items-center justify-center rounded-[6px] text-[13px] font-medium ${
            currentPage === i
              ? 'bg-[#ff7e1b] text-white border border-[#ff7e1b]'
              : 'border border-[#e5e7eb] bg-white text-[#374151] hover:bg-[#f9fafb]'
          }`}
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
          className={`size-[32px] flex items-center justify-center rounded-[6px] text-[13px] font-medium ${
            currentPage === i
              ? 'bg-[#ff7e1b] text-white border border-[#ff7e1b]'
              : 'border border-[#e5e7eb] bg-white text-[#374151] hover:bg-[#f9fafb]'
          }`}
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
        className="size-[32px] flex items-center justify-center rounded-[6px] border border-[#e5e7eb] bg-white text-[#6b7280] hover:bg-[#f9fafb] disabled:opacity-40 disabled:cursor-not-allowed"
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
            {'\u0e2a\u0e34\u0e19\u0e04\u0e49\u0e32 (Product)'}
          </h1>
          <p className="text-[13px] text-[#6b7280] m-0">
            {totalEntries.toLocaleString()} entries found
          </p>
        </div>
        <div className="flex items-center gap-[12px]">
          <Link
            href="/admin/products/create"
            className="inline-flex items-center gap-[6px] bg-[#ff7e1b] hover:bg-[#e96d0f] text-white text-[14px] font-semibold rounded-[8px] px-[16px] py-[9px] no-underline transition-colors"
          >
            <PlusIcon />
            Create new entry
          </Link>
          {/* Language selector */}
          <div className="flex items-center gap-[8px] border border-[#e5e7eb] rounded-[8px] px-[12px] py-[6px] cursor-pointer hover:bg-[#f9fafb]">
            <span className="text-[13px] text-[#4b5563]">Thai (th)</span>
            <ChevronDownIcon className="text-[#6b7280]" />
          </div>
          {/* Settings */}
          <button className="size-[32px] flex items-center justify-center rounded-[8px] hover:bg-gray-100" aria-label="Settings">
            <SettingsIcon />
          </button>
        </div>
      </div>

      {/* ---- Search + Filter bar ---- */}
      <div className="flex items-center justify-between gap-[12px]">
        <div className="flex items-center gap-[10px] flex-1">
          {/* Search input */}
          <div className="relative flex-1 max-w-[360px]">
            <div className="absolute left-[10px] top-1/2 -translate-y-1/2 pointer-events-none">
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder={'\u0e04\u0e49\u0e19\u0e2b\u0e32...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-[38px] pl-[36px] pr-[12px] border border-[#e5e7eb] rounded-[8px] text-[13px] text-[#374151] placeholder-[#9ca3af] outline-none focus:border-[#ff7e1b] focus:ring-1 focus:ring-[#ff7e1b] transition-colors bg-white"
            />
          </div>
          {/* Filter button */}
          <button className="inline-flex items-center gap-[6px] h-[38px] px-[14px] border border-[#e5e7eb] rounded-[8px] bg-white text-[13px] text-[#4b5563] hover:bg-[#f9fafb] transition-colors">
            <FilterIcon />
            {'\u0e15\u0e31\u0e27\u0e01\u0e23\u0e2d\u0e07'}
          </button>
        </div>
      </div>

      {/* ---- Table ---- */}
      <div className="border border-[#e5e7eb] rounded-[10px] overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[1200px]">
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
                <th className="w-[60px] px-[10px] py-[10px] text-left text-[12px] font-semibold text-[#6b7280] uppercase tracking-wider whitespace-nowrap">
                  {'\u0e25\u0e33\u0e14\u0e31\u0e1a'}
                </th>
                {/* Product code */}
                <th className="px-[10px] py-[10px] text-left text-[12px] font-semibold text-[#6b7280] uppercase tracking-wider whitespace-nowrap">
                  {'\u0e23\u0e2b\u0e31\u0e2a\u0e2a\u0e34\u0e19\u0e04\u0e49\u0e32'}
                </th>
                {/* Image */}
                <th className="w-[80px] px-[10px] py-[10px] text-left text-[12px] font-semibold text-[#6b7280] uppercase tracking-wider whitespace-nowrap">
                  IMAGE / {'\u0e23\u0e39\u0e1b\u0e20\u0e32\u0e1e'}
                </th>
                {/* Product name */}
                <th className="px-[10px] py-[10px] text-left text-[12px] font-semibold text-[#6b7280] uppercase tracking-wider whitespace-nowrap">
                  {'\u0e0a\u0e37\u0e48\u0e2d\u0e2a\u0e34\u0e19\u0e04\u0e49\u0e32'}
                </th>
                {/* Product type */}
                <th className="px-[10px] py-[10px] text-left text-[12px] font-semibold text-[#6b7280] uppercase tracking-wider whitespace-nowrap">
                  {'\u0e1b\u0e23\u0e30\u0e40\u0e20\u0e17\u0e2a\u0e34\u0e19\u0e04\u0e49\u0e32'}
                </th>
                {/* Product category */}
                <th className="px-[10px] py-[10px] text-left text-[12px] font-semibold text-[#6b7280] uppercase tracking-wider whitespace-nowrap">
                  {'\u0e2b\u0e21\u0e27\u0e14\u0e2b\u0e21\u0e39\u0e48\u0e2a\u0e34\u0e19\u0e04\u0e49\u0e32'}
                </th>
                {/* Publish date range */}
                <th className="px-[10px] py-[10px] text-left text-[12px] font-semibold text-[#6b7280] uppercase tracking-wider">
                  <span className="block leading-[1.4]">
                    {'\u0e0a\u0e48\u0e27\u0e07\u0e27\u0e31\u0e19\u0e40\u0e27\u0e25\u0e32\u0e40\u0e23\u0e34\u0e48\u0e21\u0e15\u0e49\u0e19-\u0e2a\u0e34\u0e49\u0e19\u0e2a\u0e38\u0e14'}
                  </span>
                  <span className="block leading-[1.4]">
                    {'\u0e01\u0e32\u0e23\u0e40\u0e1c\u0e22\u0e41\u0e1e\u0e23\u0e48'}
                  </span>
                </th>
                {/* Recommended status */}
                <th className="px-[10px] py-[10px] text-left text-[12px] font-semibold text-[#6b7280] uppercase tracking-wider whitespace-nowrap">
                  {'\u0e2a\u0e16\u0e32\u0e19\u0e30\u0e2a\u0e34\u0e19\u0e04\u0e49\u0e32\u0e41\u0e19\u0e30\u0e19\u0e33'}
                </th>
                {/* Publish status */}
                <th className="px-[10px] py-[10px] text-left text-[12px] font-semibold text-[#6b7280] uppercase tracking-wider whitespace-nowrap">
                  {'\u0e2a\u0e16\u0e32\u0e19\u0e30\u0e40\u0e1c\u0e22\u0e41\u0e1e\u0e23\u0e48'}
                </th>
                {/* Action */}
                <th className="w-[56px] px-[10px] py-[10px] text-center text-[12px] font-semibold text-[#6b7280] uppercase tracking-wider">
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody>
              {MOCK_PRODUCTS.map((product, index) => (
                <tr
                  key={product.id}
                  className="border-t border-[#f3f4f6] hover:bg-[#fafafa] transition-colors"
                >
                  {/* Checkbox */}
                  <td className="px-[12px] py-[10px]">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(product.id)}
                      onChange={() => toggleSelectRow(product.id)}
                      className="size-[16px] accent-[#ff7e1b] cursor-pointer rounded"
                      aria-label={`Select ${product.name}`}
                    />
                  </td>
                  {/* Order */}
                  <td className="px-[10px] py-[10px] text-[13px] text-[#374151]">
                    {index + 1}
                  </td>
                  {/* Product code */}
                  <td className="px-[10px] py-[10px] text-[13px] text-[#374151] font-mono">
                    {product.code}
                  </td>
                  {/* Image placeholder */}
                  <td className="px-[10px] py-[10px]">
                    <div
                      className="w-[64px] h-[48px] rounded-[6px] bg-[#e5e7eb] flex items-center justify-center"
                      aria-label={`Product image for ${product.name}`}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                    </div>
                  </td>
                  {/* Product name */}
                  <td className="px-[10px] py-[10px] text-[13px] text-[#374151] max-w-[200px]">
                    <span className="line-clamp-2">{product.name}</span>
                  </td>
                  {/* Product type */}
                  <td className="px-[10px] py-[10px] text-[13px] text-[#374151] whitespace-nowrap">
                    {product.type}
                  </td>
                  {/* Category */}
                  <td className="px-[10px] py-[10px] text-[13px] text-[#374151] whitespace-nowrap">
                    {product.category}
                  </td>
                  {/* Publish date range */}
                  <td className="px-[10px] py-[10px] text-[12px] text-[#6b7280] min-w-[200px]">
                    <div className="leading-[1.5]">{product.publishStart}</div>
                    <div className="leading-[1.5] mt-[2px]">{product.publishEnd}</div>
                  </td>
                  {/* Recommended status */}
                  <td className="px-[10px] py-[10px]">
                    {renderRecommendedBadge(product.recommended)}
                  </td>
                  {/* Publish status */}
                  <td className="px-[10px] py-[10px]">
                    {renderPublishBadge(product.published)}
                  </td>
                  {/* Action dots */}
                  <td className="px-[10px] py-[10px] text-center">
                    <button
                      className="size-[32px] inline-flex items-center justify-center rounded-[6px] hover:bg-[#f3f4f6] transition-colors"
                      aria-label={`Actions for ${product.name}`}
                    >
                      <DotsIcon />
                    </button>
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
              className="appearance-none h-[34px] pl-[10px] pr-[28px] border border-[#e5e7eb] rounded-[6px] bg-white text-[13px] text-[#374151] cursor-pointer focus:outline-none focus:border-[#ff7e1b]"
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
            {'\u0e23\u0e32\u0e22\u0e01\u0e32\u0e23\u0e15\u0e48\u0e2d\u0e2b\u0e19\u0e49\u0e32'}
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
