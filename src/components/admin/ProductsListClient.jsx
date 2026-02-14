'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { deleteProduct, toggleProductRecommended, toggleProductPublished } from '@/lib/actions/products'

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

/* ------------------------------------------------------------------ */
/*  Date formatter helper                                              */
/* ------------------------------------------------------------------ */
function formatThaiDate(dateStr) {
  if (!dateStr) return '-'
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('th-TH', {
      weekday: 'long',
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

/* ------------------------------------------------------------------ */
/*  Type label mapping                                                 */
/* ------------------------------------------------------------------ */
const TYPE_LABELS = {
  construction: 'วัสดุก่อสร้าง',
  decoration: 'ผลิตภัณฑ์สำเร็จ',
  tool: 'เครื่องมือ',
}

/* ------------------------------------------------------------------ */
/*  Page component                                                     */
/* ------------------------------------------------------------------ */
export default function ProductsListClient({ products, totalCount }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRows, setSelectedRows] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [openMenuId, setOpenMenuId] = useState(null)

  const totalPages = Math.max(1, Math.ceil(totalCount / rowsPerPage))

  const allSelected = products.length > 0 && selectedRows.length === products.length
  const someSelected = selectedRows.length > 0 && !allSelected

  function toggleSelectAll() {
    if (allSelected) {
      setSelectedRows([])
    } else {
      setSelectedRows(products.map((p) => p.id))
    }
  }

  function toggleSelectRow(id) {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    )
  }

  function handleDelete(id) {
    if (!confirm('ต้องการลบสินค้านี้หรือไม่?')) return
    startTransition(async () => {
      const result = await deleteProduct(id)
      if (result.error) {
        alert('เกิดข้อผิดพลาด: ' + result.error)
      }
      setOpenMenuId(null)
      router.refresh()
    })
  }

  function handleToggleRecommended(id, current) {
    startTransition(async () => {
      await toggleProductRecommended(id, !current)
      router.refresh()
    })
  }

  function handleTogglePublished(id, current) {
    startTransition(async () => {
      await toggleProductPublished(id, !current)
      router.refresh()
    })
  }

  /* ---------- Render helpers ---------- */

  function renderRecommendedBadge(product) {
    if (product.recommended) {
      return (
        <button
          onClick={() => handleToggleRecommended(product.id, product.recommended)}
          className="inline-flex items-center gap-[4px] rounded-full border border-[#22c55e] text-[#16a34a] bg-[#f0fdf4] px-[10px] py-[2px] text-[12px] font-medium leading-[20px] whitespace-nowrap cursor-pointer"
        >
          YES
          <ChevronDownIcon className="text-[#16a34a]" />
        </button>
      )
    }
    return (
      <button
        onClick={() => handleToggleRecommended(product.id, product.recommended)}
        className="inline-flex items-center gap-[4px] rounded-full border border-[#f97316] text-[#ea580c] bg-[#fff7ed] px-[10px] py-[2px] text-[12px] font-medium leading-[20px] whitespace-nowrap cursor-pointer"
      >
        NO
        <ChevronDownIcon className="text-[#ea580c]" />
      </button>
    )
  }

  function renderPublishBadge(product) {
    if (product.published) {
      return (
        <button
          onClick={() => handleTogglePublished(product.id, product.published)}
          className="inline-flex items-center gap-[4px] rounded-full border border-[#22c55e] text-[#16a34a] bg-[#f0fdf4] px-[10px] py-[2px] text-[12px] font-medium leading-[20px] whitespace-nowrap cursor-pointer"
        >
          {'เผยแพร่'}
          <ChevronDownIcon className="text-[#16a34a]" />
        </button>
      )
    }
    return (
      <button
        onClick={() => handleTogglePublished(product.id, product.published)}
        className="inline-flex items-center gap-[4px] rounded-full border border-[#d1d5db] text-[#6b7280] bg-[#f9fafb] px-[10px] py-[2px] text-[12px] font-medium leading-[20px] whitespace-nowrap cursor-pointer"
      >
        {'ไม่แสดง'}
        <ChevronDownIcon className="text-[#6b7280]" />
      </button>
    )
  }

  function renderPageNumbers() {
    const pages = []

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

    const visiblePages = []
    for (let i = 1; i <= Math.min(3, totalPages); i++) visiblePages.push(i)
    if (totalPages > 6) visiblePages.push('...')
    for (let i = Math.max(totalPages - 2, 4); i <= totalPages; i++) visiblePages.push(i)

    for (const p of visiblePages) {
      if (p === '...') {
        pages.push(
          <span key="dots" className="flex items-center justify-center px-[4px] text-[13px] text-[#9ca3af] select-none">
            ...
          </span>
        )
      } else {
        pages.push(
          <button
            key={p}
            onClick={() => setCurrentPage(p)}
            className={`size-[32px] flex items-center justify-center rounded-[6px] text-[13px] font-medium ${
              currentPage === p
                ? 'bg-[#ff7e1b] text-white border border-[#ff7e1b]'
                : 'border border-[#e5e7eb] bg-white text-[#374151] hover:bg-[#f9fafb]'
            }`}
          >
            {p}
          </button>
        )
      }
    }

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

  function getPrimaryImage(product) {
    if (!product.product_images || product.product_images.length === 0) return null
    const primary = product.product_images.find((img) => img.is_primary)
    return primary?.url || product.product_images[0]?.url || null
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
            {'สินค้า (Product)'}
          </h1>
          <p className="text-[13px] text-[#6b7280] m-0">
            {totalCount.toLocaleString()} entries found
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
          <div className="flex items-center gap-[8px] border border-[#e5e7eb] rounded-[8px] px-[12px] py-[6px] cursor-pointer hover:bg-[#f9fafb]">
            <span className="text-[13px] text-[#4b5563]">Thai (th)</span>
            <ChevronDownIcon className="text-[#6b7280]" />
          </div>
          <button className="size-[32px] flex items-center justify-center rounded-[8px] hover:bg-gray-100" aria-label="Settings">
            <SettingsIcon />
          </button>
        </div>
      </div>

      {/* ---- Search + Filter bar ---- */}
      <div className="flex items-center justify-between gap-[12px]">
        <div className="flex items-center gap-[10px] flex-1">
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
            />
          </div>
          <button className="inline-flex items-center gap-[6px] h-[38px] px-[14px] border border-[#e5e7eb] rounded-[8px] bg-white text-[13px] text-[#4b5563] hover:bg-[#f9fafb] transition-colors">
            <FilterIcon />
            {'ตัวกรอง'}
          </button>
        </div>
      </div>

      {/* ---- Table ---- */}
      <div className="border border-[#e5e7eb] rounded-[10px] overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[1200px]">
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
                    aria-label="Select all rows"
                  />
                </th>
                <th className="w-[60px] px-[10px] py-[10px] text-left text-[12px] font-semibold text-[#6b7280] uppercase tracking-wider whitespace-nowrap">
                  {'ลำดับ'}
                </th>
                <th className="px-[10px] py-[10px] text-left text-[12px] font-semibold text-[#6b7280] uppercase tracking-wider whitespace-nowrap">
                  {'รหัสสินค้า'}
                </th>
                <th className="w-[80px] px-[10px] py-[10px] text-left text-[12px] font-semibold text-[#6b7280] uppercase tracking-wider whitespace-nowrap">
                  IMAGE / {'รูปภาพ'}
                </th>
                <th className="px-[10px] py-[10px] text-left text-[12px] font-semibold text-[#6b7280] uppercase tracking-wider whitespace-nowrap">
                  {'ชื่อสินค้า'}
                </th>
                <th className="px-[10px] py-[10px] text-left text-[12px] font-semibold text-[#6b7280] uppercase tracking-wider whitespace-nowrap">
                  {'ประเภทสินค้า'}
                </th>
                <th className="px-[10px] py-[10px] text-left text-[12px] font-semibold text-[#6b7280] uppercase tracking-wider whitespace-nowrap">
                  {'หมวดหมู่สินค้า'}
                </th>
                <th className="px-[10px] py-[10px] text-left text-[12px] font-semibold text-[#6b7280] uppercase tracking-wider">
                  <span className="block leading-[1.4]">{'ช่วงวันเวลาเริ่มต้น-สิ้นสุด'}</span>
                  <span className="block leading-[1.4]">{'การเผยแพร่'}</span>
                </th>
                <th className="px-[10px] py-[10px] text-left text-[12px] font-semibold text-[#6b7280] uppercase tracking-wider whitespace-nowrap">
                  {'สถานะสินค้าแนะนำ'}
                </th>
                <th className="px-[10px] py-[10px] text-left text-[12px] font-semibold text-[#6b7280] uppercase tracking-wider whitespace-nowrap">
                  {'สถานะเผยแพร่'}
                </th>
                <th className="w-[56px] px-[10px] py-[10px] text-center text-[12px] font-semibold text-[#6b7280] uppercase tracking-wider">
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-[10px] py-[40px] text-center text-[14px] text-[#9ca3af]">
                    ไม่พบข้อมูลสินค้า
                  </td>
                </tr>
              ) : (
                products.map((product, index) => {
                  const imageUrl = getPrimaryImage(product)
                  return (
                    <tr
                      key={product.id}
                      className="border-t border-[#f3f4f6] hover:bg-[#fafafa] transition-colors"
                    >
                      <td className="px-[12px] py-[10px]">
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(product.id)}
                          onChange={() => toggleSelectRow(product.id)}
                          className="size-[16px] accent-[#ff7e1b] cursor-pointer rounded"
                          aria-label={`Select ${product.name}`}
                        />
                      </td>
                      <td className="px-[10px] py-[10px] text-[13px] text-[#374151]">
                        {index + 1}
                      </td>
                      <td className="px-[10px] py-[10px] text-[13px] text-[#374151] font-mono">
                        {product.code}
                      </td>
                      <td className="px-[10px] py-[10px]">
                        {imageUrl ? (
                          <img src={imageUrl} alt={product.name} className="w-[64px] h-[48px] rounded-[6px] object-cover" />
                        ) : (
                          <div className="w-[64px] h-[48px] rounded-[6px] bg-[#e5e7eb] flex items-center justify-center">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                              <circle cx="8.5" cy="8.5" r="1.5" />
                              <polyline points="21 15 16 10 5 21" />
                            </svg>
                          </div>
                        )}
                      </td>
                      <td className="px-[10px] py-[10px] text-[13px] text-[#374151] max-w-[200px]">
                        <span className="line-clamp-2">{product.name}</span>
                      </td>
                      <td className="px-[10px] py-[10px] text-[13px] text-[#374151] whitespace-nowrap">
                        {TYPE_LABELS[product.type] || product.type}
                      </td>
                      <td className="px-[10px] py-[10px] text-[13px] text-[#374151] whitespace-nowrap">
                        {product.category}
                      </td>
                      <td className="px-[10px] py-[10px] text-[12px] text-[#6b7280] min-w-[200px]">
                        <div className="leading-[1.5]">{formatThaiDate(product.publish_start)}</div>
                        <div className="leading-[1.5] mt-[2px]">{formatThaiDate(product.publish_end)}</div>
                      </td>
                      <td className="px-[10px] py-[10px]">
                        {renderRecommendedBadge(product)}
                      </td>
                      <td className="px-[10px] py-[10px]">
                        {renderPublishBadge(product)}
                      </td>
                      <td className="px-[10px] py-[10px] text-center">
                        <div className="relative inline-block">
                          <button
                            onClick={() => setOpenMenuId(openMenuId === product.id ? null : product.id)}
                            className="size-[32px] inline-flex items-center justify-center rounded-[6px] hover:bg-[#f3f4f6] transition-colors cursor-pointer bg-transparent border-none"
                            aria-label={`Actions for ${product.name}`}
                          >
                            <DotsIcon />
                          </button>
                          {openMenuId === product.id && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
                              <div className="absolute right-0 top-[36px] z-20 bg-white border border-[#e5e7eb] rounded-[8px] shadow-lg py-[4px] min-w-[140px]">
                                <Link
                                  href={`/admin/products/edit/${product.id}`}
                                  className="flex items-center gap-[8px] px-[12px] py-[8px] text-[13px] text-[#374151] hover:bg-[#f9fafb] no-underline transition-colors"
                                  onClick={() => setOpenMenuId(null)}
                                >
                                  <EditIcon />
                                  {'แก้ไข'}
                                </Link>
                                <button
                                  className="flex items-center gap-[8px] w-full px-[12px] py-[8px] text-[13px] text-[#ef4444] hover:bg-[#fef2f2] border-none bg-transparent cursor-pointer transition-colors"
                                  onClick={() => handleDelete(product.id)}
                                >
                                  <TrashIcon />
                                  {'ลบ'}
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ---- Pagination ---- */}
      <div className="flex items-center justify-between py-[8px]">
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
            {'รายการต่อหน้า'}
          </span>
        </div>

        <nav className="flex items-center gap-[4px]" aria-label="Pagination navigation">
          {renderPageNumbers()}
        </nav>
      </div>
    </div>
  )
}
