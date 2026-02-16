import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { createElement } from 'react'
import FaqPageClient from '@/components/admin/FaqPageClient'

// Mock dependencies
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}))

vi.mock('@/lib/toast-context', () => ({
  useToast: () => ({ toast: { success: vi.fn(), error: vi.fn() } }),
}))

vi.mock('@/lib/actions/faq-groups', () => ({
  createFaqGroup: vi.fn(async () => ({ data: { id: 'new' }, error: null })),
  updateFaqGroup: vi.fn(async () => ({ data: {}, error: null })),
  deleteFaqGroup: vi.fn(async () => ({ error: null })),
  reorderFaqGroups: vi.fn(async () => ({ error: null })),
  toggleFaqGroupPublished: vi.fn(async () => ({ error: null })),
}))

vi.mock('@/lib/actions/faqs', () => ({
  createFaq: vi.fn(async () => ({ data: { id: 'new-faq' }, error: null })),
  updateFaq: vi.fn(async () => ({ data: {}, error: null })),
  deleteFaq: vi.fn(async () => ({ error: null })),
  reorderFaqs: vi.fn(async () => ({ error: null })),
}))

vi.mock('@/lib/upload-validation', () => ({
  validateFile: vi.fn(() => ({ valid: true })),
}))

describe('FaqPageClient', () => {
  let consoleErrorSpy

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
  })

  it('renders without hydration warnings', () => {
    const mockGroups = [
      {
        id: '1', name: 'กลุ่มสินค้า', published: true, sort_order: 0, image_url: null,
        faqs: [
          { id: 'f1', question: 'Question 1?', answer: 'Answer 1', published: true, sort_order: 0 },
        ],
      },
    ]

    render(createElement(FaqPageClient, { groups: mockGroups }))

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

  it('displays group names and FAQ questions', () => {
    const mockGroups = [
      {
        id: '1', name: 'กลุ่มสินค้า', published: true, sort_order: 0, image_url: null,
        faqs: [
          { id: 'f1', question: 'Question 1?', answer: 'Answer 1', published: true, sort_order: 0 },
          { id: 'f2', question: 'Question 2?', answer: 'Answer 2', published: false, sort_order: 1 },
        ],
      },
      {
        id: '2', name: 'กลุ่มบริการ', published: false, sort_order: 1, image_url: null,
        faqs: [],
      },
    ]

    render(createElement(FaqPageClient, { groups: mockGroups }))

    // Header
    expect(screen.getByRole('heading', { name: /คำถามที่พบบ่อย/ })).toBeInTheDocument()
    // Group count badge
    expect(screen.getByText('2 กลุ่ม')).toBeInTheDocument()
    // FAQ questions shown as collapsed labels
    expect(screen.getByText('Question 1?')).toBeInTheDocument()
    expect(screen.getByText('Question 2?')).toBeInTheDocument()
    // Published badges
    expect(screen.getAllByText('Published')).toHaveLength(1)
    expect(screen.getAllByText('Draft')).toHaveLength(1)
  })

  it('renders empty state when no groups', () => {
    render(createElement(FaqPageClient, { groups: [] }))

    expect(screen.getByText('ยังไม่มีกลุ่มคำถาม')).toBeInTheDocument()
    expect(screen.getByText('สร้างกลุ่มแรก')).toBeInTheDocument()
  })

  it('renders add group button', () => {
    render(createElement(FaqPageClient, { groups: [] }))

    expect(screen.getByText('เพิ่มกลุ่ม')).toBeInTheDocument()
  })
})
