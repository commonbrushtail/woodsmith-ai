'use client'

import { useState, useLayoutEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

function generateTimeOptions() {
  const times = []
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 15) {
      const hh = String(h).padStart(2, '0')
      const mm = String(m).padStart(2, '0')
      times.push(`${hh}:${mm}`)
    }
  }
  return times
}

const TIME_OPTIONS = generateTimeOptions()

export default function TimePickerDropdown({ selectedTime, onSelect, onClose }) {
  const [pos, setPos] = useState(null)
  const anchorEl = useRef(null)

  useLayoutEffect(() => {
    if (!anchorEl.current) return
    const parent = anchorEl.current.parentElement
    if (!parent) return
    const rect = parent.getBoundingClientRect()
    const dropHeight = 200
    const spaceBelow = window.innerHeight - rect.bottom
    const top = spaceBelow < dropHeight && rect.top > dropHeight
      ? rect.top - dropHeight - 4
      : rect.bottom + 4
    setPos({ top, left: rect.left, width: rect.width })
  }, [])

  const dropdown = (
    <div
      className="fixed z-[9999] bg-white border border-[#e8eaef] rounded-[8px] shadow-lg w-[120px] max-h-[200px] overflow-y-auto"
      style={pos ? { top: pos.top, left: pos.left } : { top: -9999, left: -9999 }}
    >
      {TIME_OPTIONS.map((time) => (
        <button
          key={time}
          type="button"
          onClick={() => { onSelect(time); onClose() }}
          className={`
            w-full text-left px-[12px] py-[8px] border-0 cursor-pointer transition-colors
            font-['IBM_Plex_Sans_Thai'] text-[13px]
            ${selectedTime === time
              ? 'bg-[#fff3e8] text-orange'
              : 'bg-transparent text-[#374151] hover:bg-[#f3f4f6]'
            }
          `}
        >
          {time}
        </button>
      ))}
    </div>
  )

  return (
    <>
      <span ref={anchorEl} style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }} />
      {createPortal(dropdown, document.body)}
    </>
  )
}
