'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/lib/toast-context'
import { inviteUser, updateUserRole, deleteUser } from '@/lib/actions/users'

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

const ROLE_LABELS = {
  admin: 'Admin',
  editor: 'Editor',
  customer: 'Customer',
}

const ROLE_STYLES = {
  admin: 'bg-[#fef3c7] text-[#92400e]',
  editor: 'bg-[#dbeafe] text-[#1e40af]',
  customer: 'bg-[#f3f4f6] text-[#6b7280]',
}

export default function UserListClient({ users, totalCount }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [openMenuId, setOpenMenuId] = useState(null)
  const [search, setSearch] = useState('')
  const [showInvite, setShowInvite] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteName, setInviteName] = useState('')
  const [inviteRole, setInviteRole] = useState('editor')

  const filtered = users.filter(
    (u) =>
      !search ||
      u.display_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  )

  const handleInvite = () => {
    if (!inviteEmail) return
    startTransition(async () => {
      const formData = new FormData()
      formData.set('email', inviteEmail)
      formData.set('display_name', inviteName)
      formData.set('role', inviteRole)
      const result = await inviteUser(formData)
      if (result.error) {
        toast.error('เกิดข้อผิดพลาด: ' + result.error)
      } else {
        setShowInvite(false)
        setInviteEmail('')
        setInviteName('')
        setInviteRole('editor')
        router.refresh()
      }
    })
  }

  const handleRoleChange = (id, role) => {
    startTransition(async () => {
      await updateUserRole(id, role)
      setOpenMenuId(null)
      router.refresh()
    })
  }

  const handleDelete = (id) => {
    if (!confirm('ต้องการลบผู้ใช้นี้หรือไม่?')) return
    startTransition(async () => {
      await deleteUser(id)
      router.refresh()
    })
  }

  return (
    <div className={`flex flex-col gap-0 h-full min-h-0 ${isPending ? 'opacity-60 pointer-events-none' : ''}`}>
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

        <button
          type="button"
          onClick={() => setShowInvite(true)}
          className="flex items-center gap-[6px] px-[16px] py-[8px] rounded-[8px] bg-[#ff7e1b] text-white font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] border-0 cursor-pointer hover:bg-[#e56f15] transition-colors"
        >
          <PlusIcon size={16} color="white" />
          <span>เชิญผู้ใช้</span>
        </button>
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
              <th className="text-left px-[16px] py-[12px] font-['IBM_Plex_Sans_Thai'] text-[12px] font-semibold text-[#9ca3af] uppercase tracking-wider">ชื่อ</th>
              <th className="text-left px-[16px] py-[12px] font-['IBM_Plex_Sans_Thai'] text-[12px] font-semibold text-[#9ca3af] uppercase tracking-wider">อีเมล</th>
              <th className="text-left px-[16px] py-[12px] font-['IBM_Plex_Sans_Thai'] text-[12px] font-semibold text-[#9ca3af] uppercase tracking-wider">บทบาท</th>
              <th className="w-[60px]"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-[40px] font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#9ca3af]">
                  ยังไม่มีข้อมูลผู้ใช้
                </td>
              </tr>
            ) : (
              filtered.map((user, idx) => (
                <tr key={user.id} className="border-b border-[#f3f4f6] hover:bg-[#f9fafb] transition-colors">
                  <td className="px-[16px] py-[14px] font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#9ca3af]">
                    {idx + 1}
                  </td>
                  <td className="px-[16px] py-[14px]">
                    <span className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] font-medium">
                      {user.display_name || '-'}
                    </span>
                    {user.phone && (
                      <p className="font-['IBM_Plex_Sans_Thai'] text-[12px] text-[#9ca3af] m-0 mt-[2px]">
                        {user.phone}
                      </p>
                    )}
                  </td>
                  <td className="px-[16px] py-[14px] font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#6b7280]">
                    {user.email || '-'}
                  </td>
                  <td className="px-[16px] py-[14px]">
                    <span className={`inline-flex items-center px-[10px] py-[2px] rounded-full font-['IBM_Plex_Sans_Thai'] text-[12px] font-medium leading-[1.8] ${ROLE_STYLES[user.role] || ROLE_STYLES.customer}`}>
                      {ROLE_LABELS[user.role] || user.role}
                    </span>
                  </td>
                  <td className="px-[16px] py-[14px]">
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
                        className="size-[32px] flex items-center justify-center rounded-[6px] hover:bg-[#f3f4f6] border-0 bg-transparent cursor-pointer"
                      >
                        <DotsIcon size={16} />
                      </button>
                      {openMenuId === user.id && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setOpenMenuId(null)} />
                          <div className="absolute right-0 top-full mt-[4px] z-50 bg-white border border-[#e8eaef] rounded-[8px] shadow-lg overflow-hidden min-w-[160px]">
                            <button
                              type="button"
                              onClick={() => { setOpenMenuId(null); handleRoleChange(user.id, user.role === 'admin' ? 'editor' : 'admin') }}
                              className="w-full text-left px-[14px] py-[10px] border-0 cursor-pointer bg-transparent text-[#374151] hover:bg-[#f3f4f6] font-['IBM_Plex_Sans_Thai'] text-[13px]"
                            >
                              {user.role === 'admin' ? 'เปลี่ยนเป็น Editor' : 'เปลี่ยนเป็น Admin'}
                            </button>
                            <button
                              type="button"
                              onClick={() => { setOpenMenuId(null); handleDelete(user.id) }}
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

      {/* Invite modal */}
      {showInvite && (
        <>
          <div className="fixed inset-0 bg-black/40 z-50" onClick={() => setShowInvite(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-[12px] border border-[#e8eaef] shadow-xl p-[24px] w-[440px] max-w-[90vw]">
            <h2 className="font-['IBM_Plex_Sans_Thai'] font-bold text-[18px] text-[#1f2937] m-0 mb-[20px]">
              เชิญผู้ใช้ใหม่
            </h2>

            <div className="flex flex-col gap-[16px]">
              <div className="flex flex-col gap-[6px]">
                <label className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#4b5563]">
                  อีเมล <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="border border-[#e8eaef] rounded-[8px] px-[14px] py-[10px] font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] outline-none focus:border-[#ff7e1b] transition-colors"
                />
              </div>

              <div className="flex flex-col gap-[6px]">
                <label className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#4b5563]">
                  ชื่อแสดง
                </label>
                <input
                  type="text"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="ชื่อที่ต้องการแสดง"
                  className="border border-[#e8eaef] rounded-[8px] px-[14px] py-[10px] font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] outline-none focus:border-[#ff7e1b] transition-colors"
                />
              </div>

              <div className="flex flex-col gap-[6px]">
                <label className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#4b5563]">
                  บทบาท
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="border border-[#e8eaef] rounded-[8px] px-[14px] py-[10px] font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] outline-none focus:border-[#ff7e1b] transition-colors bg-white"
                >
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                </select>
              </div>
            </div>

            <div className="flex gap-[12px] mt-[24px] justify-end">
              <button
                type="button"
                onClick={() => setShowInvite(false)}
                className="px-[16px] py-[8px] rounded-[8px] bg-white text-[#374151] font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] border border-[#e8eaef] cursor-pointer hover:bg-[#f9fafb] transition-colors"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleInvite}
                disabled={isPending || !inviteEmail}
                className="px-[16px] py-[8px] rounded-[8px] bg-[#ff7e1b] text-white font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] border-0 cursor-pointer hover:bg-[#e56f15] transition-colors disabled:opacity-50"
              >
                {isPending ? 'กำลังเชิญ...' : 'เชิญ'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
