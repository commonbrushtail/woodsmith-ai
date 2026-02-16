import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { createElement } from 'react'
import GalleryPageClient from '@/components/admin/GalleryPageClient'

// Mock dependencies
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}))

vi.mock('@/lib/toast-context', () => ({
  useToast: () => ({ toast: { success: vi.fn(), error: vi.fn() } }),
}))

vi.mock('@/lib/actions/gallery', () => ({
  createGalleryItems: vi.fn(async () => ({ results: [], error: null })),
  deleteGalleryItem: vi.fn(async () => ({ error: null })),
  reorderGalleryItems: vi.fn(async () => ({ error: null })),
}))

describe('GalleryPageClient', () => {
  let consoleErrorSpy

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
  })

  it('renders two sections with correct titles', () => {
    render(createElement(GalleryPageClient, { homepageItems: [], aboutItems: [] }))

    expect(screen.getByText(/แกลเลอรี่หน้าแรก/)).toBeInTheDocument()
    expect(screen.getByText(/แกลเลอรี่เกี่ยวกับเรา/)).toBeInTheDocument()
  })

  it('renders page heading', () => {
    render(createElement(GalleryPageClient, { homepageItems: [], aboutItems: [] }))

    expect(screen.getByRole('heading', { name: /แกลเลอรี่ \(Gallery\)/ })).toBeInTheDocument()
  })

  it('renders items in homepage section (shows count)', () => {
    const homepageItems = [
      { id: '1', image_url: '/img1.jpg', sort_order: 0 },
      { id: '2', image_url: '/img2.jpg', sort_order: 1 },
    ]

    render(createElement(GalleryPageClient, { homepageItems, aboutItems: [] }))

    // Verify the item count is displayed
    expect(screen.getByText('2 รูปภาพ')).toBeInTheDocument()
    // About section should show empty state
    expect(screen.getByText('ยังไม่มีรูปภาพ')).toBeInTheDocument()
  })

  it('shows empty state when no images', () => {
    render(createElement(GalleryPageClient, { homepageItems: [], aboutItems: [] }))

    const emptyTexts = screen.getAllByText('ยังไม่มีรูปภาพ')
    expect(emptyTexts).toHaveLength(2)
  })

  it('shows image counts per section', () => {
    const homepageItems = [
      { id: '1', image_url: '/img1.jpg', sort_order: 0 },
      { id: '2', image_url: '/img2.jpg', sort_order: 1 },
    ]
    const aboutItems = [
      { id: '3', image_url: '/img3.jpg', sort_order: 0 },
    ]

    render(createElement(GalleryPageClient, { homepageItems, aboutItems }))

    expect(screen.getByText('2 รูปภาพ')).toBeInTheDocument()
    expect(screen.getByText('1 รูปภาพ')).toBeInTheDocument()
  })

  it('renders upload drop zones for each section', () => {
    render(createElement(GalleryPageClient, { homepageItems: [], aboutItems: [] }))

    const uploadTexts = screen.getAllByText(/ลากไฟล์มาวาง/)
    expect(uploadTexts).toHaveLength(2)
  })

  it('renders without hydration warnings', () => {
    const homepageItems = [
      { id: '1', image_url: '/img1.jpg', sort_order: 0 },
    ]

    render(createElement(GalleryPageClient, { homepageItems, aboutItems: [] }))

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
})
