'use client'

import AdminButton from './AdminButton'

export default function AdminModal({ isOpen, title, message, onConfirm, onCancel, confirmText = 'ยืนยัน', cancelText = 'ยกเลิก' }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative bg-white rounded-[12px] p-[24px] w-[400px] max-w-[90vw] flex flex-col gap-[16px]">
        <h3 className="font-['IBM_Plex_Sans_Thai'] font-bold text-[18px] text-[#1f2937] m-0">
          {title}
        </h3>
        <p className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#6b7280] m-0">
          {message}
        </p>
        <div className="flex items-center justify-end gap-[8px]">
          <AdminButton variant="secondary" onClick={onCancel}>{cancelText}</AdminButton>
          <AdminButton variant="primary" onClick={onConfirm}>{confirmText}</AdminButton>
        </div>
      </div>
    </div>
  )
}
