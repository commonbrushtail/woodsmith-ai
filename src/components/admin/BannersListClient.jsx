'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useToast } from '@/lib/toast-context'
import { deleteBanner, toggleBannerStatus } from '@/lib/actions/banners'

function formatThaiDate(dateStr) {
  if (!dateStr) return '-'
  try {
    return new Date(dateStr).toLocaleDateString('th-TH', {
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

export default function BannersListClient({ banners }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [selectedRows, setSelectedRows] = useState([])
  const [sortAsc, setSortAsc] = useState(true)
  const [openMenuId, setOpenMenuId] = useState(null)

  const handleSelectAll = () => {
    if (selectedRows.length === banners.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(banners.map((b) => b.id))
    }
  }

  const handleSelectRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const toggleSort = () => setSortAsc((prev) => !prev)

  const sortedBanners = [...banners].sort((a, b) =>
    sortAsc ? a.sort_order - b.sort_order : b.sort_order - a.sort_order
  )

  const handleDelete = (id) => {
    if (!confirm('ต้องการลบแบนเนอร์นี้หรือไม่?')) return
    startTransition(async () => {
      const result = await deleteBanner(id)
      if (result.error) toast.error('เกิดข้อผิดพลาด: ' + result.error)
      setOpenMenuId(null)
      router.refresh()
    })
  }

  const handleToggleStatus = (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
    startTransition(async () => {
      await toggleBannerStatus(id, newStatus)
      router.refresh()
    })
  }

  return (
    <div className={isPending ? 'opacity-60 pointer-events-none' : ''}>
      {/* Header */}
      <div className="flex items-center justify-between py-[12px]">
        <div className="flex flex-col gap-[4px]">
          <h1 className="font-['IBM_Plex_Sans_Thai'] font-bold text-[22px] text-[#1f2937] m-0">
            {'แบนเนอร์'} (Banner)
          </h1>
          <p className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#6b7280] m-0">
            {banners.length} entries found
          </p>
        </div>
        <Link
          href="/admin/banner/create"
          className="flex items-center gap-[8px] bg-orange text-white px-[16px] py-[8px] rounded-[8px] font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] hover:bg-orange/90 transition-colors no-underline"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 1v12M1 7h12" />
          </svg>
          Create new entry
        </Link>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center justify-between mt-[16px] mb-[12px]">
        <div className="flex items-center gap-[8px]">
          <div className="relative">
            <svg className="absolute left-[10px] top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search..."
              className="w-[220px] pl-[34px] pr-[12px] py-[7px] border border-[#e5e7eb] rounded-[8px] font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#374151] outline-none focus:border-orange transition-colors placeholder:text-[#9ca3af]"
            />
          </div>
          <button className="flex items-center gap-[6px] px-[12px] py-[7px] border border-[#e5e7eb] rounded-[8px] font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#4b5563] hover:bg-[#f9fafb] transition-colors bg-white cursor-pointer">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            {'ตัวกรอง'}
          </button>
        </div>

        <div className="flex items-center gap-[8px]">
          <div className="flex items-center gap-[8px] border border-[#e5e7eb] rounded-[8px] px-[12px] py-[6px] cursor-pointer hover:bg-[#f9fafb] transition-colors">
            <span className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#4b5563]">Thai (th)</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 4.5L6 7.5L9 4.5" />
            </svg>
          </div>
          <button className="size-[32px] flex items-center justify-center rounded-[8px] hover:bg-gray-100 cursor-pointer bg-transparent border-none">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="border border-[#e5e7eb] rounded-[12px] overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#e5e7eb] bg-[#f9fafb]">
                <th className="w-[56px] px-[20px] py-[12px] text-left">
                  <input
                    type="checkbox"
                    className="size-[16px] accent-orange cursor-pointer"
                    checked={selectedRows.length === banners.length && banners.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th
                  className="px-[12px] py-[12px] text-left font-['IBM_Plex_Sans_Thai'] font-medium text-[13px] text-[#6b7280] whitespace-nowrap cursor-pointer select-none"
                  onClick={toggleSort}
                >
                  <div className="flex items-center gap-[4px]">
                    <span>ORDER / {'ลำดับ'}</span>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${sortAsc ? '' : 'rotate-180'}`}>
                      <path d="M3 4.5L6 7.5L9 4.5" />
                    </svg>
                  </div>
                </th>
                <th className="px-[12px] py-[12px] text-left font-['IBM_Plex_Sans_Thai'] font-medium text-[13px] text-[#6b7280] whitespace-nowrap">
                  IMAGE / {'รูปภาพ'}
                </th>
                <th className="px-[12px] py-[12px] text-left font-['IBM_Plex_Sans_Thai'] font-medium text-[13px] text-[#6b7280] whitespace-nowrap">
                  {'วันที่สร้าง'}
                </th>
                <th className="px-[12px] py-[12px] text-left font-['IBM_Plex_Sans_Thai'] font-medium text-[13px] text-[#6b7280] whitespace-nowrap">
                  STATUS
                </th>
                <th className="w-[64px] px-[12px] py-[12px] text-center font-['IBM_Plex_Sans_Thai'] font-medium text-[13px] text-[#6b7280] whitespace-nowrap">
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedBanners.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-[20px] py-[40px] text-center text-[14px] text-[#9ca3af] font-['IBM_Plex_Sans_Thai']">
                    ไม่พบข้อมูลแบนเนอร์
                  </td>
                </tr>
              ) : (
                sortedBanners.map((banner) => (
                  <tr key={banner.id} className="border-b border-[#f3f4f6] hover:bg-[#f9fafb] transition-colors">
                    <td className="px-[20px] py-[16px]">
                      <input
                        type="checkbox"
                        className="size-[16px] accent-orange cursor-pointer"
                        checked={selectedRows.includes(banner.id)}
                        onChange={() => handleSelectRow(banner.id)}
                      />
                    </td>
                    <td className="px-[12px] py-[16px] font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#374151]">
                      {banner.sort_order}
                    </td>
                    <td className="px-[12px] py-[16px]">
                      {banner.image_url ? (
                        <img src={banner.image_url} alt={`Banner ${banner.sort_order}`} className="w-[80px] h-[48px] rounded-[6px] object-cover" />
                      ) : (
                        <div className="w-[80px] h-[48px] bg-[#d4a574] rounded-[6px]" />
                      )}
                    </td>
                    <td className="px-[12px] py-[16px] font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#374151]">
                      {formatThaiDate(banner.created_at)}
                    </td>
                    <td className="px-[12px] py-[16px]">
                      <button
                        onClick={() => handleToggleStatus(banner.id, banner.status)}
                        className="cursor-pointer"
                      >
                        {banner.status === 'active' ? (
                          <span className="inline-flex items-center px-[10px] py-[3px] rounded-full border border-orange text-orange font-['IBM_Plex_Sans_Thai'] text-[12px] font-medium">
                            Showing
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-[10px] py-[3px] rounded-full border border-[#d1d5db] text-[#6b7280] font-['IBM_Plex_Sans_Thai'] text-[12px] font-medium">
                            No Show
                          </span>
                        )}
                      </button>
                    </td>
                    <td className="px-[12px] py-[16px] text-center">
                      <div className="relative inline-block">
                        <button
                          onClick={() => setOpenMenuId(openMenuId === banner.id ? null : banner.id)}
                          className="size-[32px] flex items-center justify-center rounded-[6px] hover:bg-[#f3f4f6] transition-colors cursor-pointer bg-transparent border-none"
                          aria-label={`Actions for banner ${banner.sort_order}`}
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="#6b7280">
                            <circle cx="8" cy="3" r="1.5" />
                            <circle cx="8" cy="8" r="1.5" />
                            <circle cx="8" cy="13" r="1.5" />
                          </svg>
                        </button>
                        {openMenuId === banner.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
                            <div className="absolute right-0 top-[36px] z-20 bg-white border border-[#e5e7eb] rounded-[8px] shadow-lg py-[4px] min-w-[140px]">
                              <Link
                                href={`/admin/banner/edit/${banner.id}`}
                                className="flex items-center gap-[8px] px-[12px] py-[8px] font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#374151] hover:bg-[#f9fafb] no-underline transition-colors"
                                onClick={() => setOpenMenuId(null)}
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                                {'แก้ไข'}
                              </Link>
                              <button
                                className="flex items-center gap-[8px] w-full px-[12px] py-[8px] font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#ef4444] hover:bg-[#fef2f2] border-none bg-transparent cursor-pointer transition-colors"
                                onClick={() => handleDelete(banner.id)}
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="3 6 5 6 21 6" />
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                </svg>
                                {'ลบ'}
                              </button>
                            </div>
                          </>
                        )}
                      </div>
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
