import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { createElement } from 'react'
import GalleryListClient from '@/components/admin/GalleryListClient'

// Mock dependencies
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}))

vi.mock('@/lib/toast-context', () => ({
  useToast: () => ({ toast: { success: vi.fn(), error: vi.fn() } }),
}))

vi.mock('@/lib/actions/gallery', () => ({
  deleteGalleryItem: vi.fn(async () => ({ error: null })),
  toggleGalleryPublished: vi.fn(async () => ({ error: null })),
  reorderGalleryItems: vi.fn(async () => ({ error: null })),
}))

describe('GalleryListClient', () => {
  let consoleErrorSpy

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
  })

  it('renders without hydration warnings', () => {
    const mockGalleries = [
      { id: '1', caption: 'Gallery 1', image_url: '/gallery1.jpg', published: true, sort_order: 0, created_at: '2024-01-01T00:00:00Z' },
      { id: '2', caption: 'Gallery 2', image_url: '/gallery2.jpg', published: false, sort_order: 1, created_at: '2024-01-02T00:00:00Z' },
    ]

    render(createElement(GalleryListClient, { galleries: mockGalleries, totalCount: 2 }))

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
    const mockGalleries = [
      { id: '1', caption: 'Gallery 1', image_url: '/gallery1.jpg', published: true, sort_order: 0, created_at: '2024-01-01T00:00:00Z' },
      { id: '2', caption: 'Gallery 2', image_url: '/gallery2.jpg', published: false, sort_order: 1, created_at: '2024-01-02T00:00:00Z' },
    ]

    render(createElement(GalleryListClient, { galleries: mockGalleries, totalCount: 2 }))

    const dragHandles = screen.getAllByLabelText('ลากเพื่อจัดเรียง')
    expect(dragHandles).toHaveLength(2)
  })

  it('displays data correctly', () => {
    const mockGalleries = [
      { id: '1', caption: 'Gallery 1', image_url: '/gallery1.jpg', published: true, sort_order: 0, created_at: '2024-01-01T00:00:00Z' },
      { id: '2', caption: 'Gallery 2', image_url: '/gallery2.jpg', published: false, sort_order: 1, created_at: '2024-01-02T00:00:00Z' },
    ]

    render(createElement(GalleryListClient, { galleries: mockGalleries, totalCount: 2 }))

    // Header text (use getByRole to be more specific)
    expect(screen.getByRole('heading', { name: /แกลลอรี่/ })).toBeInTheDocument()
    // Entry count
    expect(screen.getByText('2 entries found')).toBeInTheDocument()
    // Captions
    expect(screen.getByText('Gallery 1')).toBeInTheDocument()
    expect(screen.getByText('Gallery 2')).toBeInTheDocument()
    // Status badges (both should be present)
    expect(screen.getByText('เผยแพร่')).toBeInTheDocument()
    expect(screen.getByText('ไม่เผยแพร่')).toBeInTheDocument()
  })

  it('renders empty state', () => {
    render(createElement(GalleryListClient, { galleries: [], totalCount: 0 }))

    expect(screen.getByText('ไม่พบข้อมูลแกลลอรี่')).toBeInTheDocument()
  })
})
