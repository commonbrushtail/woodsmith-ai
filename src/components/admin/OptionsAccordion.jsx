'use client'

import { useRef } from 'react'
import { validateFile, compressImage } from '@/lib/upload-validation'

function ChevronDownIcon({ size = 12, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 4.5L6 7.5L9 4.5" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  )
}

function DotsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="19" r="1" />
    </svg>
  )
}

function PlusIcon({ size = 12, color = '#ff7e1b' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
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

function XIcon() {
  return (
    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round">
      <path d="M1.5 1.5L6.5 6.5M6.5 1.5L1.5 6.5" />
    </svg>
  )
}

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

export function flattenOptionGroups(groups) {
  return groups
    .filter(g => g.label.trim())
    .flatMap(g =>
      g.entries
        .filter(e => e.value.trim())
        .map(e => ({ type: g.label, label: e.value, image_url: e.imageUrl || null }))
    )
}

export function buildGroupsFromOptions(options) {
  const typeMap = {}
  for (const opt of options) {
    const key = opt.option_type
    if (!typeMap[key]) {
      typeMap[key] = {
        id: genId(),
        label: key,
        expanded: false,
        entries: [],
      }
    }
    typeMap[key].entries.push({
      id: opt.id || genId(),
      value: opt.label,
      imageUrl: opt.image_url || null,
      imageFile: null,
      previewUrl: null,
    })
  }
  return Object.values(typeMap)
}

function EntryImageUpload({ entry, onImageChange, onImageRemove }) {
  const fileRef = useRef(null)

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    const result = validateFile(file)
    if (!result.valid) return
    const compressed = await compressImage(file, { maxWidth: 100, maxHeight: 100, quality: 0.7 })
    const previewUrl = URL.createObjectURL(compressed)
    onImageChange(compressed, previewUrl)
  }

  const src = entry.previewUrl || entry.imageUrl
  if (src) {
    return (
      <div className="relative w-[48px] h-[48px] rounded-[6px] overflow-hidden bg-[#f3f4f6] shrink-0 group">
        <img src={src} alt="" className="w-full h-full object-cover" draggable={false} />
        <button
          type="button"
          onClick={() => {
            if (entry.previewUrl) URL.revokeObjectURL(entry.previewUrl)
            onImageRemove()
          }}
          className="absolute top-[2px] right-[2px] size-[16px] bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center border-0 cursor-pointer z-10 transition-colors opacity-0 group-hover:opacity-100"
          aria-label="Remove image"
        >
          <XIcon />
        </button>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => fileRef.current?.click()}
      className="w-[48px] h-[48px] rounded-[6px] border border-dashed border-[#d1d5db] bg-[#fafafa] hover:border-orange/50 flex items-center justify-center cursor-pointer shrink-0 transition-colors"
      aria-label="Upload option image"
    >
      <ImageIcon />
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFile}
      />
    </button>
  )
}

export default function OptionsAccordion({ groups, setGroups }) {
  const toggleExpand = (groupId) => {
    setGroups(groups.map(g => g.id === groupId ? { ...g, expanded: !g.expanded } : g))
  }

  const updateGroupLabel = (groupId, label) => {
    setGroups(groups.map(g => g.id === groupId ? { ...g, label } : g))
  }

  const addEntry = (groupId) => {
    setGroups(groups.map(g =>
      g.id === groupId
        ? { ...g, entries: [...g.entries, { id: genId(), value: '', imageFile: null, imageUrl: null, previewUrl: null }], expanded: true }
        : g
    ))
  }

  const updateEntry = (groupId, entryId, value) => {
    setGroups(groups.map(g =>
      g.id === groupId
        ? { ...g, entries: g.entries.map(e => e.id === entryId ? { ...e, value } : e) }
        : g
    ))
  }

  const updateEntryImage = (groupId, entryId, imageFile, previewUrl) => {
    setGroups(groups.map(g =>
      g.id === groupId
        ? { ...g, entries: g.entries.map(e => e.id === entryId ? { ...e, imageFile, previewUrl } : e) }
        : g
    ))
  }

  const removeEntryImage = (groupId, entryId) => {
    setGroups(groups.map(g =>
      g.id === groupId
        ? { ...g, entries: g.entries.map(e => e.id === entryId ? { ...e, imageFile: null, imageUrl: null, previewUrl: null } : e) }
        : g
    ))
  }

  const removeEntry = (groupId, entryId) => {
    setGroups(groups.map(g =>
      g.id === groupId
        ? { ...g, entries: g.entries.filter(e => e.id !== entryId) }
        : g
    ))
  }

  const removeGroup = (groupId) => {
    if (!confirm('ต้องการลบกลุ่มตัวเลือกนี้หรือไม่?')) return
    setGroups(groups.filter(g => g.id !== groupId))
  }

  const addGroup = () => {
    const newGroup = {
      id: genId(),
      label: 'ตัวเลือกใหม่',
      expanded: true,
      entries: [{ id: genId(), value: '', imageFile: null, imageUrl: null, previewUrl: null }],
    }
    setGroups([...groups, newGroup])
  }

  return (
    <section className="bg-white rounded-[12px] border border-[#e8eaef] p-[24px] flex flex-col gap-[16px]">
      <label className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
        กำหนดตัวเลือกสินค้า
      </label>

      {groups.length > 0 && (
        <div className="border border-[#e8eaef] rounded-[8px] overflow-hidden">
          {groups.map((group, gi) => (
            <div key={group.id}>
              {gi > 0 && <div className="h-px bg-[#e8eaef]" />}

              {/* Group header */}
              <div
                className={`flex items-center gap-[12px] px-[16px] py-[14px] cursor-pointer select-none transition-colors ${group.expanded ? 'bg-[#fff8f3]' : 'hover:bg-[#fafafa]'}`}
                onClick={() => toggleExpand(group.id)}
              >
                <ChevronDownIcon
                  size={12}
                  className={`text-[#6b7280] transition-transform shrink-0 ${group.expanded ? '' : '-rotate-90'}`}
                />
                <span className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] flex-1">
                  {group.label}
                </span>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removeGroup(group.id) }}
                  className="shrink-0 flex items-center justify-center border-0 bg-transparent cursor-pointer p-[4px] hover:bg-[#f3f4f6] rounded-[4px] transition-colors"
                  aria-label="Delete group"
                >
                  <TrashIcon />
                </button>
                <button
                  type="button"
                  onClick={(e) => e.stopPropagation()}
                  className="shrink-0 flex items-center justify-center border-0 bg-transparent cursor-pointer p-[4px] hover:bg-[#f3f4f6] rounded-[4px] transition-colors"
                  aria-label="More options"
                >
                  <DotsIcon />
                </button>
              </div>

              {/* Expanded content */}
              {group.expanded && (
                <div className="bg-[#fff8f3] border-t border-[#e8eaef] px-[24px] py-[20px] flex flex-col gap-[16px]">
                  {/* Group label input — updates the header title */}
                  <div className="flex-1 flex flex-col gap-[4px]">
                    <label className="font-['IBM_Plex_Sans_Thai'] text-[12px] text-[#6b7280]">
                      หัวข้อตัวเลือก <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={group.label}
                      onChange={(e) => updateGroupLabel(group.id, e.target.value)}
                      placeholder="กรอกหัวข้อตัวเลือก"
                      className="w-full font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border border-[#e8eaef] rounded-[8px] px-[14px] py-[10px] outline-none transition-all placeholder:text-[#bfbfbf] focus:border-orange focus:ring-1 focus:ring-orange/20"
                    />
                  </div>

                  {/* Option value entries */}
                  {group.entries.map((entry) => (
                    <div key={entry.id} className="flex items-start gap-[12px]">
                      <EntryImageUpload
                        entry={entry}
                        onImageChange={(file, preview) => updateEntryImage(group.id, entry.id, file, preview)}
                        onImageRemove={() => removeEntryImage(group.id, entry.id)}
                      />
                      <div className="flex-1 flex flex-col gap-[4px]">
                        <label className="font-['IBM_Plex_Sans_Thai'] text-[12px] text-[#6b7280]">
                          ตัวเลือก <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={entry.value}
                          onChange={(e) => updateEntry(group.id, entry.id, e.target.value)}
                          placeholder="เลือกพิมพ์"
                          className="w-full font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border border-[#e8eaef] rounded-[8px] px-[14px] py-[10px] outline-none transition-all placeholder:text-[#bfbfbf] focus:border-orange focus:ring-1 focus:ring-orange/20"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeEntry(group.id, entry.id)}
                        className="shrink-0 mt-[20px] flex items-center justify-center border-0 bg-transparent cursor-pointer p-[4px] hover:bg-[#f3f4f6] rounded-[4px] transition-colors"
                        aria-label="Delete entry"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => addEntry(group.id)}
                    className="flex items-center gap-[6px] border-0 bg-transparent cursor-pointer px-0 py-[4px] self-center transition-colors hover:opacity-80"
                  >
                    <PlusIcon size={12} color="#ff7e1b" />
                    <span className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-orange font-medium">
                      เพิ่มตัวเลือก
                    </span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add new group */}
      <button
        type="button"
        onClick={addGroup}
        className="flex items-center gap-[6px] border-0 bg-transparent cursor-pointer px-0 py-[4px] self-center transition-colors hover:opacity-80"
      >
        <PlusIcon size={12} color="#ff7e1b" />
        <span className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-orange font-medium">
          เพิ่มตัวเลือก
        </span>
      </button>
    </section>
  )
}
