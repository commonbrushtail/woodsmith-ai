import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { createElement } from 'react'

// Mock dynamic imports used by SearchOverlay
vi.mock('@/lib/actions/search', () => ({
  getRecommendedProducts: vi.fn().mockResolvedValue([]),
  getPopularCategories: vi.fn().mockResolvedValue([]),
  searchAll: vi.fn().mockResolvedValue({ products: [], posts: [] }),
}))

const { default: SearchOverlay } = await import('@/components/SearchOverlay')

beforeEach(() => {
  vi.clearAllMocks()
  // Reset body overflow
  document.body.style.overflow = ''
  localStorage.clear()
})

describe('SearchOverlay', () => {
  it('renders nothing when isOpen is false', () => {
    const { container } = render(createElement(SearchOverlay, { isOpen: false, onClose: vi.fn() }))
    expect(container.innerHTML).toBe('')
  })

  it('renders overlay when isOpen is true', () => {
    render(createElement(SearchOverlay, { isOpen: true, onClose: vi.fn() }))
    // Should have a search input with the placeholder
    const input = screen.getAllByPlaceholderText('กำลังมองหาสินค้าอะไร? ค้นหาเลย...')
    expect(input.length).toBeGreaterThan(0)
  })

  it('locks body scroll when open', () => {
    render(createElement(SearchOverlay, { isOpen: true, onClose: vi.fn() }))
    expect(document.body.style.overflow).toBe('hidden')
  })

  it('restores body scroll when unmounted', () => {
    const { unmount } = render(createElement(SearchOverlay, { isOpen: true, onClose: vi.fn() }))
    expect(document.body.style.overflow).toBe('hidden')

    unmount()
    expect(document.body.style.overflow).toBe('')
  })

  it('calls onClose when Escape is pressed', () => {
    const onClose = vi.fn()
    render(createElement(SearchOverlay, { isOpen: true, onClose }))

    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onClose).toHaveBeenCalled()
  })

  it('calls onClose when backdrop is clicked', () => {
    const onClose = vi.fn()
    render(createElement(SearchOverlay, { isOpen: true, onClose }))

    // Backdrop is the first div with bg-black/25 class
    const backdrop = document.querySelector('.backdrop-blur-\\[4px\\]')
    if (backdrop) fireEvent.click(backdrop)
    expect(onClose).toHaveBeenCalled()
  })

  it('shows close button text', () => {
    render(createElement(SearchOverlay, { isOpen: true, onClose: vi.fn() }))
    // Both mobile and desktop close buttons say "ปิด"
    const closeTexts = screen.getAllByText('ปิด')
    expect(closeTexts.length).toBeGreaterThan(0)
  })

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn()
    render(createElement(SearchOverlay, { isOpen: true, onClose }))

    // Find the close button by its text
    const closeButtons = screen.getAllByText('ปิด')
    fireEvent.click(closeButtons[0])
    expect(onClose).toHaveBeenCalled()
  })

  it('shows recent searches from localStorage', () => {
    localStorage.setItem('woodsmith_recent_searches', JSON.stringify(['ไม้สัก', 'กระเบื้อง']))

    render(createElement(SearchOverlay, { isOpen: true, onClose: vi.fn() }))

    expect(screen.getByText('การค้นหาล่าสุด')).toBeDefined()
    expect(screen.getByText('ไม้สัก')).toBeDefined()
    expect(screen.getByText('กระเบื้อง')).toBeDefined()
  })

  it('does not show recent searches section when empty', () => {
    render(createElement(SearchOverlay, { isOpen: true, onClose: vi.fn() }))
    expect(screen.queryByText('การค้นหาล่าสุด')).toBeNull()
  })
})
