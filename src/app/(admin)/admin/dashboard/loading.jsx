import { CardSkeleton } from '../../../../components/admin/AdminSkeleton'

export default function Loading() {
  return (
    <div>
      <div className="mb-[24px]">
        <div className="h-[28px] w-[140px] bg-[#e5e7eb] rounded animate-pulse" />
      </div>
      {/* Stats cards row */}
      <div className="grid grid-cols-4 gap-[16px] mb-[32px]">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-[100px] bg-[#f3f4f6] rounded-[12px] animate-pulse" />
        ))}
      </div>
      {/* Chart/table area */}
      <CardSkeleton count={2} />
    </div>
  )
}
