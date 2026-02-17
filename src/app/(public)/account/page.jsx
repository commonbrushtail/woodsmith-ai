'use client'

import { useState, useEffect } from 'react'
import { useToast } from '@/lib/toast-context'

export default function AccountProfilePage() {
  const { toast } = useToast()
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', email: '' })

  useEffect(() => {
    async function load() {
      try {
        const { createClient } = await import('@/lib/supabase/client')
        const supabase = createClient()
        const { data: { user: authUser } } = await supabase.auth.getUser()
        setUser(authUser)

        if (authUser) {
          const { getCustomerProfile } = await import('@/lib/actions/customer')
          const { data } = await getCustomerProfile()
          setProfile(data)
          setForm({
            firstName: data?.first_name || authUser.user_metadata?.first_name || '',
            lastName: data?.last_name || authUser.user_metadata?.last_name || '',
            phone: data?.phone || authUser.phone || '',
            email: data?.email || authUser.user_metadata?.email || authUser.email || '',
          })
        }
      } catch (err) {
        console.error('Error loading profile:', err)
      }
      setLoading(false)
    }
    load()
  }, [])

  const handleSave = async () => {
    if (saving) return
    setSaving(true)
    try {
      const { updateCustomerProfile } = await import('@/lib/actions/customer')
      const { error } = await updateCustomerProfile({
        first_name: form.firstName.trim(),
        last_name: form.lastName.trim(),
        display_name: form.firstName.trim(),
        phone: form.phone.trim(),
      })
      if (error) {
        toast.error('เกิดข้อผิดพลาด: ' + error)
      } else {
        const { createClient } = await import('@/lib/supabase/client')
        const supabase = createClient()
        await supabase.auth.updateUser({
          data: {
            first_name: form.firstName.trim(),
            last_name: form.lastName.trim(),
            display_name: form.firstName.trim(),
          },
        })
        toast.success('บันทึกข้อมูลเรียบร้อยแล้ว')
      }
    } catch (err) {
      console.error('Save error:', err)
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-[60px]">
        <p className="font-['IBM_Plex_Sans_Thai'] text-[16px] text-grey">กำลังโหลด...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center py-[60px]">
        <p className="font-['IBM_Plex_Sans_Thai'] text-[16px] text-grey">กรุณาเข้าสู่ระบบ</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-[24px]">
      <h2 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[20px] text-black m-0">
        ข้อมูลของฉัน
      </h2>

      <div className="flex flex-col gap-[20px] max-w-[480px]">
        {/* First / Last name */}
        <div className="flex flex-col lg:flex-row gap-[16px]">
          <div className="flex flex-col gap-[6px] flex-1">
            <label className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-black">ชื่อจริง</label>
            <input
              type="text"
              value={form.firstName}
              onChange={(e) => setForm(prev => ({ ...prev, firstName: e.target.value }))}
              className="h-[42px] border border-[#e5e7eb] px-[16px] font-['IBM_Plex_Sans_Thai'] text-[14px] text-black outline-none"
            />
          </div>
          <div className="flex flex-col gap-[6px] flex-1">
            <label className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-black">นามสกุล</label>
            <input
              type="text"
              value={form.lastName}
              onChange={(e) => setForm(prev => ({ ...prev, lastName: e.target.value }))}
              className="h-[42px] border border-[#e5e7eb] px-[16px] font-['IBM_Plex_Sans_Thai'] text-[14px] text-black outline-none"
            />
          </div>
        </div>

        <div className="flex flex-col gap-[6px]">
          <label className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-black">เบอร์โทรศัพท์</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value.replace(/\D/g, '') }))}
            maxLength={10}
            className="h-[42px] border border-[#e5e7eb] px-[16px] font-['IBM_Plex_Sans_Thai'] text-[14px] text-black outline-none"
          />
        </div>

        <div className="flex flex-col gap-[6px]">
          <label className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-grey">อีเมล (อ่านอย่างเดียว)</label>
          <input
            type="email"
            value={form.email}
            disabled
            className="h-[42px] border border-[#e5e7eb] px-[16px] font-['IBM_Plex_Sans_Thai'] text-[14px] text-grey bg-[#f9f9f9] outline-none"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="h-[48px] bg-orange flex items-center justify-center cursor-pointer border-none w-full lg:w-[200px] disabled:opacity-50"
        >
          <span className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[15px] text-white">
            {saving ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
          </span>
        </button>
      </div>
    </div>
  )
}
