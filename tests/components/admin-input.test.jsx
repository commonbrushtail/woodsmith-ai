import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import AdminInput from '@/components/admin/AdminInput'

describe('AdminInput', () => {
  it('renders a text input with label', () => {
    render(<AdminInput label="Name" placeholder="Enter name" value="" onChange={() => {}} />)
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter name')).toBeInTheDocument()
  })

  it('shows required asterisk when required', () => {
    render(<AdminInput label="Name" required value="" onChange={() => {}} />)
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('renders a textarea when type is textarea', () => {
    render(<AdminInput type="textarea" label="Description" value="" onChange={() => {}} />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('renders a select with options', () => {
    const options = [
      { value: 'a', label: 'Option A' },
      { value: 'b', label: 'Option B' },
    ]
    render(<AdminInput type="select" label="Type" value="" onChange={() => {}} options={options} />)
    expect(screen.getByText('Option A')).toBeInTheDocument()
    expect(screen.getByText('Option B')).toBeInTheDocument()
  })

  // Error prop tests
  it('displays error message when error prop is provided', () => {
    render(<AdminInput label="Name" error="Name is required" value="" onChange={() => {}} />)
    expect(screen.getByText('Name is required')).toBeInTheDocument()
  })

  it('applies red border when error prop is provided', () => {
    render(<AdminInput label="Name" error="Required" value="" onChange={() => {}} />)
    const input = screen.getByRole('textbox')
    expect(input.className).toContain('border-red-500')
  })

  it('does not show error styling when no error', () => {
    render(<AdminInput label="Name" value="" onChange={() => {}} />)
    const input = screen.getByRole('textbox')
    expect(input.className).not.toContain('border-red-500')
  })

  it('displays error message for textarea type', () => {
    render(<AdminInput type="textarea" label="Desc" error="Too short" value="" onChange={() => {}} />)
    expect(screen.getByText('Too short')).toBeInTheDocument()
  })

  it('displays error message for select type', () => {
    render(<AdminInput type="select" label="Type" error="Please select" value="" onChange={() => {}} options={[]} />)
    expect(screen.getByText('Please select')).toBeInTheDocument()
  })
})
