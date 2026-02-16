'use client'

import { useState, useRef, useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useToast } from '@/lib/toast-context'
import { deleteVideoHighlight, toggleVideoHighlightPublished, reorderVideoHighlights } from '@/lib/actions/video-highlights'
import { buildSortOrderUpdates } from '@/lib/reorder'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

function FilterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  )
}

function ChevronDownIcon({ className = '' }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

function SettingsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}

function DotsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="19" r="1" />
    </svg>
  )
}

function EditIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

function SortArrowIcon({ ascending }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      stroke="#6b7280"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`transition-transform ${ascending ? '' : 'rotate-180'}`}
    >
      <path d="M3 4.5L6 7.5L9 4.5" />
    </svg>
  )
}

function GripIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="#9ca3af">
      <circle cx="6" cy="4" r="1.5" />
      <circle cx="10" cy="4" r="1.5" />
      <circle cx="6" cy="8" r="1.5" />
      <circle cx="10" cy="8" r="1.5" />
      <circle cx="6" cy="12" r="1.5" />
      <circle cx="10" cy="12" r="1.5" />
    </svg>
  )
}

function SortableRow({ id, children, onClick }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: 'relative',
    zIndex: isDragging ? 10 : 'auto',
  }
  return (
    <tr ref={setNodeRef} style={style} onClick={onClick} className="border-t border-[#f3f4f6] hover:bg-[#fafafa] transition-colors cursor-pointer">
      <td className="px-[8px] py-[10px] w-[40px]">
        <button type="button" className="flex items-center justify-center size-[28px] cursor-grab active:cursor-grabbing rounded-[4px] hover:bg-[#f3f4f6] border-0 bg-transparent touch-none" aria-label="ลากเพื่อจัดเรียง" {...attributes} {...listeners}>
          <GripIcon />
        </button>
      </td>
      {children}
    </tr>
  )
}

export default function VideoHighlightsListClient({ highlights, totalCount }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRows, setSelectedRows] = useState([])
  const [sortAsc, setSortAsc] = useState(true)
  const [openMenuId, setOpenMenuId] = useState(null)
  const [orderedHighlights, setOrderedHighlights] = useState(highlights)
  const menuRef = useRef(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null)
      }
    }
    if (openMenuId !== null) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [openMenuId])

  const allSelected = selectedRows.length === highlights.length && highlights.length > 0
  const someSelected = selectedRows.length > 0 && !allSelected

  function toggleSelectAll() {
    setSelectedRows(allSelected ? [] : highlights.map((h) => h.id))
  }

  function toggleSelectRow(id) {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    )
  }

  const sortedHighlights = [...orderedHighlights].sort((a, b) =>
    sortAsc
      ? (a.sort_order ?? 0) - (b.sort_order ?? 0)
      : (b.sort_order ?? 0) - (a.sort_order ?? 0)
  )

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = sortedHighlights.findIndex((h) => h.id === active.id)
    const newIndex = sortedHighlights.findIndex((h) => h.id === over.id)
    const reordered = arrayMove(sortedHighlights, oldIndex, newIndex)
    const withUpdatedOrder = reordered.map((item, i) => ({ ...item, sort_order: i }))
    setOrderedHighlights(withUpdatedOrder)
    startTransition(async () => {
      const result = await reorderVideoHighlights(buildSortOrderUpdates(withUpdatedOrder))
      if (result.error) {
        toast.error('เกิดข้อผิดพลาดในการจัดเรียง: ' + result.error)
        setOrderedHighlights(highlights)
      }
      router.refresh()
    })
  }

  const handleDelete = (id) => {
    if (!confirm('ต้องการลบวิดีโอไฮไลท์นี้หรือไม่?')) return
    startTransition(async () => {
      const result = await deleteVideoHighlight(id)
      if (result.error) toast.error('เกิดข้อผิดพลาด: ' + result.error)
      setOpenMenuId(null)
      router.refresh()
    })
  }

  const handleTogglePublished = (id, current) => {
    startTransition(async () => {
      await toggleVideoHighlightPublished(id, !current)
      router.refresh()
    })
  }

  function renderPublishBadge(highlight) {
    return (
      <button onClick={() => handleTogglePublished(highlight.id, highlight.published)} className="cursor-pointer bg-transparent border-none p-0">
        {highlight.published ? (
          <span className="inline-flex items-center gap-[4px] rounded-full border border-[#22c55e] text-[#16a34a] bg-[#f0fdf4] px-[10px] py-[2px] text-[12px] font-medium leading-[20px] whitespace-nowrap">
            {'เผยแพร่'}
          </span>
        ) : (
          <span className="inline-flex items-center gap-[4px] rounded-full border border-[#d1d5db] text-[#6b7280] bg-[#f9fafb] px-[10px] py-[2px] text-[12px] font-medium leading-[20px] whitespace-nowrap">
            {'ไม่เผยแพร่'}
          </span>
        )}
      </button>
    )
  }

  return (
    <div className={`font-['IBM_Plex_Sans_Thai'] flex flex-col gap-[20px] ${isPending ? 'opacity-60 pointer-events-none' : ''}`}>
      {/* Page header */}
      <div className="flex items-center justify-between py-[12px]">
        <div className="flex flex-col gap-[2px]">
          <h1 className="text-[22px] font-bold text-[#1f2937] m-0 leading-[1.3]">
            {'วิดีโอไฮไลท์'} (Video Highlight)
          </h1>
          <p className="text-[13px] text-[#6b7280] m-0">
            {totalCount} entries found
          </p>
        </div>
        <div className="flex items-center gap-[12px]">
          <Link
            href="/admin/video-highlight/create"
            className="inline-flex items-center gap-[6px] bg-[#ff7e1b] hover:bg-[#e96d0f] text-white text-[14px] font-semibold rounded-[8px] px-[16px] py-[9px] no-underline transition-colors"
          >
            <PlusIcon />
            Create new entry
          </Link>
          <div className="flex items-center gap-[8px] border border-[#e5e7eb] rounded-[8px] px-[12px] py-[6px] cursor-pointer hover:bg-[#f9fafb] transition-colors">
            <span className="text-[13px] text-[#4b5563]">Thai (th)</span>
            <ChevronDownIcon className="text-[#6b7280]" />
          </div>
          <button className="size-[32px] flex items-center justify-center rounded-[8px] hover:bg-gray-100 cursor-pointer bg-transparent border-none" aria-label="Settings">
            <SettingsIcon />
          </button>
        </div>
      </div>

      {/* Search + Filter bar */}
      <div className="flex items-center justify-between gap-[12px]">
        <div className="flex items-center gap-[10px] flex-1">
          <div className="relative flex-1 max-w-[360px]">
            <div className="absolute left-[10px] top-1/2 -translate-y-1/2 pointer-events-none">
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder={'ค้นหา...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-[38px] pl-[36px] pr-[12px] border border-[#e5e7eb] rounded-[8px] text-[13px] text-[#374151] placeholder-[#9ca3af] outline-none focus:border-[#ff7e1b] focus:ring-1 focus:ring-[#ff7e1b] transition-colors bg-white"
              aria-label="Search video highlights"
            />
          </div>
          <button className="inline-flex items-center gap-[6px] h-[38px] px-[14px] border border-[#e5e7eb] rounded-[8px] bg-white text-[13px] text-[#4b5563] hover:bg-[#f9fafb] transition-colors cursor-pointer">
            <FilterIcon />
            {'ตัวกรอง'}
          </button>
        </div>
      </div>

      {/* Table */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sortedHighlights.map((h) => h.id)} strategy={verticalListSortingStrategy}>
          <div className="border border-[#e5e7eb] rounded-[10px] overflow-hidden bg-white">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[1200px]">
                <thead>
                  <tr className="bg-[#f9fafb]">
                    <th className="w-[40px] px-[8px] py-[10px]" />
                    <th className="w-[44px] px-[12px] py-[10px] text-left">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        ref={(el) => { if (el) el.indeterminate = someSelected }}
                        onChange={toggleSelectAll}
                        className="size-[16px] accent-[#ff7e1b] cursor-pointer rounded"
                        aria-label="Select all rows"
                      />
                    </th>
                    <th
                      className="w-[80px] px-[10px] py-[10px] text-left text-[12px] font-semibold text-[#6b7280] uppercase tracking-wider whitespace-nowrap cursor-pointer select-none"
                      onClick={() => setSortAsc((prev) => !prev)}
                      aria-sort={sortAsc ? 'ascending' : 'descending'}
                    >
                      <div className="flex items-center gap-[4px]">
                        <span>ORDER / {'ลำดับ'}</span>
                        <SortArrowIcon ascending={sortAsc} />
                      </div>
                    </th>
                    <th className="px-[10px] py-[10px] text-left text-[12px] font-semibold text-[#6b7280] uppercase tracking-wider whitespace-nowrap">
                      {'ชื่อไฮไลท์'}
                    </th>
                    <th className="px-[10px] py-[10px] text-left text-[12px] font-semibold text-[#6b7280] uppercase tracking-wider whitespace-nowrap">
                      {'สถานะเผยแพร่'}
                    </th>
                    <th className="w-[56px] px-[10px] py-[10px] text-center text-[12px] font-semibold text-[#6b7280] uppercase tracking-wider">
                      ACTION
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedHighlights.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-[20px] py-[40px] text-center text-[14px] text-[#9ca3af] font-['IBM_Plex_Sans_Thai']">
                        ไม่พบข้อมูลวิดีโอไฮไลท์
                      </td>
                    </tr>
                  ) : (
                    sortedHighlights.map((highlight) => (
                      <SortableRow
                        key={highlight.id}
                        id={highlight.id}
                        onClick={(e) => {
                          if (e.target.closest('button, a, input, select')) return
                          router.push('/admin/video-highlight/edit/' + highlight.id)
                        }}
                      >
                        <td className="px-[12px] py-[10px]">
                          <input
                            type="checkbox"
                            checked={selectedRows.includes(highlight.id)}
                            onChange={() => toggleSelectRow(highlight.id)}
                            className="size-[16px] accent-[#ff7e1b] cursor-pointer rounded"
                            aria-label={`Select highlight ${highlight.sort_order}`}
                          />
                        </td>
                        <td className="px-[10px] py-[10px] text-[13px] text-[#374151]">
                          {highlight.sort_order ?? '-'}
                        </td>
                        <td className="px-[10px] py-[10px] text-[13px] text-[#374151] max-w-[280px]">
                          <span className="line-clamp-2">{highlight.title}</span>
                        </td>
                        <td className="px-[10px] py-[10px]">
                          {renderPublishBadge(highlight)}
                        </td>
                        <td className="px-[10px] py-[10px] text-center">
                          <div className="relative inline-block" ref={openMenuId === highlight.id ? menuRef : null}>
                            <button
                              onClick={() => setOpenMenuId(openMenuId === highlight.id ? null : highlight.id)}
                              className="size-[32px] inline-flex items-center justify-center rounded-[6px] hover:bg-[#f3f4f6] transition-colors cursor-pointer bg-transparent border-none"
                              aria-label={`Actions for highlight ${highlight.sort_order}`}
                              aria-haspopup="true"
                              aria-expanded={openMenuId === highlight.id}
                            >
                              <DotsIcon />
                            </button>
                            {openMenuId === highlight.id && (
                              <div className="absolute right-0 top-[36px] z-20 bg-white border border-[#e5e7eb] rounded-[8px] shadow-lg py-[4px] min-w-[140px]" role="menu">
                                <Link
                                  href={`/admin/video-highlight/edit/${highlight.id}`}
                                  className="flex items-center gap-[8px] px-[12px] py-[8px] text-[13px] text-[#374151] hover:bg-[#f9fafb] no-underline transition-colors"
                                  onClick={() => setOpenMenuId(null)}
                                  role="menuitem"
                                >
                                  <EditIcon />
                                  {'แก้ไข'}
                                </Link>
                                <button
                                  className="flex items-center gap-[8px] w-full px-[12px] py-[8px] text-[13px] text-[#ef4444] hover:bg-[#fef2f2] border-none bg-transparent cursor-pointer transition-colors"
                                  onClick={() => handleDelete(highlight.id)}
                                  role="menuitem"
                                >
                                  <TrashIcon />
                                  {'ลบ'}
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </SortableRow>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}
