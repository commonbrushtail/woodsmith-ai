import imgRectangle38 from '../assets/a95471a3a128e488d696bd58ef944e6616e0e70f.png'

function getYoutubeVideoId(url) {
  if (!url) return null
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/)
  return match ? match[1] : null
}

function YoutubeCard({ title, youtubeUrl }) {
  const videoId = getYoutubeVideoId(youtubeUrl)
  if (!videoId) return null

  return (
    <div className="flex flex-col gap-[10px] items-start w-full lg:w-[387px]">
      <div className="aspect-video relative w-full overflow-hidden">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title}
          className="absolute w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <div className="w-full">
        <p className="font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] lg:text-[16px] text-white overflow-hidden text-ellipsis leading-[20px] lg:leading-[22px]">
          {title}
        </p>
      </div>
    </div>
  )
}

export default function HighlightSection({ highlights = [] }) {
  const cards = highlights
    .filter(h => getYoutubeVideoId(h.youtube_url))
    .map(h => ({
      title: h.title,
      youtubeUrl: h.youtube_url,
    }))

  if (cards.length === 0) return null

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
            {cards.map((card, i) => (
              <YoutubeCard key={i} {...card} />
            ))}
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
