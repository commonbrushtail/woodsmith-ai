import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import PreviewPanel from '@/components/admin/preview/PreviewPanel'

// A trivial adapter (the real component is portaled into an iframe, which jsdom
// doesn't fully render — adapter→component integration is covered separately in
// preview-integration.test.jsx, so here we assert the panel chrome/behavior).
const fakeAdapter = {
  defaultViewport: 'desktop',
  component: () => Promise.resolve({ default: ({ title }) => <h1>{title}</h1> }),
  toProps: (s) => ({ title: s.title || '' }),
}

describe('PreviewPanel', () => {
  it('renders nothing when closed', () => {
    const { container } = render(
      <PreviewPanel adapter={fakeAdapter} formState={{ title: 'Hi' }} open={false} onClose={() => {}} />
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('opens a preview frame (iframe) when open', () => {
    render(
      <PreviewPanel adapter={fakeAdapter} formState={{ title: 'สวัสดี' }} open onClose={() => {}} />
    )
    expect(screen.getByRole('dialog', { name: 'ตัวอย่างสด' })).toBeInTheDocument()
    expect(screen.getByTitle('ตัวอย่าง')).toBeInTheDocument() // the iframe
  })

  it('sets data-preview-open on <html> while open (non-modal shift)', () => {
    const { rerender } = render(
      <PreviewPanel adapter={fakeAdapter} formState={{ title: 'x' }} open onClose={() => {}} />
    )
    expect(document.documentElement.hasAttribute('data-preview-open')).toBe(true)
    rerender(
      <PreviewPanel adapter={fakeAdapter} formState={{ title: 'x' }} open={false} onClose={() => {}} />
    )
    expect(document.documentElement.hasAttribute('data-preview-open')).toBe(false)
  })

  it('calls onClose when the close button is clicked', () => {
    const onClose = vi.fn()
    render(<PreviewPanel adapter={fakeAdapter} formState={{ title: 'x' }} open onClose={onClose} />)
    fireEvent.click(screen.getByLabelText('ปิดตัวอย่าง'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('switches viewport when the mobile toggle is clicked', () => {
    render(<PreviewPanel adapter={fakeAdapter} formState={{ title: 'x' }} open onClose={() => {}} />)
    const mobileBtn = screen.getByText('มือถือ')
    fireEvent.click(mobileBtn)
    expect(mobileBtn.className).toContain('bg-orange')
  })
})
