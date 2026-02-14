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

const productData = {
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
    'HDF คือแผ่นใยไม้ความหนาแน่นสูง (High-Density Fiberboard) ผลิตจากการนำเศษไม้มาบดละเอียด แล้วอัดเข้าด้วยกันภายใต้แรงดันและความร้อนสูง โดยมีกาวเรซินเป็นตัวยึด',
    'มีความแข็งแรงทนทานสูง รับน้ำหนักได้ดี และมีความมั่นคงของมิติ (Dimensional Stability) สูงกว่าไม้จริง ทั่วไป ทำให้ไม้พื้นไม่บิดตัวหรือโก่งงอง่ายเมื่อเจอการเปลี่ยนแปลงของอุณหภูมิและความชื้น โดยทั่วไปจะทน ความชื้นได้ดีกว่า MDF (Medium-Density Fiberboard) แต่ยังคงไม่เหมาะกับการติดตั้งในพื้นที่เปียก โดยตรง',
  ],
  specs: [
    { label: 'ผลิตภัณฑ์', value: 'ไม้พื้นลามิเนตแบบยาว\n(Long Plank)' },
    { label: 'วัสดุ', value: 'HDF 12 มม.\nปิดผิวเมลามีน' },
    { label: 'พื้นผิว', value: '• ลายเสี้ยนไม้ (Wood grain)\n• ลายเสี้ยนสลัก (Emboss)' },
    { label: 'ลักษณะการยึด', value: 'click lock' },
    { label: 'ระดับการทนขูดขีด', value: 'AC3' },
    { label: 'ระดับฟอร์มัลดีไฮด์', value: 'E2/E1' },
    { label: 'กว้าง', value: '189 มม.' },
    { label: 'ยาว', value: '1845 มม.' },
    { label: 'หนา', value: '12 มม.' },
    { label: 'ตร.ม./กล่อง', value: '5 ชิ้น 1.74 ตร.ม.' },
    { label: 'ดีไซน์', value: 'ประมาณ 30 ดีไซน์' },
  ],
  relatedProducts: [
    { image: imgRectangle15, category: 'ปาร์ติเกิลบอร์ด', thaiName: 'ไม้พื้นลามิเนต รุ่น Standard', engName: 'PB : ParticleBoard' },
    { image: imgRectangle21, category: 'ไม้พื้น', thaiName: 'ไม้พื้นลามิเนต รุ่น V-Groove', engName: 'Laminate Flooring' },
    { image: imgRectangle22, category: 'ไม้พื้น', thaiName: 'ไม้พื้นลามิเนตแบบแผ่นยาว', engName: 'Laminate Long Plank' },
    { image: imgRectangle24, category: 'ไม้พื้น', thaiName: 'ไม้พื้นไม้ HDF เคลือบผิว', engName: 'HDF Veneer Flooring' },
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
      {/* Thumbnails - horizontal swiper on mobile, vertical swiper on desktop */}
      <div className="order-2 lg:order-1 w-full lg:w-[123px] shrink-0">
        <div className="block lg:hidden">
          <Swiper
            direction="horizontal"
            slidesPerView="auto"
            spaceBetween={12}
            onSwiper={(s) => (mobileSwiperRef.current = s)}
          >
            {images.map((img, i) => (
              <SwiperSlide key={i} style={{ width: 72 }}>
                <button
                  className={`shrink-0 size-[72px] overflow-hidden cursor-pointer bg-transparent p-0 border-2 ${
                    activeIndex === i ? 'border-black' : 'border-transparent'
                  }`}
                  onClick={() => setActiveIndex(i)}
                >
                  <div className="relative size-full">
                    <div className="absolute bg-[#e8e3da] inset-0" />
                    <img alt="" className="absolute max-w-none object-cover size-full" src={img} />
                  </div>
                </button>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="hidden lg:block">
          <Swiper
            direction="vertical"
            slidesPerView="auto"
            spaceBetween={12}
            className="!h-[528px]"
            onSwiper={(s) => (desktopSwiperRef.current = s)}
          >
            {images.map((img, i) => (
              <SwiperSlide key={i} style={{ height: 123 }}>
                <button
                  className={`shrink-0 size-[123px] overflow-hidden cursor-pointer bg-transparent p-0 border-2 ${
                    activeIndex === i ? 'border-black' : 'border-transparent'
                  }`}
                  onClick={() => setActiveIndex(i)}
                >
                  <div className="relative size-full">
                    <div className="absolute bg-[#e8e3da] inset-0" />
                    <img alt="" className="absolute max-w-none object-cover size-full" src={img} />
                  </div>
                </button>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Main image */}
      <div className="relative flex-1 aspect-square overflow-hidden order-1 lg:order-2">
        <div className="absolute bg-[#e8e3da] inset-0" />
        <img
          alt=""
          className="absolute max-w-none object-cover size-full"
          src={images[activeIndex]}
        />
        {/* Navigation arrows */}
        <div className="absolute top-1/2 left-[8px] -translate-y-1/2 cursor-pointer" onClick={goPrev}>
          <ChevronLeftArrow />
        </div>
        <div className="absolute top-1/2 right-[8px] -translate-y-1/2 cursor-pointer" onClick={goNext}>
          <ChevronRightArrow />
        </div>
        {/* Counter */}
        <div className="absolute bottom-[12px] right-[12px] bg-black rounded-full px-[12px] py-[4px]">
          <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[12px] text-white tracking-[0.96px]">
            {activeIndex + 1}/{images.length}
          </span>
        </div>
      </div>
    </div>
  )
}

function ColorSelector({ colors, selectedId, onSelect }) {
  return (
    <div className="flex flex-col gap-[12px]">
      <p className="font-['IBM_Plex_Sans_Thai'] font-medium text-[16px] text-black leading-[1.5]">
        เลือกสี
      </p>
      <div className="flex flex-wrap gap-[10px]">
        {colors.map((color) => (
          <button
            key={color.id}
            className={`flex gap-[10px] items-center px-[16px] py-[8px] overflow-hidden cursor-pointer bg-transparent ${
              selectedId === color.id
                ? 'border-2 border-dark-brown'
                : 'border border-[#e5e5e5]'
            }`}
            onClick={() => onSelect(color.id)}
          >
            <div className="shrink-0 size-[40px] rounded-full overflow-hidden">
              <img alt="" className="max-w-none object-cover size-full" src={color.swatch} />
            </div>
            <span className={`font-['IBM_Plex_Sans_Thai'] text-[14px] text-black ${
              selectedId === color.id ? 'font-semibold' : ''
            }`}>
              {color.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

function SurfaceSelector({ surfaces, selectedId, onSelect }) {
  return (
    <div className="flex flex-col gap-[12px]">
      <p className="font-['IBM_Plex_Sans_Thai'] font-medium text-[16px] text-black leading-[1.5]">
        เลือกพื้นผิว
      </p>
      <div className="flex flex-wrap gap-[10px]">
        {surfaces.map((surface) => (
          <button
            key={surface.id}
            className={`px-[20px] py-[10px] overflow-hidden cursor-pointer bg-transparent ${
              selectedId === surface.id
                ? 'border-2 border-dark-brown'
                : 'border border-[#e5e5e5]'
            }`}
            onClick={() => onSelect(surface.id)}
          >
            <span className={`font-['IBM_Plex_Sans_Thai'] text-[14px] text-black ${
              selectedId === surface.id ? 'font-semibold' : ''
            }`}>
              {surface.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

function SizeSelector({ sizes, selectedId, onSelect }) {
  return (
    <div className="flex flex-col gap-[12px]">
      <p className="font-['IBM_Plex_Sans_Thai'] font-medium text-[16px] text-black leading-[1.5]">
        เลือกไซส์ (ความหนา)
      </p>
      <div className="flex flex-wrap gap-[10px]">
        {sizes.map((size) => {
          const isSold = size.status === 'sold'
          const isSelected = selectedId === size.id
          return (
            <button
              key={size.id}
              className={`px-[20px] py-[10px] overflow-hidden bg-transparent cursor-pointer ${
                isSold
                  ? 'border border-dashed border-[#e5e5e5] cursor-not-allowed'
                  : isSelected
                    ? 'border-[2.5px] border-dark-brown'
                    : 'border border-[#e5e5e5]'
              }`}
              onClick={() => !isSold && onSelect(size.id)}
              disabled={isSold}
            >
              <span className={`font-['IBM_Plex_Sans_Thai'] text-[14px] ${
                isSold
                  ? 'text-[#979797]'
                  : isSelected
                    ? 'font-bold text-dark-brown'
                    : 'text-black'
              }`}>
                {size.name}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function SpecTable({ specs }) {
  return (
    <div className="flex flex-col gap-[24px]">
      <p className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[20px] text-black leading-[1.2]">
        ข้อมูลจำเพาะ
      </p>
      <div className="border border-[#e5e7eb] overflow-hidden w-full lg:w-[435px]">
        {specs.map((spec, i) => (
          <div key={i} className="flex border-b border-[#e5e7eb] last:border-b-0">
            <div className="w-[140px] lg:w-[153px] shrink-0 px-[20px] py-[12px] flex items-start">
              <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[15px] text-[#202124] leading-[1.5]">
                {spec.label}
              </span>
            </div>
            <div className="flex-1 px-[20px] py-[12px] flex items-start border-l border-[#e5e7eb]">
              <span className="font-['IBM_Plex_Sans_Thai'] text-[15px] text-[#202124] leading-[1.5] whitespace-pre-line">
                {spec.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function RelatedProductCard({ image, category, engName }) {
  return (
    <div className="flex flex-col gap-[16px] items-start w-full">
      <div className="h-[170px] lg:h-[268px] relative w-full overflow-hidden">
        <div className="absolute bg-[#e8e3da] inset-0" />
        <img alt="" className="absolute max-w-none object-cover size-full" src={image} />
      </div>
      <div className="flex flex-col items-start w-full text-black">
        <p className="font-['IBM_Plex_Sans_Thai'] font-medium text-[15px] tracking-[0.15px]">
          {category}
        </p>
        <p className="font-['Circular_Std'] font-medium text-[20px] lg:text-[24px] leading-[1.2]">
          {engName}
        </p>
      </div>
      <div className="flex gap-[8px] items-center">
        <p className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-black tracking-[0.28px]">
          ดูรายละเอียด
        </p>
        <ArrowRight />
      </div>
    </div>
  )
}

export default function ProductDetailPage() {
  const product = productData
  const [selectedColor, setSelectedColor] = useState(product.colors[0].id)
  const [selectedSurface, setSelectedSurface] = useState(product.surfaces[0].id)
  const [selectedSize, setSelectedSize] = useState('12')
  const [quotationOpen, setQuotationOpen] = useState(false)

  return (
    <div className="flex flex-col items-center w-full">
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
          <Link href={`/products/${product.category.slug}`} className="no-underline shrink-0">
            <span className="font-['IBM_Plex_Sans_Thai'] text-[12px] text-[#202124] tracking-[0.06px] leading-[20px]">
              {product.category.title}
            </span>
          </Link>
          <ChevronRightIcon />
          <Link href={`/products/${product.category.slug}/${product.subcategory.slug}`} className="no-underline shrink-0">
            <span className="font-['IBM_Plex_Sans_Thai'] text-[12px] text-[#202124] tracking-[0.06px] leading-[20px]">
              {product.subcategory.title}
            </span>
          </Link>
          <ChevronRightIcon />
          <span className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[12px] text-[#202124] tracking-[0.06px] leading-[20px] truncate">
            {product.name}
          </span>
        </nav>
      </div>

      {/* Main Content: Image Gallery + Product Info */}
      <div className="max-w-[1212px] mx-auto w-full flex flex-col lg:flex-row gap-[24px] lg:gap-[40px] items-start px-[16px] py-[16px] lg:py-[24px]">
        {/* Left: Image Gallery */}
        <div className="w-full lg:w-[680px] shrink-0">
          <ImageGallery images={product.images} />
        </div>

        {/* Right: Product Info */}
        <div className="flex-1 flex flex-col gap-[16px] w-full">
          {/* Title & SKU */}
          <div className="flex flex-col gap-[8px]">
            <h1 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[24px] lg:text-[32px] text-black leading-[1.2] m-0">
              {product.name}
            </h1>
            <p className="font-['IBM_Plex_Sans_Thai'] font-medium text-[18px] lg:text-[20px] text-orange leading-[22px]">
              {product.sku}
            </p>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-[#e5e7eb]" />

          {/* Selectors */}
          <div className="flex flex-col gap-[24px]">
            <ColorSelector
              colors={product.colors}
              selectedId={selectedColor}
              onSelect={setSelectedColor}
            />
            <SurfaceSelector
              surfaces={product.surfaces}
              selectedId={selectedSurface}
              onSelect={setSelectedSurface}
            />
            <SizeSelector
              sizes={product.sizes}
              selectedId={selectedSize}
              onSelect={setSelectedSize}
            />
          </div>

          {/* CTA Button */}
          <button className="w-full h-[48px] bg-orange flex items-center justify-center cursor-pointer border-none mt-[8px]" onClick={() => setQuotationOpen(true)}>
            <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[16px] text-white leading-[1.5]">
              ขอใบเสนอราคา
            </span>
          </button>
        </div>
      </div>

      {/* Below: Description, Calculator, Specs */}
      <div className="max-w-[1212px] mx-auto w-full px-[16px] py-[16px] lg:py-[24px]">
        <div className="w-full lg:w-[680px] flex flex-col gap-[32px]">
          {/* Product Description */}
          <div className="flex flex-col gap-[16px]">
            <p className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[20px] text-black leading-[1.2]">
              รายละเอียดสินค้า
            </p>
            <div className="flex flex-col gap-[12px]">
              {product.description.map((paragraph, i) => (
                <p key={i} className="font-['IBM_Plex_Sans_Thai'] text-[16px] text-black leading-[1.5]">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Calculator Banner */}
          <div className="w-full bg-[#d9d9d9] flex items-center justify-center py-[48px] lg:py-[64px] px-[24px]">
            <p className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[24px] lg:text-[32px] text-white text-center leading-[1.3]">
              Area คำนวณจำนวนไม้พื้น
            </p>
          </div>

          {/* Properties (คุณสมบัติ) - Placeholder area */}
          <div className="flex flex-col gap-[24px]">
            <p className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[20px] text-black leading-[1.2]">
              คุณสมบัติ
            </p>
            <div className="w-full lg:w-[414px] aspect-[414/392] bg-[#f8f3ea] flex items-center justify-center">
              <p className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-grey text-center">
                แผนภาพคุณสมบัติสินค้า
              </p>
            </div>
          </div>

          {/* Spec Table */}
          <SpecTable specs={product.specs} />
        </div>
      </div>

      {/* Related Products */}
      <div className="w-full bg-white py-[32px] lg:py-[60px]">
        <div className="max-w-[1212px] mx-auto w-full px-[16px] flex flex-col gap-[24px] lg:gap-[48px]">
          <p className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[20px] lg:text-[24px] text-black leading-[1.2]">
            สินค้าที่คล้ายกัน
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-[16px] lg:gap-[25px]">
            {product.relatedProducts.map((p, i) => (
              <RelatedProductCard key={i} {...p} />
            ))}
          </div>
        </div>
      </div>

      <QuotationModal
        isOpen={quotationOpen}
        onClose={() => setQuotationOpen(false)}
        onConfirm={() => {
          setQuotationOpen(false)
          alert('ส่งคำขอใบเสนอราคาเรียบร้อยแล้ว')
        }}
        product={{ name: product.name, sku: product.sku, image: product.images[0] }}
      />
    </div>
  )
}
