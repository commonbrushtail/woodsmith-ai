import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { createElement } from 'react'
import VideoHighlightsListClient from '@/components/admin/VideoHighlightsListClient'

// Mock dependencies
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}))

vi.mock('@/lib/toast-context', () => ({
  useToast: () => ({ toast: { success: vi.fn(), error: vi.fn() } }),
}))

vi.mock('@/lib/actions/video-highlights', () => ({
  deleteVideoHighlight: vi.fn(async () => ({ error: null })),
  toggleVideoHighlightPublished: vi.fn(async () => ({ error: null })),
  reorderVideoHighlights: vi.fn(async () => ({ error: null })),
}))

describe('VideoHighlightsListClient', () => {
  let consoleErrorSpy

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
  })

  it('renders without hydration warnings', () => {
    const mockHighlights = [
      { id: '1', title: 'Highlight 1', video_url: 'https://example.com/video1', published: true, sort_order: 0, created_at: '2024-01-01T00:00:00Z' },
      { id: '2', title: 'Highlight 2', video_url: 'https://example.com/video2', published: false, sort_order: 1, created_at: '2024-01-02T00:00:00Z' },
    ]

    render(createElement(VideoHighlightsListClient, { highlights: mockHighlights, totalCount: 2 }))

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
    const mockHighlights = [
      { id: '1', title: 'Highlight 1', video_url: 'https://example.com/video1', published: true, sort_order: 0, created_at: '2024-01-01T00:00:00Z' },
      { id: '2', title: 'Highlight 2', video_url: 'https://example.com/video2', published: false, sort_order: 1, created_at: '2024-01-02T00:00:00Z' },
    ]

    render(createElement(VideoHighlightsListClient, { highlights: mockHighlights, totalCount: 2 }))

    const dragHandles = screen.getAllByLabelText('ลากเพื่อจัดเรียง')
    expect(dragHandles).toHaveLength(2)
  })

  it('displays data correctly', () => {
    const mockHighlights = [
      { id: '1', title: 'Highlight 1', video_url: 'https://example.com/video1', published: true, sort_order: 0, created_at: '2024-01-01T00:00:00Z' },
      { id: '2', title: 'Highlight 2', video_url: 'https://example.com/video2', published: false, sort_order: 1, created_at: '2024-01-02T00:00:00Z' },
    ]

    render(createElement(VideoHighlightsListClient, { highlights: mockHighlights, totalCount: 2 }))

    // Header text
    expect(screen.getByText(/วิดีโอไฮไลท์/)).toBeInTheDocument()
    // Entry count
    expect(screen.getByText('2 entries found')).toBeInTheDocument()
    // Titles
    expect(screen.getByText('Highlight 1')).toBeInTheDocument()
    expect(screen.getByText('Highlight 2')).toBeInTheDocument()
    // Status badges
    expect(screen.getByText('เผยแพร่')).toBeInTheDocument()
    expect(screen.getByText('ไม่เผยแพร่')).toBeInTheDocument()
  })

  it('renders empty state', () => {
    render(createElement(VideoHighlightsListClient, { highlights: [], totalCount: 0 }))

    expect(screen.getByText('ไม่พบข้อมูลวิดีโอไฮไลท์')).toBeInTheDocument()
  })
})
