'use client'

import { useState } from 'react'
import imgHqPhoto from '../../../assets/branch_hq_photo.png'
import imgWsmLogo from '../../../assets/logo_wsm_express.svg'
import imgSearch from '../../../assets/icon_search.svg'
import imgLineLogo from '../../../assets/line_logo_green.svg'

const regionTabs = [
  { key: 'all', label: 'ทุกภูมิภาค' },
  { key: 'central', label: 'ภาคกลาง' },
  { key: 'east', label: 'ภาคตะวันออก' },
  { key: 'north', label: 'ภาคเหนือ' },
  { key: 'northeast', label: 'ภาคตะวันออกเฉียงเหนือ' },
  { key: 'south', label: 'ภาคใต้' },
]

const fallbackBranches = [
  { region: 'ภาคกลาง', name: 'สาขาถนนรัตนธิเบศร์', address: 'เลขที่ 2/1 ถนน วงศ์สว่าง แขวงวงศ์สว่าง เขตบางซื่อ กรุงเทพฯ 10800', phone: '0 2587 9700-1', hours: 'ทุกวัน 08:00 น. - 19:00 น.' },
  { region: 'ภาคกลาง', name: 'สาขาถนนรัตนธิเบศร์', address: 'เลขที่ 2/1 ถนน วงศ์สว่าง แขวงวงศ์สว่าง เขตบางซื่อ กรุงเทพฯ 10800', phone: '0 2587 9700-1', hours: 'ทุกวัน 08:00 น. - 19:00 น.' },
  { region: 'ภาคกลาง', name: 'สาขาถนนรัตนธิเบศร์', address: 'เลขที่ 2/1 ถนน วงศ์สว่าง แขวงวงศ์สว่าง เขตบางซื่อ กรุงเทพฯ 10800', phone: '0 2587 9700-1', hours: 'ทุกวัน 08:00 น. - 19:00 น.' },
  { region: 'ภาคกลาง', name: 'สาขาถนนรัตนธิเบศร์', address: 'เลขที่ 2/1 ถนน วงศ์สว่าง แขวงวงศ์สว่าง เขตบางซื่อ กรุงเทพฯ 10800', phone: '0 2587 9700-1', hours: 'ทุกวัน 08:00 น. - 19:00 น.' },
  { region: 'ภาคกลาง', name: 'สาขาถนนรัตนธิเบศร์', address: 'เลขที่ 2/1 ถนน วงศ์สว่าง แขวงวงศ์สว่าง เขตบางซื่อ กรุงเทพฯ 10800', phone: '0 2587 9700-1', hours: 'ทุกวัน 08:00 น. - 19:00 น.' },
]

function BranchInfo({ label, value, bold }) {
  return (
    <p className="font-['IBM_Plex_Sans_Thai'] text-[15px] text-black leading-[1.2]">
      <span className="font-semibold">{label}</span>
      <span>{bold ? '' : ': '}</span>
      {bold
        ? <span className="font-bold">{value}</span>
        : <span>{value}</span>
      }
    </p>
  )
}

function HqCard() {
  return (
    <div className="bg-[#fff6ef] lg:bg-white flex flex-col lg:flex-row gap-[24px] items-center lg:items-start p-[20px] lg:p-0 w-full">
      <div className="h-[213px] lg:h-[218px] lg:w-[358px] lg:shrink-0 relative w-full overflow-hidden rounded-[4px]">
        <img alt="สำนักงานใหญ่" className="absolute max-w-none object-cover size-full" src={imgHqPhoto} />
      </div>
      <div className="flex flex-col gap-[16px] items-start w-full lg:w-[500px]">
        <div className="flex flex-col items-start text-black w-full">
          <p className="font-['IBM_Plex_Sans_Thai'] font-medium text-[15px] leading-[1.2]">สำนักงานใหญ่</p>
          <p className="font-['IBM_Plex_Sans_Thai'] font-bold text-[32px] leading-[1.5] w-full">
            บริษัท วนชัย วู้ดสมิธ จำกัด
          </p>
        </div>
        <div className="flex flex-col gap-[12px] items-start w-full">
          <BranchInfo label="ที่อยู่" value="เลขที่ 2/1 ถนน วงศ์สว่าง แขวงวงศ์สว่าง เขตบางซื่อ กรุงเทพฯ 10800" />
          <p className="font-['IBM_Plex_Sans_Thai'] font-medium text-[15px] text-black leading-[1.2]">
            โทร. <span className="font-bold">0 2587 9700-1</span>
          </p>
          <BranchInfo label="เวลาทำการ" value="ทุกวัน 08:00 น. - 19:00 น." />
        </div>
        <button className="bg-orange flex h-[42px] items-center justify-center w-full">
          <p className="font-['Circular_Std'] font-medium text-[16px] text-white leading-[1.5]">เปิดดูแผนที่</p>
        </button>
      </div>
    </div>
  )
}

function CardBranch({ region, name, address, phone, hours, line_url }) {
  return (
    <div className="bg-white flex flex-col lg:flex-row gap-[12px] lg:gap-[24px] items-start px-[20px] lg:px-0 w-full">
      <div className="lg:hidden flex flex-col gap-[12px] items-start w-full">
        <div className="h-[97px] w-[159px] relative overflow-hidden rounded-[4px]">
          <div className="absolute inset-0 bg-orange" />
          <img alt="WoodSmith Express" className="absolute top-[35px] left-[35px] w-[95px] h-[27px]" src={imgWsmLogo} />
        </div>
        <div className="flex flex-col items-start text-black w-full">
          <p className="font-['IBM_Plex_Sans_Thai'] font-medium text-[13px] leading-[1.2]">{region}</p>
          <p className="font-['IBM_Plex_Sans_Thai'] font-bold text-[20px] leading-[1.5] w-full">{name}</p>
        </div>
      </div>
      <div className="hidden lg:block h-[218px] w-[358px] shrink-0 relative overflow-hidden rounded-[4px]">
        <div className="absolute inset-0 bg-orange" />
        <img alt="WoodSmith Express" className="absolute top-[88px] left-[104px] w-[150px] h-[42px]" src={imgWsmLogo} />
      </div>
      <div className="flex flex-col gap-[16px] items-start w-full lg:w-[500px]">
        <div className="hidden lg:flex flex-col items-start text-black w-full">
          <p className="font-['IBM_Plex_Sans_Thai'] font-medium text-[15px] leading-[1.2]">{region}</p>
          <p className="font-['IBM_Plex_Sans_Thai'] font-bold text-[32px] leading-[1.5] w-full">{name}</p>
        </div>
        <div className="flex flex-col gap-[12px] items-start w-full">
          <BranchInfo label="ที่อยู่" value={address} />
          <p className="font-['IBM_Plex_Sans_Thai'] font-medium text-[15px] text-black leading-[1.2]">
            โทร. <span className="font-bold">{phone}</span>
          </p>
          <BranchInfo label="เวลาทำการ" value={hours} />
        </div>
        <div className="flex gap-[8px] h-[42px] items-center w-full">
          <button className="bg-orange flex w-1/2 h-full items-center justify-center">
            <p className="font-['Circular_Std'] font-medium text-[16px] text-white leading-[1.5]">เปิดดูแผนที่</p>
          </button>
          {line_url && (
            <a href={line_url} target="_blank" rel="noopener noreferrer" className="bg-white border border-grey flex flex-1 gap-[6px] h-full items-center justify-center no-underline">
              <p className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[15px] text-black leading-[24px]">แอดไลน์</p>
              <img alt="LINE" className="size-[24px]" src={imgLineLogo} />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default function BranchesPageClient({ branches: dbBranches = [] }) {
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const branches = dbBranches.length > 0 ? dbBranches : fallbackBranches

  const filteredBranches = branches.filter(b => {
    const matchesRegion = activeTab === 'all' || b.region === regionTabs.find(t => t.key === activeTab)?.label
    if (!matchesRegion) return false
    if (!searchQuery.trim()) return true
    const q = searchQuery.trim().toLowerCase()
    return [b.name, b.address, b.phone, b.region].some(field => field && field.toLowerCase().includes(q))
  })

  return (
    <div className="flex flex-col items-start lg:items-center w-full">
      <div className="w-full lg:max-w-[882px] lg:mx-auto lg:py-[40px]">
        <HqCard />
      </div>

      <div className="px-[20px] py-[16px] lg:pt-[40px] lg:pb-[32px] w-full lg:max-w-[660px] lg:mx-auto">
        <div className="border border-[#e5e7eb] rounded-full flex gap-[7px] items-center px-[20px] lg:px-[16px] py-[6px] lg:py-[15px] w-full">
          <img alt="" className="size-[20px] shrink-0" src={imgSearch} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาชื่อสาขา จังหวัด หรือ รหัสไปรษณีย์..."
            className="font-['IBM_Plex_Sans_Thai'] font-medium text-[15px] lg:text-[18px] tracking-[0.075px] lg:tracking-[0.09px] leading-[20px] text-black placeholder:text-[#c3c3c3] outline-none border-none bg-transparent w-full"
          />
        </div>
      </div>

      <div className="flex gap-[32px] items-start px-[20px] w-full lg:max-w-[882px] lg:mx-auto lg:justify-center overflow-x-auto lg:overflow-visible scrollbar-hide">
        {regionTabs.map((tab) => (
          <button key={tab.key} className="flex flex-col gap-px items-start shrink-0 cursor-pointer" onClick={() => setActiveTab(tab.key)}>
            <p className={`font-['IBM_Plex_Sans_Thai'] font-semibold text-[16px] whitespace-nowrap ${activeTab === tab.key ? 'text-orange' : 'text-black'}`}>
              {tab.label}
            </p>
            {activeTab === tab.key && <div className="bg-orange h-[2px] w-full" />}
          </button>
        ))}
      </div>

      <div className="px-[20px] py-[16px] lg:py-[32px] w-full">
        <p className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[16px] lg:text-[20px] text-black lg:text-center">
          ทั้งหมด <span className="text-orange">{filteredBranches.length}</span> สาขา
        </p>
      </div>

      <div className="flex flex-col gap-[36px] lg:gap-[32px] items-start w-full lg:max-w-[882px] lg:mx-auto mb-[100px]">
        {filteredBranches.map((branch, i) => (
          <CardBranch key={branch.id || i} {...branch} />
        ))}
      </div>

      {filteredBranches.length > 10 && (
        <div className="flex flex-col gap-[12px] items-center px-[20px] py-[36px] w-full lg:max-w-[882px] lg:mx-auto">
          <button className="border border-[#e5e7eb] flex h-[48px] items-center justify-center w-full">
            <p className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[16px] text-black">ดูสาขาทั้งหมด</p>
          </button>
        </div>
      )}
    </div>
  )
}
