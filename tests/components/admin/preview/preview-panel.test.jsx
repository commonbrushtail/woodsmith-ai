import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import PreviewPanel from '@/components/admin/preview/PreviewPanel'

// A trivial adapter: renders the title prop, maps it from form state.
const fakeAdapter = {
  defaultViewport: 'desktop',
  component: () =>
    Promise.resolve({
      default: ({ title }) => <h1>{title}</h1>,
    }),
  toProps: (s) => ({ title: s.title || '' }),
}

describe('PreviewPanel', () => {
  it('renders nothing when closed', () => {
    const { container } = render(
      <PreviewPanel adapter={fakeAdapter} formState={{ title: 'Hi' }} open={false} onClose={() => {}} />
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('renders the public component with adapted props when open', async () => {
    render(
      <PreviewPanel adapter={fakeAdapter} formState={{ title: 'สวัสดี' }} open onClose={() => {}} />
    )
    expect(await screen.findByText('สวัสดี')).toBeInTheDocument()
  })

  it('calls onClose when the close button is clicked', async () => {
    const onClose = vi.fn()
    render(
      <PreviewPanel adapter={fakeAdapter} formState={{ title: 'x' }} open onClose={onClose} />
    )
    fireEvent.click(screen.getByLabelText('ปิดตัวอย่าง'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('switches viewport when the mobile toggle is clicked', async () => {
    render(
      <PreviewPanel adapter={fakeAdapter} formState={{ title: 'x' }} open onClose={() => {}} />
    )
    await screen.findByText('x')
    const mobileBtn = screen.getByText('มือถือ')
    fireEvent.click(mobileBtn)
    // active toggle gets the orange background class
    expect(mobileBtn.className).toContain('bg-orange')
  })
})
