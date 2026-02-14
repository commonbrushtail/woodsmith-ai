/**
 * Seed script for WoodSmith AI
 *
 * Populates the database with sample data matching the current mock data
 * from the frontend pages.
 *
 * Usage: node --env-file=.env.local scripts/seed.js
 */

const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function seed() {
  console.log('Seeding database...\n')

  // Clean existing seed data (order matters due to FK constraints)
  console.log('  Cleaning existing data...')
  const tables = [
    'product_images', 'product_options', 'quotations',
    'products', 'banners', 'blog_posts', 'video_highlights',
    'gallery_items', 'manuals', 'about_us', 'branches', 'faqs', 'company_profile',
  ]
  for (const table of tables) {
    await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000')
  }
  console.log('    Cleaned\n')

  // 1. Products
  console.log('  Seeding products...')
  const { error: productsError } = await supabase.from('products').insert([
    { code: 'TEAK-001', sku: 'WS-TEAK-001', name: 'ไม้สักทอง', type: 'construction', category: 'ไม้แปรรูป', description: 'ไม้สักทองคุณภาพสูง เหมาะสำหรับงานก่อสร้างและตกแต่ง', published: true, sort_order: 1 },
    { code: 'TEAK-002', sku: 'WS-TEAK-002', name: 'ไม้สักแปรรูป', type: 'construction', category: 'ไม้แปรรูป', description: 'ไม้สักแปรรูปสำหรับงานโครงสร้าง', published: true, sort_order: 2 },
    { code: 'PLY-001', sku: 'WS-PLY-001', name: 'ไม้อัดยาง', type: 'construction', category: 'ไม้อัด', description: 'ไม้อัดยางคุณภาพ สำหรับงานเฟอร์นิเจอร์', published: true, sort_order: 3 },
    { code: 'PLY-002', sku: 'WS-PLY-002', name: 'ไม้อัดสัก', type: 'construction', category: 'ไม้อัด', description: 'ไม้อัดสักคุณภาพพรีเมียม', published: true, sort_order: 4 },
    { code: 'DEC-001', sku: 'WS-DEC-001', name: 'ไม้พื้นสำเร็จรูป', type: 'decoration', category: 'ไม้พื้น', description: 'ไม้พื้นสำเร็จรูปพร้อมติดตั้ง', published: true, sort_order: 5 },
    { code: 'DEC-002', sku: 'WS-DEC-002', name: 'ไม้ระแนง', type: 'decoration', category: 'ไม้ตกแต่ง', description: 'ไม้ระแนงสำหรับตกแต่งผนังและฝ้า', published: true, sort_order: 6 },
    { code: 'DEC-003', sku: 'WS-DEC-003', name: 'บัวไม้', type: 'decoration', category: 'ไม้ตกแต่ง', description: 'บัวไม้สำหรับตกแต่งขอบผนัง', published: true, sort_order: 7 },
    { code: 'TOOL-001', sku: 'WS-TOOL-001', name: 'กาวติดไม้', type: 'tool', category: 'อุปกรณ์', description: 'กาวติดไม้คุณภาพสูง แห้งเร็ว', published: true, sort_order: 8 },
    { code: 'TOOL-002', sku: 'WS-TOOL-002', name: 'น้ำมันรักษาเนื้อไม้', type: 'tool', category: 'อุปกรณ์', description: 'น้ำมันรักษาเนื้อไม้ ป้องกันปลวกและเชื้อรา', published: true, sort_order: 9 },
    { code: 'DRAFT-001', sku: 'WS-DRAFT-001', name: 'ไม้สักทอง (แบบร่าง)', type: 'construction', category: 'ไม้แปรรูป', description: 'สินค้าตัวอย่างที่ยังไม่เผยแพร่', published: false, sort_order: 10 },
  ])
  if (productsError) console.log('    Error:', productsError.message)
  else console.log('    10 products seeded')

  // 2. Banners
  console.log('  Seeding banners...')
  const { error: bannersError } = await supabase.from('banners').insert([
    { image_url: '/placeholder-banner-1.jpg', link_url: '/products', status: 'active', sort_order: 1 },
    { image_url: '/placeholder-banner-2.jpg', link_url: '/about', status: 'active', sort_order: 2 },
    { image_url: '/placeholder-banner-3.jpg', link_url: '/blog', status: 'inactive', sort_order: 3 },
  ])
  if (bannersError) console.log('    Error:', bannersError.message)
  else console.log('    3 banners seeded')

  // 3. Blog posts
  console.log('  Seeding blog posts...')
  const { error: blogError } = await supabase.from('blog_posts').insert([
    { title: 'วิธีเลือกไม้สำหรับบ้าน', slug: 'how-to-choose-wood', content: '<p>การเลือกไม้สำหรับบ้านเป็นเรื่องสำคัญ ต้องพิจารณาหลายปัจจัย</p>', published: true, sort_order: 1 },
    { title: 'เทรนด์การตกแต่งบ้านด้วยไม้ 2026', slug: 'wood-decoration-trends-2026', content: '<p>เทรนด์การตกแต่งบ้านด้วยไม้ในปี 2026 เน้นความเป็นธรรมชาติ</p>', published: true, sort_order: 2 },
    { title: 'การดูแลรักษาไม้สัก', slug: 'teak-wood-maintenance', content: '<p>ไม้สักเป็นไม้ที่มีความทนทาน แต่ก็ต้องการการดูแลรักษาที่ดี</p>', published: true, sort_order: 3 },
    { title: 'บทความฉบับร่าง', slug: 'draft-article', content: '<p>บทความนี้ยังไม่เผยแพร่</p>', published: false, sort_order: 4 },
  ])
  if (blogError) console.log('    Error:', blogError.message)
  else console.log('    4 blog posts seeded')

  // 4. Video highlights
  console.log('  Seeding video highlights...')
  const { error: videoError } = await supabase.from('video_highlights').insert([
    { title: 'รีวิวไม้สักทอง WoodSmith', youtube_url: 'https://youtube.com/watch?v=example1', published: true, sort_order: 1 },
    { title: 'วิธีติดตั้งไม้พื้น', youtube_url: 'https://youtube.com/watch?v=example2', published: true, sort_order: 2 },
  ])
  if (videoError) console.log('    Error:', videoError.message)
  else console.log('    2 video highlights seeded')

  // 5. Gallery items
  console.log('  Seeding gallery items...')
  const { error: galleryError } = await supabase.from('gallery_items').insert([
    { image_url: '/placeholder-gallery-1.jpg', caption: 'ผลงานตกแต่งบ้านด้วยไม้สัก', published: true, sort_order: 1 },
    { image_url: '/placeholder-gallery-2.jpg', caption: 'โปรเจกต์ไม้ระแนงตกแต่งผนัง', published: true, sort_order: 2 },
    { image_url: '/placeholder-gallery-3.jpg', caption: 'บ้านไม้สไตล์โมเดิร์น', published: true, sort_order: 3 },
  ])
  if (galleryError) console.log('    Error:', galleryError.message)
  else console.log('    3 gallery items seeded')

  // 6. Manuals
  console.log('  Seeding manuals...')
  const { error: manualsError } = await supabase.from('manuals').insert([
    { title: 'คู่มือการติดตั้งไม้พื้น', file_url: '/manuals/floor-installation.pdf', published: true, sort_order: 1 },
    { title: 'คู่มือการดูแลรักษาไม้', file_url: '/manuals/wood-maintenance.pdf', published: true, sort_order: 2 },
  ])
  if (manualsError) console.log('    Error:', manualsError.message)
  else console.log('    2 manuals seeded')

  // 7. About Us (singleton)
  console.log('  Seeding about us...')
  const { error: aboutError } = await supabase.from('about_us').insert([
    { content: '<p>WoodSmith เป็นผู้นำด้านวัสดุไม้ก่อสร้างและตกแต่งในประเทศไทย ด้วยประสบการณ์กว่า 30 ปี</p>' },
  ])
  if (aboutError) console.log('    Error:', aboutError.message)
  else console.log('    About us seeded')

  // 8. Branches
  console.log('  Seeding branches...')
  const { error: branchesError } = await supabase.from('branches').insert([
    { name: 'สาขาบางนา', address: '123 ถ.บางนา-ตราด กรุงเทพฯ 10260', phone: '02-123-4567', published: true, sort_order: 1 },
    { name: 'สาขารังสิต', address: '456 ถ.พหลโยธิน ปทุมธานี 12000', phone: '02-987-6543', published: true, sort_order: 2 },
    { name: 'สาขาเชียงใหม่', address: '789 ถ.ห้วยแก้ว เชียงใหม่ 50200', phone: '053-123-456', published: true, sort_order: 3 },
  ])
  if (branchesError) console.log('    Error:', branchesError.message)
  else console.log('    3 branches seeded')

  // 9. FAQs
  console.log('  Seeding FAQs...')
  const { error: faqsError } = await supabase.from('faqs').insert([
    { question: 'WoodSmith รับประกันสินค้าหรือไม่?', answer: 'WoodSmith รับประกันคุณภาพสินค้าทุกชิ้น หากพบปัญหาสามารถติดต่อเราได้ทันที', published: true, sort_order: 1 },
    { question: 'สั่งซื้อสินค้าออนไลน์ได้อย่างไร?', answer: 'สามารถกดปุ่ม "ขอใบเสนอราคา" ในหน้ารายละเอียดสินค้า แล้วกรอกข้อมูลติดต่อ ทีมงานจะติดต่อกลับภายใน 24 ชั่วโมง', published: true, sort_order: 2 },
    { question: 'มีบริการจัดส่งหรือไม่?', answer: 'เรามีบริการจัดส่งทั่วประเทศ ค่าจัดส่งขึ้นอยู่กับน้ำหนักและระยะทาง', published: true, sort_order: 3 },
  ])
  if (faqsError) console.log('    Error:', faqsError.message)
  else console.log('    3 FAQs seeded')

  // 10. Company profile (singleton)
  console.log('  Seeding company profile...')
  const { error: profileError } = await supabase.from('company_profile').insert([
    {
      content: '<p>WoodSmith - ผู้เชี่ยวชาญด้านไม้ก่อสร้างและตกแต่ง</p>',
      social_links: {
        facebook: 'https://facebook.com/woodsmith',
        line: '@woodsmith',
        instagram: 'https://instagram.com/woodsmith',
      },
    },
  ])
  if (profileError) console.log('    Error:', profileError.message)
  else console.log('    Company profile seeded')

  console.log('\nDone!')
}

seed().catch(console.error)
