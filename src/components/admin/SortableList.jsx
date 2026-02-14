'use client'

import { useState } from 'react'
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
    <svg width="16" height="16" viewBox="0 0 16 16" fill="#9ca3af" xmlns="http://www.w3.org/2000/svg">
      <circle cx="6" cy="4" r="1.5" />
      <circle cx="10" cy="4" r="1.5" />
      <circle cx="6" cy="8" r="1.5" />
      <circle cx="10" cy="8" r="1.5" />
      <circle cx="6" cy="12" r="1.5" />
      <circle cx="10" cy="12" r="1.5" />
    </svg>
  )
}

function SortableItem({ id, children }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: 'relative',
    zIndex: isDragging ? 10 : 'auto',
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-testid={`sortable-item-${id}`}
      className="flex items-center"
    >
      <button
        type="button"
        className="flex items-center justify-center size-[32px] cursor-grab active:cursor-grabbing rounded-[4px] hover:bg-[#f3f4f6] border-0 bg-transparent shrink-0 touch-none"
        aria-label="ลากเพื่อจัดเรียง"
        {...attributes}
        {...listeners}
      >
        <GripIcon />
      </button>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  )
}

/**
 * Sortable list wrapper using @dnd-kit.
 *
 * @param {Object} props
 * @param {Array<{id: string}>} props.items - Items to render (must have `id`)
 * @param {Function} props.onReorder - Called with new items array after drag
 * @param {Function} props.children - Render function: (item) => JSX
 */
export default function SortableList({ items, onReorder, children }) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = items.findIndex((item) => item.id === active.id)
    const newIndex = items.findIndex((item) => item.id === over.id)
    const newItems = arrayMove(items, oldIndex, newIndex)
    onReorder(newItems)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((item) => item.id)}
        strategy={verticalListSortingStrategy}
      >
        {items.map((item) => (
          <SortableItem key={item.id} id={item.id}>
            {children(item)}
          </SortableItem>
        ))}
      </SortableContext>
    </DndContext>
  )
}
