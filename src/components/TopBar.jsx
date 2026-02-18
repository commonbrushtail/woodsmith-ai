import imgGroup4 from '../assets/de8b631b47915bbe74253cce2d2d87de9e9ae70b.svg'
import imgGroup5 from '../assets/1892e4cf5e8b5b93b264bc3d9767d1c207786f42.svg'
import imgGroup6 from '../assets/00f5a2cd414cae24b88a3ba91819a002fe1957d2.svg'
import imgGroup7 from '../assets/8b366611d662d405e11285343990128f67fd962d.svg'
import imgLineLogo2 from '../assets/60920d563a7a8d872085e3562a9946ce5209b1d1.svg'
import { getSiteSettings } from '../lib/data/public'

const defaultSettings = {
  phone_number: '0 2587 9700-1',
  line_id: '@vanachai.woodsmith',
  facebook_url: '',
  instagram_url: '',
  tiktok_url: '',
  line_url: '',
}

export default async function TopBar() {
  const { data: settings } = await getSiteSettings()
  const siteSettings = settings || defaultSettings

  return (
    <div className="hidden lg:block bg-orange py-[6px] w-full">
      <div className="max-w-[1212px] mx-auto w-full flex items-center justify-between px-[16px]">
        <div className="flex gap-[8px] items-center w-[300px]">
          <div className="overflow-clip shrink-0 size-[16px]">
            <img alt="" className="block max-w-none size-full" src={imgGroup4} />
          </div>
          <p className="font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] text-white">
            Call Center {siteSettings.phone_number}
          </p>
        </div>
        {(siteSettings.facebook_url || siteSettings.instagram_url || siteSettings.tiktok_url || siteSettings.line_url) && (
          <div className="flex items-center justify-end overflow-clip">
            <div className="flex gap-[12px] items-center">
              <p className="font-['IBM_Plex_Sans_Thai'] font-medium text-[15px] text-white">
                ติดตามเรา: {siteSettings.line_id?.replace('@', '') || 'vanachai.woodsmith'}
              </p>
              {siteSettings.facebook_url && (
                <a href={siteSettings.facebook_url} target="_blank" rel="noopener noreferrer">
                  <img alt="Facebook" className="shrink-0 size-[22px]" src={imgGroup5} />
                </a>
              )}
              {siteSettings.instagram_url && (
                <a href={siteSettings.instagram_url} target="_blank" rel="noopener noreferrer">
                  <img alt="Instagram" className="shrink-0 size-[22px]" src={imgGroup6} />
                </a>
              )}
              {siteSettings.tiktok_url && (
                <a href={siteSettings.tiktok_url} target="_blank" rel="noopener noreferrer">
                  <img alt="TikTok" className="shrink-0 size-[22px]" src={imgGroup7} />
                </a>
              )}
              {siteSettings.line_url && (
                <a href={siteSettings.line_url} target="_blank" rel="noopener noreferrer">
                  <img alt="LINE" className="shrink-0 size-[22px]" src={imgLineLogo2} />
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
