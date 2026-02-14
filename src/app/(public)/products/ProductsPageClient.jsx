'use client'

import { useState } from 'react'
import Link from 'next/link'
import ArrowRight from '../../../components/ArrowRight'
import imgCategoryBg from '../../../assets/product_category_bg.png'
import imgSearch from '../../../assets/icon_search.svg'
import imgRectangle15 from '../../../assets/0e0c21ac59c543d45fcb74164df547c01c8f3962.png'
import imgRectangle21 from '../../../assets/c173adf2801ab483dbd02d79c3a7c79625fdb495.png'
import imgRectangle22 from '../../../assets/3e2d5dd8c39488aa06c2f75daa4454423645d914.png'
import imgRectangle23 from '../../../assets/363360e0eabb614000b96e9e0872777c65463b3a.png'
import imgRectangle24 from '../../../assets/0c3090fa51a394a39ced02aa6235d63e1ed6948a.png'
import imgRectangle25 from '../../../assets/e9b01d1a4a14a251433baa636e611ba911b29402.png'

const fallbackProducts = [
  { id: '55690', image: imgRectangle15, category: 'ไม้พื้น', name: 'ไม้พื้นลามิเนตแบบแผ่นยาว 55690' },
  { id: '30600', image: imgRectangle21, category: 'ไม้พื้น', name: 'ไม้พื้นลามิเนต รุ่น Standard 30600' },
  { id: '10746', image: imgRectangle22, category: 'ไม้พื้น', name: 'ไม้พื้นลามิเนตแบบแผ่นกว้าง (Wide Plank) 10746' },
  { id: '10172', image: imgRectangle23, category: 'ไม้พื้น', name: 'ไม้พื้นลามิเนต รุ่น V-Groove 10172' },
  { id: 'hdf-01', image: imgRectangle24, category: 'ไม้พื้น', name: 'ไม้พื้นไม้ HDF เคลือบผิว' },
  { id: 'vy15003', image: imgRectangle25, category: 'ไม้พื้น', name: 'ไม้พื้นไม้ HDF เคลือบผิว VY15003 White oak' },
  { id: 'pb-01', image: imgRectangle22, category: 'ไม้บอร์ด', name: 'PB : ParticleBoard' },
  { id: 'mdf-01', image: imgRectangle23, category: 'ไม้บอร์ด', name: 'MDF : Medium Density Fiberboard' },
  { id: 'hdf-02', image: imgRectangle15, category: 'ไม้บอร์ด', name: 'HDF : High Density Fiber Board' },
  { id: 'lb-01', image: imgRectangle21, category: 'ไม้บอร์ด', name: 'Laminated Board' },
  { id: 'osb-01', image: imgRectangle24, category: 'ไม้บอร์ด', name: 'OSB: Oriented Strand Board' },
  { id: 'floor-01', image: imgRectangle25, category: 'ไม้บอร์ด', name: 'ไม้พื้น' },
  { id: '10780', image: imgRectangle22, category: 'ประตู', name: 'ประตูเมลามีน MELAMINE DOOR MAG1 10780' },
  { id: '10790', image: imgRectangle23, category: 'ประตู', name: 'ประตูเมลามีน MELAMINE DOOR MAG1 10790' },
  { id: '2mv1', image: imgRectangle24, category: 'ประตู', name: 'ประตูหลัก HMR+ HDF HMR Moulded Door 2MV1' },
  { id: '4mv2', image: imgRectangle25, category: 'ประตู', name: 'ประตูหลัก HMR+ HDF HMR Moulded Door 4MV2' },
]

const fallbackFilterCategories = [
  {
    title: 'วัสดุก่อสร้าง',
    count: 250,
    items: [
      'ปาร์ติเกิลบอร์ด',
      'ไม้ OSB',
      'แผ่นไฟเบอร์ซีเมนต์และบอร์ดและ ประตูเมลามีน',
      'ไม้อัดเฌอร่า',
      'ไม้อัดยิปซั่มบอร์ด',
      'แผ่นไม้แผ่นรีไซเคิล',
    ],
  },
  {
    title: 'ผลิตภัณฑ์สำเร็จ',
    count: 250,
    items: [
      'ไม้พื้น (24)',
      'ไม้พื้นลามิเนต (11)',
      'ประตูเมลามีน (12)',
      'ไม้ฝา (10)',
      'สำเร็จรูปเมลามีน (12)',
      'บานประตู',
      'บานหน้าต่าง',
    ],
  },
]

const DESKTOP_PAGE_SIZE = 16
const MOBILE_PAGE_SIZE = 6

function ProductCard({ id, image, category, name }) {
  return (
    <Link href={`/product/${id}`} className="flex flex-col gap-[16px] items-start w-full no-underline">
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
    </Link>
  )
}

function FilterSection({ title, count, items, isOpen, onToggle }) {
  return (
    <div className="border border-[#e5e7eb] bg-white px-[12px] py-[8px] w-full">
      <button
        className="flex items-center justify-between w-full bg-transparent border-none cursor-pointer p-0"
        onClick={onToggle}
      >
        <p className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[16px] text-black tracking-[0.32px]">
          {title} ({count})
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
              <input
                type="checkbox"
                className="shrink-0 size-[16px] mt-[4px] accent-orange"
              />
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
      <div className="flex items-center gap-[0px]">
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

export default function ProductsPageClient({ products: dbProducts = [], categories: dbCategories = [] }) {
  const [openFilters, setOpenFilters] = useState(new Set([0, 1]))
  const [currentPage, setCurrentPage] = useState(1)
  const [mobileVisible, setMobileVisible] = useState(MOBILE_PAGE_SIZE)
  const [searchQuery, setSearchQuery] = useState('')

  const allProducts = dbProducts.length > 0
    ? dbProducts.map(p => {
        const primaryImg = p.product_images?.find(img => img.is_primary)
        return {
          id: p.id,
          image: primaryImg?.url || p.product_images?.[0]?.url || imgRectangle15,
          category: p.category || '',
          name: p.name,
        }
      })
    : fallbackProducts

  const filterCategories = dbCategories.length > 0
    ? [
        {
          title: 'วัสดุก่อสร้าง',
          count: dbCategories.filter(c => c.type === 'construction').reduce((sum, c) => sum + c.count, 0),
          items: dbCategories.filter(c => c.type === 'construction').map(c => `${c.name} (${c.count})`),
        },
        {
          title: 'ผลิตภัณฑ์สำเร็จ',
          count: dbCategories.filter(c => c.type !== 'construction').reduce((sum, c) => sum + c.count, 0),
          items: dbCategories.filter(c => c.type !== 'construction').map(c => `${c.name} (${c.count})`),
        },
      ]
    : fallbackFilterCategories

  const totalPages = Math.ceil(allProducts.length / DESKTOP_PAGE_SIZE) || 1
  const desktopProducts = allProducts.slice(
    (currentPage - 1) * DESKTOP_PAGE_SIZE,
    currentPage * DESKTOP_PAGE_SIZE
  )
  const mobileProducts = allProducts.slice(0, mobileVisible)
  const mobileRemaining = allProducts.length - mobileVisible

  const toggleFilter = (index) => {
    setOpenFilters((prev) => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  return (
    <div className="flex flex-col items-center w-full">
      {/* Hero Section */}
      <div className="w-full bg-white py-[32px] lg:py-[48px]">
        <div className="max-w-[1212px] mx-auto w-full flex flex-col gap-[24px] items-center px-[16px]">
          <p className="text-center text-black leading-[1.3] tracking-[0.25px]">
            <span className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[28px] lg:text-[48px]">สินค้า</span>
            <span className="font-['Circular_Std'] font-medium text-[28px] lg:text-[48px]"> WoodSmith</span>
          </p>
          <div className="border border-[#e5e7eb] rounded-full flex items-center gap-[4px] h-[40px] lg:h-[48px] px-[16px] w-full max-w-[500px]">
            <img alt="" className="shrink-0 size-[20px]" src={imgSearch} />
            <input
              type="text"
              placeholder="กำลังมองหาสินค้าอะไร? ค้นหาเลย..."
              className="pl-2 flex-1 border-none outline-none bg-transparent font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] lg:text-[18px] text-black placeholder:text-[#c3c3c3] tracking-[0.09px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-[16px] lg:gap-[24px] w-full">
            {[
              { label: 'วัสดุก่อสร้าง', count: `${filterCategories[0]?.count || 250} รายการ`, path: '/products/construction' },
              { label: 'ผลิตภัณฑ์สำเร็จ', count: `${filterCategories[1]?.count || 250} รายการ`, path: '/products/finished' },
            ].map((cat) => (
              <Link
                key={cat.label}
                href={cat.path}
                className="relative flex-1 flex flex-col gap-[8px] items-center justify-center py-[48px] lg:py-[120px] px-[32px] border-b-[8px] border-orange overflow-hidden no-underline"
              >
                <img
                  alt=""
                  className="absolute inset-0 max-w-none object-cover size-full pointer-events-none"
                  src={imgCategoryBg}
                />
                <p className="relative font-['IBM_Plex_Sans_Thai'] font-bold text-[24px] lg:text-[32px] text-black">
                  {cat.label}
                </p>
                <p className="relative font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] lg:text-[15px] text-black leading-[1.2]">
                  {cat.count}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1212px] mx-auto w-full flex gap-[24px] items-start px-[16px] py-[24px] lg:py-[36px]">
        {/* Sidebar - desktop only */}
        <div className="hidden lg:flex flex-col gap-[12px] w-[222px] shrink-0">
          <p className="font-['IBM_Plex_Sans_Thai'] font-medium text-[15px] text-black leading-[1.2]">
            ตัวกรองสินค้า
          </p>
          {filterCategories.map((cat, i) => (
            <FilterSection
              key={cat.title}
              title={cat.title}
              count={cat.count}
              items={cat.items}
              isOpen={openFilters.has(i)}
              onToggle={() => toggleFilter(i)}
            />
          ))}
        </div>

        {/* Product Grid Area */}
        <div className="flex-1 flex flex-col gap-[16px] lg:gap-[24px] w-full min-w-0">
          <div className="flex flex-col gap-[6px]">
            <div className="flex items-center justify-between gap-[16px]">
              <p className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[24px] lg:text-[32px] text-black leading-[1.2]">
                สินค้าทั้งหมด
              </p>
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
              {allProducts.length} รายการ
            </p>
          </div>

          {/* Desktop product grid */}
          <div className="hidden lg:grid grid-cols-4 gap-[25px] w-full">
            {desktopProducts.map((p, i) => (
              <ProductCard key={p.id || i} {...p} />
            ))}
          </div>

          {/* Mobile product grid */}
          <div className="lg:hidden grid grid-cols-2 gap-[16px] w-full">
            {mobileProducts.map((p, i) => (
              <ProductCard key={p.id || i} {...p} />
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
          {totalPages > 1 && (
            <div className="hidden lg:block mt-[16px]">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
