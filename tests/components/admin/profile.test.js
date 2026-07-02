import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createElement } from 'react'
import { render, screen, waitFor } from '@testing-library/react'

// The admin "company profile" page was replaced by the Site Settings page.
// Its company-name field must still strip stray HTML so it never renders raw tags.
vi.mock('@/lib/actions/site-settings', () => ({
  getSiteSettings: vi.fn(),
  updateSiteSettings: vi.fn(),
}))

vi.mock('@/lib/toast-context', () => ({
  useToast: () => ({ toast: { error: vi.fn(), success: vi.fn() } }),
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn(), push: vi.fn() }),
}))

// Isolate the page under test from the (heavy) admin preview infrastructure.
vi.mock('@/components/admin/PreviewButton', () => ({ default: () => null }))
vi.mock('@/components/admin/preview/PreviewPanel', () => ({ default: () => null }))
vi.mock('@/components/admin/preview/PreviewToggle', () => ({ default: () => null }))

const SITE_SETTINGS_PAGE = '@/app/(admin)/admin/(dashboard)/site-settings/page.jsx'

describe('Site Settings Page - company name HTML stripping', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('strips HTML tags from the company name field', async () => {
    const { getSiteSettings } = await import('@/lib/actions/site-settings')
    getSiteSettings.mockResolvedValue({ data: { company_name: '<p>WoodSmith Co., Ltd.</p>' } })

    const SiteSettingsPage = (await import(SITE_SETTINGS_PAGE)).default
    render(createElement(SiteSettingsPage))

    await waitFor(() => {
      const input = screen.getByLabelText(/ชื่อบริษัท/)
      expect(input.value).toBe('WoodSmith Co., Ltd.')
      expect(input.value).not.toContain('<p>')
      expect(input.value).not.toContain('</p>')
    })
  })

  it('handles nested HTML tags in the company name', async () => {
    const { getSiteSettings } = await import('@/lib/actions/site-settings')
    getSiteSettings.mockResolvedValue({ data: { company_name: '<p><strong>Bold Company</strong> Name</p>' } })

    const SiteSettingsPage = (await import(SITE_SETTINGS_PAGE)).default
    render(createElement(SiteSettingsPage))

    await waitFor(() => {
      const input = screen.getByLabelText(/ชื่อบริษัท/)
      expect(input.value).toBe('Bold Company Name')
    })
  })

  it('handles a plain-text company name (no HTML)', async () => {
    const { getSiteSettings } = await import('@/lib/actions/site-settings')
    getSiteSettings.mockResolvedValue({ data: { company_name: 'Plain Company Name' } })

    const SiteSettingsPage = (await import(SITE_SETTINGS_PAGE)).default
    render(createElement(SiteSettingsPage))

    await waitFor(() => {
      const input = screen.getByLabelText(/ชื่อบริษัท/)
      expect(input.value).toBe('Plain Company Name')
    })
  })
})
