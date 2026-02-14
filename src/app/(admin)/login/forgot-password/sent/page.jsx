import Link from 'next/link'

export default function ForgotPasswordSentPage() {
  return (
    <div className="min-h-screen bg-[#f6f6f9] flex flex-col items-center justify-center px-[16px]">
      <div className="flex flex-col items-center gap-[17px] w-full max-w-[540px]">
        {/* Email Sent Card */}
        <div className="bg-white w-full shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] px-[44px] py-[48px]">
          <div className="flex flex-col gap-[24px] items-center">
            {/* Logo & Title */}
            <div className="flex flex-col items-center gap-[16px]">
              <img
                alt="WoodSmith"
                src="/favicon.png"
                className="h-[84px] w-[67px] object-cover"
              />
              <h1 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[24px] text-[#202124] leading-[28px] m-0">
                ส่งอีเมลแล้ว
              </h1>
            </div>

            {/* Message */}
            <div className="text-center font-['IBM_Plex_Sans_Thai'] text-[16px] text-black leading-[28px]">
              <p className="m-0">อาจใช้เวลาสักครู่ในการรับลิงค์การกู้คืนรหัสผ่าน</p>
              <p className="m-0">หากคุณไม่ได้รับลิงค์นี้ โปรดติดต่อผู้ดูแลระบบของคุณ</p>
            </div>
          </div>
        </div>

        {/* Back to Login Link */}
        <Link
          href="/login"
          className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[16px] text-black no-underline hover:underline h-[48px] flex items-center justify-center"
        >
          เข้าสู่ระบบ
        </Link>
      </div>
    </div>
  )
}
