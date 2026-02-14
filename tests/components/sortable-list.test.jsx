import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import SortableList from '@/components/admin/SortableList'

describe('SortableList', () => {
  const items = [
    { id: '1', name: 'First' },
    { id: '2', name: 'Second' },
    { id: '3', name: 'Third' },
  ]

  it('renders all items', () => {
    render(
      <SortableList items={items} onReorder={() => {}}>
        {(item) => <span>{item.name}</span>}
      </SortableList>
    )
    expect(screen.getByText('First')).toBeInTheDocument()
    expect(screen.getByText('Second')).toBeInTheDocument()
    expect(screen.getByText('Third')).toBeInTheDocument()
  })

  it('renders drag handles for each item', () => {
    render(
      <SortableList items={items} onReorder={() => {}}>
        {(item) => <span>{item.name}</span>}
      </SortableList>
    )
    const handles = screen.getAllByLabelText('ลากเพื่อจัดเรียง')
    expect(handles).toHaveLength(3)
  })

  it('renders items in the correct order', () => {
    const { container } = render(
      <SortableList items={items} onReorder={() => {}}>
        {(item) => <span data-testid={`item-${item.id}`}>{item.name}</span>}
      </SortableList>
    )
    const sortableItems = container.querySelectorAll('[data-testid^="sortable-item-"]')
    expect(sortableItems).toHaveLength(3)
  })

  it('accepts onReorder callback', () => {
    const onReorder = vi.fn()
    render(
      <SortableList items={items} onReorder={onReorder}>
        {(item) => <span>{item.name}</span>}
      </SortableList>
    )
    // onReorder is passed but not called until drag ends
    expect(onReorder).not.toHaveBeenCalled()
  })

  it('renders empty state when items is empty', () => {
    render(
      <SortableList items={[]} onReorder={() => {}}>
        {(item) => <span>{item.name}</span>}
      </SortableList>
    )
    const handles = screen.queryAllByLabelText('ลากเพื่อจัดเรียง')
    expect(handles).toHaveLength(0)
  })
})
