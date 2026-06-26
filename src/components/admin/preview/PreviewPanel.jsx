'use client'

import { useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import PreviewViewport from './PreviewViewport'
import PreviewLayoutShim from './PreviewLayoutShim'
import { usePreviewState } from '@/lib/preview/usePreviewState'

/**
 * Reusable live-preview drawer (Approach A). Renders the REAL public component
 * (loaded lazily, ssr:false) with props mapped from the current unsaved form
 * state by `adapter`. Because the editor and this panel share one React tree,
 * the preview updates live as the admin types/uploads — no save, no round-trip.
 *
 * @param {{
 *   adapter: { component: () => Promise<any>, toProps: (s:object)=>object, defaultViewport?: 'desktop'|'mobile' } | null,
 *   formState: object,
 *   open: boolean,
 *   onClose: () => void,
 * }} props
 */
export default function PreviewPanel({ adapter, formState, open, onClose }) {
  const [viewport, setViewport] = useState(adapter?.defaultViewport || 'desktop')

  // Lazy-load the public component for this adapter; ssr:false keeps Swiper/
  // TipTap-dependent components out of SSR and the admin bundle until opened.
  const Component = useMemo(
    () =>
      adapter
        ? dynamic(adapter.component, { ssr: false, loading: () => <PreviewMessage text="กำลังโหลดตัวอย่าง…" /> })
        : null,
    [adapter]
  )

  const props = usePreviewState(adapter, formState)

  if (!open || !adapter) return null

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-black/30" onClick={onClose} aria-hidden="true" />
      <aside
        role="dialog"
        aria-label="ตัวอย่างสด"
        className="fixed inset-y-0 right-0 z-[61] flex w-full max-w-[720px] flex-col bg-[#f3f4f6] shadow-2xl lg:max-w-[50vw]"
      >
        <header className="flex items-center justify-between gap-3 border-b border-[#e5e7eb] bg-white px-4 py-3">
          <span className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#111827]">
            ตัวอย่างสด
          </span>
          <div className="flex items-center gap-2">
            <DeviceToggle viewport={viewport} onChange={setViewport} />
            <button
              type="button"
              onClick={onClose}
              aria-label="ปิดตัวอย่าง"
              className="flex h-8 w-8 items-center justify-center rounded-[8px] text-[#6b7280] hover:bg-[#f3f4f6]"
            >
              ✕
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4">
          <PreviewViewport viewport={viewport}>
            <PreviewLayoutShim>
              {props?.__error ? (
                <PreviewMessage text={props.__error} />
              ) : Component ? (
                <Component {...props} />
              ) : null}
            </PreviewLayoutShim>
          </PreviewViewport>
        </div>
      </aside>
    </>
  )
}

function DeviceToggle({ viewport, onChange }) {
  const opt = (value, label) => (
    <button
      type="button"
      onClick={() => onChange(value)}
      className={`rounded-[6px] px-2 py-1 text-[12px] font-medium ${
        viewport === value ? 'bg-orange text-white' : 'text-[#6b7280] hover:bg-[#f3f4f6]'
      }`}
    >
      {label}
    </button>
  )
  return (
    <div className="flex items-center gap-1 rounded-[8px] border border-[#e5e7eb] p-0.5">
      {opt('desktop', 'เดสก์ท็อป')}
      {opt('mobile', 'มือถือ')}
    </div>
  )
}

function PreviewMessage({ text }) {
  return (
    <div className="flex min-h-[200px] items-center justify-center p-8 text-center text-[14px] text-[#6b7280]">
      {text}
    </div>
  )
}
