import { sanitizeHtml } from '@/lib/sanitize-html'

// Public titles for the legal pages, shared by the pages and the preview adapter
// so the live preview shows the same heading as production.
export const LEGAL_TITLES = {
  terms: 'ข้อกำหนดและเงื่อนไขการใช้งาน',
  privacy: 'นโยบายความเป็นส่วนตัว',
  cookies: 'นโยบายคุกกี้',
}

/**
 * Shared renderer for the legal pages (terms/privacy/cookies). Used by the
 * public pages AND the admin preview adapter so preview === production.
 *
 * @param {{ title: string, content?: string|null, updatedAt?: string|null }} props
 */
export default function LegalContentView({ title, content, updatedAt = null }) {
  return (
    <div className="min-h-[60vh] py-[60px] px-[20px]">
      <div className="max-w-[800px] mx-auto">
        <h1 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[28px] lg:text-[32px] text-black leading-[1.3] m-0">
          {title}
        </h1>
        {updatedAt && (
          <p className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-grey mt-[8px] mb-[40px]">
            อัปเดตล่าสุด: {new Date(updatedAt).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        )}

        {content ? (
          <div
            className="font-['IBM_Plex_Sans_Thai'] text-[14px] lg:text-[15px] text-black leading-[1.8] [&_h2]:font-semibold [&_h2]:text-[18px] lg:[&_h2]:text-[20px] [&_h2]:mt-[32px] [&_h2]:mb-[12px] [&_ul]:list-disc [&_ul]:pl-[24px] [&_ul]:mt-[8px] [&_ol]:list-decimal [&_ol]:pl-[24px] [&_ol]:mt-[8px] [&_li]:mb-[4px] [&_p]:mb-[8px]"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
          />
        ) : (
          <p className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-grey">
            เนื้อหากำลังจัดทำ กรุณากลับมาใหม่ภายหลัง
          </p>
        )}
      </div>
    </div>
  )
}
