export default function AdminInput({ type = 'text', label, placeholder, value, onChange, required = false, options = [], className = '', error }) {
  const labelEl = label && (
    <label className="font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] text-[#374151] mb-[4px] block">
      {label}
      {required && <span className="text-[#ef4444] ml-[2px]">*</span>}
    </label>
  )

  const baseClasses = "w-full rounded-[8px] px-[12px] py-[10px] font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#374151] placeholder:text-[#9ca3af] focus:outline-none"
  const borderClasses = error
    ? 'border border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/30'
    : 'border border-[#e5e7eb] focus:border-orange focus:ring-1 focus:ring-orange/30'
  const inputClasses = `${baseClasses} ${borderClasses}`

  const errorEl = error && (
    <p className="mt-[4px] text-[13px] text-red-500 font-['IBM_Plex_Sans_Thai']">{error}</p>
  )

  if (type === 'textarea') {
    return (
      <div className={className}>
        {labelEl}
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          rows={4}
          className={`${inputClasses} resize-y`}
        />
        {errorEl}
      </div>
    )
  }

  if (type === 'select') {
    return (
      <div className={className}>
        {labelEl}
        <select
          value={value}
          onChange={onChange}
          required={required}
          className={inputClasses}
        >
          <option value="">{placeholder || 'เลือก...'}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {errorEl}
      </div>
    )
  }

  if (type === 'file') {
    return (
      <div className={className}>
        {labelEl}
        <div className="border-2 border-dashed border-[#e5e7eb] rounded-[8px] p-[24px] flex flex-col items-center gap-[8px] cursor-pointer hover:border-orange/50">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <p className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#9ca3af]">
            {placeholder || 'คลิกเพื่ออัปโหลดไฟล์'}
          </p>
          <input type="file" onChange={onChange} className="hidden" />
        </div>
        {errorEl}
      </div>
    )
  }

  return (
    <div className={className}>
      {labelEl}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={inputClasses}
      />
      {errorEl}
    </div>
  )
}
