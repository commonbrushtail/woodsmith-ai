'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const statusConfig = {
  pending: {
    label: 'รอการพิจารณาฯ',
    bg: 'bg-[#fff8e8]',
    border: 'border-[#e2a71a]',
    text: 'text-[#e2a71a]',
  },
  approved: {
    label: 'อนุมัติใบเสนอราคาแล้ว',
    bg: 'bg-[#e5f7f2]',
    border: 'border-[#48c29b]',
    text: 'text-[#48c29b]',
  },
  rejected: {
    label: 'ไม่อนุมัติใบเสนอราคา',
    bg: 'bg-[#ffe9e7]',
    border: 'border-[#d63524]',
    text: 'text-[#d63524]',
  },
}

function StatusBadge({ status }) {
  const cfg = statusConfig[status] || statusConfig.pending
  return (
    <span className={`inline-flex items-center px-[8px] py-[2px] rounded-[6px] border ${cfg.bg} ${cfg.border} ${cfg.text} font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] whitespace-nowrap`}>
      {cfg.label}
    </span>
  )
}

function getProductImage(product) {
  if (!product?.product_images?.length) return null
  const sorted = [...product.product_images].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
  return sorted[0]?.url || null
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  const day = d.getDate()
  const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.']
  const month = months[d.getMonth()]
  const year = d.getFullYear()
  const hours = String(d.getHours()).padStart(2, '0')
  const mins = String(d.getMinutes()).padStart(2, '0')
  return `${day} ${month} ${year} ${hours}:${mins}`
}

function formatVariations(q) {
  if (q.selected_variations?.length) {
    return q.selected_variations.map((v) => v.value).join(', ')
  }
  const parts = []
  if (q.selected_color) parts.push(q.selected_color)
  if (q.selected_size) parts.push(q.selected_size)
  return parts.join(', ') || '-'
}

export default function AccountQuotationsPage() {
  const [quotations, setQuotations] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('pending')

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

  const pendingItems = quotations.filter((q) => q.status === 'pending')
  const repliedItems = quotations.filter((q) => q.status === 'approved' || q.status === 'rejected')
  const activeItems = activeTab === 'pending' ? pendingItems : repliedItems

  if (loading) {
    return (
      <div className="flex items-center justify-center py-[60px]">
        <p className="font-['IBM_Plex_Sans_Thai'] text-[16px] text-grey">กำลังโหลด...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-[24px] p-[24px]">
      <h2 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[24px] text-black m-0 leading-[28px]">
        ใบเสนอราคาของฉัน
      </h2>

      {/* Tabs */}
      <div className="flex border-b-2 border-[#e5e7eb] w-full max-w-[511px]">
        <button
          type="button"
          onClick={() => setActiveTab('pending')}
          className={`flex-1 flex flex-col items-center bg-transparent border-none cursor-pointer font-['IBM_Plex_Sans_Thai'] font-medium text-[16px] tracking-[0.08px] p-0 ${
            activeTab === 'pending' ? 'text-orange' : 'text-[#979797]'
          }`}
        >
          <span className="py-[8px]">รอการตอบกลับ ({pendingItems.length})</span>
          <div className={`w-full h-[2px] -mb-[2px] ${activeTab === 'pending' ? 'bg-orange' : 'bg-transparent'}`} />
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('replied')}
          className={`flex-1 flex flex-col items-center bg-transparent border-none cursor-pointer font-['IBM_Plex_Sans_Thai'] font-medium text-[16px] tracking-[0.08px] p-0 ${
            activeTab === 'replied' ? 'text-orange' : 'text-[#979797]'
          }`}
        >
          <span className="py-[8px]">ตอบกลับแล้ว ({repliedItems.length})</span>
          <div className={`w-full h-[2px] -mb-[2px] ${activeTab === 'replied' ? 'bg-orange' : 'bg-transparent'}`} />
        </button>
      </div>

      {/* Table */}
      {activeItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-[60px] gap-[12px]">
          <svg className="size-[48px] text-grey" viewBox="0 0 24 24" fill="none">
            <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M14 2V8H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="font-['IBM_Plex_Sans_Thai'] text-[16px] text-grey">
            {activeTab === 'pending' ? 'ยังไม่มีรายการรอตอบกลับ' : 'ยังไม่มีรายการที่ตอบกลับแล้ว'}
          </p>
          <Link href="/products" className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-orange no-underline">
            เลือกดูสินค้า
          </Link>
        </div>
      ) : (
        <div className="border border-[#e5e7eb] bg-white overflow-x-auto">
          <table className="w-full border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-[#e5e7eb]">
                <th className="text-left px-[20px] py-[12px] font-['IBM_Plex_Sans_Thai'] font-medium text-[12px] text-black tracking-[0.06px] uppercase">
                  สินค้า
                </th>
                <th className="text-left px-[20px] py-[12px] font-['IBM_Plex_Sans_Thai'] font-medium text-[12px] text-black tracking-[0.06px]">
                  ตัวเลือกสินค้า
                </th>
                <th className="text-left px-[20px] py-[12px] font-['IBM_Plex_Sans_Thai'] font-medium text-[12px] text-black tracking-[0.06px]">
                  วันที่ขอใบเสนอราคา
                </th>
                <th className="text-left px-[20px] py-[12px] font-['IBM_Plex_Sans_Thai'] font-medium text-[12px] text-black tracking-[0.06px]">
                  สถานะ
                </th>
              </tr>
            </thead>
            <tbody>
              {activeItems.map((q) => {
                const imageUrl = getProductImage(q.product)
                return (
                  <tr key={q.id} className="border-b border-[#e5e7eb] h-[80px]">
                    {/* Product */}
                    <td className="px-[20px] py-[12px]">
                      <div className="flex gap-[10px] items-center">
                        <div className="size-[52px] shrink-0 bg-white">
                          {imageUrl && (
                            <img alt="" className="size-full object-cover" src={imageUrl} />
                          )}
                        </div>
                        <div className="font-['IBM_Plex_Sans_Thai'] font-medium text-[15px] text-black leading-[1.4]">
                          {q.product ? (
                            <>
                              <p className="m-0">{q.product.name}</p>
                              {q.product.code && <p className="m-0">{q.product.code}</p>}
                            </>
                          ) : (
                            <p className="m-0 text-grey">-</p>
                          )}
                        </div>
                      </div>
                    </td>
                    {/* Variations */}
                    <td className="px-[20px] py-[12px]">
                      <p className="font-['IBM_Plex_Sans_Thai'] font-medium text-[13px] text-black leading-[1.3] m-0">
                        {formatVariations(q)}
                      </p>
                    </td>
                    {/* Date */}
                    <td className="px-[20px] py-[12px]">
                      <p className="font-['IBM_Plex_Sans_Thai'] font-medium text-[15px] text-black leading-[1.5] m-0 whitespace-nowrap">
                        {formatDate(q.created_at)}
                      </p>
                    </td>
                    {/* Status */}
                    <td className="px-[20px] py-[12px]">
                      <StatusBadge status={q.status} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
