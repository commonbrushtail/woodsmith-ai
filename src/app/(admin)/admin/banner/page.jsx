'use client'

import { useState } from 'react'
import Link from 'next/link'

const mockBanners = [
  {
    id: 1,
    order: 1,
    date: '\u0E27\u0E31\u0E19\u0E08\u0E31\u0E19\u0E17\u0E23\u0E4C \u0E17\u0E35\u0E48 27 \u0E15\u0E38\u0E25\u0E32\u0E04\u0E21 \u0E1E.\u0E28. 2568 \u0E40\u0E27\u0E25\u0E32 16:17',
    status: 'no_show',
  },
  {
    id: 2,
    order: 2,
    date: '\u0E27\u0E31\u0E19\u0E08\u0E31\u0E19\u0E17\u0E23\u0E4C \u0E17\u0E35\u0E48 27 \u0E15\u0E38\u0E25\u0E32\u0E04\u0E21 \u0E1E.\u0E28. 2568 \u0E40\u0E27\u0E25\u0E32 16:17',
    status: 'showing',
  },
  {
    id: 3,
    order: 3,
    date: '\u0E27\u0E31\u0E19\u0E08\u0E31\u0E19\u0E17\u0E23\u0E4C \u0E17\u0E35\u0E48 27 \u0E15\u0E38\u0E25\u0E32\u0E04\u0E21 \u0E1E.\u0E28. 2568 \u0E40\u0E27\u0E25\u0E32 16:17',
    status: 'showing',
  },
]

export default function BannerPage() {
  const [selectedRows, setSelectedRows] = useState([])
  const [sortAsc, setSortAsc] = useState(true)
  const [openMenuId, setOpenMenuId] = useState(null)

  const handleSelectAll = () => {
    if (selectedRows.length === mockBanners.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(mockBanners.map((b) => b.id))
    }
  }

  const handleSelectRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const toggleSort = () => {
    setSortAsc((prev) => !prev)
  }

  const sortedBanners = [...mockBanners].sort((a, b) =>
    sortAsc ? a.order - b.order : b.order - a.order
  )

  return (
    <div>
      {/* ── Header ── */}
      <div className="flex items-center justify-between py-[12px]">
        <div className="flex flex-col gap-[4px]">
          <h1 className="font-['IBM_Plex_Sans_Thai'] font-bold text-[22px] text-[#1f2937] m-0">
            {'\u0E41\u0E1A\u0E19\u0E40\u0E19\u0E2D\u0E23\u0E4C'} (Banner)
          </h1>
          <p className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#6b7280] m-0">
            3 entries found
          </p>
        </div>
        <Link
          href="/admin/banner/create"
          className="flex items-center gap-[8px] bg-orange text-white px-[16px] py-[8px] rounded-[8px] font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] hover:bg-orange/90 transition-colors no-underline"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7 1v12M1 7h12" />
          </svg>
          Create new entry
        </Link>
      </div>

      {/* ── Search & Filter Bar ── */}
      <div className="flex items-center justify-between mt-[16px] mb-[12px]">
        <div className="flex items-center gap-[8px]">
          {/* Search input */}
          <div className="relative">
            <svg
              className="absolute left-[10px] top-1/2 -translate-y-1/2"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9ca3af"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search..."
              className="w-[220px] pl-[34px] pr-[12px] py-[7px] border border-[#e5e7eb] rounded-[8px] font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#374151] outline-none focus:border-orange transition-colors placeholder:text-[#9ca3af]"
            />
          </div>
          {/* Filter button */}
          <button className="flex items-center gap-[6px] px-[12px] py-[7px] border border-[#e5e7eb] rounded-[8px] font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#4b5563] hover:bg-[#f9fafb] transition-colors bg-white cursor-pointer">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6b7280"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            {'\u0E15\u0E31\u0E27\u0E01\u0E23\u0E2D\u0E07'}
          </button>
        </div>

        {/* Right side: locale + settings */}
        <div className="flex items-center gap-[8px]">
          <div className="flex items-center gap-[8px] border border-[#e5e7eb] rounded-[8px] px-[12px] py-[6px] cursor-pointer hover:bg-[#f9fafb] transition-colors">
            <span className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#4b5563]">
              Thai (th)
            </span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              stroke="#6b7280"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 4.5L6 7.5L9 4.5" />
            </svg>
          </div>
          <button className="size-[32px] flex items-center justify-center rounded-[8px] hover:bg-gray-100 cursor-pointer bg-transparent border-none">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6b7280"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="border border-[#e5e7eb] rounded-[12px] overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#e5e7eb] bg-[#f9fafb]">
                {/* Checkbox */}
                <th className="w-[56px] px-[20px] py-[12px] text-left">
                  <input
                    type="checkbox"
                    className="size-[16px] accent-orange cursor-pointer"
                    checked={
                      selectedRows.length === mockBanners.length &&
                      mockBanners.length > 0
                    }
                    onChange={handleSelectAll}
                  />
                </th>
                {/* ORDER */}
                <th
                  className="px-[12px] py-[12px] text-left font-['IBM_Plex_Sans_Thai'] font-medium text-[13px] text-[#6b7280] whitespace-nowrap cursor-pointer select-none"
                  onClick={toggleSort}
                >
                  <div className="flex items-center gap-[4px]">
                    <span>ORDER / {'\u0E25\u0E33\u0E14\u0E31\u0E1A'}</span>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      stroke="#6b7280"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`transition-transform ${sortAsc ? '' : 'rotate-180'}`}
                    >
                      <path d="M3 4.5L6 7.5L9 4.5" />
                    </svg>
                  </div>
                </th>
                {/* IMAGE */}
                <th className="px-[12px] py-[12px] text-left font-['IBM_Plex_Sans_Thai'] font-medium text-[13px] text-[#6b7280] whitespace-nowrap">
                  IMAGE / {'\u0E23\u0E39\u0E1B\u0E20\u0E32\u0E1E'}
                </th>
                {/* DATE */}
                <th className="px-[12px] py-[12px] text-left font-['IBM_Plex_Sans_Thai'] font-medium text-[13px] text-[#6b7280] whitespace-nowrap">
                  IMAGE / {'\u0E23\u0E39\u0E1B\u0E20\u0E32\u0E1E'}
                </th>
                {/* STATUS */}
                <th className="px-[12px] py-[12px] text-left font-['IBM_Plex_Sans_Thai'] font-medium text-[13px] text-[#6b7280] whitespace-nowrap">
                  STATUS
                </th>
                {/* ACTION */}
                <th className="w-[64px] px-[12px] py-[12px] text-center font-['IBM_Plex_Sans_Thai'] font-medium text-[13px] text-[#6b7280] whitespace-nowrap">
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedBanners.map((banner) => (
                <tr
                  key={banner.id}
                  className="border-b border-[#f3f4f6] hover:bg-[#f9fafb] transition-colors"
                >
                  {/* Checkbox */}
                  <td className="px-[20px] py-[16px]">
                    <input
                      type="checkbox"
                      className="size-[16px] accent-orange cursor-pointer"
                      checked={selectedRows.includes(banner.id)}
                      onChange={() => handleSelectRow(banner.id)}
                    />
                  </td>
                  {/* ORDER */}
                  <td className="px-[12px] py-[16px] font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#374151]">
                    {banner.order}
                  </td>
                  {/* IMAGE thumbnail */}
                  <td className="px-[12px] py-[16px]">
                    <div className="w-[80px] h-[48px] bg-[#d4a574] rounded-[6px]" />
                  </td>
                  {/* DATE */}
                  <td className="px-[12px] py-[16px] font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#374151]">
                    {banner.date}
                  </td>
                  {/* STATUS */}
                  <td className="px-[12px] py-[16px]">
                    {banner.status === 'showing' ? (
                      <span className="inline-flex items-center px-[10px] py-[3px] rounded-full border border-orange text-orange font-['IBM_Plex_Sans_Thai'] text-[12px] font-medium">
                        Showing
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-[10px] py-[3px] rounded-full border border-[#d1d5db] text-[#6b7280] font-['IBM_Plex_Sans_Thai'] text-[12px] font-medium">
                        No Show
                      </span>
                    )}
                  </td>
                  {/* ACTION */}
                  <td className="px-[12px] py-[16px] text-center">
                    <div className="relative inline-block">
                      <button
                        onClick={() =>
                          setOpenMenuId(
                            openMenuId === banner.id ? null : banner.id
                          )
                        }
                        className="size-[32px] flex items-center justify-center rounded-[6px] hover:bg-[#f3f4f6] transition-colors cursor-pointer bg-transparent border-none"
                        aria-label={`Actions for banner ${banner.order}`}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="#6b7280"
                        >
                          <circle cx="8" cy="3" r="1.5" />
                          <circle cx="8" cy="8" r="1.5" />
                          <circle cx="8" cy="13" r="1.5" />
                        </svg>
                      </button>
                      {openMenuId === banner.id && (
                        <>
                          {/* Backdrop to close menu */}
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setOpenMenuId(null)}
                          />
                          <div className="absolute right-0 top-[36px] z-20 bg-white border border-[#e5e7eb] rounded-[8px] shadow-lg py-[4px] min-w-[140px]">
                            <Link
                              href={`/admin/banner/${banner.id}/edit`}
                              className="flex items-center gap-[8px] px-[12px] py-[8px] font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#374151] hover:bg-[#f9fafb] no-underline transition-colors"
                              onClick={() => setOpenMenuId(null)}
                            >
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#6b7280"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                              </svg>
                              {'\u0E41\u0E01\u0E49\u0E44\u0E02'}
                            </Link>
                            <button
                              className="flex items-center gap-[8px] w-full px-[12px] py-[8px] font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#ef4444] hover:bg-[#fef2f2] border-none bg-transparent cursor-pointer transition-colors"
                              onClick={() => setOpenMenuId(null)}
                            >
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#ef4444"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                              </svg>
                              {'\u0E25\u0E1A'}
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        <div className="flex items-center justify-between px-[20px] py-[12px] border-t border-[#e5e7eb]">
          {/* Left: per-page & range */}
          <div className="flex items-center gap-[4px]">
            <span className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#6b7280]">
              Showing
            </span>
            <div className="flex items-center gap-[4px] border border-[#e5e7eb] rounded-[6px] px-[8px] py-[2px] cursor-pointer">
              <span className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#374151]">
                10
              </span>
              <svg
                width="10"
                height="10"
                viewBox="0 0 12 12"
                fill="none"
                stroke="#6b7280"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 4.5L6 7.5L9 4.5" />
              </svg>
            </div>
            <span className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#6b7280] ml-[4px]">
              1 - 10 of 2389
            </span>
          </div>

          {/* Right: page numbers */}
          <div className="flex items-center gap-[4px]">
            <button className="flex items-center gap-[4px] px-[10px] py-[6px] rounded-[6px] font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#9ca3af] cursor-not-allowed bg-transparent border-none">
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                stroke="#9ca3af"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M8.5 3.5L5 7L8.5 10.5" />
              </svg>
              Previous
            </button>
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                className={`size-[32px] flex items-center justify-center rounded-[6px] font-['IBM_Plex_Sans_Thai'] text-[13px] cursor-pointer border-none transition-colors ${
                  page === 1
                    ? 'bg-orange text-white'
                    : 'bg-transparent text-[#374151] hover:bg-[#f3f4f6]'
                }`}
              >
                {page}
              </button>
            ))}
            <span className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#6b7280] px-[4px]">
              ...
            </span>
            {[8, 9, 10].map((page) => (
              <button
                key={page}
                className="size-[32px] flex items-center justify-center rounded-[6px] font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#374151] hover:bg-[#f3f4f6] cursor-pointer bg-transparent border-none transition-colors"
              >
                {page}
              </button>
            ))}
            <button className="flex items-center gap-[4px] px-[10px] py-[6px] rounded-[6px] font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#374151] hover:bg-[#f3f4f6] cursor-pointer bg-transparent border-none transition-colors">
              Next
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                stroke="#374151"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5.5 3.5L9 7L5.5 10.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
