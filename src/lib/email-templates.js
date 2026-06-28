const BRAND_COLOR = '#ff7e1b'
const TEXT_COLOR = '#35383b'

/**
 * Shared email wrapper with WoodSmith branding.
 */
function emailLayout(bodyHtml) {
  return `<!DOCTYPE html>
<html lang="th">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;font-family:'IBM Plex Sans Thai',Helvetica,Arial,sans-serif;color:${TEXT_COLOR};background:#f8f3ea;">
  <div style="max-width:600px;margin:24px auto;background:#fff;border-radius:8px;overflow:hidden;">
    <div style="background:${BRAND_COLOR};padding:24px;text-align:center;">
      <h1 style="color:#fff;margin:0;font-size:24px;">WoodSmith</h1>
    </div>
    <div style="padding:32px 24px;">
      ${bodyHtml}
    </div>
    <div style="padding:16px 24px;background:#f8f3ea;text-align:center;font-size:12px;color:#bfbfbf;">
      บริษัท วนชัย วู้ดสมิธ จำกัด
    </div>
  </div>
</body>
</html>`
}

/**
 * Admin notification: new quotation submitted.
 */
export function newQuotationNotification({ quotationNumber, requesterName, requesterPhone, productName, message }) {
  const productLine = productName
    ? `<p style="margin:4px 0;"><strong>สินค้า:</strong> ${productName}</p>`
    : ''
  const messageLine = message
    ? `<p style="margin:4px 0;"><strong>ข้อความ:</strong> ${message}</p>`
    : ''

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  return {
    subject: `ใบเสนอราคาใหม่ ${quotationNumber}`,
    html: emailLayout(`
      <h2 style="color:${BRAND_COLOR};margin-top:0;">ใบเสนอราคาใหม่</h2>
      <p>มีลูกค้าส่งคำขอใบเสนอราคาใหม่เข้ามา</p>
      <div style="background:#f8f3ea;padding:16px;border-radius:8px;margin:16px 0;">
        <p style="margin:4px 0;"><strong>เลขที่:</strong> ${quotationNumber}</p>
        <p style="margin:4px 0;"><strong>ชื่อ:</strong> ${requesterName}</p>
        <p style="margin:4px 0;"><strong>เบอร์โทร:</strong> ${requesterPhone}</p>
        ${productLine}
        ${messageLine}
      </div>
      <p>
        <a href="${siteUrl}/admin/quotations"
           style="display:inline-block;background:${BRAND_COLOR};color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;">
          ดูรายละเอียดในระบบ
        </a>
      </p>
    `),
  }
}

/**
 * Customer confirmation: quotation request received.
 */
export function quotationConfirmation({ quotationNumber, requesterName, productName, isRegistered }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const productLine = productName
    ? `<p style="margin:4px 0;"><strong>สินค้า:</strong> ${productName}</p>`
    : ''
  const trackLine = isRegistered
    ? `<p>คุณสามารถติดตามสถานะได้ที่
        <a href="${siteUrl}/account/quotations" style="color:${BRAND_COLOR};">บัญชีของฉัน</a></p>`
    : `<p>เราจะแจ้งความคืบหน้าทางอีเมลนี้ หากคุณสมัครสมาชิกด้วยอีเมลเดียวกัน คำขอนี้จะปรากฏในบัญชีของคุณโดยอัตโนมัติ</p>`

  return {
    subject: `ได้รับคำขอใบเสนอราคาแล้ว ${quotationNumber}`,
    html: emailLayout(`
      <h2 style="color:${BRAND_COLOR};margin-top:0;">ได้รับคำขอใบเสนอราคาแล้ว</h2>
      <p>สวัสดีคุณ ${requesterName},</p>
      <p>เราได้รับคำขอใบเสนอราคาของคุณเรียบร้อยแล้ว ทีมงานจะตรวจสอบและติดต่อกลับโดยเร็วที่สุด</p>
      <div style="background:#f8f3ea;padding:16px;border-radius:8px;margin:16px 0;">
        <p style="margin:4px 0;"><strong>เลขที่:</strong> ${quotationNumber}</p>
        ${productLine}
      </div>
      ${trackLine}
      <p>ขอบคุณที่ใช้บริการ WoodSmith</p>
    `),
  }
}

/**
 * Customer: the admin's quote response (price + message).
 */
export function quotationQuote({ quotationNumber, requesterName, quotedAmount, quoteMessage }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const amountLine =
    quotedAmount !== null && quotedAmount !== undefined && quotedAmount !== ''
      ? `<div style="text-align:center;margin:20px 0;">
           <p style="margin:0;font-size:14px;color:#6b7280;">ราคาที่เสนอ</p>
           <p style="margin:4px 0 0;font-size:32px;font-weight:bold;color:${BRAND_COLOR};">฿${Number(quotedAmount).toLocaleString('th-TH', { minimumFractionDigits: 2 })}</p>
         </div>`
      : ''
  const messageLine = quoteMessage
    ? `<div style="background:#f8f3ea;padding:16px;border-radius:8px;margin:16px 0;white-space:pre-wrap;">${quoteMessage}</div>`
    : ''

  return {
    subject: `ใบเสนอราคา ${quotationNumber}`,
    html: emailLayout(`
      <h2 style="color:${BRAND_COLOR};margin-top:0;">ใบเสนอราคาของคุณ</h2>
      <p>สวัสดีคุณ ${requesterName},</p>
      <p>ทีมงานได้จัดทำใบเสนอราคาสำหรับคำขอเลขที่ <strong>${quotationNumber}</strong> เรียบร้อยแล้ว</p>
      ${amountLine}
      ${messageLine}
      <p>ดูรายละเอียดหรือดำเนินการต่อได้ที่
        <a href="${siteUrl}/account/quotations" style="color:${BRAND_COLOR};">บัญชีของฉัน</a></p>
      <p>ขอบคุณที่ใช้บริการ WoodSmith</p>
    `),
  }
}

/**
 * Customer notification: quotation status changed.
 */
export function quotationStatusNotification({ quotationNumber, requesterName, status }) {
  const statusText = status === 'approved' ? 'อนุมัติแล้ว' : 'ไม่อนุมัติ'
  const statusColor = status === 'approved' ? '#22c55e' : '#ef4444'

  return {
    subject: `อัปเดตสถานะใบเสนอราคา ${quotationNumber}`,
    html: emailLayout(`
      <h2 style="color:${BRAND_COLOR};margin-top:0;">อัปเดตสถานะใบเสนอราคา</h2>
      <p>สวัสดีคุณ ${requesterName},</p>
      <p>ใบเสนอราคาเลขที่ <strong>${quotationNumber}</strong> ของคุณได้รับการอัปเดตสถานะ:</p>
      <div style="text-align:center;margin:24px 0;">
        <span style="display:inline-block;background:${statusColor};color:#fff;padding:8px 24px;border-radius:20px;font-size:18px;font-weight:bold;">
          ${statusText}
        </span>
      </div>
      ${status === 'approved'
        ? '<p>ทีมงานจะติดต่อกลับเพื่อดำเนินการต่อไป</p>'
        : '<p>หากมีข้อสงสัย กรุณาติดต่อเจ้าหน้าที่</p>'
      }
      <p>ขอบคุณที่ใช้บริการ WoodSmith</p>
    `),
  }
}
