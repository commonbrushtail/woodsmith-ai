'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import imgImg4 from '../assets/f7255ed778b64cf2b23182a0a2a87707a625f317.png'
import imgImg5 from '../assets/b67b2afc2ebf76f9c6018d5d33ac38abe04715d0.png'
import imgImg6 from '../assets/861c421ea2f0ed42a7af0d4a5519a5562e155476.png'
import imgImg7 from '../assets/a4724391249df304e6ab4631cb27c6e7a1cebd2c.png'
import imgVector2 from '../assets/111a70dead0aec3d9b930f8886d84779617edefa.svg'
import imgVector3 from '../assets/ca8a43b8ab750b34b816e40ae620fcfb9b449dfd.svg'

export default function GallerySection() {
  const galleryImages = [
    { src: imgImg4, imgClass: 'absolute h-[118.94%] left-[-12.04%] max-w-none top-[-9.87%] w-[191.42%]' },
    { src: imgImg5, imgClass: 'absolute h-[179.78%] left-[-18.45%] max-w-none top-[-6.25%] w-[192.89%]' },
    { src: imgImg6, imgClass: 'absolute max-w-none object-cover size-full' },
    { src: imgImg7, imgClass: 'absolute h-[191.09%] left-[-19.8%] max-w-none top-[-8.61%] w-[205.03%]' },
    { src: imgImg4, imgClass: 'absolute h-[118.94%] left-[-12.04%] max-w-none top-[-9.87%] w-[191.42%]' },
    { src: imgImg5, imgClass: 'absolute h-[179.78%] left-[-18.45%] max-w-none top-[-6.25%] w-[192.89%]' },
  ]

  return (
    <div className="relative w-full overflow-hidden">
      <Swiper
        modules={[Navigation]}
        slidesPerView={1.5}
        loop
        navigation={{ prevEl: '.gallery-prev', nextEl: '.gallery-next' }}
        breakpoints={{
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 4 },
          1536: { slidesPerView: 5 },
        }}
        className="gallery-swiper"
      >
        {galleryImages.map((img, i) => (
          <SwiperSlide key={i}>
            <div className="h-[240px] lg:h-[405px] relative overflow-hidden">
              <div className="absolute bg-[#d9d9d9] inset-0" />
              <img alt="" className={img.imgClass} src={img.src} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="absolute top-1/2 -translate-y-1/2 left-[10px] right-[10px] lg:left-[46px] lg:right-[46px] flex items-center justify-between pointer-events-none z-10">
        <button className="gallery-prev bg-white/10 rounded-full size-[27px] lg:size-[46px] flex items-center justify-center pointer-events-auto">
          <img alt="Previous" className="size-[12px]" src={imgVector2} />
        </button>
        <button className="gallery-next bg-white/10 rounded-full size-[27px] lg:size-[46px] flex items-center justify-center pointer-events-auto">
          <img alt="Next" className="size-[12px]" src={imgVector3} />
        </button>
      </div>
    </div>
  )
}
