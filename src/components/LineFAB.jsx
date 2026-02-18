import imgLineLogo from '../assets/ee74c0d8544a46ac6f3c6d2eb640b43d65efe886.svg'
import { getSiteSettings } from '../lib/data/public'

export default async function LineFAB() {
  const { data: settings } = await getSiteSettings()
  const lineUrl = settings?.line_url

  // Don't render if no LINE URL is configured
  if (!lineUrl) {
    return null
  }

  return (
    <a
      href={lineUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed right-[24px] bottom-[24px] z-50 size-[48px] hover:scale-110 transition-transform"
    >
      <img alt="LINE" className="block max-w-none size-full" src={imgLineLogo} />
    </a>
  )
}
