import './globals.css'
import Providers from '../components/Providers'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://woodsmith.vercel.app'

export const metadata = {
  title: 'WoodSmith :: วู้ดสมิตร',
  description: 'วัสดุตกแต่งและก่อสร้าง ไม้พื้น ไม้ผนัง ไม้ระแนง — WoodSmith',
  icons: { icon: '/favicon.png' },
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: 'WoodSmith :: วู้ดสมิตร',
    description: 'วัสดุตกแต่งและก่อสร้าง ไม้พื้น ไม้ผนัง ไม้ระแนง — WoodSmith',
    siteName: 'WoodSmith :: วู้ดสมิตร',
    type: 'website',
    locale: 'th_TH',
    images: [
      {
        url: '/og-image.png',
        width: 2048,
        height: 780,
        alt: 'WoodSmith :: วู้ดสมิตร — ศูนย์รวมวัสดุก่อสร้าง และสินค้าสำเร็จรูป',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WoodSmith :: วู้ดสมิตร',
    description: 'วัสดุตกแต่งและก่อสร้าง ไม้พื้น ไม้ผนัง ไม้ระแนง — WoodSmith',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@400;500;600;700&family=IBM+Plex+Sans+Thai+Looped:wght@700&display=swap" rel="stylesheet" />
        <link href="https://fonts.cdnfonts.com/css/circular-std" rel="stylesheet" />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
