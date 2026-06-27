/**
 * Seed all 33 products with variation groups, entries, links, and images.
 * - Shared groups (groupKey): created once, reused across products
 * - No duplicate default images: if product has variation images, first variation image = primary
 *
 * Usage: node --env-file=.env.local scripts/seed-products.js
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const sharp = require('sharp')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const BASE_DIR = path.join(__dirname, '..', 'Vanachai website map 040326', 'Vanachai website map')
const BUCKET = 'products'

// ============================================================
// HELPERS
// ============================================================

function sanitizeStoragePath(filePath) {
  const dir = path.dirname(filePath)
  const ext = path.extname(filePath)
  const base = path.basename(filePath, ext)
  const hasNonAscii = /[^\x20-\x7E]/.test(base)
  const safeName = hasNonAscii
    ? crypto.createHash('md5').update(base).digest('hex')
    : base.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9._-]/g, '_')
  return dir ? `${dir}/${safeName}${ext}` : `${safeName}${ext}`
}

/**
 * Compress and upload a product image (max 1920px, WebP 82%).
 */
async function uploadImage(localRelPath, storagePath, { maxWidth = 1920, maxHeight = 1920, quality = 82 } = {}) {
  const fullLocal = path.join(BASE_DIR, localRelPath.replace(/\\/g, '/'))
  if (!fs.existsSync(fullLocal)) {
    console.log(`  [SKIP] File not found: ${localRelPath}`)
    return null
  }

  // Compress with sharp → WebP
  const compressed = await sharp(fullLocal)
    .resize(maxWidth, maxHeight, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality })
    .toBuffer()

  // Change extension to .webp in storage path
  const webpPath = sanitizeStoragePath(storagePath.replace(/\.\w+$/, '.webp'))
  const { error } = await supabase.storage.from(BUCKET).upload(webpPath, compressed, {
    contentType: 'image/webp', upsert: true
  })
  if (error) {
    console.log(`  [ERR] Upload ${webpPath}: ${error.message}`)
    return null
  }
  const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(webpPath)
  return publicUrl
}

/**
 * Compress and upload a swatch thumbnail (100x100, WebP 70%).
 */
async function uploadSwatch(localRelPath, storagePath) {
  return uploadImage(localRelPath, storagePath, { maxWidth: 100, maxHeight: 100, quality: 70 })
}

async function insertProduct(p) {
  const { data, error } = await supabase.from('products').insert({
    name: p.name,
    slug: p.slug,
    code: p.code,
    sku: p.code,
    type: p.type,
    category: p.category,
    published: true,
    recommended: p.recommended || false,
  }).select('id').single()
  if (error) throw new Error(`Insert product ${p.name}: ${error.message}`)
  return data.id
}

async function createVariationGroupDB(name, displayName = null) {
  const { data, error } = await supabase.from('variation_groups').insert({
    name, display_name: displayName || name
  }).select('id').single()
  if (error) throw new Error(`Create group ${name}: ${error.message}`)
  return data.id
}

async function createVariationEntry(groupId, label, sortOrder, imageUrl = null) {
  const { data, error } = await supabase.from('variation_entries').insert({
    group_id: groupId, label, sort_order: sortOrder, image_url: imageUrl
  }).select('id').single()
  if (error) throw new Error(`Create entry ${label}: ${error.message}`)
  return data.id
}

async function linkVariation(productId, groupId, entryId, showImage = true) {
  const { error } = await supabase.from('product_variation_links').insert({
    product_id: productId, group_id: groupId, entry_id: entryId, show_image: showImage
  })
  if (error && !error.message.includes('duplicate')) {
    console.log(`  [WARN] Link: ${error.message}`)
  }
}

async function insertProductImage(productId, url, isPrimary, sortOrder, variationEntryId = null) {
  const row = {
    product_id: productId, url, is_primary: isPrimary, sort_order: sortOrder
  }
  if (variationEntryId) row.variation_entry_id = variationEntryId
  const { error } = await supabase.from('product_images').insert(row)
  if (error) console.log(`  [WARN] Image: ${error.message}`)
}

// ============================================================
// PRODUCT DEFINITIONS (33 products)
// Groups with `groupKey` are shared across products.
// ============================================================

const PRODUCTS = [
  // ─── DOORS (9) ───
  {
    name: 'ประตูเมลามีน', nameEn: 'Melamine Door', slug: 'melamine-door',
    code: 'DOOR-MEL', type: 'decoration', category: 'ประตู', recommended: true,
    defaultImage: null,
    variations: {
      'ขนาด': { groupKey: 'size-door-3', showImage: false, entries: [
        { label: '70x200 ซม.', sort: 0 },
        { label: '80x200 ซม.', sort: 1 },
        { label: '90x200 ซม.', sort: 2 },
      ]},
      'สี': { groupKey: 'color-door-mel-5', showImage: true, entries: [
        { label: '10120', sort: 0, swatchImage: 'Door/VM10120.jpg', productImage: 'Door/VM10120.jpg' },
        { label: '10670', sort: 1, swatchImage: 'Door/VM10670.jpg', productImage: 'Door/VM10670.jpg' },
        { label: '10723', sort: 2, swatchImage: 'Door/VM10723.jpg', productImage: 'Door/VM10723.jpg' },
        { label: '10780', sort: 3, swatchImage: 'Door/VM10780.jpg', productImage: 'Door/VM10780.jpg' },
        { label: '20638', sort: 4, swatchImage: 'Door/VM20638.jpg', productImage: 'Door/VM20638.jpg' },
      ]},
    }
  },
  {
    name: 'ประตูเมลามีนพร้อมวงกบ', nameEn: 'Melamine Door with Frame', slug: 'melamine-door-with-frame',
    code: 'DOOR-MEL-F', type: 'decoration', category: 'ประตู', recommended: false,
    defaultImage: null,
    variations: {
      'ขนาด': { groupKey: 'size-door-3', showImage: false, entries: [
        { label: '70x200 ซม.', sort: 0 },
        { label: '80x200 ซม.', sort: 1 },
        { label: '90x200 ซม.', sort: 2 },
      ]},
      'สี': { groupKey: 'color-door-mel-5', showImage: true, entries: [
        { label: '10120', sort: 0, productImage: 'Door/VM10120_Frame.jpg' },
        { label: '10670', sort: 1, productImage: 'Door/VM10670_Frame.jpg' },
        { label: '10723', sort: 2, productImage: 'Door/VM10723_Frame.jpg' },
        { label: '10780', sort: 3, productImage: 'Door/VM10780_Frame.jpg' },
        { label: '20638', sort: 4, productImage: 'Door/VM20638_Frame.jpg' },
      ]},
    }
  },
  {
    name: 'ประตูเมลามีนกันน้ำ', nameEn: 'Ultra Melamine Door', slug: 'ultra-melamine-door',
    code: 'DOOR-MEL-U', type: 'decoration', category: 'ประตู', recommended: true,
    defaultImage: null,
    variations: {
      'ขนาด': { groupKey: 'size-door-3', showImage: false, entries: [
        { label: '70x200 ซม.', sort: 0 },
        { label: '80x200 ซม.', sort: 1 },
        { label: '90x200 ซม.', sort: 2 },
      ]},
      'สี': { groupKey: 'color-door-mel-5', showImage: true, entries: [
        { label: '10120', sort: 0, productImage: 'Door/10120-ME5.png' },
        { label: '10670', sort: 1, productImage: 'Door/VM10670ME4.jpg' },
        { label: '10723', sort: 2, productImage: 'Door/10723-ME2.png' },
        { label: '10780', sort: 3, productImage: 'Door/10780MAG1.jpg' },
        { label: '20638', sort: 4, productImage: 'Door/20638-ME1.png' },
      ]},
    }
  },
  {
    name: 'ประตูลูกฟัก', nameEn: 'HDF Door', slug: 'hdf-door',
    code: 'DOOR-HDF', type: 'decoration', category: 'ประตู', recommended: true,
    defaultImage: null,
    variations: {
      'ขนาด': { groupKey: 'size-door-3', showImage: false, entries: [
        { label: '70x200 ซม.', sort: 0 },
        { label: '80x200 ซม.', sort: 1 },
        { label: '90x200 ซม.', sort: 2 },
      ]},
      'ประเภท': { groupKey: 'type-door-hdf', showImage: false, entries: [
        { label: 'ภายใน', sort: 0 },
        { label: 'ภายนอก', sort: 1 },
      ]},
      'แบบ': { groupKey: 'style-door-hdf-10', showImage: true, entries: [
        { label: '1MV1', sort: 0, swatchImage: 'Door/1MV1.jpg', productImage: 'Door/1MV1.jpg' },
        { label: '2MV1', sort: 1, swatchImage: 'Door/2MV1.jpg', productImage: 'Door/2MV1.jpg' },
        { label: '2MV2', sort: 2, swatchImage: 'Door/2MV2.jpg', productImage: 'Door/2MV2.jpg' },
        { label: '2MV3', sort: 3, swatchImage: 'Door/2MV3.jpg', productImage: 'Door/2MV3.jpg' },
        { label: '3MV1', sort: 4, swatchImage: 'Door/3MV1.jpg', productImage: 'Door/3MV1.jpg' },
        { label: '3MV2', sort: 5, swatchImage: 'Door/3MV2.jpg', productImage: 'Door/3MV2.jpg' },
        { label: '4MV1', sort: 6, swatchImage: 'Door/4MV1.jpg', productImage: 'Door/4MV1.jpg' },
        { label: '4MV2', sort: 7, swatchImage: 'Door/4MV2.jpg', productImage: 'Door/4MV2.jpg' },
        { label: '4MV3', sort: 8, swatchImage: 'Door/4MV3.jpg', productImage: 'Door/4MV3.jpg' },
        { label: '6MV1', sort: 9, swatchImage: 'Door/6MV1.jpg', productImage: 'Door/6MV1.jpg' },
      ]},
    }
  },
  {
    name: 'ประตูลูกฟักพร้อมวงกบ', nameEn: 'HDF Door with Frame', slug: 'hdf-door-with-frame',
    code: 'DOOR-HDF-F', type: 'decoration', category: 'ประตู', recommended: false,
    defaultImage: null,
    variations: {
      'ขนาด': { groupKey: 'size-door-3', showImage: false, entries: [
        { label: '70x200 ซม.', sort: 0 },
        { label: '80x200 ซม.', sort: 1 },
        { label: '90x200 ซม.', sort: 2 },
      ]},
      'ประเภท': { groupKey: 'type-door-hdf', showImage: false, entries: [
        { label: 'ภายใน', sort: 0 },
        { label: 'ภายนอก', sort: 1 },
      ]},
      'แบบ': { groupKey: 'style-door-hdf-10', showImage: true, entries: [
        { label: '1MV1', sort: 0, productImage: 'Door/1MV1_F.jpg' },
        { label: '2MV1', sort: 1, productImage: 'Door/2MV1_F.jpg' },
        { label: '2MV2', sort: 2, productImage: 'Door/2MV2_F.jpg' },
        { label: '2MV3', sort: 3, productImage: 'Door/2MV3_F.jpg' },
        { label: '3MV1', sort: 4, productImage: 'Door/3MV1_F.jpg' },
        { label: '3MV2', sort: 5, productImage: 'Door/3MV2_F.jpg' },
        { label: '4MV1', sort: 6, productImage: 'Door/4MV1_F.jpg' },
        { label: '4MV2', sort: 7, productImage: 'Door/4MV2_F.jpg' },
        { label: '4MV3', sort: 8, productImage: 'Door/4MV3_F.jpg' },
        { label: '6MV1', sort: 9, productImage: 'Door/6MV1_F.jpg' },
      ]},
    }
  },
  {
    name: 'ประตู HMR', nameEn: 'HMR Door', slug: 'hmr-door',
    code: 'DOOR-HMR', type: 'decoration', category: 'ประตู', recommended: false,
    defaultImage: null,
    variations: {
      'ขนาด': { showImage: false, entries: [
        { label: '70x200 ซม.', sort: 0 },
        { label: '80x200 ซม.', sort: 1 },
      ]},
      'แบบ': { showImage: true, entries: [
        { label: '1MV1', sort: 0, productImage: 'Door/1MV1 HMR DOOR _ 7237.jpg' },
        { label: '2MV2', sort: 1, productImage: 'Door/2MV2 HMR DOOR 7232.jpg' },
        { label: '3MV1', sort: 2, productImage: 'Door/3MV1 HMR DOOR 7223.jpg' },
        { label: '4MV2', sort: 3, productImage: 'Door/4MV2 HMR DOOR 7246.jpg' },
        { label: '6MV1', sort: 4, productImage: 'Door/6MV1 HMR DOOR 7230.jpg' },
        { label: 'FV1', sort: 5, productImage: 'Door/FV1 HMR DOOR 7248.jpg' },
        { label: 'FV2', sort: 6, productImage: 'Door/FV2 HMR DOOR 7240.jpg' },
      ]},
    }
  },
  {
    name: 'ประตูปิด PVC', nameEn: 'PVC Door', slug: 'pvc-door',
    code: 'DOOR-PVC', type: 'decoration', category: 'ประตู', recommended: false,
    defaultImage: null,
    variations: {
      'แบบ': { showImage: true, entries: [
        { label: 'PE1-67819', sort: 0, productImage: 'Door/PE01-67819.jpg' },
        { label: 'PE1-67838', sort: 1, productImage: 'Door/PE01-67838.jpg' },
        { label: 'PE2-67819', sort: 2, productImage: 'Door/PE02-67819.jpg' },
        { label: 'PE2-67838', sort: 3, productImage: 'Door/PE02-67838.jpg' },
      ]},
    }
  },
  {
    name: 'ประตูไม้อัด', nameEn: 'Plywood Door', slug: 'plywood-door',
    code: 'DOOR-PLY', type: 'decoration', category: 'ประตู', recommended: false,
    defaultImage: 'Door/ประตูไม้อัด.jpg',
    variations: {
      'ขนาด': { groupKey: 'size-door-3', showImage: false, entries: [
        { label: '70x200 ซม.', sort: 0 },
        { label: '80x200 ซม.', sort: 1 },
        { label: '90x200 ซม.', sort: 2 },
      ]},
    }
  },
  {
    name: 'ประตูสักประดิษฐ์', nameEn: 'Recompose Teak Door', slug: 'recompose-teak-door',
    code: 'DOOR-TEAK', type: 'decoration', category: 'ประตู', recommended: false,
    defaultImage: 'Door/สักประดิษฐ์.jpg',
    variations: {
      'ขนาด': { showImage: false, entries: [
        { label: '80x200 ซม.', sort: 0 },
        { label: '90x200 ซม.', sort: 1 },
      ]},
    }
  },

  // ─── DOOR FRAME (1) ───
  {
    name: 'วงกบ', nameEn: 'Door Frame', slug: 'door-frame',
    code: 'FRAME', type: 'decoration', category: 'ประตู', recommended: false,
    defaultImage: null,
    variations: {
      'ขนาด': { groupKey: 'size-door-3', showImage: false, entries: [
        { label: '70x200 ซม.', sort: 0 },
        { label: '80x200 ซม.', sort: 1 },
        { label: '90x200 ซม.', sort: 2 },
      ]},
    }
  },

  // ─── TABLE (1) ───
  {
    name: 'โต๊ะอเนกประสงค์', nameEn: 'Table', slug: 'table',
    code: 'TABLE', type: 'decoration', category: 'โต๊ะ', recommended: false,
    defaultImage: 'Table/โต๊ะพับ.jpg',
    variations: {}
  },

  // ─── POLYESTER BOARD (1) ───
  {
    name: 'ไม้โพลีเอสเตอร์', nameEn: 'Polyester Board', slug: 'polyester-board',
    code: 'POLY', type: 'construction', category: 'ไม้โพลีเอสเตอร์', recommended: false,
    defaultImage: 'Board/Polyesterbord MDY รวม 6425.jpg',
    variations: {
      'ความหนา': { showImage: false, entries: [
        { label: '3 มม.', sort: 0 },
        { label: '10 มม.', sort: 1 },
      ]},
    }
  },

  // ─── DECORATIVE PANELS (2) ───
  {
    name: 'ไม้ฝาตกแต่ง US', nameEn: 'Decorative Panel US', slug: 'decorative-panel-us',
    code: 'DECO-US', type: 'decoration', category: 'ไม้ฝาตกแต่ง', recommended: false,
    defaultImage: 'Decorative panel/25 HMR_US-105 9 MM-690 x 900 Pix.jpg',
    variations: {
      'ขนาด': { showImage: false, entries: [
        { label: '9x200x3000 มม.', sort: 0 },
        { label: '9x600x3000 มม.', sort: 1 },
        { label: '15x200x3000 มม.', sort: 2 },
        { label: '18x200x3000 มม.', sort: 3 },
      ]},
    }
  },
  {
    name: 'ไม้ฝาตกแต่ง AR', nameEn: 'Decorative Panel AR', slug: 'decorative-panel-ar',
    code: 'DECO-AR', type: 'decoration', category: 'ไม้ฝาตกแต่ง', recommended: false,
    defaultImage: 'Decorative panel/01 HMR_AR-105 9 MM-690 x 900 Pix.jpg',
    variations: {
      'ขนาด': { showImage: false, entries: [
        { label: '9x200x3000 มม.', sort: 0 },
        { label: '15x200x3000 มม.', sort: 1 },
        { label: '18x200x3000 มม.', sort: 2 },
      ]},
    }
  },

  // ─── STAIR (2) ───
  {
    name: 'ไม้บันได', nameEn: 'Stair', slug: 'stair',
    code: 'STAIR', type: 'decoration', category: 'ไม้บันได', recommended: false,
    defaultImage: null,
    variations: {
      'ขนาด': { showImage: false, entries: [
        { label: '35x290x1050 มม.', sort: 0 },
        { label: '35x290x1200 มม.', sort: 1 },
      ]},
      'สี': { showImage: false, entries: [
        { label: '10733', sort: 0 },
        { label: '10720', sort: 1 },
      ]},
    }
  },
  {
    name: 'ไม้ราวบันได', nameEn: 'Stair Rail', slug: 'stair-rail',
    code: 'STAIR-RAIL', type: 'decoration', category: 'ไม้บันได', recommended: false,
    defaultImage: null,
    variations: {}
  },

  // ─── SHUTTERING BOARD (1) ───
  {
    name: 'ไม้แบบ', nameEn: 'Shuttering Board', slug: 'shuttering-board',
    code: 'SHUT', type: 'construction', category: 'ไม้แบบ', recommended: false,
    defaultImage: 'Board/ไม้แบบหล่อคอนกรีตกำลัง 4 (ขอบส้ม) 15 2425.jpg',
    variations: {
      'ความหนา': { showImage: false, entries: [
        { label: '10 มม.', sort: 0 },
        { label: '15 มม.', sort: 1 },
        { label: '20 มม.', sort: 2 },
      ]},
      'เกรด': { showImage: false, entries: [
        { label: 'กำลัง4', sort: 0 },
        { label: 'BB/A', sort: 1 },
        { label: 'BB/C', sort: 2 },
      ]},
    }
  },

  // ─── FLOORING (6) ───
  {
    name: 'ไม้พื้นลามิเนต', nameEn: 'Laminated Flooring Standard', slug: 'laminated-flooring',
    code: 'FLOOR-LAM', type: 'decoration', category: 'ไม้พื้น', recommended: true,
    defaultImage: null,
    variations: {
      'สี': { groupKey: 'color-flooring-lam-11', showImage: true, entries: [
        { label: '10617', sort: 0, swatchImage: 'Flooring/MD10617-0995.jpg', productImage: 'Flooring/MD10617-0995.jpg' },
        { label: '10623', sort: 1, swatchImage: 'Flooring/MD10623-1001.jpg', productImage: 'Flooring/MD10623-1001.jpg' },
        { label: '10625', sort: 2, swatchImage: 'Flooring/MD10625-1009.jpg', productImage: 'Flooring/MD10625-1009.jpg' },
        { label: '10670', sort: 3, swatchImage: 'Flooring/MD10670-1094.jpg', productImage: 'Flooring/MD10670-1094.jpg' },
        { label: '10720', sort: 4, swatchImage: 'Flooring/MD10720-1102.jpg', productImage: 'Flooring/MD10720-1102.jpg' },
        { label: '10722', sort: 5, swatchImage: 'Flooring/MD10722-1022.jpg', productImage: 'Flooring/MD10722-1022.jpg' },
        { label: '10732', sort: 6, swatchImage: 'Flooring/MD10732-1038.jpg', productImage: 'Flooring/MD10732-1038.jpg' },
        { label: '10742', sort: 7, swatchImage: 'Flooring/MD10742-1149.jpg', productImage: 'Flooring/MD10742-1149.jpg' },
        { label: '10743', sort: 8, swatchImage: 'Flooring/MD10743-1047.jpg', productImage: 'Flooring/MD10743-1047.jpg' },
        { label: '20638', sort: 9, swatchImage: 'Flooring/MD20638-1063.jpg', productImage: 'Flooring/MD20638-1063.jpg' },
        { label: '20649', sort: 10, swatchImage: 'Flooring/MD20649-1071.jpg', productImage: 'Flooring/MD20649-1071.jpg' },
      ]},
      'เกรด': { showImage: false, entries: [
        { label: 'E2/AC3', sort: 0 },
        { label: 'E1/AC3', sort: 1 },
        { label: 'E0/AC3', sort: 2 },
      ]},
    }
  },
  {
    name: 'ไม้พื้น Hybrid HMR', nameEn: 'Hybrid HMR Flooring', slug: 'hybrid-hmr-flooring',
    code: 'FLOOR-HMR', type: 'decoration', category: 'ไม้พื้น', recommended: true,
    defaultImage: null,
    variations: {
      'สี': { showImage: true, entries: [
        { label: '**1**', sort: 0, productImage: 'Flooring/01 VF10612  HYBRID 7265.png' },
        { label: '**2**', sort: 1, productImage: 'Flooring/03 VF10689  HYBRID 7270.png' },
        { label: '**3**', sort: 2, productImage: 'Flooring/05 VF10696  HYBRID 7271.png' },
        { label: '**4**', sort: 3, productImage: 'Flooring/06 VF10752 HYBRID 7275.png' },
      ]},
    }
  },
  {
    name: 'ไม้พื้น Hybrid Ultra', nameEn: 'Hybrid Ultra Flooring', slug: 'hybrid-ultra-flooring',
    code: 'FLOOR-ULTRA', type: 'decoration', category: 'ไม้พื้น', recommended: true,
    defaultImage: null,
    variations: {
      'สี': { showImage: true, entries: [
        { label: '*1*', sort: 0, productImage: 'Flooring/ไม้พื้น Ultra 01 MD 10667 Waterproof 7283.png' },
        { label: '*2*', sort: 1, productImage: 'Flooring/ไม้พื้น Ultra 03 MD 10667 Waterproof 7283.png' },
        { label: '*3*', sort: 2 },
        { label: '*4*', sort: 3 },
      ]},
    }
  },
  {
    name: 'ไม้พื้น Veneer', nameEn: 'Veneer Flooring', slug: 'veneer-flooring',
    code: 'FLOOR-VEN', type: 'decoration', category: 'ไม้พื้น', recommended: false,
    defaultImage: 'Flooring/VV 10601_iso view.png',
    variations: {}
  },
  {
    name: 'ไม้พื้น Veneer Pattern', nameEn: 'Veneer Flooring Pattern', slug: 'veneer-flooring-pattern',
    code: 'FLOOR-VEN-P', type: 'decoration', category: 'ไม้พื้น', recommended: false,
    defaultImage: null,
    variations: {
      'ลาย': { showImage: false, entries: [
        { label: 'Herringbone', sort: 0 },
        { label: 'Chevron', sort: 1 },
        { label: 'Diamond Bloom', sort: 2 },
        { label: 'Hourglass Curve 1', sort: 3 },
        { label: 'Hourglass Curve 2', sort: 4 },
        { label: 'Lotus Leaf', sort: 5 },
      ]},
    }
  },
  {
    name: 'ไม้พื้นลามิเนตปลอดสารฟอมัลดีไฮด์', nameEn: 'Non-Formaldehyde Laminated Flooring', slug: 'non-formaldehyde-laminated-flooring',
    code: 'FLOOR-LAM-E0', type: 'decoration', category: 'ไม้พื้น', recommended: false,
    defaultImage: null,
    variations: {
      'สี': { groupKey: 'color-flooring-lam-11', showImage: true, entries: [
        { label: '10617', sort: 0, productImage: 'Flooring/MD10617-0995.jpg' },
        { label: '10623', sort: 1, productImage: 'Flooring/MD10623-1001.jpg' },
        { label: '10625', sort: 2, productImage: 'Flooring/MD10625-1009.jpg' },
        { label: '10670', sort: 3, productImage: 'Flooring/MD10670-1094.jpg' },
        { label: '10720', sort: 4, productImage: 'Flooring/MD10720-1102.jpg' },
        { label: '10722', sort: 5, productImage: 'Flooring/MD10722-1022.jpg' },
        { label: '10732', sort: 6, productImage: 'Flooring/MD10732-1038.jpg' },
        { label: '10742', sort: 7, productImage: 'Flooring/MD10742-1149.jpg' },
        { label: '10743', sort: 8, productImage: 'Flooring/MD10743-1047.jpg' },
        { label: '20638', sort: 9, productImage: 'Flooring/MD20638-1063.jpg' },
        { label: '20649', sort: 10, productImage: 'Flooring/MD20649-1071.jpg' },
      ]},
    }
  },

  // ─── MDF (4) ───
  {
    name: 'ไม้ MDF', nameEn: 'MDF', slug: 'mdf',
    code: 'MDF', type: 'construction', category: 'MDF', recommended: true,
    defaultImage: 'Board/MDF รวม 2470.jpg',
    variations: {
      'เกรด': { showImage: false, entries: [
        { label: 'E2/GG', sort: 0 },
        { label: 'E1/GG', sort: 1 },
        { label: 'E0/GG', sort: 2 },
        { label: 'E2/FS', sort: 3 },
        { label: 'E1/FS', sort: 4 },
        { label: 'E0/CARP P2', sort: 5 },
        { label: 'E0/CARP P2 S3', sort: 6 },
        { label: 'FSC/CARP P2', sort: 7 },
      ]},
    }
  },
  {
    name: 'ไม้ MDF ปิดผิวเมลามีน', nameEn: 'Melamine on MDF', slug: 'melamine-mdf',
    code: 'MDF-MEL', type: 'construction', category: 'MDF', recommended: false,
    defaultImage: 'Board/MDF-MELAMINE รวม 2466.jpg',
    variations: {}
  },
  {
    name: 'ไม้ MDF HMR', nameEn: 'MDF HMR', slug: 'mdf-hmr',
    code: 'MDF-HMR', type: 'construction', category: 'MDF', recommended: false,
    defaultImage: 'Board/MDF-HMR รวม 2462.jpg',
    variations: {
      'แบบ': { showImage: false, entries: [
        { label: 'V313', sort: 0 },
        { label: 'V70', sort: 1 },
      ]},
    }
  },
  {
    name: 'ไม้ MDF HMR ปิดผิว', nameEn: 'Melamine on MDF HMR', slug: 'melamine-mdf-hmr',
    code: 'MDF-HMR-MEL', type: 'construction', category: 'MDF', recommended: false,
    defaultImage: 'Board/MDF-HMR รวม 2462.jpg',
    variations: {}
  },

  // ─── PB (2) ───
  {
    name: 'ไม้ PB', nameEn: 'PB', slug: 'pb',
    code: 'PB', type: 'construction', category: 'PB', recommended: true,
    defaultImage: 'Board/ไม้เปลือย PBNGE2 รวม 2474.jpg',
    variations: {
      'เกรด': { showImage: false, entries: [
        { label: 'E2/FS', sort: 0 },
        { label: 'E2/GG', sort: 1 },
        { label: 'E2/NG', sort: 2 },
        { label: 'E2/MR', sort: 3 },
        { label: 'E2/P1', sort: 4 },
        { label: 'E2/P2', sort: 5 },
        { label: 'E1/FS', sort: 6 },
        { label: 'E1/GG', sort: 7 },
        { label: 'E1/MR', sort: 8 },
        { label: 'E1/P1', sort: 9 },
        { label: 'E0/GG', sort: 10 },
        { label: 'E0/HMR', sort: 11 },
        { label: 'FH CARB P2', sort: 12 },
        { label: 'SUPER E0/GG', sort: 13 },
        { label: 'SUPER E0/HMR', sort: 14 },
      ]},
      'ความหนา': { showImage: false, entries: [
        { label: '8 มม.', sort: 0 },
        { label: '9 มม.', sort: 1 },
        { label: '11 มม.', sort: 2 },
        { label: '12 มม.', sort: 3 },
        { label: '14 มม.', sort: 4 },
        { label: '15 มม.', sort: 5 },
        { label: '16 มม.', sort: 6 },
        { label: '17 มม.', sort: 7 },
        { label: '18 มม.', sort: 8 },
        { label: '19 มม.', sort: 9 },
        { label: '21 มม.', sort: 10 },
        { label: '23 มม.', sort: 11 },
        { label: '24 มม.', sort: 12 },
        { label: '25 มม.', sort: 13 },
        { label: '27 มม.', sort: 14 },
        { label: '35 มม.', sort: 15 },
      ]},
    }
  },
  {
    name: 'ไม้ PB ปิดผิวเมลามีน', nameEn: 'Melamine on PB', slug: 'melamine-pb',
    code: 'PB-MEL', type: 'construction', category: 'PB', recommended: false,
    defaultImage: null,
    variations: {}
  },

  // ─── OSB (3) ───
  {
    name: 'ไม้ OSB ภายใน', nameEn: 'OSB Interior', slug: 'osb-interior',
    code: 'OSB-INT', type: 'construction', category: 'OSB', recommended: true,
    defaultImage: 'Board/OSB 7322.png',
    variations: {
      'เกรด': { showImage: false, entries: [
        { label: 'OSB2 E2', sort: 0 },
        { label: 'OSB3 E0', sort: 1 },
      ]},
      'ความหนา': { groupKey: 'thickness-osb-11', showImage: false, entries: [
        { label: '8 มม.', sort: 0 }, { label: '9 มม.', sort: 1 },
        { label: '10 มม.', sort: 2 }, { label: '11 มม.', sort: 3 },
        { label: '12 มม.', sort: 4 }, { label: '13 มม.', sort: 5 },
        { label: '14 มม.', sort: 6 }, { label: '15 มม.', sort: 7 },
        { label: '16 มม.', sort: 8 }, { label: '17 มม.', sort: 9 },
        { label: '18 มม.', sort: 10 },
      ]},
    }
  },
  {
    name: 'ไม้ OSB ภายนอก', nameEn: 'OSB Exterior', slug: 'osb-exterior',
    code: 'OSB-EXT', type: 'construction', category: 'OSB', recommended: false,
    defaultImage: 'Board/OSB 7322.png',
    variations: {
      'เกรด': { showImage: false, entries: [
        { label: 'OSB2 E1', sort: 0 },
        { label: 'OSB3 E1', sort: 1 },
        { label: 'OSB3 PMDI', sort: 2 },
      ]},
      'ความหนา': { groupKey: 'thickness-osb-11', showImage: false, entries: [
        { label: '8 มม.', sort: 0 }, { label: '9 มม.', sort: 1 },
        { label: '10 มม.', sort: 2 }, { label: '11 มม.', sort: 3 },
        { label: '12 มม.', sort: 4 }, { label: '13 มม.', sort: 5 },
        { label: '14 มม.', sort: 6 }, { label: '15 มม.', sort: 7 },
        { label: '16 มม.', sort: 8 }, { label: '17 มม.', sort: 9 },
        { label: '18 มม.', sort: 10 },
      ]},
    }
  },
  {
    name: 'ไม้ OSB ทนชื้น', nameEn: 'OSB Moisture Resistance', slug: 'osb-moisture-resistance',
    code: 'OSB-MR', type: 'construction', category: 'OSB', recommended: false,
    defaultImage: 'Board/OSB 7322.png',
    variations: {
      'เกรด': { showImage: false, entries: [
        { label: 'OSB2 E1', sort: 0 },
        { label: 'OSB2 E2', sort: 1 },
      ]},
      'ความหนา': { groupKey: 'thickness-osb-11', showImage: false, entries: [
        { label: '8 มม.', sort: 0 }, { label: '9 มม.', sort: 1 },
        { label: '10 มม.', sort: 2 }, { label: '11 มม.', sort: 3 },
        { label: '12 มม.', sort: 4 }, { label: '13 มม.', sort: 5 },
        { label: '14 มม.', sort: 6 }, { label: '15 มม.', sort: 7 },
        { label: '16 มม.', sort: 8 }, { label: '17 มม.', sort: 9 },
        { label: '18 มม.', sort: 10 },
      ]},
    }
  },

  // ─── PLYWOOD (1) ───
  {
    name: 'ไม้อัด', nameEn: 'Plywood', slug: 'plywood',
    code: 'PLY', type: 'construction', category: 'ไม้อัด', recommended: true,
    defaultImage: 'Board/ไม้อัดยาง A รวม 2413.jpg',
    variations: {
      'เกรด': { showImage: false, entries: [
        { label: 'B/C', sort: 0 },
        { label: 'B/C LG', sort: 1 },
        { label: 'AA', sort: 2 },
        { label: 'A', sort: 3 },
        { label: 'C', sort: 4 },
        { label: 'KU', sort: 5 },
        { label: 'LG', sort: 6 },
        { label: 'ลำโพง', sort: 7 },
        { label: 'มอก ภายใน', sort: 8 },
        { label: 'มอก ภายนอก', sort: 9 },
      ]},
    }
  },
]

// ============================================================
// MAIN: Seed products
// ============================================================

async function main() {
  console.log(`=== SEEDING ${PRODUCTS.length} PRODUCTS ===\n`)

  // Shared group cache: groupKey -> { groupId, entries: [{id, label}] }
  const sharedCache = {}

  let productCount = 0
  let imageCount = 0
  let variationCount = 0
  let totalGroups = 0
  let totalEntries = 0

  for (const p of PRODUCTS) {
    console.log(`\n[${++productCount}/${PRODUCTS.length}] ${p.name} (${p.nameEn})`)

    // 1. Create product
    const productId = await insertProduct(p)
    console.log(`  Product ID: ${productId.substring(0, 8)}...`)

    // 2. Check if product has variation images (showImage groups with productImage entries)
    const hasVariationImages = Object.values(p.variations || {}).some(
      g => g.showImage && g.entries.some(e => e.productImage)
    )

    // 3. Upload default image ONLY if product has no variation images
    if (!hasVariationImages && p.defaultImage) {
      const storagePath = `seed/${p.slug}/${path.basename(p.defaultImage)}`
      const url = await uploadImage(p.defaultImage, storagePath)
      if (url) {
        await insertProductImage(productId, url, true, 0)
        imageCount++
        console.log('  [IMG] Default ✓')
      }
    }

    // 4. Process variation groups
    let isFirstVariationImage = true

    for (const [groupName, groupDef] of Object.entries(p.variations || {})) {
      let groupId
      let entryMap = {} // label -> entryId

      if (groupDef.groupKey && sharedCache[groupDef.groupKey]) {
        // ── SHARED: reuse existing group + entries ──
        const cached = sharedCache[groupDef.groupKey]
        groupId = cached.groupId
        entryMap = cached.entryMap
        console.log(`  [SHARED] ${groupName} (${groupDef.groupKey})`)

        // Link all entries to this product
        for (const entry of groupDef.entries) {
          const entryId = entryMap[entry.label]
          if (entryId) {
            await linkVariation(productId, groupId, entryId, groupDef.showImage)
            variationCount++
          }
        }
      } else {
        // ── NEW: create group + entries ──
        const uniqueName = groupDef.groupKey
          ? `${groupName} (shared)`
          : `${groupName} - ${p.name}`
        groupId = await createVariationGroupDB(uniqueName, groupName)
        totalGroups++
        console.log(`  [GROUP] ${uniqueName}`)

        for (const entry of groupDef.entries) {
          // Upload swatch image (only from swatchImage field, used for shared groups)
          let swatchUrl = null
          if (groupDef.showImage && entry.swatchImage) {
            const swatchPath = `seed/swatches/${path.basename(entry.swatchImage)}`
            swatchUrl = await uploadSwatch(entry.swatchImage, swatchPath)
          } else if (groupDef.showImage && entry.productImage && !groupDef.groupKey) {
            // For non-shared groups, use productImage as swatch
            const swatchPath = `seed/${p.slug}/swatches/${path.basename(entry.productImage)}`
            swatchUrl = await uploadSwatch(entry.productImage, swatchPath)
          }

          const entryId = await createVariationEntry(groupId, entry.label, entry.sort, swatchUrl)
          entryMap[entry.label] = entryId
          totalEntries++

          // Link to product
          await linkVariation(productId, groupId, entryId, groupDef.showImage)
          variationCount++
        }

        // Cache shared group
        if (groupDef.groupKey) {
          sharedCache[groupDef.groupKey] = { groupId, entryMap }
        }
      }

      // 5. Upload per-product variation images
      if (groupDef.showImage) {
        for (const entry of groupDef.entries) {
          if (!entry.productImage) continue
          const entryId = entryMap[entry.label]
          if (!entryId) continue

          const varImgPath = `seed/${p.slug}/variations/${path.basename(entry.productImage)}`
          const varUrl = await uploadImage(entry.productImage, varImgPath)
          if (varUrl) {
            if (isFirstVariationImage) {
              // First variation image: also insert as primary product image (no entry_id)
              await insertProductImage(productId, varUrl, true, 0)
              isFirstVariationImage = false
            }
            await insertProductImage(productId, varUrl, false, entry.sort + 1, entryId)
            imageCount++
          }
        }
      }
    }
  }

  console.log(`\n=== SEED COMPLETE ===`)
  console.log(`  Products: ${productCount}`)
  console.log(`  Images: ${imageCount}`)
  console.log(`  Variation links: ${variationCount}`)
  console.log(`  Groups: ${totalGroups} (${Object.keys(sharedCache).length} shared)`)
  console.log(`  Entries: ${totalEntries}`)
}

main().catch(err => {
  console.error('FATAL:', err)
  process.exit(1)
})
