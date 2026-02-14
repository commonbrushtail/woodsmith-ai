export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="w-full">
      {/* Header row */}
      <div className="flex gap-[16px] px-[16px] py-[12px] border-b border-[#e5e7eb]">
        {[1, 2, 3, 4].map((col) => (
          <div
            key={col}
            className="h-[16px] bg-[#e5e7eb] rounded animate-pulse"
            style={{ width: `${15 + col * 5}%` }}
          />
        ))}
      </div>
      {/* Body rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          data-testid="skeleton-row"
          className="flex gap-[16px] px-[16px] py-[14px] border-b border-[#f3f4f6]"
        >
          {[1, 2, 3, 4].map((col) => (
            <div
              key={col}
              className="h-[14px] bg-[#f3f4f6] rounded animate-pulse"
              style={{ width: `${15 + col * 5}%` }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export function FormSkeleton({ fields = 6 }) {
  return (
    <div className="w-full flex flex-col gap-[20px]">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} data-testid="skeleton-field" className="flex flex-col gap-[8px]">
          <div className="h-[14px] w-[120px] bg-[#e5e7eb] rounded animate-pulse" />
          <div className="h-[40px] w-full bg-[#f3f4f6] rounded-[8px] animate-pulse" />
        </div>
      ))}
      {/* Submit button */}
      <div className="h-[44px] w-[140px] bg-[#e5e7eb] rounded-[8px] animate-pulse mt-[8px]" />
    </div>
  )
}

export function CardSkeleton({ count = 1 }) {
  return (
    <div className="flex flex-wrap gap-[16px]">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          data-testid="skeleton-card"
          className="w-[280px] rounded-[12px] border border-[#e5e7eb] overflow-hidden"
        >
          <div className="h-[160px] bg-[#f3f4f6] animate-pulse" />
          <div className="p-[16px] flex flex-col gap-[10px]">
            <div className="h-[16px] w-[70%] bg-[#e5e7eb] rounded animate-pulse" />
            <div className="h-[12px] w-[50%] bg-[#f3f4f6] rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  )
}
