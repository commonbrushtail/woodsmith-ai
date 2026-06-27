// Preview adapter for site settings. Renders the public FooterView (the most
// representative single surface for these values) with live form state.
const siteSettingsAdapter = {
  entity: 'site-settings',
  device: 'section',
  defaultViewport: 'desktop',
  component: () => import('@/components/FooterView'),

  toProps(state = {}) {
    return {
      settings: {
        company_name: state.companyName || '',
        company_address: state.companyAddress || '',
        phone_number: state.phoneNumber || '',
        line_id: state.lineId || '',
        copyright_text: state.copyrightText || '',
        facebook_url: state.facebookUrl || '',
        instagram_url: state.instagramUrl || '',
        tiktok_url: state.tiktokUrl || '',
        line_url: state.lineUrl || '',
      },
    }
  },
}

export default siteSettingsAdapter
