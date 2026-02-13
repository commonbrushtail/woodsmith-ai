import { Link } from 'react-router-dom'
import imgHero from '../assets/blog_hero.png'
import imgContent1 from '../assets/blog_content_1.png'
import imgContent2 from '../assets/blog_content_2.png'
import imgContent3 from '../assets/blog_content_3.png'
import imgShareFb from '../assets/icon_share_facebook.svg'
import imgShareLine from '../assets/icon_share_line.svg'
import imgShareX from '../assets/icon_share_x.svg'
import imgView from '../assets/icon_view.svg'
import imgCard1 from '../assets/blog_card_1.png'
import imgCard2 from '../assets/blog_card_2.png'
import imgCard3 from '../assets/blog_card_3.png'
import imgCard4 from '../assets/blog_card_4.png'

const relatedPosts = [
  { id: 2, image: imgCard1, category: 'Idea & Tips', title: 'Goodbye Sun☀️ & Rain 🌧️ประตูสวย ไม่กลัวน้ำ ไม่กลัว แดด \u200B3 จุดเด่นที่ทำให้ประตูเมลามีนกันน้ำอัลตร้าคือคำตอบของทุกบ้าน' },
  { id: 3, image: imgCard2, category: 'Idea & Tips', title: '"Life without limits" ใช้ชีวิตได้สุด ไม่ต้องกลัวพื้นพัง รวม 5 สถานการณ์ ที่ทำไมคุณควรเปลี่ยนมาใช้ "ไม้พื้นไฮบริดอัลตร้า"' },
  { id: 4, image: imgCard3, category: 'Idea & Tips', title: 'ไม้พื้นลามิเนตแสนสวยจากวู้ดสมิตร สวยเสมือนไม้จริง เดินดีไม่มีสะดุด ไม่บวม ไม่เด้ง' },
  { id: 5, image: imgCard4, category: 'Idea & Tips', title: '"ประตูบ้านไม่ใช่แค่ทางเข้า แต่คือส่วนหนึ่งของไลฟ์สไตล์ คุณ !" ประตูเมลามีนกันน้ำอัลตร้า ประตูที่สวยและทน แดด ท้าทายทุกฤดู' },
]

function HomeIcon() {
  return (
    <svg className="size-[14px] shrink-0 relative bottom-[2px]" viewBox="0 0 24 24" fill="none">
      <path d="M3 10.5L12 3L21 10.5V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V10.5Z" stroke="#202124" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 22V12H15V22" stroke="#202124" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function ChevronRightIcon() {
  return (
    <svg className="size-[16px] shrink-0" viewBox="0 0 24 24" fill="none">
      <path d="M9 6L15 12L9 18" stroke="#202124" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function Breadcrumb() {
  return (
    <nav className="flex gap-[8px] items-center px-[20px] lg:px-0 w-full">
      <Link to="/" className="flex gap-[4px] items-center no-underline shrink-0">
        <HomeIcon />
        <span className="font-['IBM_Plex_Sans_Thai'] text-[12px] text-[#202124] tracking-[0.06px] leading-[20px]">
          หน้าแรก
        </span>
      </Link>
      <ChevronRightIcon />
      <Link to="/blog" className="no-underline shrink-0">
        <span className="font-['IBM_Plex_Sans_Thai'] text-[12px] text-[#202124] tracking-[0.06px] leading-[20px]">
          บทความ
        </span>
      </Link>
      <ChevronRightIcon />
      <span className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[12px] text-[#202124] tracking-[0.06px] leading-[20px] truncate">
        เปิด 6 ไอเดียตกแต่งบ้านด้วย "ไม้บอร์ด MDF HMR ปิดผิวเมลามีน" Melamine on MDF
      </span>
    </nav>
  )
}

function RelatedPostCard({ id, image, category, title }) {
  return (
    <Link to={`/blog/${id}`} className="flex gap-[16px] items-start w-full no-underline">
      <div className="shrink-0 w-[102px] h-[100px] relative overflow-hidden">
        <div className="absolute bg-[#e8e3da] inset-0" />
        <img alt="" className="absolute max-w-none object-cover size-full" src={image} />
      </div>
      <div className="flex flex-1 flex-col gap-[4px] items-start py-[2px] min-w-0">
        <p className="font-['IBM_Plex_Sans_Thai'] font-medium text-[15px] text-[#f58733] tracking-[0.15px]">
          {category}
        </p>
        <p className="font-['IBM_Plex_Sans_Thai'] font-semibold leading-[1.2] overflow-hidden text-[16px] text-[#35383b] text-ellipsis line-clamp-3">
          {title}
        </p>
      </div>
    </Link>
  )
}

function ShareButtons() {
  return (
    <div className="flex gap-[10px] items-center w-full">
      <p className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[16px] text-[#222]">
        แชร์ :
      </p>
      <div className="flex gap-[12px] items-center">
        <img alt="Facebook" className="size-[40px] cursor-pointer" src={imgShareFb} />
        <img alt="LINE" className="size-[40px] cursor-pointer" src={imgShareLine} />
        <img alt="X" className="size-[40px] cursor-pointer" src={imgShareX} />
      </div>
    </div>
  )
}

function RelatedPosts() {
  return (
    <div className="flex flex-col gap-[20px] items-start w-full py-[20px]">
      <p className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[20px] text-[#35383b] tracking-[0.1px] leading-[1.3]">
        Blog ที่คล้ายกัน
      </p>
      <div className="flex flex-col gap-[16px] items-start w-full">
        {relatedPosts.map((post) => (
          <RelatedPostCard key={post.id} {...post} />
        ))}
      </div>
      <Link to="/blog" className="border border-[#e5e7eb] flex h-[48px] items-center justify-center w-full no-underline">
        <p className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[16px] text-[#35383b]">
          ดูเพิ่มเติม
        </p>
      </Link>
    </div>
  )
}

export default function BlogPostPage() {
  return (
    <div className="flex flex-col items-center w-full">
      {/* Breadcrumb */}
      <div className="w-full max-w-[1212px] mx-auto py-[8px] lg:px-[16px] mt-4 mb-8">
        <Breadcrumb />
      </div>

      {/* Content */}
      <div className="w-full max-w-[1212px] mx-auto lg:px-[16px] pb-[36px] lg:pb-[60px]">
        <div className="flex flex-col lg:flex-row lg:gap-[36px] items-start">
          {/* Main Article */}
          <article className="flex flex-col gap-[24px] lg:gap-[40px] items-start px-[20px] lg:px-0 w-full lg:flex-[725]">
            {/* Hero Image */}
            <div className="flex flex-col gap-[16px] lg:gap-[12px] items-start w-full">
              <div className="aspect-square relative w-full overflow-hidden">
                <div className="absolute bg-[#e8e3da] inset-0" />
                <img alt="" className="absolute max-w-none object-cover size-full" src={imgHero} />
              </div>

              {/* Category Tags - Mobile pills */}
              <div className="flex lg:hidden gap-[8px] items-start">
                <span className="bg-[rgba(255,126,27,0.15)] px-[10px] py-[2px] rounded-[20px] font-['IBM_Plex_Sans_Thai'] font-medium text-[16px] text-orange tracking-[0.08px] leading-[1.3]">
                  Idea & Tips
                </span>
                <span className="bg-[rgba(255,126,27,0.15)] px-[10px] py-[2px] rounded-[20px] font-['IBM_Plex_Sans_Thai'] font-medium text-[16px] text-orange tracking-[0.08px] leading-[1.3]">
                  Trends
                </span>
              </div>

              {/* Category Tag - Desktop plain text */}
              <p className="hidden lg:block font-['IBM_Plex_Sans_Thai'] font-medium text-[15px] text-[#f58733] tracking-[0.15px]">
                Idea & Tips
              </p>

              {/* Title */}
              <h1 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[24px] lg:text-[40px] text-[#35383b] tracking-[0.12px] lg:tracking-[0.2px] leading-[1.3] m-0">
                เปิด 6 ไอเดียตกแต่งบ้านด้วย "ไม้บอร์ด MDF HMR ปิดผิวเมลามีน" Melamine on MDF
              </h1>

              {/* Divider */}
              <div className="bg-orange h-[2px] w-[51px]" />

              {/* Meta */}
              <div className="flex flex-wrap gap-[8px] lg:gap-[16px] items-center">
                <p className="font-['IBM_Plex_Sans_Thai'] text-[15px] text-[#35383b] tracking-[0.075px] leading-[1.3]">
                  เผยแพร่เมื่อ 22 ต.ค. 2568
                </p>
                <div className="size-[4px] rounded-full bg-[#35383b]" />
                <p className="font-['IBM_Plex_Sans_Thai'] text-[15px] text-[#35383b] tracking-[0.075px] leading-[1.3]">
                  โดย Wood Writer
                </p>
                <div className="size-[4px] rounded-full bg-[#35383b]" />
                <div className="flex gap-[4px] items-center">
                  <img alt="" className="size-[20px]" src={imgView} />
                  <p className="font-['IBM_Plex_Sans_Thai'] text-[15px] text-[#35383b] tracking-[0.075px] leading-[1.3]">
                    450
                  </p>
                </div>
              </div>
            </div>

            {/* Article Body */}
            <div className="font-['IBM_Plex_Sans_Thai'] text-[16px] text-[#35383b] tracking-[0.08px] leading-[1.5] w-full">
              <p className="mb-4">
                ในยุคที่การตกแต่งและบิ้วท์อินเฟอร์นิเจอร์เป็นส่วนสำคัญของการสร้างบ้านในฝัน การเลือกใช้วัสดุที่ตอบโจทย์ ทั้งด้านความสวยงาม ความทนทาน และงบประมาณ จึงเป็นเรื่องที่เจ้าของบ้านให้ความสำคัญเป็นพิเศษ และวัสดุ ที่กำลังมาแรงและถูกเลือกใช้มากขึ้นในงานบิ้วท์อินคือ "ไม้บอร์ด MDF HMR ปิดผิวเมลามีน (Melamine on HMR)"
              </p>
              <p>
                ไม้ HMR (High Moisture Resistance Board) คือไม้ MDF ที่ถูกพัฒนาให้มีคุณสมบัติทนทานต่อความชื้นได้สูง กว่าไม้ MDF ทั่วไป และเมื่อนำมาปิดทับด้วยแผ่นเมลามีนที่มีลวดลายและผิวสัมผัสหลากหลาย ทำให้ได้วัสดุที่สวย งาม แข็งแรง ทนทานต่อรอยขีดข่วน และดูแลรักษาง่าย เราจึงรวบรวม 6 ไอเดียการตกแต่งบ้านที่ใช้ Melamine on HMR มาให้คุณนำไปปรับใช้ครับ
              </p>
            </div>

            {/* Ideas List */}
            <div className="font-['IBM_Plex_Sans_Thai'] text-[16px] text-black tracking-[0.08px] leading-[1.5] w-full">
              <p>✨ชั้นวางของติดผนังแบบสไตล์มินิมอล</p>
              <p>✨หัวเตียงแนวคลาสสิค</p>
              <p>✨ตู้หรือชั้นเก็บของแบบติดผนัง</p>
              <p>✨ชั้นหรือตู้เก็บของโซนแห้งในห้องน้ำ</p>
              <p>✨โต๊ะทำงานแบบมินิมอล</p>
              <p>✨ขอบเตียงหรือเฟอร์นิเจอร์ในห้องเด็กเล็ก</p>
              <p>เลือกไม้ให้เหมาะสมกับการใช้งาน เพื่อเฟอร์นิเจอร์ที่สวยงามและอยู่คู่บ้านคุณไปอีกนานครับ!</p>
            </div>

            {/* Sub-heading & Bullet Points */}
            <div className="font-['IBM_Plex_Sans_Thai'] text-[#35383b] tracking-[0.08px] w-full">
              <h2 className="font-semibold text-[24px] leading-[1.5] m-0 mb-2">
                ทำความรู้จักกับวัสดุ Melamine on MDF HMR สั้นๆ
              </h2>
              <ul className="list-disc pl-[24px] text-[16px] leading-[1.5] space-y-1">
                <li>
                  MDF HMR (ไม้เอ็มดีเอฟทนความชื้น): มีลักษณะเป็นเนื้อไม้บดละเอียดผสมสารทนความชื้น (มักมีสีเขียว) ทำให้เนื้อไม้แน่น ไม่ยุ่ยง่าย และบวมน้ำได้ยากขึ้น
                </li>
                <li>
                  Melamine (เมลามีน): คือแผ่นกระดาษพิมพ์ลายที่เคลือบด้วยน้ำยาเรซินเมลามีน แล้วนำไปปิดทับบนผิวไม้ด้วยความร้อนสูง ทำให้ได้ผิวที่ทนทานต่อรอยขีดข่วน ทนความร้อน และทำความสะอาดง่าย
                </li>
              </ul>
            </div>

            {/* Content Images */}
            <div className="flex flex-col gap-[24px] lg:gap-[40px] w-full">
              <div className="aspect-square relative w-full overflow-hidden">
                <img alt="" className="absolute inset-0 max-w-none object-cover size-full" src={imgContent1} />
              </div>
              <div className="aspect-square relative w-full overflow-hidden">
                <img alt="" className="absolute inset-0 max-w-none object-cover size-full" src={imgContent2} />
              </div>
              <div className="aspect-square relative w-full overflow-hidden">
                <img alt="" className="absolute inset-0 max-w-none object-cover size-full" src={imgContent3} />
              </div>
              <div className="aspect-square relative w-full overflow-hidden">
                <img alt="" className="absolute inset-0 max-w-none object-cover size-full" src={imgContent1} />
              </div>
            </div>

            {/* Share Buttons */}
            <ShareButtons />
          </article>

          {/* Sidebar - Desktop sticky, Mobile below article */}
          <aside className="w-full lg:flex-[451] lg:sticky lg:top-[80px] px-[20px] lg:px-0 mt-[24px] lg:mt-0">
            <RelatedPosts />
          </aside>
        </div>
      </div>
    </div>
  )
}
