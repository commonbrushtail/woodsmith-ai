'use client'

import { useState, useEffect, useTransition } from 'react'
import { createVariationEntry } from '@/lib/actions/variations'
import { useToast } from '@/lib/toast-context'

function ChevronDownIcon({ size = 12, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 4.5L6 7.5L9 4.5" />
    </svg>
  )
}

function XIcon({ size = 16, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  )
}

function SearchIcon({ size = 16, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
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

export default function VariationLinker({ allGroups, initialLinks, onChange }) {
  const [linkedGroups, setLinkedGroups] = useState([])
  const [selectedEntries, setSelectedEntries] = useState({})
  const [expandedGroups, setExpandedGroups] = useState(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [newEntryLabels, setNewEntryLabels] = useState({})
  const [isPending, startTransition] = useTransition()
  const { addToast } = useToast()

  // Initialize state from initialLinks
  useEffect(() => {
    if (!initialLinks || initialLinks.length === 0) return

    const groupIds = new Set()
    const entries = {}

    initialLinks.forEach(link => {
      groupIds.add(link.group_id)
      if (!entries[link.group_id]) {
        entries[link.group_id] = new Set()
      }
      entries[link.group_id].add(link.entry_id)
    })

    setLinkedGroups(Array.from(groupIds))
    setSelectedEntries(entries)
    setExpandedGroups(new Set(groupIds))
  }, [initialLinks])

  // Call onChange whenever linkedGroups or selectedEntries changes
  useEffect(() => {
    const links = []
    linkedGroups.forEach(groupId => {
      const entries = selectedEntries[groupId]
      if (entries) {
        entries.forEach(entryId => {
          links.push({ group_id: groupId, entry_id: entryId })
        })
      }
    })
    onChange(links)
  }, [linkedGroups, selectedEntries, onChange])

  const handleAddGroup = (groupId) => {
    const group = allGroups.find(g => g.id === groupId)
    if (!group) return

    // Add group to linked
    setLinkedGroups(prev => [...prev, groupId])

    // Select all entries by default
    const allEntryIds = new Set(group.variation_entries?.map(e => e.id) || [])
    setSelectedEntries(prev => ({ ...prev, [groupId]: allEntryIds }))

    // Expand the group
    setExpandedGroups(prev => new Set([...prev, groupId]))

    // Close dropdown
    setDropdownOpen(false)
    setSearchQuery('')
  }

  const handleUnlinkGroup = (groupId) => {
    setLinkedGroups(prev => prev.filter(id => id !== groupId))
    setSelectedEntries(prev => {
      const updated = { ...prev }
      delete updated[groupId]
      return updated
    })
    setExpandedGroups(prev => {
      const updated = new Set(prev)
      updated.delete(groupId)
      return updated
    })
  }

  const handleToggleExpand = (groupId) => {
    setExpandedGroups(prev => {
      const updated = new Set(prev)
      if (updated.has(groupId)) {
        updated.delete(groupId)
      } else {
        updated.add(groupId)
      }
      return updated
    })
  }

  const handleToggleEntry = (groupId, entryId) => {
    setSelectedEntries(prev => {
      const updated = { ...prev }
      if (!updated[groupId]) {
        updated[groupId] = new Set()
      }
      const entries = new Set(updated[groupId])
      if (entries.has(entryId)) {
        entries.delete(entryId)
      } else {
        entries.add(entryId)
      }
      updated[groupId] = entries
      return updated
    })
  }

  const handleAddEntry = (groupId) => {
    const label = newEntryLabels[groupId]?.trim()
    if (!label) return

    startTransition(async () => {
      const formData = new FormData()
      formData.set('group_id', groupId)
      formData.set('label', label)

      const result = await createVariationEntry(formData)

      if (result.error || result.fieldErrors) {
        addToast(result.error || 'เกิดข้อผิดพลาดในการเพิ่มตัวเลือก', 'error')
        return
      }

      // Add new entry to the group's entries in local state
      const group = allGroups.find(g => g.id === groupId)
      if (group && result.data) {
        // Add to the group's variation_entries array
        if (!group.variation_entries) {
          group.variation_entries = []
        }
        group.variation_entries.push(result.data)

        // Auto-select the new entry
        setSelectedEntries(prev => {
          const updated = { ...prev }
          if (!updated[groupId]) {
            updated[groupId] = new Set()
          }
          updated[groupId] = new Set([...updated[groupId], result.data.id])
          return updated
        })

        // Clear input
        setNewEntryLabels(prev => ({ ...prev, [groupId]: '' }))

        addToast('เพิ่มตัวเลือกสำเร็จ', 'success')
      }
    })
  }

  const availableGroups = allGroups.filter(g => !linkedGroups.includes(g.id))
  const filteredGroups = availableGroups.filter(g =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <section className="bg-white rounded-[12px] border border-[#e8eaef] p-[24px] flex flex-col gap-[16px]">
      <label className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
        ตัวเลือกสินค้า (Variations)
      </label>

      {/* Group selector dropdown */}
      <div className="relative">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setDropdownOpen(true)
            }}
            onFocus={() => setDropdownOpen(true)}
            placeholder="ค้นหากลุ่มตัวเลือก..."
            className="w-full font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] border border-[#e8eaef] rounded-[8px] px-[38px] py-[10px] outline-none transition-all placeholder:text-[#bfbfbf] focus:border-orange focus:ring-1 focus:ring-orange/20"
          />
          <SearchIcon size={16} className="absolute left-[14px] top-1/2 -translate-y-1/2 text-[#6b7280]" />
        </div>

        {dropdownOpen && filteredGroups.length > 0 && (
          <div className="absolute z-10 w-full mt-[4px] bg-white border border-[#e8eaef] rounded-[8px] shadow-lg max-h-[200px] overflow-y-auto">
            {filteredGroups.map(group => (
              <div
                key={group.id}
                onClick={() => handleAddGroup(group.id)}
                className="px-[14px] py-[10px] cursor-pointer hover:bg-[#f9fafb] font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] transition-colors"
              >
                {group.name}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Linked groups */}
      {linkedGroups.length > 0 && (
        <div className="flex flex-col gap-[12px]">
          {linkedGroups.map(groupId => {
            const group = allGroups.find(g => g.id === groupId)
            if (!group) return null

            const entries = group.variation_entries || []
            const selected = selectedEntries[groupId] || new Set()
            const selectedCount = selected.size
            const totalCount = entries.length
            const isExpanded = expandedGroups.has(groupId)

            return (
              <div key={groupId} className="bg-[#f9fafb] border border-[#e8eaef] rounded-[8px] overflow-hidden">
                {/* Group header */}
                <div className="flex items-center gap-[12px] px-[16px] py-[12px]">
                  <button
                    type="button"
                    onClick={() => handleToggleExpand(groupId)}
                    className="flex items-center gap-[8px] flex-1 border-0 bg-transparent cursor-pointer text-left p-0"
                  >
                    <ChevronDownIcon
                      size={12}
                      className={`text-[#6b7280] transition-transform shrink-0 ${isExpanded ? '' : '-rotate-90'}`}
                    />
                    <span className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
                      {group.name}
                    </span>
                  </button>

                  {/* Entry count badge */}
                  <div className="px-[8px] py-[2px] rounded-full bg-orange/10 font-['IBM_Plex_Sans_Thai'] text-[12px] text-orange font-medium">
                    {selectedCount}/{totalCount} เลือกแล้ว
                  </div>

                  {/* Unlink button */}
                  <button
                    type="button"
                    onClick={() => handleUnlinkGroup(groupId)}
                    className="shrink-0 p-[6px] border-0 bg-transparent cursor-pointer rounded-[4px] hover:bg-red-50 transition-colors group"
                    aria-label="Unlink group"
                  >
                    <XIcon size={16} className="text-[#6b7280] group-hover:text-red-500 transition-colors" />
                  </button>
                </div>

                {/* Entry list */}
                {isExpanded && (
                  <div className="border-t border-[#e8eaef] px-[16px] py-[12px] flex flex-col gap-[8px]">
                    {entries
                      .sort((a, b) => a.sort_order - b.sort_order)
                      .map(entry => (
                        <label
                          key={entry.id}
                          className="flex items-center gap-[8px] cursor-pointer font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937]"
                        >
                          <input
                            type="checkbox"
                            checked={selected.has(entry.id)}
                            onChange={() => handleToggleEntry(groupId, entry.id)}
                            className="accent-orange cursor-pointer"
                          />
                          {entry.image_url && (
                            <img
                              src={entry.image_url}
                              alt=""
                              className="w-[24px] h-[24px] rounded-[4px] object-cover"
                            />
                          )}
                          <span>{entry.label}</span>
                        </label>
                      ))}

                    {/* Ad-hoc entry creation */}
                    <div className="flex items-center gap-[8px] mt-[8px]">
                      <input
                        type="text"
                        value={newEntryLabels[groupId] || ''}
                        onChange={(e) => setNewEntryLabels(prev => ({ ...prev, [groupId]: e.target.value }))}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            handleAddEntry(groupId)
                          }
                        }}
                        placeholder="เพิ่มตัวเลือกใหม่..."
                        className="flex-1 font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#1f2937] border border-[#e8eaef] rounded-[6px] px-[10px] py-[6px] outline-none transition-all placeholder:text-[#bfbfbf] focus:border-orange focus:ring-1 focus:ring-orange/20"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddEntry(groupId)}
                        disabled={isPending || !newEntryLabels[groupId]?.trim()}
                        className="shrink-0 p-[6px] border-0 bg-orange hover:bg-orange/90 disabled:bg-orange/50 cursor-pointer rounded-[6px] transition-colors flex items-center justify-center"
                        aria-label="Add new entry"
                      >
                        <PlusIcon size={12} color="white" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {linkedGroups.length === 0 && (
        <p className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#6b7280] text-center py-[12px]">
          ยังไม่มีกลุ่มตัวเลือกที่เชื่อมโยง
        </p>
      )}
    </section>
  )
}
