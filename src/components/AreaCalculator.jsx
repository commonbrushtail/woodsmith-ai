'use client'

import { useState } from 'react'

export default function AreaCalculator({ coveragePerBox, piecesPerBox, plankWidth, plankLength, wastePercentage = 5 }) {
  const [roomWidth, setRoomWidth] = useState('')
  const [roomLength, setRoomLength] = useState('')

  const width = parseFloat(roomWidth)
  const length = parseFloat(roomLength)
  const hasInput = width > 0 && length > 0
  const hasCoverage = coveragePerBox > 0

  const totalArea = hasInput ? width * length : 0
  const wasteFactor = 1 + (wastePercentage || 0) / 100
  const areaWithWaste = totalArea * wasteFactor
  const boxesNeeded = hasCoverage ? Math.ceil(areaWithWaste / coveragePerBox) : 0
  const totalPieces = piecesPerBox > 0 ? boxesNeeded * piecesPerBox : null

  return (
    <div className="bg-[#f8f3ea] rounded-[12px] p-[24px] flex flex-col gap-[20px]">
      <div className="flex items-center gap-[10px]">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff7e1b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <path d="M4 9h16M9 4v16" />
        </svg>
        <p className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[18px] text-black m-0">
          คำนวณพื้นที่
        </p>
      </div>

      {/* Info line */}
      <div className="flex flex-wrap gap-[16px]">
        {hasCoverage && (
          <span className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#6b7280]">
            พื้นที่ต่อกล่อง: <strong className="text-black">{coveragePerBox} ตร.ม.</strong>
          </span>
        )}
        {piecesPerBox > 0 && (
          <span className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#6b7280]">
            จำนวนแผ่นต่อกล่อง: <strong className="text-black">{piecesPerBox} แผ่น</strong>
          </span>
        )}
        {plankWidth > 0 && plankLength > 0 && (
          <span className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#6b7280]">
            ขนาดแผ่น: <strong className="text-black">{plankWidth} x {plankLength} มม.</strong>
          </span>
        )}
      </div>

      {/* Inputs */}
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

      {/* Results */}
      {hasInput && hasCoverage && (
        <div className="bg-white rounded-[8px] border border-[#e5e7eb] p-[20px] flex flex-col gap-[12px]">
          <div className="flex justify-between items-center">
            <span className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#6b7280]">พื้นที่ห้อง</span>
            <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] text-black">{totalArea.toFixed(2)} ตร.ม.</span>
          </div>
          {wastePercentage > 0 && (
            <div className="flex justify-between items-center">
              <span className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#6b7280]">เผื่อเศษ ({wastePercentage}%)</span>
              <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] text-black">{areaWithWaste.toFixed(2)} ตร.ม.</span>
            </div>
          )}
          <div className="border-t border-[#e5e7eb] pt-[12px] flex justify-between items-center">
            <span className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[16px] text-black">จำนวนที่ต้องใช้</span>
            <span className="font-['IBM_Plex_Sans_Thai'] font-bold text-[24px] text-orange">{boxesNeeded} กล่อง</span>
          </div>
          {totalPieces !== null && (
            <div className="flex justify-between items-center">
              <span className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#6b7280]">รวมทั้งหมด</span>
              <span className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#6b7280]">{totalPieces} แผ่น</span>
            </div>
          )}
        </div>
      )}

      {hasInput && !hasCoverage && (
        <div className="bg-white rounded-[8px] border border-[#e5e7eb] p-[20px]">
          <div className="flex justify-between items-center">
            <span className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#6b7280]">พื้นที่ห้อง</span>
            <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[16px] text-black">{totalArea.toFixed(2)} ตร.ม.</span>
          </div>
        </div>
      )}
    </div>
  )
}
