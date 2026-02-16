import { describe, it, expect, vi } from 'vitest'
import { createElement } from 'react'
import { render, screen } from '@testing-library/react'

// Mock dependencies
vi.mock('@/lib/toast-context', () => ({
  useToast: () => ({ toast: { error: vi.fn(), success: vi.fn() } }),
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn(), push: vi.fn() }),
}))

vi.mock('@/lib/actions/gallery', () => ({
  createGalleryItems: vi.fn(async () => ({ results: [], error: null })),
  deleteGalleryItem: vi.fn(async () => ({ error: null })),
  reorderGalleryItems: vi.fn(async () => ({ error: null })),
}))

describe('GalleryPageClient - Section Rendering', () => {
  it('renders homepage and about sections separately', async () => {
    const GalleryPageClient = (await import('@/components/admin/GalleryPageClient')).default
    const homepageItems = [
      { id: '1', image_url: '/img1.jpg', sort_order: 0 },
      { id: '2', image_url: '/img2.jpg', sort_order: 1 },
    ]
    const aboutItems = [
      { id: '3', image_url: '/img3.jpg', sort_order: 0 },
    ]

    render(createElement(GalleryPageClient, { homepageItems, aboutItems }))

    expect(screen.getByText(/แกลเลอรี่หน้าแรก/)).toBeInTheDocument()
    expect(screen.getByText(/แกลเลอรี่เกี่ยวกับเรา/)).toBeInTheDocument()
    expect(screen.getByText('2 รูปภาพ')).toBeInTheDocument()
    expect(screen.getByText('1 รูปภาพ')).toBeInTheDocument()
  })

  it('handles empty sections without errors', async () => {
    const GalleryPageClient = (await import('@/components/admin/GalleryPageClient')).default
    render(createElement(GalleryPageClient, { homepageItems: [], aboutItems: [] }))

    const emptyTexts = screen.getAllByText('ยังไม่มีรูปภาพ')
    expect(emptyTexts).toHaveLength(2)
  })

  it('shows upload zones in both sections', async () => {
    const GalleryPageClient = (await import('@/components/admin/GalleryPageClient')).default
    render(createElement(GalleryPageClient, { homepageItems: [], aboutItems: [] }))

    const uploadTexts = screen.getAllByText(/ลากไฟล์มาวาง/)
    expect(uploadTexts).toHaveLength(2)
  })
})
