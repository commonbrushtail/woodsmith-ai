'use client'

import { useToast } from '@/lib/toast-context'

const typeStyles = {
  success: 'bg-[#059669] text-white',
  error: 'bg-[#dc2626] text-white',
  info: 'bg-[#35383b] text-white',
}

const typeIcons = {
  success: (
    <svg className="size-[18px] shrink-0" viewBox="0 0 24 24" fill="none">
      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  error: (
    <svg className="size-[18px] shrink-0" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <path d="M15 9L9 15M9 9L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  info: (
    <svg className="size-[18px] shrink-0" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <path d="M12 16V12M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
}

export default function ToastContainer() {
  const { toasts, removeToast } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-[16px] right-[16px] z-[200] flex flex-col gap-[8px] max-w-[400px]">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-[10px] px-[16px] py-[12px] shadow-lg animate-[slideIn_0.2s_ease-out] ${typeStyles[t.type] || typeStyles.info}`}
          style={{ animation: 'slideIn 0.2s ease-out' }}
        >
          {typeIcons[t.type]}
          <p className="font-['IBM_Plex_Sans_Thai'] text-[14px] leading-[1.4] flex-1 m-0">
            {t.message}
          </p>
          <button
            onClick={() => removeToast(t.id)}
            className="shrink-0 bg-transparent border-none cursor-pointer p-0 text-white/70 hover:text-white"
          >
            <svg className="size-[14px]" viewBox="0 0 16 16" fill="none">
              <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  )
}
