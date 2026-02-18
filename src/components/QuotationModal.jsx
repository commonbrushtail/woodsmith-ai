'use client'

import { useState, useEffect } from 'react'

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

export default function QuotationModal({ isOpen, onClose, product, selections = [] }) {
  const [step, setStep] = useState('confirm') // 'confirm' | 'success'
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setStep('confirm')
      setSubmitting(false)
      setErrorMsg('')
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = async () => {
    if (submitting) return
    setSubmitting(true)
    setErrorMsg('')
    try {
      const { submitQuotation } = await import('@/lib/actions/customer')
      const result = await submitQuotation({
        productId: product?.id || null,
        selectedVariations: selections.length > 0 ? selections : undefined,
      })
      if (result.error) {
        console.error('Quotation submit error:', result.error)
        setErrorMsg(result.error)
        setSubmitting(false)
        return
      }
      setStep('success')
    } catch (err) {
      console.error('Quotation submit error:', err)
      setErrorMsg('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง')
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Modal */}
      <div
        className="relative bg-white flex flex-col gap-[20px] items-center py-[20px] shadow-[0px_6px_16px_0px_rgba(0,33,70,0.12)] w-[90%] max-w-[485px]"
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
