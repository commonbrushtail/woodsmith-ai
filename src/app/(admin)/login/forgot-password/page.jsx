'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const router = useRouter()

  const handleSubmit = (e) => {
    e.preventDefault()
    router.push('/login/forgot-password/sent')
  }

  return (
    <div className="min-h-screen bg-[#f6f6f9] flex flex-col items-center justify-center px-[16px]">
      <div className="flex flex-col items-center gap-[17px] w-full max-w-[540px]">
        {/* Forgot Password Card */}
        <div className="bg-white w-full shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] px-[44px] py-[48px]">
          <form onSubmit={handleSubmit} className="flex flex-col gap-[24px]">
            {/* Logo & Title */}
            <div className="flex flex-col items-center gap-[16px]">
              <img
                alt="WoodSmith"
                src="/favicon.png"
                className="h-[84px] w-[67px] object-cover"
              />
              <h1 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[24px] text-[#202124] leading-[28px] m-0">
                กู้คืนรหัสผ่าน
              </h1>
            </div>

            {/* Email Field */}
            <div className="flex flex-col gap-[12px]">
              <label className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[15px] text-[#202124]">
                อีเมล <span className="text-[#d92429]">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@woodsmith.co.th"
                className="w-full bg-white border border-[#e8eaef] rounded-[6px] px-[16px] py-[18px] font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#202124] placeholder:text-grey outline-none focus:border-orange"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full h-[48px] bg-orange text-white font-['IBM_Plex_Sans_Thai'] font-medium text-[16px] border-none rounded-none cursor-pointer hover:bg-orange/90"
            >
              ส่งอีเมล
            </button>
          </form>
        </div>

        {/* Back to Login Link */}
        <Link
          href="/login"
          className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[16px] text-black no-underline hover:underline h-[48px] flex items-center justify-center"
        >
          พร้อมที่จะเข้าสู่ระบบแล้วหรือยัง?
        </Link>
      </div>
    </div>
  )
}
