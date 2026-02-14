'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import ArrowRight from '../../../../components/ArrowRight'
import QuotationModal from '../../../../components/QuotationModal'
import imgRectangle15 from '../../../../assets/0e0c21ac59c543d45fcb74164df547c01c8f3962.png'
import imgRectangle21 from '../../../../assets/c173adf2801ab483dbd02d79c3a7c79625fdb495.png'
import imgRectangle22 from '../../../../assets/3e2d5dd8c39488aa06c2f75daa4454423645d914.png'
import imgRectangle23 from '../../../../assets/363360e0eabb614000b96e9e0872777c65463b3a.png'
import imgRectangle24 from '../../../../assets/0c3090fa51a394a39ced02aa6235d63e1ed6948a.png'

const fallbackProduct = {
  name: 'ไม้พื้นไส้ HDF ปิดวีเนียร์',
  sku: 'VV10603',
  category: { slug: 'finished', title: 'ผลิตภัณฑ์สำเร็จ' },
  subcategory: { slug: 'flooring', title: 'ไม้พื้น' },
  images: [imgRectangle15, imgRectangle21, imgRectangle22, imgRectangle23, imgRectangle24, imgRectangle15],
  colors: [
    { id: 'vv10603', name: 'VV10603 White oak', swatch: imgRectangle15 },
    { id: 'vv12401', name: 'VV12401 Natural Sapele', swatch: imgRectangle21 },
    { id: '10101', name: '10101 Natural Alder', swatch: imgRectangle22 },
    { id: '10201', name: '10201 White Birch', swatch: imgRectangle23 },
  ],
  surfaces: [
    { id: 'wood-grain', name: 'ลายเสี้ยนไม้ (Wood grain)' },
    { id: 'emboss', name: 'ลายเสี้ยนสลัก (Emboss)' },
  ],
  sizes: [
    { id: '8', name: '8 มม.', status: 'sold' },
    { id: '12', name: '12 มม.', status: 'selected' },
    { id: '15', name: '15 มม.', status: 'choice' },
    { id: '19', name: '19 มม.', status: 'choice' },
    { id: '24', name: '24 มม.', status: 'choice' },
  ],
  description: [
    'ไม้พื้นไส้ HDF ปิดวีเนียร์ ทางเลือกของคนที่ชื่นชอบพื้นไม้อารมณ์ใกล้ชิดธรรมชาติ เพราะผลิตโดยใช้วีเนียร์ ไม้จริงที่ให้ลายเสี้ยนไม้สวยงามปิดทับบนแผ่นไม้ HDF ความหนา 12 มิลลิเมตร พร้อมเคลือบ UV coating เพิ่มความทนทาน และปลอดภัยด้วยระดับฟอร์มัลดีไฮด์ E1',
  ],
  specs: [
    { label: 'ผลิตภัณฑ์', value: 'ไม้พื้นลามิเนตแบบยาว\n(Long Plank)' },
    { label: 'วัสดุ', value: 'HDF 12 มม.\nปิดผิวเมลามีน' },
    { label: 'ลักษณะการยึด', value: 'click lock' },
    { label: 'ระดับการทนขูดขีด', value: 'AC3' },
  ],
  relatedProducts: [
    { image: imgRectangle15, category: 'ปาร์ติเกิลบอร์ด', engName: 'PB : ParticleBoard' },
    { image: imgRectangle21, category: 'ไม้พื้น', engName: 'Laminate Flooring' },
    { image: imgRectangle22, category: 'ไม้พื้น', engName: 'Laminate Long Plank' },
    { image: imgRectangle24, category: 'ไม้พื้น', engName: 'HDF Veneer Flooring' },
  ],
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

function ChevronLeftArrow() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="16" fill="white" fillOpacity="0.8" />
      <path d="M19 10L13 16L19 22" stroke="#35383b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronRightArrow() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="16" fill="white" fillOpacity="0.8" />
      <path d="M13 10L19 16L13 22" stroke="#35383b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ImageGallery({ images }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const mobileSwiperRef = useRef(null)
  const desktopSwiperRef = useRef(null)

  const goNext = () => setActiveIndex((prev) => (prev + 1) % images.length)
  const goPrev = () => setActiveIndex((prev) => (prev - 1 + images.length) % images.length)

  useEffect(() => {
    mobileSwiperRef.current?.slideTo(activeIndex)
    desktopSwiperRef.current?.slideTo(activeIndex)
  }, [activeIndex])

  return (
    <div className="flex flex-col lg:flex-row gap-[16px] w-full">
      <div className="order-2 lg:order-1 w-full lg:w-[123px] shrink-0">
        <div className="block lg:hidden">
          <Swiper direction="horizontal" slidesPerView="auto" spaceBetween={12} onSwiper={(s) => (mobileSwiperRef.current = s)}>
            {images.map((img, i) => (
              <SwiperSlide key={i} style={{ width: 72 }}>
                <button className={`shrink-0 size-[72px] overflow-hidden cursor-pointer bg-transparent p-0 border-2 ${activeIndex === i ? 'border-black' : 'border-transparent'}`} onClick={() => setActiveIndex(i)}>
                  <div className="relative size-full"><div className="absolute bg-[#e8e3da] inset-0" /><img alt="" className="absolute max-w-none object-cover size-full" src={img} /></div>
                </button>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="hidden lg:block">
          <Swiper direction="vertical" slidesPerView="auto" spaceBetween={12} className="!h-[528px]" onSwiper={(s) => (desktopSwiperRef.current = s)}>
            {images.map((img, i) => (
              <SwiperSlide key={i} style={{ height: 123 }}>
                <button className={`shrink-0 size-[123px] overflow-hidden cursor-pointer bg-transparent p-0 border-2 ${activeIndex === i ? 'border-black' : 'border-transparent'}`} onClick={() => setActiveIndex(i)}>
                  <div className="relative size-full"><div className="absolute bg-[#e8e3da] inset-0" /><img alt="" className="absolute max-w-none object-cover size-full" src={img} /></div>
                </button>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      <div className="relative flex-1 aspect-square overflow-hidden order-1 lg:order-2">
        <div className="absolute bg-[#e8e3da] inset-0" />
        <img alt="" className="absolute max-w-none object-cover size-full" src={images[activeIndex]} />
        <div className="absolute top-1/2 left-[8px] -translate-y-1/2 cursor-pointer" onClick={goPrev}><ChevronLeftArrow /></div>
        <div className="absolute top-1/2 right-[8px] -translate-y-1/2 cursor-pointer" onClick={goNext}><ChevronRightArrow /></div>
        <div className="absolute bottom-[12px] right-[12px] bg-black rounded-full px-[12px] py-[4px]">
          <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[12px] text-white tracking-[0.96px]">{activeIndex + 1}/{images.length}</span>
        </div>
      </div>
    </div>
  )
}

function OptionSelector({ label, options, selectedId, onSelect, renderItem }) {
  return (
    <div className="flex flex-col gap-[12px]">
      <p className="font-['IBM_Plex_Sans_Thai'] font-medium text-[16px] text-black leading-[1.5]">{label}</p>
      <div className="flex flex-wrap gap-[10px]">
        {options.map((opt) => renderItem(opt, selectedId === opt.id, () => onSelect(opt.id)))}
      </div>
    </div>
  )
}

function SpecTable({ specs }) {
  return (
    <div className="flex flex-col gap-[24px]">
      <p className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[20px] text-black leading-[1.2]">ข้อมูลจำเพาะ</p>
      <div className="border border-[#e5e7eb] overflow-hidden w-full lg:w-[435px]">
        {specs.map((spec, i) => (
          <div key={i} className="flex border-b border-[#e5e7eb] last:border-b-0">
            <div className="w-[140px] lg:w-[153px] shrink-0 px-[20px] py-[12px] flex items-start">
              <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[15px] text-[#202124] leading-[1.5]">{spec.label}</span>
            </div>
            <div className="flex-1 px-[20px] py-[12px] flex items-start border-l border-[#e5e7eb]">
              <span className="font-['IBM_Plex_Sans_Thai'] text-[15px] text-[#202124] leading-[1.5] whitespace-pre-line">{spec.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function RelatedProductCard({ id, image, category, engName }) {
  return (
    <Link href={id ? `/product/${id}` : '#'} className="flex flex-col gap-[16px] items-start w-full no-underline">
      <div className="h-[170px] lg:h-[268px] relative w-full overflow-hidden">
        <div className="absolute bg-[#e8e3da] inset-0" />
        <img alt="" className="absolute max-w-none object-cover size-full" src={image} />
      </div>
      <div className="flex flex-col items-start w-full text-black">
        <p className="font-['IBM_Plex_Sans_Thai'] font-medium text-[15px] tracking-[0.15px]">{category}</p>
        <p className="font-['Circular_Std'] font-medium text-[20px] lg:text-[24px] leading-[1.2]">{engName}</p>
      </div>
      <div className="flex gap-[8px] items-center">
        <p className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-black tracking-[0.28px]">ดูรายละเอียด</p>
        <ArrowRight />
      </div>
    </Link>
  )
}

export default function ProductDetailClient({ product: dbProduct = null }) {
  // Map DB product to display format or use fallback
  const product = dbProduct ? {
    name: dbProduct.name,
    sku: dbProduct.sku || dbProduct.code,
    category: { slug: dbProduct.type || 'construction', title: dbProduct.type === 'construction' ? 'วัสดุก่อสร้าง' : 'ผลิตภัณฑ์สำเร็จ' },
    subcategory: { slug: dbProduct.category || '', title: dbProduct.category || '' },
    images: (dbProduct.product_images || []).sort((a, b) => a.sort_order - b.sort_order).map(img => img.url),
    colors: (dbProduct.product_options || []).filter(o => o.option_type === 'color').map(o => ({ id: o.id, name: o.label, swatch: imgRectangle15 })),
    surfaces: (dbProduct.product_options || []).filter(o => o.option_type === 'surface').map(o => ({ id: o.id, name: o.label })),
    sizes: (dbProduct.product_options || []).filter(o => o.option_type === 'size').map(o => ({ id: o.id, name: o.label, status: 'choice' })),
    description: dbProduct.description ? [dbProduct.description] : [],
    specs: dbProduct.specifications ? Object.entries(dbProduct.specifications).map(([label, value]) => ({ label, value: String(value) })) : [],
    relatedProducts: (dbProduct.relatedProducts || []).map(rp => {
      const img = rp.product_images?.find(i => i.is_primary)?.url || rp.product_images?.[0]?.url || imgRectangle15
      return { id: rp.id, image: img, category: rp.category || '', engName: rp.name }
    }),
  } : fallbackProduct

  // Ensure at least one image
  if (product.images.length === 0) product.images = [imgRectangle15]

  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.id || '')
  const [selectedSurface, setSelectedSurface] = useState(product.surfaces[0]?.id || '')
  const [selectedSize, setSelectedSize] = useState(product.sizes.find(s => s.status !== 'sold')?.id || product.sizes[0]?.id || '')
  const [quotationOpen, setQuotationOpen] = useState(false)

  return (
    <div className="flex flex-col items-center w-full">
      {/* Breadcrumb */}
      <div className="max-w-[1212px] mx-auto w-full py-[8px] px-[16px]">
        <nav className="flex gap-[8px] items-center w-full">
          <Link href="/" className="flex gap-[4px] items-center no-underline shrink-0"><HomeIcon /><span className="font-['IBM_Plex_Sans_Thai'] text-[12px] text-[#202124] tracking-[0.06px] leading-[20px]">หน้าแรก</span></Link>
          <ChevronRightIcon />
          <Link href={`/products/${product.category.slug}`} className="no-underline shrink-0"><span className="font-['IBM_Plex_Sans_Thai'] text-[12px] text-[#202124] tracking-[0.06px] leading-[20px]">{product.category.title}</span></Link>
          <ChevronRightIcon />
          <span className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[12px] text-[#202124] tracking-[0.06px] leading-[20px] truncate">{product.name}</span>
        </nav>
      </div>

      {/* Main Content */}
      <div className="max-w-[1212px] mx-auto w-full flex flex-col lg:flex-row gap-[24px] lg:gap-[40px] items-start px-[16px] py-[16px] lg:py-[24px]">
        <div className="w-full lg:w-[680px] shrink-0">
          <ImageGallery images={product.images} />
        </div>
        <div className="flex-1 flex flex-col gap-[16px] w-full">
          <div className="flex flex-col gap-[8px]">
            <h1 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[24px] lg:text-[32px] text-black leading-[1.2] m-0">{product.name}</h1>
            <p className="font-['IBM_Plex_Sans_Thai'] font-medium text-[18px] lg:text-[20px] text-orange leading-[22px]">{product.sku}</p>
          </div>
          <div className="w-full h-px bg-[#e5e7eb]" />
          <div className="flex flex-col gap-[24px]">
            {product.colors.length > 0 && (
              <OptionSelector label="เลือกสี" options={product.colors} selectedId={selectedColor} onSelect={setSelectedColor}
                renderItem={(color, isSelected, onClick) => (
                  <button key={color.id} className={`flex gap-[10px] items-center px-[16px] py-[8px] overflow-hidden cursor-pointer bg-transparent ${isSelected ? 'border-2 border-dark-brown' : 'border border-[#e5e5e5]'}`} onClick={onClick}>
                    <div className="shrink-0 size-[40px] rounded-full overflow-hidden"><img alt="" className="max-w-none object-cover size-full" src={color.swatch} /></div>
                    <span className={`font-['IBM_Plex_Sans_Thai'] text-[14px] text-black ${isSelected ? 'font-semibold' : ''}`}>{color.name}</span>
                  </button>
                )}
              />
            )}
            {product.surfaces.length > 0 && (
              <OptionSelector label="เลือกพื้นผิว" options={product.surfaces} selectedId={selectedSurface} onSelect={setSelectedSurface}
                renderItem={(surface, isSelected, onClick) => (
                  <button key={surface.id} className={`px-[20px] py-[10px] overflow-hidden cursor-pointer bg-transparent ${isSelected ? 'border-2 border-dark-brown' : 'border border-[#e5e5e5]'}`} onClick={onClick}>
                    <span className={`font-['IBM_Plex_Sans_Thai'] text-[14px] text-black ${isSelected ? 'font-semibold' : ''}`}>{surface.name}</span>
                  </button>
                )}
              />
            )}
            {product.sizes.length > 0 && (
              <OptionSelector label="เลือกไซส์ (ความหนา)" options={product.sizes} selectedId={selectedSize} onSelect={setSelectedSize}
                renderItem={(size, isSelected, onClick) => {
                  const isSold = size.status === 'sold'
                  return (
                    <button key={size.id} className={`px-[20px] py-[10px] overflow-hidden bg-transparent cursor-pointer ${isSold ? 'border border-dashed border-[#e5e5e5] cursor-not-allowed' : isSelected ? 'border-[2.5px] border-dark-brown' : 'border border-[#e5e5e5]'}`} onClick={() => !isSold && onClick()} disabled={isSold}>
                      <span className={`font-['IBM_Plex_Sans_Thai'] text-[14px] ${isSold ? 'text-[#979797]' : isSelected ? 'font-bold text-dark-brown' : 'text-black'}`}>{size.name}</span>
                    </button>
                  )
                }}
              />
            )}
          </div>
          <button className="w-full h-[48px] bg-orange flex items-center justify-center cursor-pointer border-none mt-[8px]" onClick={() => setQuotationOpen(true)}>
            <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[16px] text-white leading-[1.5]">ขอใบเสนอราคา</span>
          </button>
        </div>
      </div>

      {/* Description + Specs */}
      <div className="max-w-[1212px] mx-auto w-full px-[16px] py-[16px] lg:py-[24px]">
        <div className="w-full lg:w-[680px] flex flex-col gap-[32px]">
          {product.description.length > 0 && (
            <div className="flex flex-col gap-[16px]">
              <p className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[20px] text-black leading-[1.2]">รายละเอียดสินค้า</p>
              <div className="flex flex-col gap-[12px]">
                {product.description.map((paragraph, i) => (
                  <p key={i} className="font-['IBM_Plex_Sans_Thai'] text-[16px] text-black leading-[1.5]">{paragraph}</p>
                ))}
              </div>
            </div>
          )}
          {product.specs.length > 0 && <SpecTable specs={product.specs} />}
        </div>
      </div>

      {/* Related Products */}
      {product.relatedProducts.length > 0 && (
        <div className="w-full bg-white py-[32px] lg:py-[60px]">
          <div className="max-w-[1212px] mx-auto w-full px-[16px] flex flex-col gap-[24px] lg:gap-[48px]">
            <p className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[20px] lg:text-[24px] text-black leading-[1.2]">สินค้าที่คล้ายกัน</p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-[16px] lg:gap-[25px]">
              {product.relatedProducts.map((p, i) => (
                <RelatedProductCard key={p.id || i} {...p} />
              ))}
            </div>
          </div>
        </div>
      )}

      <QuotationModal
        isOpen={quotationOpen}
        onClose={() => setQuotationOpen(false)}
        onConfirm={() => { setQuotationOpen(false); alert('ส่งคำขอใบเสนอราคาเรียบร้อยแล้ว') }}
        product={{ name: product.name, sku: product.sku, image: product.images[0] }}
      />
    </div>
  )
}
