'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

function EmailIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Envelope body */}
      <path d="M8 20C8 17.79 9.79 16 12 16H52C54.21 16 56 17.79 56 20V50C56 52.21 54.21 54 52 54H12C9.79 54 8 52.21 8 50V20Z" fill="#FFD54F" />
      {/* Letter/document inside */}
      <rect x="16" y="10" width="32" height="36" rx="2" fill="white" />
      <rect x="22" y="18" width="20" height="3" rx="1.5" fill="#E0E0E0" />
      <rect x="22" y="25" width="16" height="3" rx="1.5" fill="#E0E0E0" />
      <rect x="22" y="32" width="18" height="3" rx="1.5" fill="#E0E0E0" />
      {/* Envelope flap */}
      <path d="M8 20L32 38L56 20" fill="#FFB300" />
      <path d="M8 20L32 38L56 20" stroke="#F9A825" strokeWidth="0.5" />
      {/* Front fold */}
      <path d="M8 50V20L32 38L56 20V50C56 52.21 54.21 54 52 54H12C9.79 54 8 52.21 8 50Z" fill="#FFC107" />
      <path d="M8 20L32 38L56 20" fill="#FFB300" />
      {/* Badge circle */}
      <circle cx="46" cy="14" r="10" fill="#FF7043" />
      <text x="46" y="19" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">?</text>
    </svg>
  )
}

function SuccessIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="28" fill="#4CAF50" />
      <path d="M20 32L28 40L44 24" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY

export default function QuotationModal({ isOpen, onClose, product, selections = [], isLoggedIn = false }) {
  const [step, setStep] = useState('confirm') // 'confirm' | 'success'
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Guest form fields
  const [guestName, setGuestName] = useState('')
  const [guestSurname, setGuestSurname] = useState('')
  const [guestEmail, setGuestEmail] = useState('')

  // reCAPTCHA
  const [captchaToken, setCaptchaToken] = useState('')
  const captchaRef = useRef(null)
  const captchaWidgetId = useRef(null)

  const renderCaptcha = useCallback(() => {
    if (!RECAPTCHA_SITE_KEY || isLoggedIn) return
    if (!captchaRef.current) return
    if (typeof window.grecaptcha === 'undefined' || !window.grecaptcha.render) return

    // Clear previous widget safely
    while (captchaRef.current.firstChild) {
      captchaRef.current.removeChild(captchaRef.current.firstChild)
    }
    captchaWidgetId.current = window.grecaptcha.render(captchaRef.current, {
      sitekey: RECAPTCHA_SITE_KEY,
      callback: (token) => setCaptchaToken(token),
      'expired-callback': () => setCaptchaToken(''),
    })
  }, [isLoggedIn])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setStep('confirm')
      setSubmitting(false)
      setErrorMsg('')
      setCaptchaToken('')
      setGuestName('')
      setGuestSurname('')
      setGuestEmail('')
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Load reCAPTCHA script and render widget
  useEffect(() => {
    if (!isOpen || isLoggedIn || !RECAPTCHA_SITE_KEY) return

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
  }, [isOpen, isLoggedIn, renderCaptcha])

  if (!isOpen) return null

  const handleSubmit = async () => {
    if (submitting) return

    // Validate guest fields
    if (!isLoggedIn) {
      if (!guestName.trim()) { setErrorMsg('กรุณากรอกชื่อ'); return }
      if (!guestSurname.trim()) { setErrorMsg('กรุณากรอกนามสกุล'); return }
      if (!guestEmail.trim()) { setErrorMsg('กรุณากรอกอีเมล'); return }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail)) { setErrorMsg('รูปแบบอีเมลไม่ถูกต้อง'); return }
      if (RECAPTCHA_SITE_KEY && !captchaToken) { setErrorMsg('กรุณายืนยันว่าคุณไม่ใช่หุ่นยนต์'); return }
    }

    setSubmitting(true)
    setErrorMsg('')
    try {
      const { submitQuotation } = await import('@/lib/actions/customer')
      const result = await submitQuotation({
        productId: product?.id || null,
        selectedVariations: selections.length > 0 ? selections : undefined,
        requesterName: !isLoggedIn ? `${guestName.trim()} ${guestSurname.trim()}` : undefined,
        requesterEmail: !isLoggedIn ? guestEmail.trim() : undefined,
        captchaToken: !isLoggedIn ? captchaToken : undefined,
      })
      if (result.error) {
        console.error('Quotation submit error:', result.error)
        setErrorMsg(result.error)
        setSubmitting(false)
        // Reset captcha on error
        if (window.grecaptcha && captchaWidgetId.current !== null) {
          window.grecaptcha.reset(captchaWidgetId.current)
          setCaptchaToken('')
        }
        return
      }
      setStep('success')
    } catch (err) {
      console.error('Quotation submit error:', err)
      setErrorMsg('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง')
      setSubmitting(false)
    }
  }

  const inputCls = "w-full font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border border-[#e8eaef] rounded-[8px] px-[14px] py-[10px] outline-none transition-all placeholder:text-[#bfbfbf] focus:border-orange focus:ring-1 focus:ring-orange/20"

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Modal */}
      <div
        className="relative bg-white flex flex-col gap-[20px] items-center py-[20px] shadow-[0px_6px_16px_0px_rgba(0,33,70,0.12)] w-[90%] max-w-[485px] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {step === 'success' ? (
          <>
            <div className="shrink-0 size-[64px]">
              <SuccessIcon />
            </div>
            <div className="flex flex-col gap-[8px] items-center px-[40px] w-full">
              <p className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[20px] text-[#18191f] text-center leading-[1.2]">
                ส่งคำขอเรียบร้อยแล้ว
              </p>
              <p className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-grey text-center leading-[1.4]">
                ทีมงานจะติดต่อกลับหาคุณโดยเร็วที่สุด
              </p>
            </div>
            <button
              onClick={onClose}
              className="h-[48px] bg-orange flex items-center justify-center cursor-pointer border-none w-[278px]"
            >
              <span className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[15px] text-white">
                ปิด
              </span>
            </button>
          </>
        ) : (
          <>
            <div className="shrink-0 size-[64px]">
              <EmailIcon />
            </div>
            <div className="flex flex-col gap-[16px] items-center px-[40px] w-full">
              <p className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[20px] text-[#18191f] text-center leading-[1.2]">
                ยืนยันการขอใบเสนอราคาทางอิเล็กทรอนิกส์
              </p>
              <div className="flex gap-[10px] items-start justify-center w-full max-w-[335px]">
                {product?.image && (
                  <div className="shrink-0 size-[64px] overflow-hidden">
                    <div className="relative size-full">
                      <div className="absolute bg-[#e8e3da] inset-0" />
                      <img alt="" className="absolute max-w-none object-cover size-full" src={product.image} />
                    </div>
                  </div>
                )}
                <div className="flex-1 font-['IBM_Plex_Sans_Thai'] text-[16px] text-[#18191f] leading-[1.4]">
                  <p className="m-0">{product?.name || 'สินค้า'}</p>
                  <p className="m-0 text-orange">{product?.sku || ''}</p>
                </div>
              </div>
              {selections.length > 0 && (
                <div className="flex flex-col gap-[2px] w-full max-w-[335px]">
                  {selections.map((s) => (
                    <p key={s.label} className="m-0 font-['IBM_Plex_Sans_Thai'] text-[13px] text-grey">
                      {s.label}: {s.value}
                    </p>
                  ))}
                </div>
              )}

              {/* Guest form — shown when not logged in */}
              {!isLoggedIn && (
                <div className="flex flex-col gap-[10px] w-full max-w-[335px]">
                  <div className="flex gap-[10px]">
                    <input
                      type="text"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="ชื่อ"
                      className={inputCls}
                    />
                    <input
                      type="text"
                      value={guestSurname}
                      onChange={(e) => setGuestSurname(e.target.value)}
                      placeholder="นามสกุล"
                      className={inputCls}
                    />
                  </div>
                  <input
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="อีเมล"
                    className={inputCls}
                  />
                  {RECAPTCHA_SITE_KEY && (
                    <div className="flex justify-center mt-[4px]">
                      <div ref={captchaRef} />
                    </div>
                  )}
                </div>
              )}
            </div>
            {errorMsg && (
              <p className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-red-500 text-center px-[40px] m-0">
                {errorMsg}
              </p>
            )}
            <div className="w-full h-px bg-[#e5e7eb]" />
            <div className="flex gap-[8px] h-[48px] items-center w-[278px]">
              <button
                onClick={onClose}
                className="flex-1 h-[48px] border border-[#e5e7eb] flex items-center justify-center cursor-pointer bg-transparent"
              >
                <span className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[15px] text-black">
                  ยกเลิก
                </span>
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 h-[48px] bg-orange flex items-center justify-center cursor-pointer border-none disabled:opacity-50"
              >
                <span className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[15px] text-white">
                  {submitting ? 'กำลังส่ง...' : 'ยืนยัน'}
                </span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
