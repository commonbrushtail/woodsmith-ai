'use client'

import { useState, useTransition, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { updateProduct, syncProductVariationLinks } from '@/lib/actions/products'
import { useToast } from '@/lib/toast-context'
import { useFormErrors } from '@/lib/hooks/use-form-errors'
import RichTextEditor from '@/components/admin/RichTextEditor'
import ProductImageUploader from '@/components/admin/ProductImageUploader'
import VariationLinker from '@/components/admin/VariationLinker'
import CalendarPicker from '@/components/admin/CalendarPicker'
import TimePickerDropdown from '@/components/admin/TimePickerDropdown'

const typeOptions = [
  { value: 'construction', label: 'วัสดุก่อสร้าง' },
  { value: 'decoration', label: 'ผลิตภัณฑ์สำเร็จ' },
  { value: 'tool', label: 'เครื่องมือ' },
]

function ChevronLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 12L6 8L10 4" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function DotsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="19" r="1" />
    </svg>
  )
}

function ChevronDownIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6L8 10L12 6" />
    </svg>
  )
}

const inputCls = (hasError) =>
  `w-full font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border rounded-[8px] px-[14px] py-[10px] outline-none transition-all placeholder:text-[#bfbfbf] ${hasError ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/20' : 'border-[#e8eaef] focus:border-orange focus:ring-1 focus:ring-orange/20'}`

const selectCls = (hasError, disabled) =>
  `w-full font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border rounded-[8px] px-[14px] py-[10px] outline-none appearance-none bg-white cursor-pointer transition-all ${disabled ? 'bg-[#f9fafb] text-[#9ca3af]' : ''} ${hasError ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/20' : 'border-[#e8eaef] focus:border-orange focus:ring-1 focus:ring-orange/20'}`

function formatDateDisplay(dateStr) {
  if (!dateStr) return ''
  const [y, m, d] = dateStr.split('-')
  return `${d}/${m}/${Number(y) + 543}`
}

function parseISODate(isoStr) {
  if (!isoStr) return { date: '', time: '' }
  const dt = new Date(isoStr)
  if (isNaN(dt.getTime())) return { date: '', time: '' }
  const y = dt.getFullYear()
  const m = String(dt.getMonth() + 1).padStart(2, '0')
  const d = String(dt.getDate()).padStart(2, '0')
  const hh = String(dt.getHours()).padStart(2, '0')
  const mm = String(dt.getMinutes()).padStart(2, '0')
  return { date: `${y}-${m}-${d}`, time: `${hh}:${mm}` }
}

export default function ProductEditClient({ product, categories = [], variationGroups = [] }) {
  const { toast } = useToast()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const formErrors = useFormErrors()

  // Draft/Published tab
  const [activeTab, setActiveTab] = useState(product.published ? 'published' : 'draft')

  // Basic fields
  const [productName, setProductName] = useState(product.name || '')
  const [slug, setSlug] = useState(product.slug || '')
  const [productCode, setProductCode] = useState(product.code || '')
  const [productType, setProductType] = useState(product.type || '')
  const [productCategory, setProductCategory] = useState(product.category || '')
  const [recommended, setRecommended] = useState(product.recommended ? 'yes' : 'no')

  // Publish date range — parse from ISO strings
  const startParsed = parseISODate(product.publish_start)
  const endParsed = parseISODate(product.publish_end)
  const [startDate, setStartDate] = useState(startParsed.date)
  const [startTime, setStartTime] = useState(startParsed.time)
  const [endDate, setEndDate] = useState(endParsed.date)
  const [endTime, setEndTime] = useState(endParsed.time)
  const [showStartCal, setShowStartCal] = useState(false)
  const [showEndCal, setShowEndCal] = useState(false)
  const [showStartTime, setShowStartTime] = useState(false)
  const [showEndTime, setShowEndTime] = useState(false)

  // Images — edit mode (live upload/delete)
  const [existingImages, setExistingImages] = useState(
    (product.product_images || [])
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      .map(img => ({ id: img.id, url: img.url, is_primary: img.is_primary, sort_order: img.sort_order }))
  )

  // Variation links — initialize from existing product links
  const [variationLinks, setVariationLinks] = useState(() => {
    const links = product.product_variation_links || []
    return links.map(link => ({ group_id: link.group_id, entry_id: link.entry_id }))
  })

  // Rich text
  const [description, setDescription] = useState(product.description || '')
  const [characteristics, setCharacteristics] = useState(product.characteristics || '')
  const [specifications, setSpecifications] = useState(product.specifications?.raw || product.specifications || '')

  // Locale picker (visual only)
  const [showLocalePicker, setShowLocalePicker] = useState(false)

  // Cascading categories
  const categoryOptions = useMemo(() => {
    if (!productType) return []
    const parents = categories.filter(c => !c.parent_id && c.type === productType)
    const result = []
    for (const parent of parents) {
      result.push({ value: parent.name, label: parent.name, isParent: true })
      const children = categories.filter(c => c.parent_id === parent.id)
      for (const child of children) {
        result.push({ value: child.name, label: `  └ ${child.name}`, isParent: false })
      }
    }
    return result
  }, [productType, categories])

  const tabs = [
    { key: 'draft', label: 'DRAFT' },
    { key: 'published', label: 'PUBLISHED' },
  ]

  const handleSubmit = (publish) => {
    formErrors.clearAll()

    const errors = {}
    if (!productName.trim()) errors.name = 'กรุณากรอกชื่อสินค้า'
    if (!productCode.trim()) errors.code = 'กรุณากรอกรหัสสินค้า'
    if (!productType) errors.type = 'กรุณาเลือกประเภทสินค้า'
    if (!productCategory) errors.category = 'กรุณาเลือกหมวดหมู่สินค้า'
    if (Object.keys(errors).length > 0) {
      formErrors.setFieldErrors(errors)
      toast.error('กรุณากรอกข้อมูลที่จำเป็นให้ครบ')
      return
    }

    startTransition(async () => {
      const generatedSlug = slug || productName.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\u0E00-\u0E7Fa-z0-9-]/g, '')

      const formData = new FormData()
      formData.set('name', productName)
      formData.set('slug', generatedSlug)
      formData.set('code', productCode)
      formData.set('sku', productCode) // auto-set SKU = code
      formData.set('type', productType)
      formData.set('category', productCategory)
      formData.set('description', description)
      formData.set('characteristics', characteristics)
      formData.set('specifications', specifications)
      formData.set('published', String(publish))
      formData.set('recommended', recommended === 'yes' ? 'true' : 'false')

      // Publish date range
      if (startDate) {
        formData.set('publish_start', startTime ? `${startDate}T${startTime}:00` : `${startDate}T00:00:00`)
      }
      if (endDate) {
        formData.set('publish_end', endTime ? `${endDate}T${endTime}:00` : `${endDate}T23:59:59`)
      }

      const result = await updateProduct(product.id, formData)
      if (result.fieldErrors) {
        formErrors.setFieldErrors(result.fieldErrors)
        toast.error('กรุณาตรวจสอบข้อมูลอีกครั้ง')
        return
      }
      if (result.error) {
        toast.error('เกิดข้อผิดพลาด: ' + result.error)
        return
      }

      // Sync variation links
      const linkResult = await syncProductVariationLinks(product.id, variationLinks)
      if (linkResult.error) {
        toast.error('เกิดข้อผิดพลาดในการเชื่อมโยงตัวเลือก')
      }

      router.push('/admin/products')
    })
  }

  return (
    <div className="flex flex-col gap-0 h-full min-h-0">
      {/* Header */}
      <div className="flex items-center justify-between py-[12px]">
        <div className="flex items-center gap-[12px]">
          <Link
            href="/admin/products"
            className="flex items-center gap-[6px] font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#6b7280] no-underline hover:text-[#494c4f] transition-colors"
          >
            <ChevronLeftIcon />
            <span>กลับ</span>
          </Link>
          <h1 className="font-['IBM_Plex_Sans_Thai'] font-bold text-[22px] text-[#1f2937] m-0">
            แก้ไขสินค้า
          </h1>
          {product.published ? (
            <span className="inline-flex items-center px-[10px] py-[2px] rounded-full bg-[#22c55e]/10 font-['IBM_Plex_Sans_Thai'] text-[12px] font-medium text-[#22c55e] leading-[1.8]">
              Published
            </span>
          ) : (
            <span className="inline-flex items-center px-[10px] py-[2px] rounded-full bg-[#3b82f6]/10 font-['IBM_Plex_Sans_Thai'] text-[12px] font-medium text-[#3b82f6] leading-[1.8]">
              Draft
            </span>
          )}
        </div>

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
                  <button type="button" className="w-full text-left px-[14px] py-[10px] border-0 cursor-pointer bg-[#fff3e8] text-orange font-['IBM_Plex_Sans_Thai'] text-[13px]">Thai (th)</button>
                  <button type="button" className="w-full text-left px-[14px] py-[10px] border-0 cursor-pointer bg-transparent text-[#374151] hover:bg-[#f3f4f6] font-['IBM_Plex_Sans_Thai'] text-[13px]">English (en)</button>
                </div>
              </>
            )}
          </div>
          <button
            type="button"
            className="size-[32px] flex items-center justify-center rounded-[8px] hover:bg-gray-100 cursor-pointer bg-transparent border-0"
            aria-label="More options"
          >
            <DotsIcon />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-[#e5e7eb]" role="tablist">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab.key)}
              className={`relative px-[20px] py-[10px] font-['IBM_Plex_Sans_Thai'] font-semibold text-[13px] tracking-[0.5px] cursor-pointer bg-transparent border-0 transition-colors ${isActive ? 'text-orange' : 'text-[#9ca3af] hover:text-[#6b7280]'}`}
            >
              {tab.label}
              {isActive && <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-orange rounded-t-full" />}
            </button>
          )
        })}
      </div>

      {/* Content: main + sidebar */}
      <div className={`flex gap-[24px] mt-[20px] flex-1 min-h-0 overflow-y-auto pb-[32px] ${isPending ? 'opacity-60 pointer-events-none' : ''}`}>
        {/* Main form */}
        <div className="flex-1 flex flex-col gap-[24px] min-w-0">

          {/* 1. Image Upload (edit mode) */}
          <ProductImageUploader
            productId={product.id}
            existingImages={existingImages}
            onExistingImagesChange={setExistingImages}
          />

          {/* 2. Title / ชื่อสินค้า */}
          <section className="bg-white rounded-[12px] border border-[#e8eaef] p-[24px] flex flex-col gap-[8px]">
            <label htmlFor="productName" className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
              Title / ชื่อสินค้า <span className="text-red-500">*</span>
            </label>
            <input
              id="productName"
              type="text"
              value={productName}
              onChange={(e) => {
                const val = e.target.value
                setProductName(val)
                formErrors.clearError('name')
                const generated = val.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\u0E00-\u0E7Fa-z0-9-]/g, '')
                setSlug(generated)
              }}
              placeholder="กรอกชื่อสินค้า"
              className={inputCls(formErrors.getError('name'))}
            />
            {formErrors.getError('name') && <p className="text-red-500 text-[13px] font-['IBM_Plex_Sans_Thai'] mt-[2px]">{formErrors.getError('name')}</p>}
          </section>

          {/* 3. รหัสสินค้า */}
          <section className="bg-white rounded-[12px] border border-[#e8eaef] p-[24px] flex flex-col gap-[8px]">
            <label htmlFor="productCode" className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
              รหัสสินค้า <span className="text-red-500">*</span>
            </label>
            <input
              id="productCode"
              type="text"
              value={productCode}
              onChange={(e) => { setProductCode(e.target.value); formErrors.clearError('code') }}
              placeholder="กรอกรหัสสินค้า"
              className={inputCls(formErrors.getError('code'))}
            />
            {formErrors.getError('code') && <p className="text-red-500 text-[13px] font-['IBM_Plex_Sans_Thai'] mt-[2px]">{formErrors.getError('code')}</p>}
          </section>

          {/* 4. ประเภทสินค้า */}
          <section className="bg-white rounded-[12px] border border-[#e8eaef] p-[24px] flex flex-col gap-[8px]">
            <label htmlFor="productType" className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
              ประเภทสินค้า <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                id="productType"
                value={productType}
                onChange={(e) => { setProductType(e.target.value); setProductCategory(''); formErrors.clearError('type') }}
                className={selectCls(formErrors.getError('type'), false)}
              >
                <option value="" disabled>เลือกประเภทสินค้า</option>
                {typeOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="absolute right-[14px] top-1/2 -translate-y-1/2 pointer-events-none">
                <path d="M4 6L8 10L12 6" />
              </svg>
            </div>
            {formErrors.getError('type') && <p className="text-red-500 text-[13px] font-['IBM_Plex_Sans_Thai'] mt-[2px]">{formErrors.getError('type')}</p>}
          </section>

          {/* 5. หมวดหมู่สินค้า */}
          <section className="bg-white rounded-[12px] border border-[#e8eaef] p-[24px] flex flex-col gap-[8px]">
            <label htmlFor="productCategory" className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
              หมวดหมู่สินค้า <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                id="productCategory"
                value={productCategory}
                onChange={(e) => { setProductCategory(e.target.value); formErrors.clearError('category') }}
                disabled={!productType}
                className={selectCls(formErrors.getError('category'), !productType)}
              >
                <option value="" disabled>{productType ? 'เลือกหมวดหมู่สินค้า' : 'เลือกประเภทก่อน'}</option>
                {categoryOptions.map((opt, i) => (
                  <option key={`${opt.value}-${i}`} value={opt.value}>{opt.label}</option>
                ))}
                {/* Allow keeping current value if not in managed categories */}
                {productCategory && !categoryOptions.some(o => o.value === productCategory) && (
                  <option value={productCategory}>{productCategory} (ไม่ได้จัดการ)</option>
                )}
              </select>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="absolute right-[14px] top-1/2 -translate-y-1/2 pointer-events-none">
                <path d="M4 6L8 10L12 6" />
              </svg>
            </div>
            {formErrors.getError('category') && <p className="text-red-500 text-[13px] font-['IBM_Plex_Sans_Thai'] mt-[2px]">{formErrors.getError('category')}</p>}
          </section>

          {/* 6. กำหนดสินค้าแนะนำ */}
          <section className="bg-white rounded-[12px] border border-[#e8eaef] p-[24px] flex flex-col gap-[8px]">
            <label htmlFor="recommended" className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
              กำหนดสินค้าแนะนำ <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                id="recommended"
                value={recommended}
                onChange={(e) => setRecommended(e.target.value)}
                className={selectCls(false, false)}
              >
                <option value="" disabled>เลือก</option>
                <option value="no">ไม่แนะนำ</option>
                <option value="yes">แนะนำ</option>
              </select>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="absolute right-[14px] top-1/2 -translate-y-1/2 pointer-events-none">
                <path d="M4 6L8 10L12 6" />
              </svg>
            </div>
          </section>

          {/* 7. Publish date range */}
          <section className="bg-white rounded-[12px] border border-[#e8eaef] p-[24px] flex flex-col gap-[8px]">
            <label className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
              กำหนดช่วงวันเวลาเริ่มต้น-สิ้นสุด การเผยแพร่ <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-[12px]">
              {/* Start date */}
              <div className="relative flex-1">
                <button
                  type="button"
                  onClick={() => { setShowStartCal(!showStartCal); setShowEndCal(false) }}
                  className="w-full flex items-center gap-[8px] border border-[#e8eaef] rounded-[8px] px-[14px] py-[10px] bg-white cursor-pointer hover:border-[#d1d5db] transition-all text-left"
                >
                  <CalendarIcon />
                  <span className={`font-['IBM_Plex_Sans_Thai'] text-[14px] ${startDate ? 'text-[#1f2937]' : 'text-[#bfbfbf]'}`}>
                    {startDate ? formatDateDisplay(startDate) : ''}
                  </span>
                </button>
                {showStartCal && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowStartCal(false)} />
                    <CalendarPicker selectedDate={startDate} onSelect={setStartDate} onClose={() => setShowStartCal(false)} />
                  </>
                )}
              </div>

              {/* Start time */}
              <div className="relative w-[140px]">
                <button
                  type="button"
                  onClick={() => { setShowStartTime(!showStartTime); setShowEndTime(false) }}
                  className="w-full flex items-center gap-[8px] border border-[#e8eaef] rounded-[8px] px-[14px] py-[10px] bg-white cursor-pointer hover:border-[#d1d5db] transition-all text-left"
                >
                  <ClockIcon />
                  <span className={`font-['IBM_Plex_Sans_Thai'] text-[14px] ${startTime ? 'text-[#1f2937]' : 'text-[#bfbfbf]'}`}>
                    {startTime || '——'}
                  </span>
                </button>
                {showStartTime && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowStartTime(false)} />
                    <TimePickerDropdown selectedTime={startTime} onSelect={setStartTime} onClose={() => setShowStartTime(false)} />
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-[12px]">
              {/* End date */}
              <div className="relative flex-1">
                <button
                  type="button"
                  onClick={() => { setShowEndCal(!showEndCal); setShowStartCal(false) }}
                  className="w-full flex items-center gap-[8px] border border-[#e8eaef] rounded-[8px] px-[14px] py-[10px] bg-white cursor-pointer hover:border-[#d1d5db] transition-all text-left"
                >
                  <CalendarIcon />
                  <span className={`font-['IBM_Plex_Sans_Thai'] text-[14px] ${endDate ? 'text-[#1f2937]' : 'text-[#bfbfbf]'}`}>
                    {endDate ? formatDateDisplay(endDate) : ''}
                  </span>
                </button>
                {showEndCal && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowEndCal(false)} />
                    <CalendarPicker selectedDate={endDate} onSelect={setEndDate} onClose={() => setShowEndCal(false)} />
                  </>
                )}
              </div>

              {/* End time */}
              <div className="relative w-[140px]">
                <button
                  type="button"
                  onClick={() => { setShowEndTime(!showEndTime); setShowStartTime(false) }}
                  className="w-full flex items-center gap-[8px] border border-[#e8eaef] rounded-[8px] px-[14px] py-[10px] bg-white cursor-pointer hover:border-[#d1d5db] transition-all text-left"
                >
                  <ClockIcon />
                  <span className={`font-['IBM_Plex_Sans_Thai'] text-[14px] ${endTime ? 'text-[#1f2937]' : 'text-[#bfbfbf]'}`}>
                    {endTime || '——'}
                  </span>
                </button>
                {showEndTime && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowEndTime(false)} />
                    <TimePickerDropdown selectedTime={endTime} onSelect={setEndTime} onClose={() => setShowEndTime(false)} />
                  </>
                )}
              </div>
            </div>
          </section>

          {/* 8. Variations */}
          <VariationLinker
            allGroups={variationGroups}
            initialLinks={product.product_variation_links || []}
            onChange={setVariationLinks}
          />

          {/* 9. รายละเอียดสินค้า */}
          <section className="bg-white rounded-[12px] border border-[#e8eaef] p-[24px] flex flex-col gap-[8px]">
            <label className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
              รายละเอียดสินค้า <span className="text-red-500">*</span>
            </label>
            <RichTextEditor content={description} onChange={setDescription} minHeight={180} />
          </section>

          {/* 10. คุณลักษณะ/คุณสมบัติของสินค้า */}
          <section className="bg-white rounded-[12px] border border-[#e8eaef] p-[24px] flex flex-col gap-[8px]">
            <label className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
              คุณลักษณะ/คุณสมบัติของสินค้า
            </label>
            <RichTextEditor content={characteristics} onChange={setCharacteristics} minHeight={160} />
          </section>

          {/* 11. ข้อมูลจำเพาะ */}
          <section className="bg-white rounded-[12px] border border-[#e8eaef] p-[24px] flex flex-col gap-[8px]">
            <label className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
              ข้อมูลจำเพาะ
            </label>
            <RichTextEditor content={specifications} onChange={setSpecifications} minHeight={160} />
          </section>
        </div>

        {/* Sidebar */}
        <aside className="w-[260px] shrink-0">
          <div className="sticky top-0 bg-white rounded-[12px] border border-[#e8eaef] p-[20px] flex flex-col gap-[12px]">
            <h3 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[14px] text-[#1f2937] uppercase tracking-[0.5px] m-0">
              Entry
            </h3>
            <button
              type="button"
              onClick={() => handleSubmit(activeTab === 'published')}
              disabled={isPending}
              className="w-full font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-white bg-orange border-0 rounded-[8px] py-[10px] cursor-pointer hover:bg-[#e56f15] transition-colors disabled:opacity-50"
            >
              {isPending ? 'กำลังบันทึก...' : 'บันทึก'}
            </button>
            <button
              type="button"
              onClick={() => handleSubmit(false)}
              disabled={isPending}
              className="w-full font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#494c4f] bg-white border border-[#e8eaef] rounded-[8px] py-[10px] cursor-pointer hover:bg-[#f3f4f6] transition-colors disabled:opacity-50"
            >
              บันทึก
            </button>
          </div>
        </aside>
      </div>
    </div>
  )
}
