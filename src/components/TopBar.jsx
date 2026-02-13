import imgGroup4 from '../assets/de8b631b47915bbe74253cce2d2d87de9e9ae70b.svg'
import imgGroup5 from '../assets/1892e4cf5e8b5b93b264bc3d9767d1c207786f42.svg'
import imgGroup6 from '../assets/00f5a2cd414cae24b88a3ba91819a002fe1957d2.svg'
import imgGroup7 from '../assets/8b366611d662d405e11285343990128f67fd962d.svg'
import imgLineLogo2 from '../assets/60920d563a7a8d872085e3562a9946ce5209b1d1.svg'

export default function TopBar() {
  return (
    <div className="hidden lg:block bg-orange py-[6px] w-full">
      <div className="max-w-[1212px] mx-auto w-full flex items-center justify-between px-[16px]">
        <div className="flex gap-[8px] items-center w-[300px]">
          <div className="overflow-clip shrink-0 size-[16px]">
            <img alt="" className="block max-w-none size-full" src={imgGroup4} />
          </div>
          <p className="font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] text-white">
            Call Center 0 258 9700-1
          </p>
        </div>
        <div className="flex items-center justify-end overflow-clip">
          <div className="flex gap-[12px] items-center">
            <p className="font-['IBM_Plex_Sans_Thai'] font-medium text-[15px] text-white">
              ติดตามเรา: vanachai.woodsmith
            </p>
            <img alt="Facebook" className="shrink-0 size-[22px]" src={imgGroup5} />
            <img alt="Instagram" className="shrink-0 size-[22px]" src={imgGroup6} />
            <img alt="TikTok" className="shrink-0 size-[22px]" src={imgGroup7} />
            <img alt="LINE" className="shrink-0 size-[22px]" src={imgLineLogo2} />
          </div>
        </div>
      </div>
    </div>
  )
}
