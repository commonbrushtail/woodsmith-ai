// Preview adapter for categories (subcategories). A category appears as a card
// on its type's page /products/{type} (ProductCategoryPageClient), so the
// preview renders that page with the category as a subcategory card.
const categoryPageAdapter = {
  entity: 'category',
  device: 'page',
  defaultViewport: 'desktop',
  component: () => import('@/app/(public)/products/[category]/ProductCategoryPageClient'),

  toProps(state = {}) {
    // List pages pass an explicit subcategories array; the edit page passes the
    // single category's fields.
    const subcategories = state.subcategories
      ? state.subcategories
      : [{ name: state.name || '', image_url: state.imagePreview || null }]
    return {
      categorySlug: state.categorySlug || 'construction',
      products: [],
      categories: [],
      subcategories,
    }
  },
}

export default categoryPageAdapter
