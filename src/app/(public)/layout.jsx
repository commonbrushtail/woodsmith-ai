import TopBar from '../../components/TopBar'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import LineFAB from '../../components/LineFAB'
import CookieConsent from '../../components/CookieConsent'
import ErrorBoundary from '../../components/ErrorBoundary'
import DraftModeBanner from '../../components/DraftModeBanner'
import { isPreview } from '@/lib/data/draft'

export default async function PublicLayout({ children }) {
  const preview = await isPreview()

  return (
    <div className="bg-white w-full min-h-screen">
      {preview && <DraftModeBanner />}
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
