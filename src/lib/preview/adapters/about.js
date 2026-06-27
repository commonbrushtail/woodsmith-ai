// Preview adapter for the About page content. Always public (no draft state),
// so the LIVE panel is the meaningful preview. Renders the same
// AboutContentView the public about page uses.
const aboutAdapter = {
  entity: 'about',
  device: 'page',
  defaultViewport: 'desktop',
  component: () => import('@/components/AboutContentView'),

  toProps(state = {}) {
    return { html: state.companyDetail || '' }
  },
}

export default aboutAdapter
