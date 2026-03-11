'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updatePassword } from '@/lib/actions/auth'
import imgFavicon from '@/assets/6727cae5f32ea2c35a94792ae9603addc6300612.png'

export default function CustomerSetNewPasswordPage() {
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
    <div className="min-h-[70vh] flex items-center justify-center py-[60px] px-[20px]">
      <div className="w-full max-w-[420px] flex flex-col items-center">
        <img alt="WoodSmith" className="size-[60px] object-contain" src={imgFavicon} />

        <div className="mt-[24px] text-center">
          <h2 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[20px] lg:text-[24px] text-orange leading-[1.2] m-0">
            ตั้งรหัสผ่านใหม่
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-[16px] w-full mt-[32px]">
          <div className="flex flex-col gap-[8px]">
            <label className="font-['IBM_Plex_Sans_Thai'] text-[11px] text-black">รหัสผ่านใหม่</label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(null) }}
              required
              placeholder="อย่างน้อย 8 ตัวอักษร"
              className="h-[42px] border border-[#e5e7eb] px-[16px] font-['IBM_Plex_Sans_Thai'] text-[14px] text-black outline-none rounded-[4px] focus:border-orange"
            />
          </div>

          <div className="flex flex-col gap-[8px]">
            <label className="font-['IBM_Plex_Sans_Thai'] text-[11px] text-black">ยืนยันรหัสผ่านใหม่</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); setError(null) }}
              required
              placeholder="กรอกรหัสผ่านอีกครั้ง"
              className={`h-[42px] border ${error ? 'border-red-500' : 'border-[#e5e7eb]'} px-[16px] font-['IBM_Plex_Sans_Thai'] text-[14px] text-black outline-none rounded-[4px] focus:border-orange`}
            />
            {error && (
              <p className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-red-500 m-0">{error}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !password || !confirmPassword}
            className="w-full h-[48px] bg-orange flex items-center justify-center cursor-pointer border-none rounded-[4px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[16px] text-white">
              {loading ? 'กำลังบันทึก...' : 'บันทึกรหัสผ่านใหม่'}
            </span>
          </button>
        </form>
      </div>
    </div>
  )
}
