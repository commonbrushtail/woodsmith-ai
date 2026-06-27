// Preview adapter for FAQ. Renders the public FaqPageClient with the current
// FAQ groups (the admin edits groups/items in local state, so this updates).
const faqAdapter = {
  entity: 'faq',
  device: 'page',
  defaultViewport: 'desktop',
  component: () => import('@/app/(public)/faq/FaqPageClient'),

  toProps(state = {}) {
    return { faqGroups: state.groups || [], bannerUrl: '' }
  },
}

export default faqAdapter
