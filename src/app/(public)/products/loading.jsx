export default function Loading() {
  return (
    <div className="max-w-[1212px] mx-auto px-[16px] py-[40px]">
      <div className="h-[32px] w-[180px] bg-[#e5e7eb] rounded animate-pulse mb-[24px]" />
      <div className="flex gap-[12px] mb-[32px]">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-[36px] w-[90px] bg-[#f3f4f6] rounded-full animate-pulse" />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[20px]">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-[12px] border border-[#e5e7eb] overflow-hidden">
            <div className="h-[200px] bg-[#f3f4f6] animate-pulse" />
            <div className="p-[16px] flex flex-col gap-[10px]">
              <div className="h-[16px] w-[70%] bg-[#e5e7eb] rounded animate-pulse" />
              <div className="h-[14px] w-[40%] bg-[#f3f4f6] rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
