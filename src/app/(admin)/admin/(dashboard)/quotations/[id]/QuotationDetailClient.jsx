'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useToast } from '@/lib/toast-context'
import { declineQuotation, updateAdminNotes, sendQuotationResponse } from '@/lib/actions/quotations'

function ArrowLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff7e1b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  )
}

const STATUS_DISPLAY = {
  pending: { label: 'รอตอบกลับ', bg: '#eaf5ff', text: '#0c75af', border: '#b8e1ff' },
  approved: { label: 'ส่งใบเสนอราคาแล้ว', bg: '#dcfce7', text: '#166534', border: '#86efac' },
  rejected: { label: 'ปฏิเสธคำขอ', bg: '#fee2e2', text: '#991b1b', border: '#fca5a5' },
}

function StatusBadge({ status }) {
  const cfg = STATUS_DISPLAY[status] || STATUS_DISPLAY.pending
  return (
    <span
      className="inline-flex items-center px-[10px] py-[3px] rounded-[6px] border font-['IBM_Plex_Sans_Thai'] text-[15px] font-medium"
      style={{ backgroundColor: cfg.bg, color: cfg.text, borderColor: cfg.border }}
    >
      {cfg.label}
    </span>
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
  const [quoteAmount, setQuoteAmount] = useState(quotation.quoted_amount ?? '')
  const [quoteMessage, setQuoteMessage] = useState(quotation.quote_message || '')
  const [quoteFile, setQuoteFile] = useState(null)
  const [showDecline, setShowDecline] = useState(false)
  const [declineReason, setDeclineReason] = useState('')

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

  const handleDecline = () => {
    startTransition(async () => {
      const result = await declineQuotation(quotation.id, declineReason)
      if (result.error) toast.error('เกิดข้อผิดพลาด: ' + result.error)
      else { toast.success('ปฏิเสธคำขอแล้ว'); setShowDecline(false); router.refresh() }
    })
  }

  const handleSaveNotes = () => {
    startTransition(async () => {
      const result = await updateAdminNotes(quotation.id, adminNotes)
      if (result.error) toast.error('เกิดข้อผิดพลาด: ' + result.error)
      else router.refresh()
    })
  }

  const handleSendQuote = () => {
    startTransition(async () => {
      const fd = new FormData()
      fd.set('amount', quoteAmount ?? '')
      fd.set('message', quoteMessage ?? '')
      if (quoteFile) fd.set('file', quoteFile)
      const result = await sendQuotationResponse(quotation.id, fd)
      if (result.error) toast.error('เกิดข้อผิดพลาด: ' + result.error)
      else { toast.success('ส่งใบเสนอราคาให้ลูกค้าแล้ว'); setQuoteFile(null); router.refresh() }
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
          {/* Status bar (read-only — status is driven by sending or declining) */}
          <div className="flex gap-[16px] items-center justify-end pb-[16px] border-b border-[#e5e7eb]">
            <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] text-[#18191f] tracking-[0.07px]">
              สถานะใบเสนอราคา:
            </span>
            <StatusBadge status={quotation.status} />
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

        {/* Sidebar (30%): quote response + internal notes */}
        <div className="flex flex-col gap-[16px] flex-[3] sticky top-[16px]">
          {/* Quote response to customer (emails them) */}
          <div className="bg-white rounded-[5px] p-[24px] flex flex-col gap-[12px]">
            <h2 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[20px] text-[#202124] leading-[24px] m-0">
              ส่งใบเสนอราคา
            </h2>
            {quotation.quoted_at && (
              <p className="font-['IBM_Plex_Sans_Thai'] text-[12px] text-[#16a34a] m-0">
                ส่งให้ลูกค้าล่าสุด: {fmtDate(quotation.quoted_at)}
              </p>
            )}
            <label className="font-['IBM_Plex_Sans_Thai'] text-[13px] font-medium text-[#374151]">ราคาที่เสนอ (บาท)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={quoteAmount}
              onChange={(e) => setQuoteAmount(e.target.value)}
              placeholder="เช่น 12000"
              className="w-full font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border border-[#e5e7eb] rounded-[6px] px-[14px] py-[10px] outline-none focus:border-orange focus:ring-1 focus:ring-orange/20 placeholder:text-[#bfbfbf]"
            />
            <label className="font-['IBM_Plex_Sans_Thai'] text-[13px] font-medium text-[#374151]">ข้อความถึงลูกค้า</label>
            <textarea
              value={quoteMessage}
              onChange={(e) => setQuoteMessage(e.target.value)}
              placeholder="รายละเอียดใบเสนอราคา เงื่อนไข ฯลฯ"
              rows={4}
              className="w-full font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border border-[#e5e7eb] rounded-[6px] px-[14px] py-[10px] outline-none focus:border-orange focus:ring-1 focus:ring-orange/20 placeholder:text-[#bfbfbf] resize-y"
            />
            <label className="font-['IBM_Plex_Sans_Thai'] text-[13px] font-medium text-[#374151]">แนบไฟล์ใบเสนอราคา (PDF หรือรูปภาพ)</label>
            <input
              type="file"
              accept="application/pdf,image/*"
              onChange={(e) => setQuoteFile(e.target.files?.[0] || null)}
              className="w-full font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#374151] file:mr-[10px] file:py-[6px] file:px-[12px] file:rounded-[6px] file:border-0 file:bg-[#f3f4f6] file:text-[#374151] file:cursor-pointer"
            />
            {quoteFile ? (
              <p className="m-0 font-['IBM_Plex_Sans_Thai'] text-[12px] text-[#6b7280]">ไฟล์ใหม่: {quoteFile.name}</p>
            ) : quotation.quote_file_signed_url ? (
              <a
                href={quotation.quote_file_signed_url}
                target="_blank"
                rel="noopener noreferrer"
                className="m-0 font-['IBM_Plex_Sans_Thai'] text-[12px] text-orange underline"
              >
                ไฟล์ปัจจุบัน: {quotation.quote_file_name || 'ดาวน์โหลด'}
              </a>
            ) : null}
            <button
              type="button"
              onClick={handleSendQuote}
              disabled={isPending}
              className="w-full py-[10px] rounded-[6px] bg-orange text-white font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] border-0 cursor-pointer hover:bg-[#e56f15] disabled:opacity-50"
            >
              {isPending ? 'กำลังส่ง...' : 'ส่งใบเสนอราคาให้ลูกค้า'}
            </button>
            <p className="font-['IBM_Plex_Sans_Thai'] text-[12px] text-[#9ca3af] m-0">
              เมื่อส่ง ระบบจะอนุมัติคำขอและส่งอีเมลใบเสนอราคาถึงลูกค้าโดยอัตโนมัติ (อีเมลเดียว)
            </p>
          </div>

          {/* Decline request (emails the customer once) */}
          <div className="bg-white rounded-[5px] p-[24px] flex flex-col gap-[12px]">
            <h2 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[20px] text-[#202124] leading-[24px] m-0">
              ปฏิเสธคำขอ
            </h2>
            {quotation.status === 'rejected' ? (
              <div className="flex flex-col gap-[6px]">
                <p className="m-0 font-['IBM_Plex_Sans_Thai'] text-[13px] font-medium text-[#991b1b]">
                  คำขอนี้ถูกปฏิเสธแล้ว
                </p>
                {quotation.decline_reason && (
                  <p className="m-0 font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#6b7280] whitespace-pre-wrap">
                    เหตุผล: {quotation.decline_reason}
                  </p>
                )}
                {quotation.declined_at && (
                  <p className="m-0 font-['IBM_Plex_Sans_Thai'] text-[12px] text-[#9ca3af]">
                    ปฏิเสธเมื่อ: {fmtDate(quotation.declined_at)}
                  </p>
                )}
              </div>
            ) : !showDecline ? (
              <button
                type="button"
                onClick={() => setShowDecline(true)}
                disabled={isPending}
                className="w-full py-[10px] rounded-[6px] bg-white text-[#991b1b] border border-[#fca5a5] font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] cursor-pointer hover:bg-[#fef2f2] disabled:opacity-50"
              >
                ปฏิเสธคำขอ
              </button>
            ) : (
              <>
                {quotation.quoted_at && (
                  <p className="m-0 font-['IBM_Plex_Sans_Thai'] text-[12px] text-[#b45309] bg-[#fffbeb] border border-[#fde68a] rounded-[6px] px-[10px] py-[8px]">
                    ใบเสนอราคาถูกส่งไปแล้ว การปฏิเสธจะแจ้งลูกค้าว่าคำขอถูกปฏิเสธ
                  </p>
                )}
                <label className="font-['IBM_Plex_Sans_Thai'] text-[13px] font-medium text-[#374151]">เหตุผลในการปฏิเสธ (ไม่บังคับ)</label>
                <textarea
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                  placeholder="เช่น สินค้าหมด/นอกพื้นที่ให้บริการ"
                  rows={3}
                  className="w-full font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border border-[#e5e7eb] rounded-[6px] px-[14px] py-[10px] outline-none focus:border-orange focus:ring-1 focus:ring-orange/20 placeholder:text-[#bfbfbf] resize-y"
                />
                <div className="flex gap-[8px]">
                  <button
                    type="button"
                    onClick={() => { setShowDecline(false); setDeclineReason('') }}
                    disabled={isPending}
                    className="flex-1 py-[10px] rounded-[6px] bg-white text-[#374151] border border-[#e5e7eb] font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] cursor-pointer hover:bg-[#f9fafb] disabled:opacity-50"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="button"
                    onClick={handleDecline}
                    disabled={isPending}
                    className="flex-1 py-[10px] rounded-[6px] bg-[#dc2626] text-white border-0 font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] cursor-pointer hover:bg-[#b91c1c] disabled:opacity-50"
                  >
                    {isPending ? 'กำลังปฏิเสธ...' : 'ยืนยันการปฏิเสธ'}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Internal notes (not visible to customer) */}
          <div className="bg-white rounded-[5px] p-[24px] flex flex-col gap-[16px]">
            <h2 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[20px] text-[#202124] leading-[24px] m-0">
              หมายเหตุภายใน
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
              className="w-full py-[10px] rounded-[6px] bg-white text-[#374151] border border-[#e5e7eb] font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] cursor-pointer hover:bg-[#f9fafb] disabled:opacity-50"
            >
              {isPending ? 'บันทึก...' : 'บันทึกหมายเหตุ'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
