import TopBar from '../../components/TopBar'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import LineFAB from '../../components/LineFAB'
import CookieConsent from '../../components/CookieConsent'
import ErrorBoundary from '../../components/ErrorBoundary'

export default function PublicLayout({ children }) {
  return (
    <div className="bg-white w-full min-h-screen">
      <TopBar />
      <Navbar />
      <ErrorBoundary>
        {children}
      </ErrorBoundary>
      <Footer />
      <LineFAB />
      <CookieConsent />
    </div>
  )
}
