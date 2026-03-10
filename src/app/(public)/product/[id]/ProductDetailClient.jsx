'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import SafeHtmlContent from '@/components/SafeHtmlContent'
import Lightbox from '@/components/Lightbox'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import ArrowRight from '../../../../components/ArrowRight'
import { getProductUrl } from '@/lib/product-url'
import QuotationModal from '../../../../components/QuotationModal'
import AreaCalculator from '../../../../components/AreaCalculator'
const fallbackProduct = {
  name: '-',
  sku: '-',
  category: { slug: '', title: '-' },
  subcategory: { slug: '', title: '-' },
  images: [],
  colors: [],
  surfaces: [],
  sizes: [],
  variations: {},
  description: '',
  specs: [],
  relatedProducts: [],
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
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const mobileSwiperRef = useRef(null)
  const desktopSwiperRef = useRef(null)

  // Reset active index when images change (e.g. variation selection)
  useEffect(() => {
    setActiveIndex(0)
  }, [images])

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-square bg-[#e8e3da] flex items-center justify-center">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#bfbfbf" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      </div>
    )
  }

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
      <div className="relative flex-1 aspect-square overflow-hidden order-1 lg:order-2 cursor-pointer" onClick={() => setLightboxOpen(true)}>
        <div className="absolute bg-[#e8e3da] inset-0" />
        <img alt="" className="absolute max-w-none object-cover size-full" src={images[activeIndex]} />
        <div className="absolute top-1/2 left-[8px] -translate-y-1/2 cursor-pointer" onClick={(e) => { e.stopPropagation(); goPrev() }}><ChevronLeftArrow /></div>
        <div className="absolute top-1/2 right-[8px] -translate-y-1/2 cursor-pointer" onClick={(e) => { e.stopPropagation(); goNext() }}><ChevronRightArrow /></div>
        <div className="absolute bottom-[12px] right-[12px] bg-black rounded-full px-[12px] py-[4px]">
          <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[12px] text-white tracking-[0.96px]">{activeIndex + 1}/{images.length}</span>
        </div>
      </div>

      {lightboxOpen && (
        <Lightbox
          images={images}
          startIndex={activeIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
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

// Helper function to check if HTML content is non-empty
function hasContent(html) {
  if (!html) return false
  // Strip HTML tags and check if there's actual text content
  const text = html.replace(/<[^>]*>/g, '').trim()
  return text.length > 0
}

function SpecTable({ specs }) {
  if (!hasContent(specs)) return null
  return (
    <div className="flex flex-col gap-[24px]">
      <p className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[20px] text-black leading-[1.2]">ข้อมูลจำเพาะ</p>
      <SafeHtmlContent
        html={specs}
        className="rich-text font-['IBM_Plex_Sans_Thai'] text-[15px] text-[#202124] leading-[1.5]"
      />
    </div>
  )
}

function RelatedProductCard({ href, image, category, engName }) {
  return (
    <Link href={href || '#'} className="flex flex-col gap-[16px] items-start w-full no-underline">
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

export default function ProductDetailClient({ product: dbProduct = null, isLoggedIn = false }) {
  // Map DB product to display format or use fallback
  const product = dbProduct ? {
    id: dbProduct.id,
    name: dbProduct.name,
    sku: dbProduct.sku || dbProduct.code,
    category: { slug: dbProduct.type || 'construction', title: dbProduct.type === 'construction' ? 'วัสดุก่อสร้าง' : 'ผลิตภัณฑ์สำเร็จ' },
    subcategory: { slug: dbProduct.category || '', title: dbProduct.category || '' },
    allImages: (dbProduct.product_images || []).sort((a, b) => a.sort_order - b.sort_order),
    images: (dbProduct.product_images || []).filter(img => !img.variation_entry_id).sort((a, b) => a.sort_order - b.sort_order).map(img => img.url),
    variations: (dbProduct.product_variation_links || [])
      .reduce((acc, link) => {
        const groupName = link.variation_groups?.name
        if (!groupName) return acc
        if (!acc[groupName]) {
          acc[groupName] = []
        }
        acc[groupName].push({
          id: link.entry_id,
          label: link.variation_entries?.label,
          image_url: link.show_image ? link.variation_entries?.image_url : null,
          sort_order: link.variation_entries?.sort_order || 0
        })
        return acc
      }, {}),
    colors: (dbProduct.product_options || []).filter(o => o.option_type === 'color').map(o => ({ id: o.id, name: o.label, swatch: null })),
    surfaces: (dbProduct.product_options || []).filter(o => o.option_type === 'surface').map(o => ({ id: o.id, name: o.label })),
    sizes: (dbProduct.product_options || []).filter(o => o.option_type === 'size').map(o => ({ id: o.id, name: o.label, status: 'choice' })),
    description: dbProduct.description || '',
    characteristics: dbProduct.characteristics || '',
    specs: dbProduct.specifications?.raw || dbProduct.specifications || '',
    showAreaCalculator: dbProduct.show_area_calculator || false,
    coveragePerBox: dbProduct.coverage_per_box,
    piecesPerBox: dbProduct.pieces_per_box,
    plankWidth: dbProduct.plank_width,
    plankLength: dbProduct.plank_length,
    wastePercentage: dbProduct.waste_percentage,
    relatedProducts: (dbProduct.relatedProducts || []).map(rp => {
      const img = rp.product_images?.find(i => i.is_primary)?.url || rp.product_images?.[0]?.url || null
      return { href: getProductUrl(rp), image: img, category: rp.category || '', engName: rp.name }
    }),
  } : fallbackProduct

  // No fallback image — show placeholder bg when empty

  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.id || '')
  const [selectedSurface, setSelectedSurface] = useState(product.surfaces[0]?.id || '')
  const [selectedSize, setSelectedSize] = useState(product.sizes.find(s => s.status !== 'sold')?.id || product.sizes[0]?.id || '')
  const [selectedVariations, setSelectedVariations] = useState(() => {
    const initial = {}
    Object.entries(product.variations || {}).forEach(([groupName, entries]) => {
      const sortedEntries = entries.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
      initial[groupName] = sortedEntries[0]?.id || ''
    })
    return initial
  })
  const [quotationOpen, setQuotationOpen] = useState(false)

  // Compute displayed images: if a selected variation has specific images, show those instead
  const displayImages = (() => {
    if (!product.allImages?.length) return product.images
    const selectedEntryIds = Object.values(selectedVariations).filter(Boolean)
    // Find variation-specific images matching any selected variation
    const variationImages = product.allImages
      .filter(img => img.variation_entry_id && selectedEntryIds.includes(img.variation_entry_id))
      .map(img => img.url)
    return variationImages.length > 0 ? variationImages : product.images
  })()

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
          <ImageGallery images={displayImages} />
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
            {/* Variations */}
            {Object.entries(product.variations || {}).map(([groupName, entries]) => {
              const sortedEntries = entries.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
              const hasImages = sortedEntries.some(e => e.image_url)

              return (
                <OptionSelector
                  key={groupName}
                  label={groupName}
                  options={sortedEntries}
                  selectedId={selectedVariations[groupName] || ''}
                  onSelect={(id) => setSelectedVariations(prev => ({ ...prev, [groupName]: id }))}
                  renderItem={(entry, isSelected, onClick) => (
                    <button
                      key={entry.id}
                      className={`flex gap-[10px] items-center px-[16px] py-[8px] overflow-hidden cursor-pointer bg-transparent ${isSelected ? 'border-2 border-dark-brown' : 'border border-[#e5e5e5]'}`}
                      onClick={onClick}
                    >
                      {hasImages && entry.image_url && (
                        <div className="shrink-0 size-[40px] rounded-full overflow-hidden">
                          <img alt="" className="max-w-none object-cover size-full" src={entry.image_url} />
                        </div>
                      )}
                      <span className={`font-['IBM_Plex_Sans_Thai'] text-[14px] text-black ${isSelected ? 'font-semibold' : ''}`}>
                        {entry.label}
                      </span>
                    </button>
                  )}
                />
              )
            })}
          </div>
          <button className="w-full h-[48px] bg-orange flex items-center justify-center cursor-pointer border-none mt-[8px]" onClick={() => setQuotationOpen(true)}>
            <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[16px] text-white leading-[1.5]">ขอใบเสนอราคา</span>
          </button>
        </div>
      </div>

      {/* Description + Specs */}
      <div className="max-w-[1212px] mx-auto w-full px-[16px] py-[16px] lg:py-[24px]">
        <div className="w-full lg:w-[680px] flex flex-col gap-[32px]">
          {hasContent(product.description) && (
            <div className="flex flex-col gap-[16px]">
              <p className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[20px] text-black leading-[1.2]">รายละเอียดสินค้า</p>
              <SafeHtmlContent
                html={product.description}
                className="rich-text font-['IBM_Plex_Sans_Thai'] text-[16px] text-black leading-[1.5] prose prose-sm max-w-none"
              />
            </div>
          )}
          {hasContent(product.characteristics) && (
            <div className="flex flex-col gap-[16px]">
              <p className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[20px] text-black leading-[1.2]">คุณสมบัติ</p>
              <SafeHtmlContent
                html={product.characteristics}
                className="rich-text font-['IBM_Plex_Sans_Thai'] text-[16px] text-black leading-[1.5] prose prose-sm max-w-none"
              />
            </div>
          )}
          <SpecTable specs={product.specs} />
          {product.showAreaCalculator && (
            <AreaCalculator
              coveragePerBox={product.coveragePerBox}
              piecesPerBox={product.piecesPerBox}
              plankWidth={product.plankWidth}
              plankLength={product.plankLength}
              wastePercentage={product.wastePercentage}
            />
          )}
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
        product={{ id: product.id, name: product.name, sku: product.sku, image: product.images[0] }}
        isLoggedIn={isLoggedIn}
        selections={[
          ...(product.colors.length > 0 ? [{ label: 'สี', value: product.colors.find(c => c.id === selectedColor)?.name }] : []),
          ...(product.surfaces.length > 0 ? [{ label: 'พื้นผิว', value: product.surfaces.find(s => s.id === selectedSurface)?.name }] : []),
          ...(product.sizes.length > 0 ? [{ label: 'ขนาด', value: product.sizes.find(s => s.id === selectedSize)?.name }] : []),
          ...Object.entries(selectedVariations).map(([groupName, id]) => ({
            label: groupName,
            value: (product.variations[groupName] || []).find(e => e.id === id)?.label,
          })),
        ].filter(s => s.value)}
      />
    </div>
  )
}
