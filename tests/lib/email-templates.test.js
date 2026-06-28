import { describe, it, expect, vi, beforeEach } from 'vitest'
import { newQuotationNotification, quotationStatusNotification, quotationConfirmation, quotationQuote } from '@/lib/email-templates'

describe('newQuotationNotification', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://woodsmith.co.th')
  })

  it('returns subject with quotation number', () => {
    const result = newQuotationNotification({
      quotationNumber: 'QT-20260218-0001',
      requesterName: 'สมชาย',
      requesterPhone: '0812345678',
    })
    expect(result.subject).toBe('ใบเสนอราคาใหม่ QT-20260218-0001')
  })

  it('includes requester info in html', () => {
    const result = newQuotationNotification({
      quotationNumber: 'QT-20260218-0001',
      requesterName: 'สมชาย',
      requesterPhone: '0812345678',
    })
    expect(result.html).toContain('สมชาย')
    expect(result.html).toContain('0812345678')
  })

  it('includes product name when provided', () => {
    const result = newQuotationNotification({
      quotationNumber: 'QT-20260218-0001',
      requesterName: 'สมชาย',
      requesterPhone: '0812345678',
      productName: 'ไม้สักทอง',
    })
    expect(result.html).toContain('ไม้สักทอง')
  })

  it('omits product line when not provided', () => {
    const result = newQuotationNotification({
      quotationNumber: 'QT-20260218-0001',
      requesterName: 'สมชาย',
      requesterPhone: '0812345678',
    })
    expect(result.html).not.toContain('สินค้า:')
  })

  it('includes message when provided', () => {
    const result = newQuotationNotification({
      quotationNumber: 'QT-20260218-0001',
      requesterName: 'สมชาย',
      requesterPhone: '0812345678',
      message: 'ต้องการสั่ง 100 แผ่น',
    })
    expect(result.html).toContain('ต้องการสั่ง 100 แผ่น')
  })

  it('includes admin link with site URL', () => {
    const result = newQuotationNotification({
      quotationNumber: 'QT-20260218-0001',
      requesterName: 'สมชาย',
      requesterPhone: '0812345678',
    })
    expect(result.html).toContain('https://woodsmith.co.th/admin/quotations')
  })
})

describe('quotationConfirmation', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://woodsmith.co.th')
  })

  it('confirms receipt with the quotation number', () => {
    const r = quotationConfirmation({ quotationNumber: 'QT-20260627-0007', requesterName: 'สมชาย' })
    expect(r.subject).toBe('ได้รับคำขอใบเสนอราคาแล้ว QT-20260627-0007')
    expect(r.html).toContain('QT-20260627-0007')
    expect(r.html).toContain('สมชาย')
  })

  it('links to the account page for registered users', () => {
    const r = quotationConfirmation({ quotationNumber: 'QT-1', requesterName: 'x', isRegistered: true })
    expect(r.html).toContain('https://woodsmith.co.th/account/quotations')
  })

  it('tells guests their quote will link on sign-up', () => {
    const r = quotationConfirmation({ quotationNumber: 'QT-1', requesterName: 'x', isRegistered: false })
    expect(r.html).not.toContain('/account/quotations')
    expect(r.html).toContain('สมัครสมาชิก')
  })

  it('includes product name when provided', () => {
    const r = quotationConfirmation({ quotationNumber: 'QT-1', requesterName: 'x', productName: 'ไม้สักทอง' })
    expect(r.html).toContain('ไม้สักทอง')
  })
})

describe('quotationQuote', () => {
  it('formats the quoted amount in baht', () => {
    const r = quotationQuote({ quotationNumber: 'QT-1', requesterName: 'สมชาย', quotedAmount: 12000 })
    expect(r.subject).toBe('ใบเสนอราคา QT-1')
    expect(r.html).toContain('฿12,000.00')
  })

  it('includes the quote message', () => {
    const r = quotationQuote({ quotationNumber: 'QT-1', requesterName: 'x', quoteMessage: 'ราคารวมติดตั้ง' })
    expect(r.html).toContain('ราคารวมติดตั้ง')
  })

  it('omits the amount block when no amount is given', () => {
    const r = quotationQuote({ quotationNumber: 'QT-1', requesterName: 'x', quoteMessage: 'msg' })
    expect(r.html).not.toContain('ราคาที่เสนอ')
  })

  it('includes a download link when a file is attached', () => {
    const r = quotationQuote({ quotationNumber: 'QT-1', requesterName: 'x', fileUrl: 'https://x/quote.pdf', fileName: 'quote.pdf' })
    expect(r.html).toContain('https://x/quote.pdf')
    expect(r.html).toContain('ดาวน์โหลดใบเสนอราคา')
    expect(r.html).toContain('quote.pdf')
  })

  it('omits the download link when no file', () => {
    const r = quotationQuote({ quotationNumber: 'QT-1', requesterName: 'x', quotedAmount: 100 })
    expect(r.html).not.toContain('ดาวน์โหลด')
  })
})

describe('quotationStatusNotification', () => {
  it('shows approved status in Thai', () => {
    const result = quotationStatusNotification({
      quotationNumber: 'QT-20260218-0001',
      requesterName: 'สมชาย',
      status: 'approved',
    })
    expect(result.html).toContain('อนุมัติแล้ว')
    expect(result.html).toContain('ทีมงานจะติดต่อกลับ')
  })

  it('shows rejected status in Thai', () => {
    const result = quotationStatusNotification({
      quotationNumber: 'QT-20260218-0001',
      requesterName: 'สมชาย',
      status: 'rejected',
    })
    expect(result.html).toContain('ไม่อนุมัติ')
    expect(result.html).toContain('กรุณาติดต่อเจ้าหน้าที่')
  })

  it('returns subject with quotation number', () => {
    const result = quotationStatusNotification({
      quotationNumber: 'QT-20260218-0001',
      requesterName: 'สมชาย',
      status: 'approved',
    })
    expect(result.subject).toBe('อัปเดตสถานะใบเสนอราคา QT-20260218-0001')
  })

  it('includes requester name', () => {
    const result = quotationStatusNotification({
      quotationNumber: 'QT-20260218-0001',
      requesterName: 'สมหญิง',
      status: 'approved',
    })
    expect(result.html).toContain('สมหญิง')
  })
})
