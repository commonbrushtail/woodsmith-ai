'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createFaq } from '@/lib/actions/faqs'
import { useToast } from '@/lib/toast-context'

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
      <path d="M3 7.5L6 4.5L9 7.5" />
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

function PlusIcon({ size = 18, color = '#ff7e1b' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
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

function DragIcon({ size = 18, color = '#9ca3af' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <circle cx="9" cy="5" r="1.5" />
      <circle cx="15" cy="5" r="1.5" />
      <circle cx="9" cy="10" r="1.5" />
      <circle cx="15" cy="10" r="1.5" />
      <circle cx="9" cy="15" r="1.5" />
      <circle cx="15" cy="15" r="1.5" />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  Category data                                                      */
/* ------------------------------------------------------------------ */

const FAQ_CATEGORIES = [
  { id: 'cat-1', name: '\u0e01\u0e25\u0e38\u0e48\u0e21\u0e2a\u0e34\u0e19\u0e04\u0e49\u0e32\u0e41\u0e25\u0e30\u0e1a\u0e23\u0e34\u0e01\u0e32\u0e23' },
  { id: 'cat-2', name: '\u0e2a\u0e34\u0e19\u0e04\u0e49\u0e32\u0e01\u0e25\u0e38\u0e48\u0e21\u0e1b\u0e23\u0e30\u0e15\u0e39 \u0e41\u0e25\u0e30\u0e1b\u0e23\u0e30\u0e15\u0e39\u0e1e\u0e23\u0e49\u0e2d\u0e21\u0e27\u0e07\u0e01\u0e1a' },
  { id: 'cat-3', name: '\u0e2a\u0e34\u0e19\u0e04\u0e49\u0e32\u0e01\u0e25\u0e38\u0e48\u0e21\u0e44\u0e21\u0e49\u0e1e\u0e37\u0e49\u0e19\u0e25\u0e32\u0e21\u0e34\u0e40\u0e19\u0e15' },
  { id: 'cat-4', name: '\u0e01\u0e25\u0e38\u0e48\u0e21\u0e2a\u0e34\u0e19\u0e04\u0e49\u0e32\u0e27\u0e07\u0e01\u0e1a \u0e44\u0e21\u0e49\u0e1d\u0e32 \u0e41\u0e25\u0e30 \u0e44\u0e21\u0e49\u0e1a\u0e31\u0e19\u0e44\u0e14' },
  { id: 'cat-5', name: '\u0e2a\u0e34\u0e19\u0e04\u0e49\u0e32\u0e01\u0e25\u0e38\u0e48\u0e21\u0e44\u0e21\u0e49\u0e2d\u0e31\u0e14 \u0e2b\u0e23\u0e37\u0e2d \u0e44\u0e21\u0e49\u0e1a\u0e2d\u0e23\u0e4c\u0e14\u0e1b\u0e34\u0e14\u0e1c\u0e34\u0e27' },
]

/* ------------------------------------------------------------------ */
/*  FAQ Entry form                                                     */
/* ------------------------------------------------------------------ */

function FaqEntryForm({ entry, index, onUpdate, onDelete }) {
  return (
    <div className="flex flex-col gap-[16px] pl-[8px]">
      {/* Question field */}
      <div className="flex flex-col gap-[6px]">
        <label className="font-['IBM_Plex_Sans_Thai'] text-[13px] font-medium text-[#374151]">
          {'\u0e04\u0e33\u0e16\u0e32\u0e21'} <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={entry.question}
          onChange={(e) => onUpdate(index, 'question', e.target.value)}
          placeholder={'\u0e01\u0e23\u0e2d\u0e01\u0e04\u0e33\u0e16\u0e32\u0e21'}
          className="w-full font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border border-[#e8eaef] rounded-[8px] px-[14px] py-[10px] outline-none focus:border-[#ff7e1b] focus:ring-1 focus:ring-[#ff7e1b]/20 transition-all placeholder:text-[#bfbfbf]"
          aria-label={`Question ${index + 1}`}
        />
      </div>

      {/* Answer field */}
      <div className="flex flex-col gap-[6px]">
        <label className="font-['IBM_Plex_Sans_Thai'] text-[13px] font-medium text-[#374151]">
          {'\u0e04\u0e33\u0e15\u0e2d\u0e1a'} <span className="text-red-500">*</span>
        </label>
        <textarea
          value={entry.answer}
          onChange={(e) => onUpdate(index, 'answer', e.target.value)}
          placeholder={'\u0e01\u0e23\u0e2d\u0e01\u0e04\u0e33\u0e15\u0e2d\u0e1a'}
          rows={3}
          className="w-full font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border border-[#e8eaef] rounded-[8px] px-[14px] py-[10px] outline-none resize-y focus:border-[#ff7e1b] focus:ring-1 focus:ring-[#ff7e1b]/20 transition-all placeholder:text-[#bfbfbf]"
          aria-label={`Answer ${index + 1}`}
        />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Category section                                                   */
/* ------------------------------------------------------------------ */

function CategorySection({ category, entries, expandedEntries, onToggleEntry, onAddEntry, onDeleteEntry, onUpdateEntry }) {
  const entryCount = entries.length
  const hasEntries = entryCount > 0

  return (
    <section className="bg-white rounded-[12px] border border-[#e8eaef] overflow-hidden">
      {/* Category header */}
      <div className="flex items-center justify-between px-[20px] py-[16px] border-b border-[#e8eaef] bg-[#fafafa]">
        <h3 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[14px] text-[#1f2937] m-0">
          {category.name}
          {hasEntries && (
            <span className="ml-[8px] text-[#9ca3af] font-normal">({entryCount})</span>
          )}
        </h3>
      </div>

      {/* Entries */}
      <div className="flex flex-col">
        {hasEntries ? (
          entries.map((entry, idx) => {
            const isExpanded = expandedEntries.includes(entry.id)
            return (
              <div key={entry.id} className="border-b border-[#e8eaef] last:border-b-0">
                {/* Entry header row */}
                <div className="flex items-center gap-[8px] px-[20px] py-[12px]">
                  {/* Drag handle */}
                  <button
                    type="button"
                    className="flex items-center justify-center size-[28px] rounded-[4px] hover:bg-[#f3f4f6] border-0 bg-transparent cursor-grab p-0"
                    aria-label="Drag to reorder"
                  >
                    <DragIcon size={16} color="#9ca3af" />
                  </button>

                  {/* Expand / collapse toggle */}
                  <button
                    type="button"
                    onClick={() => onToggleEntry(entry.id)}
                    className="flex items-center justify-center size-[28px] rounded-[4px] hover:bg-[#fff3e8] border-0 bg-transparent cursor-pointer p-0"
                    aria-label={isExpanded ? 'Collapse entry' : 'Expand entry'}
                    aria-expanded={isExpanded}
                  >
                    {isExpanded ? (
                      <ChevronUpIcon size={14} color="#ff7e1b" />
                    ) : (
                      <ChevronDownIcon size={14} color="#6b7280" />
                    )}
                  </button>

                  {/* Entry label */}
                  <span className="flex-1 font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#4b5563] truncate">
                    {entry.question || `Entry ${idx + 1}`}
                  </span>

                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={() => onDeleteEntry(category.id, entry.id)}
                    className="flex items-center justify-center size-[28px] rounded-[4px] hover:bg-red-50 border-0 bg-transparent cursor-pointer p-0"
                    aria-label={`Delete entry ${idx + 1}`}
                  >
                    <TrashIcon size={15} color="#9ca3af" />
                  </button>
                </div>

                {/* Expanded form */}
                {isExpanded && (
                  <div className="px-[20px] pb-[20px]">
                    <FaqEntryForm
                      entry={entry}
                      index={idx}
                      onUpdate={(i, field, value) => onUpdateEntry(category.id, entry.id, field, value)}
                      onDelete={() => onDeleteEntry(category.id, entry.id)}
                    />
                  </div>
                )}
              </div>
            )
          })
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-[32px] px-[20px] gap-[8px]">
            <p className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#9ca3af] text-center m-0 leading-[1.6]">
              {'\u0e22\u0e31\u0e07\u0e44\u0e21\u0e48\u0e21\u0e35\u0e02\u0e49\u0e2d\u0e21\u0e39\u0e25 \u0e04\u0e25\u0e34\u0e01\u0e17\u0e35\u0e48\u0e1b\u0e38\u0e48\u0e21\u0e14\u0e49\u0e32\u0e19\u0e25\u0e48\u0e32\u0e07\u0e40\u0e1e\u0e37\u0e48\u0e2d\u0e40\u0e1e\u0e34\u0e48\u0e21\u0e02\u0e49\u0e2d\u0e21\u0e39\u0e25\u0e40\u0e02\u0e49\u0e32\u0e44\u0e1b'}
            </p>
          </div>
        )}

        {/* Add an entry button */}
        <div className="px-[20px] py-[12px] border-t border-[#e8eaef]">
          <button
            type="button"
            onClick={() => onAddEntry(category.id)}
            className="flex items-center gap-[6px] text-[#ff7e1b] font-['IBM_Plex_Sans_Thai'] font-medium text-[13px] bg-transparent border-0 cursor-pointer p-0 hover:underline"
          >
            <PlusIcon size={14} color="#ff7e1b" />
            <span>Add an entry</span>
          </button>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Main page component                                                */
/* ------------------------------------------------------------------ */

export default function FaqCreatePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()

  const [activeTab, setActiveTab] = useState('draft')
  const [showLocalePicker, setShowLocalePicker] = useState(false)

  /* FAQ entries state: keyed by category id */
  const [faqData, setFaqData] = useState(() => {
    const initial = {}
    FAQ_CATEGORIES.forEach((cat) => {
      initial[cat.id] = []
    })
    /* First category starts with one empty entry expanded */
    const firstId = 'entry-init-1'
    initial[FAQ_CATEGORIES[0].id] = [
      { id: firstId, question: '', answer: '' },
    ]
    return initial
  })

  /* Track which entries are expanded */
  const [expandedEntries, setExpandedEntries] = useState(['entry-init-1'])

  const tabs = [
    { key: 'draft', label: 'DRAFT' },
    { key: 'published', label: 'PUBLISHED' },
  ]

  /* ---- handlers ---- */

  const handleToggleEntry = (entryId) => {
    setExpandedEntries((prev) =>
      prev.includes(entryId)
        ? prev.filter((id) => id !== entryId)
        : [...prev, entryId]
    )
  }

  const handleAddEntry = (categoryId) => {
    const newId = `entry-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    setFaqData((prev) => ({
      ...prev,
      [categoryId]: [
        ...prev[categoryId],
        { id: newId, question: '', answer: '' },
      ],
    }))
    setExpandedEntries((prev) => [...prev, newId])
  }

  const handleDeleteEntry = (categoryId, entryId) => {
    setFaqData((prev) => ({
      ...prev,
      [categoryId]: prev[categoryId].filter((e) => e.id !== entryId),
    }))
    setExpandedEntries((prev) => prev.filter((id) => id !== entryId))
  }

  const handleUpdateEntry = (categoryId, entryId, field, value) => {
    setFaqData((prev) => ({
      ...prev,
      [categoryId]: prev[categoryId].map((e) =>
        e.id === entryId ? { ...e, [field]: value } : e
      ),
    }))
  }

  /* ---- Submit handler: create each FAQ entry as a separate record ---- */
  const handleSubmit = (publish) => {
    startTransition(async () => {
      const allEntries = Object.values(faqData).flat().filter((e) => e.question.trim())
      if (allEntries.length === 0) {
        toast.error('กรุณากรอกคำถามอย่างน้อย 1 รายการ')
        return
      }

      for (const entry of allEntries) {
        const formData = new FormData()
        formData.set('question', entry.question)
        formData.set('answer', entry.answer)
        formData.set('published', publish ? 'true' : 'false')
        const result = await createFaq(formData)
        if (result.error) {
          toast.error('เกิดข้อผิดพลาด: ' + result.error)
          return
        }
      }

      router.push('/admin/faq')
      router.refresh()
    })
  }

  return (
    <div className={`flex flex-col gap-0 h-full min-h-0 ${isPending ? 'opacity-60 pointer-events-none' : ''}`}>
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
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowLocalePicker(!showLocalePicker)}
              className="flex items-center gap-[8px] border border-[#e5e7eb] rounded-[8px] px-[12px] py-[6px] cursor-pointer hover:bg-[#f9fafb] bg-white transition-colors"
            >
              <span className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#4b5563]">Thai (th)</span>
              <ChevronDownIcon />
            </button>
            {showLocalePicker && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowLocalePicker(false)} />
                <div className="absolute top-full right-0 mt-[4px] z-50 bg-white border border-[#e8eaef] rounded-[8px] shadow-lg overflow-hidden min-w-[140px]">
                  <button
                    type="button"
                    onClick={() => setShowLocalePicker(false)}
                    className="w-full text-left px-[14px] py-[10px] border-0 cursor-pointer bg-[#fff3e8] text-[#ff7e1b] font-['IBM_Plex_Sans_Thai'] text-[13px]"
                  >
                    Thai (th)
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowLocalePicker(false)}
                    className="w-full text-left px-[14px] py-[10px] border-0 cursor-pointer bg-transparent text-[#374151] hover:bg-[#f3f4f6] font-['IBM_Plex_Sans_Thai'] text-[13px]"
                  >
                    English (en)
                  </button>
                </div>
              </>
            )}
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
      <div className="flex gap-0 border-b border-[#e5e7eb]" role="tablist" aria-label="FAQ status tabs">
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
        {/* ---- Main content area: category sections ---- */}
        <div className="flex-1 flex flex-col gap-[24px] min-w-0">
          {FAQ_CATEGORIES.map((category) => (
            <CategorySection
              key={category.id}
              category={category}
              entries={faqData[category.id]}
              expandedEntries={expandedEntries}
              onToggleEntry={handleToggleEntry}
              onAddEntry={handleAddEntry}
              onDeleteEntry={handleDeleteEntry}
              onUpdateEntry={handleUpdateEntry}
            />
          ))}
        </div>

        {/* ---- Right sidebar: ENTRY panel ---- */}
        <aside className="w-[260px] shrink-0 flex flex-col gap-[16px]">
          <div className="bg-white rounded-[12px] border border-[#e8eaef] p-[20px] flex flex-col gap-[16px]">
            <h3 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[12px] text-[#9ca3af] tracking-[0.8px] uppercase m-0">
              Entry
            </h3>

            {/* Publish button + 3-dot menu */}
            <div className="flex items-center gap-[8px]">
              <button
                type="button"
                onClick={() => handleSubmit(true)}
                disabled={isPending}
                className="flex-1 flex items-center justify-center gap-[6px] px-[16px] py-[8px] rounded-[8px] bg-[#ff7e1b] text-white font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] border-0 cursor-pointer hover:bg-[#e56f15] transition-colors disabled:opacity-50"
              >
                {isPending ? 'กำลังบันทึก...' : 'เผยแพร่'}
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
              onClick={() => handleSubmit(false)}
              disabled={isPending}
              className="w-full flex items-center justify-center px-[16px] py-[8px] rounded-[8px] bg-white text-[#ff7e1b] font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] border border-[#ff7e1b] cursor-pointer hover:bg-[#fff8f3] transition-colors disabled:opacity-50"
            >
              {'\u0e1a\u0e31\u0e19\u0e17\u0e36\u0e01'}
            </button>
          </div>
        </aside>
      </div>
    </div>
  )
}
