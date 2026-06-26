/**
 * Admin affordance for Approach B: opens the real public page in Draft Mode
 * (a new tab) so the admin sees a saved draft rendered pixel-perfect.
 *
 * Renders a disabled button when `path` is missing (e.g. a product without a
 * slug/category yet) so we never link to a broken preview URL.
 *
 * @param {{ path?: string|null, label?: string, disabledHint?: string, className?: string }} props
 */
export default function PreviewButton({
  path,
  label = 'พรีวิว',
  disabledHint = 'บันทึกฉบับร่างก่อนเพื่อดูตัวอย่าง',
  className = '',
}) {
  const base =
    "flex items-center justify-center gap-[8px] px-[16px] py-[8px] rounded-[8px] font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] transition-colors"

  if (!path) {
    return (
      <button
        type="button"
        disabled
        title={disabledHint}
        className={`${base} bg-white text-[#374151] border border-[#e5e7eb] opacity-50 cursor-not-allowed ${className}`}
      >
        {label}
      </button>
    )
  }

  return (
    <a
      href={`/api/preview?path=${encodeURIComponent(path)}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`${base} bg-white text-[#374151] border border-[#e5e7eb] hover:bg-[#f9fafb] cursor-pointer ${className}`}
    >
      {label}
    </a>
  )
}
