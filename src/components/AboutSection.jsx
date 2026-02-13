import imgImg1 from '../assets/eeb7b576909d441a150505ef40b2ec8a266d40f5.png'
import imgImg2 from '../assets/3fe69461b28387eabe30698fec14e7c2f5b4a018.png'
import imgImg3 from '../assets/118c728dba9a04975b57c409a82dafe2f7dca6f8.png'

export default function AboutSection() {
  return (
    <div className="bg-beige w-full py-[36px] lg:pb-[80px] lg:pt-[60px]">
      <div className="max-w-[1212px] mx-auto w-full flex flex-col gap-[32px] items-center justify-center px-[16px]">
        <div className="flex flex-col gap-[12px] items-center w-full">
          <p className="font-['Circular_Std'] font-medium text-[36px] lg:text-[80px] text-orange tracking-[0.25px] leading-[1.3]">
            WoodSmith
          </p>
          <p className="font-['Circular_Std'] font-medium text-orange text-[16px] text-center tracking-[2.25px] leading-[1.3]">
            BUILDING HARDWARE &amp; TOOLS CENTER
          </p>
          <p className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[24px] lg:text-[36px] text-black text-center tracking-[0.25px] leading-[1.3]">
            ศูนย์รวมวัสดุก่อสร้างและสินค้าสำเร็จรูปโดยโรงงานผู้ผลิต
          </p>
          <p className="font-['IBM_Plex_Sans_Thai'] text-[16px] lg:text-[20px] text-black text-center">
            วู้ดสมิตร "มิตรงานไม้" ที่เป็นมิตรกับคู่ค้าลูกค้า และให้ความสำคัญกับการผลิตที่มิตรกับสิ่งแวดล้อม
          </p>
        </div>
        {/* Images */}
        <div className="flex gap-[7px] lg:gap-[23px] items-start justify-center w-full lg:w-auto">
          <div className="h-[172px] lg:h-[400px] shrink-0 w-[85px] lg:w-[243px] relative overflow-hidden">
            <img alt="" className="absolute h-[114.5%] left-[-76.54%] max-w-none top-[-1.41%] w-[188.48%]" src={imgImg1} />
          </div>
          <div className="h-[172px] lg:h-[400px] shrink-0 w-[85px] lg:w-[241px] relative overflow-hidden">
            <img alt="" className="absolute max-w-none object-cover size-full" src={imgImg2} />
          </div>
          <div className="flex flex-col gap-[56px] items-start xl:w-[610px]">
            <div className="flex items-end w-full">
              <div className="relative rounded-tr-[15px] lg:rounded-tr-[50px] h-[116px] w-[101px] lg:size-[243px] overflow-hidden">
                <img alt="" className="absolute h-full left-[-46.81%] max-w-none top-0 w-[150%]" src={imgImg3} />
              </div>
            </div>
            {/* Stats - hidden on mobile, shown in separate row */}
            <div className="hidden lg:flex font-['Circular_Std'] font-medium items-center text-black w-full ">
              <div className="flex flex-col items-start lg:w-[140px] xl:w-[203.333px]">
                <p className="text-[64px]">97</p>
                <p className="text-[16px] tracking-[6.88px] relative bottom-[14px]">Branch</p>
              </div>
              <div className="flex flex-col items-start lg:w-[140px] xl:w-[203.333px]">
                <p className="text-[64px]">20+</p>
                <p className="text-[16px] tracking-[6.88px] relative bottom-[14px]">Products</p>
              </div>
              <div className="flex flex-col items-start lg:w-[140px] xl:w-[203.333px]">
                <p className="text-[64px]">10K+</p>
                <p className="text-[16px] tracking-[6.88px] relative bottom-[14px]">Customers</p>
              </div>
            </div>
          </div>
        </div>
        {/* Mobile stats row */}
        <div className="flex lg:hidden font-['Circular_Std'] font-medium gap-[24px] items-center justify-center text-black w-full">
          <div className="flex flex-col items-start">
            <p className="text-[32px]">97</p>
            <p className="text-[12px] tracking-[0.6px]">Branch</p>
          </div>
          <div className="flex flex-col items-start">
            <p className="text-[32px]">20+</p>
            <p className="text-[12px] tracking-[0.6px]">Products</p>
          </div>
          <div className="flex flex-col items-start">
            <p className="text-[32px]">10K+</p>
            <p className="text-[12px] tracking-[0.36px]">Customers</p>
          </div>
        </div>
      </div>
    </div>
  )
}
