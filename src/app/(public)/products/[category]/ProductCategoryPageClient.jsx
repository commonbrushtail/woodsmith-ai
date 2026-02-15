'use client'

import { useState } from 'react'
import Link from 'next/link'
import ArrowRight from '../../../../components/ArrowRight'
import { getProductUrl } from '@/lib/product-url'
import { getPageNumbers } from '@/lib/pagination'
import imgSearch from '../../../../assets/icon_search.svg'

const DESKTOP_PAGE_SIZE = 16
const MOBILE_PAGE_SIZE = 6

const titles = {
  construction: 'วัสดุก่อสร้าง',
  decoration: 'ผลิตภัณฑ์สำเร็จ',
}

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

function SubcategoryCard({ imageUrl, name, count }) {
  return (
    <div className="flex flex-col gap-[16px] items-start w-full">
      <div className="aspect-[200/268] relative w-full overflow-hidden">
        <div className="absolute bg-[#e8e3da] inset-0" />
        {imageUrl && (
          <img alt="" className="absolute max-w-none object-cover size-full" src={imageUrl} />
        )}
      </div>
      <div className="flex flex-col items-start text-black w-full">
        <p className="font-['IBM_Plex_Sans_Thai'] font-medium text-[15px] tracking-[0.15px]">
          {name}
        </p>
        <p className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-grey tracking-[0.13px] mt-[2px]">
          {count} สินค้า
        </p>
      </div>
    </div>
  )
}

function ProductCard({ href, image, category, name }) {
  return (
    <Link href={href} className="flex flex-col gap-[16px] items-start w-full no-underline">
      <div className="h-[170px] lg:h-[222px] relative w-full overflow-hidden">
        <div className="absolute bg-[#e8e3da] inset-0" />
        {image && (
          <img alt="" className="absolute max-w-none object-cover size-full" src={image} />
        )}
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

function FilterSection({ title, items, isOpen, onToggle, selectedCategories, onCategoryToggle }) {
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
            <label key={item.name} className="flex gap-[16px] items-start py-[6px] cursor-pointer">
              <input
                type="checkbox"
                className="shrink-0 size-[16px] mt-[4px] accent-orange"
                checked={selectedCategories.has(item.name)}
                onChange={() => onCategoryToggle(item.name)}
              />
              <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[15px] text-black leading-[1.6]">
                {item.label}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}

function Pagination({ currentPage, totalPages, onPageChange }) {
  const pages = getPageNumbers(currentPage, totalPages)

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

export default function ProductCategoryPageClient({ categorySlug, products: dbProducts = [], categories: dbCategories = [], subcategories = [] }) {
  const [filterOpen, setFilterOpen] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [mobileVisible, setMobileVisible] = useState(MOBILE_PAGE_SIZE)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState(new Set())

  const categoryTitle = titles[categorySlug] || categorySlug

  // Map DB products to card format
  const mappedProducts = dbProducts.map(p => {
    const primaryImg = p.product_images?.find(img => img.is_primary)
    return {
      href: getProductUrl(p),
      image: primaryImg?.url || p.product_images?.[0]?.url || null,
      category: p.category || '',
      name: p.name,
    }
  })

  // Build product count per category from product data
  const productCountMap = {}
  for (const p of dbProducts) {
    if (p.category) {
      productCountMap[p.category] = (productCountMap[p.category] || 0) + 1
    }
  }

  // Build subcategory cards from managed subcategories (admin-controlled)
  const subcategoryCards = subcategories.map(sub => {
    let imageUrl = sub.image_url || null
    // Fall back to a sample product image if no managed image
    if (!imageUrl) {
      const sampleProduct = dbProducts.find(p => p.category === sub.name)
      const primaryImg = sampleProduct?.product_images?.find(img => img.is_primary)
      imageUrl = primaryImg?.url || sampleProduct?.product_images?.[0]?.url || null
    }
    return { name: sub.name, count: productCountMap[sub.name] || 0, imageUrl }
  })

  // Build filter items from categories
  const filterItems = dbCategories.map(c => ({
    name: c.name,
    label: `${c.name} (${c.count})`,
  }))

  // Apply filters
  let filteredProducts = mappedProducts
  if (selectedCategories.size > 0) {
    filteredProducts = filteredProducts.filter(p => selectedCategories.has(p.category))
  }
  if (searchQuery.trim()) {
    const q = searchQuery.trim().toLowerCase()
    filteredProducts = filteredProducts.filter(p =>
      p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    )
  }

  const toggleCategory = (categoryName) => {
    setSelectedCategories(prev => {
      const next = new Set(prev)
      if (next.has(categoryName)) {
        next.delete(categoryName)
      } else {
        next.add(categoryName)
      }
      return next
    })
    setCurrentPage(1)
    setMobileVisible(MOBILE_PAGE_SIZE)
  }

  const totalPages = Math.ceil(filteredProducts.length / DESKTOP_PAGE_SIZE) || 1
  const desktopProducts = filteredProducts.slice(
    (currentPage - 1) * DESKTOP_PAGE_SIZE,
    currentPage * DESKTOP_PAGE_SIZE
  )
  const mobileProducts = filteredProducts.slice(0, mobileVisible)
  const mobileRemaining = filteredProducts.length - mobileVisible

  return (
    <div className="flex flex-col items-center w-full">
      {/* Breadcrumb */}
      <div className="max-w-[1212px] mx-auto w-full py-[8px] px-[16px]">
        <Breadcrumb categoryTitle={categoryTitle} />
      </div>

      {/* Category Header + Subcategory Cards */}
      <div className="max-w-[1212px] mx-auto w-full flex flex-col gap-[24px] items-center px-[16px] py-[16px] lg:py-[24px]">
        <div className="flex flex-col gap-[8px] items-center w-full">
          <p className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[32px] lg:text-[48px] text-black text-center leading-[1.3] tracking-[0.25px]">
            {categoryTitle}
          </p>
          <p className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[16px] lg:text-[20px] text-black text-center leading-[1.3]">
            เลือกดูตามหมวดหมู่สินค้า
          </p>
        </div>

        {/* Subcategory cards - horizontal scroll on mobile, grid on desktop */}
        {subcategoryCards.length > 0 && (
          <div className="w-full overflow-x-auto lg:overflow-visible">
            <div className={`flex lg:grid gap-[20px] lg:gap-[25px] w-max lg:w-full ${
              subcategoryCards.length <= 5 ? `lg:grid-cols-${subcategoryCards.length}` : 'lg:grid-cols-5'
            }`}>
              {subcategoryCards.map((sub) => (
                <Link
                  key={sub.name}
                  href={`/products/${categorySlug}/${encodeURIComponent(sub.name)}`}
                  className="w-[160px] lg:w-auto shrink-0 no-underline"
                >
                  <SubcategoryCard {...sub} />
                </Link>
              ))}
            </div>
          </div>
        )}
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
            items={filterItems}
            isOpen={filterOpen}
            onToggle={() => setFilterOpen(p => !p)}
            selectedCategories={selectedCategories}
            onCategoryToggle={toggleCategory}
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
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); setMobileVisible(MOBILE_PAGE_SIZE) }}
                  className="pl-1 flex-1 border-none outline-none bg-transparent font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] text-[#6b7280] placeholder:text-[#6b7280] tracking-[0.07px]"
                />
              </div>
            </div>
            <p className="font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] lg:text-[16px] text-black leading-[1.2]">
              {filteredProducts.length} รายการ
            </p>
          </div>

          {filteredProducts.length === 0 && searchQuery.trim() ? (
            <div className="flex flex-col items-center justify-center py-[48px] gap-[8px]">
              <p className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[18px] text-black">
                ไม่พบสินค้าที่ค้นหา
              </p>
              <p className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-grey">
                ลองค้นหาด้วยคำอื่น หรือ{' '}
                <button
                  className="text-orange bg-transparent border-none cursor-pointer p-0 font-['IBM_Plex_Sans_Thai'] text-[14px] underline"
                  onClick={() => { setSearchQuery(''); setSelectedCategories(new Set()); setCurrentPage(1); setMobileVisible(MOBILE_PAGE_SIZE) }}
                >
                  ดูสินค้าทั้งหมด
                </button>
              </p>
            </div>
          ) : (
            <>
              {/* Desktop product grid */}
              <div className="hidden lg:grid grid-cols-4 gap-[25px] w-full">
                {desktopProducts.map((p, i) => (
                  <ProductCard key={p.href || i} {...p} />
                ))}
              </div>

              {/* Mobile product grid */}
              <div className="lg:hidden grid grid-cols-2 gap-[16px] w-full">
                {mobileProducts.map((p, i) => (
                  <ProductCard key={p.href || i} {...p} />
                ))}
              </div>

              {/* Mobile load more */}
              {mobileRemaining > 0 && (
                <div className="lg:hidden flex flex-col gap-[12px] items-center w-full mt-[8px]">
                  <button
                    className="border border-[#e5e7eb] bg-white flex h-[48px] items-center justify-center w-full cursor-pointer"
                    onClick={() => setMobileVisible(prev => prev + MOBILE_PAGE_SIZE)}
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
            </>
          )}
        </div>
      </div>
    </div>
  )
}
