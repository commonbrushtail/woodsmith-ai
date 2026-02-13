import GallerySection from '../components/GallerySection'
import imgBannerAbout from '../assets/image_banner_about.png'

export default function AboutPage() {
  return (
    <>
      {/* Banner */}
      <div className="h-[133px] lg:h-[200px] relative w-full overflow-hidden">
        <img alt="" className="absolute max-w-none w-full h-auto top-1/2 -translate-y-1/2 object-cover" src={imgBannerAbout} />
      </div>

      {/* WoodSmith Heading */}
      <div className="flex flex-col gap-[9px] lg:gap-[12px] items-center text-center px-[20px] py-[10px] lg:py-[60px]">
        <p className="font-['Circular_Std'] font-medium text-[48px] lg:text-[80px] text-orange tracking-[0.19px] lg:tracking-[0.25px] leading-[1.3]">
          WoodSmith
        </p>
        <p className="font-['Circular_Std'] font-medium text-orange text-[14px] lg:text-[16px] tracking-[1.71px] lg:tracking-[2.25px] leading-[1.3]">
          BUILDING HARDWARE &amp; TOOLS CENTER
        </p>
        <p className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[24px] lg:text-[36px] text-black tracking-[0.19px] lg:tracking-[0.25px] leading-[1.3]">
          ศูนย์รวมวัสดุก่อสร้าง
          <br className="lg:hidden" />
          และสินค้าสำเร็จรูปโดยโรงงาน
          <br className="lg:hidden" />
          ผู้ผลิต
        </p>
      </div>

      {/* About Content */}
      <div className="flex flex-col gap-[12px] items-center text-center text-black px-[20px] lg:px-[16px] pb-[60px]">
        <div className="max-w-[1212px] mx-auto w-full flex flex-col gap-[12px]">
          <p className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[40px] tracking-[0.25px] leading-[1.3]">
            เกี่ยวกับเรา
          </p>
          <p className="font-['IBM_Plex_Sans_Thai'] text-[16px] lg:text-[20px] leading-normal">
            บริษัท วนชัย วู้ดสมิธ จำกัด และศูนย์จำหน่ายสินค้าวู้ดสมิตร เป็นบริษัท น้องใหม่ของ วนชัย กรุ๊ป ด้วยประสบการณ์ยาวนานกว่า 76 ปี ในอุตสาหกรรมการผลิตแผ่นไม้ ทดแทนไม้ธรรมชาติ ในวันนี้วนชัยกำลัง จะก้าวไปสู่ ธุรกิจการค้าปลีกกับการก่อตั้ง แบรนด์ "วู้ดสมิตร" ที่เป็นทั้ง "ศูนย์เรียนรู้ด้านไม้และไม้ทดแทนไม้ธรรมชาติ" "เป็นสโตร์" และ "เป็น ศูนย์กระจายสินค้า" ของวนชัย
          </p>
          <p className="font-['IBM_Plex_Sans_Thai'] text-[16px] lg:text-[20px] leading-normal">
            "วู้ดสมิตร" จะมีสาขาในทุกภูมิภาคทั่วประเทศไทย โดยจะมี ทั้งแบบร้าน standalone และร้านที่ร่วมมือกับพันธมิตร เพื่อให้ผู้บริโภคได้เรียนรู้และ สัมผัสสินค้าไม้สำเร็จรูปทดแทน ธรรมชาติอย่างใกล้ชิดก่อนซื้อ ภายใต้แนวคิด วู้ดสมิตร "มิตรงานไม้" ที่เป็นมิตรกับคู่ค้าลูกค้า และให้ความสำคัญ กับการผลิตที่มิตรกับสิ่งแวดล้อม
          </p>
          <div className="font-['IBM_Plex_Sans_Thai'] text-[16px] lg:text-[20px] leading-normal">
            <p className="mb-4">
              ตลอดหลายสิบปีที่ผ่านมาอุตสาหกรรมการผลิตแผ่นไม้ ทดแทนไม้ธรรมชาติต้องปรับตัว และพัฒนากระบวนการ ผลิตให้ก้าวทันต่อเทคโนโลยีที่เปลี่ยนแปลงไปและลดผลกระทบต่อ สิ่งแวดล้อมที่วิกฤตขึ้นทุกวัน วนชัยเป็นองค์กรแรกๆ ในอุตสาหกรรมไม้ที่ให้ความสำคัญกับการอนุรักษ์สิ่งแวด ล้อมอย่างเป็นรูปธรรมโดยยึดแนวคิดในการใช้ทรัพยากรอย่างคุ้มค่าที่สุด ลดการใช้วัตถุดิบที่ฟุ่มเฟือย และเน้นการ มองหาทรัพยากรทดแทนเพื่อรักษาธรรมชาติให้สมดุล เช่น การเลือกใช้ไม้ยางพาราที่ หมดน้ำยางแล้วมาใช้ผลิตแผ่น ไม้ทดแทนไม้ธรรมชาติ
            </p>
            <p className="mb-4">
              วู้ดสมิตรเกิดขึ้นมาเพื่อเป็นศูนย์กระจายสินค้า เพื่อทำให้ ตัวแทนจำหน่าย และ วนชัยสามารถร่วมกันดูแลตอบสนอง ลูกค้าของเราได้ดียิ่งขึ้น มีประสิทธิภาพ มากขึ้น นอกจาก นี้ยังมีเป้าหมายในการพัฒนาสินค้าใหม่ โดยเฉพาะสินค้า ที่ยังไม่เป็นที่รู้จักของตลาด เป็นสินค้าใหม่ที่พัฒนามาเป็น ทางเลือกใหม่ของผู้บริโภค
            </p>
            <p>
              นอกจากนี้ "วู้ดสมิตร" จะเป็นช่องทางสื่อสารใหม่ที่วนชัย ส่งตรงถึงกลุ่มผู้บริโภค สามารถทำให้วนชัยเข้าถึงและเข้าใจ ความต้องการของผู้บริโภคได้มากขึ้น ในขณะเดียวกัน ผู้บริโภคจะมีทางเลือกใหม่ในการซื้อสินค้าไม้สำเร็จรูปแบบ ใหม่ที่ยังไม่มีขายในร้าน modern trade และตัวแทนจำหน่าย ซึ่งสินค้าไม้สำเร็จ รูปแบบใหม่นี้ ได้รับการพัฒนามาเพื่อ ช่วยลดค่าใช้จ่ายและลดระยะเวลาการติดตั้งในการก่อสร้าง ผู้บริโภคจะได้รับการบริการที่ใกล้ชิด และ รวดเร็วมากขึ้น ผ่านทีมช่างมิตรและเครือข่ายของ วู้ดสมิตร และ วู้ดสมิตรออนไลน์ที่พร้อม ตอบสนองผู้บริโภคทุกเวลาและทุกสถานที่
            </p>
          </div>
        </div>
      </div>

      {/* Gallery - reuse homepage gallery */}
      <GallerySection />
    </>
  )
}
