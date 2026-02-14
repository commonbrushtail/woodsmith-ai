'use client'

import { useRef } from 'react'

const ACCEPT_HINTS = {
  image: { text: 'JPG, PNG, WebP, GIF', accept: 'image/jpeg,image/png,image/webp,image/gif' },
  pdf: { text: 'PDF (สูงสุด 10MB)', accept: 'application/pdf' },
}

export default function AdminFileInput({
  label,
  required = false,
  accept = 'image',
  onChange,
  onRemove,
  previewUrl,
  fileName,
  error,
  className = '',
}) {
  const inputRef = useRef(null)
  const hint = ACCEPT_HINTS[accept] || ACCEPT_HINTS.image

  const handleClick = () => {
    inputRef.current?.click()
  }

  const hasFile = previewUrl || fileName
  const borderClass = error
    ? 'border-red-500'
    : hasFile
      ? 'border-orange/50'
      : 'border-[#e5e7eb] hover:border-orange/50'

  return (
    <div className={className}>
      {label && (
        <label className="font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] text-[#374151] mb-[4px] block">
          {label}
          {required && <span className="text-[#ef4444] ml-[2px]">*</span>}
        </label>
      )}

      {hasFile ? (
        <div
          data-testid="drop-zone"
          className={`border-2 border-dashed ${borderClass} rounded-[8px] p-[16px] flex items-center gap-[12px]`}
        >
          {previewUrl && (
            <img
              src={previewUrl}
              alt="preview"
              className="w-[80px] h-[80px] object-cover rounded-[6px] border border-[#e5e7eb]"
            />
          )}
          <div className="flex-1 min-w-0">
            {fileName && (
              <p className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#374151] truncate">
                {fileName}
              </p>
            )}
            <button
              type="button"
              onClick={handleClick}
              className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-orange hover:underline mt-[4px]"
            >
              เปลี่ยนไฟล์
            </button>
          </div>
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              aria-label="ลบไฟล์"
              className="flex items-center gap-[4px] px-[10px] py-[6px] rounded-[6px] text-[13px] font-['IBM_Plex_Sans_Thai'] text-red-500 hover:bg-red-50"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
              ลบ
            </button>
          )}
          <input
            ref={inputRef}
            type="file"
            accept={hint.accept}
            onChange={onChange}
            className="hidden"
          />
        </div>
      ) : (
        <div
          data-testid="drop-zone"
          onClick={handleClick}
          className={`border-2 border-dashed ${borderClass} rounded-[8px] p-[24px] flex flex-col items-center gap-[8px] cursor-pointer`}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <p className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#9ca3af]">
            คลิกเพื่ออัปโหลดไฟล์
          </p>
          <p className="font-['IBM_Plex_Sans_Thai'] text-[12px] text-[#d1d5db]">
            {hint.text}
          </p>
          <input
            ref={inputRef}
            type="file"
            accept={hint.accept}
            onChange={onChange}
            className="hidden"
          />
        </div>
      )}

      {error && (
        <p className="mt-[4px] text-[13px] text-red-500 font-['IBM_Plex_Sans_Thai']">{error}</p>
      )}
    </div>
  )
}
