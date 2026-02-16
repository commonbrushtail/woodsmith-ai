'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useToast } from '@/lib/toast-context'
import { updateQuotationStatus, updateAdminNotes } from '@/lib/actions/quotations'

/* ------------------------------------------------------------------ */
/*  SVG icon helpers                                                   */
/* ------------------------------------------------------------------ */

function ChevronDownIcon({ size = 12, color = '#6b7280' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 4.5L6 7.5L9 4.5" />
    </svg>
  )
}

function ArrowLeftIcon({ size = 20, color = '#6b7280' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  Status configuration                                               */
/* ------------------------------------------------------------------ */

const STATUS_OPTIONS = [
  {
    key: 'pending',
    label: 'รอพิจารณา',
    bg: '#dbeafe',
    text: '#1e40af',
    border: '#93c5fd',
  },
  {
    key: 'approved',
    label: 'อนุมัติใบเสนอราคา',
    bg: '#dcfce7',
    text: '#166534',
    border: '#86efac',
  },
  {
    key: 'rejected',
    label: 'ไม่อนุมัติใบเสนอราคา',
    bg: '#fee2e2',
    text: '#991b1b',
    border: '#fca5a5',
  },
]

/* ------------------------------------------------------------------ */
/*  Reusable sub-components                                            */
/* ------------------------------------------------------------------ */

function DetailRow({ label, children }) {
  return (
    <div className="flex gap-[16px] py-[8px]">
      <span className="w-[180px] shrink-0 font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#4b5563] leading-[1.6]">
        {label}
      </span>
      <span className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] leading-[1.6]">
        {children}
      </span>
    </div>
  )
}

function StatusDropdown({ status, onStatusChange, disabled }) {
  const [isOpen, setIsOpen] = useState(false)
  const current = STATUS_OPTIONS.find((s) => s.key === status) || STATUS_OPTIONS[0]

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className="inline-flex items-center gap-[6px] px-[12px] py-[4px] rounded-full border cursor-pointer transition-colors"
        style={{
          backgroundColor: current.bg,
          color: current.text,
          borderColor: current.border,
        }}
        disabled={disabled}
      >
        <span className="font-['IBM_Plex_Sans_Thai'] text-[13px] font-medium leading-[1.6]">
          {current.label}
        </span>
        <ChevronDownIcon size={12} color={current.text} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[40]"
            onClick={() => setIsOpen(false)}
          />
          <ul
            role="listbox"
            className="absolute right-0 top-full mt-[4px] z-[50] bg-white border border-[#e5e7eb] rounded-[8px] shadow-lg py-[4px] min-w-[220px]"
          >
            {STATUS_OPTIONS.map((option) => (
              <li
                key={option.key}
                role="option"
                aria-selected={option.key === status}
                onClick={() => {
                  onStatusChange(option.key)
                  setIsOpen(false)
                }}
                className="flex items-center gap-[8px] px-[12px] py-[8px] cursor-pointer hover:bg-[#f9fafb] transition-colors"
              >
                <span
                  className="inline-flex items-center px-[10px] py-[2px] rounded-full border font-['IBM_Plex_Sans_Thai'] text-[12px] font-medium leading-[1.6]"
                  style={{
                    backgroundColor: option.bg,
                    color: option.text,
                    borderColor: option.border,
                  }}
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

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function QuotationDetailClient({ quotation }) {
  const { toast } = useToast()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [adminNotes, setAdminNotes] = useState(quotation.admin_notes || '')

  function formatDate(dateStr) {
    if (!dateStr) return '-'
    try {
      const d = new Date(dateStr)
      return d.toLocaleDateString('th-TH', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return dateStr
    }
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
      if (result.error) {
        toast.error('เกิดข้อผิดพลาด: ' + result.error)
      } else {
        router.refresh()
      }
    })
  }

  return (
    <div className={`flex flex-col gap-0 h-full min-h-0 ${isPending ? 'opacity-60 pointer-events-none' : ''}`}>
      {/* Back link */}
      <Link
        href="/admin/quotations"
        className="inline-flex items-center gap-[4px] font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#ff7e1b] hover:underline no-underline py-[4px] self-start"
      >
        <ArrowLeftIcon size={16} color="#ff7e1b" />
        <span>กลับ</span>
      </Link>

      {/* Header */}
      <div className="flex items-center justify-between py-[12px]">
        <div className="flex items-center gap-[12px]">
          <h1 className="font-['IBM_Plex_Sans_Thai'] font-bold text-[22px] text-[#1f2937] m-0">
            จัดการใบเสนอราคา/ Manage Quotation
          </h1>
        </div>
      </div>

      {/* Status bar */}
      <div className="flex justify-end items-center gap-[12px] mt-[16px]">
        <span className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#4b5563]">
          สถานะการอนุมัติใบเสนอราคา:
        </span>
        <StatusDropdown
          status={quotation.status}
          onStatusChange={handleStatusChange}
          disabled={isPending}
        />
      </div>

      {/* Content + Sidebar */}
      <div className="flex gap-[24px] mt-[20px] flex-1 min-h-0 overflow-y-auto pb-[32px]">
        {/* Main content area */}
        <div className="flex-1 flex flex-col gap-[24px] min-w-0">

          {/* Section 1: Quotation Details */}
          <section className="bg-white rounded-[12px] border border-[#e8eaef] p-[24px] flex flex-col gap-[4px]">
            <h2 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[16px] text-[#1f2937] m-0 mb-[8px]">
              รายละเอียดใบเสนอราคา
            </h2>
            <DetailRow label="เลขที่ใบเสนอราคา:">
              {quotation.quotation_number}
            </DetailRow>
            <DetailRow label="วันที่ขอใบเสนอราคา:">
              {formatDate(quotation.created_at)}
            </DetailRow>
          </section>

          {/* Section 2: Requester Information */}
          <section className="bg-white rounded-[12px] border border-[#e8eaef] p-[24px] flex flex-col gap-[4px]">
            <h2 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[16px] text-[#1f2937] m-0 mb-[8px]">
              ข้อมูลผู้ขอใบเสนอราคา
            </h2>
            <DetailRow label="ชื่อ-นามสกุล:">
              {quotation.requester_name || '-'}
            </DetailRow>
            <DetailRow label="เบอร์โทรศัพท์:">
              {quotation.requester_phone || '-'}
            </DetailRow>
            <DetailRow label="อีเมล:">
              {quotation.requester_email || '-'}
            </DetailRow>
            <DetailRow label="ที่อยู่:">
              {quotation.requester_address || '-'}
            </DetailRow>
          </section>

          {/* Section 3: Product Information */}
          <section className="bg-white rounded-[12px] border border-[#e8eaef] p-[24px] flex flex-col gap-[4px]">
            <h2 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[16px] text-[#1f2937] m-0 mb-[8px]">
              ข้อมูลสินค้า
            </h2>
            <DetailRow label="รหัสสินค้า:">
              {quotation.product?.code || '-'}
            </DetailRow>
            <DetailRow label="ชื่อสินค้า:">
              {quotation.product?.name || '-'}
            </DetailRow>
            {quotation.selected_color && (
              <DetailRow label="สี:">
                {quotation.selected_color}
              </DetailRow>
            )}
            {quotation.selected_size && (
              <DetailRow label="ขนาด:">
                {quotation.selected_size}
              </DetailRow>
            )}
          </section>

          {/* Section 4: Admin Notes */}
          <section className="bg-white rounded-[12px] border border-[#e8eaef] p-[24px] flex flex-col gap-[8px]">
            <h2 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[16px] text-[#1f2937] m-0">
              หมายเหตุจากผู้ดูแล
            </h2>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="เพิ่มหมายเหตุ..."
              rows={4}
              className="w-full font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border border-[#e8eaef] rounded-[8px] px-[14px] py-[10px] outline-none focus:border-[#ff7e1b] focus:ring-1 focus:ring-[#ff7e1b]/20 transition-all placeholder:text-[#bfbfbf] resize-y"
            />
            <button
              type="button"
              onClick={handleSaveNotes}
              disabled={isPending}
              className="self-end px-[16px] py-[8px] rounded-[8px] bg-[#ff7e1b] text-white font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] border-0 cursor-pointer hover:bg-[#e56f15] transition-colors disabled:opacity-50"
            >
              {isPending ? 'กำลังบันทึก...' : 'บันทึกหมายเหตุ'}
            </button>
          </section>
        </div>
      </div>
    </div>
  )
}
