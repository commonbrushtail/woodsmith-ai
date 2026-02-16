'use client'

import { useState, useLayoutEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

function ChevronLeftIcon({ size = 14, color = '#6b7280' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 12L6 8L10 4" />
    </svg>
  )
}

export default function CalendarPicker({ selectedDate, onSelect, onClose }) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(selectedDate ? new Date(selectedDate).getFullYear() : today.getFullYear())
  const [viewMonth, setViewMonth] = useState(selectedDate ? new Date(selectedDate).getMonth() : today.getMonth())
  const [pos, setPos] = useState(null)
  const anchorEl = useRef(null)

  useLayoutEffect(() => {
    if (!anchorEl.current) return
    const parent = anchorEl.current.parentElement
    if (!parent) return
    const rect = parent.getBoundingClientRect()
    const calHeight = 340 // approximate calendar height
    const spaceBelow = window.innerHeight - rect.bottom
    const top = spaceBelow < calHeight && rect.top > calHeight
      ? rect.top - calHeight - 4   // flip above
      : rect.bottom + 4            // open below
    setPos({ top, left: rect.left })
  }, [])

  const monthNames = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน',
    'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม',
    'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม',
  ]

  const dayHeaders = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส']

  const firstDay = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear(viewYear - 1)
    } else {
      setViewMonth(viewMonth - 1)
    }
  }

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear(viewYear + 1)
    } else {
      setViewMonth(viewMonth + 1)
    }
  }

  const handleDayClick = (day) => {
    const mm = String(viewMonth + 1).padStart(2, '0')
    const dd = String(day).padStart(2, '0')
    onSelect(`${viewYear}-${mm}-${dd}`)
    onClose()
  }

  const cells = []
  for (let i = 0; i < firstDay; i++) {
    cells.push(<div key={`e-${i}`} />)
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const mm = String(viewMonth + 1).padStart(2, '0')
    const dd = String(d).padStart(2, '0')
    const dateStr = `${viewYear}-${mm}-${dd}`
    const isSelected = selectedDate === dateStr
    const isToday =
      d === today.getDate() &&
      viewMonth === today.getMonth() &&
      viewYear === today.getFullYear()
    cells.push(
      <button
        key={d}
        type="button"
        onClick={() => handleDayClick(d)}
        className={`
          size-[32px] rounded-full flex items-center justify-center text-[13px] border-0 cursor-pointer transition-colors
          font-['IBM_Plex_Sans_Thai']
          ${isSelected
            ? 'bg-orange text-white'
            : isToday
              ? 'bg-[#fff3e8] text-orange hover:bg-[#ffe8d4]'
              : 'bg-transparent text-[#374151] hover:bg-[#f3f4f6]'
          }
        `}
      >
        {d}
      </button>
    )
  }

  const calendar = (
    <div className="fixed z-[9999] bg-white border border-[#e8eaef] rounded-[8px] shadow-lg p-[16px] w-[280px]" style={pos ? { top: pos.top, left: pos.left } : { top: -9999, left: -9999 }}>
      <div className="flex items-center justify-between mb-[12px]">
        <button
          type="button"
          onClick={prevMonth}
          className="size-[28px] flex items-center justify-center rounded-full hover:bg-[#f3f4f6] border-0 bg-transparent cursor-pointer"
          aria-label="Previous month"
        >
          <ChevronLeftIcon />
        </button>
        <span className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
          {monthNames[viewMonth]} {viewYear + 543}
        </span>
        <button
          type="button"
          onClick={nextMonth}
          className="size-[28px] flex items-center justify-center rounded-full hover:bg-[#f3f4f6] border-0 bg-transparent cursor-pointer rotate-180"
          aria-label="Next month"
        >
          <ChevronLeftIcon />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-[2px] mb-[4px]">
        {dayHeaders.map((dh) => (
          <div key={dh} className="size-[32px] flex items-center justify-center font-['IBM_Plex_Sans_Thai'] text-[11px] font-medium text-[#9ca3af]">
            {dh}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-[2px]">
        {cells}
      </div>
    </div>
  )

  return (
    <>
      <span ref={anchorEl} style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }} />
      {createPortal(calendar, document.body)}
    </>
  )
}
