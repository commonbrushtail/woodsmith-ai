'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import imgFavicon from '../assets/6727cae5f32ea2c35a94792ae9603addc6300612.png'
import imgLine from '../assets/ee74c0d8544a46ac6f3c6d2eb640b43d65efe886.svg'

function CloseIcon() {
  return (
    <svg className="size-[16px] shrink-0" viewBox="0 0 16 16" fill="none">
      <path d="M12 4L4 12M4 4L12 12" stroke="#35383b" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export default function LoginModal({ isOpen, onClose }) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  const handleLineLogin = () => {
    const state = crypto.randomUUID()
    document.cookie = `line_oauth_state=${state}; Path=/; Max-Age=600; SameSite=Lax`
    const channelId = process.env.NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: channelId,
      redirect_uri: `${siteUrl}/auth/callback/line`,
      state,
      scope: 'openid profile email',
    })
    window.location.href = `https://access.line.me/oauth2/v2.1/authorize?${params}`
  }

  const handleEmailLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { createClient } = await import('../lib/supabase/client')
    const supabase = createClient()

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง')
      setLoading(false)
      return
    }

    onClose()
    router.refresh()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60" />

      <div
        className="relative bg-white w-full max-w-[390px] lg:max-w-[450px] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex">
          {/* Desktop: Side image */}
          <div className="hidden lg:block w-[180px] shrink-0 bg-dark-brown relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-dark-brown/80 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <img alt="WoodSmith" className="size-[120px] object-contain opacity-30" src={imgFavicon} />
            </div>
          </div>

          {/* Content area */}
          <div className="flex-1 p-[20px] lg:p-[36px] relative">
            <button
              onClick={onClose}
              className="absolute top-[20px] right-[20px] cursor-pointer bg-transparent border-none p-0 z-10"
            >
              <CloseIcon />
            </button>

            <div className="mt-[16px] flex flex-col items-center">
              <img alt="WoodSmith" className="size-[60px] object-contain" src={imgFavicon} />
              <div className="mt-[24px] text-center">
                <h2 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[20px] lg:text-[24px] text-orange leading-[1.2] m-0">
                  WoodSmith ยินดีต้อนรับ
                </h2>
                <p className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-grey mt-[8px] m-0">
                  เข้าสู่ระบบเพื่อดำเนินการต่อ
                </p>
              </div>

              {/* LINE login */}
              <div className="w-full mt-[24px]">
                <button
                  onClick={handleLineLogin}
                  className="w-full h-[44px] bg-[#06C755] flex items-center justify-center gap-[12px] cursor-pointer border-none rounded-[4px]"
                >
                  <img alt="LINE" className="size-[24px] shrink-0" src={imgLine} />
                  <span className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[14px] text-white">
                    เข้าสู่ระบบด้วย LINE
                  </span>
                </button>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-[12px] w-full mt-[16px]">
                <div className="flex-1 h-[1px] bg-[#e5e7eb]" />
                <span className="font-['IBM_Plex_Sans_Thai'] text-[12px] text-grey">หรือ</span>
                <div className="flex-1 h-[1px] bg-[#e5e7eb]" />
              </div>

              {/* Email/Password form */}
              <form onSubmit={handleEmailLogin} className="flex flex-col gap-[12px] w-full mt-[16px]">
                <input
                  type="email"
                  placeholder="อีเมล"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-[42px] border border-[#e5e7eb] px-[16px] font-['IBM_Plex_Sans_Thai'] text-[14px] text-black outline-none rounded-[4px]"
                />
                <input
                  type="password"
                  placeholder="รหัสผ่าน"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-[42px] border border-[#e5e7eb] px-[16px] font-['IBM_Plex_Sans_Thai'] text-[14px] text-black outline-none rounded-[4px]"
                />

                {error && (
                  <p className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-red-500 m-0 text-center">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-[44px] bg-orange flex items-center justify-center cursor-pointer border-none rounded-[4px] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[14px] text-white">
                    {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
                  </span>
                </button>
              </form>

              {/* Register link */}
              <p className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-grey mt-[16px] m-0">
                ยังไม่มีบัญชี?{' '}
                <a href="/register" className="text-orange underline" onClick={onClose}>สมัครสมาชิก</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
