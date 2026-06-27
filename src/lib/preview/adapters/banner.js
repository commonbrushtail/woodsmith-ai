// Preview adapter for hero banners. Renders the public HeroSection with the
// single banner being edited as its one slide.
const bannerAdapter = {
  entity: 'banner',
  device: 'section',
  defaultViewport: 'desktop',
  component: () => import('@/components/HeroSection'),

  toProps(state = {}) {
    return {
      banners: [{ image_url: state.imagePreview || '', link_url: state.linkUrl || '' }],
    }
  },
}

export default bannerAdapter
