'use client'

import { useState, useEffect, useTransition } from 'react'
import { getAccountInfo, sendPasswordResetEmail } from '@/lib/actions/account'
import { useToast } from '@/lib/toast-context'

export default function AccountPage() {
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [loading, setLoading] = useState(true)

  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')

  useEffect(() => {
    async function load() {
      const { data } = await getAccountInfo()
      if (data) {
        setEmail(data.email || '')
        setRole(data.role)
      }
      setLoading(false)
    }
    load()
  }, [])

  const handleResetPassword = () => {
    startTransition(async () => {
      const result = await sendPasswordResetEmail()
      if (result.error) {
        toast.error('เกิดข้อผิดพลาด: ' + result.error)
      } else {
        toast.success('ส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลของคุณแล้ว')
      }
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-[60px]">
        <p className="font-['IBM_Plex_Sans_Thai'] text-[16px] text-[#9ca3af]">กำลังโหลด...</p>
      </div>
    )
  }

  return (
    <div className={`flex flex-col gap-[24px] h-full min-h-0 overflow-y-auto pb-[32px] ${isPending ? 'opacity-60 pointer-events-none' : ''}`}>
      {/* Header */}
      <div>
        <h1 className="font-['IBM_Plex_Sans_Thai'] font-bold text-[22px] text-[#1f2937] m-0">
          บัญชีผู้ใช้
        </h1>
        {role && (
          <p className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#9ca3af] m-0 mt-[4px]">
            บทบาท: {role === 'admin' ? 'ผู้ดูแลระบบ' : role === 'editor' ? 'บรรณาธิการ' : role}
          </p>
        )}
      </div>

      {/* Email */}
      <section
        className="bg-white rounded-[12px] border border-[#e8eaef] p-[24px]"
        aria-labelledby="section-profile"
      >
        <h2
          id="section-profile"
          className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[16px] text-[#1f2937] m-0 mb-[20px]"
        >
          อีเมล
        </h2>

        <div className="flex flex-col gap-[6px] max-w-[480px]">
          <label
            className="font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] text-[#4b5563]"
          >
            อีเมล
          </label>
          <p className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] m-0">
            {email}
          </p>
        </div>
      </section>

      {/* Password Reset */}
      <section
        className="bg-white rounded-[12px] border border-[#e8eaef] p-[24px]"
        aria-labelledby="section-password"
      >
        <h2
          id="section-password"
          className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[16px] text-[#1f2937] m-0 mb-[8px]"
        >
          รหัสผ่าน
        </h2>
        <p className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#9ca3af] m-0 mb-[16px]">
          ระบบจะส่งลิงก์สำหรับตั้งรหัสผ่านใหม่ไปยังอีเมลของคุณ
        </p>
        <button
          type="button"
          disabled={isPending}
          onClick={handleResetPassword}
          className="px-[24px] py-[8px] bg-white text-[#374151] rounded-[8px] font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] border border-[#e8eaef] cursor-pointer hover:bg-[#f9fafb] transition-colors disabled:opacity-50"
        >
          {isPending ? 'กำลังส่ง...' : 'ส่งลิงก์รีเซ็ตรหัสผ่าน'}
        </button>
      </section>
    </div>
  )
}
