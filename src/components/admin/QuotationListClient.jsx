'use client'

import { useState, useRef, useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { updateQuotationStatus, deleteQuotation } from '@/lib/actions/quotations'

/* ------------------------------------------------------------------ */
/*  Status configuration                                               */
/* ------------------------------------------------------------------ */
const STATUS_CONFIG = {
  pending: {
    label: 'รอพิจารณา',
    bg: 'bg-[#fef3c7]',
    text: 'text-[#92400e]',
    border: 'border-[#fcd34d]',
  },
  approved: {
    label: 'อนุมัติใบเสนอราคา',
    bg: 'bg-[#d1fae5]',
    text: 'text-[#065f46]',
    border: 'border-[#6ee7b7]',
  },
  rejected: {
    label: 'ไม่อนุมัติใบเสนอราคา',
    bg: 'bg-[#fee2e2]',
    text: 'text-[#991b1b]',
    border: 'border-[#fca5a5]',
  },
}

const STATUS_OPTIONS = [
  { value: 'pending', label: 'รอการพิจารณา' },
  { value: 'approved', label: 'อนุมัติใบเสนอราคา' },
  { value: 'rejected', label: 'ไม่อนุมัติใบเสนอราคา' },
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

function ChevronDownIcon({ className = '' }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="6 9 12 15 18 9" />
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
export default function QuotationListClient({ quotations, totalCount }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRows, setSelectedRows] = useState([])
  const [sortField, setSortField] = useState('quotation_number')
  const [sortAsc, setSortAsc] = useState(false)
  const [openStatusId, setOpenStatusId] = useState(null)
  const statusMenuRef = useRef(null)

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

  const filtered = quotations.filter(
    (q) =>
      !searchQuery ||
      q.quotation_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.requester_name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  /* Selection helpers */
  const allSelected = selectedRows.length === filtered.length && filtered.length > 0
  const someSelected = selectedRows.length > 0 && !allSelected

  function toggleSelectAll() {
    if (allSelected) {
      setSelectedRows([])
    } else {
      setSelectedRows(filtered.map((q) => q.id))
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

  const sortedQuotations = [...filtered].sort((a, b) => {
    const valA = a[sortField] || ''
    const valB = b[sortField] || ''
    if (valA < valB) return sortAsc ? -1 : 1
    if (valA > valB) return sortAsc ? 1 : -1
    return 0
  })

  /* Status change handler */
  function handleStatusChange(quotationId, newStatus) {
    startTransition(async () => {
      await updateQuotationStatus(quotationId, newStatus)
      setOpenStatusId(null)
      router.refresh()
    })
  }

  /* Format date */
  function formatDate(dateStr) {
    if (!dateStr) return '-'
    try {
      const d = new Date(dateStr)
      return d.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return dateStr
    }
  }

  /* ---------- Status badge render ---------- */
  function renderStatusBadge(quotation) {
    const config = STATUS_CONFIG[quotation.status] || STATUS_CONFIG.pending
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
        >
          {config.label}
          <ChevronDownIcon />
        </button>

        {isOpen && (
          <div
            className="absolute left-0 top-[32px] z-30 bg-white border border-[#e5e7eb] rounded-[8px] shadow-lg py-[4px] min-w-[220px]"
            role="listbox"
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
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  /* ================================================================ */
  /*  JSX                                                              */
  /* ================================================================ */
  return (
    <div className={`font-['IBM_Plex_Sans_Thai'] flex flex-col gap-[20px] ${isPending ? 'opacity-60 pointer-events-none' : ''}`}>
      {/* ---- Page header ---- */}
      <div className="flex items-center justify-between py-[12px]">
        <div className="flex flex-col gap-[2px]">
          <h1 className="text-[22px] font-bold text-[#1f2937] m-0 leading-[1.3]">
            จัดการใบเสนอราคา/ Manage Quotation
          </h1>
          <p className="text-[13px] text-[#6b7280] m-0">
            {totalCount} entries found
          </p>
        </div>
        <div className="flex items-center gap-[12px]">
          <button
            className="inline-flex items-center gap-[6px] bg-[#ff7e1b] hover:bg-[#e96d0f] text-white text-[14px] font-semibold rounded-[8px] px-[16px] py-[9px] border-none cursor-pointer transition-colors"
          >
            <DownloadIcon />
            Export CSV
          </button>
        </div>
      </div>

      {/* ---- Search bar ---- */}
      <div className="flex items-center gap-[10px]">
        <div className="relative flex-1 max-w-[360px]">
          <div className="absolute left-[10px] top-1/2 -translate-y-1/2 pointer-events-none">
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder="ค้นหา..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[38px] pl-[36px] pr-[12px] border border-[#e5e7eb] rounded-[8px] text-[13px] text-[#374151] placeholder-[#9ca3af] outline-none focus:border-[#ff7e1b] focus:ring-1 focus:ring-[#ff7e1b] transition-colors bg-white"
          />
        </div>
      </div>

      {/* ---- Table ---- */}
      <div className="border border-[#e5e7eb] rounded-[10px] overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-[#f9fafb]">
                <th className="w-[44px] px-[12px] py-[10px] text-left">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = someSelected
                    }}
                    onChange={toggleSelectAll}
                    className="size-[16px] accent-[#ff7e1b] cursor-pointer rounded"
                  />
                </th>
                <th className="w-[60px] px-[10px] py-[10px] text-left text-[12px] font-semibold text-[#6b7280] uppercase tracking-wider whitespace-nowrap">
                  ลำดับ
                </th>
                <th
                  className="px-[10px] py-[10px] text-left text-[12px] font-semibold text-[#6b7280] uppercase tracking-wider whitespace-nowrap cursor-pointer select-none"
                  onClick={() => handleSort('quotation_number')}
                >
                  <div className="flex items-center gap-[4px]">
                    <span>เลขที่ใบเสนอราคา</span>
                    <SortArrowIcon ascending={sortField === 'quotation_number' ? sortAsc : true} />
                  </div>
                </th>
                <th className="px-[10px] py-[10px] text-left text-[12px] font-semibold text-[#6b7280] uppercase tracking-wider whitespace-nowrap">
                  สินค้า
                </th>
                <th className="px-[10px] py-[10px] text-left text-[12px] font-semibold text-[#6b7280] uppercase tracking-wider whitespace-nowrap">
                  ชื่อผู้ขอ
                </th>
                <th className="px-[10px] py-[10px] text-left text-[12px] font-semibold text-[#6b7280] uppercase tracking-wider whitespace-nowrap">
                  วันขอใบเสนอราคา
                </th>
                <th className="px-[10px] py-[10px] text-left text-[12px] font-semibold text-[#6b7280] uppercase tracking-wider">
                  สถานะ
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedQuotations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-[40px] text-[14px] text-[#9ca3af]">
                    ยังไม่มีข้อมูลใบเสนอราคา
                  </td>
                </tr>
              ) : (
                sortedQuotations.map((quotation, index) => (
                  <tr
                    key={quotation.id}
                    className="border-t border-[#f3f4f6] hover:bg-[#fafafa] transition-colors"
                  >
                    <td className="px-[12px] py-[10px]">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(quotation.id)}
                        onChange={(e) => {
                          e.stopPropagation()
                          toggleSelectRow(quotation.id)
                        }}
                        className="size-[16px] accent-[#ff7e1b] cursor-pointer rounded"
                      />
                    </td>
                    <td className="px-[10px] py-[10px] text-[13px] text-[#374151]">
                      {index + 1}
                    </td>
                    <td className="px-[10px] py-[10px] text-[13px] text-[#374151] font-mono">
                      <Link
                        href={`/admin/quotations/${quotation.id}`}
                        className="text-[#374151] no-underline hover:text-[#ff7e1b] transition-colors"
                      >
                        {quotation.quotation_number}
                      </Link>
                    </td>
                    <td className="px-[10px] py-[10px] text-[13px] text-[#374151] max-w-[240px]">
                      <Link
                        href={`/admin/quotations/${quotation.id}`}
                        className="text-[#374151] no-underline hover:text-[#ff7e1b] transition-colors"
                      >
                        <span className="line-clamp-2">
                          {quotation.product?.name || '-'}
                        </span>
                      </Link>
                    </td>
                    <td className="px-[10px] py-[10px] text-[13px] text-[#374151] whitespace-nowrap">
                      {quotation.requester_name}
                    </td>
                    <td className="px-[10px] py-[10px] text-[12px] text-[#6b7280] min-w-[200px]">
                      {formatDate(quotation.created_at)}
                    </td>
                    <td className="px-[10px] py-[10px]">
                      {renderStatusBadge(quotation)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
