import { BrowserRouter, Routes, Route } from 'react-router-dom'
import TopBar from './components/TopBar'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import LineFAB from './components/LineFAB'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import BranchPage from './pages/BranchPage'
import BlogPage from './pages/BlogPage'
import BlogPostPage from './pages/BlogPostPage'
import ManualPage from './pages/ManualPage'
import HighlightPage from './pages/HighlightPage'

export default function App() {
  return (
    <BrowserRouter>
      <div className="bg-white w-full min-h-screen">
        <TopBar />
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/branches" element={<BranchPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:id" element={<BlogPostPage />} />
          <Route path="/manual" element={<ManualPage />} />
          <Route path="/highlight" element={<HighlightPage />} />
        </Routes>
        <Footer />
        <LineFAB />
      </div>
    </BrowserRouter>
  )
}
