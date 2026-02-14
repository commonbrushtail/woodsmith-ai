'use client'

import { useState, useEffect } from 'react'

function CloseIcon() {
  return (
    <svg className="size-[16px] shrink-0" viewBox="0 0 16 16" fill="none">
      <path d="M12 4L4 12M4 4L12 12" stroke="#35383b" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function CookiePolicyModal({ isOpen, onClose }) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[90] flex items-start justify-center pt-[80px] lg:pt-[120px]">
      <div className="absolute inset-0 bg-black/25" onClick={onClose} />
      <div className="relative bg-white flex flex-col gap-[20px] items-end px-[16px] lg:px-[24px] py-[24px] w-[90%] max-w-[370px] lg:max-w-[1322px] max-h-[80vh] overflow-y-auto">
        {/* Close button */}
        <button onClick={onClose} className="cursor-pointer bg-transparent border-none p-0 shrink-0">
          <CloseIcon />
        </button>

        {/* Content */}
        <div className="flex flex-col gap-[24px] lg:gap-[40px] items-center w-full">
          {/* Header */}
          <div className="flex flex-col gap-[12px] items-center w-full text-center">
            <h2 className="font-['Circular_Std'] font-medium text-[24px] lg:text-[48px] text-black tracking-[0.25px] leading-[1.3] m-0">
              Cookie Policy
            </h2>
            <p className="font-['IBM_Plex_Sans_Thai'] font-medium text-[16px] text-black leading-[1.3]">
              นโยบายการใช้คุกกี้นี้จะอธิบายถึงประเภท เหตุผล และลักษณะการใช้คุกกี้บนเว็บไซต์นี้ดังนี้
            </p>
          </div>

          {/* Body */}
          <div className="flex flex-col gap-[12px] items-center w-full lg:px-[150px] text-center">
            <h3 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[24px] lg:text-[40px] text-black tracking-[0.25px] leading-[1.3] m-0">
              คุกกี้คืออะไร ?
            </h3>
            <p className="font-['IBM_Plex_Sans_Thai'] text-[15px] lg:text-[16px] text-black leading-[1.4]">
              คุกกี้เป็นไฟล์ข้อความที่ประกอบด้วยข้อมูลเพียงเล็กน้อย ซึ่งสามารถดาวน์โหลดลงในอุปกรณ์ของท่านเมื่อท่านเยี่ยมชมเว็บไซต์หนึ่ง ๆ จากนั้น
              จะมีการส่งคุกกี้กลับไปยังเว็บโดเมนต้นทางในการเข้าชมโดเมนนั้นในครั้งต่อมาของท่าน หน้าเว็บส่วนใหญ่มีองค์ประกอบต่าง ๆ จากหลายเว็บโดเมน
              ดังนั้น เมื่อท่านเข้าชมเว็บไซต์นั้นเบราว์เซอร์ของท่านอาจได้รับคุกกี้จากหลายแหล่งที่มา
            </p>
            <p className="font-['IBM_Plex_Sans_Thai'] text-[15px] lg:text-[16px] text-black leading-[1.4]">
              คุกกี้มีประโยชน์เนื่องจากอนุญาตให้เว็บไซต์สามารถจดจำอุปกรณ์ของผู้ใช้ คุกกี้อนุญาตให้ท่านไปยังหน้าเว็บต่าง ๆ ได้อย่างมีประสิทธิภาพ, จดจำค่าที่เลือกใช้
              และปรับปรุงประสบการณ์ของผู้ใช้โดยทั่วไป นอกจากนี้ ยังใช้เพื่อปรับแต่งโฆษณาให้ตรงกับความสนใจของท่าน โดยการติดตามการเรียกดูเว็บไซต์ต่าง ๆ ของท่าน
            </p>
            <p className="font-['IBM_Plex_Sans_Thai'] text-[15px] lg:text-[16px] text-black leading-[1.4]">
              คุกกี้เซสชั่นจะถูกลบออกโดยอัตโนมัติเมื่อท่านปิดเบราว์เซอร์ ขณะที่คุกกี้ถาวรจะยังคงอยู่ในอุปกรณ์ของท่านหลังจากปิดเบราว์เซอร์ไปแล้ว
              (เพื่อจดจำค่าที่เลือกใช้ของท่านเมื่อท่านกลับมาที่ไซต์นี้)
            </p>
          </div>

          {/* Accept button */}
          <button className="bg-orange flex h-[40px] items-center justify-center px-[24px] cursor-pointer border-none">
            <span className="font-['Circular_Std'] font-medium text-[13.33px] text-white leading-[1.5]">
              ยอมรับทั้งหมด
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)
  const [policyOpen, setPolicyOpen] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent')
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const acceptAll = () => {
    localStorage.setItem('cookie_consent', 'accepted')
    setVisible(false)
    setPolicyOpen(false)
  }

  const dismiss = () => {
    setVisible(false)
  }

  if (!visible && !policyOpen) return null

  return (
    <>
      {/* Cookie Bar */}
      {visible && (
        <div className="fixed bottom-0 left-0 right-0 z-[70] bg-white py-[20px] px-[16px] lg:px-[20px] shadow-[0px_-4px_16px_0px_rgba(0,0,0,0.08)]">
          <div className="max-w-[1212px] mx-auto flex flex-col lg:flex-row gap-[20px] lg:gap-[74px] items-start lg:items-center">
            {/* Text */}
            <div className="flex-1 flex gap-[20px] items-start">
              <div className="flex-1 font-['IBM_Plex_Sans_Thai'] text-[14px] text-black leading-[1.5]">
                <span>
                  เราใช้คุกกี้เพื่อเพิ่มประสิทธิภาพและประสบการณ์ที่ดีในการใช้เว็บไซต์ ท่านสามารถศึกษารายละเอียดการใช้คุกกี้ได้ที่{' '}
                </span>
                <button
                  onClick={() => setPolicyOpen(true)}
                  className="font-['IBM_Plex_Sans_Thai'] font-bold text-[14px] text-orange underline cursor-pointer bg-transparent border-none p-0 inline"
                >
                  นโยบายการใช้คุกกี้
                </button>
                <span>
                  {' '}และสามารถเลือกตั้งค่ายินยอม การใช้คุกกี้ได้โดยคลิกที่การตั้งค่าคุกกี้
                </span>
              </div>
              {/* Mobile close only */}
              <button onClick={dismiss} className="lg:hidden cursor-pointer bg-transparent border-none p-0 shrink-0">
                <CloseIcon />
              </button>
            </div>

            {/* Buttons + Close */}
            <div className="flex gap-[6.667px] items-center w-full lg:w-auto">
              <button
                onClick={() => setPolicyOpen(true)}
                className="flex-1 lg:flex-none h-[40px] border border-[#e5e7eb] flex items-center justify-center px-[40px] cursor-pointer bg-transparent"
              >
                <span className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[14px] text-black">
                  ตั้งค่าคุกกี้
                </span>
              </button>
              <button
                onClick={acceptAll}
                className="flex-1 lg:flex-none h-[40px] bg-orange flex items-center justify-center px-[24px] cursor-pointer border-none"
              >
                <span className="font-['Circular_Std'] font-medium text-[13.33px] text-white leading-[1.5]">
                  ยอมรับทั้งหมด
                </span>
              </button>
              {/* Desktop close */}
              <button onClick={dismiss} className="hidden lg:block cursor-pointer bg-transparent border-none p-0 shrink-0 ml-[8px]">
                <CloseIcon />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cookie Policy Modal */}
      <CookiePolicyModal
        isOpen={policyOpen}
        onClose={() => {
          setPolicyOpen(false)
          acceptAll()
        }}
      />
    </>
  )
}
