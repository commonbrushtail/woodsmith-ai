'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createProduct } from '@/lib/actions/products'
import { useToast } from '@/lib/toast-context'
import { useFormErrors } from '@/lib/hooks/use-form-errors'

const tabs = [
  { id: 'general', label: '\u0e02\u0e49\u0e2d\u0e21\u0e39\u0e25\u0e17\u0e31\u0e48\u0e27\u0e44\u0e1b' },
  { id: 'options', label: '\u0e15\u0e31\u0e27\u0e40\u0e25\u0e37\u0e2d\u0e01\u0e2a\u0e34\u0e19\u0e04\u0e49\u0e32' },
  { id: 'details', label: '\u0e23\u0e32\u0e22\u0e25\u0e30\u0e40\u0e2d\u0e35\u0e22\u0e14\u0e2a\u0e34\u0e19\u0e04\u0e49\u0e32' },
  { id: 'characteristics', label: '\u0e04\u0e38\u0e13\u0e25\u0e31\u0e01\u0e29\u0e13\u0e30/\u0e04\u0e38\u0e13\u0e2a\u0e21\u0e1a\u0e31\u0e15\u0e34\u0e02\u0e2d\u0e07\u0e2a\u0e34\u0e19\u0e04\u0e49\u0e32' },
  { id: 'specifications', label: '\u0e02\u0e49\u0e2d\u0e21\u0e39\u0e25\u0e08\u0e33\u0e40\u0e1e\u0e32\u0e30' },
]

const initialColorChips = [
  { id: 1, label: 'Oak 20638 (L)' },
  { id: 2, label: 'Oak 10470 (L)' },
]

const initialSizeChips = [
  { id: 1, label: '70x200 cm.' },
  { id: 2, label: '80x200 cm.' },
  { id: 3, label: '90 x 200 cm.' },
]

function RichTextToolbar() {
  return (
    <div className="flex items-center gap-[2px] border-b border-[#e8eaef] px-[12px] py-[8px] flex-wrap">
      {/* Text style dropdown */}
      <div className="flex items-center gap-[4px] border border-[#e8eaef] rounded-[4px] px-[8px] py-[4px] mr-[8px] cursor-pointer">
        <span className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#494c4f]">Normal</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 4.5L6 7.5L9 4.5" />
        </svg>
      </div>

      {/* Bold */}
      <button className="size-[32px] flex items-center justify-center rounded-[4px] hover:bg-[#f3f4f6]" aria-label="Bold">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#494c4f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
          <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
        </svg>
      </button>

      {/* Italic */}
      <button className="size-[32px] flex items-center justify-center rounded-[4px] hover:bg-[#f3f4f6]" aria-label="Italic">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#494c4f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="4" x2="10" y2="4" />
          <line x1="14" y1="20" x2="5" y2="20" />
          <line x1="15" y1="4" x2="9" y2="20" />
        </svg>
      </button>

      {/* Underline */}
      <button className="size-[32px] flex items-center justify-center rounded-[4px] hover:bg-[#f3f4f6]" aria-label="Underline">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#494c4f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3" />
          <line x1="4" y1="21" x2="20" y2="21" />
        </svg>
      </button>

      {/* Strikethrough */}
      <button className="size-[32px] flex items-center justify-center rounded-[4px] hover:bg-[#f3f4f6]" aria-label="Strikethrough">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#494c4f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="4" y1="12" x2="20" y2="12" />
          <path d="M17.5 7.5C17.5 5.01 15.49 3 13 3H11C8.51 3 6.5 5.01 6.5 7.5S8.51 12 11 12h2c2.49 0 4.5 2.01 4.5 4.5S15.49 21 13 21h-2c-2.49 0-4.5-2.01-4.5-4.5" />
        </svg>
      </button>

      <div className="w-px h-[20px] bg-[#e8eaef] mx-[6px]" />

      {/* Align left */}
      <button className="size-[32px] flex items-center justify-center rounded-[4px] hover:bg-[#f3f4f6]" aria-label="Align left">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#494c4f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="17" y1="10" x2="3" y2="10" />
          <line x1="21" y1="6" x2="3" y2="6" />
          <line x1="21" y1="14" x2="3" y2="14" />
          <line x1="17" y1="18" x2="3" y2="18" />
        </svg>
      </button>

      {/* Align center */}
      <button className="size-[32px] flex items-center justify-center rounded-[4px] hover:bg-[#f3f4f6]" aria-label="Align center">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#494c4f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="10" x2="6" y2="10" />
          <line x1="21" y1="6" x2="3" y2="6" />
          <line x1="21" y1="14" x2="3" y2="14" />
          <line x1="18" y1="18" x2="6" y2="18" />
        </svg>
      </button>

      {/* Align right */}
      <button className="size-[32px] flex items-center justify-center rounded-[4px] hover:bg-[#f3f4f6]" aria-label="Align right">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#494c4f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="21" y1="10" x2="7" y2="10" />
          <line x1="21" y1="6" x2="3" y2="6" />
          <line x1="21" y1="14" x2="3" y2="14" />
          <line x1="21" y1="18" x2="7" y2="18" />
        </svg>
      </button>

      <div className="w-px h-[20px] bg-[#e8eaef] mx-[6px]" />

      {/* Bullet list */}
      <button className="size-[32px] flex items-center justify-center rounded-[4px] hover:bg-[#f3f4f6]" aria-label="Bullet list">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#494c4f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <circle cx="4" cy="6" r="1" fill="#494c4f" />
          <circle cx="4" cy="12" r="1" fill="#494c4f" />
          <circle cx="4" cy="18" r="1" fill="#494c4f" />
        </svg>
      </button>

      {/* Numbered list */}
      <button className="size-[32px] flex items-center justify-center rounded-[4px] hover:bg-[#f3f4f6]" aria-label="Numbered list">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#494c4f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="10" y1="6" x2="21" y2="6" />
          <line x1="10" y1="12" x2="21" y2="12" />
          <line x1="10" y1="18" x2="21" y2="18" />
          <text x="2" y="8" fill="#494c4f" stroke="none" fontSize="8" fontWeight="bold">1</text>
          <text x="2" y="14" fill="#494c4f" stroke="none" fontSize="8" fontWeight="bold">2</text>
          <text x="2" y="20" fill="#494c4f" stroke="none" fontSize="8" fontWeight="bold">3</text>
        </svg>
      </button>

      <div className="w-px h-[20px] bg-[#e8eaef] mx-[6px]" />

      {/* Link */}
      <button className="size-[32px] flex items-center justify-center rounded-[4px] hover:bg-[#f3f4f6]" aria-label="Insert link">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#494c4f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      </button>

      {/* Image */}
      <button className="size-[32px] flex items-center justify-center rounded-[4px] hover:bg-[#f3f4f6]" aria-label="Insert image">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#494c4f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      </button>

      {/* Table */}
      <button className="size-[32px] flex items-center justify-center rounded-[4px] hover:bg-[#f3f4f6]" aria-label="Insert table">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#494c4f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <line x1="3" y1="15" x2="21" y2="15" />
          <line x1="9" y1="3" x2="9" y2="21" />
          <line x1="15" y1="3" x2="15" y2="21" />
        </svg>
      </button>
    </div>
  )
}

function RichTextEditor({ content, minHeight = '200px' }) {
  return (
    <div className="border border-[#e8eaef] rounded-[8px] overflow-hidden bg-white">
      <RichTextToolbar />
      <div
        className="px-[16px] py-[14px] font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#494c4f] leading-[1.8] whitespace-pre-line"
        style={{ minHeight }}
      >
        {content}
      </div>
    </div>
  )
}

export default function ProductCreatePage() {
  const { toast } = useToast()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const formErrors = useFormErrors()
  const [activeTab, setActiveTab] = useState('general')
  const [productName, setProductName] = useState('')
  const [productCode, setProductCode] = useState('')
  const [sku, setSku] = useState('')
  const [productType, setProductType] = useState('')
  const [productCategory, setProductCategory] = useState('')
  const [colorChips, setColorChips] = useState(initialColorChips)
  const [sizeChips, setSizeChips] = useState(initialSizeChips)
  const [description, setDescription] = useState('')
  const [characteristics, setCharacteristics] = useState('')
  const [specifications, setSpecifications] = useState('')

  const placeholderImages = [
    { id: 1, main: true },
    { id: 2, main: false },
    { id: 3, main: false },
    { id: 4, main: false },
  ]

  const removeColorChip = (id) => {
    setColorChips((prev) => prev.filter((c) => c.id !== id))
  }

  const removeSizeChip = (id) => {
    setSizeChips((prev) => prev.filter((c) => c.id !== id))
  }

  const handleSubmit = (publish) => {
    formErrors.clearAll()

    if (!productName || !productCode || !sku || !productType || !productCategory) {
      const errors = {}
      if (!productName) errors.name = 'กรุณากรอกชื่อสินค้า'
      if (!productCode) errors.code = 'กรุณากรอกรหัสสินค้า'
      if (!sku) errors.sku = 'กรุณากรอก SKU'
      if (!productType) errors.type = 'กรุณาเลือกประเภทสินค้า'
      if (!productCategory) errors.category = 'กรุณาเลือกหมวดหมู่สินค้า'
      formErrors.setFieldErrors(errors)
      toast.error('กรุณากรอกข้อมูลที่จำเป็นให้ครบ')
      return
    }

    startTransition(async () => {
      const formData = new FormData()
      formData.set('name', productName)
      formData.set('code', productCode)
      formData.set('sku', sku)
      formData.set('type', productType)
      formData.set('category', productCategory)
      formData.set('description', description)
      formData.set('characteristics', characteristics)
      formData.set('specifications', specifications)
      formData.set('published', String(publish))
      formData.set('recommended', 'false')

      // Collect options
      const options = [
        ...colorChips.map((c) => ({ type: 'color', label: c.label })),
        ...sizeChips.map((s) => ({ type: 'size', label: s.label })),
      ]
      formData.set('options', JSON.stringify(options))

      const result = await createProduct(formData)
      if (result.fieldErrors) {
        formErrors.setFieldErrors(result.fieldErrors)
        toast.error('กรุณาตรวจสอบข้อมูลอีกครั้ง')
        return
      }
      if (result.error) {
        toast.error('เกิดข้อผิดพลาด: ' + result.error)
        return
      }
      router.push('/admin/products')
    })
  }

  return (
    <div className="flex flex-col min-h-full">
      {/* ===== Top Bar ===== */}
      <div className="flex items-center justify-between py-[12px] border-b border-[#e8eaef] mb-[24px]">
        <div className="flex items-center gap-[16px]">
          <Link
            href="/admin/products"
            className="flex items-center gap-[6px] font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#6b7280] no-underline hover:text-[#494c4f] transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 12L6 8L10 4" />
            </svg>
            <span>{'\u0e01\u0e25\u0e31\u0e1a'}</span>
          </Link>
          <h1 className="font-['IBM_Plex_Sans_Thai'] font-bold text-[22px] text-[#1f2937] m-0">
            {'\u0e40\u0e1e\u0e34\u0e48\u0e21\u0e2a\u0e34\u0e19\u0e04\u0e49\u0e32\u0e43\u0e2b\u0e21\u0e48'}
          </h1>
        </div>
        <div className="flex items-center gap-[12px]">
          <Link
            href="/admin/products"
            className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#494c4f] no-underline border border-[#e8eaef] rounded-[8px] px-[20px] py-[8px] hover:bg-[#f3f4f6] transition-colors"
          >
            {'\u0e22\u0e01\u0e40\u0e25\u0e34\u0e01'}
          </Link>
          <button
            onClick={() => handleSubmit(true)}
            disabled={isPending}
            className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-white bg-[#ff7e1b] border-0 rounded-[8px] px-[20px] py-[8px] cursor-pointer hover:bg-[#e56f15] transition-colors disabled:opacity-50"
          >
            {isPending ? 'กำลังบันทึก...' : 'บันทึกและเผยแพร่'}
          </button>
        </div>
      </div>

      {/* ===== Tab Navigation ===== */}
      <div className="flex border-b border-[#e8eaef] mb-[28px]" role="tablist" aria-label="Product form sections">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className={`
              font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium
              px-[20px] py-[12px] border-0 bg-transparent cursor-pointer
              transition-colors relative
              ${activeTab === tab.id
                ? 'text-[#ff7e1b]'
                : 'text-[#9ca3af] hover:text-[#494c4f]'
              }
            `}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#ff7e1b] rounded-t-[2px]" />
            )}
          </button>
        ))}
      </div>

      {/* ===== Form Content Area ===== */}
      <div className="flex flex-col gap-[40px] pb-[60px]">

        {/* ----- Section 1: Product Images ----- */}
        <section
          id="panel-general"
          role="tabpanel"
          aria-labelledby="general"
        >
          <div className="flex flex-col gap-[24px]">
            {/* Product Images */}
            <div className="flex flex-col gap-[12px]">
              <label className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
                {'\u0e20\u0e32\u0e1e\u0e2a\u0e34\u0e19\u0e04\u0e49\u0e32'} <span className="text-red-500">*</span>
              </label>
              <div className="flex items-start gap-[12px] flex-wrap">
                {placeholderImages.map((img) => (
                  <div
                    key={img.id}
                    className={`
                      relative rounded-[8px] overflow-hidden bg-[#c4956b] flex items-center justify-center
                      ${img.main ? 'w-[160px] h-[160px]' : 'w-[100px] h-[100px]'}
                    `}
                  >
                    {/* Simulated wood texture pattern */}
                    <div className="absolute inset-0 opacity-30 bg-gradient-to-br from-[#a67c52] via-[#c4956b] to-[#8b6b4a]" />
                    {/* Image icon overlay */}
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 opacity-60">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                    {img.main && (
                      <span className="absolute bottom-[6px] left-[6px] bg-[#ff7e1b] text-white font-['IBM_Plex_Sans_Thai'] text-[10px] font-medium px-[6px] py-[2px] rounded-[4px] z-10">
                        {'\u0e23\u0e39\u0e1b\u0e2b\u0e25\u0e31\u0e01'}
                      </span>
                    )}
                    {/* Delete button */}
                    <button
                      className="absolute top-[4px] right-[4px] size-[20px] bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center border-0 cursor-pointer z-10 transition-colors"
                      aria-label="Remove image"
                    >
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round">
                        <path d="M2 2L8 8M8 2L2 8" />
                      </svg>
                    </button>
                  </div>
                ))}
                {/* Add image button */}
                <button className="w-[100px] h-[100px] rounded-[8px] border-2 border-dashed border-[#e8eaef] bg-[#fafafa] flex flex-col items-center justify-center gap-[6px] cursor-pointer hover:border-[#ff7e1b] hover:bg-[#fff8f3] transition-colors group">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#bfbfbf" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-[#ff7e1b] transition-colors">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  <span className="font-['IBM_Plex_Sans_Thai'] text-[11px] text-[#9ca3af] group-hover:text-[#ff7e1b] transition-colors">
                    {'\u0e40\u0e1e\u0e34\u0e48\u0e21\u0e23\u0e39\u0e1b\u0e20\u0e32\u0e1e'}
                  </span>
                </button>
              </div>
            </div>

            {/* Product Name */}
            <div className="flex flex-col gap-[8px]">
              <label htmlFor="productName" className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
                {'\u0e0a\u0e37\u0e48\u0e2d\u0e2a\u0e34\u0e19\u0e04\u0e49\u0e32'} <span className="text-red-500">*</span>
              </label>
              <input
                id="productName"
                type="text"
                value={productName}
                onChange={(e) => { setProductName(e.target.value); formErrors.clearError('name') }}
                placeholder={'\u0e01\u0e23\u0e2d\u0e01\u0e0a\u0e37\u0e48\u0e2d\u0e2a\u0e34\u0e19\u0e04\u0e49\u0e32'}
                className={`font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border rounded-[8px] px-[14px] py-[10px] outline-none transition-all placeholder:text-[#bfbfbf] ${formErrors.getError('name') ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/20' : 'border-[#e8eaef] focus:border-[#ff7e1b] focus:ring-1 focus:ring-[#ff7e1b]/20'}`}
              />
              {formErrors.getError('name') && <p className="text-red-500 text-[13px] font-['IBM_Plex_Sans_Thai'] mt-[2px]">{formErrors.getError('name')}</p>}
            </div>

            {/* Product Code + SKU row */}
            <div className="grid grid-cols-2 gap-[20px]">
              <div className="flex flex-col gap-[8px]">
                <label htmlFor="productCode" className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
                  {'\u0e23\u0e2b\u0e31\u0e2a/\u0e23\u0e38\u0e48\u0e19\u0e2a\u0e34\u0e19\u0e04\u0e49\u0e32'} <span className="text-red-500">*</span>
                </label>
                <input
                  id="productCode"
                  type="text"
                  value={productCode}
                  onChange={(e) => { setProductCode(e.target.value); formErrors.clearError('code') }}
                  placeholder={'\u0e01\u0e23\u0e2d\u0e01\u0e23\u0e2b\u0e31\u0e2a\u0e2a\u0e34\u0e19\u0e04\u0e49\u0e32'}
                  className={`font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border rounded-[8px] px-[14px] py-[10px] outline-none transition-all placeholder:text-[#bfbfbf] ${formErrors.getError('code') ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/20' : 'border-[#e8eaef] focus:border-[#ff7e1b] focus:ring-1 focus:ring-[#ff7e1b]/20'}`}
                />
                {formErrors.getError('code') && <p className="text-red-500 text-[13px] font-['IBM_Plex_Sans_Thai'] mt-[2px]">{formErrors.getError('code')}</p>}
              </div>
              <div className="flex flex-col gap-[8px]">
                <label htmlFor="sku" className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
                  SKU <span className="text-red-500">*</span>
                </label>
                <input
                  id="sku"
                  type="text"
                  value={sku}
                  onChange={(e) => { setSku(e.target.value); formErrors.clearError('sku') }}
                  placeholder={'\u0e01\u0e23\u0e2d\u0e01 SKU'}
                  className={`font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border rounded-[8px] px-[14px] py-[10px] outline-none transition-all placeholder:text-[#bfbfbf] ${formErrors.getError('sku') ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/20' : 'border-[#e8eaef] focus:border-[#ff7e1b] focus:ring-1 focus:ring-[#ff7e1b]/20'}`}
                />
                {formErrors.getError('sku') && <p className="text-red-500 text-[13px] font-['IBM_Plex_Sans_Thai'] mt-[2px]">{formErrors.getError('sku')}</p>}
              </div>
            </div>

            {/* Product Type + Category row */}
            <div className="grid grid-cols-2 gap-[20px]">
              <div className="flex flex-col gap-[8px]">
                <label htmlFor="productType" className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
                  {'\u0e1b\u0e23\u0e30\u0e40\u0e20\u0e17\u0e2a\u0e34\u0e19\u0e04\u0e49\u0e32'} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="productType"
                    value={productType}
                    onChange={(e) => { setProductType(e.target.value); formErrors.clearError('type') }}
                    className={`font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border rounded-[8px] px-[14px] py-[10px] outline-none w-full appearance-none bg-white cursor-pointer transition-all ${formErrors.getError('type') ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/20' : 'border-[#e8eaef] focus:border-[#ff7e1b] focus:ring-1 focus:ring-[#ff7e1b]/20'}`}
                  >
                    <option value="" disabled className="text-[#bfbfbf]">{'\u0e40\u0e25\u0e37\u0e2d\u0e01\u0e1b\u0e23\u0e30\u0e40\u0e20\u0e17\u0e2a\u0e34\u0e19\u0e04\u0e49\u0e32'}</option>
                    <option value="door">{'\u0e1b\u0e23\u0e30\u0e15\u0e39'}</option>
                    <option value="window">{'\u0e2b\u0e19\u0e49\u0e32\u0e15\u0e48\u0e32\u0e07'}</option>
                    <option value="flooring">{'\u0e1e\u0e37\u0e49\u0e19'}</option>
                    <option value="furniture">{'\u0e40\u0e1f\u0e2d\u0e23\u0e4c\u0e19\u0e34\u0e40\u0e08\u0e2d\u0e23\u0e4c'}</option>
                  </select>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="absolute right-[14px] top-1/2 -translate-y-1/2 pointer-events-none">
                    <path d="M4 6L8 10L12 6" />
                  </svg>
                </div>
                {formErrors.getError('type') && <p className="text-red-500 text-[13px] font-['IBM_Plex_Sans_Thai'] mt-[2px]">{formErrors.getError('type')}</p>}
              </div>
              <div className="flex flex-col gap-[8px]">
                <label htmlFor="productCategory" className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
                  {'\u0e2b\u0e21\u0e27\u0e14\u0e2b\u0e21\u0e39\u0e48\u0e2a\u0e34\u0e19\u0e04\u0e49\u0e32'} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="productCategory"
                    value={productCategory}
                    onChange={(e) => { setProductCategory(e.target.value); formErrors.clearError('category') }}
                    className={`font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border rounded-[8px] px-[14px] py-[10px] outline-none w-full appearance-none bg-white cursor-pointer transition-all ${formErrors.getError('category') ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/20' : 'border-[#e8eaef] focus:border-[#ff7e1b] focus:ring-1 focus:ring-[#ff7e1b]/20'}`}
                  >
                    <option value="" disabled className="text-[#bfbfbf]">{'\u0e40\u0e25\u0e37\u0e2d\u0e01\u0e2b\u0e21\u0e27\u0e14\u0e2b\u0e21\u0e39\u0e48\u0e2a\u0e34\u0e19\u0e04\u0e49\u0e32'}</option>
                    <option value="interior">{'\u0e20\u0e32\u0e22\u0e43\u0e19'}</option>
                    <option value="exterior">{'\u0e20\u0e32\u0e22\u0e19\u0e2d\u0e01'}</option>
                    <option value="bathroom">{'\u0e2b\u0e49\u0e2d\u0e07\u0e19\u0e49\u0e33'}</option>
                  </select>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="absolute right-[14px] top-1/2 -translate-y-1/2 pointer-events-none">
                    <path d="M4 6L8 10L12 6" />
                  </svg>
                </div>
                {formErrors.getError('category') && <p className="text-red-500 text-[13px] font-['IBM_Plex_Sans_Thai'] mt-[2px]">{formErrors.getError('category')}</p>}
              </div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="h-px bg-[#e8eaef]" />

        {/* ----- Section 2: Product Options ----- */}
        <section id="panel-options" role="tabpanel" aria-labelledby="options">
          <h2 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[16px] text-[#1f2937] m-0 mb-[20px]">
            {'\u0e15\u0e31\u0e27\u0e40\u0e25\u0e37\u0e2d\u0e01\u0e2a\u0e34\u0e19\u0e04\u0e49\u0e32'}
          </h2>
          <div className="flex flex-col gap-[20px]">
            {/* Color options */}
            <div className="flex flex-col gap-[8px]">
              <label className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
                {'\u0e2a\u0e35\u0e41\u0e01\u0e23\u0e35\u0e48'}
              </label>
              <div className="flex items-center gap-[8px] flex-wrap">
                {colorChips.map((chip) => (
                  <span
                    key={chip.id}
                    className="inline-flex items-center gap-[6px] bg-[#ff7e1b] text-white font-['IBM_Plex_Sans_Thai'] text-[13px] font-medium rounded-[20px] px-[14px] py-[6px]"
                  >
                    {chip.label}
                    <button
                      onClick={() => removeColorChip(chip.id)}
                      className="flex items-center justify-center size-[16px] bg-white/25 hover:bg-white/40 rounded-full border-0 cursor-pointer transition-colors p-0"
                      aria-label={`Remove ${chip.label}`}
                    >
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round">
                        <path d="M1.5 1.5L6.5 6.5M6.5 1.5L1.5 6.5" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Size options */}
            <div className="flex flex-col gap-[8px]">
              <label className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
                {'\u0e40\u0e25\u0e37\u0e2d\u0e01\u0e02\u0e19\u0e32\u0e14'}
              </label>
              <div className="flex items-center gap-[8px] flex-wrap">
                {sizeChips.map((chip) => (
                  <span
                    key={chip.id}
                    className="inline-flex items-center gap-[6px] bg-[#ff7e1b] text-white font-['IBM_Plex_Sans_Thai'] text-[13px] font-medium rounded-[20px] px-[14px] py-[6px]"
                  >
                    {chip.label}
                    <button
                      onClick={() => removeSizeChip(chip.id)}
                      className="flex items-center justify-center size-[16px] bg-white/25 hover:bg-white/40 rounded-full border-0 cursor-pointer transition-colors p-0"
                      aria-label={`Remove ${chip.label}`}
                    >
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round">
                        <path d="M1.5 1.5L6.5 6.5M6.5 1.5L1.5 6.5" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Add option button */}
            <div>
              <button className="inline-flex items-center gap-[6px] font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#ff7e1b] bg-transparent border-0 cursor-pointer hover:text-[#e56f15] transition-colors px-0 py-[4px]">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <line x1="8" y1="3" x2="8" y2="13" />
                  <line x1="3" y1="8" x2="13" y2="8" />
                </svg>
                {'\u0e40\u0e1e\u0e34\u0e48\u0e21\u0e15\u0e31\u0e27\u0e40\u0e25\u0e37\u0e2d\u0e01'}
              </button>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="h-px bg-[#e8eaef]" />

        {/* ----- Section 3: Product Details ----- */}
        <section id="panel-details" role="tabpanel" aria-labelledby="details">
          <h2 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[16px] text-[#1f2937] m-0 mb-[16px]">
            {'\u0e23\u0e32\u0e22\u0e25\u0e30\u0e40\u0e2d\u0e35\u0e22\u0e14\u0e2a\u0e34\u0e19\u0e04\u0e49\u0e32'}
          </h2>
          <RichTextEditor
            content={'\u0e1b\u0e23\u0e30\u0e15\u0e39\u0e44\u0e21\u0e49\u0e2a\u0e31\u0e01 WPC (Wood Plastic Composite) \u0e1c\u0e25\u0e34\u0e15\u0e08\u0e32\u0e01\u0e27\u0e31\u0e2a\u0e14\u0e38\u0e04\u0e2d\u0e21\u0e42\u0e1e\u0e2a\u0e34\u0e15 \u0e17\u0e35\u0e48\u0e1c\u0e2a\u0e21\u0e1c\u0e2a\u0e32\u0e19\u0e23\u0e30\u0e2b\u0e27\u0e48\u0e32\u0e07\u0e44\u0e21\u0e49\u0e41\u0e25\u0e30\u0e1e\u0e25\u0e32\u0e2a\u0e15\u0e34\u0e01 \u0e21\u0e35\u0e04\u0e38\u0e13\u0e2a\u0e21\u0e1a\u0e31\u0e15\u0e34\u0e17\u0e19\u0e17\u0e32\u0e19\u0e15\u0e48\u0e2d\u0e04\u0e27\u0e32\u0e21\u0e0a\u0e37\u0e49\u0e19 \u0e1b\u0e25\u0e27\u0e01 \u0e41\u0e25\u0e30\u0e41\u0e21\u0e25\u0e07\u0e44\u0e14\u0e49\u0e14\u0e35 \u0e21\u0e35\u0e25\u0e32\u0e22\u0e44\u0e21\u0e49\u0e2a\u0e27\u0e22\u0e07\u0e32\u0e21 \u0e40\u0e2b\u0e21\u0e32\u0e30\u0e01\u0e31\u0e1a\u0e01\u0e32\u0e23\u0e43\u0e0a\u0e49\u0e07\u0e32\u0e19\u0e17\u0e31\u0e49\u0e07\u0e20\u0e32\u0e22\u0e43\u0e19\u0e41\u0e25\u0e30\u0e20\u0e32\u0e22\u0e19\u0e2d\u0e01\u0e2d\u0e32\u0e04\u0e32\u0e23'}
            minHeight="120px"
          />
        </section>

        {/* Divider */}
        <div className="h-px bg-[#e8eaef]" />

        {/* ----- Section 4: Product Characteristics ----- */}
        <section id="panel-characteristics" role="tabpanel" aria-labelledby="characteristics">
          <h2 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[16px] text-[#1f2937] m-0 mb-[16px]">
            {'\u0e04\u0e38\u0e13\u0e25\u0e31\u0e01\u0e29\u0e13\u0e30/\u0e04\u0e38\u0e13\u0e2a\u0e21\u0e1a\u0e31\u0e15\u0e34\u0e02\u0e2d\u0e07\u0e2a\u0e34\u0e19\u0e04\u0e49\u0e32'}
          </h2>
          <RichTextEditor
            content={`- \u0e17\u0e19\u0e15\u0e48\u0e2d\u0e04\u0e27\u0e32\u0e21\u0e0a\u0e37\u0e49\u0e19\u0e41\u0e25\u0e30\u0e1b\u0e25\u0e27\u0e01\u0e44\u0e14\u0e49\u0e14\u0e35
- \u0e44\u0e21\u0e48\u0e1a\u0e27\u0e21 \u0e44\u0e21\u0e48\u0e2b\u0e14 \u0e44\u0e21\u0e48\u0e22\u0e38\u0e1a\u0e15\u0e31\u0e27
- \u0e01\u0e31\u0e19\u0e19\u0e49\u0e33 \u0e01\u0e31\u0e19\u0e0a\u0e37\u0e49\u0e19\u0e23\u0e32
- \u0e25\u0e32\u0e22\u0e44\u0e21\u0e49\u0e2a\u0e27\u0e22\u0e07\u0e32\u0e21\u0e40\u0e2b\u0e21\u0e37\u0e2d\u0e19\u0e08\u0e23\u0e34\u0e07
- \u0e44\u0e21\u0e48\u0e15\u0e49\u0e2d\u0e07\u0e17\u0e32\u0e2a\u0e35\u0e17\u0e31\u0e1a\u0e2b\u0e23\u0e37\u0e2d\u0e40\u0e04\u0e25\u0e37\u0e2d\u0e1a`}
            minHeight="160px"
          />
        </section>

        {/* Divider */}
        <div className="h-px bg-[#e8eaef]" />

        {/* ----- Section 5: Specifications ----- */}
        <section id="panel-specifications" role="tabpanel" aria-labelledby="specifications">
          <h2 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[16px] text-[#1f2937] m-0 mb-[16px]">
            {'\u0e02\u0e49\u0e2d\u0e21\u0e39\u0e25\u0e08\u0e33\u0e40\u0e1e\u0e32\u0e30'}
          </h2>
          <RichTextEditor
            content={`\u0e04\u0e27\u0e32\u0e21\u0e01\u0e27\u0e49\u0e32\u0e07 : 70, 80, 90 cm.
\u0e04\u0e27\u0e32\u0e21\u0e2a\u0e39\u0e07 : 200 cm.
\u0e04\u0e27\u0e32\u0e21\u0e2b\u0e19\u0e32 : \u0e42\u0e14\u0e22\u0e1b\u0e23\u0e30\u0e21\u0e32\u0e13 3.5 cm.`}
            minHeight="120px"
          />
        </section>
      </div>
    </div>
  )
}
