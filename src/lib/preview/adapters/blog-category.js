// Preview adapter for blog categories. Blog categories surface as the tabs on
// the public /blog page, so the preview renders BlogPageClient with the current
// categories (posts left empty — the component falls back to demo cards, the
// tabs are the point).
const blogCategoryAdapter = {
  entity: 'blog-category',
  device: 'page',
  defaultViewport: 'desktop',
  component: () => import('@/app/(public)/blog/BlogPageClient'),

  toProps(state = {}) {
    return {
      categories: state.categories || [],
      posts: [],
      bannerUrl: '',
    }
  },
}

export default blogCategoryAdapter
