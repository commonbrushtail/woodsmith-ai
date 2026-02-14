import AdminSidebar from '../../../components/admin/AdminSidebar'
import ErrorBoundary from '../../../components/ErrorBoundary'

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen w-full bg-white overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto px-[32px] py-[20px]">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </main>
    </div>
  )
}
