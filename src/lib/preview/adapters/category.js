// Preview adapter for taxonomy editors (category + product-types). Renders the
// representative listing card via TaxonomyCardPreview.
const categoryAdapter = {
  entity: 'category',
  device: 'section',
  defaultViewport: 'desktop',
  component: () => import('@/components/TaxonomyCardPreview'),

  toProps(state = {}) {
    return {
      name: state.name || '',
      imageUrl: state.imagePreview || null,
      typeLabel: state.typeLabel || '',
    }
  },
}

export default categoryAdapter
