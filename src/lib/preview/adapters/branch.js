// Preview adapter for branches. Renders the public BranchesPageClient with the
// single branch being edited (region tab defaults to "all", so it shows).
const branchAdapter = {
  entity: 'branch',
  device: 'page',
  defaultViewport: 'desktop',
  component: () => import('@/app/(public)/branches/BranchesPageClient'),

  toProps(state = {}) {
    return {
      branches: [
        {
          id: state.id || 'preview',
          name: state.name || '',
          address: state.address || '',
          phone: state.phone || '',
          region: state.region || '',
          map_url: state.mapUrl || '',
          line_url: state.lineUrl || '',
          image_url: state.imagePreview || null,
          open_time: state.openTime || '',
          close_time: state.closeTime || '',
          is_hq: false,
        },
      ],
      hqBranch: null,
    }
  },
}

export default branchAdapter
