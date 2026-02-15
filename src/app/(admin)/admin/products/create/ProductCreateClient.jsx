'use client'

import { useState, useTransition, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createProduct } from '@/lib/actions/products'
import { useToast } from '@/lib/toast-context'
import { useFormErrors } from '@/lib/hooks/use-form-errors'
import RichTextEditor from '@/components/admin/RichTextEditor'

const tabs = [
  { id: 'general', label: 'ข้อมูลทั่วไป' },
  { id: 'options', label: 'ตัวเลือกสินค้า' },
  { id: 'details', label: 'รายละเอียดสินค้า' },
  { id: 'characteristics', label: 'คุณลักษณะ/คุณสมบัติของสินค้า' },
  { id: 'specifications', label: 'ข้อมูลจำเพาะ' },
]

const typeOptions = [
  { value: 'construction', label: 'วัสดุก่อสร้าง' },
  { value: 'decoration', label: 'ผลิตภัณฑ์สำเร็จ' },
  { value: 'tool', label: 'เครื่องมือ' },
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

export default function ProductCreateClient({ categories = [] }) {
  const { toast } = useToast()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const formErrors = useFormErrors()
  const [activeTab, setActiveTab] = useState('general')
  const [productName, setProductName] = useState('')
  const [slug, setSlug] = useState('')
  const [productCode, setProductCode] = useState('')
  const [sku, setSku] = useState('')
  const [productType, setProductType] = useState('')
  const [productCategory, setProductCategory] = useState('')
  const [colorChips, setColorChips] = useState(initialColorChips)
  const [sizeChips, setSizeChips] = useState(initialSizeChips)
  const [description, setDescription] = useState('')
  const [characteristics, setCharacteristics] = useState('')
  const [specifications, setSpecifications] = useState('')

  // Build cascading category options from managed categories
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

    if (!productName || !productCode || !sku || !slug || !productType || !productCategory) {
      const errors = {}
      if (!productName) errors.name = 'กรุณากรอกชื่อสินค้า'
      if (!productCode) errors.code = 'กรุณากรอกรหัสสินค้า'
      if (!sku) errors.sku = 'กรุณากรอก SKU'
      if (!slug) errors.slug = 'กรุณากรอก Slug'
      if (!productType) errors.type = 'กรุณาเลือกประเภทสินค้า'
      if (!productCategory) errors.category = 'กรุณาเลือกหมวดหมู่สินค้า'
      formErrors.setFieldErrors(errors)
      toast.error('กรุณากรอกข้อมูลที่จำเป็นให้ครบ')
      return
    }

    startTransition(async () => {
      const formData = new FormData()
      formData.set('name', productName)
      formData.set('slug', slug)
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
            <span>กลับ</span>
          </Link>
          <h1 className="font-['IBM_Plex_Sans_Thai'] font-bold text-[22px] text-[#1f2937] m-0">
            เพิ่มสินค้าใหม่
          </h1>
        </div>
        <div className="flex items-center gap-[12px]">
          <Link
            href="/admin/products"
            className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#494c4f] no-underline border border-[#e8eaef] rounded-[8px] px-[20px] py-[8px] hover:bg-[#f3f4f6] transition-colors"
          >
            ยกเลิก
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
        <section id="panel-general" role="tabpanel" aria-labelledby="general">
          <div className="flex flex-col gap-[24px]">
            {/* Product Images */}
            <div className="flex flex-col gap-[12px]">
              <label className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
                ภาพสินค้า <span className="text-red-500">*</span>
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
                    <div className="absolute inset-0 opacity-30 bg-gradient-to-br from-[#a67c52] via-[#c4956b] to-[#8b6b4a]" />
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 opacity-60">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                    {img.main && (
                      <span className="absolute bottom-[6px] left-[6px] bg-[#ff7e1b] text-white font-['IBM_Plex_Sans_Thai'] text-[10px] font-medium px-[6px] py-[2px] rounded-[4px] z-10">
                        รูปหลัก
                      </span>
                    )}
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
                <button className="w-[100px] h-[100px] rounded-[8px] border-2 border-dashed border-[#e8eaef] bg-[#fafafa] flex flex-col items-center justify-center gap-[6px] cursor-pointer hover:border-[#ff7e1b] hover:bg-[#fff8f3] transition-colors group">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#bfbfbf" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-[#ff7e1b] transition-colors">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  <span className="font-['IBM_Plex_Sans_Thai'] text-[11px] text-[#9ca3af] group-hover:text-[#ff7e1b] transition-colors">
                    เพิ่มรูปภาพ
                  </span>
                </button>
              </div>
            </div>

            {/* Product Name */}
            <div className="flex flex-col gap-[8px]">
              <label htmlFor="productName" className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
                ชื่อสินค้า <span className="text-red-500">*</span>
              </label>
              <input
                id="productName"
                type="text"
                value={productName}
                onChange={(e) => {
                  const val = e.target.value
                  setProductName(val)
                  formErrors.clearError('name')
                  // Auto-generate slug from name
                  const generated = val.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\u0E00-\u0E7Fa-z0-9-]/g, '')
                  setSlug(generated)
                }}
                placeholder="กรอกชื่อสินค้า"
                className={`font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border rounded-[8px] px-[14px] py-[10px] outline-none transition-all placeholder:text-[#bfbfbf] ${formErrors.getError('name') ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/20' : 'border-[#e8eaef] focus:border-[#ff7e1b] focus:ring-1 focus:ring-[#ff7e1b]/20'}`}
              />
              {formErrors.getError('name') && <p className="text-red-500 text-[13px] font-['IBM_Plex_Sans_Thai'] mt-[2px]">{formErrors.getError('name')}</p>}
            </div>

            {/* Slug */}
            <div className="flex flex-col gap-[8px]">
              <label htmlFor="slug" className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
                Slug (URL) <span className="text-red-500">*</span>
              </label>
              <input
                id="slug"
                type="text"
                value={slug}
                onChange={(e) => { setSlug(e.target.value); formErrors.clearError('slug') }}
                placeholder="auto-generated-from-name"
                className={`font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border rounded-[8px] px-[14px] py-[10px] outline-none transition-all placeholder:text-[#bfbfbf] ${formErrors.getError('slug') ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/20' : 'border-[#e8eaef] focus:border-[#ff7e1b] focus:ring-1 focus:ring-[#ff7e1b]/20'}`}
              />
              {formErrors.getError('slug') && <p className="text-red-500 text-[13px] font-['IBM_Plex_Sans_Thai'] mt-[2px]">{formErrors.getError('slug')}</p>}
            </div>

            {/* Product Code + SKU row */}
            <div className="grid grid-cols-2 gap-[20px]">
              <div className="flex flex-col gap-[8px]">
                <label htmlFor="productCode" className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
                  รหัส/รุ่นสินค้า <span className="text-red-500">*</span>
                </label>
                <input
                  id="productCode"
                  type="text"
                  value={productCode}
                  onChange={(e) => { setProductCode(e.target.value); formErrors.clearError('code') }}
                  placeholder="กรอกรหัสสินค้า"
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
                  placeholder="กรอก SKU"
                  className={`font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border rounded-[8px] px-[14px] py-[10px] outline-none transition-all placeholder:text-[#bfbfbf] ${formErrors.getError('sku') ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/20' : 'border-[#e8eaef] focus:border-[#ff7e1b] focus:ring-1 focus:ring-[#ff7e1b]/20'}`}
                />
                {formErrors.getError('sku') && <p className="text-red-500 text-[13px] font-['IBM_Plex_Sans_Thai'] mt-[2px]">{formErrors.getError('sku')}</p>}
              </div>
            </div>

            {/* Product Type + Category row */}
            <div className="grid grid-cols-2 gap-[20px]">
              <div className="flex flex-col gap-[8px]">
                <label htmlFor="productType" className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
                  ประเภทสินค้า <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="productType"
                    value={productType}
                    onChange={(e) => { setProductType(e.target.value); setProductCategory(''); formErrors.clearError('type') }}
                    className={`font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border rounded-[8px] px-[14px] py-[10px] outline-none w-full appearance-none bg-white cursor-pointer transition-all ${formErrors.getError('type') ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/20' : 'border-[#e8eaef] focus:border-[#ff7e1b] focus:ring-1 focus:ring-[#ff7e1b]/20'}`}
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
              </div>
              <div className="flex flex-col gap-[8px]">
                <label htmlFor="productCategory" className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
                  หมวดหมู่สินค้า <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="productCategory"
                    value={productCategory}
                    onChange={(e) => { setProductCategory(e.target.value); formErrors.clearError('category') }}
                    disabled={!productType}
                    className={`font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border rounded-[8px] px-[14px] py-[10px] outline-none w-full appearance-none bg-white cursor-pointer transition-all disabled:bg-[#f9fafb] disabled:text-[#9ca3af] ${formErrors.getError('category') ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/20' : 'border-[#e8eaef] focus:border-[#ff7e1b] focus:ring-1 focus:ring-[#ff7e1b]/20'}`}
                  >
                    <option value="" disabled>{productType ? 'เลือกหมวดหมู่สินค้า' : 'เลือกประเภทก่อน'}</option>
                    {categoryOptions.map((opt, i) => (
                      <option key={`${opt.value}-${i}`} value={opt.value}>{opt.label}</option>
                    ))}
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
            ตัวเลือกสินค้า
          </h2>
          <div className="flex flex-col gap-[20px]">
            {/* Color options */}
            <div className="flex flex-col gap-[8px]">
              <label className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
                สีแกร่ี
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
                เลือกขนาด
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
                เพิ่มตัวเลือก
              </button>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="h-px bg-[#e8eaef]" />

        {/* ----- Section 3: Product Details ----- */}
        <section id="panel-details" role="tabpanel" aria-labelledby="details">
          <h2 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[16px] text-[#1f2937] m-0 mb-[16px]">
            รายละเอียดสินค้า
          </h2>
          <RichTextEditor
            content={description}
            onChange={setDescription}
            minHeight={120}
          />
        </section>

        {/* Divider */}
        <div className="h-px bg-[#e8eaef]" />

        {/* ----- Section 4: Product Characteristics ----- */}
        <section id="panel-characteristics" role="tabpanel" aria-labelledby="characteristics">
          <h2 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[16px] text-[#1f2937] m-0 mb-[16px]">
            คุณลักษณะ/คุณสมบัติของสินค้า
          </h2>
          <RichTextEditor
            content={characteristics}
            onChange={setCharacteristics}
            minHeight={160}
          />
        </section>

        {/* Divider */}
        <div className="h-px bg-[#e8eaef]" />

        {/* ----- Section 5: Specifications ----- */}
        <section id="panel-specifications" role="tabpanel" aria-labelledby="specifications">
          <h2 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[16px] text-[#1f2937] m-0 mb-[16px]">
            ข้อมูลจำเพาะ
          </h2>
          <RichTextEditor
            content={specifications}
            onChange={setSpecifications}
            minHeight={120}
          />
        </section>
      </div>
    </div>
  )
}
