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

function ChevronUpIcon({ size = 12, color = '#6b7280' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 7.5L6 4.5L3 7.5" />
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

function TrashIcon({ size = 18, color = '#6b7280' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  )
}

function DragHandleIcon({ size = 18, color = '#9ca3af' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none">
      <circle cx="9" cy="5" r="1.5" />
      <circle cx="15" cy="5" r="1.5" />
      <circle cx="9" cy="10" r="1.5" />
      <circle cx="15" cy="10" r="1.5" />
      <circle cx="9" cy="15" r="1.5" />
      <circle cx="15" cy="15" r="1.5" />
    </svg>
  )
}

function PlusIcon({ size = 18, color = '#ff7e1b' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  Initial mock data                                                  */
/* ------------------------------------------------------------------ */

const INITIAL_CATEGORIES = [
  {
    id: 'cat-1',
    name: '\u0e01\u0e25\u0e38\u0e48\u0e21\u0e2a\u0e34\u0e19\u0e04\u0e49\u0e32\u0e41\u0e25\u0e30\u0e1a\u0e23\u0e34\u0e01\u0e32\u0e23',
    entries: [
      {
        id: 'faq-1',
        question: '\u0e1a\u0e23\u0e34\u0e01\u0e32\u0e23\u0e08\u0e31\u0e14\u0e2a\u0e48\u0e07\u0e2a\u0e34\u0e19\u0e04\u0e49\u0e32\u0e2b\u0e23\u0e37\u0e2d\u0e44\u0e21\u0e48 \u0e41\u0e25\u0e30\u0e21\u0e35\u0e04\u0e48\u0e32\u0e1a\u0e23\u0e34\u0e01\u0e32\u0e23\u0e43\u0e19\u0e01\u0e32\u0e23\u0e08\u0e31\u0e14\u0e2a\u0e48\u0e07\u0e2a\u0e34\u0e19\u0e04\u0e49\u0e32\u0e2d\u0e22\u0e48\u0e32\u0e07\u0e44\u0e23?',
        answer: '',
      },
      {
        id: 'faq-2',
        question: '\u0e23\u0e49\u0e32\u0e19\u0e27\u0e39\u0e49\u0e14\u0e2a\u0e21\u0e34\u0e18 \u0e21\u0e35\u0e2a\u0e32\u0e02\u0e32\u0e17\u0e35\u0e48\u0e44\u0e2b\u0e19\u0e1a\u0e49\u0e32\u0e07 \u0e40\u0e23\u0e32\u0e08\u0e30\u0e23\u0e39\u0e49\u0e44\u0e14\u0e49\u0e2d\u0e22\u0e48\u0e32\u0e07\u0e44\u0e23\u0e27\u0e48\u0e32\u0e2d\u0e22\u0e39\u0e48\u0e43\u0e01\u0e25\u0e49\u0e2a\u0e32\u0e02\u0e32\u0e44\u0e2b\u0e19?',
        answer: '',
      },
      {
        id: 'faq-3',
        question: '\u0e23\u0e49\u0e32\u0e19\u0e27\u0e39\u0e49\u0e14\u0e2a\u0e21\u0e34\u0e18 \u0e21\u0e35\u0e1a\u0e23\u0e34\u0e01\u0e32\u0e23\u0e40\u0e01\u0e47\u0e1a\u0e40\u0e07\u0e34\u0e19\u0e1b\u0e25\u0e32\u0e22\u0e17\u0e32\u0e07\u0e2b\u0e23\u0e37\u0e2d\u0e44\u0e21\u0e48?',
        answer: '\u0e22\u0e2d\u0e14\u0e2a\u0e31\u0e48\u0e07\u0e04\u0e23\u0e1a \u0e27\u0e39\u0e49\u0e14\u0e2a\u0e21\u0e34\u0e18\u0e0b\u0e4c\u0e43\u0e2b\u0e49\u0e1a\u0e23\u0e34\u0e01\u0e32\u0e23\u0e23\u0e31\u0e1a\u0e0a\u0e33\u0e23\u0e30\u0e40\u0e07\u0e34\u0e19\u0e1b\u0e25\u0e32\u0e22\u0e17\u0e32\u0e07\u0e04\u0e23\u0e31\u0e1a',
      },
    ],
  },
  {
    id: 'cat-2',
    name: '\u0e2a\u0e34\u0e19\u0e04\u0e49\u0e32\u0e01\u0e25\u0e38\u0e48\u0e21\u0e1b\u0e23\u0e30\u0e15\u0e39 \u0e41\u0e25\u0e30\u0e1b\u0e23\u0e30\u0e15\u0e39\u0e1e\u0e23\u0e49\u0e2d\u0e21\u0e27\u0e07\u0e01\u0e1a',
    entries: [],
  },
  {
    id: 'cat-3',
    name: '\u0e2a\u0e34\u0e19\u0e04\u0e49\u0e32\u0e01\u0e25\u0e38\u0e48\u0e21\u0e44\u0e21\u0e49\u0e1e\u0e37\u0e49\u0e19\u0e25\u0e32\u0e21\u0e34\u0e40\u0e19\u0e15',
    entries: [],
  },
  {
    id: 'cat-4',
    name: '\u0e01\u0e25\u0e38\u0e48\u0e21\u0e2a\u0e34\u0e19\u0e04\u0e49\u0e32\u0e27\u0e07\u0e01\u0e1a \u0e44\u0e21\u0e49\u0e1d\u0e32 \u0e41\u0e25\u0e30 \u0e44\u0e21\u0e49\u0e1a\u0e31\u0e19\u0e44\u0e14',
    entries: [],
  },
  {
    id: 'cat-5',
    name: '\u0e2a\u0e34\u0e19\u0e04\u0e49\u0e32\u0e01\u0e25\u0e38\u0e48\u0e21\u0e44\u0e21\u0e49\u0e2d\u0e31\u0e14 \u0e2b\u0e23\u0e37\u0e2d \u0e44\u0e21\u0e49\u0e1a\u0e2d\u0e23\u0e4c\u0e14\u0e1b\u0e34\u0e14\u0e1c\u0e34\u0e27',
    entries: [],
  },
]

/* ------------------------------------------------------------------ */
/*  Collapsed FAQ row                                                  */
/* ------------------------------------------------------------------ */

function CollapsedFaqRow({ entry, onExpand, onDelete }) {
  return (
    <div className="flex items-center gap-[8px] px-[16px] py-[12px] bg-[#f9fafb] border border-[#e8eaef] rounded-[8px]">
      <button
        type="button"
        onClick={onExpand}
        className="size-[28px] flex items-center justify-center rounded-[4px] hover:bg-[#e5e7eb] cursor-pointer bg-transparent border-0 shrink-0"
        aria-label="Expand question"
      >
        <ChevronDownIcon size={14} color="#6b7280" />
      </button>

      <span className="flex-1 font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#4b5563] leading-[1.6] truncate">
        {entry.question || '\u0e22\u0e31\u0e07\u0e44\u0e21\u0e48\u0e21\u0e35\u0e04\u0e33\u0e16\u0e32\u0e21'}
      </span>

      <button
        type="button"
        onClick={onDelete}
        className="size-[28px] flex items-center justify-center rounded-[4px] hover:bg-[#fee2e2] cursor-pointer bg-transparent border-0 shrink-0"
        aria-label="Delete entry"
      >
        <TrashIcon size={16} color="#6b7280" />
      </button>

      <div
        className="shrink-0 cursor-grab active:cursor-grabbing flex items-center justify-center"
        aria-label="Drag to reorder"
      >
        <DragHandleIcon size={18} color="#9ca3af" />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Expanded FAQ row (editing form)                                    */
/* ------------------------------------------------------------------ */

function ExpandedFaqRow({ entry, onCollapse, onDelete, onChangeQuestion, onChangeAnswer }) {
  return (
    <div className="flex flex-col gap-0 border border-[#ff7e1b]/40 rounded-[8px] overflow-hidden">
      {/* Header bar with orange tint */}
      <div className="flex items-center gap-[8px] px-[16px] py-[12px] bg-[#ff7e1b]/5">
        <button
          type="button"
          onClick={onCollapse}
          className="size-[28px] flex items-center justify-center rounded-[4px] hover:bg-[#ff7e1b]/10 cursor-pointer bg-transparent border-0 shrink-0"
          aria-label="Collapse question"
        >
          <ChevronUpIcon size={14} color="#ff7e1b" />
        </button>

        <span className="flex-1 font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#1f2937] font-medium leading-[1.6] truncate">
          {entry.question || '\u0e22\u0e31\u0e07\u0e44\u0e21\u0e48\u0e21\u0e35\u0e04\u0e33\u0e16\u0e32\u0e21'}
        </span>

        <button
          type="button"
          onClick={onDelete}
          className="size-[28px] flex items-center justify-center rounded-[4px] hover:bg-[#fee2e2] cursor-pointer bg-transparent border-0 shrink-0"
          aria-label="Delete entry"
        >
          <TrashIcon size={16} color="#6b7280" />
        </button>

        <div
          className="shrink-0 cursor-grab active:cursor-grabbing flex items-center justify-center"
          aria-label="Drag to reorder"
        >
          <DragHandleIcon size={18} color="#9ca3af" />
        </div>
      </div>

      {/* Form fields */}
      <div className="flex flex-col gap-[16px] px-[16px] py-[16px] bg-white">
        {/* Question field */}
        <div className="flex flex-col gap-[6px]">
          <label className="font-['IBM_Plex_Sans_Thai'] text-[13px] font-medium text-[#1f2937]">
            {'\u0e04\u0e33\u0e16\u0e32\u0e21'} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={entry.question}
            onChange={(e) => onChangeQuestion(e.target.value)}
            placeholder={'\u0e01\u0e23\u0e2d\u0e01\u0e04\u0e33\u0e16\u0e32\u0e21'}
            className="w-full font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border border-[#e8eaef] rounded-[8px] px-[14px] py-[10px] outline-none focus:border-[#ff7e1b] focus:ring-1 focus:ring-[#ff7e1b]/20 transition-all placeholder:text-[#bfbfbf] bg-white"
          />
        </div>

        {/* Answer field */}
        <div className="flex flex-col gap-[6px]">
          <label className="font-['IBM_Plex_Sans_Thai'] text-[13px] font-medium text-[#1f2937]">
            {'\u0e04\u0e33\u0e15\u0e2d\u0e1a'} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={entry.answer}
            onChange={(e) => onChangeAnswer(e.target.value)}
            placeholder={'\u0e01\u0e23\u0e2d\u0e01\u0e04\u0e33\u0e15\u0e2d\u0e1a'}
            className="w-full font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border border-[#e8eaef] rounded-[8px] px-[14px] py-[10px] outline-none focus:border-[#ff7e1b] focus:ring-1 focus:ring-[#ff7e1b]/20 transition-all placeholder:text-[#bfbfbf] bg-white"
          />
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Category section card                                              */
/* ------------------------------------------------------------------ */

function CategorySection({ category, expandedId, onToggle, onDelete, onAdd, onUpdateEntry }) {
  const entryCount = category.entries.length

  return (
    <section className="bg-white rounded-[12px] border border-[#e8eaef] p-[24px] flex flex-col gap-[16px]">
      {/* Category heading with entry count */}
      <h2 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[16px] text-[#1f2937] m-0">
        {category.name}
        {entryCount > 0 && (
          <span className="font-normal text-[14px] text-[#9ca3af] ml-[8px]">
            ({entryCount})
          </span>
        )}
      </h2>

      {/* FAQ entries or empty state */}
      {entryCount === 0 ? (
        <div className="flex flex-col items-center gap-[8px] py-[24px] text-center">
          <p className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#9ca3af] m-0 leading-[1.6]">
            {'\u0e22\u0e31\u0e07\u0e44\u0e21\u0e48\u0e21\u0e35\u0e02\u0e49\u0e2d\u0e21\u0e39\u0e25 \u0e04\u0e25\u0e34\u0e01\u0e17\u0e35\u0e48\u0e1b\u0e38\u0e48\u0e21\u0e14\u0e49\u0e32\u0e19\u0e25\u0e48\u0e32\u0e07\u0e40\u0e1e\u0e37\u0e48\u0e2d\u0e40\u0e1e\u0e34\u0e48\u0e21\u0e02\u0e49\u0e2d\u0e21\u0e39\u0e25\u0e40\u0e02\u0e49\u0e32\u0e44\u0e1b'}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-[8px]">
          {category.entries.map((entry) => {
            const isExpanded = expandedId === entry.id
            return isExpanded ? (
              <ExpandedFaqRow
                key={entry.id}
                entry={entry}
                onCollapse={() => onToggle(null)}
                onDelete={() => onDelete(category.id, entry.id)}
                onChangeQuestion={(val) => onUpdateEntry(category.id, entry.id, 'question', val)}
                onChangeAnswer={(val) => onUpdateEntry(category.id, entry.id, 'answer', val)}
              />
            ) : (
              <CollapsedFaqRow
                key={entry.id}
                entry={entry}
                onExpand={() => onToggle(entry.id)}
                onDelete={() => onDelete(category.id, entry.id)}
              />
            )
          })}
        </div>
      )}

      {/* Add an entry link */}
      <button
        type="button"
        onClick={() => onAdd(category.id)}
        className="flex items-center gap-[6px] text-[#ff7e1b] font-['IBM_Plex_Sans_Thai'] font-medium text-[13px] bg-transparent border-0 cursor-pointer p-0 hover:underline self-start"
      >
        <PlusIcon size={14} color="#ff7e1b" />
        <span>Add an entry</span>
      </button>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Main page component                                                */
/* ------------------------------------------------------------------ */

export default function FaqPage() {
  const [activeTab, setActiveTab] = useState('draft')
  const [categories, setCategories] = useState(INITIAL_CATEGORIES)
  const [expandedId, setExpandedId] = useState('faq-3')

  const tabs = [
    { key: 'draft', label: 'DRAFT' },
    { key: 'published', label: 'PUBLISHED' },
  ]

  /* ---- Helpers ---- */

  /** Generate a simple unique id */
  function generateId() {
    return 'faq-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7)
  }

  /** Toggle expand/collapse of a FAQ entry */
  function handleToggle(entryId) {
    setExpandedId((prev) => (prev === entryId ? null : entryId))
  }

  /** Delete a FAQ entry from a category */
  function handleDelete(categoryId, entryId) {
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id !== categoryId) return cat
        return {
          ...cat,
          entries: cat.entries.filter((e) => e.id !== entryId),
        }
      })
    )
    if (expandedId === entryId) {
      setExpandedId(null)
    }
  }

  /** Add a new blank FAQ entry to a category */
  function handleAdd(categoryId) {
    const newId = generateId()
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id !== categoryId) return cat
        return {
          ...cat,
          entries: [
            ...cat.entries,
            { id: newId, question: '', answer: '' },
          ],
        }
      })
    )
    setExpandedId(newId)
  }

  /** Update a specific field of a FAQ entry */
  function handleUpdateEntry(categoryId, entryId, field, value) {
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id !== categoryId) return cat
        return {
          ...cat,
          entries: cat.entries.map((e) => {
            if (e.id !== entryId) return e
            return { ...e, [field]: value }
          }),
        }
      })
    )
  }

  return (
    <div className="flex flex-col gap-0 h-full min-h-0">
      {/* ================================================================ */}
      {/*  Header                                                          */}
      {/* ================================================================ */}
      <div className="flex items-center justify-between py-[12px]">
        {/* Left: title + status badge */}
        <div className="flex items-center gap-[12px]">
          <h1 className="font-['IBM_Plex_Sans_Thai'] font-bold text-[22px] text-[#1f2937] m-0">
            {'\u0e04\u0e33\u0e16\u0e32\u0e21\u0e17\u0e35\u0e48\u0e1e\u0e1a\u0e1a\u0e48\u0e2d\u0e22 (FAQs)'}
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
      {/*  Content body (scrollable)                                       */}
      {/* ================================================================ */}
      <div className="flex gap-[24px] mt-[20px] flex-1 min-h-0 overflow-y-auto pb-[32px]">
        {/* ---- Main content area ---- */}
        <div className="flex-1 flex flex-col gap-[24px] min-w-0">
          {categories.map((category) => (
            <CategorySection
              key={category.id}
              category={category}
              expandedId={expandedId}
              onToggle={handleToggle}
              onDelete={handleDelete}
              onAdd={handleAdd}
              onUpdateEntry={handleUpdateEntry}
            />
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
                className="flex-1 flex items-center justify-center gap-[6px] px-[16px] py-[8px] rounded-[8px] bg-[#ff7e1b] text-white font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] border-0 cursor-pointer hover:bg-[#ff7e1b]/90 transition-colors"
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
