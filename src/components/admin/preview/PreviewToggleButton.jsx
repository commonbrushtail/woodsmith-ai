'use client'

/**
 * Opens the live preview drawer. Place in an edit page's action area beside
 * the Save buttons / "ดูหน้าเว็บ" link.
 *
 * @param {{ onClick: () => void, label?: string, className?: string }} props
 */
export default function PreviewToggleButton({ onClick, label = 'ดูตัวอย่างสด', className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-center gap-[8px] px-[16px] py-[8px] rounded-[8px] font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] transition-colors cursor-pointer bg-white text-[#374151] border border-[#e5e7eb] hover:bg-[#f9fafb] ${className}`}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
      {label}
    </button>
  )
}
