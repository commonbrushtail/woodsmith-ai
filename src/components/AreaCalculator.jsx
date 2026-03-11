'use client'

import { useState } from 'react'

const DEFAULT_PATTERNS = [
  { label: 'ปูแบบก่ออิฐ', waste: 15 },
  { label: 'ปูแบบขั้นบันได', waste: 10 },
  { label: 'ปูแบบไหล', waste: 5 },
]

export default function AreaCalculator({ sizes = [], piecesPerBox, plankWidth, plankLength }) {
  // Support both new multi-size format and legacy single-size props
  const sizeOptions = sizes.length > 0
    ? sizes
    : (plankWidth && plankLength ? [{ label: '', pieces_per_box: piecesPerBox, plank_width: plankWidth, plank_length: plankLength }] : [])

  const [selectedIdx, setSelectedIdx] = useState(0)
  const [roomWidth, setRoomWidth] = useState('')
  const [roomLength, setRoomLength] = useState('')

  const current = sizeOptions[selectedIdx] || {}
  const pieces = current.pieces_per_box
  const pw = current.plank_width
  const pl = current.plank_length

  // Auto-calculate coverage: width(mm) × length(mm) × pieces / 1,000,000 = sqm
  const cov = (pw > 0 && pl > 0 && pieces > 0) ? (pw * pl * pieces) / 1_000_000 : 0

  const width = parseFloat(roomWidth)
  const length = parseFloat(roomLength)
  const hasInput = width > 0 && length > 0
  const hasCoverage = cov > 0

  const totalArea = hasInput ? width * length : 0

  // Use per-size patterns if available, otherwise defaults
  const patterns = (current.installation_patterns && current.installation_patterns.length > 0)
    ? current.installation_patterns
    : DEFAULT_PATTERNS

  const results = patterns.map(({ label, waste }) => {
    const areaWithWaste = totalArea * (1 + waste / 100)
    const boxes = hasCoverage ? Math.round(areaWithWaste / cov) : 0
    const totalPcs = pieces > 0 ? boxes * pieces : null
    return { label, waste, areaWithWaste, boxes, totalPcs }
  })

  return (
    <div className="bg-[#f8f3ea] rounded-[12px] p-[24px] flex flex-col gap-[20px]">
      <div className="flex items-center gap-[10px]">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff7e1b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <path d="M4 9h16M9 4v16" />
        </svg>
        <p className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[18px] text-black m-0">
          คำนวณจำนวนกล่องที่ต้องใช้สำหรับปูพื้น
        </p>
      </div>

      {/* Step 1: Size selector */}
      <div className="flex flex-col gap-[8px]">
        <div className="flex items-center gap-[8px]">
          <span className="font-['IBM_Plex_Sans_Thai'] font-bold text-[13px] text-orange bg-orange/10 rounded-full w-[22px] h-[22px] flex items-center justify-center shrink-0">1</span>
          <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] text-black">เลือกขนาด/แบบ</span>
        </div>
        {sizeOptions.length > 1 && (
          <div className="flex flex-wrap gap-[8px]">
            {sizeOptions.map((s, i) => (
              <button
                key={i}
                onClick={() => setSelectedIdx(i)}
                className={`font-['IBM_Plex_Sans_Thai'] text-[13px] px-[14px] py-[6px] rounded-full border transition-all ${
                  i === selectedIdx
                    ? 'bg-orange text-white border-orange'
                    : 'bg-white text-black border-[#e5e7eb] hover:border-orange/50'
                }`}
              >
                {s.label || `ขนาด ${i + 1}`}
              </button>
            ))}
          </div>
        )}
        <div className="flex flex-wrap gap-[16px]">
          {hasCoverage && (
            <span className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#6b7280]">
              พื้นที่ต่อกล่อง: <strong className="text-black">{cov.toFixed(2)} ตร.ม.</strong>
            </span>
          )}
          {pieces > 0 && (
            <span className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#6b7280]">
              จำนวนแผ่นต่อกล่อง: <strong className="text-black">{pieces} แผ่น</strong>
            </span>
          )}
          {pw > 0 && pl > 0 && (
            <span className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#6b7280]">
              ขนาดแผ่น: <strong className="text-black">{pw} x {pl} มม.</strong>
            </span>
          )}
        </div>
      </div>

      {/* Step 2: Room size inputs */}
      <div className="flex flex-col gap-[8px] mt-1">
        <div className="flex items-center gap-[8px]">
          <span className="font-['IBM_Plex_Sans_Thai'] font-bold text-[13px] text-orange bg-orange/10 rounded-full w-[22px] h-[22px] flex items-center justify-center shrink-0">2</span>
          <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] text-black">ใส่ขนาดของพื้นที่</span>
        </div>
        <div className="flex gap-[12px] items-end">
        <div className="flex-1 flex flex-col gap-[6px]">
          <label className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#6b7280]">ความกว้างห้อง (เมตร)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={roomWidth}
            onChange={(e) => setRoomWidth(e.target.value)}
            placeholder="เช่น 4.5"
            className="w-full font-['IBM_Plex_Sans_Thai'] text-[15px] text-black border border-[#e5e7eb] rounded-[8px] px-[14px] py-[10px] outline-none focus:border-orange focus:ring-1 focus:ring-orange/20 transition-all bg-white placeholder:text-[#bfbfbf]"
          />
        </div>
        <div className="font-['IBM_Plex_Sans_Thai'] text-[20px] text-[#6b7280] pb-[10px]">x</div>
        <div className="flex-1 flex flex-col gap-[6px]">
          <label className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#6b7280]">ความยาวห้อง (เมตร)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={roomLength}
            onChange={(e) => setRoomLength(e.target.value)}
            placeholder="เช่น 6.0"
            className="w-full font-['IBM_Plex_Sans_Thai'] text-[15px] text-black border border-[#e5e7eb] rounded-[8px] px-[14px] py-[10px] outline-none focus:border-orange focus:ring-1 focus:ring-orange/20 transition-all bg-white placeholder:text-[#bfbfbf]"
          />
        </div>
      </div>
      </div>

      {/* Results — installation patterns */}
      {hasInput && hasCoverage && (
        <div className="bg-white rounded-[8px] border border-[#e5e7eb] p-[20px] flex flex-col gap-[12px]">
          <div className="flex justify-between items-center">
            <span className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#6b7280]">พื้นที่ของคุณ</span>
            <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] text-black">{totalArea.toFixed(2)} ตร.ม.</span>
          </div>

          <div className="border-t border-[#e5e7eb] pt-[12px]">
            <p className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[14px] text-black m-0 mb-[10px]">จำนวนที่ต้องใช้ตามแบบการปู</p>
            <div className="flex flex-col gap-[8px]">
              {results.map((r) => (
                <div key={r.label} className="flex justify-between items-center bg-[#f8f3ea] rounded-[8px] px-[14px] py-[10px]">
                  <div className="flex flex-col">
                    <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] text-black">{r.label}</span>
                    <span className="font-['IBM_Plex_Sans_Thai'] text-[12px] text-[#6b7280]">เผื่อเศษ {r.waste}% — {r.areaWithWaste.toFixed(2)} ตร.ม.</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-['IBM_Plex_Sans_Thai'] font-bold text-[20px] text-orange">{r.boxes} <span className="text-[14px] font-medium">กล่อง</span></span>
                    {r.totalPcs !== null && (
                      <span className="font-['IBM_Plex_Sans_Thai'] text-[12px] text-[#6b7280]">{r.totalPcs} แผ่น</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {hasInput && !hasCoverage && (
        <div className="bg-white rounded-[8px] border border-[#e5e7eb] p-[20px]">
          <div className="flex justify-between items-center">
            <span className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#6b7280]">พื้นที่ของคุณ</span>
            <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[16px] text-black">{totalArea.toFixed(2)} ตร.ม.</span>
          </div>
        </div>
      )}
    </div>
  )
}
