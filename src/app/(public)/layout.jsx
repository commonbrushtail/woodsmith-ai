import TopBar from '../../components/TopBar'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import LineFAB from '../../components/LineFAB'
import CookieConsent from '../../components/CookieConsent'

export default function PublicLayout({ children }) {
  return (
    <div className="bg-white w-full min-h-screen">
      <TopBar />
      <Navbar />
      {children}
      <Footer />
      <LineFAB />
      <CookieConsent />
    </div>
  )
}
