import imgFavicon from '../assets/6727cae5f32ea2c35a94792ae9603addc6300612.png'
import imgRectangle38 from '../assets/a95471a3a128e488d696bd58ef944e6616e0e70f.png'
import imgImage from '../assets/54bb27c92ce5121ca3747b98cc83fa4f3592b6be.png'
import imgImage1 from '../assets/4938668eb297d2d732709691026edba0d197c105.png'
import imgImage2 from '../assets/2296f896c40b1a9eeafb180cb7eee843d61329da.png'
import imgImage3 from '../assets/7a62d7c4116b57486dfe6f273dca7933f5b6f214.png'
import imgYoutube1 from '../assets/966cb7fb2d9240d9b332a342696019cb196e1a46.svg'

function YoutubeCard({ image, duration, channelName, title }) {
  return (
    <div className="flex flex-col gap-[10px] items-start w-full lg:w-[387px]">
      <div className="relative w-full lg:w-[387px]">
        <div className="aspect-video relative w-full overflow-hidden">
          <img alt="" className="absolute max-w-none object-cover size-full" src={image} />
          <div className="absolute bg-gradient-to-b from-[rgba(0,0,0,0.77)] inset-0 to-[60.195%] to-[rgba(0,0,0,0)]" />
        </div>
        <div className="absolute bottom-[5px] right-[5px] bg-[rgba(3,3,3,0.44)] px-[7px] lg:px-[8px] py-[2px] rounded-[5.5px]">
          <p className="font-['Avenir_Next'] font-medium text-[10px] lg:text-[11px] text-white text-center tracking-[0.2px] lg:tracking-[0.22px]">
            {duration}
          </p>
        </div>
        <div className="absolute top-[6px] lg:top-[7px] left-[10px] lg:left-[11px] flex gap-[8px] items-center right-[10px] lg:right-auto lg:w-[367px]">
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
      </div>
      <div className="w-full">
        <p className="font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] lg:text-[16px] text-white overflow-hidden text-ellipsis leading-[20px] lg:leading-[22px]">
          {title}
        </p>
      </div>
    </div>
  )
}

export default function HighlightSection() {
  return (
    <div className="relative py-[40px] w-full">
      <div className="absolute inset-0 overflow-hidden">
        <img alt="" className="absolute max-w-none object-cover size-full" src={imgRectangle38} />
      </div>
      <div className="absolute bg-highlight-bg inset-0" />
      <div className="max-w-[1212px] mx-auto w-full px-[20px] lg:px-[16px] relative">
        {/* Mobile: stacked vertically */}
        <div className="flex flex-col lg:flex-row gap-[24px] lg:gap-[40px] items-start w-full">
          <div className="flex flex-col gap-[32px] items-start w-full lg:flex-1 lg:self-stretch">
            <div className="flex flex-col items-start leading-[1.5] w-full">
              <p className="font-['Circular_Std'] font-medium text-[48px] lg:text-[64px] text-orange">
                Highlight
              </p>
              <p className="font-['IBM_Plex_Sans_Thai'] font-medium text-[36px] lg:text-[32px] text-white">
                ความรู้/อินไซต์เชิงลึก
              </p>
              <p className="font-['IBM_Plex_Sans_Thai'] text-[16px] text-white">
                Inside the Brand: ถอดรหัส DNA องค์กรสู่ความสำเร็จ
              </p>
            </div>
            {/* Desktop-only button */}
            <button className="hidden lg:flex border border-[#e5e7eb] h-[48px] items-center justify-center w-full">
              <p className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[16px] text-white">ดูเพิ่มเติม</p>
            </button>
          </div>
          <div className="flex flex-col lg:flex-row lg:flex-wrap gap-[25px] items-start justify-center w-full lg:w-[800px]">
            <YoutubeCard image={imgImage} duration="0:42" channelName="WoodSmith Learning Center" title="WoodSmith Learning Center" />
            <YoutubeCard image={imgImage1} duration="0:50" channelName="WoodSmith Art Collaboration Interview Artist" title="WoodSmith Art Collaboration Interview Artist" />
            <YoutubeCard image={imgImage2} duration="1:29" channelName="Woodsmith Art Collaboration" title="Woodsmith Art Collaboration" />
            <YoutubeCard image={imgImage3} duration="0:51" channelName="WoodSmith Guest Interview คุณหนุ่ย รติวัฒน์ สุวรรณไตรย์" title="WoodSmith Guest Interview คุณหนุ่ย รติวัฒน์ สุวรรณไตรย์" />
          </div>
          {/* Mobile-only button */}
          <button className="lg:hidden border border-[#e5e7eb] flex h-[48px] items-center justify-center w-full">
            <p className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[16px] text-white">ดูเพิ่มเติม</p>
          </button>
        </div>
      </div>
    </div>
  )
}
