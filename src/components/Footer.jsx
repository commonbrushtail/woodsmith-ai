import { getSiteSettings } from '../lib/data/public'
import FooterView, { defaultFooterSettings } from './FooterView'

export default async function Footer() {
  const { data: settings } = await getSiteSettings()
  return <FooterView settings={settings || defaultFooterSettings} />
}
