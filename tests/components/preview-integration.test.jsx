import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import LegalContentView from '@/components/LegalContentView'
import AboutContentView from '@/components/AboutContentView'
import legalAdapter from '@/lib/preview/adapters/legal'
import aboutAdapter from '@/lib/preview/adapters/about'

// Integration: feed the adapter's output straight into the REAL shared public
// component (the same one production renders) and assert the result. This is
// what the live preview panel does, minus the dynamic import.

describe('legal preview adapter -> LegalContentView', () => {
  it('renders the title and sanitized content from live form state', () => {
    const props = legalAdapter.toProps({
      slug: 'privacy',
      content: '<p>นโยบาย</p><script>alert(1)</script>',
    })
    render(<LegalContentView {...props} />)

    expect(screen.getByText('นโยบายความเป็นส่วนตัว')).toBeInTheDocument()
    expect(screen.getByText('นโยบาย')).toBeInTheDocument()
    // The sanitizer must strip script tags in the preview, exactly as in prod.
    expect(document.querySelector('script')).toBeNull()
  })
})

describe('about preview adapter -> AboutContentView', () => {
  it('renders the about heading and the live rich-text body', () => {
    const props = aboutAdapter.toProps({ companyDetail: '<p>เกี่ยวกับบริษัท</p>' })
    render(<AboutContentView {...props} />)

    expect(screen.getByText('เกี่ยวกับเรา')).toBeInTheDocument()
    expect(screen.getByText('เกี่ยวกับบริษัท')).toBeInTheDocument()
  })
})
