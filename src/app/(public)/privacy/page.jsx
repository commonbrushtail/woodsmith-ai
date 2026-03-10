import { getLegalPage } from '@/lib/data/public'
import { sanitizeHtml } from '@/lib/sanitize-html'

export const metadata = {
  title: 'นโยบายความเป็นส่วนตัว | WoodSmith',
}

export default async function PrivacyPolicyPage() {
  const { data } = await getLegalPage('privacy')

  return (
    <div className="min-h-[60vh] py-[60px] px-[20px]">
      <div className="max-w-[800px] mx-auto">
        <h1 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[28px] lg:text-[32px] text-black leading-[1.3] m-0">
          นโยบายความเป็นส่วนตัว
        </h1>
        {data?.updated_at && (
          <p className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-grey mt-[8px] mb-[40px]">
            อัปเดตล่าสุด: {new Date(data.updated_at).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        )}

        {data?.content ? (
          <div
            className="font-['IBM_Plex_Sans_Thai'] text-[14px] lg:text-[15px] text-black leading-[1.8] [&_h2]:font-semibold [&_h2]:text-[18px] lg:[&_h2]:text-[20px] [&_h2]:mt-[32px] [&_h2]:mb-[12px] [&_ul]:list-disc [&_ul]:pl-[24px] [&_ul]:mt-[8px] [&_ol]:list-decimal [&_ol]:pl-[24px] [&_ol]:mt-[8px] [&_li]:mb-[4px] [&_p]:mb-[8px]"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(data.content) }}
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
