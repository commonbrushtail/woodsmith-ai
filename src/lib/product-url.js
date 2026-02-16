/**
 * Build a SEO-friendly product URL from product data.
 * URL format: /products/{type}/{category-slug}/{product-slug}
 *
 * @param {Object} product - needs: type, category, slug
 * @returns {string} The hierarchical product URL
 */
export function getProductUrl(product) {
  if (!product?.slug) return '#'
  const typeSlug = product.type || 'construction'
  const categorySlug = (product.category || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\u0E00-\u0E7Fa-z0-9-]/g, '')
  return encodeURI(`/products/${typeSlug}/${categorySlug}/${product.slug}`)
}
