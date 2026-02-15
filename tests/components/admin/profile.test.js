import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createElement } from 'react'
import { render, screen, waitFor } from '@testing-library/react'

// Mock dependencies
vi.mock('@/lib/actions/profile', () => ({
  getCompanyProfile: vi.fn(),
  updateCompanyProfile: vi.fn(),
}))

vi.mock('@/lib/toast-context', () => ({
  useToast: () => ({ toast: { error: vi.fn(), success: vi.fn() } }),
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn(), push: vi.fn() }),
}))

describe('Profile Page - HTML Stripping', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('strips HTML tags from company name field', async () => {
    const { getCompanyProfile } = await import('@/lib/actions/profile')
    getCompanyProfile.mockResolvedValue({
      data: {
        companyName: '<p>WoodSmith Co., Ltd.</p>',
        setKey: 'test-key',
        setRecommendedKey: 'test-rec',
        setTip: 'test-tip',
      },
    })

    const ProfilePage = (await import('@/app/(admin)/admin/profile/page.jsx')).default
    render(createElement(ProfilePage))

    await waitFor(() => {
      const input = screen.getByLabelText(/ชื่อบริษัท/)
      expect(input.value).toBe('WoodSmith Co., Ltd.')
      expect(input.value).not.toContain('<p>')
      expect(input.value).not.toContain('</p>')
    })
  })

  it('handles nested HTML tags in company name', async () => {
    const { getCompanyProfile } = await import('@/lib/actions/profile')
    getCompanyProfile.mockResolvedValue({
      data: {
        companyName: '<p><strong>Bold Company</strong> Name</p>',
        setKey: 'key',
        setRecommendedKey: 'rec',
        setTip: 'tip',
      },
    })

    const ProfilePage = (await import('@/app/(admin)/admin/profile/page.jsx')).default
    render(createElement(ProfilePage))

    await waitFor(() => {
      const input = screen.getByLabelText(/ชื่อบริษัท/)
      expect(input.value).toBe('Bold Company Name')
    })
  })

  it('handles plain text company name (no HTML)', async () => {
    const { getCompanyProfile } = await import('@/lib/actions/profile')
    getCompanyProfile.mockResolvedValue({
      data: {
        companyName: 'Plain Company Name',
        setKey: 'key',
        setRecommendedKey: 'rec',
        setTip: 'tip',
      },
    })

    const ProfilePage = (await import('@/app/(admin)/admin/profile/page.jsx')).default
    render(createElement(ProfilePage))

    await waitFor(() => {
      const input = screen.getByLabelText(/ชื่อบริษัท/)
      expect(input.value).toBe('Plain Company Name')
    })
  })
})
