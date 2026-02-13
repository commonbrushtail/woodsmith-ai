'use client'

import { useState, use } from 'react'
import Link from 'next/link'
import ArrowRight from '../../../components/ArrowRight'
import imgSearch from '../../../assets/icon_search.svg'
import imgRectangle15 from '../../../assets/0e0c21ac59c543d45fcb74164df547c01c8f3962.png'
import imgRectangle21 from '../../../assets/c173adf2801ab483dbd02d79c3a7c79625fdb495.png'
import imgRectangle22 from '../../../assets/3e2d5dd8c39488aa06c2f75daa4454423645d914.png'
import imgRectangle23 from '../../../assets/363360e0eabb614000b96e9e0872777c65463b3a.png'
import imgRectangle24 from '../../../assets/0c3090fa51a394a39ced02aa6235d63e1ed6948a.png'
import imgRectangle25 from '../../../assets/e9b01d1a4a14a251433baa636e611ba911b29402.png'

const categoryData = {
  construction: {
    title: 'วัสดุก่อสร้าง',
    subcategories: [
      { slug: 'particleboard', image: imgRectangle15, thaiName: 'ปาร์ติเกิลบอร์ด', engName: 'ParticleBoard', count: 20 },
      { slug: 'osb', image: imgRectangle21, thaiName: 'ไม้อัด OSB', engName: 'Oriented Strand Board', count: 20 },
      { slug: 'mdf', image: imgRectangle22, thaiName: 'แผ่นใยไม้อัด MDF', engName: 'Medium Density Fiberboard', count: 20 },
      { slug: 'hdf', image: imgRectangle23, thaiName: 'แผ่นใยไม้อัด HDF', engName: 'High Density FiberBoard', count: 20 },
      { slug: 'laminated-board', image: imgRectangle24, thaiName: 'ไม้บอร์ดปิดผิว', engName: 'Laminated Board', count: 20 },
    ],
    filterItems: [
      'ปาร์ติเกิลบอร์ด (20)',
      'ไม้อัด OSB (15)',
      'แผ่นใยไม้อัด MDF (12)',
      'แผ่นใยไม้อัด HDF (12)',
      'ไม้บอร์ดปิดผิว (12)',
      'ไม้แผ่นรีไซเคิล (8)',
      'ไฟเบอร์ซีเมนต์บอร์ด (10)',
      'ยิปซั่มบอร์ด (12)',
    ],
    products: [
      { image: imgRectangle15, category: 'ปาร์ติเกิลบอร์ด', name: 'PB : ParticleBoard' },
      { image: imgRectangle21, category: 'ไม้อัด OSB', name: 'OSB : Oriented Strand Board' },
      { image: imgRectangle22, category: 'แผ่นใยไม้อัด MDF', name: 'MDF : Medium Density Fiberboard' },
      { image: imgRectangle23, category: 'แผ่นใยไม้อัด HDF', name: 'HDF : High Density Fiber Board' },
      { image: imgRectangle24, category: 'ไม้บอร์ดปิดผิว', name: 'Laminated Board' },
      { image: imgRectangle25, category: 'ไม้บอร์ดปิดผิว', name: 'Shuttering Board' },
      { image: imgRectangle15, category: 'ปาร์ติเกิลบอร์ด', name: 'PB : ParticleBoard รุ่น Standard' },
      { image: imgRectangle22, category: 'แผ่นใยไม้อัด MDF', name: 'MDF : Medium Density Fiberboard รุ่น V-Groove' },
      { image: imgRectangle23, category: 'แผ่นใยไม้อัด HDF', name: 'HDF : High Density Fiber Board รุ่น White oak' },
      { image: imgRectangle21, category: 'ไม้อัด OSB', name: 'OSB : Oriented Strand Board รุ่น Standard' },
      { image: imgRectangle24, category: 'ไม้บอร์ดปิดผิว', name: 'Laminated Board รุ่น Natural' },
      { image: imgRectangle25, category: 'ไม้บอร์ดปิดผิว', name: 'Shuttering Board รุ่น Pro' },
      { image: imgRectangle15, category: 'ปาร์ติเกิลบอร์ด', name: 'PB : ParticleBoard รุ่น Premium' },
    ],
  },
  finished: {
    title: 'ผลิตภัณฑ์สำเร็จ',
    subcategories: [
      { slug: 'flooring', image: imgRectangle15, thaiName: 'ไม้พื้น', engName: 'Flooring', count: 20 },
      { slug: 'staircase', image: imgRectangle23, thaiName: 'ไม้บันได', engName: 'Staircase', count: 20 },
      { slug: 'wall-panel', image: imgRectangle22, thaiName: 'ไม้ตกแต่งผนัง/ไม้ฝาตกแต่ง', engName: 'Wall Decorative Panel', count: 20 },
      { slug: 'skirt', image: imgRectangle24, thaiName: 'บัวพื้น/บัวเพดาน', engName: 'Skirt', count: 20 },
      { slug: 'melamine-table', image: imgRectangle25, thaiName: 'โต๊ะปิดผิวเมลามีน', engName: 'Melamine Top table/ Multipurpose cabinet', count: 20 },
    ],
    filterItems: [
      'ไม้พื้น (24)',
      'ไม้พื้นลามิเนต (11)',
      'ไม้บันได (12)',
      'ไม้ตกแต่งผนัง (10)',
      'บัวพื้น/บัวเพดาน (12)',
      'สำเร็จรูปเมลามีน (12)',
      'ประตูเมลามีน (8)',
      'บานหน้าต่าง (6)',
    ],
    products: [
      { image: imgRectangle15, category: 'ไม้พื้น', name: 'ไม้พื้นลามิเนต รุ่น Standard' },
      { image: imgRectangle21, category: 'ไม้พื้น', name: 'ไม้พื้นลามิเนต รุ่น V-Groove' },
      { image: imgRectangle22, category: 'ไม้พื้น', name: 'ไม้พื้นลามิเนตแบบแผ่นยาว' },
      { image: imgRectangle23, category: 'ไม้พื้น', name: 'ไม้พื้นลามิเนตแบบแผ่นกว้าง' },
      { image: imgRectangle24, category: 'ไม้พื้น', name: 'ไม้พื้นไม้ HDF เคลือบผิว' },
      { image: imgRectangle25, category: 'ไม้พื้น', name: 'ไม้พื้นไม้ HDF เคลือบผิว VY15003 White oak' },
      { image: imgRectangle22, category: 'ไม้บันได', name: 'ไม้พื้น ลูกตั้ง' },
      { image: imgRectangle23, category: 'ไม้บันได', name: 'ไม้พื้น ลูกนอน' },
      { image: imgRectangle15, category: 'บัวพื้น', name: 'ตัวจบไม้พื้น SK004 – Skirting ตัวจบพื้น' },
      { image: imgRectangle21, category: 'บัวพื้น', name: 'ตัวจบไม้พื้น TS401 – Transition ตัวจบครอบจมูก WPC' },
      { image: imgRectangle24, category: 'บัวพื้น', name: 'ตัวจบไม้พื้น JT601 – Joint ตัวจบครอบจมูก WPC' },
      { image: imgRectangle25, category: 'บัวพื้น', name: 'ตัวจบไม้พื้น EG501 – Edge ตัวจบครอบข้าง WPC' },
      { image: imgRectangle22, category: 'บัวพื้น', name: 'ตัวจบไม้พื้น OC201 – Cover ตัวครอบตะเฆ่ลอย' },
    ],
  },
}

const DESKTOP_PAGE_SIZE = 16
const MOBILE_PAGE_SIZE = 6

function HomeIcon() {
  return (
    <svg className="size-[14px] shrink-0 relative bottom-[2px]" viewBox="0 0 24 24" fill="none">
      <path d="M3 10.5L12 3L21 10.5V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V10.5Z" stroke="#202124" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 22V12H15V22" stroke="#202124" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronRightIcon() {
  return (
    <svg className="size-[16px] shrink-0" viewBox="0 0 24 24" fill="none">
      <path d="M9 6L15 12L9 18" stroke="#202124" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Breadcrumb({ categoryTitle }) {
  return (
    <nav className="flex gap-[8px] items-center px-[20px] lg:px-0 w-full">
      <Link href="/" className="flex gap-[4px] items-center no-underline shrink-0">
        <HomeIcon />
        <span className="font-['IBM_Plex_Sans_Thai'] text-[12px] text-[#202124] tracking-[0.06px] leading-[20px]">
          หน้าแรก
        </span>
      </Link>
      <ChevronRightIcon />
      <Link href="/products" className="no-underline shrink-0">
        <span className="font-['IBM_Plex_Sans_Thai'] text-[12px] text-[#202124] tracking-[0.06px] leading-[20px]">
          สินค้าของเรา
        </span>
      </Link>
      <ChevronRightIcon />
      <span className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[12px] text-[#202124] tracking-[0.06px] leading-[20px] truncate">
        {categoryTitle}
      </span>
    </nav>
  )
}

function SubcategoryCard({ image, thaiName, engName, count }) {
  return (
    <div className="flex flex-col gap-[16px] items-start w-full">
      <div className="aspect-[200/268] relative w-full overflow-hidden">
        <div className="absolute bg-[#e8e3da] inset-0" />
        <img alt="" className="absolute max-w-none object-cover size-full" src={image} />
      </div>
      <div className="flex flex-col items-start text-black w-full">
        <p className="font-['IBM_Plex_Sans_Thai'] font-medium text-[15px] tracking-[0.15px]">
          {thaiName}
        </p>
        <p className="font-['Circular_Std'] font-medium text-[20px] leading-[1.2]">
          {engName}
        </p>
        <p className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-grey tracking-[0.13px] mt-[2px]">
          {count} สินค้า
        </p>
      </div>
    </div>
  )
}

function ProductCard({ image, category, name }) {
  return (
    <div className="flex flex-col gap-[16px] items-start w-full">
      <div className="h-[170px] lg:h-[222px] relative w-full overflow-hidden">
        <div className="absolute bg-[#e8e3da] inset-0" />
        <img alt="" className="absolute max-w-none object-cover size-full" src={image} />
      </div>
      <div className="flex flex-col gap-[2px] items-start w-full">
        <p className="font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] text-black tracking-[0.14px]">
          {category}
        </p>
        <p className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[16px] text-black leading-[1.2] tracking-[0.16px] overflow-hidden text-ellipsis w-full">
          {name}
        </p>
        <div className="flex gap-[8px] items-center mt-[2px]">
          <p className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-black tracking-[0.28px]">
            ดูรายละเอียด
          </p>
          <ArrowRight />
        </div>
      </div>
    </div>
  )
}

function FilterSection({ title, items, isOpen, onToggle }) {
  return (
    <div className="border border-[#e5e7eb] bg-white px-[12px] py-[8px] w-full">
      <button
        className="flex items-center justify-between w-full bg-transparent border-none cursor-pointer p-0"
        onClick={onToggle}
      >
        <p className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[16px] text-black tracking-[0.32px]">
          {title}
        </p>
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        >
          <path d="M5 7.5L10 12.5L15 7.5" stroke="#35383b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {isOpen && (
        <div className="flex flex-col mt-[4px]">
          {items.map((item) => (
            <label key={item} className="flex gap-[16px] items-start py-[6px] cursor-pointer">
              <input type="checkbox" className="shrink-0 size-[16px] mt-[4px] accent-orange" />
              <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[15px] text-black leading-[1.6]">
                {item}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}

function Pagination({ currentPage, totalPages, onPageChange }) {
  const pages = []
  for (let i = 1; i <= Math.min(3, totalPages); i++) {
    pages.push(i)
  }
  if (totalPages > 4) {
    pages.push('...')
    pages.push(totalPages)
  } else if (totalPages === 4) {
    pages.push(4)
  }

  return (
    <div className="flex items-center justify-center w-full gap-[4px]">
      <button
        className="flex gap-[8px] items-center h-[38px] px-[8px] bg-transparent border-none cursor-pointer"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 12L6 8L10 4" stroke="#35383b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[16px] text-black">ก่อนหน้า</span>
      </button>
      <div className="flex items-center">
        {pages.map((page, i) =>
          page === '...' ? (
            <span key={`dots-${i}`} className="size-[38px] flex items-center justify-center font-['IBM_Plex_Sans_Thai'] text-[12px] text-black">
              •••
            </span>
          ) : (
            <button
              key={page}
              className={`size-[38px] flex items-center justify-center rounded-full border bg-transparent cursor-pointer font-['IBM_Plex_Sans_Thai'] font-medium text-[16px] leading-[24px] tracking-[0.08px] ${
                currentPage === page
                  ? 'border-2 border-orange text-orange'
                  : 'border-transparent text-black'
              }`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          )
        )}
      </div>
      <button
        className="flex gap-[8px] items-center h-[38px] px-[8px] bg-transparent border-none cursor-pointer"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[16px] text-black">ถัดไป</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M6 4L10 8L6 12" stroke="#35383b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  )
}

export default function ProductCategoryPage({ params }) {
  const { category } = use(params)
  const data = categoryData[category] || categoryData.finished
  const [filterOpen, setFilterOpen] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [mobileVisible, setMobileVisible] = useState(MOBILE_PAGE_SIZE)

  const totalPages = Math.ceil(data.products.length / DESKTOP_PAGE_SIZE) || 1
  const desktopProducts = data.products.slice(
    (currentPage - 1) * DESKTOP_PAGE_SIZE,
    currentPage * DESKTOP_PAGE_SIZE
  )
  const mobileProducts = data.products.slice(0, mobileVisible)
  const mobileRemaining = data.products.length - mobileVisible

  return (
    <div className="flex flex-col items-center w-full">
      {/* Breadcrumb */}
      <div className="max-w-[1212px] mx-auto w-full py-[8px] px-[16px]">
        <Breadcrumb categoryTitle={data.title} />
      </div>

      {/* Category Header + Subcategory Cards */}
      <div className="max-w-[1212px] mx-auto w-full flex flex-col gap-[24px] items-center px-[16px] py-[16px] lg:py-[24px]">
        <div className="flex flex-col gap-[8px] items-center w-full">
          <p className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[32px] lg:text-[48px] text-black text-center leading-[1.3] tracking-[0.25px]">
            {data.title}
          </p>
          <p className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[16px] lg:text-[20px] text-black text-center leading-[1.3]">
            เลือกดูตามหมวดหมู่สินค้า
          </p>
        </div>

        {/* Subcategory cards - horizontal scroll on mobile, grid on desktop */}
        <div className="w-full overflow-x-auto lg:overflow-visible">
          <div className="flex lg:grid lg:grid-cols-5 gap-[20px] lg:gap-[25px] w-max lg:w-full">
            {data.subcategories.map((sub) => (
              <Link key={sub.engName} href={`/products/${category}/${sub.slug}`} className="w-[160px] lg:w-auto shrink-0 no-underline">
                <SubcategoryCard {...sub} />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content: Sidebar + Product Grid */}
      <div className="max-w-[1212px] mx-auto w-full flex gap-[24px] items-start px-[16px] py-[24px] lg:py-[36px]">
        {/* Sidebar - desktop only */}
        <div className="hidden lg:flex flex-col gap-[12px] w-[222px] shrink-0">
          <p className="font-['IBM_Plex_Sans_Thai'] font-medium text-[15px] text-black leading-[1.2]">
            ตัวกรองสินค้า
          </p>
          <FilterSection
            title="หมวดหมู่สินค้า"
            items={data.filterItems}
            isOpen={filterOpen}
            onToggle={() => setFilterOpen((p) => !p)}
          />
        </div>

        {/* Product Grid Area */}
        <div className="flex-1 flex flex-col gap-[16px] lg:gap-[24px] w-full min-w-0">
          {/* Header row */}
          <div className="flex flex-col gap-[6px]">
            <div className="flex items-center justify-between gap-[16px]">
              <p className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[24px] lg:text-[32px] text-black leading-[1.2]">
                สินค้าทั้งหมด
              </p>
              {/* Inline search - desktop */}
              <div className="hidden lg:flex border border-[#e5e7eb] rounded-full items-center gap-[4px] h-[40px] px-[10px] w-[440px]">
                <img alt="" className="shrink-0 size-[18px]" src={imgSearch} />
                <input
                  type="text"
                  placeholder="กำลังมองหาสินค้าอะไร? ค้นหาเลย..."
                  className="pl-1 flex-1 border-none outline-none bg-transparent font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] text-[#6b7280] placeholder:text-[#6b7280] tracking-[0.07px]"
                />
              </div>
            </div>
            <p className="font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] lg:text-[16px] text-black leading-[1.2]">
              {data.products.length} รายการ
            </p>
          </div>

          {/* Desktop product grid */}
          <div className="hidden lg:grid grid-cols-4 gap-[25px] w-full">
            {desktopProducts.map((p, i) => (
              <ProductCard key={i} {...p} />
            ))}
          </div>

          {/* Mobile product grid */}
          <div className="lg:hidden grid grid-cols-2 gap-[16px] w-full">
            {mobileProducts.map((p, i) => (
              <ProductCard key={i} {...p} />
            ))}
          </div>

          {/* Mobile load more */}
          {mobileRemaining > 0 && (
            <div className="lg:hidden flex flex-col gap-[12px] items-center w-full mt-[8px]">
              <button
                className="border border-[#e5e7eb] bg-white flex h-[48px] items-center justify-center w-full cursor-pointer"
                onClick={() => setMobileVisible((prev) => prev + MOBILE_PAGE_SIZE)}
              >
                <span className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[16px] text-black">
                  ดูทั้งหมด
                </span>
              </button>
              <p className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-black">
                อีก {mobileRemaining} รายการ
              </p>
            </div>
          )}

          {/* Desktop pagination */}
          <div className="hidden lg:block mt-[16px]">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
