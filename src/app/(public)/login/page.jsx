'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import imgFavicon from '@/assets/6727cae5f32ea2c35a94792ae9603addc6300612.png'
import imgLine from '@/assets/ee74c0d8544a46ac6f3c6d2eb640b43d65efe886.svg'

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const resetSuccess = searchParams.get('reset') === 'success'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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

    const { createClient } = await import('@/lib/supabase/client')
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

    router.push('/account')
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-[60px] px-[20px]">
      <div className="w-full max-w-[420px] flex flex-col items-center">
        <img alt="WoodSmith" className="size-[60px] object-contain" src={imgFavicon} />

        <div className="mt-[24px] text-center">
          <h2 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[20px] lg:text-[24px] text-orange leading-[1.2] m-0">
            WoodSmith ยินดีต้อนรับ
          </h2>
          <p className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-grey mt-[8px] m-0">
            เข้าสู่ระบบเพื่อดำเนินการต่อ
          </p>
        </div>

        {resetSuccess && (
          <div className="w-full mt-[16px] bg-green-50 border border-green-200 rounded-[4px] px-[16px] py-[10px]">
            <p className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-green-700 m-0 text-center">
              เปลี่ยนรหัสผ่านสำเร็จแล้ว กรุณาเข้าสู่ระบบด้วยรหัสผ่านใหม่
            </p>
          </div>
        )}

        {/* LINE login */}
        <div className="w-full mt-[32px]">
          <button
            onClick={handleLineLogin}
            className="w-full h-[48px] bg-[#06C755] flex items-center justify-center gap-[12px] cursor-pointer border-none rounded-[4px]"
          >
            <img alt="LINE" className="size-[24px] shrink-0" src={imgLine} />
            <span className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[16px] text-white">
              เข้าสู่ระบบด้วย LINE
            </span>
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-[16px] w-full mt-[24px]">
          <div className="flex-1 h-[1px] bg-[#e5e7eb]" />
          <span className="font-['IBM_Plex_Sans_Thai'] text-[12px] text-grey">หรือ</span>
          <div className="flex-1 h-[1px] bg-[#e5e7eb]" />
        </div>

        {/* Email/Password form */}
        <form onSubmit={handleEmailLogin} className="flex flex-col gap-[16px] w-full mt-[24px]">
          <div className="flex flex-col gap-[8px]">
            <label className="font-['IBM_Plex_Sans_Thai'] text-[11px] text-black">อีเมล</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-[42px] border border-[#e5e7eb] px-[16px] font-['IBM_Plex_Sans_Thai'] text-[14px] text-black outline-none rounded-[4px]"
            />
          </div>
          <div className="flex flex-col gap-[8px]">
            <label className="font-['IBM_Plex_Sans_Thai'] text-[11px] text-black">รหัสผ่าน</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-[42px] border border-[#e5e7eb] px-[16px] font-['IBM_Plex_Sans_Thai'] text-[14px] text-black outline-none rounded-[4px]"
            />
          </div>

          {error && (
            <p className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-red-500 m-0 text-center">{error}</p>
          )}

          <div className="text-right">
            <a href="/login/forgot-password" className="font-['IBM_Plex_Sans_Thai'] text-[12px] text-grey hover:text-orange transition-colors">
              ลืมรหัสผ่าน?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-[48px] bg-orange flex items-center justify-center cursor-pointer border-none rounded-[4px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[16px] text-white">
              {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </span>
          </button>
        </form>

        {/* Register link */}
        <p className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-grey mt-[24px] m-0">
          ยังไม่มีบัญชี?{' '}
          <a href="/register" className="text-orange underline">สมัครสมาชิก</a>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  )
}
