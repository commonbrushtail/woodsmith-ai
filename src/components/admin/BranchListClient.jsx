'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { deleteBranch, toggleBranchPublished } from '@/lib/actions/branches'

function DotsIcon({ size = 18, color = '#6b7280' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="19" r="1" />
    </svg>
  )
}

function PlusIcon({ size = 18, color = '#ff7e1b' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

export default function BranchListClient({ branches, totalCount }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [openMenuId, setOpenMenuId] = useState(null)
  const [search, setSearch] = useState('')

  const filtered = branches.filter(
    (b) => !search || b.name?.toLowerCase().includes(search.toLowerCase())
  )

  const handleTogglePublished = (id, current) => {
    startTransition(async () => {
      await toggleBranchPublished(id, !current)
      router.refresh()
    })
  }

  const handleDelete = (id) => {
    if (!confirm('ต้องการลบสาขานี้หรือไม่?')) return
    startTransition(async () => {
      await deleteBranch(id)
      router.refresh()
    })
  }

  return (
    <div className={`flex flex-col gap-0 h-full min-h-0 ${isPending ? 'opacity-60 pointer-events-none' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between py-[12px]">
        <div className="flex items-center gap-[12px]">
          <h1 className="font-['IBM_Plex_Sans_Thai'] font-bold text-[22px] text-[#1f2937] m-0">
            ช่องทางสาขา (Branch)
          </h1>
          <span className="inline-flex items-center justify-center min-w-[28px] h-[24px] px-[8px] rounded-full bg-[#f3f4f6] font-['IBM_Plex_Sans_Thai'] text-[13px] font-medium text-[#6b7280]">
            {totalCount}
          </span>
        </div>

        <Link
          href="/admin/branch/create"
          className="flex items-center gap-[6px] px-[16px] py-[8px] rounded-[8px] bg-[#ff7e1b] text-white font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] no-underline hover:bg-[#e56f15] transition-colors"
        >
          <PlusIcon size={16} color="white" />
          <span>เพิ่มสาขา</span>
        </Link>
      </div>

      {/* Search */}
      <div className="mb-[16px]">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ค้นหาสาขา..."
          className="w-full max-w-[320px] font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border border-[#e8eaef] rounded-[8px] px-[14px] py-[8px] outline-none focus:border-[#ff7e1b] focus:ring-1 focus:ring-[#ff7e1b]/20 transition-all placeholder:text-[#bfbfbf]"
        />
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto bg-white rounded-[12px] border border-[#e8eaef]">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[#e8eaef]">
              <th className="text-left px-[16px] py-[12px] font-['IBM_Plex_Sans_Thai'] text-[12px] font-semibold text-[#9ca3af] uppercase tracking-wider">#</th>
              <th className="text-left px-[16px] py-[12px] font-['IBM_Plex_Sans_Thai'] text-[12px] font-semibold text-[#9ca3af] uppercase tracking-wider">ชื่อสาขา</th>
              <th className="text-left px-[16px] py-[12px] font-['IBM_Plex_Sans_Thai'] text-[12px] font-semibold text-[#9ca3af] uppercase tracking-wider">โทรศัพท์</th>
              <th className="text-left px-[16px] py-[12px] font-['IBM_Plex_Sans_Thai'] text-[12px] font-semibold text-[#9ca3af] uppercase tracking-wider">สถานะ</th>
              <th className="w-[60px]"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-[40px] font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#9ca3af]">
                  ยังไม่มีข้อมูลสาขา
                </td>
              </tr>
            ) : (
              filtered.map((branch, idx) => (
                <tr
                  key={branch.id}
                  onClick={(e) => {
                    if (e.target.closest('button, a, input, select')) return
                    router.push('/admin/branch/edit/' + branch.id)
                  }}
                  className="border-b border-[#f3f4f6] hover:bg-[#f9fafb] transition-colors cursor-pointer"
                >
                  <td className="px-[16px] py-[14px] font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#9ca3af]">
                    {branch.sort_order || idx + 1}
                  </td>
                  <td className="px-[16px] py-[14px]">
                    <Link
                      href={`/admin/branch/edit/${branch.id}`}
                      className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] font-medium no-underline hover:text-[#ff7e1b] transition-colors"
                    >
                      {branch.name || '-'}
                    </Link>
                    {branch.address && (
                      <p className="font-['IBM_Plex_Sans_Thai'] text-[12px] text-[#9ca3af] m-0 mt-[2px] truncate max-w-[300px]">
                        {branch.address}
                      </p>
                    )}
                  </td>
                  <td className="px-[16px] py-[14px] font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#6b7280]">
                    {branch.phone || '-'}
                  </td>
                  <td className="px-[16px] py-[14px]">
                    <button
                      type="button"
                      onClick={() => handleTogglePublished(branch.id, branch.published)}
                      className={`inline-flex items-center px-[10px] py-[2px] rounded-full font-['IBM_Plex_Sans_Thai'] text-[12px] font-medium leading-[1.8] border-0 cursor-pointer transition-colors ${
                        branch.published
                          ? 'bg-[#22c55e]/10 text-[#16a34a] hover:bg-[#22c55e]/20'
                          : 'bg-[#3b82f6]/10 text-[#3b82f6] hover:bg-[#3b82f6]/20'
                      }`}
                    >
                      {branch.published ? 'Published' : 'Draft'}
                    </button>
                  </td>
                  <td className="px-[16px] py-[14px]">
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setOpenMenuId(openMenuId === branch.id ? null : branch.id)}
                        className="size-[32px] flex items-center justify-center rounded-[6px] hover:bg-[#f3f4f6] border-0 bg-transparent cursor-pointer"
                      >
                        <DotsIcon size={16} />
                      </button>
                      {openMenuId === branch.id && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setOpenMenuId(null)} />
                          <div className="absolute right-0 top-full mt-[4px] z-50 bg-white border border-[#e8eaef] rounded-[8px] shadow-lg overflow-hidden min-w-[140px]">
                            <Link
                              href={`/admin/branch/edit/${branch.id}`}
                              className="block w-full text-left px-[14px] py-[10px] border-0 cursor-pointer bg-transparent text-[#374151] hover:bg-[#f3f4f6] font-['IBM_Plex_Sans_Thai'] text-[13px] no-underline"
                              onClick={() => setOpenMenuId(null)}
                            >
                              แก้ไข
                            </Link>
                            <button
                              type="button"
                              onClick={() => { setOpenMenuId(null); handleDelete(branch.id) }}
                              className="w-full text-left px-[14px] py-[10px] border-0 cursor-pointer bg-transparent text-[#ef4444] hover:bg-[#fef2f2] font-['IBM_Plex_Sans_Thai'] text-[13px]"
                            >
                              ลบ
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
  )
}
