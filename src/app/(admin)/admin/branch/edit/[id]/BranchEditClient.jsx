'use client'

import { useState, useRef, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useToast } from '@/lib/toast-context'
import { updateBranch } from '@/lib/actions/branches'
import { validateFile, ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE } from '@/lib/upload-validation'

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

export default function BranchEditClient({ branch }) {
  const { toast } = useToast()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [name, setName] = useState(branch.name || '')
  const [address, setAddress] = useState(branch.address || '')
  const [phone, setPhone] = useState(branch.phone || '')
  const [mapUrl, setMapUrl] = useState(branch.map_url || '')
  const [region, setRegion] = useState(branch.region || '')
  const [openTime, setOpenTime] = useState(() => {
    const m = (branch.hours || '').match(/(\d{1,2}:\d{2})/)
    return m ? m[1] : '08:00'
  })
  const [closeTime, setCloseTime] = useState(() => {
    const m = (branch.hours || '').match(/(\d{1,2}:\d{2})\s*น\.\s*$/u) || (branch.hours || '').match(/-\s*(\d{1,2}:\d{2})/)
    return m ? m[1] : '19:00'
  })
  const [lineUrl, setLineUrl] = useState(branch.line_url || '')
  const [imagePreview, setImagePreview] = useState(branch.image_url || null)
  const [imageFile, setImageFile] = useState(null)
  const [removeImage, setRemoveImage] = useState(false)
  const fileInputRef = useRef(null)

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const check = validateFile(file, { allowedTypes: ALLOWED_IMAGE_TYPES, maxSize: MAX_IMAGE_SIZE })
    if (!check.valid) { toast.error(check.error); return }
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    setRemoveImage(false)
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview(null)
    setRemoveImage(true)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = (publish) => {
    startTransition(async () => {
      const formData = new FormData()
      formData.set('name', name)
      formData.set('address', address)
      formData.set('phone', phone)
      formData.set('map_url', mapUrl)
      formData.set('region', region)
      formData.set('hours', `ทุกวัน ${openTime} น. - ${closeTime} น.`)
      formData.set('line_url', lineUrl)
      formData.set('published', publish ? 'true' : 'false')
      if (imageFile) formData.set('image', imageFile)
      if (removeImage) formData.set('remove_image', 'true')

      const result = await updateBranch(branch.id, formData)
      if (result.error) {
        toast.error('เกิดข้อผิดพลาด: ' + result.error)
      } else {
        router.push('/admin/branch')
        router.refresh()
      }
    })
  }

  return (
    <div className={`flex flex-col gap-0 h-full min-h-0 ${isPending ? 'opacity-60 pointer-events-none' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between py-[12px]">
        <div className="flex items-center gap-[12px]">
          <Link
            href="/admin/branch"
            className="flex items-center gap-[6px] font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#6b7280] no-underline hover:text-[#494c4f] transition-colors"
          >
            <ChevronLeftIcon size={16} color="currentColor" />
            <span>กลับ</span>
          </Link>

          <h1 className="font-['IBM_Plex_Sans_Thai'] font-bold text-[22px] text-[#1f2937] m-0">
            ช่องทางสาขา (Branch)
          </h1>

          <span className={`inline-flex items-center px-[10px] py-[2px] rounded-full font-['IBM_Plex_Sans_Thai'] text-[12px] font-medium leading-[1.8] ${
            branch.published
              ? 'bg-[#22c55e]/10 text-[#16a34a]'
              : 'bg-[#3b82f6]/10 text-[#3b82f6]'
          }`}>
            {branch.published ? 'Published' : 'Draft'}
          </span>
        </div>

        <div className="flex items-center gap-[8px]">
          <div className="flex items-center gap-[8px] border border-[#e5e7eb] rounded-[8px] px-[12px] py-[6px] cursor-pointer hover:bg-[#f9fafb] bg-white transition-colors">
            <span className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#4b5563]">Thai (th)</span>
            <ChevronDownIcon />
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

      {/* Content body */}
      <div className="flex gap-[24px] mt-[20px] flex-1 min-h-0 overflow-y-auto pb-[32px]">
        <div className="flex-1 flex flex-col gap-[24px] min-w-0">
          {/* Branch image */}
          <section className="bg-white rounded-[12px] border border-[#e8eaef] p-[24px] flex flex-col gap-[8px]">
            <label className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
              รูปภาพสาขา
            </label>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
            {imagePreview ? (
              <div className="relative w-full max-w-[320px] h-[200px] rounded-[8px] overflow-hidden bg-[#f3f4f6]">
                <img src={imagePreview} alt="Branch" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-[8px] right-[8px] size-[24px] bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center border-0 cursor-pointer z-10 transition-colors"
                  aria-label="Remove image"
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round"><path d="M2 2L8 8M8 2L2 8" /></svg>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#e5e7eb] rounded-[8px] bg-[#fafafa] flex flex-col items-center justify-center gap-[8px] py-[32px] px-[16px] cursor-pointer hover:border-orange/50 transition-colors w-full max-w-[320px]"
              >
                <div className="size-[40px] rounded-full bg-orange/10 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff7e1b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </div>
                <p className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#9ca3af] text-center m-0">คลิกเพื่ออัปโหลดรูปภาพ</p>
              </button>
            )}
          </section>

          {/* Branch name */}
          <section className="bg-white rounded-[12px] border border-[#e8eaef] p-[24px] flex flex-col gap-[8px]">
            <label htmlFor="branchName" className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
              ชื่อสาขา
            </label>
            <input
              id="branchName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="กรอกชื่อสาขา"
              className="w-full font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border border-[#e8eaef] rounded-[8px] px-[14px] py-[10px] outline-none focus:border-[#ff7e1b] focus:ring-1 focus:ring-[#ff7e1b]/20 transition-all placeholder:text-[#bfbfbf]"
            />
          </section>

          {/* Address */}
          <section className="bg-white rounded-[12px] border border-[#e8eaef] p-[24px] flex flex-col gap-[8px]">
            <label htmlFor="branchAddress" className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
              ที่อยู่
            </label>
            <textarea
              id="branchAddress"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="กรอกที่อยู่สาขา"
              rows={3}
              className="w-full font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border border-[#e8eaef] rounded-[8px] px-[14px] py-[10px] outline-none focus:border-[#ff7e1b] focus:ring-1 focus:ring-[#ff7e1b]/20 transition-all placeholder:text-[#bfbfbf] resize-y"
            />
          </section>

          {/* Phone */}
          <section className="bg-white rounded-[12px] border border-[#e8eaef] p-[24px] flex flex-col gap-[8px]">
            <label htmlFor="branchPhone" className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
              เบอร์โทรศัพท์
            </label>
            <input
              id="branchPhone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="กรอกเบอร์โทรศัพท์"
              className="w-full font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border border-[#e8eaef] rounded-[8px] px-[14px] py-[10px] outline-none focus:border-[#ff7e1b] focus:ring-1 focus:ring-[#ff7e1b]/20 transition-all placeholder:text-[#bfbfbf]"
            />
          </section>

          {/* Region */}
          <section className="bg-white rounded-[12px] border border-[#e8eaef] p-[24px] flex flex-col gap-[8px]">
            <label htmlFor="branchRegion" className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
              ภูมิภาค
            </label>
            <select
              id="branchRegion"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border border-[#e8eaef] rounded-[8px] px-[14px] py-[10px] outline-none focus:border-[#ff7e1b] focus:ring-1 focus:ring-[#ff7e1b]/20 transition-all bg-white cursor-pointer"
            >
              <option value="">เลือกภูมิภาค</option>
              <option value="ภาคกลาง">ภาคกลาง</option>
              <option value="ภาคตะวันออก">ภาคตะวันออก</option>
              <option value="ภาคเหนือ">ภาคเหนือ</option>
              <option value="ภาคตะวันออกเฉียงเหนือ">ภาคตะวันออกเฉียงเหนือ</option>
              <option value="ภาคใต้">ภาคใต้</option>
            </select>
          </section>

          {/* Hours */}
          <section className="bg-white rounded-[12px] border border-[#e8eaef] p-[24px] flex flex-col gap-[8px]">
            <label className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
              เวลาทำการ
            </label>
            <div className="flex items-center gap-[12px]">
              <input
                type="time"
                value={openTime}
                onChange={(e) => setOpenTime(e.target.value)}
                className="flex-1 font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border border-[#e8eaef] rounded-[8px] px-[14px] py-[10px] outline-none focus:border-[#ff7e1b] focus:ring-1 focus:ring-[#ff7e1b]/20 transition-all"
              />
              <span className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#9ca3af]">ถึง</span>
              <input
                type="time"
                value={closeTime}
                onChange={(e) => setCloseTime(e.target.value)}
                className="flex-1 font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border border-[#e8eaef] rounded-[8px] px-[14px] py-[10px] outline-none focus:border-[#ff7e1b] focus:ring-1 focus:ring-[#ff7e1b]/20 transition-all"
              />
            </div>
          </section>

          {/* Map URL */}
          <section className="bg-white rounded-[12px] border border-[#e8eaef] p-[24px] flex flex-col gap-[8px]">
            <label htmlFor="branchMapUrl" className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
              Google Map URL
            </label>
            <input
              id="branchMapUrl"
              type="url"
              value={mapUrl}
              onChange={(e) => setMapUrl(e.target.value)}
              placeholder="https://maps.google.com/..."
              className="w-full font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border border-[#e8eaef] rounded-[8px] px-[14px] py-[10px] outline-none focus:border-[#ff7e1b] focus:ring-1 focus:ring-[#ff7e1b]/20 transition-all placeholder:text-[#bfbfbf]"
            />
          </section>

          {/* LINE OA URL */}
          <section className="bg-white rounded-[12px] border border-[#e8eaef] p-[24px] flex flex-col gap-[8px]">
            <label htmlFor="branchLineUrl" className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
              LINE OA URL
            </label>
            <input
              id="branchLineUrl"
              type="url"
              value={lineUrl}
              onChange={(e) => setLineUrl(e.target.value)}
              placeholder="https://line.me/..."
              className="w-full font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border border-[#e8eaef] rounded-[8px] px-[14px] py-[10px] outline-none focus:border-[#ff7e1b] focus:ring-1 focus:ring-[#ff7e1b]/20 transition-all placeholder:text-[#bfbfbf]"
            />
          </section>
        </div>

        {/* Right sidebar */}
        <aside className="w-[260px] shrink-0 flex flex-col gap-[16px]">
          <div className="bg-white rounded-[12px] border border-[#e8eaef] p-[20px] flex flex-col gap-[16px]">
            <h3 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[12px] text-[#9ca3af] tracking-[0.8px] uppercase m-0">
              Entry
            </h3>

            {/* Status indicator */}
            <div className="flex items-center gap-[8px]">
              <span className={`w-[8px] h-[8px] rounded-full ${branch.published ? 'bg-green-500' : 'bg-[#9ca3af]'}`} />
              <span className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#6b7280]">
                สถานะ: {branch.published ? 'เผยแพร่แล้ว' : 'ฉบับร่าง'}
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
