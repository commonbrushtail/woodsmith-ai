// Preview adapter for products — the most involved mapping.
//
// ProductDetailClient takes the RAW DB product as its `product` prop and does
// all display transformation internally, so this adapter only needs to rebuild
// that DB shape (the same shape getPublishedProduct returns) from live form
// state. Key conversions:
//   - calculator sizes: camelCase form fields -> snake_case numeric DB fields
//   - variation links: {group_id, entry_id} -> nested variation_groups/entries
//     resolved against the variationGroups list the edit page already loads.

function toNumberOrNull(v) {
  if (v === '' || v === null || v === undefined) return null
  const n = Number(v)
  return Number.isNaN(n) ? null : n
}

const productAdapter = {
  entity: 'product',
  device: 'page',
  defaultViewport: 'desktop',
  component: () => import('@/app/(public)/product/[id]/ProductDetailClient'),

  toProps(state = {}) {
    const product_images = (state.existingImages || []).map((img, i) => ({
      id: img.id,
      url: img.url,
      is_primary: !!img.is_primary,
      sort_order: img.sort_order ?? i,
      variation_entry_id: img.variation_entry_id ?? null,
    }))

    const groups = state.variationGroups || []
    const product_variation_links = (state.variationLinks || []).map((link) => {
      const group = groups.find((g) => g.id === link.group_id)
      const entry = group?.variation_entries?.find((e) => e.id === link.entry_id)
      return {
        group_id: link.group_id,
        entry_id: link.entry_id,
        // The edit form doesn't track show_image per link; default to showing it.
        show_image: true,
        variation_groups: group ? { display_name: group.display_name, name: group.name } : null,
        variation_entries: entry
          ? { label: entry.label, image_url: entry.image_url, sort_order: entry.sort_order }
          : null,
      }
    })

    const calculator_sizes = (state.calculatorSizes || []).map((s) => ({
      label: s.label || '',
      pieces_per_box: toNumberOrNull(s.piecesPerBox),
      plank_width: toNumberOrNull(s.plankWidth),
      plank_length: toNumberOrNull(s.plankLength),
      installation_patterns: s.installationPatterns || [],
    }))

    return {
      product: {
        id: state.id || 'preview',
        name: state.productName || '',
        sku: state.sku || state.productCode || '',
        code: state.productCode || '',
        slug: state.slug || '',
        type: state.productType || 'construction',
        category: state.productCategory || '',
        description: state.description || '',
        characteristics: state.characteristics || '',
        specifications: state.specifications || '',
        show_area_calculator: !!state.showAreaCalculator,
        calculator_sizes,
        product_images,
        // Options (color/surface/size) aren't edited in this form.
        product_options: [],
        product_variation_links,
        relatedProducts: [],
      },
      isLoggedIn: false,
    }
  },
}

export default productAdapter
