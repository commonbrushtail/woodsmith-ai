'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import imgFavicon from '@/assets/6727cae5f32ea2c35a94792ae9603addc6300612.png'

export default function RegisterCompletePage() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-grey">กำลังโหลด...</p>
      </div>
    }>
      <RegisterCompleteContent />
    </Suspense>
  )
}

function RegisterCompleteContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [checking, setChecking] = useState(true)
  const [form, setForm] = useState({ firstName: '', lastName: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [agreed, setAgreed] = useState(false)

  const token = searchParams.get('token')

  // Verify token on mount
  useEffect(() => {
    if (!token) {
      router.replace('/register')
      return
    }

    async function verify() {
      const { verifyRegistrationToken } = await import('@/lib/actions/auth')
      const { email: verifiedEmail, error: verifyError } = await verifyRegistrationToken(token)

      if (verifyError) {
        setError(verifyError)
        setChecking(false)
        return
      }

      setEmail(verifiedEmail)
      setChecking(false)
    }
    verify()
  }, [token, router])

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (form.password.length < 8) {
      setError('รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร')
      return
    }

    if (form.password !== form.confirmPassword) {
      setError('รหัสผ่านไม่ตรงกัน')
      return
    }

    setSubmitting(true)

    const { completeRegistration } = await import('@/lib/actions/auth')
    const { email: registeredEmail, error: regError } = await completeRegistration({
      token,
      password: form.password,
      firstName: form.firstName,
      lastName: form.lastName,
    })

    if (regError) {
      setError(regError)
      setSubmitting(false)
      return
    }

    // Sign in the newly created user
    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()
    await supabase.auth.signInWithPassword({ email: registeredEmail, password: form.password })

    router.push('/account')
  }

  if (!token || checking) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-grey">กำลังโหลด...</p>
      </div>
    )
  }

  // Show error state (expired/invalid token) with link back to register
  if (error && !email) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-[20px]">
        <div className="text-center">
          <p className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-red-500 m-0">{error}</p>
          <a href="/register" className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-orange underline mt-[16px] inline-block">
            กลับไปหน้าสมัครสมาชิก
          </a>
        </div>
      </div>
    )
  }

  const isDisabled =
    submitting ||
    !form.firstName.trim() ||
    !form.lastName.trim() ||
    !form.password ||
    !form.confirmPassword ||
    !agreed

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-[60px] px-[20px]">
      <div className="w-full max-w-[450px]">
        <div className="flex flex-col items-center">
          <img alt="WoodSmith" className="size-[60px] object-contain" src={imgFavicon} />

          <div className="mt-[24px] text-center">
            <h2 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[20px] lg:text-[24px] text-orange leading-[1.2] m-0">
              สร้างบัญชี WoodSmith
            </h2>
            <p className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-grey mt-[8px] m-0">
              กรอกข้อมูลเพื่อเสร็จสิ้นการสมัครสมาชิก
            </p>
            <p className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-black mt-[4px] m-0">
              {email}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-[24px] w-full mt-[32px]">
          {/* First / Last name row */}
          <div className="flex flex-col lg:flex-row gap-[24px] w-full">
            <div className="flex flex-col gap-[8px] flex-1">
              <label className="font-['IBM_Plex_Sans_Thai'] text-[11px] text-black">ชื่อจริง *</label>
              <input
                type="text"
                value={form.firstName}
                onChange={(e) => update('firstName', e.target.value)}
                required
                className="h-[42px] border border-[#e5e7eb] px-[16px] font-['IBM_Plex_Sans_Thai'] text-[14px] text-black outline-none rounded-[4px]"
              />
            </div>
            <div className="flex flex-col gap-[8px] flex-1">
              <label className="font-['IBM_Plex_Sans_Thai'] text-[11px] text-black">นามสกุล *</label>
              <input
                type="text"
                value={form.lastName}
                onChange={(e) => update('lastName', e.target.value)}
                required
                className="h-[42px] border border-[#e5e7eb] px-[16px] font-['IBM_Plex_Sans_Thai'] text-[14px] text-black outline-none rounded-[4px]"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-[8px]">
            <label className="font-['IBM_Plex_Sans_Thai'] text-[11px] text-black">รหัสผ่าน *</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => update('password', e.target.value)}
              required
              placeholder="อย่างน้อย 8 ตัวอักษร"
              className="h-[42px] border border-[#e5e7eb] px-[16px] font-['IBM_Plex_Sans_Thai'] text-[14px] text-black outline-none rounded-[4px]"
            />
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-[8px]">
            <label className="font-['IBM_Plex_Sans_Thai'] text-[11px] text-black">ยืนยันรหัสผ่าน *</label>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={(e) => update('confirmPassword', e.target.value)}
              required
              className="h-[42px] border border-[#e5e7eb] px-[16px] font-['IBM_Plex_Sans_Thai'] text-[14px] text-black outline-none rounded-[4px]"
            />
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
              <a href="/terms" target="_blank" className="text-black underline">ข้อกำหนดและเงื่อนไขการใช้งาน</a>
            </span>
          </label>

          {error && (
            <p className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-red-500 m-0 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={isDisabled}
            className="w-full h-[48px] bg-orange flex items-center justify-center cursor-pointer border-none rounded-[4px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[16px] text-white">
              {submitting ? 'กำลังสร้างบัญชี...' : 'สร้างบัญชี'}
            </span>
          </button>
        </form>
      </div>
    </div>
  )
}
