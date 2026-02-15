'use client'

import { useState, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useToast } from '@/lib/toast-context'
import { createCategory, getCategories } from '@/lib/actions/categories'
import { validateFile, ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE } from '@/lib/upload-validation'
import AdminFileInput from '@/components/admin/AdminFileInput'

function generateSlug(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\u0E00-\u0E7Fa-z0-9-]/g, '')
}

export default function CategoryCreatePage() {
  const { toast } = useToast()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [slugManual, setSlugManual] = useState(false)
  const [parentId, setParentId] = useState('')
  const [isFeatured, setIsFeatured] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})
  const [parentCategories, setParentCategories] = useState([])

  // Fetch parent categories (top-level only) on mount
  useEffect(() => {
    getCategories().then(res => {
      if (res.data) setParentCategories(res.data.filter(c => !c.parent_id))
    })
  }, [])

  // Auto-generate slug from name
  useEffect(() => {
    if (!slugManual && name) {
      setSlug(generateSlug(name))
    }
  }, [name, slugManual])

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const check = validateFile(file, { allowedTypes: ALLOWED_IMAGE_TYPES, maxSize: MAX_IMAGE_SIZE })
    if (!check.valid) { toast.error(check.error); e.target.value = ''; return }
    setSelectedFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    setImagePreview(null)
  }

  const handleSave = (publish) => {
    setFieldErrors({})

    if (!name || !parentId) {
      const errors = {}
      if (!name) errors.name = 'กรุณากรอกชื่อหมวดหมู่สินค้า'
      if (!parentId) errors.parent_id = 'กรุณาเลือกประเภทสินค้า'
      setFieldErrors(errors)
      toast.error('กรุณากรอกข้อมูลที่จำเป็นให้ครบ')
      return
    }

    startTransition(async () => {
      const parent = parentCategories.find(p => p.id === parentId)
      const formData = new FormData()
      formData.set('name', name)
      formData.set('slug', slug || generateSlug(name))
      formData.set('type', parent?.type || 'construction')
      formData.set('parent_id', parentId)
      formData.set('published', String(publish))
      formData.set('is_featured', String(isFeatured))
      if (selectedFile) {
        formData.set('file', selectedFile)
      }

      const result = await createCategory(formData)
      if (result.fieldErrors) {
        setFieldErrors(result.fieldErrors)
        toast.error('กรุณาตรวจสอบข้อมูลอีกครั้ง')
        return
      }
      if (result.error) {
        toast.error('เกิดข้อผิดพลาด: ' + result.error)
        return
      }
      router.push('/admin/categories')
      router.refresh()
    })
  }

  return (
    <div className={`flex flex-col gap-0 h-full min-h-0 ${isPending ? 'opacity-60 pointer-events-none' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between py-[12px]">
        <div className="flex items-center gap-[12px]">
          <Link
            href="/admin/categories"
            className="size-[32px] flex items-center justify-center rounded-[8px] hover:bg-gray-100 cursor-pointer no-underline"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </Link>
          <h1 className="font-['IBM_Plex_Sans_Thai'] font-bold text-[22px] text-[#1f2937] m-0">
            สร้างหมวดหมู่สินค้าใหม่
          </h1>
          <span className="inline-flex items-center px-[10px] py-[2px] rounded-full border border-orange/40 bg-orange/5 text-orange font-['IBM_Plex_Sans_Thai'] text-[12px] font-medium leading-[1.8]">
            ใหม่
          </span>
        </div>
      </div>

      {/* Content body */}
      <div className="flex gap-[24px] mt-[20px] flex-1 min-h-0 overflow-y-auto pb-[32px]">
        {/* Main form */}
        <div className="flex-1 flex flex-col gap-[24px] min-w-0">
          <section className="bg-white rounded-[12px] border border-[#e5e7eb] p-[24px] flex flex-col gap-[20px]">
            <h2 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[16px] text-[#1f2937] m-0">
              ข้อมูลหมวดหมู่สินค้า
            </h2>

            {/* Name */}
            <div className="flex flex-col gap-[8px]">
              <label htmlFor="catName" className="font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] text-[#374151]">
                ชื่อหมวดหมู่สินค้า <span className="text-red-500">*</span>
              </label>
              <input
                id="catName"
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setFieldErrors(prev => ({ ...prev, name: undefined })) }}
                placeholder="เช่น ไม้อัด, ไม้แปรรูป"
                className={`font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border rounded-[8px] px-[14px] py-[10px] outline-none transition-all placeholder:text-[#bfbfbf] ${fieldErrors.name ? 'border-red-500' : 'border-[#e8eaef] focus:border-[#ff7e1b] focus:ring-1 focus:ring-[#ff7e1b]/20'}`}
              />
              {fieldErrors.name && <p className="text-red-500 text-[13px] font-['IBM_Plex_Sans_Thai']">{fieldErrors.name}</p>}
            </div>

            {/* Slug */}
            <div className="flex flex-col gap-[8px]">
              <label htmlFor="catSlug" className="font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] text-[#374151]">
                Slug
              </label>
              <input
                id="catSlug"
                type="text"
                value={slug}
                onChange={(e) => { setSlug(e.target.value); setSlugManual(true) }}
                placeholder="auto-generated-from-name"
                className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border border-[#e8eaef] rounded-[8px] px-[14px] py-[10px] outline-none focus:border-[#ff7e1b] focus:ring-1 focus:ring-[#ff7e1b]/20 transition-all placeholder:text-[#bfbfbf]"
              />
            </div>

            {/* Parent (ประเภทสินค้า) — required */}
            <div className="flex flex-col gap-[8px]">
              <label htmlFor="catParent" className="font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] text-[#374151]">
                ประเภทสินค้า <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="catParent"
                  value={parentId}
                  onChange={(e) => { setParentId(e.target.value); setFieldErrors(prev => ({ ...prev, parent_id: undefined })) }}
                  className={`font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border rounded-[8px] px-[14px] py-[10px] outline-none w-full appearance-none bg-white cursor-pointer transition-all ${fieldErrors.parent_id ? 'border-red-500' : 'border-[#e8eaef] focus:border-[#ff7e1b] focus:ring-1 focus:ring-[#ff7e1b]/20'}`}
                >
                  <option value="" disabled>เลือกประเภทสินค้า</option>
                  {parentCategories.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="absolute right-[14px] top-1/2 -translate-y-1/2 pointer-events-none">
                  <path d="M4 6L8 10L12 6" />
                </svg>
              </div>
              {fieldErrors.parent_id && <p className="text-red-500 text-[13px] font-['IBM_Plex_Sans_Thai']">{fieldErrors.parent_id}</p>}
              {parentCategories.length === 0 && (
                <p className="font-['IBM_Plex_Sans_Thai'] text-[12px] text-[#ef4444]">
                  ยังไม่มีประเภทสินค้า กรุณา<Link href="/admin/product-types/create" className="text-orange underline">สร้างประเภทสินค้า</Link>ก่อน
                </p>
              )}
            </div>

            {/* Image Upload */}
            <AdminFileInput
              label="รูปภาพหมวดหมู่สินค้า"
              accept="image"
              onChange={handleFileChange}
              onRemove={handleRemoveFile}
              previewUrl={imagePreview}
              fileName={selectedFile?.name}
            />

            {/* Featured toggle */}
            <div className="flex items-center gap-[12px]">
              <button
                type="button"
                role="switch"
                aria-checked={isFeatured}
                onClick={() => setIsFeatured(prev => !prev)}
                className={`relative inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${isFeatured ? 'bg-orange' : 'bg-[#d1d5db]'}`}
              >
                <span className={`pointer-events-none inline-block size-[20px] rounded-full bg-white shadow-sm transition-transform ${isFeatured ? 'translate-x-[20px]' : 'translate-x-0'}`} />
              </button>
              <label className="font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] text-[#374151] cursor-pointer" onClick={() => setIsFeatured(prev => !prev)}>
                ตั้งเป็นหมวดหมู่แนะนำ
              </label>
            </div>
          </section>
        </div>

        {/* Right sidebar */}
        <aside className="w-[260px] shrink-0 flex flex-col gap-[16px]">
          <div className="bg-white rounded-[12px] border border-[#e5e7eb] p-[20px] flex flex-col gap-[16px]">
            <h3 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[12px] text-[#9ca3af] tracking-[0.8px] uppercase m-0">
              Entry
            </h3>
            <button
              type="button"
              onClick={() => handleSave(true)}
              disabled={isPending}
              className="w-full flex items-center justify-center gap-[6px] px-[16px] py-[8px] rounded-[8px] bg-orange text-white font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] border-0 cursor-pointer hover:bg-orange/90 transition-colors disabled:opacity-50"
            >
              {isPending ? 'กำลังบันทึก...' : 'เผยแพร่'}
            </button>
            <button
              type="button"
              onClick={() => handleSave(false)}
              disabled={isPending}
              className="w-full flex items-center justify-center px-[16px] py-[8px] rounded-[8px] bg-white text-[#374151] font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] border border-[#e5e7eb] cursor-pointer hover:bg-[#f9fafb] transition-colors disabled:opacity-50"
            >
              บันทึกแบบร่าง
            </button>
          </div>
        </aside>
      </div>
    </div>
  )
}
