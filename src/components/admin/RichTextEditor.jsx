'use client'

import { useRef, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import { Table } from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
import TableCell from '@tiptap/extension-table-cell'
import { uploadEditorImage } from '@/lib/actions/blog'

function ToolbarButton({ onClick, isActive, ariaLabel, children, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`
        size-[32px] flex items-center justify-center rounded-[6px] border-0 cursor-pointer transition-colors
        ${disabled ? 'opacity-30 cursor-not-allowed' : ''}
        ${isActive ? 'bg-[#ff7e1b]/15 text-[#ff7e1b]' : 'bg-transparent text-[#6b7280] hover:bg-[#f3f4f6]'}
      `}
    >
      {children}
    </button>
  )
}

function TableMenu({ editor }) {
  const [open, setOpen] = useState(false)

  if (!editor) return null

  const inTable = editor.isActive('table')

  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 2, withHeaderRow: false }).run()
    setOpen(false)
  }

  return (
    <div className="relative">
      <ToolbarButton
        onClick={() => inTable ? setOpen(!open) : insertTable()}
        isActive={inTable}
        ariaLabel="Table"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <line x1="3" y1="15" x2="21" y2="15" />
          <line x1="12" y1="3" x2="12" y2="21" />
        </svg>
      </ToolbarButton>

      {open && inTable && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-[4px] z-20 bg-white border border-[#e5e7eb] rounded-[8px] shadow-lg py-[4px] min-w-[180px]">
            <MenuItem onClick={() => { editor.chain().focus().addRowAfter().run(); setOpen(false) }}>
              เพิ่มแถวด้านล่าง
            </MenuItem>
            <MenuItem onClick={() => { editor.chain().focus().addRowBefore().run(); setOpen(false) }}>
              เพิ่มแถวด้านบน
            </MenuItem>
            <MenuItem onClick={() => { editor.chain().focus().deleteRow().run(); setOpen(false) }}>
              ลบแถว
            </MenuItem>
            <div className="h-px bg-[#e5e7eb] my-[4px]" />
            <MenuItem onClick={() => { editor.chain().focus().addColumnAfter().run(); setOpen(false) }}>
              เพิ่มคอลัมน์ขวา
            </MenuItem>
            <MenuItem onClick={() => { editor.chain().focus().addColumnBefore().run(); setOpen(false) }}>
              เพิ่มคอลัมน์ซ้าย
            </MenuItem>
            <MenuItem onClick={() => { editor.chain().focus().deleteColumn().run(); setOpen(false) }}>
              ลบคอลัมน์
            </MenuItem>
            <div className="h-px bg-[#e5e7eb] my-[4px]" />
            <MenuItem onClick={() => { editor.chain().focus().deleteTable().run(); setOpen(false) }} danger>
              ลบตาราง
            </MenuItem>
          </div>
        </>
      )}
    </div>
  )
}

function MenuItem({ onClick, children, danger }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-[12px] py-[6px] font-['IBM_Plex_Sans_Thai'] text-[13px] border-0 bg-transparent cursor-pointer hover:bg-[#f3f4f6] ${danger ? 'text-red-500' : 'text-[#374151]'}`}
    >
      {children}
    </button>
  )
}

function Toolbar({ editor, fileInputRef, uploading }) {
  if (!editor) return null

  const handleLink = () => {
    const url = window.prompt('URL:')
    if (url) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }
  }

  const handleImage = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="flex items-center gap-[2px] px-[8px] py-[6px] border-b border-[#e5e7eb] flex-wrap">
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
        ariaLabel="Bold"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
          <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
        </svg>
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
        ariaLabel="Italic"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="4" x2="10" y2="4" />
          <line x1="14" y1="20" x2="5" y2="20" />
          <line x1="15" y1="4" x2="9" y2="20" />
        </svg>
      </ToolbarButton>

      <div className="w-px h-[20px] bg-[#e5e7eb] mx-[4px]" />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive('heading', { level: 2 })}
        ariaLabel="Heading 2"
      >
        <span className="text-[12px] font-bold">H2</span>
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        isActive={editor.isActive('heading', { level: 3 })}
        ariaLabel="Heading 3"
      >
        <span className="text-[12px] font-bold">H3</span>
      </ToolbarButton>

      <div className="w-px h-[20px] bg-[#e5e7eb] mx-[4px]" />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive('bulletList')}
        ariaLabel="Bullet list"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" />
          <line x1="3" y1="12" x2="3.01" y2="12" />
          <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive('orderedList')}
        ariaLabel="Ordered list"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="10" y1="6" x2="21" y2="6" />
          <line x1="10" y1="12" x2="21" y2="12" />
          <line x1="10" y1="18" x2="21" y2="18" />
          <path d="M4 6h1v4" />
          <path d="M4 10h2" />
          <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
        </svg>
      </ToolbarButton>

      <div className="w-px h-[20px] bg-[#e5e7eb] mx-[4px]" />

      <TableMenu editor={editor} />

      <div className="w-px h-[20px] bg-[#e5e7eb] mx-[4px]" />

      <ToolbarButton
        onClick={handleLink}
        isActive={editor.isActive('link')}
        ariaLabel="Link"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      </ToolbarButton>

      <ToolbarButton
        onClick={handleImage}
        isActive={false}
        ariaLabel="Image"
      >
        {uploading ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        )}
      </ToolbarButton>

      <div className="w-px h-[20px] bg-[#e5e7eb] mx-[4px]" />

      <ToolbarButton
        onClick={() => editor.chain().focus().undo().run()}
        isActive={false}
        ariaLabel="Undo"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="1 4 1 10 7 10" />
          <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
        </svg>
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().redo().run()}
        isActive={false}
        ariaLabel="Redo"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="23 4 23 10 17 10" />
          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
        </svg>
      </ToolbarButton>
    </div>
  )
}

export default function RichTextEditor({ content = '', onChange, minHeight = 200 }) {
  const fileInputRef = useRef(null)
  const [uploading, setUploading] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ link: false }),
      Image,
      Link.configure({ openOnClick: false }),
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
    immediatelyRender: false,
  })

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !editor) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const { url, error } = await uploadEditorImage(formData)
      if (error) {
        alert(error)
      } else if (url) {
        editor.chain().focus().setImage({ src: url }).run()
      }
    } catch {
      alert('อัปโหลดรูปภาพไม่สำเร็จ')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  return (
    <div className="border border-[#e5e7eb] rounded-[8px] overflow-hidden bg-white">
      <Toolbar editor={editor} fileInputRef={fileInputRef} uploading={uploading} />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFileSelect}
      />
      <div
        data-testid="editor-wrapper"
        style={{ minHeight: `${minHeight}px` }}
        className="px-[16px] py-[12px]"
      >
        <EditorContent
          editor={editor}
          className="prose prose-sm max-w-none font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#374151] [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[inherit] [&_.ProseMirror_table]:w-full [&_.ProseMirror_table]:border-collapse [&_.ProseMirror_table]:border [&_.ProseMirror_table]:border-[#e5e7eb] [&_.ProseMirror_td]:border [&_.ProseMirror_td]:border-[#e5e7eb] [&_.ProseMirror_td]:px-[20px] [&_.ProseMirror_td]:py-[12px] [&_.ProseMirror_td]:align-top [&_.ProseMirror_th]:border [&_.ProseMirror_th]:border-[#e5e7eb] [&_.ProseMirror_th]:px-[20px] [&_.ProseMirror_th]:py-[12px] [&_.ProseMirror_th]:bg-[#f9fafb] [&_.ProseMirror_th]:font-semibold [&_.ProseMirror_th]:text-left"
        />
      </div>
    </div>
  )
}
