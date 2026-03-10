'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useToast } from '@/lib/toast-context'
import { updateQuotationStatus, updateAdminNotes } from '@/lib/actions/quotations'

function ChevronDownIcon({ size = 10, color = '#6b7280' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 4.5L6 7.5L9 4.5" />
    </svg>
  )
}

function ArrowLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff7e1b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  )
}

const STATUS_OPTIONS = [
  { key: 'pending', label: 'รอพิจารณา', bg: '#eaf5ff', text: '#0c75af', border: '#b8e1ff' },
  { key: 'approved', label: 'อนุมัติ', bg: '#dcfce7', text: '#166534', border: '#86efac' },
  { key: 'rejected', label: 'ไม่อนุมัติ', bg: '#fee2e2', text: '#991b1b', border: '#fca5a5' },
]

function StatusDropdown({ status, onStatusChange, disabled }) {
  const [isOpen, setIsOpen] = useState(false)
  const current = STATUS_OPTIONS.find((s) => s.key === status) || STATUS_OPTIONS[0]

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className="inline-flex items-center gap-[4px] px-[8px] py-[2px] h-[32px] rounded-[6px] border cursor-pointer"
        style={{ backgroundColor: current.bg, color: current.text, borderColor: current.border }}
        disabled={disabled}
      >
        <span className="font-['IBM_Plex_Sans_Thai'] text-[15px] font-medium">{current.label}</span>
        <ChevronDownIcon size={10} color={current.text} />
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-[40]" onClick={() => setIsOpen(false)} />
          <ul className="absolute right-0 top-full mt-[4px] z-[50] bg-white border border-[#e5e7eb] rounded-[8px] shadow-lg py-[4px] min-w-[180px] list-none m-0 p-[4px]">
            {STATUS_OPTIONS.map((option) => (
              <li
                key={option.key}
                onClick={() => { onStatusChange(option.key); setIsOpen(false) }}
                className="flex items-center gap-[8px] px-[12px] py-[6px] cursor-pointer hover:bg-[#f9fafb] rounded-[4px]"
              >
                <span
                  className="inline-flex items-center px-[8px] py-[1px] rounded-[6px] border font-['IBM_Plex_Sans_Thai'] text-[13px] font-medium"
                  style={{ backgroundColor: option.bg, color: option.text, borderColor: option.border }}
                >
                  {option.label}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

function InfoRow({ label, children }) {
  return (
    <div className="flex gap-[32px] items-start">
      <span className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-black tracking-[0.28px] w-[140px] shrink-0">{label}</span>
      <span className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-black">{children || '-'}</span>
    </div>
  )
}

export default function QuotationDetailClient({ quotation }) {
  const { toast } = useToast()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [adminNotes, setAdminNotes] = useState(quotation.admin_notes || '')

  function fmtDate(dateStr) {
    if (!dateStr) return '-'
    try {
      const d = new Date(dateStr)
      const dayName = d.toLocaleDateString('th-TH', { weekday: 'long' })
      const rest = d.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })
      const time = d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
      return `${dayName} ที่ ${rest} เวลา ${time}`
    } catch { return dateStr }
  }

  const handleStatusChange = (newStatus) => {
    startTransition(async () => {
      await updateQuotationStatus(quotation.id, newStatus)
      router.refresh()
    })
  }

  const handleSaveNotes = () => {
    startTransition(async () => {
      const result = await updateAdminNotes(quotation.id, adminNotes)
      if (result.error) toast.error('เกิดข้อผิดพลาด: ' + result.error)
      else router.refresh()
    })
  }

  // Product image
  const productImages = quotation.product?.product_images || []
  const primaryImage = productImages.find(i => i.is_primary)?.url
    || productImages.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))[0]?.url

  return (
    <div className={`flex flex-col gap-0 ${isPending ? 'opacity-60 pointer-events-none' : ''}`}>
      {/* Back link */}
      <div className="py-[12px]">
        <Link href="/admin/quotations" className="inline-flex items-center gap-[6px] no-underline">
          <ArrowLeftIcon />
          <span className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-orange">กลับ</span>
        </Link>
      </div>

      {/* Two-column layout: main card (70%) + notes sidebar (30%) */}
      <div className="flex gap-[16px] items-start">
        {/* Main card */}
        <div className="bg-white rounded-[5px] p-[24px] flex flex-col gap-[48px] flex-[7]">
          {/* Status bar */}
          <div className="flex gap-[16px] items-center justify-end pb-[16px] border-b border-[#e5e7eb]">
            <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] text-[#18191f] tracking-[0.07px]">
              สถานะการอนุมัติใบเสนอราคา:
            </span>
            <StatusDropdown status={quotation.status} onStatusChange={handleStatusChange} disabled={isPending} />
          </div>

          {/* Section: รายละเอียดใบเสนอราคา */}
          <div className="flex flex-col gap-[16px]">
            <h2 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[24px] text-[#202124] leading-[28px] m-0">
              รายละเอียดใบเสนอราคา
            </h2>
            <div className="flex flex-col gap-[16px]">
              <InfoRow label="เลขที่ใบเสนอราคา:">{quotation.quotation_number}</InfoRow>
              <InfoRow label="วันที่ขอใบเสนอราคา:">{fmtDate(quotation.created_at)}</InfoRow>
            </div>
          </div>

          {/* Section: ข้อมูลผู้ขอใบเสนอราคา */}
          <div className="flex flex-col gap-[16px]">
            <h2 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[24px] text-[#202124] leading-[28px] m-0">
              ข้อมูลผู้ขอใบเสนอราคา
            </h2>
            <div className="flex flex-col gap-[16px]">
              <InfoRow label="ชื่อ-นามสกุล:">{quotation.requester_name}</InfoRow>
              <InfoRow label="เบอร์โทรศัพท์:">{quotation.requester_phone}</InfoRow>
              <InfoRow label="อีเมล:">{quotation.requester_email}</InfoRow>
              {quotation.requester_address && (
                <InfoRow label="ที่อยู่:">{quotation.requester_address}</InfoRow>
              )}
              {quotation.message && (
                <InfoRow label="ข้อความ:">{quotation.message}</InfoRow>
              )}
            </div>
          </div>

          {/* Section: ข้อมูลสินค้า */}
          <div className="flex flex-col gap-[16px]">
            <h2 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[24px] text-[#202124] leading-[28px] m-0">
              ข้อมูลสินค้า
            </h2>
            {primaryImage && (
              <div className="size-[64px] shrink-0">
                <img alt="" className="object-contain size-full" src={primaryImage} />
              </div>
            )}
            <div className="flex flex-col gap-[16px]">
              <InfoRow label="รหัสสินค้า:">{quotation.product?.code}</InfoRow>
              <InfoRow label="ชื่อสินค้า:">
                <span className="font-medium text-[#35383b]">{quotation.product?.name}</span>
              </InfoRow>
              {Array.isArray(quotation.selected_variations) && quotation.selected_variations.length > 0 && (
                <div className="flex gap-[32px] items-start">
                  <span className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-black tracking-[0.28px] w-[140px] shrink-0">ตัวเลือกสินค้า:</span>
                  <div className="flex flex-col gap-[16px]">
                    {quotation.selected_variations.map((v) => (
                      <span key={v.label} className="font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] text-[#35383b]">
                        {v.label} {v.value}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {quotation.quantity && (
                <InfoRow label="จำนวน:">{quotation.quantity}</InfoRow>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar: หมายเหตุ (30%) */}
        <div className="bg-white rounded-[5px] p-[24px] flex flex-col gap-[16px] flex-[3] sticky top-[16px]">
          <h2 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[24px] text-[#202124] leading-[28px] m-0">
            หมายเหตุ
          </h2>
          <textarea
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            placeholder="เพิ่มหมายเหตุ..."
            rows={6}
            className="w-full font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border border-[#e5e7eb] rounded-[6px] px-[14px] py-[10px] outline-none focus:border-orange focus:ring-1 focus:ring-orange/20 placeholder:text-[#bfbfbf] resize-y"
          />
          <button
            type="button"
            onClick={handleSaveNotes}
            disabled={isPending}
            className="w-full py-[10px] rounded-[6px] bg-orange text-white font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] border-0 cursor-pointer hover:bg-[#e56f15] disabled:opacity-50"
          >
            {isPending ? 'บันทึก...' : 'บันทึก'}
          </button>
        </div>
      </div>
    </div>
  )
}
