import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { TableSkeleton, FormSkeleton, CardSkeleton } from '@/components/admin/AdminSkeleton'

describe('TableSkeleton', () => {
  it('renders with default 5 rows', () => {
    const { container } = render(<TableSkeleton />)
    const rows = container.querySelectorAll('[data-testid="skeleton-row"]')
    expect(rows.length).toBe(5)
  })

  it('renders with custom row count', () => {
    const { container } = render(<TableSkeleton rows={3} />)
    const rows = container.querySelectorAll('[data-testid="skeleton-row"]')
    expect(rows.length).toBe(3)
  })

  it('has animate-pulse class for animation', () => {
    const { container } = render(<TableSkeleton />)
    const pulseElements = container.querySelectorAll('.animate-pulse')
    expect(pulseElements.length).toBeGreaterThan(0)
  })
})

describe('FormSkeleton', () => {
  it('renders skeleton form fields', () => {
    const { container } = render(<FormSkeleton />)
    const fields = container.querySelectorAll('[data-testid="skeleton-field"]')
    expect(fields.length).toBeGreaterThan(0)
  })

  it('renders with custom field count', () => {
    const { container } = render(<FormSkeleton fields={4} />)
    const fields = container.querySelectorAll('[data-testid="skeleton-field"]')
    expect(fields.length).toBe(4)
  })

  it('has animate-pulse class', () => {
    const { container } = render(<FormSkeleton />)
    const pulseElements = container.querySelectorAll('.animate-pulse')
    expect(pulseElements.length).toBeGreaterThan(0)
  })
})

describe('CardSkeleton', () => {
  it('renders a card-shaped skeleton', () => {
    const { container } = render(<CardSkeleton />)
    expect(container.firstChild).toBeTruthy()
  })

  it('renders multiple cards with count prop', () => {
    const { container } = render(<CardSkeleton count={3} />)
    const cards = container.querySelectorAll('[data-testid="skeleton-card"]')
    expect(cards.length).toBe(3)
  })

  it('has animate-pulse class', () => {
    const { container } = render(<CardSkeleton />)
    const pulseElements = container.querySelectorAll('.animate-pulse')
    expect(pulseElements.length).toBeGreaterThan(0)
  })
})
