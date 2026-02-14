'use client'

import { useState, useEffect } from 'react'

function EmailIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
      <path d="M56 12H8C5.79 12 4 13.79 4 16V48C4 50.21 5.79 52 8 52H56C58.21 52 60 50.21 60 48V16C60 13.79 58.21 12 56 12Z" fill="#FFD54F" />
      <path d="M60 16L32 36L4 16" stroke="#F57F17" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="48" cy="16" r="12" fill="#FF7043" />
      <text x="48" y="21" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">?</text>
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

export default function QuotationModal({ isOpen, onClose, product }) {
  const [step, setStep] = useState('form') // 'form' | 'confirm' | 'success'
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  })

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setStep('form')
      setSubmitting(false)
      // Pre-fill from auth session if available
      async function prefill() {
        try {
          const { createClient } = await import('@/lib/supabase/client')
          const supabase = createClient()
          const { data: { user } } = await supabase.auth.getUser()
          if (user) {
            setForm(prev => ({
              ...prev,
              name: user.user_metadata?.display_name || prev.name,
              phone: user.phone || prev.phone,
              email: user.user_metadata?.email || user.email || prev.email,
            }))
          }
        } catch { /* ignore */ }
      }
      prefill()
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

  const canSubmit = form.name.trim() && form.phone.trim()

  const handleSubmit = async () => {
    if (!canSubmit || submitting) return
    setSubmitting(true)
    try {
      const { submitQuotation } = await import('@/lib/actions/customer')
      const { error } = await submitQuotation({
        productId: product?.id || null,
        requesterName: form.name.trim(),
        requesterPhone: form.phone.trim(),
        requesterEmail: form.email.trim() || undefined,
        message: form.message.trim() || undefined,
      })
      if (error) {
        console.error('Quotation submit error:', error)
        setSubmitting(false)
        return
      }
      setStep('success')
    } catch (err) {
      console.error('Quotation submit error:', err)
      setSubmitting(false)
    }
  }

  const handleClose = () => {
    setForm({ name: '', phone: '', email: '', message: '' })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" onClick={handleClose}>
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
              onClick={handleClose}
              className="h-[48px] bg-orange flex items-center justify-center cursor-pointer border-none w-[278px]"
            >
              <span className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[15px] text-white">
                ปิด
              </span>
            </button>
          </>
        ) : step === 'confirm' ? (
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
              <div className="w-full text-left">
                <p className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#18191f] m-0">
                  ชื่อ: {form.name}
                </p>
                <p className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#18191f] m-0">
                  โทร: {form.phone}
                </p>
                {form.email && (
                  <p className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#18191f] m-0">
                    อีเมล: {form.email}
                  </p>
                )}
              </div>
            </div>
            <div className="w-full h-px bg-[#e5e7eb]" />
            <div className="flex gap-[8px] h-[48px] items-center w-[278px]">
              <button
                onClick={() => setStep('form')}
                className="flex-1 h-[48px] border border-[#e5e7eb] flex items-center justify-center cursor-pointer bg-transparent"
              >
                <span className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[15px] text-black">
                  แก้ไข
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
        ) : (
          <>
            {/* Form step */}
            <div className="shrink-0 size-[64px]">
              <EmailIcon />
            </div>
            <div className="flex flex-col gap-[16px] items-center px-[24px] lg:px-[40px] w-full">
              <p className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[20px] text-[#18191f] text-center leading-[1.2]">
                ขอใบเสนอราคา
              </p>

              {/* Product info */}
              {product && (
                <div className="flex gap-[10px] items-start w-full">
                  {product.image && (
                    <div className="shrink-0 size-[48px] overflow-hidden">
                      <div className="relative size-full">
                        <div className="absolute bg-[#e8e3da] inset-0" />
                        <img alt="" className="absolute max-w-none object-cover size-full" src={product.image} />
                      </div>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] text-[#18191f] truncate m-0">{product.name}</p>
                    <p className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-orange m-0">{product.sku || ''}</p>
                  </div>
                </div>
              )}

              {/* Contact form */}
              <div className="flex flex-col gap-[12px] w-full">
                <div className="flex flex-col gap-[4px]">
                  <label className="font-['IBM_Plex_Sans_Thai'] text-[12px] text-black">ชื่อ-นามสกุล *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => update('name', e.target.value)}
                    placeholder="กรอกชื่อ-นามสกุล"
                    className="h-[42px] border border-[#e5e7eb] px-[12px] font-['IBM_Plex_Sans_Thai'] text-[14px] text-black placeholder:text-grey outline-none"
                  />
                </div>
                <div className="flex flex-col gap-[4px]">
                  <label className="font-['IBM_Plex_Sans_Thai'] text-[12px] text-black">เบอร์โทรศัพท์ *</label>
                  <input
                    type="tel"
                    maxLength={10}
                    value={form.phone}
                    onChange={(e) => update('phone', e.target.value.replace(/\D/g, ''))}
                    placeholder="0812345678"
                    className="h-[42px] border border-[#e5e7eb] px-[12px] font-['IBM_Plex_Sans_Thai'] text-[14px] text-black placeholder:text-grey outline-none"
                  />
                </div>
                <div className="flex flex-col gap-[4px]">
                  <label className="font-['IBM_Plex_Sans_Thai'] text-[12px] text-black">อีเมล</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    placeholder="example@email.com"
                    className="h-[42px] border border-[#e5e7eb] px-[12px] font-['IBM_Plex_Sans_Thai'] text-[14px] text-black placeholder:text-grey outline-none"
                  />
                </div>
                <div className="flex flex-col gap-[4px]">
                  <label className="font-['IBM_Plex_Sans_Thai'] text-[12px] text-black">ข้อความเพิ่มเติม</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => update('message', e.target.value)}
                    placeholder="ระบุรายละเอียดเพิ่มเติม (ไม่บังคับ)"
                    rows={3}
                    className="border border-[#e5e7eb] px-[12px] py-[8px] font-['IBM_Plex_Sans_Thai'] text-[14px] text-black placeholder:text-grey outline-none resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="w-full h-px bg-[#e5e7eb]" />

            <div className="flex gap-[8px] h-[48px] items-center w-[278px]">
              <button
                onClick={handleClose}
                className="flex-1 h-[48px] border border-[#e5e7eb] flex items-center justify-center cursor-pointer bg-transparent"
              >
                <span className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[15px] text-black">
                  ยกเลิก
                </span>
              </button>
              <button
                onClick={() => canSubmit && setStep('confirm')}
                disabled={!canSubmit}
                className="flex-1 h-[48px] bg-orange flex items-center justify-center cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[15px] text-white">
                  ถัดไป
                </span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
