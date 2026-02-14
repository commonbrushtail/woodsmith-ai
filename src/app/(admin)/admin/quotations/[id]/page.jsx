'use client'

import { useState } from 'react'
import { use } from 'react'
import Link from 'next/link'

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

function ArrowLeftIcon({ size = 20, color = '#6b7280' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  Status configuration                                               */
/* ------------------------------------------------------------------ */

const STATUS_OPTIONS = [
  {
    key: 'pending',
    label: '\u0E23\u0E2D\u0E1E\u0E34\u0E08\u0E32\u0E23\u0E13\u0E32',
    bg: '#dbeafe',
    text: '#1e40af',
    border: '#93c5fd',
  },
  {
    key: 'approved',
    label: '\u0E2D\u0E19\u0E38\u0E21\u0E31\u0E15\u0E34\u0E43\u0E1A\u0E40\u0E2A\u0E19\u0E2D\u0E23\u0E32\u0E04\u0E32',
    bg: '#dcfce7',
    text: '#166534',
    border: '#86efac',
  },
  {
    key: 'rejected',
    label: '\u0E44\u0E21\u0E48\u0E2D\u0E19\u0E38\u0E21\u0E31\u0E15\u0E34\u0E43\u0E1A\u0E40\u0E2A\u0E19\u0E2D\u0E23\u0E32\u0E04\u0E32',
    bg: '#fee2e2',
    text: '#991b1b',
    border: '#fca5a5',
  },
]

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

const MOCK_QUOTATION = {
  quotationNumber: 'EQT2568130010',
  requestDate: '\u0E27\u0E31\u0E19\u0E1E\u0E24\u0E2B\u0E31\u0E2A\u0E1A\u0E14\u0E35 \u0E17\u0E35\u0E48 30 \u0E15\u0E38\u0E25\u0E32\u0E04\u0E21 2568 \u0E40\u0E27\u0E25\u0E32 16:41',
  requester: {
    name: 'John Doe',
    phone: '081-234-5678',
    email: 'email@email.com',
    address: '1111 \u0E16\u0E19\u0E19\u0E41\u0E08\u0E49\u0E07\u0E27\u0E31\u0E12\u0E19\u0E30 \u0E15.\u0E04\u0E25\u0E2D\u0E07\u0E40\u0E01\u0E25\u0E37\u0E2D \u0E2D.\u0E1B\u0E32\u0E01\u0E40\u0E01\u0E23\u0E47\u0E14 \u0E08.\u0E19\u0E19\u0E17\u0E1A\u0E38\u0E23\u0E35 11110',
  },
  product: {
    code: '10260',
    name: '\u0E1B\u0E23\u0E30\u0E15\u0E39\u0E1A\u0E32\u0E19\u0E40\u0E23\u0E35\u0E22\u0E1A (HDF \u0E1B\u0E34\u0E14\u0E1C\u0E34\u0E27\u0E40\u0E21\u0E25\u0E32\u0E21\u0E35\u0E19) Wood Smith',
    colorName: 'Oak 20638 (L)',
    colorHex: '#9ca3af',
    size: '80x200 cm.',
  },
}

/* ------------------------------------------------------------------ */
/*  Reusable sub-components                                            */
/* ------------------------------------------------------------------ */

/** Label-value row used throughout the detail sections */
function DetailRow({ label, children }) {
  return (
    <div className="flex gap-[16px] py-[8px]">
      <span className="w-[180px] shrink-0 font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#4b5563] leading-[1.6]">
        {label}
      </span>
      <span className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] leading-[1.6]">
        {children}
      </span>
    </div>
  )
}

/** Status dropdown with interactive selection */
function StatusDropdown({ status, onStatusChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const current = STATUS_OPTIONS.find((s) => s.key === status) || STATUS_OPTIONS[0]

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-[6px] px-[12px] py-[4px] rounded-full border cursor-pointer transition-colors"
        style={{
          backgroundColor: current.bg,
          color: current.text,
          borderColor: current.border,
        }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Change quotation approval status"
      >
        <span className="font-['IBM_Plex_Sans_Thai'] text-[13px] font-medium leading-[1.6]">
          {current.label}
        </span>
        <ChevronDownIcon size={12} color={current.text} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop to close dropdown */}
          <div
            className="fixed inset-0 z-[40]"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <ul
            role="listbox"
            aria-label="Quotation approval status options"
            className="absolute right-0 top-full mt-[4px] z-[50] bg-white border border-[#e5e7eb] rounded-[8px] shadow-lg py-[4px] min-w-[220px]"
          >
            {STATUS_OPTIONS.map((option) => (
              <li
                key={option.key}
                role="option"
                aria-selected={option.key === status}
                onClick={() => {
                  onStatusChange(option.key)
                  setIsOpen(false)
                }}
                className="flex items-center gap-[8px] px-[12px] py-[8px] cursor-pointer hover:bg-[#f9fafb] transition-colors"
              >
                <span
                  className="inline-flex items-center px-[10px] py-[2px] rounded-full border font-['IBM_Plex_Sans_Thai'] text-[12px] font-medium leading-[1.6]"
                  style={{
                    backgroundColor: option.bg,
                    color: option.text,
                    borderColor: option.border,
                  }}
                >
                  {option.label}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main page component                                                */
/* ------------------------------------------------------------------ */

export default function QuotationDetailPage({ params }) {
  const resolvedParams = use(params)
  const id = resolvedParams.id

  const [activeTab, setActiveTab] = useState('draft')
  const [approvalStatus, setApprovalStatus] = useState('pending')

  const tabs = [
    { key: 'draft', label: 'DRAFT' },
    { key: 'published', label: 'PUBLISHED' },
  ]

  const data = MOCK_QUOTATION

  return (
    <div className="flex flex-col gap-0 h-full min-h-0">
      {/* ── Back link ────────────────────────────────────────────── */}
      <Link
        href="/admin/quotations"
        className="inline-flex items-center gap-[4px] font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#ff7e1b] hover:underline no-underline py-[4px] self-start"
      >
        <ArrowLeftIcon size={16} color="#ff7e1b" />
        <span>{'\u0E01\u0E25\u0E31\u0E1A'}</span>
      </Link>

      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-between py-[12px]">
        {/* Left: title + status badge */}
        <div className="flex items-center gap-[12px]">
          <h1 className="font-['IBM_Plex_Sans_Thai'] font-bold text-[22px] text-[#1f2937] m-0">
            {'\u0E08\u0E31\u0E14\u0E01\u0E32\u0E23\u0E43\u0E1A\u0E40\u0E2A\u0E19\u0E2D\u0E23\u0E32\u0E04\u0E32/ Manage Quotation'}
          </h1>

          <span className="inline-flex items-center px-[10px] py-[2px] rounded-full border border-[#93c5fd] bg-[#dbeafe] font-['IBM_Plex_Sans_Thai'] text-[12px] font-medium text-[#1e40af] leading-[1.8]">
            Draft
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
            className="size-[32px] flex items-center justify-center rounded-[8px] hover:bg-gray-100 cursor-pointer border-0 bg-transparent"
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
                isActive ? 'text-[#ff7e1b]' : 'text-[#9ca3af] hover:text-[#6b7280]'
              }`}
            >
              {tab.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#ff7e1b] rounded-t-full" />
              )}
            </button>
          )
        })}
      </div>

      {/* ── Status bar ──────────────────────────────────────────── */}
      <div className="flex justify-end items-center gap-[12px] mt-[16px]">
        <span className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#4b5563]">
          {'\u0E2A\u0E16\u0E32\u0E19\u0E30\u0E01\u0E32\u0E23\u0E2D\u0E19\u0E38\u0E21\u0E31\u0E15\u0E34\u0E43\u0E1A\u0E40\u0E2A\u0E19\u0E2D\u0E23\u0E32\u0E04\u0E32:'}
        </span>
        <StatusDropdown
          status={approvalStatus}
          onStatusChange={setApprovalStatus}
        />
      </div>

      {/* ── Content + Sidebar ───────────────────────────────────── */}
      <div className="flex gap-[24px] mt-[20px] flex-1 min-h-0 overflow-y-auto pb-[32px]">
        {/* ── Main content area ─────────────────────────────────── */}
        <div className="flex-1 flex flex-col gap-[24px] min-w-0">

          {/* Section 1: Quotation Details */}
          <section className="bg-white rounded-[12px] border border-[#e8eaef] p-[24px] flex flex-col gap-[4px]">
            <h2 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[16px] text-[#1f2937] m-0 mb-[8px]">
              {'\u0E23\u0E32\u0E22\u0E25\u0E30\u0E40\u0E2D\u0E35\u0E22\u0E14\u0E43\u0E1A\u0E40\u0E2A\u0E19\u0E2D\u0E23\u0E32\u0E04\u0E32'}
            </h2>
            <DetailRow label={'\u0E40\u0E25\u0E02\u0E17\u0E35\u0E48\u0E43\u0E1A\u0E40\u0E2A\u0E19\u0E2D\u0E23\u0E32\u0E04\u0E32:'}>
              {data.quotationNumber}
            </DetailRow>
            <DetailRow label={'\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E02\u0E2D\u0E43\u0E1A\u0E40\u0E2A\u0E19\u0E2D\u0E23\u0E32\u0E04\u0E32:'}>
              {data.requestDate}
            </DetailRow>
          </section>

          {/* Section 2: Requester Information */}
          <section className="bg-white rounded-[12px] border border-[#e8eaef] p-[24px] flex flex-col gap-[4px]">
            <h2 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[16px] text-[#1f2937] m-0 mb-[8px]">
              {'\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E1C\u0E39\u0E49\u0E02\u0E2D\u0E43\u0E1A\u0E40\u0E2A\u0E19\u0E2D\u0E23\u0E32\u0E04\u0E32'}
            </h2>
            <DetailRow label={'\u0E0A\u0E37\u0E48\u0E2D-\u0E19\u0E32\u0E21\u0E2A\u0E01\u0E38\u0E25:'}>
              {data.requester.name}
            </DetailRow>
            <DetailRow label={'\u0E40\u0E1A\u0E2D\u0E23\u0E4C\u0E42\u0E17\u0E23\u0E28\u0E31\u0E1E\u0E17\u0E4C:'}>
              {data.requester.phone}
            </DetailRow>
            <DetailRow label={'\u0E2D\u0E35\u0E40\u0E21\u0E25:'}>
              {data.requester.email}
            </DetailRow>
            <DetailRow label={'\u0E17\u0E35\u0E48\u0E2D\u0E22\u0E39\u0E48:'}>
              {data.requester.address}
            </DetailRow>
          </section>

          {/* Section 3: Product Information */}
          <section className="bg-white rounded-[12px] border border-[#e8eaef] p-[24px] flex flex-col gap-[4px]">
            <h2 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[16px] text-[#1f2937] m-0 mb-[8px]">
              {'\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32'}
            </h2>

            <div className="flex gap-[16px] py-[8px]">
              {/* Product image placeholder */}
              <div className="w-[60px] h-[80px] shrink-0 rounded-[6px] bg-[#f3f4f6] border border-[#e5e7eb] flex items-center justify-center overflow-hidden">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>

              {/* Product details */}
              <div className="flex flex-col gap-[4px] flex-1">
                <DetailRow label={'\u0E23\u0E2B\u0E31\u0E2A\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32:'}>
                  {data.product.code}
                </DetailRow>
                <DetailRow label={'\u0E0A\u0E37\u0E48\u0E2D\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32:'}>
                  {data.product.name}
                </DetailRow>
                <div className="flex flex-col gap-[4px]">
                  <span className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#4b5563] leading-[1.6]">
                    {'\u0E15\u0E31\u0E27\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32:'}
                  </span>
                  <div className="ml-[16px] flex flex-col gap-[4px]">
                    <div className="flex items-center gap-[8px]">
                      <span className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#4b5563] w-[60px] shrink-0">
                        {'\u0E2A\u0E35:'}
                      </span>
                      <span
                        className="inline-block w-[16px] h-[16px] rounded-full border border-[#d1d5db] shrink-0"
                        style={{ backgroundColor: data.product.colorHex }}
                        aria-label={`Color swatch: ${data.product.colorName}`}
                      />
                      <span className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937]">
                        {data.product.colorName}
                      </span>
                    </div>
                    <div className="flex items-center gap-[8px]">
                      <span className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#4b5563] w-[60px] shrink-0">
                        {'\u0E02\u0E19\u0E32\u0E14:'}
                      </span>
                      <span className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937]">
                        {data.product.size}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* ── Right sidebar (ENTRY panel) ──────────────────────── */}
        <aside className="w-[260px] shrink-0 flex flex-col gap-[16px]">
          <div className="bg-white rounded-[12px] border border-[#e8eaef] p-[20px] flex flex-col gap-[16px]">
            <h3 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[12px] text-[#9ca3af] tracking-[0.8px] uppercase m-0">
              Entry
            </h3>

            {/* Publish button with 3-dot menu */}
            <div className="flex items-center gap-[8px]">
              <button
                type="button"
                className="flex-1 flex items-center justify-center gap-[6px] px-[16px] py-[8px] rounded-[8px] bg-[#ff7e1b] text-white font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] border-0 cursor-pointer hover:bg-[#e56f17] transition-colors"
              >
                {'\u0E40\u0E1C\u0E22\u0E41\u0E1E\u0E23\u0E48'}
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
              {'\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01'}
            </button>
          </div>
        </aside>
      </div>
    </div>
  )
}
