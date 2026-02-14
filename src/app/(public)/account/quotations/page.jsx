'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const statusLabels = {
  pending: 'รอดำเนินการ',
  approved: 'อนุมัติแล้ว',
  rejected: 'ปฏิเสธ',
}

const statusColors = {
  pending: 'bg-[#fff3cd] text-[#856404]',
  approved: 'bg-[#d4edda] text-[#155724]',
  rejected: 'bg-[#f8d7da] text-[#721c24]',
}

function StatusBadge({ status }) {
  return (
    <span className={`inline-block px-[10px] py-[2px] rounded-[4px] font-['IBM_Plex_Sans_Thai'] text-[13px] font-medium ${statusColors[status] || 'bg-[#e5e7eb] text-black'}`}>
      {statusLabels[status] || status}
    </span>
  )
}

export default function AccountQuotationsPage() {
  const [quotations, setQuotations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const { getMyQuotations } = await import('@/lib/actions/customer')
        const { data } = await getMyQuotations()
        setQuotations(data || [])
      } catch (err) {
        console.error('Error loading quotations:', err)
      }
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-[60px]">
        <p className="font-['IBM_Plex_Sans_Thai'] text-[16px] text-grey">กำลังโหลด...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-[24px]">
      <h2 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[20px] text-black m-0">
        ใบเสนอราคาของฉัน
      </h2>

      {quotations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-[60px] gap-[12px]">
          <svg className="size-[48px] text-grey" viewBox="0 0 24 24" fill="none">
            <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M14 2V8H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="font-['IBM_Plex_Sans_Thai'] text-[16px] text-grey">
            ยังไม่มีใบเสนอราคา
          </p>
          <Link href="/products" className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-orange no-underline">
            เลือกดูสินค้า
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-[12px]">
          {quotations.map((q) => (
            <div key={q.id} className="border border-[#e5e7eb] p-[16px] flex flex-col gap-[8px]">
              <div className="flex items-center justify-between gap-[12px]">
                <p className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[15px] text-black m-0">
                  {q.quotation_number}
                </p>
                <StatusBadge status={q.status} />
              </div>
              {q.product && (
                <p className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-black m-0">
                  สินค้า: {q.product.name} {q.product.code ? `(${q.product.code})` : ''}
                </p>
              )}
              <div className="flex items-center gap-[16px]">
                <p className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-grey m-0">
                  {new Date(q.created_at).toLocaleDateString('th-TH', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
                {q.message && (
                  <p className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-grey m-0 truncate">
                    {q.message}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
