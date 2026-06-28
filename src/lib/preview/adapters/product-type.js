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
    return {
      products: [],
      categories: [],
      productTypes: [
        {
          name: state.name || '',
          type: state.type || '',
          image_url: state.imagePreview || null,
        },
      ],
    }
  },
}

export default productTypeAdapter
