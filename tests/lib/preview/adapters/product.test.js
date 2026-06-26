import { describe, it, expect } from 'vitest'
import productAdapter from '@/lib/preview/adapters/product'

describe('product preview adapter', () => {
  it('never throws on empty form state and returns a DB-shaped product', () => {
    const props = productAdapter.toProps({})
    expect(props.isLoggedIn).toBe(false)
    expect(props.product).toBeTruthy()
    expect(props.product.product_images).toEqual([])
    expect(props.product.product_variation_links).toEqual([])
    expect(props.product.relatedProducts).toEqual([])
  })

  it('maps core fields and rich-text strings through unchanged', () => {
    const props = productAdapter.toProps({
      id: 'x1',
      productName: 'ไม้พื้น',
      productCode: 'WD-01',
      sku: 'SKU-9',
      productType: 'decoration',
      productCategory: 'พื้นไม้',
      description: '<p>desc</p>',
      characteristics: '<p>char</p>',
      specifications: '<table></table>',
    })
    expect(props.product.name).toBe('ไม้พื้น')
    expect(props.product.code).toBe('WD-01')
    expect(props.product.sku).toBe('SKU-9')
    expect(props.product.type).toBe('decoration')
    expect(props.product.category).toBe('พื้นไม้')
    expect(props.product.description).toBe('<p>desc</p>')
    expect(props.product.specifications).toBe('<table></table>')
  })

  it('builds product_images preserving order and primary flag', () => {
    const props = productAdapter.toProps({
      existingImages: [
        { id: 'b', url: 'u2', is_primary: false, sort_order: 1 },
        { id: 'a', url: 'u1', is_primary: true, sort_order: 0 },
      ],
    })
    expect(props.product.product_images).toHaveLength(2)
    expect(props.product.product_images[0]).toMatchObject({ url: 'u2', is_primary: false, sort_order: 1 })
  })

  it('converts calculator sizes from camelCase form fields to snake_case numbers', () => {
    const props = productAdapter.toProps({
      showAreaCalculator: true,
      calculatorSizes: [
        { label: '60x60', piecesPerBox: '4', plankWidth: '60', plankLength: '60', installationPatterns: [{ label: 'x', waste: 5 }] },
        { label: 'empty', piecesPerBox: '', plankWidth: '', plankLength: '' },
      ],
    })
    expect(props.product.show_area_calculator).toBe(true)
    expect(props.product.calculator_sizes[0]).toMatchObject({
      label: '60x60',
      pieces_per_box: 4,
      plank_width: 60,
      plank_length: 60,
    })
    expect(props.product.calculator_sizes[0].installation_patterns).toEqual([{ label: 'x', waste: 5 }])
    // blank numeric inputs become null, not NaN
    expect(props.product.calculator_sizes[1].pieces_per_box).toBeNull()
  })

  it('resolves variation links against variationGroups into the nested shape', () => {
    const props = productAdapter.toProps({
      variationLinks: [{ group_id: 'g1', entry_id: 'e1' }],
      variationGroups: [
        {
          id: 'g1',
          name: 'size',
          display_name: 'ขนาด',
          variation_entries: [{ id: 'e1', label: '10mm', image_url: 'img1', sort_order: 0 }],
        },
      ],
    })
    const link = props.product.product_variation_links[0]
    expect(link.entry_id).toBe('e1')
    expect(link.variation_groups).toMatchObject({ display_name: 'ขนาด', name: 'size' })
    expect(link.variation_entries).toMatchObject({ label: '10mm', image_url: 'img1' })
  })
})
