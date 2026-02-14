export default function AdminButton({ variant = 'primary', children, onClick, disabled = false, className = '' }) {
  const baseClasses = "flex items-center justify-center gap-[8px] px-[16px] py-[8px] rounded-[8px] font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"

  const variantClasses = {
    primary: 'bg-orange text-white hover:bg-orange/90',
    secondary: 'bg-white text-[#374151] border border-[#e5e7eb] hover:bg-[#f9fafb]',
    danger: 'bg-[#ef4444] text-white hover:bg-[#dc2626]',
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  )
}
