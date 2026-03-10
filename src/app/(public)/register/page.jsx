'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import imgFavicon from '@/assets/6727cae5f32ea2c35a94792ae9603addc6300612.png'

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [captchaToken, setCaptchaToken] = useState('')
  const captchaRef = useRef(null)
  const captchaWidgetId = useRef(null)

  const renderCaptcha = useCallback(() => {
    if (!RECAPTCHA_SITE_KEY || !captchaRef.current) return
    if (typeof window.grecaptcha === 'undefined' || !window.grecaptcha.render) return
    while (captchaRef.current.firstChild) {
      captchaRef.current.removeChild(captchaRef.current.firstChild)
    }
    captchaWidgetId.current = window.grecaptcha.render(captchaRef.current, {
      sitekey: RECAPTCHA_SITE_KEY,
      callback: (token) => setCaptchaToken(token),
      'expired-callback': () => setCaptchaToken(''),
    })
  }, [])

  useEffect(() => {
    if (!RECAPTCHA_SITE_KEY) return
    const scriptId = 'recaptcha-script'
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script')
      script.id = scriptId
      script.src = 'https://www.google.com/recaptcha/api.js?render=explicit'
      script.async = true
      script.defer = true
      script.onload = () => {
        if (window.grecaptcha && window.grecaptcha.ready) {
          window.grecaptcha.ready(() => renderCaptcha())
        }
      }
      document.head.appendChild(script)
    } else if (window.grecaptcha && window.grecaptcha.render) {
      setTimeout(() => renderCaptcha(), 100)
    }
  }, [renderCaptcha])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (RECAPTCHA_SITE_KEY && !captchaToken) {
      setError('กรุณายืนยันว่าคุณไม่ใช่หุ่นยนต์')
      return
    }

    setLoading(true)

    const { sendRegistrationEmail } = await import('@/lib/actions/auth')
    const { error: sendError } = await sendRegistrationEmail(email, captchaToken)

    if (sendError) {
      setError(sendError)
      setLoading(false)
      // Reset captcha on error
      if (window.grecaptcha && captchaWidgetId.current !== null) {
        window.grecaptcha.reset(captchaWidgetId.current)
        setCaptchaToken('')
      }
      return
    }

    setSent(true)
    setLoading(false)
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-[60px] px-[20px]">
      <div className="w-full max-w-[420px] flex flex-col items-center">
        <img alt="WoodSmith" className="size-[60px] object-contain" src={imgFavicon} />

        <div className="mt-[24px] text-center">
          <h2 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[20px] lg:text-[24px] text-orange leading-[1.2] m-0">
            สมัครสมาชิก
          </h2>
          <p className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-grey mt-[8px] m-0">
            {sent ? 'เราส่งลิงก์ยืนยันไปที่อีเมลของคุณแล้ว' : 'กรอกอีเมลเพื่อเริ่มสมัครสมาชิก'}
          </p>
        </div>

        {sent ? (
          <div className="w-full mt-[32px] text-center">
            <div className="bg-beige p-[24px] rounded-[4px]">
              <p className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-black m-0 leading-[1.6]">
                กรุณาตรวจสอบอีเมล <strong>{email}</strong> และคลิกลิงก์ยืนยันเพื่อดำเนินการสมัครต่อ
              </p>
              <p className="font-['IBM_Plex_Sans_Thai'] text-[12px] text-grey mt-[12px] m-0">
                หากไม่พบอีเมล กรุณาตรวจสอบในโฟลเดอร์สแปม
              </p>
            </div>

            <button
              onClick={() => { setSent(false); setError('') }}
              className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-orange underline mt-[16px] bg-transparent border-none cursor-pointer"
            >
              ส่งอีเมลอีกครั้ง
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-[16px] w-full mt-[32px]">
            <div className="flex flex-col gap-[8px]">
              <label className="font-['IBM_Plex_Sans_Thai'] text-[11px] text-black">อีเมล</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                className="h-[42px] border border-[#e5e7eb] px-[16px] font-['IBM_Plex_Sans_Thai'] text-[14px] text-black outline-none rounded-[4px]"
              />
            </div>

            {RECAPTCHA_SITE_KEY && (
              <div className="flex justify-center">
                <div ref={captchaRef} />
              </div>
            )}

            {error && (
              <p className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-red-500 m-0 text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-[48px] bg-orange flex items-center justify-center cursor-pointer border-none rounded-[4px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[16px] text-white">
                {loading ? 'กำลังส่ง...' : 'ส่งลิงก์ยืนยันอีเมล'}
              </span>
            </button>
          </form>
        )}

        <p className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-grey mt-[24px] m-0">
          มีบัญชีอยู่แล้ว?{' '}
          <a href="/login" className="text-orange underline">เข้าสู่ระบบ</a>
        </p>
      </div>
    </div>
  )
}
