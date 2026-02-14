'use client'

import { useState } from 'react'
import { use } from 'react'

/* ------------------------------------------------------------------ */
/*  SVG icon helpers                                                   */
/* ------------------------------------------------------------------ */

function PlusIcon({ size = 18, color = '#ff7e1b' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

function LinkIcon({ size = 18, color = '#6b7280' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  )
}

function TrashIcon({ size = 18, color = '#6b7280' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  )
}

function PencilIcon({ size = 18, color = '#6b7280' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  )
}

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

function ArrowLeftIcon({ size = 20, color = '#6b7280' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  Reusable sub-components                                            */
/* ------------------------------------------------------------------ */

/** Action icons row shown beneath each uploaded image */
function ImageActionRow() {
  return (
    <div className="flex items-center gap-[4px]">
      <button
        type="button"
        className="size-[32px] flex items-center justify-center rounded-[4px] hover:bg-[#f0f0f0] cursor-pointer"
        aria-label="Add"
      >
        <PlusIcon size={16} />
      </button>
      <button
        type="button"
        className="size-[32px] flex items-center justify-center rounded-[4px] hover:bg-[#f0f0f0] cursor-pointer"
        aria-label="Link"
      >
        <LinkIcon size={16} />
      </button>
      <button
        type="button"
        className="size-[32px] flex items-center justify-center rounded-[4px] hover:bg-[#f0f0f0] cursor-pointer"
        aria-label="Delete"
      >
        <TrashIcon size={16} />
      </button>
      <button
        type="button"
        className="size-[32px] flex items-center justify-center rounded-[4px] hover:bg-[#f0f0f0] cursor-pointer"
        aria-label="Edit"
      >
        <PencilIcon size={16} />
      </button>
    </div>
  )
}

/** Empty upload drop-zone with dashed border */
function UploadDropZone() {
  return (
    <div className="border-2 border-dashed border-[#e5e7eb] rounded-[8px] bg-[#fafafa] flex flex-col items-center justify-center gap-[8px] py-[32px] px-[16px] cursor-pointer hover:border-orange/50 transition-colors">
      <div className="size-[40px] rounded-full bg-orange/10 flex items-center justify-center">
        <PlusIcon size={20} color="#ff7e1b" />
      </div>
      <p className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#9ca3af] text-center leading-[1.5] m-0">
        Click to add an asset or drag and drop one in this area
      </p>
    </div>
  )
}

/** A single banner image entry (uploaded state) */
function BannerImageEntry({ filename }) {
  return (
    <div className="flex flex-col gap-[8px]">
      <label className="font-['IBM_Plex_Sans_Thai'] font-medium text-[13px] text-[#374151]">
        Image / &#3619;&#3641;&#3611;&#3616;&#3634;&#3614;
      </label>

      {/* Image placeholder styled as a brown architectural/building banner */}
      <div className="relative w-full h-[180px] rounded-[8px] overflow-hidden bg-[#8b7355]">
        {/* Simulated architectural silhouette shapes */}
        <div className="absolute inset-0 flex items-end justify-center gap-[12px] pb-0">
          <div className="w-[60px] h-[90px] bg-[#7a6548] rounded-t-[4px]" />
          <div className="w-[80px] h-[120px] bg-[#6d5a3e] rounded-t-[6px]" />
          <div className="w-[50px] h-[70px] bg-[#7a6548] rounded-t-[4px]" />
          <div className="w-[90px] h-[100px] bg-[#6d5a3e] rounded-t-[4px]" />
          <div className="w-[70px] h-[80px] bg-[#7a6548] rounded-t-[6px]" />
          <div className="w-[55px] h-[110px] bg-[#6d5a3e] rounded-t-[4px]" />
        </div>
        {/* Light gradient overlay at top to simulate sky */}
        <div className="absolute inset-x-0 top-0 h-[60px] bg-gradient-to-b from-[#a08b6d]/60 to-transparent" />
      </div>

      <ImageActionRow />

      <span className="font-['IBM_Plex_Sans_Thai'] text-[12px] text-[#6b7280]">
        {filename}
      </span>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main page component                                                */
/* ------------------------------------------------------------------ */

export default function BannerEditPage({ params }) {
  const resolvedParams = use(params)
  const id = resolvedParams.id

  const [activeTab, setActiveTab] = useState('draft')

  const tabs = [
    { key: 'draft', label: 'DRAFT' },
    { key: 'published', label: 'PUBLISHED' },
  ]

  return (
    <div className="flex flex-col gap-0 h-full min-h-0">
      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-between py-[12px]">
        {/* Left: back arrow + title + status badge */}
        <div className="flex items-center gap-[12px]">
          <button
            type="button"
            className="size-[32px] flex items-center justify-center rounded-[8px] hover:bg-gray-100 cursor-pointer"
            aria-label="Go back"
          >
            <ArrowLeftIcon size={20} color="#6b7280" />
          </button>

          <h1 className="font-['IBM_Plex_Sans_Thai'] font-bold text-[22px] text-[#1f2937] m-0">
            &#3649;&#3610;&#3609;&#3648;&#3609;&#3629;&#3619;&#3660; (Banner)
          </h1>

          <span className="inline-flex items-center px-[10px] py-[2px] rounded-full border border-orange/40 bg-orange/5 font-['IBM_Plex_Sans_Thai'] text-[12px] font-medium text-orange leading-[1.8]">
            &#3648;&#3612;&#3618;&#3649;&#3614;&#3619;&#3656;
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
            className="size-[32px] flex items-center justify-center rounded-[8px] hover:bg-gray-100 cursor-pointer"
            aria-label="More options"
          >
            <DotsIcon size={18} />
          </button>
        </div>
      </div>

      {/* ── Tab navigation ──────────────────────────────────────── */}
      <div className="flex gap-0 border-b border-[#e5e7eb]" role="tablist">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab.key)}
              className={`relative px-[20px] py-[10px] font-['IBM_Plex_Sans_Thai'] font-semibold text-[13px] tracking-[0.5px] cursor-pointer bg-transparent border-0 transition-colors ${
                isActive ? 'text-orange' : 'text-[#9ca3af] hover:text-[#6b7280]'
              }`}
            >
              {tab.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-orange rounded-t-full" />
              )}
            </button>
          )
        })}
      </div>

      {/* ── Content body (scrollable) ───────────────────────────── */}
      <div className="flex gap-[24px] mt-[20px] flex-1 min-h-0 overflow-y-auto pb-[32px]">
        {/* ── Main content area ─────────────────────────────────── */}
        <div className="flex-1 flex flex-col gap-[32px] min-w-0">

          {/* Banner : Image section */}
          <section className="bg-white rounded-[12px] border border-[#e5e7eb] p-[24px] flex flex-col gap-[20px]">
            <h2 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[16px] text-[#1f2937] m-0">
              Banner : Image
            </h2>

            {/* Uploaded image entry 1 */}
            <BannerImageEntry filename="banner-home-01.png" />

            {/* Divider */}
            <div className="h-px bg-[#e5e7eb]" />

            {/* Uploaded image entry 2 */}
            <BannerImageEntry filename="banner-home-02.png" />

            {/* Divider */}
            <div className="h-px bg-[#e5e7eb]" />

            {/* Empty upload entry 3 */}
            <div className="flex flex-col gap-[8px]">
              <label className="font-['IBM_Plex_Sans_Thai'] font-medium text-[13px] text-[#374151]">
                Image / &#3619;&#3641;&#3611;&#3616;&#3634;&#3614;
              </label>
              <UploadDropZone />
            </div>

            {/* Add an entry link */}
            <button
              type="button"
              className="flex items-center gap-[6px] text-orange font-['IBM_Plex_Sans_Thai'] font-medium text-[13px] bg-transparent border-0 cursor-pointer p-0 hover:underline self-start"
            >
              <PlusIcon size={14} color="#ff7e1b" />
              <span>Add an entry</span>
            </button>
          </section>

          {/* Banner : Video section */}
          <section className="bg-white rounded-[12px] border border-[#e5e7eb] p-[24px] flex flex-col gap-[16px]">
            <h2 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[16px] text-[#1f2937] m-0">
              Banner : Video
            </h2>

            <UploadDropZone />
          </section>
        </div>

        {/* ── Right sidebar (ENTRY panel) ──────────────────────── */}
        <aside className="w-[260px] shrink-0 flex flex-col gap-[16px]">
          <div className="bg-white rounded-[12px] border border-[#e5e7eb] p-[20px] flex flex-col gap-[16px]">
            <h3 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[12px] text-[#9ca3af] tracking-[0.8px] uppercase m-0">
              Entry
            </h3>

            {/* Publish button with 3-dot menu */}
            <div className="flex items-center gap-[8px]">
              <button
                type="button"
                className="flex-1 flex items-center justify-center gap-[6px] px-[16px] py-[8px] rounded-[8px] bg-orange text-white font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] border-0 cursor-pointer hover:bg-orange/90 transition-colors"
              >
                &#3648;&#3612;&#3618;&#3649;&#3614;&#3619;&#3656;
              </button>
              <button
                type="button"
                className="size-[36px] flex items-center justify-center rounded-[8px] border border-[#e5e7eb] bg-white cursor-pointer hover:bg-[#f9fafb]"
                aria-label="Publish options"
              >
                <DotsIcon size={16} color="#6b7280" />
              </button>
            </div>

            {/* Save button */}
            <button
              type="button"
              className="w-full flex items-center justify-center px-[16px] py-[8px] rounded-[8px] bg-white text-[#374151] font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] border border-[#e5e7eb] cursor-pointer hover:bg-[#f9fafb] transition-colors"
            >
              &#3610;&#3633;&#3609;&#3607;&#3638;&#3585;
            </button>
          </div>
        </aside>
      </div>
    </div>
  )
}
