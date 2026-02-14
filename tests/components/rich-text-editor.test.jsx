import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import RichTextEditor from '@/components/admin/RichTextEditor'

describe('RichTextEditor', () => {
  it('renders toolbar with formatting buttons', () => {
    render(<RichTextEditor content="" onChange={() => {}} />)
    expect(screen.getByRole('button', { name: /bold/i })).toBeTruthy()
    expect(screen.getByRole('button', { name: /italic/i })).toBeTruthy()
    expect(screen.getByRole('button', { name: /heading 2/i })).toBeTruthy()
  })

  it('renders with initial HTML content', () => {
    const { container } = render(
      <RichTextEditor content="<p>Hello world</p>" onChange={() => {}} />
    )
    // TipTap renders content inside .tiptap or .ProseMirror
    const editorEl = container.querySelector('.ProseMirror')
    expect(editorEl).toBeTruthy()
    expect(editorEl.textContent).toContain('Hello world')
  })

  it('renders undo and redo buttons', () => {
    render(<RichTextEditor content="" onChange={() => {}} />)
    expect(screen.getByRole('button', { name: /undo/i })).toBeTruthy()
    expect(screen.getByRole('button', { name: /redo/i })).toBeTruthy()
  })

  it('renders with custom minHeight', () => {
    const { container } = render(
      <RichTextEditor content="" onChange={() => {}} minHeight={400} />
    )
    const wrapper = container.querySelector('[data-testid="editor-wrapper"]')
    expect(wrapper).toBeTruthy()
    expect(wrapper.style.minHeight).toBe('400px')
  })

  it('renders bullet and ordered list buttons', () => {
    render(<RichTextEditor content="" onChange={() => {}} />)
    expect(screen.getByRole('button', { name: /bullet list/i })).toBeTruthy()
    expect(screen.getByRole('button', { name: /ordered list/i })).toBeTruthy()
  })

  it('renders link and image buttons', () => {
    render(<RichTextEditor content="" onChange={() => {}} />)
    expect(screen.getByRole('button', { name: /link/i })).toBeTruthy()
    expect(screen.getByRole('button', { name: /image/i })).toBeTruthy()
  })
})
