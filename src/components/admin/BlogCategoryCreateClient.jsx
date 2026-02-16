'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createBlogCategory } from '@/lib/actions/blog-categories'
import { useToast } from '@/lib/toast-context'
import { useFormErrors } from '@/lib/hooks/use-form-errors'

function ChevronLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 12L6 8L10 4" />
    </svg>
  )
}

const inputCls = (hasError) =>
  `w-full font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border rounded-[8px] px-[14px] py-[10px] outline-none transition-all placeholder:text-[#bfbfbf] ${hasError ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/20' : 'border-[#e8eaef] focus:border-orange focus:ring-1 focus:ring-orange/20'}`

export default function BlogCategoryCreateClient() {
  const { toast } = useToast()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const formErrors = useFormErrors()

  const [name, setName] = useState('')

  const slug = name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()

  const handleSubmit = async () => {
    if (!name.trim()) {
      formErrors.setFieldErrors({ name: 'กรุณาระบุชื่อหมวดหมู่' })
      toast.error('กรุณาระบุชื่อหมวดหมู่')
      return
    }

    startTransition(async () => {
      const formData = new FormData()
      formData.set('name', name)

      const result = await createBlogCategory(formData)

      if (result.fieldErrors) {
        formErrors.setFieldErrors(result.fieldErrors)
        toast.error('กรุณาตรวจสอบข้อมูล')
        return
      }

      if (result.error) {
        toast.error('เกิดข้อผิดพลาด: ' + result.error)
        return
      }

      toast.success('สร้างหมวดหมู่สำเร็จ')
      router.push('/admin/blog-categories')
    })
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Header */}
      <div className="flex items-center gap-[16px] py-[12px] mb-[20px]">
        <Link
          href="/admin/blog-categories"
          className="flex items-center gap-[6px] text-[#6b7280] hover:text-[#1f2937] font-['IBM_Plex_Sans_Thai'] text-[14px] no-underline transition-colors"
        >
          <ChevronLeftIcon />
          <span>กลับ</span>
        </Link>
        <h1 className="font-['IBM_Plex_Sans_Thai'] font-bold text-[22px] text-[#1f2937] m-0">
          หมวดหมู่ใหม่
        </h1>
      </div>

      {/* Content area */}
      <div className="flex gap-[24px] flex-1 min-h-0">
        {/* Main content (left) */}
        <div className={`flex-1 flex flex-col gap-[20px] ${isPending ? 'opacity-60 pointer-events-none' : ''}`}>
          <section className="bg-white rounded-[12px] border border-[#e8eaef] p-[24px] flex flex-col gap-[16px]">
            <div className="flex flex-col gap-[8px]">
              <label className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
                ชื่อหมวดหมู่ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  formErrors.clearError('name')
                }}
                placeholder="กรอกชื่อหมวดหมู่"
                className={inputCls(formErrors.getError('name'))}
              />
              {formErrors.getError('name') && (
                <p className="font-['IBM_Plex_Sans_Thai'] text-[12px] text-red-500 m-0">
                  {formErrors.getError('name')}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-[8px]">
              <label className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
                Slug
              </label>
              <div className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#6b7280] bg-[#f9fafb] border border-[#e8eaef] rounded-[8px] px-[14px] py-[10px]">
                {slug || '-'}
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar (right) */}
        <div className="w-[260px] shrink-0">
          <div className="sticky top-0 bg-white rounded-[12px] border border-[#e8eaef] p-[20px] flex flex-col gap-[16px]">
            <h2 className="font-['IBM_Plex_Sans_Thai'] text-[11px] font-semibold text-[#9ca3af] uppercase tracking-wider m-0">
              Entry
            </h2>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isPending}
              className="w-full px-[16px] py-[10px] rounded-[8px] bg-orange text-white font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] border-0 cursor-pointer hover:bg-[#e56f15] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              บันทึก
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
