import './globals.css'
import TopBar from '../components/TopBar'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import LineFAB from '../components/LineFAB'

export const metadata = {
  title: 'WoodSmith :: วู้ดสมิตร',
  icons: { icon: '/favicon.png' },
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
        <div className="bg-white w-full min-h-screen">
          <TopBar />
          <Navbar />
          {children}
          <Footer />
          <LineFAB />
        </div>
      </body>
    </html>
  )
}
