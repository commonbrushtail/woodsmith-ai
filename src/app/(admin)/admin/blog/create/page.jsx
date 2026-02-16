'use client'

import { useState, useRef, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createBlogPost } from '@/lib/actions/blog'
import { useToast } from '@/lib/toast-context'
import { useFormErrors } from '@/lib/hooks/use-form-errors'
import { validateFile, ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE } from '@/lib/upload-validation'
import RichTextEditor from '@/components/admin/RichTextEditor'
import CalendarPicker from '@/components/admin/CalendarPicker'
import TimePickerDropdown from '@/components/admin/TimePickerDropdown'

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

/* ------------------------------------------------------------------ */
/*  Upload drop-zone                                                   */
/* ------------------------------------------------------------------ */

function UploadDropZone({ onFilesSelected }) {
  const fileInputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files?.length && onFilesSelected) {
      onFilesSelected(Array.from(e.dataTransfer.files))
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

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
        multiple
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
/*  Recommendation select with popout                                  */
/* ------------------------------------------------------------------ */

function RecommendationSelect({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false)

  const options = [
    { value: 'no', label: 'ไม่แนะนำ' },
    { value: 'yes', label: 'แนะนำ' },
  ]

  const selectedLabel = options.find((o) => o.value === value)?.label || ''

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full flex items-center justify-between border border-[#e8eaef] rounded-[8px]
          px-[14px] py-[10px] bg-white cursor-pointer transition-all
          font-['IBM_Plex_Sans_Thai'] text-[14px] text-left
          ${isOpen ? 'border-[#ff7e1b] ring-1 ring-[#ff7e1b]/20' : 'hover:border-[#d1d5db]'}
          ${value ? 'text-[#1f2937]' : 'text-[#bfbfbf]'}
        `}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>{value ? selectedLabel : 'เลือก'}</span>
        <ChevronDownIcon size={14} color="#6b7280" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 right-0 mt-[4px] z-50 bg-white border border-[#e8eaef] rounded-[8px] shadow-lg overflow-hidden">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => { onChange(option.value); setIsOpen(false) }}
                className={`
                  w-full text-left px-[14px] py-[10px] border-0 cursor-pointer transition-colors
                  font-['IBM_Plex_Sans_Thai'] text-[14px]
                  ${value === option.value
                    ? 'bg-[#fff3e8] text-[#ff7e1b]'
                    : 'bg-transparent text-[#374151] hover:bg-[#f3f4f6]'
                  }
                `}
                role="option"
                aria-selected={value === option.value}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main page component                                                */
/* ------------------------------------------------------------------ */

export default function BlogCreatePage() {
  const { toast } = useToast()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const formErrors = useFormErrors()

  /* ---- Form state ---- */
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [content, setContent] = useState('')
  const [recommendation, setRecommendation] = useState('')
  const [startDate, setStartDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endDate, setEndDate] = useState('')
  const [endTime, setEndTime] = useState('')
  const [images, setImages] = useState([])
  const [coverFile, setCoverFile] = useState(null)

  /* ---- Picker visibility ---- */
  const [showStartCal, setShowStartCal] = useState(false)
  const [showEndCal, setShowEndCal] = useState(false)
  const [showStartTime, setShowStartTime] = useState(false)
  const [showEndTime, setShowEndTime] = useState(false)
  const [showLocalePicker, setShowLocalePicker] = useState(false)

  /* ---- Derived values ---- */
  const TITLE_MAX = 120
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0
  const charCount = content.length

  const handleImageUpload = (files) => {
    if (images.length + files.length > 5) return
    const validFiles = files.filter((f) => {
      const check = validateFile(f, { allowedTypes: ALLOWED_IMAGE_TYPES, maxSize: MAX_IMAGE_SIZE })
      if (!check.valid) { toast.error(`${f.name}: ${check.error}`); return false }
      return true
    })
    if (validFiles.length === 0) return
    const newImages = validFiles.map((f) => ({
      id: Date.now() + Math.random(),
      name: f.name,
      url: URL.createObjectURL(f),
      file: f,
    }))
    setImages((prev) => [...prev, ...newImages])
    if (!coverFile && files.length > 0) setCoverFile(files[0])
  }

  const removeImage = (id) => {
    setImages((prev) => {
      const remaining = prev.filter((img) => img.id !== id)
      if (remaining.length === 0) setCoverFile(null)
      return remaining
    })
  }

  const handleSubmit = (publish) => {
    formErrors.clearAll()

    const errors = {}
    if (!title.trim()) errors.title = 'กรุณากรอกชื่อบทความ'
    if (!content.trim()) errors.content = 'กรุณากรอกเนื้อหาบทความ'
    if (Object.keys(errors).length > 0) {
      formErrors.setFieldErrors(errors)
      toast.error('กรุณากรอกข้อมูลที่จำเป็นให้ครบ')
      return
    }

    startTransition(async () => {
      const formData = new FormData()
      formData.set('title', title)
      formData.set('content', content)
      formData.set('recommended', recommendation === 'yes' ? 'true' : 'false')
      formData.set('published', publish ? 'true' : 'false')

      if (startDate) {
        const publishDate = startTime ? `${startDate}T${startTime}:00` : `${startDate}T00:00:00`
        formData.set('publish_date', publishDate)
      }

      if (coverFile) {
        formData.set('cover_image', coverFile)
      }

      const result = await createBlogPost(formData)
      if (result.fieldErrors) {
        formErrors.setFieldErrors(result.fieldErrors)
        toast.error('กรุณาตรวจสอบข้อมูลอีกครั้ง')
      } else if (result.error) {
        toast.error('เกิดข้อผิดพลาด: ' + result.error)
      } else {
        router.push('/admin/blog')
        router.refresh()
      }
    })
  }

  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return ''
    const [y, m, d] = dateStr.split('-')
    return `${d}/${m}/${Number(y) + 543}`
  }

  return (
    <div className="flex flex-col gap-0 h-full min-h-0">
      {/* ================================================================ */}
      {/*  Header                                                          */}
      {/* ================================================================ */}
      <div className="flex items-center justify-between py-[12px]">
        {/* Left: back + title + badge */}
        <div className="flex items-center gap-[12px]">
          <Link
            href="/admin/blog"
            className="flex items-center gap-[6px] font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#6b7280] no-underline hover:text-[#494c4f] transition-colors"
          >
            <ChevronLeftIcon size={16} color="currentColor" />
            <span>กลับ</span>
          </Link>

          <h1 className="font-['IBM_Plex_Sans_Thai'] font-bold text-[22px] text-[#1f2937] m-0">
            บทความ (Blog)
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
              Image / รูปภาพ (Min 1-Max 5 file) <span className="text-red-500">*</span>
            </label>

            {/* Uploaded images preview */}
            {images.length > 0 && (
              <div className="flex items-start gap-[12px] flex-wrap">
                {images.map((img) => (
                  <div key={img.id} className="relative w-[120px] h-[90px] rounded-[8px] overflow-hidden bg-[#f3f4f6]">
                    <img
                      src={img.url}
                      alt={img.name}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(img.id)}
                      className="absolute top-[4px] right-[4px] size-[20px] bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center border-0 cursor-pointer z-10 transition-colors"
                      aria-label={`Remove ${img.name}`}
                    >
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round">
                        <path d="M2 2L8 8M8 2L2 8" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload zone (show only if under 5 images) */}
            {images.length < 5 && (
              <UploadDropZone onFilesSelected={handleImageUpload} />
            )}
          </section>

          {/* ---------------------------------------------------------- */}
          {/*  2. Title                                                    */}
          {/* ---------------------------------------------------------- */}
          <section className="bg-white rounded-[12px] border border-[#e8eaef] p-[24px] flex flex-col gap-[8px]">
            <label htmlFor="blogTitle" className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
              Title / ชื่อบทความ <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="blogTitle"
                type="text"
                value={title}
                onChange={(e) => {
                  if (e.target.value.length <= TITLE_MAX) setTitle(e.target.value)
                  formErrors.clearError('title')
                }}
                maxLength={TITLE_MAX}
                placeholder="กรอกชื่อบทความ"
                className={`w-full font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border rounded-[8px] px-[14px] py-[10px] outline-none transition-all placeholder:text-[#bfbfbf] ${formErrors.getError('title') ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/20' : 'border-[#e8eaef] focus:border-[#ff7e1b] focus:ring-1 focus:ring-[#ff7e1b]/20'}`}
              />
              {formErrors.getError('title') && <p className="text-red-500 text-[13px] font-['IBM_Plex_Sans_Thai'] mt-[2px]">{formErrors.getError('title')}</p>}
            </div>
            <span className="font-['IBM_Plex_Sans_Thai'] text-[12px] text-[#9ca3af] self-end">
              {title.length}/{TITLE_MAX}
            </span>
          </section>

          {/* ---------------------------------------------------------- */}
          {/*  3. Category                                                 */}
          {/* ---------------------------------------------------------- */}
          <section className="bg-white rounded-[12px] border border-[#e8eaef] p-[24px] flex flex-col gap-[8px]">
            <label htmlFor="blogCategory" className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
              หมวดหมู่ <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                id="blogCategory"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`
                  w-full font-['IBM_Plex_Sans_Thai'] text-[14px] border border-[#e8eaef] rounded-[8px]
                  px-[14px] py-[10px] outline-none appearance-none bg-white cursor-pointer
                  focus:border-[#ff7e1b] focus:ring-1 focus:ring-[#ff7e1b]/20 transition-all
                  ${category ? 'text-[#1f2937]' : 'text-[#bfbfbf]'}
                `}
              >
                <option value="" disabled>เลือกหมวดหมู่</option>
                <option value="news">ข่าวสาร</option>
                <option value="knowledge">ความรู้</option>
                <option value="promotion">โปรโมชั่น</option>
                <option value="inspiration">แรงบันดาลใจ</option>
              </select>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="absolute right-[14px] top-1/2 -translate-y-1/2 pointer-events-none">
                <path d="M4 6L8 10L12 6" />
              </svg>
            </div>
          </section>

          {/* ---------------------------------------------------------- */}
          {/*  4. Rich text editor                                         */}
          {/* ---------------------------------------------------------- */}
          <section className="bg-white rounded-[12px] border border-[#e8eaef] p-[24px] flex flex-col gap-[8px]">
            <label htmlFor="blogContent" className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
              รายละเอียดบทความ <span className="text-red-500">*</span>
            </label>
            <RichTextEditor
              content={content}
              onChange={(val) => { setContent(val); formErrors.clearError('content') }}
              minHeight={200}
            />
            {formErrors.getError('content') && <p className="text-red-500 text-[13px] font-['IBM_Plex_Sans_Thai'] mt-[2px]">{formErrors.getError('content')}</p>}
            <div className="flex items-center gap-[16px] self-end">
              <span className="font-['IBM_Plex_Sans_Thai'] text-[12px] text-[#9ca3af]">
                คำ: {wordCount}
              </span>
              <span className="font-['IBM_Plex_Sans_Thai'] text-[12px] text-[#9ca3af]">
                ตัวอักษร: {charCount}
              </span>
            </div>
          </section>

          {/* ---------------------------------------------------------- */}
          {/*  5. Recommendation                                           */}
          {/* ---------------------------------------------------------- */}
          <section className="bg-white rounded-[12px] border border-[#e8eaef] p-[24px] flex flex-col gap-[8px]">
            <label className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
              กำหนดบทความแนะนำ <span className="text-red-500">*</span>
            </label>
            <RecommendationSelect value={recommendation} onChange={setRecommendation} />
          </section>

          {/* ---------------------------------------------------------- */}
          {/*  6. Publish date/time range                                   */}
          {/* ---------------------------------------------------------- */}
          <section className="bg-white rounded-[12px] border border-[#e8eaef] p-[24px] flex flex-col gap-[16px]">
            <label className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
              กำหนดช่วงวันเวลาเริ่มต้น-สิ้นสุด การเผยแพร่
            </label>
            {(startDate || startTime || endDate || endTime) && (
              <button
                type="button"
                onClick={() => { setStartDate(null); setStartTime(''); setEndDate(null); setEndTime('') }}
                className="self-start font-['IBM_Plex_Sans_Thai'] text-[12px] text-[#6b7280] hover:text-red-500 bg-transparent border-0 cursor-pointer transition-colors p-0"
              >
                ล้างค่า
              </button>
            )}

            {/* Start date + time */}
            <div className="flex flex-col gap-[8px]">
              <span className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#6b7280]">วันเริ่มต้น</span>
              <div className="flex items-center gap-[12px]">
                {/* Date picker */}
                <div className="relative flex-1">
                  <button
                    type="button"
                    onClick={() => { setShowStartCal(!showStartCal); setShowEndCal(false); setShowStartTime(false); setShowEndTime(false) }}
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
                    onClick={() => { setShowStartTime(!showStartTime); setShowStartCal(false); setShowEndCal(false); setShowEndTime(false) }}
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
              <span className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#6b7280]">วันสิ้นสุด</span>
              <div className="flex items-center gap-[12px]">
                {/* Date picker */}
                <div className="relative flex-1">
                  <button
                    type="button"
                    onClick={() => { setShowEndCal(!showEndCal); setShowStartCal(false); setShowStartTime(false); setShowEndTime(false) }}
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
                    onClick={() => { setShowEndTime(!showEndTime); setShowStartCal(false); setShowEndCal(false); setShowStartTime(false) }}
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
