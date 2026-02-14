'use client'

import { useState } from 'react'
import ArrowRight from './ArrowRight'
import imgRectangle15 from '../assets/0e0c21ac59c543d45fcb74164df547c01c8f3962.png'
import imgRectangle21 from '../assets/c173adf2801ab483dbd02d79c3a7c79625fdb495.png'
import imgRectangle22 from '../assets/3e2d5dd8c39488aa06c2f75daa4454423645d914.png'
import imgRectangle23 from '../assets/363360e0eabb614000b96e9e0872777c65463b3a.png'
import imgRectangle24 from '../assets/0c3090fa51a394a39ced02aa6235d63e1ed6948a.png'
import imgRectangle25 from '../assets/e9b01d1a4a14a251433baa636e611ba911b29402.png'

function CardProduct({ image, thaiName, engName }) {
  return (
    <div className="bg-white flex flex-col gap-[12px] lg:gap-[16px] items-start w-full">
      <div className="h-[170px] lg:h-[268px] relative w-full overflow-hidden">
        <div className="absolute bg-[#e8e3da] inset-0" />
        <img alt="" className="absolute max-w-none object-cover size-full" src={image} />
      </div>
      <div className="flex flex-col gap-[3px] items-start text-black w-full">
        <p className="font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] lg:text-[15px] tracking-[0.14px] lg:tracking-[0.15px] w-full">
          {thaiName}
        </p>
        <p className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[16px] lg:text-[24px] lg:font-['Circular_Std'] lg:font-medium leading-[1.2] overflow-hidden text-ellipsis w-full">
          {engName}
        </p>
      </div>
      <div className="flex gap-[6px] lg:gap-[8px] items-center">
        <p className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-black tracking-[0.28px]">
          ดูรายละเอียด
        </p>
        <ArrowRight />
      </div>
    </div>
  )
}

export default function ProductsSection({ products: dbProducts = [] }) {
  const [activeTab, setActiveTab] = useState('construction')

  const fallbackConstruction = [
    { image: imgRectangle15, thaiName: 'ปาร์ติเกิลบอร์ด', engName: 'PB : ParticleBoard' },
    { image: imgRectangle21, thaiName: 'ไม้อัด OSB', engName: 'OSB : Oriented Strand Board' },
    { image: imgRectangle22, thaiName: 'แผ่นใยไม้อัดความหนาแน่นปานกลาง', engName: 'MDF : Medium Density Fiberboard' },
    { image: imgRectangle23, thaiName: 'แผ่นใยไม้อัดความหนาแน่นสูง', engName: 'HDF : High Density FiberBoard' },
    { image: imgRectangle24, thaiName: 'ไม้บอร์ดปิดผิวลามิเนต', engName: 'Laminated Board' },
    { image: imgRectangle25, thaiName: 'แผ่นใยไม้เชิงวิศวกรรม', engName: 'Shuttering Board' },
  ]

  const fallbackFinished = [
    { image: imgRectangle22, thaiName: 'ประตูเมลามีน', engName: 'Melamine Door' },
    { image: imgRectangle23, thaiName: 'วงกบประตู', engName: 'Door Frame' },
    { image: imgRectangle24, thaiName: 'บานประตู PVC', engName: 'PVC Door' },
    { image: imgRectangle25, thaiName: 'พื้นลามิเนต', engName: 'Laminate Flooring' },
    { image: imgRectangle15, thaiName: 'ไม้ฝาเฌอร่า', engName: 'Shera Plank' },
    { image: imgRectangle21, thaiName: 'ไม้พื้นสำเร็จรูป', engName: 'Engineered Wood Flooring' },
  ]

  // Map DB products to card format, split by type
  const mapProduct = (p) => {
    const primaryImg = p.product_images?.find(img => img.is_primary)
    return {
      id: p.id,
      image: primaryImg?.url || p.product_images?.[0]?.url || imgRectangle15,
      thaiName: p.category || '',
      engName: p.name,
    }
  }

  const constructionProducts = dbProducts.length > 0
    ? dbProducts.filter(p => p.type === 'construction').map(mapProduct)
    : fallbackConstruction

  const finishedProducts = dbProducts.length > 0
    ? dbProducts.filter(p => p.type !== 'construction').map(mapProduct)
    : fallbackFinished

  const products = activeTab === 'construction' ? constructionProducts : finishedProducts

  const tabs = [
    { key: 'construction', label: 'วัสดุก่อสร้าง' },
    { key: 'finished', label: 'ผลิตภัณฑ์สำเร็จ' },
  ]

  return (
    <div className="w-full py-[36px] lg:py-[60px]">
      <div className="max-w-[1212px] mx-auto w-full flex flex-col gap-[24px] lg:gap-[48px] items-center justify-center px-[16px]">
        <div className="flex flex-col gap-[12px] lg:gap-[32px] items-center w-full">
          <div className="flex flex-col gap-[12px] lg:gap-[16px] items-center w-full">
            <p className="font-['IBM_Plex_Sans_Thai'] font-bold text-[32px] lg:text-[40px] text-black text-center leading-[1.5]">
              สินค้าแนะนำ
            </p>
            <div className="flex gap-[24px] items-start justify-center">
              {tabs.map((tab) => (
                <button key={tab.key} className="flex flex-col gap-px items-start cursor-pointer" onClick={() => setActiveTab(tab.key)}>
                  <p className={`font-['IBM_Plex_Sans_Thai'] font-semibold text-[16px] ${activeTab === tab.key ? 'text-orange' : 'text-black'}`}>
                    {tab.label}
                  </p>
                  {activeTab === tab.key && <div className="bg-orange h-[2px] w-full" />}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-[20px] lg:gap-[25px] w-full">
            {products.map((p, i) => (
              <CardProduct key={`${activeTab}-${i}`} {...p} />
            ))}
          </div>
        </div>
        {/* Mobile button text slightly different */}
        <button className="border border-[#e5e7eb] flex h-[48px] items-center justify-center w-full ">
          <p className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[16px] text-black">
            <span className="lg:hidden">ดูสินค้าทั้งหมด</span>
            <span className="hidden lg:inline">ดูสินค้าของเราทั้งหมด</span>
          </p>
        </button>
      </div>
    </div>
  )
}
