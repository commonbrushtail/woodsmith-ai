'use client'

import { useState, useRef, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createBranch } from '@/lib/actions/branches'
import { useToast } from '@/lib/toast-context'

/* ------------------------------------------------------------------ */
/*  SVG icon helpers                                                   */
/* ------------------------------------------------------------------ */

function ChevronLeftIcon({ size = 16, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 12L6 8L10 4" />
    </svg>
  )
}

function ChevronDownIcon({ size = 12, color = '#6b7280' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 4.5L6 7.5L9 4.5" />
    </svg>
  )
}

function DotsIcon({ size = 18, color = '#6b7280' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="19" r="1" />
    </svg>
  )
}

function PlusIcon({ size = 18, color = '#ff7e1b' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

function TrashIcon({ size = 14, color = '#ef4444' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  )
}

function DragIcon({ size = 16, color = '#9ca3af' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill={color} stroke="none">
      <circle cx="5.5" cy="3" r="1.2" />
      <circle cx="10.5" cy="3" r="1.2" />
      <circle cx="5.5" cy="8" r="1.2" />
      <circle cx="10.5" cy="8" r="1.2" />
      <circle cx="5.5" cy="13" r="1.2" />
      <circle cx="10.5" cy="13" r="1.2" />
    </svg>
  )
}

function ArrowLeftIcon({ size = 16, color = '#6b7280' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  )
}

function CalendarIcon({ size = 16, color = '#6b7280' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

function ClockIcon({ size = 16, color = '#6b7280' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function MapPinIcon({ size = 16, color = '#6b7280' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function LinkIcon({ size = 16, color = '#6b7280' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  Time options generator                                             */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/*  Calendar picker component                                          */
/* ------------------------------------------------------------------ */

function CalendarPicker({ selectedDate, onSelect, onClose }) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(selectedDate ? new Date(selectedDate).getFullYear() : today.getFullYear())
  const [viewMonth, setViewMonth] = useState(selectedDate ? new Date(selectedDate).getMonth() : today.getMonth())

  const monthNames = [
    '\u0e21\u0e01\u0e23\u0e32\u0e04\u0e21', '\u0e01\u0e38\u0e21\u0e20\u0e32\u0e1e\u0e31\u0e19\u0e18\u0e4c', '\u0e21\u0e35\u0e19\u0e32\u0e04\u0e21', '\u0e40\u0e21\u0e29\u0e32\u0e22\u0e19',
    '\u0e1e\u0e24\u0e29\u0e20\u0e32\u0e04\u0e21', '\u0e21\u0e34\u0e16\u0e38\u0e19\u0e32\u0e22\u0e19', '\u0e01\u0e23\u0e01\u0e0e\u0e32\u0e04\u0e21', '\u0e2a\u0e34\u0e07\u0e2b\u0e32\u0e04\u0e21',
    '\u0e01\u0e31\u0e19\u0e22\u0e32\u0e22\u0e19', '\u0e15\u0e38\u0e25\u0e32\u0e04\u0e21', '\u0e1e\u0e24\u0e28\u0e08\u0e34\u0e01\u0e32\u0e22\u0e19', '\u0e18\u0e31\u0e19\u0e27\u0e32\u0e04\u0e21',
  ]

  const dayHeaders = ['\u0e2d\u0e32', '\u0e08', '\u0e2d', '\u0e1e', '\u0e1e\u0e24', '\u0e28', '\u0e2a']

  const firstDay = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1) }
    else { setViewMonth(viewMonth - 1) }
  }

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1) }
    else { setViewMonth(viewMonth + 1) }
  }

  const handleDayClick = (day) => {
    const mm = String(viewMonth + 1).padStart(2, '0')
    const dd = String(day).padStart(2, '0')
    onSelect(`${viewYear}-${mm}-${dd}`)
    onClose()
  }

  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(<div key={`e-${i}`} />)
  for (let d = 1; d <= daysInMonth; d++) {
    const mm = String(viewMonth + 1).padStart(2, '0')
    const dd = String(d).padStart(2, '0')
    const dateStr = `${viewYear}-${mm}-${dd}`
    const isSelected = selectedDate === dateStr
    const isToday = d === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear()
    cells.push(
      <button
        key={d}
        type="button"
        onClick={() => handleDayClick(d)}
        className={`
          size-[32px] rounded-full flex items-center justify-center text-[13px] border-0 cursor-pointer transition-colors
          font-['IBM_Plex_Sans_Thai']
          ${isSelected
            ? 'bg-[#ff7e1b] text-white'
            : isToday
              ? 'bg-[#fff3e8] text-[#ff7e1b] hover:bg-[#ffe8d4]'
              : 'bg-transparent text-[#374151] hover:bg-[#f3f4f6]'
          }
        `}
      >
        {d}
      </button>
    )
  }

  return (
    <div className="absolute top-full left-0 mt-[4px] z-50 bg-white border border-[#e8eaef] rounded-[8px] shadow-lg p-[16px] w-[280px]">
      {/* Month/Year header */}
      <div className="flex items-center justify-between mb-[12px]">
        <button
          type="button"
          onClick={prevMonth}
          className="size-[28px] flex items-center justify-center rounded-full hover:bg-[#f3f4f6] border-0 bg-transparent cursor-pointer"
          aria-label="Previous month"
        >
          <ChevronLeftIcon size={14} color="#6b7280" />
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
          <ChevronLeftIcon size={14} color="#6b7280" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-[2px] mb-[4px]">
        {dayHeaders.map((dh) => (
          <div key={dh} className="size-[32px] flex items-center justify-center font-['IBM_Plex_Sans_Thai'] text-[11px] font-medium text-[#9ca3af]">
            {dh}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-[2px]">
        {cells}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Time picker dropdown component                                     */
/* ------------------------------------------------------------------ */

function TimePickerDropdown({ selectedTime, onSelect, onClose }) {
  return (
    <div className="absolute top-full left-0 mt-[4px] z-50 bg-white border border-[#e8eaef] rounded-[8px] shadow-lg w-[120px] max-h-[200px] overflow-y-auto">
      {TIME_OPTIONS.map((time) => (
        <button
          key={time}
          type="button"
          onClick={() => { onSelect(time); onClose() }}
          className={`
            w-full text-left px-[12px] py-[8px] border-0 cursor-pointer transition-colors
            font-['IBM_Plex_Sans_Thai'] text-[13px]
            ${selectedTime === time
              ? 'bg-[#fff3e8] text-[#ff7e1b]'
              : 'bg-transparent text-[#374151] hover:bg-[#f3f4f6]'
            }
          `}
        >
          {time}
        </button>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Upload drop-zone                                                   */
/* ------------------------------------------------------------------ */

function UploadDropZone({ onFilesSelected }) {
  const fileInputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true) }
  const handleDragLeave = () => setIsDragging(false)
  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files?.length && onFilesSelected) {
      onFilesSelected(Array.from(e.dataTransfer.files))
    }
  }
  const handleClick = () => fileInputRef.current?.click()
  const handleInputChange = (e) => {
    if (e.target.files?.length && onFilesSelected) {
      onFilesSelected(Array.from(e.target.files))
    }
  }

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        border-2 border-dashed rounded-[8px] bg-[#fafafa] flex flex-col items-center justify-center gap-[8px]
        py-[32px] px-[16px] cursor-pointer transition-colors
        ${isDragging ? 'border-[#ff7e1b] bg-[#fff8f3]' : 'border-[#e5e7eb] hover:border-[#ff7e1b]/50'}
      `}
      role="button"
      tabIndex={0}
      aria-label="Upload image area"
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick() } }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleInputChange}
      />
      <div className="size-[40px] rounded-full bg-[#ff7e1b]/10 flex items-center justify-center">
        <PlusIcon size={20} color="#ff7e1b" />
      </div>
      <p className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#9ca3af] text-center leading-[1.5] m-0">
        Click to add an asset or drag and drop one in this area
      </p>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Regional section component (collapsible with entries)              */
/* ------------------------------------------------------------------ */

function RegionSection({ label, entryCount = 0, isExpanded, onToggle, children }) {
  return (
    <section className="bg-white rounded-[12px] border border-[#e8eaef] overflow-hidden">
      {/* Section header */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-[24px] py-[16px] bg-transparent border-0 cursor-pointer hover:bg-[#f9fafb] transition-colors"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-[12px]">
          <span className="font-['IBM_Plex_Sans_Thai'] text-[15px] font-semibold text-[#1f2937]">
            {label}
          </span>
          <span className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-[6px] rounded-full bg-[#f3f4f6] font-['IBM_Plex_Sans_Thai'] text-[12px] font-medium text-[#6b7280]">
            {entryCount}
          </span>
        </div>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="#6b7280"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
        >
          <path d="M4 6L8 10L12 6" />
        </svg>
      </button>

      {/* Section content */}
      {isExpanded && (
        <div className="border-t border-[#e8eaef]">
          {children}

          {/* Add entry button */}
          <div className="px-[24px] py-[16px]">
            <button
              type="button"
              className="flex items-center gap-[8px] px-[16px] py-[8px] rounded-[8px] border border-dashed border-[#e5e7eb] bg-transparent cursor-pointer hover:border-[#ff7e1b]/50 hover:bg-[#fff8f3] transition-colors w-full justify-center"
            >
              <PlusIcon size={16} color="#ff7e1b" />
              <span className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#ff7e1b] font-medium">
                Add an entry
              </span>
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Working hours selector                                             */
/* ------------------------------------------------------------------ */

function WorkingHoursField({ workDate, workStartTime, workEndTime, onDateChange, onStartTimeChange, onEndTimeChange }) {
  const [showCal, setShowCal] = useState(false)
  const [showStartPicker, setShowStartPicker] = useState(false)
  const [showEndPicker, setShowEndPicker] = useState(false)

  const closeAll = () => {
    setShowCal(false)
    setShowStartPicker(false)
    setShowEndPicker(false)
  }

  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return ''
    const [y, m, d] = dateStr.split('-')
    return `${d}/${m}/${Number(y) + 543}`
  }

  return (
    <div className="flex flex-col gap-[8px]">
      <label className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
        {'\u0e40\u0e27\u0e25\u0e32\u0e17\u0e33\u0e07\u0e32\u0e19'}
      </label>
      <div className="flex items-center gap-[12px]">
        {/* Calendar date picker */}
        <div className="relative flex-1">
          <button
            type="button"
            onClick={() => { closeAll(); setShowCal(!showCal) }}
            className={`
              w-full flex items-center gap-[8px] border border-[#e8eaef] rounded-[8px]
              px-[14px] py-[10px] bg-white cursor-pointer transition-all text-left
              font-['IBM_Plex_Sans_Thai'] text-[14px]
              ${showCal ? 'border-[#ff7e1b] ring-1 ring-[#ff7e1b]/20' : 'hover:border-[#d1d5db]'}
              ${workDate ? 'text-[#1f2937]' : 'text-[#bfbfbf]'}
            `}
            aria-label="Select working date"
          >
            <CalendarIcon size={16} color="#6b7280" />
            <span>{workDate ? formatDateDisplay(workDate) : 'dd/mm/yyyy'}</span>
          </button>
          {showCal && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowCal(false)} />
              <CalendarPicker
                selectedDate={workDate}
                onSelect={onDateChange}
                onClose={() => setShowCal(false)}
              />
            </>
          )}
        </div>

        {/* Start time */}
        <div className="relative w-[120px]">
          <button
            type="button"
            onClick={() => { closeAll(); setShowStartPicker(!showStartPicker) }}
            className={`
              w-full flex items-center gap-[8px] border border-[#e8eaef] rounded-[8px]
              px-[14px] py-[10px] bg-white cursor-pointer transition-all text-left
              font-['IBM_Plex_Sans_Thai'] text-[14px]
              ${showStartPicker ? 'border-[#ff7e1b] ring-1 ring-[#ff7e1b]/20' : 'hover:border-[#d1d5db]'}
              ${workStartTime ? 'text-[#1f2937]' : 'text-[#bfbfbf]'}
            `}
            aria-label="Select start time"
          >
            <ClockIcon size={16} color="#6b7280" />
            <span>{workStartTime || '00:00'}</span>
          </button>
          {showStartPicker && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowStartPicker(false)} />
              <TimePickerDropdown
                selectedTime={workStartTime}
                onSelect={onStartTimeChange}
                onClose={() => setShowStartPicker(false)}
              />
            </>
          )}
        </div>

        <span className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#9ca3af]">-</span>

        {/* End time */}
        <div className="relative w-[120px]">
          <button
            type="button"
            onClick={() => { closeAll(); setShowEndPicker(!showEndPicker) }}
            className={`
              w-full flex items-center gap-[8px] border border-[#e8eaef] rounded-[8px]
              px-[14px] py-[10px] bg-white cursor-pointer transition-all text-left
              font-['IBM_Plex_Sans_Thai'] text-[14px]
              ${showEndPicker ? 'border-[#ff7e1b] ring-1 ring-[#ff7e1b]/20' : 'hover:border-[#d1d5db]'}
              ${workEndTime ? 'text-[#1f2937]' : 'text-[#bfbfbf]'}
            `}
            aria-label="Select end time"
          >
            <ClockIcon size={16} color="#6b7280" />
            <span>{workEndTime || '00:00'}</span>
          </button>
          {showEndPicker && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowEndPicker(false)} />
              <TimePickerDropdown
                selectedTime={workEndTime}
                onSelect={onEndTimeChange}
                onClose={() => setShowEndPicker(false)}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main page component                                                */
/* ------------------------------------------------------------------ */

export default function BranchCreatePage() {
  const { toast } = useToast()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  /* ---- Form state ---- */
  const [activeTab, setActiveTab] = useState('draft')
  const [image, setImage] = useState(null)
  const [branchName, setBranchName] = useState('')
  const [address, setAddress] = useState('')
  const [subDistrict, setSubDistrict] = useState('')
  const [district, setDistrict] = useState('')
  const [province, setProvince] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [phone, setPhone] = useState('')
  const [workDate, setWorkDate] = useState('')
  const [workStartTime, setWorkStartTime] = useState('')
  const [workEndTime, setWorkEndTime] = useState('')
  const [googleMapUrl, setGoogleMapUrl] = useState('')
  const [lineOaUrl, setLineOaUrl] = useState('')

  /* ---- Region collapse state ---- */
  const [expandedRegions, setExpandedRegions] = useState({
    headquarters: true,
    central: false,
    east: false,
    north: false,
    northeast: false,
    south: false,
  })

  /* ---- Locale picker ---- */
  const [showLocalePicker, setShowLocalePicker] = useState(false)

  const tabs = [
    { key: 'draft', label: 'DRAFT' },
    { key: 'published', label: 'PUBLISHED' },
  ]

  const toggleRegion = (key) => {
    setExpandedRegions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  /* ---- Image upload handler ---- */
  const handleImageUpload = (files) => {
    if (files.length > 0) {
      const f = files[0]
      setImage({
        id: Date.now() + Math.random(),
        name: f.name,
        url: URL.createObjectURL(f),
      })
    }
  }

  const removeImage = () => setImage(null)

  /* ---- Submit handler ---- */
  const handleSubmit = (publish) => {
    startTransition(async () => {
      const fullAddress = [address, subDistrict, district, province, postalCode]
        .filter(Boolean)
        .join(', ')

      const formData = new FormData()
      formData.set('name', branchName)
      formData.set('address', fullAddress)
      formData.set('phone', phone)
      formData.set('map_url', googleMapUrl)
      formData.set('published', publish ? 'true' : 'false')

      const result = await createBranch(formData)
      if (result.error) {
        toast.error('เกิดข้อผิดพลาด: ' + result.error)
      } else {
        router.push('/admin/branch')
        router.refresh()
      }
    })
  }

  return (
    <div className={`flex flex-col gap-0 h-full min-h-0 ${isPending ? 'opacity-60 pointer-events-none' : ''}`}>
      {/* ================================================================ */}
      {/*  Header                                                          */}
      {/* ================================================================ */}
      <div className="flex items-center justify-between py-[12px]">
        {/* Left: back + title + badge */}
        <div className="flex items-center gap-[12px]">
          <Link
            href="/admin/branch"
            className="flex items-center gap-[6px] font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#6b7280] no-underline hover:text-[#494c4f] transition-colors"
          >
            <ChevronLeftIcon size={16} color="currentColor" />
            <span>{'\u0e01\u0e25\u0e31\u0e1a'}</span>
          </Link>

          <h1 className="font-['IBM_Plex_Sans_Thai'] font-bold text-[22px] text-[#1f2937] m-0">
            {'\u0e0a\u0e48\u0e2d\u0e07\u0e17\u0e32\u0e07\u0e2a\u0e32\u0e02\u0e32 (Branch)'}
          </h1>

          <span className="inline-flex items-center px-[10px] py-[2px] rounded-full border border-[#ff7e1b]/40 bg-[#ff7e1b]/5 font-['IBM_Plex_Sans_Thai'] text-[12px] font-medium text-[#ff7e1b] leading-[1.8]">
            {'\u0e40\u0e1c\u0e22\u0e41\u0e1e\u0e23\u0e48'}
          </span>
        </div>

        {/* Right: locale dropdown + dots menu */}
        <div className="flex items-center gap-[8px]">
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowLocalePicker(!showLocalePicker)}
              className="flex items-center gap-[8px] border border-[#e5e7eb] rounded-[8px] px-[12px] py-[6px] cursor-pointer hover:bg-[#f9fafb] bg-white transition-colors"
            >
              <span className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#4b5563]">Thai (th)</span>
              <ChevronDownIcon />
            </button>
            {showLocalePicker && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowLocalePicker(false)} />
                <div className="absolute top-full right-0 mt-[4px] z-50 bg-white border border-[#e8eaef] rounded-[8px] shadow-lg overflow-hidden min-w-[140px]">
                  <button type="button" className="w-full text-left px-[14px] py-[10px] border-0 cursor-pointer bg-[#fff3e8] text-[#ff7e1b] font-['IBM_Plex_Sans_Thai'] text-[13px]">
                    Thai (th)
                  </button>
                  <button type="button" className="w-full text-left px-[14px] py-[10px] border-0 cursor-pointer bg-transparent text-[#374151] hover:bg-[#f3f4f6] font-['IBM_Plex_Sans_Thai'] text-[13px]">
                    English (en)
                  </button>
                </div>
              </>
            )}
          </div>

          <button
            type="button"
            className="size-[32px] flex items-center justify-center rounded-[8px] hover:bg-gray-100 cursor-pointer bg-transparent border-0"
            aria-label="More options"
          >
            <DotsIcon size={18} />
          </button>
        </div>
      </div>

      {/* ================================================================ */}
      {/*  Tabs                                                            */}
      {/* ================================================================ */}
      <div className="flex gap-0 border-b border-[#e5e7eb]" role="tablist" aria-label="Branch status tabs">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab.key)}
              className={`
                relative px-[20px] py-[10px] font-['IBM_Plex_Sans_Thai'] font-semibold text-[13px]
                tracking-[0.5px] cursor-pointer bg-transparent border-0 transition-colors
                ${isActive ? 'text-[#ff7e1b]' : 'text-[#9ca3af] hover:text-[#6b7280]'}
              `}
            >
              {tab.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#ff7e1b] rounded-t-full" />
              )}
            </button>
          )
        })}
      </div>

      {/* ================================================================ */}
      {/*  Content body                                                    */}
      {/* ================================================================ */}
      <div className="flex gap-[24px] mt-[20px] flex-1 min-h-0 overflow-y-auto pb-[32px]">
        {/* ---- Main form area ---- */}
        <div className="flex-1 flex flex-col gap-[24px] min-w-0">

          {/* ---------------------------------------------------------- */}
          {/*  Region: Headquarters (with expanded form)                   */}
          {/* ---------------------------------------------------------- */}
          <RegionSection
            label={'\u0e2a\u0e33\u0e19\u0e31\u0e01\u0e07\u0e32\u0e19\u0e43\u0e2b\u0e0d\u0e48'}
            entryCount={1}
            isExpanded={expandedRegions.headquarters}
            onToggle={() => toggleRegion('headquarters')}
          >
            {/* Entry card with form */}
            <div className="mx-[24px] my-[16px] border border-[#e8eaef] rounded-[8px] bg-white overflow-hidden">
              {/* Entry header row */}
              <div className="flex items-center justify-between px-[16px] py-[12px] bg-[#f9fafb] border-b border-[#e8eaef]">
                <button
                  type="button"
                  className="size-[32px] flex items-center justify-center rounded-[6px] hover:bg-[#f3f4f6] border-0 bg-transparent cursor-pointer"
                  aria-label="Go back"
                >
                  <ArrowLeftIcon size={16} color="#6b7280" />
                </button>
                <div className="flex items-center gap-[8px]">
                  <button
                    type="button"
                    className="size-[32px] flex items-center justify-center rounded-[6px] hover:bg-red-50 border-0 bg-transparent cursor-pointer transition-colors"
                    aria-label="Delete entry"
                  >
                    <TrashIcon size={14} color="#ef4444" />
                  </button>
                  <div className="cursor-grab" aria-label="Drag to reorder">
                    <DragIcon size={16} color="#9ca3af" />
                  </div>
                </div>
              </div>

              {/* Form fields */}
              <div className="flex flex-col gap-[20px] p-[24px]">

                {/* 1. Image upload */}
                <div className="flex flex-col gap-[8px]">
                  <label className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
                    Image / {'\u0e23\u0e39\u0e1b\u0e20\u0e32\u0e1e'} <span className="text-red-500">*</span>
                  </label>

                  {image && (
                    <div className="relative w-full max-w-[320px] h-[200px] rounded-[8px] overflow-hidden bg-[#f3f4f6]">
                      <img
                        src={image.url}
                        alt={image.name}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-[8px] right-[8px] size-[24px] bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center border-0 cursor-pointer z-10 transition-colors"
                        aria-label={`Remove ${image.name}`}
                      >
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round">
                          <path d="M2 2L8 8M8 2L2 8" />
                        </svg>
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/30 px-[8px] py-[4px]">
                        <span className="font-['IBM_Plex_Sans_Thai'] text-[11px] text-white truncate block">
                          {image.name}
                        </span>
                      </div>
                    </div>
                  )}

                  {!image && (
                    <UploadDropZone onFilesSelected={handleImageUpload} />
                  )}
                </div>

                {/* 2. Branch name */}
                <div className="flex flex-col gap-[8px]">
                  <label htmlFor="branchName" className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
                    {'\u0e0a\u0e37\u0e48\u0e2d\u0e2a\u0e32\u0e02\u0e32'}
                  </label>
                  <input
                    id="branchName"
                    type="text"
                    value={branchName}
                    onChange={(e) => setBranchName(e.target.value)}
                    placeholder={'\u0e01\u0e23\u0e2d\u0e01\u0e0a\u0e37\u0e48\u0e2d\u0e2a\u0e32\u0e02\u0e32'}
                    className="w-full font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border border-[#e8eaef] rounded-[8px] px-[14px] py-[10px] outline-none focus:border-[#ff7e1b] focus:ring-1 focus:ring-[#ff7e1b]/20 transition-all placeholder:text-[#bfbfbf] bg-white"
                  />
                </div>

                {/* 3. Address (full width) */}
                <div className="flex flex-col gap-[8px]">
                  <label htmlFor="branchAddress" className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
                    {'\u0e17\u0e35\u0e48\u0e2d\u0e22\u0e39\u0e48 (\u0e40\u0e25\u0e02\u0e17\u0e35\u0e48, \u0e2b\u0e21\u0e39\u0e48\u0e17\u0e35\u0e48, \u0e0b\u0e2d\u0e22, \u0e16\u0e19\u0e19)'}
                  </label>
                  <input
                    id="branchAddress"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder={'\u0e01\u0e23\u0e2d\u0e01\u0e17\u0e35\u0e48\u0e2d\u0e22\u0e39\u0e48'}
                    className="w-full font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border border-[#e8eaef] rounded-[8px] px-[14px] py-[10px] outline-none focus:border-[#ff7e1b] focus:ring-1 focus:ring-[#ff7e1b]/20 transition-all placeholder:text-[#bfbfbf] bg-white"
                  />
                </div>

                {/* 4. Sub-district + District (2 columns) */}
                <div className="grid grid-cols-2 gap-[16px]">
                  <div className="flex flex-col gap-[8px]">
                    <label htmlFor="subDistrict" className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
                      {'\u0e15\u0e33\u0e1a\u0e25/\u0e41\u0e02\u0e27\u0e07'}
                    </label>
                    <input
                      id="subDistrict"
                      type="text"
                      value={subDistrict}
                      onChange={(e) => setSubDistrict(e.target.value)}
                      placeholder={'\u0e01\u0e23\u0e2d\u0e01\u0e15\u0e33\u0e1a\u0e25/\u0e41\u0e02\u0e27\u0e07'}
                      className="w-full font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border border-[#e8eaef] rounded-[8px] px-[14px] py-[10px] outline-none focus:border-[#ff7e1b] focus:ring-1 focus:ring-[#ff7e1b]/20 transition-all placeholder:text-[#bfbfbf] bg-white"
                    />
                  </div>
                  <div className="flex flex-col gap-[8px]">
                    <label htmlFor="district" className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
                      {'\u0e2d\u0e33\u0e40\u0e20\u0e2d/\u0e40\u0e02\u0e15'}
                    </label>
                    <input
                      id="district"
                      type="text"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      placeholder={'\u0e01\u0e23\u0e2d\u0e01\u0e2d\u0e33\u0e40\u0e20\u0e2d/\u0e40\u0e02\u0e15'}
                      className="w-full font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border border-[#e8eaef] rounded-[8px] px-[14px] py-[10px] outline-none focus:border-[#ff7e1b] focus:ring-1 focus:ring-[#ff7e1b]/20 transition-all placeholder:text-[#bfbfbf] bg-white"
                    />
                  </div>
                </div>

                {/* 5. Province + Postal code (2 columns) */}
                <div className="grid grid-cols-2 gap-[16px]">
                  <div className="flex flex-col gap-[8px]">
                    <label htmlFor="province" className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
                      {'\u0e08\u0e31\u0e07\u0e2b\u0e27\u0e31\u0e14'}
                    </label>
                    <input
                      id="province"
                      type="text"
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                      placeholder={'\u0e01\u0e23\u0e2d\u0e01\u0e08\u0e31\u0e07\u0e2b\u0e27\u0e31\u0e14'}
                      className="w-full font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border border-[#e8eaef] rounded-[8px] px-[14px] py-[10px] outline-none focus:border-[#ff7e1b] focus:ring-1 focus:ring-[#ff7e1b]/20 transition-all placeholder:text-[#bfbfbf] bg-white"
                    />
                  </div>
                  <div className="flex flex-col gap-[8px]">
                    <label htmlFor="postalCode" className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
                      {'\u0e23\u0e2b\u0e31\u0e2a\u0e44\u0e1b\u0e23\u0e29\u0e13\u0e35\u0e22\u0e4c'}
                    </label>
                    <input
                      id="postalCode"
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder={'\u0e01\u0e23\u0e2d\u0e01\u0e23\u0e2b\u0e31\u0e2a\u0e44\u0e1b\u0e23\u0e29\u0e13\u0e35\u0e22\u0e4c'}
                      className="w-full font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border border-[#e8eaef] rounded-[8px] px-[14px] py-[10px] outline-none focus:border-[#ff7e1b] focus:ring-1 focus:ring-[#ff7e1b]/20 transition-all placeholder:text-[#bfbfbf] bg-white"
                    />
                  </div>
                </div>

                {/* 6. Phone number */}
                <div className="flex flex-col gap-[8px]">
                  <label htmlFor="phone" className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
                    {'\u0e40\u0e1a\u0e2d\u0e23\u0e4c\u0e42\u0e17\u0e23\u0e28\u0e31\u0e1e\u0e17\u0e4c'}
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={'\u0e01\u0e23\u0e2d\u0e01\u0e40\u0e1a\u0e2d\u0e23\u0e4c\u0e42\u0e17\u0e23\u0e28\u0e31\u0e1e\u0e17\u0e4c'}
                    className="w-full font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border border-[#e8eaef] rounded-[8px] px-[14px] py-[10px] outline-none focus:border-[#ff7e1b] focus:ring-1 focus:ring-[#ff7e1b]/20 transition-all placeholder:text-[#bfbfbf] bg-white"
                  />
                </div>

                {/* 7. Working hours */}
                <WorkingHoursField
                  workDate={workDate}
                  workStartTime={workStartTime}
                  workEndTime={workEndTime}
                  onDateChange={setWorkDate}
                  onStartTimeChange={setWorkStartTime}
                  onEndTimeChange={setWorkEndTime}
                />

                {/* 8. Google Map URL */}
                <div className="flex flex-col gap-[8px]">
                  <label htmlFor="googleMapUrl" className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
                    {'\u0e01\u0e33\u0e2b\u0e19\u0e14\u0e04\u0e48\u0e32\u0e44\u0e14\u0e49\u0e17\u0e35\u0e48\u0e25\u0e34\u0e49\u0e07 Google map'}
                  </label>
                  <div className="relative">
                    <div className="absolute left-[14px] top-1/2 -translate-y-1/2 pointer-events-none">
                      <MapPinIcon size={16} color="#9ca3af" />
                    </div>
                    <input
                      id="googleMapUrl"
                      type="url"
                      value={googleMapUrl}
                      onChange={(e) => setGoogleMapUrl(e.target.value)}
                      placeholder="https://maps.google.com/..."
                      className="w-full font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border border-[#e8eaef] rounded-[8px] pl-[38px] pr-[14px] py-[10px] outline-none focus:border-[#ff7e1b] focus:ring-1 focus:ring-[#ff7e1b]/20 transition-all placeholder:text-[#bfbfbf] bg-white"
                    />
                  </div>
                </div>

                {/* 9. LINE OA URL */}
                <div className="flex flex-col gap-[8px]">
                  <label htmlFor="lineOaUrl" className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
                    {'\u0e01\u0e33\u0e2b\u0e19\u0e14\u0e04\u0e48\u0e32\u0e44\u0e14\u0e49\u0e17\u0e35\u0e48\u0e25\u0e34\u0e49\u0e07 Add LINE OA'}
                  </label>
                  <div className="relative">
                    <div className="absolute left-[14px] top-1/2 -translate-y-1/2 pointer-events-none">
                      <LinkIcon size={16} color="#9ca3af" />
                    </div>
                    <input
                      id="lineOaUrl"
                      type="url"
                      value={lineOaUrl}
                      onChange={(e) => setLineOaUrl(e.target.value)}
                      placeholder="https://line.me/..."
                      className="w-full font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border border-[#e8eaef] rounded-[8px] pl-[38px] pr-[14px] py-[10px] outline-none focus:border-[#ff7e1b] focus:ring-1 focus:ring-[#ff7e1b]/20 transition-all placeholder:text-[#bfbfbf] bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </RegionSection>

          {/* ---------------------------------------------------------- */}
          {/*  Remaining regional sections (empty)                         */}
          {/* ---------------------------------------------------------- */}
          <RegionSection
            label={'\u0e20\u0e32\u0e04\u0e01\u0e25\u0e32\u0e07'}
            entryCount={0}
            isExpanded={expandedRegions.central}
            onToggle={() => toggleRegion('central')}
          >
            <div className="px-[24px] py-[24px] flex flex-col items-center gap-[8px]">
              <p className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#9ca3af] m-0">
                {'\u0e22\u0e31\u0e07\u0e44\u0e21\u0e48\u0e21\u0e35\u0e23\u0e32\u0e22\u0e01\u0e32\u0e23'}
              </p>
            </div>
          </RegionSection>

          <RegionSection
            label={'\u0e20\u0e32\u0e04\u0e15\u0e30\u0e27\u0e31\u0e19\u0e2d\u0e2d\u0e01'}
            entryCount={0}
            isExpanded={expandedRegions.east}
            onToggle={() => toggleRegion('east')}
          >
            <div className="px-[24px] py-[24px] flex flex-col items-center gap-[8px]">
              <p className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#9ca3af] m-0">
                {'\u0e22\u0e31\u0e07\u0e44\u0e21\u0e48\u0e21\u0e35\u0e23\u0e32\u0e22\u0e01\u0e32\u0e23'}
              </p>
            </div>
          </RegionSection>

          <RegionSection
            label={'\u0e20\u0e32\u0e04\u0e40\u0e2b\u0e19\u0e37\u0e2d'}
            entryCount={0}
            isExpanded={expandedRegions.north}
            onToggle={() => toggleRegion('north')}
          >
            <div className="px-[24px] py-[24px] flex flex-col items-center gap-[8px]">
              <p className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#9ca3af] m-0">
                {'\u0e22\u0e31\u0e07\u0e44\u0e21\u0e48\u0e21\u0e35\u0e23\u0e32\u0e22\u0e01\u0e32\u0e23'}
              </p>
            </div>
          </RegionSection>

          <RegionSection
            label={'\u0e20\u0e32\u0e04\u0e15\u0e30\u0e27\u0e31\u0e19\u0e2d\u0e2d\u0e01\u0e40\u0e09\u0e35\u0e22\u0e07\u0e40\u0e2b\u0e19\u0e37\u0e2d'}
            entryCount={0}
            isExpanded={expandedRegions.northeast}
            onToggle={() => toggleRegion('northeast')}
          >
            <div className="px-[24px] py-[24px] flex flex-col items-center gap-[8px]">
              <p className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#9ca3af] m-0">
                {'\u0e22\u0e31\u0e07\u0e44\u0e21\u0e48\u0e21\u0e35\u0e23\u0e32\u0e22\u0e01\u0e32\u0e23'}
              </p>
            </div>
          </RegionSection>

          <RegionSection
            label={'\u0e20\u0e32\u0e04\u0e43\u0e15\u0e49'}
            entryCount={0}
            isExpanded={expandedRegions.south}
            onToggle={() => toggleRegion('south')}
          >
            <div className="px-[24px] py-[24px] flex flex-col items-center gap-[8px]">
              <p className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#9ca3af] m-0">
                {'\u0e22\u0e31\u0e07\u0e44\u0e21\u0e48\u0e21\u0e35\u0e23\u0e32\u0e22\u0e01\u0e32\u0e23'}
              </p>
            </div>
          </RegionSection>
        </div>

        {/* ============================================================ */}
        {/*  Right sidebar - ENTRY panel                                  */}
        {/* ============================================================ */}
        <aside className="w-[260px] shrink-0 flex flex-col gap-[16px]">
          <div className="bg-white rounded-[12px] border border-[#e8eaef] p-[20px] flex flex-col gap-[16px]">
            <h3 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[12px] text-[#9ca3af] tracking-[0.8px] uppercase m-0">
              Entry
            </h3>

            {/* Publish button + dots menu */}
            <div className="flex items-center gap-[8px]">
              <button
                type="button"
                onClick={() => handleSubmit(true)}
                disabled={isPending}
                className="flex-1 flex items-center justify-center gap-[6px] px-[16px] py-[8px] rounded-[8px] bg-[#ff7e1b] text-white font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] border-0 cursor-pointer hover:bg-[#e56f15] transition-colors disabled:opacity-50"
              >
                {isPending ? 'กำลังบันทึก...' : 'เผยแพร่'}
              </button>
              <button
                type="button"
                className="size-[36px] flex items-center justify-center rounded-[8px] border border-[#e8eaef] bg-white cursor-pointer hover:bg-[#f9fafb]"
                aria-label="Publish options"
              >
                <DotsIcon size={16} color="#6b7280" />
              </button>
            </div>

            {/* Save button */}
            <button
              type="button"
              onClick={() => handleSubmit(false)}
              disabled={isPending}
              className="w-full flex items-center justify-center px-[16px] py-[8px] rounded-[8px] bg-white text-[#374151] font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] border border-[#e8eaef] cursor-pointer hover:bg-[#f9fafb] transition-colors disabled:opacity-50"
            >
              {'\u0e1a\u0e31\u0e19\u0e17\u0e36\u0e01'}
            </button>
          </div>
        </aside>
      </div>
    </div>
  )
}
