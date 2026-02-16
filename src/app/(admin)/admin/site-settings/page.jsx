'use client'

import { useState, useEffect, useTransition } from 'react'
import { getSiteSettings, updateSiteSettings } from '@/lib/actions/site-settings'
import { useToast } from '@/lib/toast-context'

/* ------------------------------------------------------------------ */
/*  SVG icon helpers                                                   */
/* ------------------------------------------------------------------ */

function ChevronDownIcon({ size = 12, color = '#6b7280' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 4.5L6 7.5L9 4.5" />
    </svg>
  )
}

function DotsIcon({ size = 18, color = '#6b7280' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="19" r="1" />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  Main page component                                                */
/* ------------------------------------------------------------------ */

export default function SiteSettingsPage() {
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [loading, setLoading] = useState(true)

  // Company Information
  const [companyName, setCompanyName] = useState('')
  const [companyAddress, setCompanyAddress] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')

  // Social Media
  const [lineId, setLineId] = useState('')
  const [facebookUrl, setFacebookUrl] = useState('')
  const [instagramUrl, setInstagramUrl] = useState('')
  const [tiktokUrl, setTiktokUrl] = useState('')
  const [lineUrl, setLineUrl] = useState('')

  // Footer
  const [copyrightText, setCopyrightText] = useState('')

  // Statistics
  const [statBranches, setStatBranches] = useState('')
  const [statProducts, setStatProducts] = useState('')
  const [statCustomers, setStatCustomers] = useState('')

  useEffect(() => {
    console.log('🔄 Loading site settings...')
    getSiteSettings().then(({ data, error }) => {
      console.log('📥 Loaded from database:', data)
      if (data) {
        setCompanyName(data.company_name || '')
        setCompanyAddress(data.company_address || '')
        setPhoneNumber(data.phone_number || '')
        setLineId(data.line_id || '')
        setFacebookUrl(data.facebook_url || '')
        setInstagramUrl(data.instagram_url || '')
        setTiktokUrl(data.tiktok_url || '')
        setLineUrl(data.line_url || '')
        setCopyrightText(data.copyright_text || '')
        setStatBranches(data.stat_branches || '')
        setStatProducts(data.stat_products || '')
        setStatCustomers(data.stat_customers || '')
        console.log('✅ Form fields populated')
      }
      if (error) {
        console.error('❌ Load error:', error)
        toast.error('เกิดข้อผิดพลาด: ' + error)
      }
      setLoading(false)
    })
  }, [toast])

  const handleSubmit = () => {
    startTransition(async () => {
      const formData = new FormData()
      formData.set('company_name', companyName)
      formData.set('company_address', companyAddress)
      formData.set('phone_number', phoneNumber)
      formData.set('line_id', lineId)
      formData.set('facebook_url', facebookUrl)
      formData.set('instagram_url', instagramUrl)
      formData.set('tiktok_url', tiktokUrl)
      formData.set('line_url', lineUrl)
      formData.set('copyright_text', copyrightText)
      formData.set('stat_branches', statBranches)
      formData.set('stat_products', statProducts)
      formData.set('stat_customers', statCustomers)

      // Log what we're sending
      console.log('📤 Submitting data:', {
        companyName,
        companyAddress,
        phoneNumber,
        lineId,
        facebookUrl,
        instagramUrl,
        tiktokUrl,
        lineUrl,
        copyrightText,
        statBranches,
        statProducts,
        statCustomers
      })

      const result = await updateSiteSettings(formData)

      console.log('📥 Server response:', result)

      if (result.error) {
        console.error('❌ Save failed:', result.error)
        toast.error('เกิดข้อผิดพลาด: ' + result.error)
      } else {
        console.log('✅ Save successful, returned data:', result.data)
        toast.success('บันทึกการตั้งค่าเรียบร้อยแล้ว')
      }
    })
  }

  return (
    <div className={`flex flex-col gap-0 h-full min-h-0 ${isPending || loading ? 'opacity-60 pointer-events-none' : ''}`}>
      {/* ================================================================ */}
      {/*  Header                                                          */}
      {/* ================================================================ */}
      <div className="flex items-center justify-between py-[12px]">
        {/* Left: title */}
        <div className="flex items-center gap-[12px]">
          <h1 className="font-['IBM_Plex_Sans_Thai'] font-bold text-[22px] text-[#1f2937] m-0">
            ตั้งค่าเว็บไซต์ (Site Settings)
          </h1>
        </div>

        {/* Right: locale dropdown + 3-dot menu */}
        <div className="flex items-center gap-[8px]">
          <div className="flex items-center gap-[8px] border border-[#e5e7eb] rounded-[8px] px-[12px] py-[6px] cursor-pointer hover:bg-[#f9fafb]">
            <span className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#4b5563]">Thai (th)</span>
            <ChevronDownIcon />
          </div>
          <button
            type="button"
            className="size-[32px] flex items-center justify-center rounded-[8px] hover:bg-gray-100 cursor-pointer bg-transparent border-0"
            aria-label="More options"
          >
            <DotsIcon size={18} />
          </button>
        </div>
      </div>

      {/* ================================================================ */}
      {/*  Content body                                                    */}
      {/* ================================================================ */}
      <div className="flex gap-[24px] mt-[20px] flex-1 min-h-0 overflow-y-auto pb-[32px]">
        {/* ---- Main form area ---- */}
        <div className="flex-1 flex flex-col gap-[24px] min-w-0">

          {/* ---------------------------------------------------------- */}
          {/*  Section: Company Information                                */}
          {/* ---------------------------------------------------------- */}
          <div className="flex flex-col gap-[16px]">
            <h2 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[16px] text-[#1f2937] m-0">
              ข้อมูลบริษัท (Company Information)
            </h2>

            {/* Company Name */}
            <section className="bg-white rounded-[12px] border border-[#e8eaef] p-[24px] flex flex-col gap-[8px]">
              <label htmlFor="companyName" className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
                ชื่อบริษัท (Company Name) <span className="text-red-500">*</span>
              </label>
              <input
                id="companyName"
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="กรอกชื่อบริษัท"
                className="w-full font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border border-[#e8eaef] rounded-[8px] px-[14px] py-[10px] outline-none focus:border-[#ff7e1b] focus:ring-1 focus:ring-[#ff7e1b]/20 transition-all placeholder:text-[#bfbfbf] bg-white"
              />
            </section>

            {/* Company Address */}
            <section className="bg-white rounded-[12px] border border-[#e8eaef] p-[24px] flex flex-col gap-[8px]">
              <label htmlFor="companyAddress" className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
                ที่อยู่บริษัท (Company Address) <span className="text-red-500">*</span>
              </label>
              <textarea
                id="companyAddress"
                value={companyAddress}
                onChange={(e) => setCompanyAddress(e.target.value)}
                placeholder="กรอกที่อยู่บริษัท"
                rows={3}
                className="w-full font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border border-[#e8eaef] rounded-[8px] px-[14px] py-[10px] outline-none focus:border-[#ff7e1b] focus:ring-1 focus:ring-[#ff7e1b]/20 transition-all placeholder:text-[#bfbfbf] bg-white resize-none"
              />
            </section>

            {/* Phone Number */}
            <section className="bg-white rounded-[12px] border border-[#e8eaef] p-[24px] flex flex-col gap-[8px]">
              <label htmlFor="phoneNumber" className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
                เบอร์โทรศัพท์ (Phone Number) <span className="text-red-500">*</span>
              </label>
              <input
                id="phoneNumber"
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="กรอกเบอร์โทรศัพท์"
                className="w-full font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border border-[#e8eaef] rounded-[8px] px-[14px] py-[10px] outline-none focus:border-[#ff7e1b] focus:ring-1 focus:ring-[#ff7e1b]/20 transition-all placeholder:text-[#bfbfbf] bg-white"
              />
            </section>
          </div>

          {/* ---------------------------------------------------------- */}
          {/*  Section: Social Media                                       */}
          {/* ---------------------------------------------------------- */}
          <div className="flex flex-col gap-[16px]">
            <h2 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[16px] text-[#1f2937] m-0">
              โซเชียลมีเดีย (Social Media)
            </h2>

            {/* LINE ID */}
            <section className="bg-white rounded-[12px] border border-[#e8eaef] p-[24px] flex flex-col gap-[8px]">
              <label htmlFor="lineId" className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
                LINE ID
              </label>
              <input
                id="lineId"
                type="text"
                value={lineId}
                onChange={(e) => setLineId(e.target.value)}
                placeholder="@example"
                className="w-full font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border border-[#e8eaef] rounded-[8px] px-[14px] py-[10px] outline-none focus:border-[#ff7e1b] focus:ring-1 focus:ring-[#ff7e1b]/20 transition-all placeholder:text-[#bfbfbf] bg-white"
              />
            </section>

            {/* Facebook URL */}
            <section className="bg-white rounded-[12px] border border-[#e8eaef] p-[24px] flex flex-col gap-[8px]">
              <label htmlFor="facebookUrl" className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
                Facebook URL
              </label>
              <input
                id="facebookUrl"
                type="url"
                value={facebookUrl}
                onChange={(e) => setFacebookUrl(e.target.value)}
                placeholder="https://facebook.com/yourpage"
                className="w-full font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border border-[#e8eaef] rounded-[8px] px-[14px] py-[10px] outline-none focus:border-[#ff7e1b] focus:ring-1 focus:ring-[#ff7e1b]/20 transition-all placeholder:text-[#bfbfbf] bg-white"
              />
            </section>

            {/* Instagram URL */}
            <section className="bg-white rounded-[12px] border border-[#e8eaef] p-[24px] flex flex-col gap-[8px]">
              <label htmlFor="instagramUrl" className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
                Instagram URL
              </label>
              <input
                id="instagramUrl"
                type="url"
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                placeholder="https://instagram.com/yourpage"
                className="w-full font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border border-[#e8eaef] rounded-[8px] px-[14px] py-[10px] outline-none focus:border-[#ff7e1b] focus:ring-1 focus:ring-[#ff7e1b]/20 transition-all placeholder:text-[#bfbfbf] bg-white"
              />
            </section>

            {/* TikTok URL */}
            <section className="bg-white rounded-[12px] border border-[#e8eaef] p-[24px] flex flex-col gap-[8px]">
              <label htmlFor="tiktokUrl" className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
                TikTok URL
              </label>
              <input
                id="tiktokUrl"
                type="url"
                value={tiktokUrl}
                onChange={(e) => setTiktokUrl(e.target.value)}
                placeholder="https://tiktok.com/@yourpage"
                className="w-full font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border border-[#e8eaef] rounded-[8px] px-[14px] py-[10px] outline-none focus:border-[#ff7e1b] focus:ring-1 focus:ring-[#ff7e1b]/20 transition-all placeholder:text-[#bfbfbf] bg-white"
              />
            </section>

            {/* LINE URL */}
            <section className="bg-white rounded-[12px] border border-[#e8eaef] p-[24px] flex flex-col gap-[8px]">
              <label htmlFor="lineUrl" className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
                LINE URL (Add Friend Link)
              </label>
              <input
                id="lineUrl"
                type="url"
                value={lineUrl}
                onChange={(e) => setLineUrl(e.target.value)}
                placeholder="https://line.me/ti/p/~yourlineid"
                className="w-full font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border border-[#e8eaef] rounded-[8px] px-[14px] py-[10px] outline-none focus:border-[#ff7e1b] focus:ring-1 focus:ring-[#ff7e1b]/20 transition-all placeholder:text-[#bfbfbf] bg-white"
              />
            </section>
          </div>

          {/* ---------------------------------------------------------- */}
          {/*  Section: Footer Settings                                    */}
          {/* ---------------------------------------------------------- */}
          <div className="flex flex-col gap-[16px]">
            <h2 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[16px] text-[#1f2937] m-0">
              การตั้งค่าส่วนท้าย (Footer Settings)
            </h2>

            {/* Copyright Text */}
            <section className="bg-white rounded-[12px] border border-[#e8eaef] p-[24px] flex flex-col gap-[8px]">
              <label htmlFor="copyrightText" className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
                ข้อความลิขสิทธิ์ (Copyright Text)
              </label>
              <input
                id="copyrightText"
                type="text"
                value={copyrightText}
                onChange={(e) => setCopyrightText(e.target.value)}
                placeholder="© 2019 @vanachai.woodsmith. All rights reserved."
                className="w-full font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border border-[#e8eaef] rounded-[8px] px-[14px] py-[10px] outline-none focus:border-[#ff7e1b] focus:ring-1 focus:ring-[#ff7e1b]/20 transition-all placeholder:text-[#bfbfbf] bg-white"
              />
            </section>
          </div>

          {/* ---------------------------------------------------------- */}
          {/*  Section: Statistics                                         */}
          {/* ---------------------------------------------------------- */}
          <div className="flex flex-col gap-[16px]">
            <h2 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[16px] text-[#1f2937] m-0">
              สถิติ (Statistics)
            </h2>

            {/* Branches */}
            <section className="bg-white rounded-[12px] border border-[#e8eaef] p-[24px] flex flex-col gap-[8px]">
              <label htmlFor="statBranches" className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
                จำนวนสาขา (Branches)
              </label>
              <input
                id="statBranches"
                type="text"
                value={statBranches}
                onChange={(e) => setStatBranches(e.target.value)}
                placeholder="97"
                className="w-full font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border border-[#e8eaef] rounded-[8px] px-[14px] py-[10px] outline-none focus:border-[#ff7e1b] focus:ring-1 focus:ring-[#ff7e1b]/20 transition-all placeholder:text-[#bfbfbf] bg-white"
              />
            </section>

            {/* Products */}
            <section className="bg-white rounded-[12px] border border-[#e8eaef] p-[24px] flex flex-col gap-[8px]">
              <label htmlFor="statProducts" className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
                จำนวนสินค้า (Products)
              </label>
              <input
                id="statProducts"
                type="text"
                value={statProducts}
                onChange={(e) => setStatProducts(e.target.value)}
                placeholder="20+"
                className="w-full font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border border-[#e8eaef] rounded-[8px] px-[14px] py-[10px] outline-none focus:border-[#ff7e1b] focus:ring-1 focus:ring-[#ff7e1b]/20 transition-all placeholder:text-[#bfbfbf] bg-white"
              />
            </section>

            {/* Customers */}
            <section className="bg-white rounded-[12px] border border-[#e8eaef] p-[24px] flex flex-col gap-[8px]">
              <label htmlFor="statCustomers" className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
                จำนวนลูกค้า (Customers)
              </label>
              <input
                id="statCustomers"
                type="text"
                value={statCustomers}
                onChange={(e) => setStatCustomers(e.target.value)}
                placeholder="10K+"
                className="w-full font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border border-[#e8eaef] rounded-[8px] px-[14px] py-[10px] outline-none focus:border-[#ff7e1b] focus:ring-1 focus:ring-[#ff7e1b]/20 transition-all placeholder:text-[#bfbfbf] bg-white"
              />
            </section>
          </div>
        </div>

        {/* ============================================================ */}
        {/*  Right sidebar - ENTRY panel                                  */}
        {/* ============================================================ */}
        <aside className="w-[260px] shrink-0 flex flex-col gap-[16px]">
          <div className="bg-white rounded-[12px] border border-[#e8eaef] p-[20px] flex flex-col gap-[16px]">
            <h3 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[12px] text-[#9ca3af] tracking-[0.8px] uppercase m-0">
              Entry
            </h3>

            {/* Save button */}
            <button
              type="button"
              onClick={() => handleSubmit()}
              disabled={isPending}
              className="w-full flex items-center justify-center px-[16px] py-[8px] rounded-[8px] bg-[#ff7e1b] text-white font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] border-0 cursor-pointer hover:bg-[#e86f15] transition-colors disabled:opacity-50"
            >
              {isPending ? 'กำลังบันทึก...' : 'บันทึก'}
            </button>
          </div>
        </aside>
      </div>
    </div>
  )
}
