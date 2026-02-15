import { describe, it, expect, vi } from 'vitest'
import { createElement } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'

// Mock dependencies
vi.mock('@/lib/toast-context', () => ({
  useToast: () => ({ toast: { error: vi.fn(), success: vi.fn() } }),
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn(), push: vi.fn() }),
}))

vi.mock('@/lib/actions/gallery', () => ({
  deleteGalleryItem: vi.fn(),
  toggleGalleryPublished: vi.fn(),
  reorderGalleryItems: vi.fn(),
}))

describe('GalleryListClient - Sort Order Display', () => {
  it('displays sort_order as 1-indexed (first item shows 1, not 0)', () => {
    const GalleryListClient = require('@/components/admin/GalleryListClient').default
    const galleries = [
      { id: '1', sort_order: 0, caption: 'First', image_url: '/img1.jpg', published: true, created_at: '2024-01-01' },
      { id: '2', sort_order: 1, caption: 'Second', image_url: '/img2.jpg', published: true, created_at: '2024-01-02' },
      { id: '3', sort_order: 2, caption: 'Third', image_url: '/img3.jpg', published: true, created_at: '2024-01-03' },
    ]

    render(createElement(GalleryListClient, { galleries, totalCount: 3 }))

    // First item should display "1" (not "0")
    const firstOrderCell = screen.getAllByText('1')[0]
    expect(firstOrderCell).toBeInTheDocument()

    // Second item should display "2" (not "1")
    const secondOrderCell = screen.getAllByText('2')[0]
    expect(secondOrderCell).toBeInTheDocument()

    // Third item should display "3" (not "2")
    const thirdOrderCell = screen.getAllByText('3')[0]
    expect(thirdOrderCell).toBeInTheDocument()

    // Should NOT display "0" anywhere in order column
    const orderCells = screen.queryByText('0')
    expect(orderCells).not.toBeInTheDocument()
  })

  it('handles empty gallery list without errors', () => {
    const GalleryListClient = require('@/components/admin/GalleryListClient').default
    render(createElement(GalleryListClient, { galleries: [], totalCount: 0 }))

    expect(screen.getByText(/ไม่พบข้อมูลแกลลอรี่/)).toBeInTheDocument()
  })

  it('handles single gallery item (displays order as 1)', () => {
    const GalleryListClient = require('@/components/admin/GalleryListClient').default
    const galleries = [
      { id: '1', sort_order: 0, caption: 'Only', image_url: '/img.jpg', published: true, created_at: '2024-01-01' },
    ]

    render(createElement(GalleryListClient, { galleries, totalCount: 1 }))

    const orderCell = screen.getByText('1')
    expect(orderCell).toBeInTheDocument()
  })
})
