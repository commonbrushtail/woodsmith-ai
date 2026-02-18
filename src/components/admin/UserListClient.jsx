'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

function getUserName(user) {
  if (user.first_name || user.last_name) {
    return [user.first_name, user.last_name].filter(Boolean).join(' ')
  }
  return user.display_name || '-'
}

export default function UserListClient({ users, totalCount }) {
  const router = useRouter()
  const [search, setSearch] = useState('')

  const filtered = users.filter(
    (u) =>
      !search ||
      u.display_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.first_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.last_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.phone?.includes(search)
  )

  return (
    <div className="flex flex-col gap-0 h-full min-h-0">
      {/* Header */}
      <div className="flex items-center justify-between py-[12px]">
        <div className="flex items-center gap-[12px]">
          <h1 className="font-['IBM_Plex_Sans_Thai'] font-bold text-[22px] text-[#1f2937] m-0">
            จัดการผู้ใช้งาน (Users)
          </h1>
          <span className="inline-flex items-center justify-center min-w-[28px] h-[24px] px-[8px] rounded-full bg-[#f3f4f6] font-['IBM_Plex_Sans_Thai'] text-[13px] font-medium text-[#6b7280]">
            {totalCount}
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="mb-[16px]">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ค้นหาผู้ใช้..."
          className="w-full max-w-[320px] font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border border-[#e8eaef] rounded-[8px] px-[14px] py-[8px] outline-none focus:border-[#ff7e1b] focus:ring-1 focus:ring-[#ff7e1b]/20 transition-all placeholder:text-[#bfbfbf]"
        />
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto bg-white rounded-[12px] border border-[#e8eaef]">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[#e8eaef]">
              <th className="text-left px-[16px] py-[12px] font-['IBM_Plex_Sans_Thai'] text-[12px] font-semibold text-[#9ca3af] uppercase tracking-wider">#</th>
              <th className="text-left px-[16px] py-[12px] font-['IBM_Plex_Sans_Thai'] text-[12px] font-semibold text-[#9ca3af] uppercase tracking-wider">ชื่อ-นามสกุล</th>
              <th className="text-left px-[16px] py-[12px] font-['IBM_Plex_Sans_Thai'] text-[12px] font-semibold text-[#9ca3af] uppercase tracking-wider">เบอร์โทร</th>
              <th className="text-left px-[16px] py-[12px] font-['IBM_Plex_Sans_Thai'] text-[12px] font-semibold text-[#9ca3af] uppercase tracking-wider">อีเมล</th>
              <th className="text-left px-[16px] py-[12px] font-['IBM_Plex_Sans_Thai'] text-[12px] font-semibold text-[#9ca3af] uppercase tracking-wider">ที่อยู่</th>
              <th className="text-left px-[16px] py-[12px] font-['IBM_Plex_Sans_Thai'] text-[12px] font-semibold text-[#9ca3af] uppercase tracking-wider">ใบเสนอราคา</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-[40px] font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#9ca3af]">
                  ยังไม่มีข้อมูลผู้ใช้
                </td>
              </tr>
            ) : (
              filtered.map((user, idx) => (
                <tr
                  key={user.id}
                  onClick={() => router.push(`/admin/users/${user.id}`)}
                  className="border-b border-[#f3f4f6] hover:bg-[#f9fafb] transition-colors cursor-pointer"
                >
                  <td className="px-[16px] py-[14px] font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#9ca3af]">
                    {idx + 1}
                  </td>
                  <td className="px-[16px] py-[14px]">
                    <span className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] font-medium">
                      {getUserName(user)}
                    </span>
                  </td>
                  <td className="px-[16px] py-[14px] font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#6b7280]">
                    {user.phone || '-'}
                  </td>
                  <td className="px-[16px] py-[14px] font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#6b7280]">
                    {user.email || '-'}
                  </td>
                  <td className="px-[16px] py-[14px] font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#6b7280] max-w-[200px] truncate">
                    {user.address || '-'}
                  </td>
                  <td className="px-[16px] py-[14px] font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#6b7280]">
                    {user.quotation_count || 0}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
