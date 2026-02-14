export default function AdminEmptyState({ title = 'ไม่พบข้อมูล', description = 'ยังไม่มีรายการในขณะนี้', actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-[80px] gap-[16px]">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
        <polyline points="13 2 13 9 20 9" />
      </svg>
      <div className="flex flex-col items-center gap-[4px]">
        <p className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[16px] text-[#6b7280] m-0">
          {title}
        </p>
        <p className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#9ca3af] m-0">
          {description}
        </p>
      </div>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-[8px] bg-orange text-white px-[20px] py-[8px] rounded-[8px] font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] cursor-pointer hover:bg-orange/90"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
