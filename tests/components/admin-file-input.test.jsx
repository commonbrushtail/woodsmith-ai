import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import AdminFileInput from '@/components/admin/AdminFileInput'

describe('AdminFileInput', () => {
  it('renders label and upload area', () => {
    render(<AdminFileInput label="รูปภาพ" onChange={() => {}} />)
    expect(screen.getByText('รูปภาพ')).toBeTruthy()
    expect(screen.getByText(/คลิกเพื่ออัปโหลด/)).toBeTruthy()
  })

  it('renders required asterisk when required', () => {
    render(<AdminFileInput label="รูปภาพ" required onChange={() => {}} />)
    expect(screen.getByText('*')).toBeTruthy()
  })

  it('shows accepted file types hint', () => {
    render(<AdminFileInput label="รูปภาพ" accept="image" onChange={() => {}} />)
    expect(screen.getByText(/JPG, PNG, WebP/i)).toBeTruthy()
  })

  it('shows PDF hint for pdf accept type', () => {
    render(<AdminFileInput label="เอกสาร" accept="pdf" onChange={() => {}} />)
    expect(screen.getByText(/PDF/)).toBeTruthy()
  })

  it('displays image preview when previewUrl is provided', () => {
    render(<AdminFileInput label="รูปภาพ" previewUrl="https://example.com/img.jpg" onChange={() => {}} />)
    const img = screen.getByRole('img')
    expect(img.getAttribute('src')).toBe('https://example.com/img.jpg')
  })

  it('shows file name when fileName is provided', () => {
    render(<AdminFileInput label="เอกสาร" fileName="report.pdf" onChange={() => {}} />)
    expect(screen.getByText('report.pdf')).toBeTruthy()
  })

  it('shows remove button when previewUrl or fileName is present', () => {
    render(<AdminFileInput label="รูปภาพ" previewUrl="https://example.com/img.jpg" onChange={() => {}} onRemove={() => {}} />)
    expect(screen.getByRole('button', { name: /ลบ/ })).toBeTruthy()
  })

  it('calls onRemove when remove button is clicked', () => {
    const onRemove = vi.fn()
    render(<AdminFileInput label="รูปภาพ" previewUrl="https://example.com/img.jpg" onChange={() => {}} onRemove={onRemove} />)
    fireEvent.click(screen.getByRole('button', { name: /ลบ/ }))
    expect(onRemove).toHaveBeenCalledOnce()
  })

  it('shows validation error message', () => {
    render(<AdminFileInput label="รูปภาพ" error="ประเภทไฟล์ไม่ถูกต้อง" onChange={() => {}} />)
    expect(screen.getByText('ประเภทไฟล์ไม่ถูกต้อง')).toBeTruthy()
  })

  it('applies error border style when error is present', () => {
    const { container } = render(<AdminFileInput label="รูปภาพ" error="error" onChange={() => {}} />)
    const dropZone = container.querySelector('[data-testid="drop-zone"]')
    expect(dropZone.className).toContain('border-red-500')
  })
})
