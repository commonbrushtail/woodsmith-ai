'use client'

import Link from 'next/link'
import SafeHtmlContent from '@/components/SafeHtmlContent'
import imgShareFb from '../../../../assets/icon_share_facebook.svg'
import imgShareLine from '../../../../assets/icon_share_line.svg'
import imgShareX from '../../../../assets/icon_share_x.svg'
import imgCard1 from '../../../../assets/blog_card_1.png'

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

function RelatedPostCard({ id, slug, image, category, title }) {
  const href = slug ? `/blog/${slug}` : `/blog/${id}`
  return (
    <Link href={href} className="flex gap-[16px] items-start w-full no-underline">
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
  const handleShare = (platform) => {
    const url = encodeURIComponent(window.location.href)
    const title = encodeURIComponent(document.title)
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      line: `https://social-plugins.line.me/lineit/share?url=${url}`,
      x: `https://x.com/intent/tweet?url=${url}&text=${title}`,
    }
    window.open(urls[platform], '_blank', 'noopener,noreferrer,width=600,height=400')
  }

  return (
    <div className="flex gap-[10px] items-center w-full">
      <p className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[16px] text-[#222]">
        แชร์ :
      </p>
      <div className="flex gap-[12px] items-center">
        <button type="button" onClick={() => handleShare('facebook')} className="p-0 border-0 bg-transparent cursor-pointer">
          <img alt="Facebook" className="size-[40px]" src={imgShareFb} />
        </button>
        <button type="button" onClick={() => handleShare('line')} className="p-0 border-0 bg-transparent cursor-pointer">
          <img alt="LINE" className="size-[40px]" src={imgShareLine} />
        </button>
        <button type="button" onClick={() => handleShare('x')} className="p-0 border-0 bg-transparent cursor-pointer">
          <img alt="X" className="size-[40px]" src={imgShareX} />
        </button>
      </div>
    </div>
  )
}

const FALLBACK_CATEGORY_LABELS = {
  ideas: 'ไอเดียและเคล็ดลับ',
  trend: 'เทรนด์',
  style: 'สไตล์และฟังก์ชัน',
  knowledge: 'ความรู้ทั่วไป',
}

export default function BlogPostPageClient({ post = null, relatedPosts: dbRelated = [], categories: dbCategories = [] }) {
  const CATEGORY_LABELS = dbCategories.length > 0
    ? Object.fromEntries(dbCategories.map(c => [c.slug, c.name]))
    : FALLBACK_CATEGORY_LABELS

  const related = dbRelated.map(p => ({
    id: p.id,
    slug: p.slug,
    image: p.cover_image_url || imgCard1,
    category: CATEGORY_LABELS[(p.category || '').toLowerCase()] || p.category || 'บทความ',
    title: p.title,
  }))

  const heroImage = post?.cover_image_url || null
  const postTitle = post?.title || ''
  const postCategory = CATEGORY_LABELS[(post?.category || '').toLowerCase()] || post?.category || ''
  const postContent = post?.content || null
  const viewCount = post?.view_count ?? 0
  const dateSource = post?.publish_date || post?.created_at
  const publishDate = dateSource
    ? new Date(dateSource).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })
    : null

  return (
    <div className="flex flex-col items-center w-full">
      {/* Breadcrumb */}
      <div className="w-full max-w-[1212px] mx-auto py-[8px] lg:px-[16px] mt-4 mb-8">
        <nav className="flex gap-[8px] items-center px-[20px] lg:px-0 w-full">
          <Link href="/" className="flex gap-[4px] items-center no-underline shrink-0">
            <HomeIcon />
            <span className="font-['IBM_Plex_Sans_Thai'] text-[12px] text-[#202124] tracking-[0.06px] leading-[20px]">
              หน้าแรก
            </span>
          </Link>
          <ChevronRightIcon />
          <Link href="/blog" className="no-underline shrink-0">
            <span className="font-['IBM_Plex_Sans_Thai'] text-[12px] text-[#202124] tracking-[0.06px] leading-[20px]">
              บทความ
            </span>
          </Link>
          <ChevronRightIcon />
          <span className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[12px] text-[#202124] tracking-[0.06px] leading-[20px] truncate">
            {postTitle}
          </span>
        </nav>
      </div>

      {/* Content */}
      <div className="w-full max-w-[1212px] mx-auto lg:px-[16px] pb-[36px] lg:pb-[60px]">
        <div className="flex flex-col lg:flex-row lg:gap-[36px] items-start">
          {/* Main Article */}
          <article className="flex flex-col gap-[24px] lg:gap-[40px] items-start px-[20px] lg:px-0 w-full lg:flex-[725]">
            {/* Hero Image */}
            <div className="flex flex-col gap-[16px] lg:gap-[12px] items-start w-full">
              {heroImage && (
                <div className="aspect-square relative w-full overflow-hidden">
                  <div className="absolute bg-[#e8e3da] inset-0" />
                  <img alt="" className="absolute max-w-none object-cover size-full" src={heroImage} />
                </div>
              )}

              {/* Category Tags */}
              <div className="flex lg:hidden gap-[8px] items-start">
                <span className="bg-[rgba(255,126,27,0.15)] px-[10px] py-[2px] rounded-[20px] font-['IBM_Plex_Sans_Thai'] font-medium text-[16px] text-orange tracking-[0.08px] leading-[1.3]">
                  {postCategory}
                </span>
              </div>
              <p className="hidden lg:block font-['IBM_Plex_Sans_Thai'] font-medium text-[15px] text-[#f58733] tracking-[0.15px]">
                {postCategory}
              </p>

              {/* Title */}
              <h1 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[24px] lg:text-[40px] text-[#35383b] tracking-[0.12px] lg:tracking-[0.2px] leading-[1.3] m-0">
                {postTitle}
              </h1>

              <div className="bg-orange h-[2px] w-[51px]" />

              {/* Meta */}
              <div className="flex flex-wrap gap-[8px] lg:gap-[16px] items-center">
                {publishDate && (
                  <p className="font-['IBM_Plex_Sans_Thai'] text-[15px] text-[#35383b] tracking-[0.075px] leading-[1.3]">
                    เผยแพร่เมื่อ {publishDate}
                  </p>
                )}
                {publishDate && (
                  <div className="size-[4px] rounded-full bg-[#35383b]" />
                )}
                <div className="flex gap-[4px] items-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#35383b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  <p className="font-['IBM_Plex_Sans_Thai'] text-[15px] text-[#35383b] tracking-[0.075px] leading-[1.3]">
                    {viewCount}
                  </p>
                </div>
              </div>
            </div>

            {/* Article Body */}
            {postContent && (
              <SafeHtmlContent
                html={postContent}
                className="font-['IBM_Plex_Sans_Thai'] text-[16px] text-[#35383b] tracking-[0.08px] leading-[1.5] w-full prose prose-headings:font-['IBM_Plex_Sans_Thai'] prose-headings:text-[#35383b]"
              />
            )}

            {/* Share Buttons */}
            <ShareButtons />
          </article>

          {/* Sidebar */}
          {related.length > 0 && (
            <aside className="w-full lg:flex-[451] lg:sticky lg:top-[80px] px-[20px] lg:px-0 mt-[24px] lg:mt-0">
              <div className="flex flex-col gap-[20px] items-start w-full py-[20px]">
                <p className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[20px] text-[#35383b] tracking-[0.1px] leading-[1.3]">
                  Blog ที่คล้ายกัน
                </p>
                <div className="flex flex-col gap-[16px] items-start w-full">
                  {related.map((post) => (
                    <RelatedPostCard key={post.id} {...post} />
                  ))}
                </div>
                <Link href="/blog" className="border border-[#e5e7eb] flex h-[48px] items-center justify-center w-full no-underline">
                  <p className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[16px] text-[#35383b]">
                    ดูเพิ่มเติม
                  </p>
                </Link>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  )
}
