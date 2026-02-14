import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { createElement } from 'react'

// Mock the toast context
const mockRemoveToast = vi.fn()
let mockToasts = []

vi.mock('@/lib/toast-context', () => ({
  useToast: () => ({
    toasts: mockToasts,
    removeToast: mockRemoveToast,
  }),
}))

// Import after mocking
const { default: ToastContainer } = await import('@/components/Toast')

beforeEach(() => {
  vi.clearAllMocks()
  mockToasts = []
})

describe('ToastContainer', () => {
  it('renders nothing when no toasts', () => {
    mockToasts = []
    const { container } = render(createElement(ToastContainer))

    expect(container.innerHTML).toBe('')
  })

  it('renders a success toast with message', () => {
    mockToasts = [{ id: 1, type: 'success', message: 'บันทึกสำเร็จ' }]
    render(createElement(ToastContainer))

    expect(screen.getByText('บันทึกสำเร็จ')).toBeDefined()
  })

  it('renders an error toast with message', () => {
    mockToasts = [{ id: 2, type: 'error', message: 'เกิดข้อผิดพลาด' }]
    render(createElement(ToastContainer))

    expect(screen.getByText('เกิดข้อผิดพลาด')).toBeDefined()
  })

  it('renders an info toast with message', () => {
    mockToasts = [{ id: 3, type: 'info', message: 'กำลังดำเนินการ' }]
    render(createElement(ToastContainer))

    expect(screen.getByText('กำลังดำเนินการ')).toBeDefined()
  })

  it('renders multiple toasts', () => {
    mockToasts = [
      { id: 1, type: 'success', message: 'Toast 1' },
      { id: 2, type: 'error', message: 'Toast 2' },
      { id: 3, type: 'info', message: 'Toast 3' },
    ]
    render(createElement(ToastContainer))

    expect(screen.getByText('Toast 1')).toBeDefined()
    expect(screen.getByText('Toast 2')).toBeDefined()
    expect(screen.getByText('Toast 3')).toBeDefined()
  })

  it('calls removeToast when close button is clicked', () => {
    mockToasts = [{ id: 42, type: 'success', message: 'Close me' }]
    render(createElement(ToastContainer))

    const closeButton = screen.getByRole('button')
    fireEvent.click(closeButton)

    expect(mockRemoveToast).toHaveBeenCalledWith(42)
  })

  it('applies correct styles for each toast type', () => {
    mockToasts = [
      { id: 1, type: 'success', message: 'success msg' },
      { id: 2, type: 'error', message: 'error msg' },
      { id: 3, type: 'info', message: 'info msg' },
    ]
    render(createElement(ToastContainer))

    const successEl = screen.getByText('success msg').closest('div[class*="bg-"]')
    const errorEl = screen.getByText('error msg').closest('div[class*="bg-"]')
    const infoEl = screen.getByText('info msg').closest('div[class*="bg-"]')

    expect(successEl.className).toContain('bg-[#059669]')
    expect(errorEl.className).toContain('bg-[#dc2626]')
    expect(infoEl.className).toContain('bg-[#35383b]')
  })
})
