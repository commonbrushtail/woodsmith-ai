'use client'

import { useState } from 'react'
import imgBanner from '../../../assets/highlight_banner.png'
import imgFavicon from '../../../assets/6727cae5f32ea2c35a94792ae9603addc6300612.png'
import imgImage from '../../../assets/54bb27c92ce5121ca3747b98cc83fa4f3592b6be.png'
import imgImage1 from '../../../assets/4938668eb297d2d732709691026edba0d197c105.png'
import imgImage2 from '../../../assets/2296f896c40b1a9eeafb180cb7eee843d61329da.png'
import imgImage3 from '../../../assets/7a62d7c4116b57486dfe6f273dca7933f5b6f214.png'
import imgYoutube1 from '../../../assets/966cb7fb2d9240d9b332a342696019cb196e1a46.svg'

const fallbackHighlights = [
  { id: 1, image: imgImage, duration: '0:42', channelName: 'WoodSmith Learning Center', title: 'WoodSmith Learning Center' },
  { id: 2, image: imgImage1, duration: '0:50', channelName: 'WoodSmith Art Collaboration Interview Artist', title: 'WoodSmith Art Collaboration Interview Artist คุณบิ๊ก ศิริวัฒ ประสานทอง' },
  { id: 3, image: imgImage2, duration: '1:29', channelName: 'Woodsmith Art Collaboration', title: 'Woodsmith Art Collaboration' },
  { id: 4, image: imgImage3, duration: '6:51', channelName: 'WoodSmith Guest Interview คุณหนุ่ย สุวรรณ...', title: 'WoodSmith Guest Interview คุณหนุ่ย สุวรรณนี สุวรรณมณีรัตน์' },
]

const MOBILE_PAGE_SIZE = 10
const DESKTOP_PAGE_SIZE = 18

function getYoutubeVideoId(url) {
  if (!url) return null
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/)
  return match ? match[1] : null
}

function YoutubeCard({ image, duration, channelName, title, youtubeUrl }) {
  const videoId = getYoutubeVideoId(youtubeUrl)
  const hasThumbnail = !!image

  return (
    <div className="flex flex-col gap-[10px] items-start w-full">
      <div className="relative w-full aspect-video overflow-hidden">
        {!hasThumbnail && videoId ? (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title={title}
            className="absolute w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <a href={youtubeUrl || '#'} target="_blank" rel="noopener noreferrer" className="block size-full">
            <img alt="" className="absolute max-w-none object-cover size-full" src={image} />
            <div className="absolute bg-gradient-to-b from-[rgba(0,0,0,0.77)] inset-0 to-[60.195%] to-[rgba(0,0,0,0)]" />
            {duration && (
              <div className="absolute bottom-[5px] right-[5px] bg-[rgba(3,3,3,0.44)] px-[7px] py-[2px] rounded-[5.5px]">
                <p className="font-['Avenir_Next'] font-medium text-[10px] lg:text-[11px] text-white text-center tracking-[0.2px]">
                  {duration}
                </p>
              </div>
            )}
            <div className="absolute top-[6px] left-[10px] flex gap-[8px] items-center right-[10px]">
              <div className="rounded-full shrink-0 size-[29px] lg:size-[32px] relative overflow-hidden">
                <div className="absolute bg-white inset-0 rounded-full" />
                <img alt="" className="absolute h-[75.9%] left-[19.5%] max-w-none top-[12.88%] w-[59.89%]" src={imgFavicon} />
              </div>
              <p className="flex-1 font-['Arial'] text-[13px] lg:text-[14px] text-[rgba(255,255,255,0.86)] overflow-hidden text-ellipsis whitespace-nowrap tracking-[0.47px]">
                {channelName}
              </p>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[43px] lg:size-[48px]">
              <img alt="Play" className="block max-w-none size-full" src={imgYoutube1} />
            </div>
          </a>
        )}
      </div>
      <p className="font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] lg:text-[16px] text-black overflow-hidden text-ellipsis leading-[20px] lg:leading-[22px] w-full">
        {title}
      </p>
    </div>
  )
}

function Pagination({ currentPage, totalPages, onPageChange }) {
  const getPageNumbers = () => {
    const pages = []
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (currentPage > 3) pages.push('...')
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)
      for (let i = start; i <= end; i++) pages.push(i)
      if (currentPage < totalPages - 2) pages.push('...')
      pages.push(totalPages)
    }
    return pages
  }

  return (
    <div className="flex items-center justify-between w-full mt-[48px]">
      <button
        className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-black cursor-pointer disabled:opacity-30 disabled:cursor-default bg-transparent border-none"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        &lt; ก่อนหน้า
      </button>
      <div className="flex gap-[8px] items-center">
        {getPageNumbers().map((page, i) =>
          page === '...' ? (
            <span key={`dots-${i}`} className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-black px-[8px]">
              ...
            </span>
          ) : (
            <button
              key={page}
              className={`size-[32px] flex items-center justify-center rounded-full font-['IBM_Plex_Sans_Thai'] text-[14px] cursor-pointer border-none ${
                currentPage === page ? 'bg-orange text-white' : 'bg-transparent text-black'
              }`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          )
        )}
      </div>
      <button
        className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-black cursor-pointer disabled:opacity-30 disabled:cursor-default bg-transparent border-none"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        ถัดไป &gt;
      </button>
    </div>
  )
}

export default function HighlightPageClient({ highlights: dbHighlights = [] }) {
  const [mobileVisible, setMobileVisible] = useState(MOBILE_PAGE_SIZE)
  const [currentPage, setCurrentPage] = useState(1)

  const allHighlights = dbHighlights.length > 0
    ? dbHighlights.map(h => ({
        id: h.id,
        image: h.thumbnail_url || null,
        duration: h.duration || '',
        channelName: h.channel_name || 'WoodSmith',
        title: h.title,
        youtubeUrl: h.youtube_url || '',
      }))
    : fallbackHighlights

  const totalPages = Math.ceil(allHighlights.length / DESKTOP_PAGE_SIZE)
  const desktopItems = allHighlights.slice(
    (currentPage - 1) * DESKTOP_PAGE_SIZE,
    currentPage * DESKTOP_PAGE_SIZE
  )
  const mobileItems = allHighlights.slice(0, mobileVisible)
  const mobileRemaining = Math.max(0, allHighlights.length - mobileVisible)

  return (
    <div className="flex flex-col items-center w-full pb-[36px] lg:pb-[60px]">
      <div className="h-[116px] lg:h-[200px] relative w-full overflow-hidden flex items-center justify-center">
        <img alt="" className="absolute max-w-none object-cover size-full" src={imgBanner} />
        <p className="relative font-['IBM_Plex_Sans_Thai'] font-semibold text-[24px] lg:text-[64px] text-white text-center tracking-[0.25px] leading-[1.3]">
          ไฮไลท์
        </p>
      </div>

      <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-[25px] items-center mt-[24px] px-[20px] w-full">
        {mobileItems.map((item) => (
          <YoutubeCard key={item.id} {...item} />
        ))}
        {mobileRemaining > 0 && (
          <div className="flex flex-col gap-[12px] items-center w-full mt-[8px] md:col-span-2">
            <button
              className="border border-[#e5e7eb] bg-white flex h-[48px] items-center justify-center w-full cursor-pointer"
              onClick={() => setMobileVisible((prev) => prev + MOBILE_PAGE_SIZE)}
            >
              <span className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[16px] text-black leading-[1.5]">
                ดูทั้งหมด
              </span>
            </button>
            <p className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-black tracking-[0.26px]">
              อีก {mobileRemaining} รายการ
            </p>
          </div>
        )}
      </div>

      <div className="hidden lg:flex flex-col items-center mt-[48px] w-full max-w-[1212px] mx-auto px-[16px]">
        <div className="grid grid-cols-3 gap-[25px] w-full">
          {desktopItems.map((item) => (
            <YoutubeCard key={item.id} {...item} />
          ))}
        </div>
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  )
}
