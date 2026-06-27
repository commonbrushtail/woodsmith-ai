'use client'

import { useEffect, useState } from 'react'

/**
 * Sticky banner shown on public pages while an admin is in Draft Mode preview.
 * The "exit" link returns to the current page with Draft Mode turned off.
 * Rendered by the public layout only when isPreview() is true.
 */
export default function DraftModeBanner() {
  const [disableUrl, setDisableUrl] = useState('/api/preview/disable')

  useEffect(() => {
    const here = window.location.pathname + window.location.search
    setDisableUrl(`/api/preview/disable?path=${encodeURIComponent(here)}`)
  }, [])

  return (
    <div className="sticky top-0 z-[9999] flex items-center justify-center gap-3 bg-orange px-4 py-2 text-center text-sm font-medium text-white">
      <span>
        โหมดพรีวิว (ดราฟต์) — เนื้อหานี้ยังไม่เผยแพร่ ผู้เข้าชมทั่วไปจะมองไม่เห็น
      </span>
      <a
        href={disableUrl}
        className="shrink-0 rounded-full border border-white/70 px-3 py-0.5 text-xs hover:bg-white hover:text-orange"
      >
        ออกจากพรีวิว
      </a>
    </div>
  )
}
