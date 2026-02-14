'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { adminLogin } from '@/lib/actions/admin-login'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await adminLogin(email, password)

    if (result.error) {
      setError(result.error)
      setLoading(false)
      return
    }

    router.push('/admin/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[#f6f6f9] flex flex-col items-center justify-center px-[16px]">
      <div className="flex flex-col items-center gap-[16px] w-full max-w-[540px]">
        {/* Sign In Card */}
        <div className="bg-white w-full shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] px-[44px] py-[48px]">
          <form onSubmit={handleSubmit} className="flex flex-col gap-[24px]">
            {/* Logo & Title */}
            <div className="flex flex-col items-center gap-[16px]">
              <img
                alt="WoodSmith"
                src="/favicon.png"
                className="h-[84px] w-[67px] object-cover"
              />
              <div className="flex flex-col items-center">
                <h1 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[24px] text-[#202124] leading-[28px] m-0">
                  ยินดีต้อนรับสู่ Woodsmith
                </h1>
                <p className="font-['IBM_Plex_Sans_Thai'] text-[16px] text-[#979797] leading-[28px] m-0">
                  เข้าสู่ระบบบัญชี Woodsmith
                </p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="flex flex-col gap-[16px]">
              {/* Email */}
              <div className="flex flex-col gap-[12px]">
                <label className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[15px] text-[#202124]">
                  อีเมล <span className="text-[#d92429]">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@youremail.com"
                  className="w-full bg-white border border-[#e8eaef] rounded-[6px] px-[16px] py-[18px] font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#202124] placeholder:text-grey outline-none focus:border-orange"
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-[12px]">
                <label className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[15px] text-[#202124]">
                  รหัสผ่าน <span className="text-[#d92429]">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full bg-white border border-[#e8eaef] rounded-[6px] px-[16px] py-[12px] h-[46px] font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#202124] placeholder:text-grey outline-none focus:border-orange pr-[48px]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-[16px] top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-0"
                  >
                    {showPassword ? (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    ) : (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <label className="flex items-center gap-[16px] cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="size-[16px] rounded-[4px] border border-[#e5e7eb] accent-orange"
                />
                <span className="font-['IBM_Plex_Sans_Thai'] text-[16px] text-[#1f2937]">
                  จำฉันไว้
                </span>
              </label>

              {/* Error Message */}
              {error && (
                <p className="text-[#d92429] font-['IBM_Plex_Sans_Thai'] text-[14px] m-0" role="alert">
                  {error}
                </p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-[48px] bg-orange text-white font-['IBM_Plex_Sans_Thai'] font-medium text-[16px] border-none rounded-none cursor-pointer hover:bg-orange/90 disabled:opacity-50"
              >
                {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
              </button>
            </div>
          </form>
        </div>

        {/* Forgot Password Link */}
        <Link
          href="/login/forgot-password"
          className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[16px] text-black no-underline hover:underline h-[48px] flex items-center justify-center"
        >
          ลืมรหัสผ่าน?
        </Link>
      </div>
    </div>
  )
}
