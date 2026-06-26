import { sanitizeHtml } from '@/lib/sanitize-html'

/**
 * The dynamic "About" content section (heading + rich text), shared by the
 * public about page and the admin preview adapter so preview === production.
 * Content is sanitized with the project's allowlist sanitizer.
 *
 * @param {{ html?: string|null }} props
 */
export default function AboutContentView({ html }) {
  return (
    <div className="flex flex-col gap-[12px] items-center text-center text-black px-[20px] lg:px-[16px] pb-[60px]">
      <div className="max-w-[1212px] mx-auto w-full flex flex-col gap-[12px]">
        <p className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[40px] tracking-[0.25px] leading-[1.3]">
          เกี่ยวกับเรา
        </p>
        <div
          className="rich-text font-['IBM_Plex_Sans_Thai'] text-[16px] lg:text-[20px] leading-normal [&_p]:mb-4 [&_p:last-child]:mb-0"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(html || '') }}
        />
      </div>
    </div>
  )
}
