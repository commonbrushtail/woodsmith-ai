import AdminHeader from '../../../../components/admin/AdminHeader'

export default function DashboardPage() {
  return (
    <div>
      <AdminHeader
        title="จัดการเว็บไซต์/ Manage Website"
      />
      <div className="mt-[24px] bg-[#f3f4f6] rounded-[12px] min-h-[400px] flex items-center justify-center">
        <p className="font-['IBM_Plex_Sans_Thai'] text-[16px] text-[#9ca3af]">
          Dashboard content will be added here
        </p>
      </div>
    </div>
  )
}
