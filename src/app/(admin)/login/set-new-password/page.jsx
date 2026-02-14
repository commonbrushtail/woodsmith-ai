'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updatePassword } from '@/lib/actions/auth'

export default function SetNewPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('รหัสผ่านไม่ตรงกัน')
      return
    }

    setLoading(true)
    const result = await updatePassword(password)

    if (result.error) {
      setError(result.error)
      setLoading(false)
      return
    }

    router.push('/login?reset=success')
  }

  return (
    <div className="min-h-screen bg-[#f6f6f9] flex flex-col items-center justify-center px-[16px]">
      <div className="flex flex-col items-center gap-[17px] w-full max-w-[540px]">
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
                ตั้งรหัสผ่านใหม่
              </h1>
            </div>

            {/* New Password */}
            <div className="flex flex-col gap-[12px]">
              <label className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[15px] text-[#202124]">
                รหัสผ่านใหม่ <span className="text-[#d92429]">*</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(null) }}
                placeholder="อย่างน้อย 8 ตัวอักษร"
                className="w-full bg-white border border-[#e8eaef] rounded-[6px] px-[16px] py-[18px] font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#202124] placeholder:text-grey outline-none focus:border-orange"
              />
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-[12px]">
              <label className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[15px] text-[#202124]">
                ยืนยันรหัสผ่านใหม่ <span className="text-[#d92429]">*</span>
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setError(null) }}
                placeholder="กรอกรหัสผ่านอีกครั้ง"
                className={`w-full bg-white border ${error ? 'border-[#ef4444]' : 'border-[#e8eaef]'} rounded-[6px] px-[16px] py-[18px] font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#202124] placeholder:text-grey outline-none focus:border-orange`}
              />
              {error && (
                <p className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#ef4444] m-0">{error}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !password || !confirmPassword}
              className="w-full h-[48px] bg-orange text-white font-['IBM_Plex_Sans_Thai'] font-medium text-[16px] border-none rounded-none cursor-pointer hover:bg-orange/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'กำลังบันทึก...' : 'บันทึกรหัสผ่านใหม่'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
