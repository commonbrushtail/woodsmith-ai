import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { createElement } from 'react'
import ManualsListClient from '@/components/admin/ManualsListClient'

// Mock dependencies
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}))

vi.mock('@/lib/toast-context', () => ({
  useToast: () => ({ toast: { success: vi.fn(), error: vi.fn() } }),
}))

vi.mock('@/lib/actions/manuals', () => ({
  deleteManual: vi.fn(async () => ({ error: null })),
  toggleManualPublished: vi.fn(async () => ({ error: null })),
  reorderManuals: vi.fn(async () => ({ error: null })),
}))

describe('ManualsListClient', () => {
  let consoleErrorSpy

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
  })

  it('renders without hydration warnings', () => {
    const mockManuals = [
      { id: '1', title: 'Manual 1', pdf_url: 'https://example.com/manual1.pdf', published: true, sort_order: 0, created_at: '2024-01-01T00:00:00Z' },
      { id: '2', title: 'Manual 2', pdf_url: 'https://example.com/manual2.pdf', published: false, sort_order: 1, created_at: '2024-01-02T00:00:00Z' },
    ]

    render(createElement(ManualsListClient, { manuals: mockManuals, totalCount: 2 }))

    const hydrationWarnings = consoleErrorSpy.mock.calls.filter(call =>
      call.some(arg =>
        typeof arg === 'string' &&
        (arg.includes('Hydration') ||
         arg.includes('did not match') ||
         arg.includes('Warning: validateDOMNesting'))
      )
    )
    expect(hydrationWarnings).toHaveLength(0)
  })

  it('renders items with drag handles', () => {
    const mockManuals = [
      { id: '1', title: 'Manual 1', pdf_url: 'https://example.com/manual1.pdf', published: true, sort_order: 0, created_at: '2024-01-01T00:00:00Z' },
      { id: '2', title: 'Manual 2', pdf_url: 'https://example.com/manual2.pdf', published: false, sort_order: 1, created_at: '2024-01-02T00:00:00Z' },
    ]

    render(createElement(ManualsListClient, { manuals: mockManuals, totalCount: 2 }))

    const dragHandles = screen.getAllByLabelText('ลากเพื่อจัดเรียง')
    expect(dragHandles).toHaveLength(2)
  })

  it('displays data correctly', () => {
    const mockManuals = [
      { id: '1', title: 'Manual 1', pdf_url: 'https://example.com/manual1.pdf', published: true, sort_order: 0, created_at: '2024-01-01T00:00:00Z' },
      { id: '2', title: 'Manual 2', pdf_url: 'https://example.com/manual2.pdf', published: false, sort_order: 1, created_at: '2024-01-02T00:00:00Z' },
    ]

    render(createElement(ManualsListClient, { manuals: mockManuals, totalCount: 2 }))

    // Header text
    expect(screen.getByRole('heading', { name: /คู่มือการใช้สินค้า/ })).toBeInTheDocument()
    // Entry count
    expect(screen.getByText('2 entries found')).toBeInTheDocument()
    // Titles
    expect(screen.getByText('Manual 1')).toBeInTheDocument()
    expect(screen.getByText('Manual 2')).toBeInTheDocument()
    // Status badges
    expect(screen.getByText('เผยแพร่')).toBeInTheDocument()
    expect(screen.getByText('ไม่เผยแพร่')).toBeInTheDocument()
  })

  it('renders empty state', () => {
    render(createElement(ManualsListClient, { manuals: [], totalCount: 0 }))

    expect(screen.getByText('ไม่พบข้อมูลคู่มือ')).toBeInTheDocument()
  })
})
