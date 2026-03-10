'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/lib/toast-context'
import imgAlertWarning from '@/assets/icon-alert-warning.svg'
import imgDefaultAvatar from '@/assets/avatar-default.png'

function TrashIcon() {
  return (
    <svg className="size-[16px] shrink-0" viewBox="0 0 24 24" fill="none" stroke="#f58733" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg className="size-[16px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function ClearIcon() {
  return (
    <svg className="size-[16px] shrink-0 cursor-pointer text-[#bfbfbf] hover:text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  )
}

function ProfileField({ label, value }) {
  return (
    <div className="flex flex-col gap-[12px]">
      <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[15px] text-[#202124] leading-[28px]">
        {label}
      </span>
      <span className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[20px] text-[#202124] leading-[28px]">
        {value || '-'}
      </span>
    </div>
  )
}

function EditProfilePanel({ isOpen, onClose, user, profile, onSaved }) {
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '' })

  useEffect(() => {
    if (isOpen) {
      setForm({
        firstName: profile?.first_name || user?.user_metadata?.first_name || '',
        lastName: profile?.last_name || user?.user_metadata?.last_name || '',
        phone: profile?.phone || user?.phone || '',
      })
    }
  }, [isOpen, profile, user])

  const handleSave = async () => {
    if (saving) return
    if (!form.firstName.trim() || !form.lastName.trim()) {
      toast.error('กรุณากรอกชื่อและนามสกุล')
      return
    }
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
        onSaved()
        onClose()
      }
    } catch (err) {
      console.error('Save error:', err)
      toast.error('เกิดข้อผิดพลาด')
    }
    setSaving(false)
  }

  const phone = profile?.phone || user?.phone || ''
  const maskedPhone = phone
    ? phone.slice(0, 3) + '*'.repeat(Math.max(0, phone.length - 5)) + phone.slice(-2)
    : ''

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/75" onClick={onClose} />

      {/* Slide-out panel */}
      <div
        className="absolute right-0 top-0 h-full w-full max-w-[459px] bg-white backdrop-blur-[12px] shadow-[0px_0px_56px_0px_rgba(0,0,0,0.08)] flex flex-col justify-between px-[20px] pt-[20px] pb-[26px] animate-[slideIn_0.3s_ease-out]"
      >
        {/* Top content */}
        <div className="flex flex-col gap-[24px]">
          {/* Close button */}
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="bg-transparent border-none cursor-pointer p-0">
              <CloseIcon />
            </button>
          </div>

          {/* Header */}
          <div className="flex flex-col gap-[24px]">
            <div className="flex flex-col">
              <h2 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[24px] text-black leading-[28px] m-0">
                แก้ไขข้อมูลโปรไฟล์
              </h2>
              <p className="font-['IBM_Plex_Sans_Thai'] text-[16px] text-[#202124] leading-[1.4] m-0 mt-[4px]">
                โปรดกรอกรายละเอียดของคุณเพื่อสร้างบัญชี
              </p>
            </div>

            {maskedPhone && (
              <p className="font-['IBM_Plex_Sans_Thai'] text-[16px] text-[#202124] leading-[1.4] m-0">
                ลงทะเบียนด้วยเบอร์โทร. {maskedPhone}
              </p>
            )}

            {/* Form fields */}
            <div className="flex flex-col gap-[24px]">
              {/* First name + Last name */}
              <div className="flex flex-col gap-[24px]">
                <div className="flex flex-col gap-[12px]">
                  <label className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[16px] text-[#202124]">
                    ชื่อจริง <span className="text-[#d92429]">*</span>
                  </label>
                  <div className="flex items-center justify-between h-[42px] border border-[#e8eaef] bg-white px-[16px]">
                    <input
                      type="text"
                      value={form.firstName}
                      onChange={(e) => setForm(prev => ({ ...prev, firstName: e.target.value }))}
                      className="flex-1 border-none outline-none bg-transparent font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#202124] h-full"
                    />
                    {form.firstName && (
                      <button type="button" onClick={() => setForm(prev => ({ ...prev, firstName: '' }))} className="bg-transparent border-none p-0 cursor-pointer">
                        <ClearIcon />
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-[12px]">
                  <label className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[16px] text-[#202124]">
                    นามสกุล <span className="text-[#d92429]">*</span>
                  </label>
                  <div className="flex items-center justify-between h-[42px] border border-[#e8eaef] bg-white px-[16px]">
                    <input
                      type="text"
                      value={form.lastName}
                      onChange={(e) => setForm(prev => ({ ...prev, lastName: e.target.value }))}
                      className="flex-1 border-none outline-none bg-transparent font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#202124] h-full"
                    />
                    {form.lastName && (
                      <button type="button" onClick={() => setForm(prev => ({ ...prev, lastName: '' }))} className="bg-transparent border-none p-0 cursor-pointer">
                        <ClearIcon />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-[12px]">
                <label className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[16px] text-[#202124]">
                  เบอร์โทรศัพท์
                </label>
                <div className="flex items-center justify-between h-[42px] border border-[#e8eaef] bg-white px-[16px]">
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value.replace(/\D/g, '') }))}
                    maxLength={10}
                    placeholder="0812345678"
                    className="flex-1 border-none outline-none bg-transparent font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#202124] h-full"
                  />
                  {form.phone && (
                    <button type="button" onClick={() => setForm(prev => ({ ...prev, phone: '' }))} className="bg-transparent border-none p-0 cursor-pointer">
                      <ClearIcon />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom buttons */}
        <div className="flex gap-[8px]">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-[48px] border border-[#e5e7eb] bg-white flex items-center justify-center cursor-pointer font-['IBM_Plex_Sans_Thai'] font-semibold text-[15px] text-black leading-[24px]"
          >
            ยกเลิก
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex-1 h-[48px] bg-orange border-none flex items-center justify-center cursor-pointer font-['IBM_Plex_Sans_Thai'] font-semibold text-[15px] text-white leading-[24px] disabled:opacity-50"
          >
            {saving ? 'กำลังบันทึก...' : 'บันทึก'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AccountProfilePage() {
  const { toast } = useToast()
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const loadProfile = async () => {
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      const { data: { user: authUser } } = await supabase.auth.getUser()
      setUser(authUser)
      if (authUser) {
        const { getCustomerProfile } = await import('@/lib/actions/customer')
        const { data } = await getCustomerProfile()
        setProfile(data)
      }
    } catch (err) {
      console.error('Error loading profile:', err)
    }
    setLoading(false)
  }

  useEffect(() => { loadProfile() }, [])

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

  const displayName = profile?.first_name
    ? `${profile.first_name} ${profile.last_name || ''}`.trim()
    : user?.user_metadata?.first_name
      ? `${user.user_metadata.first_name} ${user.user_metadata.last_name || ''}`.trim()
      : '-'

  const displayEmail = profile?.email || user?.user_metadata?.email || user?.email || '-'
  const phone = profile?.phone || user?.phone || ''
  const maskedPhone = phone
    ? phone.slice(0, 3) + '*'.repeat(Math.max(0, phone.length - 5)) + phone.slice(-2)
    : '-'

  return (
    <>
      <div className="flex flex-col gap-[24px] p-[24px]">
        {/* Title */}
        <h2 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[24px] text-black leading-[28px] m-0">
          โปรไฟล์
        </h2>

        {/* Avatar + Fields */}
        <div className="flex gap-[32px] items-start">
          {/* Avatar */}
          <div className="size-[100px] rounded-full bg-[#e8e3da] overflow-hidden shrink-0 flex items-center justify-center">
            <img alt="" className="size-full object-cover" src={user?.user_metadata?.avatar_url || imgDefaultAvatar} />
          </div>

          {/* Profile fields */}
          <div className="flex flex-col gap-[32px]">
            <ProfileField label="ชื่อ-นามสกุล" value={displayName} />
            <ProfileField label="Email" value={displayEmail} />
            <ProfileField label="เบอร์โทรศัพท์" value={maskedPhone} />
          </div>
        </div>

        {/* Edit button */}
        <button
          type="button"
          onClick={() => setEditOpen(true)}
          className="w-full h-[48px] bg-orange border-none flex items-center justify-center cursor-pointer"
        >
          <span className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[16px] text-white">
            แก้ไขโปรไฟล์
          </span>
        </button>

        {/* Delete account */}
        <button
          type="button"
          onClick={() => setDeleteOpen(true)}
          className="flex items-center gap-[12px] bg-transparent border-none cursor-pointer p-0 w-fit"
        >
          <TrashIcon />
          <span className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[16px] text-[#f58733]">
            ลบบัญชี
          </span>
        </button>
      </div>

      {/* Edit profile slide-out */}
      <EditProfilePanel
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        user={user}
        profile={profile}
        onSaved={loadProfile}
      />

      {/* Delete account confirmation modal */}
      {deleteOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => !deleting && setDeleteOpen(false)} />
          <div className="relative bg-white shadow-[0px_6px_16px_0px_rgba(0,33,70,0.12)] flex flex-col items-center py-[20px] w-[480px] max-w-[90vw]">
            {/* Warning icon */}
            <img alt="" src={imgAlertWarning} className="size-[64px] shrink-0" />

            {/* Text */}
            <div className="flex flex-col gap-[16px] items-center text-center px-[40px] mt-[20px] w-full">
              <p className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[20px] text-[#18191f] leading-[1.2] m-0 w-full overflow-hidden text-ellipsis">
                ลบบัญชีของคุณ?
              </p>
              <div className="font-['IBM_Plex_Sans_Thai'] text-[15px] text-[#18191f] leading-[1.5] w-full">
                <p className="m-0">การลบบัญชี WoodSmith จะส่งผลให้คุณสูญเสียการเข้าถึงบริการทั้งหมด ข้อมูลส่วนตัว และประวัติการใช้งานของคุณทันที</p>
                <p className="m-0 mt-[16px]">คุณจะไม่สามารถกู้คืนบัญชีหรือข้อมูลใดๆ ที่เชื่อมโยงกับบัญชีนี้ได้อีก</p>
                <p className="m-0">หากคุณยืนยัน คุณจะลบบัญชีของคุณทันที</p>
              </div>
            </div>

            {/* Separator */}
            <div className="w-full border-t border-[#e5e7eb] mt-[20px]" />

            {/* Buttons */}
            <div className="flex gap-[8px] w-[278px] mt-[20px]">
              <button
                type="button"
                disabled={deleting}
                onClick={async () => {
                  setDeleting(true)
                  try {
                    const { deleteMyAccount } = await import('@/lib/actions/customer')
                    const { error } = await deleteMyAccount()
                    if (error) {
                      toast.error('เกิดข้อผิดพลาด: ' + error)
                      setDeleting(false)
                    } else {
                      const { createClient } = await import('@/lib/supabase/client')
                      const supabase = createClient()
                      await supabase.auth.signOut()
                      router.push('/')
                    }
                  } catch {
                    toast.error('เกิดข้อผิดพลาด')
                    setDeleting(false)
                  }
                }}
                className="flex-1 h-[48px] bg-orange border-none flex items-center justify-center cursor-pointer disabled:opacity-50 font-['IBM_Plex_Sans_Thai'] font-semibold text-[15px] text-white leading-[24px]"
              >
                {deleting ? 'กำลังลบ...' : 'ใช่ ลบทันที'}
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={() => setDeleteOpen(false)}
                className="flex-1 h-[48px] border border-[#e5e7eb] bg-white flex items-center justify-center cursor-pointer font-['IBM_Plex_Sans_Thai'] font-semibold text-[15px] text-black leading-[24px]"
              >
                ยังก่อน
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
