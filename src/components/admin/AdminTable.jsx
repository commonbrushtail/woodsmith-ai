'use client'

import { useState } from 'react'
import { getPageNumbers } from '@/lib/pagination'

export default function AdminTable({ columns = [], data = [], onPageChange, itemsPerPage = 10 }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedRows, setSelectedRows] = useState([])

  const totalPages = Math.ceil(data.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = data.slice(startIndex, startIndex + itemsPerPage)

  const handleSelectAll = () => {
    if (selectedRows.length === paginatedData.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(paginatedData.map((_, i) => startIndex + i))
    }
  }

  const handleSelectRow = (index) => {
    setSelectedRows(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    )
  }

  const goToPage = (page) => {
    setCurrentPage(page)
    onPageChange?.(page)
  }

  return (
    <div className="flex flex-col gap-0">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[#e5e7eb]">
              <th className="w-[56px] px-[20px] py-[12px] text-left">
                <input
                  type="checkbox"
                  className="size-[16px] accent-orange cursor-pointer"
                  checked={selectedRows.length === paginatedData.length && paginatedData.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-[12px] py-[12px] text-left font-['IBM_Plex_Sans_Thai'] font-medium text-[13px] text-[#6b7280] whitespace-nowrap"
                  style={{ width: col.width }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, rowIndex) => {
              const globalIndex = startIndex + rowIndex
              return (
                <tr key={globalIndex} className="border-b border-[#f3f4f6] hover:bg-[#f9fafb]">
                  <td className="px-[20px] py-[16px]">
                    <input
                      type="checkbox"
                      className="size-[16px] accent-orange cursor-pointer"
                      checked={selectedRows.includes(globalIndex)}
                      onChange={() => handleSelectRow(globalIndex)}
                    />
                  </td>
                  {columns.map((col) => (
                    <td key={col.key} className="px-[12px] py-[16px] font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#374151]">
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-[16px] py-[12px] border-t border-[#e5e7eb]">
          <div className="flex items-center gap-[8px]">
            <span className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#6b7280]">
              {itemsPerPage}
            </span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#6b7280" strokeWidth="1.5"><path d="M3 4.5L6 7.5L9 4.5" /></svg>
            <span className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#6b7280]">
              รายการต่อหน้า
            </span>
          </div>
          <div className="flex items-center gap-[4px]">
            <button
              onClick={() => goToPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="size-[32px] flex items-center justify-center rounded-[6px] hover:bg-gray-100 disabled:opacity-30"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#374151" strokeWidth="1.5"><path d="M8.5 3.5L5 7L8.5 10.5" /></svg>
            </button>
            {getPageNumbers(currentPage, totalPages).map((page, i) =>
              page === '...' ? (
                <span key={`dots-${i}`} className="text-[#6b7280] text-[13px]">...</span>
              ) : (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`size-[32px] flex items-center justify-center rounded-[6px] font-['IBM_Plex_Sans_Thai'] text-[13px] ${
                    currentPage === page
                      ? 'bg-orange text-white'
                      : 'text-[#374151] hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              )
            )}
            <button
              onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="size-[32px] flex items-center justify-center rounded-[6px] hover:bg-gray-100 disabled:opacity-30"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#374151" strokeWidth="1.5"><path d="M5.5 3.5L9 7L5.5 10.5" /></svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
