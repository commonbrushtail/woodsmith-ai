import imgFooter2 from '../assets/085f43f3759f7fa730e2930281d143902d7ee59e.png'
import imgImgLogofooter1 from '../assets/e05ed7a3662b09b18d2def0a54c6c182a316f92f.png'
import imgQRCode from '../assets/e5940bf774eb0a8ddbb6fc05d6efef7440c7f128.png'
import imgBanner1 from '../assets/f7035194bdb5216644caa2d04e662ba07b3205d7.png'
import imgGroup from '../assets/2b813db0599ce85c8f42e1c2db564008d195b652.svg'
import imgGroup1 from '../assets/879176f5990f54320c8ebf5ca3c41ad184009c63.svg'
import imgGroup2 from '../assets/df1ebd85d6429885836d2abd5f34a651350f8e02.svg'
import imgGroup3 from '../assets/965eaf2fbd5951c3b183edca911f967a9ff81858.svg'
import imgLineLogo1 from '../assets/460e9562d009a9dc06b89094e9317c05197e3894.svg'
import imgLine34 from '../assets/a41fa6d7209c715799bf9e2145af85fd67c3a650.svg'
import Link from 'next/link'

const footerLinkMap = {
  'หน้าแรก': '/',
  'เกี่ยวกับเรา': '/about',
  'ค้นหาสาขา': '/branches',
  'บทความ': '/blog',
  'คู่มือ': '/manual',
  'ไฮไลท์': '/highlight',
  'FAQs': '/faq',
  'สินค้าของเรา': '/products',
}

export default function Footer() {
  const footerLinksLeft = ['หน้าแรก', 'เกี่ยวกับเรา', 'สินค้าของเรา', 'ค้นหาสาขา']
  const footerLinksRight = ['บทความ', 'คู่มือ', 'ไฮไลท์', 'FAQs']
  const allFooterLinks = [...footerLinksLeft, ...footerLinksRight]

  return (
    <div className="relative flex flex-col gap-[16px] lg:gap-[36px] items-center overflow-clip pt-[40px] lg:pt-[60px] w-full">
      <div className="absolute inset-0">
        <div className="absolute bg-dark inset-0" />
        <img alt="" className="absolute max-w-none object-cover opacity-[0.08] size-full" src={imgFooter2} />
      </div>

      {/* Footer Top */}
      {/* Mobile: centered stacked */}
      <div className="flex flex-col gap-[32px] items-center px-[16px] relative w-full lg:hidden">
        <div className="flex flex-col gap-[16px] items-center w-full">
          <img alt="WoodSmith Logo" className="h-[98px] w-[105px] object-cover" src={imgImgLogofooter1} />
          <div className="flex flex-col gap-[16px] items-center w-full">
            <div className="text-white text-center">
              <p className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[20px] mb-0">บริษัท วนชัย วู้ดสมิธ จำกัด (สำนักงานใหญ่)</p>
              <p className="font-['IBM_Plex_Sans_Thai'] text-[14px]">
                เลขที่ 2/1 ถนน วงศ์สว่าง แขวงวงศ์สว่าง เขตบางซื่อ<br />กรุงเทพฯ 10800
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex gap-[8px] items-center">
                <img alt="Phone" className="shrink-0 size-[20px]" src={imgGroup} />
                <p className="font-['Circular_Std'] font-medium text-[18px] text-white leading-[1.2]">Call Center</p>
              </div>
              <p className="font-['Circular_Std'] font-medium text-[32px] text-orange leading-[1.2]">0 2587 9700-1</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-[16px] items-center w-full">
          <div className="flex flex-col gap-[12px] items-center">
            <img alt="QR Code" className="h-[110px] w-[109px] object-cover" src={imgQRCode} />
            <div className="text-center text-white">
              <p className="font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] mb-0">สแกนคิวอาร์โค้ดเพื่อเพิ่มเพื่อน LINE</p>
              <p className="font-['IBM_Plex_Sans_Thai'] font-medium text-[20px] text-orange">@vanachai.woodsmith</p>
            </div>
          </div>
          <div className="flex gap-[12px] items-center">
            <p className="font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] text-white">ติดตามเรา</p>
            <div className="flex gap-[14px] items-center">
              <img alt="Facebook" className="shrink-0 size-[32px]" src={imgGroup1} />
              <img alt="Instagram" className="shrink-0 size-[32px]" src={imgGroup2} />
              <img alt="TikTok" className="shrink-0 size-[32px]" src={imgGroup3} />
              <img alt="LINE" className="shrink-0 size-[32px]" src={imgLineLogo1} />
            </div>
          </div>
        </div>
      </div>

      {/* Desktop: side by side */}
      <div className="hidden lg:block relative w-full">
        <div className="max-w-[1212px] mx-auto w-full flex items-start justify-between px-[16px]">
          <div className="flex gap-[24px] items-start">
            <img alt="WoodSmith Logo" className="h-[171px] w-[184px] object-cover" src={imgImgLogofooter1} />
            <div className="flex flex-col gap-[16px] items-start">
              <div className="text-white">
                <p className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[32px] mb-0">บริษัท วนชัย วู้ดสมิธ จำกัด (สำนักงานใหญ่)</p>
                <p className="font-['IBM_Plex_Sans_Thai'] text-[16px]">เลขที่ 2/1 ถนน วงศ์สว่าง แขวงวงศ์สว่าง เขตบางซื่อ กรุงเทพฯ 10800</p>
              </div>
              <div className="flex flex-col items-start">
                <div className="flex gap-[8px] items-center">
                  <img alt="Phone" className="shrink-0 size-[20px]" src={imgGroup} />
                  <p className="font-['Circular_Std'] font-medium text-[18px] text-white leading-[1.2]">Call Center</p>
                </div>
                <p className="font-['Circular_Std'] font-medium text-[36px] text-orange leading-[1.2]">0 2587 9700-1</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-[12px] items-end">
            <img alt="QR Code" className="h-[110px] w-[109px] object-cover" src={imgQRCode} />
            <div className="text-right text-white">
              <p className="font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] mb-0">สแกนคิวอาร์โค้ดเพื่อเพิ่มเพื่อน LINE</p>
              <p className="font-['IBM_Plex_Sans_Thai'] font-medium text-[16px] text-orange">@vanachai.woodsmith</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Middle - Links */}
      {/* Mobile: 2-column */}
      <div className="border-t border-[rgba(255,255,255,0.1)] pt-[20px] px-[16px] relative w-full lg:hidden">
        <div className="flex font-['IBM_Plex_Sans_Thai'] font-medium items-center justify-between px-[36px] text-[14px] text-white w-full">
          <div className="flex flex-col gap-[16px] items-start w-[100px]">
            {footerLinksLeft.map((link) =>
              footerLinkMap[link] ? (
                <Link key={link} href={footerLinkMap[link]} className="text-white no-underline">{link}</Link>
              ) : (
                <p key={link}>{link}</p>
              )
            )}
          </div>
          <div className="flex flex-col gap-[16px] items-start w-[100px]">
            {footerLinksRight.map((link) =>
              footerLinkMap[link] ? (
                <Link key={link} href={footerLinkMap[link]} className="text-white no-underline">{link}</Link>
              ) : (
                <p key={link}>{link}</p>
              )
            )}
          </div>
        </div>
      </div>
      {/* Desktop: single row */}
      <div className="hidden lg:block relative w-full">
        <div className="max-w-[1212px] mx-auto w-full flex items-center justify-between px-[16px]">
          <div className="flex font-['IBM_Plex_Sans_Thai'] font-medium gap-[32px] items-center text-[14px] text-white">
            {allFooterLinks.map((link) =>
              footerLinkMap[link] ? (
                <Link key={link} href={footerLinkMap[link]} className="shrink-0 text-white no-underline">{link}</Link>
              ) : (
                <p key={link} className="shrink-0">{link}</p>
              )
            )}
          </div>
          <div className="flex gap-[12px] items-center">
            <p className="font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] text-white">ติดตามเรา</p>
            <div className="flex gap-[14px] items-center">
              <img alt="Facebook" className="shrink-0 size-[32px]" src={imgGroup1} />
              <img alt="Instagram" className="shrink-0 size-[32px]" src={imgGroup2} />
              <img alt="TikTok" className="shrink-0 size-[32px]" src={imgGroup3} />
              <img alt="LINE" className="shrink-0 size-[32px]" src={imgLineLogo1} />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-[rgba(255,255,255,0.1)] lg:border-[rgba(255,255,255,0.25)] py-[32px] relative w-full">
        <div className="max-w-[1212px] mx-auto w-full flex flex-col lg:flex-row items-center lg:justify-between gap-[12px] px-[16px]">
          <p className="font-['Circular_Std'] font-medium text-[14px] lg:text-[13px] text-white">
            © 2019 @<span className="uppercase">vanachai.woodsmith</span>. All rights reserved.
          </p>
          <div className="flex flex-col lg:flex-row gap-[12px] lg:gap-[32px] items-center justify-center lg:justify-end">
            <div className="flex gap-[16px] items-center justify-center lg:justify-end">
              <p className="font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] lg:text-[13px] text-white">ข้อกำหนดและเงื่อนไขการใช้งาน</p>
              <div className="h-[13px] flex items-center justify-center w-0">
                <div className="rotate-90 w-[13px] h-0 relative">
                  <img alt="" className="absolute inset-[-0.5px_0_0_0] block max-w-none size-full" src={imgLine34} />
                </div>
              </div>
              <p className="font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] lg:text-[13px] text-white">นโยบายความเป็นส่วนตัว</p>
            </div>
            <div className="h-[42px] rounded-[5px] w-[88px] relative overflow-hidden">
              <div className="absolute bg-white inset-0 rounded-[5px]" />
              <img alt="DBD" className="absolute max-w-none object-cover rounded-[5px] size-full" src={imgBanner1} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
