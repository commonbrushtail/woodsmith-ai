// Preview adapter for gallery. Renders the public GallerySection with the
// homepage gallery items.
const galleryAdapter = {
  entity: 'gallery',
  device: 'section',
  defaultViewport: 'desktop',
  component: () => import('@/components/GallerySection'),

  toProps(state = {}) {
    return { items: state.items || [] }
  },
}

export default galleryAdapter
