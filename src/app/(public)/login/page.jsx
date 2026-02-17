'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import imgFavicon from '@/assets/6727cae5f32ea2c35a94792ae9603addc6300612.png'
import imgLine from '@/assets/ee74c0d8544a46ac6f3c6d2eb640b43d65efe886.svg'

// ─── Phone entry screen ───────────────────────────────────────────────────────

function PhoneScreen({ onSendOtp, onLineLogin }) {
  const [phone, setPhone] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  const handleSend = async () => {
    setSending(true)
    setError('')
    const result = await onSendOtp(phone)
    if (result?.error) {
      setError(result.error)
      setSending(false)
    }
    // On success, sending stays true — parent navigates to OTP screen
  }

  return (
    <div className="flex flex-col items-center w-full">
      <img alt="WoodSmith" className="size-[60px] object-cover" src={imgFavicon} />

      <div className="mt-[24px] text-center">
        <h2 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[20px] lg:text-[24px] text-orange leading-[1.2] m-0">
          WoodSmith ยินดีต้อนรับ
        </h2>
      </div>

      <div className="flex flex-col gap-[16px] w-full mt-[40px]">
        <input
          type="tel"
          maxLength={10}
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
          placeholder="กรอกเบอร์โทรศัพท์มือถือ 10 หลัก"
          className="w-full h-[48px] border border-[#e5e7eb] px-[16px] font-['IBM_Plex_Sans_Thai'] text-[14px] text-black placeholder:text-grey outline-none text-center"
        />

        <button
          onClick={handleSend}
          disabled={phone.length !== 10 || sending}
          className="w-full h-[48px] bg-orange flex items-center justify-center cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[16px] text-white">
            {sending ? 'กำลังส่ง OTP...' : 'เข้าสู่ระบบ'}
          </span>
        </button>

        {error && (
          <p className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#dc2626] m-0 text-center">{error}</p>
        )}

        <p className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-grey text-center m-0">หรือ</p>

        <button
          onClick={onLineLogin}
          className="w-full h-[48px] border border-[#e5e7eb] flex items-center justify-center gap-[12px] cursor-pointer bg-transparent"
        >
          <img alt="LINE" className="size-[24px] shrink-0" src={imgLine} />
          <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] text-black">
            เข้าสู่ระบบด้วย LINE
          </span>
        </button>
      </div>
    </div>
  )
}

// ─── OTP verification screen ──────────────────────────────────────────────────

function OtpScreen({ phone, refCode, onVerify, onResend, onBack }) {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [countdown, setCountdown] = useState(179)
  const [verifying, setVerifying] = useState(false)
  const [error, setError] = useState('')
  const inputRefs = useRef([])

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  useEffect(() => {
    if (countdown <= 0) return
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000)
    return () => clearInterval(timer)
  }, [countdown])

  const formatTime = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0')
    const sec = (s % 60).toString().padStart(2, '0')
    return `00:${m}:${sec}`
  }

  const maskedPhone = phone
    ? `${phone.slice(0, 3)}*****${phone.slice(-2)}`
    : ''

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    if (value && index < 5) inputRefs.current[index + 1]?.focus()
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleResend = async () => {
    if (countdown > 0) return
    setCountdown(179)
    setOtp(['', '', '', '', '', ''])
    setError('')
    await onResend()
  }

  const handleVerify = async () => {
    setVerifying(true)
    setError('')
    const result = await onVerify(otp.join(''))
    if (result?.error) {
      setError(result.error)
      setOtp(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
      setVerifying(false)
    }
    // On success, verifying stays true — parent navigates away
  }

  return (
    <div className="flex flex-col items-start w-full">
      <button
        onClick={onBack}
        className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-grey bg-transparent border-none p-0 cursor-pointer mb-[24px]"
      >
        ← ย้อนกลับ
      </button>

      <h2 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[20px] text-black leading-[1.2] m-0">
        เข้าสู่ระบบด้วย OTP
      </h2>

      <div className="flex flex-col gap-[8px] mt-[16px]">
        <p className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-black leading-[1.4] m-0">
          กรอกรหัส OTP 6 หลักที่ส่งไปยังหมายเลข {maskedPhone}
        </p>
        <p className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-black m-0">
          รหัสอ้างอิง : {refCode}
        </p>
      </div>

      <div className="flex gap-[8px] mt-[24px]">
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={(el) => (inputRefs.current[i] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className="size-[52px] border border-[#e5e7eb] text-center font-['IBM_Plex_Sans_Thai'] font-semibold text-[20px] text-black outline-none focus:border-orange"
          />
        ))}
      </div>

      <button
        onClick={handleResend}
        disabled={countdown > 0}
        className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-black mt-[16px] bg-transparent border-none p-0 cursor-pointer disabled:cursor-default disabled:text-grey"
      >
        {countdown > 0
          ? `ส่งรหัสอีกครั้งในอีก ${formatTime(countdown)}`
          : 'ส่งรหัส OTP อีกครั้ง'}
      </button>

      {error && (
        <p className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#dc2626] mt-[12px] m-0">{error}</p>
      )}

      <button
        onClick={handleVerify}
        disabled={otp.some((d) => !d) || verifying}
        className="w-full h-[48px] bg-orange flex items-center justify-center cursor-pointer border-none mt-[24px] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[16px] text-white">
          {verifying ? 'กำลังตรวจสอบ...' : 'ยืนยัน'}
        </span>
      </button>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const router = useRouter()
  const [screen, setScreen] = useState('phone') // 'phone' | 'otp'
  const [phone, setPhone] = useState('')
  const [refCode, setRefCode] = useState('')

  // Redirect already-logged-in users
  useEffect(() => {
    async function check() {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user?.user_metadata?.profile_complete) {
        router.replace('/account')
      }
    }
    check()
  }, [router])

  const handleSendOtp = async (phoneNumber) => {
    try {
      setPhone(phoneNumber)
      const { sendPhoneOtp } = await import('@/lib/actions/phone-auth')
      const result = await sendPhoneOtp(phoneNumber)
      if (result?.error) {
        return { error: result.error }
      }
      setRefCode(result?.refCode || '')
      setScreen('otp')
    } catch (err) {
      console.error('OTP send error:', err)
      return { error: 'ไม่สามารถส่ง OTP ได้ กรุณาตรวจสอบเบอร์โทรและลองใหม่' }
    }
  }

  const handleVerifyOtp = async (otpCode) => {
    try {
      const { verifyPhoneOtp } = await import('@/lib/actions/phone-auth')
      const result = await verifyPhoneOtp(phone, otpCode)
      if (result?.error) {
        return { error: result.error }
      }
      if (result?.profileComplete) {
        // Refresh session so navbar picks up the new user_metadata
        const { createClient } = await import('@/lib/supabase/client')
        const supabase = createClient()
        await supabase.auth.refreshSession()
        router.push('/account')
      } else {
        router.push('/register/phone')
      }
    } catch (err) {
      console.error('OTP verify error:', err)
      return { error: 'รหัส OTP ไม่ถูกต้องหรือหมดอายุ' }
    }
  }

  const handleLineLogin = async () => {
    const { getLineLoginUrl } = await import('@/lib/auth/line-config')
    const state = crypto.randomUUID()
    sessionStorage.setItem('line_oauth_state', state)
    window.location.href = getLineLoginUrl(state)
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-[60px] px-[20px]">
      <div className="w-full max-w-[420px]">
        {screen === 'phone' && (
          <PhoneScreen
            onSendOtp={handleSendOtp}
            onLineLogin={handleLineLogin}
          />
        )}
        {screen === 'otp' && (
          <OtpScreen
            phone={phone}
            refCode={refCode}
            onVerify={handleVerifyOtp}
            onResend={() => handleSendOtp(phone)}
            onBack={() => setScreen('phone')}
          />
        )}
      </div>
    </div>
  )
}
