// Preview adapter for product types. A product type appears as a big card on
// the public /products page, so the preview renders that page (ProductsPageClient)
// with the type being edited as its card — the admin sees exactly where/how it
// shows up. (Item count is derived from categories, which aren't in the editor,
// so it reads "0 รายการ" in preview.)
const productTypeAdapter = {
  entity: 'product-type',
  device: 'page',
  defaultViewport: 'desktop',
  component: () => import('@/app/(public)/products/ProductsPageClient'),

  toProps(state = {}) {
    // List pages pass an explicit productTypes array; the edit page passes the
    // single type's fields, which we wrap into a one-card list.
    const productTypes = state.productTypes
      ? state.productTypes
      : [{ name: state.name || '', type: state.type || '', image_url: state.imagePreview || null }]
    return { products: [], categories: [], productTypes }
  },
}

export default productTypeAdapter
