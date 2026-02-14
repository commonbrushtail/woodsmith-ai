'use client'

import { useState, useRef, useEffect } from 'react'
import imgFavicon from '../assets/6727cae5f32ea2c35a94792ae9603addc6300612.png'
import imgLine from '../assets/ee74c0d8544a46ac6f3c6d2eb640b43d65efe886.svg'

function CloseIcon() {
  return (
    <svg className="size-[16px] shrink-0" viewBox="0 0 16 16" fill="none">
      <path d="M12 4L4 12M4 4L12 12" stroke="#35383b" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

// Screen: Phone Login
function PhoneLoginScreen({ onSendOtp, onLineLogin }) {
  const [phone, setPhone] = useState('')

  return (
    <div className="flex flex-col items-center w-full">
      <img alt="WoodSmith" className="size-[60px] lg:size-[60px] object-cover" src={imgFavicon} />
      <div className="mt-[24px] text-center">
        <h2 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[20px] lg:text-[24px] text-orange leading-[1.2] m-0">
          WoodSmith ยินดีต้อนรับ
        </h2>
      </div>

      <div className="flex flex-col gap-[16px] w-full mt-[32px] lg:mt-[40px]">
        {/* Phone input */}
        <input
          type="tel"
          maxLength={10}
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
          placeholder="กรอกเบอร์โทรศัพท์มือถือ 10 หลัก"
          className="w-full h-[47px] lg:h-[48px] border border-[#e5e7eb] px-[16px] font-['IBM_Plex_Sans_Thai'] text-[14px] text-black placeholder:text-grey outline-none text-center"
        />

        {/* Login button */}
        <button
          onClick={() => phone.length === 10 && onSendOtp(phone)}
          disabled={phone.length !== 10}
          className="w-full h-[48px] bg-orange flex items-center justify-center cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[16px] text-white">
            เข้าสู่ระบบ
          </span>
        </button>

        {/* Divider */}
        <p className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-grey text-center">หรือ</p>

        {/* LINE login */}
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

// Screen: OTP Verification
function OtpScreen({ phone, isNewAccount, onVerify, onResend, onBack }) {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [countdown, setCountdown] = useState(179)
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
    : '088*****13'

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleResend = () => {
    if (countdown <= 0) {
      setCountdown(179)
      setOtp(['', '', '', '', '', ''])
      onResend()
    }
  }

  return (
    <div className="flex flex-col items-start w-full">
      <h2 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[18px] text-black leading-[1.2] m-0">
        {isNewAccount ? 'ป้อนรหัสยืนยัน' : 'เข้าสู่ระบบด้วย OTP'}
      </h2>

      <div className="flex flex-col gap-[8px] mt-[16px]">
        <p className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-black leading-[1.4] m-0">
          กรอกรหัส OTP 6 หลักที่ส่งไปยังหมายเลข {maskedPhone}
        </p>
        <p className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-black m-0">
          รหัสอ้างอิง : ab1234
        </p>
      </div>

      {/* OTP Inputs */}
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

      {/* Resend timer */}
      <button
        onClick={handleResend}
        disabled={countdown > 0}
        className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-black mt-[16px] bg-transparent border-none p-0 cursor-pointer disabled:cursor-default"
      >
        {countdown > 0
          ? `ส่งรหัสอีกครั้งในอีก ${formatTime(countdown)}`
          : 'ส่งรหัส OTP อีกครั้ง'}
      </button>

      {/* Verify button */}
      <button
        onClick={() => onVerify(otp.join(''))}
        disabled={otp.some((d) => !d)}
        className="w-full h-[48px] bg-orange flex items-center justify-center cursor-pointer border-none mt-[24px] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[16px] text-white">
          ยืนยัน
        </span>
      </button>
    </div>
  )
}

// Screen: Registration
function RegisterScreen({ phone, onRegister, onBack }) {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '' })
  const [agreed, setAgreed] = useState(false)

  const maskedPhone = phone
    ? `${phone.slice(0, 3)}*****${phone.slice(-2)}`
    : '088*****13'

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }))

  return (
    <div className="flex flex-col items-start w-full">
      <img alt="WoodSmith" className="size-[47px] lg:size-[60px] object-cover" src={imgFavicon} />

      <div className="flex flex-col gap-[4px] mt-[16px] lg:mt-[24px]">
        <h2 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[20px] text-black m-0">
          สร้างบัญชี WoodSmith
        </h2>
        <p className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-grey m-0">
          โปรดกรอกรายละเอียดของคุณเพื่อสร้างบัญชี
        </p>
      </div>

      <p className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-black mt-[16px] m-0">
        ลงทะเบียนด้วยเบอร์โทร. {maskedPhone}
      </p>

      {/* Form */}
      <div className="flex flex-col gap-[24px] w-full mt-[24px]">
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
        <div className="flex flex-col gap-[8px] w-full">
          <label className="font-['IBM_Plex_Sans_Thai'] text-[11px] text-black">อีเมล *</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            className="h-[42px] border border-[#e5e7eb] px-[16px] font-['IBM_Plex_Sans_Thai'] text-[14px] text-black outline-none"
          />
        </div>
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

      {/* Register button */}
      <button
        onClick={() => onRegister(form)}
        disabled={!form.firstName || !form.lastName || !form.email || !agreed}
        className="w-full h-[48px] bg-orange flex items-center justify-center cursor-pointer border-none mt-[24px] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[16px] text-white">
          สร้างบัญชี
        </span>
      </button>

      {/* Back to login */}
      <button
        onClick={onBack}
        className="w-full h-[48px] border border-[#e5e7eb] flex items-center justify-center cursor-pointer bg-transparent mt-[8px]"
      >
        <span className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[16px] text-black">
          กลับไปเข้าสู่ระบบ
        </span>
      </button>
    </div>
  )
}

export default function LoginModal({ isOpen, onClose }) {
  const [screen, setScreen] = useState('login') // 'login' | 'otp' | 'otp-new' | 'register'
  const [phone, setPhone] = useState('')

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setScreen('login')
      setPhone('')
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  const handleSendOtp = async (phoneNumber) => {
    setPhone(phoneNumber)
    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()
    const formatted = phoneNumber.startsWith('0')
      ? '+66' + phoneNumber.slice(1)
      : phoneNumber
    const { error } = await supabase.auth.signInWithOtp({ phone: formatted })
    if (error) {
      console.error('OTP send error:', error.message)
    }
    setScreen('otp-new')
  }

  const handleVerifyOtp = async (otpCode) => {
    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()
    const formatted = phone.startsWith('0')
      ? '+66' + phone.slice(1)
      : phone
    const { error } = await supabase.auth.verifyOtp({
      phone: formatted,
      token: otpCode,
      type: 'sms',
    })
    if (error) {
      console.error('OTP verify error:', error.message)
      return
    }
    if (screen === 'otp-new') {
      setScreen('register')
    } else {
      onClose()
    }
  }

  const handleLineLogin = async () => {
    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'kakao', // LINE uses custom OIDC — placeholder until configured
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  const handleRegister = async (formData) => {
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        console.error('No authenticated user found for registration')
        return
      }

      const displayName = `${formData.firstName} ${formData.lastName}`.trim()

      // Update user metadata in Supabase Auth
      await supabase.auth.updateUser({
        data: { display_name: displayName, email: formData.email },
      })

      // Create customer profile row via server action
      const { createCustomerProfile } = await import('@/lib/actions/customer')
      await createCustomerProfile(user.id, {
        displayName,
        phone: phone,
        email: formData.email,
      })

      onClose()
    } catch (err) {
      console.error('Registration error:', err)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60" />

      {/* Modal container */}
      <div
        className="relative bg-white w-full max-w-[390px] lg:max-w-[681px] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Desktop: Side image (only on login screen) */}
        <div className="flex">
          {screen === 'login' && (
            <div className="hidden lg:block w-[230px] shrink-0 bg-dark-brown relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-dark-brown/80 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <img alt="WoodSmith" className="size-[120px] object-contain opacity-30" src={imgFavicon} />
              </div>
            </div>
          )}

          {/* Content area */}
          <div className="flex-1 p-[20px] lg:p-[36px] relative">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-[20px] right-[20px] cursor-pointer bg-transparent border-none p-0 z-10"
            >
              <CloseIcon />
            </button>

            {/* Screens */}
            <div className="mt-[16px]">
              {screen === 'login' && (
                <PhoneLoginScreen
                  onSendOtp={handleSendOtp}
                  onLineLogin={handleLineLogin}
                />
              )}
              {(screen === 'otp' || screen === 'otp-new') && (
                <OtpScreen
                  phone={phone}
                  isNewAccount={screen === 'otp-new'}
                  onVerify={handleVerifyOtp}
                  onResend={() => {}}
                  onBack={() => setScreen('login')}
                />
              )}
              {screen === 'register' && (
                <RegisterScreen
                  phone={phone}
                  onRegister={handleRegister}
                  onBack={() => setScreen('login')}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
