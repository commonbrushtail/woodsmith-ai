'use client'

import { useState, useRef, useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/lib/toast-context'
import { createFaqGroup, updateFaqGroup, deleteFaqGroup, reorderFaqGroups, toggleFaqGroupPublished } from '@/lib/actions/faq-groups'
import { createFaq, updateFaq, deleteFaq, reorderFaqs } from '@/lib/actions/faqs'
import { buildSortOrderUpdates } from '@/lib/reorder'
import { validateFile, compressImage } from '@/lib/upload-validation'
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

/* ------------------------------------------------------------------ */
/*  SVG Icons                                                          */
/* ------------------------------------------------------------------ */

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

function PlusIcon({ size = 18, color = '#ff7e1b' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

function TrashIcon({ size = 16, color = '#9ca3af' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  )
}

function ChevronIcon({ isOpen, size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={isOpen ? '#ff7e1b' : '#6b7280'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

function ImageIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  )
}

function SpinnerIcon() {
  return (
    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff7e1b" strokeWidth="2.5" strokeLinecap="round">
      <path d="M12 2a10 10 0 0 1 10 10" />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  Sortable Group wrapper                                             */
/* ------------------------------------------------------------------ */

function SortableGroupWrapper({ id, children }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: 'relative',
    zIndex: isDragging ? 10 : 'auto',
  }

  return (
    <div ref={setNodeRef} style={style}>
      {children({ dragAttributes: attributes, dragListeners: listeners })}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Sortable FAQ item row                                              */
/* ------------------------------------------------------------------ */

function SortableFaqRow({ id, children }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: 'relative',
    zIndex: isDragging ? 10 : 'auto',
  }

  return (
    <div ref={setNodeRef} style={style}>
      {children({ dragAttributes: attributes, dragListeners: listeners })}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  FAQ Item (Q&A row within a group)                                  */
/* ------------------------------------------------------------------ */

function FaqItem({ faq, isExpanded, onToggle, onUpdate, onDelete, disabled, dragAttributes, dragListeners }) {
  const [question, setQuestion] = useState(faq.question || '')
  const [answer, setAnswer] = useState(faq.answer || '')
  const [isSaving, setIsSaving] = useState(false)

  // Sync with server data
  useEffect(() => {
    setQuestion(faq.question || '')
    setAnswer(faq.answer || '')
  }, [faq.question, faq.answer])

  const handleSave = async () => {
    if (question === faq.question && answer === faq.answer) return
    setIsSaving(true)
    const formData = new FormData()
    formData.set('question', question)
    formData.set('answer', answer)
    await onUpdate(faq.id, formData)
    setIsSaving(false)
  }

  return (
    <div className="border-b border-[#e8eaef] last:border-b-0">
      {/* Collapsed row */}
      <div className="flex items-center gap-[8px] px-[16px] py-[10px]">
        <button
          type="button"
          className="flex items-center justify-center size-[28px] rounded-[4px] hover:bg-[#f3f4f6] border-0 bg-transparent cursor-grab active:cursor-grabbing p-0 touch-none"
          aria-label="ลากเพื่อจัดเรียง"
          {...dragAttributes}
          {...dragListeners}
        >
          <GripIcon />
        </button>

        <button
          type="button"
          onClick={onToggle}
          className="flex items-center justify-center size-[28px] rounded-[4px] hover:bg-[#fff3e8] border-0 bg-transparent cursor-pointer p-0"
        >
          <ChevronIcon isOpen={isExpanded} />
        </button>

        <span className="flex-1 font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#4b5563] truncate">
          {faq.question || 'คำถามใหม่'}
        </span>

        {isSaving && <SpinnerIcon />}

        <button
          type="button"
          onClick={() => onDelete(faq.id)}
          disabled={disabled}
          className="flex items-center justify-center size-[28px] rounded-[4px] hover:bg-red-50 border-0 bg-transparent cursor-pointer p-0"
          aria-label="ลบคำถาม"
        >
          <TrashIcon size={15} color="#9ca3af" />
        </button>
      </div>

      {/* Expanded form */}
      {isExpanded && (
        <div className="px-[16px] pb-[16px] flex flex-col gap-[12px] ml-[64px]">
          <div className="flex flex-col gap-[4px]">
            <label className="font-['IBM_Plex_Sans_Thai'] text-[12px] font-medium text-[#6b7280]">คำถาม</label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onBlur={handleSave}
              placeholder="กรอกคำถาม"
              className="w-full font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border border-[#e8eaef] rounded-[8px] px-[12px] py-[8px] outline-none focus:border-[#ff7e1b] focus:ring-1 focus:ring-[#ff7e1b]/20 transition-all placeholder:text-[#bfbfbf]"
            />
          </div>
          <div className="flex flex-col gap-[4px]">
            <label className="font-['IBM_Plex_Sans_Thai'] text-[12px] font-medium text-[#6b7280]">คำตอบ</label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onBlur={handleSave}
              placeholder="กรอกคำตอบ"
              rows={3}
              className="w-full font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border border-[#e8eaef] rounded-[8px] px-[12px] py-[8px] outline-none resize-y focus:border-[#ff7e1b] focus:ring-1 focus:ring-[#ff7e1b]/20 transition-all placeholder:text-[#bfbfbf]"
            />
          </div>
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  FAQ Group Card                                                     */
/* ------------------------------------------------------------------ */

function FaqGroupCard({ group, dragAttributes, dragListeners }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [expandedFaqs, setExpandedFaqs] = useState(new Set())
  const [groupName, setGroupName] = useState(group.name)
  const [faqs, setFaqs] = useState(group.faqs || [])
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const imageInputRef = useRef(null)

  // Sync with server data
  useEffect(() => {
    setGroupName(group.name)
    setFaqs(group.faqs || [])
  }, [group.name, group.faqs])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  /* ---- Group actions ---- */

  const handleNameBlur = () => {
    if (groupName === group.name || !groupName.trim()) {
      setGroupName(group.name)
      return
    }
    startTransition(async () => {
      const formData = new FormData()
      formData.set('name', groupName.trim())
      const result = await updateFaqGroup(group.id, formData)
      if (result.error) toast.error(result.error)
      router.refresh()
    })
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const validation = validateFile(file)
    if (!validation.valid) {
      toast.error(validation.error)
      e.target.value = ''
      return
    }

    const compressed = await compressImage(file)
    setIsUploadingImage(true)
    try {
      const formData = new FormData()
      formData.set('image', compressed)
      const result = await updateFaqGroup(group.id, formData)
      if (result.error) toast.error(result.error)
      router.refresh()
    } catch {
      toast.error('อัปโหลดรูปภาพไม่สำเร็จ')
    } finally {
      setIsUploadingImage(false)
      e.target.value = ''
    }
  }

  const handleRemoveImage = () => {
    startTransition(async () => {
      const formData = new FormData()
      formData.set('remove_image', 'true')
      const result = await updateFaqGroup(group.id, formData)
      if (result.error) toast.error(result.error)
      router.refresh()
    })
  }

  const handleDeleteGroup = () => {
    const faqCount = faqs.length
    const msg = faqCount > 0
      ? `กลุ่มนี้มี ${faqCount} คำถาม จะถูกลบทั้งหมด ต้องการดำเนินการ?`
      : 'ต้องการลบกลุ่มนี้หรือไม่?'
    if (!confirm(msg)) return
    startTransition(async () => {
      const result = await deleteFaqGroup(group.id)
      if (result.error) toast.error(result.error)
      router.refresh()
    })
  }

  const handleTogglePublished = () => {
    startTransition(async () => {
      const result = await toggleFaqGroupPublished(group.id, !group.published)
      if (result.error) toast.error(result.error)
      router.refresh()
    })
  }

  /* ---- FAQ item actions ---- */

  const handleAddFaq = () => {
    startTransition(async () => {
      const formData = new FormData()
      formData.set('group_id', group.id)
      formData.set('question', '')
      formData.set('answer', '')
      formData.set('published', 'true')
      const result = await createFaq(formData)
      if (result.error) {
        toast.error(result.error)
      } else if (result.data) {
        setExpandedFaqs(prev => new Set([...prev, result.data.id]))
      }
      router.refresh()
    })
  }

  const handleUpdateFaq = async (id, formData) => {
    const result = await updateFaq(id, formData)
    if (result.error) toast.error(result.error)
    router.refresh()
  }

  const handleDeleteFaq = (id) => {
    if (!confirm('ต้องการลบคำถามนี้หรือไม่?')) return
    startTransition(async () => {
      const result = await deleteFaq(id)
      if (result.error) toast.error(result.error)
      else setFaqs(prev => prev.filter(f => f.id !== id))
      router.refresh()
    })
  }

  const handleFaqDragEnd = (event) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = faqs.findIndex(f => f.id === active.id)
    const newIndex = faqs.findIndex(f => f.id === over.id)
    const reordered = arrayMove(faqs, oldIndex, newIndex)
    setFaqs(reordered)

    startTransition(async () => {
      const updates = buildSortOrderUpdates(reordered)
      const result = await reorderFaqs(updates)
      if (result.error) {
        toast.error('เกิดข้อผิดพลาดในการเรียงลำดับ')
        setFaqs(group.faqs || [])
      }
    })
  }

  const toggleFaqExpanded = (id) => {
    setExpandedFaqs(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className={`bg-white rounded-[12px] border border-[#e8eaef] overflow-hidden ${isPending || isUploadingImage ? 'opacity-60 pointer-events-none' : ''}`}>
      {/* Group header */}
      <div className="flex items-center gap-[8px] px-[16px] py-[12px] bg-[#fafafa] border-b border-[#e8eaef]">
        {/* Drag handle */}
        <button
          type="button"
          className="flex items-center justify-center size-[32px] rounded-[4px] hover:bg-[#f3f4f6] border-0 bg-transparent cursor-grab active:cursor-grabbing p-0 shrink-0 touch-none"
          aria-label="ลากเพื่อจัดเรียงกลุ่ม"
          {...dragAttributes}
          {...dragListeners}
        >
          <GripIcon />
        </button>

        {/* Collapse toggle */}
        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center justify-center size-[32px] rounded-[4px] hover:bg-[#fff3e8] border-0 bg-transparent cursor-pointer p-0 shrink-0"
        >
          <ChevronIcon isOpen={!isCollapsed} />
        </button>

        {/* Group name input */}
        <input
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          onBlur={handleNameBlur}
          onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur() }}
          className="flex-1 font-['IBM_Plex_Sans_Thai'] font-semibold text-[14px] text-[#1f2937] bg-transparent border-0 outline-none px-[8px] py-[4px] rounded-[4px] hover:bg-white focus:bg-white focus:ring-1 focus:ring-[#ff7e1b]/20 transition-all min-w-0"
        />

        {/* FAQ count */}
        <span className="font-['IBM_Plex_Sans_Thai'] text-[12px] text-[#9ca3af] shrink-0">
          {faqs.length} คำถาม
        </span>

        {/* Published toggle */}
        <button
          type="button"
          onClick={handleTogglePublished}
          className={`inline-flex items-center px-[10px] py-[2px] rounded-full font-['IBM_Plex_Sans_Thai'] text-[11px] font-medium leading-[1.8] border-0 cursor-pointer transition-colors shrink-0 ${
            group.published
              ? 'bg-[#22c55e]/10 text-[#16a34a] hover:bg-[#22c55e]/20'
              : 'bg-[#3b82f6]/10 text-[#3b82f6] hover:bg-[#3b82f6]/20'
          }`}
        >
          {group.published ? 'Published' : 'Draft'}
        </button>

        {/* Delete group */}
        <button
          type="button"
          onClick={handleDeleteGroup}
          className="flex items-center justify-center size-[32px] rounded-[4px] hover:bg-red-50 border-0 bg-transparent cursor-pointer p-0 shrink-0"
          aria-label="ลบกลุ่ม"
        >
          <TrashIcon size={16} color="#ef4444" />
        </button>
      </div>

      {/* Collapsed content */}
      {!isCollapsed && (
        <>
          {/* Group image */}
          <div className="px-[16px] pt-[12px] pb-[4px]">
            <div className="flex items-center gap-[12px]">
              {/* Image thumbnail or placeholder */}
              <div
                onClick={() => imageInputRef.current?.click()}
                className="shrink-0 w-[100px] h-[72px] rounded-[6px] overflow-hidden border border-[#e5e7eb] cursor-pointer hover:border-[#d1d5db] transition-colors relative flex items-center justify-center bg-[#fafafa]"
              >
                {isUploadingImage ? (
                  <SpinnerIcon />
                ) : group.image_url ? (
                  <img src={group.image_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon />
                )}
              </div>
              <div className="flex flex-col gap-[4px]">
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  disabled={isUploadingImage}
                  className="font-['IBM_Plex_Sans_Thai'] text-[12px] text-[#ff7e1b] bg-transparent border-0 cursor-pointer p-0 hover:underline text-left"
                >
                  {group.image_url ? 'เปลี่ยนรูปภาพ' : 'อัปโหลดรูปภาพ'}
                </button>
                {group.image_url && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="font-['IBM_Plex_Sans_Thai'] text-[12px] text-[#ef4444] bg-transparent border-0 cursor-pointer p-0 hover:underline text-left"
                  >
                    ลบรูปภาพ
                  </button>
                )}
                <p className="font-['IBM_Plex_Sans_Thai'] text-[11px] text-[#9ca3af] m-0">
                  JPEG, PNG, WebP (สูงสุด 5MB)
                </p>
              </div>
              <input
                ref={imageInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
          </div>

          {/* FAQ items */}
          <div className="mt-[8px]">
            {faqs.length > 0 ? (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleFaqDragEnd}>
                <SortableContext items={faqs.map(f => f.id)} strategy={verticalListSortingStrategy}>
                  {faqs.map(faq => (
                    <SortableFaqRow key={faq.id} id={faq.id}>
                      {({ dragAttributes: faqDragAttr, dragListeners: faqDragLis }) => (
                        <FaqItem
                          faq={faq}
                          isExpanded={expandedFaqs.has(faq.id)}
                          onToggle={() => toggleFaqExpanded(faq.id)}
                          onUpdate={handleUpdateFaq}
                          onDelete={handleDeleteFaq}
                          disabled={isPending}
                          dragAttributes={faqDragAttr}
                          dragListeners={faqDragLis}
                        />
                      )}
                    </SortableFaqRow>
                  ))}
                </SortableContext>
              </DndContext>
            ) : (
              <div className="flex items-center justify-center py-[24px]">
                <p className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#9ca3af] m-0">
                  ยังไม่มีคำถาม คลิกปุ่มด้านล่างเพื่อเพิ่ม
                </p>
              </div>
            )}

            {/* Add FAQ button */}
            <div className="px-[16px] py-[10px] border-t border-[#e8eaef]">
              <button
                type="button"
                onClick={handleAddFaq}
                disabled={isPending}
                className="flex items-center gap-[6px] text-[#ff7e1b] font-['IBM_Plex_Sans_Thai'] font-medium text-[13px] bg-transparent border-0 cursor-pointer p-0 hover:underline disabled:opacity-50"
              >
                <PlusIcon size={14} color="#ff7e1b" />
                <span>เพิ่มคำถาม</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function FaqPageClient({ groups: initialGroups }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [groups, setGroups] = useState(initialGroups)

  // Sync with server data
  useEffect(() => {
    setGroups(initialGroups)
  }, [initialGroups])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleAddGroup = () => {
    startTransition(async () => {
      const formData = new FormData()
      formData.set('name', 'กลุ่มใหม่')
      const result = await createFaqGroup(formData)
      if (result.error) toast.error(result.error)
      router.refresh()
    })
  }

  const handleGroupDragEnd = (event) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = groups.findIndex(g => g.id === active.id)
    const newIndex = groups.findIndex(g => g.id === over.id)
    const reordered = arrayMove(groups, oldIndex, newIndex)
    setGroups(reordered)

    startTransition(async () => {
      const updates = buildSortOrderUpdates(reordered)
      const result = await reorderFaqGroups(updates)
      if (result.error) {
        toast.error('เกิดข้อผิดพลาดในการเรียงลำดับ')
        setGroups(initialGroups)
      }
    })
  }

  return (
    <div className={`flex flex-col gap-0 h-full min-h-0 ${isPending ? 'opacity-60 pointer-events-none' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between py-[12px]">
        <div className="flex items-center gap-[12px]">
          <h1 className="font-['IBM_Plex_Sans_Thai'] font-bold text-[22px] text-[#1f2937] m-0">
            คำถามที่พบบ่อย (FAQs)
          </h1>
          <span className="inline-flex items-center justify-center min-w-[28px] h-[24px] px-[8px] rounded-full bg-[#f3f4f6] font-['IBM_Plex_Sans_Thai'] text-[13px] font-medium text-[#6b7280]">
            {groups.length} กลุ่ม
          </span>
        </div>

        <button
          type="button"
          onClick={handleAddGroup}
          disabled={isPending}
          className="flex items-center gap-[6px] px-[16px] py-[8px] rounded-[8px] bg-[#ff7e1b] text-white font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] border-0 cursor-pointer hover:bg-[#e56f15] transition-colors disabled:opacity-50"
        >
          <PlusIcon size={16} color="white" />
          <span>เพิ่มกลุ่ม</span>
        </button>
      </div>

      {/* Groups */}
      <div className="flex-1 overflow-y-auto pb-[32px] mt-[8px]">
        {groups.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-[60px] gap-[12px]">
            <p className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#9ca3af] m-0">
              ยังไม่มีกลุ่มคำถาม
            </p>
            <button
              type="button"
              onClick={handleAddGroup}
              className="flex items-center gap-[6px] text-[#ff7e1b] font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] bg-transparent border-0 cursor-pointer p-0 hover:underline"
            >
              <PlusIcon size={16} color="#ff7e1b" />
              <span>สร้างกลุ่มแรก</span>
            </button>
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleGroupDragEnd}>
            <SortableContext items={groups.map(g => g.id)} strategy={verticalListSortingStrategy}>
              <div className="flex flex-col gap-[16px]">
                {groups.map(group => (
                  <SortableGroupWrapper key={group.id} id={group.id}>
                    {({ dragAttributes, dragListeners }) => (
                      <FaqGroupCard
                        group={group}
                        dragAttributes={dragAttributes}
                        dragListeners={dragListeners}
                      />
                    )}
                  </SortableGroupWrapper>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  )
}
