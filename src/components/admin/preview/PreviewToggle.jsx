'use client'

/**
 * On/off switch that controls the live preview drawer. Place in an edit page's
 * action area; bind `checked`/`onChange` to the same state the PreviewPanel's
 * `open`/`onClose` use, so the switch reflects (and controls) panel visibility.
 *
 * @param {{ checked: boolean, onChange: (next: boolean) => void, label?: string, className?: string }} props
 */
export default function PreviewToggle({ checked, onChange, label = 'ดูตัวอย่างสด', className = '' }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`flex items-center justify-between gap-[10px] w-full rounded-[8px] border border-[#e5e7eb] bg-white px-[14px] py-[8px] cursor-pointer hover:bg-[#f9fafb] transition-colors ${className}`}
    >
      <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] text-[#374151]">
        {label}
      </span>
      <span
        className={`relative inline-flex h-[24px] w-[44px] shrink-0 rounded-full border-2 border-transparent transition-colors ${
          checked ? 'bg-orange' : 'bg-[#d1d5db]'
        }`}
      >
        <span
          className={`pointer-events-none inline-block size-[20px] rounded-full bg-white shadow-sm transition-transform ${
            checked ? 'translate-x-[20px]' : 'translate-x-0'
          }`}
        />
      </span>
    </button>
  )
}
