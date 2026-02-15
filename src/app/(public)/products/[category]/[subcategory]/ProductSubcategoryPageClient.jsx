'use client'

import Link from 'next/link'
import ArrowRight from '../../../../../components/ArrowRight'
import { getProductUrl } from '@/lib/product-url'

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

function ProductCard({ href, image, subcategoryTitle, name }) {
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
          {subcategoryTitle}
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

export default function ProductSubcategoryPageClient({ categorySlug, categoryName, products: dbProducts = [] }) {
  const typeTitle = titles[categorySlug] || categorySlug

  // Map DB products to card format
  const products = dbProducts.map(p => {
    const primaryImg = p.product_images?.find(img => img.is_primary)
    return {
      href: getProductUrl(p),
      image: primaryImg?.url || p.product_images?.[0]?.url || null,
      name: p.name,
    }
  })

  return (
    <div className="flex flex-col items-center w-full mb-10">
      {/* Breadcrumb */}
      <div className="max-w-[1212px] mx-auto w-full py-[8px] px-[16px]">
        <nav className="flex gap-[8px] items-center w-full">
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
          <Link href={`/products/${categorySlug}`} className="no-underline shrink-0">
            <span className="font-['IBM_Plex_Sans_Thai'] text-[12px] text-[#202124] tracking-[0.06px] leading-[20px]">
              {typeTitle}
            </span>
          </Link>
          <ChevronRightIcon />
          <span className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[12px] text-[#202124] tracking-[0.06px] leading-[20px] truncate">
            {categoryName}
          </span>
        </nav>
      </div>

      {/* Title + Count + Product Grid */}
      <div className="max-w-[1212px] mx-auto w-full flex flex-col gap-[24px] px-[16px] py-[16px] lg:py-[24px]">
        <div className="flex flex-col gap-[4px]">
          <h1 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[24px] lg:text-[32px] text-black leading-[1.3] m-0">
            {categoryName}
          </h1>
          <p className="font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] lg:text-[16px] text-black leading-[1.2]">
            {products.length} รายการ
          </p>
        </div>

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-[48px] gap-[8px]">
            <p className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[18px] text-black">
              ไม่พบสินค้าในหมวดหมู่นี้
            </p>
            <Link
              href={`/products/${categorySlug}`}
              className="font-['IBM_Plex_Sans_Thai'] text-[16px] text-orange no-underline hover:underline"
            >
              กลับไปหน้า{typeTitle}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-[16px] lg:gap-[25px] w-full">
            {products.map((p) => (
              <ProductCard key={p.href} href={p.href} image={p.image} subcategoryTitle={categoryName} name={p.name} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
