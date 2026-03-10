'use client'

import { useRef, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

/**
 * A dropdown action menu that renders via portal to escape overflow:hidden containers.
 *
 * Usage:
 *   <ActionMenu open={openMenuId === item.id} onToggle={() => setOpenMenuId(openMenuId === item.id ? null : item.id)} onClose={() => setOpenMenuId(null)} label={`Actions for ${item.name}`}>
 *     <ActionMenu.Item href="/edit/123" icon={<EditIcon />}>แก้ไข</ActionMenu.Item>
 *     <ActionMenu.Item onClick={handleDelete} icon={<TrashIcon />} danger>ลบ</ActionMenu.Item>
 *   </ActionMenu>
 */
export default function ActionMenu({ open, onToggle, onClose, label, children }) {
  const buttonRef = useRef(null)
  const menuRef = useRef(null)
  const [pos, setPos] = useState(null)

  useEffect(() => {
    if (open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right })
    }
  }, [open])

  // Close on scroll (table may scroll horizontally)
  useEffect(() => {
    if (!open) return
    function handleScroll() { onClose() }
    window.addEventListener('scroll', handleScroll, true)
    return () => window.removeEventListener('scroll', handleScroll, true)
  }, [open, onClose])

  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        onClick={(e) => { e.stopPropagation(); onToggle() }}
        className="size-[32px] inline-flex items-center justify-center rounded-[6px] hover:bg-[#f3f4f6] transition-colors cursor-pointer bg-transparent border-none"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="5" r="1" />
          <circle cx="12" cy="12" r="1" />
          <circle cx="12" cy="19" r="1" />
        </svg>
      </button>
      {open && pos && createPortal(
        <>
          <div className="fixed inset-0 z-[9998]" onClick={onClose} />
          <div
            ref={menuRef}
            className="fixed z-[9999] bg-white border border-[#e5e7eb] rounded-[8px] shadow-lg py-[4px] min-w-[140px]"
            style={{ top: pos.top, right: pos.right }}
            role="menu"
          >
            {children}
          </div>
        </>,
        document.body
      )}
    </div>
  )
}
