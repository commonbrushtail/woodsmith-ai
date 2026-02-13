import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import ArrowRight from '../components/ArrowRight'
import imgBanner from '../assets/blog_banner.png'
import imgCard1 from '../assets/blog_card_1.png'
import imgCard2 from '../assets/blog_card_2.png'
import imgCard3 from '../assets/blog_card_3.png'
import imgCard4 from '../assets/blog_card_4.png'

const categoryTabs = [
  { key: 'all', label: 'ทั้งหมด' },
  { key: 'ideas', label: 'ไอเดียและเคล็ดลับ' },
  { key: 'trend', label: 'เทรนด์' },
  { key: 'style', label: 'สไตล์และฟังก์ชัน' },
  { key: 'knowledge', label: 'ความรู้ทั่วไป' },
]

const basePosts = [
  { image: imgCard1, category: 'Idea & Tips', categoryKey: 'ideas', title: 'เปิด 6 ไอเดียตกแต่งบ้านด้วย "ไม้บอร์ด MDF HMR ปิดผิวเมลามีน" Melamine on MDF HMR ปิดผิวเมลามีน...' },
  { image: imgCard2, category: 'Style & Function', categoryKey: 'style', title: 'Goodbye Sun☀️ & Rain 🌧️ประตูสวย ไม่กลัวน้ำ ไม่กลัว แดด ​3 จุดเด่นที่ทำให้ประตูเมลามีนกันน้ำอัลตร้าคือ คำตอบของทุกบ้าน' },
  { image: imgCard3, category: 'ความรู้ทั่วไป', categoryKey: 'knowledge', title: '"Life without limits" ใช้ชีวิต ได้สุด ไม่ต้องกลัวพื้นพัง รวม 5 สถานการ์ณที่ทำไมคุณควรเปลี่ยนมาใช้ "ไม้พื้นไฮบริดอัลตร้า"' },
  { image: imgCard4, category: 'ไอเดียและเคล็ดลับ', categoryKey: 'ideas', title: '"ประตูบ้านไม่ใช่แค่ทางเข้า แต่คือ ส่วนหนึ่งของไลฟ์สไตล์ คุณ !" ประตูเมลามีนกันน้ำอัลตร้า ประตูที่สวยและทน แดด ท้าทายทุกฤดู' },
  { image: imgCard1, category: 'เทรนด์', categoryKey: 'trend', title: 'ไม้พื้นลามิเนตแสนสวยจากวู้ดสมิตร สวยเสมือนไม้จริง เดินดี ไม่มีสะดุด ไม่บวม ไม่เด้ง' },
  { image: imgCard3, category: 'Style & Function', categoryKey: 'style', title: '"ประตูเมลามีนกันน้ำอัลตร้า" ทางเลือกใหม่ สวยทนทาน ราคาคุ้มค่า ทนแดด ทนฝน ไม่ต้องทาสีใหม่' },
  { image: imgCard2, category: 'Idea & Tips', categoryKey: 'ideas', title: '5 ไอเดียแต่งห้องนอนด้วยไม้ เนรมิตห้องนอนให้อบอุ่น ใกล้ชิดธรรมชาติ ด้วยงบไม่บานปลาย' },
  { image: imgCard4, category: 'ความรู้ทั่วไป', categoryKey: 'knowledge', title: 'ไม้อัดวนชัย ครบจบทุกงาน ทั้งงานเฟอร์นิเจอร์วู้ดสมิตร คิดอย่างมิตร ทำอย่างจริงจัง เพื่อคุณภาพที่ดีที่สุด' },
]

const allPosts = Array.from({ length: 55 }, (_, i) => ({
  id: i + 1,
  ...basePosts[i % basePosts.length],
}))

const MOBILE_PAGE_SIZE = 10
const DESKTOP_PAGE_SIZE = 20

function BlogCard({ id, image, category, title }) {
  return (
    <Link to={`/blog/${id}`} className="flex gap-[16px] items-start lg:flex-col cursor-pointer no-underline">
      <div className="shrink-0 w-[120px] h-[120px] lg:w-full lg:h-auto lg:aspect-square relative overflow-hidden">
        <div className="absolute bg-[#e8e3da] inset-0" />
        <img alt="" className="absolute max-w-none object-cover size-full" src={image} />
      </div>
      <div className="flex flex-1 flex-col gap-[16px] items-start min-w-0 lg:flex-initial">
        <div className="flex flex-col gap-[4px] items-start w-full">
          <p className="font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] lg:text-[15px] text-[#f58733] tracking-[0.14px] lg:tracking-[0.15px]">
            {category}
          </p>
          <p className="font-['IBM_Plex_Sans_Thai'] font-semibold leading-[1.2] lg:leading-[1.3] overflow-hidden text-[16px] lg:text-[18px] text-black text-ellipsis line-clamp-3">
            {title}
          </p>
        </div>
        <div className="flex gap-[8px] items-center">
          <p className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-black tracking-[0.28px]">
            อ่านต่อ
          </p>
          <ArrowRight />
        </div>
      </div>
    </Link>
  )
}

function getPageNumbers(current, total) {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1)
  if (current <= 3) return [1, 2, 3, '...', total]
  if (current >= total - 2) return [1, '...', total - 2, total - 1, total]
  return [1, '...', current - 1, current, current + 1, '...', total]
}

function Pagination({ currentPage, totalPages, onPageChange }) {
  const pages = useMemo(
    () => getPageNumbers(currentPage, totalPages),
    [currentPage, totalPages]
  )

  return (
    <div className="flex items-center w-full">
      {/* Previous */}
      <button
        className="flex gap-[8px] h-[38px] items-center px-[12px] rounded-[8px] cursor-pointer"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0">
          <path d="M15 6L9 12L15 18" stroke={currentPage === 1 ? '#d1d5db' : '#6b7280'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p className={`font-['Inter'] font-medium text-[16px] tracking-[0.08px] ${currentPage === 1 ? 'text-[#d1d5db]' : 'text-[#6b7280]'}`}>
          ก่อนหน้า
        </p>
      </button>

      {/* Page Numbers */}
      <div className="flex items-center justify-center flex-1">
        {pages.map((page, i) =>
          page === '...' ? (
            <div key={`dots-${i}`} className="flex items-center justify-center size-[38px]">
              <span className="font-['Inter'] font-medium text-[12px] text-[#6b7280] leading-[16px] tracking-[0.06px]">•••</span>
            </div>
          ) : (
            <button
              key={page}
              className={`flex items-center justify-center size-[38px] rounded-full cursor-pointer ${page === currentPage ? 'border-2 border-orange text-orange' : 'text-[#6b7280]'}`}
              onClick={() => onPageChange(page)}
            >
              <span className="font-['Inter'] font-medium text-[16px] leading-[24px] tracking-[0.08px]">{page}</span>
            </button>
          )
        )}
      </div>

      {/* Next */}
      <button
        className="flex gap-[8px] h-[38px] items-center px-[12px] rounded-[8px] cursor-pointer"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        <p className={`font-['Inter'] font-medium text-[16px] tracking-[0.08px] ${currentPage === totalPages ? 'text-[#d1d5db]' : 'text-[#6b7280]'}`}>
          ถัดไป
        </p>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0">
          <path d="M9 6L15 12L9 18" stroke={currentPage === totalPages ? '#d1d5db' : '#6b7280'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  )
}

export default function BlogPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [mobileVisibleCount, setMobileVisibleCount] = useState(MOBILE_PAGE_SIZE)
  const [desktopPage, setDesktopPage] = useState(1)

  const filteredPosts = activeTab === 'all'
    ? allPosts
    : allPosts.filter(p => p.categoryKey === activeTab)

  const totalPosts = filteredPosts.length

  const mobilePosts = filteredPosts.slice(0, mobileVisibleCount)
  const mobileRemaining = Math.max(0, totalPosts - mobileVisibleCount)

  const totalDesktopPages = Math.ceil(totalPosts / DESKTOP_PAGE_SIZE)
  const desktopPosts = filteredPosts.slice(
    (desktopPage - 1) * DESKTOP_PAGE_SIZE,
    desktopPage * DESKTOP_PAGE_SIZE
  )

  const handleTabChange = (key) => {
    setActiveTab(key)
    setMobileVisibleCount(MOBILE_PAGE_SIZE)
    setDesktopPage(1)
  }

  return (
    <div className="flex flex-col gap-[36px] lg:gap-[60px] items-center w-full pb-[36px] lg:pb-[60px]">
      {/* Banner */}
      <div className="h-[116px] lg:h-[200px] relative w-full overflow-hidden flex items-center justify-center">
        <img alt="" className="absolute max-w-none object-cover size-full" src={imgBanner} />
        <p className="relative font-['IBM_Plex_Sans_Thai'] font-semibold text-[24px] lg:text-[64px] text-white text-center tracking-[0.25px] leading-[1.3]">
          บทความ
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-[32px] items-start px-[20px] w-full lg:max-w-[1212px] lg:mx-auto lg:justify-center overflow-x-auto lg:overflow-visible scrollbar-hide">
        {categoryTabs.map((tab) => (
          <button key={tab.key} className="flex flex-col gap-px items-start shrink-0 cursor-pointer" onClick={() => handleTabChange(tab.key)}>
            <p className={`font-['IBM_Plex_Sans_Thai'] font-semibold text-[16px] whitespace-nowrap ${activeTab === tab.key ? 'text-orange' : 'text-black'}`}>
              {tab.label}
            </p>
            {activeTab === tab.key && <div className="bg-orange h-[2px] w-full" />}
          </button>
        ))}
      </div>

      {/* Mobile Blog Cards */}
      <div className="lg:hidden flex flex-col gap-[25px] px-[20px] w-full">
        {mobilePosts.map((post) => (
          <BlogCard key={post.id} {...post} />
        ))}
      </div>

      {/* Mobile Load More */}
      {mobileRemaining > 0 && (
        <div className="lg:hidden flex flex-col gap-[12px] items-center px-[20px] w-full">
          <button
            className="border border-[#e5e7eb] flex h-[48px] items-center justify-center w-full cursor-pointer"
            onClick={() => setMobileVisibleCount(prev => prev + MOBILE_PAGE_SIZE)}
          >
            <p className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[16px] text-black">ดูเพิ่มเติม</p>
          </button>
          <p className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-black tracking-[0.26px]">
            อีก {mobileRemaining} โพสต์
          </p>
        </div>
      )}

      {/* Desktop Blog Cards Grid */}
      <div className="hidden lg:grid grid-cols-3 xl:grid-cols-4 gap-x-[24px] gap-y-[40px] max-w-[1212px] mx-auto w-full px-[16px]">
        {desktopPosts.map((post) => (
          <BlogCard key={post.id} {...post} />
        ))}
      </div>

      {/* Desktop Pagination */}
      <div className="hidden lg:flex items-center justify-center w-full max-w-[1212px] mx-auto">
        <Pagination
          currentPage={desktopPage}
          totalPages={totalDesktopPages}
          onPageChange={setDesktopPage}
        />
      </div>
    </div>
  )
}
