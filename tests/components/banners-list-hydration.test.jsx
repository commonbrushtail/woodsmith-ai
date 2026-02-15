import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { createElement } from 'react'
import BannersListClient from '@/components/admin/BannersListClient'

// Mock dependencies
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}))

vi.mock('@/lib/toast-context', () => ({
  useToast: () => ({ toast: { success: vi.fn(), error: vi.fn() } }),
}))

vi.mock('@/lib/actions/banners', () => ({
  deleteBanner: vi.fn(async () => ({ error: null })),
  toggleBannerStatus: vi.fn(async () => ({ error: null })),
  reorderBanners: vi.fn(async () => ({ error: null })),
}))

describe('BannersListClient - Hydration Safety', () => {
  let consoleErrorSpy

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
  })

  it('renders without React hydration warnings or validateDOMNesting errors', () => {
    const mockBanners = [
      { id: '1', image_url: '/banner1.jpg', link_url: '', status: 'active', sort_order: 0, created_at: '2024-01-01T00:00:00Z' },
      { id: '2', image_url: '/banner2.jpg', link_url: '', status: 'inactive', sort_order: 1, created_at: '2024-01-02T00:00:00Z' },
    ]

    render(createElement(BannersListClient, { banners: mockBanners }))

    // CRITICAL: No hydration or DOM nesting warnings
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

  it('renders drag handles for sortable items', () => {
    const mockBanners = [
      { id: '1', image_url: '/banner1.jpg', link_url: '', status: 'active', sort_order: 0, created_at: '2024-01-01T00:00:00Z' },
    ]

    render(createElement(BannersListClient, { banners: mockBanners }))

    const dragHandles = screen.getAllByLabelText('ลากเพื่อจัดเรียง')
    expect(dragHandles).toHaveLength(1)
  })
})
