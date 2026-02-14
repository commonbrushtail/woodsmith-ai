import { describe, it, expect } from 'vitest'
import { reorderItems, buildSortOrderUpdates } from '@/lib/reorder'

describe('reorderItems', () => {
  it('moves item from index 0 to index 2', () => {
    const items = [{ id: 'a' }, { id: 'b' }, { id: 'c' }]
    const result = reorderItems(items, 0, 2)
    expect(result.map(i => i.id)).toEqual(['b', 'c', 'a'])
  })

  it('moves item from index 2 to index 0', () => {
    const items = [{ id: 'a' }, { id: 'b' }, { id: 'c' }]
    const result = reorderItems(items, 2, 0)
    expect(result.map(i => i.id)).toEqual(['c', 'a', 'b'])
  })

  it('returns same order if from === to', () => {
    const items = [{ id: 'a' }, { id: 'b' }]
    const result = reorderItems(items, 0, 0)
    expect(result.map(i => i.id)).toEqual(['a', 'b'])
  })

  it('does not mutate the original array', () => {
    const items = [{ id: 'a' }, { id: 'b' }, { id: 'c' }]
    const original = [...items]
    reorderItems(items, 0, 2)
    expect(items.map(i => i.id)).toEqual(original.map(i => i.id))
  })

  it('handles single-item array', () => {
    const items = [{ id: 'a' }]
    const result = reorderItems(items, 0, 0)
    expect(result.map(i => i.id)).toEqual(['a'])
  })

  it('handles adjacent swap', () => {
    const items = [{ id: 'a' }, { id: 'b' }, { id: 'c' }]
    const result = reorderItems(items, 0, 1)
    expect(result.map(i => i.id)).toEqual(['b', 'a', 'c'])
  })
})

describe('buildSortOrderUpdates', () => {
  it('generates updates with sequential sort_order values starting at 0', () => {
    const items = [{ id: 'b' }, { id: 'c' }, { id: 'a' }]
    const updates = buildSortOrderUpdates(items)
    expect(updates).toEqual([
      { id: 'b', sort_order: 0 },
      { id: 'c', sort_order: 1 },
      { id: 'a', sort_order: 2 },
    ])
  })

  it('returns empty array for empty input', () => {
    expect(buildSortOrderUpdates([])).toEqual([])
  })

  it('works with single item', () => {
    const items = [{ id: 'x' }]
    expect(buildSortOrderUpdates(items)).toEqual([{ id: 'x', sort_order: 0 }])
  })
})
