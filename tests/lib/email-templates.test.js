import { describe, it, expect, vi, beforeEach } from 'vitest'
import { newQuotationNotification, quotationStatusNotification } from '@/lib/email-templates'

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
