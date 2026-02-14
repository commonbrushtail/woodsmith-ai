/**
 * Reorder an array by moving an item from one index to another.
 * Returns a new array without mutating the original.
 *
 * @param {Array} items - The items array
 * @param {number} fromIndex - Source index
 * @param {number} toIndex - Destination index
 * @returns {Array} New reordered array
 */
export function reorderItems(items, fromIndex, toIndex) {
  if (fromIndex === toIndex) return [...items]

  const result = [...items]
  const [moved] = result.splice(fromIndex, 1)
  result.splice(toIndex, 0, moved)
  return result
}

/**
 * Build sort_order update payloads from an ordered array.
 * Each item gets a sequential sort_order starting from 0.
 *
 * @param {Array<{id: string}>} items - Ordered items
 * @returns {Array<{id: string, sort_order: number}>} Update payloads
 */
export function buildSortOrderUpdates(items) {
  return items.map((item, index) => ({
    id: item.id,
    sort_order: index,
  }))
}
