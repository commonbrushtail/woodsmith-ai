'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { deleteVariationGroup } from '@/lib/actions/variations'
import { useToast } from '@/lib/toast-context'

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

export default function VariationsListClient({ groups }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [openMenuId, setOpenMenuId] = useState(null)
  const [search, setSearch] = useState('')

  const filtered = groups.filter(
    (g) => !search || g.name?.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = async (id) => {
    startTransition(async () => {
      // First call without force flag
      const result = await deleteVariationGroup(id)

      if (result.error) {
        toast.error('เกิดข้อผิดพลาด: ' + result.error)
        setOpenMenuId(null)
        return
      }

      // If warning, show confirmation dialog
      if (result.warning) {
        const confirmDelete = confirm(`${result.message} ต้องการลบหรือไม่?`)
        if (confirmDelete) {
          const forceResult = await deleteVariationGroup(id, { force: true })
          if (forceResult.error) {
            toast.error('เกิดข้อผิดพลาด: ' + forceResult.error)
          }
          setOpenMenuId(null)
          router.refresh()
        } else {
          setOpenMenuId(null)
        }
      } else {
        // Success without warning
        setOpenMenuId(null)
        router.refresh()
      }
    })
  }

  return (
    <div className={`flex flex-col gap-0 h-full min-h-0 ${isPending ? 'opacity-60 pointer-events-none' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between py-[12px]">
        <div className="flex items-center gap-[12px]">
          <h1 className="font-['IBM_Plex_Sans_Thai'] font-bold text-[22px] text-[#1f2937] m-0">
            ตัวเลือกสินค้า (Variations)
          </h1>
          <span className="inline-flex items-center justify-center min-w-[28px] h-[24px] px-[8px] rounded-full bg-[#f3f4f6] font-['IBM_Plex_Sans_Thai'] text-[13px] font-medium text-[#6b7280]">
            {groups.length}
          </span>
        </div>

        <Link
          href="/admin/variations/create"
          className="flex items-center gap-[6px] px-[16px] py-[8px] rounded-[8px] bg-[#ff7e1b] text-white font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] no-underline hover:bg-[#e56f15] transition-colors"
        >
          <PlusIcon size={16} color="white" />
          <span>Create new entry</span>
        </Link>
      </div>

      {/* Search */}
      <div className="mb-[16px]">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ค้นหากลุ่มตัวเลือก..."
          className="w-full max-w-[320px] font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border border-[#e8eaef] rounded-[8px] px-[14px] py-[8px] outline-none focus:border-[#ff7e1b] focus:ring-1 focus:ring-[#ff7e1b]/20 transition-all placeholder:text-[#bfbfbf]"
        />
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto bg-white rounded-[12px] border border-[#e8eaef]">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[#e8eaef]">
              <th className="text-left px-[16px] py-[12px] font-['IBM_Plex_Sans_Thai'] text-[12px] font-semibold text-[#9ca3af] uppercase tracking-wider">#</th>
              <th className="text-left px-[16px] py-[12px] font-['IBM_Plex_Sans_Thai'] text-[12px] font-semibold text-[#9ca3af] uppercase tracking-wider">ชื่อกลุ่ม</th>
              <th className="text-left px-[16px] py-[12px] font-['IBM_Plex_Sans_Thai'] text-[12px] font-semibold text-[#9ca3af] uppercase tracking-wider">จำนวนตัวเลือก</th>
              <th className="text-left px-[16px] py-[12px] font-['IBM_Plex_Sans_Thai'] text-[12px] font-semibold text-[#9ca3af] uppercase tracking-wider">สินค้าที่เชื่อมโยง</th>
              <th className="w-[60px]"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-[40px] font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#9ca3af]">
                  ยังไม่มีกลุ่มตัวเลือก
                </td>
              </tr>
            ) : (
              filtered.map((group, idx) => (
                <tr
                  key={group.id}
                  onClick={(e) => {
                    if (e.target.closest('button, a, input, select')) return
                    router.push('/admin/variations/edit/' + group.id)
                  }}
                  className="border-b border-[#f3f4f6] hover:bg-[#f9fafb] transition-colors cursor-pointer"
                >
                  <td className="px-[16px] py-[14px] font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#9ca3af]">
                    {idx + 1}
                  </td>
                  <td className="px-[16px] py-[14px]">
                    <Link
                      href={`/admin/variations/edit/${group.id}`}
                      className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] font-medium no-underline hover:text-[#ff7e1b] transition-colors"
                    >
                      {group.name || '-'}
                    </Link>
                  </td>
                  <td className="px-[16px] py-[14px] font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#374151]">
                    {group.entry_count || 0}
                  </td>
                  <td className="px-[16px] py-[14px] font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#374151]">
                    <span className={group.product_count === 0 ? 'text-[#9ca3af]' : ''}>
                      {group.product_count || 0}
                    </span>
                  </td>
                  <td className="px-[16px] py-[14px]">
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setOpenMenuId(openMenuId === group.id ? null : group.id)}
                        className="size-[32px] flex items-center justify-center rounded-[6px] hover:bg-[#f3f4f6] border-0 bg-transparent cursor-pointer"
                      >
                        <DotsIcon size={16} />
                      </button>
                      {openMenuId === group.id && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setOpenMenuId(null)} />
                          <div className="absolute right-0 top-full mt-[4px] z-50 bg-white border border-[#e8eaef] rounded-[8px] shadow-lg overflow-hidden min-w-[140px]">
                            <Link
                              href={`/admin/variations/edit/${group.id}`}
                              className="flex items-center gap-[8px] w-full text-left px-[14px] py-[10px] border-0 cursor-pointer bg-transparent text-[#374151] hover:bg-[#f3f4f6] font-['IBM_Plex_Sans_Thai'] text-[13px] no-underline"
                              onClick={() => setOpenMenuId(null)}
                            >
                              <EditIcon />
                              แก้ไข
                            </Link>
                            <button
                              type="button"
                              onClick={() => { setOpenMenuId(null); handleDelete(group.id) }}
                              className="flex items-center gap-[8px] w-full text-left px-[14px] py-[10px] border-0 cursor-pointer bg-transparent text-[#ef4444] hover:bg-[#fef2f2] font-['IBM_Plex_Sans_Thai'] text-[13px]"
                            >
                              <TrashIcon />
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
