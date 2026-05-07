/**
 * Delete ALL products, variations, and product images from Supabase.
 * Also empties the 'products' storage bucket.
 *
 * Usage: node --env-file=.env.local scripts/cleanup-products.js
 */

const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function deleteAllStorageFiles() {
  console.log('\n--- Cleaning products storage bucket ---')
  // List all files recursively (up to 1000 at a time)
  let totalDeleted = 0
  let hasMore = true
  while (hasMore) {
    const { data: files, error } = await supabase.storage
      .from('products')
      .list('', { limit: 1000 })
    if (error) {
      console.error('Error listing storage:', error.message)
      break
    }
    if (!files || files.length === 0) {
      hasMore = false
      break
    }

    // Some entries might be folders — need to recurse
    for (const item of files) {
      if (item.id) {
        // It's a file
        const { error: delErr } = await supabase.storage.from('products').remove([item.name])
        if (delErr) console.error(`  Failed to delete ${item.name}:`, delErr.message)
        else totalDeleted++
      } else {
        // It's a folder — list and delete contents
        await deleteFolderRecursive(item.name)
      }
    }

    // Check if we might have more
    if (files.length < 1000) hasMore = false
  }
  console.log(`  Deleted ${totalDeleted} root-level files`)
}

async function deleteFolderRecursive(folderPath) {
  const { data: files, error } = await supabase.storage
    .from('products')
    .list(folderPath, { limit: 1000 })
  if (error || !files) return

  for (const item of files) {
    const fullPath = `${folderPath}/${item.name}`
    if (item.id) {
      const { error: delErr } = await supabase.storage.from('products').remove([fullPath])
      if (delErr) console.error(`  Failed to delete ${fullPath}:`, delErr.message)
      else process.stdout.write('.')
    } else {
      await deleteFolderRecursive(fullPath)
    }
  }
}

async function main() {
  console.log('=== CLEANUP: Deleting all products, variations, and storage ===\n')

  // 1. Delete product_images (references products + variation_entries)
  console.log('--- Deleting product_images ---')
  const { count: imgCount, error: imgErr } = await supabase
    .from('product_images')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000') // match all
    .select('*', { count: 'exact', head: true })
  if (imgErr) console.error('  Error:', imgErr.message)
  else console.log(`  Deleted ${imgCount ?? 'all'} product_images`)

  // 2. Delete product_variation_links
  console.log('--- Deleting product_variation_links ---')
  const { error: linkErr } = await supabase
    .from('product_variation_links')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000')
  if (linkErr) console.error('  Error:', linkErr.message)
  else console.log('  Done')

  // 3. Delete product_options
  console.log('--- Deleting product_options ---')
  const { error: optErr } = await supabase
    .from('product_options')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000')
  if (optErr) console.error('  Error:', optErr.message)
  else console.log('  Done')

  // 4. Delete variation_entries (references variation_groups)
  console.log('--- Deleting variation_entries ---')
  const { error: entryErr } = await supabase
    .from('variation_entries')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000')
  if (entryErr) console.error('  Error:', entryErr.message)
  else console.log('  Done')

  // 5. Delete variation_groups
  console.log('--- Deleting variation_groups ---')
  const { error: groupErr } = await supabase
    .from('variation_groups')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000')
  if (groupErr) console.error('  Error:', groupErr.message)
  else console.log('  Done')

  // 6. Delete products
  console.log('--- Deleting products ---')
  const { error: prodErr } = await supabase
    .from('products')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000')
  if (prodErr) console.error('  Error:', prodErr.message)
  else console.log('  Done')

  // 7. Clean up storage
  await deleteAllStorageFiles()

  console.log('\n=== CLEANUP COMPLETE ===')
}

main().catch(console.error)
