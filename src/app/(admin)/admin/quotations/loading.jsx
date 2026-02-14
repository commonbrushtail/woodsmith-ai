import { TableSkeleton } from '../../../../components/admin/AdminSkeleton'

export default function Loading() {
  return (
    <div>
      <div className="flex items-center justify-between mb-[24px]">
        <div className="h-[28px] w-[140px] bg-[#e5e7eb] rounded animate-pulse" />
      </div>
      <div className="flex gap-[12px] mb-[16px]">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-[36px] w-[80px] bg-[#f3f4f6] rounded-[8px] animate-pulse" />
        ))}
      </div>
      <TableSkeleton rows={8} />
    </div>
  )
}
