import { useState } from 'react'
import imgBanner from '../assets/highlight_banner.png'
import imgFaqIcon1 from '../assets/faq_icon_1.svg'
import imgFaqIcon2 from '../assets/faq_icon_2.svg'
import imgFaqIcon3 from '../assets/faq_icon_3.svg'

const faqIcons = [imgFaqIcon1, imgFaqIcon2, imgFaqIcon3]

const faqData = [
  {
    title: 'กลุ่มสินค้าและบริการ',
    items: [
      {
        icon: 0,
        question: 'มีบริการจัดส่งสินค้าหรือไม่ และมีค่าบริการในการจัดส่งสินค้าอย่างไร?',
        answer:
          'วู้ดสมิตรทุกสาขา มีบริการจัดส่งโดยคิดค่าจัดส่งตามระยะทาง ค่าบริการจัดส่งเริ่มต้นที่ 10 กิโลเมตร 200 บาท (ไม่รวม vat)',
      },
      {
        icon: 1,
        question:
          'ร้านวู้ดสมิตร มีสาขาที่ไหนบ้าง เราจะรู้ได้อย่างไรว่าอยู่ใกล้สาขาไหน?',
        answer:
          'วู้ดสมิตรมีสาขาครอบคลุมทั้งกรุงเทพฯ ภาคตะวันออก ภาคอีสาน และภาคเหนือ สามารถดูรายละเอียดเพิ่มเติมสาขาที่ใกล้ท่านได้ที่ www.woodsmith.co.th/branch ครับ',
      },
      {
        icon: 0,
        question: 'ร้านวู้ดสมิตร มีบริการเก็บเงินปลายทางหรือไม่?',
        answer:
          'ขออภัยครับ วู้ดสมิตรยังไม่มีบริการรับชำระเงินปลายทางครับ',
      },
    ],
  },
  {
    title: 'สินค้ากลุ่มประตู และประตูพร้อมวงกบ',
    items: [
      {
        icon: 0,
        question: 'ประตูทำจากไม้อะไรและมีกี่ขนาด?',
        answer: null,
      },
      {
        icon: 2,
        question:
          'ประตูลูกฟักทำสีสำเร็จภายนอกสามารถนำมาใช้เป็นประตูหน้าบ้านได้หรือไม่?',
        answer: null,
      },
      {
        icon: 0,
        question: 'หน้าบานประตูสามารถนำไปทำสีเพิ่มเติมได้หรือไม่',
        answer: null,
      },
      {
        icon: 2,
        question: 'วู้ดสมิตรมีประตู PVC กับ UPVC จำหน่ายหรือไม่?',
        answer: null,
      },
      {
        icon: 0,
        question:
          'ประตูของวู้ดสมิตรสามารถนำไปใช้ติดตั้งเป็นประตูบานเลื่อนได้ไหม',
        answer: null,
      },
    ],
  },
  {
    title: 'สินค้ากลุ่มไม้พื้น ลามิเนต',
    items: [
      {
        icon: 0,
        question:
          'พื้นลามิเนตของวู้ดสมิตร 1 กล่องบรรจุกี่ตารางเมตร?',
        answer: null,
      },
      {
        icon: 1,
        question: 'วัสดุที่ใช้เลียนแบบผิวของไม้พื้นลามิเนตคืออะไร?',
        answer: null,
      },
      {
        icon: 0,
        question:
          'มีวิธีการคำนวณปริมาณไม้พื้นลามิเนตสำหรับการติดตั้งไม้พื้นลามิเนตตามขนาดพื้นที่ที่ต้องการ?',
        answer: null,
      },
      {
        icon: 2,
        question:
          'ไม้พื้นลามิเนตสามารถนำมาปูทับกระเบื้อง และเนื้อปูน หรือพื้นยิปซั่มได้หรือไม่?',
        answer: null,
      },
      {
        icon: 0,
        question:
          'ไม้พื้นลามิเนตสามารถนำไปปูเป็นลายก้างปลา (Herringbone) ได้หรือไม่?',
        answer: null,
      },
    ],
  },
  {
    title: 'กลุ่มสินค้าวงกบ ไม้ฝา และ ไม้บันได',
    items: [
      {
        icon: 1,
        question:
          'วงกบ WPC และวงกบ PVC ที่ด้านรู้จะมีขนาดความกว้าง x ความยาว เท่าไหร่?',
        answer: null,
      },
      {
        icon: 0,
        question:
          'ไม้บันไดทำจากวัสดุอะไร หรือเป็นไม้จริงหรือไม่?',
        answer: null,
      },
      {
        icon: 2,
        question:
          'ไม้ฝาที่ร้านวู้ดสมิตรมีขั้นตอนการติดตั้งอย่างไร?',
        answer: null,
      },
    ],
  },
  {
    title: 'สินค้ากลุ่มไม้อัด หรือ ไม้บอร์ดปิดผิว',
    items: [
      {
        icon: 0,
        question:
          'ที่วู้ดสมิตรมีไม้อัดขนาดไหนบ้าง และสามารถนำไปทำสีผ่านประเภทใด?',
        answer: null,
      },
      {
        icon: 1,
        question:
          'ไม้อัด UL ของวู้ดสมิตรมีขนาดอะไรบ้าง และมีคุณสมบัติอย่างไร?',
        answer: null,
      },
      {
        icon: 0,
        question:
          'ไม้อัดเคลย (Plywood) มีความหนาขั้นต่ำที่ต้องใช้ ตัวอย่างเช่น ไม้อัด 15 มิลลิเมตร และ 20 มิลลิเมตร',
        answer: null,
      },
    ],
  },
]

function FaqItem({ icon, question, answer, isOpen, onToggle }) {
  return (
    <div className="bg-[#fff6ef] px-[16px] py-[12px]">
      <button
        className="flex items-start gap-[16px] w-full text-left bg-transparent border-none cursor-pointer p-0"
        onClick={onToggle}
      >
        <img
          alt=""
          className="shrink-0 size-[32px]"
          src={faqIcons[icon]}
        />
        <div className="flex-1 min-w-0">
          <p className="font-['IBM_Plex_Sans_Thai'] font-bold text-[16px] text-black leading-[1.3] tracking-[0.08px]">
            {question}
          </p>
          {isOpen && answer && (
            <p className="font-['IBM_Plex_Sans_Thai'] font-medium text-[15px] text-black leading-[1.4] tracking-[0.075px] mt-[10px]">
              {answer}
            </p>
          )}
        </div>
        <span className="shrink-0 size-[36px] flex items-center justify-center select-none">
          {isOpen ? (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect y="7.5" width="18" height="3" rx="1.5" fill="#FF7E1B" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect y="7.5" width="18" height="3" rx="1.5" fill="#FF7E1B" />
              <rect x="7.5" y="0" width="3" height="18" rx="1.5" fill="#FF7E1B" />
            </svg>
          )}
        </span>
      </button>
    </div>
  )
}

function FaqSection({ section, sectionIndex, openItems, onToggle }) {
  return (
    <div
      className={`flex flex-col lg:flex-row gap-[12px] lg:gap-[48px] items-start px-[20px] lg:px-0 w-full ${
        sectionIndex > 0 ? 'border-t-3 border-[#e8e3da] pt-[20px] lg:pt-[32px]' : ''
      }`}
    >
      {/* Section header - mobile: above, desktop: left column */}
      <div className="lg:w-[300px] lg:shrink-0 flex flex-col gap-[16px]">
        <p className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[32px] text-black leading-[1.3] tracking-[0.16px]">
          {section.title}
        </p>
        {/* Category illustration placeholder - desktop only */}
        <div className="hidden lg:block w-[200px] h-[120px] bg-[#e8e3da]" />
      </div>

      {/* FAQ items */}
      <div className="flex flex-col gap-[12px] w-full lg:flex-1">
        {section.items.map((item, itemIndex) => {
          const key = `${sectionIndex}-${itemIndex}`
          return (
            <FaqItem
              key={key}
              icon={item.icon}
              question={item.question}
              answer={item.answer}
              isOpen={openItems.has(key)}
              onToggle={() => onToggle(key)}
            />
          )
        })}
      </div>
    </div>
  )
}

export default function FaqPage() {
  const [openItems, setOpenItems] = useState(new Set(['0-0']))

  const handleToggle = (key) => {
    setOpenItems((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  return (
    <div className="flex flex-col items-center w-full pb-[36px] lg:pb-[60px]">
      {/* Banner */}
      <div className="h-[116px] lg:h-[200px] relative w-full overflow-hidden flex items-center justify-center">
        <img
          alt=""
          className="absolute max-w-none object-cover size-full"
          src={imgBanner}
        />
        <p className="relative font-['IBM_Plex_Sans_Thai'] font-semibold text-[24px] lg:text-[64px] text-white text-center tracking-[0.25px] leading-[1.3]">
          คำถามที่พบบ่อย FAQs
        </p>
      </div>

      {/* FAQ Sections */}
      <div className="flex flex-col gap-[48px] items-start mt-[24px] lg:mt-[48px] w-full max-w-[1212px] mx-auto lg:px-[16px]">
        {faqData.map((section, sectionIndex) => (
          <FaqSection
            key={sectionIndex}
            section={section}
            sectionIndex={sectionIndex}
            openItems={openItems}
            onToggle={handleToggle}
          />
        ))}
      </div>
    </div>
  )
}
