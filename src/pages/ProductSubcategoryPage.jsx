import { Link, useParams } from 'react-router-dom'
import ArrowRight from '../components/ArrowRight'
import imgRectangle15 from '../assets/0e0c21ac59c543d45fcb74164df547c01c8f3962.png'
import imgRectangle21 from '../assets/c173adf2801ab483dbd02d79c3a7c79625fdb495.png'
import imgRectangle22 from '../assets/3e2d5dd8c39488aa06c2f75daa4454423645d914.png'
import imgRectangle23 from '../assets/363360e0eabb614000b96e9e0872777c65463b3a.png'
import imgRectangle24 from '../assets/0c3090fa51a394a39ced02aa6235d63e1ed6948a.png'

const subcategoryData = {
  construction: {
    title: 'วัสดุก่อสร้าง',
    subcategories: {
      'particleboard': {
        title: 'ปาร์ติเกิลบอร์ด',
        products: [
          { image: imgRectangle15, name: 'PB : ParticleBoard 55690' },
          { image: imgRectangle21, name: 'PB : ParticleBoard รุ่น Standard 30600' },
          { image: imgRectangle22, name: 'PB : ParticleBoard รุ่น V-Groove 10172' },
          { image: imgRectangle23, name: 'PB : ParticleBoard รุ่น Premium' },
          { image: imgRectangle24, name: 'PB : ParticleBoard รุ่น Natural' },
        ],
      },
      'osb': {
        title: 'ไม้อัด OSB',
        products: [
          { image: imgRectangle21, name: 'OSB : Oriented Strand Board 55690' },
          { image: imgRectangle22, name: 'OSB : Oriented Strand Board รุ่น Standard' },
          { image: imgRectangle23, name: 'OSB : Oriented Strand Board รุ่น V-Groove' },
          { image: imgRectangle15, name: 'OSB : Oriented Strand Board รุ่น Premium' },
          { image: imgRectangle24, name: 'OSB : Oriented Strand Board รุ่น Natural' },
        ],
      },
      'mdf': {
        title: 'แผ่นใยไม้อัด MDF',
        products: [
          { image: imgRectangle22, name: 'MDF : Medium Density Fiberboard 55690' },
          { image: imgRectangle23, name: 'MDF : Medium Density Fiberboard รุ่น Standard' },
          { image: imgRectangle15, name: 'MDF : Medium Density Fiberboard รุ่น V-Groove' },
          { image: imgRectangle21, name: 'MDF : Medium Density Fiberboard รุ่น Premium' },
          { image: imgRectangle24, name: 'MDF : Medium Density Fiberboard รุ่น Natural' },
        ],
      },
      'hdf': {
        title: 'แผ่นใยไม้อัด HDF',
        products: [
          { image: imgRectangle23, name: 'HDF : High Density FiberBoard 55690' },
          { image: imgRectangle15, name: 'HDF : High Density FiberBoard รุ่น Standard' },
          { image: imgRectangle22, name: 'HDF : High Density FiberBoard รุ่น V-Groove' },
          { image: imgRectangle21, name: 'HDF : High Density FiberBoard รุ่น Premium' },
          { image: imgRectangle24, name: 'HDF : High Density FiberBoard รุ่น Natural' },
        ],
      },
      'laminated-board': {
        title: 'ไม้บอร์ดปิดผิว',
        products: [
          { image: imgRectangle24, name: 'Laminated Board รุ่น Natural' },
          { image: imgRectangle15, name: 'Laminated Board รุ่น Standard' },
          { image: imgRectangle22, name: 'Laminated Board รุ่น V-Groove' },
          { image: imgRectangle23, name: 'Laminated Board รุ่น Premium' },
          { image: imgRectangle21, name: 'Laminated Board รุ่น Classic' },
        ],
      },
    },
  },
  finished: {
    title: 'ผลิตภัณฑ์สำเร็จ',
    subcategories: {
      'flooring': {
        title: 'ไม้พื้น',
        products: [
          { image: imgRectangle15, name: 'ไม้พื้นลามิเนตแบบแผ่นยาว 55690' },
          { image: imgRectangle21, name: 'ไม้พื้นลามิเนต รุ่น Standard 30600' },
          { image: imgRectangle22, name: 'ไม้พื้นลามิเนตแบบแผ่นกว้าง (Wide Plank) 10746' },
          { image: imgRectangle23, name: 'ไม้พื้นลามิเนต รุ่น V-Groove 10172' },
          { image: imgRectangle24, name: 'ไม้พื้นไม้ HDF เคลือบผิว' },
        ],
      },
      'staircase': {
        title: 'ไม้บันได',
        products: [
          { image: imgRectangle23, name: 'ไม้บันได ลูกตั้ง' },
          { image: imgRectangle22, name: 'ไม้บันได ลูกนอน' },
          { image: imgRectangle15, name: 'ไม้บันได รุ่น Standard' },
          { image: imgRectangle21, name: 'ไม้บันได รุ่น Premium' },
          { image: imgRectangle24, name: 'ไม้บันได รุ่น Classic' },
        ],
      },
      'wall-panel': {
        title: 'ไม้ตกแต่งผนัง/ไม้ฝาตกแต่ง',
        products: [
          { image: imgRectangle22, name: 'ไม้ฝาตกแต่ง รุ่น Natural' },
          { image: imgRectangle24, name: 'ไม้ตกแต่งผนัง รุ่น Standard' },
          { image: imgRectangle15, name: 'ไม้ตกแต่งผนัง รุ่น V-Groove' },
          { image: imgRectangle23, name: 'ไม้ตกแต่งผนัง รุ่น Premium' },
          { image: imgRectangle21, name: 'ไม้ตกแต่งผนัง รุ่น Classic' },
        ],
      },
      'skirt': {
        title: 'บัวพื้น/บัวเพดาน',
        products: [
          { image: imgRectangle24, name: 'ตัวจบไม้พื้น SK004 – Skirting ตัวจบพื้น' },
          { image: imgRectangle15, name: 'ตัวจบไม้พื้น TS401 – Transition ตัวจบครอบจมูก WPC' },
          { image: imgRectangle21, name: 'ตัวจบไม้พื้น JT601 – Joint ตัวจบครอบจมูก WPC' },
          { image: imgRectangle22, name: 'ตัวจบไม้พื้น EG501 – Edge ตัวจบครอบข้าง WPC' },
          { image: imgRectangle23, name: 'ตัวจบไม้พื้น OC201 – Cover ตัวครอบตะเฆ่ลอย' },
        ],
      },
      'melamine-table': {
        title: 'โต๊ะปิดผิวเมลามีน',
        products: [
          { image: imgRectangle15, name: 'โต๊ะเมลามีน รุ่น Standard' },
          { image: imgRectangle22, name: 'โต๊ะเมลามีน รุ่น Premium' },
          { image: imgRectangle23, name: 'ตู้เมลามีน รุ่น Standard' },
          { image: imgRectangle24, name: 'ตู้เมลามีน รุ่น Premium' },
          { image: imgRectangle21, name: 'ชั้นเมลามีน รุ่น Standard' },
        ],
      },
    },
  },
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

function ProductCard({ image, subcategoryTitle, name }) {
  return (
    <div className="flex flex-col gap-[16px] items-start w-full">
      <div className="h-[170px] lg:h-[222px] relative w-full overflow-hidden">
        <div className="absolute bg-[#e8e3da] inset-0" />
        <img alt="" className="absolute max-w-none object-cover size-full" src={image} />
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
    </div>
  )
}

export default function ProductSubcategoryPage() {
  const { category, subcategory } = useParams()
  const catData = subcategoryData[category]
  const subData = catData?.subcategories[subcategory]

  if (!catData || !subData) {
    return (
      <div className="max-w-[1212px] mx-auto w-full px-[16px] py-[48px] text-center">
        <p className="font-['IBM_Plex_Sans_Thai'] text-[20px] text-black">ไม่พบหมวดหมู่สินค้านี้</p>
        <Link to="/products" className="font-['IBM_Plex_Sans_Thai'] text-[16px] text-orange mt-[16px] inline-block">
          กลับไปหน้าสินค้า
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center w-full mb-10">
      {/* Breadcrumb */}
      <div className="max-w-[1212px] mx-auto w-full py-[8px] px-[16px]">
        <nav className="flex gap-[8px] items-center w-full">
          <Link to="/" className="flex gap-[4px] items-center no-underline shrink-0">
            <HomeIcon />
            <span className="font-['IBM_Plex_Sans_Thai'] text-[12px] text-[#202124] tracking-[0.06px] leading-[20px]">
              หน้าแรก
            </span>
          </Link>
          <ChevronRightIcon />
          <Link to="/products" className="no-underline shrink-0">
            <span className="font-['IBM_Plex_Sans_Thai'] text-[12px] text-[#202124] tracking-[0.06px] leading-[20px]">
              สินค้าของเรา
            </span>
          </Link>
          <ChevronRightIcon />
          <Link to={`/products/${category}`} className="no-underline shrink-0">
            <span className="font-['IBM_Plex_Sans_Thai'] text-[12px] text-[#202124] tracking-[0.06px] leading-[20px]">
              {catData.title}
            </span>
          </Link>
          <ChevronRightIcon />
          <span className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[12px] text-[#202124] tracking-[0.06px] leading-[20px] truncate">
            {subData.title}
          </span>
        </nav>
      </div>

      {/* Title + Count + Product Grid */}
      <div className="max-w-[1212px] mx-auto w-full flex flex-col gap-[24px] px-[16px] py-[16px] lg:py-[24px]">
        <div className="flex flex-col gap-[4px]">
          <h1 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[24px] lg:text-[32px] text-black leading-[1.3] m-0">
            {subData.title}
          </h1>
          <p className="font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] lg:text-[16px] text-black leading-[1.2]">
            {subData.products.length} รายการ
          </p>
        </div>

        {/* Product grid - 2 cols mobile, 5 cols desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-[16px] lg:gap-[25px] w-full">
          {subData.products.map((p, i) => (
            <ProductCard key={i} image={p.image} subcategoryTitle={subData.title} name={p.name} />
          ))}
        </div>
      </div>
    </div>
  )
}
