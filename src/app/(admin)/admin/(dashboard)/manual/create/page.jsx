'use client'

import { useState, useRef, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createManual } from '@/lib/actions/manuals'
import { useToast } from '@/lib/toast-context'
import { validateFile, ALLOWED_IMAGE_TYPES, ALLOWED_PDF_TYPES, MAX_IMAGE_SIZE, MAX_PDF_SIZE } from '@/lib/upload-validation'

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

function FileIcon({ size = 20, color = '#ff7e1b' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
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
/*  Image upload drop-zone                                             */
/* ------------------------------------------------------------------ */

function ImageUploadDropZone({ onFilesSelected }) {
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
/*  PDF upload drop-zone                                               */
/* ------------------------------------------------------------------ */

function PdfUploadDropZone({ onFilesSelected }) {
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
      aria-label="Upload PDF file area"
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick() } }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
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
/*  Main page component                                                */
/* ------------------------------------------------------------------ */

export default function ManualCreatePage() {
  const { toast } = useToast()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  /* ---- Form state ---- */
  const [title, setTitle] = useState('')
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [image, setImage] = useState(null)
  const [pdfFile, setPdfFile] = useState(null)

  /* ---- Date/time state ---- */
  const [startDate, setStartDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endDate, setEndDate] = useState('')
  const [endTime, setEndTime] = useState('')

  /* ---- Picker visibility ---- */
  const [showStartCal, setShowStartCal] = useState(false)
  const [showEndCal, setShowEndCal] = useState(false)
  const [showStartTime, setShowStartTime] = useState(false)
  const [showEndTime, setShowEndTime] = useState(false)
  const [showLocalePicker, setShowLocalePicker] = useState(false)

  const TITLE_MAX = 120

  /* ---- Image upload handler ---- */
  const handleImageUpload = (files) => {
    if (files.length > 0) {
      const f = files[0]
      const check = validateFile(f, { allowedTypes: ALLOWED_IMAGE_TYPES, maxSize: MAX_IMAGE_SIZE })
      if (!check.valid) { toast.error(check.error); return }
      setImage({
        id: Date.now() + Math.random(),
        name: f.name,
        url: URL.createObjectURL(f),
        file: f,
      })
    }
  }

  const removeImage = () => setImage(null)

  /* ---- PDF upload handler ---- */
  const handlePdfUpload = (files) => {
    if (files.length > 0) {
      const f = files[0]
      const check = validateFile(f, { allowedTypes: ALLOWED_PDF_TYPES, maxSize: MAX_PDF_SIZE })
      if (!check.valid) { toast.error(check.error); return }
      setPdfFile({
        id: Date.now() + Math.random(),
        name: f.name,
        size: (f.size / 1024).toFixed(1),
        file: f,
      })
    }
  }

  const removePdf = () => setPdfFile(null)

  /* ---- Date display helper ---- */
  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return ''
    const [y, m, d] = dateStr.split('-')
    return `${d}/${m}/${Number(y) + 543}`
  }

  /* ---- Close all pickers helper ---- */
  const closeAllPickers = () => {
    setShowStartCal(false)
    setShowEndCal(false)
    setShowStartTime(false)
    setShowEndTime(false)
  }

  /* ---- Submit handler ---- */
  const handleSubmit = (publish) => {
    startTransition(async () => {
      const formData = new FormData()
      formData.set('title', title)
      formData.set('published', publish ? 'true' : 'false')
      if (pdfFile?.file) {
        formData.set('file', pdfFile.file)
      }
      if (image?.file) {
        formData.set('cover_image', image.file)
      }

      if (youtubeUrl) formData.set('youtube_url', youtubeUrl)

      const result = await createManual(formData)
      if (result.error) {
        toast.error('เกิดข้อผิดพลาด: ' + result.error)
      } else {
        router.push('/admin/manual')
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
            href="/admin/manual"
            className="flex items-center gap-[6px] font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#6b7280] no-underline hover:text-[#494c4f] transition-colors"
          >
            <ChevronLeftIcon size={16} color="currentColor" />
            <span>{'\u0e01\u0e25\u0e31\u0e1a'}</span>
          </Link>

          <h1 className="font-['IBM_Plex_Sans_Thai'] font-bold text-[22px] text-[#1f2937] m-0">
            {'\u0e04\u0e39\u0e48\u0e21\u0e37\u0e2d\u0e01\u0e32\u0e23\u0e43\u0e0a\u0e49\u0e2a\u0e34\u0e19\u0e04\u0e49\u0e32 (Manual)'}
          </h1>

          <span className="inline-flex items-center px-[10px] py-[2px] rounded-full bg-[#3b82f6]/10 font-['IBM_Plex_Sans_Thai'] text-[12px] font-medium text-[#3b82f6] leading-[1.8]">
            Draft
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
      {/*  Content body                                                    */}
      {/* ================================================================ */}
      <div className="flex gap-[24px] mt-[20px] flex-1 min-h-0 overflow-y-auto pb-[32px]">
        {/* ---- Main form area ---- */}
        <div className="flex-1 flex flex-col gap-[24px] min-w-0">

          {/* ---------------------------------------------------------- */}
          {/*  1. Image Upload                                            */}
          {/* ---------------------------------------------------------- */}
          <section className="bg-white rounded-[12px] border border-[#e8eaef] p-[24px] flex flex-col gap-[16px]">
            <label className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
              Image / {'\u0e23\u0e39\u0e1b\u0e20\u0e32\u0e1e'} <span className="text-red-500">*</span>
            </label>

            {/* Uploaded image preview */}
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

            {/* Upload zone (show only if no image) */}
            {!image && (
              <ImageUploadDropZone onFilesSelected={handleImageUpload} />
            )}
          </section>

          {/* ---------------------------------------------------------- */}
          {/*  2. Title                                                    */}
          {/* ---------------------------------------------------------- */}
          <section className="bg-white rounded-[12px] border border-[#e8eaef] p-[24px] flex flex-col gap-[8px]">
            <label htmlFor="manualTitle" className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
              Title / {'\u0e0a\u0e37\u0e48\u0e2d\u0e04\u0e39\u0e48\u0e21\u0e37\u0e2d'} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="manualTitle"
                type="text"
                value={title}
                onChange={(e) => {
                  if (e.target.value.length <= TITLE_MAX) setTitle(e.target.value)
                }}
                maxLength={TITLE_MAX}
                placeholder={'\u0e01\u0e23\u0e2d\u0e01\u0e0a\u0e37\u0e48\u0e2d\u0e04\u0e39\u0e48\u0e21\u0e37\u0e2d'}
                className="w-full font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border border-[#e8eaef] rounded-[8px] px-[14px] py-[10px] outline-none focus:border-[#ff7e1b] focus:ring-1 focus:ring-[#ff7e1b]/20 transition-all placeholder:text-[#bfbfbf]"
              />
            </div>
            <span className="font-['IBM_Plex_Sans_Thai'] text-[12px] text-[#9ca3af] self-end">
              {title.length}/{TITLE_MAX}
            </span>
          </section>

          {/* ---------------------------------------------------------- */}
          {/*  3. PDF Upload                                               */}
          {/* ---------------------------------------------------------- */}
          <section className="bg-white rounded-[12px] border border-[#e8eaef] p-[24px] flex flex-col gap-[16px]">
            <label className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
              {'\u0e41\u0e19\u0e1a\u0e44\u0e1f\u0e25\u0e4c\u0e04\u0e39\u0e48\u0e21\u0e37\u0e2d PDF'}
            </label>

            {/* Uploaded PDF file preview */}
            {pdfFile && (
              <div className="flex items-center gap-[12px] border border-[#e8eaef] rounded-[8px] px-[16px] py-[12px] bg-[#fafafa]">
                <div className="size-[36px] rounded-[6px] bg-[#ff7e1b]/10 flex items-center justify-center shrink-0">
                  <FileIcon size={18} color="#ff7e1b" />
                </div>
                <div className="flex flex-col gap-[2px] flex-1 min-w-0">
                  <span className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#1f2937] font-medium truncate">
                    {pdfFile.name}
                  </span>
                  <span className="font-['IBM_Plex_Sans_Thai'] text-[11px] text-[#9ca3af]">
                    {pdfFile.size} KB
                  </span>
                </div>
                <button
                  type="button"
                  onClick={removePdf}
                  className="size-[28px] flex items-center justify-center rounded-[6px] hover:bg-red-50 border-0 bg-transparent cursor-pointer transition-colors"
                  aria-label={`Remove ${pdfFile.name}`}
                >
                  <TrashIcon size={14} color="#ef4444" />
                </button>
              </div>
            )}

            {/* Upload zone (show only if no PDF) */}
            {!pdfFile && (
              <PdfUploadDropZone onFilesSelected={handlePdfUpload} />
            )}
          </section>

          {/* ---------------------------------------------------------- */}
          {/*  4. YouTube URL                                              */}
          {/* ---------------------------------------------------------- */}
          <section className="bg-white rounded-[12px] border border-[#e8eaef] p-[24px] flex flex-col gap-[8px]">
            <label htmlFor="youtubeUrl" className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
              {'\u0e41\u0e19\u0e1a\u0e25\u0e34\u0e07\u0e01\u0e4c\u0e27\u0e34\u0e14\u0e35\u0e42\u0e2d YouTube'}
            </label>
            <input
              id="youtubeUrl"
              type="url"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border border-[#e8eaef] rounded-[8px] px-[14px] py-[10px] outline-none focus:border-[#ff7e1b] focus:ring-1 focus:ring-[#ff7e1b]/20 transition-all placeholder:text-[#bfbfbf]"
            />

            {/* YouTube preview (when URL is provided) */}
            {youtubeUrl && (() => {
              const match = youtubeUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/)
              const videoId = match ? match[1] : null
              if (!videoId) return null
              return (
                <div className="mt-[8px] w-full max-w-[480px] aspect-video rounded-[8px] overflow-hidden bg-[#000] border border-[#e8eaef]">
                  <iframe
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title="YouTube video preview"
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )
            })()}
          </section>

          {/* ---------------------------------------------------------- */}
          {/*  5. Publish date/time range                                   */}
          {/* ---------------------------------------------------------- */}
          <section className="bg-white rounded-[12px] border border-[#e8eaef] p-[24px] flex flex-col gap-[16px]">
            <label className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
              {'\u0e01\u0e33\u0e2b\u0e19\u0e14\u0e0a\u0e48\u0e27\u0e07\u0e27\u0e31\u0e19\u0e40\u0e27\u0e25\u0e32\u0e40\u0e23\u0e34\u0e48\u0e21\u0e15\u0e49\u0e19-\u0e2a\u0e34\u0e49\u0e19\u0e2a\u0e38\u0e14 \u0e01\u0e32\u0e23\u0e40\u0e1c\u0e22\u0e41\u0e1e\u0e23\u0e48'} <span className="text-red-500">*</span>
            </label>

            {/* Start date + time */}
            <div className="flex flex-col gap-[8px]">
              <span className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#6b7280]">{'\u0e27\u0e31\u0e19\u0e40\u0e23\u0e34\u0e48\u0e21\u0e15\u0e49\u0e19'}</span>
              <div className="flex items-center gap-[12px]">
                {/* Date picker */}
                <div className="relative flex-1">
                  <button
                    type="button"
                    onClick={() => { closeAllPickers(); setShowStartCal(!showStartCal) }}
                    className={`
                      w-full flex items-center gap-[8px] border border-[#e8eaef] rounded-[8px]
                      px-[14px] py-[10px] bg-white cursor-pointer transition-all text-left
                      font-['IBM_Plex_Sans_Thai'] text-[14px]
                      ${showStartCal ? 'border-[#ff7e1b] ring-1 ring-[#ff7e1b]/20' : 'hover:border-[#d1d5db]'}
                      ${startDate ? 'text-[#1f2937]' : 'text-[#bfbfbf]'}
                    `}
                    aria-label="Select start date"
                  >
                    <CalendarIcon size={16} color="#6b7280" />
                    <span>{startDate ? formatDateDisplay(startDate) : 'dd/mm/yyyy'}</span>
                  </button>
                  {showStartCal && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowStartCal(false)} />
                      <CalendarPicker
                        selectedDate={startDate}
                        onSelect={setStartDate}
                        onClose={() => setShowStartCal(false)}
                      />
                    </>
                  )}
                </div>

                {/* Time picker */}
                <div className="relative w-[140px]">
                  <button
                    type="button"
                    onClick={() => { closeAllPickers(); setShowStartTime(!showStartTime) }}
                    className={`
                      w-full flex items-center gap-[8px] border border-[#e8eaef] rounded-[8px]
                      px-[14px] py-[10px] bg-white cursor-pointer transition-all text-left
                      font-['IBM_Plex_Sans_Thai'] text-[14px]
                      ${showStartTime ? 'border-[#ff7e1b] ring-1 ring-[#ff7e1b]/20' : 'hover:border-[#d1d5db]'}
                      ${startTime ? 'text-[#1f2937]' : 'text-[#bfbfbf]'}
                    `}
                    aria-label="Select start time"
                  >
                    <ClockIcon size={16} color="#6b7280" />
                    <span>{startTime || '00:00'}</span>
                  </button>
                  {showStartTime && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowStartTime(false)} />
                      <TimePickerDropdown
                        selectedTime={startTime}
                        onSelect={setStartTime}
                        onClose={() => setShowStartTime(false)}
                      />
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-[#e8eaef]" />

            {/* End date + time */}
            <div className="flex flex-col gap-[8px]">
              <span className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#6b7280]">{'\u0e27\u0e31\u0e19\u0e2a\u0e34\u0e49\u0e19\u0e2a\u0e38\u0e14'}</span>
              <div className="flex items-center gap-[12px]">
                {/* Date picker */}
                <div className="relative flex-1">
                  <button
                    type="button"
                    onClick={() => { closeAllPickers(); setShowEndCal(!showEndCal) }}
                    className={`
                      w-full flex items-center gap-[8px] border border-[#e8eaef] rounded-[8px]
                      px-[14px] py-[10px] bg-white cursor-pointer transition-all text-left
                      font-['IBM_Plex_Sans_Thai'] text-[14px]
                      ${showEndCal ? 'border-[#ff7e1b] ring-1 ring-[#ff7e1b]/20' : 'hover:border-[#d1d5db]'}
                      ${endDate ? 'text-[#1f2937]' : 'text-[#bfbfbf]'}
                    `}
                    aria-label="Select end date"
                  >
                    <CalendarIcon size={16} color="#6b7280" />
                    <span>{endDate ? formatDateDisplay(endDate) : 'dd/mm/yyyy'}</span>
                  </button>
                  {showEndCal && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowEndCal(false)} />
                      <CalendarPicker
                        selectedDate={endDate}
                        onSelect={setEndDate}
                        onClose={() => setShowEndCal(false)}
                      />
                    </>
                  )}
                </div>

                {/* Time picker */}
                <div className="relative w-[140px]">
                  <button
                    type="button"
                    onClick={() => { closeAllPickers(); setShowEndTime(!showEndTime) }}
                    className={`
                      w-full flex items-center gap-[8px] border border-[#e8eaef] rounded-[8px]
                      px-[14px] py-[10px] bg-white cursor-pointer transition-all text-left
                      font-['IBM_Plex_Sans_Thai'] text-[14px]
                      ${showEndTime ? 'border-[#ff7e1b] ring-1 ring-[#ff7e1b]/20' : 'hover:border-[#d1d5db]'}
                      ${endTime ? 'text-[#1f2937]' : 'text-[#bfbfbf]'}
                    `}
                    aria-label="Select end time"
                  >
                    <ClockIcon size={16} color="#6b7280" />
                    <span>{endTime || '00:00'}</span>
                  </button>
                  {showEndTime && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowEndTime(false)} />
                      <TimePickerDropdown
                        selectedTime={endTime}
                        onSelect={setEndTime}
                        onClose={() => setShowEndTime(false)}
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* ============================================================ */}
        {/*  Right sidebar - ENTRY panel                                  */}
        {/* ============================================================ */}
        <aside className="w-[260px] shrink-0 flex flex-col gap-[16px]">
          <div className="bg-white rounded-[12px] border border-[#e8eaef] p-[20px] flex flex-col gap-[16px]">
            <h3 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[12px] text-[#9ca3af] tracking-[0.8px] uppercase m-0">
              Entry
            </h3>

            {/* Status indicator */}
            <div className="flex items-center gap-[8px]">
              <span className="w-[8px] h-[8px] rounded-full bg-[#9ca3af]" />
              <span className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#6b7280]">
                สถานะ: ฉบับร่าง
              </span>
            </div>

            {/* Publish button */}
            <button
              type="button"
              onClick={() => handleSubmit(true)}
              disabled={isPending}
              className="w-full flex items-center justify-center px-[16px] py-[8px] rounded-[8px] bg-[#ff7e1b] text-white font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] border-0 cursor-pointer hover:bg-[#e56f15] transition-colors disabled:opacity-50"
            >
              {isPending ? 'กำลังบันทึก...' : 'เผยแพร่'}
            </button>

            {/* Save as draft button */}
            <button
              type="button"
              onClick={() => handleSubmit(false)}
              disabled={isPending}
              className="w-full flex items-center justify-center px-[16px] py-[8px] rounded-[8px] bg-white text-[#374151] font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] border border-[#e8eaef] cursor-pointer hover:bg-[#f9fafb] transition-colors disabled:opacity-50"
            >
              บันทึกฉบับร่าง
            </button>
          </div>
        </aside>
      </div>
    </div>
  )
}
