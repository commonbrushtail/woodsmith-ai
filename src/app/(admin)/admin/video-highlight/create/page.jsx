'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createVideoHighlight } from '@/lib/actions/video-highlights'
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

function ChevronDownIcon({ size = 16, color = '#6b7280' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6L8 10L12 6" />
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

function ChevronLeftSmall({ size = 14, color = '#6b7280' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11L5 7L9 3" />
    </svg>
  )
}

function ChevronRightSmall({ size = 14, color = '#6b7280' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 3L9 7L5 11" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="24" fill="#cc0000" />
      <path d="M19 15L35 24L19 33V15Z" fill="white" />
    </svg>
  )
}

function CloseIcon({ size = 16, color = '#6b7280' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 4L4 12" />
      <path d="M4 4L12 12" />
    </svg>
  )
}

function CopyIcon({ size = 14, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  Calendar widget                                                    */
/* ------------------------------------------------------------------ */

function CalendarWidget({ selectedDay, onSelectDay }) {
  const daysOfWeek = ['จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.', 'อา.']

  /* October 2025 starts on Wednesday (index 2) */
  const daysInMonth = 31
  const startOffset = 2

  const weeks = []
  let currentDay = 1
  let firstWeek = true

  while (currentDay <= daysInMonth) {
    const week = []
    for (let i = 0; i < 7; i++) {
      if (firstWeek && i < startOffset) {
        week.push(null)
      } else if (currentDay <= daysInMonth) {
        week.push(currentDay)
        currentDay++
      } else {
        week.push(null)
      }
    }
    weeks.push(week)
    firstWeek = false
  }

  return (
    <div className="bg-white border border-[#e5e7eb] rounded-[8px] p-[16px] w-[280px]">
      {/* Month header */}
      <div className="flex items-center justify-between mb-[12px]">
        <button
          type="button"
          className="size-[28px] flex items-center justify-center rounded-[4px] hover:bg-[#f3f4f6] cursor-pointer bg-transparent border-0"
          aria-label="Previous month"
        >
          <ChevronLeftSmall />
        </button>
        <span className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-semibold text-[#1f2937]">
          {'\u0e15\u0e38\u0e25\u0e32\u0e04\u0e21 2025'}
        </span>
        <button
          type="button"
          className="size-[28px] flex items-center justify-center rounded-[4px] hover:bg-[#f3f4f6] cursor-pointer bg-transparent border-0"
          aria-label="Next month"
        >
          <ChevronRightSmall />
        </button>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 gap-0 mb-[4px]">
        {daysOfWeek.map((d) => (
          <div
            key={d}
            className="flex items-center justify-center h-[28px] font-['IBM_Plex_Sans_Thai'] text-[11px] font-medium text-[#9ca3af]"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="flex flex-col gap-0">
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 gap-0">
            {week.map((day, di) => {
              if (day === null) {
                return <div key={di} className="h-[32px]" />
              }
              const isSelected = day === selectedDay
              return (
                <button
                  key={di}
                  type="button"
                  onClick={() => onSelectDay(day)}
                  className={`h-[32px] flex items-center justify-center rounded-full font-['IBM_Plex_Sans_Thai'] text-[13px] border-0 cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-[#ff7e1b] text-white font-semibold'
                      : 'bg-transparent text-[#374151] hover:bg-[#f3f4f6]'
                  }`}
                >
                  {day}
                </button>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Video embed panel                                                  */
/* ------------------------------------------------------------------ */

function VideoEmbedPanel({ embedCode, onClose }) {
  return (
    <div className="bg-white border border-[#e5e7eb] rounded-[8px] flex flex-col overflow-hidden flex-1 min-w-0">
      {/* Panel header */}
      <div className="flex items-center justify-between px-[16px] py-[12px] border-b border-[#e5e7eb]">
        <span className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-semibold text-[#1f2937]">
          {'\u0e1d\u0e31\u0e07\u0e27\u0e34\u0e14\u0e35\u0e42\u0e2d'}
        </span>
        <button
          type="button"
          onClick={onClose}
          className="size-[28px] flex items-center justify-center rounded-[4px] hover:bg-[#f3f4f6] cursor-pointer bg-transparent border-0"
          aria-label="Close embed panel"
        >
          <CloseIcon size={16} color="#6b7280" />
        </button>
      </div>

      {/* Embed code textarea */}
      <div className="px-[16px] py-[12px] flex flex-col gap-[12px]">
        <textarea
          readOnly
          value={embedCode}
          className="w-full h-[80px] border border-[#e5e7eb] rounded-[6px] px-[12px] py-[10px] font-mono text-[12px] text-[#374151] bg-[#fafafa] resize-none outline-none focus:border-[#ff7e1b] focus:ring-1 focus:ring-[#ff7e1b]/20"
          aria-label="Embed code"
        />

        {/* Start time checkbox */}
        <label className="flex items-center gap-[8px] cursor-pointer">
          <input
            type="checkbox"
            defaultChecked
            className="size-[16px] rounded-[3px] border-[#d1d5db] accent-[#ff7e1b] cursor-pointer"
          />
          <span className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#374151]">
            {'\u0e40\u0e23\u0e34\u0e48\u0e21\u0e17\u0e35\u0e48 0:13'}
          </span>
        </label>

        {/* Options label */}
        <span className="font-['IBM_Plex_Sans_Thai'] text-[12px] text-[#9ca3af]">
          {'\u0e04\u0e33\u0e40\u0e25\u0e37\u0e2d\u0e01\u0e01\u0e32\u0e23\u0e1d\u0e31\u0e07'}
        </span>

        {/* Copy button */}
        <button
          type="button"
          className="self-start inline-flex items-center gap-[6px] px-[14px] py-[7px] rounded-[6px] border border-[#e5e7eb] bg-white font-['IBM_Plex_Sans_Thai'] text-[13px] font-medium text-[#374151] cursor-pointer hover:bg-[#f9fafb] transition-colors"
        >
          <CopyIcon size={14} color="#6b7280" />
          {'\u0e04\u0e31\u0e14\u0e25\u0e2d\u0e01'}
        </button>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main page component                                                */
/* ------------------------------------------------------------------ */

export default function VideoHighlightCreatePage() {
  const { toast } = useToast()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [activeTab, setActiveTab] = useState('draft')
  const [title, setTitle] = useState('')
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [category, setCategory] = useState('')
  const [highlightType, setHighlightType] = useState('')
  const [selectedDay, setSelectedDay] = useState(28)
  const [selectedTime, setSelectedTime] = useState('00:00')
  const [showCalendar, setShowCalendar] = useState(true)

  const handleSubmit = (publish) => {
    if (!title.trim()) { toast.error('กรุณากรอกชื่อไฮไลท์'); return }

    startTransition(async () => {
      const formData = new FormData()
      formData.set('title', title)
      formData.set('youtube_url', youtubeUrl)
      formData.set('published', publish ? 'true' : 'false')

      const result = await createVideoHighlight(formData)
      if (result.error) {
        toast.error('เกิดข้อผิดพลาด: ' + result.error)
      } else {
        router.push('/admin/video-highlight')
        router.refresh()
      }
    })
  }

  const tabs = [
    { key: 'draft', label: 'DRAFT' },
    { key: 'published', label: 'PUBLISHED' },
  ]

  const timeOptions = ['00:00', '00:15', '00:30', '00:45']

  const sampleEmbedCode = '<iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ?start=13" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>'

  return (
    <div className={`flex flex-col gap-0 h-full min-h-0 ${isPending ? 'opacity-60 pointer-events-none' : ''}`}>
      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-between py-[12px]">
        {/* Left: back link + title + badge */}
        <div className="flex items-center gap-[12px]">
          <Link
            href="/admin/video-highlight"
            className="flex items-center gap-[6px] font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#6b7280] no-underline hover:text-[#494c4f] transition-colors"
          >
            <ChevronLeftIcon size={16} />
            <span>{'\u0e01\u0e25\u0e31\u0e1a'}</span>
          </Link>

          <h1 className="font-['IBM_Plex_Sans_Thai'] font-bold text-[22px] text-[#1f2937] m-0">
            {'\u0e27\u0e34\u0e14\u0e35\u0e42\u0e2d\u0e44\u0e2e\u0e44\u0e25\u0e17\u0e4c (Video Highlight)'}
          </h1>

          <span className="inline-flex items-center px-[10px] py-[2px] rounded-full border border-[#3b82f6]/40 bg-[#3b82f6]/5 font-['IBM_Plex_Sans_Thai'] text-[12px] font-medium text-[#3b82f6] leading-[1.8]">
            Draft
          </span>
        </div>

        {/* Right: locale selector + 3-dot menu */}
        <div className="flex items-center gap-[8px]">
          <div className="flex items-center gap-[8px] border border-[#e5e7eb] rounded-[8px] px-[12px] py-[6px] cursor-pointer hover:bg-[#f9fafb]">
            <span className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#4b5563]">Thai (th)</span>
            <ChevronDownIcon size={12} color="#6b7280" />
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

      {/* ── Tab navigation ──────────────────────────────────────── */}
      <div className="flex gap-0 border-b border-[#e5e7eb]" role="tablist" aria-label="Content status tabs">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab.key)}
              className={`relative px-[20px] py-[10px] font-['IBM_Plex_Sans_Thai'] font-semibold text-[13px] tracking-[0.5px] cursor-pointer bg-transparent border-0 transition-colors ${
                isActive ? 'text-[#ff7e1b]' : 'text-[#9ca3af] hover:text-[#6b7280]'
              }`}
            >
              {tab.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#ff7e1b] rounded-t-full" />
              )}
            </button>
          )
        })}
      </div>

      {/* ── Content body (scrollable) ───────────────────────────── */}
      <div className="flex gap-[24px] mt-[20px] flex-1 min-h-0 overflow-y-auto pb-[32px]">
        {/* ── Main form area ──────────────────────────────────────── */}
        <div className="flex-1 flex flex-col gap-[24px] min-w-0">

          {/* Field 1: Title */}
          <div className="flex flex-col gap-[8px]">
            <label
              htmlFor="videoTitle"
              className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]"
            >
              {'Title / \u0e0a\u0e37\u0e48\u0e2d\u0e44\u0e2e\u0e44\u0e25\u0e17\u0e4c'} <span className="text-red-500">*</span>
            </label>
            <input
              id="videoTitle"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border border-[#e5e7eb] rounded-[8px] px-[14px] py-[10px] outline-none focus:border-[#ff7e1b] focus:ring-1 focus:ring-[#ff7e1b]/20 transition-all placeholder:text-[#bfbfbf] bg-white"
            />
          </div>

          {/* Field 2: Category */}
          <div className="flex flex-col gap-[8px]">
            <label
              htmlFor="videoCategory"
              className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]"
            >
              {'\u0e2b\u0e21\u0e27\u0e14\u0e2b\u0e21\u0e39\u0e48'} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                id="videoCategory"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border border-[#e5e7eb] rounded-[8px] px-[14px] py-[10px] outline-none w-full appearance-none bg-white cursor-pointer focus:border-[#ff7e1b] focus:ring-1 focus:ring-[#ff7e1b]/20 transition-all"
              >
                <option value="" disabled className="text-[#bfbfbf]">
                  {'\u0e40\u0e25\u0e37\u0e2d\u0e01\u0e2b\u0e21\u0e27\u0e14\u0e2b\u0e21\u0e39\u0e48'}
                </option>
                <option value="interview">{'\u0e2a\u0e31\u0e21\u0e20\u0e32\u0e29\u0e13\u0e4c'}</option>
                <option value="product">{'\u0e2a\u0e34\u0e19\u0e04\u0e49\u0e32'}</option>
                <option value="event">{'\u0e01\u0e34\u0e08\u0e01\u0e23\u0e23\u0e21'}</option>
                <option value="howto">{'\u0e27\u0e34\u0e18\u0e35\u0e43\u0e0a\u0e49\u0e07\u0e32\u0e19'}</option>
              </select>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="#6b7280"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="absolute right-[14px] top-1/2 -translate-y-1/2 pointer-events-none"
              >
                <path d="M4 6L8 10L12 6" />
              </svg>
            </div>
          </div>

          {/* Field 3: Video clip */}
          <div className="flex flex-col gap-[8px]">
            <label className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
              {'\u0e04\u0e25\u0e34\u0e1b\u0e27\u0e34\u0e14\u0e35\u0e42\u0e2d'} <span className="text-red-500">*</span>
            </label>

            <div className="flex gap-[16px]">
              {/* Left: Video preview placeholder */}
              <div className="relative w-[360px] shrink-0 aspect-video rounded-[8px] overflow-hidden bg-[#1a1a1a] flex items-center justify-center">
                {/* Simulated interview thumbnail */}
                <div className="absolute inset-0">
                  {/* Background scene - person silhouette area */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#2a2520] via-[#1a1a1a] to-[#252018]" />
                  {/* Simulated person shape - upper body silhouette */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120px] h-[140px] bg-[#2d2825] rounded-t-[60px]" />
                  {/* Head */}
                  <div className="absolute bottom-[120px] left-1/2 -translate-x-1/2 w-[50px] h-[55px] bg-[#3a3530] rounded-full" />
                  {/* Warm light accents */}
                  <div className="absolute top-[20%] left-[15%] w-[40px] h-[40px] rounded-full bg-[#ff7e1b]/8 blur-[12px]" />
                  <div className="absolute top-[30%] right-[20%] w-[30px] h-[30px] rounded-full bg-[#ff7e1b]/6 blur-[10px]" />
                </div>

                {/* WoodSmith logo corner */}
                <div className="absolute top-[10px] right-[10px] z-10">
                  <div className="bg-[#ff7e1b]/90 rounded-[4px] px-[6px] py-[2px]">
                    <span className="font-['IBM_Plex_Sans_Thai'] text-[8px] font-bold text-white tracking-[0.5px]">
                      WOODSMITH
                    </span>
                  </div>
                </div>

                {/* Play button overlay */}
                <div className="relative z-10 cursor-pointer opacity-90 hover:opacity-100 transition-opacity">
                  <PlayIcon />
                </div>

                {/* YouTube progress bar */}
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#404040] z-10">
                  <div className="h-full w-[15%] bg-[#cc0000]" />
                </div>
              </div>

              {/* Right: Embed video panel */}
              <VideoEmbedPanel
                embedCode={sampleEmbedCode}
                onClose={() => {}}
              />
            </div>
          </div>

          {/* Field 4: Highlight recommendation */}
          <div className="flex flex-col gap-[8px]">
            <label
              htmlFor="highlightType"
              className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]"
            >
              {'\u0e01\u0e33\u0e2b\u0e19\u0e14\u0e44\u0e2e\u0e44\u0e25\u0e17\u0e4c\u0e41\u0e19\u0e30\u0e19\u0e33'} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                id="highlightType"
                value={highlightType}
                onChange={(e) => setHighlightType(e.target.value)}
                className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border border-[#e5e7eb] rounded-[8px] px-[14px] py-[10px] outline-none w-full appearance-none bg-white cursor-pointer focus:border-[#ff7e1b] focus:ring-1 focus:ring-[#ff7e1b]/20 transition-all"
              >
                <option value="" disabled className="text-[#bfbfbf]">
                  {'\u0e40\u0e25\u0e37\u0e2d\u0e01'}
                </option>
                <option value="featured">{'\u0e41\u0e19\u0e30\u0e19\u0e33\u0e2b\u0e19\u0e49\u0e32\u0e41\u0e23\u0e01'}</option>
                <option value="popular">{'\u0e22\u0e2d\u0e14\u0e19\u0e34\u0e22\u0e21'}</option>
                <option value="latest">{'\u0e25\u0e48\u0e32\u0e2a\u0e38\u0e14'}</option>
              </select>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="#6b7280"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="absolute right-[14px] top-1/2 -translate-y-1/2 pointer-events-none"
              >
                <path d="M4 6L8 10L12 6" />
              </svg>
            </div>
          </div>

          {/* Field 5: Publish date-time range */}
          <div className="flex flex-col gap-[8px]">
            <label className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
              {'\u0e01\u0e33\u0e2b\u0e19\u0e14\u0e0a\u0e48\u0e27\u0e07\u0e27\u0e31\u0e19\u0e40\u0e27\u0e25\u0e32\u0e40\u0e23\u0e34\u0e48\u0e21\u0e15\u0e49\u0e19-\u0e2a\u0e34\u0e49\u0e19\u0e2a\u0e38\u0e14 \u0e01\u0e32\u0e23\u0e40\u0e1c\u0e22\u0e41\u0e1e\u0e23\u0e48'} <span className="text-red-500">*</span>
            </label>

            <div className="flex items-start gap-[16px]">
              {/* Calendar */}
              <CalendarWidget
                selectedDay={selectedDay}
                onSelectDay={setSelectedDay}
              />

              {/* Time selection */}
              <div className="flex flex-col gap-[8px]">
                <span className="font-['IBM_Plex_Sans_Thai'] text-[13px] font-medium text-[#6b7280]">
                  {'\u0e40\u0e27\u0e25\u0e32'}
                </span>
                <div className="relative">
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border border-[#e5e7eb] rounded-[8px] pl-[36px] pr-[14px] py-[10px] outline-none w-[140px] appearance-none bg-white cursor-pointer focus:border-[#ff7e1b] focus:ring-1 focus:ring-[#ff7e1b]/20 transition-all"
                    aria-label="Select time"
                  >
                    {timeOptions.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <div className="absolute left-[12px] top-1/2 -translate-y-1/2 pointer-events-none">
                    <ClockIcon size={16} color="#9ca3af" />
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
                    className="absolute right-[10px] top-1/2 -translate-y-1/2 pointer-events-none"
                  >
                    <path d="M4 6L8 10L12 6" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right sidebar (ENTRY panel) ──────────────────────── */}
        <aside className="w-[260px] shrink-0 flex flex-col gap-[16px]">
          <div className="bg-white rounded-[12px] border border-[#e5e7eb] p-[20px] flex flex-col gap-[16px]">
            <h3 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[12px] text-[#9ca3af] tracking-[0.8px] uppercase m-0">
              Entry
            </h3>

            {/* Publish button */}
            <div className="flex items-center gap-[8px]">
              <button
                type="button"
                onClick={() => handleSubmit(true)}
                disabled={isPending}
                className="flex-1 flex items-center justify-center gap-[6px] px-[16px] py-[8px] rounded-[8px] bg-[#ff7e1b] text-white font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] border-0 cursor-pointer hover:bg-[#e56f15] transition-colors disabled:opacity-50"
              >
                {isPending ? 'กำลังบันทึก...' : 'เผยแพร่'}
              </button>
            </div>

            {/* Save button */}
            <button
              type="button"
              onClick={() => handleSubmit(false)}
              disabled={isPending}
              className="w-full flex items-center justify-center px-[16px] py-[8px] rounded-[8px] bg-white text-[#374151] font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] border border-[#e5e7eb] cursor-pointer hover:bg-[#f9fafb] transition-colors disabled:opacity-50"
            >
              {'บันทึก'}
            </button>
          </div>
        </aside>
      </div>
    </div>
  )
}
