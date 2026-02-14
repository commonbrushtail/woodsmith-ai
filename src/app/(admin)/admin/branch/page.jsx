'use client'

import { useState } from 'react'

/* ------------------------------------------------------------------ */
/*  SVG icon helpers                                                   */
/* ------------------------------------------------------------------ */

function ChevronDownIcon({ size = 12, color = '#6b7280' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 4.5L6 7.5L9 4.5" />
    </svg>
  )
}

function DotsIcon({ size = 18, color = '#6b7280' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="19" r="1" />
    </svg>
  )
}

function PlusIcon({ size = 16, color = '#ff7e1b' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  Region section data                                                */
/* ------------------------------------------------------------------ */

const REGIONS = [
  { key: 'head-office', label: '\u0e2a\u0e33\u0e19\u0e31\u0e01\u0e07\u0e32\u0e19\u0e43\u0e2b\u0e0d\u0e48' },
  { key: 'central', label: '\u0e2a\u0e32\u0e02\u0e32\u0e15\u0e32\u0e21\u0e20\u0e39\u0e21\u0e34\u0e20\u0e32\u0e04 : \u0e20\u0e32\u0e04\u0e01\u0e25\u0e32\u0e07' },
  { key: 'east', label: '\u0e2a\u0e32\u0e02\u0e32\u0e15\u0e32\u0e21\u0e20\u0e39\u0e21\u0e34\u0e20\u0e32\u0e04 : \u0e20\u0e32\u0e04\u0e15\u0e30\u0e27\u0e31\u0e19\u0e2d\u0e2d\u0e01' },
  { key: 'north', label: '\u0e2a\u0e32\u0e02\u0e32\u0e15\u0e32\u0e21\u0e20\u0e39\u0e21\u0e34\u0e20\u0e32\u0e04 : \u0e20\u0e32\u0e04\u0e40\u0e2b\u0e19\u0e37\u0e2d' },
  { key: 'northeast', label: '\u0e2a\u0e32\u0e02\u0e32\u0e15\u0e32\u0e21\u0e20\u0e39\u0e21\u0e34\u0e20\u0e32\u0e04 : \u0e20\u0e32\u0e04\u0e15\u0e30\u0e27\u0e31\u0e19\u0e2d\u0e2d\u0e01\u0e40\u0e09\u0e35\u0e22\u0e07\u0e40\u0e2b\u0e19\u0e37\u0e2d' },
  { key: 'south', label: '\u0e2a\u0e32\u0e02\u0e32\u0e15\u0e32\u0e21\u0e20\u0e39\u0e21\u0e34\u0e20\u0e32\u0e04 : \u0e20\u0e32\u0e04\u0e43\u0e15\u0e49' },
]

/* ------------------------------------------------------------------ */
/*  Region card component                                              */
/* ------------------------------------------------------------------ */

function RegionSection({ label }) {
  return (
    <section className="bg-white rounded-[12px] border border-[#e8eaef] p-[24px] flex flex-col gap-[16px]">
      {/* Section title */}
      <h2 className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-semibold text-[#1f2937] m-0">
        {label}
      </h2>

      {/* Empty state */}
      <div className="flex items-center justify-center rounded-[8px] bg-[#f9fafb] border border-dashed border-[#e8eaef] py-[40px] px-[24px]">
        <p className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#9ca3af] text-center m-0 leading-[1.8]">
          {'\u0e22\u0e31\u0e07\u0e44\u0e21\u0e48\u0e21\u0e35\u0e02\u0e49\u0e2d\u0e21\u0e39\u0e25 \u0e04\u0e25\u0e34\u0e01\u0e17\u0e35\u0e48\u0e1b\u0e38\u0e48\u0e21\u0e14\u0e49\u0e32\u0e19\u0e25\u0e48\u0e32\u0e07\u0e40\u0e1e\u0e37\u0e48\u0e2d\u0e40\u0e1e\u0e34\u0e48\u0e21\u0e02\u0e49\u0e2d\u0e21\u0e39\u0e25\u0e40\u0e02\u0e49\u0e32\u0e44\u0e1b'}
        </p>
      </div>

      {/* Add entry button */}
      <button
        type="button"
        className="inline-flex items-center gap-[6px] self-start px-0 py-0 bg-transparent border-0 cursor-pointer group"
      >
        <PlusIcon size={16} color="#ff7e1b" />
        <span className="font-['IBM_Plex_Sans_Thai'] text-[13px] font-medium text-[#ff7e1b] group-hover:underline">
          Add an entry
        </span>
      </button>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Main page component                                                */
/* ------------------------------------------------------------------ */

export default function BranchPage() {
  const [activeTab, setActiveTab] = useState('draft')

  const tabs = [
    { key: 'draft', label: 'DRAFT' },
    { key: 'published', label: 'PUBLISHED' },
  ]

  return (
    <div className="flex flex-col gap-0 h-full min-h-0">
      {/* ================================================================ */}
      {/*  Header                                                          */}
      {/* ================================================================ */}
      <div className="flex items-center justify-between py-[12px]">
        {/* Left: title + status badge */}
        <div className="flex items-center gap-[12px]">
          <h1 className="font-['IBM_Plex_Sans_Thai'] font-bold text-[22px] text-[#1f2937] m-0">
            {'\u0e0a\u0e48\u0e2d\u0e07\u0e17\u0e32\u0e07\u0e2a\u0e32\u0e02\u0e32 (Branch)'}
          </h1>

          <span className="inline-flex items-center px-[10px] py-[2px] rounded-full border border-[#ff7e1b]/40 bg-[#ff7e1b]/5 font-['IBM_Plex_Sans_Thai'] text-[12px] font-medium text-[#ff7e1b] leading-[1.8]">
            {'\u0e40\u0e1c\u0e22\u0e41\u0e1e\u0e23\u0e48'}
          </span>
        </div>

        {/* Right: locale dropdown + 3-dot menu */}
        <div className="flex items-center gap-[8px]">
          <div className="flex items-center gap-[8px] border border-[#e5e7eb] rounded-[8px] px-[12px] py-[6px] cursor-pointer hover:bg-[#f9fafb]">
            <span className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#4b5563]">Thai (th)</span>
            <ChevronDownIcon />
          </div>
          <button
            type="button"
            className="size-[32px] flex items-center justify-center rounded-[8px] hover:bg-gray-100 cursor-pointer bg-transparent border-0"
            aria-label="More options"
          >
            <DotsIcon size={18} />
          </button>
        </div>
      </div>

      {/* ================================================================ */}
      {/*  Tab navigation                                                  */}
      {/* ================================================================ */}
      <div className="flex gap-0 border-b border-[#e5e7eb]" role="tablist" aria-label="Content status tabs">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab.key)}
              className={`
                relative px-[20px] py-[10px] font-['IBM_Plex_Sans_Thai'] font-semibold text-[13px]
                tracking-[0.5px] cursor-pointer bg-transparent border-0 transition-colors
                ${isActive ? 'text-[#ff7e1b]' : 'text-[#9ca3af] hover:text-[#6b7280]'}
              `}
            >
              {tab.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#ff7e1b] rounded-t-full" />
              )}
            </button>
          )
        })}
      </div>

      {/* ================================================================ */}
      {/*  Content body                                                    */}
      {/* ================================================================ */}
      <div className="flex gap-[24px] mt-[20px] flex-1 min-h-0 overflow-y-auto pb-[32px]">
        {/* ---- Main content area: region sections ---- */}
        <div className="flex-1 flex flex-col gap-[24px] min-w-0">
          {REGIONS.map((region) => (
            <RegionSection key={region.key} label={region.label} />
          ))}
        </div>

        {/* ============================================================ */}
        {/*  Right sidebar - ENTRY panel                                  */}
        {/* ============================================================ */}
        <aside className="w-[260px] shrink-0 flex flex-col gap-[16px]">
          <div className="bg-white rounded-[12px] border border-[#e8eaef] p-[20px] flex flex-col gap-[16px]">
            <h3 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[12px] text-[#9ca3af] tracking-[0.8px] uppercase m-0">
              Entry
            </h3>

            {/* Publish button + dots menu */}
            <div className="flex items-center gap-[8px]">
              <button
                type="button"
                className="flex-1 flex items-center justify-center gap-[6px] px-[16px] py-[8px] rounded-[8px] bg-white text-[#374151] font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] border border-[#e8eaef] cursor-pointer hover:bg-[#f9fafb] transition-colors"
              >
                {'\u0e40\u0e1c\u0e22\u0e41\u0e1e\u0e23\u0e48'}
              </button>
              <button
                type="button"
                className="size-[36px] flex items-center justify-center rounded-[8px] border border-[#e8eaef] bg-white cursor-pointer hover:bg-[#f9fafb]"
                aria-label="Publish options"
              >
                <DotsIcon size={16} color="#6b7280" />
              </button>
            </div>

            {/* Save button */}
            <button
              type="button"
              className="w-full flex items-center justify-center px-[16px] py-[8px] rounded-[8px] bg-white text-[#374151] font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] border border-[#e8eaef] cursor-pointer hover:bg-[#f9fafb] transition-colors"
            >
              {'\u0e1a\u0e31\u0e19\u0e17\u0e36\u0e01'}
            </button>
          </div>
        </aside>
      </div>
    </div>
  )
}
