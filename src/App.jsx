import TopBar from './components/TopBar'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import AboutSection from './components/AboutSection'
import BlogSection from './components/BlogSection'
import HighlightSection from './components/HighlightSection'
import ProductsSection from './components/ProductsSection'
import GallerySection from './components/GallerySection'
import Footer from './components/Footer'
import LineFAB from './components/LineFAB'

export default function App() {
  return (
    <div className="bg-white w-full min-h-screen">
      <TopBar />
      <Navbar />
      <HeroSection />
      <AboutSection />
      <BlogSection />
      <HighlightSection />
      <ProductsSection />
      <GallerySection />
      <Footer />
      <LineFAB />
    </div>
  )
}
