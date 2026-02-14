'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */
const MOCK_QUOTATIONS = [
  {
    id: 1,
    quotationNo: 'EQT2568130010',
    productCode: '10260',
    productName: '\u0e1b\u0e23\u0e30\u0e15\u0e39\u0e1a\u0e32\u0e19\u0e40\u0e23\u0e35\u0e22\u0e1a (HDF \u0e1b\u0e34\u0e14\u0e1c\u0e34\u0e27\u0e40\u0e21\u0e25\u0e32\u0e21\u0e35\u0e19) Wood Smith',
    requesterName: 'Fullname',
    requestDate: '\u0e27\u0e31\u0e19\u0e2d\u0e31\u0e07\u0e04\u0e32\u0e23 \u0e17\u0e35\u0e48 28 \u0e15\u0e38\u0e25\u0e32\u0e04\u0e21 \u0e1e.\u0e28. 2568 \u0e40\u0e27\u0e25\u0e32 17:41',
    status: 'pending',
  },
  {
    id: 2,
    quotationNo: 'EQT2568130009',
    productCode: '10260',
    productName: '\u0e1b\u0e23\u0e30\u0e15\u0e39\u0e40\u0e21\u0e25\u0e32\u0e21\u0e35\u0e19 \u0e01\u0e31\u0e19\u0e19\u0e49\u0e33\u0e2d\u0e34\u0e15\u0e15\u0e23\u0e49\u0e32 MELAMINE DOOR',
    requesterName: 'John Doe',
    requestDate: '\u0e27\u0e31\u0e19\u0e2d\u0e31\u0e07\u0e04\u0e32\u0e23 \u0e17\u0e35\u0e48 28 \u0e15\u0e38\u0e25\u0e32\u0e04\u0e21 \u0e1e.\u0e28. 2568 \u0e40\u0e27\u0e25\u0e32 17:41',
    status: 'approved',
  },
  {
    id: 3,
    quotationNo: 'EQT2568130008',
    productCode: '10261',
    productName: '\u0e1b\u0e23\u0e30\u0e15\u0e39\u0e1a\u0e32\u0e19\u0e40\u0e23\u0e35\u0e22\u0e1a (HDF \u0e1b\u0e34\u0e14\u0e1c\u0e34\u0e27\u0e40\u0e21\u0e25\u0e32\u0e21\u0e35\u0e19) Wood Smith',
    requesterName: 'Fullname',
    requestDate: '\u0e27\u0e31\u0e19\u0e2d\u0e31\u0e07\u0e04\u0e32\u0e23 \u0e17\u0e35\u0e48 28 \u0e15\u0e38\u0e25\u0e32\u0e04\u0e21 \u0e1e.\u0e28. 2568 \u0e40\u0e27\u0e25\u0e32 17:41',
    status: 'rejected',
  },
  {
    id: 4,
    quotationNo: 'EQT2568130007',
    productCode: '10262',
    productName: '\u0e1b\u0e23\u0e30\u0e15\u0e39\u0e25\u0e39\u0e01\u0e1f\u0e31\u0e01 HMR+ HDF HMR Moulded Door',
    requesterName: 'Jane Smith',
    requestDate: '\u0e27\u0e31\u0e19\u0e2d\u0e31\u0e07\u0e04\u0e32\u0e23 \u0e17\u0e35\u0e48 28 \u0e15\u0e38\u0e25\u0e32\u0e04\u0e21 \u0e1e.\u0e28. 2568 \u0e40\u0e27\u0e25\u0e32 17:41',
    status: 'pending',
  },
  {
    id: 5,
    quotationNo: 'EQT2568130006',
    productCode: '10260',
    productName: '\u0e1b\u0e23\u0e30\u0e15\u0e39\u0e40\u0e21\u0e25\u0e32\u0e21\u0e35\u0e19 \u0e01\u0e31\u0e19\u0e19\u0e49\u0e33\u0e2d\u0e34\u0e15\u0e15\u0e23\u0e49\u0e32 MELAMINE DOOR',
    requesterName: 'Fullname',
    requestDate: '\u0e27\u0e31\u0e19\u0e2d\u0e31\u0e07\u0e04\u0e32\u0e23 \u0e17\u0e35\u0e48 28 \u0e15\u0e38\u0e25\u0e32\u0e04\u0e21 \u0e1e.\u0e28. 2568 \u0e40\u0e27\u0e25\u0e32 17:41',
    status: 'approved',
  },
  {
    id: 6,
    quotationNo: 'EQT2568130005',
    productCode: '10263',
    productName: '\u0e1b\u0e23\u0e30\u0e15\u0e39\u0e1a\u0e32\u0e19\u0e40\u0e25\u0e37\u0e48\u0e2d\u0e19 uPVC Door',
    requesterName: 'John Doe',
    requestDate: '\u0e27\u0e31\u0e19\u0e2d\u0e31\u0e07\u0e04\u0e32\u0e23 \u0e17\u0e35\u0e48 28 \u0e15\u0e38\u0e25\u0e32\u0e04\u0e21 \u0e1e.\u0e28. 2568 \u0e40\u0e27\u0e25\u0e32 17:41',
    status: 'pending',
  },
  {
    id: 7,
    quotationNo: 'EQT2568130004',
    productCode: '10264',
    productName: '\u0e27\u0e07\u0e01\u0e1a\u0e1b\u0e23\u0e30\u0e15\u0e39 PVC Door Frame',
    requesterName: 'Fullname',
    requestDate: '\u0e27\u0e31\u0e19\u0e2d\u0e31\u0e07\u0e04\u0e32\u0e23 \u0e17\u0e35\u0e48 28 \u0e15\u0e38\u0e25\u0e32\u0e04\u0e21 \u0e1e.\u0e28. 2568 \u0e40\u0e27\u0e25\u0e32 17:41',
    status: 'approved',
  },
  {
    id: 8,
    quotationNo: 'EQT2568130003',
    productCode: '10260',
    productName: '\u0e1b\u0e23\u0e30\u0e15\u0e39\u0e1a\u0e32\u0e19\u0e40\u0e23\u0e35\u0e22\u0e1a (HDF \u0e1b\u0e34\u0e14\u0e1c\u0e34\u0e27\u0e40\u0e21\u0e25\u0e32\u0e21\u0e35\u0e19) Wood Smith',
    requesterName: 'Jane Smith',
    requestDate: '\u0e27\u0e31\u0e19\u0e2d\u0e31\u0e07\u0e04\u0e32\u0e23 \u0e17\u0e35\u0e48 28 \u0e15\u0e38\u0e25\u0e32\u0e04\u0e21 \u0e1e.\u0e28. 2568 \u0e40\u0e27\u0e25\u0e32 17:41',
    status: 'rejected',
  },
  {
    id: 9,
    quotationNo: 'EQT2568130002',
    productCode: '10265',
    productName: '\u0e44\u0e21\u0e49\u0e2d\u0e31\u0e14\u0e1b\u0e34\u0e14\u0e1c\u0e34\u0e27 Laminate Plywood',
    requesterName: 'John Doe',
    requestDate: '\u0e27\u0e31\u0e19\u0e2d\u0e31\u0e07\u0e04\u0e32\u0e23 \u0e17\u0e35\u0e48 28 \u0e15\u0e38\u0e25\u0e32\u0e04\u0e21 \u0e1e.\u0e28. 2568 \u0e40\u0e27\u0e25\u0e32 17:41',
    status: 'pending',
  },
  {
    id: 10,
    quotationNo: 'EQT2568130001',
    productCode: '10261',
    productName: '\u0e1b\u0e23\u0e30\u0e15\u0e39\u0e44\u0e21\u0e49\u0e2d\u0e31\u0e14 HDF Flush Door',
    requesterName: 'Fullname',
    requestDate: '\u0e27\u0e31\u0e19\u0e2d\u0e31\u0e07\u0e04\u0e32\u0e23 \u0e17\u0e35\u0e48 28 \u0e15\u0e38\u0e25\u0e32\u0e04\u0e21 \u0e1e.\u0e28. 2568 \u0e40\u0e27\u0e25\u0e32 17:41',
    status: 'approved',
  },
]

/* ------------------------------------------------------------------ */
/*  Status configuration                                               */
/* ------------------------------------------------------------------ */
const STATUS_CONFIG = {
  pending: {
    label: '\u0e23\u0e2d\u0e1e\u0e34\u0e08\u0e32\u0e23\u0e13\u0e32',
    bg: 'bg-[#fef3c7]',
    text: 'text-[#92400e]',
    border: 'border-[#fcd34d]',
  },
  approved: {
    label: '\u0e2d\u0e19\u0e38\u0e21\u0e31\u0e15\u0e34\u0e43\u0e1a\u0e40\u0e2a\u0e19\u0e2d\u0e23\u0e32\u0e04\u0e32',
    bg: 'bg-[#d1fae5]',
    text: 'text-[#065f46]',
    border: 'border-[#6ee7b7]',
  },
  rejected: {
    label: '\u0e44\u0e21\u0e48\u0e2d\u0e19\u0e38\u0e21\u0e31\u0e15\u0e34\u0e43\u0e1a\u0e40\u0e2a\u0e19\u0e2d\u0e23\u0e32\u0e04\u0e32',
    bg: 'bg-[#fee2e2]',
    text: 'text-[#991b1b]',
    border: 'border-[#fca5a5]',
  },
}

const STATUS_OPTIONS = [
  { value: 'pending', icon: '\u23f3', label: '\u0e23\u0e2d\u0e01\u0e32\u0e23\u0e1e\u0e34\u0e08\u0e32\u0e23\u0e13\u0e32' },
  { value: 'approved', icon: '\u2705', label: '\u0e2d\u0e19\u0e38\u0e21\u0e31\u0e15\u0e34\u0e43\u0e1a\u0e40\u0e2a\u0e19\u0e2d\u0e23\u0e32\u0e04\u0e32' },
  { value: 'rejected', icon: '\u274c', label: '\u0e44\u0e21\u0e48\u0e2d\u0e19\u0e38\u0e21\u0e31\u0e15\u0e34\u0e43\u0e1a\u0e40\u0e2a\u0e19\u0e2d\u0e23\u0e32\u0e04\u0e32' },
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

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
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

/* ------------------------------------------------------------------ */
/*  Page component                                                     */
/* ------------------------------------------------------------------ */
export default function QuotationsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRows, setSelectedRows] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [sortField, setSortField] = useState('quotationNo')
  const [sortAsc, setSortAsc] = useState(false)
  const [quotations, setQuotations] = useState(MOCK_QUOTATIONS)
  const [openStatusId, setOpenStatusId] = useState(null)
  const statusMenuRef = useRef(null)

  const totalEntries = 200
  const totalPages = 10

  /* Close status dropdown on outside click */
  useEffect(() => {
    function handleClickOutside(e) {
      if (statusMenuRef.current && !statusMenuRef.current.contains(e.target)) {
        setOpenStatusId(null)
      }
    }
    if (openStatusId !== null) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [openStatusId])

  /* Selection helpers */
  const allSelected = selectedRows.length === quotations.length && quotations.length > 0
  const someSelected = selectedRows.length > 0 && !allSelected

  function toggleSelectAll() {
    if (allSelected) {
      setSelectedRows([])
    } else {
      setSelectedRows(quotations.map((q) => q.id))
    }
  }

  function toggleSelectRow(id) {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    )
  }

  /* Sorting */
  function handleSort(field) {
    if (sortField === field) {
      setSortAsc((prev) => !prev)
    } else {
      setSortField(field)
      setSortAsc(true)
    }
  }

  const sortedQuotations = [...quotations].sort((a, b) => {
    const valA = a[sortField] || ''
    const valB = b[sortField] || ''
    if (valA < valB) return sortAsc ? -1 : 1
    if (valA > valB) return sortAsc ? 1 : -1
    return 0
  })

  /* Status change handler */
  function handleStatusChange(quotationId, newStatus) {
    setQuotations((prev) =>
      prev.map((q) => (q.id === quotationId ? { ...q, status: newStatus } : q))
    )
    setOpenStatusId(null)
  }

  /* ---------- Status badge render ---------- */
  function renderStatusBadge(quotation) {
    const config = STATUS_CONFIG[quotation.status]
    const isOpen = openStatusId === quotation.id

    return (
      <div
        className="relative inline-block"
        ref={isOpen ? statusMenuRef : null}
      >
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setOpenStatusId(isOpen ? null : quotation.id)
          }}
          className={`inline-flex items-center gap-[4px] rounded-full border ${config.border} ${config.text} ${config.bg} px-[10px] py-[2px] text-[12px] font-medium leading-[20px] whitespace-nowrap cursor-pointer bg-transparent transition-colors`}
          style={{ borderWidth: '1px' }}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-label={`Status: ${config.label}`}
        >
          {config.label}
          <ChevronDownIcon className={config.text.replace('text-', 'text-')} />
        </button>

        {isOpen && (
          <div
            className="absolute left-0 top-[32px] z-30 bg-white border border-[#e5e7eb] rounded-[8px] shadow-lg py-[4px] min-w-[220px]"
            role="listbox"
            aria-label="Change status"
          >
            {STATUS_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleStatusChange(quotation.id, option.value)
                }}
                className={`flex items-center gap-[8px] w-full px-[12px] py-[8px] text-[13px] hover:bg-[#f9fafb] border-none bg-transparent cursor-pointer transition-colors text-left ${
                  quotation.status === option.value
                    ? 'text-[#1f2937] font-medium bg-[#f9fafb]'
                    : 'text-[#374151]'
                }`}
                role="option"
                aria-selected={quotation.status === option.value}
              >
                <span className="text-[14px]">{option.icon}</span>
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
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
            {'\u0e08\u0e31\u0e14\u0e01\u0e32\u0e23\u0e43\u0e1a\u0e40\u0e2a\u0e19\u0e2d\u0e23\u0e32\u0e04\u0e32/ Manage Quotation'}
          </h1>
          <p className="text-[13px] text-[#6b7280] m-0">
            {totalEntries} entries found
          </p>
        </div>
        <div className="flex items-center gap-[12px]">
          {/* Export CSV button */}
          <button
            className="inline-flex items-center gap-[6px] bg-[#ff7e1b] hover:bg-[#e96d0f] text-white text-[14px] font-semibold rounded-[8px] px-[16px] py-[9px] border-none cursor-pointer transition-colors"
            aria-label="Export CSV"
          >
            <DownloadIcon />
            Export CSV
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
              aria-label="Search quotations"
            />
          </div>
          {/* Filter button */}
          <button className="inline-flex items-center gap-[6px] h-[38px] px-[14px] border border-[#e5e7eb] rounded-[8px] bg-white text-[13px] text-[#4b5563] hover:bg-[#f9fafb] transition-colors cursor-pointer">
            <FilterIcon />
            {'\u0e15\u0e31\u0e27\u0e01\u0e23\u0e2d\u0e07'}
          </button>
        </div>

        <div className="flex items-center gap-[12px]">
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
                {/* Order number */}
                <th className="w-[60px] px-[10px] py-[10px] text-left text-[12px] font-semibold text-[#6b7280] uppercase tracking-wider whitespace-nowrap">
                  {'\u0e25\u0e33\u0e14\u0e31\u0e1a'}
                </th>
                {/* Quotation number - sortable */}
                <th
                  className="px-[10px] py-[10px] text-left text-[12px] font-semibold text-[#6b7280] uppercase tracking-wider whitespace-nowrap cursor-pointer select-none"
                  onClick={() => handleSort('quotationNo')}
                  aria-sort={sortField === 'quotationNo' ? (sortAsc ? 'ascending' : 'descending') : 'none'}
                >
                  <div className="flex items-center gap-[4px]">
                    <span>{'\u0e40\u0e25\u0e02\u0e17\u0e35\u0e48\u0e43\u0e1a\u0e40\u0e2a\u0e19\u0e2d\u0e23\u0e32\u0e04\u0e32'}</span>
                    <SortArrowIcon ascending={sortField === 'quotationNo' ? sortAsc : true} />
                  </div>
                </th>
                {/* Product code */}
                <th className="px-[10px] py-[10px] text-left text-[12px] font-semibold text-[#6b7280] uppercase tracking-wider whitespace-nowrap">
                  {'\u0e23\u0e2b\u0e31\u0e2a\u0e2a\u0e34\u0e19\u0e04\u0e49\u0e32'}
                </th>
                {/* Product name - sortable */}
                <th
                  className="px-[10px] py-[10px] text-left text-[12px] font-semibold text-[#6b7280] uppercase tracking-wider whitespace-nowrap cursor-pointer select-none"
                  onClick={() => handleSort('productName')}
                  aria-sort={sortField === 'productName' ? (sortAsc ? 'ascending' : 'descending') : 'none'}
                >
                  <div className="flex items-center gap-[4px]">
                    <span>{'\u0e0a\u0e37\u0e48\u0e2d\u0e2a\u0e34\u0e19\u0e04\u0e49\u0e32'}</span>
                    <SortArrowIcon ascending={sortField === 'productName' ? sortAsc : true} />
                  </div>
                </th>
                {/* Requester name */}
                <th className="px-[10px] py-[10px] text-left text-[12px] font-semibold text-[#6b7280] uppercase tracking-wider whitespace-nowrap">
                  {'\u0e0a\u0e37\u0e48\u0e2d\u0e1c\u0e39\u0e49\u0e02\u0e2d\u0e43\u0e1a\u0e40\u0e2a\u0e19\u0e2d\u0e23\u0e32\u0e04\u0e32'}
                </th>
                {/* Request date */}
                <th className="px-[10px] py-[10px] text-left text-[12px] font-semibold text-[#6b7280] uppercase tracking-wider whitespace-nowrap">
                  {'\u0e27\u0e31\u0e19\u0e02\u0e2d\u0e43\u0e1a\u0e40\u0e2a\u0e19\u0e2d\u0e23\u0e32\u0e04\u0e32'}
                </th>
                {/* Approval status */}
                <th className="px-[10px] py-[10px] text-left text-[12px] font-semibold text-[#6b7280] uppercase tracking-wider">
                  <span className="block leading-[1.4]">
                    {'\u0e2a\u0e16\u0e32\u0e19\u0e30\u0e01\u0e32\u0e23\u0e2d\u0e19\u0e38\u0e21\u0e31\u0e15\u0e34'}
                  </span>
                  <span className="block leading-[1.4]">
                    {'\u0e43\u0e1a\u0e40\u0e2a\u0e19\u0e2d\u0e23\u0e32\u0e04\u0e32'}
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedQuotations.map((quotation, index) => (
                <tr
                  key={quotation.id}
                  className="border-t border-[#f3f4f6] hover:bg-[#fafafa] transition-colors cursor-pointer"
                >
                  {/* Checkbox */}
                  <td className="px-[12px] py-[10px]">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(quotation.id)}
                      onChange={(e) => {
                        e.stopPropagation()
                        toggleSelectRow(quotation.id)
                      }}
                      className="size-[16px] accent-[#ff7e1b] cursor-pointer rounded"
                      aria-label={`Select quotation ${quotation.quotationNo}`}
                    />
                  </td>
                  {/* Order number */}
                  <td className="px-[10px] py-[10px] text-[13px] text-[#374151]">
                    {index + 1}
                  </td>
                  {/* Quotation number */}
                  <td className="px-[10px] py-[10px] text-[13px] text-[#374151] font-mono">
                    <Link
                      href={`/admin/quotations/${quotation.id}`}
                      className="text-[#374151] no-underline hover:text-[#ff7e1b] transition-colors"
                    >
                      {quotation.quotationNo}
                    </Link>
                  </td>
                  {/* Product code */}
                  <td className="px-[10px] py-[10px] text-[13px] text-[#374151] font-mono">
                    {quotation.productCode}
                  </td>
                  {/* Product name */}
                  <td className="px-[10px] py-[10px] text-[13px] text-[#374151] max-w-[240px]">
                    <Link
                      href={`/admin/quotations/${quotation.id}`}
                      className="text-[#374151] no-underline hover:text-[#ff7e1b] transition-colors"
                    >
                      <span className="line-clamp-2">{quotation.productName}</span>
                    </Link>
                  </td>
                  {/* Requester name */}
                  <td className="px-[10px] py-[10px] text-[13px] text-[#374151] whitespace-nowrap">
                    {quotation.requesterName}
                  </td>
                  {/* Request date */}
                  <td className="px-[10px] py-[10px] text-[12px] text-[#6b7280] min-w-[220px]">
                    <div className="leading-[1.5]">{quotation.requestDate}</div>
                  </td>
                  {/* Approval status */}
                  <td className="px-[10px] py-[10px]">
                    {renderStatusBadge(quotation)}
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
