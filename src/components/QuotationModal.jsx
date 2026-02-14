'use client'

import { useEffect } from 'react'

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

export default function QuotationModal({ isOpen, onClose, onConfirm, product }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Modal */}
      <div
        className="relative bg-white flex flex-col gap-[20px] items-center py-[20px] shadow-[0px_6px_16px_0px_rgba(0,33,70,0.12)] w-[90%] max-w-[485px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Email icon */}
        <div className="shrink-0 size-[64px]">
          <EmailIcon />
        </div>

        {/* Content */}
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
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-[#e5e7eb]" />

        {/* Buttons */}
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
            onClick={onConfirm}
            className="flex-1 h-[48px] bg-orange flex items-center justify-center cursor-pointer border-none"
          >
            <span className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[15px] text-white">
              ยืนยัน
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
