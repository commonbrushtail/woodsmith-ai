/**
 * Upload product images from xlsx folder to Supabase Storage
 * and update product_images + variation_entries tables.
 *
 * Usage: node --env-file=.env.local scripts/upload-product-images.js
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const BASE_DIR = path.join(__dirname, '..', 'Vanachai website map 040326', 'Vanachai website map')
const BUCKET = 'products'

// Product name -> image mapping from xlsx analysis
// [SINGLE] = one main image for the product
// [PER-COLOR] = per-color variant images
const IMAGE_MAP = {
  // Single-image products
  'โต๊ะ': { main: 'Table/โต๊ะพับ.jpg' },
  'ประตูไม้อัด': { main: 'Door/ประตูไม้อัด.jpg' },
  'ประตูสักประดิษฐ์': { main: 'Door/สักประดิษฐ์.jpg' },
  'ไม้โพลีเอสเตอร์': { main: 'Board/Polyesterbord MDY รวม 6425.jpg' },
  'ไม้ MDF': { main: 'Board/MDF รวม 2470.jpg' },
  'ไม้ MDF ปิดผิวเมลามีน': { main: 'Board/MDF-MELAMINE รวม 2466.jpg' },
  'ไม้ MDF HMR V313': { main: 'Board/MDF-HMR รวม 2462.jpg' },
  'ไม้ MDF HMR V70': { main: 'Board/MDF-HMR รวม 2462.jpg' },
  'ไม้ PB': { main: 'Board/ไม้เปลือย PBNGE2 รวม 2474.jpg' },
  'ไม้ OSB2 ภายใน': { main: 'Board/OSB 7322.png' },
  'ไม้ OSB3 ภายใน': { main: 'Board/OSB 7322.png' },
  'ไม้ OSB2 ภายนอก': { main: 'Board/OSB 7322.png' },
  'ไม้ OSB3 ภายนอก': { main: 'Board/OSB 7322.png' },
  'ไม้ OSB2 ทนชื้น': { main: 'Board/OSB 7322.png' },
  'ไม้อัด': { main: 'Board/ไม้อัดยาง A รวม 2413.jpg' },
  'ไม้อัด ภายใน': { main: 'Board/ไม้อัดยาง A รวม 2413.jpg' },
  'ไม้อัด ภายนอก': { main: 'Board/ไม้อัดยาง A รวม 2413.jpg' },
  'ไม้แบบ': { main: 'Board/ไม้แบบหล่อคอนกรีตกำลัง 4 (ขอบส้ม) 15 2425.jpg' },
  'ไม้พื้น Veneer': { main: 'Flooring/VV 10601_iso view.png' },
  'ไม้ฝาตกแต่ง US': { main: 'Decorative panel/25 HMR_US-105 9 MM-690 x 900 Pix.jpg' },
  'ไม้ฝาตกแต่ง AR': { main: 'Decorative panel/01 HMR_AR-105 9 MM-690 x 900 Pix.jpg' },

  // Per-color products (doors)
  'ประตูเมลามีน': {
    main: 'Door/VM10120.jpg',
    colors: {
      '10120': 'Door/VM10120.jpg',
      '10670': 'Door/VM10670.jpg',
      '10723': 'Door/VM10723.jpg',
      '10780': 'Door/VM10780.jpg',
      '20638': 'Door/VM20638.jpg',
    }
  },
  'ประตูเมลามีนพร้อมวงกบ': {
    main: 'Door/VM10120_Frame.jpg',
    colors: {
      '10120': 'Door/VM10120_Frame.jpg',
      '10670': 'Door/VM10670_Frame.jpg',
      '10723': 'Door/VM10723_Frame.jpg',
      '10780': 'Door/VM10780_Frame.jpg',
      '20638': 'Door/VM20638_Frame.jpg',
    }
  },
  'ประตูเมลามีนกันน้ำ': {
    main: 'Door/10120-ME5.png',
    colors: {
      '10120': 'Door/10120-ME5.png',
      '10670': 'Door/VM10670ME4.jpg',
      '10723': 'Door/10723-ME2.png',
      '10780': 'Door/10780MAG1.jpg',
      '20638': 'Door/20638-ME1.png',
    }
  },
  'ประตูลูกฟัก': {
    main: 'Door/1MV1.jpg',
    colors: {
      '1MV1': 'Door/1MV1.jpg', '2MV1': 'Door/2MV1.jpg', '2MV2': 'Door/2MV2.jpg',
      '2MV3': 'Door/2MV3.jpg', '3MV1': 'Door/3MV1.jpg', '3MV2': 'Door/3MV2.jpg',
      '4MV1': 'Door/4MV1.jpg', '4MV2': 'Door/4MV2.jpg', '4MV3': 'Door/4MV3.jpg',
      '6MV1': 'Door/6MV1.jpg',
    }
  },
  'ประตูลูกฟักพร้อมวงกบ': {
    main: 'Door/1MV1_F.jpg',
    colors: {
      '1MV1': 'Door/1MV1_F.jpg', '2MV1': 'Door/2MV1_F.jpg', '2MV2': 'Door/2MV2_F.jpg',
      '2MV3': 'Door/2MV3_F.jpg', '3MV1': 'Door/3MV1_F.jpg', '3MV2': 'Door/3MV2_F.jpg',
      '4MV1': 'Door/4MV1_F.jpg', '4MV2': 'Door/4MV2_F.jpg', '4MV3': 'Door/4MV3_F.jpg',
      '6MV1': 'Door/6MV1_F.jpg',
    }
  },
  'ประตูHMR': {
    main: 'Door/1MV1 HMR DOOR _ 7237.jpg',
    colors: {
      '1MV1': 'Door/1MV1 HMR DOOR _ 7237.jpg',
      '2MV2': 'Door/2MV2 HMR DOOR 7232.jpg',
      '3MV1': 'Door/3MV1 HMR DOOR 7223.jpg',
      '4MV2': 'Door/4MV2 HMR DOOR 7246.jpg',
      '6MV1': 'Door/6MV1 HMR DOOR 7230.jpg',
      'FV1': 'Door/FV1 HMR DOOR 7248.jpg',
      'FV2': 'Door/FV2 HMR DOOR 7240.jpg',
    }
  },
  'ประตูปิดPVC': {
    main: 'Door/PE01-67819.jpg',
    colors: {
      'PE1-67819': 'Door/PE01-67819.jpg',
      'PE1-67838': 'Door/PE01-67838.jpg',
      'PE2-67819': 'Door/PE02-67819.jpg',
      'PE2-67838': 'Door/PE02-67838.jpg',
    }
  },

  // Per-color flooring
  'ไม้พื้นลามิเนต': {
    main: 'Flooring/MD10617-0995.jpg',
    colors: {
      '10617': 'Flooring/MD10617-0995.jpg',
      '10623': 'Flooring/MD10623-1001.jpg',
      '10625': 'Flooring/MD10625-1009.jpg',
      '10670': 'Flooring/MD10670-1094.jpg',
      '10720': 'Flooring/MD10720-1102.jpg',
      '10722': 'Flooring/MD10722-1022.jpg',
      '10732': 'Flooring/MD10732-1038.jpg',
      '10742': 'Flooring/MD10742-1149.jpg',
      '10743': 'Flooring/MD10743-1047.jpg',
      '20638': 'Flooring/MD20638-1063.jpg',
      '20649': 'Flooring/MD20649-1071.jpg',
    }
  },
  'ไม้พื้นลามิเนตปลอดสารฟอมัลดีไฮด์': {
    main: 'Flooring/MD10617-0995.jpg',
    colors: {
      '10617': 'Flooring/MD10617-0995.jpg',
      '10623': 'Flooring/MD10623-1001.jpg',
      '10625': 'Flooring/MD10625-1009.jpg',
      '10670': 'Flooring/MD10670-1094.jpg',
      '10720': 'Flooring/MD10720-1102.jpg',
      '10722': 'Flooring/MD10722-1022.jpg',
      '10732': 'Flooring/MD10732-1038.jpg',
      '10742': 'Flooring/MD10742-1149.jpg',
      '10743': 'Flooring/MD10743-1047.jpg',
      '20638': 'Flooring/MD20638-1063.jpg',
      '20649': 'Flooring/MD20649-1071.jpg',
    }
  },
  'ไม้พื้น Hybrid HMR': {
    main: 'Flooring/01 VF10612  HYBRID 7265.png',
    colors: {
      '**1**': 'Flooring/01 VF10612  HYBRID 7265.png',
      '**2**': 'Flooring/03 VF10689  HYBRID 7270.png',
      '**3**': 'Flooring/05 VF10696  HYBRID 7271.png',
      '**4**': 'Flooring/06 VF10752 HYBRID 7275.png',
    }
  },
  'ไม้พื้น Hybrid Ultra': {
    main: 'Flooring/ไม้พื้น Ultra 01 MD 10667 Waterproof 7283.png',
    colors: {
      '*1*': 'Flooring/ไม้พื้น Ultra 01 MD 10667 Waterproof 7283.png',
      '*2*': 'Flooring/ไม้พื้น Ultra 03 MD 10667 Waterproof 7283.png',
    }
  },
}

// Track uploaded URLs to avoid re-uploading the same file
const uploadedCache = {}
const crypto = require('crypto')

function sanitizeStoragePath(relPath) {
  // Replace Thai/non-ASCII chars with a hash, keep folder structure and extension
  const dir = path.dirname(relPath).replace(/\\/g, '/')
  const ext = path.extname(relPath).toLowerCase()
  const base = path.basename(relPath, ext)
  // If filename has non-ASCII chars, hash it
  const hasNonAscii = /[^\x00-\x7F]/.test(base)
  const safeName = hasNonAscii
    ? crypto.createHash('md5').update(base).digest('hex').slice(0, 12)
    : base.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9._-]/g, '')
  return `seed/${dir}/${safeName}${ext}`
}

async function uploadImage(localRelPath) {
  if (uploadedCache[localRelPath]) {
    return uploadedCache[localRelPath]
  }

  const fullPath = path.join(BASE_DIR, localRelPath)
  if (!fs.existsSync(fullPath)) {
    console.log(`  WARNING: File not found: ${fullPath}`)
    return null
  }

  const fileBuffer = fs.readFileSync(fullPath)
  const ext = path.extname(localRelPath).toLowerCase()
  const contentType = ext === '.png' ? 'image/png' : 'image/jpeg'

  const storagePath = sanitizeStoragePath(localRelPath)

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, fileBuffer, {
      contentType,
      upsert: true,
    })

  if (error) {
    console.log(`  ERROR uploading ${localRelPath}: ${error.message}`)
    return null
  }

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(data.path)
  const publicUrl = urlData.publicUrl

  uploadedCache[localRelPath] = publicUrl
  return publicUrl
}

async function main() {
  console.log('=== Upload Product Images from XLSX ===\n')

  // 1. Get all products from DB
  const { data: products, error: prodErr } = await supabase
    .from('products')
    .select('id, name, slug')
  if (prodErr) { console.error('Failed to fetch products:', prodErr.message); return }

  // Build name -> product lookup
  const productByName = {}
  for (const p of products) {
    productByName[p.name] = p
  }

  // 2. Get all variation entries for the color group
  const COLOR_GROUP_ID = '20000000-0000-0000-0000-000000000002'
  const { data: colorEntries } = await supabase
    .from('variation_entries')
    .select('id, label, group_id')
    .eq('group_id', COLOR_GROUP_ID)

  // Build label -> entry lookup
  const colorEntryByLabel = {}
  for (const e of colorEntries || []) {
    colorEntryByLabel[e.label] = e
  }

  // 3. Get all product_variation_links for color group
  const { data: colorLinks } = await supabase
    .from('product_variation_links')
    .select('id, product_id, entry_id, group_id')
    .eq('group_id', COLOR_GROUP_ID)

  let mainImagesInserted = 0
  let variationImagesUpdated = 0
  let uploadCount = 0

  // 4. Process each product in IMAGE_MAP
  for (const [productName, mapping] of Object.entries(IMAGE_MAP)) {
    const product = productByName[productName]
    if (!product) {
      console.log(`SKIP: Product "${productName}" not found in DB`)
      continue
    }

    console.log(`\nProcessing: ${productName} (${product.id})`)

    // Upload and insert main product image
    if (mapping.main) {
      const url = await uploadImage(mapping.main)
      if (url) {
        uploadCount++
        // Check if product_image already exists
        const { data: existing } = await supabase
          .from('product_images')
          .select('id')
          .eq('product_id', product.id)
          .eq('is_primary', true)
          .limit(1)

        if (existing && existing.length > 0) {
          // Update existing
          await supabase
            .from('product_images')
            .update({ url })
            .eq('id', existing[0].id)
          console.log(`  Updated main image`)
        } else {
          // Insert new
          const { error: insertErr } = await supabase
            .from('product_images')
            .insert({
              product_id: product.id,
              url,
              is_primary: true,
              sort_order: 0,
            })
          if (insertErr) {
            console.log(`  ERROR inserting main image: ${insertErr.message}`)
          } else {
            mainImagesInserted++
            console.log(`  Inserted main image`)
          }
        }
      }
    }

    // Upload and set per-color variation images
    if (mapping.colors) {
      for (const [colorLabel, imgPath] of Object.entries(mapping.colors)) {
        const entry = colorEntryByLabel[colorLabel]
        if (!entry) {
          console.log(`  SKIP color "${colorLabel}": not found in variation_entries`)
          continue
        }

        const url = await uploadImage(imgPath)
        if (url) {
          uploadCount++
          // Update variation_entries.image_url
          const { error: updateErr } = await supabase
            .from('variation_entries')
            .update({ image_url: url })
            .eq('id', entry.id)
          if (updateErr) {
            console.log(`  ERROR updating entry ${colorLabel}: ${updateErr.message}`)
          } else {
            variationImagesUpdated++
            console.log(`  Set image for color "${colorLabel}"`)
          }
        }
      }
    }
  }

  console.log('\n=== Summary ===')
  console.log(`  Unique files uploaded: ${Object.keys(uploadedCache).length}`)
  console.log(`  Main product images inserted: ${mainImagesInserted}`)
  console.log(`  Variation entry images updated: ${variationImagesUpdated}`)
}

main().catch(console.error)
