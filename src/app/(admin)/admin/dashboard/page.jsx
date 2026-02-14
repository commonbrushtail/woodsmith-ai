import AdminHeader from '../../../../components/admin/AdminHeader'
import { getDashboardStats } from '@/lib/actions/dashboard'

export default async function DashboardPage() {
  const stats = await getDashboardStats()

  const cards = [
    { label: 'สินค้าทั้งหมด', value: stats.totalProducts, icon: 'product' },
    { label: 'แบนเนอร์ทั้งหมด', value: stats.totalBanners, icon: 'banner' },
    { label: 'บทความทั้งหมด', value: stats.totalBlogPosts, icon: 'blog' },
    { label: 'ใบเสนอราคาทั้งหมด', value: stats.totalQuotations, icon: 'quotation' },
    { label: 'ใบเสนอราคารอดำเนินการ', value: stats.pendingQuotations, icon: 'pending' },
  ]

  return (
    <div>
      <AdminHeader title="จัดการเว็บไซต์/ Manage Website" />

      <div className="mt-[24px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[16px]">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-[12px] border border-[#e5e7eb] p-[24px] flex flex-col gap-[8px]"
          >
            <span className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#6b7280]">
              {card.label}
            </span>
            <span className="font-['IBM_Plex_Sans_Thai'] font-bold text-[28px] text-[#1f2937]">
              {card.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
