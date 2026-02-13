import { useState } from 'react'
import imgBanner from '../assets/manual_banner.png'
import imgCard1 from '../assets/manual_card_1.png'
import imgCard2 from '../assets/manual_card_2.png'
import imgYoutube from '../assets/youtube_1.svg'

const baseManuals = [
  {
    image: imgCard1,
    title: 'คู่มือแนะนำการติดตั้งวงกบห่อ PVC',
    date: '25 ตุลาคม 2568',
    pdfUrl: '#',
    youtubeUrl: 'https://youtube.com',
  },
  {
    image: imgCard2,
    title: 'คู่มือแนะนำการติดตั้งไม้ฝากแนวต่อ HMR',
    date: '25 ตุลาคม 2568',
    pdfUrl: '#',
    youtubeUrl: 'https://youtube.com',
  },
  {
    image: imgCard1,
    title: 'คู่มือแนะนำการติดตั้งไม้ปิ่นโต',
    date: '25 ตุลาคม 2568',
    pdfUrl: '#',
    youtubeUrl: null,
  },
  {
    image: imgCard2,
    title: 'คู่มือแนะนำการติดตั้งไม้ผ้า ใช้กาวเบอร์',
    date: '25 ตุลาคม 2568',
    pdfUrl: '#',
    youtubeUrl: null,
  },
  {
    image: imgCard1,
    title: 'คู่มือแนะนำการติดตั้งไม้ผ้าหนังผิน',
    date: '25 ตุลาคม 2568',
    pdfUrl: '#',
    youtubeUrl: 'https://youtube.com',
  },
  {
    image: imgCard2,
    title: 'คู่มือแนะนำการติดตั้งประตูพร้อมวงกบ',
    date: '20 ตุลาคม 2568',
    pdfUrl: '#',
    youtubeUrl: 'https://youtube.com',
  },
  {
    image: imgCard1,
    title: 'คู่มือแนะนำการติดตั้งประตูพร้อมวงกบ',
    date: '25 ตุลาคม 2568',
    pdfUrl: '#',
    youtubeUrl: 'https://youtube.com',
  },
  {
    image: imgCard2,
    title: 'คู่มือแนะนำการติดตั้งประตูพร้อมวงกบ',
    date: '25 ตุลาคม 2568',
    pdfUrl: '#',
    youtubeUrl: 'https://youtube.com',
  },
  {
    image: imgCard1,
    title: 'คู่มือแนะนำการติดตั้งประตูพร้อมวงกบ',
    date: '25 ตุลาคม 2568',
    pdfUrl: '#',
    youtubeUrl: 'https://youtube.com',
  },
  {
    image: imgCard2,
    title: 'คู่มือแนะนำการติดตั้งประตูพร้อมวงกบ',
    date: '25 ตุลาคม 2568',
    pdfUrl: '#',
    youtubeUrl: 'https://youtube.com',
  },
]

const allManuals = Array.from({ length: 27 }, (_, i) => ({
  id: i + 1,
  ...baseManuals[i % baseManuals.length],
}))

const PAGE_SIZE = 10

function CardManual({ image, title, date, pdfUrl, youtubeUrl }) {
  const hasPdf = !!pdfUrl
  const hasYoutube = !!youtubeUrl

  return (
    <div className="bg-white w-full flex flex-col lg:flex-row lg:gap-[24px] items-start px-[20px] lg:px-0">
      {/* Thumbnail */}
      <div className="w-full lg:w-[345px] lg:shrink-0 h-[213px] lg:h-[210px] relative overflow-hidden">
        <div className="absolute bg-[#e8e3da] inset-0" />
        <img alt="" className="absolute max-w-none object-cover size-full" src={image} />
      </div>

      {/* Content */}
      <div className="border-b-3 border-dark-brown flex flex-1 flex-col gap-[16px] lg:justify-between items-start pt-[12px] lg:pt-[8px] pb-[20px] w-full lg:self-stretch">
        <div className="flex flex-col gap-[12px] lg:gap-[8px] items-start w-full text-black">
          <p className="font-['IBM_Plex_Sans_Thai'] font-bold text-[20px] lg:text-[24px] leading-[1.4]">
            {title}
          </p>
          <p className="font-['IBM_Plex_Sans_Thai'] text-[14px] lg:text-[15px] leading-[1.2]">
            <span className="font-semibold">วันที่สร้าง</span>
            <span>: {date}</span>
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-[8px] h-[48px] items-center w-full">
          {hasPdf && (
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`bg-orange flex h-full items-center justify-center no-underline ${hasPdf && hasYoutube ? 'w-[182px] lg:w-[182px]' : 'w-full lg:w-[182px]'}`}
            >
              <span className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[16px] lg:font-['Circular_Std'] lg:font-medium text-white leading-[1.5]">
                ดาวน์โหลด PDF
              </span>
            </a>
          )}
          {hasYoutube && (
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`bg-white border border-grey flex gap-[6px] h-full items-center justify-center no-underline ${hasPdf && hasYoutube ? 'flex-1 lg:w-[253px] lg:flex-initial' : 'w-full lg:w-[253px]'}`}
            >
              <span className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[15px] text-black leading-[24px]">
                เปิดดูใน Youtube
              </span>
              <img alt="YouTube" className="size-[24px]" src={imgYoutube} />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ManualPage() {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const visibleManuals = allManuals.slice(0, visibleCount)
  const remaining = Math.max(0, allManuals.length - visibleCount)

  return (
    <div className="flex flex-col items-center w-full pb-[36px] lg:pb-[60px]">
      {/* Banner */}
      <div className="h-[116px] lg:h-[200px] relative w-full overflow-hidden flex items-center justify-center">
        <img alt="" className="absolute max-w-none object-cover size-full" src={imgBanner} />
        <p className="relative font-['IBM_Plex_Sans_Thai'] font-semibold text-[24px] lg:text-[64px] text-white text-center tracking-[0.25px] leading-[1.3]">
          คู่มือการใช้งานผลิตภัณฑ์
        </p>
      </div>

      {/* Manual Cards */}
      <div className="flex flex-col gap-[32px] lg:gap-[48px] items-center mt-[36px] lg:mt-[48px] w-full lg:max-w-[882px] lg:mx-auto">
        {visibleManuals.map((manual) => (
          <CardManual key={manual.id} {...manual} />
        ))}
      </div>

      {/* Load More */}
      {remaining > 0 && (
        <div className="flex flex-col gap-[12px] items-center mt-[32px] lg:mt-[48px] px-[20px] w-full lg:max-w-[882px] lg:mx-auto">
          <button
            className="border border-[#e5e7eb] flex h-[48px] items-center justify-center w-full cursor-pointer"
            onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
          >
            <span className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[16px] text-black leading-[1.5]">
              ดูทั้งหมด
            </span>
          </button>
          <p className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-black tracking-[0.26px]">
            อีก {remaining} รายการ
          </p>
        </div>
      )}
    </div>
  )
}
