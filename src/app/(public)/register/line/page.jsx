'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import imgFavicon from '@/assets/6727cae5f32ea2c35a94792ae9603addc6300612.png'
import imgLine from '@/assets/ee74c0d8544a46ac6f3c6d2eb640b43d65efe886.svg'
import { completeLineProfile } from '@/lib/actions/customer'

export default function LineRegisterPage() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [lineDisplayName, setLineDisplayName] = useState('')
  const [hasEmail, setHasEmail] = useState(false)
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '' })
  const [agreed, setAgreed] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    async function checkAccess() {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()

      const { data: { user } } = await supabase.auth.getUser()

      // No session — send to homepage
      if (!user) {
        router.replace('/')
        return
      }

      // Only LINE users should see this page
      const provider = user.app_metadata?.provider
      if (provider !== 'line') {
        router.replace('/')
        return
      }

      // Check if profile is already complete (first_name already set)
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('first_name, email')
        .eq('user_id', user.id)
        .single()

      if (profile?.first_name) {
        // Already completed — go to account
        router.replace('/account')
        return
      }

      // Set hasEmail flag if LINE already provided the email
      if (profile?.email) {
        setHasEmail(true)
      }

      // Show the form
      setLineDisplayName(user.user_metadata?.display_name || '')
      setChecking(false)
    }

    checkAccess()
  }, [router])

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = async () => {
    setSubmitting(true)
    setErrorMsg('')

    const result = await completeLineProfile({
      firstName: form.firstName,
      lastName: form.lastName,
      email: hasEmail ? null : form.email,
    })

    if (result?.error) {
      setErrorMsg(result.error)
      setSubmitting(false)
      return
    }

    router.push('/account')
  }

  if (checking) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-grey">กำลังโหลด...</p>
      </div>
    )
  }

  const isDisabled =
    submitting ||
    !form.firstName.trim() ||
    !form.lastName.trim() ||
    (!hasEmail && !form.email.trim()) ||
    !agreed

  return (
    <div className="py-[60px] px-[20px]">
      <div className="max-w-[450px] mx-auto">
        {/* Logo */}
        <img alt="WoodSmith" className="size-[47px] lg:size-[60px] object-cover" src={imgFavicon} />

        {/* Heading */}
        <div className="flex flex-col gap-[4px] mt-[16px] lg:mt-[24px]">
          <h2 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[20px] text-black m-0">
            สร้างบัญชี WoodSmith
          </h2>
          <p className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-grey m-0">
            โปรดกรอกรายละเอียดของคุณเพื่อสร้างบัญชี
          </p>
        </div>

        {/* LINE display name indicator */}
        <div className="flex items-center gap-[8px] mt-[16px]">
          <img alt="LINE" className="size-[20px] shrink-0" src={imgLine} />
          <p className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-black m-0">
            ลงทะเบียนด้วย LINE
            {lineDisplayName ? ` · ${lineDisplayName}` : ''}
          </p>
        </div>

        {/* Form fields */}
        <div className="flex flex-col gap-[24px] w-full mt-[24px]">
          {/* First / Last name row */}
          <div className="flex flex-col lg:flex-row gap-[24px] w-full">
            <div className="flex flex-col gap-[8px] flex-1">
              <label className="font-['IBM_Plex_Sans_Thai'] text-[11px] text-black">ชื่อจริง *</label>
              <input
                type="text"
                value={form.firstName}
                onChange={(e) => update('firstName', e.target.value)}
                className="h-[42px] border border-[#e5e7eb] px-[16px] font-['IBM_Plex_Sans_Thai'] text-[14px] text-black outline-none"
              />
            </div>
            <div className="flex flex-col gap-[8px] flex-1">
              <label className="font-['IBM_Plex_Sans_Thai'] text-[11px] text-black">นามสกุล *</label>
              <input
                type="text"
                value={form.lastName}
                onChange={(e) => update('lastName', e.target.value)}
                className="h-[42px] border border-[#e5e7eb] px-[16px] font-['IBM_Plex_Sans_Thai'] text-[14px] text-black outline-none"
              />
            </div>
          </div>

          {/* Email — hidden when LINE already provided email via ID token */}
          {!hasEmail && (
            <div className="flex flex-col gap-[8px] w-full">
              <label className="font-['IBM_Plex_Sans_Thai'] text-[11px] text-black">อีเมล *</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                className="h-[42px] border border-[#e5e7eb] px-[16px] font-['IBM_Plex_Sans_Thai'] text-[14px] text-black outline-none"
              />
              <p className="font-['IBM_Plex_Sans_Thai'] text-[11px] text-grey m-0 leading-[1.5]">
                เราเก็บอีเมลของคุณเพื่อใช้ในการแจ้งสถานะคำขอใบเสนอราคา และการแจ้งเตือนสำคัญเกี่ยวกับบัญชีของคุณเท่านั้น
              </p>
            </div>
          )}
        </div>

        {/* Terms checkbox */}
        <label className="flex gap-[8px] items-start mt-[24px] cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-[2px] size-[16px] shrink-0 accent-orange"
          />
          <span className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-black leading-[1.4]">
            ฉันได้อ่านและยอมรับ{' '}
            <span className="text-orange underline">ข้อตกลงและเงื่อนไขการใช้บริการ</span>
          </span>
        </label>

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={isDisabled}
          className="w-full h-[48px] bg-orange flex items-center justify-center cursor-pointer border-none mt-[24px] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[16px] text-white">
            {submitting ? 'กำลังบันทึก...' : 'สร้างบัญชี'}
          </span>
        </button>

        {/* Error message */}
        {errorMsg && (
          <p className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-red-500 mt-[12px] text-center">
            {errorMsg}
          </p>
        )}
      </div>
    </div>
  )
}
