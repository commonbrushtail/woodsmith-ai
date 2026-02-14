'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useToast } from '@/lib/toast-context'
import { updateProduct } from '@/lib/actions/products'
import { useFormErrors } from '@/lib/hooks/use-form-errors'

export default function ProductEditClient({ product }) {
  const { toast } = useToast()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const formErrors = useFormErrors()
  const [productName, setProductName] = useState(product.name || '')
  const [productCode, setProductCode] = useState(product.code || '')
  const [sku, setSku] = useState(product.sku || '')
  const [productType, setProductType] = useState(product.type || '')
  const [productCategory, setProductCategory] = useState(product.category || '')
  const [description, setDescription] = useState(product.description || '')
  const [characteristics, setCharacteristics] = useState(product.characteristics || '')
  const [specifications, setSpecifications] = useState(product.specifications?.raw || '')
  const [recommended, setRecommended] = useState(product.recommended || false)

  const colorOptions = (product.product_options || []).filter((o) => o.option_type === 'color')
  const sizeOptions = (product.product_options || []).filter((o) => o.option_type === 'size')
  const [colorChips, setColorChips] = useState(colorOptions.map((o) => ({ id: o.id, label: o.label })))
  const [sizeChips, setSizeChips] = useState(sizeOptions.map((o) => ({ id: o.id, label: o.label })))

  const removeColorChip = (id) => setColorChips((prev) => prev.filter((c) => c.id !== id))
  const removeSizeChip = (id) => setSizeChips((prev) => prev.filter((c) => c.id !== id))

  const handleSubmit = (publish) => {
    formErrors.clearAll()

    if (!productName || !productCode || !sku) {
      const errors = {}
      if (!productName) errors.name = 'กรุณากรอกชื่อสินค้า'
      if (!productCode) errors.code = 'กรุณากรอกรหัสสินค้า'
      if (!sku) errors.sku = 'กรุณากรอก SKU'
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
      formData.set('recommended', String(recommended))

      const options = [
        ...colorChips.map((c) => ({ type: 'color', label: c.label })),
        ...sizeChips.map((s) => ({ type: 'size', label: s.label })),
      ]
      formData.set('options', JSON.stringify(options))

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
      router.push('/admin/products')
    })
  }

  return (
    <div className="flex flex-col min-h-full">
      {/* Top Bar */}
      <div className="flex items-center justify-between py-[12px] border-b border-[#e8eaef] mb-[24px]">
        <div className="flex items-center gap-[16px]">
          <Link
            href="/admin/products"
            className="flex items-center gap-[6px] font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#6b7280] no-underline hover:text-[#494c4f] transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 12L6 8L10 4" />
            </svg>
            <span>{'กลับ'}</span>
          </Link>
          <h1 className="font-['IBM_Plex_Sans_Thai'] font-bold text-[22px] text-[#1f2937] m-0">
            {'แก้ไขสินค้า'}
          </h1>
        </div>
        <div className="flex items-center gap-[12px]">
          <Link
            href="/admin/products"
            className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#494c4f] no-underline border border-[#e8eaef] rounded-[8px] px-[20px] py-[8px] hover:bg-[#f3f4f6] transition-colors"
          >
            {'ยกเลิก'}
          </Link>
          <button
            onClick={() => handleSubmit(product.published)}
            disabled={isPending}
            className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-white bg-[#ff7e1b] border-0 rounded-[8px] px-[20px] py-[8px] cursor-pointer hover:bg-[#e56f15] transition-colors disabled:opacity-50"
          >
            {isPending ? 'กำลังบันทึก...' : 'บันทึก'}
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="flex flex-col gap-[24px] pb-[60px]">
        {/* Product Name */}
        <div className="flex flex-col gap-[8px]">
          <label htmlFor="productName" className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
            {'ชื่อสินค้า'} <span className="text-red-500">*</span>
          </label>
          <input
            id="productName"
            type="text"
            value={productName}
            onChange={(e) => { setProductName(e.target.value); formErrors.clearError('name') }}
            className={`font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border rounded-[8px] px-[14px] py-[10px] outline-none transition-all placeholder:text-[#bfbfbf] ${formErrors.getError('name') ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/20' : 'border-[#e8eaef] focus:border-[#ff7e1b] focus:ring-1 focus:ring-[#ff7e1b]/20'}`}
          />
          {formErrors.getError('name') && <p className="text-red-500 text-[13px] font-['IBM_Plex_Sans_Thai'] mt-[2px]">{formErrors.getError('name')}</p>}
        </div>

        {/* Code + SKU */}
        <div className="grid grid-cols-2 gap-[20px]">
          <div className="flex flex-col gap-[8px]">
            <label htmlFor="productCode" className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
              {'รหัส/รุ่นสินค้า'} <span className="text-red-500">*</span>
            </label>
            <input
              id="productCode"
              type="text"
              value={productCode}
              onChange={(e) => { setProductCode(e.target.value); formErrors.clearError('code') }}
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
              className={`font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border rounded-[8px] px-[14px] py-[10px] outline-none transition-all placeholder:text-[#bfbfbf] ${formErrors.getError('sku') ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/20' : 'border-[#e8eaef] focus:border-[#ff7e1b] focus:ring-1 focus:ring-[#ff7e1b]/20'}`}
            />
            {formErrors.getError('sku') && <p className="text-red-500 text-[13px] font-['IBM_Plex_Sans_Thai'] mt-[2px]">{formErrors.getError('sku')}</p>}
          </div>
        </div>

        {/* Type + Category */}
        <div className="grid grid-cols-2 gap-[20px]">
          <div className="flex flex-col gap-[8px]">
            <label htmlFor="productType" className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
              {'ประเภทสินค้า'} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                id="productType"
                value={productType}
                onChange={(e) => setProductType(e.target.value)}
                className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border border-[#e8eaef] rounded-[8px] px-[14px] py-[10px] outline-none w-full appearance-none bg-white cursor-pointer focus:border-[#ff7e1b] focus:ring-1 focus:ring-[#ff7e1b]/20 transition-all"
              >
                <option value="" disabled>{'เลือกประเภทสินค้า'}</option>
                <option value="construction">{'วัสดุก่อสร้าง'}</option>
                <option value="decoration">{'ผลิตภัณฑ์สำเร็จ'}</option>
                <option value="tool">{'เครื่องมือ'}</option>
              </select>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="absolute right-[14px] top-1/2 -translate-y-1/2 pointer-events-none">
                <path d="M4 6L8 10L12 6" />
              </svg>
            </div>
          </div>
          <div className="flex flex-col gap-[8px]">
            <label htmlFor="productCategory" className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
              {'หมวดหมู่สินค้า'} <span className="text-red-500">*</span>
            </label>
            <input
              id="productCategory"
              type="text"
              value={productCategory}
              onChange={(e) => setProductCategory(e.target.value)}
              className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border border-[#e8eaef] rounded-[8px] px-[14px] py-[10px] outline-none focus:border-[#ff7e1b] focus:ring-1 focus:ring-[#ff7e1b]/20 transition-all placeholder:text-[#bfbfbf]"
            />
          </div>
        </div>

        <div className="h-px bg-[#e8eaef]" />

        {/* Description */}
        <div className="flex flex-col gap-[8px]">
          <label className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
            {'รายละเอียดสินค้า'}
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border border-[#e8eaef] rounded-[8px] px-[14px] py-[10px] outline-none focus:border-[#ff7e1b] focus:ring-1 focus:ring-[#ff7e1b]/20 transition-all resize-y placeholder:text-[#bfbfbf]"
          />
        </div>

        {/* Characteristics */}
        <div className="flex flex-col gap-[8px]">
          <label className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
            {'คุณลักษณะ/คุณสมบัติของสินค้า'}
          </label>
          <textarea
            value={characteristics}
            onChange={(e) => setCharacteristics(e.target.value)}
            rows={5}
            className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border border-[#e8eaef] rounded-[8px] px-[14px] py-[10px] outline-none focus:border-[#ff7e1b] focus:ring-1 focus:ring-[#ff7e1b]/20 transition-all resize-y placeholder:text-[#bfbfbf]"
          />
        </div>

        {/* Specifications */}
        <div className="flex flex-col gap-[8px]">
          <label className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
            {'ข้อมูลจำเพาะ'}
          </label>
          <textarea
            value={specifications}
            onChange={(e) => setSpecifications(e.target.value)}
            rows={4}
            className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border border-[#e8eaef] rounded-[8px] px-[14px] py-[10px] outline-none focus:border-[#ff7e1b] focus:ring-1 focus:ring-[#ff7e1b]/20 transition-all resize-y placeholder:text-[#bfbfbf]"
          />
        </div>

        <div className="h-px bg-[#e8eaef]" />

        {/* Options - Colors */}
        <div className="flex flex-col gap-[8px]">
          <label className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">{'สีแกร่ี'}</label>
          <div className="flex items-center gap-[8px] flex-wrap">
            {colorChips.map((chip) => (
              <span key={chip.id} className="inline-flex items-center gap-[6px] bg-[#ff7e1b] text-white font-['IBM_Plex_Sans_Thai'] text-[13px] font-medium rounded-[20px] px-[14px] py-[6px]">
                {chip.label}
                <button onClick={() => removeColorChip(chip.id)} className="flex items-center justify-center size-[16px] bg-white/25 hover:bg-white/40 rounded-full border-0 cursor-pointer transition-colors p-0" aria-label={`Remove ${chip.label}`}>
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round"><path d="M1.5 1.5L6.5 6.5M6.5 1.5L1.5 6.5" /></svg>
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Options - Sizes */}
        <div className="flex flex-col gap-[8px]">
          <label className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">{'เลือกขนาด'}</label>
          <div className="flex items-center gap-[8px] flex-wrap">
            {sizeChips.map((chip) => (
              <span key={chip.id} className="inline-flex items-center gap-[6px] bg-[#ff7e1b] text-white font-['IBM_Plex_Sans_Thai'] text-[13px] font-medium rounded-[20px] px-[14px] py-[6px]">
                {chip.label}
                <button onClick={() => removeSizeChip(chip.id)} className="flex items-center justify-center size-[16px] bg-white/25 hover:bg-white/40 rounded-full border-0 cursor-pointer transition-colors p-0" aria-label={`Remove ${chip.label}`}>
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round"><path d="M1.5 1.5L6.5 6.5M6.5 1.5L1.5 6.5" /></svg>
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
