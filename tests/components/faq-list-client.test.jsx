import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { createElement } from 'react'
import FaqListClient from '@/components/admin/FaqListClient'

// Mock dependencies
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}))

// NOTE: FaqListClient does NOT use toast-context, so we don't mock it

vi.mock('@/lib/actions/faqs', () => ({
  deleteFaq: vi.fn(async () => ({ error: null })),
  toggleFaqPublished: vi.fn(async () => ({ error: null })),
  reorderFaqs: vi.fn(async () => ({ error: null })),
}))

describe('FaqListClient', () => {
  let consoleErrorSpy

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
  })

  it('renders without hydration warnings', () => {
    const mockFaqs = [
      { id: '1', question: 'Question 1?', answer: 'Answer 1', published: true, sort_order: 0 },
      { id: '2', question: 'Question 2?', answer: 'Answer 2', published: false, sort_order: 1 },
    ]

    render(createElement(FaqListClient, { faqs: mockFaqs, totalCount: 2 }))

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
    const mockFaqs = [
      { id: '1', question: 'Question 1?', answer: 'Answer 1', published: true, sort_order: 0 },
      { id: '2', question: 'Question 2?', answer: 'Answer 2', published: false, sort_order: 1 },
    ]

    render(createElement(FaqListClient, { faqs: mockFaqs, totalCount: 2 }))

    const dragHandles = screen.getAllByLabelText('ลากเพื่อจัดเรียง')
    expect(dragHandles).toHaveLength(2)
  })

  it('displays data correctly', () => {
    const mockFaqs = [
      { id: '1', question: 'Question 1?', answer: 'Answer 1', published: true, sort_order: 0 },
      { id: '2', question: 'Question 2?', answer: 'Answer 2', published: false, sort_order: 1 },
    ]

    render(createElement(FaqListClient, { faqs: mockFaqs, totalCount: 2 }))

    // Header text
    expect(screen.getByRole('heading', { name: /คำถามที่พบบ่อย/ })).toBeInTheDocument()
    // Questions
    expect(screen.getByText('Question 1?')).toBeInTheDocument()
    expect(screen.getByText('Question 2?')).toBeInTheDocument()
    // Status badges
    expect(screen.getByText('Published')).toBeInTheDocument()
    expect(screen.getByText('Draft')).toBeInTheDocument()
  })

  it('renders empty state', () => {
    render(createElement(FaqListClient, { faqs: [], totalCount: 0 }))

    expect(screen.getByText('ยังไม่มีคำถาม')).toBeInTheDocument()
  })
})
