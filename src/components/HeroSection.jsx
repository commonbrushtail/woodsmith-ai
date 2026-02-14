'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import imgRectangle36 from '../assets/914f6e92ef8841ad61f01c168a0a43760fba4fd0.png'
import imgRectangle37 from '../assets/d234aca90b4585c0177de8e78431e97374eb520b.png'
import imgRectangle38 from '../assets/a95471a3a128e488d696bd58ef944e6616e0e70f.png'
import imgVector2 from '../assets/111a70dead0aec3d9b930f8886d84779617edefa.svg'
import imgVector3 from '../assets/ca8a43b8ab750b34b816e40ae620fcfb9b449dfd.svg'

export default function HeroSection({ banners = [] }) {
  const fallbackSlides = [
    { src: imgRectangle38 },
    { src: imgRectangle36 },
    { src: imgRectangle37 },
  ]

  const slides = banners.length > 0
    ? banners.map(b => ({ src: b.image_url, link: b.link_url }))
    : fallbackSlides

  return (
    <div className="relative h-[224px] lg:h-[664px] w-full overflow-hidden">
      <Swiper
        modules={[Navigation, Pagination]}
        loop
        pagination={{ clickable: true }}
        navigation={{
          prevEl: '.hero-prev',
          nextEl: '.hero-next',
        }}
        className="hero-swiper size-full"
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i}>
            <div className="relative size-full">
              <div className="absolute bg-[#e8e3da] inset-0" />
              <img alt="" className="absolute max-w-none object-cover size-full" src={slide.src} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex items-center justify-between px-[10px] lg:px-[46px] z-10 pointer-events-none">
        <button className="hero-prev bg-white/10 rounded-full size-[46px] flex items-center justify-center pointer-events-auto cursor-pointer">
          <div className="overflow-clip size-[12px]">
            <img alt="Previous" className="block max-w-none size-full" src={imgVector2} />
          </div>
        </button>
        <button className="hero-next bg-white/10 rounded-full size-[46px] flex items-center justify-center pointer-events-auto cursor-pointer">
          <div className="overflow-clip size-[12px]">
            <img alt="Next" className="block max-w-none size-full" src={imgVector3} />
          </div>
        </button>
      </div>
      <style>{`
        .hero-swiper .swiper-pagination {
          bottom: 12px !important;
          display: flex;
          justify-content: center;
          gap: 6px;
        }
        .hero-swiper .swiper-pagination-bullet {
          width: 6px;
          height: 6px;
          border-radius: 9999px;
          background: rgba(255,255,255,0.6);
          opacity: 1;
        }
        .hero-swiper .swiper-pagination-bullet-active {
          background: white;
        }
        @media (min-width: 1024px) {
          .hero-swiper .swiper-pagination {
            bottom: 20px !important;
            gap: 10px;
          }
          .hero-swiper .swiper-pagination-bullet {
            width: 10px;
            height: 10px;
          }
        }
      `}</style>
    </div>
  )
}
