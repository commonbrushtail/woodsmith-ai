'use client'

import { useState, useRef, useEffect } from 'react'

/* ------------------------------------------------------------------ */
/*  SVG icon helpers                                                   */
/* ------------------------------------------------------------------ */

function EyeIcon({ size = 20, color = '#9ca3af' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function EyeOffIcon({ size = 20, color = '#9ca3af' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )
}

function ChevronDownIcon({ size = 16, color = '#6b7280' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6L8 10L12 6" />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  Custom select dropdown component                                   */
/* ------------------------------------------------------------------ */

function CustomSelect({ label, value, onChange, options, helperText, id }) {
  const [isOpen, setIsOpen] = useState(false)
  const selectRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedOption = options.find((opt) => opt.value === value)

  return (
    <div className="flex flex-col gap-[6px]">
      <label
        htmlFor={id}
        className="font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] text-[#4b5563]"
      >
        {label}
      </label>
      <div ref={selectRef} className="relative">
        <button
          id={id}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between border border-[#e8eaef] rounded-[8px] px-[14px] py-[10px] bg-white font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] cursor-pointer hover:border-[#d1d5db] focus:border-[#ff7e1b] focus:outline-none transition-colors"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span>{selectedOption?.label || value}</span>
          <ChevronDownIcon
            color="#6b7280"
          />
        </button>
        {isOpen && (
          <ul
            role="listbox"
            aria-label={label}
            className="absolute z-10 top-[calc(100%+4px)] left-0 right-0 bg-white border border-[#e8eaef] rounded-[8px] shadow-[0_4px_12px_rgba(0,0,0,0.08)] py-[4px] list-none m-0 p-[4px] max-h-[200px] overflow-y-auto"
          >
            {options.map((opt) => (
              <li
                key={opt.value}
                role="option"
                aria-selected={opt.value === value}
                onClick={() => {
                  onChange(opt.value)
                  setIsOpen(false)
                }}
                className={`px-[14px] py-[8px] font-['IBM_Plex_Sans_Thai'] text-[14px] cursor-pointer rounded-[6px] transition-colors ${
                  opt.value === value
                    ? 'bg-[#ff7e1b]/10 text-[#ff7e1b] font-medium'
                    : 'text-[#1f2937] hover:bg-[#f9fafb]'
                }`}
              >
                {opt.label}
              </li>
            ))}
          </ul>
        )}
      </div>
      {helperText && (
        <p className="font-['IBM_Plex_Sans_Thai'] text-[12px] text-[#9ca3af] m-0 leading-[1.5]">
          {helperText}
        </p>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Account settings page                                              */
/* ------------------------------------------------------------------ */

export default function AccountPage() {
  /* Profile fields */
  const [firstName, setFirstName] = useState('John')
  const [lastName, setLastName] = useState('Smith')
  const [email, setEmail] = useState('admin@woodsmith.co.th')
  const [username, setUsername] = useState('Admin A')

  /* Password fields */
  const [currentPassword, setCurrentPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  /* Experience / preferences */
  const [language, setLanguage] = useState('th')
  const [interfaceMode, setInterfaceMode] = useState('system')

  const languageOptions = [
    { value: 'th', label: 'ไทย' },
    { value: 'en', label: 'English' },
  ]

  const interfaceModeOptions = [
    { value: 'system', label: 'ใช้การตั้งค่าระบบ' },
    { value: 'light', label: 'โหมดสว่าง' },
    { value: 'dark', label: 'โหมดมืด' },
  ]

  return (
    <div className="flex flex-col gap-[24px] h-full min-h-0 overflow-y-auto pb-[32px]">
      {/* ---- Header ---- */}
      <div className="flex items-center justify-between">
        <h1 className="font-['IBM_Plex_Sans_Thai'] font-bold text-[22px] text-[#1f2937] m-0">
          Admin A
        </h1>
        <button
          type="button"
          className="px-[24px] py-[8px] bg-[#ff7e1b] text-white rounded-[8px] font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] border-none cursor-pointer hover:bg-[#ff7e1b]/90 transition-colors"
        >
          บันทึก
        </button>
      </div>

      {/* ---- Section 1: Profile ---- */}
      <section
        className="bg-white rounded-[12px] border border-[#e8eaef] p-[24px]"
        aria-labelledby="section-profile"
      >
        <h2
          id="section-profile"
          className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[16px] text-[#1f2937] m-0 mb-[20px]"
        >
          โปรไฟล์
        </h2>

        {/* Row 1: First name + Last name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px] mb-[16px]">
          <div className="flex flex-col gap-[6px]">
            <label
              htmlFor="firstName"
              className="font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] text-[#4b5563]"
            >
              ชื่อจริง <span className="text-red-500">*</span>
            </label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="border border-[#e8eaef] rounded-[8px] px-[14px] py-[10px] font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] bg-white focus:border-[#ff7e1b] focus:outline-none transition-colors"
            />
          </div>
          <div className="flex flex-col gap-[6px]">
            <label
              htmlFor="lastName"
              className="font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] text-[#4b5563]"
            >
              นามสกุล
            </label>
            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="border border-[#e8eaef] rounded-[8px] px-[14px] py-[10px] font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] bg-white focus:border-[#ff7e1b] focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Row 2: Email + Username */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
          <div className="flex flex-col gap-[6px]">
            <label
              htmlFor="email"
              className="font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] text-[#4b5563]"
            >
              อีเมล <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border border-[#e8eaef] rounded-[8px] px-[14px] py-[10px] font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] bg-white focus:border-[#ff7e1b] focus:outline-none transition-colors"
            />
          </div>
          <div className="flex flex-col gap-[6px]">
            <label
              htmlFor="username"
              className="font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] text-[#4b5563]"
            >
              ชื่อผู้ใช้
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border border-[#e8eaef] rounded-[8px] px-[14px] py-[10px] font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] bg-white focus:border-[#ff7e1b] focus:outline-none transition-colors"
            />
          </div>
        </div>
      </section>

      {/* ---- Section 2: Change Password ---- */}
      <section
        className="bg-white rounded-[12px] border border-[#e8eaef] p-[24px]"
        aria-labelledby="section-password"
      >
        <h2
          id="section-password"
          className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[16px] text-[#1f2937] m-0 mb-[20px]"
        >
          เปลี่ยนรหัสผ่าน
        </h2>

        <div className="flex flex-col gap-[6px] max-w-[480px] mb-[20px]">
          <label
            htmlFor="currentPassword"
            className="font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] text-[#4b5563]"
          >
            รหัสผ่านปัจจุบัน <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="currentPassword"
              type={showPassword ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              placeholder="กรอกรหัสผ่านปัจจุบัน"
              className="w-full border border-[#e8eaef] rounded-[8px] px-[14px] py-[10px] pr-[44px] font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] bg-white focus:border-[#ff7e1b] focus:outline-none transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-[12px] top-1/2 -translate-y-1/2 flex items-center justify-center border-none bg-transparent cursor-pointer p-0"
              aria-label={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
        </div>

        <button
          type="button"
          className="px-[24px] py-[8px] bg-[#ff7e1b] text-white rounded-[8px] font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] border-none cursor-pointer hover:bg-[#ff7e1b]/90 transition-colors"
        >
          ยืนยันเปลี่ยนรหัสผ่าน
        </button>
      </section>

      {/* ---- Section 3: Experience ---- */}
      <section
        className="bg-white rounded-[12px] border border-[#e8eaef] p-[24px]"
        aria-labelledby="section-experience"
      >
        <h2
          id="section-experience"
          className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[16px] text-[#1f2937] m-0 mb-[8px]"
        >
          ประสบการณ์
        </h2>

        <p className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#9ca3af] m-0 mb-[20px] leading-[1.6]">
          การเปลี่ยนแปลงการตั้งค่าจะมีผลเฉพาะสำหรับคุณ ข้อมูลเพิ่มเติมสามารถดูได้{' '}
          <a
            href="#"
            className="text-[#ff7e1b] hover:underline font-medium no-underline"
          >
            ที่นี่
          </a>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
          <CustomSelect
            id="interfaceLanguage"
            label="ภาษาของอินเตอร์เฟซ"
            value={language}
            onChange={setLanguage}
            options={languageOptions}
            helperText="จะทำการแสดงอินเตอร์เฟซของคุณในภาษาที่เลือกเท่านั้น"
          />
          <CustomSelect
            id="interfaceMode"
            label="โหมดอินเตอร์เฟซ"
            value={interfaceMode}
            onChange={setInterfaceMode}
            options={interfaceModeOptions}
            helperText="จะแสดงอินเตอร์เฟซของคุณในโหมดที่เลือก"
          />
        </div>
      </section>
    </div>
  )
}
