'use client'

import { useState, useTransition, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useToast } from '@/lib/toast-context'
import { deleteCategory, toggleCategoryPublished, toggleCategoryFeatured, reorderCategories } from '@/lib/actions/categories'
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

const typeLabels = {
  construction: 'วัสดุก่อสร้าง',
  decoration: 'ผลิตภัณฑ์สำเร็จ',
  tool: 'เครื่องมือ',
}

const typeBadgeColors = {
  construction: 'border-blue-400 text-blue-600 bg-blue-50',
  decoration: 'border-green-400 text-green-600 bg-green-50',
  tool: 'border-purple-400 text-purple-600 bg-purple-50',
}

function SortableRow({ id, children, onClick }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: 'relative',
    zIndex: isDragging ? 10 : 'auto',
  }

  return (
    <tr ref={setNodeRef} style={style} onClick={onClick} className="border-b border-[#f3f4f6] hover:bg-[#f9fafb] transition-colors cursor-pointer">
      <td className="px-[8px] py-[16px] w-[40px]">
        <button
          type="button"
          className="flex items-center justify-center size-[28px] cursor-grab active:cursor-grabbing rounded-[4px] hover:bg-[#f3f4f6] border-0 bg-transparent touch-none"
          aria-label="ลากเพื่อจัดเรียง"
          {...attributes}
          {...listeners}
        >
          <GripIcon />
        </button>
      </td>
      {children}
    </tr>
  )
}

function ActionMenu({ id, openMenuId, setOpenMenuId, handleDelete }) {
  const btnRef = useRef(null)
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 })

  const handleOpen = () => {
    if (openMenuId === id) {
      setOpenMenuId(null)
      return
    }
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect()
      setMenuPos({ top: rect.bottom + 4, left: rect.right })
    }
    setOpenMenuId(id)
  }

  return (
    <div className="relative inline-block">
      <button
        ref={btnRef}
        onClick={handleOpen}
        className="size-[32px] flex items-center justify-center rounded-[6px] hover:bg-[#f3f4f6] transition-colors cursor-pointer bg-transparent border-none"
        aria-label="Actions"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="#6b7280">
          <circle cx="8" cy="3" r="1.5" />
          <circle cx="8" cy="8" r="1.5" />
          <circle cx="8" cy="13" r="1.5" />
        </svg>
      </button>
      {openMenuId === id && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
          <div
            className="fixed z-20 bg-white border border-[#e5e7eb] rounded-[8px] shadow-lg py-[4px] min-w-[140px]"
            style={{ top: menuPos.top, left: menuPos.left, transform: 'translateX(-100%)' }}
          >
            <Link
              href={`/admin/categories/edit/${id}`}
              className="flex items-center gap-[8px] px-[12px] py-[8px] font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#374151] hover:bg-[#f9fafb] no-underline transition-colors"
              onClick={() => setOpenMenuId(null)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              แก้ไข
            </Link>
            <button
              className="flex items-center gap-[8px] w-full px-[12px] py-[8px] font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#ef4444] hover:bg-[#fef2f2] border-none bg-transparent cursor-pointer transition-colors"
              onClick={() => handleDelete(id)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
              ลบ
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default function CategoriesListClient({ categories, parentCategories = [] }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [openMenuId, setOpenMenuId] = useState(null)
  const [orderedCategories, setOrderedCategories] = useState(categories)
  const [searchQuery, setSearchQuery] = useState('')

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  // Build parent name lookup
  const parentNameMap = {}
  for (const p of parentCategories) {
    parentNameMap[p.id] = p.name
  }

  const filtered = searchQuery
    ? orderedCategories.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (parentNameMap[c.parent_id] || '').toLowerCase().includes(searchQuery.toLowerCase())
      )
    : orderedCategories

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = orderedCategories.findIndex(c => c.id === active.id)
    const newIndex = orderedCategories.findIndex(c => c.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return

    const reordered = arrayMove(orderedCategories, oldIndex, newIndex)
    const withUpdatedOrder = reordered.map((item, i) => ({ ...item, sort_order: i }))
    setOrderedCategories(withUpdatedOrder)

    startTransition(async () => {
      const result = await reorderCategories(buildSortOrderUpdates(withUpdatedOrder))
      if (result.error) {
        toast.error('เกิดข้อผิดพลาดในการจัดเรียง: ' + result.error)
        setOrderedCategories(categories)
      }
      router.refresh()
    })
  }

  const handleDelete = (id) => {
    const cat = orderedCategories.find(c => c.id === id)
    if (!confirm(`ต้องการลบหมวดหมู่สินค้า "${cat?.name}" หรือไม่?`)) return
    startTransition(async () => {
      const result = await deleteCategory(id)
      if (result.error) toast.error('เกิดข้อผิดพลาด: ' + result.error)
      setOpenMenuId(null)
      router.refresh()
    })
  }

  const handleTogglePublished = (id, currentPublished) => {
    setOrderedCategories(prev => prev.map(c => c.id === id ? { ...c, published: !currentPublished } : c))
    startTransition(async () => {
      const result = await toggleCategoryPublished(id, !currentPublished)
      if (result.error) {
        toast.error('เกิดข้อผิดพลาด: ' + result.error)
        setOrderedCategories(prev => prev.map(c => c.id === id ? { ...c, published: currentPublished } : c))
      }
      router.refresh()
    })
  }

  const handleToggleFeatured = (id, currentFeatured) => {
    setOrderedCategories(prev => prev.map(c => c.id === id ? { ...c, is_featured: !currentFeatured } : c))
    startTransition(async () => {
      const result = await toggleCategoryFeatured(id, !currentFeatured)
      if (result.error) {
        toast.error('เกิดข้อผิดพลาด: ' + result.error)
        setOrderedCategories(prev => prev.map(c => c.id === id ? { ...c, is_featured: currentFeatured } : c))
      }
      router.refresh()
    })
  }

  const sortableIds = filtered.map(c => c.id)

  return (
    <div className={isPending ? 'opacity-60 pointer-events-none' : ''}>
      {/* Header */}
      <div className="flex items-center justify-between py-[12px]">
        <div className="flex flex-col gap-[4px]">
          <h1 className="font-['IBM_Plex_Sans_Thai'] font-bold text-[22px] text-[#1f2937] m-0">
            หมวดหมู่สินค้า (Category)
          </h1>
          <p className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#6b7280] m-0">
            {categories.length} entries found
          </p>
        </div>
        <Link
          href="/admin/categories/create"
          className="flex items-center gap-[8px] bg-orange text-white px-[16px] py-[8px] rounded-[8px] font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] hover:bg-orange/90 transition-colors no-underline"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 1v12M1 7h12" />
          </svg>
          Create new entry
        </Link>
      </div>

      {/* Search */}
      <div className="flex items-center gap-[8px] mt-[16px] mb-[12px]">
        <div className="relative">
          <svg className="absolute left-[10px] top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาหมวดหมู่สินค้า..."
            className="w-[280px] pl-[34px] pr-[12px] py-[7px] border border-[#e5e7eb] rounded-[8px] font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#374151] outline-none focus:border-orange transition-colors placeholder:text-[#9ca3af]"
          />
        </div>
      </div>

      {/* Table */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sortableIds} strategy={verticalListSortingStrategy}>
          <div className="border border-[#e5e7eb] rounded-[12px] overflow-hidden bg-white">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-[#e5e7eb] bg-[#f9fafb]">
                    <th className="w-[40px] px-[8px] py-[12px]" />
                    <th className="px-[12px] py-[12px] text-left font-['IBM_Plex_Sans_Thai'] font-medium text-[13px] text-[#6b7280] whitespace-nowrap">
                      รูปภาพ
                    </th>
                    <th className="px-[12px] py-[12px] text-left font-['IBM_Plex_Sans_Thai'] font-medium text-[13px] text-[#6b7280] whitespace-nowrap">
                      ชื่อหมวดหมู่สินค้า
                    </th>
                    <th className="px-[12px] py-[12px] text-left font-['IBM_Plex_Sans_Thai'] font-medium text-[13px] text-[#6b7280] whitespace-nowrap">
                      ประเภทสินค้า
                    </th>
                    <th className="px-[12px] py-[12px] text-left font-['IBM_Plex_Sans_Thai'] font-medium text-[13px] text-[#6b7280] whitespace-nowrap">
                      กลุ่ม
                    </th>
                    <th className="px-[12px] py-[12px] text-left font-['IBM_Plex_Sans_Thai'] font-medium text-[13px] text-[#6b7280] whitespace-nowrap">
                      แนะนำ
                    </th>
                    <th className="px-[12px] py-[12px] text-left font-['IBM_Plex_Sans_Thai'] font-medium text-[13px] text-[#6b7280] whitespace-nowrap">
                      STATUS
                    </th>
                    <th className="w-[64px] px-[12px] py-[12px] text-center font-['IBM_Plex_Sans_Thai'] font-medium text-[13px] text-[#6b7280] whitespace-nowrap">
                      ACTION
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-[20px] py-[40px] text-center text-[14px] text-[#9ca3af] font-['IBM_Plex_Sans_Thai']">
                        {searchQuery ? 'ไม่พบรายการที่ค้นหา' : 'ยังไม่มีหมวดหมู่สินค้า'}
                      </td>
                    </tr>
                  ) : (
                    filtered.map((cat) => (
                      <SortableRow
                        key={cat.id}
                        id={cat.id}
                        onClick={(e) => {
                          if (e.target.closest('button, a, input, select')) return
                          router.push('/admin/categories/edit/' + cat.id)
                        }}
                      >
                        <td className="px-[12px] py-[16px]">
                          {cat.image_url ? (
                            <img src={cat.image_url} alt={cat.name} className="w-[48px] h-[48px] rounded-[6px] object-cover" />
                          ) : (
                            <div className="w-[48px] h-[48px] bg-[#e8e3da] rounded-[6px] flex items-center justify-center">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                <circle cx="8.5" cy="8.5" r="1.5" />
                                <polyline points="21 15 16 10 5 21" />
                              </svg>
                            </div>
                          )}
                        </td>
                        <td className="px-[12px] py-[16px]">
                          <Link href={`/admin/categories/edit/${cat.id}`} className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-semibold text-[#1f2937] no-underline hover:text-orange transition-colors">
                            {cat.name}
                          </Link>
                        </td>
                        <td className="px-[12px] py-[16px] font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#374151]">
                          {parentNameMap[cat.parent_id] || '—'}
                        </td>
                        <td className="px-[12px] py-[16px]">
                          <span className={`inline-flex items-center px-[8px] py-[2px] rounded-full border text-[11px] font-medium ${typeBadgeColors[cat.type] || 'border-gray-300 text-gray-500'}`}>
                            {typeLabels[cat.type] || cat.type}
                          </span>
                        </td>
                        <td className="px-[12px] py-[16px]">
                          <button
                            onClick={() => handleToggleFeatured(cat.id, cat.is_featured)}
                            className="cursor-pointer bg-transparent border-none p-0"
                          >
                            {cat.is_featured ? (
                              <span className="inline-flex items-center gap-[4px] px-[10px] py-[3px] rounded-full border border-amber-400 text-amber-600 bg-amber-50 font-['IBM_Plex_Sans_Thai'] text-[12px] font-medium">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                                แนะนำ
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-[10px] py-[3px] rounded-full border border-[#e5e7eb] text-[#9ca3af] font-['IBM_Plex_Sans_Thai'] text-[12px] font-medium">
                                —
                              </span>
                            )}
                          </button>
                        </td>
                        <td className="px-[12px] py-[16px]">
                          <button
                            onClick={() => handleTogglePublished(cat.id, cat.published)}
                            className="cursor-pointer bg-transparent border-none p-0"
                          >
                            {cat.published ? (
                              <span className="inline-flex items-center px-[10px] py-[3px] rounded-full border border-orange text-orange font-['IBM_Plex_Sans_Thai'] text-[12px] font-medium">
                                เผยแพร่
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-[10px] py-[3px] rounded-full border border-[#d1d5db] text-[#6b7280] font-['IBM_Plex_Sans_Thai'] text-[12px] font-medium">
                                ซ่อน
                              </span>
                            )}
                          </button>
                        </td>
                        <td className="px-[12px] py-[16px] text-center">
                          <ActionMenu
                            id={cat.id}
                            openMenuId={openMenuId}
                            setOpenMenuId={setOpenMenuId}
                            handleDelete={handleDelete}
                          />
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
