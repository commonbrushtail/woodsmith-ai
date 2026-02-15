/**
 * Generate page numbers array with ellipsis for pagination controls.
 * @param {number} current - Current active page (1-based)
 * @param {number} total - Total number of pages
 * @returns {Array<number|string>} Page numbers and '...' ellipsis markers
 */
export function getPageNumbers(current, total) {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1)
  if (current <= 3) return [1, 2, 3, '...', total]
  if (current >= total - 2) return [1, '...', total - 2, total - 1, total]
  return [1, '...', current - 1, current, current + 1, '...', total]
}
