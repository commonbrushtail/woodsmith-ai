import Link from 'next/link'
import ArrowRight from './ArrowRight'
import imgRectangle16 from '../assets/ec5ba3bf93ab424a9bd1d587a6a86c560af1899e.png'
import imgRectangle17 from '../assets/023fde7da6526c23ab180a10b67081e54ceee6c9.png'
import imgRectangle18 from '../assets/a611caa1d3a37215b31998b9435c650b5e1065d3.png'
import imgRectangle19 from '../assets/8c23f1dfcd2996dafe4651f15ceca303bbd11c13.png'
import imgRectangle20 from '../assets/51314da5a92e7506f1b7e549c8188c751997d624.png'

function CardBlogLandscape({ image, category, title, id, slug }) {
  const href = slug ? `/blog/${slug}` : id ? `/blog/${id}` : null
  const content = (
    <div className="flex gap-[16px] items-start w-full">
      <div className="shrink-0 w-[120px] h-[120px] lg:aspect-auto lg:h-[160px] lg:w-[162px] relative overflow-hidden">
        <div className="absolute bg-[#e8e3da] inset-0" />
        <img alt="" className="absolute max-w-none object-cover size-full" src={image} />
      </div>
      <div className="flex flex-1 flex-col gap-[12px] lg:gap-[12px] items-start py-[2px] min-w-0">
        <div className="flex flex-col gap-[4px] items-start w-full">
          <p className="font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] lg:text-[15px] text-orange tracking-[0.14px] lg:tracking-[0.15px]">
            {category}
          </p>
          <p className="font-['IBM_Plex_Sans_Thai'] font-semibold leading-[1.2] overflow-hidden text-[16px] lg:text-[18px] text-black text-ellipsis line-clamp-3">
            {title}
          </p>
        </div>
        <div className="flex gap-[8px] items-center">
          <p className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-black tracking-[0.28px]">
            อ่านต่อ
          </p>
          <ArrowRight />
        </div>
      </div>
    </div>
  )
  return href ? <Link href={href} className="no-underline w-full">{content}</Link> : content
}

const fallbackFeatured = {
  image: imgRectangle17,
  category: 'Idea & Tips',
  title: 'เปิด 6 ไอเดียตกแต่งบ้านด้วย "ไม้บอร์ด MDF HMR ปิดผิวเมลามีน" Melamine on MDF',
}

const fallbackCards = [
  { image: imgRectangle16, category: 'Style & Function', title: `Goodbye Sun☀️ & Rain 🌧️ประตูสวย ไม่กลัวน้ำ ไม่กลัว แดด ​3 จุดเด่นที่ทำให้ประตูเมลามีนกันน้ำอัลตร้าคือ คำตอบของทุกบ้าน` },
  { image: imgRectangle18, category: 'Knowledge, Style & Function', title: `"Life without limits" ใช้ชีวิตอย่างไร้ขีดจำกัด ไม้อัดวนชัย ไม้อัดแข็ง ไม้อัดเบา 5 ไม้บอร์ดอเนกประสงค์ ไม้อัดแข็ง ให้ความแข็งแรง` },
  { image: imgRectangle19, category: 'Style & Function', title: 'ไม้อัดวนชัย ครบจบทุกงาน ทั้งงานเฟอร์นิเจอร์วู้ดสมิตร คิดอย่างมิตร ทำอย่างจริงจัง' },
  { image: imgRectangle20, category: 'Idea & Tips', title: `"ปาร์ติเกิลบอร์ด ไม้อัดใช้แล้วหลอก ชนิดไหนดี ใช้ทำอะไร ต่างกันยังไง !!" ปาร์ติเกิลบอร์ด อเนกประสงค์` },
]

export default function BlogSection({ posts = [] }) {
  const dbCards = posts.map(p => ({
    image: p.cover_image_url || imgRectangle16,
    category: p.category || 'บทความ',
    title: p.title,
    id: p.id,
    slug: p.slug,
  }))

  // First post = big featured card (left), rest = landscape cards (right)
  const featured = dbCards.length > 0 ? dbCards[0] : fallbackFeatured
  const sideCards = dbCards.length > 1 ? dbCards.slice(1, 5) : fallbackCards
  const featuredHref = featured.slug ? `/blog/${featured.slug}` : featured.id ? `/blog/${featured.id}` : null

  return (
    <div className="w-full py-[36px] lg:py-[60px]">
      <div className="max-w-[1212px] mx-auto w-full flex flex-col gap-[48px] items-center justify-center px-[16px]">
        <div className="flex flex-col items-center w-full">
          <p className="font-['IBM_Plex_Sans_Thai_Looped'] font-bold text-[32px] lg:text-[40px] text-black text-center leading-[1.2] lg:leading-[1.5]">
            เคล็ดลับฉบับ Wood Smith
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6.25 items-start w-full">
          <div className="flex flex-col items-start shrink-0">
            {featuredHref ? (
              <Link href={featuredHref} className="no-underline flex flex-col gap-[16px] w-full">
                <div className="relative overflow-hidden">
                  <img alt="" className="object-cover size-full" src={featured.image} />
                </div>
                <div className="flex flex-col gap-[16px] items-start w-full">
                  <div className="flex flex-col items-start w-full">
                    <p className="font-['IBM_Plex_Sans_Thai'] font-medium text-[15px] text-orange tracking-[0.15px]">
                      {featured.category}
                    </p>
                    <p className="font-['IBM_Plex_Sans_Thai'] font-semibold leading-[1.4] overflow-hidden text-[20px] text-black text-ellipsis line-clamp-3">
                      {featured.title}
                    </p>
                  </div>
                  <div className="flex gap-[8px] items-center">
                    <p className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-black tracking-[0.28px]">อ่านต่อ</p>
                    <ArrowRight />
                  </div>
                </div>
              </Link>
            ) : (
              <div className="flex flex-col gap-[16px] w-full">
                <div className="relative overflow-hidden">
                  <img alt="" className="object-cover size-full" src={featured.image} />
                </div>
                <div className="flex flex-col gap-[16px] items-start w-full">
                  <div className="flex flex-col items-start w-full">
                    <p className="font-['IBM_Plex_Sans_Thai'] font-medium text-[15px] text-orange tracking-[0.15px]">
                      {featured.category}
                    </p>
                    <p className="font-['IBM_Plex_Sans_Thai'] font-semibold leading-[1.4] overflow-hidden text-[20px] text-black text-ellipsis line-clamp-3">
                      {featured.title}
                    </p>
                  </div>
                  <div className="flex gap-[8px] items-center">
                    <p className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-black tracking-[0.28px]">อ่านต่อ</p>
                    <ArrowRight />
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-1 flex-col gap-[25px] items-start justify-center">
            <div className="flex flex-col gap-[25px] items-start justify-center w-full">
              {sideCards.map((card, i) => (
                <CardBlogLandscape key={card.id || i} {...card} />
              ))}
            </div>
            <Link href="/blog" className="no-underline border border-[#e5e7eb] flex h-[48px] items-center justify-center w-full">
              <p className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[16px] text-black">ดูเพิ่มเติม</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
