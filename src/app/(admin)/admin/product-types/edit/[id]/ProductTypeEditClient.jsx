'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useToast } from '@/lib/toast-context'
import { updateCategory } from '@/lib/actions/categories'
import { validateFile, ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE } from '@/lib/upload-validation'
import AdminFileInput from '@/components/admin/AdminFileInput'

const typeOptions = [
  { value: 'construction', label: 'วัสดุก่อสร้าง' },
  { value: 'decoration', label: 'ผลิตภัณฑ์สำเร็จ' },
  { value: 'tool', label: 'เครื่องมือ' },
]

function generateSlug(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\u0E00-\u0E7Fa-z0-9-]/g, '')
}

export default function ProductTypeEditClient({ category }) {
  const { toast } = useToast()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [name, setName] = useState(category.name || '')
  const [slug, setSlug] = useState(category.slug || '')
  const [type, setType] = useState(category.type || '')
  const [imagePreview, setImagePreview] = useState(category.image_url || null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [removeImage, setRemoveImage] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const check = validateFile(file, { allowedTypes: ALLOWED_IMAGE_TYPES, maxSize: MAX_IMAGE_SIZE })
    if (!check.valid) { toast.error(check.error); e.target.value = ''; return }
    setSelectedFile(file)
    setImagePreview(URL.createObjectURL(file))
    setRemoveImage(false)
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    setImagePreview(null)
    setRemoveImage(true)
  }

  const handleSave = (publish) => {
    setFieldErrors({})

    if (!name || !type) {
      const errors = {}
      if (!name) errors.name = 'กรุณากรอกชื่อประเภทสินค้า'
      if (!type) errors.type = 'กรุณาเลือกกลุ่ม'
      setFieldErrors(errors)
      toast.error('กรุณากรอกข้อมูลที่จำเป็นให้ครบ')
      return
    }

    startTransition(async () => {
      const formData = new FormData()
      formData.set('name', name)
      formData.set('slug', slug || generateSlug(name))
      formData.set('type', type)
      formData.set('parent_id', '')
      formData.set('published', String(publish))
      if (selectedFile) {
        formData.set('file', selectedFile)
      }
      if (removeImage) {
        formData.set('remove_image', 'true')
      }

      const result = await updateCategory(category.id, formData)
      if (result.fieldErrors) {
        setFieldErrors(result.fieldErrors)
        toast.error('กรุณาตรวจสอบข้อมูลอีกครั้ง')
        return
      }
      if (result.error) {
        toast.error('เกิดข้อผิดพลาด: ' + result.error)
        return
      }
      router.push('/admin/product-types')
      router.refresh()
    })
  }

  return (
    <div className={`flex flex-col gap-0 h-full min-h-0 ${isPending ? 'opacity-60 pointer-events-none' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between py-[12px]">
        <div className="flex items-center gap-[12px]">
          <Link
            href="/admin/product-types"
            className="size-[32px] flex items-center justify-center rounded-[8px] hover:bg-gray-100 cursor-pointer no-underline"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </Link>
          <h1 className="font-['IBM_Plex_Sans_Thai'] font-bold text-[22px] text-[#1f2937] m-0">
            แก้ไขประเภทสินค้า
          </h1>
        </div>
      </div>

      {/* Content body */}
      <div className="flex gap-[24px] mt-[20px] flex-1 min-h-0 overflow-y-auto pb-[32px]">
        <div className="flex-1 flex flex-col gap-[24px] min-w-0">
          <section className="bg-white rounded-[12px] border border-[#e5e7eb] p-[24px] flex flex-col gap-[20px]">
            <h2 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[16px] text-[#1f2937] m-0">
              ข้อมูลประเภทสินค้า
            </h2>

            {/* Name */}
            <div className="flex flex-col gap-[8px]">
              <label htmlFor="typeName" className="font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] text-[#374151]">
                ชื่อประเภทสินค้า <span className="text-red-500">*</span>
              </label>
              <input
                id="typeName"
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setFieldErrors(prev => ({ ...prev, name: undefined })) }}
                className={`font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border rounded-[8px] px-[14px] py-[10px] outline-none transition-all placeholder:text-[#bfbfbf] ${fieldErrors.name ? 'border-red-500' : 'border-[#e8eaef] focus:border-[#ff7e1b] focus:ring-1 focus:ring-[#ff7e1b]/20'}`}
              />
              {fieldErrors.name && <p className="text-red-500 text-[13px] font-['IBM_Plex_Sans_Thai']">{fieldErrors.name}</p>}
            </div>

            {/* Slug */}
            <div className="flex flex-col gap-[8px]">
              <label htmlFor="typeSlug" className="font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] text-[#374151]">
                Slug
              </label>
              <input
                id="typeSlug"
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border border-[#e8eaef] rounded-[8px] px-[14px] py-[10px] outline-none focus:border-[#ff7e1b] focus:ring-1 focus:ring-[#ff7e1b]/20 transition-all placeholder:text-[#bfbfbf]"
              />
            </div>

            {/* Type */}
            <div className="flex flex-col gap-[8px]">
              <label htmlFor="typeGroup" className="font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] text-[#374151]">
                กลุ่ม <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="typeGroup"
                  value={type}
                  onChange={(e) => { setType(e.target.value); setFieldErrors(prev => ({ ...prev, type: undefined })) }}
                  className={`font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border rounded-[8px] px-[14px] py-[10px] outline-none w-full appearance-none bg-white cursor-pointer transition-all ${fieldErrors.type ? 'border-red-500' : 'border-[#e8eaef] focus:border-[#ff7e1b] focus:ring-1 focus:ring-[#ff7e1b]/20'}`}
                >
                  <option value="" disabled>เลือกกลุ่ม</option>
                  {typeOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="absolute right-[14px] top-1/2 -translate-y-1/2 pointer-events-none">
                  <path d="M4 6L8 10L12 6" />
                </svg>
              </div>
              {fieldErrors.type && <p className="text-red-500 text-[13px] font-['IBM_Plex_Sans_Thai']">{fieldErrors.type}</p>}
            </div>

            {/* Image Upload */}
            <AdminFileInput
              label="รูปภาพประเภทสินค้า"
              accept="image"
              onChange={handleFileChange}
              onRemove={handleRemoveFile}
              previewUrl={imagePreview}
              fileName={selectedFile?.name || (category.image_url ? 'รูปภาพปัจจุบัน' : undefined)}
            />
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
              {isPending ? 'กำลังบันทึก...' : 'บันทึกและเผยแพร่'}
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
