'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

function ArrowLeftIcon({ size = 20, color = '#6b7280' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  )
}

const ROLE_LABELS = {
  admin: 'Admin',
  editor: 'Editor',
  customer: 'Customer',
}

const ROLE_STYLES = {
  admin: 'bg-[#fef3c7] text-[#92400e]',
  editor: 'bg-[#dbeafe] text-[#1e40af]',
  customer: 'bg-[#f3f4f6] text-[#6b7280]',
}

const STATUS_STYLES = {
  pending: 'bg-[#dbeafe] text-[#1e40af]',
  approved: 'bg-[#dcfce7] text-[#166534]',
  rejected: 'bg-[#fee2e2] text-[#991b1b]',
}

const STATUS_LABELS = {
  pending: 'รอพิจารณา',
  approved: 'อนุมัติ',
  rejected: 'ไม่อนุมัติ',
}

const PROVIDER_LABELS = {
  email: 'อีเมล',
  phone: 'SMS OTP',
  line: 'LINE',
}

function Field({ label, value }) {
  return (
    <div className="flex flex-col gap-[1px]">
      <span className="font-['IBM_Plex_Sans_Thai'] text-[11px] text-[#9ca3af] leading-[1.4]">{label}</span>
      <span className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#1f2937] leading-[1.4]">{value || '-'}</span>
    </div>
  )
}

function getUserName(user) {
  if (user.first_name || user.last_name) {
    return [user.first_name, user.last_name].filter(Boolean).join(' ')
  }
  return user.display_name || '-'
}

function fmtDate(dateStr) {
  if (!dateStr) return '-'
  try {
    return new Date(dateStr).toLocaleDateString('th-TH', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    })
  } catch { return dateStr }
}

export default function UserDetailClient({ user, quotations }) {
  const router = useRouter()

  // Get address from most recent quotation
  const latestAddress = quotations?.find((q) => q.requester_address)?.requester_address || null

  return (
    <div className="flex flex-col gap-[12px]">
      {/* Header row */}
      <div className="flex items-center gap-[12px]">
        <Link href="/admin/users" className="flex items-center no-underline text-orange hover:underline">
          <ArrowLeftIcon size={16} color="#ff7e1b" />
        </Link>
        <h1 className="font-['IBM_Plex_Sans_Thai'] font-bold text-[20px] text-[#1f2937] m-0">
          {getUserName(user)}
        </h1>
        <span className={`inline-flex items-center px-[10px] py-[2px] rounded-full font-['IBM_Plex_Sans_Thai'] text-[12px] font-medium leading-[1.8] ${ROLE_STYLES[user.role] || ROLE_STYLES.customer}`}>
          {ROLE_LABELS[user.role] || user.role}
        </span>
      </div>

      {/* User info */}
      <section className="bg-white rounded-[8px] border border-[#e8eaef] p-[16px] flex flex-col gap-[12px]">
        <h2 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[14px] text-[#6b7280] m-0 uppercase tracking-[0.5px]">
          ข้อมูลผู้ใช้
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-[24px] gap-y-[10px]">
          <Field label="ชื่อ" value={user.first_name} />
          <Field label="นามสกุล" value={user.last_name} />
          <Field label="ชื่อที่แสดง" value={user.display_name} />
          <Field label="เบอร์โทร" value={user.phone} />
          <Field label="อีเมล" value={user.email} />
          <Field label="ช่องทางสมัคร" value={PROVIDER_LABELS[user.auth_provider] || user.auth_provider} />
          <Field label="ที่อยู่" value={latestAddress} />
          <Field label="สมัครเมื่อ" value={fmtDate(user.created_at)} />
        </div>
      </section>

      {/* Quotation history */}
      <section className="bg-white rounded-[8px] border border-[#e8eaef] p-[16px] flex flex-col gap-[12px]">
        <div className="flex items-center gap-[8px]">
          <h2 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[14px] text-[#6b7280] m-0 uppercase tracking-[0.5px]">
            ประวัติใบเสนอราคา
          </h2>
          <span className="inline-flex items-center justify-center min-w-[22px] h-[20px] px-[6px] rounded-full bg-[#f3f4f6] font-['IBM_Plex_Sans_Thai'] text-[11px] font-medium text-[#6b7280]">
            {quotations?.length || 0}
          </span>
        </div>

        {!quotations || quotations.length === 0 ? (
          <p className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#9ca3af] m-0">
            ยังไม่มีใบเสนอราคา
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-[#e8eaef]">
                  <th className="text-left px-[12px] py-[8px] font-['IBM_Plex_Sans_Thai'] text-[11px] font-semibold text-[#9ca3af] uppercase tracking-wider">เลขที่</th>
                  <th className="text-left px-[12px] py-[8px] font-['IBM_Plex_Sans_Thai'] text-[11px] font-semibold text-[#9ca3af] uppercase tracking-wider">สินค้า</th>
                  <th className="text-left px-[12px] py-[8px] font-['IBM_Plex_Sans_Thai'] text-[11px] font-semibold text-[#9ca3af] uppercase tracking-wider">สถานะ</th>
                  <th className="text-left px-[12px] py-[8px] font-['IBM_Plex_Sans_Thai'] text-[11px] font-semibold text-[#9ca3af] uppercase tracking-wider">วันที่</th>
                </tr>
              </thead>
              <tbody>
                {quotations.map((q) => (
                  <tr
                    key={q.id}
                    onClick={() => router.push(`/admin/quotations/${q.id}`)}
                    className="border-b border-[#f3f4f6] hover:bg-[#f9fafb] transition-colors cursor-pointer"
                  >
                    <td className="px-[12px] py-[10px] font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#1f2937] font-medium">
                      {q.quotation_number}
                    </td>
                    <td className="px-[12px] py-[10px] font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#6b7280]">
                      {q.product?.name || '-'}
                    </td>
                    <td className="px-[12px] py-[10px]">
                      <span className={`inline-flex items-center px-[8px] py-[1px] rounded-full font-['IBM_Plex_Sans_Thai'] text-[11px] font-medium ${STATUS_STYLES[q.status] || STATUS_STYLES.pending}`}>
                        {STATUS_LABELS[q.status] || q.status}
                      </span>
                    </td>
                    <td className="px-[12px] py-[10px] font-['IBM_Plex_Sans_Thai'] text-[12px] text-[#9ca3af]">
                      {fmtDate(q.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
