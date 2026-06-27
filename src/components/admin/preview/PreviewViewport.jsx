'use client'

/**
 * Width-constrained frame that simulates a device viewport for the preview.
 *
 * Default mode is a CSS-constrained <div> (the public component is already
 * client-rendered, so no iframe is needed). If Tailwind `lg:` breakpoints —
 * which key off the true window width, not this container — ever misrender in
 * the constrained div, this is the single swap point to switch to an iframe
 * that reports a real viewport width. (Documented fallback; not built yet.)
 *
 * @param {{ viewport?: 'desktop'|'mobile', children: React.ReactNode }} props
 */
export default function PreviewViewport({ viewport = 'desktop', children }) {
  const maxWidth = viewport === 'mobile' ? 390 : 1280

  return (
    <div
      className="mx-auto w-full overflow-hidden rounded-[8px] border border-[#e5e7eb] bg-white shadow-sm transition-[max-width] duration-200"
      style={{ maxWidth }}
    >
      {children}
    </div>
  )
}
