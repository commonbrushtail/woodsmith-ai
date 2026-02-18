'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useToast } from '@/lib/toast-context'
import { updateQuotationStatus, updateAdminNotes } from '@/lib/actions/quotations'

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

const STATUS_OPTIONS = [
  { key: 'pending', label: 'รอพิจารณา', bg: '#dbeafe', text: '#1e40af', border: '#93c5fd' },
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
        className="inline-flex items-center gap-[6px] px-[10px] py-[3px] rounded-full border cursor-pointer"
        style={{ backgroundColor: current.bg, color: current.text, borderColor: current.border }}
        disabled={disabled}
      >
        <span className="font-['IBM_Plex_Sans_Thai'] text-[12px] font-medium">{current.label}</span>
        <ChevronDownIcon size={10} color={current.text} />
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-[40]" onClick={() => setIsOpen(false)} />
          <ul className="absolute right-0 top-full mt-[4px] z-[50] bg-white border border-[#e5e7eb] rounded-[8px] shadow-lg py-[4px] min-w-[180px]">
            {STATUS_OPTIONS.map((option) => (
              <li
                key={option.key}
                onClick={() => { onStatusChange(option.key); setIsOpen(false) }}
                className="flex items-center gap-[8px] px-[12px] py-[6px] cursor-pointer hover:bg-[#f9fafb]"
              >
                <span
                  className="inline-flex items-center px-[8px] py-[1px] rounded-full border font-['IBM_Plex_Sans_Thai'] text-[11px] font-medium"
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

function Field({ label, value }) {
  return (
    <div className="flex flex-col gap-[1px]">
      <span className="font-['IBM_Plex_Sans_Thai'] text-[11px] text-[#9ca3af] leading-[1.4]">{label}</span>
      <span className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] leading-[1.4]">{value || '-'}</span>
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
      return new Date(dateStr).toLocaleDateString('th-TH', {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
      })
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

  return (
    <div className={`flex flex-col gap-[12px] ${isPending ? 'opacity-60 pointer-events-none' : ''}`}>
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[12px]">
          <Link href="/admin/quotations" className="flex items-center no-underline text-orange hover:underline">
            <ArrowLeftIcon size={16} color="#ff7e1b" />
          </Link>
          <h1 className="font-['IBM_Plex_Sans_Thai'] font-bold text-[20px] text-[#1f2937] m-0">
            {quotation.quotation_number}
          </h1>
          <StatusDropdown status={quotation.status} onStatusChange={handleStatusChange} disabled={isPending} />
        </div>
        <span className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#9ca3af]">
          {fmtDate(quotation.created_at)}
        </span>
      </div>

      {/* Main content — two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-[12px]">
        {/* Left: Requester + Product */}
        <section className="bg-white rounded-[8px] border border-[#e8eaef] p-[16px] flex flex-col gap-[12px]">
          <h2 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[14px] text-[#6b7280] m-0 uppercase tracking-[0.5px]">
            ผู้ขอใบเสนอราคา
          </h2>
          <div className="grid grid-cols-2 gap-x-[24px] gap-y-[10px]">
            <Field label="ชื่อ" value={quotation.requester_name} />
            <Field label="โทร" value={quotation.requester_phone} />
            <Field label="อีเมล" value={quotation.requester_email} />
            <Field label="ที่อยู่" value={quotation.requester_address} />
          </div>
          {quotation.message && (
            <div className="border-t border-[#f3f4f6] pt-[8px]">
              <Field label="ข้อความ" value={quotation.message} />
            </div>
          )}
        </section>

        {/* Right: Product info */}
        <section className="bg-white rounded-[8px] border border-[#e8eaef] p-[16px] flex flex-col gap-[12px]">
          <h2 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[14px] text-[#6b7280] m-0 uppercase tracking-[0.5px]">
            สินค้า
          </h2>
          <div className="grid grid-cols-2 gap-x-[24px] gap-y-[10px]">
            <Field label="รหัสสินค้า" value={quotation.product?.code} />
            <Field label="ชื่อสินค้า" value={quotation.product?.name} />
            {quotation.selected_color && <Field label="สี" value={quotation.selected_color} />}
            {quotation.selected_size && <Field label="ขนาด" value={quotation.selected_size} />}
            {quotation.quantity && <Field label="จำนวน" value={quotation.quantity} />}
            {Array.isArray(quotation.selected_variations) && quotation.selected_variations.map((v) => (
              <Field key={v.label} label={v.label} value={v.value} />
            ))}
          </div>
        </section>
      </div>

      {/* Admin notes — compact */}
      <section className="bg-white rounded-[8px] border border-[#e8eaef] p-[16px] flex flex-col gap-[8px]">
        <h2 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[14px] text-[#6b7280] m-0 uppercase tracking-[0.5px]">
          หมายเหตุ
        </h2>
        <div className="flex gap-[8px] items-start">
          <textarea
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            placeholder="เพิ่มหมายเหตุ..."
            rows={2}
            className="flex-1 font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#1f2937] border border-[#e8eaef] rounded-[6px] px-[10px] py-[8px] outline-none focus:border-orange focus:ring-1 focus:ring-orange/20 placeholder:text-[#bfbfbf] resize-y"
          />
          <button
            type="button"
            onClick={handleSaveNotes}
            disabled={isPending}
            className="px-[14px] py-[8px] rounded-[6px] bg-orange text-white font-['IBM_Plex_Sans_Thai'] font-medium text-[13px] border-0 cursor-pointer hover:bg-[#e56f15] disabled:opacity-50 shrink-0"
          >
            {isPending ? 'บันทึก...' : 'บันทึก'}
          </button>
        </div>
      </section>
    </div>
  )
}
