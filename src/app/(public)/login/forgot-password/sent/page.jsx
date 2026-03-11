'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import imgFavicon from '@/assets/6727cae5f32ea2c35a94792ae9603addc6300612.png'

function SentContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email')

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-[60px] px-[20px]">
      <div className="w-full max-w-[420px] flex flex-col items-center">
        <img alt="WoodSmith" className="size-[60px] object-contain" src={imgFavicon} />

        <div className="mt-[24px] text-center">
          <h2 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[20px] lg:text-[24px] text-orange leading-[1.2] m-0">
            ส่งอีเมลแล้ว
          </h2>
        </div>

        <div className="mt-[24px] text-center font-['IBM_Plex_Sans_Thai'] text-[14px] text-black leading-[24px]">
          {email && (
            <p className="m-0">เราได้ส่งลิงก์กู้คืนรหัสผ่านไปยัง <strong>{email}</strong></p>
          )}
          <p className="m-0 mt-[8px] text-grey">กรุณาตรวจสอบอีเมลของคุณ ลิงก์จะหมดอายุใน 1 ชั่วโมง</p>
        </div>

        <p className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-grey mt-[32px] m-0">
          <Link href="/login" className="text-orange underline">กลับไปหน้าเข้าสู่ระบบ</Link>
        </p>
      </div>
    </div>
  )
}

export default function CustomerForgotPasswordSentPage() {
  return (
    <Suspense>
      <SentContent />
    </Suspense>
  )
}
